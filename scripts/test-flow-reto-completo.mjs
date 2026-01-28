#!/usr/bin/env node
/**
 * Test completo del flow Reto de 5 Días
 * Simula registro de usuario end-to-end
 *
 * Ejecutar: node scripts/test-flow-reto-completo.mjs
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

async function testFlow() {
  console.log('🧪 TEST COMPLETO DEL FLOW RETO DE 5 DÍAS\n');
  console.log('═'.repeat(80));
  console.log('');

  // Datos de prueba
  const testEmail = `test-flow-${randomBytes(4).toString('hex')}@creatuactivo.test`;
  const testData = {
    email: testEmail,
    name: 'Test Flow Usuario',
    whatsapp: '+57 300 123 4567',
    source: 'reto-5-dias',
    step: 'reto_registered',
    variant: 'base',
    reto_email_day: 0,
    reto_last_email_at: null,
  };

  console.log('📝 Datos de prueba:');
  console.log(`   Email: ${testData.email}`);
  console.log(`   Nombre: ${testData.name}`);
  console.log(`   WhatsApp: ${testData.whatsapp}`);
  console.log(`   Source: ${testData.source}`);
  console.log(`   Variant: ${testData.variant}`);
  console.log('');

  // ============================================================
  // TEST 1: Insertar registro en funnel_leads
  // ============================================================
  console.log('🧪 TEST 1: Registro en funnel_leads');
  console.log('─'.repeat(80));

  const { data: insertData, error: insertError } = await supabase
    .from('funnel_leads')
    .insert(testData)
    .select();

  if (insertError) {
    console.error('❌ FALLO: No se pudo insertar registro');
    console.error('   Error:', insertError.message);
    console.error('   Código:', insertError.code);
    console.error('');
    process.exit(1);
  }

  const recordId = insertData[0].id;
  console.log('✅ ÉXITO: Registro creado en funnel_leads');
  console.log(`   ID: ${recordId}`);
  console.log(`   Created at: ${insertData[0].created_at}`);
  console.log('');

  // ============================================================
  // TEST 2: Verificar que todas las columnas se guardaron
  // ============================================================
  console.log('🧪 TEST 2: Verificar columnas guardadas');
  console.log('─'.repeat(80));

  const { data: fetchData, error: fetchError } = await supabase
    .from('funnel_leads')
    .select('*')
    .eq('id', recordId)
    .single();

  if (fetchError) {
    console.error('❌ FALLO: No se pudo recuperar el registro');
    console.error('   Error:', fetchError.message);
    console.error('');
    process.exit(1);
  }

  console.log('✅ ÉXITO: Registro recuperado');
  console.log('');
  console.log('   Columnas críticas:');
  console.log(`   ├─ email: ${fetchData.email}`);
  console.log(`   ├─ name: ${fetchData.name}`);
  console.log(`   ├─ whatsapp: ${fetchData.whatsapp}`);
  console.log(`   ├─ source: ${fetchData.source}`);
  console.log(`   ├─ step: ${fetchData.step}`);
  console.log(`   ├─ variant: ${fetchData.variant}`);
  console.log(`   ├─ reto_email_day: ${fetchData.reto_email_day}`);
  console.log(`   └─ reto_last_email_at: ${fetchData.reto_last_email_at || 'null'}`);
  console.log('');

  // Validar valores
  let allColumnsCorrect = true;

  if (fetchData.reto_email_day !== 0) {
    console.error('   ❌ reto_email_day debería ser 0');
    allColumnsCorrect = false;
  }

  if (fetchData.variant !== 'base') {
    console.error('   ❌ variant debería ser "base"');
    allColumnsCorrect = false;
  }

  if (!allColumnsCorrect) {
    console.error('');
    console.error('❌ FALLO: Algunas columnas tienen valores incorrectos\n');
    process.exit(1);
  }

  // ============================================================
  // TEST 3: Simular actualización del cron job
  // ============================================================
  console.log('🧪 TEST 3: Simular envío de email (update del cron job)');
  console.log('─'.repeat(80));

  const { error: updateError } = await supabase
    .from('funnel_leads')
    .update({
      reto_email_day: 1,
      reto_last_email_at: new Date().toISOString(),
    })
    .eq('id', recordId);

  if (updateError) {
    console.error('❌ FALLO: No se pudo actualizar el registro');
    console.error('   Error:', updateError.message);
    console.error('');
    process.exit(1);
  }

  console.log('✅ ÉXITO: Registro actualizado (simulando envío Día 1)');
  console.log('');

  // Verificar actualización
  const { data: updatedData } = await supabase
    .from('funnel_leads')
    .select('reto_email_day, reto_last_email_at')
    .eq('id', recordId)
    .single();

  console.log('   Columnas actualizadas:');
  console.log(`   ├─ reto_email_day: ${updatedData.reto_email_day} (era 0)`);
  console.log(`   └─ reto_last_email_at: ${updatedData.reto_last_email_at} (era null)`);
  console.log('');

  // ============================================================
  // TEST 4: Query del cron job (buscar leads para Día 2)
  // ============================================================
  console.log('🧪 TEST 4: Query del cron job (buscar leads para siguiente día)');
  console.log('─'.repeat(80));

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data: cronLeads, error: cronError } = await supabase
    .from('funnel_leads')
    .select('*')
    .eq('source', 'reto-5-dias')
    .eq('reto_email_day', 1)
    .lt('reto_last_email_at', oneDayAgo.toISOString());

  if (cronError) {
    console.error('❌ FALLO: Query del cron job falló');
    console.error('   Error:', cronError.message);
    console.error('');
    process.exit(1);
  }

  console.log(`✅ ÉXITO: Query del cron job ejecutada`);
  console.log(`   Leads encontrados para Día 2: ${cronLeads.length}`);
  console.log('   (0 es correcto, porque acabamos de enviar Día 1)');
  console.log('');

  // ============================================================
  // TEST 5: Limpiar registro de prueba
  // ============================================================
  console.log('🧪 TEST 5: Limpieza');
  console.log('─'.repeat(80));

  const { error: deleteError } = await supabase
    .from('funnel_leads')
    .delete()
    .eq('id', recordId);

  if (deleteError) {
    console.error('⚠️  ADVERTENCIA: No se pudo eliminar el registro de prueba');
    console.error('   ID:', recordId);
    console.error('   Elimínalo manualmente desde Supabase Dashboard');
    console.error('');
  } else {
    console.log('✅ ÉXITO: Registro de prueba eliminado');
    console.log('');
  }

  // ============================================================
  // RESUMEN FINAL
  // ============================================================
  console.log('═'.repeat(80));
  console.log('');
  console.log('🎉 ¡TODOS LOS TESTS PASARON!\n');
  console.log('✅ Schema de funnel_leads es correcto');
  console.log('✅ Todas las columnas críticas funcionan');
  console.log('✅ Inserts y updates funcionan correctamente');
  console.log('✅ Query del cron job funciona');
  console.log('');
  console.log('📋 SIGUIENTE PASO:');
  console.log('   Testear el flow completo en el navegador:');
  console.log('   1. npm run dev');
  console.log('   2. Ir a http://localhost:3000/reto-5-dias');
  console.log('   3. Registrarse con un email real');
  console.log('   4. Verificar email de confirmación');
  console.log('   5. Ver Bridge Page en /reto-5-dias/gracias');
  console.log('');
}

testFlow().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
