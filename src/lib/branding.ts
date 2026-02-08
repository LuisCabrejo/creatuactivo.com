/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * THE ARCHITECT'S SUITE - Branding System v3.0
 * "Private Equity meets Digital Architect"
 *
 * SISTEMA BIMETÁLICO: Oro (Premio) + Titanio (Estructura)
 * - Oro (#C5A059): CTAs, dinero, logros, títulos clave
 * - Titanio (#94A3B8): Iconos estructurales, líneas, bordes secundarios
 */

// /src/lib/branding.ts

// ============================================================================
// COLOR PALETTE - QUIET LUXURY (Bimetallic System)
// ============================================================================

export const COLORS = {
  // Backgrounds
  bg: {
    main: '#0F1115',      // Carbono Profundo
    elevated: '#15171C',  // Carbono Elevado (para alternar secciones)
    card: '#1A1D23',      // Obsidiana Suave
  },
  // Gold Accents (EL PREMIO - Dinero, CTAs, Logros)
  gold: {
    primary: '#C5A059',   // Champagne Gold
    hover: '#D4AF37',     // Brillo Hover
    bronze: '#B38B59',    // Texto Bronce
  },
  // Titanium Accents (LA ESTRUCTURA - Iconos, Líneas, Bordes)
  titanium: {
    primary: '#94A3B8',   // Titanio Claro (iconos activos)
    muted: '#64748B',     // Titanio Medio (iconos inactivos)
    dark: '#475569',      // Titanio Oscuro (líneas sutiles)
  },
  // Text
  text: {
    primary: '#FFFFFF',   // Títulos
    main: '#E5E5E5',      // Blanco Humo (párrafos)
    muted: '#A3A3A3',     // Gris Suave
    subtle: '#6B7280',    // Gris Muy Sutil
  },
  // Borders
  border: {
    subtle: 'rgba(197, 160, 89, 0.2)',   // Bordes dorados (solo CTAs)
    card: 'rgba(255, 255, 255, 0.1)',    // Bordes de tarjetas (neutros)
    titanium: 'rgba(148, 163, 184, 0.2)', // Bordes titanio
  },
  // Semantic (Status)
  semaphore: {
    red: '#F43F5E',       // Rosa Terracota (alertas)
    redBg: 'rgba(244, 63, 94, 0.15)',
    yellow: '#FBBF24',    // Ámbar (pendiente)
    yellowBg: 'rgba(251, 191, 36, 0.15)',
    green: '#10B981',     // Esmeralda (éxito)
    greenBg: 'rgba(16, 185, 129, 0.15)',
  },
  // Atmosphere (Spotlights y Gradientes)
  atmosphere: {
    spotlight: 'rgba(148, 163, 184, 0.08)',  // Luz azulada sutil
    warmSpot: 'rgba(197, 160, 89, 0.06)',    // Luz cálida sutil
    glass: 'rgba(255, 255, 255, 0.05)',      // Efecto cristal
  },
} as const;

// ============================================================================
// LEGACY BRAND OBJECT (for backwards compatibility)
// ============================================================================

export const BRAND = {
  colors: {
    // Legacy mappings to new system
    blue: COLORS.gold.primary,     // Replaced blue with gold
    purple: COLORS.gold.bronze,    // Replaced purple with bronze
    gold: COLORS.gold.primary,

    // Backgrounds
    dark: COLORS.bg.main,
    darkAlt: COLORS.bg.card,
    cardBg: COLORS.bg.card,

    // Text
    white: COLORS.text.primary,
    gray: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      400: COLORS.text.muted,
      500: COLORS.text.muted,
      700: COLORS.bg.card
    }
  },

  fonts: {
    serif: 'Playfair Display, Georgia, serif',           // "La Promesa"
    sans: 'Montserrat, Inter, -apple-system, sans-serif', // Body text
    industrial: 'Rajdhani, sans-serif',                   // "La Máquina"
    mono: 'Roboto Mono, monospace',                       // "La Evidencia"
    logo: 'Oswald, sans-serif',
    stack: 'Montserrat, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
  },

  urls: {
    base: 'https://creatuactivo.com',
    logo: 'https://creatuactivo.com/logo-email-header-280x80.png',
    logoSignature: 'https://creatuactivo.com/logo-email-signature-200x60.png',
    logoFooter: 'https://creatuactivo.com/logo-email-footer-180x48.png'
  },

  spacing: {
    containerPadding: '24px',
    sectionSpacing: '32px'
  }
};

// ============================================================================
// EMAIL STYLES (React Email compatible)
// ============================================================================

export const emailStyles = {
  container: {
    fontFamily: BRAND.fonts.stack,
    backgroundColor: COLORS.bg.main,
    color: COLORS.text.main,
    lineHeight: '1.6'
  },

  button: {
    backgroundColor: COLORS.gold.primary,
    color: COLORS.bg.main,
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    display: 'inline-block',
    letterSpacing: '1px',
  },

  card: {
    backgroundColor: COLORS.bg.card,
    borderRadius: '12px',
    padding: BRAND.spacing.containerPadding,
    border: `1px solid ${COLORS.border.card}`,
  },

  highlightQuote: {
    borderLeft: `3px solid ${COLORS.gold.primary}`,
    paddingLeft: '20px',
    fontStyle: 'italic' as const,
    fontSize: '18px',
    color: COLORS.text.main,
    background: 'linear-gradient(90deg, rgba(197,160,89,0.05) 0%, rgba(0,0,0,0) 100%)',
  }
};

// ============================================================================
// QUIET LUXURY CONSTANTS (for inline styles in pages)
// ============================================================================

export const QUIET_LUXURY = {
  // Backgrounds
  bgDeep: COLORS.bg.main,
  bgElevated: COLORS.bg.elevated,
  bgSurface: COLORS.bg.card,
  bgCard: COLORS.bg.card,

  // Gold accents (EL PREMIO - Solo para CTAs, dinero, logros)
  gold: COLORS.gold.primary,
  goldHover: COLORS.gold.hover,
  goldMuted: COLORS.gold.bronze,

  // Titanium accents (LA ESTRUCTURA - Iconos, líneas, navegación)
  titanium: COLORS.titanium.primary,
  titaniumMuted: COLORS.titanium.muted,
  titaniumDark: COLORS.titanium.dark,

  // Text colors
  textPrimary: COLORS.text.primary,
  textMain: COLORS.text.main,
  textSecondary: COLORS.text.muted,
  textMuted: COLORS.text.muted,
  textSubtle: COLORS.text.subtle,

  // Borders
  border: COLORS.border.subtle,
  borderCard: COLORS.border.card,
  borderTitanium: COLORS.border.titanium,

  // Atmosphere (Profundidad y Luz)
  spotlight: COLORS.atmosphere.spotlight,
  warmSpot: COLORS.atmosphere.warmSpot,
  glass: COLORS.atmosphere.glass,

  // Semaphore (Status indicators)
  red: COLORS.semaphore.red,
  redBg: COLORS.semaphore.redBg,
  yellow: COLORS.semaphore.yellow,
  yellowBg: COLORS.semaphore.yellowBg,
  green: COLORS.semaphore.green,
  greenBg: COLORS.semaphore.greenBg,
} as const;

// ============================================================================
// ICON COLOR GUIDE - Jerarquía de Colores para Iconos
// ============================================================================
//
// CATEGORÍA A: EL PREMIO (Gold #C5A059)
// - Uso: Trofeos, monedas, barras de progreso, logros
// - Contexto: Representa dinero, éxito, estatus
//
// CATEGORÍA B: LA ESTRUCTURA (Titanium #94A3B8)
// - Uso: Navegación, herramientas, menús, utilidades
// - Comportamiento: Gris en reposo → Dorado en hover/activo
//
// CATEGORÍA C: EL ESTADO (Semáforo)
// - Verde Esmeralda (#10B981): Completado, crecimiento positivo
// - Ámbar (#FBBF24): Pendiente, en progreso
// - Rosa Terracota (#F43F5E): Alerta, acción requerida
//
// ============================================================================

export const ICON_COLORS = {
  // Categoría A: Premio (Solo para logros y dinero)
  prize: COLORS.gold.primary,

  // Categoría B: Estructura (Default para iconos)
  structure: COLORS.titanium.primary,
  structureMuted: COLORS.titanium.muted,
  structureHover: COLORS.gold.primary, // Se vuelve dorado en hover

  // Categoría C: Estado
  success: COLORS.semaphore.green,
  warning: COLORS.semaphore.yellow,
  alert: COLORS.semaphore.red,

  // Trust Markers (Landing pages)
  trust: 'rgba(255, 255, 255, 0.6)', // Blanco con opacidad
} as const;

// ============================================================================
// ELEGANCIA CINÉTICA v1.0 - "Ingeniería de Lujo"
// Fusión: Quiet Luxury + Realismo Industrial (Servilleta/Queswa)
// Regla 60-30-10: 60% Obsidian, 30% Steel, 5% Cyan, 5% Gold
// ============================================================================

export const ELEGANCIA_CINETICA = {
  bg: {
    obsidian: '#0B0C0C',               // Fondo principal
    gunmetal: '#16181D',               // Tarjetas/Módulos
    glass: 'rgba(22, 24, 29, 0.7)',    // Glassmorphism
  },
  gold: {
    champagne: '#E5C279',             // Títulos (más suave y cálido)
    metallic: '#D4AF37',              // Bordes / Detalles finos
  },
  accent: {
    amber: '#F59E0B',                 // CTAs principales
    amberDark: '#D97706',             // Gradient bottom
    cyan: '#38BDF8',                  // Datos / Biometría
    cyanDark: '#0EA5E9',              // Cyan hover
  },
  steel: '#94A3B8',                   // Estructura (sin cambio)
  text: {
    primary: '#FFFFFF',               // Títulos
    main: '#E5E5E5',                  // Body
    muted: '#A3A3A3',                 // Secondary
    subtle: '#6B7280',                // Very subtle
  },
  border: {
    gold: 'rgba(212, 175, 55, 0.2)',  // Bordes dorados sutiles
    glass: 'rgba(255, 255, 255, 0.08)', // Bordes neutrales
    glow: 'rgba(229, 194, 121, 0.3)',   // Glow dorado
  },
} as const;
