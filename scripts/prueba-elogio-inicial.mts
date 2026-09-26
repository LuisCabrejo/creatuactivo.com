/**
 * El elogio de la pregunta al abrir — ¿lo quita sin llevarse el dato?
 *
 *   npx tsx scripts/prueba-elogio-inicial.mts
 *
 * Hasta el prompt v5.8 (26 sep 2026), «Buena pregunta» estaba entre las
 * fórmulas para abrir un turno, y una de cada cuatro respuestas compuestas
 * arrancaba así. `quitarElogioInicial` es la red en el motor. Estas son las
 * cinco formas que aparecieron en el tráfico real (sin nombres de personas), y
 * lo que NO debe tocar. La primera versión quitaba el párrafo entero y se
 * llevaba el precio del Ganocafé: por eso hay casos con el dato en la misma
 * línea que el elogio.
 *
 * No toca producción ni llama al modelo. Termina en error si algo falla.
 */
import { quitarElogioInicial } from '../src/lib/queswa-envoltura';
import { getRespuestaMaestra } from '../src/lib/respuestas-maestras';

let fallas = 0;
const ok = (cond: boolean, que: string) => {
  console.log(`${cond ? '✅' : '❌'} ${que}`);
  if (!cond) fallas++;
};

console.log('\n── Las formas reales ──');
const casos: [string, string, string][] = [
  ['frase sola, el dato sigue en la línea',
    'Buena pregunta. El pago se hace directamente a Gano Excel antes del despacho, por sus canales oficiales:\n\n- Consignación\n- Tarjeta',
    'El pago se hace directamente a Gano Excel antes del despacho, por sus canales oficiales:\n\n- Consignación\n- Tarjeta'],
  ['con el nombre de la persona',
    'Buena pregunta, Ana. Hay dos formas:\n\n**1. Como cliente preferencial** — se registra gratis.',
    'Hay dos formas:\n\n**1. Como cliente preferencial** — se registra gratis.'],
  ['«para empezar», con el precio en la misma línea',
    'Buena pregunta para empezar. El Ganocafé 3 en 1 cuesta **$110.900 COP** la caja, que trae 20 sobres.\n\nLo que lo hace distinto es el extracto.',
    'El Ganocafé 3 en 1 cuesta **$110.900 COP** la caja, que trae 20 sobres.\n\nLo que lo hace distinto es el extracto.'],
  ['raya con cola de validación, párrafo aparte',
    'Buena pregunta — y tiene sentido querer entender qué hay detrás del nombre antes de decidir.\n\nEl paquete empresarial es la forma de iniciar con una posición más amplia.',
    'El paquete empresarial es la forma de iniciar con una posición más amplia.'],
  ['pegada con «porque», párrafo aparte',
    'Buena pregunta, porque los dos son chocolate caliente y se parecen en el nombre.\n\nLa diferencia está en para quién son.',
    'La diferencia está en para quién son.'],
  ['sin punto: solo las palabras del elogio',
    'Buena pregunta — la diferencia está en lo que trae cada sobre:\n\n- El Clásico\n- El 3 en 1',
    'La diferencia está en lo que trae cada sobre:\n\n- El Clásico\n- El 3 en 1'],
  ['«Me gusta que pregunte eso»',
    'Me gusta que pregunte eso. Su día a día se resume en dos acciones.',
    'Su día a día se resume en dos acciones.'],
];
for (const [que, antes, esperado] of casos) {
  const r = quitarElogioInicial(antes);
  ok(r === esperado, `${que}${r === esperado ? '' : `\n     salió: ${JSON.stringify(r.slice(0, 120))}`}`);
}

console.log('\n── Lo que no toca ──');
const intactos: [string, string][] = [
  ['una respuesta que abre con el dato', 'El Ganocafé 3 en 1 cuesta $110.900 COP la caja.\n\n¿Le cuento cómo se pide?'],
  ['un acuse que no juzga la pregunta', 'Con gusto. El pago se hace directamente a Gano Excel.'],
  ['«pregunta» más adelante en el texto', 'Esa es una buena pregunta para hacerle a su socio. Él coordina el pago.'],
  ['la persona citada en medio', 'Usted dijo «buena pregunta» y tiene razón: la diferencia está en el sobre.'],
  ['solo el elogio, sin nada más (se deja: no hay qué mostrar en su lugar)', 'Buena pregunta.'],
];
for (const [que, t] of intactos) ok(quitarElogioInicial(t) === t, que);

// Los textos aprobados arrancan en la respuesta desde el arsenal v6.50: el
// filtro no tiene nada que hacer con ellos.
for (const chip of ['¿de dónde sale el dinero?', '¿Cómo lo haría yo? ¿Qué hago en el día a día?', '¿Y esto cómo funciona, exactamente?']) {
  const m = getRespuestaMaestra(chip)!;
  ok(quitarElogioInicial(m) === m, `texto aprobado intacto: «${chip}»`);
}

console.log(fallas ? `\n❌ ${fallas} falla(s)` : '\n✅ Todo en orden');
process.exit(fallas ? 1 : 0);
