import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useThree } from "@react-three/fiber";
import { BRAND } from "./brand";

// RUTA — el visual del bloque «su aplicación personalizada» del video «Cómo
// funciona» a 60 s (27 sep 2026). La imagen de Waze dicha en MECANISMO, sin
// texto: el orbe dorado (la persona, el mismo del universo de los clips) está
// sobre el piso de rejilla; un PIN dorado cae a lo lejos («usted le dice a
// dónde quiere llegar»); una ruta punteada se va trazando desde el orbe hasta
// el pin («Queswa le marca la ruta») y tres hitos se encienden en secuencia
// («paso a paso») mientras el orbe empieza a avanzar. La ruta se MARCA — el
// orbe no llega al pin: prometer la llegada es la silueta de la promesa de
// ingreso, y el insert respeta la misma regla que el copy.
//
// Beats anclados a la toma b05 (7.01 s · 24 fps · vo-v2 de captions/work):
//   f0–14  «Tres:» — la escena entra
//   f14–50 «su aplicación personalizada» — el orbe respira, la rejilla se aviva
//   f53    «Como en Waze» — el pin CAE con rebote
//   f77–108 «usted le dice a dónde quiere llegar» — la intención: puntos titanio tenues
//   f113–148 «y Queswa le marca la ruta» — los puntos se encienden en oro, en orden
//   f150–176 «paso a paso» — tres hitos pulsan en secuencia y el orbe avanza un tramo
// Render: npx remotion render Ruta3D out/ruta3d.mp4 --gl=angle

export const RUTA_FRAMES = 180;

const GOLD = BRAND.gold;
const GOLD_HOT = "#E6B45A";
const TITAN = BRAND.titanium;

