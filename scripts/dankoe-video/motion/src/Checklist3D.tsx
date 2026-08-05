import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Html, RoundedBox } from "@react-three/drei";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { eyebrow: string; title: string; sub: string; steps: string[] };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

function Glow({ position, scale }: { position: THREE.Vector3; scale: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.9)"); g.addColorStop(0.4, "rgba(213,160,89,0.35)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}><spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent /></sprite>;
}

function Cards({ frame, fps, steps }: { frame: number; fps: number; steps: string[] }) {
  const n = steps.length;
  const cardY = (i: number) => 1.05 - i * 1.05;
  const validAt = (i: number) => 22 + i * 24; // se valida en cascada

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 2.5]} intensity={2} distance={8} color={GOLD} />

      {/* línea conectora a la izquierda */}
      <mesh position={[-1.5, 0, -0.05]}>
        <boxGeometry args={[0.02, interpolate(frame, [10, 60], [0, 2.1], { extrapolateRight: "clamp" }), 0.02]} />
        <meshStandardMaterial color={GOLD} emissive={"#3a2f15"} emissiveIntensity={0.6} />
      </mesh>

      {steps.map((label, i) => {
        const va = validAt(i);
        const lit = frame >= va;
        const pop = lit ? interpolate(frame, [va, va + 7], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }) : 0;
        const ring = lit ? interpolate(frame, [va, va + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        const appear = interpolate(frame, [va - 12, va - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = cardY(i);
        return (
          <group key={i} position={[0, y, 0]}>
            {/* tarjeta */}
            <RoundedBox args={[2.7, 0.78, 0.12]} radius={0.08} smoothness={4}>
              <meshStandardMaterial color={lit ? "#1d2129" : "#15181e"} metalness={0.5} roughness={0.5} emissive={lit ? "#2a2412" : "#000"} emissiveIntensity={lit ? 0.5 : 0} />
            </RoundedBox>
            {/* borde dorado al validar (marco apenas más grande detrás) */}
            {lit && (
              <RoundedBox args={[2.78, 0.86, 0.1]} radius={0.09} smoothness={4} position={[0, 0, -0.02]}>
                <meshBasicMaterial color={GOLD} transparent opacity={0.5 * pop} />
              </RoundedBox>
            )}
            {/* nodo número a la izquierda (sobre la línea) */}
            <mesh position={[-1.5, 0, 0.08]}>
              <sphereGeometry args={[0.1, 20, 20]} />
              <meshStandardMaterial color={lit ? GOLD_HOT : "#8a93a3"} emissive={lit ? GOLD_HOT : "#1a1d24"} emissiveIntensity={lit ? 1.4 : 0.2} />
            </mesh>

            {/* etiqueta del paso */}
            <Html position={[-0.55, 0, 0.1]} center transform={false} zIndexRange={[100, 0]}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, letterSpacing: 1, color: lit ? "#fff" : "#7c8696", whiteSpace: "nowrap", opacity: Math.max(appear, lit ? 1 : appear), textTransform: "uppercase" }}>{label}</div>
            </Html>

            {/* ✓ que se estampa al validar (comprobado) */}
            {lit && (
              <>
                <Glow position={new THREE.Vector3(1.05, 0, 0.1)} scale={0.7 * pop} />
                <Html position={[1.05, 0, 0.12]} center transform={false} zIndexRange={[100, 0]}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 44, fontWeight: 900, color: GOLD_HOT, transform: `scale(${pop})`, lineHeight: 1 }}>✓</div>
                </Html>
              </>
            )}
            {/* pulso al estampar */}
            {ring > 0 && ring < 1 && (
              <mesh position={[1.05, 0, 0.14]}>
                <ringGeometry args={[0.22 + ring * 0.3, 0.24 + ring * 0.3, 32]} />
                <meshBasicMaterial color={GOLD_HOT} transparent opacity={(1 - ring) * 0.8} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export const Checklist3D: React.FC<Props> = ({ eyebrow, title, sub, steps }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [88, 102], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [88, 102], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [104, 118], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [108, 126], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 40% at 50% 38%, rgba(197,160,89,0.08), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-9%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 5.6], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Cards frame={frame} fps={fps} steps={steps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || title || sub) && (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.14 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "24px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
