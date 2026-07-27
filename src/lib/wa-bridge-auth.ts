/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Auth del puente de canal WhatsApp (/api/wa/*).
 *
 * El Dashboard (queswa.app) consume estas rutas server-to-server para operar el
 * canal sin ver nunca el WHATSAPP_SYSTEM_TOKEN. Mismo patrón que el
 * x-webhook-secret de Supabase, con una diferencia deliberada: aquí, si el
 * secret NO está configurado, se DENIEGA. Un endpoint que envía WhatsApp en
 * nombre de la marca no puede quedar abierto por una env var olvidada.
 */

import { timingSafeEqual } from 'crypto';

const HEADER = 'x-wa-bridge-secret';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual exige longitudes iguales; distinta longitud ya es un no-match.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Devuelve null si la petición está autorizada, o una Response de error lista
 * para retornar desde el route handler.
 */
export function assertBridgeSecret(request: Request): Response | null {
  const expected = process.env.WA_BRIDGE_SECRET?.trim();

  if (!expected) {
    console.error('❌ [WA Bridge] WA_BRIDGE_SECRET no configurado — denegando por defecto');
    return Response.json(
      { error: 'Puente de canal no configurado' },
      { status: 503 },
    );
  }

  const received = request.headers.get(HEADER)?.trim();

  if (!received || !safeEqual(received, expected)) {
    // Diagnóstico sin filtrar el secret (mismo criterio que el webhook de prospects)
    console.warn(
      `🔐 [WA Bridge] secret no coincide → 401. recibido len=${received?.length ?? 0} | esperado len=${expected.length}`,
    );
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  return null;
}
