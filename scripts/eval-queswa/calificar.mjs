// La calificación de un caso de la evaluación de Queswa: comprobaciones exactas
// en los turnos marcados, líneas rojas en todos, y el juez. La usan
// correr-eval.mjs y recalificar.mjs (que califica de nuevo una conversación ya
// jugada, sin repetirla, cuando se corrige la redacción de un criterio).

const { lineasRojasEn, repeticiones } = await import('./lineas-rojas.mjs');
const { juez } = await import('./juez.mjs');

/**
 * Grade one output.
 */
export async function calificar(input, run) {
  const turnos = run.turnos;
  const fallas = [];
  const marcados = input.evaluar.map((ev) => ({ ...ev, n: ev.turno === 'ultimo' ? turnos.length : ev.turno }));

  // 1. Lo que se ve sin juez, en cada turno marcado.
  const progOk = new Map();
  for (const m of marcados) {
    const t = turnos.find((x) => x.n === m.n);
    const propias = [];
    if (!t) propias.push(`el turno ${m.n} no ocurrió`);
    else {
      for (const re of m.si ?? []) if (!new RegExp(re, 'im').test(t.salida)) propias.push(`falta /${re}/`);
      for (const re of m.no ?? []) if (new RegExp(re, 'im').test(t.salida)) propias.push(`aparece /${re}/`);
      for (const tipo of m.no_tipo ?? []) if (t.tipos.includes(tipo)) propias.push(`envió ${tipo}`);
    }
    progOk.set(m.n, propias.length === 0);
    for (const p of propias) fallas.push(`turno ${m.n}: ${p}`);
  }
  for (const re of input.conversacion?.si ?? []) {
    if (!turnos.some((t) => new RegExp(re, 'im').test(t.salida))) fallas.push(`en ningún turno aparece /${re}/`);
  }

  // 2. Líneas rojas sin juez, en todos los turnos.
  const rojas = turnos.flatMap((t) => lineasRojasEn(t.salida).map((h) => `turno ${t.n}: ${h}`));

  // 3. El juez.
  const { veredicto, judge_model, judge_usage } = await juez(run.output, marcados);
  const porTurno = new Map((veredicto.turnos ?? []).map((v) => [v.turno, v]));
  const cumplidos = marcados.filter((m) => progOk.get(m.n) && porTurno.get(m.n)?.cumple === true).length;
  for (const m of marcados) {
    const v = porTurno.get(m.n);
    if (!v) fallas.push(`turno ${m.n}: el juez no lo calificó`);
    else if (!v.cumple) fallas.push(`turno ${m.n} (juez): ${v.razon}`);
  }
  if (!veredicto.lineas_rojas?.ok) rojas.push(`juez: ${veredicto.lineas_rojas?.razon ?? 'sin razón'}`);

  const aprueba = fallas.length === 0 && rojas.length === 0 ? 1 : 0;
  return {
    grade: {
      aprueba,
      criterio: marcados.length ? cumplidos / marcados.length : 0,
      lineas_rojas: rojas.length === 0 ? 1 : 0,
      repeticiones: repeticiones(turnos),
    },
    explanation: {
      aprueba: aprueba ? 'cumple' : [...fallas, ...rojas].join(' | '),
      criterio: marcados.map((m) => `turno ${m.n}: ${porTurno.get(m.n)?.razon ?? '—'}`).join(' | '),
      lineas_rojas: rojas.length ? rojas.join(' | ') : (veredicto.lineas_rojas?.razon ?? 'ok'),
    },
    judge_model, judge_usage,
  };
}

