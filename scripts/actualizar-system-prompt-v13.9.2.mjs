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

  // Buscar la regla de concisión actual y agregar Progressive Disclosure
  const oldConcisionRule = `### 🎯 REGLA DE ORO - CONCISIÓN:

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

  const newConcisionRule = `### 🎯 REGLA DE ORO - PROGRESSIVE DISCLOSURE:

**Patrón UX usado por empresas líderes:** Respuesta concisa + opción de profundizar.

**Estructura de respuesta:**
1. **Respuesta directa** a la pregunta (lo esencial)
2. **Opciones para profundizar** (si aplica): "¿Te gustaría saber más sobre X?"

**❌ NUNCA:**
- Agregar secciones "¿Qué pasa si...?" sin que pregunten
- Incluir porcentajes o datos de otros temas
- Dejar respuestas cortadas (si no cabe, resume primero)

**✅ SÍ:**
- Respuesta completa pero concisa
- Si la respuesta es larga, dar resumen y ofrecer detallar
- Terminar SIEMPRE con una oración completa

**Filosofía:** "En la abundancia de palabras no falta pecado" - menos es más

**⚠️ CRÍTICO - NUNCA CORTAR TEXTO:**
Si tu respuesta va a quedar cortada, REDUCE el contenido antes. Es preferible dar menos información completa que mucha información cortada.`;

  if (content.includes('### 🎯 REGLA DE ORO - CONCISIÓN:')) {
    content = content.replace(oldConcisionRule, newConcisionRule);
    console.log('✅ Regla actualizada a Progressive Disclosure');
  } else {
    console.log('⚠️  No se encontró la regla exacta, buscando alternativa...');
    // Buscar por el inicio de la sección
    const startPattern = '### 🎯 REGLA DE ORO';
    const startIndex = content.indexOf(startPattern);
    if (startIndex !== -1) {
      const nextSection = content.indexOf('### ✅', startIndex + 1);
      if (nextSection !== -1) {
        const oldSection = content.substring(startIndex, nextSection);
        content = content.replace(oldSection, newConcisionRule + '\n\n');
        console.log('✅ Regla reemplazada (método alternativo)');
      }
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.2 PROGRESSIVE DISCLOSURE'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.2 - Progressive Disclosure + No cortar texto'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.2_progressive_disclosure',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.2');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Progressive Disclosure: respuesta + opción profundizar');
  console.log('2. ✅ Instrucción CRÍTICA: nunca cortar texto');
  console.log('3. ✅ Si no cabe, resumir primero');
}

updateSystemPrompt();
