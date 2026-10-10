/**
 * Copyright © 2026 CreaTuActivo.com
 * Ruta: /servilleta/[constructorId]
 *
 * Enlaces viejos con el identificador del socio en la ruta. Desde la
 * consolidación (10 oct 2026) la presentación lee al socio del ?ref —y, si no
 * viene, del `constructor_ref` que tracking.js guarda—, así que aquí solo se
 * redirige conservando la pantalla, si el enlace la trae.
 */

import { redirect } from 'next/navigation'

export default function ServilletaConSocio({
  params,
  searchParams,
}: {
  params: { constructorId: string }
  searchParams?: { pantalla?: string }
}) {
  const pantalla = typeof searchParams?.pantalla === 'string' && /^\d{1,2}$/.test(searchParams.pantalla)
    ? `&pantalla=${searchParams.pantalla}` : ''
  redirect(`/servilleta?ref=${encodeURIComponent(params.constructorId)}${pantalla}`)
}
