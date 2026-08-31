/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * /s/{codigo} — EL ENLACE CORTO DE LA PAREJA.
 *
 * Nació el 31 ago 2026 de un accidente aprovechado: el modelo inventó
 * «creatuactivo.com/s/573206805737» en una respuesta (la ruta no existía) y el
 * Director lo adoptó — es más presentable que un wa.me largo y el dominio dice
 * de dónde viene. Esta ruta lo vuelve real: {codigo} es el teléfono de quien lo
 * comparte, y el clic redirige al wa.me de Queswa con el texto pre-llenado que
 * el webhook ya sabe leer (slug del socio + «soy la pareja de {nombre}»).
 *
 * El nombre y el socio se leen de la base EN EL MOMENTO DEL CLIC, no al generar
 * el enlace: si el prospecto dio su nombre después de compartirlo, el enlace
 * mejora solo. Ante cualquier fallo se redirige igual, con el texto genérico —
 * un enlace compartido que da error es una conversación de pareja que no ocurre.
 */

import { NextRequest, NextResponse } from 'next/server';
import { enlaceParaPareja } from '@/lib/wa-pareja';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { codigo: string } },
) {
  const codigo = (params.codigo || '').replace(/\D/g, '');
  let slug: string | null = null;
  let nombre: string | undefined;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (codigo.length >= 6 && SUPABASE_URL && SERVICE_KEY) {
    const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` };
    const fp = `wa_${codigo}`;
    try {
      const [rProspect, rData] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/prospects?fingerprint_id=eq.${fp}&select=constructor_id&limit=1`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/prospect_data?fingerprint_id=eq.${fp}&select=name&limit=1`, { headers }),
      ]);
      const constructorId = rProspect.ok ? (await rProspect.json())?.[0]?.constructor_id : null;
      nombre = rData.ok ? (await rData.json())?.[0]?.name ?? undefined : undefined;
      if (constructorId) {
        const rSlug = await fetch(
          `${SUPABASE_URL}/rest/v1/constructor_slugs?constructor_id=eq.${encodeURIComponent(constructorId)}&select=slug&limit=1`,
          { headers },
        );
        slug = rSlug.ok ? (await rSlug.json())?.[0]?.slug ?? null : null;
      }
    } catch (err) {
      console.error('⚠️ [/s] No se pudo resolver el código — se redirige con el texto genérico:', err);
    }
  }

  return NextResponse.redirect(enlaceParaPareja(slug, nombre), 302);
}
