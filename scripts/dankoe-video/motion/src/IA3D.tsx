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

function Glow({ position, scale, color }: { position: THREE.Vector3; scale: number; color?: string }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, color || "rgba(230,180,90,0.95)");
    g.addColorStop(0.3, "rgba(213,160,89,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent />
    </sprite>
  );
}

function Core({ frame, fps }: { frame: number; fps: number }) {
  const t = frame / fps;
  const inS = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scaleIn = interpolate(inS, [0, 1], [0.5, 1]);
  const breath = 0.4 + 0.03 * Math.sin(frame / 5);

  // 3 anillos giroscópicos (la IA procesando)
  const rings: [number, [number, number, number]][] = [
    [1.25, [t * 0.5, 0, 0]],
    [1.45, [0, t * 0.6, Math.PI / 3]],
    [1.65, [t * 0.4, t * 0.35, -Math.PI / 4]],
  ];

  // partículas orbitando (interesados que busca / filtra / atiende)
  const particles = useMemo(() => {
    const arr: { r: number; tilt: THREE.Euler; speed: number; phase: number }[] = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        r: 1.15 + (i % 3) * 0.22,
        tilt: new THREE.Euler((i * 1.3) % Math.PI, (i * 0.7) % Math.PI, (i * 0.5) % Math.PI),
        speed: 0.5 + (i % 4) * 0.18,
        phase: (i / 10) * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const appearP = interpolate(frame, [18, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <group scale={[scaleIn, scaleIn, scaleIn]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 0]} intensity={9} distance={5} color={GOLD_HOT} />

      {/* NÚCLEO: orbe dorado que brilla (héroe) */}
      <Glow position={new THREE.Vector3(0, 0, 0)} scale={2.5} />
      <mesh renderOrder={10}>
        <sphereGeometry args={[breath, 40, 40]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.4} metalness={0.25} roughness={0.3} depthWrite={false} />
      </mesh>

      {/* anillos giroscópicos */}
      {rings.map(([r, rot], i) => (
        <mesh key={`r${i}`} rotation={rot as any}>
          <torusGeometry args={[r, 0.012, 16, 140]} />
          <meshStandardMaterial color={i === 1 ? GOLD : "#7c8696"} metalness={0.9} roughness={0.3} emissive={i === 1 ? "#3a2f15" : "#171b22"} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* partículas orbitando */}
      {particles.map((p, i) => {
        const ang = t * p.speed + p.phase;
        const v = new THREE.Vector3(Math.cos(ang) * p.r, Math.sin(ang) * p.r, 0).applyEuler(p.tilt);
        const sc = appearP * (0.7 + 0.3 * Math.sin(frame / 4 + i));
        return (
          <group key={`p${i}`}>
            <Glow position={v} scale={0.22 * sc} />
            <mesh position={v} renderOrder={6}>
              <sphereGeometry args={[0.03 * appearP, 12, 12]} />
              <meshBasicMaterial color={GOLD_HOT} depthTest={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export const IA3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
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
        <ThreeCanvas
          width={W}
          height={H}
          camera={{ fov: 42, position: [0, 0, 5.8], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Core frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.14 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
        {titleWords.map((w, i) => {
          const start = 30 + i * 8;
          const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const ty = interpolate(frame, [start, start + 12], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{w}</div>
          );
        })}
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "26px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
