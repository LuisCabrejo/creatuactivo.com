/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * GET /api/cron/revisar-turnos — la cola de turnos que le fallaron a alguien.
 *
 * Corre una vez al día (vercel.json). Pasa los detectores deterministas sobre
 * los turnos de personas de las últimas 24 h, marca los que fallan en su propia
 * `metadata`, y manda un correo **solo si hay algo nuevo**. El juez de Haiku es
 * opcional y corre después de entregar, así que no le cuesta latencia a nadie.
 *
 * La lógica y el porqué viven en `src/lib/revisar-turnos.ts`.
 *
 *   ?horas=48        cuánto hacia atrás mirar
 *   ?juez=1          enciende la capa 2 (Haiku, ~1,3 s por turno no marcado)
 *   ?tope=40         cuántos turnos como mucho ve el juez
 *   ?seco=1          revisa y reporta sin marcar ni enviar correo
 *
 * Auth: `Authorization: Bearer ${CRON_SECRET}` (Vercel lo pone solo en los crons).
 */
import { NextRequest, NextResponse } from 'next/server';
import { revisarTurnos, avisarRevision } from '@/lib/revisar-turnos';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const p = request.nextUrl.searchParams;
  const seco = p.get('seco') === '1';

  try {
    const resumen = await revisarTurnos({
      horas: Number(p.get('horas') ?? 24),
      conJuez: p.get('juez') === '1',
      topeJuez: Number(p.get('tope') ?? 40),
      soloLectura: seco,
    });
    const enviado = seco ? false : await avisarRevision(resumen);
    console.log(`🔍 [Revisión] ${resumen.revisados} turnos · ${resumen.marcados} marcados · ${resumen.nuevos.length} nuevos · juez: ${resumen.juzgados} · correo: ${enviado}`);
    return NextResponse.json({ ok: true, ...resumen, correo: enviado });
  } catch (error) {
    console.error('❌ [Revisión] Falló:', error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
