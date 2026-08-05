/**
 * Reel "Bezos / El Sistema" — tipografía kinética estilo Dan Koe.
 * Negro puro + texto blanco bold + palabra clave en champán.
 * Sin cámara (rompe la monotonía + elimina el gatillo "es Luis vendiendo").
 *
 * Data-driven: edite CARDS para cambiar texto/tiempo. Marque palabras a
 * resaltar entre *asteriscos*. Cada card = un beat (corte seco al siguiente).
 * Duración total = suma de `dur`; FRAMES_TOTALES se usa en Root.tsx.
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

const BG = "#000000";
const GOLD = BRAND.gold; // #C5A059

// ── Guion (un card por beat). Tamaño opcional; *palabra* = champán ──────────
type Card = { dur: number; lines: string[]; size?: number };

const CARDS: Card[] = [
  { dur: 58, lines: ["¿Jeff Bezos se hizo rico", "*vendiendo libros*?"] },
  { dur: 26, lines: ["No."], size: 200 },
  { dur: 54, lines: ["Se hizo rico construyendo", "*el sistema*."] },
  { dur: 50, lines: ["Donde se venden", "millones. Cada día."] },
  { dur: 56, lines: ["Él no empaca cajas.", "Es *dueño* del sistema."] },
  { dur: 58, lines: ["Una cosa es *tener*", "un ingreso."] },
  { dur: 66, lines: ["Otra es ser *dueño*", "del sistema", "que lo produce."] },
  { dur: 50, lines: ["Si usted para,", "el dinero para."] },
  { dur: 64, lines: ["Eso no es un sistema.", "Usted *ES* el sistema."] },
  { dur: 50, lines: ["Hoy la IA", "cambió las reglas."] },
  { dur: 68, lines: ["Sea *propietario*", "de una empresa digital.", "Sin saber de tecnología."] },
  { dur: 64, lines: ["Como usar Nequi:", "no programa la app.", "Solo la usa."] },
  { dur: 56, lines: ["El sistema trabaja.", "*Usted dirige.*"] },
  { dur: 56, lines: ["Yo utilizo", "*creatuactivo.com*"] },
  { dur: 56, lines: ["¿Curiosidad de", "cómo funciona?"] },
  { dur: 50, lines: ["—sin que le", "vendan nada—"], size: 70 },
  { dur: 64, lines: ["En el enlace,", "pregúntele a *Queswa*."] },
  { dur: 80, lines: ["Mire,", "y *juzgue usted*."] },
];

// `from` acumulado + total
const STARTS: number[] = [];
CARDS.reduce((acc, c, i) => { STARTS[i] = acc; return acc + c.dur; }, 0);
export const FRAMES_TOTALES = CARDS.reduce((a, c) => a + c.dur, 0);

// Render de una línea con resaltado *champán*
const Line: React.FC<{ text: string; size: number }> = ({ text, size }) => {
  const parts = text.split("*");
  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: "-0.02em",
        color: BRAND.white,
        textAlign: "center",
        textWrap: "balance" as any,
      }}
    >
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color: GOLD }}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </div>
  );
};

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = card.size ?? 96;

  // Entrada rápida con resorte (snappy → energía Dan Koe)
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 220, mass: 0.6 } });
  const y = interpolate(enter, [0, 1], [34, 0]);
  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  // Salida: fade en los últimos 6 frames (corte casi seco)
  const out = interpolate(frame, [card.dur - 6, card.dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(interpolate(enter, [0, 1], [0, 1]), out);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 90px" }}>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, opacity, display: "flex", flexDirection: "column", gap: 6 }}>
        {card.lines.map((l, i) => <Line key={i} text={l} size={size} />)}
      </div>
    </AbsoluteFill>
  );
};

export const BezosSistema: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / FRAMES_TOTALES;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* viñeta sutil */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05), rgba(0,0,0,0) 60%)" }} />

      {/* eyebrow de marca, persistente y discreto */}
      <div
        style={{
          position: "absolute", top: 96, width: "100%", textAlign: "center",
          fontFamily: FONTS.mono, fontWeight: 600, fontSize: 26,
          letterSpacing: "0.42em", color: BRAND.titaniumMuted, textTransform: "uppercase",
        }}
      >
        CreaTuActivo
      </div>

      {/* beats */}
      {CARDS.map((card, i) => (
        <Sequence key={i} from={STARTS[i]} durationInFrames={card.dur}>
          <CardView card={card} />
        </Sequence>
      ))}

      {/* barra de progreso fina (champán) */}
      <div style={{ position: "absolute", bottom: 110, left: 90, right: 90, height: 3, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ width: `${progress * 100}%`, height: "100%", background: GOLD }} />
      </div>
    </AbsoluteFill>
  );
};
