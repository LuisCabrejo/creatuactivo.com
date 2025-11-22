#!/usr/bin/env node
/**
 * Verificar por qué los registros recientes no tienen datos capturados
 *
 * Hipótesis:
 * 1. Son page visits sin interacción (usuario solo abrió la página)
 * 2. captureProspectData() retorna objeto vacío
 * 3. Fingerprint no se pasa correctamente
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^[\\"']|[\\"']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function verificarVacios() {
  console.log('🔍 Analizando registros vacíos recientes...\\n');

  // Get last 15 prospects
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, device_info, created_at')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📊 Analizando últimos 15 prospects:\\n');
  console.log('═'.repeat(80));

  for (let i = 0; i < prospects.length; i++) {
    const p = prospects[i];
    const info = p.device_info || {};
    const timeAgo = Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60));

    const hasData = !!(info.name || info.phone || info.whatsapp || info.email || info.occupation);
    const icon = hasData ? '✅' : '❌';

    console.log(`\\n${icon} Prospect #${i + 1} - Hace ${timeAgo} min`);
    console.log(`   Fingerprint: ${p.fingerprint_id.substring(0, 30)}...`);
    console.log(`   Datos: ${hasData ? 'SÍ' : 'NO'}`);

    if (hasData) {
      console.log(`   Name: ${info.name || 'N/A'}`);
      console.log(`   Phone: ${info.phone || info.whatsapp || 'N/A'}`);
      console.log(`   Occupation: ${info.occupation || 'N/A'}`);
    }

    // Check if has conversations
    const { data: conversations, error: convError } = await supabase
      .from('nexus_conversations')
      .select('id, messages, created_at')
      .eq('fingerprint_id', p.fingerprint_id);

    if (convError) {
      console.error(`   ⚠️ Error consultando conversaciones:`, convError.message);
    } else if (!conversations || conversations.length === 0) {
      console.log(`   💬 Conversaciones: 0 - Solo visitó la página, no usó NEXUS`);
    } else {
      const totalMessages = conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0);
      console.log(`   💬 Conversaciones: ${conversations.length} (${totalMessages} mensajes)`);

      // If has conversations but no data, that's a bug
      if (!hasData && conversations.length > 0) {
        console.log(`   🐛 BUG POTENCIAL: Tiene conversaciones pero NO datos capturados`);
      }
    }
  }

  console.log('\\n═'.repeat(80));

  // Summary
  const withData = prospects.filter(p => !!(p.device_info?.name || p.device_info?.phone || p.device_info?.whatsapp));
  const withoutData = prospects.length - withData.length;

  console.log('\\n📊 RESUMEN:');
  console.log(`   Total prospects: ${prospects.length}`);
  console.log(`   Con datos: ${withData.length}`);
  console.log(`   Sin datos: ${withoutData}`);
  console.log(`   % con datos: ${Math.round((withData.length / prospects.length) * 100)}%\\n`);
}

verificarVacios().catch(console.error);
