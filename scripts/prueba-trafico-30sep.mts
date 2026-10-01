/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los turnos reales de la auditoría del 30 sep 2026, reproducidos sin red.
 *
 *   npx tsx scripts/prueba-trafico-30sep.mts   (exit 1 si falla)
 *
 * Cada bloque prueba las dos direcciones: que el arreglo atienda el turno real
 * Y que no se trague lo que no es suyo.
 *
 * - Ru (28 sep): «quiero montar un pedido» no abría el pedido.
 * - Yina (28 sep): «👍🏼» a «¿Le muestro la estrategia…?» no era un «sí».
 * - Eduardo Castellanos (29 sep): su «listo.» a la oferta de ver los paquetes
 *   dictó FREQ_30 sin tabla; «me inscribí en una ocasión» dictó ADV_OBJ_02
 *   («usted ya logró que su negocio funcione»); y su «No, solo revisando» le
 *   subió la ficha a 100/100.
 * - Yellitza Rosario (30 sep, +1 786): el volcado de auditoría la dejaba fuera.
 */
import { readFileSync } from 'node:fs';
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
import { detectarIntencionCompra, esAceptacion } from '../src/lib/wa-pedido.ts';
import { gestoAfirmativoComoSi, corregirSiTecleado } from '../src/lib/texto-normalizar.ts';
import { RE_OFERTA_VER_PAQUETES, RE_YA_SE_INSCRIBIO } from '../src/lib/queswa-conductor.ts';

let fallos = 0;
const revisar = (titulo: string, ok: boolean, detalle = '') => {
  if (!ok) fallos++;
  console.log(`  ${ok ? '✅' : '❌'} ${titulo}${detalle ? `  → ${detalle}` : ''}`);
};

// ── 1. «Montar un pedido» abre el pedido (Ru) ────────────────────────────────
console.log('\n🛒 Intención de compra');
for (const [t, espera] of [
  ['Hola quiero montar un pedido me ayudas', true],
  ['necesito armar un pedido', true],
  ['me ayuda a montarme un pedido', true],
  ['quiero hacer un pedido', true],
  ['Es que quiero pedir productos', true],
  ['quiero montar mi propio negocio', false],
  ['cómo arranco con el paquete', false],
  ['Qué voy a hacer entonces', false],
  ['cuánto vale una caja', false],
] as const) revisar(`«${t}»`, detectarIntencionCompra(t) === espera, `compra=${detectarIntencionCompra(t)}`);

// ── 2. El gesto afirmativo es un «sí» (Yina) ─────────────────────────────────
console.log('\n👍 Gesto afirmativo a la entrada del webhook');
const entrada = (t: string) => gestoAfirmativoComoSi(corregirSiTecleado(t));
for (const [t, espera] of [
  ['👍🏼', 'Sí'], ['👍', 'Sí'], ['👍🏿👍🏿', 'Sí'], ['👌', 'Sí'], ['✅', 'Sí'], ['✔️', 'Sí'], ['🙌🏽!', 'Sí'], ['Di', 'Sí'],
  ['👍🏼 pero cuánto vale', null], ['🙏', null], ['😂', null], ['Ok 👍', null], ['', null],
] as const) {
  const r = entrada(t);
  const ok = espera === null ? r === t : r === espera;
  revisar(`«${t}»`, ok, JSON.stringify(r));
}
revisar('y el «Sí» resultante es aceptación para los nodos', esAceptacion(entrada('👍🏼')));

// ── 3. Ofrecer VER los paquetes lleva a la tabla (Eduardo, turno 10) ─────────
console.log('\n📦 Oferta de ver los paquetes → FREQ_03');
for (const [t, espera] of [
  ['¿Le muestro los tres paquetes con los que arranca, para que vea cuál le queda cómodo?', true],
  ['¿Le muestro las tres formas de empezar?', true],
  ['¿Le presento los paquetes empresariales?', true],
  ['¿Le muestro las ganancias por la compra de paquetes empresariales en su sistema?', false],
  ['¿Le muestro las opciones de pago?', false],
  ['¿Le detallo exactamente qué productos trae el paquete Visionario?', false],
  ['¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?', false],
  ['¿Le muestro el catálogo completo con precios?', false],
] as const) revisar(`«${t.slice(0, 70)}»`, RE_OFERTA_VER_PAQUETES.test(t) === espera);

