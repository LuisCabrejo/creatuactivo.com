import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { BRAND, FONTS } from "./brand";

// PULSO — villano propio del nicho NETWORKERS: la conversión hecha "A PULSO" que NO SE
// DUPLICA. Una cadena de relevo de su equipo (orbes): usted (front, dorado) convierte
// a su prospecto con ESFUERZO visible (pulso fuerte). El chispazo del método intenta
// pasar al siguiente miembro, pero se DEBILITA en cada relevo y se ROMPE en rojo a media
// cadena: los miembros de atrás quedan a oscuras y sus prospectos nunca se encienden.
// Lectura sin texto: el esfuerzo no se transfiere → no se duplica. NO es pirámide/downline
// (relevo horizontal, orbes idénticos), es el fracaso de la réplica manual.

type Props = { eyebrow: string; title: string; sub: string };

const GOLD = "#C5A059";
const GOLD_HOT = "#E6B45A";
const TITAN = "#94A3B8";
const ALERT = "#F43F5E";

function Glow({ position, scale, color, opacity = 1 }: { position: THREE.Vector3; scale: number; color: string; opacity?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const col = new THREE.Color(color);
    const r = Math.round(col.r * 255), g = Math.round(col.g * 255), b = Math.round(col.b * 255);
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`); grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`); grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, [color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]} renderOrder={5}>
      <spriteMaterial map={tex} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} transparent opacity={opacity} />
    </sprite>
  );
}

// 6 estaciones (miembros del equipo) en relevo horizontal, leve arco. Spread acotado a
// ±1.7 porque en vertical 9:16 el FOV horizontal solo deja ver ~±2.3 a esta distancia.
const STATIONS = [
  { x: -1.70, y: 0.04 },
  { x: -1.02, y: 0.20 },
  { x: -0.34, y: 0.26 },
  { x: 0.34, y: 0.24 },
  { x: 1.02, y: 0.14 },
  { x: 1.70, y: -0.04 },
];
// fuerza de conversión heredada: solo los 3 primeros encienden, decreciendo; el resto muere.
const STRENGTH = [1.0, 0.6, 0.3, 0.0, 0.0, 0.0];
// frame en que el chispazo "llega" a cada estación
const LIT_AT = [22, 56, 90, 120, 9999, 9999];
const BREAK_SEG = 2; // el relevo se rompe entre la estación 2 y la 3
const BREAK_AT = 120;

