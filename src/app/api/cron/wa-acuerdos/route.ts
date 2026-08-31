/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CRON — Queswa cumple los acuerdos que hizo.
 *
 * Revisa `wa_acuerdos` y, para cada compromiso vencido, le escribe a la persona
 * lo que le prometió escribirle. Nada más: no vende, no insiste, no retoma el
 * argumento. Cumple.
 *
 * ── POR QUÉ ESTE CRON Y NO OTRA COSA ──────────────────────────────────────────
 *
 * La escalera del aplazamiento termina en «¿qué día le escribo para retomarlo?».
 * Sin esto, esa pregunta es una promesa que el sistema no puede cumplir — y
 * prometer algo que no ocurre es peor que no prometer nada.
 *
 * ── LAS TRES REGLAS QUE LO GOBIERNAN ──────────────────────────────────────────
 *
 * • **Horas de silencio.** Nunca se escribe entre las 21:00 y las 07:00 de
 *   Bogotá, aunque el acuerdo caiga ahí. Un recordatorio de madrugada no es que
 *   no convierta: se gana un bloqueo, y el bloqueo no lo paga ese acuerdo sino la
 *   calificación del número entero, para todos los socios. El acuerdo se aplaza a
 *   la mañana siguiente en vez de perderse.
 *
 * • **Texto libre si se puede; plantilla solo si toca.** Si la persona escribió en
 *   las últimas 24 h, `sendText` entra y no cuesta nada. Si no, entra
 *   `recordatorio_acuerdo`, aprobada como UTILITY (auditada el 30 ago 2026).
 *   Si algún día se cae, el caso se reintenta en vez de perderse.
 *
 * • **Tres intentos y se suelta.** Insistirle a quien no responde es exactamente
 *   lo que Meta lee como spam. `cerrarAcuerdo` marca 'vencido' al tercero.
 *
 * ⚠️ Un acuerdo que falla NUNCA aborta el lote: cada uno se atiende en su propio
 * try. Un teléfono malo no puede dejar sin recordatorio a los otros cuarenta.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendText, sendTemplate } from '@/lib/wa-channel';
import { acuerdosVencidos, cerrarAcuerdo } from '@/lib/wa-acuerdos';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** Bogotá: UTC−5 todo el año, sin horario de verano. */
const OFFSET_BOGOTA_H = -5;
const SILENCIO_DESDE = 21;   // 9 p.m.
const SILENCIO_HASTA = 7;    // 7 a.m.

/**
 * `recordatorio_acuerdo` — APROBADA como **UTILITY** el 23 ago 2026, a la primera.
 *
 *   «Hola, {{1}}. Me pidió que le escribiera hoy para retomar {{2}}. Aquí estoy
 *    cuando quiera.»
 *
 * Es la única plantilla nuestra de cara al prospecto que Meta sostiene como
 * utilidad, y eso trae tres cosas: **llega a números de Estados Unidos**, no
 * consume el cupo de marketing del buzón, y cuesta una fracción.
 *
 * ⚠️ POR QUÉ ESTA SÍ Y EL ENLACE DE CANAL NO. **Meta clasifica por lo que la
 * plantilla ENTREGA, no por cómo está redactada.** El enlace de canal cayó cuatro
 * veces —con botón, sin botón, sin beneficio y hasta sin URL— porque entrega un
 * activo que la persona va a COMPARTIR. Esto entrega una nota para ella sola sobre
 * algo que ella pidió, que es literalmente el criterio de utilidad de Meta.
 *
 * ⛔ NO editarla para «mejorarla». Si el texto invita, explica o menciona paquetes,
 * Meta la mueve a MARKETING y se pierde el alcance a EE. UU. — y la categoría de
 * una plantilla aprobada no se puede revertir: tocaría un nombre nuevo.
 */
const PLANTILLA_RECORDATORIO: string | null = 'recordatorio_acuerdo';

