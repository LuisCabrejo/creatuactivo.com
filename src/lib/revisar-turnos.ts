/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La cola de turnos marcados: el lazo que convierte un fallo de producción en
 * un arreglo, sin depender de que alguien se acuerde de mirar.
 *
 * ── POR QUÉ ──────────────────────────────────────────────────────────────────
 *
 * Las primeras personas que entraron al canal se llevaron malas experiencias, y
 * todas se descubrieron igual: alguien volcó las conversaciones a mano, las
 * leyó y llevó cada fallo hasta su nodo. Eso funciona y no escala. Oswaldo se
 * fue el 22 de septiembre a las 19:50 y nos enteramos al día siguiente.
 *
 * Esto cierra el lazo: **rastro → detectar → cola → revisar → arnés → arreglo**.
 *
 * ── DÓNDE VIVE LA COLA ───────────────────────────────────────────────────────
 *
 * En `nexus_conversations.metadata.marcado`, no en una tabla nueva. La fila del
 * turno ya existe y ya tiene su metadata; marcar ahí no pide permisos de DDL y
 * deja la marca pegada al turno que la produjo, que es donde uno quiere leerla.
 *
 *   metadata.marcado = { detectores: ['...'], en: '2026-09-23T…', muestra: '…' }
 *   metadata.revisado = '2026-09-24T…'   ← lo pone quien la trabaja
 *
 * La cola es entonces: turnos con `marcado` y sin `revisado`.
 *
 * ── LAS DOS CAPAS ────────────────────────────────────────────────────────────
 *
 * 1. **Determinista** (milisegundos, cero pesos). Caza lo que ya conocemos: la
 *    pregunta de dos salidas, la repetición, el fragmento ya servido, el tic de
 *    la honestidad, los pesos con coma, el léxico retirado. Medido sobre 819
 *    turnos reales: cubre el 97 % de lo que se marca.
 *
 * 2. **El juez** (Haiku, ~1,3 s por turno). Corre DESPUÉS de entregar, así que
 *    no le cuesta latencia a nadie, y caza lo que ninguna regla ve: la respuesta
 *    genérica a una pregunta específica, el perfil equivocado, el argumento que
 *    no viene al caso. ⚠️ **No bloquea nada.** Un juez es un modelo y se
 *    equivoca en las dos direcciones; bloquear una respuesta buena le cuesta una
 *    venta al socio. Aquí solo marca para que una persona lo mire.
 *
 * Investigación completa → docs/investigaciones/resultados/
 * CALIDAD_DE_RESPUESTA_EN_PRODUCCION_SEP2026.md
 */
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import { detectarPreguntaDeDosSalidas } from './guardarrail-pregunta';
import { candadoYaDicho } from './queswa-conductor';

/** Uno o varios correos separados por coma. Mismo destino que el vigilante del motor. */
export const DESTINO_REVISION = (process.env.ALERTA_SISTEMA_EMAIL || 'sistema@creatuactivo.com, luiscabrejo7@gmail.com')
  .split(',').map((c) => c.trim()).filter(Boolean);

const MODELO_JUEZ = 'claude-haiku-4-5-20251001';

/** Los arneses y las pruebas no son personas: no entran a la cola. */
const RE_ARNES = /conv|probe|_p_|q23|wa_e3_|^wa_5730\d{9,}|sede_probe|deploy/;
export function esPersonaReal(fp: string | null): boolean {
  if (!fp || fp === 'null') return true;
  if (fp.startsWith('dash_')) return true;
  return !RE_ARNES.test(fp) && /^wa_(57\d{10}|CO\.\d+|[A-Z]{2}\.\d+)$/.test(fp);
}

export type Turno = {
  id?: string;
  fingerprint_id: string | null;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
};

const dicho = (t: Turno) => (t.messages || []).find((m: { role: string }) => m.role === 'assistant')?.content ?? '';
const preguntado = (t: Turno) => (t.messages || []).find((m: { role: string }) => m.role === 'user')?.content ?? '';

const RE_ACEPTA = /^(s[ií]+|claro|dale|listo|ok(ay)?|bueno|por supuesto|de una|vale|perfecto|sip|sii)[\s.,!]*$/i;

