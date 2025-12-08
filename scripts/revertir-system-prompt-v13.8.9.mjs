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

async function revertSystemPrompt() {
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

  // Revertir la regla agresiva de v13.9.0 a la versión anterior v13.8.8
  const newAggressiveRule = `### 🎯 REGLA DE ORO - UNA PREGUNTA = UNA RESPUESTA

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

  const oldBalancedRule = `### 🎯 REGLA DE ORO - CONCISIÓN:

**Responde SOLO lo que te preguntan.** No agregues información adicional no solicitada.
- Si preguntan "¿cuánto gano?" → da el valor, no la fórmula
- Si preguntan "ejemplo práctico" → usa el ejemplo del arsenal, no inventes uno
- "En la abundancia de palabras no falta pecado" - menos es más`;

  content = content.replace(newAggressiveRule, oldBalancedRule);

  // Revertir versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.9\.0.*/,
    '# NEXUS - SYSTEM PROMPT v13.8.9 FORMATO COMPACTO MOBILE'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.9\.0.*/,
    '**Versión:** 13.8.9 - Formato compacto mobile (1a, 2a, 3a...)'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.8.9_formato_compacto_mobile',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt revertido a v13.8.9');
  console.log('');
  console.log('Cambios revertidos:');
  console.log('1. ✅ Regla de concisión balanceada restaurada');
  console.log('2. ✅ Removida regla agresiva "Una pregunta = Una respuesta"');
}

revertSystemPrompt();
