/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿Queswa sabe si la persona vio el video «Cómo funciona» de la Home? (1 oct 2026)
 *
 *   npx tsx scripts/prueba-home-video-queswa.mts   (exit 1 si falla)
 *
 * Sin red. El hero de la Home trae el video y su botón es «Pregúntele a Queswa
 * cómo entra el dinero». El texto precargado de WhatsApp lleva la pregunta y, si
 * la persona llegó al 80 % del video, «Ya vi el video de cómo funciona.». Aquí
 * se fija el texto de cada caso, cómo lo lee el webhook (las mismas funciones y
 * patrones que usa) y el saludo aprobado por el Director.
 * Checklist: docs/handoff/queswa/PENDIENTE_HOME_VIDEO_QUESWA_OCT2026.md
 */
import { readFileSync } from 'node:fs';
import { textoAperturaWhatsApp } from '../src/lib/orbe-config.ts';
import {
  vieneDelVideoComoFunciona, videoDeReelVisto, RE_PREGUNTA_DINERO_PRECARGADA, RE_VENGO_DE_CREATUACTIVO,
  opcionesTrasPreguntaDinero, construirAperturaPreguntaDinero, aperturaRetornoPreguntaDinero,
} from '../src/lib/wa-apertura.ts';

let fallos = 0;
const revisar = (titulo: string, ok: boolean, detalle = '') => {
  if (!ok) fallos++;
  console.log(`  ${ok ? '✅' : '❌'} ${titulo}${detalle && !ok ? `  → ${detalle}` : ''}`);
};

// El webhook: `_vieneDelEnlace` y `_preguntaDinero` (route.ts), reproducidos con sus piezas.
const vieneDelEnlace = (t: string) => /creatuactivo\.com\/|queswa\.app\//i.test(t) || /vengo del enlace/i.test(t) || RE_VENGO_DE_CREATUACTIVO.test(t);
const lectura = (t: string) => ({
  llegada: vieneDelEnlace(t),
  vio: vieneDelEnlace(t) && vieneDelVideoComoFunciona(t),
  dinero: vieneDelEnlace(t) && RE_PREGUNTA_DINERO_PRECARGADA.test(t),
  otroReel: videoDeReelVisto(t),
});

console.log('\n📝 Texto precargado y cómo lo lee el webhook');
const CASOS = [
  { nombre: 'botón del hero · vio · con ref', ref: 'luis-cabrejo-1288', o: { vioComoFunciona: true, pregunta: 'dinero' as const },
    texto: 'Hola Queswa, vengo del enlace de luis-cabrejo-1288. Ya vi el video de cómo funciona. ¿Cómo entra el dinero?', vio: true, dinero: true },
  { nombre: 'botón del hero · no vio · con ref', ref: 'luis-cabrejo-1288', o: { pregunta: 'dinero' as const },
    texto: 'Hola Queswa, vengo del enlace de luis-cabrejo-1288. ¿Cómo entra el dinero?', vio: false, dinero: true },
  { nombre: 'botón del hero · vio · sin ref', ref: null, o: { vioComoFunciona: true, pregunta: 'dinero' as const },
    texto: 'Hola Queswa, vengo de creatuactivo.com. Ya vi el video de cómo funciona. ¿Cómo entra el dinero?', vio: true, dinero: true },
  { nombre: 'botón del hero · no vio · sin ref', ref: null, o: { pregunta: 'dinero' as const },
    texto: 'Hola Queswa, vengo de creatuactivo.com. ¿Cómo entra el dinero?', vio: false, dinero: true },
  { nombre: 'orbe · vio · con ref', ref: 'luis-cabrejo-1288', o: { vioComoFunciona: true },
    texto: 'Hola Queswa, vengo del enlace de luis-cabrejo-1288. Ya vi el video de cómo funciona.', vio: true, dinero: false },
  { nombre: 'orbe · vio · sin ref', ref: null, o: { vioComoFunciona: true },
    texto: 'Hola Queswa, vengo de creatuactivo.com. Ya vi el video de cómo funciona.', vio: true, dinero: false },
  { nombre: 'orbe · no vio · con ref (como antes)', ref: 'luis-cabrejo-1288', o: {},
    texto: 'Hola Queswa, vengo del enlace de luis-cabrejo-1288', vio: false, dinero: false },
  { nombre: 'orbe · no vio · sin ref (como antes)', ref: null, o: {},
    texto: 'Hola Queswa, quiero saber cómo funciona', vio: false, dinero: false },
];
for (const c of CASOS) {
  const t = textoAperturaWhatsApp(c.ref, 'general', c.o);
  revisar(`${c.nombre}: texto exacto`, t === c.texto, t);
  const l = lectura(t);
  const esperaLlegada = c.texto !== 'Hola Queswa, quiero saber cómo funciona';
  revisar(`${c.nombre}: el webhook lee llegada=${esperaLlegada} vio=${c.vio} dinero=${c.dinero}, sin otro reel`,
    l.llegada === esperaLlegada && l.vio === c.vio && l.dinero === c.dinero && l.otroReel === null, JSON.stringify(l));
}
revisar('productos no cambia, aunque haya visto el video',
  textoAperturaWhatsApp('luis-cabrejo-1288', 'productos', { vioComoFunciona: true, pregunta: 'dinero' }) === 'Hola Queswa, vengo del enlace de luis-cabrejo-1288. Quiero preguntar por los productos.');

