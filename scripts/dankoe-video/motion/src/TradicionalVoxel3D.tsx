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

// ─────────────────────────────────────────────────────────────────────────────
// GRÁFICA 1 (Slide 1) — VERSIÓN VOXEL (Minecraft/Roblox limpio + bimetálico)
// Diorama de una empresa tradicional (tienda · camiones · trabajadores · cajas).
// El DUEÑO es una figura voxel en el centro; cuando se va, todo se apaga/congela.
// Voxel limpio (cubos planos, sin texturas pixeladas) → premium, no "gamer".
// ─────────────────────────────────────────────────────────────────────────────

type Props = { label: string; orbLabel: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const COLD = "#39424f";
const BODY_A = "#222932";
const BODY_B = "#2b333d";
const DARK = "#171b21";

const goldCol = (p: number) =>
  new THREE.Color(COLD).lerp(new THREE.Color(GOLD), Math.max(0, Math.min(1, p)));

function appear(frame: number, a: number, b: number) {
  return interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.7)),
  });
}

// cubo voxel básico
function V({
  pos,
  size,
  color,
  emissive,
  emI = 0,
  metal = 0.35,
  rough = 0.55,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: any;
  emissive?: any;
  emI?: number;
  metal?: number;
  rough?: number;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={emissive ?? "#000"} emissiveIntensity={emI} metalness={metal} roughness={rough} />
    </mesh>
  );
}

