/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * THE ARCHITECT'S SUITE - Branding System v2.0
 * "Private Equity meets Digital Architect"
 */

// /src/lib/branding.ts

// ============================================================================
// COLOR PALETTE - QUIET LUXURY
// ============================================================================

export const COLORS = {
  // Backgrounds
  bg: {
    main: '#0F1115',      // Carbono Profundo
    card: '#1A1D23',      // Obsidiana Suave
  },
  // Accents
  gold: {
    primary: '#C5A059',   // Champagne Gold
    hover: '#D4AF37',     // Brillo Hover
    bronze: '#B38B59',    // Texto Bronce
  },
  // Text
  text: {
    primary: '#FFFFFF',   // Títulos
    main: '#E5E5E5',      // Blanco Humo (párrafos)
    muted: '#A3A3A3',     // Gris Titanio
  },
  // Borders
  border: {
    subtle: 'rgba(197, 160, 89, 0.2)',
    card: 'rgba(197, 160, 89, 0.1)',
  },
  // Semantic
  semaphore: {
    red: '#dc2626',
    redBg: 'rgba(220, 38, 38, 0.15)',
    yellow: '#eab308',
    yellowBg: 'rgba(234, 179, 8, 0.15)',
    green: '#22c55e',
    greenBg: 'rgba(34, 197, 94, 0.15)',
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
    serif: 'Playfair Display, Georgia, serif',
    sans: 'Montserrat, Inter, -apple-system, sans-serif',
    stack: 'Montserrat, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
  },

  urls: {
    base: 'https://creatuactivo.com',
    logo: 'https://creatuactivo.com/logo-email-header-200x80.png',
    logoSignature: 'https://creatuactivo.com/logo-email-signature-150x60.png'
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
  bgSurface: COLORS.bg.card,
  bgCard: COLORS.bg.card,

  // Gold accents
  gold: COLORS.gold.primary,
  goldHover: COLORS.gold.hover,
  goldMuted: COLORS.gold.bronze,

  // Text colors
  textPrimary: COLORS.text.primary,
  textMain: COLORS.text.main,
  textSecondary: COLORS.text.muted,
  textMuted: COLORS.text.muted,

  // Borders
  border: COLORS.border.subtle,
  borderCard: COLORS.border.card,

  // Semaphore (for calculator)
  red: COLORS.semaphore.red,
  redBg: COLORS.semaphore.redBg,
  yellow: COLORS.semaphore.yellow,
  yellowBg: COLORS.semaphore.yellowBg,
  green: COLORS.semaphore.green,
  greenBg: COLORS.semaphore.greenBg,
} as const;
