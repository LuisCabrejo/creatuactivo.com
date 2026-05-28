#!/usr/bin/env node
/**
 * Ola 1 — Arsenal Inicial v5.5 — Modulación de Registro (24 May 2026)
 *
 * Actualiza fragments de arsenal_inicial con doctrina v5.5:
 *   - WHY_01: pregunta seguimiento conversacional
 *   - WHY_02: reescritura completa (versión corta Director Cabrejo + sin "Eso no es...")
 *   - WHY_03: pregunta seguimiento conversacional
 *   - FREQ_03: regresión "liquidez/Estructura Patrimonial este mes" → "se alinea con su decisión hoy"
 *   - FREQ_04: reescritura completa (12 velocidades / 2 explicadas + tablas, sin fórmula)
 *   - FREQ_04_PUENTE (NUEVO): para el 1% que pregunte por las otras 10 velocidades
 *   - VS_01: pregunta seguimiento conversacional
 *   - EAM_01: pregunta seguimiento conversacional
 *   - FREQ_05: pregunta seguimiento conversacional
 *   - OBJ_01: pregunta seguimiento conversacional
 *
 * Genera AMBOS embeddings (voyage-large-2 + voyage-3-lite).
 *
 * Uso: node scripts/actualizar-arsenal-inicial-v5.5.mjs
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

/**
 * Extrae sección — usa el próximo `### **` como delimitador estricto.
 * Funciona tanto para bloques con `<verbatim_lock>` (que terminan antes del `---`)
 * como para bloques sin él (que terminan también en el `---` previo al próximo `###`).
 */
function extraerSeccion(arsenalContent, codigo) {
  const regex = new RegExp(`### \\*\\*${codigo}:[\\s\\S]*?(?=\\n+---\\n+### \\*\\*|$)`);
  const match = arsenalContent.match(regex);
  return match ? match[0].trim() : null;
}

async function upsertFragmento(categoryId, nuevoContenido, parentArsenal = 'arsenal_inicial') {
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

  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, metadata')
    .eq('category', categoryId)
    .maybeSingle();

  const metadataActualizado = {
    ...(existing?.metadata || {}),
    is_fragment: true,
    parent_arsenal: parentArsenal,
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
  console.log('📦 Ola 1 — Arsenal Inicial v5.5 (Modulación de Registro)\n');
  console.log('='.repeat(70));

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const arsenalContent = fs.readFileSync(arsenalPath, 'utf-8');

  const fragmentos = [
    { codigo: 'WHY_01', category: 'arsenal_inicial_WHY_01' },
    { codigo: 'WHY_02', category: 'arsenal_inicial_WHY_02' },
    { codigo: 'WHY_03', category: 'arsenal_inicial_WHY_03' },
    { codigo: 'FREQ_03', category: 'arsenal_inicial_FREQ_03' },
    { codigo: 'FREQ_04', category: 'arsenal_inicial_FREQ_04' },
    { codigo: 'FREQ_04_PUENTE', category: 'arsenal_inicial_FREQ_04_PUENTE' }, // NUEVO
    { codigo: 'VS_01', category: 'arsenal_inicial_VS_01' },
    { codigo: 'EAM_01', category: 'arsenal_inicial_EAM_01' },
    { codigo: 'FREQ_05', category: 'arsenal_inicial_FREQ_05' },
    { codigo: 'OBJ_01', category: 'arsenal_inicial_OBJ_01' },
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

    console.log(`\n📄 ${codigo} preview: ${contenido.substring(0, 100).replace(/\n/g, ' ')}...`);

    const ok = await upsertFragmento(category, contenido);
    if (ok) exitos++;
    else fallos++;
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Éxitos: ${exitos}/${fragmentos.length}`);
  if (fallos > 0) console.log(`❌ Fallos: ${fallos}`);
  console.log('='.repeat(70));
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Probar en local "¿cómo funciona el negocio?" → debe entregar WHY_02 v5.5');
  console.log('   2. Probar "cómo se gana?" → debe mencionar 12 velocidades + 2 tablas');
  console.log('   3. Probar "cuáles son las otras formas de ganar?" → debe entregar FREQ_04_PUENTE');
  console.log('   4. Verificar que NO aparezca "liquidez/Estructura Patrimonial este mes"');
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
