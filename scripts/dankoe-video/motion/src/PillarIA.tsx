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

type Props = { eyebrow: string; title: string; sub: string };

// Anillo pulsante que se expande y desvanece en bucle
const Ring: React.FC<{ delay: number; color: string; cx: number; cy: number }> = ({
  delay,
  color,
  cx,
  cy,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const period = 1.8 * fps;
  const t = ((frame - delay) % period) / period;
  const tp = t < 0 ? 0 : t;
  const r = interpolate(tp, [0, 1], [60, 360], { easing: Easing.out(Easing.cubic) });
  const op = interpolate(tp, [0, 0.15, 1], [0, 0.5, 0]);
  return (
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} opacity={op} />
  );
};

const Equalizer: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const bars = 6;
  const bw = 14;
  const gap = 12;
  const totalW = bars * bw + (bars - 1) * gap;
  const startX = cx - totalW / 2;
  return (
    <g>
      {Array.from({ length: bars }).map((_, i) => {
        const h = 40 + 60 * (0.5 + 0.5 * Math.sin((frame / 6) + i * 0.7));
        return (
          <rect
            key={i}
            x={startX + i * (bw + gap)}
            y={cy - h / 2}
            width={bw}
            height={h}
            rx={4}
            fill={BRAND.gold}
            opacity={0.92}
          />
        );
      })}
    </g>
  );
};

export const PillarIA: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.4;

  const orbIn = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const orbScale = interpolate(orbIn, [0, 1], [0.6, 1]);
  const coreGlow = 0.5 + 0.25 * Math.sin(frame / 10);

  const ebOp = interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" });
  const ebY = interpolate(frame, [10, 22], [20, 0], { extrapolateRight: "clamp" });

  const titleWords = title.split("\n");

  const subOp = interpolate(frame, [44, 58], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [50, 68], [0, 240], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const spotOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      {/* spotlight dorado radial */}
      <AbsoluteFill
        style={{
          opacity: spotOp,
          background: `radial-gradient(ellipse 60% 40% at 50% 40%, rgba(197,160,89,0.14), transparent 70%)`,
        }}
      />
      {/* orbe SVG */}
      <AbsoluteFill>
        <svg width={width} height={height}>
          <defs>
            <radialGradient id="core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={BRAND.goldHover} stopOpacity={coreGlow} />
              <stop offset="55%" stopColor={BRAND.gold} stopOpacity={0.25} />
              <stop offset="100%" stopColor={BRAND.gold} stopOpacity={0} />
            </radialGradient>
          </defs>
          <g transform={`translate(${cx} ${cy}) scale(${orbScale}) translate(${-cx} ${-cy})`}>
            <Ring delay={0} color={BRAND.gold} cx={cx} cy={cy} />
            <Ring delay={18} color={BRAND.titanium} cx={cx} cy={cy} />
            <Ring delay={36} color={BRAND.gold} cx={cx} cy={cy} />
            <circle cx={cx} cy={cy} r={150} fill="url(#core)" />
            <Equalizer cx={cx} cy={cy} />
          </g>
        </svg>
      </AbsoluteFill>

      {/* bloque de texto */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: height * 0.18,
        }}
      >
        <div
          style={{
            opacity: ebOp,
            transform: `translateY(${ebY}px)`,
            color: BRAND.titanium,
            fontFamily: FONTS.mono,
            letterSpacing: 6,
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          {eyebrow}
        </div>
        {titleWords.map((w, i) => {
          const start = 26 + i * 8;
          const op = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateRight: "clamp",
          });
          const ty = interpolate(frame, [start, start + 12], [40, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateY(${ty}px)`,
                color: BRAND.white,
                fontWeight: 900,
                fontSize: 110,
                lineHeight: 1.02,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {w}
            </div>
          );
        })}
        <div
          style={{
            width: lineW,
            height: 3,
            backgroundColor: BRAND.gold,
            margin: "28px 0",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            opacity: subOp,
            color: BRAND.gold,
            fontFamily: FONTS.mono,
            fontSize: 30,
            letterSpacing: 2,
          }}
        >
          {sub}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
