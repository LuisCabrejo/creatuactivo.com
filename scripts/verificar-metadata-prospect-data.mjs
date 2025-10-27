#!/usr/bin/env node
// Script para verificar si prospect_data está en metadata de nexus_conversations

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

const testFingerprint = '6d764599fbc745f07b99a7026be6b426dc5b28560f3f9f4fa28fa3bf8de7c28f';

console.log('🔍 Verificando prospect_data en metadata...\n');
console.log(`Fingerprint: ${testFingerprint.substring(0, 30)}...\n`);

try {
  // 1. Buscar conversaciones del usuario de prueba
  const { data: conversations, error: convError } = await supabase
    .from('nexus_conversations')
    .select('id, metadata, created_at')
    .eq('fingerprint_id', testFingerprint)
    .order('created_at', { ascending: false });

  if (convError) {
    console.error('❌ Error:', convError);
    process.exit(1);
  }

  console.log('━'.repeat(80));
  console.log(`✅ ${conversations.length} conversaciones encontradas`);
  console.log('━'.repeat(80));

  let foundProspectData = false;
  let latestProspectData = null;

  conversations.forEach((conv, i) => {
    console.log(`\n${i + 1}. ID: ${conv.id}`);
    console.log(`   Creado: ${conv.created_at}`);
    console.log(`   Metadata:`, JSON.stringify(conv.metadata, null, 2));

    if (conv.metadata?.prospect_data) {
      foundProspectData = true;
      if (!latestProspectData) {
        latestProspectData = conv.metadata.prospect_data;
      }
      console.log(`   ✅ prospect_data encontrado:`);
      console.log(`      - Nombre: ${conv.metadata.prospect_data.name || '(no)'}`);
      console.log(`      - Email: ${conv.metadata.prospect_data.email || '(no)'}`);
      console.log(`      - WhatsApp: ${conv.metadata.prospect_data.whatsapp || '(no)'}`);
      console.log(`      - Arquetipo: ${conv.metadata.prospect_data.archetype || '(no)'}`);
      console.log(`      - Consentimiento: ${conv.metadata.prospect_data.data_consent_given ? 'SÍ' : 'NO'}`);
    }
  });

  console.log('\n' + '━'.repeat(80));
  console.log('📊 RESUMEN FINAL');
  console.log('━'.repeat(80));

  if (foundProspectData && latestProspectData) {
    console.log('✅ DATOS SÍ ESTÁN GUARDADOS en metadata.prospect_data');
    console.log('\n📋 Último registro de datos:');
    console.log(`   - Nombre: ${latestProspectData.name || '❌ NO capturado'}`);
    console.log(`   - Email: ${latestProspectData.email || '❌ NO capturado'}`);
    console.log(`   - WhatsApp: ${latestProspectData.whatsapp || '❌ NO capturado'}`);
    console.log(`   - Arquetipo: ${latestProspectData.archetype || '❌ NO capturado'}`);
    console.log(`   - Consentimiento: ${latestProspectData.data_consent_given ? '✅ SÍ' : '❌ NO'}`);

    console.log('\n💡 PROBLEMA IDENTIFICADO:');
    console.log('   El código actual NO carga estos datos al iniciar sesión.');
    console.log('   NEXUS no sabe que el usuario ya dio su nombre/consentimiento.');
    console.log('   Por eso vuelve a preguntar cuando el usuario regresa.');

  } else {
    console.log('❌ NO se encontró prospect_data en ninguna conversación');
    console.log('\n   Posibles causas:');
    console.log('   1. El usuario NO proporcionó nombre/email durante la conversación');
    console.log('   2. La función update_prospect_data no se ejecutó correctamente');
    console.log('   3. Los datos se guardaron en otra tabla (prospects)');
  }

  // 2. Verificar también tabla prospects
  console.log('\n' + '━'.repeat(80));
  console.log('🔍 Verificando tabla PROSPECTS por fingerprint_id...');
  console.log('━'.repeat(80));

  const { data: prospect, error: prospectError } = await supabase
    .from('prospects')
    .select('*')
    .eq('fingerprint_id', testFingerprint)
    .order('created_at', { ascending: false })
    .limit(1);

  if (prospectError) {
    console.log(`❌ Error: ${prospectError.message}`);
  } else if (prospect && prospect.length > 0) {
    console.log('✅ Prospect encontrado en tabla prospects:');
    console.log(JSON.stringify(prospect[0], null, 2));

    if (prospect[0].device_info) {
      console.log('\n📋 Datos en device_info:');
      console.log(`   - Nombre: ${prospect[0].device_info.name || '❌ NO'}`);
      console.log(`   - Email: ${prospect[0].device_info.email || '❌ NO'}`);
      console.log(`   - WhatsApp: ${prospect[0].device_info.whatsapp || '❌ NO'}`);
      console.log(`   - Arquetipo: ${prospect[0].device_info.archetype || '❌ NO'}`);
      console.log(`   - Consentimiento: ${prospect[0].device_info.data_consent_given ? '✅ SÍ' : '❌ NO'}`);
    }
  } else {
    console.log('⚠️ No se encontró registro en tabla prospects');
  }

  console.log('\n' + '━'.repeat(80));

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
