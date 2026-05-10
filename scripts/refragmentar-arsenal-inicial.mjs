#!/usr/bin/env node
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Re-fragmenta arsenal_inicial en una sola pasada:
 *   1. Purga fragmentos existentes arsenal_inicial_* en nexus_documents
 *   2. Lee knowledge_base/arsenal_inicial.txt
 *   3. Genera embeddings Voyage AI por respuesta (formato 1536-padded)
 *   4. Inserta fragmentos limpios en nexus_documents
 *
 * Uso: node scripts/refragmentar-arsenal-inicial.mjs
 *
 * Cuándo usar: después de editar arsenal_inicial.txt + correr deploy-arsenal-inicial.mjs.
 * El script de fragmentación general SALTA fragmentos existentes — por eso requiere purga previa.
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

if (!supabaseUrl || !supabaseKey || !voyageApiKey) {
  console.error('❌ Error: variables de entorno faltantes en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const ARSENAL = 'arsenal_inicial';
const TENANT_ID = 'creatuactivo_marketing';

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
    throw new Error(`Voyage API error: ${response.status} - ${await response.text()}`);
  }
  const data = await response.json();
  return data.data[0].embedding;
}

function formatForPgvector1536(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
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

    responses.push({ id: responseId, question: questionText, content: cleanContent, arsenal: arsenalName });
  }
  return responses;
}

async function purgarFragmentos() {
  console.log(`\n🗑️  Purgando fragmentos existentes de ${ARSENAL}...`);

  // Buscar fragmentos por patrón arsenal_inicial_* (excluyendo el documento padre)
  const { data: existing, error: selectError } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .like('category', `${ARSENAL}_%`)
    .eq('tenant_id', TENANT_ID);

  if (selectError) {
    console.error('❌ Error buscando fragmentos:', selectError);
    process.exit(1);
  }

  if (!existing || existing.length === 0) {
    console.log('   (no hay fragmentos existentes para purgar)');
    return;
  }

  console.log(`   Encontrados ${existing.length} fragmentos para purgar`);

  const { error: deleteError } = await supabase
    .from('nexus_documents')
    .delete()
    .like('category', `${ARSENAL}_%`)
    .eq('tenant_id', TENANT_ID);

  if (deleteError) {
    console.error('❌ Error purgando:', deleteError);
    process.exit(1);
  }

  console.log(`   ✅ ${existing.length} fragmentos purgados`);
}

async function fragmentar() {
  console.log(`\n📦 Re-fragmentando ${ARSENAL}...`);

  // Leer arsenal del filesystem (no de Supabase — queremos la versión local actualizada)
  const arsenalPath = join(__dirname, '..', 'knowledge_base', `${ARSENAL}.txt`);
  const arsenalContent = readFileSync(arsenalPath, 'utf8');
  console.log(`📄 Arsenal local: ${arsenalContent.length} caracteres`);

  const responses = parseArsenalIntoResponses(arsenalContent, ARSENAL);
  console.log(`🔍 Respuestas detectadas: ${responses.length}\n`);

  let processed = 0;
  let failed = 0;

  for (const response of responses) {
    const fragmentCategory = `${ARSENAL}_${response.id}`;
    console.log(`⚙️  ${fragmentCategory} — "${response.question.substring(0, 60)}..."`);

    try {
      const embedding = await generateVoyageEmbedding(response.content);
      const embeddingStr = formatForPgvector1536(embedding);

      const { error } = await supabase
        .from('nexus_documents')
        .insert({
          title: response.question,
          content: response.content,
          category: fragmentCategory,
          tenant_id: TENANT_ID,
          embedding: embeddingStr,
          metadata: {
            arsenal: ARSENAL,
            response_id: response.id,
            fragmented_at: new Date().toISOString(),
            source_version: 'v25.1_alineacion_sp_v26_4'
          }
        });

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        failed++;
      } else {
        console.log(`   ✅ Insertado`);
        processed++;
      }
    } catch (err) {
      console.error(`   ❌ Excepción: ${err.message}`);
      failed++;
    }

    // Throttle suave para no saturar Voyage API
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Procesados: ${processed} | ❌ Fallidos: ${failed}`);
  console.log('='.repeat(60));
}

async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔧 RE-FRAGMENTACIÓN ARSENAL_INICIAL — v25.1`);
  console.log('='.repeat(60));

  await purgarFragmentos();
  await fragmentar();

  console.log('\n🎉 Proceso completado');
  console.log('💡 El caché de Queswa se actualizará en ~5 minutos.\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
