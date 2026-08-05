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

// ─────────────────────────────────────────────────────────────────────────────
// GRÁFICA 1 (Slide 1) — LA EMPRESA DE TODA LA VIDA + LA DEPENDENCIA
// Se arma una empresa tradicional (edificio · camiones · personas · inventario),
// encendida en dorado por la orbe-DUEÑO en el centro. Cuando el dueño se retira,
// TODO se apaga / se congela: "para que funcione, usted tiene que estar ahí".
// Estética bimetálica sobre carbón, line-art reconocible (no geometría abstracta).
// ─────────────────────────────────────────────────────────────────────────────

type Props = { label: string; orbLabel: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const COLD = "#3a4250"; // titanio apagado (estado "sin dueño")

// color de los acentos según "power": dorado vivo (1) → gris frío (0)
const goldCol = (p: number) => new THREE.Color(COLD).lerp(new THREE.Color(GOLD), Math.max(0, Math.min(1, p)));

// aparición escalonada suave (scale + opacidad) en una ventana de frames
function appear(frame: number, a: number, b: number) {
  return interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });
}

function Glow({
  position,
  scale,
  opacity = 1,
}: {
  position: THREE.Vector3;
  scale: number;
  opacity?: number;
}) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.95)");
    g.addColorStop(0.3, "rgba(213,160,89,0.5)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={6}>
      <spriteMaterial
        map={tex}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        transparent
        opacity={opacity}
      />
    </sprite>
  );
}

// CAMIÓN reconocible: cabina + remolque + 2 ruedas
function Truck({
  power,
  show,
  flip = false,
}: {
  power: number;
  show: number;
  flip?: boolean;
}) {
  const s = flip ? -1 : 1;
  const goldE = 0.45 * power;
  const wheel = (x: number) => (
    <mesh position={[x, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.13, 0.13, 0.12, 20]} />
      <meshStandardMaterial color={"#14171d"} metalness={0.5} roughness={0.5} />
    </mesh>
  );
  return (
    <group scale={[show, show, show]} rotation={[0, s * 0.5, 0]}>
      {/* remolque */}
      <RoundedBox args={[1.05, 0.55, 0.5]} radius={0.05} smoothness={3} position={[-0.18, 0, 0]}>
        <meshStandardMaterial color={"#1d222b"} metalness={0.55} roughness={0.45} emissive={GOLD} emissiveIntensity={goldE * 0.4} />
      </RoundedBox>
      {/* franja dorada del remolque (lectura de marca) */}
      <mesh position={[-0.18, 0, 0.26]}>
        <boxGeometry args={[0.95, 0.12, 0.02]} />
        <meshStandardMaterial color={goldCol(power)} emissive={GOLD} emissiveIntensity={goldE} />
      </mesh>
      {/* cabina */}
      <RoundedBox args={[0.42, 0.42, 0.5]} radius={0.05} smoothness={3} position={[0.52, -0.06, 0]}>
        <meshStandardMaterial color={"#222831"} metalness={0.55} roughness={0.4} />
      </RoundedBox>
      {/* parabrisas dorado */}
      <mesh position={[0.66, 0.02, 0.26]}>
        <boxGeometry args={[0.16, 0.18, 0.02]} />
        <meshStandardMaterial color={goldCol(power)} emissive={GOLD} emissiveIntensity={goldE * 1.1} />
      </mesh>
      {wheel(-0.4)}
      {wheel(0.18)}
      {wheel(0.52)}
    </group>
  );
}

// PERSONA reconocible: cabeza + torso cónico (empleado)
function Person({ power, show, x }: { power: number; show: number; x: number }) {
  const e = 0.5 * power;
  return (
    <group position={[x, 0, 0]} scale={[show, show, show]}>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial color={"#2a313c"} metalness={0.4} roughness={0.5} emissive={GOLD} emissiveIntensity={e * 0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.085, 0.16, 0.42, 24]} />
        <meshStandardMaterial color={"#232a33"} metalness={0.45} roughness={0.5} emissive={GOLD} emissiveIntensity={e * 0.5} />
      </mesh>
    </group>
  );
}

