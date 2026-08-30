/**
 * PRUEBA DE MESA DEL CANAL — los nodos dictados del webhook con su código real,
 * y lo que va al motor, contra el motor de PRODUCCIÓN con el pageContext que el
 * webhook le pasaría. No envía WhatsApp, no manda plantillas, no registra nada.
 *
 * Correr:  npx tsx scripts/prueba-mesa-canal.mts   (exit 1 si algo falla)
 *
 * Nació el 27 ago 2026 para verificar los cinco hallazgos de la auditoría de
 * ese día (Liliana: la radicación; Milena: la ruta del comprador, el aviso al
 * socio, las sedes por perfil y los falsos positivos del guardarraíl).
 *
 * ⚠️ Replica el ORDEN de nodos del webhook (2.45 → 2.49 → motor). Si el webhook
 * cambia de orden, este arnés hay que cambiarlo con él — no lee el webhook.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
const P = await import('../src/lib/wa-pedido');
const { detectarPromesaDeIngreso, detectarModeloInventado } = await import('../src/lib/wa-guardarrail-negocio');
const { detectarClaimSaludEnSalida } = await import('../src/lib/wa-guardarrail-salud');
const { respuestaRenta } = await import('../src/lib/wa-simulador');

const BASE = process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? 'https://creatuactivo.com';
const FP = `wa_57310${String(Date.now()).slice(-7)}`;
const socio = { nombre: 'Luis Cabrejo', slug: 'luis-cabrejo', whatsapp: undefined, constructorId: 'luis-cabrejo-1288' };
type M = { role: string; content: string };
const hist: M[] = [];
const ultimoBot = () => [...hist].reverse().find((m) => m.role === 'assistant')?.content ?? '';
let fallos = 0;
const ok = (s: string) => console.log('   ✅ ' + s);
const mal = (s: string) => { console.log('   ❌ ' + s); fallos++; };

async function motor(texto: string, pageContext: string): Promise<string> {
  const r = await fetch(`${BASE}/api/nexus`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'whatsapp' },
    body: JSON.stringify({ messages: [...hist, { role: 'user', content: texto }], sessionId: FP, fingerprint: FP, pageContext }) });
  return (await r.text()).trim();
}
function guardarrail(t: string): string | null {
  const m = detectarModeloInventado(t); if (m) return `modelo: ${m}`;
  const n = detectarPromesaDeIngreso(t); if (n) return `negocio: ${n}`;
  const s = detectarClaimSaludEnSalida(t); if (s) return `salud: ${s}`;
  return null;
}

async function turno(texto: string, ctxMotor = 'whatsapp_inbound'): Promise<{ capa: string; texto: string }> {
  const ub = ultimoBot();
  const enPedido = P.pedidoAbierto(ub);
  const hayPedido = P.pedidoCargado(hist);
  let out: { capa: string; texto: string } | null = null;
  const preguntaSede = P.detectarPreguntaOficina(texto);
  if (!preguntaSede && (enPedido || P.detectarIntencionCompra(texto))) {
    const variante = P.RE_PREGUNTO_CUAL_GANOCAFE.test(ub) ? P.leerVarianteGanocafe(texto) : null;
    if (!variante && P.esGanocafeSinVariante(texto)) out = { capa: '2.45 ganocafé sin variante', texto: P.preguntarCualGanocafe() };
    const lineas = out ? [] : variante ? [{ producto: variante, cantidad: 1 }] : P.lineasDelPedido(texto, hist);
    if (lineas.length) out = { capa: '2.45 pedido cargado (registro y plantilla omitidos: prueba)', texto: P.confirmarPedido(lineas, socio, 'Milena') };
    else if (!out && (!enPedido || !/\?|cu[aá]nto|qu[eé]|c[oó]mo|cu[aá]l/i.test(texto))) out = { capa: '2.45 pedido abierto', texto: enPedido ? P.noEntendiProductos() : P.pedirProductos('Milena') };
  }
  if (!out && P.detectarPidePersona(texto)) out = { capa: '2.46 pide persona (plantilla omitida: prueba)', texto: P.respuestaPersona(socio) };
  if (!out && P.detectarPreguntaEnvio(texto) && !P.detectarPreguntaOficina(texto)) out = { capa: '2.47 envío', texto: P.respuestaEnvio(socio) };
  if (!out && P.detectarPreguntaOficina(texto)) {
    const ciudad = P.detectarCiudad(texto) ?? [...hist].reverse().map((m) => P.detectarCiudad(m.content)).find(Boolean) ?? null;
    out = { capa: '2.48 sede', texto: P.respuestaOficinaProspecto(socio, ciudad, hayPedido, P.RE_OFICINA_YA_EXPLICADA.test(ub)) };
  }
  if (!out && hayPedido) {
    if (P.RE_OFRECIO_OPTIN.test(ub)) { const a = P.leerRespuestaOptin(texto); if (a !== null) out = { capa: `2.49 opt-in = ${a} (guardado omitido: prueba)`, texto: P.respuestaOptin(a) }; }
    else if (P.esCierreDeConversacion(texto) && !P.optinYaOfrecido(hist)) out = { capa: '2.49 opt-in ofrecido', texto: P.ofrecerOptin('Milena') };
  }
  if (!out) {
    const ctx = hayPedido ? 'whatsapp_comprador' : ctxMotor;
    const t = await motor(texto, ctx);
    const g = guardarrail(t);
    out = { capa: `motor (${ctx})${g ? ' → BLOQUEADO por guardarraíl: ' + g : ''}`, texto: t };
  }
  hist.push({ role: 'user', content: texto }, { role: 'assistant', content: out.texto });
  console.log(`\n👤 ${texto}\n🤖 [${out.capa}]\n${out.texto.split('\n').map((l) => '   ' + l).join('\n')}`);
  return out;
}

console.log('═══ ESCENARIO A — Milena: quiere producto, no paquete ═══');
let r = await turno('Y cuanto vale una caja de ganocafé 3 en 1');
r.capa.startsWith('motor') ? ok('el precio lo responde el motor, no el pedido') : mal('el precio no debía abrir el pedido');
hist.length = 0;
r = await turno('Me interesa comprar una caja de Gano Café');
r.texto.includes('¿Cuál prefiere?') ? ok('«Gano Café» a secas pregunta cuál (antes: cargó un té)') : mal('no preguntó la variante: ' + r.capa);
r = await turno('el 3 en 1');
/Ganocafé 3 en 1/.test(r.texto) && /qued[oó] cargado su pedido/i.test(r.texto) ? ok('la variante elegida se carga') : mal('no cargó la variante');
hist.length = 0;
r = await turno('Y cuanto vale una caja de ganocafé 3 en 1');
r = await turno('Solo quiero una caja');
r.capa.includes('2.45') ? ok('«solo quiero una caja» entra al pedido (antes: formulario de paquete)') : mal('no entró al pedido');
/qued[oó] cargado su pedido/i.test(r.texto) && /Ganocafé 3 en 1/.test(r.texto) ? ok('tomó el producto del hilo y lo cargó') : mal('no cargó el producto del hilo');
/luis-cabrejo\/productos/.test(r.texto) ? ok('enlace al catálogo con el ref del socio') : mal('sin enlace al catálogo');
((r.texto.split(/\n\s*\n/).pop() || '').match(/\?/g) || []).length === 1 ? ok('una sola pregunta al cierre') : mal('más de una pregunta al cierre');
r = await turno('hay sede en Medellín? dónde es la dirección');
r.capa.includes('2.48') ? ok('la sede la responde el nodo, sin dirección') : mal('la sede no la tomó el nodo');
/Luis Cabrejo/.test(r.texto) && !/carrera|calle|#/i.test(r.texto) && /hay una sede/.test(r.texto) ? ok('nombra a Luis, confirma la sede y no da dirección') : mal('dio dirección o no nombró al socio');
r = await turno('y donde queda exactamente?');
/Con gusto se la daría, pero esa parte la lleva Luis Cabrejo/.test(r.texto) ? ok('si insiste: una línea, remisión a Luis') : mal('la insistencia no cayó en la línea corta');
r = await turno('Me gustaría primero conocer el producto, sé que hay oficina en Bogotá, dónde quedan para comprar una caja');
r.capa.includes('2.48') ? ok('«dónde quedan para comprar una caja» va a la sede, no al pedido') : mal('abrió el pedido en vez de la sede: ' + r.capa);
r = await turno('la dirección en bogotá para comprar');
/Con gusto se la daría/.test(r.texto) ? ok('la insistencia por la dirección cae en la línea corta, no en «no logré identificar el producto»') : mal('la dirección no cayó en la sede: ' + r.capa);
r = await turno('Y para pedir a domicilio, cuanto vale el envío?');
r.capa.includes('2.47') ? ok('el envío lo responde el nodo con Luis por nombre') : mal('el envío no lo tomó el nodo');
r = await turno('Puedo hablar con un asesor');
r.capa.includes('2.46') ? ok('pedir una persona avisa al socio (nodo) en vez de prometerlo el modelo') : mal('no lo tomó el nodo de persona');
r = await turno('y el ganocafé clásico en qué se diferencia del 3 en 1?');
r.capa.includes('whatsapp_comprador') ? ok('la pregunta de producto va al motor como CLIENTE (whatsapp_comprador)') : mal('no fue al motor como comprador');
!/ESP-[123]|paquete de inicio|nombre completo|c[eé]dula/i.test(r.texto) ? ok('el motor no ofrece paquetes ni pide datos a quien ya compró') : mal('el motor volvió a paquetes/datos');
!r.capa.includes('BLOQUEADO') ? ok('el guardarraíl no bloqueó la respuesta de producto') : mal('guardarraíl bloqueó: ' + r.capa);
r = await turno('Gracias');
r.capa.includes('opt-in ofrecido') ? ok('al cerrar, la autorización de marketing va en su propio turno') : mal('no ofreció la autorización');
r = await turno('Sí');
r.capa.includes('opt-in = true') ? ok('el «sí» queda registrado como autorización') : mal('no leyó el sí');

console.log('\n═══ ESCENARIO B — Liliana: ya radicó el ESP-1 ═══');
hist.length = 0;
hist.push({ role: 'user', content: 'cuáles son los paquetes' },
  { role: 'assistant', content: 'Hay tres formas de empezar: *ESP-1 Inicial* $900.000 COP · *ESP-2 Empresarial* $2.250.000 COP · *ESP-3 Visionario* $4.500.000 COP. ¿Con cuál se identifica más?' },
  { role: 'user', content: 'quiero iniciar con el inicial, Liliana Pérez, cc 1234567, Bogotá' },
  { role: 'assistant', content: 'Listo, Liliana. Su vinculación quedó radicada con el ESP-1 Inicial. Ya le avisé a Luis Cabrejo; él la contacta por este medio para coordinar el pago.' });
{
  const t = await motor('Perfecto', 'whatsapp_radicado_esp1');
  console.log(`\n👤 Perfecto\n🤖 [motor (whatsapp_radicado_esp1)]\n${t.split('\n').map((l) => '   ' + l).join('\n')}`);
  !/nombre completo|c[eé]dula|n[uú]mero de identificaci[oó]n|¿con cu[aá]l/i.test(t) ? ok('ante «Perfecto» no vuelve a pedir datos ni paquete (antes: formulario de 4 datos)') : mal('volvió a pedir datos/paquete');
  /Luis/i.test(t) ? ok('recuerda que Luis la contacta') : mal('no mencionó al socio');
  t.length < 700 ? ok('acuse corto') : mal('respuesta larga para un acuse');
  const sim = respuestaRenta({ tipo: 'renta', tarifa: 'Kit de Inicio — 10%', clientes: '10' } as any, { radicado: { paquete: 'ESP-1', socio: 'Luis Cabrejo', composicionVista: false } });
  const cierre = sim?.split('\n').pop() ?? '';
  console.log(`\n🧮 simulador tras radicar → cierre: «${cierre}»`);
  /paquete Inicial, el que acaba de radicar/.test(cierre) ? ok('el simulador cierra sobre SU paquete (antes: «¿con cuál se identifica?»)') : mal('el simulador no reconoce la radicación');
}

console.log('\n═══ ESCENARIO C — los dos falsos positivos del guardarraíl ═══');
const A = 'El paquete no es un costo de membresía: es producto que usted recibe, usa y puede vender.';
const B = 'Gano Excel cobra, empaca y despacha a su puerta en Santa Marta. Usted no tiene que hacer nada más.';
!guardarrail(A) ? ok('«no es un costo de membresía» pasa') : mal('A bloqueado: ' + guardarrail(A));
!guardarrail(B) ? ok('«despacha… usted no tiene que hacer nada más» pasa') : mal('B bloqueado: ' + guardarrail(B));
guardarrail('Es una membresía mensual con acceso a cursos.') ? ok('la membresía afirmada sigue bloqueada') : mal('membresía afirmada pasó');
guardarrail('Usted comparte el enlace y no tiene que hacer nada más: el canal crece solo.') ? ok('el esfuerzo mínimo dicho del negocio sigue bloqueado') : mal('promesa de esfuerzo mínimo pasó');

console.log('\n═══ ESCENARIO E — el «sí» tras peso y azúcar se dicta con los datos de la tabla ═══');
{
  const { seguimientoSalud } = await import('../src/lib/wa-pedido');
  const { RECHAZO_SALUD_PESO, RECHAZO_SALUD_AZUCAR } = await import('../src/lib/wa-guardarrail-salud');
  const a = seguimientoSalud(RECHAZO_SALUD_PESO, 'Si');
  a && /110\.900/.test(a) && /¿Le muestro la foto\?$/.test(a) ? ok('tras el peso: ritual del Clásico con precio de tabla y oferta de foto') : mal('seguimiento del peso: ' + (a ?? 'null'));
  const b = seguimientoSalud(RECHAZO_SALUD_AZUCAR, 'sí');
  b && /110\.900/.test(b) && /272\.500/.test(b) && !/82\.500/.test(b) ? ok('tras el azúcar: Clásico y Cápsulas con precios de tabla (nunca $82.500)') : mal('seguimiento del azúcar: ' + (b ?? 'null'));
  seguimientoSalud(RECHAZO_SALUD_PESO, 'y cuánto cuesta?') === null ? ok('una pregunta a mitad no se toma como aceptación') : mal('tomó una pregunta como aceptación');
  seguimientoSalud('¿Le muestro las demás bebidas?', 'sí') === null ? ok('otra oferta no dispara el seguimiento de salud') : mal('disparó con otra oferta');
}

console.log('\n═══ ESCENARIO D — la foto no secuestra preguntas, y el peso no es reincidencia ═══');
{
  const { pideImagen } = await import('../src/lib/wa-productos');
  const { esRechazoSaludComun, RECHAZO_SALUD_PESO, RECHAZO_SALUD_ESTANDAR, rechazoSaludPorFamilia, clasificarPreguntaSalud } = await import('../src/lib/wa-guardarrail-salud');
  for (const t of ['cómo es la ganancia por paquetes empresariales', 'cómo es eso, dame contexto, quiero comprender', 'muéstreme cómo se gana', 'quiero ver los números'])
    !pideImagen(t) ? ok(`no es foto: «${t}»`) : mal(`tomó como foto: «${t}»`);
  for (const t of ['tienes una foto del 3 en 1', 'muéstreme el ganocafé clásico', 'cómo es la caja de cápsulas de ganoderma', 'muéstreme las bebidas'])
    pideImagen(t) ? ok(`sí es foto: «${t}»`) : mal(`no reconoció la foto: «${t}»`);
  !esRechazoSaludComun(RECHAZO_SALUD_PESO) ? ok('la respuesta del peso no cuenta como reincidencia') : mal('el peso cuenta como reincidencia');
  esRechazoSaludComun(RECHAZO_SALUD_ESTANDAR) ? ok('el rechazo común sí cuenta como reincidencia') : mal('el común no cuenta');
  const c = clasificarPreguntaSalud('y para la diabetes que productos me pueden ayudar');
  const r = c ? rechazoSaludPorFamilia(c, false) : null;
  r?.familia === 'azucar' && /sin azúcar ni crema/.test(r.texto) ? ok('diabetes → familia azúcar, con el Clásico y las Cápsulas por su composición') : mal('diabetes no cayó en azúcar: ' + JSON.stringify(r?.familia));
  const g = clasificarPreguntaSalud('tengo gastritis, me sirve?'); const rg = g ? rechazoSaludPorFamilia(g) : null;
  rg?.familia === 'comun' && /estamos orgullosos/.test(rg.texto) ? ok('gastritis → familia común, con orgullo por los productos') : mal('gastritis no cayó en común');
  const p = clasificarPreguntaSalud('Qué producto es bueno para adelgazar');
  (p && rechazoSaludPorFamilia(p).familia === 'peso') ? ok('adelgazar → familia peso') : mal('adelgazar no cayó en peso');
}

console.log(`\n${'─'.repeat(60)}\n${fallos ? `❌ ${fallos} comprobación(es) fallaron` : '✅ Prueba de mesa completa en verde'}`);
if (fallos) process.exit(1);
