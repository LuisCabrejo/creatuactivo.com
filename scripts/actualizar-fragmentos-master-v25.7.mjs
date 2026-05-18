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

async function getEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-large-2', // 1536 dim para coincidir con embeddings existentes
      input: text,
      input_type: 'document',
    }),
  });

  const data = await response.json();
  if (!data.data || !data.data[0]) {
    console.error('Error Voyage AI:', data);
    throw new Error('Voyage AI no devolvió embedding');
  }
  return data.data[0].embedding;
}

async function actualizarFragmento(categoryId, nuevoContenido) {
  console.log(`\n🔄 Actualizando: ${categoryId}`);
  console.log(`   Longitud: ${nuevoContenido.length} caracteres`);

  console.log('   Generando embedding con Voyage AI...');
  const embedding = await getEmbedding(nuevoContenido);
  console.log(`   Embedding generado: ${embedding.length} dimensiones`);

  const { error } = await supabase
    .from('nexus_documents')
    .update({
      content: nuevoContenido,
      embedding: embedding,
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

    // Verificar que contenga el marcador VERBATIM_LOCK
    if (!contenido.includes('[VERBATIM_LOCK]')) {
      console.warn(`   ⚠️  ${codigo} no contiene marcador [VERBATIM_LOCK] — revise arsenal_inicial.txt`);
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
