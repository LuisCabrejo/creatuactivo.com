/**
 * Transición de entrada de ruta.
 *
 * template.tsx (a diferencia de layout.tsx) se REMONTA en cada navegación,
 * que es justo lo que se necesita para que la animación vuelva a dispararse.
 * 220ms: suficiente para que el cambio se lea como transición, no como salto;
 * corto para que nadie lo perciba como espera.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>
}
