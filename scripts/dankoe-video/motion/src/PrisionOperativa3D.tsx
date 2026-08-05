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

type Props = { eyebrow: string; title: string; sub: string; towerLabel: string; orbLabel: string };

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

function Scene({ frame, fps, towerLabel, orbLabel }: { frame: number; fps: number; towerLabel: string; orbLabel: string }) {
  const baseY = -1.45;
  const orbR = 0.36;
  const orbCenterY = baseY + orbR;          // orbe = piedra clave en la base
  const towerBottom = orbCenterY + orbR;     // la torre descansa sobre el orbe
  const slabH = 0.5;
  const slabs = [0, 1, 2, 3];                // 4 losas = la empresa

  const inOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const removeStart = Math.round(2.9 * fps);   // retiramos el orbe un poco más tarde
  const tf = Math.max(0, frame - removeStart);
  const ts = tf / fps;
  const preSway = Math.sin(frame / 8) * 0.03;  // leve balanceo precario antes

  // orbe (USTED) rueda fuera y se apaga, pero queda en cuadro
  const orbX = frame < removeStart ? preSway * 0.5 : interpolate(ts, [0, 0.7], [0, 1.25], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const orbRot = frame < removeStart ? 0 : -ts * 6.0;
  const orbOp = frame < removeStart ? 1 : interpolate(ts, [0, 0.5, 1.0], [1, 1, 0.12], { extrapolateRight: "clamp" });

  // torre: sin el apoyo NO cae — se asienta sobre su base y queda TAMBALEANDO
  const settle = frame < removeStart ? 0 : interpolate(ts, [0, 0.5], [0, 2 * orbR], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const wobAmp = frame < removeStart ? 0 : interpolate(ts, [0.45, 1.0], [0, 0.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wob = Math.sin((tf - 0.45 * fps) * (Math.PI * 2 / (0.9 * fps))) * wobAmp; // teeter sostenido
  const tilt = frame < removeStart ? preSway * 0.4 : wob;
  const drop = settle;                         // baja a su base, no se desploma
  const towerX = frame < removeStart ? preSway : 0;

  const breath = orbR + 0.02 * Math.sin(frame / 5);

  return (
    <group scale={[inOp, inOp, inOp]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 5, 4]} intensity={1.4} color={"#dfe5ee"} />
      <pointLight position={[orbX, orbCenterY, 1]} intensity={6} distance={4} color={GOLD_HOT} />

      {/* piso */}
      <mesh position={[0, baseY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color={"#15181e"} metalness={0.3} roughness={0.85} transparent opacity={0.6} />
      </mesh>

      {/* TORRE = la empresa (pivota desde su base) */}
      <group position={[towerX, towerBottom - drop, 0]} rotation={[0, 0, tilt]}>
        {slabs.map((i) => (
          <RoundedBox key={i} args={[1.5, slabH - 0.06, 0.7]} radius={0.04} smoothness={3} position={[0, slabH * i + slabH / 2, 0]}>
            <meshStandardMaterial color={i % 2 ? "#222730" : "#1b1f27"} metalness={0.55} roughness={0.45} emissive={"#0c0e12"} emissiveIntensity={0.4} />
          </RoundedBox>
        ))}
        {/* ventanas doradas tenues (lectura de "edificio/empresa") */}
        {slabs.map((i) =>
          [-0.45, 0, 0.45].map((x, j) => (
            <mesh key={`${i}-${j}`} position={[x, slabH * i + slabH / 2, 0.36]}>
              <boxGeometry args={[0.18, 0.16, 0.02]} />
              <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.5} />
            </mesh>
          ))
        )}
        <Html position={[0, slabH * 4 + 0.5, 0]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 40, fontWeight: 900, letterSpacing: 2, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{towerLabel}</div>
        </Html>
      </group>

      {/* ORBE = USTED (la única piedra clave) */}
      <group>
        <Glow position={new THREE.Vector3(orbX, orbCenterY, 0)} scale={1.5} opacity={orbOp} />
        <mesh position={[orbX, orbCenterY, 0]} rotation={[0, 0, orbRot]} renderOrder={11}>
          <sphereGeometry args={[breath, 36, 36]} />
          <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.5} metalness={0.2} roughness={0.28} transparent opacity={orbOp} depthWrite={false} />
        </mesh>
        {orbOp > 0.1 && (
          <Html position={[orbX, orbCenterY - 0.7, 0]} center transform={false} zIndexRange={[100, 0]}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 44, fontWeight: 900, letterSpacing: 2, color: GOLD_HOT, opacity: orbOp, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>{orbLabel}</div>
          </Html>
        )}
      </group>
    </group>
  );
}

export const PrisionOperativa3D: React.FC<Props> = ({ towerLabel, orbLabel }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  // sin bloque de texto inferior: la gráfica (torre que tambalea) + audio cuentan el mensaje;
  // solo se conservan los rótulos SU EMPRESA / USTED ampliados sobre los objetos.
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 58% 45% at 50% 42%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(2%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0.4, 6.4], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} towerLabel={towerLabel} orbLabel={orbLabel} />
        </ThreeCanvas>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
