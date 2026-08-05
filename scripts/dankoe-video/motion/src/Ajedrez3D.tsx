import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { BRAND } from "./brand";
import { useThree } from "@react-three/fiber";

// AJEDREZ 3D — Reel REGLAS ("el mismo tablero").
// Tablero 8x8 EXACTO por código (los modelos de imagen no dan exactitud posicional y el
// Director juega ajedrez). Orientación correcta: a1 oscura, dama en su color.
// FASE 1: la partida se juega de verdad (Gambito de Rey: 1.e4 e5 2.f4 exf4 3.Ac4 Cc6
//   4.Cf3 Ac5 5.d4) con la cámara ORBITANDO → vida, se entiende sin audio.
// El HÉROE = orbe dorado = peón blanco de e2 (juega e4 y se queda en el centro del juego).
// FASE 2: bajo el orbe crece un pedestal (la "pieza mejor") y la cámara se abre → mismo tablero.
// FASE 3: el orbe despega y abandona el tablero hacia el horizonte (cambia de juego).

const S = 0.9; // lado de casilla
const SQ_LIGHT = "#8A93A0";
const SQ_DARK = "#262B33";
const PIECE_LIGHT = "#B2BAC6";
const PIECE_DARK = "#31353F";

const matLight = new THREE.MeshStandardMaterial({ color: PIECE_LIGHT, roughness: 0.62, metalness: 0.18 });
const matDark = new THREE.MeshStandardMaterial({ color: PIECE_DARK, roughness: 0.7, metalness: 0.22 });
const matGold = new THREE.MeshStandardMaterial({ color: BRAND.gold, roughness: 0.32, metalness: 0.88 });

// file 0..7 (a..h), rank 1..8 → posición del centro de casilla (acepta floats para animar)
const px = (file: number) => (file - 3.5) * S;
const pz = (rank: number) => (4.5 - rank) * S;

type PieceType = "P" | "R" | "N" | "B" | "Q" | "K";

function Piece({ type, mat, x, z, y = 0 }: { type: PieceType; mat: THREE.Material; x: number; z: number; y?: number }) {
  return (
    <group position={[x, y, z]}>
      {type === "P" && (
        <>
          <mesh material={mat} position={[0, 0.15, 0]} castShadow><cylinderGeometry args={[0.15, 0.17, 0.3, 24]} /></mesh>
          <mesh material={mat} position={[0, 0.38, 0]} castShadow><sphereGeometry args={[0.125, 24, 18]} /></mesh>
        </>
      )}
      {type === "R" && <mesh material={mat} position={[0, 0.31, 0]} castShadow><boxGeometry args={[0.3, 0.62, 0.3]} /></mesh>}
      {type === "N" && (
        <>
          <mesh material={mat} position={[0, 0.27, 0]} castShadow><boxGeometry args={[0.26, 0.54, 0.26]} /></mesh>
          <mesh material={mat} position={[0, 0.6, 0.07]} castShadow><boxGeometry args={[0.16, 0.14, 0.24]} /></mesh>
        </>
      )}
      {type === "B" && (
        <>
          <mesh material={mat} position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.13, 0.16, 0.6, 24]} /></mesh>
          <mesh material={mat} position={[0, 0.71, 0]} castShadow><coneGeometry args={[0.115, 0.24, 24]} /></mesh>
        </>
      )}
      {type === "Q" && (
        <>
          <mesh material={mat} position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.135, 0.18, 0.8, 24]} /></mesh>
          <mesh material={mat} position={[0, 0.88, 0]} castShadow><sphereGeometry args={[0.11, 24, 18]} /></mesh>
        </>
      )}
      {type === "K" && (
        <>
          <mesh material={mat} position={[0, 0.46, 0]} castShadow><cylinderGeometry args={[0.145, 0.19, 0.92, 24]} /></mesh>
          <mesh material={mat} position={[0, 1.0, 0]} castShadow><boxGeometry args={[0.15, 0.15, 0.15]} /></mesh>
        </>
      )}
    </group>
  );
}

// ── motor de jugadas: cada pieza = casilla inicial + lista de movimientos con timing ──
type Sq = [number, number];
type Mv = { to: Sq; s: number; e: number; hop?: boolean };
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function animSquare(sq0: Sq, moves: Mv[], frame: number): { file: number; rank: number; y: number } {
  let cur = sq0;
  for (const m of moves) {
    if (frame >= m.e) { cur = m.to; continue; }
    if (frame >= m.s) {
      const raw = (frame - m.s) / (m.e - m.s);
      const t = easeInOut(raw);
      return {
        file: cur[0] + (m.to[0] - cur[0]) * t,
        rank: cur[1] + (m.to[1] - cur[1]) * t,
        y: m.hop ? Math.sin(raw * Math.PI) * 0.55 : 0,
      };
    }
    break;
  }
  return { file: cur[0], rank: cur[1], y: 0 };
}

