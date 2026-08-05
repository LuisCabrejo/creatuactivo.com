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

// EXPANDIR — usted COMPARTE y su ALCANCE se expande. La orbe central (su celular /
// Queswa le entrega contenido validado) emite una ONDA que se expande de adentro hacia
// afuera y va ENCENDIENDO un campo de muchos contactos (espiral tipo girasol = "muchos").
// Un clic → llega a muchos. Distinto de Maestría (que multiplica réplicas): aquí el
// centro ALCANZA a una audiencia que ya existe. Texto vacío en el deck.

type Props = { eyebrow: string; title: string; sub: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const TITAN = "#94A3B8";

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

const COUNT = 22;

function Scene({ frame, fps }: { frame: number; fps: number }) {
  const inS = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scaleIn = interpolate(inS, [0, 1], [0.6, 1]);
  const breath = 0.46 + 0.03 * Math.sin(frame / 5);
  const appear = interpolate(frame, [8, 26], [0, 1], { extrapolateRight: "clamp" });

  // campo de contactos en espiral de girasol (phyllotaxis) = "muchos", reparto orgánico
  const dots = useMemo(
    () => Array.from({ length: COUNT }).map((_, i) => {
      const a = i * 2.39996; // ángulo áureo
      const rr = 0.5 + (i / COUNT) * 1.05;
      const x = Math.cos(a) * rr * 1.0;
      const y = Math.sin(a) * rr * 1.55;
      return { x, y, dist: Math.hypot(x, y) };
    }),
    []
  );

  // alcance que se expande (cumulativo) — el centro llega progresivamente a todos
  const reach = interpolate(frame, [18, 96], [0, 3.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // frente de onda (anillos que viajan con el alcance + uno rezagado)
  const waveR = reach;

  return (
    <group scale={[scaleIn, scaleIn, scaleIn]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 1.4]} intensity={9} distance={8} color={GOLD_HOT} />

      {/* frente de onda expandiéndose */}
      {[0, 0.5].map((off, i) => {
        const r = Math.max(0.01, waveR - off);
        const op = interpolate(r, [0, 0.3, 2.6, 3.0], [0, 0.4, 0.25, 0]) * appear;
        return (
          <mesh key={`wave${i}`} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.01, 8, 96]} />
            <meshBasicMaterial color={GOLD} transparent opacity={op} />
          </mesh>
        );
      })}

      {/* campo de contactos: titanio (no alcanzado) → dorado al pasar la onda */}
      {dots.map((d, i) => {
        const lit = interpolate(d.dist, [reach - 0.05, reach + 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        // destello breve cuando la onda lo alcanza
        const hit = reach - d.dist;
        const flash = interpolate(hit, [-0.05, 0.12, 0.4], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const col = new THREE.Color(TITAN).lerp(new THREE.Color(GOLD_HOT), lit).getStyle();
        return (
          <group key={`d${i}`} position={[d.x, d.y, 0]}>
            {lit > 0.05 && <Glow position={new THREE.Vector3(0, 0, 0)} scale={(0.7 + 0.6 * flash) * lit} color={GOLD} opacity={(0.55 + 0.4 * flash) * lit} />}
            <mesh>
              <sphereGeometry args={[0.1 + 0.04 * lit, 18, 18]} />
              <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.4 + 1.0 * lit} metalness={0.4} roughness={0.4} transparent opacity={appear} />
            </mesh>
          </group>
        );
      })}

      {/* ORBE CENTRAL = su centro de mando (comparte con un clic) */}
      <Glow position={new THREE.Vector3(0, 0, 0)} scale={2.5} color={GOLD} opacity={appear} />
      <mesh renderOrder={10}>
        <sphereGeometry args={[breath, 40, 40]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.4} metalness={0.25} roughness={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

export const Expandir3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleWords = title.split("\n");
  const subOp = interpolate(frame, [50, 64], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [54, 72], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 55% 50% at 50% 44%, rgba(197,160,89,0.12), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-2%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 7.6], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} />
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
