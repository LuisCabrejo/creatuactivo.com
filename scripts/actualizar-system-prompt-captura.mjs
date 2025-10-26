#!/usr/bin/env node
// Script para actualizar System Prompt de NEXUS con regla de captura de datos

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente desde .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔧 Actualizando System Prompt con REGLA DE CAPTURA DE DATOS...\n');

// Leer System Prompt actual
const { data: currentPrompt, error: readError } = await supabase
  .from('system_prompts')
  .select('prompt')
  .eq('name', 'nexus_main')
  .single();

if (readError || !currentPrompt) {
  console.error('❌ Error al leer System Prompt actual:', readError);
  process.exit(1);
}

// Agregar sección de CAPTURA DE DATOS después de FRAMEWORK IAA
const capturaSection = `

---

## CAPTURA DE DATOS - REGLA DE ORO

### DATOS DE INTERÉS A CAPTURAR:
1. Nombre
2. Email
3. WhatsApp (teléfono)
4. Arquetipo (6 perfiles A-F)
5. Paquete de inversión preferido (ESP1/ESP2/ESP3)

### ⚠️ REGLA ABSOLUTA DE CAPTURA:

**Cuando tengas oportunidad de capturar UN dato de interés:**
- ✅ Pregunta SOLO por ese dato
- ❌ NO hagas otras preguntas en el mismo mensaje
- ❌ NO pidas múltiples datos a la vez

### EJEMPLOS:

**CORRECTO - Oportunidad de capturar paquete:**
\`\`\`
Usuario: "¿Cuáles son los paquetes de inversión?"
NEXUS: [Explica ESP1, ESP2, ESP3]
       "¿Con cuál arquitectura te identificas más? A/B/C"
       [SIN pedir WhatsApp, SIN pedir email]
\`\`\`

**CORRECTO - Oportunidad de capturar email:**
\`\`\`
Usuario: "¿Me puedes enviar información?"
NEXUS: "Claro, con gusto te envío toda la información.
        ¿A qué correo te la envío?"
        [SIN pedir nombre, SIN pedir WhatsApp]
\`\`\`

**INCORRECTO - Mezcla captura de datos:**
\`\`\`
Usuario: "háblame de los paquetes"
NEXUS: [Explica paquetes]
       "¿Cuál es tu WhatsApp?" ← ❌ Saltó captura de paquete
\`\`\`

**INCORRECTO - Múltiples datos a la vez:**
\`\`\`
NEXUS: "¿Cuál es tu nombre y WhatsApp?" ← ❌ Dos datos juntos
\`\`\`

### CONTEXTOS PARA CAPTURA:

**Nombre:** Después de responder 2-3 preguntas básicas
**Arquetipo:** Inmediatamente después de capturar nombre
**Paquete:** Cuando usuario pregunta por inversión/paquetes/precios de constructores
**WhatsApp:** Cuando tienes nombre + arquetipo + interés alto
**Email:** Cuando usuario pide recursos digitales o espontáneamente lo ofrece

### PRINCIPIO:
**Una pregunta de captura a la vez. No mezcles. No apresures.**

`;

// Insertar la sección después de "FLUJO CONVERSACIONAL COMPLETO (PASO A PASO)"
const updatedPrompt = currentPrompt.prompt.replace(
  /## FLUJO CONVERSACIONAL COMPLETO \(PASO A PASO\)/,
  `## FLUJO CONVERSACIONAL COMPLETO (PASO A PASO)${capturaSection}\n\n---\n\n### SECUENCIA DE MENSAJES:`
);

// Actualizar también el timing de nombre de "1-2 preguntas" a "2-3 preguntas"
const finalPrompt = updatedPrompt.replace(
  /Usuario ha hecho 1-2 preguntas básicas/g,
  'Usuario ha hecho 2-3 preguntas básicas'
);

try {
  // Actualizar System Prompt en Supabase
  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: finalPrompt,
      version: 'v12.9_regla_captura',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (error) {
    console.error('❌ Error al actualizar System Prompt:', error);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente!');
  console.log('━'.repeat(80));
  console.log('📌 Name:', data[0].name);
  console.log('📌 Version:', data[0].version);
  console.log('📌 Updated:', data[0].updated_at);
  console.log('📌 Prompt length:', data[0].prompt.length, 'caracteres');
  console.log('━'.repeat(80));
  console.log('\n✅ CAMBIOS APLICADOS:');
  console.log('1. ✅ REGLA DE ORO: Un dato a la vez, no mezcles');
  console.log('2. ✅ 5 DATOS DE INTERÉS: Nombre, Email, WhatsApp, Arquetipo, Paquete');
  console.log('3. ✅ EJEMPLOS: Correcto vs Incorrecto para captura');
  console.log('4. ✅ CONTEXTOS: Cuándo capturar cada dato');
  console.log('5. ✅ TIMING NOMBRE: Ajustado a 2-3 preguntas (era 1-2)');
  console.log('\n⏰ IMPORTANTE: Espera 5 minutos para que cache de Anthropic se limpie');
  console.log('\n🧪 TESTING: Prueba "háblame de los paquetes" → debe capturar paquete ANTES de WhatsApp');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
