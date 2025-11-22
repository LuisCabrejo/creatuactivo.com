#!/usr/bin/env node
/**
 * Script para fix CRÍTICO: Evitar pedir consentimiento múltiples veces
 *
 * Problema: NEXUS pide consentimiento repetidamente incluso cuando usuario ya lo dio
 * Solución: Actualizar System Prompt para verificar userData.consent_granted
 *
 * Fecha: 21 Nov 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno desde .env.local
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSystemPrompt() {
  console.log('🔧 Aplicando fix de consentimiento persistente al System Prompt...\n');

  // 1. Leer el prompt actual
  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error leyendo system prompt:', readError);
    process.exit(1);
  }

  console.log('📖 Prompt actual encontrado:');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt.length} caracteres\n`);

  // 2. Buscar y reemplazar la sección de CONSENTIMIENTO
  let updatedPrompt = currentPrompt.prompt;

  // Buscar la sección "CUÁNDO SOLICITAR"
  const oldConsentLogic = `### CUÁNDO SOLICITAR:
**SOLO** cuando el usuario proporcione datos personales por primera vez (nombre, email, WhatsApp, etc.).`;

  const newConsentLogic = `### CUÁNDO SOLICITAR:

⚠️ **CRÍTICO - VERIFICAR PRIMERO:**
El sistema backend te informa si el usuario YA dio consentimiento previamente mediante:
- \`userData.consent_granted\` (desde base de datos)
- Mensaje explícito: "El usuario YA dio consentimiento previamente: ✅ SÍ"

**REGLAS ABSOLUTAS:**
1. ✅ **SI userData.consent_granted = true:** NUNCA pidas consentimiento nuevamente
2. ✅ **SI ves mensaje "✅ YA OTORGADO":** NUNCA pidas consentimiento nuevamente
3. ✅ **SI ves instrucción "NO vuelvas a pedir consentimiento":** NUNCA lo pidas
4. ❌ **SOLO pide consentimiento si:** Primera interacción Y usuario NO tiene consentimiento previo Y proporciona datos personales

**Verificación antes de pedir consentimiento:**
\`\`\`
¿userData.consent_granted = true? → NO PEDIR
¿Veo "YA OTORGADO" en el contexto? → NO PEDIR
¿Es usuario conocido con saludo personalizado? → NO PEDIR
¿Primera interacción sin consentimiento previo? → SÍ PEDIR
\`\`\``;

  if (!updatedPrompt.includes(oldConsentLogic)) {
    console.error('❌ Error: No se encontró la sección de consentimiento esperada');
    console.log('\n🔍 Buscando alternativas...');

    // Buscar solo "CUÁNDO SOLICITAR:"
    if (updatedPrompt.includes('### CUÁNDO SOLICITAR:')) {
      console.log('✅ Encontrada sección alternativa\n');

      // Reemplazar todo el bloque hasta el siguiente ###
      const regex = /(### CUÁNDO SOLICITAR:[\s\S]*?)(?=### TEXTO EXACTO)/;
      updatedPrompt = updatedPrompt.replace(regex, newConsentLogic + '\n\n');
    } else {
      console.error('❌ No se pudo encontrar la sección CUÁNDO SOLICITAR');
      process.exit(1);
    }
  } else {
    updatedPrompt = updatedPrompt.replace(oldConsentLogic, newConsentLogic);
  }

  // 3. Actualizar también la sección de REGLAS CRÍTICAS DEL CONSENTIMIENTO
  const oldCriticalRules = `### 🚨 REGLAS CRÍTICAS DEL CONSENTIMIENTO:

1. **Una sola vez por usuario:** Si ya se solicitó consentimiento en sesión anterior, NO volver a pedirlo
2. **Antes de cualquier dato:** El consentimiento debe preceder la captura de nombre, email, etc.
3. **Texto exacto:** NUNCA improvisar el texto del consentimiento. Usar SIEMPRE el texto de arriba
4. **Sin presión:** El "No, gracias" debe ser una opción válida y respetable`;

  const newCriticalRules = `### 🚨 REGLAS CRÍTICAS DEL CONSENTIMIENTO:

1. **Una sola vez por usuario:** Si userData.consent_granted = true, NUNCA volver a pedirlo (ni en nuevas sesiones, ni después de limpiar pizarra)
2. **Verificar contexto SIEMPRE:** Lee las instrucciones dinámicas del backend (líneas que dicen "YA dio consentimiento" o "NO vuelvas a pedir")
3. **Antes de cualquier dato:** El consentimiento debe preceder la captura de nombre, email, etc. (solo primera vez)
4. **Texto exacto:** NUNCA improvisar el texto del consentimiento. Usar SIEMPRE el texto de arriba
5. **Sin presión:** El "No, gracias" debe ser una opción válida y respetable
6. **Usuario conocido = NO PEDIR:** Si hay saludo personalizado ("¡Hola de nuevo, [NOMBRE]!"), NO pedir consentimiento`;

  updatedPrompt = updatedPrompt.replace(oldCriticalRules, newCriticalRules);

  // 4. Incrementar versión
  const newVersion = 'v12.2.1_consent_fix';

  // 5. Actualizar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando system prompt:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente\n');
  console.log('📊 Cambios aplicados:');
  console.log('   ✓ Sección "CUÁNDO SOLICITAR" expandida con verificaciones');
  console.log('   ✓ Reglas críticas actualizadas (6 reglas vs 4 anteriores)');
  console.log('   ✓ Verificación explícita de userData.consent_granted');
  console.log('   ✓ Verificación de mensajes del backend ("YA OTORGADO")');
  console.log(`   ✓ Nueva versión: ${newVersion}\n`);

  console.log('📝 Cambio de versión:');
  console.log(`   Anterior: ${currentPrompt.version}`);
  console.log(`   Nueva:    ${newVersion}\n`);

  console.log('⏰ Nota: El caché de Anthropic puede tardar hasta 5 minutos en actualizarse');
  console.log('🧪 Testing recomendado:');
  console.log('   1. Modo incógnito → Dar consentimiento');
  console.log('   2. Hacer preguntas → Limpiar pizarra');
  console.log('   3. Verificar que NO vuelve a pedir consentimiento');
  console.log('   4. Verificar saludo personalizado si dio nombre\n');
}

updateSystemPrompt().catch(console.error);
