/**
 * Script para generar embeddings usando Voyage AI
 * Modelo: voyage-3-lite (gratuito, 200M tokens)
 *
 * Fecha: 25 Nov 2025
 * Uso: node scripts/generar-embeddings-voyage.mjs
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
 * Modelo: voyage-3-lite (1024 dimensiones, rápido y gratuito)
 */
async function generateVoyageEmbedding(text) {
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
  return data.data[0].embedding;
}

/**
 * Convierte embedding a formato pgvector (1024 -> 1536 con padding)
 */
function formatForPgvector(embedding) {
  // voyage-3-lite retorna 1024 dimensiones
  // pgvector espera 1536, así que hacemos padding con ceros
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

async function main() {
  console.log('🚀 Generando embeddings con Voyage AI...\n');
  console.log('   Modelo: voyage-3-lite');
  console.log('   Dimensiones: 1024 (+ padding a 1536)\n');

  // Obtener documentos
  const { data: docs, error } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos']);

  if (error) {
    console.error('❌ Error obteniendo documentos:', error);
    return;
  }

  console.log(`📚 Documentos a procesar: ${docs.length}\n`);

  let successCount = 0;

  for (const doc of docs) {
    console.log(`\n📄 ${doc.category}`);
    console.log(`   Título: ${doc.title || '(sin título)'}`);

    // Crear texto para embedding (título + categoría + contenido)
    const text = [
      doc.title || '',
      doc.category.replace(/_/g, ' '),
      doc.content?.substring(0, 15000) || ''
    ].join('\n\n');

    console.log(`   Texto: ${text.length} caracteres`);

    try {
      // Generar embedding con Voyage AI
      const embedding = await generateVoyageEmbedding(text);
      console.log(`   ✅ Embedding generado: ${embedding.length} dimensiones`);

      // Formatear para pgvector
      const embeddingStr = formatForPgvector(embedding);

      // Guardar en Supabase
      const { error: updateError } = await supabase.rpc('update_document_embedding', {
        doc_id: doc.id,
        new_embedding: embeddingStr
      });

      if (updateError) {
        console.log(`   ❌ Error guardando: ${updateError.message}`);
      } else {
        console.log(`   ✅ Guardado en Supabase`);
        successCount++;
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }

    // Rate limiting (Voyage permite 300 req/min)
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n\n${'='.repeat(60)}`);
  console.log(`\n📊 RESULTADO: ${successCount}/${docs.length} documentos procesados`);

  if (successCount === docs.length) {
    console.log('\n✅ ¡Todos los embeddings generados exitosamente!');
    console.log('\n📋 PRÓXIMO PASO:');
    console.log('   Ejecutar pruebas: node scripts/test-vector-lib.mjs');
  }
}

main().catch(console.error);
