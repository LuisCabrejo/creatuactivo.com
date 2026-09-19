/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * GET /api/cron/vigilar-motor — ¿la clave de Anthropic sigue viva?
 *
 * Corre cada 15 minutos (vercel.json). Sondea con un token de Haiku y, si el
 * estado cambia, manda un correo a sistema@creatuactivo.com. El porqué y la
 * lógica viven en `src/lib/vigilar-motor.ts`.
 *
 *   ?simular=facturacion|caida|ok   fuerza un estado (prueba el correo sin tocar la clave)
 *   ?sin_correo=1                   sondea y guarda, pero no envía
 *
 * Auth: `Authorization: Bearer ${CRON_SECRET}` (Vercel lo pone solo en los crons).
 */
import { NextRequest, NextResponse } from 'next/server';
import { vigilar, type EstadoMotor } from '@/lib/vigilar-motor';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const simular = request.nextUrl.searchParams.get('simular') as EstadoMotor | null;
  const sinCorreo = request.nextUrl.searchParams.get('sin_correo') === '1';

  const r = await vigilar({
    simular: simular && ['ok', 'facturacion', 'caida'].includes(simular) ? simular : undefined,
    enviar: !sinCorreo,
  });

  const linea = `[Vigilante motor] ${r.sondeo.estado} (antes: ${r.estadoPrevio ?? '—'}) · aviso: ${r.aviso}${r.correo ? ` · correo ${r.correo.ok ? 'enviado' : 'FALLÓ: ' + r.correo.error}` : ''} · ${r.sondeo.detalle}`;
  if (r.sondeo.estado === 'ok') console.log(linea); else console.error(linea);

  return NextResponse.json({ ok: true, ...r, timestamp: new Date().toISOString() });
}
