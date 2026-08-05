// Sistema Bimetálico v3.0 — tokens de marca CreaTuActivo
export const BRAND = {
  carbon: "#0F1115",
  carbonElevated: "#15171C",
  obsidian: "#1A1D23",
  gold: "#C5A059",
  goldHover: "#D4AF37",
  goldBronze: "#B38B59",
  titanium: "#94A3B8",
  titaniumMuted: "#64748B",
  titaniumDark: "#475569",
  white: "#FFFFFF",
  smoke: "#E5E5E5",
  muted: "#A3A3A3",
  alert: "#F43F5E",
};

import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadMono } from "@remotion/google-fonts/RobotoMono";

const mont = loadMontserrat("normal", { weights: ["600", "900"] });
const mono = loadMono("normal", { weights: ["500", "600"] });

export const FONTS = {
  sans: mont.fontFamily,
  mono: mono.fontFamily,
  serif: "'Playfair Display', Georgia, serif",
};