// FASE 1 — Gambito de Rey (a=0..h=7 · rank 1..8). Hero = peón blanco e.
// retimeado para que las 9 jugadas quepan completas en el beat (~6.86s = 165f) al ritmo aprobado.
const OP_WHITE: { id: string; type: PieceType; sq: Sq; moves: Mv[]; captWin?: [number, number] }[] = [
  { id: "wPf", type: "P", sq: [5, 2], moves: [{ to: [5, 4], s: 46, e: 58 }], captWin: [72, 78] }, // f2-f4, capturado (desaparece en su sitio)
  { id: "wBc", type: "B", sq: [5, 1], moves: [{ to: [2, 4], s: 80, e: 94 }] },                    // Af1-c4
  { id: "wNf", type: "N", sq: [6, 1], moves: [{ to: [5, 3], s: 116, e: 128, hop: true }] },        // Cg1-f3
  { id: "wPd", type: "P", sq: [3, 2], moves: [{ to: [3, 4], s: 150, e: 164 }] },                   // d2-d4
];
const OP_BLACK: { id: string; type: PieceType; sq: Sq; moves: Mv[] }[] = [
  { id: "bPe", type: "P", sq: [4, 7], moves: [{ to: [4, 5], s: 28, e: 42 }, { to: [5, 4], s: 62, e: 76 }] }, // e5, exf4
  { id: "bNc", type: "N", sq: [1, 8], moves: [{ to: [2, 6], s: 98, e: 112, hop: true }] },                  // Cb8-c6
  { id: "bBc", type: "B", sq: [5, 8], moves: [{ to: [2, 5], s: 132, e: 146 }] },                            // Af8-c5
];
const HERO_MOVE: Mv[] = [{ to: [4, 4], s: 8, e: 24 }]; // e2-e4
const WHITE_BACK_STATIC: [PieceType, number][] = [["R", 0], ["N", 1], ["B", 2], ["Q", 3], ["K", 4], ["R", 7]];
const WHITE_PAWN_STATIC = [0, 1, 2, 6, 7]; // a,b,c,g,h  (d,e,f animan)
const BLACK_BACK_STATIC: [PieceType, number][] = [["R", 0], ["B", 2], ["Q", 3], ["K", 4], ["N", 6], ["R", 7]];
const BLACK_PAWN_STATIC = [0, 1, 2, 3, 5, 6, 7]; // a,b,c,d,f,g,h  (e anima)

function useBoardTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const ctx = c.getContext("2d")!;
    const q = 1024 / 8;
    for (let r = 0; r < 8; r++)
      for (let f = 0; f < 8; f++) {
        // a1 (f0,r0) OSCURA → (f+r) impar = oscura  (dama en su color · luz a la derecha)
        ctx.fillStyle = (f + r) % 2 === 1 ? SQ_DARK : SQ_LIGHT;
        ctx.fillRect(f * q, (7 - r) * q, q, q);
      }
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function useFloorTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#171a20";
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(230,235,245,0.22)";
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      const p = (i * 512) / 4;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(512, p); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(14, 14);
    return tex;
  }, []);
}

function Rig({ fase }: { fase: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { camera } = useThree();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { easing: Easing.inOut(Easing.ease) });
  if (fase === 1) {
    const ang = -0.03 + t * 0.34; // órbita lenta → vida
    const R = 21.5;
    camera.position.set(Math.sin(ang) * R, 10.6 - 0.7 * t, Math.cos(ang) * R);
    camera.lookAt(-0.1, 1.5, -0.2);
  } else if (fase === 2) {
    camera.position.set(2.1 + 0.5 * t, 8.6 + 1.5 * t, 16.6 + 4.8 * t);
    camera.lookAt(-0.35, 1.8, -0.6);
  } else {
    camera.position.set(2.6 + 1.6 * t, 9.6 + 2.6 * t, 19.0 - 2.2 * t);
    camera.lookAt(-0.35 + 2.6 * t, 1.8 + 2.6 * t, -0.6 - 6.5 * t);
  }
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 8, 5]} intensity={1.7} color={"#e8edf5"} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.55} color={"#9aa6b8"} />
    </>
  );
}

function Board({ board, floor }: { board: THREE.Texture; floor: THREE.Texture }) {
  return (
    <>
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial map={floor} roughness={0.88} metalness={0.25} />
      </mesh>
      <mesh position={[0, -0.01, 0]} receiveShadow castShadow>
        <boxGeometry args={[8 * S + 0.5, 0.28, 8 * S + 0.5]} />
        <meshStandardMaterial color={"#20242b"} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.132, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8 * S, 8 * S]} />
        <meshStandardMaterial map={board} roughness={0.55} metalness={0.2} />
      </mesh>
    </>
  );
}

