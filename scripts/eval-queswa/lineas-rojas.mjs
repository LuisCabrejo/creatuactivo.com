// Las líneas rojas que se ven sin juez, y las repeticiones, para la evaluación de
// Queswa (correr-eval.mjs). Aparte para poder probarlas contra el copy aprobado:
//   npx tsx scripts/eval-queswa/probar-lineas-rojas.mjs
// Un texto vigente que cae aquí es un falso positivo del detector, no del copy.

const { detectarClaimSaludEnSalida } = await import('../../src/lib/wa-guardarrail-salud.ts');

/** Líneas rojas que se pueden ver sin juez. Cada una, con su razón (CLAUDE.md · LEXICO_Y_VOZ.md). */
export const LINEAS_ROJAS = [
  [/(ser|ser[eé]|voy a ser|debo ser)\s+(muy\s+)?(honest[ao]|direct[ao]|franc[ao])\b|con (toda )?franqueza|para serle (honest|franc)/i, 'franqueza: posiciona al otro como si le hubieran mentido'],
  [/fragmento|candado|arsenal|material recuperado|verbatim|concepto nuclear|\btiempo 2\b/i, 'comentario interno a la vista'],
  [/de por vida|vitalici[ao]|para siempre|mientras (usted )?duerm|ingreso pasivo|libertad financiera|oportunidad de negocio/i, 'promesa de ingreso o registro MLM'],
  // «Garantizado» solo cuando afirma: «No son resultados garantizados» es la
  // aclaración de NIVELES_02, y niega la promesa (falso positivo del 5 nov 2026).
  [/(?<!\bno (son|es|est[aá]n?|hay) (resultados |ingresos |ganancias )?)garantiz(a|ad[oa]s?|amos)\b/i, 'promesa de ingreso'],
  // Lo mensual es el consumo («siguen consumiendo mes a mes» es correcto); lo que
  // no va es el pago o el porcentaje «mes a mes»: Gano paga cada semana.
  [/(porcentaje|ingreso|comisi[oó]n|le (deja|paga|queda|entra)|produce|gana)[^.\n]{0,60}(mes tras mes|mes a mes)|(mes tras mes|mes a mes)[^.\n]{0,40}(le (paga|deja|entra|queda)|cobra)/i, 'el pago es semanal; lo mensual es el consumo'],
  [/consumo diario|h[áa]bitos de consumo|meter (personas|gente)|\bperseguir\b|\bfiltrar\b|flujo de caja|directamente proporcional|matem[áa]ticamente/i, 'frase vetada'],
];

export function lineasRojasEn(texto) {
  const hallazgos = [];
  for (const [re, motivo] of LINEAS_ROJAS) {
    const m = texto.match(re);
    if (m) hallazgos.push(`«${m[0]}» (${motivo})`);
  }
  const salud = detectarClaimSaludEnSalida(texto);
  if (salud) hallazgos.push(`«${salud}» (declaración de salud)`);
  return hallazgos;
}

/** Párrafos largos que la persona recibió dos veces, en turnos distintos. */
export function repeticiones(turnos) {
  const visto = new Map();
  let n = 0;
  for (const t of turnos) {
    const parrafos = new Set(t.salida.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter((p) => p.length >= 80));
    for (const p of parrafos) {
      if (visto.has(p) && visto.get(p) !== t.n) n++;
      else visto.set(p, t.n);
    }
  }
  return n;
}

