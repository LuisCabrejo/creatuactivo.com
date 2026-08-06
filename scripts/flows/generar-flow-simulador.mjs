/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Genera el Flow JSON del Simulador de Comisiones.
 *
 * POR QUÉ SE GENERA Y NO SE ESCRIBE A MANO: son doce escenarios (tres paquetes ×
 * cuatro cantidades) y cada uno lleva seis cifras. Escritos a mano serían setenta
 * y dos números que alguien tendría que mantener sincronizados con el plan de
 * compensación. Aquí sale todo de UNA tabla de tasas: si el plan cambia, se toca
 * una línea y se regenera.
 *
 * POR QUÉ ES UN FLOW ESTÁTICO (sin endpoint): Meta permite renderizado
 * condicional dentro del Flow, así que el cálculo ya está resuelto en el JSON.
 * Eso nos ahorra el par de llaves RSA, el servidor de intercambio cifrado y la
 * validación de firma — y de paso hace las cifras deterministas: no hay una
 * llamada en vivo que pueda devolver algo distinto.
 *
 * DOCTRINA (6 ago 2026, decisión del Director): el simulador cuenta **compras de
 * paquetes, nunca personas**. Contar cabezas es el marco que delata al
 * multinivel. Y nada con silueta de pirámide: se rechazó un árbol de duplicación
 * porque el prospecto reconoce esa forma como estafa antes de leer una cifra.
 *
 * Uso:  node scripts/flows/generar-flow-simulador.mjs
 * Sale: knowledge_base/flows/simulador-gen5.json
 */

import fs from 'fs';
import path from 'path';

// ── Tasas GEN5 por paquete, en COP ────────────────────────────────────────────
// Fuente: plan de compensación (getPinCifrasGEN5 en src/app/api/nexus/route.ts).
// Es lo que Gano Excel liquida por CADA paquete empresarial comprado en esa
// generación. NO son cifras de ejemplo: cambiarlas cambia lo que se le promete a
// un consumidor, y en Colombia eso obliga legalmente a la empresa.
const TASAS = {
  'ESP-3': { etiqueta: 'ESP-3 Visionario',  gen: [675000, 90000, 90000, 90000, 180000] },
  'ESP-2': { etiqueta: 'ESP-2 Empresarial', gen: [337500, 45000, 45000, 45000,  90000] },
  'ESP-1': { etiqueta: 'ESP-1 Inicial',     gen: [112500, 22500, 22500, 22500,  45000] },
};

/**
 * Cuántos paquetes por generación se pueden simular.
 *
 * Se para en 10 a propósito. El plan da mucho más, pero un ejemplo que alguien
 * pueda repetirle a su pareja vale más que uno que refleje todo el potencial y
 * suene a promesa — y una cifra desmesurada en pantalla es exactamente lo que
 * hace que la conversación no se reenvíe.
 */
const CANTIDADES = [1, 3, 5, 10];

const cop = (n) => `$${n.toLocaleString('es-CO')}`;

// Los id de pantalla solo aceptan letras y guion bajo — ni dígitos ni guiones.
const ID_PANTALLA = { 'ESP-1': 'RESULTADO_ESP_UNO', 'ESP-2': 'RESULTADO_ESP_DOS', 'ESP-3': 'RESULTADO_ESP_TRES' };

/** Las seis líneas de un escenario: cinco generaciones y el total. */
function bloqueDeCifras(codigo, cantidad) {
  const { gen } = TASAS[codigo];
  const lineas = gen.map((tasa, i) =>
    `Generación ${i + 1} · ${cantidad} ${cantidad === 1 ? 'paquete' : 'paquetes'}\n` +
    `${cop(tasa)} × ${cantidad} = ${cop(tasa * cantidad)}`,
  );
  const total = gen.reduce((a, t) => a + t * cantidad, 0);
  return { cuerpo: lineas.join('\n\n'), total };
}

