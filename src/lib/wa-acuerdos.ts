/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los ACUERDOS de Queswa — lo que se comprometió a hacer, y cuándo.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────────
 *
 * La escalera del aplazamiento (`wa-ambivalencia.ts`) termina preguntando
 * «¿qué día le escribo para retomarlo?». Sin esto, esa frase se pierde en el
 * hilo: se promete y no se cumple, que es peor que no prometer.
 *
 * Y hay una razón de canal, no solo de cortesía: **un recordatorio que la persona
 * PIDIÓ es la reentrada de mayor tolerancia que existe fuera de la ventana de
 * 24 h**, y la única con opción real de calificar como plantilla de UTILITY — la
 * categoría que sí se entrega a números de Estados Unidos. El acuerdo no es una
 * técnica de cierre: es lo que le compra a Queswa el permiso de volver.
 *
 * ── LAS TRES DECISIONES QUE LO SOSTIENEN ──────────────────────────────────────
 *
 * • **La hora se calcula en Bogotá.** La persona dice "el jueves a las 8" pensando
 *   en su reloj. Guardarlo en la hora del servidor lo corre cinco horas y el
 *   recordatorio llega de madrugada — que es el peor mensaje posible.
 *
 * • **Un solo acuerdo activo por persona**, garantizado por índice único en la
 *   tabla. Quien aplaza tres veces no puede recibir tres recordatorios el mismo
 *   día. El acuerdo nuevo CANCELA al anterior; no se suma.
 *
 * • **Lo prometido se guarda en las palabras de ella.** No una etiqueta
 *   ("seguimiento") sino lo que dijo: el recordatorio tiene que poder devolvérselo.
 *   Una categoría no sirve para eso.
 *
 * ⚠️ Nada de este módulo lanza. Un acuerdo que no se pudo guardar cuesta un
 * seguimiento; una excepción en el webhook cuesta la conversación entera.
 */

import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return anthropicClient;
}

/** Bogotá no tiene horario de verano: UTC−5 todo el año. */
const OFFSET_BOGOTA_H = -5;

export type Acuerdo = {
  id: number;
  fingerprintId: string;
  telefono: string;
  nombre?: string | null;
  que: string;
  cuando: string;
  intentos: number;
  constructorId?: string | null;
};

// ─── Extracción de la fecha ───────────────────────────────────────────────────

const INSTRUCCIONES = `Extraiga de la respuesta de una persona CUÁNDO pidió que le escribieran.

Devuelva SOLO un JSON, sin explicar nada:
{"dia":"YYYY-MM-DD","hora":"HH:MM","que":"<lo que se va a retomar, en las palabras de ella, máximo 8 palabras>"}

Si la persona NO fijó un momento, devuelva: {"dia":null,"hora":null,"que":null}

REGLAS:
· La fecha de referencia (hoy) se le entrega abajo. Todo es hora de Colombia.
· "mañana" = el día siguiente. "el jueves" = el próximo jueves que venga.
· "en la mañana" = 09:00. "al mediodía" = 12:00. "en la tarde" = 15:00.
  "en la noche" = 19:00. Si dice una hora exacta, úsela.
· Si dice un día pero no una hora, use 10:00.
· NUNCA invente una fecha si la persona no la dio. Un null es correcto.
· NUNCA fije un momento en el pasado. Si el cálculo da pasado, sume una semana.
· El campo "que" es el TEMA que van a retomar, no la fecha. Si le dan el contexto
  de lo último que envió el asistente, saque el tema de ahí: "lo de los paquetes",
  "lo del producto", "los números que le mandé". En las palabras de ella cuando
  las haya, y siempre en minúscula y sin punto final — va incrustado en una frase.`;

/**
 * ¿La persona fijó un momento? Devuelve el instante en UTC, o `null`.
 *
 * ⚠️ Nunca lanza: ante cualquier fallo devuelve null y el turno sigue sin acuerdo.
 * Perder un acuerdo cuesta un seguimiento; reventar cuesta la conversación.
 */
