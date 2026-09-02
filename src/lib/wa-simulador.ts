/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Respuesta al escenario que la persona armó en el simulador (WhatsApp Flow).
 *
 * POR QUÉ EXISTE: al completar el Flow, el webhook traducía el payload a una
 * frase ("Acabo de usar el simulador: tarifa ESP-2, 10 clientes…") y se la
 * mandaba al motor. El motor respondía con el ejemplo DICTADO de renta — fijo,
 * al 17% del Visionario — sin leer lo que la persona había elegido. En la
 * prueba del Director (19 ago 2026) eligió ESP-2 al 16% y recibió "calculado al
 * 17%, la tarifa del Visionario"; y al armar dos escenarios seguidos recibió el
 * mismo bloque dos veces, carácter por carácter.
 *
 * Quien acaba de producir su propia cifra quiere verla reconocida, no que le
 * dicten otra. Aquí se le devuelve SU escenario, calculado con las mismas tablas
 * del Flow, sin pasar por el modelo — es un nodo determinístico, y se dicta.
 *
 * ⚠️ Las cifras son las del Flow publicado (docs/handoff/queswa/flows/
 * simulador-de-ingresos.flow.json). Si el Flow cambia, esto cambia con él.
 */

/** Renta recurrente: COP por cliente, por punto de tarifa y POR CAJA al mes. */
// La caja de Ganocafé aporta 14 CV, y el CV se liquida a la tasa fija: 14 × $45
// por punto de tarifa = $630. El consumo estándar son 4 cajas al mes (una a la
// semana) → 2.520 por cliente y por punto, que es la cifra histórica del Flow.
// Las cuatro pantallas de renta ofrecen 10 / 100 / 1.000 clientes con cuatro
// cajas fijas (Director, 1 sep 2026: cosas simples — los conceptos nucleares
// primero, los detalles después en el chat). La del 17% tuvo un desplegable de
// clientes × cajas (16 combinaciones) del 25 ago al 1 sep; el decodificador
// del webhook conserva ese formato por si una tarjeta vieja se completa.
const COP_POR_CLIENTE_PUNTO_Y_CAJA = 630;
const CAJAS_ESTANDAR = 4;

/** GEN5: COP por UN paquete comprado en cada una de las cinco generaciones. */
const GEN5_POR_PAQUETE: Record<string, { etiqueta: string; suma: number }> = {
  'ESP-3': { etiqueta: 'ESP-3 Visionario',  suma: 1_125_000 }, // 675.000 + 90.000×3 + 180.000
  'ESP-2': { etiqueta: 'ESP-2 Empresarial', suma:   562_500 },
  'ESP-1': { etiqueta: 'ESP-1 Inicial',     suma:   225_000 },
};

export interface EscenarioRenta   { tipo: 'renta'; tarifa: string; clientes: string; consumo?: string }
export interface EscenarioGen5    { paquete: string; cantidad: string }
export interface EscenarioRegalia { tipo: 'regalia'; distribuidores: string }
export interface EscenarioNiveles { tipo: 'niveles'; nivel: string }

/**
 * La fila del nivel n: el canal de ese tamaño CONSUMIENDO. T = 2^(n+1) − 2
 * distribuidores × 56 CV al mes → por lado T × 28 CV → al 10% ($450 por CV a
 * la tasa fija) = T × $12.600 al mes. Nivel 12: 8.190 · 229.320 CV · $103.194.000.
 *
 * ⚠️ Corrección del Director (1 sep 2026): la tabla vieja ponía $51.609.600 «a
 * la semana» en el nivel 12 — era la semana en que se compran los 4.096 kits
 * de ese nivel, un evento de construcción, no el ingreso del canal
 * consumiendo. Y su columna «acumulado» ($25.200 × (2^n − 1)) es exactamente
 * T × $12.600: el mensual del canal con ese tamaño, mal rotulado durante meses.
 * La semana es el mensual entre cuatro.
 */
function filaNivel(n: number): { total: number; cvLado: number; mensual: number; semanal: number } | null {
  if (!Number.isInteger(n) || n < 1 || n > 12) return null;
  const total = 2 ** (n + 1) - 2;
  const mensual = total * 12_600;
  return { total, cvLado: total * 28, mensual, semanal: Math.round(mensual / 4) };
}

/**
 * Las filas de la tabla canónica de NIVELES_02 (Kit de Inicio al 10%), con el
 * EJE EN EL CONSUMO: cuántos distribuidores consumen → regalía semanal. Son las
 * mismas cifras del arsenal y de la pantalla REGALIA_EQUIPO del Flow: si una
 * cambia, cambian las tres.
 *
 * ⚠️ El eje NO es el nivel a propósito (Director, 31 ago 2026): nivel → dinero
 * es la escalera dibujada — la silueta que Meta y el prospecto leen como
 * pirámide. El mismo número contado por distribuidores consumiendo muestra la
 * cadena real: gente → consumo → comisión. Por lo mismo el acumulado no viaja
 * aquí — vive en el arsenal, junto a su origen.
 */
