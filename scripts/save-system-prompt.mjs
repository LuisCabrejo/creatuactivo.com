#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^[\\"']|[\\"']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

async function savePrompt() {
  const env = loadEnvFile();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  const filename = join(__dirname, '..', 'knowledge_base', `nexus-system-prompt-ACTUAL-${data.version}.md`);
  const content = `# NEXUS System Prompt - ${data.version}

**Fecha creación**: ${data.created_at}
**Última actualización**: ${data.updated_at}
**Longitud**: ${data.prompt.length} caracteres

---

${data.prompt}
`;

  writeFileSync(filename, content, 'utf-8');
  console.log('✅ System Prompt guardado en:', filename);
  console.log(`📊 Versión: ${data.version}`);
  console.log(`📏 Tamaño: ${data.prompt.length} caracteres`);
}

savePrompt().catch(console.error);
