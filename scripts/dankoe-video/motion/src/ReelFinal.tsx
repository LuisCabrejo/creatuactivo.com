/**
 * Reel "Bezos / El Sistema" — MONTAJE FINAL.
 * 5 clips Veo (gráficas Dan Koe) + VO ElevenLabs + titulares grandes con sombra
 * sincronizados + logo CreaTuActivo tapando el watermark de Veo (abajo-derecha).
 *
 * Sincronización: CAPTIONS[].t = segundo de inicio (estimado del VO). Para
 * afinar, mové esos segundos y re-renderizá. Clips: ver CLIP_WINDOWS.
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { BRAND, FONTS } from "./brand";

const FPS = 30;
export const FRAMES_TOTALES = Math.round(48.013 * FPS); // = duración del VO

const GOLD = BRAND.gold;
const sec = (s: number) => Math.round(s * FPS);

// ── Clips (en orden) y su ventana en segundos ──────────────────────────────
const CLIPS = ["clip1.mp4", "clip2.mp4", "clip3.mp4", "clip4.mp4", "clip5.mp4"];
const CLIP_WINDOWS: [number, number][] = [
  [0, 10], [10, 20], [20, 30], [30, 40], [40, 48.013],
];

// ── Subtítulos completos (t = segundo de inicio, de los timestamps Whisper).
//    Texto correcto (no el de Whisper, que escribe "Neki/Quezua"). *…* = champán
type Cap = { t: number; text: string; size?: number };
const CAPTIONS: Cap[] = [
  { t: 0.0, text: "¿Jeff Bezos se hizo rico\nvendiendo *libros*?" },
  { t: 2.0, text: "No.", size: 180 },
  { t: 2.6, text: "Construyó *el sistema*." },
  { t: 4.8, text: "Donde se venden millones.\nCada día." },
  { t: 7.7, text: "Él no empaca cajas." },
  { t: 9.1, text: "Es *dueño del sistema*." },
  { t: 10.6, text: "Tener un ingreso no es\nser *dueño del sistema*." },
  { t: 14.0, text: "Si usted es el único *motor*…" },
  { t: 16.4, text: "el día que para,\nel *dinero para*." },
  { t: 19.6, text: "Hoy la *inteligencia artificial*\ncambió las reglas." },
  { t: 22.0, text: "Sea *propietario*\nde una empresa digital." },
  { t: 26.7, text: "Sin saber de tecnología." },
  { t: 29.7, text: "Como usar *Nequi*:\nsolo la usa." },
  { t: 34.0, text: "El sistema trabaja.\n*Usted dirige*." },
  { t: 37.7, text: "Yo utilizo *creatuactivo.com*", size: 56 },
  { t: 40.0, text: "Sin que le vendan nada." },
  { t: 43.0, text: "Pregúntele a *Queswa*." },
  { t: 46.0, text: "Mire, y *juzgue usted*." },
];

const Caption: React.FC<{ text: string; size: number }> = ({ text, size }) => {
  const frame = useCurrentFrame();
  // Fade-up de la frase completa (snappy). *...* (a nivel de string) = champán.
  const op = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 7], [22, 0], { extrapolateRight: "clamp" });
  const parts = text.split("*");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 70px 300px" }}>
      <div style={{
        opacity: op, transform: `translateY(${y}px)`, textAlign: "center", maxWidth: 980,
        whiteSpace: "pre-line",
        fontFamily: FONTS.sans, fontWeight: 900, fontSize: size, lineHeight: 1.1, letterSpacing: "-0.01em",
        textShadow: "0 4px 28px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,1)",
      }}>
        {parts.map((p, i) => (
          <span key={i} style={{ color: i % 2 === 1 ? GOLD : "#FFFFFF" }}>{p}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ReelFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Clips (muteados; el audio es el VO) */}
      {CLIPS.map((c, i) => {
        const [a, b] = CLIP_WINDOWS[i];
        return (
          <Sequence key={c} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
            <OffthreadVideo src={staticFile(`clips-bezos/${c}`)} muted />
          </Sequence>
        );
      })}

      {/* Titulares sincronizados */}
      {CAPTIONS.map((cap, i) => {
        const from = sec(cap.t);
        const to = i + 1 < CAPTIONS.length ? sec(CAPTIONS[i + 1].t) : FRAMES_TOTALES;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
            <Caption text={cap.text} size={cap.size ?? 66} />
          </Sequence>
        );
      })}

      {/* Logo CreaTuActivo — tapa el watermark de Veo (sparkle abajo-derecha).
          Caja negra detrás para garantizar cobertura aunque el sparkle se mueva. */}
      <div style={{ position: "absolute", right: 30, bottom: 70, width: 220, height: 200, background: "#000" }} />
      <Img
        src={staticFile("logotipo.png")}
        style={{ position: "absolute", right: 55, bottom: 95, width: 170, height: 170, opacity: 0.97 }}
      />

      {/* VO (normalizado a -14 LUFS) */}
      <Audio src={staticFile("clips-bezos/vo-norm.mp3")} />
    </AbsoluteFill>
  );
};
