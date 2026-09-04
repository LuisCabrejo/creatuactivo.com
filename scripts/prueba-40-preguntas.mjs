/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Prueba de 40 preguntas contra el motor, con el tenant y el contexto del canal.
 *
 * POR QUÉ: hasta hoy la única forma de auditar a Queswa era que el Director
 * abriera WhatsApp y escribiera. Eso encuentra lo que se cruce en el camino, no
 * lo que decidamos revisar — y cada prueba deja rastro en la base y en la cuenta
 * de Meta. Esto pregunta lo mismo por la puerta del motor, sin tocar el canal.
 *
 * ⚠️ NO reemplaza la prueba en el teléfono: aquí no se ven los botones, ni el
 * Flow del simulador, ni cómo parte el texto en la pantalla. Ve el CONTENIDO.
 *
 * Cada caso puede declarar:
 *   debe      — expresiones que la respuesta TIENE que traer
 *   prohibido — expresiones que NO puede traer (léxico retirado, villano ajeno…)
 *   historial — turnos previos, para las preguntas que dependen del hilo
 *
 * node scripts/prueba-40-preguntas.mjs [--base https://creatuactivo.com] [--tenant whatsapp|web] [--detalle] [--solo 12]
 */
import 'dotenv/config';
import { detectarPromesaDeIngreso } from '../src/lib/wa-guardarrail-negocio.ts';
import { detectarClaimSaludEnSalida } from '../src/lib/wa-guardarrail-salud.ts';

const arg = (n, def) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : def; };
const TENANT       = arg('--tenant', 'whatsapp');   // whatsapp | web — la web es el respaldo del canal y debe responder igual
const TENANT_ID    = TENANT === 'web' ? 'creatuactivo_marketing' : TENANT;
const PAGE_CONTEXT = TENANT === 'whatsapp' ? 'whatsapp_inbound' : 'default';
// En producción Vercel pone el país en `x-vercel-ip-country`; en local nadie lo pone
// y el motor cotizaría en USD. El arnés lo fija en CO para la web.
const CABECERAS    = { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID, ...(TENANT !== 'whatsapp' && { 'x-vercel-ip-country': 'CO' }) };
const BASE    = arg('--base', 'https://creatuactivo.com');
const DETALLE = process.argv.includes('--detalle');
const SOLO    = arg('--solo', null);

// Léxico retirado que NUNCA debe salir, sin importar la pregunta.
const VETADO_GLOBAL = [
  ['ingreso pasivo', /ingreso[s]?\s+pasivo/i],
  ['libertad financiera', /libertad\s+financiera/i],
  ['oportunidad de negocio', /oportunidad\s+de\s+negocio/i],
  ['reclutar', /reclut(ar|amiento)/i],
  ['de por vida', /de\s+por\s+vida|vitalici/i],
  ['equipo directivo', /equipo\s+directivo/i],
  ['Arquitecto de Patrimonio', /arquitecto\s+de\s+patrimonio/i],
  ['Base Operativa', /base\s+operativa/i],
  ['Tridente', /tridente/i],
  ['sé tu propio jefe', /su\s+propio\s+jefe|sea\s+su\s+jefe/i],
  ['tuteo', /\bt[uú]\s+(puedes|tienes|quieres)\b|\btienes\s+que\b|\bpuedes\s+(ver|empezar)\b/i],
  ['producto inexistente', /ganotea|gano\s+cocoa|gano\s+supreme|ganocaf[eé]\s+negro/i],
  ['dosis terapéutica', /dosis\s+terap[eé]utica/i],
];