function Scene({
  frame,
  fps,
  label,
  orbLabel,
}: {
  frame: number;
  fps: number;
  label: string;
  orbLabel: string;
}) {
  const baseY = -1.35;
  const inOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // ── el dueño se retira y TODO se apaga ──
  const removeStart = Math.round(2.5 * fps);
  const tf = Math.max(0, frame - removeStart);
  const ts = tf / fps;
  const power = frame < removeStart ? 1 : interpolate(ts, [0, 0.75], [1, 0.08], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // orbe-DUEÑO: presente y latiendo → rueda fuera y se apaga
  const orbR = 0.32;
  const orbBaseX = 0;
  const orbX = frame < removeStart ? Math.sin(frame / 7) * 0.04 : interpolate(ts, [0, 0.8], [0, 2.4], { extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const orbOp = frame < removeStart ? 1 : interpolate(ts, [0, 0.55], [1, 0.06], { extrapolateRight: "clamp" });
  const breath = orbR + 0.02 * Math.sin(frame / 5);
  const orbY = baseY + 0.55;
  const orbZ = 1.7;

  // ventanas del edificio (3 pisos × 3)
  const slabH = 0.52;
  const floors = [0, 1, 2];
  const buildShow = appear(frame, 0, 18);
  const goldWin = 0.85 * power;

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.45 * (0.4 + 0.6 * power)} />
      <directionalLight position={[2.5, 5, 4]} intensity={1.25 * (0.35 + 0.65 * power)} color={"#dfe5ee"} />
      <pointLight position={[orbX, orbY, orbZ]} intensity={5.5 * power + 0.4} distance={6} color={GOLD_HOT} />

      {/* piso */}
      <mesh position={[0, baseY - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 5]} />
        <meshStandardMaterial color={"#13161c"} metalness={0.3} roughness={0.85} transparent opacity={0.55} />
      </mesh>

      {/* EDIFICIO (centro, atrás) */}
      <group position={[0, baseY, -0.4]} scale={[buildShow, buildShow, buildShow]}>
        {floors.map((i) => (
          <RoundedBox key={i} args={[1.4, slabH - 0.06, 0.8]} radius={0.04} smoothness={3} position={[0, slabH * i + slabH / 2, 0]}>
            <meshStandardMaterial color={i % 2 ? "#222730" : "#1b1f27"} metalness={0.55} roughness={0.45} emissive={"#0c0e12"} emissiveIntensity={0.3} />
          </RoundedBox>
        ))}
        {floors.map((i) =>
          [-0.42, 0, 0.42].map((x, j) => (
            <mesh key={`${i}-${j}`} position={[x, slabH * i + slabH / 2, 0.41]}>
              <boxGeometry args={[0.2, 0.18, 0.02]} />
              <meshStandardMaterial color={goldCol(power)} emissive={GOLD} emissiveIntensity={goldWin} />
            </mesh>
          ))
        )}
        <Html position={[0, slabH * 3 + 0.45, 0]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 40, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{label}</div>
        </Html>
      </group>

      {/* INVENTARIO (cajas apiladas, junto al edificio) */}
      {[
        { x: -1.55, y: 0, sc: appear(frame, 38, 52) },
        { x: -1.55, y: 0.34, sc: appear(frame, 44, 58) },
        { x: 1.55, y: 0, sc: appear(frame, 40, 54) },
      ].map((b, i) => (
        <group key={i} position={[b.x, baseY + 0.17 + b.y, 0.4]} scale={[b.sc, b.sc, b.sc]}>
          <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.03} smoothness={3}>
            <meshStandardMaterial color={"#1f242d"} metalness={0.5} roughness={0.5} emissive={GOLD} emissiveIntensity={0.3 * power} />
          </RoundedBox>
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.34, 0.05, 0.01]} />
            <meshStandardMaterial color={goldCol(power)} emissive={GOLD} emissiveIntensity={0.6 * power} />
          </mesh>
        </group>
      ))}

      {/* CAMIONES (flanqueando, adelante) */}
      <group position={[-2.25, baseY + 0.34, 0.5]}>
        <Truck power={power} show={appear(frame, 14, 30)} />
      </group>
      <group position={[2.25, baseY + 0.34, 0.5]}>
        <Truck power={power} show={appear(frame, 20, 36)} flip />
      </group>

      {/* PERSONAS (empleados, primer plano) */}
      <group position={[0, baseY, 1.15]}>
        <Person power={power} show={appear(frame, 28, 44)} x={-0.85} />
        <Person power={power} show={appear(frame, 34, 50)} x={0.85} />
      </group>

      {/* ORBE = USTED (el dueño que enciende todo) */}
      <group>
        <Glow position={new THREE.Vector3(orbX, orbY, orbZ)} scale={1.4} opacity={orbOp} />
        <mesh position={[orbX, orbY, orbZ]} renderOrder={11}>
          <sphereGeometry args={[breath, 36, 36]} />
          <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.5 * Math.max(power, 0.1)} metalness={0.2} roughness={0.28} transparent opacity={orbOp} depthWrite={false} />
        </mesh>
        {orbOp > 0.12 && (
          <Html position={[orbX, orbY - 0.62, orbZ]} center transform={false} zIndexRange={[100, 0]}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 42, fontWeight: 900, letterSpacing: 2, color: GOLD_HOT, opacity: orbOp, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{orbLabel}</div>
          </Html>
        )}
      </group>
    </group>
  );
}

export const Tradicional3D: React.FC<Props> = ({ label, orbLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 48% at 50% 44%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <AbsoluteFill style={{ transform: "translateY(3%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 44, position: [0, 0.7, 7.2], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} label={label} orbLabel={orbLabel} />
        </ThreeCanvas>
      </AbsoluteFill>
      {/* viñeta */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.7)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
