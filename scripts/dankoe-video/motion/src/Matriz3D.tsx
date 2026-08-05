import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";
import LAND from "./landDots.json";

type Props = { eyebrow: string; count: number; unit: string; sub: string };

const R = 1.32;            // radio del globo (reducido para mobile)
const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";

// lat/lon -> vector unitario en la esfera. z negado (long. invertida) para que
// AMÉRICA quede al frente vista DESDE AFUERA (no en espejo) y este/oeste correctos.
const ll = (lat: number, lon: number) => {
  const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
};

// nodos de operación (varios en AMÉRICA, que queda al frente)
const OPS: [number, number][] = [
  [40.7, -74], [19.4, -99], [4.7, -74], [-23.5, -46.6], [34, -118], [-34.6, -58.4], // América
  [51.5, 0], [40.4, -3.7], [6.5, 3.4], [25, 55], [19, 72.8], [1.3, 103.8], [35.7, 139.7], [-33.9, 151.2], // global
];

function slerpArc(a: THREE.Vector3, b: THREE.Vector3, lift: number, seg = 44): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  const omega = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  const so = Math.sin(omega);
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const k1 = so < 1e-4 ? 1 - t : Math.sin((1 - t) * omega) / so;
    const k2 = so < 1e-4 ? t : Math.sin(t * omega) / so;
    out.push(a.clone().multiplyScalar(k1).add(b.clone().multiplyScalar(k2)).normalize().multiplyScalar(R * lift));
  }
  return out;
}

function Glow({ position, scale }: { position: THREE.Vector3; scale: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(230,180,90,0.95)"); g.addColorStop(0.3, "rgba(213,160,89,0.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent />
    </sprite>
  );
}

function LandDots({ op }: { op: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    (LAND as number[][]).forEach((p, i) => {
      m.makeTranslation(p[0] * R, p[1] * R, -p[2] * R); // z negado: América al frente sin espejo
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined as any, undefined as any, (LAND as number[][]).length]}>
      <sphereGeometry args={[0.013, 6, 6]} />
      <meshStandardMaterial color={"#6b7686"} emissive={"#39424f"} emissiveIntensity={0.5} transparent opacity={op} />
    </instancedMesh>
  );
}

function Globe({ frame }: { frame: number }) {
  const ops = useMemo(() => OPS.map(([la, lo]) => ll(la, lo)), []);
  const arcs = useMemo(() => {
    const pairs = [[0, 2], [2, 3], [1, 7], [5, 9], [10, 12], [0, 6]];
    return pairs.map(([i, j]) => slerpArc(ops[i], ops[j], 1.05));
  }, [ops]);

  const dotsOp = interpolate(frame, [6, 30], [0, 1], { extrapolateRight: "clamp" });
  const appear = (i: number) => interpolate(frame, [18 + i * 1.6, 30 + i * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // AMÉRICA al frente vista desde afuera (sin giro de 180°); giro lento
  return (
    <group rotation={[0.22, frame * 0.0024, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} color={"#dfe5ee"} />
      <pointLight position={[-3, -1, 3]} intensity={1.6} distance={9} color={GOLD} />

      {/* globo sólido oscuro */}
      <mesh>
        <sphereGeometry args={[R * 0.97, 48, 48]} />
        <meshStandardMaterial color={"#12151b"} metalness={0.5} roughness={0.7} />
      </mesh>
      {/* continentes con puntos */}
      <LandDots op={dotsOp} />

      {/* arcos de suministro + pulso viajando */}
      {arcs.map((pts, i) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const op = appear(i + 6) * 0.5;
        const tp = ((frame * 0.9 + i * 11) % 60) / 60;
        const pulse = curve.getPoint(tp);
        return (
          <group key={`arc${i}`}>
            <mesh>
              <tubeGeometry args={[curve, 50, 0.006, 6, false]} />
              <meshBasicMaterial color={GOLD} transparent opacity={op} />
            </mesh>
            {op > 0.1 && (
              <mesh position={pulse} renderOrder={6}>
                <sphereGeometry args={[0.03, 12, 12]} />
                <meshBasicMaterial color={GOLD_HOT} depthTest={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* nodos de operación (dorados, brillan, pulsan) */}
      {ops.map((p, i) => {
        const ap = appear(i);
        if (ap <= 0.01) return null;
        const pulse = 0.6 + 0.4 * Math.sin(frame / 6 + i * 1.3);
        const pos = p.clone().multiplyScalar(R * 1.01);
        return (
          <group key={`op${i}`}>
            <Glow position={pos} scale={0.3 * ap * (0.8 + pulse * 0.4)} />
            <mesh position={pos} renderOrder={6}>
              <sphereGeometry args={[0.032 * ap, 16, 16]} />
              <meshBasicMaterial color={GOLD_HOT} depthTest={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export const Matriz3D: React.FC<Props> = ({ eyebrow, count, unit, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  const counter = Math.round(interpolate(frame, [22, 60], [0, count], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [44, 58], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [48, 66], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-8%)" }}>
        <ThreeCanvas
          width={W}
          height={H}
          camera={{ fov: 42, position: [0, 0.2, 6.6], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Globe frame={frame} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || unit || sub) && (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.14 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 16 }}>{eyebrow}</div>
        <div style={{ color: BRAND.white, fontWeight: 900, fontSize: 150, lineHeight: 1, display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ color: BRAND.gold }}>{counter}</span>
          <span style={{ fontSize: 64 }}>{unit}</span>
        </div>
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "22px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
