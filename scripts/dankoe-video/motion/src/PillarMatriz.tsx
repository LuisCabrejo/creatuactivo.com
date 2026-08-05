import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; count: number; unit: string; sub: string };

// Pilar 1 — Respaldo Operativo: globo wireframe que rota con nodos pulsando
// (infraestructura global) + contador que sube al numero de paises.
const NODES = [
  { lon: 0.3, lat: 0.4 }, { lon: 1.1, lat: -0.2 }, { lon: 2.0, lat: 0.6 },
  { lon: 2.8, lat: 0.0 }, { lon: 3.6, lat: -0.5 }, { lon: 4.3, lat: 0.3 },
  { lon: 5.0, lat: -0.3 }, { lon: 5.7, lat: 0.5 }, { lon: 0.8, lat: -0.6 },
  { lon: 3.1, lat: 0.7 },
];

export const PillarMatriz: React.FC<Props> = ({ eyebrow, count, unit, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const cx = W / 2;
  const cy = H * 0.36;
  const R = Math.min(W, H) * 0.26;

  const inS = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const scale = interpolate(inS, [0, 1], [0.7, 1]);
  const rot = frame * 0.018;
  const spotOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const counter = Math.round(
    interpolate(frame, [20, 56], [0, count], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [40, 56], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [44, 64], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // longitudes (lineas verticales que dan el giro)
  const longs = [0, 1, 2, 3, 4].map((i) => {
    const ph = rot + (i / 5) * Math.PI;
    return R * Math.cos(ph); // rx proyectado
  });
  const lats = [-0.6, -0.3, 0, 0.3, 0.6];

  // proyeccion de nodos en esfera
  const proj = NODES.map((n) => {
    const lon = n.lon + rot;
    const x = cx + R * Math.cos(n.lat) * Math.sin(lon);
    const y = cy - R * Math.sin(n.lat);
    const z = Math.cos(n.lat) * Math.cos(lon);
    return { x, y, z };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill
        style={{
          opacity: spotOp,
          background: `radial-gradient(ellipse 55% 40% at 50% 36%, rgba(197,160,89,0.12), transparent 70%)`,
        }}
      />
      <svg width={W} height={H}>
        <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`} opacity={spotOp}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={BRAND.titaniumDark} strokeWidth={1.5} />
          {longs.map((rx, i) => (
            <ellipse key={`lo${i}`} cx={cx} cy={cy} rx={Math.abs(rx)} ry={R}
              fill="none" stroke={BRAND.titaniumDark} strokeWidth={1.2} opacity={0.7} />
          ))}
          {lats.map((la, i) => (
            <ellipse key={`la${i}`} cx={cx} cy={cy - R * Math.sin(la)} rx={R * Math.cos(la)} ry={R * 0.12}
              fill="none" stroke={BRAND.titaniumDark} strokeWidth={1.2} opacity={0.5} />
          ))}
          {proj.map((p, i) => {
            const front = p.z > 0;
            const pulse = 0.5 + 0.5 * Math.sin(frame / 7 + i);
            return (
              <circle key={`n${i}`} cx={p.x} cy={p.y} r={front ? 4 + pulse * 3 : 2.5}
                fill={BRAND.gold} opacity={front ? 0.6 + pulse * 0.4 : 0.18} />
            );
          })}
        </g>
      </svg>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.18 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>
          {eyebrow}
        </div>
        <div style={{ color: BRAND.white, fontWeight: 900, fontSize: 150, lineHeight: 1, display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ color: BRAND.gold }}>{counter}</span>
          <span style={{ fontSize: 64 }}>{unit}</span>
        </div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "24px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>
          {sub}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
