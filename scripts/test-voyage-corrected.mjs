/**
 * Test corregido de embeddings Voyage AI
 * Expectativas ajustadas según contenido real de arsenales
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
    throw new Error(`Voyage API: ${response.status}`);
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
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function parseEmbedding(embeddingStr) {
  return embeddingStr.slice(1, -1).split(',').map(parseFloat);
}

// Tests corregidos según contenido real:
// - arsenal_inicial: WHY, FREQ (qué es, cómo funciona general, cuánto cuesta empezar)
// - arsenal_avanzado: OBJ (MLM, pirámide, tiempo), SIST (sistema técnico), VAL, ESC
// - catalogo_productos: productos, precios de productos individuales
const testQueries = [
  // OBJECIONES → arsenal_avanzado
  { query: '¿Esto es MLM?', expected: 'arsenal_avanzado', reason: 'OBJ_01' },
  { query: 'esto parece pirámide', expected: 'arsenal_avanzado', reason: 'OBJ_02' },
  { query: '¿necesito experiencia en ventas?', expected: 'arsenal_avanzado', reason: 'OBJ_03' },

  // PREGUNTAS GENERALES → arsenal_inicial
  { query: '¿Qué es CreaTuActivo?', expected: 'arsenal_inicial', reason: 'FREQ_01' },
  { query: '¿Cómo funciona el negocio?', expected: 'arsenal_inicial', reason: 'FREQ_02' },
  { query: '¿Cuánto cuesta empezar?', expected: 'arsenal_inicial', reason: 'FREQ_03' },
  { query: '¿Por qué existe CreaTuActivo?', expected: 'arsenal_inicial', reason: 'WHY_01' },

  // PRODUCTOS → catalogo_productos
  { query: 'productos de café', expected: 'catalogo_productos', reason: 'Catálogo' },
  { query: 'precio del Ganocafé', expected: 'catalogo_productos', reason: 'Catálogo' },
  { query: '¿Qué productos tiene Gano Excel?', expected: 'catalogo_productos', reason: 'Catálogo' },
];

async function runTests() {
  console.log('🧪 TEST CORREGIDO: Voyage AI + Expectativas Ajustadas\n');
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
    console.log(`📝 ${i+1}/10: "${test.query}"`);
    console.log(`   Esperado: ${test.expected} (${test.reason})`);

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
        console.log(`   ✅ ${topResult.category} (${topResult.similarity.toFixed(3)})`);
        passed++;
      } else {
        console.log(`   ❌ ${topResult.category} (${topResult.similarity.toFixed(3)})`);
        console.log(`      ${results.map(r => `${r.category.split('_')[1] || r.category}:${r.similarity.toFixed(2)}`).join(' | ')}`);
        failed++;
      }
    } catch (e) {
      console.log(`   ⚠️ Error: ${e.message}`);
      failed++;
    }

    console.log('');
    await new Promise(r => setTimeout(r, 100)); // 300 RPM con método de pago
  }

  console.log('='.repeat(60));
  console.log(`\n📊 RESULTADOS:`);
  console.log(`   ✅ Correctas: ${passed}/10`);
  console.log(`   ❌ Incorrectas: ${failed}/10`);
  console.log(`   📈 Precisión: ${(passed/10*100).toFixed(0)}%`);

  if (passed >= 8) {
    console.log('\n🎉 ¡Excelente! Sistema listo para producción');
  } else if (passed >= 6) {
    console.log('\n⚠️ Aceptable pero mejorable');
  } else {
    console.log('\n❌ Necesita más trabajo');
  }
}

runTests().catch(console.error);
