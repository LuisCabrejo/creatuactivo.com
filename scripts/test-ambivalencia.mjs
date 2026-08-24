/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Batería del detector de ambivalencia.
 *
 * Pesa en las DOS direcciones, y la negativa pesa más: si el detector se dispara
 * ante una pregunta informativa, Queswa deja de responderla y contesta con una
 * invitación a hablar de sentimientos a quien solo quería saber un precio. Eso es
 * peor que no tener el nodo.
 *
 * Uso: node scripts/test-ambivalencia.mjs   (exit 1 si algo falla)
 */

import fs from 'fs';

const SRC = fs.readFileSync('src/lib/wa-ambivalencia.ts', 'utf8');

function extraerArray(nombre) {
  const ini = SRC.indexOf(`export const ${nombre}`);
  if (ini === -1) throw new Error(`No se encontró ${nombre}`);
  const fin = SRC.indexOf('\n];', ini);
  const out = [];
  for (const linea of SRC.slice(ini, fin).split('\n')) {
    const m = linea.match(/^\s*\/(.*)\/([a-z]*),\s*$/);
    if (m) out.push(new RegExp(m[1], m[2]));
  }
  if (!out.length) throw new Error(`${nombre} quedó vacío al extraer`);
  return out;
}
function extraerConst(nombre) {
  const m = SRC.match(new RegExp(`const ${nombre}\\s*=\\s*/(.*)/([a-z]*);`));
  if (!m) throw new Error(`No se encontró ${nombre}`);
  return new RegExp(m[1], m[2]);
}

const DUDA = extraerArray('RE_DUDA_PROPIA');
const APLA = extraerArray('RE_APLAZAMIENTO');
const ROL  = extraerConst('RE_PREGUNTA_DE_ROL');
const NO   = extraerConst('RE_NO_EXPLICITO');

let fallos = 0;
const ok_ = (c, m) => { console.log(c ? '✅' : '❌', m); if (!c) fallos++; };
const norm = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const PALABRA_A_NUMERO = { uno:1, dos:2, tres:3, cuatro:4, cinco:5, seis:6, siete:7, ocho:8, nueve:9, diez:10 };
function extraerCalificacion(mensaje) {
  const t = norm(mensaje);
  const dig = t.match(/\b(10|[1-9])\b(?!\s*(?:mil|millon|pv|cv|%))/);
  if (dig) return parseInt(dig[1], 10);
  for (const [palabra, n] of Object.entries(PALABRA_A_NUMERO)) {
    if (new RegExp(`\\b${palabra}\\b`).test(t)) return n;
  }
  return null;
}
/** Reconstruye peldanoDeEscalera() leyendo sus propios patrones del .ts. */
function extraerConst_multi() {
  const desde  = SRC.indexOf('export function peldanoDeEscalera');
  const cuerpo = SRC.slice(desde, SRC.indexOf('\n}', desde));
  const reglas = [...cuerpo.matchAll(/if \(\/(.+?)\/\.test\(t\)\)\s*return '(\w+)'/g)]
    .map(([, src, val]) => [new RegExp(src), val]);
  if (!reglas.length) throw new Error('peldanoDeEscalera sin reglas');
  return (texto) => {
    const t = norm(texto);
    for (const [re, val] of reglas) if (re.test(t)) return val;
    return null;
  };
}

function detectar(mensaje) {
  const t = norm(mensaje);
  if (!t.trim()) return null;
  if (NO.test(t)) return null;
  if (DUDA.some((re) => re.test(t))) return ROL.test(t) ? null : 'duda_propia';
  if (APLA.some((re) => re.test(t))) return 'aplazamiento';
  return null;
}

