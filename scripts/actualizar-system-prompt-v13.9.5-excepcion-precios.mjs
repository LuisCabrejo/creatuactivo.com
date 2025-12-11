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

  // Buscar la regla de concisión extrema y agregar excepción
  const oldConcisionRule = `### 🚨 REGLA CRÍTICA - CONCISIÓN EXTREMA:

**Máximo 150-200 palabras por respuesta** (aprox. 200-250 tokens).`;

  const newConcisionRule = `### 🚨 REGLA CRÍTICA - CONCISIÓN EXTREMA:

**Máximo 150-200 palabras por respuesta** (aprox. 200-250 tokens).

**⚠️ EXCEPCIONES (puedes usar más palabras):**
- Lista completa de precios de productos → mostrar los 22 productos
- Tablas de compensación completas → mostrar tabla completa
- Cuando el usuario pida explícitamente "lista completa" o "todos los..."`;

  if (content.includes(oldConcisionRule)) {
    content = content.replace(oldConcisionRule, newConcisionRule);
    console.log('✅ Excepción agregada a regla de concisión');
  } else {
    console.log('⚠️  No se encontró la regla exacta de concisión extrema');
    // Intentar buscar variante
    const altRule = '### 🚨 REGLA CRÍTICA - CONCISIÓN EXTREMA:';
    if (content.includes(altRule)) {
      const insertPoint = content.indexOf(altRule);
      const nextLine = content.indexOf('\n\n', insertPoint + altRule.length);
      if (nextLine !== -1) {
        const excepcion = `

**⚠️ EXCEPCIONES (puedes usar más palabras):**
- Lista completa de precios de productos → mostrar los 22 productos
- Tablas de compensación completas → mostrar tabla completa
- Cuando el usuario pida explícitamente "lista completa" o "todos los..."`;

        // Insertar después del primer párrafo de la regla
        const secondParagraph = content.indexOf('\n\n', nextLine + 2);
        if (secondParagraph !== -1) {
          content = content.slice(0, secondParagraph) + excepcion + content.slice(secondParagraph);
          console.log('✅ Excepción agregada (método alternativo)');
        }
      }
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.5 EXCEPCIÓN LISTA PRECIOS'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.5 - Excepción concisión para lista precios'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.5_excepcion_lista_precios',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.5');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Excepción para lista de precios (22 productos)');
  console.log('2. ✅ Excepción para tablas de compensación');
  console.log('3. ✅ Excepción para "lista completa" o "todos los..."');
}

updateSystemPrompt();
