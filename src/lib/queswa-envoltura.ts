/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LA ENVOLTURA — el código pone el texto aprobado; el modelo pone la conversación.
 *
 * ── EL PROBLEMA (prueba del Director, 24 sep 2026) ──────────────────────────
 *
 * Los textos con candado salen dictados por el backend, sin que el modelo lea
 * el turno. Es lo correcto para que salgan literales —el modelo los
 * parafraseaba—, pero tiene un precio: nadie mira lo que la persona acaba de
 * decir. El Director respondió «Si está bien, yo soy independiente…» a la
 * pregunta de cuándo retomar con su esposa, y recibió un texto que empezaba en
 * frío; dijo «Si» y le llegó «Me gusta esa pregunta», a una pregunta que no
 * hizo; y cada texto cerraba con su pregunta fija, aunque ofreciera algo que ya
 * había visto.
 *
 * ── LA SOLUCIÓN ──────────────────────────────────────────────────────────────
 *
 * Es el reparto que usan los líderes (Salesforce, Rasa, Google): lo exacto lo
 * pone el código, la conversación la pone el modelo. El texto aprobado sigue
 * saliendo LITERAL —nadie lo toca—, y una llamada corta al modelo escribe solo
 * lo que va alrededor: una línea de apertura si hace falta, y la pregunta de
 * cierre, con la bitácora delante para no ofrecer lo que la persona ya vio.
 *
 * Nunca frena el turno: si el modelo tarda o responde algo que no sirve, sale
 * el texto aprobado con su pregunta por defecto —o con el siguiente paso, si la
 * por defecto ofrece algo ya visto—, que es exactamente lo que salía antes.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { detectarPreguntaDeDosSalidas } from './guardarrail-pregunta';
import { temaDeOferta, temasDelTexto, type Bitacora } from './queswa-bitacora';

export interface Envoltura {
  apertura: string;
  cierre: string;
  /** De dónde salió: 'modelo' o 'respaldo' (con el motivo). */
  origen: string;
  ms: number;
}

const SISTEMA = `Usted escribe las piezas de conversación que acompañan un texto aprobado de Queswa, la asistente de CreaTuActivo.com que atiende por WhatsApp y en la web a quienes llegan interesados. El texto aprobado se entrega tal cual, en medio de lo que usted escriba.

Escriba dos piezas:
• apertura — una sola línea que responda a lo que la persona acaba de decir de sí o de lo anterior: si aceptó algo que se le propuso, reconózcalo («Perfecto, lo retomamos cuando lo hayan hablado»); si contó su situación, tómela; si dijo que algo ya se había hablado, compruébelo en la bitácora y dígalo. La apertura habla de lo que la persona dijo, no de su pregunta. Si su mensaje fue solo una aceptación («sí», «dale») o una pregunta que el texto aprobado responde de frente, déjela vacía.
• cierre — elija UNA de las preguntas permitidas, copiada tal cual, o déjelo vacío si lo natural es cerrar sin pregunta.

Queswa trata de usted, escribe frases cortas y cálidas, y habla de clientes y distribuidores; la persona construye su propio sistema de distribución.

Responda únicamente con JSON: {"apertura": "...", "cierre": "..."}`;

