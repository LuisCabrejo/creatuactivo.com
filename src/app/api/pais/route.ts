/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GET /api/pais → { pais: 'CO' | 'US' | … | null }
 *
 * El país de la conexión, para las páginas que se pintan en el navegador y no
 * ven el encabezado de Vercel. Hoy lo usa la presentación (/servilleta) para
 * arrancar en dólares fuera de Colombia (Director, 11 oct 2026: «para quien está
 * afuera es mejor dólar»). Sin dato devuelve null y la página se queda en pesos,
 * la misma regla del motor: sin país, pesos.
 */
export const runtime = 'edge';

export async function GET(request: Request) {
  const pais = request.headers.get('x-vercel-ip-country')?.toUpperCase() || null;
  return Response.json({ pais }, { headers: { 'Cache-Control': 'private, no-store' } });
}
