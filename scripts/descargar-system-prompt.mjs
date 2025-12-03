#!/usr/bin/env node
/**
 * Script para descargar el system prompt actual de NEXUS desde Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function descargarSystemPrompt() {
  console.log('🔍 Descargando System Prompt de NEXUS desde Supabase...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ System Prompt encontrado:\n`);
  console.log(`   Nombre: ${data.name}`);
  console.log(`   Versión: ${data.version || 'N/A'}`);
  console.log(`   Tamaño: ${data.prompt.length} caracteres`);
  console.log(`   Creado: ${new Date(data.created_at).toLocaleDateString('es-CO')}`);
  console.log(`   Actualizado: ${new Date(data.updated_at).toLocaleDateString('es-CO')}`);

  // Guardar en archivo
  const knowledgeBasePath = path.join(__dirname, '..', 'knowledge_base');
  const filename = `system-prompt-nexus-${data.version || 'actual'}.md`;
  const filepath = path.join(knowledgeBasePath, filename);

  // Crear contenido con metadata
  const content = `# NEXUS System Prompt
**Nombre:** ${data.name}
**Versión:** ${data.version || 'N/A'}
**Actualizado:** ${new Date(data.updated_at).toLocaleDateString('es-CO')}

---

${data.prompt}
`;

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`\n✅ System Prompt guardado en: knowledge_base/${filename}`);

  // Primeras líneas del prompt
  console.log(`\n📄 Primeras 20 líneas del System Prompt:`);
  console.log('════════════════════════════════════════════════════════════');
  const lines = data.prompt.split('\n').slice(0, 20);
  lines.forEach((line, i) => {
    console.log(`${String(i + 1).padStart(2, '0')}: ${line}`);
  });
  console.log('════════════════════════════════════════════════════════════');
}

descargarSystemPrompt();