function Scene({ frame, fps }: { frame: number; fps: number }) {
  const inS = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const scaleIn = interpolate(inS, [0, 1], [0.7, 1]);
  const appear = interpolate(frame, [6, 22], [0, 1], { extrapolateRight: "clamp" });

  // chispazo viajero: posición a lo largo de la cadena (índice fraccional), avanza y se detiene en el quiebre
  const travel = interpolate(
    frame,
    [LIT_AT[0], LIT_AT[1], LIT_AT[2], BREAK_AT, BREAK_AT + 14],
    [0, 1, 2, 2.55, 2.62],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sparkAlive = interpolate(frame, [BREAK_AT, BREAK_AT + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const breakFlash = interpolate(frame, [BREAK_AT - 4, BREAK_AT + 4, BREAK_AT + 22], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // posición interpolada del chispazo
  const si = Math.max(0, Math.min(STATIONS.length - 1.001, travel));
  const i0 = Math.floor(si), i1 = Math.min(i0 + 1, STATIONS.length - 1), t = si - i0;
  const sparkX = THREE.MathUtils.lerp(STATIONS[i0].x, STATIONS[i1].x, t);
  const sparkY = THREE.MathUtils.lerp(STATIONS[i0].y, STATIONS[i1].y, t) + 0.0;

  return (
    <group scale={[scaleIn, scaleIn, scaleIn]} position={[0, -0.1, 0]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} color={"#dfe5ee"} />
      <pointLight position={[STATIONS[0].x, STATIONS[0].y, 1.4]} intensity={7} distance={7} color={GOLD_HOT} />

      {/* segmentos de relevo entre estaciones */}
      {STATIONS.slice(0, -1).map((s, i) => {
        const n = STATIONS[i + 1];
        const mid = new THREE.Vector3((s.x + n.x) / 2, (s.y + n.y) / 2, 0);
        const len = Math.hypot(n.x - s.x, n.y - s.y);
        const ang = Math.atan2(n.y - s.y, n.x - s.x);
        const passed = interpolate(travel, [i, i + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const segStrength = Math.min(STRENGTH[i], STRENGTH[i + 1] + 0.18);
        let col = new THREE.Color(GOLD).lerp(new THREE.Color(TITAN), 1 - segStrength);
        let op = (0.12 + 0.6 * segStrength) * passed * appear;
        let lenScale = 0.86;
        if (i === BREAK_SEG) {
          // hasta el quiebre se ve como un segmento débil normal; en BREAK_AT enrojece y se abre un hueco
          const broken = interpolate(frame, [BREAK_AT, BREAK_AT + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          col = col.lerp(new THREE.Color(ALERT), breakFlash);
          lenScale = 0.86 * (1 - 0.72 * broken);
          op = op * (1 - 0.9 * broken) + 0.7 * breakFlash * appear;
        }
        return (
          <mesh key={`seg${i}`} position={mid} rotation={[0, 0, ang]}>
            <boxGeometry args={[len * lenScale, 0.022 + 0.02 * segStrength, 0.022]} />
            <meshBasicMaterial color={col.getStyle()} transparent opacity={op} />
          </mesh>
        );
      })}

      {/* estaciones (miembros del equipo) + su prospecto */}
      {STATIONS.map((s, i) => {
        const str = STRENGTH[i];
        const litT = interpolate(frame, [LIT_AT[i] - 4, LIT_AT[i] + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const lit = str * litT;
        // pulso ESFORZADO (rápido, a pulso) en los que encienden; los muertos, quietos y opacos
        const strain = lit > 0.05 ? 1 + 0.14 * str * Math.sin(frame * 0.95 + i) : 1;
        const baseCol = new THREE.Color(TITAN).lerp(new THREE.Color(GOLD_HOT), lit);
        // prospecto que el miembro intenta convertir: se enciende ∝ fuerza heredada
        const pConv = lit;
        const prospectCol = new THREE.Color(TITAN).lerp(new THREE.Color(GOLD), pConv);
        const px = s.x, py = s.y - 0.78;
        return (
          <group key={`st${i}`}>
            {lit > 0.05 && <Glow position={new THREE.Vector3(s.x, s.y, 0)} scale={(1.5 + 0.7 * str) * lit} color={GOLD} opacity={(0.5 + 0.4 * str) * lit} />}
            <mesh position={[s.x, s.y, 0]} scale={[strain, strain, strain]}>
              <sphereGeometry args={[0.34 + 0.05 * str, 32, 32]} />
              <meshStandardMaterial color={baseCol.getStyle()} emissive={baseCol.getStyle()} emissiveIntensity={0.35 + 1.2 * lit} metalness={0.3} roughness={0.35} transparent opacity={appear * (0.55 + 0.45 * Math.max(lit, 0.5))} />
            </mesh>
            {/* prospecto */}
            <mesh position={[px, py, 0]}>
              <sphereGeometry args={[0.14, 18, 18]} />
              <meshStandardMaterial color={prospectCol.getStyle()} emissive={prospectCol.getStyle()} emissiveIntensity={0.3 + 1.0 * pConv} metalness={0.3} roughness={0.5} transparent opacity={appear * (0.5 + 0.5 * Math.max(pConv, 0.4))} />
            </mesh>
            {pConv > 0.1 && <Glow position={new THREE.Vector3(px, py, 0)} scale={0.7 * pConv} color={GOLD} opacity={0.5 * pConv} />}
          </group>
        );
      })}

      {/* chispazo del método viajando por el relevo (muere en el quiebre) */}
      {sparkAlive > 0.01 && (
        <Glow position={new THREE.Vector3(sparkX, sparkY, 0.2)} scale={0.9 * sparkAlive} color={travel < BREAK_SEG + 0.4 ? GOLD_HOT : ALERT} opacity={(0.8 + 0.2 * Math.sin(frame * 0.8)) * sparkAlive} />
      )}

      {/* destello rojo del quiebre */}
      {breakFlash > 0.01 && (
        <Glow
          position={new THREE.Vector3((STATIONS[BREAK_SEG].x + STATIONS[BREAK_SEG + 1].x) / 2, (STATIONS[BREAK_SEG].y + STATIONS[BREAK_SEG + 1].y) / 2, 0.25)}
          scale={1.6 * breakFlash}
          color={ALERT}
          opacity={0.85 * breakFlash}
        />
      )}
    </group>
  );
}

export const Pulso3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleWords = title.split("\n");
  const subOp = interpolate(frame, [BREAK_AT + 6, BREAK_AT + 22], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [BREAK_AT, BREAK_AT + 18], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 45% at 38% 42%, rgba(197,160,89,0.12), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-4%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 9.6], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} fps={fps} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || title || sub) && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.13 }}>
          <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
          {titleWords.map((w, i) => {
            const start = 30 + i * 8;
            const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
            const ty = interpolate(frame, [start, start + 12], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
            return <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{w}</div>;
          })}
          <div style={{ width: lineW, height: 3, backgroundColor: BRAND.alert, margin: "26px 0", borderRadius: 2 }} />
          <div style={{ opacity: subOp, color: BRAND.titanium, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
