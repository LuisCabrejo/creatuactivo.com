/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Onboarding del dueño de canal por WhatsApp — v1 (17 ago 2026)
 *
 * Objetivo: quien acaba de pagar recibe su enlace **en la misma conversación**,
 * sin instalar nada ni abrir la aplicación, y ve llegar en vivo la actividad de
 * sus primeros prospectos. Ese momento —ver a un conocido interesado— es el que
 * convierte: doce años de campo del Director muestran que quien lo vive arranca.
 *
 * ⚠️ POR QUÉ ESTO NO NECESITA PLANTILLAS DE META (y por qué eso tiene fecha de
 * vencimiento): Meta solo exige plantilla aprobada para escribirle a alguien
 * FUERA de la ventana de servicio de 24 h. El dueño nuevo acaba de conversar con
 * Queswa para radicarse, así que la ventana está abierta y el texto sale libre.
 * Cada mensaje que ÉL escribe la reabre otras 24 h; los nuestros no. Por eso
 * `dentroDeVentana()` se consulta SIEMPRE antes de enviar y, si está cerrada, no
 * se envía nada: no se encola, no se fuerza plantilla, no se insiste. Un envío
 * fuera de ventana es un error de política que se paga con la calidad del número.
 *
 * ⚠️ TOPE DELIBERADO: `MAX_NOTIF_WA` avisos por dueño. El sistema de engagement
 * puede disparar seis eventos por sesión de prospecto (25/50/75/100 %, apertura
 * de chat, revisita); mandarlos todos por WhatsApp entrena a la persona a
 * silenciar el número y, peor, a bloquearlo — y los bloqueos son exactamente lo
 * que Meta mide para bajar la calidad de la línea. Las primeras alcanzan para
 * producir el asombro; de ahí en adelante manda el push de queswa.app, que es
 * gratis e ilimitado. El contador vive en `constructor_slugs.wa_notif_count`.
 */

import { sendText } from '@/lib/wa-channel';

/**
 * Dos topes, y cada uno resuelve un problema distinto.
 *
 * `MAX_NOTIF_PROSPECTO` es el que importa: **se cuenta por persona, no por
 * evento**. Un mismo prospecto puede disparar cinco eventos en una sesión (abrir,
 * mitad, completo, escribir, volver); con un tope global se comía la cuota entero
 * y el segundo prospecto —que es justo la prueba de que la cosa funciona— no
 * generaba nada. Dos avisos por persona: que llegó, y que se enganchó.
 *
 * `MAX_NOTIF_WA` queda solo como freno de mano contra un caso desbocado. Es alto
 * a propósito: dentro de la ventana de 24 h los mensajes de servicio no cuestan
 * (Meta los liberó en nov 2024), así que aquí no se está ahorrando plata — se está
 * cuidando que el dueño no silencie el número, que es lo que de verdad mide Meta.
 */
export const MAX_NOTIF_PROSPECTO = 2;
export const MAX_NOTIF_WA = 30;

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatuactivo.com';

/** Solo dígitos, con indicativo de país. `3001234567` → `573001234567`. */
export function normalizarWhatsApp(numero: string): string {
  const d = (numero || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('57')) return d;
  if (d.length === 10) return `57${d}`;
  return d;
}

/**
 * Slug a partir del nombre: minúsculas, sin tildes, con guion.
 * "Diego Giraldo Restrepo" → "diego-giraldo". Dos palabras bastan y se leen
 * bien en la URL que la persona va a compartir por chat.
 */
export function slugDesdeNombre(nombre: string): string {
  return (nombre || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '')
    .trim().split(/\s+/).slice(0, 2).join('-')
    .replace(/-+/g, '-') || 'socio';
}

/**
 * El mensaje que recibe quien acaba de activarse. Tres decisiones:
 *
 * · **El enlace primero y solo.** Es lo que vino a buscar; todo lo demás compite.
 * · **Una sola instrucción.** "Compártalo con cinco personas" es una tarea que se
 *   hace hoy; "construya su canal" es un proyecto que se aplaza. La cifra es la
 *   del ejercicio del Director, que en su experiencia arranca al 100 %.
 * · **Se le dice qué va a pasar después.** Sin eso, el primer aviso de actividad
 *   llega sin contexto; con eso, la persona lo espera — y esperarlo es la mitad
 *   del efecto.
 */