/**
 * Los detectores deterministas. Cada uno devuelve su nombre si el turno falla.
 *
 * ⚠️ El orden es el de su daño medido, no el de su elegancia: el primero causó
 * el 52 % de los abandonos del mes.
 */
export function detectoresDeterministas(turno: Turno, anterior: Turno | null, yaServidos: Set<string>): string[] {
  const t = dicho(turno);
  const u = preguntado(turno);
  const marcas: string[] = [];

  if (detectarPreguntaDeDosSalidas(t)) marcas.push('pregunta de dos salidas');

  if (anterior && t.length > 80 && candadoYaDicho(dicho(anterior), t)) marcas.push('repite el turno anterior');

  const cats: string[] = (turno.metadata?.documents_used ?? [])
    .filter((d: unknown) => typeof d === 'string' && /^(arsenal_|catalogo_)[a-z0-9_]*_[A-Z]/.test(d as string));
  if (cats.some((c) => yaServidos.has(c))) marcas.push('sirve un fragmento ya servido en el hilo');

  // El "sí" que cayó al vector: la aceptación no encontró nodo y se fue a buscar.
  if (RE_ACEPTA.test(u.trim()) && /vector_search/.test(String(turno.metadata?.search_method ?? ''))) {
    marcas.push('aceptación que no encontró nodo');
  }

  if (/\$\d{1,3}(,\d{3})+\s*COP|\$\d{1,3}(,\d{3}){2}/.test(t)) marcas.push('pesos con coma de miles');

  // El tic: abrir anunciando que se va a responder bien. Posiciona al lector
  // como si esperara una respuesta deshonesta (regla del Director).
  if (/respuesta honesta|vale la pena responderla?|con franqueza|siendo honest|responder(la)? bien|le hablo con honestidad/i.test(t)) {
    marcas.push('anuncia su propia honestidad');
  }

  if (/ingreso[s]? pasivo|libertad financiera|reclut(ar|amiento)|oportunidad de negocio|de por vida|vitalici/i.test(t)) {
    marcas.push('léxico retirado');
  }

  if (!t.trim()) marcas.push('respuesta vacía');

  return marcas;
}

const PROMPT_JUEZ = `Usted revisa un turno YA ENTREGADO de Queswa, la asistente de CreaTuActivo en WhatsApp. No bloquea nada: solo señala si la respuesta le falló a la persona.

Responda SOLO con JSON: {"ok":true|false,"motivo":"una frase"}

Marque ok:false SOLO si ocurre algo de esto:
- la respuesta no contesta lo que la persona preguntó, o cambia de tema
- le habla a un perfil que no es el suyo (a un empresario como si fuera empleado)
- repite lo que Queswa ya había dicho en el turno anterior
- promete un ingreso con PLAZO ("en seis meses estará ganando"), con GARANTÍA, o dice que reemplaza un salario
- afirma que un producto sirve para una enfermedad o para adelgazar

NO marque estas, que son correctas:
- las cifras del plan de compensación, incluidas las proyecciones por nivel y la
  de Los 12 Niveles ($103 millones al nivel 12): son el potencial matemático de
  la duplicación 2x2, están calibradas, aprobadas y salen del backend
- una respuesta breve a un "sí" o un "ok": la persona está aceptando la OFERTA
  del turno anterior, que usted tiene arriba. Léala antes de juzgar
- un cierre corto de cortesía
- nombrar precios, porcentajes o el nombre de un bono

Ante la duda, ok:true. Una marca falsa hace que nadie mire la cola.`;

export type Veredicto = { ok: boolean; motivo?: string };

/**
 * El juez sobre un turno. Nunca lanza: ante fallo devuelve `ok`.
 *
 * ⚠️ Recibe el turno ANTERIOR. Sin él, un «sí» pelado se lee como una respuesta
 * que no viene a cuento, y el juez marcaba siete de veinte por esa sola causa
 * (calibración del 23 sep 2026). Lo que la persona aceptó está en la oferta de
 * arriba, no en su mensaje.
 */
