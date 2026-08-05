/**
 * Reel "El Sistema" — Globo de distribución animado (line-art, estilo Dan Koe).
 *
 * GRÁFICA HERO: globo wireframe blanco sobre negro + arcos de rutas que vuelan
 * entre hubs (pulsos = despacho global, "el sistema que distribuye en el mundo").
 * Corre como fondo continuo. Encima, TITULARES ENORMES (una idea por pantalla,
 * legibles en móvil) que se revelan palabra por palabra → se sincronizan con el
 * VO de ElevenLabs ajustando los `dur` de cada caption.
 *
 * Editá CAPTIONS (texto/tiempo). *palabra* = champán. FRAMES_TOTALES → Root.tsx.
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

const FPS = 30;
const W = 1080;
const GOLD = BRAND.gold;
const WHITE = "#FFFFFF";

// ── Globo wireframe + arcos de distribución ────────────────────────────────
const Globo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cx = 540, cy = 680, R = 330;

  const build = spring({ frame, fps, config: { damping: 20, stiffness: 80, mass: 1 } });
  const appear = interpolate(build, [0, 1], [0.7, 1]);
  const gOp = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const rot = frame * 0.02;

  // Wireframe
  const lats = [-0.66, -0.33, 0, 0.33, 0.66].map((k) => ({
    y: cy + k * R,
    rx: R * Math.sqrt(Math.max(0, 1 - k * k)),
    ry: R * 0.13,
  }));
  const lons = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = rot + (i * Math.PI) / 6;
    return Math.abs(Math.cos(a)) * R;
  });

  // Hubs (puntos sobre el disco) + rutas
  const hubs = [
    { x: cx - 170, y: cy - 110 }, { x: cx + 195, y: cy - 60 },
    { x: cx - 70, y: cy + 140 }, { x: cx + 120, y: cy + 120 },
    { x: cx - 215, y: cy + 30 }, { x: cx + 35, y: cy - 165 },
  ];
  const routes: [number, number][] = [[0, 1], [0, 3], [4, 1], [5, 3], [2, 1], [4, 5]];

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center" }}>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{ opacity: gOp }}>
        <g transform={`translate(${cx} ${cy}) scale(${appear}) translate(${-cx} ${-cy})`}>
          {/* glow sutil */}
          <circle cx={cx} cy={cy} r={R} fill="url(#g)" opacity={0.12} />
          <defs>
            <radialGradient id="g">
              <stop offset="0%" stopColor={WHITE} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* contorno */}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={WHITE} strokeWidth={2.5} opacity={0.9} />
          {/* latitudes */}
          {lats.map((l, i) => (
            <ellipse key={`la${i}`} cx={cx} cy={l.y} rx={l.rx} ry={l.ry} fill="none" stroke={BRAND.titanium} strokeWidth={1.4} opacity={0.45} />
          ))}
          {/* longitudes (giran) */}
          {lons.map((rx, i) => (
            <ellipse key={`lo${i}`} cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke={BRAND.titanium} strokeWidth={1.4} opacity={0.4} />
          ))}

          {/* rutas + pulsos de despacho */}
          {routes.map(([ai, bi], i) => {
            const a = hubs[ai], b = hubs[bi];
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const lift = 0.45 * Math.hypot(b.x - a.x, b.y - a.y);
            const d = `M ${a.x} ${a.y} Q ${mx} ${my - lift} ${b.x} ${b.y}`;
            const prog = ((frame * 0.012) + i * 0.19) % 1.16;
            return (
              <g key={`r${i}`}>
                <path d={d} fill="none" stroke={WHITE} strokeWidth={1.5} opacity={0.18} />
                <path d={d} fill="none" stroke={GOLD} strokeWidth={4} pathLength={1}
                  strokeLinecap="round" strokeDasharray="0.16 1" strokeDashoffset={-prog} opacity={0.95} />
              </g>
            );
          })}

          {/* hubs pulsando */}
          {hubs.map((h, i) => {
            const p = 4 + 2.2 * Math.sin(frame * 0.12 + i);
            return <g key={`h${i}`}>
              <circle cx={h.x} cy={h.y} r={p + 5} fill={GOLD} opacity={0.12} />
              <circle cx={h.x} cy={h.y} r={p} fill={WHITE} />
            </g>;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Titular ENORME, revelado palabra por palabra ───────────────────────────
const Caption: React.FC<{ text: string; size?: number }> = ({ text, size = 118 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 230, padding: "0 70px 230px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", maxWidth: 980 }}>
        {words.map((w, i) => {
          const gold = w.startsWith("*") && w.endsWith("*");
          const clean = gold ? w.slice(1, -1) : w;
          const start = i * 3; // ~0.1s entre palabras
          const op = interpolate(frame, [start, start + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame, [start, start + 7], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <span key={i} style={{
              fontFamily: FONTS.sans, fontWeight: 900, fontSize: size, lineHeight: 1.0,
              letterSpacing: "-0.02em", color: gold ? GOLD : WHITE,
              opacity: op, transform: `translateY(${y}px)`, display: "inline-block",
            }}>{clean}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Guion (sincronizable con el VO ajustando dur). *palabra* = champán ──────
type Cap = { dur: number; text: string; size?: number };
const CAPTIONS: Cap[] = [
  { dur: 64, text: "¿Bezos vendía *libros*?" },
  { dur: 26, text: "No.", size: 210 },
  { dur: 60, text: "Construyó *el sistema*." },
  { dur: 64, text: "Millones de ventas. Cada día." , size: 96 },
  { dur: 54, text: "Él no empaca cajas." },
  { dur: 64, text: "Es *dueño* del sistema." },
  { dur: 60, text: "Hoy usted también puede." },
  { dur: 60, text: "Sea *propietario*." },
  { dur: 86, text: "En el enlace, pregúntele a *Queswa*.", size: 82 },
];

const STARTS: number[] = [];
CAPTIONS.reduce((acc, c, i) => { STARTS[i] = acc; return acc + c.dur; }, 0);
export const FRAMES_TOTALES = CAPTIONS.reduce((a, c) => a + c.dur, 0);

export const ReelDistribucion: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / FRAMES_TOTALES;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Gráfica hero continua */}
      <Globo />

      {/* eyebrow de marca */}
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: FONTS.mono, fontWeight: 600, fontSize: 26, letterSpacing: "0.42em", color: BRAND.titaniumMuted, textTransform: "uppercase" }}>
        CreaTuActivo
      </div>

      {/* Titulares grandes, uno por pantalla */}
      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={c.dur}>
          <Caption text={c.text} size={c.size} />
        </Sequence>
      ))}

      {/* progreso */}
      <div style={{ position: "absolute", bottom: 90, left: 70, right: 70, height: 3, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: GOLD }} />
      </div>
    </AbsoluteFill>
  );
};
