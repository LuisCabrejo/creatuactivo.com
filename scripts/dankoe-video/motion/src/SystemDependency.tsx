import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { topLabel: string; baseA: string; baseB: string; threadNote: string };

// #6 — Diagrama de dependencia (clímax del diagnóstico): "INGRESO" + "ESTILO DE VIDA"
// cuelgan de UN SOLO hilo que sube a "DECISIÓN DE UN TERCERO" (un interruptor).
// Estética blueprint/matemática. El sistema se dibuja; al final resalta el único punto de dependencia.
export const SystemDependency: React.FC<Props> = ({ topLabel, baseA, baseB, threadNote }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const cx = W / 2;
  const topY = H * 0.22;
  const knotY = H * 0.52;
  const baseY = H * 0.70;

  // fases (compos de 7.5s = 225f @30fps; el corte aterriza al final, sobre "tercero")
  const basesIn = interpolate(frame, [6, 22], [0, 1], { extrapolateRight: "clamp" });
  const knotIn = interpolate(frame, [22, 32], [0, 1], { extrapolateRight: "clamp" });
  const threadDraw = interpolate(frame, [32, 58], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const topIn = interpolate(frame, [58, 72], [0, 1], { extrapolateRight: "clamp" });
  const highlight = interpolate(frame, [74, 92], [0, 1], { extrapolateRight: "clamp" });
  const switchFlip = interpolate(frame, [196, 206], [0, 1], { extrapolateRight: "clamp" });

  // hilo único: del nudo (knotY) hacia arriba al borde inferior del nodo
  const nodeBottom = topY + 92;
  const threadY = knotY - (knotY - nodeBottom) * threadDraw;
  const off = switchFlip > 0.5;
  const threadColor = off ? BRAND.alert : highlight > 0 ? BRAND.gold : BRAND.titanium;
  const threadW = 2 + highlight * 2 + (off ? 1 : 0);
  // pulso de energia recorriendo el hilo (la "línea de vida")
  const pulseT = ((frame - 40) % Math.round(0.9 * fps)) / (0.9 * fps);
  const pulseY = threadDraw > 0.9 && pulseT >= 0 ? knotY - (knotY - nodeBottom) * pulseT : -100;
  const flipFlash = interpolate(frame, [196, 201, 214], [0, 0.18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const grid = 0.06 + 0.02 * Math.sin(frame / 20);

  const Pill: React.FC<{ x: number; label: string; op: number }> = ({ x, label, op }) => (
    <g opacity={op}>
      <rect x={x - 150} y={baseY - 38} width={300} height={76} rx={10}
        fill={BRAND.carbonElevated} stroke={BRAND.titaniumDark} strokeWidth={2} />
      <text x={x} y={baseY + 11} fill={BRAND.white} fontFamily={FONTS.sans} fontWeight={600}
        fontSize={34} textAnchor="middle">{label}</text>
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      {/* grid blueprint tenue */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: grid,
        }}
      />
      <svg width={W} height={H}>
        {/* dos bases que convergen a un nudo */}
        <Pill x={cx - 170} label={baseA} op={basesIn} />
        <Pill x={cx + 170} label={baseB} op={basesIn} />
        <line x1={cx - 170} y1={baseY - 38} x2={cx} y2={knotY} stroke={BRAND.titaniumDark} strokeWidth={2} opacity={knotIn} />
        <line x1={cx + 170} y1={baseY - 38} x2={cx} y2={knotY} stroke={BRAND.titaniumDark} strokeWidth={2} opacity={knotIn} />
        <circle cx={cx} cy={knotY} r={8} fill={BRAND.titanium} opacity={knotIn} />

        {/* EL hilo único (punto de dependencia) */}
        <line x1={cx} y1={knotY} x2={cx} y2={threadY} stroke={threadColor} strokeWidth={threadW} />
        {pulseY > 0 && !off && (
          <circle cx={cx} cy={pulseY} r={5} fill={BRAND.goldHover} opacity={0.9} />
        )}
        {highlight > 0 && (
          <text x={cx + 24} y={(knotY + nodeBottom) / 2} fill={off ? BRAND.alert : BRAND.gold} fontFamily={FONTS.mono}
            fontSize={26} opacity={highlight} letterSpacing={2}>{threadNote}</text>
        )}

        {/* nodo superior: DECISIÓN DE / UN TERCERO + interruptor en su propia línea */}
        <g opacity={topIn}>
          <rect x={cx - 230} y={topY - 58} width={460} height={150} rx={12}
            fill={BRAND.obsidian} stroke={off ? BRAND.alert : highlight > 0 ? BRAND.gold : BRAND.titanium} strokeWidth={2.5} />
          <text x={cx} y={topY - 24} fill={BRAND.smoke} fontFamily={FONTS.mono} fontSize={22}
            letterSpacing={3} textAnchor="middle">DECISIÓN DE</text>
          <text x={cx} y={topY + 18} fill={BRAND.white} fontFamily={FONTS.sans} fontWeight={900}
            fontSize={40} textAnchor="middle">{topLabel}</text>
          {/* interruptor centrado, separado del título */}
          <g transform={`translate(${cx} ${topY + 64})`}>
            <rect x={-38} y={-19} width={76} height={38} rx={19}
              fill={off ? BRAND.alert : BRAND.titaniumDark} />
            <circle cx={off ? 17 : -17} cy={0} r={14} fill={BRAND.white} />
          </g>
        </g>
      </svg>

      {/* flash rojo cuando el interruptor corta */}
      <AbsoluteFill
        style={{
          opacity: flipFlash,
          background: `radial-gradient(ellipse 80% 60% at 50% 22%, rgba(244,63,94,0.9), transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
