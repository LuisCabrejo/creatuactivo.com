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

// Solo el tipo: el conductor importa de este archivo, y un import de valor haría ciclo.
import type { PaisConductor } from '@/lib/queswa-conductor';
import { CIERRE_SOCIO_PROYECCION, CIERRE_VIDEO_NIVELES_SOCIO, CIERRES_VIDEO_NIVELES_SOCIO_ANTERIORES } from '@/lib/wa-apertura';
import { sinDiacriticos } from '@/lib/texto-normalizar';

/** Renta recurrente: COP por cliente, por punto de tarifa y POR CAJA al mes. */
// La caja de Ganocafé aporta 14 CV, y el CV se liquida a la tasa fija: 14 × $45
// por punto de tarifa = $630. El consumo estándar son 4 cajas al mes (una a la
// semana) → 2.520 por cliente y por punto, que es la cifra histórica del Flow.
// Las cuatro pantallas de renta ofrecen 10 / 100 / 1.000 clientes con cuatro
// cajas fijas (Director, 1 sep 2026: cosas simples — los conceptos nucleares
// primero, los detalles después en el chat). La del 17% tuvo un desplegable de
// clientes × cajas (16 combinaciones) del 25 ago al 1 sep; el decodificador
// del webhook conserva ese formato por si una tarjeta vieja se completa.
export const CV_POR_CAJA = 14;
/** COP que paga un CV por cada punto de tarifa: la tasa fija de $4.500 × 1%. */
export const COP_POR_CV_Y_PUNTO = 45;
const COP_POR_CLIENTE_PUNTO_Y_CAJA = CV_POR_CAJA * COP_POR_CV_Y_PUNTO; // 630
const CAJAS_ESTANDAR = 4;

/** GEN5: COP por UN paquete comprado en cada una de las cinco generaciones. */
const GEN5_POR_PAQUETE: Record<string, { etiqueta: string; suma: number }> = {
  'ESP-3': { etiqueta: 'ESP-3 Visionario',  suma: 1_125_000 }, // 675.000 + 90.000×3 + 180.000
  'ESP-2': { etiqueta: 'ESP-2 Empresarial', suma:   562_500 },
  'ESP-1': { etiqueta: 'ESP-1 Inicial',     suma:   225_000 },
};

/**
 * ¿Este mensaje es el reporte que el webhook redacta al completar el Flow
 * («Acabo de usar el simulador…»)? La persona eligió una tarifa o un paquete
 * para VER una cifra, no para comprarlo: nada de lo que nombra es una selección.
 *
 * Una sola función para las DOS capturas de paquete —la del motor y la del
 * webhook (bloque 1.35)—. La regla nació el 1 sep 2026 con Liliana y se aplicó
 * solo en el motor; la del webhook la saltó, y Luz (12 sep) quedó con «paquete
 * ESP-1» por haber movido el simulador. Una regla en dos puertas se escribe una
 * vez.
 */
export function esReporteDelSimulador(texto: string): boolean {
  return /^\s*acabo de usar el simulador/i.test(texto || '');
}

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

/** Pesos a dólares a la tasa fija de Gano. Bajo cien dólares lleva centavos: $5.60, no $6. */
const COP_POR_USD = 4_500;
const usd = (n: number) => {
  const d = n / COP_POR_USD;
  const decimales = d < 100 && !Number.isInteger(d) ? 2 : 0;
  return `$${d.toLocaleString('en-US', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })} USD`;
};

/**
 * La cifra en la moneda del país (2 oct 2026), con la regla de `textoBonoPaquetes`:
 * Colombia en pesos, Estados Unidos en dólares, otro país en dólares con los pesos
 * al lado. Yellitza Rosario (+1, Miami) vio el Kit y los paquetes en dólares y el
 * resultado del simulador en pesos, en el mismo hilo. Sin país, pesos (Director,
 * 23 sep 2026). ⚠️ La tarjeta del Flow sigue en pesos: es JSON fijo en Meta.
 */
