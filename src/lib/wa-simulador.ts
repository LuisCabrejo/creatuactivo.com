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

/** Renta recurrente: COP por cliente, por punto de tarifa, al mes. */
// 10 clientes × 17% = $428.400 → 2.520 por cliente y por punto. Supone una caja
// de Ganocafé a la semana por cliente (cuatro al mes). Mismo cálculo del Flow.
const COP_POR_CLIENTE_Y_PUNTO = 2_520;

/** GEN5: COP por UN paquete comprado en cada una de las cinco generaciones. */
const GEN5_POR_PAQUETE: Record<string, { etiqueta: string; suma: number }> = {
  'ESP-3': { etiqueta: 'ESP-3 Visionario',  suma: 1_125_000 }, // 675.000 + 90.000×3 + 180.000
  'ESP-2': { etiqueta: 'ESP-2 Empresarial', suma:   562_500 },
  'ESP-1': { etiqueta: 'ESP-1 Inicial',     suma:   225_000 },
};

export interface EscenarioRenta  { tipo: 'renta'; tarifa: string; clientes: string }
export interface EscenarioGen5   { paquete: string; cantidad: string }

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
}

export function respuestaRenta(e: EscenarioRenta, opciones: OpcionesCierre = {}): string | null {
  const t = leerTarifa(e.tarifa);
  const clientes = Number(e.clientes);
  if (!t || !Number.isFinite(clientes) || clientes <= 0) return null;

  const monto = clientes * t.pct * COP_POR_CLIENTE_Y_PUNTO;
  const esKit = /kit/i.test(t.nombre);
  const cierre = opciones.composicionYaOfrecida
    ? '¿Con cuál de los tres paquetes se identifica más?'
    : esKit
      ? '¿Le muestro las tres formas de empezar?'
      // 23 ago (Director): tras la renta, la pregunta lleva a la OTRA forma de ganar —
      // la de los paquetes— porque sin ese contexto la persona no la pregunta, y es la
      // que le muestra que puede ganar desde el comienzo. La oferta nombra «ejemplo»
      // y «paquetes» a propósito: así el «sí» dispara el ejemplo GEN5 dictado.
      : '¿Le muestro un ejemplo con números de la otra forma de ganar, la de los paquetes empresariales?';

  return `Con la tarifa del *${t.nombre}* (${t.pct}%) y *${clientes} clientes en cada centro de negocio*, su renta estaría alrededor de *${cop(monto)} al mes*.

Eso supone que cada cliente compra una caja de Ganocafé a la semana, y se liquida cada viernes. Y esos clientes no los consigue usted solo: son los de sus socios, sumados.

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

  const cierre = opciones.composicionYaOfrecida
    ? '¿Con cuál de los tres paquetes se identifica más?'
    : `¿Le muestro qué trae el paquete ${corto(p.etiqueta)}?`;

  return `Con *${paquetes} ${p.etiqueta}* ${comprados} en cada una de las cinco generaciones, la suma de esas ${compras} compras es *${cop(total)}*.

Se cuenta por paquetes comprados, no por personas, y se liquida por ciclos semanales, cada viernes.

${cierre}`;
}