export async function juzgarTurno(turno: Turno, apiKey: string, anterior?: Turno | null): Promise<Veredicto> {
  try {
    const a = new Anthropic({ apiKey });
    const r = await a.messages.create({
      model: MODELO_JUEZ,
      max_tokens: 120,
      system: PROMPT_JUEZ,
      messages: [{
        role: 'user',
        content: [
          anterior ? `QUESWA, EN EL TURNO ANTERIOR: ${dicho(anterior).slice(0, 900)}` : '(este es el primer turno)',
          `LA PERSONA: ${preguntado(turno).slice(0, 600)}`,
          `QUESWA AHORA: ${dicho(turno).slice(0, 1800)}`,
        ].join('\n\n'),
      }],
    });
    const txt = r.content.map((c) => ('text' in c ? c.text : '')).join('');
    const json = txt.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return { ok: true };
    const v = JSON.parse(json) as Veredicto;
    return { ok: v.ok !== false, motivo: v.motivo };
  } catch {
    // El juez no puede tumbar la revisión: si falla, ese turno queda sin juzgar.
    return { ok: true };
  }
}

export type Resumen = {
  revisados: number;
  marcados: number;
  porDetector: Record<string, number>;
  juzgados: number;
  nuevos: { fingerprint: string; cuando: string; detectores: string[]; muestra: string }[];
};

/**
 * Recorre los turnos de las últimas `horas`, marca los que fallan y devuelve el
 * resumen. `conJuez` enciende la capa 2 (cuesta ~1,3 s por turno no marcado).
 */
