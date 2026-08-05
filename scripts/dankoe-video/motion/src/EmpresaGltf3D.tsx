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
import { Html } from "@react-three/drei";

// ─────────────────────────────────────────────────────────────────────────────
// EMPRESA DIORAMA (Remotion + GLB importados) — Gráfica 1 del Slide 1.
// Carga modelos .glb (Meshy/Tripo), los compone, anima (armado → el dueño se va →
// TODO se apaga) y se renderiza como video. Pipeline PROBADO (delayRender + render).
//
// Para usar tus modelos reales: pon los .glb en motion/public/ y cambia `url`.
// Mientras, usa "test.glb" (placeholder) para validar composición/animación.
// ─────────────────────────────────────────────────────────────────────────────

const GOLD_HOT = "#E6B45A";

// modelo → archivo, altura objetivo, posición (x,z en el piso), rot Y deg, frame_in, dueño
type Item = { key: string; url: string; h: number; pos: [number, number]; rotY: number; fin: number; owner?: boolean };

const PLACEHOLDER = "test.glb"; // astronauta — reemplazar por tienda/camion/etc.

const LAYOUT: Item[] = [
  { key: "tienda", url: PLACEHOLDER, h: 2.2, pos: [0, -0.4], rotY: 0, fin: 0 },
  { key: "camionIzq", url: PLACEHOLDER, h: 1.3, pos: [-2.3, 0.1], rotY: 35, fin: 10 },
  { key: "camionDer", url: PLACEHOLDER, h: 1.3, pos: [2.3, 0.1], rotY: -35, fin: 16 },
  { key: "cajas", url: PLACEHOLDER, h: 1.0, pos: [-1.4, 0.9], rotY: 12, fin: 26 },
  { key: "trab1", url: PLACEHOLDER, h: 1.2, pos: [-0.9, 1.1], rotY: 22, fin: 20 },
  { key: "trab2", url: PLACEHOLDER, h: 1.2, pos: [1.0, 1.2], rotY: -18, fin: 24 },
  { key: "dueno", url: PLACEHOLDER, h: 1.5, pos: [0, 1.9], rotY: 0, fin: 30, owner: true },
];

const FPS = 30;
const T_LIVE = Math.round(2.6 * FPS); // el dueño empieza a irse
const T_OFF = Math.round(3.4 * FPS); // todo apagado

// hook: carga todas las URLs únicas (GLTFLoader + delayRender) y devuelve un map url→scene
function useModels(urls: string[]) {
  const [map, setMap] = useState<Record<string, THREE.Object3D> | null>(null);
  const [handle] = useState(() => delayRender("empresa-gltf"));
  useEffect(() => {
    const loader = new GLTFLoader();
    const uniq = Array.from(new Set(urls));
    const out: Record<string, THREE.Object3D> = {};
    let pending = uniq.length;
    if (pending === 0) {
      setMap({});
      continueRender(handle);
      return;
    }
    uniq.forEach((u) => {
      loader.load(
        staticFile(u),
        (g) => {
          out[u] = g.scene;
          if (--pending === 0) {
            setMap(out);
            continueRender(handle);
          }
        },
        undefined,
        () => {
          if (--pending === 0) {
            setMap(out);
            continueRender(handle);
          }
        }
      );
    });
  }, [handle]); // eslint-disable-line
  return map;
}

// normaliza un objeto a una altura objetivo y devuelve el factor de escala
function fitScale(obj: THREE.Object3D, targetH: number) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  const h = Math.max(size.y, 1e-4);
  return targetH / h;
}

function ModelItem({ item, source, power, frame }: { item: Item; source: THREE.Object3D; power: number; frame: number }) {
  const clone = React.useMemo(() => source.clone(true), [source]);
  const baseScale = React.useMemo(() => fitScale(clone, item.h), [clone, item.h]);

  // armado con overshoot
  const grow = interpolate(frame, [item.fin, item.fin + 9, item.fin + 15], [0, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const s = baseScale * grow;

  // dueño: sale de cuadro tras T_LIVE
  let dx = 0,
    dz = 0,
    op = 1;
  if (item.owner) {
    const t = (frame - T_LIVE) / FPS;
    if (frame >= T_LIVE) {
      dx = interpolate(t, [0, 0.9], [0, 5.0], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
      dz = interpolate(t, [0, 0.9], [0, 1.0], { extrapolateRight: "clamp" });
      op = interpolate(t, [0.55, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
  }

  return (
    <group
      position={[item.pos[0] + dx, 0, item.pos[1] + dz]}
      rotation={[0, (item.rotY * Math.PI) / 180, 0]}
      scale={[s, s, s]}
      visible={op > 0.02}
    >
      <primitive object={clone} />
      {item.owner && grow > 0.3 && op > 0.2 && (
        <Html position={[0, item.h + 0.25, 0]} center transform={false} zIndexRange={[100, 0]}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 36, fontWeight: 900, letterSpacing: 2, color: GOLD_HOT, opacity: op, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>USTED</div>
        </Html>
      )}
    </group>
  );
}

function Scene({ frame, models }: { frame: number; models: Record<string, THREE.Object3D> }) {
  const ts = (frame - T_LIVE) / FPS;
  const power = frame < T_LIVE ? 1 : interpolate(ts, [0, 0.75], [1, 0.05], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <group>
      <ambientLight intensity={0.55 * (0.35 + 0.65 * power)} />
      <directionalLight position={[3.5, 6, 4]} intensity={1.7 * (0.3 + 0.7 * power)} color={"#e7ecf3"} />
      <directionalLight position={[-4, 3, -3]} intensity={0.6 * power} color={GOLD_HOT} />
      {/* piso */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={"#0f1217"} metalness={0.35} roughness={0.75} transparent opacity={0.6} />
      </mesh>
      {LAYOUT.map((item) =>
        models[item.url] ? <ModelItem key={item.key} item={item} source={models[item.url]} power={power} frame={frame} /> : null
      )}
    </group>
  );
}

export const EmpresaGltf3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const models = useModels(LAYOUT.map((l) => l.url));
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 50% at 50% 46%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <ThreeCanvas width={W} height={H} camera={{ fov: 36, position: [4.6, 4.0, 6.4] }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
        {models && <Scene frame={frame} models={models} />}
      </ThreeCanvas>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.72)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ top: 80, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 40, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.85)", height: 50 }}>
        SU EMPRESA
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