function Glow({ position, scale, opacity = 1 }: { position: THREE.Vector3; scale: number; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.9)");
    g.addColorStop(0.3, "rgba(213,160,89,0.45)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={6}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

// PERSONA voxel (Roblox): piernas · torso · brazos · cabeza-cubo
function Person({ x, z, show, power, idle = 0, owner = false }: { x: number; z: number; show: number; power: number; idle?: number; owner?: boolean }) {
  const bob = Math.sin(idle) * 0.03 * power;
  const e = (owner ? 1.0 : 0.6) * power;
  const sc = owner ? 1.55 : 1.28;
  const skin = "#caa46a";
  const pants = "#13171d";
  const shirt = owner ? goldCol(power) : "#2c343f";
  return (
    <group position={[x, bob, z]} scale={[show * sc, show * sc, show * sc]}>
      {/* piernas (separadas, oscuras) */}
      <V pos={[-0.07, 0.13, 0]} size={[0.1, 0.26, 0.1]} color={pants} />
      <V pos={[0.07, 0.13, 0]} size={[0.1, 0.26, 0.1]} color={pants} />
      {/* torso */}
      <V pos={[0, 0.43, 0]} size={[0.26, 0.32, 0.16]} color={shirt} emissive={GOLD} emI={e * 0.35} />
      {/* chaleco dorado (acento de pecho) */}
      <V pos={[0, 0.43, 0.09]} size={[0.11, 0.3, 0.02]} color={goldCol(power)} emissive={GOLD} emI={e} />
      {/* brazos */}
      <V pos={[-0.185, 0.43, 0]} size={[0.08, 0.3, 0.12]} color={shirt} />
      <V pos={[0.185, 0.43, 0]} size={[0.08, 0.3, 0.12]} color={shirt} />
      {/* cabeza */}
      <V pos={[0, 0.71, 0]} size={[0.2, 0.2, 0.2]} color={owner ? goldCol(Math.max(power, 0.25)) : skin} metal={0.2} rough={0.6} />
      {/* casco del trabajador / brillo del dueño */}
      {!owner && <V pos={[0, 0.83, 0]} size={[0.23, 0.07, 0.23]} color={goldCol(power)} emissive={GOLD} emI={e * 0.7} />}
      {owner && <Glow position={new THREE.Vector3(0, 0.48, 0)} scale={1.95} opacity={power} />}
    </group>
  );
}

// CAMIÓN voxel: cabina · remolque · 4 ruedas · franja dorada
function Truck({ power, show, flip = false }: { power: number; show: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  const e = 0.5 * power;
  const wheel = (x: number, z: number) => <V pos={[x, -0.28, z]} size={[0.12, 0.12, 0.12]} color={"#0f1217"} />;
  return (
    <group scale={[show, show, show]} rotation={[0, s * 0.55, 0]}>
      {/* remolque */}
      <V pos={[-0.2, 0, 0]} size={[1.0, 0.55, 0.5]} color={BODY_B} emissive={GOLD} emI={e * 0.18} />
      {/* franja dorada */}
      <V pos={[-0.2, 0.02, 0.26]} size={[0.92, 0.13, 0.02]} color={goldCol(power)} emissive={GOLD} emI={e} />
      {/* cabina */}
      <V pos={[0.5, -0.06, 0]} size={[0.42, 0.42, 0.5]} color={BODY_A} />
      {/* parabrisas */}
      <V pos={[0.64, 0.04, 0.26]} size={[0.16, 0.17, 0.02]} color={goldCol(power)} emissive={GOLD} emI={e * 1.1} />
      {wheel(-0.42, 0.22)}
      {wheel(0.16, 0.22)}
      {wheel(-0.42, -0.22)}
      {wheel(0.16, -0.22)}
    </group>
  );
}

// CAJA voxel con cinta dorada en cruz
function Crate({ pos, show, power, s = 0.32 }: { pos: [number, number, number]; show: number; power: number; s?: number }) {
  return (
    <group position={pos} scale={[show, show, show]}>
      <V pos={[0, 0, 0]} size={[s, s, s]} color={"#26303a"} emissive={GOLD} emI={0.12 * power} />
      <V pos={[0, 0, s / 2 + 0.005]} size={[s, 0.05, 0.01]} color={goldCol(power)} emissive={GOLD} emI={0.5 * power} />
      <V pos={[0, 0, s / 2 + 0.005]} size={[0.05, s, 0.01]} color={goldCol(power)} emissive={GOLD} emI={0.5 * power} />
    </group>
  );
}

function Scene({ frame, fps, label, orbLabel }: { frame: number; fps: number; label: string; orbLabel: string }) {
  const baseY = -0.5;
  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const removeStart = Math.round(2.6 * fps);
  const tf = Math.max(0, frame - removeStart);
  const ts = tf / fps;
  const power = frame < removeStart ? 1 : interpolate(ts, [0, 0.7], [1, 0.06], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // dueño: idle en el centro → camina fuera (x crece) y se desvanece
  const ownerX = frame < removeStart ? 0 : interpolate(ts, [0, 0.85], [0, 2.6], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const ownerShow = frame < removeStart ? appear(frame, 30, 46) : interpolate(ts, [0.5, 0.85], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const win = 0.95 * power; // ventanas de la tienda

  return (
    <group scale={[inOp, inOp, inOp]} position={[0, baseY, 0]}>
      <ambientLight intensity={0.62 * (0.4 + 0.6 * power)} />
      <directionalLight position={[3, 6, 4]} intensity={1.55 * (0.35 + 0.65 * power)} color={"#e7ecf3"} castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={0.4 * power} color={GOLD_HOT} />

      {/* piso tile */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color={"#11141a"} metalness={0.4} roughness={0.75} transparent opacity={0.6} />
      </mesh>

      {/* TIENDA (centro-atrás) */}
      <group position={[0, 0, -0.5]} scale={[appear(frame, 0, 16), appear(frame, 0, 16), appear(frame, 0, 16)]}>
        {/* cuerpo */}
        <V pos={[0, 0.6, 0]} size={[1.7, 1.2, 1.2]} color={BODY_A} metal={0.4} rough={0.5} />
        {/* techo */}
        <V pos={[0, 1.26, 0]} size={[1.86, 0.16, 1.36]} color={DARK} />
        {/* toldo a rayas — panel inclinado contiguo y limpio */}
        <group position={[0, 0.99, 0.64]} rotation={[0.62, 0, 0]}>
          {[-0.66, -0.4, -0.14, 0.14, 0.4, 0.66].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.25, 0.03, 0.42]} />
              <meshStandardMaterial color={i % 2 ? goldCol(power) : "#15191f"} emissive={GOLD} emissiveIntensity={i % 2 ? 0.5 * power : 0} metalness={0.3} roughness={0.6} />
            </mesh>
          ))}
        </group>
        {/* puerta */}
        <V pos={[0, 0.32, 0.61]} size={[0.34, 0.62, 0.04]} color={"#0f1217"} emissive={GOLD} emI={0.5 * win} />
        {/* ventanas (vitrina) */}
        <V pos={[-0.52, 0.5, 0.61]} size={[0.4, 0.4, 0.03]} color={goldCol(power)} emissive={GOLD} emI={win} />
        <V pos={[0.52, 0.5, 0.61]} size={[0.4, 0.4, 0.03]} color={goldCol(power)} emissive={GOLD} emI={win} />
        {/* letrero */}
        <V pos={[0, 1.04, 0.64]} size={[1.1, 0.12, 0.04]} color={goldCol(power)} emissive={GOLD} emI={0.7 * power} />
        <Html position={[0, 1.95, 0]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 40, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{label}</div>
        </Html>
      </group>

      {/* CAMIONES (flanqueando, hacia adentro para que se lean) */}
      <group position={[-1.75, 0.3, 0.62]}>
        <Truck power={power} show={appear(frame, 12, 28)} />
      </group>
      <group position={[1.75, 0.3, 0.62]}>
        <Truck power={power} show={appear(frame, 18, 34)} flip />
      </group>

      {/* CAJAS apiladas */}
      <Crate pos={[-1.15, 0.16, 0.7]} show={appear(frame, 34, 48)} power={power} />
      <Crate pos={[-1.15, 0.48, 0.7]} show={appear(frame, 40, 54)} power={power} s={0.28} />
      <Crate pos={[1.2, 0.16, 0.75]} show={appear(frame, 36, 50)} power={power} />

      {/* TRABAJADORES */}
      <Person x={-0.95} z={1.15} show={appear(frame, 24, 40)} power={power} idle={frame / 6} />
      <Person x={0.9} z={1.05} show={appear(frame, 30, 46)} power={power} idle={frame / 6 + 2} />

      {/* DUEÑO (centro-frente, resaltado; se va y apaga todo) */}
      <group position={[ownerX, 0, 1.7]}>
        <Person x={0} z={0} show={ownerShow} power={Math.max(power, 0.12)} idle={frame / 7 + 1} owner />
        {ownerShow > 0.2 && (
          <Html position={[0, -0.18, 0]} center transform={false} zIndexRange={[100, 0]}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 38, fontWeight: 900, letterSpacing: 2, color: GOLD_HOT, opacity: ownerShow, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{orbLabel}</div>
          </Html>
        )}
      </group>
    </group>
  );
}

export const TradicionalVoxel3D: React.FC<Props> = ({ label, orbLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 62% 50% at 50% 46%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <AbsoluteFill style={{ transform: "translateY(4%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 36, position: [4.0, 3.3, 6.1], near: 0.1, far: 60 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} label={label} orbLabel={orbLabel} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.72)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
