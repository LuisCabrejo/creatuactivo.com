#!/usr/bin/env node
/**
 * Verificar datos de Pablo Hoyos en Supabase
 * WhatsApp: 3124678904
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

async function verificarPablo() {
  console.log('🔍 Buscando datos de Pablo Hoyos (WhatsApp: 3124678904)...\n');

  // Buscar por WhatsApp
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, device_info, created_at')
    .or('device_info->>phone.eq.3124678904,device_info->>whatsapp.eq.3124678904');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!prospects || prospects.length === 0) {
    console.log('❌ No se encontró prospect con WhatsApp 3124678904\n');
    console.log('Buscando por nombre "Pablo"...\n');

    const { data: byName, error: nameError } = await supabase
      .from('prospects')
      .select('id, fingerprint_id, device_info, created_at')
      .ilike('device_info->>name', '%pablo%')
      .order('created_at', { ascending: false })
      .limit(5);

    if (nameError) {
      console.error('❌ Error:', nameError);
      return;
    }

    if (!byName || byName.length === 0) {
      console.log('❌ Tampoco se encontró por nombre "Pablo"\n');
      return;
    }

    console.log(`📊 Encontrados ${byName.length} prospects con "Pablo" en el nombre:\n`);
    byName.forEach((p, i) => {
      const info = p.device_info || {};
      console.log(`${i + 1}. ${info.name || 'SIN NOMBRE'}`);
      console.log(`   WhatsApp: ${info.phone || info.whatsapp || 'NO'}`);
      console.log(`   Email: ${info.email || 'NO'}`);
      console.log(`   Occupation: ${info.occupation || 'NO'}`);
      console.log(`   Archetype: ${info.archetype || 'NO'}`);
      console.log(`   Package: ${info.package || 'NO'}`);
      console.log(`   Fingerprint: ${p.fingerprint_id.substring(0, 30)}...`);
      console.log(`   Created: ${new Date(p.created_at).toLocaleString('es-CO')}\n`);
    });
    return;
  }

  console.log(`✅ Encontrado: ${prospects.length} prospect(s) con WhatsApp 3124678904\n`);

  for (const p of prospects) {
    const info = p.device_info || {};
    console.log('═'.repeat(80));
    console.log('📋 DATOS GUARDADOS EN SUPABASE:');
    console.log('═'.repeat(80));
    console.log(`Nombre: ${info.name || '❌ NO CAPTURADO'}`);
    console.log(`WhatsApp: ${info.phone || info.whatsapp || '❌ NO CAPTURADO'}`);
    console.log(`Email: ${info.email || '❌ NO CAPTURADO'}`);
    console.log(`Ocupación: ${info.occupation || '❌ NO CAPTURADO'}`);
    console.log(`Arquetipo: ${info.archetype || '❌ NO CAPTURADO'}`);
    console.log(`Paquete: ${info.package || '❌ NO CAPTURADO'}`);
    console.log(`Consentimiento: ${info.consent_granted ? '✅ SÍ' : '❌ NO'}`);
    console.log(`Fingerprint: ${p.fingerprint_id.substring(0, 40)}...`);
    console.log(`Creado: ${new Date(p.created_at).toLocaleString('es-CO')}\n`);

    // Buscar conversaciones
    const { data: conversations, error: convError } = await supabase
      .from('nexus_conversations')
      .select('id, messages, created_at')
      .eq('fingerprint_id', p.fingerprint_id)
      .order('created_at', { ascending: true });

    if (convError) {
      console.error('❌ Error buscando conversaciones:', convError);
    } else if (!conversations || conversations.length === 0) {
      console.log('⚠️ NO hay conversaciones guardadas\n');
    } else {
      console.log(`💬 Conversaciones: ${conversations.length}\n`);

      conversations.forEach((conv, i) => {
        console.log(`📝 Conversación #${i + 1} - ${new Date(conv.created_at).toLocaleString('es-CO')}`);
        if (conv.messages && conv.messages.length > 0) {
          conv.messages.forEach((msg, j) => {
            const role = msg.role === 'user' ? '👤 USER' : '🤖 NEXUS';
            const preview = msg.content.substring(0, 80);
            console.log(`   ${role}: "${preview}${msg.content.length > 80 ? '...' : ''}"`);
          });
        }
        console.log('');
      });
    }
  }

  console.log('═'.repeat(80));
  console.log('✅ Verificación completada\n');
}

verificarPablo().catch(console.error);
