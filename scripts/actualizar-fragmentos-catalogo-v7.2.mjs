#!/usr/bin/env node
/**
 * Actualiza fragmentos del catálogo con <verbatim_lock> v7.2 (22 May 2026).
 *
 * Causa: ante "¿Cuál es el producto?" el modelo alucinaba "Ganotea", "Gano Cocoa",
 * "Gano Supreme", "Ganocafé Negro" — nombres simplificados que el modelo inventa
 * cuando la tabla canónica no tiene marcador verbatim. Además omitía la categoría
 * de Suplementos (mencionaba solo 2 de 4 categorías reales).
 *
 * Cambios:
 *   - PROD_OVERVIEW (NUEVO): vista global de las 4 categorías canónicas en verbatim.
 *   - BEB_01: tabla 9 bebidas en verbatim + triggers ampliados ("productos", "bebidas").
 *   - LUV_01: tabla LUVOCO en verbatim.
 *   - SUP_01: tabla 3 suplementos en verbatim + nota "es 1 de 4 categorías — nunca omitir".
 *   - PERS_01: tabla 6 cuidado personal en verbatim.
 *
 * Genera AMBOS embeddings (voyage-large-2 + voyage-3-lite) — el código de búsqueda
 * en route.ts usa embedding_512.
 *
 * Uso: node scripts/actualizar-fragmentos-catalogo-v7.2.mjs
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
  const regex = new RegExp(`### ${codigo}:[\\s\\S]*?</verbatim_lock>`);
  const match = arsenalContent.match(regex);
  return match ? match[0].trim() : null;
}

async function upsertFragmento(categoryId, nuevoContenido) {
  console.log(`\n🔄 Procesando: ${categoryId}`);
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

  // ¿Existe? → update. ¿No existe? → insert.
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, metadata')
    .eq('category', categoryId)
    .maybeSingle();

  const metadataActualizado = {
    ...(existing?.metadata || {}),
    is_fragment: true,
    parent_document: 'catalogo_productos',
  };

  if (existing) {
    const { error } = await supabase
      .from('nexus_documents')
      .update({
        content: nuevoContenido,
        embedding: embedding1536,
        embedding_512: formatPgvector(embedding512),
        metadata: metadataActualizado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      console.error(`   ❌ Error UPDATE:`, error.message);
      return false;
    }
    console.log(`   ✅ Actualizado (UPDATE)`);
    return true;
  } else {
    const { error } = await supabase
      .from('nexus_documents')
      .insert({
        category: categoryId,
        title: categoryId,
        content: nuevoContenido,
        embedding: embedding1536,
        embedding_512: formatPgvector(embedding512),
        metadata: metadataActualizado,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(`   ❌ Error INSERT:`, error.message);
      return false;
    }
    console.log(`   ✅ Creado (INSERT)`);
    return true;
  }
}

async function main() {
  console.log('📦 Catálogo v7.2 — verbatim_lock en tablas canónicas + PROD_OVERVIEW\n');
  console.log('='.repeat(70));

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'catalogo_productos.txt');
  const arsenalContent = fs.readFileSync(arsenalPath, 'utf-8');

  const fragmentos = [
    { codigo: 'PROD_OVERVIEW', category: 'catalogo_productos_PROD_OVERVIEW' },
    { codigo: 'BEB_01', category: 'catalogo_productos_BEB_01' },
    { codigo: 'LUV_01', category: 'catalogo_productos_LUV_01' },
    { codigo: 'SUP_01', category: 'catalogo_productos_SUP_01' },
    { codigo: 'PERS_01', category: 'catalogo_productos_PERS_01' },
  ];

  let exitos = 0;
  let fallos = 0;

  for (const { codigo, category } of fragmentos) {
    const contenido = extraerSeccion(arsenalContent, codigo);

    if (!contenido) {
      console.error(`\n❌ No se encontró sección ${codigo} en catalogo_productos.txt`);
      fallos++;
      continue;
    }

    if (!contenido.includes('<verbatim_lock>')) {
      console.error(`\n❌ ${codigo} no contiene <verbatim_lock> — revisar arsenal`);
      fallos++;
      continue;
    }

    console.log(`\n📄 ${codigo} preview: ${contenido.substring(0, 120).replace(/\n/g, ' ')}...`);

    const ok = await upsertFragmento(category, contenido);
    if (ok) exitos++;
    else fallos++;
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Éxitos: ${exitos}/${fragmentos.length}`);
  if (fallos > 0) console.log(`❌ Fallos: ${fallos}`);
  console.log('='.repeat(70));
  console.log('\n📋 Próximo paso: probar en local "¿Cuál es el producto?" → debe entregar PROD_OVERVIEW con 4 categorías.');
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
