/**
 * La bitácora de la conversación — ¿recuerda lo que de verdad pasó?
 *
 *   npx tsx scripts/prueba-bitacora.mts
 *
 * Corre contra la prueba del Director del 24 sep 2026 (29 turnos, guardada sin
 * teléfonos en scripts/fixtures/prueba-director-24sep.json): en el turno 22
 * Queswa volvió a explicarle el día a día que ya le había explicado en el 9, y
 * en el 23 él escribió «no me gusta que me repitas las preguntas». La
 * bitácora existe para que eso no pase, y esta prueba comprueba que, turno a
 * turno, sabe lo que la persona ya recibió y lo que ha dicho de sí.
 *
 * No toca producción ni llama al modelo. Termina en error si algo falla.
 */
import fs from 'fs';
import {
  construirBitacora, residenciaDeclarada, renovarOfertaVista, temaDeOferta, yaLoRecibio,
  type FilaBitacora,
} from '../src/lib/queswa-bitacora';

const { filas, ficha } = JSON.parse(fs.readFileSync(new URL('./fixtures/prueba-director-24sep.json', import.meta.url), 'utf8')) as {
  filas: FilaBitacora[]; ficha: Record<string, unknown>;
};

let fallas = 0;
const ok = (cond: boolean, que: string) => {
  console.log(`${cond ? '✅' : '❌'} ${que}`);
  if (!cond) fallas++;
};

// La bitácora ANTES del turno n = con las filas 1..n-1.
const antesDe = (n: number, conFicha = false) => construirBitacora(filas.slice(0, n - 1), conFicha ? ficha : null);

console.log('\n── Lo que ya se mostró, turno a turno ──');
{
  const b10 = antesDe(10);
  ok(b10.temasMostrados.has('como_funciona'), 'antes del 10: sabe que el «Cómo funciona» salió (lo mandó el botón, sin fragmento registrado)');
  ok(b10.temasMostrados.has('dia_a_dia'), 'antes del 10: sabe que el día a día salió en el 9');
  ok(b10.temasMostrados.has('estrategia') && b10.temasMostrados.has('simulador'), 'antes del 10: la estrategia y el simulador');

  const b22 = antesDe(22, true);
  ok(b22.temasMostrados.has('dia_a_dia'), 'antes del 22: el día a día ya salió — el turno que se repitió');
  ok(b22.temasMostrados.has('productos') && b22.temasMostrados.has('catalogo'), 'antes del 22: productos y catálogo');
  ok(b22.temasMostrados.has('perfil_independiente') || b22.temasMostrados.has('pareja'), 'antes del 22: el perfil o el enlace de pareja');
  ok(b22.siguientePaso !== '¿Le muestro qué haría usted en el día a día?', `antes del 22: el siguiente paso no es el día a día (es ${b22.siguientePaso ?? 'ninguno'})`);
  ok(/Liliana/.test(b22.texto) && /independiente/.test(b22.texto), 'antes del 22: recuerda a Liliana y que es independiente');
}

console.log('\n── Dónde vive ──');
{
  ok(antesDe(23).residencia === null, 'antes del 23 no ha dicho dónde vive');
  const b24 = antesDe(24);
  ok(b24.residencia?.pais === 'Inglaterra', `antes del 24: vive en Inglaterra (${b24.residencia?.pais ?? 'nada'})`);
  ok(/Inglaterra/.test(b24.texto), 'la bitácora lo dice con sus palabras');
  const casos: [string, string | null][] = [
    ['actualmente estoy en Inglaterra, como podría desarrollar el negocio', 'Inglaterra'],
    ['Me interesa iniciar, cómo lo hago, para que los productos lleguen aquí a Londres', 'Inglaterra'],
    ['vivo en Madrid hace tres años', 'España'],
    ['estoy en Miami con mi familia', 'Estados Unidos'],
    ['vivo en Bogotá', null],
    ['estoy en Villavicencio', null],
    ['estoy pensando en España para vacaciones', null],
    ['35261707, para envio a Villavicencio', null],
  ];
  for (const [m, esperado] of casos) {
    const r = residenciaDeclarada([m])?.pais ?? null;
    ok(r === esperado, `«${m.slice(0, 50)}» → ${r ?? 'nada'}`);
  }
}

console.log('\n── La pregunta de cierre que ofrece lo ya visto ──');
{
  const b22 = antesDe(22, true);
  const perfil = filas[20].messages!.find((m) => m.role === 'assistant')!.content; // el turno 21, PERFIL_02
  const r = renovarOfertaVista(perfil, b22);
  ok(!!r.cambio, `PERFIL_02 cerraba ofreciendo el día a día ya visto → ${r.cambio ?? 'sin cambio'}`);
  ok(!/d[ií]a a d[ií]a/i.test(r.texto.slice(-120)), 'y ya no lo ofrece');
  const eam = filas[21].messages!.find((m) => m.role === 'assistant')!.content; // el turno 22, EAM_01 repetido
  const r2 = renovarOfertaVista(eam, antesDe(22, true));
  ok(!!r2.cambio && !/productos que mueven/i.test(r2.texto.slice(-120)), `EAM_01 cerraba ofreciendo los productos ya vistos → ${r2.cambio ?? 'sin cambio'}`);
  ok(temaDeOferta('¿Le muestro las tres formas de empezar?') === 'paquetes', 'las tres formas de empezar son el tema paquetes');
  // El ensayo del 24 sep: el día a día cerró ofreciendo el día a día, porque la
  // bitácora se arma antes del turno y no sabía qué entregaba el texto mismo.
  const whyProd = filas[10].messages!.find((m) => m.role === 'assistant')!.content;
  const conProductos = [...filas.slice(0, 7), { messages: [{ role: 'user', content: 'Qué productos son los que venden' }, { role: 'assistant', content: whyProd }] }];
  const r3 = renovarOfertaVista(filas[8].messages!.find((m) => m.role === 'assistant')!.content, construirBitacora(conProductos, null));
  ok(!!r3.cambio && /cat[aá]logo/.test(r3.texto.slice(-80)) && !/d[ií]a a d[ií]a/i.test(r3.texto.slice(-80)),
    `el día a día, tras ver los productos, ofrece el catálogo — ni los productos ni a sí mismo (${r3.cambio ?? 'sin cambio'})`);
  ok(renovarOfertaVista('Texto largo suficiente para que haya cuerpo de respuesta, más de sesenta caracteres en total.\n\n¿Le muestro el catálogo completo con precios?', antesDe(5)).cambio === null, 'no toca una oferta que la persona aún no ha visto');
}

console.log('\n── Un texto aprobado que ya recibió, en cualquier turno ──');
{
  const b10 = antesDe(10);
  const whyDos = filas[1].messages!.find((m) => m.role === 'assistant')!.content;
  ok(yaLoRecibio(b10.textosDelBot, whyDos), 'el «Cómo funciona» del turno 2 cuenta como recibido en el 10 (antes solo se miraba el 9)');
  ok(!yaLoRecibio(antesDe(2).textosDelBot, whyDos), 'antes del turno 2 todavía no lo había recibido');
}

console.log(fallas ? `\n❌ ${fallas} falla(s)` : '\n✅ Todo en orden');
process.exit(fallas ? 1 : 0);
