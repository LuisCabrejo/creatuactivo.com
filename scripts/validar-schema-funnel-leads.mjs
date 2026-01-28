#!/usr/bin/env node
/**
 * Valida que la tabla funnel_leads tenga todas las columnas necesarias
 * para el Reto de 5 Días
 *
 * Ejecutar: node scripts/validar-schema-funnel-leads.mjs
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
  console.error('   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Columnas requeridas para el Reto de 5 Días
const REQUIRED_COLUMNS = [
  { name: 'id', type: 'uuid', nullable: false, comment: 'Primary key' },
  { name: 'email', type: 'text', nullable: false, comment: 'Email del prospecto' },
  { name: 'name', type: 'text', nullable: true, comment: 'Nombre completo' },
  { name: 'whatsapp', type: 'text', nullable: true, comment: 'Número de WhatsApp' },
  { name: 'source', type: 'text', nullable: true, comment: 'Origen del lead (ej: reto-5-dias)' },
  { name: 'step', type: 'text', nullable: true, comment: 'Paso del funnel (ej: reto_registered)' },
  { name: 'variant', type: 'text', nullable: true, comment: 'Variante A/B (ej: A_dolor)' },
  { name: 'reto_email_day', type: 'integer', nullable: true, comment: '⚠️ CRÍTICO: Último día enviado del reto' },
  { name: 'reto_last_email_at', type: 'timestamp with time zone', nullable: true, comment: '⚠️ CRÍTICO: Fecha último email' },
  { name: 'created_at', type: 'timestamp with time zone', nullable: false, comment: 'Fecha de creación' },
  { name: 'updated_at', type: 'timestamp with time zone', nullable: false, comment: 'Fecha de última actualización' },
];

async function validarSchema() {
  console.log('🔍 Validando schema de tabla funnel_leads...\n');

  // Verificar que la tabla existe
  const { data: tables, error: tablesError } = await supabase
    .from('funnel_leads')
    .select('id')
    .limit(1);

  if (tablesError) {
    if (tablesError.code === '42P01') {
      console.error('❌ ERROR CRÍTICO: La tabla funnel_leads NO EXISTE\n');
      console.error('   Necesitas crear la tabla primero. Ver: supabase/APPLY_MANUALLY.sql\n');
      process.exit(1);
    } else {
      console.error('❌ Error consultando tabla:', tablesError.message);
      process.exit(1);
    }
  }

  console.log('✅ Tabla funnel_leads existe\n');

  // Obtener columnas actuales
  const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
    table_name: 'funnel_leads'
  });

  // Si el RPC no existe, usar query directo
  let currentColumns;
  if (columnsError) {
    console.log('⚠️  RPC get_table_columns no disponible, consultando directamente...\n');

    // Query alternativo usando information_schema
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'funnel_leads'
      ORDER BY ordinal_position;
    `;

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      currentColumns = result;
    } catch (err) {
      console.error('❌ No se pudo obtener schema de la tabla');
      console.error('   Ir manualmente a Supabase SQL Editor y ejecutar:\n');
      console.error(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'funnel_leads'
      ORDER BY ordinal_position;
      `);
      console.error('\n   Error:', err.message);
      process.exit(1);
    }
  } else {
    currentColumns = columns;
  }

  // Validar columnas
  console.log('📋 Columnas encontradas:');
  console.log('─'.repeat(80));

  const columnMap = new Map();
  if (Array.isArray(currentColumns)) {
    currentColumns.forEach(col => {
      const name = col.column_name || col.name;
      const type = col.data_type || col.type;
      const nullable = col.is_nullable === 'YES' || col.nullable;

      columnMap.set(name, { type, nullable });
      console.log(`   ${name.padEnd(25)} ${type.padEnd(30)} ${nullable ? 'NULL' : 'NOT NULL'}`);
    });
  }

  console.log('─'.repeat(80));
  console.log('\n');

  // Verificar columnas requeridas
  let allGood = true;
  const missing = [];
  const typeMismatch = [];

  console.log('🔎 Validando columnas requeridas:\n');

  REQUIRED_COLUMNS.forEach(req => {
    const current = columnMap.get(req.name);

    if (!current) {
      console.log(`   ❌ FALTA: ${req.name} (${req.type}) - ${req.comment}`);
      missing.push(req);
      allGood = false;
    } else {
      // Normalizar tipos para comparación
      const normalizedCurrentType = current.type.toLowerCase().replace(/ /g, '');
      const normalizedReqType = req.type.toLowerCase().replace(/ /g, '');

      const typeMatch =
        normalizedCurrentType.includes(normalizedReqType) ||
        normalizedReqType.includes(normalizedCurrentType) ||
        (normalizedReqType === 'timestampwithtimezone' && normalizedCurrentType === 'timestamptz');

      if (typeMatch) {
        console.log(`   ✅ ${req.name.padEnd(25)} ${req.comment}`);
      } else {
        console.log(`   ⚠️  ${req.name.padEnd(25)} Tipo esperado: ${req.type}, encontrado: ${current.type}`);
        typeMismatch.push({ ...req, foundType: current.type });
        // No marcamos como error crítico si es solo diferencia de notación
      }
    }
  });

  console.log('\n');

  // Resumen
  if (allGood && typeMismatch.length === 0) {
    console.log('🎉 ¡SCHEMA VÁLIDO! Todas las columnas están presentes y correctas.\n');
    console.log('   ✅ La tabla funnel_leads está lista para producción.');
    console.log('   ✅ El cron job de emails del Reto de 5 Días funcionará correctamente.\n');
    return;
  }

  // Si hay problemas
  console.log('⚠️  PROBLEMAS ENCONTRADOS:\n');

  if (missing.length > 0) {
    console.log('❌ COLUMNAS FALTANTES (CRÍTICO):\n');
    console.log('   Ejecuta el siguiente SQL en Supabase SQL Editor:\n');
    console.log('   ```sql');
    console.log('   ALTER TABLE funnel_leads');
    missing.forEach((col, i) => {
      const comma = i < missing.length - 1 ? ',' : ';';
      const defaultValue = col.name === 'reto_email_day' ? ' DEFAULT 0' : '';
      const notNull = !col.nullable ? ' NOT NULL' : '';
      console.log(`   ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}${defaultValue}${notNull}${comma}`);
    });
    console.log('   ```\n');
  }

  if (typeMismatch.length > 0) {
    console.log('⚠️  TIPOS DE DATOS DIFERENTES (revisar):\n');
    typeMismatch.forEach(col => {
      console.log(`   ${col.name}: esperado ${col.type}, encontrado ${col.foundType}`);
    });
    console.log('\n   Nota: Algunas diferencias son solo notación (ej: timestamptz vs timestamp with time zone)');
    console.log('   Revisa manualmente si afectan la funcionalidad.\n');
  }

  if (missing.length > 0) {
    console.log('🚨 ACCIÓN REQUERIDA:');
    console.log('   1. Copia el SQL de arriba');
    console.log('   2. Pégalo en Supabase Dashboard → SQL Editor');
    console.log('   3. Ejecuta el query');
    console.log('   4. Vuelve a correr este script para verificar\n');
    process.exit(1);
  }
}

validarSchema().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
