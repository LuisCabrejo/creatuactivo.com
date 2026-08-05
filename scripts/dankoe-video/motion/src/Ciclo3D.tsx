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

type Props = { eyebrow: string; title: string; sub: string; nodes: string[] };

const RING_R = 1.58;       // radio mayor del bucle
const TILT = -0.95;        // inclinación para perspectiva 3D
const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A"; // dorado vivo (no blanco)

// Glow real: sprite con gradiente radial aditivo (bloom sin postprocessing,
// robusto en headless). El orbe-héroe = esfera emisiva + halo + luz propia.
function Glow({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, color);
    g.addColorStop(0.25, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]}>
      <spriteMaterial map={texture} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.85} />
    </sprite>
  );
}

function Scene({ frame, fps, nodes }: { frame: number; fps: number; nodes: string[] }) {
  // órbita continua del héroe (sin avanzar nunca)
  const a = (frame / fps) * 1.7;             // rad/seg
  const ox = RING_R * Math.cos(a);
  const oy = RING_R * Math.sin(a);
  const breath = 0.22 + 0.025 * Math.sin(frame / 5);

  // nodos sobre el anillo
  const nodeAngles = nodes.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / nodes.length);

  return (
    <group position={[0, 0.9, 0]} rotation={[TILT, 0, 0]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.9} color={"#dfe5ee"} />
      {/* rim dorado tenue desde abajo — el anillo capta brillo cálido */}
      <pointLight position={[0, -2.5, 2.5]} intensity={2.2} distance={8} color={GOLD} />
      {/* el orbe ilumina el anillo al pasar — "vivo" */}
      <pointLight position={[ox, oy, 0.4]} intensity={7} distance={3.2} color={GOLD_HOT} />

      {/* el bucle: torus metálico visible */}
      <mesh>
        <torusGeometry args={[RING_R, 0.05, 28, 180]} />
        <meshStandardMaterial color={"#4a5260"} metalness={0.95} roughness={0.32} emissive={"#15181e"} />
      </mesh>

      {/* nodos del ciclo (esferas metálicas) + etiqueta */}
      {nodeAngles.map((na, i) => {
        const nx = RING_R * Math.cos(na);
        const ny = RING_R * Math.sin(na);
        const d = Math.abs(((a - na) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
        const lit = d < 0.7; // se enciende cuando el héroe PASA por encima
        // etiqueta separada verticalmente del anillo (arriba si el nodo está arriba)
        const lx = nx;
        const ly = ny + (ny < 0 ? -0.58 : 0.58);
        return (
          <group key={i}>
            <mesh position={[nx, ny, 0]}>
              <sphereGeometry args={[0.15, 28, 28]} />
              <meshStandardMaterial
                color={lit ? GOLD : "#9aa4b4"}
                metalness={0.85}
                roughness={0.3}
                emissive={lit ? GOLD : "#1a1d24"}
                emissiveIntensity={lit ? 1.6 : 0.25}
              />
            </mesh>
            <Html position={[lx, ly, 0]} center transform={false} zIndexRange={[100, 0]}>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 24, fontWeight: 600, letterSpacing: 1.5,
                color: lit ? GOLD_HOT : "#9aa3b3", whiteSpace: "nowrap", textTransform: "uppercase",
                textAlign: "center", lineHeight: 1.18,
              }}>
                {nodes[i].split(" ").map((w, k) => <div key={k}>{w}</div>)}
              </div>
            </Html>
          </group>
        );
      })}

      {/* HÉROE: orbe dorado grueso, emisivo, vivo + glow real. Se queda EN la pista
          pero dibuja encima del anillo (depthTest:false) → bola completa, sin flotar. */}
      <Glow position={[ox, oy, 0.1]} scale={1.5} color={"rgba(213,160,89,0.95)"} />
      <mesh position={[ox, oy, 0.1]} renderOrder={10}>
        <sphereGeometry args={[breath, 32, 32]} />
        <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.5} metalness={0.2} roughness={0.25} depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

export const Ciclo3D: React.FC<Props> = ({ eyebrow, title, sub, nodes }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  const ebOp = interpolate(frame, [44, 58], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [50, 64], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [50, 64], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [62, 76], [0, 1], { extrapolateRight: "clamp" });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      {/* grid blueprint detrás */}
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      {/* escena 3D (canvas transparente) */}
      <AbsoluteFill>
        <ThreeCanvas
          width={W}
          height={H}
          camera={{ fov: 42, position: [0, 0.2, 7.0], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Scene frame={frame} fps={fps} nodes={nodes} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* título */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.16 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 100, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
        <div style={{ width: 200, height: 3, backgroundColor: BRAND.gold, margin: "22px 0", borderRadius: 2, opacity: subOp }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
