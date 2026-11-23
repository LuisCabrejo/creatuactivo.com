'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El botón de imprimir del hablador (/hablador/{slug}): abre la ventana de
 * impresión del navegador, donde también se guarda en PDF.
 */

export default function BotonImprimir() {
  return (
    <button type="button" className="cta-primary" onClick={() => window.print()}>
      Imprimir o guardar en PDF
    </button>
  );
}
