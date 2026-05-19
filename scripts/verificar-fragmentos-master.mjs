#!/usr/bin/env node
/**
 * Verificación directa: ¿existen WHY_01/WHY_02/EAM_01 en Supabase como fragmentos
 * cacheables (is_fragment: true en metadata)?
 *
 * El cache de fragmentos en route.ts:1018 filtra por `metadata.is_fragment === true`.
 * Si los fragmentos no tienen ese flag, no entran al cache y "No fragments found"
 * resulta en fallback al búsqueda léxica.
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

async function main() {
  console.log('🔍 Verificando estado de fragmentos en Supabase\n');

  // 1. Conteo total de fragmentos con is_fragment=true
  const { data: allFragments, error: e1 } = await supabase
    .from('nexus_documents')
    .select('category, metadata, embedding_512')
    .or('category.like.arsenal_%_%, category.like.catalogo_productos_%');

  if (e1) {
    console.error('❌ Error consultando:', e1);
    process.exit(1);
  }

  const total = allFragments.length;
  const conIsFragmentTrue = allFragments.filter(d => d.metadata?.is_fragment === true).length;
  const conIsFragmentFalse = allFragments.filter(d => d.metadata?.is_fragment === false).length;
  const sinFlag = allFragments.filter(d => d.metadata?.is_fragment === undefined).length;
  const conEmbedding512 = allFragments.filter(d => d.embedding_512 !== null).length;

  console.log(`📊 Total fragmentos con category arsenal_*_* o catalogo_*: ${total}`);
  console.log(`   ✓ Con metadata.is_fragment === true:  ${conIsFragmentTrue}`);
  console.log(`   ✗ Con metadata.is_fragment === false: ${conIsFragmentFalse}`);
  console.log(`   ? Sin flag is_fragment (undefined):   ${sinFlag}`);
  console.log(`   ✓ Con embedding_512 no nulo:           ${conEmbedding512}\n`);

  // 2. Inspección específica de los 3 fragments críticos
  const criticos = ['arsenal_inicial_WHY_01', 'arsenal_inicial_WHY_02', 'arsenal_inicial_EAM_01'];

  for (const cat of criticos) {
    const { data, error } = await supabase
      .from('nexus_documents')
      .select('category, title, embedding_512, metadata, updated_at')
      .eq('category', cat)
      .single();

    if (error) {
      console.log(`❌ ${cat}: NO ENCONTRADO en Supabase\n`);
      continue;
    }

    const hasEmbedding512 = data.embedding_512 !== null;
    const isFragment = data.metadata?.is_fragment;
    const updatedAt = new Date(data.updated_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    console.log(`📄 ${cat}:`);
    console.log(`   title:              "${data.title?.substring(0, 60)}..."`);
    console.log(`   embedding_512:      ${hasEmbedding512 ? '✓ presente' : '✗ NULL'}`);
    console.log(`   is_fragment flag:   ${isFragment === undefined ? '✗ AUSENTE (problema)' : (isFragment ? '✓ true' : '✗ false (problema)')}`);
    console.log(`   metadata completa:  ${JSON.stringify(data.metadata)}`);
    console.log(`   updated_at:         ${updatedAt}\n`);
  }

  // 3. Sample de los 50 fragmentos en cache para ver qué categorías hay
  const arsenales = {};
  for (const f of allFragments) {
    if (f.metadata?.is_fragment === true) {
      const prefix = f.category.split('_').slice(0, 2).join('_');
      arsenales[prefix] = (arsenales[prefix] || 0) + 1;
    }
  }

  console.log('📊 Distribución de fragmentos cacheables por arsenal:');
  for (const [prefix, count] of Object.entries(arsenales).sort()) {
    console.log(`   ${prefix.padEnd(30)} ${count} fragmentos`);
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