export async function extraerMomento(
  mensaje: string,
  ahora: Date = new Date(),
  contexto?: string,
): Promise<{ cuando: Date; que: string } | null> {
  if (!mensaje?.trim()) return null;

  // "Hoy" en Bogotá, para que el modelo calcule sobre el calendario de la persona.
  const hoyBogota = new Date(ahora.getTime() + OFFSET_BOGOTA_H * 3600_000);
  const diaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][hoyBogota.getUTCDay()];
  const hoyISO = hoyBogota.toISOString().slice(0, 10);

  try {
    const r = await getAnthropicClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      system: INSTRUCCIONES,
      messages: [{
        role: 'user',
        // ⚠️ El CONTEXTO es lo que hace específico el campo `que`. En el último
        // peldaño la persona solo dice la hora —«mañana a las 8»—, así que sin lo
        // que el bot acababa de mandarle el tema queda en «lo que estábamos
        // viendo», y el recordatorio pierde justo lo que lo hace personal: poder
        // devolverle de qué se trataba, con sus palabras.
        content: contexto
          ? `HOY es ${diaSemana} ${hoyISO} (hora de Colombia).\n\nLO ÚLTIMO QUE LE ENVIÓ EL ASISTENTE (de aquí sale el TEMA):\n${contexto.slice(0, 600)}\n\nRESPUESTA DE LA PERSONA (de aquí sale la FECHA):\n${mensaje}\n\nJSON:`
          : `HOY es ${diaSemana} ${hoyISO} (hora de Colombia).\n\nRESPUESTA DE LA PERSONA:\n${mensaje}\n\nJSON:`,
      }],
    });

    const bloque = r.content.find((b) => b.type === 'text');
    const texto = bloque?.type === 'text' ? bloque.text.trim() : '';
    const json = texto.match(/\{[\s\S]*\}/);
    if (!json) return null;

    const { dia, hora, que } = JSON.parse(json[0]) as { dia: string | null; hora: string | null; que: string | null };
    if (!dia || !hora) return null;

    // El modelo devuelve hora de Bogotá; se convierte a UTC restando el offset.
    const cuando = new Date(`${dia}T${hora}:00.000Z`);
    cuando.setTime(cuando.getTime() - OFFSET_BOGOTA_H * 3600_000);

    // ⚠️ Guarda dura contra el pasado: el modelo puede equivocarse de semana, y un
    // acuerdo vencido al nacer se dispara en el mismo minuto en que se crea.
    if (cuando.getTime() <= ahora.getTime()) return null;

    // Y contra el futuro absurdo: nadie agenda a tres meses; eso es un error de
    // interpretación, no una intención.
    if (cuando.getTime() > ahora.getTime() + 45 * 24 * 3600_000) return null;

    return { cuando, que: (que || 'lo que estábamos viendo').slice(0, 120) };
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] No se pudo extraer el momento:', err);
    return null;
  }
}

// ─── Persistencia ─────────────────────────────────────────────────────────────

/**
 * Guarda el acuerdo, cancelando el anterior de esa persona.
 *
 * ⚠️ El `update` va ANTES del `insert` a propósito: la tabla tiene un índice único
 * sobre los pendientes por persona, así que insertar sin cancelar revienta con
 * 23505. Cancelar primero es también lo correcto de negocio — quien aplaza otra
 * vez está reemplazando su compromiso, no acumulando dos.
 */
export async function guardarAcuerdo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  datos: { fingerprintId: string; telefono: string; que: string; cuando: Date; nombre?: string | null; constructorId?: string | null },
): Promise<boolean> {
  try {
    await supabase
      .from('wa_acuerdos')
      .update({ estado: 'cancelado', nota: 'reemplazado por un acuerdo nuevo' })
      .eq('fingerprint_id', datos.fingerprintId)
      .eq('estado', 'pendiente');

    const { error } = await supabase.from('wa_acuerdos').insert({
      fingerprint_id: datos.fingerprintId,
      telefono:       datos.telefono,
      nombre:         datos.nombre ?? null,
      constructor_id: datos.constructorId ?? null,
      que:            datos.que,
      cuando:         datos.cuando.toISOString(),
    });

    if (error) {
      console.error('⚠️ [WA Acuerdos] No se pudo guardar:', error);
      return false;
    }
    console.log(`🤝 [WA Acuerdos] ${datos.fingerprintId} → ${datos.cuando.toISOString()} · «${datos.que}»`);
    return true;
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] Falló al guardar:', err);
    return false;
  }
}