export async function revisarTurnos(opciones: {
  horas?: number; conJuez?: boolean; topeJuez?: number; soloLectura?: boolean;
} = {}): Promise<Resumen> {
  const { horas = 24, conJuez = false, topeJuez = 40, soloLectura = false } = opciones;
  const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const desde = new Date(Date.now() - horas * 3600_000).toISOString();

  // ⚠️ PAGINADO: supabase-js corta en 1000 filas por defecto. Sin esto, una
  // ventana de varios días se revisa a medias y en silencio — el mismo tope que
  // escondió a Oswaldo en la primera búsqueda del 23 sep.
  let filas: Turno[] = [];
  for (let desdeFila = 0; ; desdeFila += 1000) {
    const { data, error } = await s.from('nexus_conversations')
      .select('id, fingerprint_id, created_at, messages, metadata')
      .gt('created_at', desde).order('created_at').range(desdeFila, desdeFila + 999);
    if (error) throw error;
    filas = filas.concat(data as Turno[]);
    if ((data as Turno[]).length < 1000) break;
  }

  const personas = filas.filter((t) => esPersonaReal(t.fingerprint_id));
  const hilos: Record<string, Turno[]> = {};
  for (const t of personas) (hilos[t.fingerprint_id ?? 'null'] ||= []).push(t);

  const resumen: Resumen = { revisados: personas.length, marcados: 0, porDetector: {}, juzgados: 0, nuevos: [] };
  const sinMarca: Turno[] = [];
  // Para que el juez pueda leer la oferta que la persona aceptó.
  const anteriorDe = new Map<Turno, Turno | null>();

  for (const turnos of Object.values(hilos)) {
    turnos.sort((a, b) => a.created_at.localeCompare(b.created_at));
    const yaServidos = new Set<string>();
    for (let i = 0; i < turnos.length; i++) {
      const t = turnos[i];
      const anterior = i > 0 ? turnos[i - 1] : null;
      anteriorDe.set(t, anterior);
      const marcas = detectoresDeterministas(t, anterior, yaServidos);
      for (const c of (t.metadata?.documents_used ?? [])) {
        if (typeof c === 'string' && /^(arsenal_|catalogo_)[a-z0-9_]*_[A-Z]/.test(c)) yaServidos.add(c);
      }
      if (marcas.length) {
        resumen.marcados++;
        for (const m of marcas) resumen.porDetector[m] = (resumen.porDetector[m] ?? 0) + 1;
        if (!t.metadata?.marcado) {
          resumen.nuevos.push({
            fingerprint: t.fingerprint_id ?? 'null', cuando: t.created_at,
            detectores: marcas, muestra: dicho(t).slice(0, 180),
          });
          if (!soloLectura) await marcar(s, t, marcas, dicho(t));
        }
      } else {
        sinMarca.push(t);
      }
    }
  }

  // ── Capa 2: el juez, solo sobre lo que la capa barata dejó pasar ───────────
  //
  // ⚠️ Y solo sobre lo que COMPUSO EL MODELO. Un turno dictado es copy nuestro,
  // ya calibrado y ya vigilado por las baterías: juzgarlo solo produce ruido. En
  // la calibración del 23 sep el juez marcaba `NIVELES_01` como promesa de
  // ingreso por sus cifras por nivel, que son el potencial de la duplicación y
  // están aprobadas.
  const compuestoPorElModelo = (t: Turno) => {
    const m = String(t.metadata?.search_method ?? '');
    return !!m && !/dictad|candado|puerta|pin_|radicacion|ciclo|salud_entrada/.test(m);
  };
  if (conJuez && process.env.ANTHROPIC_API_KEY) {
    for (const t of sinMarca.filter(compuestoPorElModelo).slice(0, topeJuez)) {
      if (t.metadata?.marcado || !dicho(t).trim()) continue;
      const v = await juzgarTurno(t, process.env.ANTHROPIC_API_KEY, anteriorDe.get(t) ?? null);
      resumen.juzgados++;
      if (v.ok) continue;
      const marca = `el juez: ${v.motivo ?? 'sin motivo'}`;
      resumen.marcados++;
      resumen.porDetector['el juez'] = (resumen.porDetector['el juez'] ?? 0) + 1;
      resumen.nuevos.push({
        fingerprint: t.fingerprint_id ?? 'null', cuando: t.created_at,
        detectores: [marca], muestra: dicho(t).slice(0, 180),
      });
      if (!soloLectura) await marcar(s, t, [marca], dicho(t));
    }
  }

  return resumen;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function marcar(s: any, t: Turno, detectores: string[], muestra: string): Promise<void> {
  try {
    await s.from('nexus_conversations')
      .update({ metadata: { ...(t.metadata ?? {}), marcado: { detectores, en: new Date().toISOString(), muestra: muestra.slice(0, 300) } } })
      .eq('id', t.id);
  } catch { /* best-effort: el resumen sale igual */ }
}

/**
 * El correo del día. **Solo sale si hay algo nuevo**: un aviso diario que casi
 * siempre dice «nada» deja de leerse, y entonces no sirve el día que sí dice algo.
 */
export async function avisarRevision(resumen: Resumen): Promise<boolean> {
  if (!resumen.nuevos.length || !process.env.RESEND_API_KEY) return false;
  const filas = Object.entries(resumen.porDetector).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #26282e">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #26282e;text-align:right;color:#C5A059">${v}</td></tr>`).join('');
  const muestras = resumen.nuevos.slice(0, 8)
    .map((n) => `<li style="margin-bottom:10px"><b style="color:#C5A059">${n.detectores.join(' · ')}</b><br><span style="color:#94A3B8;font-size:12px">${n.fingerprint} · ${new Date(n.cuando).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</span><br>${n.muestra.replace(/</g, '&lt;')}…</li>`).join('');
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Queswa <hola@creatuactivo.com>',
    to: DESTINO_REVISION,
    subject: `[Revisión Queswa] ${resumen.nuevos.length} turno(s) para mirar`,
    html: `<div style="background:#0F1115;color:#E5E5E5;font-family:Inter,Arial,sans-serif;padding:24px">
      <p style="color:#94A3B8;font-size:12px;letter-spacing:.08em;margin:0 0 4px">REVISIÓN DE TURNOS</p>
      <h2 style="margin:0 0 16px;font-weight:600">${resumen.nuevos.length} turno(s) nuevos para mirar</h2>
      <p style="color:#94A3B8">De ${resumen.revisados} turnos de personas, ${resumen.marcados} quedaron marcados.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">${filas}</table>
      <ul style="padding-left:18px">${muestras}</ul>
      <p style="color:#94A3B8;font-size:12px;margin-top:20px">La cola son los turnos con <code>metadata.marcado</code> y sin <code>metadata.revisado</code>.</p>
    </div>`,
  });
  return true;
}
