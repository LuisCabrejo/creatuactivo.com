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

  console.log('✅ System Prompt encontrado, versión:', data.version);
  let content = data.prompt;

  // Buscar la regla de concisión actual y reemplazarla con versión moderada
  const oldConcisionRule = `### 🎯 REGLA DE ORO - CONCISIÓN:

**Responde SOLO lo que te preguntan.** No agregues información adicional no solicitada.
- Si preguntan "¿cuánto gano?" → da el valor, no la fórmula
- Si preguntan "ejemplo práctico" → usa el ejemplo del arsenal, no inventes uno
- "En la abundancia de palabras no falta pecado" - menos es más`;

  const newConcisionRule = `### 🎯 REGLA DE ORO - CONCISIÓN:

**Responde ÚNICAMENTE la pregunta del usuario.**

Agrega contexto extra SOLO si es esencial para entender la respuesta.

**❌ NO agregues sin que te pregunten:**
- Secciones "¿Qué pasa si...?"
- "Estrategia clave..." o consejos adicionales
- Porcentajes o datos de otros temas
- Ejemplos cuando no los piden

**✅ SÍ puedes agregar:**
- Contexto breve si la respuesta no tiene sentido sin él
- Una línea de aclaración si evita confusión

**Filosofía:** "En la abundancia de palabras no falta pecado" - menos es más`;

  if (content.includes(oldConcisionRule)) {
    content = content.replace(oldConcisionRule, newConcisionRule);
    console.log('✅ Regla de concisión actualizada (versión moderada)');
  } else {
    console.log('⚠️  No se encontró la regla de concisión exacta');
    console.log('   Buscando alternativas...');

    // Intentar buscar variantes
    if (content.includes('### 🎯 REGLA DE ORO - CONCISIÓN:')) {
      const startIndex = content.indexOf('### 🎯 REGLA DE ORO - CONCISIÓN:');
      const nextSection = content.indexOf('### ✅', startIndex + 1);
      if (nextSection !== -1) {
        const oldSection = content.substring(startIndex, nextSection);
        content = content.replace(oldSection, newConcisionRule + '\n\n');
        console.log('✅ Regla de concisión reemplazada (método alternativo)');
      }
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.1 CONCISIÓN MODERADA'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.1 - Concisión moderada (contexto solo si esencial)'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.1_concision_moderada',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.1');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Lista explícita de qué NO agregar');
  console.log('2. ✅ Permite contexto SOLO si es esencial');
  console.log('3. ✅ Más suave que v13.9.0 (permite excepciones)');
}

updateSystemPrompt();
