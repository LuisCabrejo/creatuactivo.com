/**
 * Test rápido de embeddings Voyage AI (3 queries)
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

async function generateQueryEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${voyageApiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text,
      input_type: 'query'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API: ${response.status} - ${error.substring(0, 100)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function cosineSimilarity(a, b) {
  const len = Math.min(a.length, b.length);
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function parseEmbedding(embeddingStr) {
  return embeddingStr.slice(1, -1).split(',').map(parseFloat);
}

// Solo 3 queries para test rápido
const testQueries = [
  { query: '¿Esto es MLM?', expected: 'arsenal_avanzado' },
  { query: '¿Qué es CreaTuActivo?', expected: 'arsenal_inicial' },
  { query: 'productos de café', expected: 'catalogo_productos' },
];

async function runTests() {
  console.log('🧪 TEST RÁPIDO: Embeddings Voyage AI (3 queries)\n');
  console.log('='.repeat(60) + '\n');

  const { data: documents } = await supabase
    .from('nexus_documents')
    .select('category, title, embedding')
    .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos'])
    .not('embedding', 'is', null);

  console.log(`📚 Documentos: ${documents.length}\n`);

  let passed = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    console.log(`📝 Query ${i+1}: "${test.query}"`);
    console.log(`   Esperado: ${test.expected}`);

    try {
      const queryEmbedding = await generateQueryEmbedding(test.query);
      console.log(`   Embedding generado: ${queryEmbedding.length} dims`);

      const results = documents
        .map(doc => ({
          category: doc.category,
          similarity: cosineSimilarity(queryEmbedding, parseEmbedding(doc.embedding))
        }))
        .sort((a, b) => b.similarity - a.similarity);

      console.log(`   Similitudes:`);
      results.forEach(r => {
        const marker = r.category === test.expected ? '👈' : '';
        console.log(`      ${r.category}: ${r.similarity.toFixed(4)} ${marker}`);
      });

      if (results[0].category === test.expected) {
        console.log(`   ✅ CORRECTO\n`);
        passed++;
      } else {
        console.log(`   ❌ INCORRECTO\n`);
      }
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}\n`);
    }

    // Con método de pago: 300 RPM, no hay que esperar
    if (i < testQueries.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('='.repeat(60));
  console.log(`\n📊 RESULTADO: ${passed}/${testQueries.length} correctas (${(passed/testQueries.length*100).toFixed(0)}%)`);
}

runTests().catch(console.error);
