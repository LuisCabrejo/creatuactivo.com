#!/usr/bin/env node
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

async function debugPablo() {
  const { data: conversations } = await supabase
    .from('nexus_conversations')
    .select('messages, created_at')
    .eq('fingerprint_id', 'b6239ed5fe47e99878f172236b74881a040059d5fdbdc4ac1c3c9d31e4b4fa3e')
    .order('created_at', { ascending: true });

  conversations.forEach((conv, i) => {
    console.log(`\n📝 Conv #${i+1} - ${new Date(conv.created_at).toLocaleString('es-CO')}`);
    conv.messages.forEach((msg, j) => {
      console.log(`   ${msg.role === 'user' ? '👤' : '🤖'}: ${msg.content.substring(0, 80)}`);
      if (msg.content.toLowerCase().includes('pablo hoyos') || msg.content.toLowerCase().includes('hoyos')) {
        console.log(`      ⚠️ Menciona "Hoyos"`);
      }
    });
  });
}

debugPablo().catch(console.error);
