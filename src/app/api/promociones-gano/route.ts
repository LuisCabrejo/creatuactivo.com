/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GET /api/promociones-gano → { vigentes: [80094] }
 *
 * Los códigos de las promociones registradas (src/lib/promociones-gano.ts) que
 * Gano tiene hoy en su catálogo. El catálogo de los clientes solo pinta la línea
 * «Promoción» con lo que salga de aquí: una que Gano ya quitó no se puede comprar.
 */
import { NextResponse } from 'next/server'
import { promocionesVigentesIds } from '@/lib/promociones-gano'

export const dynamic = 'force-dynamic'

export async function GET() {
  const vigentes = await promocionesVigentesIds()
  return NextResponse.json({ vigentes }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
}