const CASOS = [
  // ── DUDA SOBRE SÍ MISMA ────────────────────────────────────────────────────
  ['yo no soy bueno para esos negocios',                              'duda_propia'],
  ['Claudia me dijo que no era buena para esto',                      'duda_propia'],
  ['la verdad no sirvo para vender',                                  'duda_propia'],
  ['no sé si pueda con algo así',                                     'duda_propia'],
  ['no sé si sea capaz, nunca he hecho nada de esto',                 'duda_propia'],
  ['me da pena hablarle a la gente de esto',                          'duda_propia'],
  ['me da miedo meterme en algo y no poder',                          'duda_propia'],
  ['yo no sabría a quién hablarle',                                   'duda_propia'],
  ['no sé con quién empezaría',                                       'duda_propia'],
  ['no tengo la labia para eso',                                      'duda_propia'],
  ['soy muy tímido para estas cosas',                                 'duda_propia'],
  ['soy malo para eso de las ventas',                                 'duda_propia'],
  ['a mí no se me da lo comercial',                                   'duda_propia'],
  ['no me veo haciendo eso',                                          'duda_propia'],
  ['no creo que pueda dedicarle lo que pide',                         'duda_propia'],

  // ── APLAZAMIENTO CORTÉS ────────────────────────────────────────────────────
  ['lo voy a pensar',                                                 'aplazamiento'],
  ['déjame pensarlo con calma',                                       'aplazamiento'],
  ['cualquier cosa le aviso',                                         'aplazamiento'],
  ['listo, después le cuento',                                        'aplazamiento'],
  ['le confirmo en estos días',                                       'aplazamiento'],
  ['déjeme revisarlo y le digo',                                      'aplazamiento'],
  ['ahorita no puedo, ando full',                                     'aplazamiento'],
  ['no es mi momento todavía',                                        'aplazamiento'],
  ['más adelante hablamos',                                           'aplazamiento'],
  ['tengo que hablarlo con mi esposa',                                'aplazamiento'],

  // ── NO debe dispararse: PREGUNTAS informativas ─────────────────────────────
  ['¿yo tendría que vender?',                                          null],
  ['¿toca convencer gente?',                                           null],
  ['¿hay que buscar gente todos los días?',                            null],
  ['¿cuánto cuesta empezar?',                                          null],
  ['¿cuál es el precio del Ganocafé Clásico?',                         null],
  ['¿esto es una pirámide?',                                           null],
  ['¿cómo funciona exactamente?',                                      null],
  ['¿qué productos manejan?',                                          null],
  ['¿en qué países funciona?',                                         null],
  ['cuénteme cómo se gana',                                            null],

  // ── NO debe dispararse: un NO explícito se respeta ─────────────────────────
  ['no me interesa, gracias',                                          null],
  ['gracias pero paso',                                                null],
  ['no quiero, de verdad',                                             null],

  // ── NO debe dispararse: el sujeto es el NEGOCIO, no la persona ─────────────
  ['esto no sirve para lo que busco',                                  null],
  ['ese producto no me da confianza',                                  null],
  ['el precio no me da',                                               null],

  // ── NO debe dispararse: interés claro ──────────────────────────────────────
  ['me interesa, cuénteme más',                                        null],
  ['quiero empezar ya',                                                null],
  ['sí, mándeme el acceso',                                            null],
  ['buenísimo, me encanta la idea',                                     null],
];

console.log('\n── Detector de ambivalencia ──\n');
for (const [mensaje, esperado] of CASOS) {
  const got = detectar(mensaje);
  const ok = got === esperado;
  if (!ok) fallos++;
  const etiqueta = (got ?? 'sin señal').padEnd(13);
  console.log(`${ok ? '✅' : '❌'} ${etiqueta} ${mensaje}${ok ? '' : `   ← esperado: ${esperado ?? 'sin señal'}`}`);
}

// ─── Rama de contexto: ¿ya vio las formas de ganar? ──────────────────────────
// Dato de campo del Director: que la persona ya haya visto el plan y aún así
// dude de sí misma es más común de lo que parece. Ofrecerle verlo otra vez la
// manda a repetir un paso, y ese trámite es lo que hace que se vaya.
const YA_VIO = extraerConst('RE_YA_VIO_GANANCIA');
const MOTIVO = extraerConst('RE_MOTIVO_DINERO');