console.log('\n🚫 Lo que NO es la pregunta del botón');
for (const [t, motivo] of [
  ['¿Cómo entra el dinero?', 'escrita a mano en una conversación viva: la atienden los nodos de siempre'],
  ['Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de cómo entra el dinero.', 'es el reel del dinero, no la pregunta'],
  ['vengo del enlace de x, cómo se gana dinero con esto', 'otra pregunta: va al motor'],
] as const) {
  const l = lectura(t);
  revisar(`«${t.slice(0, 60)}» — ${motivo}`, !l.dinero, JSON.stringify(l));
}

console.log('\n🔘 Botones después de responder el dinero');
revisar('vio el video: solo «Qué debo hacer yo»', JSON.stringify(opcionesTrasPreguntaDinero(true).map((o) => o.id)) === '["apertura_rol"]');
revisar('no lo vio: «Cómo funciona» y «Qué debo hacer yo»', JSON.stringify(opcionesTrasPreguntaDinero(false).map((o) => o.id)) === '["apertura_sistema","apertura_rol"]');

console.log('\n👋 Saludo aprobado por el Director (1 oct 2026)');
revisar('primer contacto · vio · con socio', construirAperturaPreguntaDinero('Luis Cabrejo Parra', 'Eduardo', true) ===
  'Hola, Eduardo. Un gusto saludarle.\n\nSoy Queswa, la inteligencia artificial que asiste a Luis Cabrejo, la misma del video. Atiendo a cientos de personas, las 24 horas.\n\nComo ya vio cómo funciona, vamos con su pregunta.',
  construirAperturaPreguntaDinero('Luis Cabrejo Parra', 'Eduardo', true));
revisar('primer contacto · no vio · sin socio', construirAperturaPreguntaDinero(undefined, undefined, false) ===
  'Hola. Un gusto saludarle.\n\nSoy Queswa, la inteligencia artificial de CreaTuActivo. Atiendo a cientos de personas, las 24 horas.\n\nVamos con su pregunta.',
  construirAperturaPreguntaDinero(undefined, undefined, false));
revisar('retorno · vio', aperturaRetornoPreguntaDinero('Eduardo', true) === 'Qué bueno que vuelva, Eduardo. Como ya vio el video de cómo funciona, vamos con su pregunta.');
revisar('retorno · no vio', aperturaRetornoPreguntaDinero(undefined, false) === 'Qué bueno que vuelva. Vamos con su pregunta.');

console.log('\n🔌 El webhook usa exactamente estas piezas');
const webhook = readFileSync('src/app/api/whatsapp/webhook/route.ts', 'utf8');
revisar('la llegada reconoce «vengo de creatuactivo.com»', /_vieneDelEnlace = .*RE_VENGO_DE_CREATUACTIVO\.test\(messageText\)/.test(webhook));
revisar('la pregunta fuerza el video del dinero', /opcionElegida = 'apertura_dinero'/.test(webhook));
revisar('el retorno y la apertura normales se saltan con la pregunta',
  (webhook.match(/!llegaDecidido && !_preguntaDinero/g) || []).length === 2);

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
