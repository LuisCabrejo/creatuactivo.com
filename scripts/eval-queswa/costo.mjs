// Lo que costó una corrida de la evaluación, medido con el `usage` real de cada
// caso (motor y juez), no estimado.
//
//   node scripts/eval-queswa/costo.mjs .claude/hillclimb/prospecto-whatsapp/baseline [--casos 28 --reps 3]
//
// Con --casos y --reps proyecta una corrida completa a partir de lo medido.
// Precios de la API de primera parte por millón de tokens (tabla del 6 oct 2026);
// la caché se escribe a 1,25× la entrada y se lee a 0,1×. Si cambian, se
// actualizan aquí: no se recuerdan.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PRECIOS = [
  ['claude-sonnet-4-6', 3, 15], ['claude-haiku-4-5', 1, 5], ['claude-sonnet-5-5', 2, 10],
  ['claude-haiku-5-5', 0.1, 0.5], ['claude-opus-5-5', 4, 20],
];
const precioDe = (modelo) => PRECIOS.find(([m]) => String(modelo).startsWith(m));
const costo = (modelo, u) => {
  const p = precioDe(modelo);
  if (!p) throw new Error(`sin precio para ${modelo}: agréguelo a PRECIOS`);
  const [, ent, sal] = p;
  return ((u.input_tokens ?? 0) * ent + (u.cache_creation_input_tokens ?? 0) * ent * 1.25
    + (u.cache_read_input_tokens ?? 0) * ent * 0.1 + (u.output_tokens ?? 0) * sal) / 1e6;
};

const dir = process.argv[2];
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? Number(process.argv[i + 1]) : null; };
const filas = (f) => existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const resultados = filas('results.jsonl');
const errores = filas('errors.jsonl');

const porCaso = [];
let motor = 0, juez = 0;
for (const r of [...resultados, ...errores]) {
  const m = Object.entries(r.consumo_por_modelo ?? {}).reduce((a, [mod, u]) => a + costo(mod, u), 0);
  // El juez de una recalificación cuenta, y también los jueces anteriores de esa fila.
  const j = (r.judge_usage ? costo(r.judge_model, r.judge_usage) : 0)
    + (r.meta?.jueces_anteriores ?? []).reduce((a, x) => a + (x.judge_usage ? costo(x.judge_model, x.judge_usage) : 0), 0);
  motor += m; juez += j;
  if (r.grade) porCaso.push({ id: r.prompt_id, motor: m, juez: j, s: r.latency_s });
}
const usd = (x) => `US$${x.toFixed(3)}`;
porCaso.sort((a, b) => (a.motor + a.juez) - (b.motor + b.juez));
for (const c of porCaso) console.log(`${c.id.padEnd(32)} motor ${usd(c.motor)} · juez ${usd(c.juez)} · ${Math.round(c.s)} s`);
console.log(`\nMedido: ${porCaso.length} casos calificados, ${errores.length} intentos fallidos · motor ${usd(motor)} + juez ${usd(juez)} = ${usd(motor + juez)}`);
const casos = arg('--casos'), reps = arg('--reps');
if (casos && reps && porCaso.length) {
  const media = (motor + juez) / porCaso.length;
  const tot = porCaso.map((c) => c.motor + c.juez);
  console.log(`Por caso: mín ${usd(tot[0])} · mediana ${usd(tot[Math.floor(tot.length / 2)])} · máx ${usd(tot.at(-1))}`);
  console.log(`Corrida completa ≈ ${casos} casos × ${reps} reps × ${usd(media)} = ${usd(casos * reps * media)} (rango ${usd(casos * reps * tot[0])}–${usd(casos * reps * tot.at(-1))})`);
}
