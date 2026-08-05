import React from "react";
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

type Props = { eyebrow: string; title: string; sub: string; labelA: string; labelB: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const ALERT = "#F43F5E";

function Bar({ x, h, color, emissive }: { x: number; h: number; color: string; emissive: string }) {
  const baseY = -1.25;
  return (
    <mesh position={[x, baseY + h / 2, 0]}>
      <boxGeometry args={[0.8, Math.max(0.001, h), 0.8]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.6} metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

function Scene({ frame }: { frame: number }) {
  const baseY = -1.25;
  const grow = interpolate(frame, [14, 78], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const hA = 2.15 * grow;    // años de servicio: sube alto
  const hB = 0.4 * grow;     // patrimonio: plano

  return (
    <group position={[0, 0.2, 0]} rotation={[0.12, -0.1, 0]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color={"#dfe5ee"} />
      <pointLight position={[-2, 1, 3]} intensity={1.4} distance={9} color={GOLD} />

      {/* plano/piso */}
      <mesh position={[0, baseY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color={"#15181e"} metalness={0.3} roughness={0.8} transparent opacity={0.6} />
      </mesh>
      {/* eje base */}
      <mesh position={[0, baseY, 0]}>
        <boxGeometry args={[3.4, 0.02, 0.02]} />
        <meshBasicMaterial color={BRAND.titaniumDark} />
      </mesh>

      <Bar x={-0.8} h={hA} color={GOLD} emissive={"#3a2f15"} />
      <Bar x={0.8} h={hB} color={ALERT} emissive={"#4a0f1a"} />

      {/* etiquetas */}
      <Html position={[-0.8, baseY - 0.32, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: BRAND.smoke, textAlign: "center", letterSpacing: 1, whiteSpace: "nowrap" }}>AÑOS DE<br />SERVICIO</div>
      </Html>
      <Html position={[0.8, baseY - 0.32, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: BRAND.smoke, textAlign: "center", letterSpacing: 1, whiteSpace: "nowrap" }}>PATRIMONIO</div>
      </Html>
    </group>
  );
}

export const Metricas3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [60, 74], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [60, 74], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [78, 92], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [82, 100], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 42% at 50% 40%, rgba(197,160,89,0.08), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-9%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0.3, 6.8], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.15 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 92, lineHeight: 1.04, letterSpacing: 1, textAlign: "center" }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "22px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
