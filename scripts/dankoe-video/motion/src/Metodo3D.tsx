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

type Props = { eyebrow: string; title: string; sub: string; steps: number };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

function Glow({ position, scale }: { position: THREE.Vector3; scale: number }) {
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
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent />
    </sprite>
  );
}

function Ruta({ frame, fps, steps }: { frame: number; fps: number; steps: number }) {
  // nodos ascendiendo en 3D (con profundidad) = la ruta exacta
  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [
      new THREE.Vector3(-1.08, -0.62, 0.4),
      new THREE.Vector3(0, 0.0, 0),
      new THREE.Vector3(1.08, 0.62, -0.4),
    ].slice(0, steps);
    return pts;
  }, [steps]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(nodes), [nodes]);
  const fullPts = useMemo(() => curve.getPoints(80), [curve]);

  // el orbe avanza por la ruta (no gira: AVANZA)
  const t = interpolate(frame, [20, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const orbPos = curve.getPoint(t);

  // tramo recorrido (dorado brillante)
  const traveled = useMemo(() => {
    const n = Math.max(2, Math.round(t * 80));
    return fullPts.slice(0, n);
  }, [t, fullPts]);

  const breath = 0.17 + 0.02 * Math.sin(frame / 5);
  const ti = (i: number) => (steps === 1 ? 0 : i / (steps - 1));

  return (
    <group position={[0, 0.45, 0]} rotation={[0.05, -0.15, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 5]} intensity={1.2} color={"#dfe5ee"} />
      <pointLight position={[orbPos.x, orbPos.y, orbPos.z + 0.5]} intensity={5} distance={3} color={GOLD_HOT} />

      {/* ruta completa tenue (guía) */}
      <mesh>
        <tubeGeometry args={[curve, 80, 0.012, 8, false]} />
        <meshStandardMaterial color={"#3a4150"} metalness={0.6} roughness={0.5} transparent opacity={0.5} />
      </mesh>
      {/* tramo recorrido dorado */}
      {traveled.length > 1 && (
        <mesh>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(traveled), traveled.length, 0.022, 10, false]} />
          <meshStandardMaterial color={GOLD} emissive={"#5a4214"} emissiveIntensity={0.8} metalness={0.5} roughness={0.35} />
        </mesh>
      )}

      {/* nodos del método (1,2,3) */}
      {nodes.map((p, i) => {
        const lit = t >= ti(i) - 0.02;
        const ring = lit ? interpolate(t - ti(i), [-0.02, 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <group key={i}>
            {lit && <Glow position={p} scale={0.42 * ring} />}
            <mesh position={p} renderOrder={6}>
              <sphereGeometry args={[0.14, 28, 28]} />
              <meshStandardMaterial color={lit ? GOLD_HOT : "#8a93a3"} emissive={lit ? GOLD_HOT : "#1a1d24"} emissiveIntensity={lit ? 1.2 : 0.2} metalness={0.4} roughness={0.35} depthWrite={false} />
            </mesh>
            <Html position={[p.x, p.y + 0.42, p.z]} center transform={false} zIndexRange={[100, 0]}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 34, fontWeight: 900, color: lit ? GOLD_HOT : "#9aa3b3" }}>{i + 1}</div>
            </Html>
          </group>
        );
      })}

      {/* HÉROE: orbe dorado que avanza */}
      {t < 0.999 && (
        <>
          <Glow position={orbPos} scale={1.0} />
          <mesh position={orbPos} renderOrder={11}>
            <sphereGeometry args={[breath, 30, 30]} />
            <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.6} metalness={0.2} roughness={0.25} depthTest={false} depthWrite={false} />
          </mesh>
        </>
      )}
    </group>
  );
}

export const Metodo3D: React.FC<Props> = ({ eyebrow, title, sub, steps }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [64, 80], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [64, 80], [28, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const subOp = interpolate(frame, [84, 98], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [88, 106], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 42% at 50% 40%, rgba(197,160,89,0.08), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-8%)" }}>
        <ThreeCanvas
          width={W}
          height={H}
          camera={{ fov: 42, position: [0, 0.2, 6.2], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Ruta frame={frame} fps={fps} steps={steps} />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.16 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, color: BRAND.white, fontWeight: 900, fontSize: 116, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "24px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
