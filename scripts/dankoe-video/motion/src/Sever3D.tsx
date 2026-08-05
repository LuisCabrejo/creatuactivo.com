import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { Html } from "@react-three/drei";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { BRAND, FONTS } from "./brand";

type Props = { topLabel: string; bottomLabel: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

function Glow({ position, scale, opacity = 1 }: { position: THREE.Vector3; scale: number; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.95)"); g.addColorStop(0.3, "rgba(213,160,89,0.5)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

function Scene({ frame, fps, topLabel, bottomLabel }: { frame: number; fps: number; topLabel: string; bottomLabel: string }) {
  const anchorY = 1.6;
  const restY = -0.2;
  const cut = 1.7 * fps;

  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const sway = frame < cut ? Math.sin(frame / 9) * 0.07 : 0;

  const tf = Math.max(0, frame - cut);
  const fall = 0.5 * (tf / fps) * (tf / fps) * 9.5;
  const orbY = frame < cut ? restY : restY - fall;
  const orbX = sway + (frame < cut ? 0 : Math.sin(tf / 7) * 0.08);
  const orbOp = frame < cut ? 1 : interpolate(tf, [0, 0.9 * fps, 1.5 * fps], [1, 1, 0], { extrapolateRight: "clamp" });
  const breath = 0.2 + 0.02 * Math.sin(frame / 5);

  const cutDone = frame >= cut;
  const breakY = (anchorY + restY) / 2;
  const flash = interpolate(frame, [cut, cut + 7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // hilo superior (de EMPRESA al punto de quiebre o al orbe)
  const threadTopEnd = frame < cut ? orbY + breath + 0.05 : breakY;
  const threadCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, anchorY - 0.06, 0),
      new THREE.Vector3(sway * 0.5, (anchorY + threadTopEnd) / 2, 0),
      new THREE.Vector3(frame < cut ? sway : 0, threadTopEnd, 0),
    ]);
  }, [sway, threadTopEnd, frame, cut, anchorY]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} color={"#dfe5ee"} />
      <pointLight position={[orbX, orbY, 0.6]} intensity={5} distance={3} color={GOLD_HOT} />

      {/* ancla EMPRESA (barra metálica) */}
      <mesh position={[0, anchorY, 0]}>
        <boxGeometry args={[1.5, 0.12, 0.18]} />
        <meshStandardMaterial color={"#7c8696"} metalness={0.9} roughness={0.3} />
      </mesh>
      <Html position={[0, anchorY + 0.42, 0]} center transform={false} zIndexRange={[100, 0]}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 24, fontWeight: 600, letterSpacing: 3, color: "#9aa3b3", textTransform: "uppercase" }}>{topLabel}</div>
      </Html>

      {/* hilo superior */}
      <mesh>
        <tubeGeometry args={[threadCurve, 24, 0.012, 6, false]} />
        <meshStandardMaterial color={GOLD} emissive={"#3a2f15"} emissiveIntensity={0.5} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* destello + fragmentos del corte */}
      {cutDone && <Glow position={new THREE.Vector3(0, breakY, 0)} scale={1.2 * flash + 0.3} opacity={flash} />}
      {cutDone && [0, 1, 2, 3, 4].map((i) => {
        const ang = (i / 5) * Math.PI * 2;
        const d = (tf / fps) * 2.5;
        return (
          <mesh key={i} position={[Math.cos(ang) * d, breakY + Math.sin(ang) * d * 0.6 - (tf / fps) * (tf / fps) * 2, 0]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={GOLD} transparent opacity={interpolate(tf, [0, 0.5 * fps], [0.9, 0], { extrapolateRight: "clamp" })} depthTest={false} />
          </mesh>
        );
      })}

      {/* HÉROE: orbe USTED (cuelga, luego cae) */}
      <group>
        {/* segmento corto del hilo bajo el orbe cuando cuelga */}
        {frame < cut && (
          <mesh>
            <tubeGeometry args={[new THREE.CatmullRomCurve3([
              new THREE.Vector3(orbX, orbY + breath, 0),
              new THREE.Vector3(orbX, orbY + breath + 0.18, 0),
            ]), 4, 0.012, 6, false]} />
            <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.4} />
          </mesh>
        )}
        <Glow position={new THREE.Vector3(orbX, orbY, 0)} scale={1.3} opacity={orbOp} />
        <mesh position={[orbX, orbY, 0]} renderOrder={11}>
          <sphereGeometry args={[breath, 30, 30]} />
          <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.6} metalness={0.2} roughness={0.25} transparent opacity={orbOp} depthTest={false} depthWrite={false} />
        </mesh>
        {orbOp > 0.05 && (
          <Html position={[orbX, orbY - 0.42, 0]} center transform={false} zIndexRange={[100, 0]}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 26, fontWeight: 900, letterSpacing: 1, color: GOLD_HOT, opacity: orbOp }}>{bottomLabel}</div>
          </Html>
        )}
      </group>
    </group>
  );
}

export const Sever3D: React.FC<Props> = ({ topLabel, bottomLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const spotOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: spotOp, background: `radial-gradient(ellipse 55% 45% at 50% 42%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <AbsoluteFill style={{ transform: "translateY(-4%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0.3, 6.0], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} topLabel={topLabel} bottomLabel={bottomLabel} />
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
