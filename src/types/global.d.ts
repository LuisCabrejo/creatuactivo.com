/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

declare global {
  interface Window {
    FrameworkIAA?: {
      fingerprint?: string;
    };
    nexusProspect?: {
      id: string;
    };
  }
}

export {};
