#!/usr/bin/env node
/**
 * Diagnóstico completo de funnel_leads
 * Muestra qué columnas existen y cuáles faltan
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REQUIRED_COLUMNS = [
  'email',
  'name',
  'whatsapp',
  'source',
  'step',
  'variant',
  'reto_email_day',
  'reto_last_email_at',
];

async function diagnosticar() {
  console.log('🔍 Diagnosticando tabla funnel_leads...\n');

  // Intentar insertar un registro mínimo para ver qué columnas acepta
  const existingColumns = [];
  const missingColumns = [];

  for (const column of REQUIRED_COLUMNS) {
    const testData = {
      email: `test-${column}-${Date.now()}@test.com`,
      [column]: column === 'reto_email_day' ? 0 : null,
    };

    const { error } = await supabase
      .from('funnel_leads')
      .insert(testData);

    if (!error || error.code !== 'PGRST204') {
      existingColumns.push(column);

      // Limpiar
      await supabase
        .from('funnel_leads')
        .delete()
        .eq('email', testData.email);
    } else {
      missingColumns.push(column);
    }
  }

  console.log('✅ COLUMNAS EXISTENTES:');
  existingColumns.forEach(col => {
    console.log(`   ✓ ${col}`);
  });
  console.log('');

  if (missingColumns.length > 0) {
    console.log('❌ COLUMNAS FALTANTES:');
    missingColumns.forEach(col => {
      console.log(`   ✗ ${col}`);
    });
    console.log('');

    console.log('📋 SQL PARA AGREGAR COLUMNAS FALTANTES:\n');
    console.log('```sql');
    console.log('ALTER TABLE funnel_leads');

    missingColumns.forEach((col, i) => {
      const comma = i < missingColumns.length - 1 ? ',' : ';';
      const defaultValue = col === 'reto_email_day' ? ' DEFAULT 0' : '';
      const type = col === 'reto_email_day' ? 'INTEGER' :
                   col === 'reto_last_email_at' ? 'TIMESTAMPTZ' :
                   'TEXT';

      console.log(`ADD COLUMN IF NOT EXISTS ${col} ${type}${defaultValue}${comma}`);
    });

    console.log('```\n');
  } else {
    console.log('🎉 ¡TODAS LAS COLUMNAS EXISTEN!\n');
    console.log('   ✅ La tabla está lista para el Reto de 5 Días\n');
  }
}

diagnosticar().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