function horaBogota(d: Date): number {
  return new Date(d.getTime() + OFFSET_BOGOTA_H * 3600_000).getUTCHours();
}

/** ¿Estamos en horas de silencio? */
function enSilencio(ahora: Date): boolean {
  const h = horaBogota(ahora);
  return h >= SILENCIO_DESDE || h < SILENCIO_HASTA;
}

/**
 * El texto del recordatorio. Cumple y calla.
 *
 * ⚠️ NO retoma el argumento, no ofrece nada y no menciona precios. Su único
 * trabajo es que ella responda — porque su respuesta es lo que reabre la ventana
 * de 24 h y ahí sí Queswa puede conversar libre. Una plantilla no abre ventana;
 * la abre la respuesta a la plantilla.
 */
function textoRecordatorio(que: string): string {
  return `Hola. Me pidió que le escribiera hoy para retomar ${que}. Aquí estoy cuando quiera.`;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const ahora = new Date();

  // Se consulta igual y se reporta, para poder ver en el log que el cron corrió y
  // cuántos quedaron esperando. Un cron silencioso no se distingue de uno caído.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const pendientes = await acuerdosVencidos(supabase);

  if (enSilencio(ahora)) {
    console.log(`🌙 [CRON acuerdos] Horas de silencio en Bogotá (${horaBogota(ahora)}:00). ${pendientes.length} en espera.`);
    return NextResponse.json({ ok: true, enSilencio: true, enEspera: pendientes.length });
  }

  console.log(`🤝 [CRON acuerdos] ${pendientes.length} acuerdo(s) vencido(s).`);

  let cumplidos = 0, aplazados = 0, sinCanal = 0;

  for (const a of pendientes) {
    try {
      // Dentro de la ventana el texto libre entra y no cuesta nada.
      const libre = await sendText(a.telefono, textoRecordatorio(a.que));
      if (libre.ok) {
        await cerrarAcuerdo(supabase, a.id, 'cumplido');
        cumplidos++;
        console.log(`✅ [CRON acuerdos] ${a.fingerprintId} — entregado en texto libre`);
        continue;
      }

      // Fuera de ventana: entra la plantilla de utilidad.
      if (!PLANTILLA_RECORDATORIO) {
        await cerrarAcuerdo(supabase, a.id, 'reintentar', a.intentos);
        sinCanal++;
        console.warn(`⏳ [CRON acuerdos] ${a.fingerprintId} fuera de ventana y SIN plantilla — intento ${a.intentos + 1}/3`);
        continue;
      }

      // {{1}} el nombre · {{2}} el tema, en las palabras de ella. Si no tenemos
      // nombre se usa un saludo neutro: Meta rechaza el envío si falta un
      // parámetro, y perder el recordatorio por eso sería absurdo.
      const conPlantilla = await sendTemplate(a.telefono, PLANTILLA_RECORDATORIO, 'es', [
        a.nombre?.split(/\s+/)[0] || 'buenas',
        a.que,
      ]);

      if (conPlantilla.ok) {
        await cerrarAcuerdo(supabase, a.id, 'cumplido');
        cumplidos++;
        console.log(`✅ [CRON acuerdos] ${a.fingerprintId} — entregado por plantilla`);
        continue;
      }

      await cerrarAcuerdo(supabase, a.id, 'reintentar', a.intentos);
      aplazados++;
      console.warn(`⏳ [CRON acuerdos] ${a.fingerprintId} — plantilla falló (${conPlantilla.error}), intento ${a.intentos + 1}/3`);
    } catch (err) {
      // Deliberadamente NO se aborta el lote: un teléfono malo no puede dejar sin
      // recordatorio a los otros cuarenta.
      console.error(`❌ [CRON acuerdos] Falló ${a.fingerprintId}:`, err);
      await cerrarAcuerdo(supabase, a.id, 'reintentar', a.intentos);
      aplazados++;
    }
  }

  return NextResponse.json({ ok: true, revisados: pendientes.length, cumplidos, aplazados, sinCanal });
}
