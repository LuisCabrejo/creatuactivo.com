#!/usr/bin/env node

/**
 * Script para obtener los IDs reales de los arsenales en Supabase
 * Fecha: 20 Noviembre 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local manualmente
const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) {
        supabaseUrl = value.trim();
      }
      if (key.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !supabaseKey) {
        supabaseKey = value.trim();
      }
    }
  }
} catch (error) {
  console.warn('⚠️  No se pudo leer .env.local, usando variables de entorno');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function obtenerIDs() {
  console.log('🔍 Obteniendo IDs reales de arsenales en Supabase...\n');

  const categorias = ['arsenal_inicial', 'arsenal_manejo', 'arsenal_cierre'];

  for (const categoria of categorias) {
    const { data, error } = await supabase
      .from('nexus_documents')
      .select('id, category, title')
      .eq('category', categoria)
      .single();

    if (error) {
      console.error(`❌ Error al consultar ${categoria}:`, error.message);
      continue;
    }

    if (!data) {
      console.log(`❌ No se encontró documento con category: ${categoria}`);
      continue;
    }

    console.log(`✅ ${categoria}:`);
    console.log(`   ID: ${data.id}`);
    console.log(`   Title: ${data.title}`);
    console.log('');
  }
}

obtenerIDs().catch(console.error);
