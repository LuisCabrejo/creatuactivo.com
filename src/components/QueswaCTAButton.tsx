'use client';

/**
 * CTA frictionless que abre Queswa (el chat de prospecto) en la misma página.
 * Reemplaza los CTAs de "Diagnóstico de 5 Días" en la Home (jun 2026): el camino
 * ya no es un funnel que presiona, sino una conversación que despierta interés →
 * 1-a-1. Usa el mismo evento custom que la servilleta / HomeManifestoVideo.
 */
export default function QueswaCTAButton({
  children,
  className = 'cta-base cta-primary',
  style,
  pregunta,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** La pregunta que el botón precarga en WhatsApp (1 oct 2026: el hero de la Home). */
  pregunta?: 'dinero';
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new CustomEvent('open-queswa', { detail: { pregunta } }))}
    >
      {children}
    </button>
  );
}
