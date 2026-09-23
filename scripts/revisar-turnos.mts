/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La cola de turnos marcados, a mano.
 *
 *   npx tsx scripts/revisar-turnos.mts [--horas 24] [--juez] [--marcar] [--cola]
 *
 *   (por defecto NO marca ni envía: solo reporta)
 *   --marcar   escribe la marca en metadata de cada turno
 *   --juez     enciende la capa 2 (Haiku, ~1,3 s por turno no marcado)
 *   --cola     lista lo que está marcado y sin revisar, y sale
 *
 * El lazo completo es: rastro → detectar → cola → revisar → arnés → arreglo.
 * Lo mismo lo corre solo `/api/cron/revisar-turnos` una vez al día.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { revisarTurnos, esPersonaReal } from '../src/lib/revisar-turnos.ts';

const arg = (k: string, d?: string) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const bog = (iso: string) => new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false });

if (process.argv.includes('--cola')) {
  const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await s.from('nexus_conversations')
    .select('fingerprint_id, created_at, metadata')
    .not('metadata->marcado', 'is', null).order('created_at', { ascending: false }).limit(60);
  if (error) throw error;
  const pend = (data ?? []).filter((t) => !t.metadata?.revisado && esPersonaReal(t.fingerprint_id));
  console.log(`\n📋 En la cola, sin revisar: ${pend.length}\n`);
  for (const t of pend) {
    console.log(`${bog(t.created_at)}  ${t.fingerprint_id}`);
    console.log(`   ${(t.metadata.marcado.detectores || []).join(' · ')}`);
    console.log(`   «${String(t.metadata.marcado.muestra || '').slice(0, 120)}…»\n`);
  }
  process.exit(0);
}

const r = await revisarTurnos({
  horas: Number(arg('--horas', '24')),
  conJuez: process.argv.includes('--juez'),
  soloLectura: !process.argv.includes('--marcar'),
});

console.log(`\nturnos de personas revisados: ${r.revisados}`);
console.log(`marcados: ${r.marcados}   ·   nuevos en esta corrida: ${r.nuevos.length}   ·   vistos por el juez: ${r.juzgados}\n`);
for (const [k, v] of Object.entries(r.porDetector).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`);
}
if (r.nuevos.length) {
  console.log('\n── lo nuevo ──');
  for (const n of r.nuevos.slice(0, 12)) {
    console.log(`\n${bog(n.cuando)}  ${n.fingerprint}\n   ${n.detectores.join(' · ')}\n   «${n.muestra.slice(0, 120)}…»`);
  }
}
if (!process.argv.includes('--marcar')) console.log('\n(corrida en seco: nada se marcó — use --marcar)');
