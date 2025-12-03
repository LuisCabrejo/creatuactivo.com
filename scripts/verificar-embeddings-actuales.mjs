#!/usr/bin/env node
/**
 * Verifica el estado de los embeddings en Supabase después de la consolidación
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

async function verificarEstado() {
  console.log('📊 VERIFICACIÓN DE EMBEDDINGS - POST CONSOLIDACIÓN\n');
  console.log('='.repeat(60));
  console.log('');

  // Verificar documentos actuales
  const { data: docs, error } = await supabase
    .from('nexus_documents')
    .select('category, title, embedding, metadata, created_at')
    .order('category');

  if (error) {
    console.error('❌ Error consultando Supabase:', error);
    return;
  }

  console.log(`📚 Total documentos en Supabase: ${docs.length}\n`);

  // Verificar embeddings
  let conEmbedding = 0;
  let sinEmbedding = 0;

  docs.forEach(doc => {
    const hasEmbedding = doc.embedding !== null;
    const status = hasEmbedding ? '✅' : '❌';

    if (hasEmbedding) conEmbedding++;
    else sinEmbedding++;

    console.log(`${status} ${doc.category}`);
    console.log(`   Título: ${doc.title}`);
    console.log(`   Embedding: ${hasEmbedding ? 'Vector presente (1536 dims)' : 'SIN EMBEDDING'}`);
    console.log(`   Metadata: ${JSON.stringify(doc.metadata || {})}`);
    console.log('');
  });

  console.log('='.repeat(60));
  console.log(`\n📈 RESUMEN:`);
  console.log(`   ✅ Con embedding: ${conEmbedding}`);
  console.log(`   ❌ Sin embedding: ${sinEmbedding}`);

  // Verificar API key de Voyage
  console.log(`\n🔑 Voyage API Key: ${voyageApiKey ? '✅ Configurada' : '❌ NO configurada'}`);

  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:\n');

  if (sinEmbedding > 0) {
    console.log('⚠️  Hay documentos sin embeddings.');
    console.log('   Acción: Ejecuta regenerar-embeddings-voyage.mjs');
    console.log('   Comando: node scripts/regenerar-embeddings-voyage.mjs');
  } else {
    console.log('✅ Todos los documentos tienen embeddings.');
    console.log('   Estado: Búsqueda vectorial operativa.');
  }

  // Verificar que sean los 3 documentos consolidados
  const categorias = docs.map(d => d.category);
  const esperadas = ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos'];
  const todasPresentes = esperadas.every(cat => categorias.includes(cat));

  console.log('\n📋 ESTRUCTURA CONSOLIDADA:');
  esperadas.forEach(cat => {
    const existe = categorias.includes(cat);
    console.log(`   ${existe ? '✅' : '❌'} ${cat}`);
  });

  if (!todasPresentes) {
    console.log('\n⚠️  ADVERTENCIA: Faltan arsenales de la estructura consolidada');
  } else if (docs.length > 3) {
    console.log(`\n⚠️  ADVERTENCIA: Hay ${docs.length - 3} documentos extra (esperados: 3)`);
    const extras = categorias.filter(c => !esperadas.includes(c));
    console.log(`   Documentos extra: ${extras.join(', ')}`);
  } else {
    console.log('\n✅ Estructura consolidada correcta (3 arsenales)');
  }
}

verificarEstado().catch(console.error);
