import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
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

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

function Glow({ position, scale }: { position: THREE.Vector3; scale: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.95)"); g.addColorStop(0.3, "rgba(213,160,89,0.5)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent />
    </sprite>
  );
}

function Core({ frame, fps }: { frame: number; fps: number }) {
  const inS = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scaleIn = interpolate(inS, [0, 1], [0.5, 1]);
  const breath = 0.42 + 0.03 * Math.sin(frame / 5);

  // ecualizador HORIZONTAL (fila de barras audio-reactivas frente al orbe — asistente de voz IA)
  const N = 17;
  const span = 3.0;
  const appearBars = interpolate(frame, [12, 34], [0, 1], { extrapolateRight: "clamp" });

  // anillos de pulso (ondas de sonido emanando)
  const waves = [0, 1, 2].map((i) => {
    const period = 1.6 * fps;
    const t = (((frame - i * period / 3) % period) / period);
    return { r: interpolate(t, [0, 1], [0.6, 2.4]), op: interpolate(t, [0, 0.2, 1], [0, 0.4, 0]) };
  });

  return (
    <group scale={[scaleIn, scaleIn, scaleIn]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 1]} intensity={9} distance={6} color={GOLD_HOT} />

      {/* NÚCLEO: orbe dorado (Queswa) */}
      <Glow position={new THREE.Vector3(0, 0, 0)} scale={2.4} />
      <mesh renderOrder={10}>
        <sphereGeometry args={[breath, 40, 40]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.4} metalness={0.25} roughness={0.3} depthWrite={false} />
      </mesh>

      {/* ondas de sonido emanando (procesando 24/7) */}
      {waves.map((w, i) => (
        <mesh key={`w${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[w.r, 0.008, 8, 80]} />
          <meshBasicMaterial color={GOLD} transparent opacity={w.op * appearBars} />
        </mesh>
      ))}

      {/* ECUALIZADOR horizontal — fila de barras audio-reactivas frente al orbe */}
      {Array.from({ length: N }).map((_, i) => {
        const x = -span / 2 + (i / (N - 1)) * span;
        const env = 0.45 + 0.55 * Math.cos((i / (N - 1) - 0.5) * Math.PI * 1.7); // centro más alto (forma de onda)
        const h = Math.max(0.08, (0.12 + 0.62 * env * (0.5 + 0.5 * Math.sin(frame * 0.36 + i * 0.5)))) * appearBars;
        const lit = h > 0.42;
        return (
          <mesh key={`b${i}`} position={[x, 0, 0.55]}>
            <boxGeometry args={[0.07, h, 0.07]} />
            <meshStandardMaterial color={lit ? GOLD_HOT : GOLD} emissive={lit ? GOLD_HOT : GOLD} emissiveIntensity={lit ? 1.2 : 0.5} metalness={0.3} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

export const IAOnda3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleWords = title.split("\n");
  const subOp = interpolate(frame, [50, 64], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [54, 72], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 55% 40% at 50% 36%, rgba(197,160,89,0.12), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-12%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 5.8], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Core frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || title || sub) && (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.14 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
        {titleWords.map((w, i) => {
          const start = 30 + i * 8;
          const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const ty = interpolate(frame, [start, start + 12], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{w}</div>;
        })}
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "26px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
