import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = {
  eyebrow: string;
  title: string;
  sub: string;
  labelA: string; // sube alto
  labelB: string; // se queda plano
};

// Diagnóstico empleados — "acumular años de servicio, pero poco patrimonio".
// Dos métricas que divergen: una sube alto (servicio), la otra se queda plana
// (patrimonio). La asimetría ES el mensaje.
export const MetricasDivergentes: React.FC<Props> = ({ eyebrow, title, sub, labelA, labelB }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const cx = W / 2;
  const baseY = H * 0.56;
  const maxH = H * 0.32;
  const bw = 150;
  const gap = 90;
  const xA = cx - gap / 2 - bw;
  const xB = cx + gap / 2;

  const spotOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  // crecimiento de las barras (mismo tiempo de "años pasando")
  const grow = interpolate(frame, [14, 78], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const hA = maxH * 0.92 * grow;   // años de servicio: sube alto
  const hB = maxH * 0.16 * grow;   // patrimonio: se queda plano

  const ebOp = interpolate(frame, [44, 58], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [60, 74], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [60, 74], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [78, 92], [0, 1], { extrapolateRight: "clamp" });

  const Bar = (x: number, h: number, color: string, label: string, measured: number) => (
    <g>
      {/* riel de fondo */}
      <rect x={x} y={baseY - maxH} width={bw} height={maxH} fill="none" stroke={BRAND.titaniumDark} strokeWidth={1.5} opacity={0.4} rx={6} />
      {/* barra */}
      <rect x={x} y={baseY - h} width={bw} height={h} fill={color} rx={6} />
      {/* etiqueta */}
      <text x={x + bw / 2} y={baseY + 42} textAnchor="middle" fontFamily={FONTS.mono} fontSize={22} fill={BRAND.smoke}
        style={{ letterSpacing: 1 }}>
        {label.split(" ").map((w, k) => (
          <tspan key={k} x={x + bw / 2} dy={k === 0 ? 0 : 26}>{w}</tspan>
        ))}
      </text>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: spotOp, background: `radial-gradient(ellipse 60% 42% at 50% 40%, rgba(197,160,89,0.08), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <svg width={W} height={H}>
        {/* eje base */}
        <line x1={xA - 30} y1={baseY} x2={xB + bw + 30} y2={baseY} stroke={BRAND.titaniumDark} strokeWidth={2} />
        {Bar(xA, hA, BRAND.gold, labelA, 0)}
        {Bar(xB, hB, BRAND.alert, labelB, 0)}
        {/* flecha que enfatiza la brecha */}
        {grow > 0.85 && (
          <g opacity={interpolate(frame, [72, 86], [0, 1], { extrapolateRight: "clamp" })}>
            <line x1={xA + bw / 2} y1={baseY - hA - 24} x2={xB + bw / 2} y2={baseY - hB - 24} stroke={BRAND.titaniumMuted} strokeWidth={1.5} strokeDasharray="4 6" />
          </g>
        )}
      </svg>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.15 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 92, lineHeight: 1.04, letterSpacing: 1, textAlign: "center" }}>{title}</div>
        <div style={{ width: 200, height: 3, backgroundColor: BRAND.gold, margin: "22px 0", borderRadius: 2, opacity: subOp }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
