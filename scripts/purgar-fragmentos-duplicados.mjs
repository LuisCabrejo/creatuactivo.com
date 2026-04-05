/**
 * Purga fragmentos duplicados y re-sincroniza Supabase con archivos locales
 *
 * PROBLEMA: arsenal_inicial tiene 223 fragmentos (debería tener ~38).
 *           Cada fragmento fue creado 6 veces por re-ejecuciones del script.
 *           Esto degrada el vector search al retornar 6 copias del mismo fragmento.
 *
 * SOLUCIÓN: Eliminar TODOS los fragmentos de arsenales con duplicados,
 *           luego re-ejecutar fragmentar-arsenales-voyage.mjs.
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

const supabase = createClient(supabaseUrl, supabaseKey);

// Arsenales con duplicados confirmados por la auditoría
const ARSENALES_A_PURGAR = [
  'arsenal_inicial',
  'arsenal_avanzado',
  'arsenal_compensacion', // también tiene desync (25 vs 38 — posibles fragmentos obsoletos)
];

async function purgarArsenal(arsenalName) {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🗑️  Purgando fragmentos: ${arsenalName}`);

  // Primero contar cuántos hay
  const { data: existing, error: countError } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .eq('metadata->>parent_arsenal', arsenalName);

  if (countError) {
    console.error(`   ❌ Error contando: ${countError.message}`);
    return 0;
  }

  console.log(`   📊 Fragmentos encontrados: ${existing?.length || 0}`);

  if (!existing?.length) {
    console.log(`   ℹ️  Sin fragmentos que purgar`);
    return 0;
  }

  // Eliminar en lotes de 50
  const ids = existing.map(d => d.id);
  let deleted = 0;
  const batchSize = 50;

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const { error: deleteError } = await supabase
      .from('nexus_documents')
      .delete()
      .in('id', batch);

    if (deleteError) {
      console.error(`   ❌ Error eliminando lote ${i}–${i + batchSize}: ${deleteError.message}`);
    } else {
      deleted += batch.length;
      console.log(`   ✅ Eliminados ${deleted}/${ids.length}...`);
    }
  }

  return deleted;
}

async function main() {
  console.log('🧹 PURGA DE FRAGMENTOS DUPLICADOS');
  console.log('===================================\n');
  console.log('Arsenales objetivo:', ARSENALES_A_PURGAR.join(', '));
  console.log('\n⚠️  Esta operación es reversible: fragmentar-arsenales-voyage.mjs los re-crea.\n');

  let totalDeleted = 0;

  for (const arsenal of ARSENALES_A_PURGAR) {
    const count = await purgarArsenal(arsenal);
    totalDeleted += count;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ PURGA COMPLETADA`);
  console.log(`   Total eliminados: ${totalDeleted}`);
  console.log('\n📋 SIGUIENTE PASO:');
  console.log('   node scripts/fragmentar-arsenales-voyage.mjs');
  console.log('   (Selecciona solo los arsenales purgados)\n');
}

main().catch(console.error);
