/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los turnos reales de la auditoría del 24 oct 2026, reproducidos sin red y sin
 * llamar al modelo.
 *
 *   npx tsx scripts/prueba-trafico-24oct.mts   (exit 1 si falla)
 *
 * Cada bloque prueba las dos direcciones: que el arreglo atienda el turno real
 * Y que no se trague lo que no es suyo.
 *
 * - Adry Escobar (23 oct, 17:22): «Quiero empezar» con la tarjeta del simulador
 *   como último turno → el simulador otra vez; la radicación nunca se abrió.
 * - Prospecto de Yina (24 oct, 5:15): «Bueno» a «¿Le muestro las cuatro
 *   opciones…?» → el video de la estrategia que ya había visto.
 * - Yina (17 oct): «Sip» dos veces a «¿Le muestro la estrategia…?» → nunca llegó.
 *   Adry: «Detallame» a «¿Le detallo… el paquete Visionario?» → «Es el mismo cálculo».
 * - Jhoan (17 oct): «Sin IA» y «No me gusta la IA» → la lista de productos y WHY_01,
 *   sin aviso a nadie.
 * - «Listo, Constructor» (17 y 24 oct): el relleno del webhook llegaba al modelo
 *   como nombre.
 * - El volcado de auditoría dejaba fuera la web (9 visitantes, 24 turnos).
 */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
import { banderasDelHilo, atenderHiloNiveles, RE_OFERTA_VER_PAQUETES } from '../src/lib/queswa-conductor.ts';
import { RE_VOLICION } from '../src/lib/wa-radicacion.ts';
import { detectarPidePersona, detectarIntencionCompra, esAceptacion } from '../src/lib/wa-pedido.ts';
import { afirmacionComoSi, gestoAfirmativoComoSi, corregirSiTecleado } from '../src/lib/texto-normalizar.ts';

let fallos = 0;
const revisar = (titulo: string, ok: boolean, detalle = '') => {
  if (!ok) fallos++;
  console.log(`  ${ok ? '✅' : '❌'} ${titulo}${detalle ? `  → ${detalle}` : ''}`);
};
type T = { role: 'user' | 'assistant'; content: string };

// Los candados que el hilo lee de la base, sin base: cualquier categoría devuelve
// NIVELES_01 con su pregunta de seguimiento.
const NIVELES_01 = 'La primera duda que suele surgir es si le toca conseguir cientos de clientes usted solo.\n\nLos 12 Niveles es nuestra estrategia para construirlo paso a paso.';
const baseFalsa = {
  from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({
    data: { content: `<verbatim_lock>${NIVELES_01}</verbatim_lock>\n\n**Pregunta de seguimiento:** ¿Quiere verlo en el simulador, con la cifra de cada nivel?` },
  }) }) }) }) }),
};
const hilo = (mensaje: string, historial: T[]) => atenderHiloNiveles({
  canal: 'whatsapp', mensaje, historial, pais: 'CO', hiloDoceNiveles: true,
  simuladorDisponible: true, supabase: baseFalsa, tenant: 'whatsapp',
});

