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

  // Fix: Cambiar formato largo a formato compacto mobile-friendly
  const oldGEN5Values = `- **VALORES EXACTOS por generación (cuando tú y el comprador tienen ESP-3):**
    - GEN1 (patrocinado directo): **$150 USD**
    - GEN2: **$20 USD**
    - GEN3: **$20 USD**
    - GEN4: **$20 USD**
    - GEN5: **$40 USD**
    - TOTAL por compra ESP-3: **$250 USD**`;

  const newGEN5Values = `- **VALORES EXACTOS (ESP-3 → ESP-3):**
    - 1a: **$150 USD**
    - 2a: **$20 USD**
    - 3a: **$20 USD**
    - 4a: **$20 USD**
    - 5a: **$40 USD**
    - TOTAL: **$250 USD**`;

  content = content.replace(oldGEN5Values, newGEN5Values);

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.8\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.8.9 FORMATO COMPACTO MOBILE'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.8\.[0-9]+.*/,
    '**Versión:** 13.8.9 - Formato compacto mobile (1a, 2a, 3a...)'
  );

  // Actualizar en Supabase
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

  console.log('✅ System Prompt actualizado a v13.8.9');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ GEN1 → 1a, GEN2 → 2a, etc.');
  console.log('2. ✅ Eliminado "(patrocinado directo)"');
  console.log('3. ✅ Formato ultra-compacto para mobile');
}

updateSystemPrompt();
