#!/usr/bin/env node

/**
 * Script para generar embedding de arsenal_compensacion
 * Fecha: 10 Dic 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar credenciales
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

if (!voyageApiKey) {
  console.error('❌ Error: VOYAGE_API_KEY no encontrada en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Genera embedding usando Voyage AI
 */
async function generateVoyageEmbedding(text) {
  console.log(`📝 Generando embedding para ${text.length} caracteres...`);

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${voyageApiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text.substring(0, 16000), // Límite de tokens
      input_type: 'document'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log(`✅ Embedding generado: ${data.data[0].embedding.length} dimensiones`);
  return data.data[0].embedding;
}

/**
 * Convierte embedding a formato pgvector (1024 -> 1536 con padding)
 */
function formatForPgvector(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

async function main() {
  console.log('🚀 Generando embedding para arsenal_compensacion...\n');

  // Obtener documento
  const { data: doc, error } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content, embedding')
    .eq('category', 'arsenal_compensacion')
    .single();

  if (error) {
    console.error('❌ Error obteniendo documento:', error);
    process.exit(1);
  }

  if (!doc) {
    console.error('❌ arsenal_compensacion no encontrado en nexus_documents');
    process.exit(1);
  }

  console.log(`📦 Documento encontrado:`);
  console.log(`   - ID: ${doc.id}`);
  console.log(`   - Título: ${doc.title || 'Sin título'}`);
  console.log(`   - Contenido: ${doc.content.length} caracteres`);
  console.log(`   - Tiene embedding: ${doc.embedding ? 'SÍ' : 'NO'}`);

  if (doc.embedding) {
    console.log('\n⚠️  El documento ya tiene embedding. ¿Regenerar? Continuando...');
  }

  // Generar embedding
  const embedding = await generateVoyageEmbedding(doc.content);
  const formattedEmbedding = formatForPgvector(embedding);

  // Guardar en Supabase
  console.log('\n💾 Guardando embedding en Supabase...');

  const { error: updateError } = await supabase
    .from('nexus_documents')
    .update({ embedding: formattedEmbedding })
    .eq('id', doc.id);

  if (updateError) {
    console.error('❌ Error guardando embedding:', updateError);
    process.exit(1);
  }

  console.log('✅ Embedding guardado exitosamente');

  // Verificar
  const { data: verify } = await supabase
    .from('nexus_documents')
    .select('embedding')
    .eq('id', doc.id)
    .single();

  if (verify?.embedding) {
    console.log(`\n🔍 Verificación: Embedding guardado (${verify.embedding.length} caracteres)`);
  }

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Próximo paso: Agregar arsenal_compensacion a la búsqueda vectorial en route.ts');
}

main().catch(console.error);
