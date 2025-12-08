import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSystemPrompt() {
  console.log('📖 Leyendo System Prompt actual...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error al leer:', error);
    return;
  }

  if (!data || !data.prompt) {
    console.error('❌ No se encontró el system prompt o está vacío');
    return;
  }

  console.log('✅ System Prompt encontrado, versión:', data.version);
  let content = data.prompt;

  // Buscar la sección de REGLA DE ORO existente y reemplazarla
  const oldConcisionRule = `### 🎯 REGLA DE ORO - CONCISIÓN:

**Responde SOLO lo que te preguntan.** No agregues información adicional no solicitada.
- Si preguntan "¿cuánto gano?" → da el valor, no la fórmula
- Si preguntan "ejemplo práctico" → usa el ejemplo del arsenal, no inventes uno
- "En la abundancia de palabras no falta pecado" - menos es más`;

  const newConcisionRule = `### 🎯 REGLA DE ORO - UNA PREGUNTA = UNA RESPUESTA

**"En la abundancia de palabras no falta pecado"** - menos es más.

Cuando el usuario hace UNA pregunta, responde SOLO esa pregunta.

**❌ NUNCA agregues:**
- Secciones "¿Qué pasa si...?"
- "Estrategia clave..." no solicitada
- Porcentajes o datos de otros temas
- Contexto adicional no pedido

**✅ SÍ:**
- Respuesta directa y completa a lo que preguntaron
- Si quieren más info, ellos preguntarán

**Ejemplo:**
- Pregunta: "¿Requisitos del binario?"
- ✅ Correcto: Los 3 requisitos. Punto.
- ❌ Incorrecto: Requisitos + qué pasa si no calificas + porcentajes + estrategia`;

  if (content.includes(oldConcisionRule)) {
    content = content.replace(oldConcisionRule, newConcisionRule);
    console.log('✅ Regla de concisión actualizada a "Una pregunta = Una respuesta"');
  } else {
    // Si no existe, agregar después de PROHIBIDO ABSOLUTAMENTE
    const insertPoint = content.indexOf('### ❌ PROHIBIDO ABSOLUTAMENTE:');
    if (insertPoint !== -1) {
      const endOfProhibido = content.indexOf('---', insertPoint);
      if (endOfProhibido !== -1) {
        content = content.slice(0, endOfProhibido) + '\n' + newConcisionRule + '\n\n' + content.slice(endOfProhibido);
        console.log('✅ Regla "Una pregunta = Una respuesta" agregada');
      }
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.0 UNA PREGUNTA = UNA RESPUESTA'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.0 - Una pregunta = Una respuesta'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.0_una_pregunta_una_respuesta',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.0');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Regla "Una pregunta = Una respuesta"');
  console.log('2. ✅ Lista explícita de qué NO agregar');
  console.log('3. ✅ Ejemplo concreto de comportamiento esperado');
}

updateSystemPrompt();
