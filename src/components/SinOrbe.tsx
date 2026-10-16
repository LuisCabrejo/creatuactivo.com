'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Retira el orbe de Queswa mientras esta pieza esté montada (16 oct 2026).
 *
 * Hoy la usa solo la página 404: el orbe vive en el layout raíz y no sabe que la
 * página no existe, así que en el celular abría WhatsApp con «quiero saber cómo
 * funciona» —una frase que la persona no escribió— desde una página donde está
 * perdida. La salida útil ahí es la Home, que tiene el orbe y el video.
 */

import { useEffect } from 'react';
import { marcarOrbeRetirado } from '@/lib/orbe-config';

export default function SinOrbe() {
  useEffect(() => {
    marcarOrbeRetirado(true);
    return () => marcarOrbeRetirado(false);
  }, []);
  return null;
}
