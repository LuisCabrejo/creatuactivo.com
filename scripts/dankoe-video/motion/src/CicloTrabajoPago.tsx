import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; title: string; sub: string; nodes: string[] };

// Diagnóstico empleados — "atrapado en el ciclo de trabajar, pagar cuentas y repetir".
// Bucle circular con un token de energía que gira sin avanzar (rueda de hámster).
// El villano (el sistema/ciclo) se NARRA, no se etiqueta.
export const CicloTrabajoPago: React.FC<Props> = ({ eyebrow, title, sub, nodes }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const cx = W / 2;
  const cy = H * 0.38;
  const Rc = Math.min(W, H) * 0.20;
  const n = nodes.length;

  const spotOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ringDraw = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  // token girando en sentido horario, sin avanzar nunca
  const tokenA = -90 + (frame / fps) * 150; // grados/seg
  const tokenRad = (tokenA * Math.PI) / 180;
  const tx = cx + Rc * Math.cos(tokenRad);
  const ty = cy + Rc * Math.sin(tokenRad);

  const nodeAng = (i: number) => -90 + (360 * i) / n; // grados
  const nodePos = (i: number) => {
    const r = (nodeAng(i) * Math.PI) / 180;
    return { x: cx + Rc * Math.cos(r), y: cy + Rc * Math.sin(r) };
  };
  // diferencia angular mínima token↔nodo (para el pulso)
  const angDiff = (i: number) => {
    let d = Math.abs(((tokenA - nodeAng(i)) % 360 + 540) % 360 - 180);
    return 180 - d; // 180 = encima
  };

  const ebOp = interpolate(frame, [44, 58], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [50, 64], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [50, 64], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [62, 76], [0, 1], { extrapolateRight: "clamp" });

  // flechas de dirección sobre el círculo (entre nodos)
  const arrowAngs = [-30, 90, 210];

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: spotOp, background: `radial-gradient(ellipse 55% 42% at 50% 38%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <svg width={W} height={H}>
        {/* pista del bucle */}
        <circle cx={cx} cy={cy} r={Rc} fill="none" stroke={BRAND.titaniumDark} strokeWidth={2}
          strokeDasharray={2 * Math.PI * Rc} strokeDashoffset={(1 - ringDraw) * 2 * Math.PI * Rc} opacity={0.8}
          transform={`rotate(-90 ${cx} ${cy})`} />

        {/* flechas de dirección (horario) */}
        {ringDraw > 0.9 && arrowAngs.map((a, i) => {
          const r = (a * Math.PI) / 180;
          const px = cx + Rc * Math.cos(r), py = cy + Rc * Math.sin(r);
          return (
            <g key={`ar${i}`} transform={`translate(${px} ${py}) rotate(${a + 90})`}>
              <path d="M -7 -5 L 7 0 L -7 5 Z" fill={BRAND.titaniumMuted} opacity={0.8} />
            </g>
          );
        })}

        {/* token de energía girando */}
        {ringDraw > 0.6 && (
          <>
            <circle cx={tx} cy={ty} r={16} fill={BRAND.gold} opacity={0.22} />
            <circle cx={tx} cy={ty} r={7} fill={BRAND.goldHover} />
          </>
        )}

        {/* nodos del ciclo */}
        {nodes.map((label, i) => {
          const p = nodePos(i);
          const near = Math.max(0, angDiff(i) - 150) / 30; // 0..1 cuando el token pasa
          const lit = near > 0.05;
          return (
            <g key={`n${i}`}>
              {lit && <circle cx={p.x} cy={p.y} r={46 + near * 16} fill="none" stroke={BRAND.gold} strokeWidth={2} opacity={near * 0.6} />}
              <circle cx={p.x} cy={p.y} r={42} fill={BRAND.carbonElevated} stroke={lit ? BRAND.gold : BRAND.titaniumDark} strokeWidth={lit ? 3 : 2} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontFamily={FONTS.mono} fontSize={15} fontWeight={600}
                fill={lit ? BRAND.gold : BRAND.titaniumMuted}
                style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                {label.split(" ").map((w, k) => (
                  <tspan key={k} x={p.x} dy={k === 0 ? 0 : 16}>{w}</tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.16 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 100, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
        <div style={{ width: 200, height: 3, backgroundColor: BRAND.gold, margin: "22px 0", borderRadius: 2, opacity: subOp }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