const dinero = (n: number, pais?: PaisConductor) =>
  pais === 'US' ? usd(n) : pais === 'XX' ? `${usd(n)} (${cop(n)})` : cop(n);

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
  /** La estrategia de los 12 Niveles ya está en el hilo (NIVELES_01 dictado o
   *  compuesto). El simulador de renta cierra ofreciéndola; si ya la vio, la
   *  misma pregunta dos veces se lee como que no leímos (prueba conversacional,
   *  3 sep 2026). El cierre sigue al paso siguiente: el bono por paquetes. */
  estrategiaYaVista?: boolean
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
  /** País de quien escribe: la cifra sale en su moneda (ver `dinero`). */
  pais?: PaisConductor
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
  // TODOS los escenarios de renta cierran ofreciendo la estrategia (Director,
  // 3 sep 2026): recurrentes → estrategia es la avenida por defecto, y los
  // paquetes/GEN5 pasan a ser solo pull. El puente renta→GEN5 que vivía aquí
  // —«¿le muestro lo de los paquetes empresariales?»— era el último empujón a
  // GEN5 sin que nadie lo pidiera; se retiró. El GEN5 sigue respondiéndose a
  // quien pregunte por él.
  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : opciones.estrategiaYaVista
    ? '¿Le muestro las ganancias por la compra de paquetes empresariales en su sistema?'
    : '¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?';

  return `Con la tarifa del *${t.nombre}* (${t.pct}%) y *${clientes} clientes en cada centro de negocio*, su renta estaría alrededor de *${dinero(monto, opciones.pais)} al mes*.

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

  return `Con *${cuantos} distribuidores consumiendo* en su sistema —cada uno con sus cuatro cajas al mes—, la Regalía de Equipo al 10% del Kit estaría alrededor de *${dinero(fila.semanal, opciones.pais)} a la semana*.

Lo que produce esa cifra es el consumo: el sistema empareja su canal izquierdo con el derecho y liquida el 10% de ese volumen. Es el potencial matemático — el ritmo lo pone cada sistema.

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

  // Quien llega aquí pasó por NIVELES_01. Tras la proyección del ingreso
  // recurrente se ofrecen las ganancias por la compra de paquetes empresariales
  // y solo después la vinculación (Director, 3 sep 2026): mismo cierre que la
  // tabla NIVELES_02, para que el «sí» caiga en el nodo 2.355 del webhook.
  // ⚠️ Las formas de ganar NO se numeran: hay doce, y las dos del inicio se
  // nombran por su mecanismo, nunca «primera» y «segunda».
  //
  // El mensaje AGREGA, no repite (auditoría con Gemini, 3 sep 2026): la pantalla
  // ya mostró CV por lado y la cifra semanal, y volver a leerlos era lo primero
  // que sonaba a bot. Se fija la cifra UNA vez —la tarjeta se sella al
  // completarse y este texto es lo único que queda legible en el hilo—, sin CV
  // ni emparejamiento (esa mecánica vive en NIVELES_02 para quien la pregunte),
  // y se conserva «potencial matemático, el ritmo lo pone cada sistema», que es el
  // descargo de resultados no garantizados dicho con dignidad.
  const cierre = opciones.radicado
    ? cierreRadicado(opciones.radicado)
    : '¿Le muestro las ganancias por la compra de paquetes empresariales en su sistema?';
  const n = (x: number) => x.toLocaleString('es-CO');

  return `Ese es el *nivel ${e.nivel}*: ${n(fila.total)} distribuidores consumiendo, y una regalía cercana a *${dinero(fila.mensual, opciones.pais)} al mes*, liquidada por ciclos semanales.

La cifra la produce el consumo: mientras sus distribuidores compren sus cajas cada mes, hay regalía. Es el potencial matemático de la duplicación 2×2, y el ritmo lo pone cada sistema.

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
    // «¿Le detallo exactamente qué productos trae el paquete X?» es la forma del
    // Director (3 sep 2026): la anterior —«…que es el inventario con el que
    // arranca»— colgaba una explicación a la pregunta. Los detectores del «sí»
    // (`_ofertaComposicion` en el motor, `composicionYaOfrecida` aquí) aceptan
    // «qué productos trae» además de «qué trae».
    : `¿Le detallo exactamente qué productos trae el paquete ${corto(p.etiqueta)}?`;

  // Tras el simulador la cifra va pegada a su origen —las compras— y la cadencia
  // en una sola línea, la del Director (3 sep 2026). Se descartó «ese escenario
  // proyecta un retorno»: «retorno» convierte una comisión en rendimiento sobre
  // lo invertido, y «para materializar esos números» promete que ocurren.
  return `Con *${paquetes} ${p.etiqueta}* ${comprados} en cada una de las cinco generaciones, la suma de esas ${compras} compras es *${dinero(total, opciones.pais)}*.

Esa comisión le entra a medida que se compran los paquetes.

