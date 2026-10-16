'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Pone el título de la pestaña desde el navegador (16 oct 2026).
 *
 * Solo para la página 404. En Next.js 14.2 una página que llama a `notFound()`
 * llega del servidor con el cuerpo vacío y el navegador la dibuja; al hacerlo
 * vuelve a poner en la pestaña el título de la Home, aunque el HTML traía el de
 * la 404 (`metadata` de src/app/not-found.tsx). Pasa igual en /blog/{algo-que-no-existe}.
 */

import { useEffect } from 'react';

export default function TituloEnCliente({ titulo }: { titulo: string }) {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
  return null;
}
