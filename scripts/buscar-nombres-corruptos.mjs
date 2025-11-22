#!/usr/bin/env node
/**
 * Buscar registros con nombres corruptos en Supabase
 * - "observación"
 * - "de nuevo"
 * - "elección"
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

async function buscarCorruptos() {
  console.log('🔍 Buscando nombres corruptos en Supabase...\n');

  const nombresCorruptos = ['observación', 'observacion', 'de nuevo', 'elección', 'eleccion'];

  for (const nombre of nombresCorruptos) {
    console.log(`\n🔎 Buscando: "${nombre}"`);
    console.log('─'.repeat(60));

    const { data: prospects, error } = await supabase
      .from('prospects')
      .select('id, fingerprint_id, device_info, created_at')
      .eq('device_info->>name', nombre)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`❌ Error:`, error.message);
      continue;
    }

    if (!prospects || prospects.length === 0) {
      console.log(`✓ No se encontraron registros con nombre "${nombre}"`);
      continue;
    }

    console.log(`⚠️ ENCONTRADOS: ${prospects.length} registro(s) con nombre "${nombre}"\n`);

    prospects.forEach((p, i) => {
      const info = p.device_info || {};
      const timeAgo = Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60));

      console.log(`   ${i + 1}. Hace ${timeAgo} min`);
      console.log(`      Nombre: ${info.name}`);
      console.log(`      WhatsApp: ${info.phone || info.whatsapp || 'NO'}`);
      console.log(`      Fingerprint: ${p.fingerprint_id.substring(0, 35)}...`);
      console.log('');
    });
  }

  console.log('\n═'.repeat(60));
  console.log('✅ Búsqueda completada\n');
}

buscarCorruptos().catch(console.error);
