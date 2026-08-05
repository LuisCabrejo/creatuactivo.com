import React, { useMemo } from "react";
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

// MAESTRÍA — MULTIPLICACIÓN. Réplicas IDÉNTICAS (cada quien recibe el mismo sistema) que
// se duplican 1 → 2 → 4 → 8, todas del mismo tamaño y brillo. Sin líneas de árbol.
//
// ⚠️ NO PUEDE OLER A PIRÁMIDE (decisión del Director, 2 ago 2026). La versión anterior
// apilaba las filas 1/2/4/8 de abajo hacia arriba: los nodos eran iguales y la dirección
// era la aprobada, pero la silueta resultante era un triángulo que se ensancha — un
// organigrama. Ahora TODAS las réplicas viven en UNA SOLA LÍNEA HORIZONTAL y se duplican
// hacia afuera desde el centro: misma altura para todas, no hay arriba ni abajo, así que
// no hay downline posible de leer. El grupo se encoge en cada duplicación (zoom-out
// uniforme, todas siguen siendo iguales entre sí) para que quepan y para que se sienta
// que el crecimiento no tiene techo.
// ❌ NO devolver a filas apiladas. ❌ NO nodos de distinto tamaño. ❌ NO cascada top-down.
// Texto vacío en el deck.

type Props = { eyebrow: string; title: string; sub: string };

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

const STAGES = [1, 2, 4, 8];          // cuántas réplicas hay en cada etapa
const STAGE_ON = [12, 40, 68, 96];    // frame en que entra cada etapa
const STEP = 0.78;                    // separación entre réplicas vecinas (unidades locales)
// El grupo se encoge en cada duplicación para que la línea quepa siempre en cuadro.
// Es un zoom-out uniforme: todas las réplicas siguen midiendo lo mismo entre sí.
const STAGE_SCALE = [1.0, 0.95, 0.86, 0.66];

/** x de la réplica que ocupa el puesto `slot` cuando hay `n` en la línea (centrada). */
const xAt = (slot: number, n: number) => (slot - (n - 1) / 2) * STEP;

/** Puesto que ocupa la réplica final `j` en la etapa `s` (existe si es múltiplo exacto). */
const slotOf = (j: number, s: number) => j / 2 ** (STAGES.length - 1 - s);

/** Etapa en que nace la réplica final `j`. */
const birthOf = (j: number) => STAGES.findIndex((_, s) => j % 2 ** (STAGES.length - 1 - s) === 0);

function Scene({ frame }: { frame: number }) {
  const inOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const R = 0.27; // mismo radio para TODAS (iguales)
  const total = STAGES[STAGES.length - 1];

  // progreso de cada transición hacia la etapa s (no se solapan entre sí)
  const prog = STAGE_ON.map((on) =>
    interpolate(frame, [on, on + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );

  // el zoom-out acompaña las mismas transiciones
  let scale = STAGE_SCALE[0];
  for (let s = 1; s < STAGES.length; s++) scale += (STAGE_SCALE[s] - scale) * prog[s];

  const orbs = useMemo(
    () => Array.from({ length: total }, (_, j) => ({ j, born: birthOf(j), parent: j - 2 ** (STAGES.length - 1 - birthOf(j)) })),
    [total]
  );

  return (
    <group scale={[inOp * scale, inOp * scale, inOp * scale]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 4, 5]} intensity={1.0} color={"#dfe5ee"} />
      <pointLight position={[0, 0, 3]} intensity={9} distance={16} color={GOLD_HOT} />

      {orbs.map(({ j, born, parent }) => {
        const on = STAGE_ON[born];
        const pop = interpolate(frame, [on, on + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) });
        if (pop <= 0.001) return null;

        // nace saliendo de su réplica madre (misma altura) y se separa hacia su puesto…
        let x =
          born === 0
            ? xAt(slotOf(j, 0), STAGES[0])
            : xAt(slotOf(parent, born - 1), STAGES[born - 1]) +
              (xAt(slotOf(j, born), STAGES[born]) - xAt(slotOf(parent, born - 1), STAGES[born - 1])) * prog[born];
        // …y en cada duplicación posterior se corre para hacerle sitio a las nuevas
        for (let s = born + 1; s < STAGES.length; s++) x += (xAt(slotOf(j, s), STAGES[s]) - x) * prog[s];

        const flash = interpolate(frame, [on, on + 6, on + 16], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <group key={j} position={[x, 0, 0]}>
            <Glow position={new THREE.Vector3(0, 0, 0)} scale={(1.0 + 0.7 * flash) * pop} opacity={0.7 * pop} />
            <mesh scale={[pop, pop, pop]}>
              <sphereGeometry args={[R, 30, 30]} />
              <meshStandardMaterial color={GOLD_HOT} emissive={GOLD_HOT} emissiveIntensity={1.3} metalness={0.3} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export const Maestria3D: React.FC<Props> = ({ eyebrow, title, sub }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const ebOp = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const titleWords = title.split("\n");
  const subOp = interpolate(frame, [70, 84], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [74, 92], [0, 240], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const grid = 0.05 + 0.015 * Math.sin(frame / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.carbon, fontFamily: FONTS.sans }}>
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }), background: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(197,160,89,0.11), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(${BRAND.titanium} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.titanium} 1px, transparent 1px)`, backgroundSize: "64px 64px", opacity: grid }} />

      <AbsoluteFill style={{ transform: "translateY(-4%)" }}>
        <ThreeCanvas width={W} height={H} camera={{ fov: 42, position: [0, 0, 10.5], near: 0.1, far: 50 }} gl={{ alpha: true, antialias: true }} style={{ position: "absolute", inset: 0 }}>
          <Scene frame={frame} />
        </ThreeCanvas>
      </AbsoluteFill>

      {(eyebrow || title || sub) && (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: H * 0.08 }}>
        <div style={{ opacity: ebOp, color: BRAND.titanium, fontFamily: FONTS.mono, letterSpacing: 6, fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>
        {titleWords.map((w, i) => {
          const start = 30 + i * 8;
          const op = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const ty = interpolate(frame, [start, start + 12], [40, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, color: BRAND.white, fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: 1, textAlign: "center" }}>{w}</div>;
        })}
        <div style={{ width: lineW, height: 3, backgroundColor: BRAND.gold, margin: "26px 0", borderRadius: 2 }} />
        <div style={{ opacity: subOp, color: BRAND.gold, fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 2 }}>{sub}</div>
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
