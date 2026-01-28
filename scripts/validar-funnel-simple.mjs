#!/usr/bin/env node
/**
 * Validación simple de funnel_leads
 * Inserta un registro de prueba para verificar que todas las columnas existen
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomBytes } from 'crypto';

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

async function validar() {
  console.log('🔍 Validando funnel_leads con insert de prueba...\n');

  const testEmail = `test-${randomBytes(4).toString('hex')}@creatuactivo.test`;

  // Intentar insertar con todas las columnas críticas
  const testData = {
    email: testEmail,
    name: 'Test Validation',
    whatsapp: '+57 300 000 0000',
    source: 'reto-5-dias',
    step: 'reto_registered',
    variant: 'test',
    reto_email_day: 0,
    reto_last_email_at: null,
  };

  console.log('📝 Insertando registro de prueba...');
  console.log('   Email:', testEmail);
  console.log('   Validando columnas:', Object.keys(testData).join(', '));
  console.log('');

  const { data, error } = await supabase
    .from('funnel_leads')
    .insert(testData)
    .select();

  if (error) {
    console.error('❌ ERROR al insertar:\n');
    console.error('   Código:', error.code);
    console.error('   Mensaje:', error.message);
    console.error('   Detalles:', error.details);
    console.error('');

    if (error.code === '42703') {
      console.error('🚨 COLUMNA FALTANTE DETECTADA\n');
      console.error('   Una o más columnas no existen en la tabla funnel_leads.');
      console.error('   Necesitas ejecutar el siguiente SQL en Supabase:\n');
      console.error('   ```sql');
      console.error('   ALTER TABLE funnel_leads');
      console.error('   ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,');
      console.error('   ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;');
      console.error('   ```\n');
    }

    process.exit(1);
  }

  console.log('✅ Insert exitoso! Registro creado:', data[0].id);
  console.log('');

  // Limpiar registro de prueba
  console.log('🧹 Limpiando registro de prueba...');
  const { error: deleteError } = await supabase
    .from('funnel_leads')
    .delete()
    .eq('email', testEmail);

  if (deleteError) {
    console.warn('⚠️  No se pudo eliminar registro de prueba:', deleteError.message);
  } else {
    console.log('✅ Registro de prueba eliminado');
  }

  console.log('');
  console.log('🎉 VALIDACIÓN EXITOSA!\n');
  console.log('   ✅ Todas las columnas críticas existen');
  console.log('   ✅ reto_email_day (INTEGER)');
  console.log('   ✅ reto_last_email_at (TIMESTAMPTZ)');
  console.log('   ✅ La tabla está lista para el Reto de 5 Días\n');
}

validar().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