const REGALIA_TABLA: Record<string, { semanal: number }> = {
  '6':    { semanal: 50_400 },
  '30':   { semanal: 201_600 },
  '126':  { semanal: 806_400 },
  '510':  { semanal: 3_225_600 },
  '2046': { semanal: 12_902_400 },
  '8190': { semanal: 51_609_600 },
};

const cop = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

/** "ESP-2 Empresarial — 16%" → { nombre: 'ESP-2 Empresarial', pct: 16 } */
function leerTarifa(tarifa: string): { nombre: string; pct: number } | null {
  const m = tarifa.match(/(\d+)\s*%/);
  if (!m) return null;
  return { nombre: tarifa.replace(/\s*[—–-]\s*\d+\s*%.*$/, '').trim(), pct: Number(m[1]) };
}

/** Nombre corto del paquete para la pregunta de cierre ("Visionario"). */
function corto(nombre: string): string {
  return nombre.replace(/^ESP-\d\s+/, '').trim();
}

export interface OpcionesCierre {
  /** La composición de los paquetes ya se mostró u ofreció en esta conversación:
   *  volver a ofrecer "¿qué trae el paquete?" repite una pregunta ya atendida
   *  (prueba conversacional, 20 ago 2026). El cierre pasa a pedir la elección. */
  composicionYaOfrecida?: boolean
  /** La persona YA radicó su vinculación en esta conversación. Preguntarle con
   *  cuál paquete arranca dos minutos después de que eligió uno se lee como que
   *  no leímos (Liliana, 27 ago 2026). El cierre vuelve sobre SU paquete. */
  radicado?: {
    /** Clave del paquete radicado: 'ESP-1' · 'ESP-2' · 'ESP-3'. */
    paquete: string
    /** Nombre corto del socio que coordina el pago ("Luis Cabrejo"). */
    socio?: string
    /** La composición de ESE paquete ya se mostró en el hilo. */
    composicionVista: boolean
  }
}

/**
 * Cierre para quien ya radicó. Primero la composición de su propio paquete —lo
 * tangible que va a recibir— con la forma «qué trae el paquete X», que es la que
 * el «sí» siguiente convierte en el pin de composición dictado (probado el 27 ago,
 * 9:45). Si ya la vio, el paso que sigue: qué pasa tras confirmar el pago
 * (ACTIVACION_01).
 */
function cierreRadicado(r: NonNullable<OpcionesCierre['radicado']>): string {
  const p = GEN5_POR_PAQUETE[r.paquete.toUpperCase().replace(/\s+/g, '')];
  if (p && !r.composicionVista) {
    return `¿Le muestro qué trae el paquete ${corto(p.etiqueta)}, el que acaba de radicar?`;
  }
  return `¿Le cuento qué pasa después de que ${r.socio ?? 'el socio'} le confirme el pago?`;
}

export function respuestaRenta(e: EscenarioRenta, opciones: OpcionesCierre = {}): string | null {
  const t = leerTarifa(e.tarifa);
  const clientes = Number(e.clientes);
  const cajas = Number(e.consumo ?? CAJAS_ESTANDAR);
  if (!t || !Number.isFinite(clientes) || clientes <= 0) return null;
  if (!Number.isFinite(cajas) || cajas <= 0) return null;

  const monto = clientes * t.pct * COP_POR_CLIENTE_PUNTO_Y_CAJA * cajas;
  const esKit = /kit/i.test(t.nombre);
  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : opciones.composicionYaOfrecida
    ? '¿Con cuál de los tres paquetes se identifica más?'
    // Quien simula con la tarifa del Kit es el perfil exacto de Los 12 Niveles
    // (Director, 2 sep 2026). Antes ofrecía «los tres paquetes» — el empujón
    // hacia arriba que la doctrina del hilo retiró.
    : esKit
      ? '¿Le muestro la estrategia de los 12 Niveles, que corre justo con esta tarifa?'
      // 23 ago (Director): tras la renta, la pregunta lleva a la OTRA forma de ganar —
      // la de los paquetes— porque sin ese contexto la persona no la pregunta, y es la
      // que le muestra que puede ganar desde el comienzo. La oferta nombra «ejemplo»
      // y «paquetes» a propósito: así el «sí» dispara el ejemplo GEN5 dictado.
      // Abre con lo que acaba de ver y cierra con lo nuevo; la categoría («la otra
      // forma de ganar») y su aposición apilaban dos ideas (Director, 29 ago 2026).
      // «Le muestro un ejemplo» + «paquetes» son las dos llaves que el motor lee en
      // la oferta para que el «sí» dispare el ejemplo GEN5 dictado (_ofrecioEjemplo,
      // _nombraGen5 en route.ts) — sin ellas, el «sí» repite el de renta.
      : 'Eso es lo que le deja el consumo de sus clientes. ¿Le muestro un ejemplo de lo que le deja la compra de paquetes empresariales en su canal?';

  return `Con la tarifa del *${t.nombre}* (${t.pct}%) y *${clientes} clientes en cada centro de negocio*, su renta estaría alrededor de *${cop(monto)} al mes*.

${cajas === 4 ? 'El cálculo supone que cada cliente compra una caja de Ganocafé a la semana' : `El cálculo supone que cada cliente compra ${cajas} cajas de Ganocafé al mes`}. Y ahí está la palanca: el sistema suma sus clientes y los de sus distribuidores, y ese volumen se le liquida cada viernes.

${cierre}`;
}

