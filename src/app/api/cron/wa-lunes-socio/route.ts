/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CRON — el mensaje de los lunes de Queswa a cada distribuidor.
 *
 * Vercel lo dispara los lunes a las 13:00 UTC (08:00 Bogotá). La lógica —quién,
 * por qué vía, con qué texto, cada cuánto— vive en `src/lib/wa-lunes-socio.ts`,
 * que comparte con `scripts/enviar-lunes-socio.mts` para poder correrlo a mano.
 *
 *   GET /api/cron/wa-lunes-socio            → envía (solo lunes, fuera de silencio)
 *   GET /api/cron/wa-lunes-socio?dry=1      → dice a quién le tocaría, sin enviar
 *   GET /api/cron/wa-lunes-socio?forzar=1   → envía aunque no sea lunes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { decidir, enviarLunes, enSilencioBogota, esLunesBogota } from '@/lib/wa-lunes-socio';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const ahora = new Date();
  const dry = request.nextUrl.searchParams.get('dry') === '1';
  const forzar = request.nextUrl.searchParams.get('forzar') === '1';
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  if (dry) {
    const decisiones = await decidir(supabase, ahora);
    return NextResponse.json({ ok: true, dry: true, decisiones: decisiones.map(x => ({ socio: x.d.nombre, accion: x.accion, motivo: x.motivo })) });
  }
  if (!forzar && !esLunesBogota(ahora)) {
    return NextResponse.json({ ok: true, omitido: 'no es lunes en Bogotá' });
  }
  if (enSilencioBogota(ahora)) {
    console.log('🌙 [CRON lunes socio] Horas de silencio en Bogotá. No se envía.');
    return NextResponse.json({ ok: true, enSilencio: true });
  }

  const { decisiones, resultados } = await enviarLunes(supabase, ahora);
  const enviados = resultados.filter(r => r.ok).length;
  console.log(`📅 [CRON lunes socio] ${decisiones.length} socios · ${resultados.length} intentos · ${enviados} entregados`);
  return NextResponse.json({
    ok: true,
    socios: decisiones.length,
    enviados,
    fallidos: resultados.filter(r => !r.ok).map(r => ({ socio: r.nombre, error: r.error })),
    omitidos: decisiones.filter(x => x.accion === 'omitir').map(x => ({ socio: x.d.nombre, motivo: x.motivo })),
  });
}
