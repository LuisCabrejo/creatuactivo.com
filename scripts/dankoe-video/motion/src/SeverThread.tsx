import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { topLabel: string; bottomLabel: string };

// #2 — El hilo que se corta: "USTED" cuelga de "EMPRESA" por un solo hilo;
// el hilo se rompe y el nodo cae. El villano (la dependencia) se narra, no se etiqueta.
export const SeverThread: React.FC<Props> = ({ topLabel, bottomLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const cx = W / 2;
  const anchorY = H * 0.26;
  const restY = H * 0.52;
  const cut = 1.7 * fps;

  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const sway = frame < cut ? Math.sin(frame / 9) * 7 : 0;

  const tf = Math.max(0, frame - cut);
  const fall = 0.5 * tf * tf * 1.1; // gravedad
  const pendantY = frame < cut ? restY : restY + fall;
  const rot = frame < cut ? 0 : Math.min(35, tf * 1.4);
  const nodeOp =
    frame < cut
      ? 1
      : interpolate(tf, [0, 0.9 * fps, 1.5 * fps], [1, 1, 0], { extrapolateRight: "clamp" });

  const breakY = (anchorY + restY) / 2;
  const flash = interpolate(frame, [cut, cut + 7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lowerThreadTop = frame < cut ? anchorY : breakY + 18;

  const spotOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill
        style={{
          opacity: spotOp,
          background: `radial-gradient(ellipse 55% 45% at 50% 42%, rgba(148,163,184,0.10), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: inOp }}>
        <svg width={W} height={H}>
          {/* ancla superior (EMPRESA) */}
          <rect x={cx - 70} y={anchorY - 8} width={140} height={10} rx={3} fill={BRAND.titanium} />
          <text
            x={cx}
            y={anchorY - 28}
            fill={BRAND.titaniumMuted}
            fontFamily={FONTS.mono}
            fontSize={28}
            letterSpacing={6}
            textAnchor="middle"
          >
            {topLabel}
          </text>

          {/* hilo superior */}
          <line
            x1={cx}
            y1={anchorY}
            x2={frame < cut ? cx + sway : cx}
            y2={frame < cut ? pendantY - 60 : breakY - 18}
            stroke={BRAND.gold}
            strokeWidth={3}
          />

          {/* destello del corte */}
          {frame >= cut && (
            <circle cx={cx} cy={breakY} r={10 + flash * 30} fill={BRAND.goldHover} opacity={flash * 0.85} />
          )}

          {/* fragmentos del quiebre */}
          {frame >= cut &&
            [0, 1, 2, 3, 4, 5].map((i) => {
              const ang = (i / 6) * Math.PI * 2;
              const d = tf * 6;
              return (
                <circle
                  key={i}
                  cx={cx + Math.cos(ang) * d}
                  cy={breakY + Math.sin(ang) * d * 0.7 + tf * tf * 0.4}
                  r={3}
                  fill={BRAND.gold}
                  opacity={interpolate(tf, [0, 0.5 * fps], [0.9, 0], { extrapolateRight: "clamp" })}
                />
              );
            })}

          {/* segmento inferior + nodo USTED que cae */}
          <g
            transform={`translate(${cx + sway} ${pendantY}) rotate(${rot})`}
            opacity={nodeOp}
          >
            <line x1={0} y1={-78} x2={0} y2={-12} stroke={BRAND.gold} strokeWidth={3} />
            <circle cx={0} cy={50} r={80} fill={BRAND.carbonElevated} stroke={BRAND.gold} strokeWidth={3} />
            <text
              x={0}
              y={62}
              fill={BRAND.gold}
              fontFamily={FONTS.sans}
              fontWeight={900}
              fontSize={36}
              letterSpacing={1}
              textAnchor="middle"
            >
              {bottomLabel}
            </text>
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
