#!/usr/bin/env node
// Script para verificar si los datos del usuario de prueba están guardados

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
const testSessionId = '8c4b5756-d46e-4f09-9cb7-a6f5f7c9fcd9';

console.log('🔍 Verificando datos del usuario de prueba...\n');
console.log(`Fingerprint: ${testFingerprint.substring(0, 30)}...`);
console.log(`Session ID: ${testSessionId}\n`);

try {
  // 1. Verificar tabla prospects por session_id
  console.log('━'.repeat(80));
  console.log('📋 Buscando en tabla PROSPECTS por session_id...');
  console.log('━'.repeat(80));

  const { data: prospectBySession, error: prospectError1 } = await supabase
    .from('prospects')
    .select('*')
    .eq('session_id', testSessionId)
    .single();

  if (prospectError1) {
    console.log(`❌ Error o no encontrado: ${prospectError1.message}`);
  } else if (prospectBySession) {
    console.log('✅ DATOS ENCONTRADOS en prospects:');
    console.log(JSON.stringify(prospectBySession, null, 2));
  }

  // 2. Verificar tabla nexus_conversations por fingerprint_id
  console.log('\n' + '━'.repeat(80));
  console.log('💬 Buscando en tabla NEXUS_CONVERSATIONS por fingerprint_id...');
  console.log('━'.repeat(80));

  const { data: conversations, error: convError } = await supabase
    .from('nexus_conversations')
    .select('*')
    .eq('fingerprint_id', testFingerprint)
    .order('created_at', { ascending: false })
    .limit(3);

  if (convError) {
    console.log(`❌ Error: ${convError.message}`);
  } else if (conversations && conversations.length > 0) {
    console.log(`✅ ${conversations.length} conversaciones encontradas:`);
    conversations.forEach((conv, i) => {
      console.log(`\n${i + 1}. ID: ${conv.id}`);
      console.log(`   Creado: ${conv.created_at}`);
      console.log(`   Mensajes: ${conv.messages?.length || 0}`);
      console.log(`   Fingerprint: ${conv.fingerprint_id?.substring(0, 30)}...`);

      // Ver primer y último mensaje
      if (conv.messages && conv.messages.length > 0) {
        console.log(`   Primer mensaje: "${conv.messages[0]?.content?.substring(0, 80)}..."`);
        if (conv.messages.length > 1) {
          console.log(`   Último mensaje: "${conv.messages[conv.messages.length - 1]?.content?.substring(0, 80)}..."`);
        }
      }
    });
  } else {
    console.log('⚠️ No se encontraron conversaciones');
  }

  // 3. Verificar si existe prospect_data en nexus_conversations
  console.log('\n' + '━'.repeat(80));
  console.log('🎯 Verificando PROSPECT_DATA en conversaciones...');
  console.log('━'.repeat(80));

  const { data: convWithData, error: dataError } = await supabase
    .from('nexus_conversations')
    .select('prospect_data, created_at')
    .eq('fingerprint_id', testFingerprint)
    .not('prospect_data', 'is', null)
    .order('created_at', { ascending: false })
    .limit(5);

  if (dataError) {
    console.log(`❌ Error: ${dataError.message}`);
  } else if (convWithData && convWithData.length > 0) {
    console.log(`✅ ${convWithData.length} conversaciones con prospect_data:`);
    convWithData.forEach((conv, i) => {
      console.log(`\n${i + 1}. ${conv.created_at}`);
      console.log(`   prospect_data:`, JSON.stringify(conv.prospect_data, null, 2));
    });
  } else {
    console.log('⚠️ No se encontró prospect_data en conversaciones');
  }

  // 4. Resumen final
  console.log('\n' + '━'.repeat(80));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('━'.repeat(80));
  console.log(`Tabla prospects: ${prospectBySession ? '✅ Datos encontrados' : '❌ Sin datos'}`);
  console.log(`Tabla nexus_conversations: ${conversations && conversations.length > 0 ? `✅ ${conversations.length} conversaciones` : '❌ Sin conversaciones'}`);
  console.log(`Prospect_data en conversaciones: ${convWithData && convWithData.length > 0 ? `✅ ${convWithData.length} registros` : '❌ Sin datos'}`);
  console.log('━'.repeat(80));

  if (prospectBySession) {
    console.log('\n✅ CONCLUSIÓN: Los datos SÍ están guardados en la DB');
    console.log('   Nombre:', prospectBySession.name || '(no capturado)');
    console.log('   Email:', prospectBySession.email || '(no capturado)');
    console.log('   Teléfono:', prospectBySession.phone || '(no capturado)');
    console.log('   Arquetipo:', prospectBySession.archetype || '(no capturado)');
  } else if (convWithData && convWithData.length > 0) {
    console.log('\n✅ CONCLUSIÓN: Datos guardados en prospect_data (nexus_conversations)');
    const latestData = convWithData[0].prospect_data;
    console.log('   Nombre:', latestData?.name || '(no capturado)');
    console.log('   Email:', latestData?.email || '(no capturado)');
    console.log('   WhatsApp:', latestData?.whatsapp || '(no capturado)');
    console.log('   Arquetipo:', latestData?.archetype || '(no capturado)');
  } else {
    console.log('\n⚠️ CONCLUSIÓN: NO se encontraron datos del usuario de prueba');
    console.log('   Posible causa: Los datos no se guardaron durante la conversación');
  }

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