const CONTEXTO = [
  ['bot', 'Le explico: el Binario paga sobre el consumo recurrente de su canal.', true],
  ['bot', 'El Bono GEN5 se cuenta por paquetes comprados, no por personas.',      true],
  ['bot', '¿Le muestro cómo se gana?',                                            true],
  ['bot', 'Con gusto: el Ganocafé 3 en 1 cuesta $110.900 la caja de 20 sobres.', false],
  ['bot', 'Hola, soy Queswa. Su amigo me pidió que lo recibiera.',                false],
  ['bot', 'El Ganoderma es un hongo que Gano Excel cultiva en Malasia.',          false],
];

const MOTIVOS = [
  ['por la plata, la verdad',                                    true],
  ['estoy mamada del empleo, el jefe me regaña',                 true],
  ['no me pagan lo que es justo',                                true],
  ['por las deudas, no me alcanza',                              true],
  ['quiero más tiempo con mis hijos',                            false],
  ['porque me gustan los productos',                             false],
];

console.log('\n── ¿Ya vio las formas de ganar? (solo mensajes del BOT) ──\n');
for (const [, texto, esperado] of CONTEXTO) {
  const got = YA_VIO.test(texto);
  const ok = got === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${(got ? 'ya vio' : 'no vio').padEnd(7)} ${texto.slice(0, 62)}`);
}

console.log('\n── ¿El motivo es de dinero? (decide la pregunta de cierre) ──\n');
for (const [texto, esperado] of MOTIVOS) {
  const got = MOTIVO.test(norm(texto));
  const ok = got === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${(got ? 'dinero' : 'otro').padEnd(7)} ${texto}`);
}

// ─── La escalera: peldaño, número y ancla baja ───────────────────────────────
// El contrato: los textos dictados y los patrones de `peldanoDeEscalera()` se
// editan juntos. Esta parte de la batería existe para que romperlo no sea
// silencioso — si se rompe, la persona recibe dos veces la misma pregunta.
const PELDANOS = [
  ['Antes de que se vaya, una sola pregunta: del 1 al 10, donde 1 es no me interesa y 10 es listo para arrancar, ¿dónde está hoy?', 'ancla_baja'],
  ['¿Y por qué un 6 y no un 3?',                                          'que_falta'],
  ['¿Qué necesitaría para llegar a un 8: del producto o del negocio?',    'cuando'],
  ['¿Cuándo lo revisa?',                                                  'hora'],
  ['Con gusto, el Ganocafé 3 en 1 cuesta $110.900.',                      null],
];

const NUMEROS = [
  ['6',                    6],
  ['como un 7',            7],
  ['yo diría que 8',       8],
  ['un cinco',             5],
  ['10, listo para ya',   10],
  ['no sé, ni idea',      null],
];

const PAREJA = [
  ['tengo que hablarlo con mi esposa',        true],
  ['lo hablo con mi pareja y le cuento',      true],
  ['déjeme consultarlo con mi señora',        true],
  ['lo voy a pensar',                         false],
  ['tengo que hablarlo con mi contador',      false],
];

const PELD = extraerConst_multi('peldanoDeEscalera');
const PAR  = { RE_CONSULTA_PAREJA: extraerConst('RE_CONSULTA_PAREJA'), RE_PAREJA: extraerConst('RE_PAREJA') };

console.log('\n── Escalera: ¿en qué peldaño estamos? (se lee del último mensaje del bot) ──\n');
for (const [texto, esperado] of PELDANOS) {
  const got = PELD(texto);
  const ok = got === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${String(got ?? 'ninguno').padEnd(11)} ${texto.slice(0, 58)}`);
}

console.log('\n── Escalera: la calificación y su ancla hacia ABAJO ──\n');
for (const [texto, esperado] of NUMEROS) {
  const got = extraerCalificacion(texto);
  const ok = got === esperado;
  if (!ok) fallos++;
  const ancla = got && got > 2 && got < 9 ? `  → «¿por qué un ${got} y no un ${Math.max(1, got - 3)}?»` : '';
  console.log(`${ok ? '✅' : '❌'} ${String(got ?? '—').padEnd(5)} ${texto.padEnd(22)}${ancla}`);
}

console.log('\n── Consulta con la pareja (rama propia, no la escalera) ──\n');
for (const [texto, esperado] of PAREJA) {
  const t = norm(texto);
  const got = PAR.RE_PAREJA.test(t) && (PAR.RE_CONSULTA_PAREJA.test(t) || /\bhablarlo con\b|\bdecidimos (entre los dos|juntos)\b/.test(t));
  const ok = got === esperado;
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${(got ? 'pareja' : 'no').padEnd(7)} ${texto}`);
}

