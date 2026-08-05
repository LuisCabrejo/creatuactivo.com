import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader, SkeletonUtils } from "three-stdlib";
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

// ─────────────────────────────────────────────────────────────────────────────
// EMPRESA DIORAMA — Gráfica 1 del Slide 1 (servilleta).
// "La empresa de toda la vida": fábrica + montacargas + trabajadores + el DUEÑO.
// Recoloreado a bimetálico (carbón + dorado el dueño). Se arma, vive, y cuando el
// DUEÑO se va de cuadro → TODO se apaga (la dependencia: sin usted, se detiene).
//
// CLAVE: los bbox en runtime son poco fiables (skinned colapsa la bind-pose a ~0;
// el forklift está modelado en x=54). Por eso usamos GEOMETRÍAS MEDIDAS OFFLINE
// (altura/centro/base reales) para escalar y centrar de forma determinística.
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const CHARCOAL = "#3c4654";
const FPS = 30;
const T_LIVE = Math.round(3.0 * FPS); // el dueño empieza a irse
const T_OFF = Math.round(3.9 * FPS);

// geometría real medida (a escala 1): altura, centro x/z, base y
const GEO: Record<string, { H: number; cx: number; cz: number; minY: number }> = {
  "factory.glb": { H: 1.69, cx: 0.02, cz: -0.17, minY: -0.64 },
  "forklift.glb": { H: 1.42, cx: 54.25, cz: 3.04, minY: 0.02 },
  "worker.glb": { H: 1.87, cx: 0.0, cz: 0.09, minY: 0.0 },
  "worker-f.glb": { H: 1.86, cx: 0.0, cz: 0.09, minY: 0.0 },
};

type Item = {
  key: string;
  url: string;
  h: number; // altura objetivo en escena
  pos: [number, number]; // x, z en el piso
  rotY: number; // grados
  fin: number; // frame de aparición
  gold?: boolean;
  owner?: boolean;
};

const LAYOUT: Item[] = [
  { key: "factory", url: "factory.glb", h: 3.6, pos: [0, -1.6], rotY: -14, fin: 0 },
  { key: "forklift", url: "forklift.glb", h: 1.15, pos: [1.9, 1.4], rotY: -120, fin: 14 },
  { key: "workerA", url: "worker-f.glb", h: 1.18, pos: [-1.9, 1.9], rotY: 28, fin: 20 },
  { key: "workerB", url: "worker-f.glb", h: 1.16, pos: [1.1, 2.5], rotY: -18, fin: 26 },
  { key: "owner", url: "worker.glb", h: 1.25, pos: [-0.55, 2.7], rotY: 8, fin: 32, gold: true, owner: true },
];

// carga las URLs únicas (GLTFLoader + delayRender) → map url→scene
function useModels(urls: string[]) {
  const [map, setMap] = useState<Record<string, THREE.Object3D> | null>(null);
  const [handle] = useState(() => delayRender("empresa-diorama"));
  useEffect(() => {
    const loader = new GLTFLoader();
    const uniq = Array.from(new Set(urls));
    const out: Record<string, THREE.Object3D> = {};
    let pending = uniq.length;
    const done = () => {
      if (--pending <= 0) {
        setMap(out);
        continueRender(handle);
      }
    };
    uniq.forEach((u) => {
      loader.load(
        staticFile(u),
        (g) => {
          out[u] = g.scene;
          done();
        },
        undefined,
        () => done()
      );
    });
  }, [handle]); // eslint-disable-line
  return map;
}

// clona (seguro para skinned) + recolorea a nuestra paleta
function prepClone(source: THREE.Object3D, gold?: boolean) {
  const clone = SkeletonUtils.clone(source);
  clone.traverse((c: any) => {
    if (c.isMesh) {
      c.material = gold
        ? new THREE.MeshStandardMaterial({
            color: new THREE.Color("#caa057"),
            metalness: 0.12,
            roughness: 0.5,
            emissive: new THREE.Color(GOLD),
            emissiveIntensity: 0.4,
          })
        : new THREE.MeshStandardMaterial({ color: new THREE.Color(CHARCOAL), metalness: 0.28, roughness: 0.55 });
    }
  });
  return clone;
}