function Glow({ position, scale, color, opacity = 1 }: { position: [number, number, number]; scale: number; color: string; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`); grad.addColorStop(0.3, `rgba(${r},${g},${b},0.45)`); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

// La ruta sobre el piso: del orbe (frente-izquierda) al pin (fondo-derecha), con curva.
const CURVA = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.42, 0.03, 0.72),
  new THREE.Vector3(-0.05, 0.03, 0.35),
  new THREE.Vector3(0.85, 0.03, -0.55),
  new THREE.Vector3(1.15, 0.03, -2.15),
]);
const N_PUNTOS = 26;
const PUNTOS = Array.from({ length: N_PUNTOS }, (_, i) => CURVA.getPoint(i / (N_PUNTOS - 1)));
const HITOS = [7, 14, 21]; // índices de los tres «paso a paso»
const PIN = PUNTOS[N_PUNTOS - 1];

function Rig({ frame }: { frame: number }) {
  const { camera } = useThree();
  const t = interpolate(frame, [110, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  camera.position.set(-0.08 + 0.3 * t, 2.05 - 0.18 * t, 5.0 - 0.5 * t);
  camera.lookAt(0.0 + 0.32 * t, 0.3, -0.1 - 0.5 * t);
  return null;
}

function Scene({ frame, fps }: { frame: number; fps: number }) {
  const appear = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // El orbe respira y, en «paso a paso», avanza el primer tramo de la ruta.
  const bob = Math.sin(frame / 14) * 0.02;
  const avance = interpolate(frame, [148, 178], [0, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const orbePos = CURVA.getPoint(avance);

  // El pin cae con rebote en «Como en Waze».
  const caida = spring({ frame: frame - 53, fps, config: { damping: 9, mass: 0.7 } });
  const pinY = interpolate(caida, [0, 1], [2.6, 0]);
  const pinVisible = frame >= 53 ? 1 : 0;
  const pinFlash = interpolate(frame, [64, 70, 84], [0, 1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // La intención (titanio, tenue) y la ruta marcada (oro, progresiva).
  const intencion = interpolate(frame, [77, 104], [0, N_PUNTOS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const trazo = interpolate(frame, [113, 148], [0, N_PUNTOS], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <color attach="background" args={[BRAND.carbon]} />
      <fog attach="fog" args={[BRAND.carbon, 7.5, 15]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} color={"#dfe5ee"} />
      <pointLight position={[orbePos.x, 0.9, orbePos.z + 0.6]} intensity={5} distance={6} color={GOLD_HOT} />

      {/* piso: plano carbón + rejilla, el mismo universo de los clips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.012, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={BRAND.carbonElevated} roughness={0.95} metalness={0.05} />
      </mesh>
      <gridHelper args={[60, 90, "#28303a", "#1b2129"]} position={[0, 0, 0]} />

      {/* el orbe (la persona) */}
      <group position={[orbePos.x, 0.2 + bob, orbePos.z]} scale={[appear, appear, appear]}>
        <mesh>
          <sphereGeometry args={[0.19, 48, 48]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.22} emissive={GOLD} emissiveIntensity={0.22 + 0.1 * Math.sin(frame / 9)} />
        </mesh>
        <Glow position={[0, 0, 0]} scale={1.15} color={GOLD_HOT} opacity={0.5 * appear} />
      </group>

      {/* la intención: puntos titanio tenues, «le dice a dónde quiere llegar» */}
      {PUNTOS.map((p, i) => {
        const on = interpolate(intencion - i, [0, 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (on <= 0) return null;
        return (
          <mesh key={`t${i}`} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color={TITAN} transparent opacity={0.32 * on} />
          </mesh>
        );
      })}

      {/* la ruta marcada: los puntos se encienden en oro, con pop */}
      {PUNTOS.map((p, i) => {
        const local = trazo - i;
        if (local <= 0) return null;
        const pop = interpolate(local, [0, 1.2, 2.4], [0.4, 1.28, 1], { extrapolateRight: "clamp" });
        const esHito = HITOS.includes(i);
        // los tres hitos re-pulsan en secuencia durante «paso a paso»
        const idxHito = HITOS.indexOf(i);
        const pulso = esHito
          ? interpolate(frame, [150 + idxHito * 9, 154 + idxHito * 9, 162 + idxHito * 9], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 0;
        const r = (esHito ? 0.046 : 0.028) * pop * (1 + 0.5 * pulso);
        return (
          <group key={`g${i}`} position={[p.x, p.y + 0.012, p.z]}>
            <mesh>
              <sphereGeometry args={[r, 16, 16]} />
              <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.3} emissive={GOLD} emissiveIntensity={0.5 + 0.8 * pulso} />
            </mesh>
            {esHito && <Glow position={[0, 0.02, 0]} scale={0.55 + 0.5 * pulso} color={GOLD_HOT} opacity={0.4 + 0.5 * pulso} />}
          </group>
        );
      })}

      {/* el pin del destino */}
      {pinVisible > 0 && (
        <group position={[PIN.x, pinY, PIN.z]}>
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} emissive={GOLD} emissiveIntensity={0.35 + 0.6 * pinFlash} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.085, 0.42, 24]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
          </mesh>
          {/* anillo en el piso donde clava */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015 - pinY, 0]}>
            <ringGeometry args={[0.12 + 0.25 * pinFlash, 0.16 + 0.3 * pinFlash, 40]} />
            <meshBasicMaterial color={GOLD_HOT} transparent opacity={0.55 * pinFlash + 0.12 * pinVisible} side={THREE.DoubleSide} />
          </mesh>
          <Glow position={[0, 0.66, 0]} scale={1.2 + 0.9 * pinFlash} color={GOLD_HOT} opacity={0.45 + 0.4 * pinFlash} />
        </group>
      )}

      <Rig frame={frame} />
    </>
  );
}

export const Ruta3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon }}>
      <ThreeCanvas width={1080} height={1920} gl={{ antialias: true }} camera={{ fov: 42, near: 0.1, far: 60 }}>
        <Scene frame={frame} fps={fps} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
