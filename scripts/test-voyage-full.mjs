/**
 * Test completo de embeddings Voyage AI (10 queries)
 * Ahora con rate limit de 300 RPM
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

const testQueries = [
  { query: '¿Esto es MLM?', expected: 'arsenal_avanzado' },
  { query: 'suena como pirámide', expected: 'arsenal_avanzado' },
  { query: '¿Cuánto dinero puedo ganar?', expected: 'arsenal_avanzado' },
  { query: 'no tengo tiempo para esto', expected: 'arsenal_avanzado' },
  { query: '¿Cómo funciona el sistema?', expected: 'arsenal_avanzado' },
  { query: 'quiero hablar con alguien', expected: 'arsenal_avanzado' },
  { query: '¿Qué es CreaTuActivo?', expected: 'arsenal_inicial' },
  { query: 'productos de café', expected: 'catalogo_productos' },
  { query: '¿Qué incluye el paquete ESP 2?', expected: 'catalogo_productos' },
  { query: 'precios de los paquetes', expected: 'catalogo_productos' },
];

async function runTests() {
  console.log('🧪 TEST COMPLETO: Embeddings Voyage AI (10 queries)\n');
  console.log('='.repeat(60) + '\n');

  const { data: documents } = await supabase
    .from('nexus_documents')
    .select('category, title, embedding')
    .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos'])
    .not('embedding', 'is', null);

  console.log(`📚 Documentos: ${documents.length}\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    console.log(`📝 Query ${i+1}/10: "${test.query}"`);
    console.log(`   Esperado: ${test.expected}`);

    try {
      const queryEmbedding = await generateQueryEmbedding(test.query);

      const results = documents
        .map(doc => ({
          category: doc.category,
          similarity: cosineSimilarity(queryEmbedding, parseEmbedding(doc.embedding))
        }))
        .sort((a, b) => b.similarity - a.similarity);

      const topResult = results[0];
      const isCorrect = topResult.category === test.expected;

      if (isCorrect) {
        console.log(`   ✅ ${topResult.category} (sim: ${topResult.similarity.toFixed(4)})`);
        passed++;
      } else {
        console.log(`   ❌ ${topResult.category} (sim: ${topResult.similarity.toFixed(4)})`);
        console.log(`      Ranking: ${results.map(r => `${r.category}:${r.similarity.toFixed(2)}`).join(' | ')}`);
        failed++;
      }
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
      failed++;
    }

    console.log('');

    // Pequeña pausa entre requests (no necesaria con 300 RPM, pero buena práctica)
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('='.repeat(60));
  console.log(`\n📊 RESULTADOS FINALES:`);
  console.log(`   ✅ Correctas: ${passed}/${testQueries.length}`);
  console.log(`   ❌ Incorrectas: ${failed}/${testQueries.length}`);
  console.log(`   📈 Precisión: ${(passed/testQueries.length*100).toFixed(0)}%`);

  if (passed === testQueries.length) {
    console.log('\n🎉 ¡PERFECTO! 100% de precisión - Listo para producción');
  } else if (passed >= 8) {
    console.log('\n✅ Excelente precisión - Listo para producción');
  } else if (passed >= 6) {
    console.log('\n⚠️ Buena precisión - Considerar ajustes');
  } else {
    console.log('\n❌ Precisión insuficiente - Revisar embeddings');
  }
}

runTests().catch(console.error);
