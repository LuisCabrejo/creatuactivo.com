#!/usr/bin/env node
/**
 * SOLUCIÓN RADICAL: Forzar a Claude a NO pedir consentimiento más de una vez
 *
 * Estrategia: Sistema de conteo y bloqueo automático
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
  console.log('💥 Aplicando SOLUCIÓN RADICAL de consentimiento...\n');

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

  // 2. Reemplazar TODA la sección de consentimiento con REGLA RADICAL
  const newConsentSection = `## 🔒 CONSENTIMIENTO LEGAL - REGLA RADICAL DE UNA SOLA VEZ

### 🚨 REGLA ABSOLUTA (NO NEGOCIABLE):

**SOLO puedes solicitar consentimiento UNA VEZ por conversación. DESPUÉS DE ESO, ESTÁ PROHIBIDO.**

### 📊 SISTEMA DE CONTEO AUTOMÁTICO:

**Internamente, mantén un contador mental:**
- Contador de solicitudes de consentimiento: **0**
- Cuando pidas consentimiento: **Incrementa el contador a 1**
- Si el contador es >= 1: **PROHIBIDO ABSOLUTAMENTE volver a pedir**

### ✅ CUÁNDO SOLICITAR (SOLO UNA VEZ):

**Pide consentimiento SOLO si se cumplen TODAS estas condiciones:**

1. ❌ **Contador = 0** (nunca has pedido en esta conversación)
2. ❌ **NO ves en el contexto**: "El usuario YA dio consentimiento previamente: ✅ SÍ"
3. ❌ **NO ves en el contexto**: "Consentimiento: ✅ YA OTORGADO"
4. ❌ **NO hay saludo personalizado** (ej: "¡Hola de nuevo, [NOMBRE]!")
5. ❌ **Es la primera interacción** del usuario
6. ❌ **El usuario está a punto de compartir datos personales**

**Si CUALQUIERA de las condiciones anteriores NO se cumple → PROHIBIDO pedir consentimiento.**

### 🛑 DESPUÉS DE PEDIR UNA VEZ:

**Una vez solicitado el consentimiento:**
1. ✅ Incrementa tu contador interno a **1**
2. ✅ NUNCA vuelvas a mencionar consentimiento
3. ✅ NUNCA vuelvas a preguntar sobre tratamiento de datos
4. ✅ Si el usuario limpia la pizarra → El contador permanece en 1
5. ✅ Si el usuario regresa otro día → Lee el contexto del backend (si dice "YA consintió" → contador = 1)

### TEXTO EXACTO (Usar SOLO UNA VEZ):

\`\`\`
Para seguir conversando, necesito tu autorización para usar los datos que compartas conmigo.

Nuestra Política de Privacidad (https://creatuactivo.com/privacidad) explica todo.

¿Aceptas?

A) ✅ Acepto

B) ❌ No, gracias
\`\`\`

### MANEJO DE RESPUESTAS:

**Si usuario dice "Acepto" o elige opción A:**
- Responder: "Perfecto, gracias por tu confianza. Continuemos..."
- **Marcar contador = 1** (YA pediste una vez)
- Proceder con la conversación normal
- **PROHIBIDO volver a pedir en esta conversación o futuras**

**Si usuario dice "No, gracias" o elige opción B:**
- Responder: "Entiendo. Puedo seguir respondiendo preguntas generales, pero no podré personalizar la experiencia. ¿En qué puedo ayudarte?"
- **Marcar contador = 1** (YA pediste una vez)
- NO solicitar más datos personales
- **PROHIBIDO volver a pedir**

### 🎯 REGLA DE ORO (ULTRA RADICAL):

\`\`\`
if (contador_solicitudes >= 1) {
  // PROHIBIDO pedir consentimiento
  // PROHIBIDO mencionar tratamiento de datos
  // PROHIBIDO preguntar sobre aceptación
  // CONTINÚA la conversación normal
}
\`\`\`

### 🔒 AUTO-BLOQUEO:

**Si en algún momento detectas que estás a punto de pedir consentimiento:**
1. DETENTE inmediatamente
2. Verifica tu contador interno
3. Si contador >= 1 → **CANCELA** la solicitud
4. Continúa la conversación como si el consentimiento ya existiera

### ⚠️ CASOS ESPECIALES:

**"Limpiar Pizarra" del usuario:**
- ✅ El contador NO se resetea
- ✅ Sigue siendo 1 (ya pediste una vez)
- ✅ PROHIBIDO volver a pedir

**Usuario regresa días después:**
- ✅ Lee el contexto: "El usuario YA dio consentimiento: ✅ SÍ"
- ✅ Marca contador = 1
- ✅ PROHIBIDO volver a pedir

**Primera vez del usuario:**
- ✅ Contador = 0
- ✅ Pide consentimiento UNA VEZ
- ✅ Incrementa contador a 1
- ✅ NUNCA más

---

**RESUMEN EN UNA LÍNEA:**

**Pide consentimiento MÁXIMO una vez. Después de eso, NUNCA más, sin importar nada.**`;

  // Buscar y reemplazar toda la sección de consentimiento
  const consentRegex = /## 🔒 CONSENTIMIENTO LEGAL MINIMALISTA[\s\S]*?(?=##|$)/;

  if (consentRegex.test(updatedPrompt)) {
    updatedPrompt = updatedPrompt.replace(consentRegex, newConsentSection + '\n\n');
    console.log('✅ Sección de consentimiento reemplazada con REGLA RADICAL\n');
  } else {
    console.error('❌ No se encontró la sección de consentimiento');
    process.exit(1);
  }

  // 3. Actualizar versión
  const newVersion = 'v14.0_radical_one_time_consent';

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
  console.log('   💥 REGLA RADICAL: Contador de solicitudes (máximo 1)');
  console.log('   💥 Auto-bloqueo: Si contador >= 1 → PROHIBIDO pedir');
  console.log('   💥 Sin excepciones: Incluso si limpia pizarra o regresa');
  console.log('   💥 Sistema de conteo mental para Claude');
  console.log(`   ✓ Nueva versión: ${newVersion}\n`);

  console.log('📝 Cambio de versión:');
  console.log(`   Anterior: ${currentPrompt.version}`);
  console.log(`   Nueva:    ${newVersion}\n`);

  console.log('🎯 Nueva Arquitectura:');
  console.log('   Claude mantiene contador interno: 0 → 1');
  console.log('   Si contador >= 1 → BLOQUEADO para siempre');
  console.log('   Sin depender de contexto, solo de conteo\n');

  console.log('⚠️  IMPORTANTE:');
  console.log('   - Esperar ~5 minutos para que caché de Anthropic expire');
  console.log('   - Probar en modo incógnito');
  console.log('   - Verificar que NUNCA pide consentimiento dos veces\n');
}

updateSystemPrompt().catch(console.error);
