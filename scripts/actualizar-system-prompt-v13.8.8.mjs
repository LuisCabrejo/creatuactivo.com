import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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

  // Fix 1: Agregar regla anti-invención de cálculos después de "PROHIBIDO ABSOLUTAMENTE"
  const oldProhibidoSection = `### ❌ PROHIBIDO ABSOLUTAMENTE:

1. **Inventar productos:** Si te preguntan por un producto/término que no reconoces, NO inventes que existe
2. **Inventar precios:** Si no tienes el precio exacto, di "no tengo esa información específica"
3. **Inventar porcentajes:** Si no tienes los números exactos, no los inventes
4. **Inventar definiciones:** Si te preguntan por un acrónimo o término que no está en tu base, NO inventes su significado`;

  const newProhibidoSection = `### ❌ PROHIBIDO ABSOLUTAMENTE:

1. **Inventar productos:** Si te preguntan por un producto/término que no reconoces, NO inventes que existe
2. **Inventar precios:** Si no tienes el precio exacto, di "no tengo esa información específica"
3. **Inventar porcentajes:** Si no tienes los números exactos, no los inventes
4. **Inventar definiciones:** Si te preguntan por un acrónimo o término que no está en tu base, NO inventes su significado
5. **Inventar cálculos:** NUNCA agregues fórmulas o cálculos que no estén en el arsenal
   - ❌ NO: "Cálculo: 200 personas × $22 USD × 17% = ..."
   - ✅ SÍ: Usa los valores pre-calculados del arsenal EXACTAMENTE como están
   - Si el arsenal dice "$1,768 USD" → di "$1,768 USD" (no expliques cómo se calculó)

### 🎯 REGLA DE ORO - CONCISIÓN:

**Responde SOLO lo que te preguntan.** No agregues información adicional no solicitada.
- Si preguntan "¿cuánto gano?" → da el valor, no la fórmula
- Si preguntan "ejemplo práctico" → usa el ejemplo del arsenal, no inventes uno
- "En la abundancia de palabras no falta pecado" - menos es más`;

  content = content.replace(oldProhibidoSection, newProhibidoSection);

  // Fix 2: Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.8\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.8.8 ANTI-INVENCIÓN + CONCISIÓN'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.8\.[0-9]+.*/,
    '**Versión:** 13.8.8 - Anti-Invención de Cálculos + Regla de Concisión'
  );

  // Actualizar en Supabase
  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.8.8_anti_invencion_concision',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.8.8');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Regla anti-invención de cálculos');
  console.log('2. ✅ Regla de concisión: responder SOLO lo que preguntan');
  console.log('3. ✅ Ejemplo de qué NO hacer con cálculos');
}

updateSystemPrompt();
