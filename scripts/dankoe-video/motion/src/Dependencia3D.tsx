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

type Props = { topLabel: string; baseA: string; baseB: string; threadNote: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const ALERT = "#F43F5E";

function Glow({ position, scale, color }: { position: THREE.Vector3; scale: number; color: string }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, color); g.addColorStop(0.35, color.replace("0.95", "0.4")); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent />
    </sprite>
  );
}

function tube(pts: THREE.Vector3[], r: number, color: string, op = 1, emissive = "#000") {
  return (
    <mesh>
      <tubeGeometry args={[new THREE.CatmullRomCurve3(pts), 20, r, 8, false]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.6} metalness={0.5} roughness={0.4} transparent opacity={op} />
    </mesh>
  );
}

function Scene({ frame, fps, topLabel, baseA, baseB, threadNote }: { frame: number; fps: number; topLabel: string; baseA: string; baseB: string; threadNote: string }) {
  const A = new THREE.Vector3(-1.05, -1.25, 0);
  const B = new THREE.Vector3(1.05, -1.25, 0);
  const knot = new THREE.Vector3(0, -0.35, 0);
  const top = new THREE.Vector3(0, 1.25, 0);

  const basesIn = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: "clamp" });
  const knotIn = interpolate(frame, [30, 46], [0, 1], { extrapolateRight: "clamp" });
  const threadDraw = interpolate(frame, [46, 92], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const topIn = interpolate(frame, [92, 110], [0, 1], { extrapolateRight: "clamp" });
  const highlight = interpolate(frame, [114, 142], [0, 1], { extrapolateRight: "clamp" });
  const flip = interpolate(frame, [198, 210], [0, 1], { extrapolateRight: "clamp" });
  const off = flip > 0.5;

  const threadEnd = knot.clone().lerp(top, threadDraw);
  const threadColor = off ? ALERT : highlight > 0 ? GOLD_HOT : "#8a93a3";
  const pulseT = ((frame - 50) % Math.round(0.9 * fps)) / (0.9 * fps);
  const pulsePos = threadDraw > 0.95 && !off && pulseT >= 0 ? knot.clone().lerp(top, pulseT) : null;

  return (
    <group position={[0, 0.05, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.1} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 1]} intensity={3} distance={6} color={off ? ALERT : GOLD} />

      {/* bases: orbes SU INGRESO / ESTILO DE VIDA */}
      {[{ p: A, l: baseA }, { p: B, l: baseB }].map(({ p, l }, i) => (
        <group key={i}>
          <Glow position={p} scale={0.7 * basesIn} color={off ? "rgba(244,63,94,0.95)" : "rgba(213,160,89,0.95)"} />
          <mesh position={p} renderOrder={6}>
            <sphereGeometry args={[0.16 * basesIn, 24, 24]} />
            <meshStandardMaterial color={off ? "#7a3540" : GOLD_HOT} emissive={off ? ALERT : GOLD_HOT} emissiveIntensity={off ? 0.8 : 1.4} depthTest={false} />
          </mesh>
          <Html position={[p.x, p.y - 0.4, 0]} center transform={false} zIndexRange={[100, 0]}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 600, letterSpacing: 1, color: "#cfd6e0", whiteSpace: "nowrap", textTransform: "uppercase", textAlign: "center", opacity: basesIn }}>
              {l.split(" ").map((w, k) => <div key={k}>{w}</div>)}
            </div>
          </Html>
        </group>
      ))}

      {/* convergencia al nudo */}
      {knotIn > 0 && tube([A, A.clone().lerp(knot, knotIn)], 0.012, "#475569", knotIn)}
      {knotIn > 0 && tube([B, B.clone().lerp(knot, knotIn)], 0.012, "#475569", knotIn)}
      {knotIn > 0.5 && (
        <mesh position={knot}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color={"#9aa3b3"} metalness={0.7} roughness={0.3} /></mesh>
      )}

      {/* EL hilo único */}
      {threadDraw > 0.01 && tube([knot, threadEnd], off ? 0.02 : 0.015, threadColor, 1, off ? "#5a1020" : "#3a2f15")}
      {pulsePos && (
        <mesh position={pulsePos} renderOrder={7}><sphereGeometry args={[0.04, 12, 12]} /><meshBasicMaterial color={GOLD_HOT} depthTest={false} /></mesh>
      )}
      {highlight > 0 && (
        <Html position={[0.22, (knot.y + top.y) / 2, 0]} center={false} transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 1, color: off ? ALERT : GOLD_HOT, opacity: highlight, whiteSpace: "nowrap" }}>{threadNote}</div>
        </Html>
      )}

      {/* nodo superior: DECISIÓN DE UN TERCERO + interruptor */}
      <group position={top} scale={[topIn, topIn, topIn]}>
        <mesh>
          <boxGeometry args={[1.7, 0.5, 0.18]} />
          <meshStandardMaterial color={"#1A1D23"} metalness={0.6} roughness={0.4} emissive={off ? "#3a0a12" : "#000"} emissiveIntensity={off ? 0.8 : 0} />
        </mesh>
        <Html position={[0, 0.06, 0.12]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ textAlign: "center", opacity: topIn }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 16, letterSpacing: 2, color: "#cfd6e0" }}>DECISIÓN DE</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>{topLabel}</div>
          </div>
        </Html>
        {/* interruptor 3D bajo el título */}
        <group position={[0, -0.16, 0.12]}>
          <mesh><boxGeometry args={[0.34, 0.16, 0.06]} /><meshStandardMaterial color={off ? ALERT : "#475569"} metalness={0.3} roughness={0.5} emissive={off ? ALERT : "#000"} emissiveIntensity={off ? 0.6 : 0} /></mesh>
          <mesh position={[off ? 0.08 : -0.08, 0, 0.05]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color={"#fff"} /></mesh>
        </group>
      </group>

      {/* flash rojo al cortar */}
      {flip > 0 && flip < 1 && (
        <Glow position={top} scale={2.4} color={"rgba(244,63,94,0.9)"} />
      )}
    </group>
  );
}

export const Dependencia3D: React.FC<Props> = ({ topLabel, baseA, baseB, threadNote }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <AbsoluteFill style={{ transform: "translateY(-2%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 44, position: [0, 0, 6.2], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} topLabel={topLabel} baseA={baseA} baseB={baseB} threadNote={threadNote} />
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