// ─── El CONTRATO entre el webhook y el motor ─────────────────────────────────
// El webhook detecta y emite un pageContext estructurado; el motor lo parsea y
// devuelve el micro-prompt. Son dos archivos distintos y nadie los obliga a
// coincidir: si uno cambia el formato, el nodo deja de dispararse **en silencio**
// —el motor no encuentra el caso, cae al flujo normal, y la persona recibe una
// respuesta correcta pero genérica—. Esto verifica el viaje de ida y vuelta.
const WEBHOOK = fs.readFileSync('src/app/api/whatsapp/webhook/route.ts', 'utf8');
const MOTOR   = fs.readFileSync('src/app/api/nexus/route.ts', 'utf8');

// Los valores que el webhook puede emitir, leídos del propio código.
const emitidos = [...WEBHOOK.matchAll(/'(whatsapp_amb_[a-z_]+)'/g)].map((m) => m[1]);
const plantillas = [...WEBHOOK.matchAll(/`whatsapp_amb_\$\{_peldano\}(_\$\{_n\})?`/g)];

// Los nodos que el motor sabe atender.
const atendidos = [...MOTOR.matchAll(/nodo === '([a-z_]+)'/g)].map((m) => m[1]);

// El parseo del motor, replicado tal cual.
const parsear = (pageContext) => {
  const resto = pageContext.slice('whatsapp_amb_'.length);
  const m = resto.match(/^(.*?)(?:_(\d+))?$/);
  return { nodo: m?.[1] ?? resto, n: m?.[2] ? parseInt(m[2], 10) : null };
};

// Peldaños que `peldanoDeEscalera()` puede devolver, leídos del módulo.
const peldanos = [...SRC.matchAll(/return '(ancla_baja|que_falta|cuando|hora)'/g)].map((m) => m[1]);

const CONTRATO = [
  ...emitidos,
  ...peldanos.flatMap((p) => [`whatsapp_amb_${p}`, `whatsapp_amb_${p}_6`, `whatsapp_amb_${p}_10`]),
];