/**
 * El escenario de la Regalía de Equipo: la persona eligió cuántos
 * distribuidores consumen y aquí se le reconoce SU fila. El marco es el de la
 * doctrina: lo que produce la cifra es el consumo del canal — la facturación—,
 * y el potencial es matemático, nunca lo que la persona va a recibir en una
 * fecha. El cierre encadena a la inversión («con cuánto se empieza»), que es
 * el cierre canónico de NIVELES_02.
 */
export function respuestaRegalia(e: EscenarioRegalia, opciones: OpcionesCierre = {}): string | null {
  const fila = REGALIA_TABLA[e.distribuidores];
  if (!fila) return null;

  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : '¿Le muestro con cuánto se empieza?';

  const cuantos = Number(e.distribuidores).toLocaleString('es-CO');

  return `Con *${cuantos} distribuidores consumiendo* en su canal —cada uno con sus cuatro cajas al mes—, la Regalía de Equipo al 10% del Kit estaría alrededor de *${cop(fila.semanal)} a la semana*.

Lo que produce esa cifra es el consumo: el sistema empareja su canal izquierdo con el derecho y liquida el 10% de ese volumen. Es el potencial matemático — el ritmo lo pone cada canal.

${cierre}`;
}

/**
 * El escenario nivel por nivel (Director, 1 sep 2026): la pantalla del Flow
 * cumple la promesa del cierre —«la tabla con la proyección nivel por nivel»— y
 * cada nivel trae su causa al lado: los distribuidores, el producto que mueven
 * y la regalía. La cadena gente → consumo → comisión queda a la vista en la
 * misma frase, que es la defensa contra la lectura de escalera.
 */
export function respuestaNiveles(e: EscenarioNiveles, opciones: OpcionesCierre = {}): string | null {
  const fila = filaNivel(Number(e.nivel));
  if (!fila) return null;

  // Quien llega aquí pasó por NIVELES_01, que ya dijo el precio del Kit — «¿con
  // cuánto se empieza?» le repetía lo que acababa de leer («ya me lo dijiste»,
  // Director, 1 sep 2026). El paso que sigue a la proyección es la vinculación
  // (NIVELES_04: los cuatro datos).
  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : '¿Le muestro cómo se vincula a la estrategia?';
  const n = (x: number) => x.toLocaleString('es-CO');

  return `En el *nivel ${e.nivel}* su canal suma *${n(fila.total)} distribuidores consumiendo* —cada uno con sus cuatro cajas al mes—, que mueven *${n(fila.cvLado)} CV* de producto por lado cada mes. La Regalía de Equipo al 10% del Kit estaría alrededor de *${cop(fila.mensual)} al mes* — unos ${cop(fila.semanal)} por semana, liquidados por ciclos.

Lo que produce esa cifra es el consumo: el sistema empareja su canal izquierdo con el derecho y liquida el 10% de ese volumen. Es el potencial matemático de la duplicación 2×2 — el ritmo lo pone cada canal.

${cierre}`;
}

export function respuestaGen5(e: EscenarioGen5, opciones: OpcionesCierre = {}): string | null {
  const p = GEN5_POR_PAQUETE[e.paquete.toUpperCase().replace(/\s+/g, '')];
  const cantidad = Number(e.cantidad);
  if (!p || !Number.isFinite(cantidad) || cantidad <= 0) return null;

  const total = p.suma * cantidad;
  const compras = cantidad * 5;
  const paquetes = cantidad === 1 ? 'un paquete' : `${cantidad} paquetes`;
  const comprados = cantidad === 1 ? 'comprado' : 'comprados';

  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : opciones.composicionYaOfrecida
    ? '¿Con cuál de los tres paquetes se identifica más?'
    : `¿Le muestro qué trae el paquete ${corto(p.etiqueta)}, que es el inventario con el que arranca?`;

  return `Con *${paquetes} ${p.etiqueta}* ${comprados} en cada una de las cinco generaciones, la suma de esas ${compras} compras es *${cop(total)}*.

Esa comisión se liquida por ciclos semanales y le cae en su cuenta bancaria cada viernes.

${cierre}`;
}
