#!/usr/bin/env node
/**
 * REPARACIÓN: agrega metadata.is_fragment = true a los 111 fragmentos
 * de arsenal_*_* que fueron creados sin ese flag.
 *
 * Causa raíz: el script de fragmentación inicial (fragmentar-arsenales-voyage.mjs)
 * no añadió el flag al metadata. El cache de route.ts:1018 filtra estrictamente
 * por `metadata.is_fragment === true`, por lo que estos 111 fragmentos quedaron
 * invisibles al RAG desde el 15 May 2026.
 *
 * Verificado en 18 May 2026:
 *   - 50 fragmentos tenían is_fragment: true (ganocafe, marca, catalogo)
 *   - 111 fragmentos sin flag (arsenal_inicial, _avanzado, _compensacion, _reto, _12_niveles)
 *   - 2 con is_fragment: false (revisar separado si hace falta)
 *
 * Esta reparación es idempotente — solo toca fragments con flag ausente.
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
  console.log('🔧 Reparando metadata.is_fragment en fragmentos arsenal_*_*\n');

  // Paso 1: identificar fragments sin el flag (category formato arsenal_*_* o catalogo_*_*)
  const { data: candidatos, error: e1 } = await supabase
    .from('nexus_documents')
    .select('id, category, metadata')
    .or('category.like.arsenal_%_%, category.like.catalogo_productos_%');

  if (e1) {
    console.error('❌ Error consultando:', e1);
    process.exit(1);
  }

  const sinFlag = candidatos.filter(d => d.metadata?.is_fragment === undefined);
  console.log(`📊 Fragments con flag ausente: ${sinFlag.length} de ${candidatos.length} totales\n`);

  if (sinFlag.length === 0) {
    console.log('✅ Todos los fragments ya tienen is_fragment definido. Nada que reparar.');
    return;
  }

  // Paso 2: distribución por arsenal para reportar antes de reparar
  const distribucion = {};
  for (const d of sinFlag) {
    const prefix = d.category.split('_').slice(0, 2).join('_');
    distribucion[prefix] = (distribucion[prefix] || 0) + 1;
  }
  console.log('📊 Distribución por arsenal:');
  for (const [prefix, count] of Object.entries(distribucion).sort()) {
    console.log(`   ${prefix.padEnd(30)} ${count} fragments a reparar`);
  }
  console.log();

  // Paso 3: actualizar cada fragment agregando is_fragment: true al metadata existente
  let ok = 0;
  let fail = 0;
  for (const doc of sinFlag) {
    const metadataActualizado = {
      ...(doc.metadata || {}),
      is_fragment: true,
    };

    const { error } = await supabase
      .from('nexus_documents')
      .update({
        metadata: metadataActualizado,
        updated_at: new Date().toISOString(),
      })
      .eq('id', doc.id);

    if (error) {
      console.error(`   ❌ ${doc.category}: ${error.message}`);
      fail++;
    } else {
      ok++;
      if (ok % 20 === 0) {
        process.stdout.write(`   ✓ ${ok}/${sinFlag.length} actualizados...\r`);
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Reparados: ${ok}`);
  if (fail > 0) console.log(`❌ Fallos:    ${fail}`);
  console.log(`${'='.repeat(60)}`);

  // Paso 4: verificación post-reparación
  console.log('\n🔍 Verificación post-reparación:');
  const { data: ahora } = await supabase
    .from('nexus_documents')
    .select('category, metadata')
    .or('category.like.arsenal_%_%, category.like.catalogo_productos_%');

  const conFlag = ahora.filter(d => d.metadata?.is_fragment === true).length;
  console.log(`   Fragments con is_fragment === true: ${conFlag} (esperado: ~${candidatos.length})`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
