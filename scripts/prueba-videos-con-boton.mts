/**
 * Los cuatro ajustes de la auditoría del 9 oct 2026 — sin red.
 *
 * El caso: Gerardo llegó por el enlace de Jeisson Villamil, vio los tres videos
 * de la apertura tocando sus botones, no contestó ninguna de las preguntas que
 * iban de pie y se fue cuando se le acabaron los botones. Además la apertura le
 * dijo «asiste a JEISSON DAVID», y a Jeisson solo le llegó «llegó a su enlace».
 *
 *   1. El nombre del socio con mayúscula inicial (nombrePropio).
 *   2. La pregunta debajo de cada video lleva un botón (botonParaOferta), y su
 *      toque entra como un «Sí» escrito: abre el mismo nodo que el «sí» tecleado.
 *   3. El aviso al socio cuando su prospecto ya vio los tres videos.
 *   4. La línea del iPhone en lo que abre el pendiente de notificaciones.
 *
 * Correr:  npx tsx scripts/prueba-videos-con-boton.mts   (exit 1 si algo falla)
 * De punta a punta, por el webhook en modo ensayo:
 *   npx tsx scripts/repetir-por-webhook.mts --log <log> --mensajes "Hola Queswa | [apertura_sistema:Cómo funciona] | [oferta_si:Sí, muéstreme]"
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
const { nombrePropio } = await import('../src/lib/texto-normalizar');
const { botonParaOferta, ID_BOTON_SI, getRespuestaBoton, OFERTA_SIMULADOR_NIVELES, CIERRE_VIDEO_NIVELES_SOCIO, construirApertura } = await import('../src/lib/wa-apertura');
const { RECORRIDO } = await import('../src/lib/queswa-bitacora');
const { destinatarioDe, textoTresVideos } = await import('../src/lib/wa-avisos-contexto');
const { textoLoQueAbre } = await import('../src/lib/wa-pendientes-socio');
const { banderasDelHilo } = await import('../src/lib/queswa-conductor');

let fallos = 0;
const ok  = (m: string) => console.log(`  ✅ ${m}`);
const mal = (m: string) => { fallos++; console.log(`  ❌ ${m}`); };
const igual = (a: unknown, b: unknown, m: string) => (a === b ? ok(m) : mal(`${m} — dio ${JSON.stringify(a)}, se esperaba ${JSON.stringify(b)}`));

console.log('\n── 1. El nombre del socio ──');
igual(nombrePropio('JEISSON DAVID'), 'Jeisson David', 'mayúsculas sostenidas');
igual(nombrePropio('Miguel Antonio barahona'), 'Miguel Antonio Barahona', 'apellido en minúscula');
igual(nombrePropio('MARÍA DEL PILAR'), 'María del Pilar', 'partícula en minúscula, tildes intactas');
igual(nombrePropio('JEAN-PIERRE DUBOIS'), 'Jean-Pierre Dubois', 'nombre compuesto con guion');
igual(nombrePropio('McAllister Ruiz'), 'McAllister Ruiz', 'grafía mixta intacta');
igual(nombrePropio('Luis Cabrejo'), 'Luis Cabrejo', 'un nombre bien escrito no cambia');
const apertura = construirApertura('JEISSON DAVID VILLAMIL HERNANDEZ', 'Gerardo Velasquez');
apertura.includes('asiste a Jeisson David.') ? ok('la apertura dice «asiste a Jeisson David»') : mal('la apertura no corrige el nombre del socio');
igual(destinatarioDe({ constructorId: 'x', nombre: 'JEISSON DAVID VILLAMIL HERNANDEZ' }).nombreCorto, 'Jeisson', 'el saludo de los avisos al socio');

console.log('\n── 2. El botón debajo de cada video ──');
const pieDe = (t: string | null) => (t ?? '').split('\n').map((l) => l.trim()).filter(Boolean).reverse().find((l) => l.endsWith('?'));
for (const id of ['apertura_sistema', 'apertura_dinero', 'apertura_rol']) {
  const pie = pieDe(getRespuestaBoton(id));
  const b = botonParaOferta(pie);
  b ? ok(`${id}: «${pie}» → [${b.title}]`) : mal(`${id}: «${pie}» sale sin botón`);
}
const bNiveles = botonParaOferta(OFERTA_SIMULADOR_NIVELES);
bNiveles ? ok(`Los 12 Niveles: «${OFERTA_SIMULADOR_NIVELES}» → [${bNiveles.title}]`) : mal('el video de Los 12 Niveles sale sin botón: la cadena se corta ahí');
for (const { oferta } of RECORRIDO) {
  const b = botonParaOferta(oferta);
  b ? ok(`recorrido: «${oferta}» → [${b.title}]`) : mal(`recorrido: «${oferta}» sale sin botón`);
}
for (const b of [...RECORRIDO.map((r) => botonParaOferta(r.oferta)), bNiveles]) {
  if (b && (b.title.length > 20 || b.id !== ID_BOTON_SI)) mal(`botón inválido: ${JSON.stringify(b)}`);
}
igual(botonParaOferta(CIERRE_VIDEO_NIVELES_SOCIO), null, 'al socio no se le pone botón');
igual(botonParaOferta('Texto sin pregunta.'), null, 'sin pregunta no hay botón');
igual(botonParaOferta(undefined), null, 'sin pie no hay botón');
// El toque entra como «Sí»: tiene que abrir el mismo nodo que el «sí» tecleado.
const OFERTA_ESTRATEGIA = [{ role: 'assistant', content: pieDe(getRespuestaBoton('apertura_sistema'))! }];
banderasDelHilo('Sí', OFERTA_ESTRATEGIA as never).aceptaSola
  ? ok('el «Sí» del botón abre el hilo de Los 12 Niveles, igual que el tecleado')
  : mal('el «Sí» del botón no abre el hilo de Los 12 Niveles');

console.log('\n── 3. El aviso de los tres videos ──');
const aviso = textoTresVideos(destinatarioDe({ constructorId: 'x', nombre: 'JEISSON DAVID' }), 'Gerardo Velasquez', '573005687433');
aviso.startsWith('🎬 Jeisson, *Gerardo Velasquez* ya vio los tres videos') ? ok('abre con el socio y el prospecto') : mal(`el aviso abre distinto:\n${aviso}`);
/le conviene escribirle usted/i.test(aviso) ? ok('le dice al socio qué hacer') : mal('el aviso no dice qué hacer');
const avisoEquipo = textoTresVideos(destinatarioDe(null), 'Gerardo', '573005687433');
avisoEquipo.startsWith('🎬 *Gerardo*') ? ok('al equipo no se le nombra') : mal(`al equipo:\n${avisoEquipo}`);

console.log('\n── 4. La línea del iPhone ──');
/iPhone[\s\S]*Agregar a inicio/.test(textoLoQueAbre(['notificaciones'])) ? ok('el pendiente de notificaciones trae los pasos del iPhone') : mal('falta la línea del iPhone');
!/iPhone/.test(textoLoQueAbre(['destino', 'foto'])) ? ok('sin notificaciones pendientes, no aparece') : mal('la línea del iPhone sale donde no toca');

console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ Todo en orden\n');
process.exit(fallos ? 1 : 0);