const normalizar = (t: string) => (t || '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * La pregunta de cierre por defecto, o la que la reemplaza si ofrece algo que
 * la persona ya vio. Es el respaldo determinista cuando el modelo no responde.
 */
export function cierreDeRespaldo(porDefecto: string, bitacora: Pick<Bitacora, 'temasMostrados' | 'siguientePaso'> | null, nucleo = ''): string {
  return cierresPermitidos(porDefecto, bitacora, nucleo)[0] ?? '';
}

/**
 * El primer párrafo que elogia la pregunta («Me gusta esa pregunta — es la que
 * de verdad importa», «Buena pregunta, y la más importante») sobra cuando la
 * persona no preguntó nada: dijo «sí» a una oferta. Se quita del texto
 * aprobado solo en ese caso; el resto va literal.
 */
export function sinElogioSiNoPregunto(nucleo: string, mensajePersona: string): string {
  const pregunto = /\?|^\s*(qu[eé]|c[oó]mo|cu[aá]l|cu[aá]nto|d[oó]nde|por\s*qu[eé]|para\s+qu[eé])\b/i.test(mensajePersona || '');
  if (pregunto) return nucleo;
  const partes = nucleo.split(/\n\s*\n/);
  if (partes.length > 1 && /^(Me gusta esa pregunta|Buena pregunta|Excelente pregunta)/i.test(partes[0].trim())) {
    return partes.slice(1).join('\n\n');
  }
  return nucleo;
}

function validarApertura(apertura: unknown, nucleo: string): string {
  if (typeof apertura !== 'string') return '';
  const a = apertura.trim().replace(/^["«]|["»]$/g, '');
  if (!a || a.length > 220 || a.includes('?') || /\n/.test(a)) return '';
  // La apertura comenta lo que la persona DIJO, nunca su pregunta: «Buena
  // pregunta» y «tiene razón en hacérsela» son el tic que el Director marcó, y
  // en la primera prueba de este módulo (24 sep 2026) volvió con otras palabras.
  if (/\bpregunta|raz[oó]n en (hac|pregunt|plante)|vale la pena preguntar/i.test(a)) return '';
  // Si arranca igual que el texto aprobado, lo estaría duplicando.
  if (normalizar(nucleo).startsWith(normalizar(a).slice(0, 25))) return '';
  return a;
}

/**
 * Las preguntas de cierre permitidas: la del fragmento, si su tema no se ha
 * mostrado, y el siguiente paso de la bitácora. Nada más, a propósito: una
 * pregunta nueva no tiene destino escrito, y el «sí» a ella cae en el vacío
 * (regla: no cerrar con una pregunta que el arsenal no pueda atender). En la
 * primera prueba de este módulo el modelo inventó «¿Le cuento cómo encajaría
 * esto con lo que ya hace…?».
 */
export function cierresPermitidos(
  porDefecto: string,
  bitacora: Pick<Bitacora, 'temasMostrados' | 'siguientePaso'> | null,
  nucleo = '',
): string[] {
  const out: string[] = [];
  // Lo ya visto incluye lo que el texto aprobado está entregando ahora.
  const vistos = new Set([...(bitacora?.temasMostrados ?? []), ...temasDelTexto(nucleo)]);
  const temaDef = porDefecto ? temaDeOferta(porDefecto) : null;
  if (porDefecto && !(temaDef && vistos.has(temaDef))) out.push(porDefecto);
  const sig = bitacora?.siguientePaso;
  if (sig && !out.includes(sig) && !vistos.has(temaDeOferta(sig) ?? '')) out.push(sig);
  return out.filter((q) => !detectarPreguntaDeDosSalidas(q));
}

function validarCierre(cierre: unknown, permitidos: string[]): string | null {
  if (typeof cierre !== 'string') return null;
  const c = cierre.trim().replace(/^["«]|["»]$/g, '');
  if (!c) return '';
  return permitidos.find((q) => normalizar(q) === normalizar(c)) ?? null;
}

/**
 * Pide la apertura y el cierre. Nunca lanza: ante cualquier fallo devuelve el
 * respaldo determinista.
 */
export async function envolverTextoAprobado(p: {
  anthropic: Anthropic;
  bitacora: Bitacora | null;
  mensajePersona: string;
  ultimoBot: string;
  nucleo: string;
  cierrePorDefecto: string;
  timeoutMs?: number;
}): Promise<Envoltura> {
  const t0 = Date.now();
  const respaldo = (motivo: string): Envoltura => ({
    apertura: '',
    cierre: cierreDeRespaldo(p.cierrePorDefecto, p.bitacora, p.nucleo),
    origen: `respaldo: ${motivo}`,
    ms: Date.now() - t0,
  });

  const permitidos = cierresPermitidos(p.cierrePorDefecto, p.bitacora, p.nucleo);
  const usuario = `${p.bitacora?.texto || '<bitacora>Primer contacto: no hay historia.</bitacora>'}

Últimos mensajes:
Queswa: «${(p.ultimoBot || '').slice(0, 700)}»
Persona: «${(p.mensajePersona || '').slice(0, 500)}»

Texto aprobado que va en medio de sus dos piezas:
«${p.nucleo.slice(0, 1400)}»

Preguntas de cierre permitidas:
${permitidos.length ? permitidos.map((q) => `• ${q}`).join('\n') : '• (ninguna: cierre sin pregunta)'}`;

  try {
    const r = await p.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      temperature: 0.3,
      system: SISTEMA,
      messages: [{ role: 'user', content: usuario }],
    }, { timeout: p.timeoutMs ?? 7000, maxRetries: 0 });
    const texto = r.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
    const json = texto.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return respaldo('sin JSON');
    const datos = JSON.parse(json) as { apertura?: unknown; cierre?: unknown };
    const apertura = validarApertura(datos.apertura, p.nucleo);
    const aperturaDescartada = typeof datos.apertura === 'string' && !!datos.apertura.trim() && !apertura;
    const nota = aperturaDescartada ? ` · apertura descartada: «${String(datos.apertura).slice(0, 80)}»` : '';
    const cierre = validarCierre(datos.cierre, permitidos);
    if (cierre === null) {
      return { apertura, cierre: cierreDeRespaldo(p.cierrePorDefecto, p.bitacora, p.nucleo), origen: `modelo (cierre fuera de lo permitido: «${String(datos.cierre).slice(0, 80)}»)${nota}`, ms: Date.now() - t0 };
    }
    return { apertura, cierre, origen: `modelo${nota}`, ms: Date.now() - t0 };
  } catch (err) {
    return respaldo(err instanceof Error ? err.message.slice(0, 80) : 'error');
  }
}

/** Arma el turno: apertura, texto aprobado y cierre, con una línea en blanco entre piezas. */
export function armarTurno(e: Pick<Envoltura, 'apertura' | 'cierre'>, nucleo: string): string {
  return [e.apertura, nucleo.trim(), e.cierre].filter((x) => x && x.trim()).join('\n\n');
}
