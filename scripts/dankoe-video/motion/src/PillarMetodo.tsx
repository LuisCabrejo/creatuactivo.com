import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; title: string; sub: string; steps: number };

const hexPath = (cx: number, cy: number, r: number) => {
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 3;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
};

// Pilar 3 — Método Comprobado: pasos exactos que se trazan solos.
// Nodos hexagonales (geometria de marca) + cabeza de energia con estela +
// anillo de pulso al fijar cada paso + flujo continuo + grid tecnico.
export const PillarMetodo: React.FC<Props> = ({ eyebrow, title, sub, steps }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const n = steps;
  const HEX = 44;

  // camino ascendente, bajado de posicion
  const pts = Array.from({ length: n }).map((_, i) => ({
    x: W * (0.17 + (0.66 * i) / (n - 1)),
    y: H * (0.52 - 0.075 * i),
  }));

  const draw = interpolate(frame, [18, 90], [0, n - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const done = draw >= n - 1 - 0.001;

  const spotOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ebOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [62, 78], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [62, 78], [30, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [84, 98], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [88, 106], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  const seg = Math.min(n - 2, Math.floor(draw));
  const f = draw - seg;
  const head = { x: pts[seg].x + (pts[seg + 1].x - pts[seg].x) * f, y: pts[seg].y + (pts[seg + 1].y - pts[seg].y) * f };

  // frame de activacion de cada nodo (cuando draw cruza i)
  const actFrame = (i: number) => 18 + ((90 - 18) * i) / (n - 1);

  // longitud total del camino para el flujo de dashes
  const flowOffset = -((frame * 2.4) % 28);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: spotOp, background: `radial-gradient(ellipse 60% 42% at 50% 46%, rgba(197,160,89,0.10), transparent 70%)` }} />
      {/* grid blueprint tenue */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <svg width={W} height={H}>
        {/* guia completa (tenue) */}
        <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={BRAND.titaniumDark} strokeWidth={2} opacity={0.35} strokeDasharray="2 12" />

        {/* segmentos trazados (dorado) */}
        {pts.slice(0, -1).map((p, i) => {
          if (draw <= i) return null;
          const t = Math.min(1, draw - i);
          return <line key={i} x1={p.x} y1={p.y} x2={p.x + (pts[i + 1].x - p.x) * t} y2={p.y + (pts[i + 1].y - p.y) * t} stroke={BRAND.gold} strokeWidth={4} strokeLinecap="round" />;
        })}

        {/* flujo de energia continuo una vez trazado */}
        {done && (
          <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={BRAND.goldHover} strokeWidth={4} strokeLinecap="round" strokeDasharray="3 25" strokeDashoffset={flowOffset} opacity={0.9} />
        )}

        {/* anillos de pulso al activar cada nodo */}
        {pts.map((p, i) => {
          const af = actFrame(i);
          if (frame < af) return null;
          const rr = interpolate(frame, [af, af + 16], [HEX, HEX + 70], { extrapolateRight: "clamp" });
          const op = interpolate(frame, [af, af + 16], [0.6, 0], { extrapolateRight: "clamp" });
          return <polygon key={`r${i}`} points={hexPath(p.x, p.y, rr)} fill="none" stroke={BRAND.gold} strokeWidth={2} opacity={op} />;
        })}

        {/* nodos hexagonales */}
        {pts.map((p, i) => {
          const af = actFrame(i);
          const lit = frame >= af;
          const pop = lit ? interpolate(frame, [af, af + 8], [0.78, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0.78;
          const breath = lit && done ? 1 + 0.03 * Math.sin(frame / 8 + i) : 1;
          return (
            <g key={`h${i}`}>
              <polygon points={hexPath(p.x, p.y, HEX * pop * breath)} fill={lit ? BRAND.carbonElevated : BRAND.carbon} stroke={lit ? BRAND.gold : BRAND.titaniumDark} strokeWidth={lit ? 3 : 2} />
              <text x={p.x} y={p.y + 11} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={900} fontSize={32} fill={lit ? BRAND.gold : BRAND.titaniumMuted}>{i + 1}</text>
            </g>
          );
        })}

        {/* cabeza de energia que dibuja + glow */}
        {!done && (
          <>
            <circle cx={head.x} cy={head.y} r={14} fill={BRAND.gold} opacity={0.22} />
            <circle cx={head.x} cy={head.y} r={7} fill={BRAND.goldHover} />
          </>
        )}
      </svg>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.17 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "24px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
