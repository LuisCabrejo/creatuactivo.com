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
        const value = match[2].trim().replace(/^[\"']|[\"']$/g, '');
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

async function verificarRafael() {
  console.log('🔍 Verificando datos de Rafael Guzmán en Supabase...\n');
  
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, device_info, created_at')
    .order('created_at', { ascending: false })
    .limit(15);
  
  if (error) {
    console.error('❌ Error consultando Supabase:', error);
    return;
  }
  
  console.log(`📊 Últimos ${prospects.length} registros (ordenados por fecha):\n`);
  
  let rafaelFound = false;
  
  prospects.forEach((p, i) => {
    const info = p.device_info || {};
    const created = new Date(p.created_at);
    const timeAgo = Math.floor((Date.now() - created.getTime()) / (1000 * 60));
    
    // Marcar si es Rafael
    const isRafael = info.phone === '3213457902' || 
                     info.whatsapp === '3213457902' ||
                     (info.name && info.name.toLowerCase().includes('rafael'));
    
    if (isRafael) rafaelFound = true;
    
    console.log(`${isRafael ? '🎯' : '  '} ${i + 1}. Hace ${timeAgo} minutos`);
    console.log(`   Nombre: ${info.name || '❌ No capturado'}`);
    console.log(`   WhatsApp: ${info.phone || info.whatsapp || '❌ No capturado'}`);
    console.log(`   Ocupación: ${info.occupation || '❌ No capturado'}`);
    console.log(`   Fingerprint: ${p.fingerprint_id?.substring(0, 25)}...`);
    console.log('');
  });
  
  if (rafaelFound) {
    console.log('\n✅ RAFAEL GUZMÁN ENCONTRADO - Datos guardados correctamente');
    console.log('   Hotfix de Supabase: FUNCIONANDO ✅\n');
  } else {
    console.log('\n❌ RAFAEL GUZMÁN NO ENCONTRADO');
    console.log('   Posibles causas:');
    console.log('   1. Deploy aún no completó (17 min puede no ser suficiente)');
    console.log('   2. Caché de Vercel/Cloudflare');
    console.log('   3. Bug de Supabase undefined aún activo\n');
  }
}

verificarRafael().catch(console.error);