/** Los acuerdos que ya vencieron y siguen pendientes. Los lee el cron. */
export async function acuerdosVencidos(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  limite = 50,
): Promise<Acuerdo[]> {
  try {
    const { data } = await supabase
      .from('wa_acuerdos')
      .select('id, fingerprint_id, telefono, nombre, que, cuando, intentos, constructor_id')
      .eq('estado', 'pendiente')
      .lte('cuando', new Date().toISOString())
      .order('cuando', { ascending: true })
      .limit(limite);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data || []) as any[]).map((a) => ({
      id: a.id, fingerprintId: a.fingerprint_id, telefono: a.telefono, nombre: a.nombre,
      que: a.que, cuando: a.cuando, intentos: a.intentos, constructorId: a.constructor_id,
    }));
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] No se pudieron leer los vencidos:', err);
    return [];
  }
}

/**
 * Cierra un acuerdo.
 *
 * ⚠️ A los TRES intentos se marca 'vencido' y no se vuelve a tocar. Insistirle a
 * quien no responde es exactamente lo que Meta lee como spam, y eso no lo paga
 * ese acuerdo: lo paga la calificación del número entero, para todos los socios.
 */
export async function cerrarAcuerdo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  id: number,
  resultado: 'cumplido' | 'reintentar',
  intentosPrevios = 0,
): Promise<void> {
  try {
    if (resultado === 'cumplido') {
      await supabase.from('wa_acuerdos')
        .update({ estado: 'cumplido', cumplido_at: new Date().toISOString() })
        .eq('id', id);
      return;
    }
    const intentos = intentosPrevios + 1;
    await supabase.from('wa_acuerdos')
      .update(intentos >= 3
        ? { estado: 'vencido', intentos, nota: 'tres intentos sin entregar' }
        : { intentos })
      .eq('id', id);
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] No se pudo cerrar:', err);
  }
}

/**
 * Guarda la PUERTA ABIERTA — el permiso que queda después de un «no».
 *
 * ⚠️ No lleva fecha, y eso es el diseño, no una omisión. Su disparador no es un
 * reloj sino un hecho que no controlamos: que aparezca algo que de verdad le
 * sirva a esa persona. Por eso el cron no la toca. Es un permiso guardado que se
 * CONSULTA cuando hay noticia, no un envío agendado — automatizarla la convertiría
 * en la cadena de la que la propia frase se declara enemiga.
 */
export async function guardarPuertaAbierta(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  datos: { fingerprintId: string; telefono: string; constructorId?: string | null },
): Promise<boolean> {
  try {
    const { error } = await supabase.from('wa_acuerdos').upsert({
      fingerprint_id: datos.fingerprintId,
      telefono:       datos.telefono,
      constructor_id: datos.constructorId ?? null,
      tipo:           'puerta_abierta',
      que:            'avisarle si aparece algo que de verdad le sirva',
      cuando:         null,
      estado:         'pendiente',
    }, { onConflict: 'fingerprint_id,tipo', ignoreDuplicates: true });

    if (error) {
      console.error('⚠️ [WA Acuerdos] No se pudo guardar la puerta abierta:', error);
      return false;
    }
    console.log(`🚪 [WA Acuerdos] Puerta abierta guardada: ${datos.fingerprintId}`);
    return true;
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] Falló la puerta abierta:', err);
    return false;
  }
}

/**
 * Las puertas abiertas de un socio — la lista que se consulta cuando hay noticia.
 *
 * No la dispara nada automático: la mira una persona y decide si eso que apareció
 * de verdad le sirve a alguien de esta lista.
 */
export async function puertasAbiertas(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string,
): Promise<{ fingerprintId: string; telefono: string; desde: string }[]> {
  try {
    const { data } = await supabase
      .from('wa_acuerdos')
      .select('fingerprint_id, telefono, creado_at')
      .eq('tipo', 'puerta_abierta')
      .eq('estado', 'pendiente')
      .eq('constructor_id', constructorId)
      .order('creado_at', { ascending: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data || []) as any[]).map((p) => ({
      fingerprintId: p.fingerprint_id, telefono: p.telefono, desde: p.creado_at,
    }));
  } catch (err) {
    console.error('⚠️ [WA Acuerdos] No se pudieron leer las puertas:', err);
    return [];
  }
}