// ── 1. «Quiero empezar» es la volición, no un «sí» al simulador (Adry) ───────
console.log('\n🎯 La volición pasa al cierre');
const trasSimulador: T[] = [
  { role: 'assistant', content: '¿Quiere verlo en el simulador, con la cifra de cada nivel?' },
  { role: 'user', content: 'Sí' },
  { role: 'assistant', content: 'Arme el escenario que quiera ver: el resultado sale al instante. [Simulador enviado]' },
];
revisar('«Quiero empezar» es volición (la abre `gestionarCierre`)', RE_VOLICION.test('Quiero empezar'));
revisar('…y no es un «sí» para el conductor', !banderasDelHilo('Quiero empezar', trasSimulador).aceptaSola);
revisar('…así que el simulador no se reenvía', (await hilo('Quiero empezar', trasSimulador)) === null);
revisar('…ni lo atrapa el pedido ni la persona antes del cierre', !detectarIntencionCompra('Quiero empezar') && !detectarPidePersona('Quiero empezar'));
for (const t of ['quiero arrancar', 'Quiero iniciar ya', 'me interesa iniciar']) {
  revisar(`«${t}» tampoco reenvía el simulador`, (await hilo(t, trasSimulador)) === null);
}
// La dirección contraria: los «sí» de siempre siguen abriendo su nodo.
const sim = await hilo('Quiero verlo', [{ role: 'assistant', content: '¿Quiere verlo en el simulador, con la cifra de cada nivel?' }]);
revisar('«Quiero verlo» al simulador → la tarjeta', /^2\.4 simulador/.test(sim?.nodo ?? ''), sim?.nodo ?? 'null');
const sim2 = await hilo('Quiero', [{ role: 'assistant', content: '¿Quiere verlo en el simulador, con la cifra de cada nivel?' }]);
revisar('«Quiero» a secas al simulador → la tarjeta', /^2\.4 simulador/.test(sim2?.nodo ?? ''), sim2?.nodo ?? 'null');
const vinc = await hilo('Sí, quiero empezar', [{ role: 'assistant', content: '¿Le muestro cómo se vincula?' }]);
revisar('«Sí, quiero empezar» a «¿cómo se vincula?» → 2.36 pide los datos', /^2\.36/.test(vinc?.nodo ?? ''), vinc?.nodo ?? 'null');

// ── 2. El «sí» acepta la ÚLTIMA oferta, no lo que nombró el cuerpo ───────────
console.log('\n🧭 La oferta se lee por su pregunta de cierre');
const cuatroOpciones = 'Listo. Ya tiene el mapa completo: el fabricante que despacha, la máquina que conversa, los productos que rotan y lo que usted hace cada día.\n\nEl siguiente paso natural es ver con qué arranca. Las cuatro formas de empezar tienen precios distintos y porcentajes distintos — y con cualquiera de ellas la estrategia de los 12 Niveles corre.\n\n¿Le muestro las cuatro opciones para que elija la que le resulte cómoda hoy?';
const bueno = await hilo('Bueno', [{ role: 'assistant', content: cuatroOpciones }]);
revisar('«Bueno» a «¿Le muestro las cuatro opciones…?» no repite el video', bueno === null, bueno?.nodo ?? 'null');
revisar('…y la oferta abre la puerta de las cuatro formas (FREQ_03)', RE_OFERTA_VER_PAQUETES.test('¿Le muestro las cuatro opciones para que elija la que le resulte cómoda hoy?'));
revisar('…pero las opciones de PAGO no', !RE_OFERTA_VER_PAQUETES.test('¿Le muestro las cuatro opciones de pago?') && !RE_OFERTA_VER_PAQUETES.test('¿Le muestro las opciones de pago?'));
const dictada = await hilo('Sí', [{ role: 'assistant', content: '¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?' }]);
revisar('«Sí» a la oferta escrita de la estrategia → 2.34', /^2\.34/.test(dictada?.nodo ?? ''), dictada?.nodo ?? 'null');
const delModelo = await hilo('Sí', [{ role: 'assistant', content: 'Para eso está Los 12 Niveles, la estrategia paso a paso.\n\n¿Le muestro cómo funciona con su caso?' }]);
revisar('«Sí» a la oferta del modelo que nombra Los 12 Niveles en el cuerpo → 2.34', /^2\.34/.test(delModelo?.nodo ?? ''), delModelo?.nodo ?? 'null');
const productos = await hilo('Sí', [{ role: 'assistant', content: 'Los 12 Niveles corre sobre el consumo.\n\n¿Le muestro los productos que mueven todo esto?' }]);
revisar('«Sí» a «¿Le muestro los productos…?» con 12 Niveles en el cuerpo → no es 2.34', productos === null, productos?.nodo ?? 'null');

