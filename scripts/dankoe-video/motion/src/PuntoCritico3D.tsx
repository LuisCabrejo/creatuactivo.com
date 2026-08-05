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

type Props = { eyebrow: string; title: string; sub: string; loadLabel: string; pillarLabel: string; critAt: number };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const ALERT = "#F43F5E";

function Glow({ position, scale, color, opacity = 1 }: { position: THREE.Vector3; scale: number; color: string; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`); grad.addColorStop(0.35, `rgba(${r},${g},${b},0.4)`); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

function Scene({ frame, fps, loadLabel, pillarLabel, critAt }: { frame: number; fps: number; loadLabel: string; pillarLabel: string; critAt: number }) {
  const inOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const baseY = -1.5;
  const pillarH = 1.7;
  const pillarTopY = baseY + pillarH;

  // estrés que crece + estado CRÍTICO (rojo) cerca del final
  const stress = interpolate(frame, [18, critAt], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crit = interpolate(frame, [critAt, critAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = crit > 0 ? interpolate(frame, [critAt, critAt + 7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // la carga (SU INGRESO) se balancea precaria sobre el único pilar; más al volverse crítico
  const teeter = Math.sin(frame / (8 - 4 * stress)) * (0.025 + 0.07 * stress + 0.06 * crit);
  // vibración de estrés del pilar
  const shake = (0.01 + 0.03 * stress) * Math.sin(frame * 1.6);

  const pillarCol = new THREE.Color(GOLD_HOT).lerp(new THREE.Color(ALERT), crit * 0.9).getStyle();
  const pillarEm = new THREE.Color(GOLD).lerp(new THREE.Color(ALERT), crit).getStyle();
  const stressGlowScale = 0.6 + 1.4 * stress + 0.8 * crit;

  // anillo de alerta que pulsa (estrés)
  const ringPulse = ((frame % Math.round(0.9 * fps)) / (0.9 * fps));

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 5, 4]} intensity={1.3} color={"#dfe5ee"} />
      <pointLight position={[0, 0.5, 2]} intensity={5} distance={8} color={crit > 0.5 ? ALERT : GOLD_HOT} />

      {/* piso */}
      <mesh position={[0, baseY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color={"#15181e"} metalness={0.3} roughness={0.85} transparent opacity={0.6} />
      </mesh>

      {/* resplandor de estrés en la base del único pilar */}
      <Glow position={new THREE.Vector3(shake, baseY + 0.1, 0)} scale={stressGlowScale} color={crit > 0.3 ? ALERT : GOLD} opacity={0.5 * stress + 0.5 * crit} />
      {/* anillo de alerta pulsante en la base */}
      {stress > 0.25 && (
        <mesh position={[shake, baseY + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5 + ringPulse * 0.7, 0.54 + ringPulse * 0.7, 40]} />
          <meshBasicMaterial color={crit > 0.3 ? ALERT : GOLD} transparent opacity={(1 - ringPulse) * (0.3 + 0.5 * crit)} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* destello al volverse crítico */}
      {flash > 0 && <Glow position={new THREE.Vector3(0, pillarTopY * 0.5, 0.4)} scale={4 * flash} color={ALERT} opacity={flash} />}

      {/* ÚNICO PILAR = USTED (de pie) */}
      <mesh position={[shake, baseY + pillarH / 2, 0]}>
        <cylinderGeometry args={[0.26, 0.32, pillarH, 28]} />
        <meshStandardMaterial color={pillarCol} emissive={pillarEm} emissiveIntensity={0.7 + 0.6 * crit} metalness={0.5} roughness={0.35} />
      </mesh>
      <Html position={[shake + 0.62, baseY + pillarH / 2, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 30, fontWeight: 900, letterSpacing: 1, color: crit > 0.4 ? ALERT : GOLD_HOT, whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>{pillarLabel}</div>
      </Html>

      {/* LA CARGA = SU INGRESO (se balancea sobre el único punto) */}
      <group position={[shake, pillarTopY, 0]} rotation={[0, 0, teeter]}>
        <RoundedBox args={[2.5, 0.5, 1.1]} radius={0.05} smoothness={4} position={[0, 0.3, 0]}>
          <meshStandardMaterial color={"#222730"} metalness={0.55} roughness={0.45} emissive={crit > 0.3 ? "#2a0d14" : "#0c0e12"} emissiveIntensity={0.4 + 0.5 * crit} />
        </RoundedBox>
        <Html position={[0, 0.3, 0.6]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 26, fontWeight: 700, letterSpacing: 2, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>{loadLabel}</div>
        </Html>
      </group>
    </group>
  );
}

export const PuntoCritico3D: React.FC<Props> = ({ eyebrow, title, sub, loadLabel, pillarLabel, critAt }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [critAt, critAt + 14], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [critAt, critAt + 14], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [critAt + 16, critAt + 30], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [critAt + 20, critAt + 38], [0, 250], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 58% 45% at 50% 40%, rgba(197,160,89,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-4%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0.5, 6.2], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} loadLabel={loadLabel} pillarLabel={pillarLabel} critAt={critAt} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.06 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 25, fontWeight: 600, marginBottom: 14 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 96, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: ALERT, margin: "18px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.smoke, fontFamily: FONTS.mono, fontSize: 24, letterSpacing: 1, textAlign: "center" }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