/**
 * ARQUITECTURA: una pantalla de resultado POR PAQUETE, con `If` planos adentro.
 *
 * Se llegó aquí descartando tres caminos, todos por límites del evaluador de
 * Meta medidos con sondas (6 ago 2026), no por gusto:
 *
 * • Una sola condición con `&&` —`paquete == X && cantidad == Y`— no valida: el
 *   evaluador no compone `==` con `&&`, ni siquiera con paréntesis.
 * • `Switch` no se acepta como tipo de componente, diga lo que diga el anuncio.
 * • `If` anidado (paquete afuera, cantidad adentro) revienta el tope de
 *   anidamiento: el validador cuenta los `If` hermanos dentro de un `then` como
 *   niveles — "1 externo × 4 internos" ya falla. Doce `If` PLANOS, en cambio,
 *   validan sin queja.
 *
 * Así que el `If` de paquete se convierte en pantallas: INICIO decide a cuál de
 * las tres navegar (un `If` por paquete envolviendo su Footer, sin anidar), y
 * cada pantalla de resultado solo condiciona por cantidad, plana.
 */
const pantallaResultado = (codigo) => ({
  id: ID_PANTALLA[codigo],
  title: TASAS[codigo].etiqueta,
  terminal: true,
  layout: {
    type: 'SingleColumnLayout',
    children: [
      {
        type: 'Form',
        name: 'escenario',
        // El valor por defecto va en el Form, no en el Dropdown: Meta rechaza
        // `init-value` dentro del componente. Se arranca en 5 para que la
        // pantalla muestre cifras desde el primer segundo — si abre vacía,
        // la persona ve un formulario en vez de una respuesta.
        'init-values': { cantidad: '5' },
        children: [
          {
            type: 'Dropdown',
            name: 'cantidad',
            label: 'Paquetes comprados en cada generación',
            required: true,
            'data-source': CANTIDADES.map((n) => ({
              id: String(n),
              title: `${n} ${n === 1 ? 'paquete' : 'paquetes'}`,
            })),
          },
          ...CANTIDADES.map((cantidad) => {
            const { cuerpo, total } = bloqueDeCifras(codigo, cantidad);
            return {
              type: 'If',
              condition: `\${form.cantidad} == '${cantidad}'`,
              then: [
                { type: 'TextBody', text: cuerpo },
                { type: 'TextHeading', text: `Total: ${cop(total)} COP` },
              ],
            };
          }),
          {
            type: 'TextCaption',
            text: 'Se liquida cada viernes, a medida que cada compra ocurre. No espera a que se complete nada.',
          },
          {
            type: 'Footer',
            label: 'Listo',
            'on-click-action': {
              name: 'complete',
              payload: { paquete: codigo, cantidad: '${form.cantidad}' },
            },
          },
        ],
      },
    ],
  },
});

const flow = {
  version: '6.3',
  screens: [
    {
      id: 'INICIO',
      title: 'Simulador',
      terminal: false,
      layout: {
        type: 'SingleColumnLayout',
        // Solo la lista: el validador exige que NavigationList esté solo en la
        // pantalla (cualquier otro componente al lado la rechaza). El texto de
        // introducción vive en la burbuja del mensaje que envía el Flow.
        children: [
          // NavigationList en vez de radio + botón: tocar el paquete navega
          // directo a su pantalla de resultado. Además de ahorrar un toque, es lo
          // que Meta permite — solo cabe UN Footer por pantalla, incluso
          // repartidos en ramas `If`, así que "un botón por paquete" no valida.
          {
            type: 'NavigationList',
            name: 'paquetes',
            'list-items': Object.entries(TASAS).map(([codigo, { etiqueta, gen }]) => ({
              id: codigo,
              'main-content': {
                title: etiqueta,
                description: `${cop(gen[0])} por cada paquete en su primera generación`,
              },
              'on-click-action': {
                name: 'navigate',
                next: { type: 'screen', name: ID_PANTALLA[codigo] },
                payload: {},
              },
            })),
          },
        ],
      },
    },
    ...Object.keys(TASAS).map(pantallaResultado),
  ],
};

const destino = path.join(process.cwd(), 'knowledge_base', 'flows', 'simulador-gen5.json');
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, JSON.stringify(flow, null, 2) + '\n');

console.log(`✅ Flow JSON generado: ${destino}`);
console.log(`   12 escenarios · ${JSON.stringify(flow).length} caracteres`);
for (const codigo of Object.keys(TASAS)) {
  const linea = CANTIDADES
    .map((n) => `${n}→${cop(bloqueDeCifras(codigo, n).total)}`)
    .join('  ');
  console.log(`   ${TASAS[codigo].etiqueta.padEnd(18)} ${linea}`);
}
