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

// ACTIVAR — CONVERSIÓN. El interesado parte ROJO (indeciso/frío). Queswa (orbe dorada)
// conversa y lo acompaña: un anillo de progreso se llena ROJO→VERDE y, al cerrar la
// decisión, el nodo queda VERDE con ✓ (de acuerdo · listo para iniciar) + estallido verde.
// Sin texto en el deck — la gráfica grita conversión por sí sola.

type Props = { eyebrow: string; title: string; sub: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const RED = "#F43F5E";
const GREEN = "#10B981";
const GREEN_HOT = "#34E0A1";

function Glow({ position, scale, color, opacity = 1 }: { position: THREE.Vector3; scale: number; color: string; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`); grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

function Scene({ frame, fps }: { frame: number; fps: number }) {
  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // progreso de conversión 0..1
  const conv = interpolate(frame, [24, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const done = interpolate(frame, [118, 132], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burst = done > 0 ? interpolate(frame, [120, 134], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  // color del prospecto: ROJO → VERDE
  const col = new THREE.Color(RED).lerp(new THREE.Color(GREEN_HOT), conv).getStyle();
  const emI = 0.5 + 0.8 * conv + 0.5 * done;
  const breath = 0.5 + 0.03 * Math.sin(frame / 5) + 0.05 * done;

  // anillo de progreso (rojo→verde, se llena)
  const ringCol = new THREE.Color(RED).lerp(new THREE.Color(GREEN), conv).getStyle();
  const theta = Math.max(0.0001, conv * Math.PI * 2);

  // orbe Queswa arriba — conversa (pulsos descendentes). Bajada para que entre
  // completa dentro de la card (antes quedaba cortada en el borde superior).
  const orbY = 1.55 + 0.07 * Math.sin(frame / 8);
  const orbBreath = 0.32 + 0.025 * Math.sin(frame / 5);
  const pulses = [0, 1, 2].map((i) => {
    const period = 1.4 * fps;
    const t = (((frame - i * period / 3) % period) / period);
    return { r: interpolate(t, [0, 1], [0.25, 1.6]), op: interpolate(t, [0, 0.2, 1], [0, 0.5, 0]) };
  });

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 4, 5]} intensity={1.1} color={"#dfe5ee"} />
      <pointLight position={[0, 0.3, 1.6]} intensity={6} distance={8} color={done > 0.5 ? GREEN_HOT : conv > 0.5 ? GREEN : RED} />

      {/* estallido VERDE al convertir */}
      {burst > 0 && <Glow position={new THREE.Vector3(0, 0, 0.5)} scale={5 * burst} color={GREEN_HOT} opacity={burst} />}
      {done > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6 + done * 1.4, 0.02, 8, 80]} />
          <meshBasicMaterial color={GREEN_HOT} transparent opacity={(1 - done) * 0.9} />
        </mesh>
      )}

      {/* PROSPECTO (rojo → verde) */}
      <Glow position={new THREE.Vector3(0, 0, 0)} scale={2.0 + 0.6 * done} color={conv > 0.5 ? GREEN : RED} opacity={0.55 + 0.4 * done} />
      <mesh renderOrder={10}>
        <sphereGeometry args={[breath, 40, 40]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={emI} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* anillo de progreso rojo→verde (empieza arriba, sentido horario) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <ringGeometry args={[0.66, 0.78, 64, 1, 0, theta]} />
        <meshBasicMaterial color={ringCol} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* riel del anillo (tenue) */}
      <mesh>
        <ringGeometry args={[0.67, 0.77, 64]} />
        <meshBasicMaterial color={"#2a2f38"} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* ✓ verde al completar (de acuerdo / listo) */}
      {done > 0.15 && (
        <Html position={[0, 0, 0.4]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 200, fontWeight: 900, color: "#fff", transform: `scale(${0.6 + 0.4 * done})`, opacity: done, lineHeight: 1, textShadow: `0 0 26px ${GREEN_HOT}` }}>✓</div>
        </Html>
      )}

      {/* ORBE QUESWA — conversa desde arriba */}
      <Glow position={new THREE.Vector3(0, orbY, 0)} scale={1.9} color={GOLD} opacity={0.9} />
      <mesh position={[0, orbY, 0]} renderOrder={10}>
        <sphereGeometry args={[orbBreath, 40, 40]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.4} metalness={0.25} roughness={0.3} />
      </mesh>
      {pulses.map((p, i) => (
        <mesh key={`p${i}`} position={[0, orbY, 0]}>
          <torusGeometry args={[p.r, 0.01, 8, 64]} />
          <meshBasicMaterial color={GOLD} transparent opacity={p.op} />
        </mesh>
      ))}
    </group>
  );
}

export const Activar3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleWords = title.split("\n");
  const subOp = interpolate(frame, [50, 64], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [54, 72], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 58% 45% at 50% 42%, rgba(16,185,129,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-1%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0.4, 6.6], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || title || sub) && (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.1 }}>
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
