/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El generador de typos: deforma una frase como la deforma un pulgar.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────────
 *
 * La regla está escrita en CLAUDE.md desde agosto —«NO escribir un regex de cara
 * al prospecto que exija ortografía perfecta»— y se rompió cuatro veces con
 * personas reales:
 *
 *   · `bianrio` · `inciar` · «sí» con tilde          (una sola prueba, ago 2026)
 *   · `aimgane` → el nodo de la imagen no disparó y el modelo compuso que las
 *     fotos «las maneja el equipo», que es falso    (Director, 12 sep 2026)
 *   · `Redácta` → la petición de una pieza se fue al vector   (11 sep 2026)
 *
 * Las dos últimas ocurrieron en patrones escritos DESPUÉS de la regla, mirándola.
 * Eso ya no se arregla con disciplina: se arregla verificándolo. Es el mismo
 * razonamiento con que la doctrina salió de los fragmentos — una regla que no se
 * sostiene con atención se sostiene con arquitectura.
 *
 * ── CÓMO SE USA ───────────────────────────────────────────────────────────────
 *
 *   const rotos = typosQueRompen(pideImagen, 'dame una imagen de los productos', ['imagen']);
 *
 * El tercer argumento son las LLAVES: las palabras sin las cuales el detector no
 * puede disparar. Se deforman de las cinco maneras en que un dedo se equivoca y
 * se exige que el detector siga reconociéndolas. Se declaran a mano a propósito:
 * deformar cualquier palabra generaría casos imposibles y ruido en vez de señal.
 *
 * ⚠️ Solo para detectores de ENTRADA, los que leen lo que escribe una persona.
 * Los de salida (`detectarClaimSaludEnSalida`, `detectarPromesaDeIngreso`,
 * `detectarMarcaInterna`) leen texto del modelo, donde la ortografía es perfecta:
 * darles tolerancia solo abriría falsos positivos.
 */

const SIN_TILDE: Record<string, string> = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n' };
const CON_TILDE: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };

/** Las cinco formas en que un pulgar deforma una palabra. */
export function deformar(palabra: string): { como: string; palabra: string }[] {
  const out: { como: string; palabra: string }[] = [];
  const p = palabra;
  const sinTilde = [...p].map((c) => SIN_TILDE[c] ?? c).join('');

  // 1. La tilde que se pierde (el teclado no la pone, o la persona no la usa).
  if (sinTilde !== p) out.push({ como: 'tilde perdida', palabra: sinTilde });

  // 2. La tilde donde no va — «Redácta» por «redacta» (Patricia, 11 sep 2026).
  if (sinTilde === p) {
    for (let i = 1; i < p.length - 1; i++) {
      if (CON_TILDE[p[i]]) { out.push({ como: 'tilde de más', palabra: p.slice(0, i) + CON_TILDE[p[i]] + p.slice(i + 1) }); break; }
    }
  }

  // 3. La letra que no se alcanzó a pulsar.
  if (p.length > 4) out.push({ como: 'letra omitida', palabra: p.slice(0, 3) + p.slice(4) });

  // 4. Dos letras cambiadas de orden — el typo más común al escribir rápido.
  if (p.length > 3) out.push({ como: 'transposicion', palabra: p.slice(0, 1) + p[2] + p[1] + p.slice(3) });

  // 5. La tecla que rebotó.
  if (p.length > 3) out.push({ como: 'letra duplicada', palabra: p.slice(0, 3) + p[2] + p.slice(3) });

  return out;
}

/** La frase con su llave deformada, una variante por deformación. */
export function conTypos(frase: string, llave: string): { como: string; frase: string }[] {
  return deformar(llave).map(({ como, palabra }) => ({
    como,
    frase: frase.replace(new RegExp(llave, 'i'), palabra),
  }));
}

/**
 * ¿El detector aguanta un dedo torpe en su llave?
 *
 * Devuelve la lista de deformaciones que NO reconoció — vacía si las tolera
 * todas. El arnés que lo use decide si falla o solo avisa.
 */
export function typosQueRompen(
  detector: (t: string) => unknown,
  frase: string,
  llaves: string[],
): { llave: string; como: string; frase: string }[] {
  const rotos: { llave: string; como: string; frase: string }[] = [];
  for (const llave of llaves) {
    if (!new RegExp(llave, 'i').test(frase)) {
      rotos.push({ llave, como: 'LA LLAVE NO ESTA EN LA FRASE', frase });
      continue;
    }
    for (const { como, frase: deformada } of conTypos(frase, llave)) {
      if (!detector(deformada)) rotos.push({ llave, como, frase: deformada });
    }
  }
  return rotos;
}
