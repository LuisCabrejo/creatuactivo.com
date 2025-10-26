#!/usr/bin/env node
// Script para actualizar System Prompt con instrucciones de memoria a largo plazo

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

console.log('📝 Actualizando System Prompt para habilitar memoria a largo plazo...\n');

try {
  // Leer System Prompt actual
  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error al leer System Prompt:', readError);
    process.exit(1);
  }

  console.log('✅ System Prompt actual leído');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt?.length || 0} caracteres\n`);

  // Nuevo contenido a agregar
  const memoryInstructions = `

---

## 🧠 MEMORIA A LARGO PLAZO (CRÍTICO)

⚠️ INSTRUCCIÓN FUNDAMENTAL: NEXUS TIENE MEMORIA COMPLETA de conversaciones previas.

### CÓMO FUNCIONA TU MEMORIA:

El sistema carga automáticamente el historial de conversaciones previas con cada usuario (identificado por fingerprint único). Recibes hasta 40 mensajes históricos (20 intercambios) de conversaciones anteriores.

### REGLAS DE USO DE MEMORIA:

**✅ DEBES:**
- Recordar datos ya compartidos (nombre, arquetipo, WhatsApp)
- Hacer referencia a conversaciones previas cuando sea relevante
- Personalizar respuestas basándote en contexto histórico
- Reconocer cuando el usuario vuelve después de días/semanas

**❌ NUNCA:**
- Decir "No tengo acceso al historial"
- Decir "Cada sesión comienza desde cero"
- Decir "Para proteger tu privacidad no recuerdo"
- Pedir datos que ya capturaste en conversaciones previas

### EJEMPLOS DE USO CORRECTO:

**Usuario pregunta: "¿Recuerdas de qué hablamos antes?"**

INCORRECTO ❌:
"No tengo acceso al historial de conversaciones anteriores."

CORRECTO ✅:
"Claro [NOMBRE], la última vez hablamos sobre [tema específico del historial].
¿Quieres profundizar en eso o tienes otra pregunta?"

**Usuario pregunta sobre productos después de días:**

INCORRECTO ❌:
"Para personalizar tu asesoría, ¿cómo te llamas?"

CORRECTO ✅:
"[NOMBRE], la última vez te interesaban los productos de [categoría].
¿Quieres que profundicemos en esos o ver otras opciones?"

### PRIVACY & TRANSPARENCY:

Tu memoria es PRIVADA por usuario. Cada conversación está aislada por fingerprint - nunca compartes datos entre usuarios.

Si el usuario pregunta sobre privacidad:
- Explicar que su historial es SOLO suyo (no compartido)
- Datos almacenados en Supabase con RLS (Row-Level Security)
- Puede solicitar borrado completo contactando soporte

### VERIFICACIÓN DE MEMORIA:

Si el historial viene vacío (primera conversación del usuario):
- NO menciones que "no tienes memoria"
- Simplemente procede con captura normal
- Es su primera vez, no falta de memoria

Si el historial tiene datos:
- USA esa información para personalizar
- Evita re-preguntar datos ya capturados
- Reconoce contexto de conversaciones previas

---
`;

  // Insertar nueva sección ANTES de "## INSTRUCCIONES TECNICAS"
  let updatedPrompt = currentPrompt.prompt;

  const insertionPoint = updatedPrompt.indexOf('## INSTRUCCIONES TECNICAS');

  if (insertionPoint === -1) {
    console.error('❌ No se encontró sección "## INSTRUCCIONES TECNICAS"');
    console.log('⚠️  Agregando al final del prompt...');
    updatedPrompt = updatedPrompt + memoryInstructions;
  } else {
    updatedPrompt =
      updatedPrompt.slice(0, insertionPoint) +
      memoryInstructions +
      '\n' +
      updatedPrompt.slice(insertionPoint);
  }

  console.log('✅ Nueva sección de memoria agregada');
  console.log(`   Nueva longitud: ${updatedPrompt.length} caracteres\n`);

  // Actualizar versión
  const newVersion = 'v12.11_memoria_largo_plazo';

  // Guardar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error al actualizar System Prompt:', updateError);
    process.exit(1);
  }

  console.log('━'.repeat(80));
  console.log('✅ SYSTEM PROMPT ACTUALIZADO EXITOSAMENTE');
  console.log('━'.repeat(80));
  console.log(`📌 Nueva versión: ${newVersion}`);
  console.log(`📌 Longitud total: ${updatedPrompt.length} caracteres`);
  console.log(`📌 Cambios: Agregada sección "🧠 MEMORIA A LARGO PLAZO"`);
  console.log('━'.repeat(80));
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   - Cache de Anthropic tomará ~5 minutos en refrescar');
  console.log('   - Prueba NEXUS después de 5 minutos');
  console.log('   - Verifica que NO diga "no tengo acceso al historial"');
  console.log('\n✅ Script completado exitosamente');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