function SceneFase1() {
  const frame = useCurrentFrame();
  const board = useBoardTexture();
  const floor = useFloorTexture();
  const hero = animSquare([4, 2], HERO_MOVE, frame);

  return (
    <>
      <Lights />
      <pointLight position={[px(hero.file), 1.1, pz(hero.rank)]} intensity={1.5} distance={3.0} color={"#E6B45A"} />
      <Board board={board} floor={floor} />
      <group position={[0, 0.14, 0]}>
        {WHITE_BACK_STATIC.map(([tp, f]) => <Piece key={`ws${f}`} type={tp} mat={matLight} x={px(f)} z={pz(1)} />)}
        {WHITE_PAWN_STATIC.map((f) => <Piece key={`wps${f}`} type="P" mat={matLight} x={px(f)} z={pz(2)} />)}
        {BLACK_BACK_STATIC.map(([tp, f]) => <Piece key={`bs${f}`} type={tp} mat={matDark} x={px(f)} z={pz(8)} />)}
        {BLACK_PAWN_STATIC.map((f) => <Piece key={`bps${f}`} type="P" mat={matDark} x={px(f)} z={pz(7)} />)}
        {OP_WHITE.map((p) => {
          const a = animSquare(p.sq, p.moves, frame);
          const sc = p.captWin ? 1 - interpolate(frame, p.captWin, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
          if (sc <= 0.01) return null;
          // escala EN SU SITIO (group posicionado) → desaparece sin correrse al centro
          return (
            <group key={p.id} position={[px(a.file), a.y, pz(a.rank)]} scale={[sc, sc, sc]}>
              <Piece type={p.type} mat={matLight} x={0} z={0} />
            </group>
          );
        })}
        {OP_BLACK.map((p) => {
          const a = animSquare(p.sq, p.moves, frame);
          return <Piece key={p.id} type={p.type} mat={matDark} x={px(a.file)} z={pz(a.rank)} y={a.y} />;
        })}
        <mesh material={matGold} position={[px(hero.file), 0.24, pz(hero.rank)]} castShadow>
          <sphereGeometry args={[0.24, 40, 30]} />
        </mesh>
      </group>
    </>
  );
}

// posición FINAL del Gambito de Rey (continuidad: donde terminó la fase 1) — el orbe = e4
const FINAL_WHITE: { type: PieceType; sq: Sq }[] = [
  { type: "R", sq: [0, 1] }, { type: "N", sq: [1, 1] }, { type: "B", sq: [2, 1] }, { type: "Q", sq: [3, 1] }, { type: "K", sq: [4, 1] }, { type: "R", sq: [7, 1] },
  { type: "P", sq: [0, 2] }, { type: "P", sq: [1, 2] }, { type: "P", sq: [2, 2] }, { type: "P", sq: [6, 2] }, { type: "P", sq: [7, 2] },
  { type: "B", sq: [2, 4] }, { type: "N", sq: [5, 3] }, { type: "P", sq: [3, 4] }, // Ac4, Cf3, d4
];
const FINAL_BLACK: { type: PieceType; sq: Sq }[] = [
  { type: "R", sq: [0, 8] }, { type: "B", sq: [2, 8] }, { type: "Q", sq: [3, 8] }, { type: "K", sq: [4, 8] }, { type: "N", sq: [6, 8] }, { type: "R", sq: [7, 8] },
  { type: "P", sq: [0, 7] }, { type: "P", sq: [1, 7] }, { type: "P", sq: [2, 7] }, { type: "P", sq: [3, 7] }, { type: "P", sq: [5, 7] }, { type: "P", sq: [6, 7] }, { type: "P", sq: [7, 7] },
  { type: "N", sq: [2, 6] }, { type: "B", sq: [2, 5] }, { type: "P", sq: [5, 4] }, // Cc6, Ac5, peón que capturó en f4
];

// posición tras 5…Ab6 6.Axf4 (fin de fase 2 = inicio de fase 3)
const POS_AFTER_WHITE = FINAL_WHITE.map((p) => (p.type === "B" && p.sq[0] === 2 && p.sq[1] === 1 ? { type: "B" as PieceType, sq: [5, 4] as Sq } : p));
const POS_AFTER_BLACK = FINAL_BLACK
  .filter((p) => !(p.type === "P" && p.sq[0] === 5 && p.sq[1] === 4)) // peón f4 capturado
  .map((p) => (p.type === "B" && p.sq[0] === 2 && p.sq[1] === 5 ? { type: "B" as PieceType, sq: [1, 6] as Sq } : p));

// FASE 2 — sigue la partida (5…Ab6 6.Axf4) mientras crece el pedestal bajo el orbe.
function SceneFase2() {
  const frame = useCurrentFrame();
  const board = useBoardTexture();
  const floor = useFloorTexture();

  const bBishop = animSquare([2, 5], [{ to: [1, 6], s: 18, e: 38 }], frame);          // Ac5-b6
  const wBishop = animSquare([2, 1], [{ to: [5, 4], s: 46, e: 66 }], frame);          // Ac1xf4
  const f4Sc = 1 - interpolate(frame, [58, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // peón f4 capturado
  const pedestal = interpolate(frame, [72, 112], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const pedH = 1.15 * pedestal;

  const wStatic = FINAL_WHITE.filter((p) => !(p.type === "B" && p.sq[0] === 2 && p.sq[1] === 1));
  const bStatic = FINAL_BLACK.filter((p) => !((p.type === "B" && p.sq[0] === 2 && p.sq[1] === 5) || (p.type === "P" && p.sq[0] === 5 && p.sq[1] === 4)));

  return (
    <>
      <Lights />
      <pointLight position={[px(4), 1.1, pz(4)]} intensity={1.6} distance={3.2} color={"#E6B45A"} />
      <Board board={board} floor={floor} />
      <group position={[0, 0.14, 0]}>
        {wStatic.map((p, i) => <Piece key={`fw${i}`} type={p.type} mat={matLight} x={px(p.sq[0])} z={pz(p.sq[1])} />)}
        {bStatic.map((p, i) => <Piece key={`fb${i}`} type={p.type} mat={matDark} x={px(p.sq[0])} z={pz(p.sq[1])} />)}
        {/* jugadas fase 2 */}
        <Piece type="B" mat={matDark} x={px(bBishop.file)} z={pz(bBishop.rank)} />
        <Piece type="B" mat={matLight} x={px(wBishop.file)} z={pz(wBishop.rank)} />
        {f4Sc > 0.01 && (
          <group position={[px(5), 0, pz(4)]} scale={[f4Sc, f4Sc, f4Sc]}><Piece type="P" mat={matDark} x={0} z={0} /></group>
        )}
        {pedestal > 0 && (
          <mesh material={matLight} position={[px(4), pedH / 2 + 0.001, pz(4)]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, Math.max(pedH, 0.001), 28]} />
          </mesh>
        )}
        <mesh material={matGold} position={[px(4), 0.24 + pedH, pz(4)]} castShadow>
          <sphereGeometry args={[0.24, 40, 30]} />
        </mesh>
      </group>
    </>
  );
}

// FASE 3 — el orbe (ya sobre pedestal) despega y abandona el tablero. Despegue retrasado + rápido.
function SceneFase3() {
  const frame = useCurrentFrame();
  const board = useBoardTexture();
  const floor = useFloorTexture();

  const pedH = 1.15;
  const lift = interpolate(frame, [40, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const glide = interpolate(frame, [72, 138], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const orbY = 0.24 + pedH + lift * 2.6 + glide * 1.6;
  const orbX = px(4) + glide * 3.4;
  const orbZ = pz(4) - glide * 10.5;

  return (
    <>
      <Lights />
      <pointLight position={[orbX, 1.1 + orbY, orbZ]} intensity={1.6} distance={4.0} color={"#E6B45A"} />
      <Board board={board} floor={floor} />
      <group position={[0, 0.14, 0]}>
        {POS_AFTER_WHITE.map((p, i) => <Piece key={`fw${i}`} type={p.type} mat={matLight} x={px(p.sq[0])} z={pz(p.sq[1])} />)}
        {POS_AFTER_BLACK.map((p, i) => <Piece key={`fb${i}`} type={p.type} mat={matDark} x={px(p.sq[0])} z={pz(p.sq[1])} />)}
        {/* pedestal queda en e4; el orbe despega de él */}
        <mesh material={matLight} position={[px(4), pedH / 2 + 0.001, pz(4)]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, pedH, 28]} />
        </mesh>
        <mesh material={matGold} position={[orbX, orbY, orbZ]} castShadow>
          <sphereGeometry args={[0.24, 40, 30]} />
        </mesh>
      </group>
    </>
  );
}

export const AJEDREZ_FRAMES = 192;

export const Ajedrez3D: React.FC<{ fase?: number }> = ({ fase = 1 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 40%, rgba(148,163,184,0.08), transparent 70%)` }} />
      <ThreeCanvas width={1080} height={1920} gl={{ antialias: true }} camera={{ fov: fase === 1 ? 34 : 36, near: 0.1, far: 100 }} shadows>
        <Rig fase={fase} />
        {fase === 1 ? <SceneFase1 /> : fase === 2 ? <SceneFase2 /> : <SceneFase3 />}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
