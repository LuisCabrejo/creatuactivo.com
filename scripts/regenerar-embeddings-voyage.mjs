/**
 * Regenerar embeddings con Voyage AI usando contenido más completo
 *
 * El problema: arsenal_avanzado tiene 32K chars pero solo usamos 7.5K
 * Solución: Usar hasta 16K tokens (límite de voyage-3-lite)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateVoyageEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${voyageApiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text,
      input_type: 'document'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function formatForPgvector(embedding) {
  // voyage-3-lite retorna 512 dimensiones
  // pgvector espera 1536, así que hacemos padding con ceros
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

async function main() {
  console.log('🚀 Regenerando embeddings con contenido COMPLETO...\n');

  const { data: docs, error } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos']);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📚 Documentos a procesar: ${docs.length}\n`);

  for (const doc of docs) {
    console.log(`\n📄 ${doc.category}`);
    console.log(`   Contenido total: ${doc.content?.length || 0} chars`);

    // Usar MUCHO más contenido - hasta 32K chars (~8K tokens)
    // voyage-3-lite soporta hasta 32K tokens
    const text = [
      doc.title || '',
      doc.category.replace(/_/g, ' '),
      doc.content || ''
    ].join('\n\n').substring(0, 32000);

    console.log(`   Texto para embedding: ${text.length} chars`);

    try {
      const embedding = await generateVoyageEmbedding(text);
      console.log(`   ✅ Embedding: ${embedding.length} dimensiones`);

      const embeddingStr = formatForPgvector(embedding);

      const { error: updateError } = await supabase.rpc('update_document_embedding', {
        doc_id: doc.id,
        new_embedding: embeddingStr
      });

      if (updateError) {
        console.log(`   ❌ Error guardando: ${updateError.message}`);
      } else {
        console.log(`   ✅ Guardado en Supabase`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }

    // Pausa entre requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n\n✅ Embeddings regenerados. Ejecuta test: node scripts/test-voyage-full.mjs');
}

main().catch(console.error);
