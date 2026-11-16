/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CRON — el recordatorio por WhatsApp 45 minutos antes de una convocatoria en línea
 * de /vip (Director, 16 nov 2026). Vercel lo dispara cada 15 minutos; solo actúa
 * cuando a una convocatoria con plantillas (CONVOCATORIAS_WA) le faltan entre 35 y
 * 55 minutos para empezar. Para el taller del 16 nov: 7:15 a. m. Bogotá.
 *
 * A los inscritos: recordatorio_evento_v1 (o la confirmación, si aún no está
 * aprobada). A los distribuidores no inscritos: ultima_llamada_taller_v1, si está
 * aprobada. Lógica en src/lib/convocatoria-envios.ts; nadie lo recibe dos veces.
 *
 *   GET /api/cron/recordatorio-convocatoria          → envía si está en la ventana
 *   GET /api/cron/recordatorio-convocatoria?dry=1    → a quién le tocaría, sin enviar
 *
 * Auth: CRON_SECRET (Vercel manda `Authorization: Bearer`). El panel de la
 * convocatoria tiene además el botón para enviarlo a mano.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MESAS, enLinea, inicioDe } from '@/lib/mesas';
import { CONVOCATORIAS_WA } from '@/lib/wa-plantillas-convocatoria';
import { listTemplates } from '@/lib/wa-channel';
import { enviarRecordatorio, planRecordatorio } from '@/lib/convocatoria-envios';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MIN = 60 * 1000;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  const dry = request.nextUrl.searchParams.get('dry') === '1';
  const ahora = Date.now();
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
  });

  const resultados: Record<string, unknown>[] = [];
  for (const mesa of Object.values(MESAS)) {
    if (!enLinea(mesa) || !CONVOCATORIAS_WA[mesa.id]) continue;
    const faltan = (inicioDe(mesa, mesa.horarios[0]).getTime() - ahora) / MIN;
    const enVentana = faltan >= 35 && faltan <= 55;
    if (!enVentana && !dry) continue;

    const { templates } = await listTemplates();
    const plan = await planRecordatorio(db, mesa.id, mesa.anfitrion, templates);
    if (dry || !enVentana) {
      resultados.push({
        evento: mesa.id,
        faltanMinutos: Math.round(faltan),
        enVentana,
        recordatorioAprobado: plan.recordatorioAprobado,
        ultimaLlamadaAprobada: plan.ultimaLlamadaAprobada,
        inscritos: plan.inscritos.map((d) => d.nombre),
        noInscritos: plan.noInscritos.map((d) => d.nombre),
        aMano: plan.aMano.map((d) => d.nombre),
      });
      continue;
    }
    const r = await enviarRecordatorio(db, mesa.id, plan);
    console.log(`⏰ [CRON recordatorio] ${mesa.id}: ${r.inscritos} inscritos · ${r.noInscritos} no inscritos · ${r.fallos.length} fallos${r.respaldo ? ' · con la confirmación de respaldo' : ''}`);
    resultados.push({ evento: mesa.id, ...r });
  }
  return NextResponse.json({ ok: true, dry, resultados });
}
