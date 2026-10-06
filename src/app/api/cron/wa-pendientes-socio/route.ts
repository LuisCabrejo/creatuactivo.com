/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CRON — los pendientes del socio en modo Waze (6 oct 2026, Director).
 *
 * Vercel lo dispara los jueves a las 14:00 UTC (09:00 Bogotá): a quien le falte
 * algo en sus Ajustes de Cuenta (destino, contraseña de Gano, foto,
 * notificaciones), Queswa le dice qué le falta para marcarle la ruta completa.
 * Jueves para no cruzarse con el mensaje de los lunes. Uno por socio y semana.
 * La lógica vive en `src/lib/wa-pendientes-socio.ts`, compartida con
 * `scripts/enviar-pendientes-socio.mts`.
 *
 *   GET /api/cron/wa-pendientes-socio            → envía (fuera de horas de silencio)
 *   GET /api/cron/wa-pendientes-socio?dry=1      → dice a quién le tocaría, sin enviar
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { enviarPendientes, decidirPendientes } from '@/lib/wa-pendientes-socio';
import { enSilencioBogota } from '@/lib/wa-lunes-socio';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const ahora = new Date();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  if (request.nextUrl.searchParams.get('dry') === '1') {
    const d = await decidirPendientes(supabase, ahora);
    return NextResponse.json({ ok: true, dry: true, decisiones: d.map(x => ({ socio: x.d.nombre, accion: x.accion, motivo: x.motivo })) });
  }
  if (enSilencioBogota(ahora)) return NextResponse.json({ ok: true, enSilencio: true });
  const { decisiones, resultados } = await enviarPendientes(supabase, ahora);
  console.log(`🧭 [CRON pendientes] ${decisiones.length} socios · ${resultados.filter(r => r.ok).length} enviados`);
  return NextResponse.json({ ok: true, socios: decisiones.length, enviados: resultados.filter(r => r.ok).length, fallidos: resultados.filter(r => !r.ok) });
}
