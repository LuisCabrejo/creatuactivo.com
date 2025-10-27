#!/usr/bin/env node
// Script para ver estructura completa de tablas relevantes

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["]|["]$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔍 Verificando estructura de tablas...\n');

const tables = ['nexus_conversations', 'prospects', 'nexus_prospects'];

for (const tableName of tables) {
  try {
    console.log('━'.repeat(80));
    console.log(`📋 Tabla: ${tableName.toUpperCase()}`);
    console.log('━'.repeat(80));

    // Obtener un registro de ejemplo para ver estructura
    const { data: sample, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log(`❌ Error: ${sampleError.message}\n`);
      continue;
    }

    if (!sample || sample.length === 0) {
      console.log(`⚠️ Tabla vacía - no se pueden ver columnas\n`);
      continue;
    }

    const columns = Object.keys(sample[0]);
    console.log(`✅ Columnas encontradas (${columns.length}):\n`);

    columns.forEach(col => {
      const value = sample[0][col];
      const type = typeof value;
      const preview = JSON.stringify(value)?.substring(0, 60);
      console.log(`  - ${col} (${type})`);
      if (value !== null && value !== undefined) {
        console.log(`    Ejemplo: ${preview}...`);
      }
    });

    console.log();

  } catch (err) {
    console.error(`❌ Error procesando ${tableName}:`, err.message);
    console.log();
  }
}

// Caso especial: Ver cómo se está guardando la data en el código actual
console.log('━'.repeat(80));
console.log('📖 Revisando código actual de /api/nexus...');
console.log('━'.repeat(80));

try {
  const routeFile = readFileSync(
    resolve(__dirname, '../src/app/api/nexus/route.ts'),
    'utf-8'
  );

  // Buscar líneas donde se guarda en nexus_conversations
  const insertMatches = routeFile.match(/\.from\('nexus_conversations'\)[\s\S]{0,300}\.insert\(/g);

  if (insertMatches) {
    console.log('✅ Encontradas llamadas .insert() a nexus_conversations:\n');
    insertMatches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.substring(0, 200)}...`);
      console.log();
    });
  } else {
    console.log('⚠️ No se encontraron llamadas .insert() en el código\n');
  }

  // Buscar uso de update_prospect_data RPC
  const rpcMatches = routeFile.match(/update_prospect_data[\s\S]{0,300}/g);

  if (rpcMatches) {
    console.log('✅ Encontradas llamadas a update_prospect_data RPC:\n');
    rpcMatches.forEach((match, i) => {
      console.log(`${i + 1}. ${match.substring(0, 200)}...`);
      console.log();
    });
  } else {
    console.log('⚠️ No se encontraron llamadas a update_prospect_data\n');
  }

} catch (err) {
  console.error('❌ Error leyendo archivo route.ts:', err.message);
}

console.log('━'.repeat(80));
console.log('✅ Verificación completada');

