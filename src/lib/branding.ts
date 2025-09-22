// /src/lib/branding.ts
export const BRAND = {
  colors: {
    // Colores principales del sitio web
    blue: '#1E40AF',
    purple: '#7C3AED',
    gold: '#F59E0B',

    // Backgrounds
    dark: '#0f172a',
    darkAlt: '#1e293b',
    cardBg: '#334155',

    // Text
    white: '#FFFFFF',
    gray: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      700: '#334155'
    }
  },

  fonts: {
    stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },

  urls: {
    base: 'https://creatuactivo.com',
    logo: '/logo-email-header-200x80.png', // Logo específico para emails
    logoSignature: '/logo-email-signature-150x60.png' // Logo alternativo
  },

  spacing: {
    containerPadding: '24px',
    sectionSpacing: '32px'
  }
};

// Estilos optimizados para máxima compatibilidad con clientes de email
export const emailStyles = {
  container: {
    fontFamily: BRAND.fonts.stack,
    backgroundColor: BRAND.colors.dark,
    color: BRAND.colors.white,
    lineHeight: '1.6'
  },

  button: {
    backgroundColor: BRAND.colors.gold,
    color: BRAND.colors.dark,
    padding: '16px 32px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
    display: 'inline-block'
  },

  card: {
    backgroundColor: BRAND.colors.darkAlt,
    borderRadius: '12px',
    padding: BRAND.spacing.containerPadding
  }
};