${cierre}`;
}

/**
 * Cuánto producto tiene que moverse para que la comisión cubra la compra del
 * distribuidor: una caja, o las cuatro del mes.
 *
 * Yesid Triana (29 sep 2026) preguntó cuánto necesita ganar una persona para
 * consumir una caja a la semana o cuatro al mes, y el modelo inventó «30 sobres»
 * (son 20) y una regla del 10% del ingreso. Director (30 sep): la pregunta, tal
 * como viene, se responde sola —lo que vale la caja—; la de fondo es cuánto hay
 * que mover para que el negocio la pague. Se responden las dos, con las mismas
 * tablas del simulador: al 10%, la tarifa por defecto, y al 17%, el tope del
 * plan. Texto aprobado por el Director el 30 sep 2026.
 *
 * ⚠️ Junta un precio con lo que hace falta para cubrirlo: es una excepción
 * DECIDIDA a la regla de no poner precio y comisión en el mismo bloque (ver
 * CLAUDE.md, «preguntaSoloPorPrecio»). No se «corrige». Las cifras se redondean
 * hacia arriba: «unas 18 cajas» tiene que alcanzar, no quedarse corto.
 */
export function textoCubrirCompra(precioCaja: number, nombreCaja = 'Ganocafé 3 en 1'): string {
  const cuatro = precioCaja * 4;
  const cv = (monto: number, tarifa: number) => Math.ceil(monto / (tarifa * COP_POR_CV_Y_PUNTO));
  const cajas = (monto: number, tarifa: number) => Math.ceil(monto / (tarifa * COP_POR_CV_Y_PUNTO * CV_POR_CAJA));
  const n = (x: number) => x.toLocaleString('es-CO');
  return [
    `Una caja de ${nombreCaja} vale *${cop(precioCaja)}*, y las cuatro del mes, *${cop(cuatro)}*.`,
    '',
    `Para que la comisión le cubra esa compra, lo que cuenta es cuánto producto se mueve en su sistema, y eso se mide en puntos, no en pesos: cada caja aporta *${CV_POR_CAJA} CV*, y el Binario paga sobre el GCV que se empareja entre su canal izquierdo y su canal derecho.`,
    '',
    `• *Al 10%*, la tarifa por defecto, una caja se cubre con unos *${n(cv(precioCaja, 10))} CV* emparejados: unas ${n(cajas(precioCaja, 10))} cajas al mes en cada canal. Las cuatro, con unos *${n(cv(cuatro, 10))} CV*: unas ${n(cajas(cuatro, 10))} cajas en cada canal.`,
    '',
    `• *Al 17%*, el tope del plan, bastan unos *${n(cv(precioCaja, 17))} CV* para una caja (unas ${n(cajas(precioCaja, 17))} en cada canal) y unos *${n(cv(cuatro, 17))} CV* para las cuatro (unas ${n(cajas(cuatro, 17))} en cada canal).`,
    '',
    '¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?',
  ].join('\n');
}

// ─── Los 12 Niveles y el paquete del SOCIO (2 oct 2026) ──────────────────────
//
// Miguel Barahona, Visionario, vio la tabla de NIVELES_02 —la del Kit, al 10%— y
// pidió «ese mismo sistema en paquetes empresariales 3». El modelo la compuso al 17%
// con la aritmética mal y el guardarraíl la bloqueó, como debía.
// ⚠️ Y el 17% NO es la tarifa del socio para Los 12 Niveles: la del paquete VENCE
// —15% por dos meses, 16% por cuatro, 17% por seis— y después el sistema aplica la
// más alta entre su rango (10% sin rango, hasta 15% en Diamante) y las promociones
// de Gano (COMP_BIN_02, COMP_BIN_03, COMP_BIN_11). Solo el 10% no vence, y por eso
// la estrategia se cuenta al 10%. Una tabla hasta el nivel 12 al 17% —estuvo en
// producción unas horas el 2 oct— proyecta una tarifa de seis meses sobre una
// estructura que tarda años. Ahora: la tabla, al 10%; la tarifa del paquete, en una
// línea con su vigencia; su caso con su tarifa de hoy, en la Proyección Patrimonial.
// Copy aprobado por el Director el 2 oct 2026. Solo lo llama el webhook, en el
// bloque del socio.

export type PaqueteEsp = 'ESP-1' | 'ESP-2' | 'ESP-3';

const TARIFA_DEL_PAQUETE: Record<PaqueteEsp | 'KIT', { pct: number; nombre: string; vigencia: string | null }> = {
  'KIT':   { pct: 10, nombre: 'Kit de Inicio',     vigencia: null },
  'ESP-1': { pct: 15, nombre: 'ESP-1 Inicial',     vigencia: 'dos meses' },
  'ESP-2': { pct: 16, nombre: 'ESP-2 Empresarial', vigencia: 'cuatro meses' },
  'ESP-3': { pct: 17, nombre: 'ESP-3 Visionario',  vigencia: 'seis meses' },
};

/** Las filas de NIVELES_02: 30 · 126 · 510 · 2.046 · 8.190 distribuidores. */
const NIVELES_DE_LA_TABLA = [4, 6, 8, 10, 12];
/** La tarifa con que se cuenta la estrategia: la única que no vence. */
const PCT_BASE = 10;

/** El paquete que nombra el mensaje: «esp-3», «esp 3», «paquetes empresariales 3», «visionario», «17%». */
function paqueteNombrado(t: string): PaqueteEsp | null {
  const n = /\besp\s*-?\s*([123])(?!\d)/.exec(t)?.[1]
    ?? /\bpaquetes?\s+(?:empresariales?\s+)?(?:n[uú]mero\s+)?([123])(?!\d)/.exec(t)?.[1]
    ?? (/\bvis[io]{1,2}nari[oa]s?\b/.test(t) ? '3' : null)
    ?? ({ '15': '1', '16': '2', '17': '3' } as Record<string, string>)[/(?<!\d)(15|16|17)\s?%/.exec(t)?.[1] ?? ''];
  return n ? (`ESP-${n}` as PaqueteEsp) : null;
}

/**
 * ¿El socio pide Los 12 Niveles con la tarifa de un paquete? Necesita el paquete y
 * que se hable de esa tabla —en el mensaje («ese mismo sistema», «la tabla», «los
 * niveles») o en el último turno del bot—. Lo que pregunta qué trae o cuánto cuesta
 * un paquete, o por el bono, es otra cosa y sigue su camino.
 */
export function paqueteParaNivelesSocio(texto: string, ultimoBot: string): PaqueteEsp | null {
  const t = (texto || '').toLowerCase();
  if (/\b(trae|traen|incluye|contiene|productos?|inventario|cuesta|cuestan|vale|valen|precio|valor|bono|gen\s?5)\b/.test(t)) return null;
  const paquete = paqueteNombrado(t);
  if (!paquete) return null;
  const hablaDeLaTabla = /\b(niveles?|mism[oa]s?|tabla|proyecci[oó]n|cifras?|n[uú]meros)\b/.test(t)
    || /8\.190 distribuidores|los 12 niveles|regal[ií]a de equipo al 10/i.test(ultimoBot || '');
  return hablaDeLaTabla ? paquete : null;
}

/** «Ese mismo sistema con el ESP-3»: la tarifa con su vigencia, sin tabla, y su caso en la Proyección Patrimonial. */
export function respuestaNivelesSocio(paquete: PaqueteEsp): string {
  const { pct, nombre, vigencia } = TARIFA_DEL_PAQUETE[paquete];
  return [
    `Con el *${nombre}* la estructura es la misma, y la tarifa sube al *${pct}%* durante los primeros ${vigencia}; después el sistema aplica la más alta entre su rango y las promociones de Gano. Por eso Los 12 Niveles se cuentan con la base del ${PCT_BASE}%, que no vence.`,
    '',
    'Para ver su caso con su tarifa de hoy, la Proyección Patrimonial de su Centro de Mando lo calcula con sus datos de Gano. ¿Le mando el acceso?',
  ].join('\n');
}

/** La línea de la tarifa del paquete, con su vigencia (sin paquete o con el Kit, ninguna). */
function lineaTarifaDelPaquete(paquete: PaqueteEsp | 'KIT' | null): string | null {
  if (!paquete || paquete === 'KIT') return null;
  const { pct, nombre, vigencia } = TARIFA_DEL_PAQUETE[paquete];
  return `Con su *${nombre}*, los primeros ${vigencia} la tarifa es del *${pct}%*; después el sistema le aplica la más alta entre su rango y las promociones de Gano.`;
}

// ─── Los 12 Niveles para el SOCIO: el video y el detalle (2 oct 2026) ────────
//
// Director, tras probarlo: pidió la estrategia y le llegó el texto; mejor el video.
// Y quien quiere estudiarla pide detalles: se le explican en texto, en cuatro pasos
// y nivel por nivel con SU tarifa, y se le da el enlace a la pantalla de los
// números de su presentación (`?pantalla=9`), donde mueve el porcentaje él mismo.
// El hilo de 12 Niveles del prospecto sigue cerrado al socio: esto es otra puerta.

/** «12 niveles», «doce niveles», y el pulgar: «12 nivles», «docce», «nvieles». Se comparan sin tildes. */
const RE_DOCE_NIVELES = /(?:\b12|\b(?:doc+e|dcoe|doec))\s*(?:niv[a-z]{0,5}|n[a-z]?v[a-z]?l|nv[a-z]{1,3}l)/i;
const RE_PIDE_DETALLE = /d(?:e?t{1,2}|te)a?l{1,2}e|nivel por nivel|estudi|tabla|cifras?|n[uú]meros|c[oó]mo se gana|cu[aá]nto\s+(se gana|gano|ganar[ií]a|da|sale|deja|produce|genera)/i;
const RE_PIDE_VERLO = /\b(ver|v[eé]rl[oa]s?|mu[eé]str|mostr|d[aáeé]me|env[ií]|m[aá]nd|quiero|estrategia|v[ií]deo|qu[eé]\s+(son|es)|expl[ií](c|qu)|c[oó]mo\s+(funciona|es|son))/i;
/** Las preguntas sobre la estrategia que tienen respuesta propia en el arsenal (NIVELES_03 a 09). */
const RE_OTRA_PREGUNTA_NIVELES = /hasta\s+cu[aá]ndo|qu[eé]\s+pasa\s+si|inversi[oó]n|cu[aá]nto\s+cuesta|particip|vincul|me\s+demoro|fecha/i;

/**
 * ¿El socio pide la estrategia (el video) o el detalle? El «sí» al pie del video es
 * el detalle. Lo que nombra un paquete lo atiende antes el 2.221 con su tabla.
 */
export function pasoNivelesSocio(texto: string, ultimoBot: string, acepta: boolean): 'video' | 'detalle' | null {
  const pie = (ultimoBot || '').trimEnd();
  if (acepta && [CIERRE_VIDEO_NIVELES_SOCIO, ...CIERRES_VIDEO_NIVELES_SOCIO_ANTERIORES].some((c) => pie.endsWith(c))) return 'detalle';
  const t = sinDiacriticos(texto || '');
  if (!RE_DOCE_NIVELES.test(t) || RE_OTRA_PREGUNTA_NIVELES.test(t)) return null;
  if (RE_PIDE_DETALLE.test(t)) return 'detalle';
  return RE_PIDE_VERLO.test(t) ? 'video' : null;
}

/**
 * Los 12 Niveles en cuatro pasos y nivel por nivel, al 10% —la tarifa que no vence—,
 * con la del paquete del socio en una línea y su vigencia. Copy aprobado por el
 * Director el 2 oct 2026. Termina en el enlace, sin pregunta: quien pidió estudiarlo
 * ya tiene adónde ir, y en esa pantalla mueve el porcentaje él mismo.
 */
export function detalleNivelesSocio(paquete: PaqueteEsp | 'KIT' | null, pais: PaisConductor | undefined, enlacePresentacion: string): string {
  const n = (x: number) => x.toLocaleString('es-CO');
  const filas = NIVELES_DE_LA_TABLA.map((nivel) => {
    const f = filaNivel(nivel)!;
    return `*Nivel ${nivel}* · ${n(f.total)} distribuidores · ${dinero(f.cvLado * PCT_BASE * COP_POR_CV_Y_PUNTO, pais)} al mes`;
  });
  const tarifa = lineaTarifaDelPaquete(paquete);
  return [
    'Se lo explico en cuatro pasos:',
    '',
    '1. Usted conecta mínimo dos distribuidores: uno en su canal izquierdo y otro en el derecho.',
    '2. Cada uno hace lo mismo y conecta a otros dos. Eso es la duplicación 2×2, y cada vuelta es un nivel.',
    '3. Cada distribuidor compra sus cuatro cajas al mes, que son 56 CV.',
    `4. La compañía empareja cada punto de su canal izquierdo con su equivalente en el derecho y le paga el ${PCT_BASE}% sobre ese volumen, liquidado por ciclos semanales.`,
    '',
    'Así se ve, nivel por nivel:',
    '',
    ...filas,
    ...(tarifa ? ['', tarifa] : []),
    '',
    'Es el potencial matemático bajo duplicación perfecta: mientras sus distribuidores y sus clientes sigan comprando, hay comisión, y el ritmo lo pone cada sistema.',
    '',
    `Si quiere estudiarlo con calma y mover el porcentaje usted mismo, está en la pantalla de los números de su presentación: ${enlacePresentacion}`,
  ].join('\n');
}