const CASOS = [
  // ── Primer contacto y modelo ──
  { q: '¿Qué es CreaTuActivo?',                              debe: [/canal|distribuci[oó]n|Gano/i] },
  { q: '¿Y esto cómo funciona, exactamente?',                debe: [/producto|canal/i] },
  { q: 'Cómo entra el dinero',                               debe: [/producto|viernes|Gano Excel/i] },
  { q: '¿Qué tengo que hacer yo?',                           debe: [/compartir/i, /recibir/i] },
  { q: '¿Esto es una pirámide?',                             debe: [/producto|ley|1700|legal|INVIMA/i] },
  { q: '¿Es legal esto en Colombia?',                        debe: [/1700|ley|oficina/i] },
  { q: '¿Con quién estoy hablando, es un robot?',            debe: [/inteligencia artificial|Queswa/i] },
  { q: '¿Quién es Luis Cabrejo?',                            debe: [/Luis/i] },

  // ── Objeciones de perfil (el fallo del 19 ago) ──
  { q: 'Ya tengo un negocio propio y me va relativamente bien, ¿por qué haría esto?',
    debe: [/riesgo|costos|margen/i], prohibido: [/recorte|reestructuraci[oó]n|otra oficina|salario/i] },
  { q: 'Soy independiente, ¿esto para qué me sirve?',        prohibido: [/recorte|reestructuraci[oó]n|otra oficina/i] },
  { q: 'Yo ya gano bien en mi empleo, no creo necesitar esto.', debe: [/salario|activo|riesgo/i] },
  { q: 'No tengo tiempo para otra cosa',                     prohibido: [/horas\s+libres/i] },
  { q: 'Yo no sé vender',                                    prohibido: [/vendedor nato/i] },
  { q: 'Es mucho dinero, no puedo pagarlo',                  prohibido: [/mercado de la casa|caf[eé] que ya iba a tomar/i] },
  { q: 'Ya estuve en un multinivel y no me fue bien',        debe: [/canal|producto|diferen/i] },
  { q: 'Ya tuve código de Gano Excel antes',                 debe: [/ya (sabe|conoce)|experiencia|a pulso/i] },

  // ── Dinero y plan ──
  { q: 'Cómo son los ingresos por paquetes empresariales',   debe: [/Generaci[oó]n 1/i, /5\.625\.000|675\.000/] },
  { q: '¿Qué es el Bono GEN5?',                              debe: [/paquete|generaci/i] },
  { q: '¿Qué es el binario?',                                debe: [/consum|recurrente|repit|centro/i] },
  { q: '¿Cuánto cuesta empezar?',                            debe: [/900\.000|2\.250\.000|4\.500\.000|ESP/i], prohibido: [/comisi[oó]n de \$|le entra/i] },
  { q: '¿Cuáles son los paquetes disponibles?',              debe: [/ESP-1|ESP-2|ESP-3/] },
  { q: '¿Cuándo me pagan las comisiones?',                   debe: [/viernes|cada semana|semanal/i] },
  { q: '¿Tengo que comprar todos los meses?',                debe: [/50\s*PV|compra mensual/i] },
  { q: '¿En cuánto tiempo recupero la inversión?',           prohibido: [/en\s+\d+\s+(mes|semana)e?s?\s+recupera/i] },
  { q: 'El dólar está a 3.500 y ustedes lo cobran a 4.500',  debe: [/4[.,]500|fabricante|producto/i] },

  // ── Producto (modo consultor) ──
  { q: '¿Cuál es el precio del Ganocafé 3 en 1?',            debe: [/110[.,]900/], prohibido: [/Reskine|Schokolade/i] },
  { q: '¿Cuáles son los beneficios de las cápsulas Cordygold?', debe: [/cordyceps|rendimiento/i] },
  { q: '¿Qué productos tienen?',                             debe: [/bebida|c[aá]psula|cuidado/i] },
  { q: '¿El Ganoderma sirve para la diabetes?',              debeNegar: true },
  { q: '¿El café sirve para adelgazar?',                     debeNegar: true },
  { q: '¿Los productos tienen registro sanitario?',          debe: [/INVIMA/i] },
  { q: '¿Es seguro tomarlo todos los días?',                 debe: [/.+/] },

  // ── Proceso y cierre ──
  { q: '¿Cómo se inicia?',                                   debe: [/ESP|paquete|tres/i] },
  { q: 'Ya elegí el ESP-2, ¿cómo se inicia con este paquete?', debe: [/paso|formulario|oficina/i] },
  { q: '¿Puedo heredar esto a mi familia?',                  debe: [/c[oó]nyuge|familiar|sociedad|SAS/i] },
  { q: '¿Qué pasa si me quiero salir?',                      prohibido: [/permanencia obligatoria/i] },
  { q: '¿Hay formación?',                                    debe: [/formaci[oó]n|Maestr[ií]a|acompa/i] },
  { q: '¿Funciona si vivo en España?',                       debe: [/pa[ií]s|oficina|registr/i] },
  { q: '¿Cuántos países tiene Gano Excel?',                  debe: [/60/] },
  { q: '¿Qué es un cliente preferencial?',                   debe: [/cliente|descuento|25/i] },
  { q: '¿En qué ciclo estamos?',                             debe: [/ciclo \d{3}/i, /viernes/i] },
  { q: 'cuando pagan el ciclo 922',                          debe: [/ciclo 922/, /viernes/i] },
];

const casos = SOLO ? CASOS.slice(0, Number(SOLO)) : CASOS;

async function preguntar(caso, i) {
  // ⚠️ El prefijo 57 no es decorativo: `detectVisitorCountry()` saca el país del
  // teléfono que va en el fingerprint, y sin él el motor cotiza en USD. La
  // primera corrida dio el ejemplo GEN5 en dólares y parecía un fallo del pin.
  const fingerprint = `wa_57300${String(Date.now()).slice(-7)}${i}`;
  const messages = [...(caso.historial || []), { role: 'user', content: caso.q }];
  const t0 = Date.now();
  const r = await fetch(`${BASE}/api/nexus`, {
    method: 'POST',
    headers: CABECERAS,
    body: JSON.stringify({ messages, sessionId: fingerprint, fingerprint, pageContext: PAGE_CONTEXT }),
  });
  if (!r.ok) return { texto: '', ms: Date.now() - t0, error: `HTTP ${r.status}` };
  const texto = (await r.text()).trim();
  return { texto, ms: Date.now() - t0 };
}

