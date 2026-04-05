/**
 * Elimina fragmentos huérfanos de arsenal_compensacion
 * (sin metadata.parent_arsenal — generados antes de la actualización del script)
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

const { data: allComp } = await supabase
  .from('nexus_documents')
  .select('id, category, metadata')
  .like('category', 'arsenal_compensacion_%');

console.log(`\nDocs con category arsenal_compensacion_*: ${allComp?.length}`);

const orphans = allComp?.filter(d => !d.metadata?.parent_arsenal) || [];
const proper  = allComp?.filter(d =>  d.metadata?.parent_arsenal) || [];

console.log(`  Con parent_arsenal (correctos): ${proper.length}`);
console.log(`  Sin parent_arsenal (huérfanos): ${orphans.length}`);

if (orphans.length > 0) {
  console.log('\nHuérfanos a eliminar:');
  for (const o of orphans) console.log(`  ${o.category}`);

  const ids = orphans.map(d => d.id);
  const { error } = await supabase.from('nexus_documents').delete().in('id', ids);
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log(`\n✅ Eliminados ${ids.length} fragmentos huérfanos`);
    console.log('📋 Próximo paso: node scripts/refragmentar-3-arsenales.mjs');
    console.log('   (solo arsenal_compensacion — los otros ya están correctos)');
  }
} else {
  console.log('\n✅ Sin huérfanos — no se requiere acción');
}
