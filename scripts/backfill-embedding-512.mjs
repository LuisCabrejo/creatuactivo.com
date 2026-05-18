/**
 * Copyright © 2026 CreaTuActivo.com
 * BACKFILL embedding_512 — Repara deuda técnica histórica
 *
 * PROBLEMA RESUELTO:
 * Los arsenales del tenant `creatuactivo_marketing` (arsenal_inicial, arsenal_avanzado,
 * arsenal_compensacion, arsenal_reto) tienen NULL en la columna `embedding_512`.
 * Esto causa que `searchArsenalFragments()` (route.ts) los descarte y caiga al fallback
 * de cargar el arsenal completo (~60K chars), perdiendo la selección por fragmento.
 *
 * Síntoma: Queswa improvisa respuestas mezclando WHY_01 + WHY_02 + STORY sin formato canónico.
 *
 * SOLUCIÓN:
 * Para cada fragment sin embedding_512, generar el embedding 512-dim con voyage-3-lite
 * (mismo modelo que usa el fragmenter original) y hacer UPDATE.
 *
 * Idempotente: solo procesa fragments con embedding_512 IS NULL.
 * Safe to re-run.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const voyageApiKey = process.env.VOYAGE_API_KEY;

if (!voyageApiKey) {
  console.error('❌ VOYAGE_API_KEY no configurado');
  process.exit(1);
}

async function getEmbedding512(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text.substring(0, 8000),
      input_type: 'document'
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage API error: ${response.status} - ${err}`);
  }
  const data = await response.json();
  return data.data[0].embedding;
}

function formatPgvector(embedding) {
  return '[' + embedding.join(',') + ']';
}

async function main() {
  console.log('🔍 Buscando fragments sin embedding_512...\n');

  const { data: fragments, error } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .like('category', 'arsenal_%_%')
    .is('embedding_512', null);

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  if (!fragments || fragments.length === 0) {
    console.log('✅ Todos los fragments ya tienen embedding_512. Nada que hacer.');
    return;
  }

  console.log(`📋 ${fragments.length} fragments a procesar:\n`);

  // Agrupar por arsenal para reporte
  const byArsenal = {};
  fragments.forEach(f => {
    const arsenal = f.category.match(/^(arsenal_[a-z_0-9]+?)_[A-Z]+/)?.[1] ?? 'unknown';
    byArsenal[arsenal] = (byArsenal[arsenal] ?? 0) + 1;
  });
  Object.entries(byArsenal).forEach(([ars, count]) => {
    console.log(`   ${ars.padEnd(25)} ${count} fragments`);
  });
  console.log('');

  let success = 0;
  let failed = 0;

  for (let i = 0; i < fragments.length; i++) {
    const f = fragments[i];
    const progress = `[${(i + 1).toString().padStart(3)}/${fragments.length}]`;

    try {
      // Incluir título en el texto para mejor matching (mismo patrón del fragmenter)
      const textForEmbedding = f.title
        ? `${f.title}\n\n${f.content}`
        : f.content;

      const embedding = await getEmbedding512(textForEmbedding);
      const embeddingFormatted = formatPgvector(embedding);

      const { error: updateError } = await supabase
        .from('nexus_documents')
        .update({
          embedding_512: embeddingFormatted,
          updated_at: new Date().toISOString()
        })
        .eq('id', f.id);

      if (updateError) {
        console.log(`${progress} ❌ ${f.category} — UPDATE error: ${updateError.message}`);
        failed++;
      } else {
        console.log(`${progress} ✅ ${f.category}`);
        success++;
      }
    } catch (err) {
      console.log(`${progress} ❌ ${f.category} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Resultado: ${success} OK · ${failed} fallidos`);
  if (failed === 0) {
    console.log('✅ Backfill completo. searchArsenalFragments() ya puede usar todos los fragments.');
  }
}

main().catch(console.error);
