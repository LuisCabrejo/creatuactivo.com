// Califica de nuevo, sin repetir la conversación, los casos cuyo CRITERIO se
// corrigió (5 nov 2026): lee la transcripción guardada en traces/, vuelve a
// pasar comprobaciones, líneas rojas y juez, y reescribe esas filas de
// results.jsonl. El costo del juez anterior queda en meta.jueces_anteriores, y
// costo.mjs lo suma: lo gastado no desaparece.
//
//   npx tsx scripts/eval-queswa/recalificar.mjs .claude/hillclimb/prospecto-whatsapp/baseline id1,id2
//
// Solo sirve cuando cambió la calificación. Si cambió Queswa o el ejecutor, la
// conversación es otra y hay que correrla de nuevo.
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const { calificar } = await import('./calificar.mjs');
const [dir, idsArg] = process.argv.slice(2);
if (!dir || !idsArg) { console.error('uso: recalificar.mjs <dir de la variante> <id1,id2,...>'); process.exit(2); }
const ids = new Set(idsArg.split(',').map((x) => x.trim()));

const d = JSON.parse(readFileSync('scripts/eval-queswa/casos-prospecto.json', 'utf8'));
const casos = new Map(d.casos.map((c) => [c.id, c]));

/** La conversación jugada, reconstruida desde su transcripción. */
function runDesdeTraza(id, rep) {
  const traza = JSON.parse(readFileSync(join(dir, 'traces', `${id}_rep${rep}.json`), 'utf8'));
  const turnos = [];
  for (let i = 0; i + 1 < traza.length; i += 2) {
    const crudo = traza[i + 1].content;
    const m = crudo.match(/\n\n· ([^\n]*) · (\d+) s$/);
    const salida = m ? crudo.slice(0, m.index) : crudo;
    const tipos = [];
    if (/\(video: /.test(salida)) tipos.push('video');
    if (/\[Formulario: /.test(salida)) tipos.push('flow');
    turnos.push({ n: turnos.length + 1, entrada: traza[i].content, salida, tipos, search_method: m?.[1] ?? '-', segundos: Number(m?.[2] ?? 0) });
  }
  return { turnos, output: turnos.map((t) => `── Turno ${t.n}\nPERSONA: ${t.entrada}\nQUESWA: ${t.salida}`).join('\n\n') };
}

const ruta = join(dir, 'results.jsonl');
const filas = readFileSync(ruta, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
let n = 0;
for (const f of filas) {
  if (!ids.has(f.prompt_id)) continue;
  const g = await calificar(casos.get(f.prompt_id), runDesdeTraza(f.prompt_id, f.rep));
  f.meta = { ...(f.meta ?? {}), recalificado: new Date().toISOString(),
    jueces_anteriores: [...(f.meta?.jueces_anteriores ?? []), { judge_model: f.judge_model, judge_usage: f.judge_usage, grade: f.grade }] };
  Object.assign(f, { grade: g.grade, explanation: g.explanation, judge_model: g.judge_model, judge_usage: g.judge_usage });
  n++;
  console.log(`${f.prompt_id} rep${f.rep}: aprueba ${f.meta.jueces_anteriores.at(-1).grade.aprueba} → ${g.grade.aprueba} · ${g.explanation.aprueba.slice(0, 200)}`);
}
writeFileSync(`${ruta}.tmp`, filas.map((f) => JSON.stringify(f)).join('\n') + '\n');
renameSync(`${ruta}.tmp`, ruta);
console.log(`${n} filas recalificadas`);