export function mensajeDeBienvenida(nombreCorto: string, slug: string): string {
  return (
    `Listo, ${nombreCorto}. Su canal ya está abierto.\n\n` +
    `Este es su enlace:\n${SITIO}/${slug}\n\n` +
    `Compártalo con cinco personas hoy — por chat, como comparte cualquier cosa. ` +
    `Yo converso con cada una que lo abra, le explico y le resuelvo las dudas.\n\n` +
    `Y le voy contando por aquí lo que vaya pasando: cuando alguien lo abra, cuando vea el video, cuando me escriba.\n\n` +
    `¿Le comparto un texto corto para acompañar el enlace?`
  );
}

/** Cómo se nombra cada evento. Concreto: qué hizo la persona, no una métrica. */
const TEXTO_EVENTO: Record<string, string> = {
  abrio:      'abrió su enlace',
  completo:   'vio el video completo',
  escribio:   'me está escribiendo',
  volvio:     'volvió a entrar',
};

export type EventoDueño = keyof typeof TEXTO_EVENTO;

export function mensajeDeActividad(evento: EventoDueño, restantes: number): string {
  const que = TEXTO_EVENTO[evento] || 'tuvo actividad';
  const base = `👀 Alguien de su canal ${que}.`;

  // El aviso que agota el cupo explica adónde se mudan los siguientes. Sin esto
  // la persona cree que el sistema dejó de funcionar.
  if (restantes <= 0) {
    return (
      `${base}\n\n` +
      `De aquí en adelante le llegan al Centro de Mando, que avisa al instante y sin llenarle el chat. ` +
      `Ahí ve quién es cada persona y en qué va.`
    );
  }
  return base;
}

/**
 * ¿La ventana de servicio de 24 h sigue abierta para este número?
 *
 * Se mide por el último mensaje que **la persona** escribió: los nuestros no la
 * reabren. Ante cualquier error de consulta devuelve `false` — no enviar de más
 * cuesta un aviso; enviar fuera de ventana cuesta calidad de la línea.
 */
export async function dentroDeVentana(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  whatsapp: string,
): Promise<boolean> {
  const fingerprint = `wa_${normalizarWhatsApp(whatsapp)}`;
  try {
    const { data } = await supabase
      .from('nexus_conversations')
      .select('messages, created_at')
      .eq('fingerprint_id', fingerprint)
      .order('created_at', { ascending: false })
      .limit(1);

    const fila = (data || [])[0];
    if (!fila) return false;

    // Un turno se persiste con el mensaje del usuario adentro, así que la fecha
    // de la fila es una buena aproximación del último inbound.
    const horas = (Date.now() - new Date(fila.created_at).getTime()) / 36e5;
    return horas < 23.5; // margen de media hora contra relojes desfasados
  } catch (err) {
    console.error('⚠️ [WA Onboarding] No se pudo verificar la ventana:', err);
    return false;
  }
}

/**
 * Avisa al dueño de una actividad de sus prospectos.
 *
 * Nunca lanza y nunca bloquea: se llama desde el tracker de engagement, y ese
 * endpoint tiene que responder rápido al navegador del prospecto aunque el aviso
 * falle. Devuelve qué pasó, solo para el log.
 */
export async function notificarDueño(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  constructorId: string | null | undefined,
  evento: EventoDueño,
): Promise<'enviado' | 'tope' | 'fuera_de_ventana' | 'sin_dueño' | 'error'> {
  if (!constructorId) return 'sin_dueño';

  try {
    const { data: canal } = await supabase
      .from('constructor_slugs')
      .select('slug, whatsapp, wa_notif_count')
      .eq('constructor_id', constructorId)
      .maybeSingle();

    if (!canal?.whatsapp) return 'sin_dueño';

    const enviados = canal.wa_notif_count ?? 0;
    if (enviados >= MAX_NOTIF_WA) return 'tope';

    if (!(await dentroDeVentana(supabase, canal.whatsapp))) return 'fuera_de_ventana';

    const restantes = MAX_NOTIF_WA - enviados - 1;
    const r = await sendText(normalizarWhatsApp(canal.whatsapp), mensajeDeActividad(evento, restantes));
    if (!r.ok) {
      console.error(`⚠️ [WA Onboarding] Aviso rechazado por Meta: ${r.error}`);
      return 'error';
    }

    await supabase
      .from('constructor_slugs')
      .update({ wa_notif_count: enviados + 1 })
      .eq('constructor_id', constructorId);

    console.log(`🔔 [WA Onboarding] Aviso "${evento}" → ${canal.slug} (${enviados + 1}/${MAX_NOTIF_WA})`);
    return 'enviado';
  } catch (err) {
    console.error('⚠️ [WA Onboarding] Error notificando al dueño:', err);
    return 'error';
  }
}
