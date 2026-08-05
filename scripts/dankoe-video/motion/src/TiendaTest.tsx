import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  delayRender,
  continueRender,
  interpolate,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

// PRUEBA: importar tienda.glb (modelo real de Poly Pizza) + RECOLOR a bimetálico
// (carbón + acento dorado) + apagado. Demuestra que un modelo genérico se vuelve "nuestro".
const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const FPS = 30;
const T_LIVE = Math.round(2.8 * FPS);
const T_OFF = Math.round(3.6 * FPS);

export const TiendaTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const [scene, setScene] = useState<THREE.Object3D | null>(null);
  const [handle] = useState(() => delayRender("tienda"));

  useEffect(() => {
    new GLTFLoader().load(
      staticFile("tienda.glb"),
      (g) => {
        // RECOLOR: todo a carbón metálico (unifica a nuestra paleta)
        g.scene.traverse((c: any) => {
          if (c.isMesh) {
            c.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color("#2b323c"),
              metalness: 0.25,
              roughness: 0.55,
            });
          }
        });
        // normalizar: altura 3.0, centrar en XY, base en y=0
        const box = new THREE.Box3().setFromObject(g.scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        const s = 4.4 / Math.max(size.x, size.y, size.z, 1e-4);
        g.scene.scale.setScalar(s);
        const box2 = new THREE.Box3().setFromObject(g.scene);
        const ctr = new THREE.Vector3();
        box2.getCenter(ctr);
        g.scene.position.set(-ctr.x, -ctr.y, -ctr.z); // centrado en el origen
        setScene(g.scene);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
  }, [handle]);

  const power =
    frame < T_LIVE
      ? 1
      : interpolate((frame - T_LIVE) / FPS, [0, 0.7], [1, 0.05], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  const grid = 0.05 + 0.015 * Math.sin(frame / 22);
  const yaw = interpolate(frame, [0, 120], [-0.2, 0.15]); // leve órbita

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 50% at 50% 46%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <ThreeCanvas width={W} height={H} camera={{ fov: 34, position: [5.2, 2.2, 7.4] }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
        <ambientLight intensity={0.85 * (0.4 + 0.6 * power)} />
        <directionalLight position={[5, 8, 6]} intensity={2.6 * (0.35 + 0.65 * power)} color={"#eef2f8"} />
        <directionalLight position={[2, 2, 7]} intensity={1.2 * (0.4 + 0.6 * power)} color={"#cfe0ff"} />
        <directionalLight position={[-6, 4, -3]} intensity={1.1 * power} color={GOLD_HOT} />
        {/* piso */}
        <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 14]} />
          <meshStandardMaterial color={"#0f1217"} metalness={0.35} roughness={0.75} transparent opacity={0.6} />
        </mesh>
        {scene && <primitive object={scene} rotation={[0, yaw, 0]} position={[0, 0, 0]} />}
      </ThreeCanvas>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.72)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ top: 80, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 40, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.85)", height: 50 }}>
        SU EMPRESA
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
