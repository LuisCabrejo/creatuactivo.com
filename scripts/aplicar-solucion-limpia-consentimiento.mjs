#!/usr/bin/env node
/**
 * Script para aplicar SOLUCIÓN LIMPIA de consentimiento
 *
 * Enfoque: Backend-driven, sin complejidad en frontend
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
  console.log('🧹 Aplicando SOLUCIÓN LIMPIA de consentimiento...\n');

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

  // 2. Reemplazar TODA la sección de consentimiento con versión ULTRA SIMPLE
  const newConsentSection = `## 🔒 CONSENTIMIENTO LEGAL MINIMALISTA (Ley 1581/2012 - Colombia)

### 🚨 REGLA CRÍTICA DE COMPLIANCE:
**NUNCA captures datos personales SIN consentimiento previo, expreso e informado.**

### ⚠️ CUÁNDO SOLICITAR CONSENTIMIENTO:

**VERIFICACIÓN AUTOMÁTICA (Backend hace esto por ti):**
- El backend detecta automáticamente si el usuario acepta ("a", "acepto", "si", etc.)
- El backend guarda \`consent_granted = true\` en la base de datos
- El backend te informa mediante el contexto dinámico si ya consintió

**TU ÚNICA RESPONSABILIDAD:**

1. ✅ **SI ves en el contexto: "El usuario YA dio consentimiento previamente: ✅ SÍ"**
   → NUNCA vuelvas a pedir consentimiento

2. ✅ **SI ves en el contexto: "Consentimiento: ✅ YA OTORGADO"**
   → NUNCA vuelvas a pedir consentimiento

3. ✅ **SI hay saludo personalizado ("¡Hola de nuevo, [NOMBRE]!")**
   → El usuario ya consintió, NO pedir consentimiento

4. ❌ **SOLO pide consentimiento si:**
   - Primera interacción del usuario
   - NO hay mensaje de "YA dio consentimiento"
   - El usuario está a punto de compartir datos personales

### TEXTO EXACTO (Usar SIEMPRE este texto):

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
- El backend guardará automáticamente el consentimiento
- Proceder con la conversación normal

**Si usuario dice "No, gracias" o elige opción B:**
- Responder: "Entiendo. Puedo seguir respondiendo preguntas generales, pero no podré personalizar la experiencia. ¿En qué puedo ayudarte?"
- NO solicitar más datos personales
- Mantener conversación general sin captura de datos

### 🎯 REGLA DE ORO (Ultra Simple):

**Lee el contexto dinámico del backend. Si dice "YA consintió" → NO pidas consentimiento.**

Fin de la responsabilidad. El backend maneja todo lo demás.`;

  // Buscar y reemplazar toda la sección de consentimiento
  const consentRegex = /## 🔒 CONSENTIMIENTO LEGAL MINIMALISTA[\s\S]*?(?=##|$)/;

  if (consentRegex.test(updatedPrompt)) {
    updatedPrompt = updatedPrompt.replace(consentRegex, newConsentSection + '\n\n');
    console.log('✅ Sección de consentimiento reemplazada\n');
  } else {
    console.error('❌ No se encontró la sección de consentimiento');
    process.exit(1);
  }

  // 3. Actualizar versión
  const newVersion = 'v13.0_clean_consent';

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
  console.log('   ✓ Sección de consentimiento ultra simplificada');
  console.log('   ✓ Responsabilidad: Backend detecta, Claude solo lee contexto');
  console.log('   ✓ Regla de oro: "Lee contexto, si dice YA consintió → NO pedir"');
  console.log(`   ✓ Nueva versión: ${newVersion}\n`);

  console.log('📝 Cambio de versión:');
  console.log(`   Anterior: ${currentPrompt.version}`);
  console.log(`   Nueva:    ${newVersion}\n`);

  console.log('🎯 Arquitectura Nueva:');
  console.log('   Frontend: Solo envía mensajes (sin lógica de consentimiento)');
  console.log('   Backend:  Detecta "acepto" automáticamente y guarda en BD');
  console.log('   Claude:   Solo lee si backend dice "YA consintió"\n');
}

updateSystemPrompt().catch(console.error);
