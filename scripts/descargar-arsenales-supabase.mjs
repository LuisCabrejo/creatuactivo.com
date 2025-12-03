#!/usr/bin/env node
/**
 * Script para descargar todos los arsenales desde Supabase
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

async function descargarArsenales() {
  console.log('🔍 Descargando arsenales desde Supabase...\n');

  const { data, error } = await supabase
    .from('nexus_documents')
    .select('category, title, content, created_at, updated_at')
    .order('category');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Encontrados ${data.length} documentos:\n`);

  const knowledgeBasePath = path.join(__dirname, '..', 'knowledge_base');

  data.forEach((doc, index) => {
    console.log(`\n📄 Documento ${index + 1}:`);
    console.log(`   Categoría: ${doc.category}`);
    console.log(`   Título: ${doc.title}`);
    console.log(`   Tamaño: ${doc.content.length} caracteres`);
    console.log(`   Creado: ${new Date(doc.created_at).toLocaleDateString('es-CO')}`);
    console.log(`   Actualizado: ${new Date(doc.updated_at).toLocaleDateString('es-CO')}`);

    // Guardar en archivo
    const filename = `${doc.category}.txt`;
    const filepath = path.join(knowledgeBasePath, filename);

    fs.writeFileSync(filepath, doc.content, 'utf8');
    console.log(`   ✅ Guardado en: knowledge_base/${filename}`);
  });

  console.log('\n\n📋 Resumen de arsenales descargados:');
  console.log('=====================================');
  data.forEach(doc => {
    console.log(`  - ${doc.category}.txt (${(doc.content.length / 1024).toFixed(2)} KB)`);
  });
}

descargarArsenales();
