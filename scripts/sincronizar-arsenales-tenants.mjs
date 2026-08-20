#!/usr/bin/env node
/**
 * © CreaTuActivo.com — propietario y confidencial
 *
 * Sincroniza los FRAGMENTOS de los arsenales de marketing hacia los tenants que
 * los consumen. Reemplaza a `clonar-arsenal-whatsapp.mjs`, que solo INSERTABA
 * categorías nuevas: los fragmentos modificados quedaban stale y los eliminados
 * sobrevivían para siempre. Ese defecto es la razón por la que la doctrina se
 * separaba entre repos, y por la que había que acordarse de purgar a mano.
 *
 * Aquí el destino es un ESPEJO: se borra lo que había de esos arsenales en el
 * tenant destino y se reinserta desde el origen. Idempotente, y las eliminaciones
 * se propagan solas.
 *
 * NO toca los arsenales propios de cada tenant (`arsenal_manejo` y
 * `arsenal_cierre` del Dashboard, `arsenal_ganocafe`, `arsenal_marca_personal`),
 * ni los documentos padre — solo fragmentos de la lista blanca de abajo.
 *
 *   node scripts/sincronizar-arsenales-tenants.mjs            # whatsapp + dashboard
 *   node scripts/sincronizar-arsenales-tenants.mjs --solo whatsapp
 *   node scripts/sincronizar-arsenales-tenants.mjs --dry
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const ORIGEN = 'creatuactivo_marketing';
const DESTINOS = ['whatsapp', 'dashboard'];
const ARSENALES = [
  'arsenal_inicial', 'arsenal_avanzado', 'arsenal_compensacion',
  'arsenal_12_niveles', 'catalogo_productos',
];

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const soloIdx = args.indexOf('--solo');
const destinos = soloIdx >= 0 ? [args[soloIdx + 1]] : DESTINOS;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const esDeMarketing = (cat) => ARSENALES.some((a) => cat.startsWith(`${a}_`));

async function main() {
  console.log(`\n🔄 Sincronizando fragmentos  ${ORIGEN} → ${destinos.join(', ')}${dry ? '  (DRY RUN)' : ''}\n`);

  const { data: origen, error } = await supabase
    .from('nexus_documents')
    .select('category, title, content, embedding_512, metadata')
    .eq('tenant_id', ORIGEN);
  if (error) throw new Error(`leyendo el origen: ${error.message}`);

  const fuente = origen.filter(
    (d) => d.metadata?.is_fragment === true && esDeMarketing(d.category)
  );
  const conCandado = fuente.filter((d) => d.metadata?.has_verbatim_lock).length;
  console.log(`📚 Origen: ${fuente.length} fragmentos (${conCandado} con candado)\n`);

  if (!fuente.length) throw new Error('el origen no tiene fragmentos — abortando para no vaciar los destinos');

  for (const tenant of destinos) {
    const { data: previos } = await supabase
      .from('nexus_documents')
      .select('id, category, metadata')
      .eq('tenant_id', tenant);

    const aBorrar = (previos || []).filter(
      (d) => d.metadata?.is_fragment === true && esDeMarketing(d.category)
    );
    const propios = (previos || []).length - aBorrar.length;

    console.log(`── ${tenant}`);
    console.log(`   tenía ${aBorrar.length} fragmentos de marketing · conserva ${propios} documentos propios`);

    if (dry) {
      const nuevos = fuente.filter((f) => !aBorrar.some((p) => p.category === f.category));
      const idos = aBorrar.filter((p) => !fuente.some((f) => f.category === p.category));
      console.log(`   → quedaría en ${fuente.length}  (+${nuevos.length} nuevos, -${idos.length} eliminados)`);
      idos.forEach((d) => console.log(`      - ${d.category}`));
      nuevos.forEach((d) => console.log(`      + ${d.category}`));
      continue;
    }

    if (aBorrar.length) {
      const { error: e } = await supabase
        .from('nexus_documents').delete().in('id', aBorrar.map((d) => d.id));
      if (e) throw new Error(`borrando en ${tenant}: ${e.message}`);
    }

    const filas = fuente.map((d) => ({
      category: d.category, title: d.title, content: d.content,
      embedding_512: d.embedding_512, tenant_id: tenant,
      metadata: { ...d.metadata, cloned_from: ORIGEN, synced_at: new Date().toISOString() },
    }));
    for (let i = 0; i < filas.length; i += 50) {
      const { error: e } = await supabase.from('nexus_documents').insert(filas.slice(i, i + 50));
      if (e) throw new Error(`insertando en ${tenant}: ${e.message}`);
    }
    console.log(`   ✅ ${filas.length} fragmentos sincronizados\n`);
  }

  if (dry) { console.log('\n(dry run — nada escrito)'); return; }

  console.log('🔍 Verificación:');
  for (const tenant of [ORIGEN, ...destinos]) {
    const { count } = await supabase
      .from('nexus_documents')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant)
      .contains('metadata', { is_fragment: true });
    console.log(`   ${tenant.padEnd(24)} ${count}`);
  }
  console.log('\n⚠️  Los conteos de los destinos incluyen sus fragmentos propios, si los tienen.\n');
}

main().catch((e) => { console.error(`\n❌ ${e.message}\n`); process.exit(1); });
