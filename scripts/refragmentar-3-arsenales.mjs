/**
 * Re-fragmenta solo los 3 arsenales que fueron purgados:
 * - arsenal_inicial (38 resp esperadas)
 * - arsenal_avanzado (17 resp esperadas)
 * - arsenal_compensacion (38 resp esperadas)
 *
 * Uso: node scripts/refragmentar-3-arsenales.mjs
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
      input: text.substring(0, 8000),
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

function formatForPgvector1536(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

function formatForPgvector512(embedding) {
  return '[' + embedding.join(',') + ']';
}

function parseArsenalIntoResponses(content, arsenalName) {
  const responses = [];
  const sections = content.split(/(?=###\s+\*?\*?[A-Z]+(?:_[A-Z0-9]+)*_\d+)/);

  for (const section of sections) {
    if (!section.trim() || !section.includes('###')) continue;
    const headerMatch = section.match(/###\s*\*?\*?([A-Z]+(?:_[A-Z0-9]+)*_\d+):?\s*"?([^"\n*]+)/);
    if (!headerMatch) continue;

    const responseId = headerMatch[1].trim();
    const questionText = headerMatch[2].trim();
    const contentStart = section.indexOf('\n');
    const responseContent = section.substring(contentStart).trim();
    if (responseContent.length < 50) continue;

    const endMarker = responseContent.indexOf('\n---');
    const cleanContent = endMarker > 0
      ? responseContent.substring(0, endMarker).trim()
      : responseContent.trim();

    responses.push({ id: responseId, question: questionText, content: cleanContent, fullSection: section.trim(), arsenal: arsenalName });
  }
  return responses;
}

const ARSENAL_TENANT_MAP = {
  arsenal_compensacion:   'creatuactivo_marketing',
  arsenal_inicial:        'creatuactivo_marketing',
  arsenal_avanzado:       'creatuactivo_marketing',
};

async function processArsenal(arsenalCategory) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Procesando: ${arsenalCategory}`);
  console.log('='.repeat(60));

  const tenantId = ARSENAL_TENANT_MAP[arsenalCategory];
  const { data: arsenal, error } = await supabase
    .from('nexus_documents')
    .select('id, category, content, metadata')
    .eq('category', arsenalCategory)
    .eq('tenant_id', tenantId)
    .single();

  if (error || !arsenal) {
    console.error(`❌ Error obteniendo ${arsenalCategory}:`, error);
    return { processed: 0, skipped: 0 };
  }

  console.log(`📄 Arsenal original: ${arsenal.content.length} caracteres`);
  const responses = parseArsenalIntoResponses(arsenal.content, arsenalCategory);
  console.log(`🔍 Respuestas encontradas: ${responses.length}`);

  if (responses.length === 0) {
    console.log('⚠️  No se encontraron respuestas');
    return { processed: 0, skipped: 0 };
  }

  let processed = 0;
  let skipped = 0;

  for (const response of responses) {
    const fragmentCategory = `${arsenalCategory}_${response.id}`;

    // Verificar si ya existe (no debería, los purgamos)
    const { data: existing } = await supabase
      .from('nexus_documents')
      .select('id')
      .eq('category', fragmentCategory)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️  ${fragmentCategory} ya existe, saltando...`);
      skipped++;
      continue;
    }

    console.log(`\n📝 Creando: ${fragmentCategory} (${response.content.length} chars)`);

    try {
      const textForEmbedding = `${response.question}\n\n${response.content}`;
      const embedding = await generateVoyageEmbedding(textForEmbedding);
      const embedding1536 = formatForPgvector1536(embedding);
      const embedding512  = formatForPgvector512(embedding);

      const { error: insertError } = await supabase
        .from('nexus_documents')
        .insert({
          category: fragmentCategory,
          title: response.question,
          content: response.fullSection,
          embedding: embedding1536,
          embedding_512: embedding512,
          tenant_id: tenantId,
          metadata: {
            response_id: response.id,
            parent_arsenal: arsenalCategory,
            char_count: response.content.length,
            is_fragment: true,
            created_at: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error(`   ❌ Error insertando: ${insertError.message}`);
        continue;
      }

      console.log(`   ✅ Creado`);
      processed++;
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  return { processed, skipped, total: responses.length };
}

async function main() {
  console.log('🚀 RE-FRAGMENTACIÓN (3 arsenales purgados)');
  console.log('==========================================\n');

  const arsenales = ['arsenal_inicial', 'arsenal_avanzado', 'arsenal_compensacion'];
  const results = {};

  for (const arsenal of arsenales) {
    results[arsenal] = await processArsenal(arsenal);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN');
  console.log('='.repeat(60));
  let totalProcessed = 0;
  for (const [arsenal, r] of Object.entries(results)) {
    console.log(`  ${arsenal}: ${r.processed} creados, ${r.skipped} saltados (${r.total || 0} total local)`);
    totalProcessed += r.processed || 0;
  }
  console.log(`\n  TOTAL fragmentos creados: ${totalProcessed}`);
  console.log('✅ Re-fragmentación completada');
}

main().catch(console.error);
