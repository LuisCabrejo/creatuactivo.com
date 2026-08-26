#!/usr/bin/env node
/**
 * Despliegue de UN arsenal: purga → re-fragmenta → clona → verifica.
 *
 * Existe porque la receta de CLAUDE.md son cinco pasos que hay que dar
 * completos y en orden, y omitir uno falla en SILENCIO: sin purgar, el
 * fragmentador salta lo existente y no pasa nada; sin clonar, la web queda
 * al día y WhatsApp no — que es donde está el tráfico.
 *
 * Se despliega UN arsenal por corrida a propósito: si algo se rompe, el daño
 * queda acotado a ese arsenal y se restaura desde su .txt.
 *
 *   node scripts/desplegar-arsenal.mjs arsenal_inicial [--dry]
 */
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

const env = readFileSync('.env.local', 'utf8');
const g = k => env.match(new RegExp(`${k}=(.+)`))?.[1]?.trim();
const supabase = createClient(g('NEXT_PUBLIC_SUPABASE_URL'), g('SUPABASE_SERVICE_ROLE_KEY'));

// Dónde nace cada arsenal y a qué tenants se propaga.
const MAPA = {
  arsenal_inicial:        { origen: 'creatuactivo_marketing', clones: ['whatsapp', 'dashboard'], padre: 'deploy-arsenal-inicial.mjs' },
  arsenal_avanzado:       { origen: 'creatuactivo_marketing', clones: ['whatsapp', 'dashboard'], padre: 'deploy-arsenal-avanzado.mjs' },
  arsenal_compensacion:   { origen: 'creatuactivo_marketing', clones: ['whatsapp', 'dashboard'], padre: 'deploy-arsenal-compensacion.mjs' },
  arsenal_12_niveles:     { origen: 'creatuactivo_marketing', clones: ['whatsapp', 'dashboard'], padre: 'deploy-arsenal-12-niveles.mjs' },
  catalogo_productos:     { origen: 'creatuactivo_marketing', clones: ['whatsapp', 'dashboard'], padre: 'actualizar-catalogo-productos.mjs' },
  arsenal_ganocafe:       { origen: 'ecommerce',              clones: [],                        padre: 'deploy-arsenal-ganocafe.mjs' },
  arsenal_marca_personal: { origen: 'marca_personal',         clones: [],                        padre: 'deploy-arsenal-marca-personal.mjs' },
};

const arsenal = process.argv[2];
const dry = process.argv.includes('--dry');
if (!MAPA[arsenal]) { console.error(`Arsenal desconocido: ${arsenal}\nOpciones: ${Object.keys(MAPA).join(', ')}`); process.exit(1); }
const { origen, clones, padre } = MAPA[arsenal];

const contar = async () => {
  const { data } = await supabase.from('nexus_documents')
    .select('tenant_id').eq('metadata->>parent_arsenal', arsenal);
  const c = {};
  for (const d of (data || [])) c[d.tenant_id] = (c[d.tenant_id] || 0) + 1;
  return c;
};

console.log(`\n${'═'.repeat(64)}\n📦 ${arsenal}${dry ? '  (SIMULACRO)' : ''}\n${'═'.repeat(64)}`);
console.log('antes:', await contar());

// ── Cuántas respuestas DEBERÍA haber, según el .txt ──
const esperadas = (() => {
  const c = readFileSync(`knowledge_base/${arsenal}.txt`, 'utf8');
  return c.split(/(?=###\s+\*{0,2}[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+:)/)
    .filter(s => s.includes('###') && s.slice(s.indexOf('\n')).split('\n---')[0].trim().length >= 50).length;
})();
console.log(`el .txt trae ${esperadas} respuestas`);

if (dry) { console.log('\n(simulacro: no se toca nada)'); process.exit(0); }

// ── 0. subir el documento padre ──
// El fragmentador NO lee el .txt: lee el documento padre de Supabase. Sin este
// paso re-fragmenta el texto VIEJO y reporta éxito — falla en silencio, que es
// justo lo que este script existe para evitar. Pasó el 26 ago 2026 con OBJ_01.
console.log(`📄 subiendo el documento padre (${padre})…`);
try {
  execSync(`node scripts/${padre}`, { stdio: 'pipe' });
} catch (e) { console.error('❌ documento padre:', e.stdout?.toString() || e.message); process.exit(1); }

// ── 1. purgar en TODOS los tenants ──
const { data: viejos } = await supabase.from('nexus_documents')
  .select('id').like('category', `${arsenal}_%`).eq('metadata->>is_fragment', 'true');
const ids = (viejos || []).map(v => v.id);
if (ids.length) {
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await supabase.from('nexus_documents').delete().in('id', ids.slice(i, i + 100));
    if (error) { console.error('❌ purga:', error.message); process.exit(1); }
  }
}
console.log(`🗑  purgados ${ids.length}`);

// ── 2. re-fragmentar (crea en el tenant de origen) ──
console.log('🔄 fragmentando con Voyage…');
try {
  execSync(`node scripts/fragmentar-arsenales-voyage.mjs 2>&1 | grep -E "❌|Error" || true`, { stdio: 'inherit' });
} catch (e) { console.error('❌ fragmentador:', e.message); process.exit(1); }

const trasFragmentar = await contar();
if ((trasFragmentar[origen] || 0) !== esperadas) {
  console.error(`❌ el origen quedó en ${trasFragmentar[origen] || 0}, se esperaban ${esperadas}. NO se clona.`);
  process.exit(1);
}

// ── 3. clonar a los derivados ──
for (const t of clones) {
  const { data: src } = await supabase.from('nexus_documents')
    .select('category,title,content,embedding_512,metadata')
    .like('category', `${arsenal}_%`).eq('tenant_id', origen);
  const filas = src.map(d => ({ ...d, tenant_id: t, metadata: { ...d.metadata, cloned_from: origen } }));
  for (let i = 0; i < filas.length; i += 50) {
    const { error } = await supabase.from('nexus_documents').insert(filas.slice(i, i + 50));
    if (error) { console.error(`❌ clon a ${t}:`, error.message); process.exit(1); }
  }
}

// ── 4. verificar ──
const final = await contar();
console.log('después:', final);
const tenants = [origen, ...clones];
const ok = tenants.every(t => final[t] === esperadas) && Object.keys(final).length === tenants.length;
console.log(ok ? `\n✅ ${arsenal}: ${esperadas} en cada uno de ${tenants.join(', ')}`
                : `\n❌ ${arsenal}: los conteos NO cuadran con las ${esperadas} esperadas`);
process.exit(ok ? 0 : 1);