// ── 3. El «sí» dicho de otra forma (Yina, Adry) ──────────────────────────────
console.log('\n👍 El «sí» de otra forma, a la entrada del webhook');
const entrada = (t: string) => afirmacionComoSi(gestoAfirmativoComoSi(corregirSiTecleado(t)));
for (const [t, espera] of [
  ['Sip', 'Sí'], ['sip.', 'Sí'], ['Sipi', 'Sí'], ['Simón', 'Sí'], ['Detallame', 'Sí'], ['Detállame por favor', 'Sí'],
  ['Muéstremelas', 'Sí'], ['Muestramelo', 'Sí'], ['Cuénteme', 'Sí'], ['Explíqueme', 'Sí'], ['Envíemelo porfa', 'Sí'], ['Mándemelo', 'Sí'],
  ['Muéstrame el catálogo', null], ['Detallame el ESP-2', null], ['Cuéntame cómo funciona', null], ['Simona', null], ['Sipote', null], ['', null],
] as const) {
  const r = entrada(t);
  revisar(`«${t}»`, espera === null ? r === t : r === espera, JSON.stringify(r));
}
revisar('y el «Sí» resultante es aceptación para los nodos', esAceptacion(entrada('Sip')) && banderasDelHilo(entrada('Detallame'), []).aceptaSola);

// ── 4. Rechazar a la IA es pedir una persona (Jhoan) ─────────────────────────
console.log('\n🙋 «Sin IA» → nodo 2.46 (aviso al socio y al equipo)');
for (const [t, espera] of [
  ['Sin IA', true], ['sin ia.', true], ['Sin inteligencia artificial', true], ['No me gusta la IA', true],
  ['no me gustan los robots', true], ['No quiero hablar con una máquina', true], ['no quiero chatear con un bot', true],
  ['Prefiero una persona', true], ['quiero hablar con alguien', true],
  ['¿Funciona sin IA?', false], ['¿Se puede hacer sin inteligencia artificial?', false], ['Sin IA no se puede, ¿cierto?', false],
  ['me gusta la IA', false], ['la IA es el futuro', false], ['no me gusta el café', false], ['Quiero empezar', false],
] as const) revisar(`«${t}»`, detectarPidePersona(t) === espera, `persona=${detectarPidePersona(t)}`);

// ── 5. «Constructor» no llega al modelo como nombre ──────────────────────────
console.log('\n🏷️  El relleno del canal no es un nombre');
const motor = readFileSync('src/app/api/nexus/route.ts', 'utf8');
const lit = motor.match(/if \(\/((?:[^/\\\n]|\\.)+)\/([gimsuy]*)\.test\(String\(existingProspectData\.name \?\? ''\)\)\) delete existingProspectData\.name;/);
revisar('el motor descarta el relleno al cargar la ficha', !!lit);
if (lit) {
  const re = new RegExp(lit[1], lit[2]);
  for (const [t, espera] of [['Constructor', true], [' constructor ', true], ['Constructora Pérez', false], ['Adry Escobar', false]] as const) {
    revisar(`«${t}»`, re.test(t) === espera);
  }
}
const webhook = readFileSync('src/app/api/whatsapp/webhook/route.ts', 'utf8');
revisar('el webhook sigue usando «Constructor» como relleno (si cambia, cambie el motor)', /\|\| 'Constructor';/.test(webhook));
revisar('el webhook aplica `afirmacionComoSi` a la entrada', /afirmacionComoSi\(gestoAfirmativoComoSi\(corregirSiTecleado\(messageText\)\)\)/.test(webhook));

// ── 6. El volcado de auditoría incluye la web ────────────────────────────────
console.log('\n🔎 auditar-conversaciones.mjs');
const volcado = readFileSync('scripts/auditar-conversaciones.mjs', 'utf8');
const web = volcado.match(/const huellaWeb = \(fp\) => \/((?:[^/\\\n]|\\.)+)\/([gimsuy]*)\.test/);
revisar('reconoce la huella del navegador', !!web);
if (web) {
  const re = new RegExp(web[1], web[2]);
  revisar('64 hexadecimales → persona', re.test('4b52639f598c9df2823fc7542295c01e2806f7b8059a61990bda13f3065c5c28'));
  for (const fp of ['web_probe_123', 'wa_573001234567', 'dash_luis-cabrejo-1288']) revisar(`«${fp}» no es huella web`, !re.test(fp));
}

console.log(`\n${fallos ? `❌ ${fallos} fallo(s)` : '✅ Todo en verde'}`);
process.exit(fallos ? 1 : 0);
