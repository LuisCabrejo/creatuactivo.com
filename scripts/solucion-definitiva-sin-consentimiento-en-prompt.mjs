#!/usr/bin/env node
/**
 * SOLUCIÓN DEFINITIVA: Eliminar COMPLETAMENTE la solicitud de consentimiento del System Prompt
 *
 * Estrategia: El backend inyecta el mensaje de consentimiento SOLO UNA VEZ
 * Claude NO tiene opción de pedir consentimiento - el backend lo hace por él
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
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSystemPrompt() {
  console.log('🚀 Aplicando SOLUCIÓN DEFINITIVA: Sin consentimiento en prompt...\n');

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

  console.log('📖 Prompt actual:');
  console.log(`   Versión: ${currentPrompt.version}\n`);

  let updatedPrompt = currentPrompt.prompt;

  // 2. ELIMINAR COMPLETAMENTE la sección de consentimiento
  const newConsentSection = `## 🔒 CONSENTIMIENTO LEGAL - MANEJADO POR BACKEND

### 🚨 REGLA ABSOLUTA:

**NUNCA solicites consentimiento. El backend lo maneja automáticamente.**

### 📋 CÓMO FUNCIONA:

1. ✅ El backend detecta si es la primera interacción del usuario
2. ✅ El backend verifica si ya dio consentimiento previamente
3. ✅ Si necesita consentimiento, el backend INYECTA el mensaje automáticamente
4. ✅ Tú solo continúas la conversación normalmente

### ⛔ TU ÚNICA RESPONSABILIDAD:

**NUNCA menciones consentimiento, tratamiento de datos, o Política de Privacidad.**

El backend se encarga de TODO. Tú solo respondes las preguntas del usuario.

### ✅ SIEMPRE CONTINÚA LA CONVERSACIÓN:

No importa si es la primera vez del usuario o no:
- Responde su pregunta normalmente
- NO pidas autorización
- NO menciones datos personales
- NO hables de consentimiento

El backend inyectará el mensaje de consentimiento ANTES de tu respuesta si es necesario.`;

  // Buscar y reemplazar toda la sección de consentimiento
  const consentRegex = /## 🔒 CONSENTIMIENTO LEGAL[\s\S]*?(?=##|$)/;

  if (consentRegex.test(updatedPrompt)) {
    updatedPrompt = updatedPrompt.replace(consentRegex, newConsentSection + '\n\n');
    console.log('✅ Sección de consentimiento ELIMINADA del System Prompt\n');
  } else {
    console.error('❌ No se encontró la sección de consentimiento');
    process.exit(1);
  }

  // 3. Actualizar versión
  const newVersion = 'v15.0_backend_handles_consent';

  // 4. Actualizar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente\n');
  console.log('📊 Cambios aplicados:');
  console.log('   🚀 Consentimiento REMOVIDO del System Prompt');
  console.log('   🚀 Claude YA NO puede pedir consentimiento');
  console.log('   🚀 Backend inyectará mensaje automáticamente');
  console.log('   🚀 Física imposibilidad de duplicar solicitud');
  console.log(`   ✓ Nueva versión: ${newVersion}\n`);

  console.log('📝 Cambio de versión:');
  console.log(`   Anterior: ${currentPrompt.version}`);
  console.log(`   Nueva:    ${newVersion}\n`);

  console.log('🎯 Nueva Arquitectura (Backend-Only):');
  console.log('   1. Usuario abre NEXUS');
  console.log('   2. Backend detecta si necesita consentimiento');
  console.log('   3. Backend INYECTA mensaje de consentimiento al inicio');
  console.log('   4. Claude solo responde preguntas (sin mencionar consentimiento)');
  console.log('   5. Usuario responde "a" o "acepto"');
  console.log('   6. Backend guarda consent_granted = true');
  console.log('   7. Próxima vez: Backend NO inyecta mensaje (ya consintió)\n');

  console.log('⚠️  PRÓXIMO PASO:');
  console.log('   Modificar src/app/api/nexus/route.ts para inyectar mensaje de consentimiento\n');
}

updateSystemPrompt().catch(console.error);