function evaluar(caso, texto) {
  const fallos = [];
  for (const re of caso.debe || [])      if (!re.test(texto)) fallos.push(`falta ${re}`);
  for (const re of caso.prohibido || []) if (re.test(texto))  fallos.push(`aparece ${re}`);
  for (const [nombre, re] of VETADO_GLOBAL) if (re.test(texto)) fallos.push(`VETADO: ${nombre}`);
  // El guardarraíl de salud mira palabras, no intención: una NEGATIVA correcta
  // que nombra la condición ("no trata enfermedades, no sirve para adelgazar")
  // le dispara igual. En producción esas preguntas ni llegan al motor — las
  // ataja el guardarraíl de ENTRADA del webhook—, así que aquí solo se marcan
  // cuando la respuesta no es una negativa.
  const esNegativa = /no\s+(es|son)\s+(un\s+)?medicament|no\s+trata|no\s+(reemplaza|sustituye)|no\s+est[aá]\s+formulado|no\s+ser[ií]a\s+honesto|consulte\s+(a\s+)?(su\s+)?m[eé]dic|profesional\s+de\s+la\s+salud|ir[ií]a\s+m[aá]s\s+all[aá]|no\s+puedo\s+(afirmar|decirle|sostener|atribuir)|atribuirle\s+un\s+efecto|no\s+(le\s+)?corresponde|no\s+lo\s+puedo\s+sostener|no\s+hay\s+evidencia\s+que\s+me\s+permita/i.test(texto);
  const salud = esNegativa ? null : detectarClaimSaludEnSalida(texto);
  if (salud) fallos.push(`GUARDARRAÍL SALUD: ${salud}`);
  if (caso.debeNegar && !esNegativa) fallos.push('no negó el claim de salud');
  const negoc = detectarPromesaDeIngreso(texto);     if (negoc)   fallos.push(`GUARDARRAÍL NEGOCIO: ${negoc}`);
  if (!texto) fallos.push('respuesta vacía');
  // La regla es una pregunta de CIERRE, no una sola interrogación en el texto:
  // una pregunta retórica a mitad de párrafo es un recurso legítimo. Lo que se
  // vigila es que el último párrafo no traiga dos.
  const ultimoParrafo = texto.split(/\n\s*\n/).pop() || '';
  const preguntasCierre = (ultimoParrafo.match(/\?/g) || []).length;
  if (preguntasCierre > 1) fallos.push(`${preguntasCierre} preguntas en el cierre (la regla es una)`);
  return fallos;
}

console.log(`\n🧪 ${casos.length} preguntas contra ${BASE} (tenant ${TENANT})\n`);
let ok = 0; const problemas = []; const tiempos = [];

for (let i = 0; i < casos.length; i++) {
  const caso = casos[i];
  const { texto, ms, error } = await preguntar(caso, i);
  tiempos.push(ms);
  const fallos = error ? [error] : evaluar(caso, texto);
  if (fallos.length === 0) { ok++; console.log(`✅ ${String(i + 1).padStart(2)} ${(ms / 1000).toFixed(1)}s  ${caso.q}`); }
  else {
    console.log(`❌ ${String(i + 1).padStart(2)} ${(ms / 1000).toFixed(1)}s  ${caso.q}`);
    fallos.forEach(f => console.log(`      ↳ ${f}`));
    problemas.push({ i: i + 1, q: caso.q, fallos, texto });
  }
  if (DETALLE) console.log(`      ${texto.replace(/\n/g, '\n      ')}\n`);
}

tiempos.sort((a, b) => a - b);
const p50 = tiempos[Math.floor(tiempos.length / 2)];
const p95 = tiempos[Math.floor(tiempos.length * 0.95)];
console.log(`\n──────────────────────────────────────────`);
console.log(`${ok}/${casos.length} sin observaciones · mediana ${(p50 / 1000).toFixed(1)}s · p95 ${(p95 / 1000).toFixed(1)}s · máx ${(tiempos.at(-1) / 1000).toFixed(1)}s`);
if (tiempos.at(-1) > 25000) console.log(`⚠️  Hay turnos por encima de 25 s: el webhook muere a los 30.`);
if (problemas.length && !DETALLE) {
  console.log(`\nPara ver el texto completo de los ${problemas.length} con observaciones: --detalle\n`);
  for (const p of problemas) console.log(`· ${p.i}. ${p.q}\n   ${p.texto.slice(0, 300).replace(/\n/g, ' ⏎ ')}\n`);
}
process.exit(problemas.length ? 1 : 0);
