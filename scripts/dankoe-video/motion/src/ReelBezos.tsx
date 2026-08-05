/**
 * Reel "Bezos / El Sistema" — GRÁFICAS led (line-art 3D del repo).
 * La gráfica transmite el mensaje; el texto enriquece.
 *   1. Hook (texto breve) — Bezos no vendió libros, creó el sistema
 *   2. Engranajes (MotorCongela3D) — usted es el motor; si para, el dinero para
 *   3. Globo (Matriz3D) — existe un sistema que no se detiene (70 países)
 *   4. Orbe IA (IAOnda3D) — hoy, con IA, sea propietario sin tecnología
 *   5. Orbe IA (IAOnda3D) — CTA: usted dirige, pregúntele a Queswa
 *
 * <Sequence> rebasea el frame → cada animación interna corre completa.
 * Editá BEATS para cambiar gráfica/tiempo/copy. FRAMES_TOTALES → Root.tsx.
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { BRAND, FONTS } from "./brand";
import { MotorCongela3D } from "./MotorCongela3D";
import { Matriz3D } from "./Matriz3D";
import { IAOnda3D } from "./IAOnda3D";

const FPS = 30;
const GOLD = BRAND.gold;

// ── Hook de texto (estilo Dan Koe) — abre el reel, *palabra* = champán ──────
const Hook: React.FC<{ lines: string[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame, fps, config: { damping: 18, stiffness: 210, mass: 0.6 } });
  const y = interpolate(e, [0, 1], [34, 0]);
  const opacity = interpolate(e, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
      <div style={{ transform: `translateY(${y}px)`, opacity, display: "flex", flexDirection: "column", gap: 8 }}>
        {lines.map((l, i) => {
          const parts = l.split("*");
          return (
            <div key={i} style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 96, lineHeight: 1.04, letterSpacing: "-0.02em", color: BRAND.white, textAlign: "center" }}>
              {parts.map((p, j) => (j % 2 === 1 ? <span key={j} style={{ color: GOLD }}>{p}</span> : <span key={j}>{p}</span>))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

type Beat = { comp: React.FC<any>; dur: number; props: Record<string, any> };

const BEATS: Beat[] = [
  // 1 · HOOK (texto) — Bezos
  {
    comp: Hook,
    dur: Math.round(3.6 * FPS),
    props: { lines: ["¿Bezos se hizo rico", "vendiendo libros?", "No. Creó *el sistema*."] },
  },
  // 2 · ENGRANAJES — usted es el motor; si para, el dinero para
  {
    comp: MotorCongela3D,
    dur: Math.round(4.4 * FPS),
    props: {
      eyebrow: "UN INGRESO ATADO A USTED",
      title: "USTED ES\nEL MOTOR",
      sub: "Si usted para, el dinero para",
      freezeAt: 90,
    },
  },
  // 3 · GLOBO — existe un sistema que no se detiene
  {
    comp: Matriz3D,
    dur: Math.round(4.8 * FPS),
    props: {
      eyebrow: "EXISTE OTRA FORMA",
      count: 70,
      unit: "PAÍSES",
      sub: "Un sistema que trabaja aunque usted descanse",
    },
  },
  // 4 · ORBE IA — sea propietario con IA, sin tecnología
  {
    comp: IAOnda3D,
    dur: Math.round(5 * FPS),
    props: {
      eyebrow: "HOY · CON INTELIGENCIA ARTIFICIAL",
      title: "SEA\nPROPIETARIO",
      sub: "De una empresa digital · sin saber de tecnología",
    },
  },
  // 5 · ORBE IA — CTA Queswa
  {
    comp: IAOnda3D,
    dur: Math.round(5.2 * FPS),
    props: {
      eyebrow: "CREATUACTIVO.COM",
      title: "USTED\nDIRIGE",
      sub: "En el enlace, pregúntele a Queswa · juzgue usted",
    },
  },
];

const STARTS: number[] = [];
BEATS.reduce((acc, b, i) => { STARTS[i] = acc; return acc + b.dur; }, 0);
export const FRAMES_TOTALES = BEATS.reduce((a, b) => a + b.dur, 0);

export const ReelBezos: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000000" }}>
    {BEATS.map((b, i) => {
      const C = b.comp;
      return (
        <Sequence key={i} from={STARTS[i]} durationInFrames={b.dur}>
          <C {...b.props} />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
