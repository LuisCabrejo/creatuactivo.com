import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Html } from "@react-three/drei";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; title: string; sub: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

function Coin({ i, frame, fps }: { i: number; frame: number; fps: number }) {
  const N = 18;
  const period = 1.9 * fps;
  const t = (((frame - i * (period / N)) % period) + period) % period / period; // 0..1 loop
  const yTop = 2.7, yMouth = 0.15, yBot = -2.7;
  const side = i % 2 === 0 ? -1 : 1;
  const spread = 0.55 + 0.5 * ((i * 37) % 7) / 7;

  let x: number, y: number;
  if (t < 0.5) {
    // cae convergiendo a la boca del embudo
    const k = t / 0.5;
    y = interpolate(k, [0, 1], [yTop, yMouth], { easing: Easing.in(Easing.quad) });
    x = spread * side * (1 - k);
  } else {
    // sale por abajo y se DRENA hacia afuera (esquiva el frasco)
    const k = (t - 0.5) / 0.5;
    y = interpolate(k, [0, 1], [yMouth, yBot], { easing: Easing.in(Easing.quad) });
    x = side * interpolate(k, [0, 1], [0.05, 1.7], { easing: Easing.out(Easing.quad) });
  }
  const op = interpolate(t, [0, 0.05, 0.82, 1], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const spin = frame * 0.3 + i;

  return (
    <mesh position={[x, y, 0]} rotation={[Math.PI / 2.2, spin, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.035, 20]} />
      <meshStandardMaterial color={GOLD_HOT} emissive={GOLD} emissiveIntensity={0.5} metalness={0.8} roughness={0.3} transparent opacity={op} />
    </mesh>
  );
}

function Scene({ frame, fps }: { frame: number; fps: number }) {
  const inOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const coins = Array.from({ length: 18 }).map((_, i) => i);

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 4, 5]} intensity={1.3} color={"#dfe5ee"} />
      <pointLight position={[0, 0.5, 2]} intensity={3} distance={9} color={GOLD} />

      {/* EMBUDO (cilindro ancho arriba, angosto abajo) */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.05, 0.18, 1.05, 40, 1, true]} />
        <meshStandardMaterial color={"#3a3526"} emissive={GOLD} emissiveIntensity={0.12} metalness={0.7} roughness={0.45} side={THREE.DoubleSide} transparent opacity={0.55} />
      </mesh>
      {/* aro superior brillante del embudo */}
      <mesh position={[0, 1.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.03, 10, 60]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.1} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* MONEDAS en flujo */}
      {coins.map((i) => <Coin key={i} i={i} frame={frame} fps={fps} />)}

      {/* FRASCO "LO SUYO" — vacío (las monedas lo esquivan) */}
      <mesh position={[0, -2.0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.7, 32, 1, true]} />
        <meshStandardMaterial color={"#8a93a3"} metalness={0.3} roughness={0.2} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      {/* fondo del frasco con una pizca mínima (casi vacío) */}
      <mesh position={[0, -2.32, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 32]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.3} metalness={0.6} roughness={0.4} transparent opacity={0.5} />
      </mesh>

      {/* etiquetas */}
      <Html position={[0, 1.55, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 600, letterSpacing: 3, color: "#cbd3df", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>Lo que usted gana</div>
      </Html>
      <Html position={[-1.75, -1.35, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 800, letterSpacing: 1, color: "#9aa3b3", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>Cuentas</div>
      </Html>
      <Html position={[1.75, -1.35, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 800, letterSpacing: 1, color: "#9aa3b3", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>Casa</div>
      </Html>
      <Html position={[0, -2.78, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, fontWeight: 900, letterSpacing: 2, color: GOLD_HOT, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>Lo suyo · vacío</div>
      </Html>
    </group>
  );
}

export const RemesasFuga3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [86, 100], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [86, 100], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [104, 118], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [108, 126], [0, 260], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 56% 42% at 50% 36%, rgba(197,160,89,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-10%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 6.0], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.05 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 25, fontWeight: 600, marginBottom: 14 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "18px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 24, letterSpacing: 1, textAlign: "center" }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
