#!/usr/bin/env node
/**
 * Actualiza FREQ_03 (copy v5.2 — cierre simple sin Klaff Prize Frame)
 * y purga los fragments obsoletos CIERRE_01 + CIERRE_02 que fueron colapsados.
 *
 * Razón:
 *   - CIERRE_01 contenía Klaff Prize Frame de "7-10 horas semanales" (entrevista BANT
 *     prematura, eliminada en Opción B / FSM colapsado).
 *   - CIERRE_02 era el follow-up del Estado 1 (también eliminado).
 *   - FREQ_03 absorbió ambos triggers + recibió copy v5.2 (Lujo Clínico accesible,
 *     sin "Asignación de Capital", sin "tecnología nutricional", con datos tangibles
 *     por nivel) + <verbatim_lock> para evitar alucinaciones tipo "equipo de Dirección
 *     Estratégica con inventario en su zona".
 *
 * Genera AMBOS embeddings (voyage-large-2 + voyage-3-lite) — el código de búsqueda
 * en route.ts usa embedding_512.
 *
 * Uso: node scripts/actualizar-fragmentos-cierre-v5.2.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const voyageApiKey = process.env.VOYAGE_API_KEY;

if (!supabaseUrl || !supabaseKey || !voyageApiKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEmbedding(text, model = 'voyage-large-2') {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${voyageApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: model === 'voyage-3-lite' ? text.substring(0, 8000) : text,
      input_type: 'document',
    }),
  });
  if (!response.ok) {
    throw new Error(`Voyage AI ${model}: ${response.status} ${await response.text()}`);
  }
  const data = await response.json();
  return data.data[0].embedding;
}

function formatPgvector(embedding) {
  return '[' + embedding.join(',') + ']';
}

function extraerSeccion(arsenalContent, codigo) {
  const regex = new RegExp(`### \\*\\*${codigo}:[\\s\\S]*?</verbatim_lock>`);
  const match = arsenalContent.match(regex);
  return match ? match[0].trim() : null;
}

async function actualizarFragmento(categoryId, nuevoContenido) {
  console.log(`\n🔄 Actualizando: ${categoryId}`);
  console.log(`   Longitud: ${nuevoContenido.length} chars`);

  const textoParaEmbedding = nuevoContenido
    .replace(/<verbatim_lock>/g, '')
    .replace(/<\/verbatim_lock>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  console.log(`   Generando embedding 1536-dim (voyage-large-2)...`);
  const embedding1536 = await getEmbedding(textoParaEmbedding, 'voyage-large-2');

  console.log(`   Generando embedding 512-dim (voyage-3-lite)...`);
  const embedding512 = await getEmbedding(textoParaEmbedding, 'voyage-3-lite');

  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('metadata')
    .eq('category', categoryId)
    .single();

  const metadataActualizado = {
    ...(existing?.metadata || {}),
    is_fragment: true,
  };

  const { error } = await supabase
    .from('nexus_documents')
    .update({
      content: nuevoContenido,
      embedding: embedding1536,
      embedding_512: formatPgvector(embedding512),
      metadata: metadataActualizado,
      updated_at: new Date().toISOString(),
    })
    .eq('category', categoryId);

  if (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
  console.log(`   ✅ Actualizado`);
  return true;
}

async function purgarFragmento(categoryId) {
  console.log(`\n🗑️  Purgando: ${categoryId}`);
  const { error, count } = await supabase
    .from('nexus_documents')
    .delete({ count: 'exact' })
    .eq('category', categoryId);

  if (error) {
    console.error(`   ❌ Error:`, error.message);
    return false;
  }
  console.log(`   ✅ Eliminado (${count ?? 0} fila${count === 1 ? '' : 's'})`);
  return true;
}

async function main() {
  console.log('📦 v5.2 — Cierre simplificado (FREQ_03 unificado, CIERRE_01/02 purgados)\n');
  console.log('='.repeat(70));

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const arsenalContent = fs.readFileSync(arsenalPath, 'utf-8');

  // 1. Actualizar FREQ_03 con copy v5.2
  const freq03 = extraerSeccion(arsenalContent, 'FREQ_03');
  if (!freq03) {
    console.error('❌ No se encontró FREQ_03 en arsenal_inicial.txt');
    process.exit(1);
  }

  if (!freq03.includes('<verbatim_lock>')) {
    console.error('❌ FREQ_03 no contiene <verbatim_lock> — revise el arsenal');
    process.exit(1);
  }

  console.log('\n📄 FREQ_03 (preview):');
  console.log('   ' + freq03.substring(0, 200).replace(/\n/g, ' ') + '...');

  const okFreq03 = await actualizarFragmento('arsenal_inicial_FREQ_03', freq03);

  // 2. Purgar fragments obsoletos
  console.log('\n' + '─'.repeat(70));
  console.log('🗑️  Purgando fragments obsoletos (colapsados en FREQ_03):');

  const okCierre01 = await purgarFragmento('arsenal_inicial_CIERRE_01');
  const okCierre02 = await purgarFragmento('arsenal_inicial_CIERRE_02');

  console.log('\n' + '='.repeat(70));
  console.log(`✅ FREQ_03 actualizado: ${okFreq03 ? 'OK' : 'FALLÓ'}`);
  console.log(`✅ CIERRE_01 purgado:  ${okCierre01 ? 'OK' : 'FALLÓ'}`);
  console.log(`✅ CIERRE_02 purgado:  ${okCierre02 ? 'OK' : 'FALLÓ'}`);
  console.log('='.repeat(70));
  console.log('\n📋 Próximo paso: probar "cómo se inicia?" en local (npm run dev).');
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
