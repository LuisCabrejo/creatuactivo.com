#!/usr/bin/env node
/**
 * Debug script to check Rafael Guzmán's conversation history
 *
 * Goal: Find out what message was processed that captured "observación"
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

async function debugRafael() {
  console.log('🔍 Buscando conversación de Rafael Guzmán (WhatsApp: 3213457902)...\n');

  // 1. Find prospect by WhatsApp
  const { data: prospect, error: prospectError } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, device_info, created_at')
    .eq('device_info->>phone', '3213457902')
    .single();

  if (prospectError) {
    console.error('❌ Error buscando prospect:', prospectError);
    return;
  }

  if (!prospect) {
    console.log('❌ Prospect no encontrado con WhatsApp 3213457902');
    return;
  }

  console.log('✅ Prospect encontrado:');
  console.log(`   Fingerprint: ${prospect.fingerprint_id.substring(0, 30)}...`);
  console.log(`   Created: ${new Date(prospect.created_at).toLocaleString('es-CO')}`);
  console.log(`   Name in device_info: ${prospect.device_info?.name || 'NO CAPTURADO'}\n`);

  // 2. Get conversation history
  const { data: conversations, error: convError } = await supabase
    .from('nexus_conversations')
    .select('id, messages, created_at')
    .eq('fingerprint_id', prospect.fingerprint_id)
    .order('created_at', { ascending: true });

  if (convError) {
    console.error('❌ Error consultando conversaciones:', convError);
    return;
  }

  if (!conversations || conversations.length === 0) {
    console.log('⚠️ No hay conversaciones guardadas para este prospect\n');
    return;
  }

  console.log(`📊 Conversaciones encontradas: ${conversations.length}\n`);
  console.log('═'.repeat(80));

  conversations.forEach((conv, index) => {
    console.log(`\n🔵 Conversación #${index + 1} - ${new Date(conv.created_at).toLocaleString('es-CO')}`);
    console.log('─'.repeat(80));

    if (!conv.messages || conv.messages.length === 0) {
      console.log('⚠️ Sin mensajes');
      return;
    }

    conv.messages.forEach((msg, msgIndex) => {
      const role = msg.role === 'user' ? '👤 USER' : '🤖 NEXUS';
      const content = msg.content.substring(0, 150);
      const truncated = msg.content.length > 150 ? '...' : '';

      console.log(`\n${role} [${msgIndex + 1}/${conv.messages.length}]:`);
      console.log(`   "${content}${truncated}"`);

      // Detect if name was mentioned
      if (msg.content.toLowerCase().includes('rafael')) {
        console.log('   🎯 ← Menciona "Rafael"');
      }
      if (msg.content.toLowerCase().includes('observación') || msg.content.toLowerCase().includes('observacion')) {
        console.log('   ⚠️ ← Menciona "observación"');
      }
    });
  });

  console.log('\n═'.repeat(80));
  console.log('\n✅ Debug completado\n');
}

debugRafael().catch(console.error);