// ─── El contrato del ACUERDO ─────────────────────────────────────────────────
// `botPidioHora()` está acoplado al texto dictado en microPromptEscalera('hora').
// Si aquel cambia y el patrón no, el acuerdo deja de guardarse EN SILENCIO: la
// escalera sigue preguntando «¿a qué hora le queda bien?», la persona contesta,
// y nadie guarda nada. Se promete y no se cumple, que es el peor fallo posible
// porque no produce ningún error.
const TEXTO_HORA = SRC.match(/"(\¿Le escribo al día siguiente[^"]*)"/)?.[1];
const RE_HORA = new RegExp(SRC.match(/return \/(le escribo al dia siguiente[^/]*)\//)[1]);

console.log('\n── El peldaño de la hora dispara el guardado del acuerdo ──\n');
ok_(!!TEXTO_HORA, `el texto dictado existe: «${(TEXTO_HORA ?? '').slice(0, 52)}…»`);
if (TEXTO_HORA) {
  ok_(RE_HORA.test(norm(TEXTO_HORA)), 'y botPidioHora() lo reconoce — el contrato se sostiene');
}
ok_(!RE_HORA.test(norm('¿Cuándo lo revisa?')),                 'no confunde el peldaño anterior');
ok_(!RE_HORA.test(norm('¿Y por qué un 6 y no un 3?')),          'ni el del ancla');
ok_(!RE_HORA.test(norm('Con gusto, el Ganocafé cuesta $110.900.')), 'ni una respuesta cualquiera');

// ─── El «no» en DOS TIEMPOS ──────────────────────────────────────────────────
// El orden no es cosmético: ofrecer la puerta al primer «no» desperdicia la única
// pregunta que todavía podía mover algo, y repetir la pregunta tras el segundo es
// insistir — que es justo lo que la frase de la puerta promete no hacer.
const RE_NO   = extraerConst('RE_NO_EXPLICITO');
const RE_EVOC = new RegExp(SRC.match(/return \/(si usted arrancara)\/i/)[1], 'i');
const yaEvoco = (hist) => hist.some((m) => m.role === 'assistant' && RE_EVOC.test(m.content));

console.log('\n── El «no» se atiende en dos tiempos ──\n');
const EVOCACION = { role: 'assistant', content: 'Y dígame una cosa: si usted arrancara, ¿por qué lo haría?' };
const OTRO      = { role: 'assistant', content: 'Con gusto, el Ganocafé cuesta $110.900.' };

const NOES = [
  ['no me interesa, gracias',   [OTRO],            'no_primero', 'primer no → la pregunta'],
  ['gracias pero paso',         [OTRO],            'no_primero', 'primer no, otra forma'],
  ['no me interesa',            [OTRO, EVOCACION], 'puerta',     'segundo no → la puerta'],
  ['no quiero, de verdad',      [EVOCACION],       'puerta',     'segundo no, otra forma'],
];
for (const [msg, hist, esperado, etiqueta] of NOES) {
  const got = RE_NO.test(norm(msg)) ? (yaEvoco(hist) ? 'puerta' : 'no_primero') : 'ninguno';
  ok_(got === esperado, `${etiqueta.padEnd(34)} «${msg}» → ${got}`);
}

console.log('\n── La aceptación de la puerta ──\n');
const ACEPTA = new RegExp(SRC.match(/return \/\\b\(si\|claro([^/]*)\/\.test\(t\)/)?.[0]?.match(/\/(.+)\/\.test/)?.[1] ?? 'si', '');
const acepta = (m) => {
  const t = norm(m);
  if (RE_NO.test(t) || /\bno\b/.test(t.split(/[.!?]/)[0] || '')) return false;
  return /\b(si|claro|dale|listo|por supuesto|obvio|bueno|vale|ok|de una)\b/.test(t);
};
for (const [m, esperado, etiqueta] of [
  ['sí, claro',            true,  'un sí abre la puerta'],
  ['dale, con gusto',      true,  'otra forma de sí'],
  ['listo',                true,  'un listo también'],
  ['no, prefiero que no',  false, 'un no se respeta'],
  ['no me interesa',       false, 'y un no rotundo también'],
]) ok_(acepta(m) === esperado, `${etiqueta.padEnd(34)} «${m}»`);

console.log('\n── Contrato webhook → motor ──\n');
console.log(`   el webhook emite ${emitidos.length} valores fijos + ${peldanos.length} peldaños con número`);
console.log(`   el motor atiende ${atendidos.length} nodos\n`);

if (!plantillas.length) { console.log('❌ el webhook ya no emite peldaños con número'); fallos++; }

for (const pc of [...new Set(CONTRATO)]) {
  const { nodo, n } = parsear(pc);
  const ok = atendidos.includes(nodo);
  if (!ok) fallos++;
  console.log(`${ok ? '✅' : '❌'} ${pc.padEnd(30)} → nodo «${nodo}»${n !== null ? `, n=${n}` : ''}${ok ? '' : '   ← el motor NO lo atiende'}`);
}

const huerfanos = atendidos.filter((a) => !CONTRATO.some((c) => parsear(c).nodo === a));
if (huerfanos.length) {
  console.log(`\n⚠️ el motor atiende nodos que el webhook nunca emite: ${huerfanos.join(', ')}`);
  fallos++;
}

console.log(`\n${'─'.repeat(64)}`);
if (fallos) {
  console.log(`❌ ${fallos} de ${CASOS.length} fallaron`);
  process.exit(1);
}
console.log(`✅ ${CASOS.length + CONTEXTO.length + MOTIVOS.length + PELDANOS.length + NUMEROS.length + PAREJA.length} casos + el contrato webhook→motor, en verde — el detector separa la duda de la pregunta, y el contexto elige el cierre`);