function ModelItem({ item, source, frame }: { item: Item; source: THREE.Object3D; frame: number }) {
  const clone = React.useMemo(() => prepClone(source, item.gold), [source, item.gold]);
  const geo = GEO[item.url];
  const s = item.h / geo.H;

  // armado con overshoot
  const grow = interpolate(frame, [item.fin, item.fin + 9, item.fin + 16], [0, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // dueño: sale de cuadro tras T_LIVE
  let dx = 0,
    dz = 0;
  if (item.owner && frame >= T_LIVE) {
    const t = (frame - T_LIVE) / FPS;
    dx = interpolate(t, [0, 0.9], [0, -5.4], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
    dz = interpolate(t, [0, 0.9], [0, 1.6], { extrapolateRight: "clamp" });
  }

  if (grow <= 0.001) return null;
  const sc = s * grow;

  return (
    <group position={[item.pos[0] + dx, 0, item.pos[1] + dz]} rotation={[0, (item.rotY * Math.PI) / 180, 0]} scale={[sc, sc, sc]}>
      {/* recentrado determinístico: centro→origen, base→y=0 */}
      <group position={[-geo.cx, -geo.minY, -geo.cz]}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

function Scene({ frame }: { frame: number }) {
  const models = useModels(LAYOUT.map((l) => l.url));
  const ts = (frame - T_LIVE) / FPS;
  const power =
    frame < T_LIVE
      ? 1
      : interpolate(ts, [0, 0.75], [1, 0.05], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <group position={[0, -0.35, 0]}>
      <ambientLight intensity={0.95 * (0.4 + 0.6 * power)} />
      <directionalLight position={[5, 9, 6]} intensity={2.8 * (0.35 + 0.65 * power)} color={"#eef2f8"} />
      <directionalLight position={[2, 2.5, 7]} intensity={1.4 * (0.4 + 0.6 * power)} color={"#cfe0ff"} />
      {/* relleno frontal: ilumina el patio */}
      <directionalLight position={[0, 3, 9]} intensity={1.3 * (0.4 + 0.6 * power)} color={"#d8e2f0"} />
      <directionalLight position={[-6, 4, -3]} intensity={1.5 * power} color={GOLD_HOT} />
      {/* piso */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color={"#0d1015"} metalness={0.35} roughness={0.78} transparent opacity={0.7} />
      </mesh>
      {models &&
        LAYOUT.map((item) =>
          models[item.url] ? <ModelItem key={item.key} item={item} source={models[item.url]} frame={frame} /> : null
        )}
    </group>
  );
}

export const EmpresaDiorama3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  const labelOp =
    frame < 42
      ? 0
      : frame < T_LIVE
      ? interpolate(frame, [42, 54], [0, 1], { extrapolateRight: "clamp" })
      : interpolate((frame - T_LIVE) / FPS, [0.15, 0.55], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelX = interpolate((frame - T_LIVE) / FPS, [0, 0.7], [0, -150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 64% 52% at 50% 46%, rgba(148,163,184,0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />
      <ThreeCanvas width={W} height={H} camera={{ fov: 36, position: [0, 4.8, 13.5] }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
        <Scene frame={frame} />
      </ThreeCanvas>
      <AbsoluteFill style={{ boxShadow: "inset 0 0 200px 30px rgba(0,0,0,0.6)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ transform: `translate(${labelX}px, 235px)`, opacity: labelOp, fontFamily: FONTS.sans, fontSize: 38, fontWeight: 900, letterSpacing: 3, color: GOLD_HOT, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          USTED
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ top: 78, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 40, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", textShadow: "0 2px 14px rgba(0,0,0,0.85)", height: 50 }}>
        LA EMPRESA DE TODA LA VIDA
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
