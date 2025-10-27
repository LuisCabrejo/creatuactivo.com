#!/usr/bin/env node
// Script para verificar estructura de nexus_prospects y datos del usuario de prueba

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

console.log('🔍 Verificando estructura de nexus_prospects...\n');

try {
  // 1. Ver estructura de la tabla
  const { data: columns, error: colError } = await supabase.rpc('exec_sql', {
    query: `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'nexus_prospects'
      ORDER BY ordinal_position;
    `
  });

  if (colError) {
    console.log('⚠️ No se pudo obtener estructura via RPC, intentando query directo...');

    // Alternativa: Hacer SELECT * con LIMIT 0 para ver columnas
    const { data: sample, error: sampleError } = await supabase
      .from('nexus_prospects')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ Error:', sampleError);
    } else {
      console.log('✅ Estructura de nexus_prospects (columnas detectadas):');
      console.log('━'.repeat(80));
      if (sample && sample.length > 0) {
        Object.keys(sample[0]).forEach(col => {
          console.log(`  - ${col}`);
        });
      } else {
        console.log('⚠️ Tabla vacía, intentando con information_schema...');
      }
    }
  } else {
    console.log('✅ Estructura de nexus_prospects:');
    console.log('━'.repeat(80));
    columns.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
  }

  console.log('\n' + '━'.repeat(80));

  // 2. Buscar datos del usuario de prueba
  const testFingerprint = '6d764599fbc745f07b99a7026be6b426dc5b28560f3f9f4fa28fa3bf8de7c28f';

  console.log('\n🔍 Buscando datos del usuario de prueba...');
  console.log(`Fingerprint: ${testFingerprint.substring(0, 20)}...`);

  // Intentar con diferentes posibles nombres de columna
  const possibleFingerprintColumns = ['fingerprint', 'fingerprint_id', 'device_fingerprint'];

  for (const colName of possibleFingerprintColumns) {
    try {
      const query = { [colName]: testFingerprint };
      const { data: prospect, error: prospectError } = await supabase
        .from('nexus_prospects')
        .select('*')
        .match(query)
        .single();

      if (!prospectError && prospect) {
        console.log(`\n✅ DATOS ENCONTRADOS (columna: ${colName}):`);
        console.log('━'.repeat(80));
        console.log(JSON.stringify(prospect, null, 2));
        break;
      }
    } catch (err) {
      // Continuar intentando
    }
  }

  // 3. Ver todos los registros recientes para debug
  console.log('\n📋 Últimos 5 registros en nexus_prospects:');
  console.log('━'.repeat(80));

  const { data: recentProspects, error: recentError } = await supabase
    .from('nexus_prospects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentError) {
    console.error('❌ Error:', recentError);
  } else {
    recentProspects.forEach((p, i) => {
      console.log(`\n${i + 1}. ID: ${p.id}`);
      console.log(`   Creado: ${p.created_at}`);
      Object.keys(p).forEach(key => {
        if (!['id', 'created_at'].includes(key)) {
          console.log(`   ${key}: ${JSON.stringify(p[key])}`);
        }
      });
    });
  }

  console.log('\n' + '━'.repeat(80));
  console.log('✅ Verificación completada');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
