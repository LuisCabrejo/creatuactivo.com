#!/usr/bin/env node
/**
 * Actualiza fragmentos específicos que fueron modificados en el arsenal
 * - COMP_MODELO_01: Removido "no por personas inscritas"
 * - COMP_BIN_08: Nueva tabla canónica con 56 CV/persona
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
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'voyage-large-2',  // 1536 dimensions to match existing embeddings
      input: text,
      input_type: 'document'
    })
  });

  const data = await response.json();
  if (!data.data || !data.data[0]) {
    console.error('Error Voyage AI:', data);
    throw new Error('Voyage AI no devolvió embedding');
  }
  return data.data[0].embedding;
}

async function actualizarFragmento(fragmentId, nuevoContenido) {
  console.log(`\n🔄 Actualizando: ${fragmentId}`);
  console.log(`   Longitud: ${nuevoContenido.length} caracteres`);

  // Generar nuevo embedding
  console.log('   Generando embedding con Voyage AI...');
  const embedding = await getEmbedding(nuevoContenido);
  console.log(`   Embedding generado: ${embedding.length} dimensiones`);

  // Actualizar en Supabase por category (no fragment_id)
  const { error } = await supabase
    .from('nexus_documents')
    .update({
      content: nuevoContenido,
      // La columna `embedding` (vector 1536, el mismo de 512 rellenado con ceros)
      // se dejó de escribir el 7 ago 2026 y se dropeó: existía solo para el RPC
      // match_documents, muerto desde su origen. La búsqueda viva usa
      // embedding_512 vía match_fragments_512.
      updated_at: new Date().toISOString()
    })
    .eq('category', fragmentId);

  if (error) {
    console.error(`   ❌ Error:`, error);
    return false;
  }

  console.log('   ✅ Actualizado exitosamente');
  return true;
}

async function main() {
  // Leer arsenal_compensacion actualizado
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_compensacion.txt');
  const arsenalContent = fs.readFileSync(arsenalPath, 'utf-8');

  // Extraer COMP_MODELO_01 actualizado
  const modeloMatch = arsenalContent.match(/### COMP_MODELO_01:[\s\S]*?(?=\n---)/);
  const modeloContent = modeloMatch ? modeloMatch[0].trim() : null;

  // Extraer COMP_BIN_08 actualizado
  const binMatch = arsenalContent.match(/### COMP_BIN_08:[\s\S]*?(?=\n---)/);
  const binContent = binMatch ? binMatch[0].trim() : null;

  console.log('📦 Actualizando fragmentos modificados v17.6.0...\n');

  if (modeloContent) {
    console.log('📄 COMP_MODELO_01:');
    console.log('   Preview:', modeloContent.substring(0, 150).replace(/\n/g, ' ') + '...');
    await actualizarFragmento('arsenal_compensacion_COMP_MODELO_01', modeloContent);
  } else {
    console.error('❌ No se encontró COMP_MODELO_01');
  }

  if (binContent) {
    console.log('\n📄 COMP_BIN_08:');
    console.log('   Preview:', binContent.substring(0, 150).replace(/\n/g, ' ') + '...');
    await actualizarFragmento('arsenal_compensacion_COMP_BIN_08', binContent);
  } else {
    console.error('❌ No se encontró COMP_BIN_08');
  }

  console.log('\n✅ Proceso completado');
}

main().catch(console.error);