// ── 4. «Me inscribí una vez» es NET_02 (Eduardo, turno 13) ───────────────────
console.log('\n🔁 Ya se inscribió antes → NET_02');
for (const [t, espera] of [
  ['Yo me inscribí en una ocasión pero no.Desarrolle el negocio', true],
  ['me registré hace dos años en gano y no hice nada', true],
  ['ya me había inscrito con otra persona', true],
  ['estuve inscrita en gano excel', true],
  ['quiero inscribirme', false],
  ['cómo me inscribo', false],
  ['me inscribí ayer en la página', false],
  ['¿Pagan por inscribir gente?', false],
] as const) revisar(`«${t}»`, RE_YA_SE_INSCRIBIO.test(t) === espera);

// ── 5. El orden real de las puertas de route.ts ──────────────────────────────
// Las puertas se evalúan en orden y gana la primera. Se leen de la fuente para
// que una puerta anterior que se trague estos textos no pase inadvertida.
console.log('\n🚪 Primera puerta que abre (orden real de PUERTAS_INICIAL)');
const fuente = readFileSync('src/app/api/nexus/route.ts', 'utf8');
const bloque = fuente.slice(fuente.indexOf('const PUERTAS_INICIAL'), fuente.indexOf('\n];', fuente.indexOf('const PUERTAS_INICIAL')));
const EMULADAS: Record<string, (t: string) => boolean> = {
  arsenal_inicial_NET_02: (t) => /(ya\s+)?(tuve|ten[ií]a|fui|estuve|hice)[^.?]{0,30}(c[oó]digo|distribuidor|gano\s*excel)/i.test(t) || RE_YA_SE_INSCRIBIO.test(t),
  arsenal_inicial_FREQ_03: (t) => /tres\s+formas\s+de\s+(empezar|entrar|arrancar|iniciar|inicio)|tres\s+(paquetes|niveles)\s+de\s+inicio/i.test(t) || RE_OFERTA_VER_PAQUETES.test(t),
};
const puertas = bloque.split(/\n\s*fragmento:\s*'/).slice(1).map((trozo) => {
  const fragmento = trozo.slice(0, trozo.indexOf("'"));
  const lit = trozo.match(/\n\s*cuando:\s*\/(.+)\/([gimsuy]*),\s*\n/);
  const test = EMULADAS[fragmento] ?? (lit ? ((t: string) => new RegExp(lit[1], lit[2]).test(t)) : null);
  return { fragmento, test };
});
revisar('las dos puertas tocadas siguen en la tabla', ['arsenal_inicial_NET_02', 'arsenal_inicial_FREQ_03'].every((f) => puertas.some((p) => p.fragmento === f)));
const primera = (t: string) => puertas.find((p) => p.test?.(t))?.fragmento ?? '(ninguna)';
for (const [t, espera] of [
  ['¿Le muestro los tres paquetes con los que arranca, para que vea cuál le queda cómodo?', 'arsenal_inicial_FREQ_03'],
  ['Yo me inscribí en una ocasión pero no.Desarrolle el negocio', 'arsenal_inicial_NET_02'],
  ['Ya tengo un negocio propio y me va bien', 'arsenal_avanzado_ADV_OBJ_02'],
] as const) revisar(`«${t.slice(0, 60)}»`, primera(t) === espera, primera(t));

// ── 6. «Solo revisando» baja el puntaje ──────────────────────────────────────
console.log('\n📊 Puntaje: solo está mirando');
const lit = fuente.match(/const _reSoloMirando = \/((?:[^/\\\n]|\\.)+)\/([gimsuy]*);/);
revisar('el patrón existe en route.ts', !!lit);
if (lit) {
  const re = new RegExp(lit[1], lit[2]);
  for (const [t, espera] of [
    ['No. solo.Revisando. Queswa que me solicitaron conocer', true],
    ['solo estoy mirando', true],
    ['sólo quería averiguar', true],
    ['lo pregunto por curiosidad', true],
    ['solo quiero una caja', false],
    ['me interesa mucho', false],
    ['sólo quería saber el precio', false],
  ] as const) revisar(`«${t}»`, re.test(t) === espera);
}

// ── 7. El volcado de auditoría ve números de cualquier país (Yellitza) ───────
console.log('\n🌎 Filtro de huellas del volcado de auditoría');
const script = readFileSync('scripts/auditar-conversaciones.mjs', 'utf8');
const pat = script.match(/!RE_ARNES\.test\(fp\) && \/(.+?)\/\.test\(fp\)/);
revisar('el patrón existe en auditar-conversaciones.mjs', !!pat);
if (pat) {
  const re = new RegExp(pat[1]);
  for (const [fp, espera] of [
    ['wa_17865837848', true], ['wa_573154164060', true], ['wa_CO.971583399313044', true], ['wa_19545536817', true],
    ['wa_conv_1', false], ['wa_57', false],
  ] as const) revisar(fp, re.test(fp) === espera);
}

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
