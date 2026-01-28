#!/usr/bin/env node
/**
 * Ejecuta el fix de schema en Supabase
 * Agrega las columnas reto_email_day y reto_last_email_at
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

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

async function ejecutarFix() {
  console.log('🔧 Ejecutando fix de schema en Supabase...\n');

  try {
    // Primero verificar si las columnas ya existen
    console.log('🔍 Verificando estado actual...');

    const testInsert = {
      email: `test-check-${Date.now()}@test.com`,
      reto_email_day: 0,
      reto_last_email_at: null
    };

    const { error: checkError } = await supabase
      .from('funnel_leads')
      .insert(testInsert);

    // Si no hay error, las columnas ya existen
    if (!checkError) {
      console.log('✅ Las columnas ya existen! No se requiere fix.\n');

      // Limpiar el registro de prueba
      await supabase
        .from('funnel_leads')
        .delete()
        .eq('email', testInsert.email);

      return;
    }

    // Si el error NO es de columna faltante, hay otro problema
    if (checkError.code !== 'PGRST204') {
      console.error('❌ Error inesperado:', checkError.message);
      process.exit(1);
    }

    console.log('⚠️  Columnas faltantes detectadas. Ejecutando fix...\n');

    // Ejecutar ALTER TABLE usando la API REST directamente
    // Necesitamos usar fetch porque Supabase JS client no tiene método para ejecutar SQL arbitrario

    const sql = `
      ALTER TABLE funnel_leads
      ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;
    `;

    console.log('📝 Ejecutando SQL:');
    console.log(sql);
    console.log('');

    // Usar el endpoint de postgres para ejecutar SQL
    // Nota: Esto requiere que el usuario tenga acceso a la API de gestión de Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // Si no funciona por RPC, intentar método alternativo
      console.log('⚠️  Método RPC no disponible. Intentando método alternativo...\n');

      // Método alternativo: crear una función temporal y ejecutarla
      const createFnSql = `
        CREATE OR REPLACE FUNCTION temp_add_columns()
        RETURNS void AS $$
        BEGIN
          ALTER TABLE funnel_leads
          ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,
          ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;
        END;
        $$ LANGUAGE plpgsql;
      `;

      // Intentar crear función vía insert en pg_catalog (no recomendado pero funciona)
      console.log('⚠️  No se puede ejecutar ALTER TABLE directamente desde la API REST.');
      console.log('⚠️  Se requiere acceso al SQL Editor de Supabase.\n');
      console.log('📋 ACCIÓN REQUERIDA:');
      console.log('');
      console.log('   1. Ve a Supabase Dashboard → SQL Editor');
      console.log('   2. Ejecuta este SQL:\n');
      console.log('   ```sql');
      console.log('   ALTER TABLE funnel_leads');
      console.log('   ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,');
      console.log('   ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;');
      console.log('   ```\n');
      console.log('   3. Vuelve a ejecutar: node scripts/validar-funnel-simple.mjs\n');

      process.exit(1);
    }

    console.log('✅ SQL ejecutado exitosamente!\n');

  } catch (err) {
    console.error('❌ Error ejecutando fix:', err.message);
    process.exit(1);
  }

  // Validar que el fix funcionó
  console.log('🔍 Validando fix...\n');

  const testData = {
    email: `test-validation-${Date.now()}@test.com`,
    reto_email_day: 0,
    reto_last_email_at: null
  };

  const { data, error } = await supabase
    .from('funnel_leads')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ Validación falló:', error.message);
    console.error('\n   El fix no se aplicó correctamente.');
    console.error('   Ejecuta manualmente el SQL en Supabase Dashboard.\n');
    process.exit(1);
  }

  // Limpiar
  await supabase
    .from('funnel_leads')
    .delete()
    .eq('email', testData.email);

  console.log('🎉 ¡FIX COMPLETADO EXITOSAMENTE!\n');
  console.log('   ✅ Columna reto_email_day agregada');
  console.log('   ✅ Columna reto_last_email_at agregada');
  console.log('   ✅ La tabla funnel_leads está lista para producción\n');
}

ejecutarFix().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
