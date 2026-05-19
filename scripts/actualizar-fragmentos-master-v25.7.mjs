#!/usr/bin/env node
/**
 * Actualiza los 3 fragmentos Master del Director Académico en nexus_documents:
 *   • arsenal_inicial_WHY_01  (Master v5.0 — ¿Qué es CreaTuActivo?)
 *   • arsenal_inicial_WHY_02  (Master v6.0 — ¿Cómo funciona el negocio?)
 *   • arsenal_inicial_EAM_01  (Master v5.1 — ¿Cuál es la metodología operativa?)
 *
 * Lee el contenido actualizado desde knowledge_base/arsenal_inicial.txt v25.7
 * y regenera embeddings Voyage AI (1536 dimensiones para coincidir con el resto).
 *
 * Los 3 fragmentos llevan marcador [VERBATIM_LOCK] en el cuerpo — el system prompt
 * v26.7 (deployado en paralelo) reconoce el marcador y entrega delivery exacto.
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
  console.error('❌ Variables de entorno no configuradas (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VOYAGE_API_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEmbedding(text, model = 'voyage-large-2') {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model, // voyage-large-2 (1536) o voyage-3-lite (512)
      input: model === 'voyage-3-lite' ? text.substring(0, 8000) : text,
      input_type: 'document',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage AI ${model} error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  if (!data.data || !data.data[0]) {
    console.error(`Error Voyage AI (${model}):`, data);
    throw new Error(`Voyage AI ${model} no devolvió embedding`);
  }
  return data.data[0].embedding;
}

function formatPgvector(embedding) {
  return '[' + embedding.join(',') + ']';
}

async function actualizarFragmento(categoryId, nuevoContenido) {
  console.log(`\n🔄 Actualizando: ${categoryId}`);
  console.log(`   Longitud: ${nuevoContenido.length} caracteres`);

  // 🆕 FIX 2026-05-19: limpiar XML tags <verbatim_lock> del texto enviado a Voyage
  // El embedding debe representar la SEMÁNTICA del contenido, no los marcadores
  // estructurales. Las tags se conservan en `content` (lo que el LLM ve cuando se
  // recupera el fragmento), pero NO se incluyen en el embedding porque agregan
  // ruido al vector y reducen la similitud con queries coloquiales del usuario.
  // Razón doctrinal: Hipótesis B+C de investigación Gemini (18 May 2026).
  const textoParaEmbedding = nuevoContenido
    .replace(/<verbatim_lock>/g, '')
    .replace(/<\/verbatim_lock>/g, '')
    .replace(/\n{3,}/g, '\n\n')  // colapsar saltos múltiples residuales
    .trim();

  console.log(`   Texto para embedding (sin XML tags): ${textoParaEmbedding.length} chars`);

  // 🆕 FIX 2026-05-19: generar AMBOS embeddings — 1536-dim Y 512-dim.
  // El código de búsqueda en route.ts línea 997 usa `embedding_512` (voyage-3-lite,
  // 512 dim) para fragmentos, NO `embedding` (voyage-large-2, 1536 dim).
  // Si solo actualizamos `embedding`, los embeddings nuevos jamás se buscan.
  // Bug raíz histórico: 2 rondas previas de re-fragmentación no tuvieron efecto
  // porque solo tocaban la columna inutilizada.
  console.log('   Generando embedding 1536-dim (voyage-large-2)...');
  const embedding1536 = await getEmbedding(textoParaEmbedding, 'voyage-large-2');
  console.log(`   ✓ Embedding 1536-dim: ${embedding1536.length} dimensiones`);

  console.log('   Generando embedding 512-dim (voyage-3-lite — usado por búsqueda)...');
  const embedding512 = await getEmbedding(textoParaEmbedding, 'voyage-3-lite');
  console.log(`   ✓ Embedding 512-dim:  ${embedding512.length} dimensiones`);

  // 🆕 FIX 2026-05-19: leer metadata existente y asegurar que is_fragment=true esté presente.
  // El cache de route.ts:1018 filtra por metadata.is_fragment === true. Si no está, el
  // fragmento queda invisible al RAG. Hubo regresión histórica donde 111 fragments
  // quedaron sin este flag (reparados con scripts/reparar-is-fragment-flag.mjs).
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('metadata')
    .eq('category', categoryId)
    .single();

  const metadataActualizado = {
    ...(existing?.metadata || {}),
    is_fragment: true, // GARANTIZAR que sea visible al cache de fragmentos
  };

  const { error } = await supabase
    .from('nexus_documents')
    .update({
      content: nuevoContenido,                        // CON XML tags (lo que el LLM verá)
      embedding: embedding1536,                        // 1536-dim (legacy, mantenido por compatibilidad)
      embedding_512: formatPgvector(embedding512),     // 512-dim (USADO POR EL CÓDIGO DE BÚSQUEDA)
      metadata: metadataActualizado,                   // preserva metadata + garantiza is_fragment
      updated_at: new Date().toISOString(),
    })
    .eq('category', categoryId);

  if (error) {
    console.error(`   ❌ Error:`, error);
    return false;
  }

  console.log('   ✅ Actualizado exitosamente');
  return true;
}

/**
 * Extrae una sección ### CODIGO: ... hasta el siguiente `---` separador.
 * Funciona para WHY_01, WHY_02, EAM_01 que terminan con --- delimitando el bloque.
 */
function extraerSeccion(arsenalContent, codigo) {
  const regex = new RegExp(`### \\*\\*${codigo}:[\\s\\S]*?(?=\\n---)`);
  const match = arsenalContent.match(regex);
  return match ? match[0].trim() : null;
}

async function main() {
  console.log('📦 Actualizando fragmentos Master del Director Académico (arsenal_inicial v25.7)\n');

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const arsenalContent = fs.readFileSync(arsenalPath, 'utf-8');

  const fragmentos = [
    { codigo: 'WHY_01', category: 'arsenal_inicial_WHY_01' },
    { codigo: 'WHY_02', category: 'arsenal_inicial_WHY_02' },
    { codigo: 'EAM_01', category: 'arsenal_inicial_EAM_01' },
  ];

  let exitos = 0;
  let fallos = 0;

  for (const { codigo, category } of fragmentos) {
    const contenido = extraerSeccion(arsenalContent, codigo);

    if (!contenido) {
      console.error(`\n❌ No se encontró sección ${codigo} en arsenal_inicial.txt`);
      fallos++;
      continue;
    }

    console.log(`\n📄 ${codigo}:`);
    console.log('   Preview:', contenido.substring(0, 150).replace(/\n/g, ' ') + '...');

    // Verificar que contenga el marcador <verbatim_lock> (XML tags desde v25.8)
    // o el legacy [VERBATIM_LOCK] (corchetes planos, deprecated)
    const tieneXML = contenido.includes('<verbatim_lock>');
    const tieneLegacy = contenido.includes('[VERBATIM_LOCK]');
    if (!tieneXML && !tieneLegacy) {
      console.warn(`   ⚠️  ${codigo} no contiene marcador <verbatim_lock> ni [VERBATIM_LOCK] — revise arsenal_inicial.txt`);
    } else if (tieneLegacy && !tieneXML) {
      console.warn(`   ⚠️  ${codigo} usa marcador legacy [VERBATIM_LOCK] — migre a <verbatim_lock> XML (canon v25.8+)`);
    }

    const ok = await actualizarFragmento(category, contenido);
    if (ok) exitos++;
    else fallos++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Éxitos: ${exitos}/${fragmentos.length}`);
  if (fallos > 0) console.log(`❌ Fallos: ${fallos}`);
  console.log(`${'='.repeat(60)}`);
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
