// src/lib/branding.ts
export const BRAND = {
  // URLs
  urls: {
    base: 'https://creatuactivo.com',
    ecosystem: 'https://creatuactivo.com/ecosistema',
    app: 'https://app.creatuactivo.com' // Future private dashboard
  },

  // Email configuration
  email: {
    from: {
      system: 'Sistema CreaTuActivo <sistema@creatuactivo.com>',
      confirmation: 'CreaTuActivo <confirmacion@creatuactivo.com>',
      founders: 'Luis & Liliana <fundadores@creatuactivo.com>'
    },
    to: {
      internal: ['luis@creatuactivo.com', 'liliana@creatuactivo.com']
    }
  },

  // Visual assets
  assets: {
    logo: {
      header: '/logo-email-header-200x80.png',
      footer: '/logo-email-footer-120x48.png'
    }
  },

  // Color palette
  colors: {
    primary: {
      dark: '#0f172a',
      blue: '#1e40af',
      purple: '#7c3aed',
      gold: '#f59e0b'
    },
    neutral: {
      white: '#ffffff',
      slate100: '#f1f5f9',
      slate300: '#cbd5e1',
      slate400: '#94a3b8',
      slate600: '#475569',
      slate700: '#334155'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },

  // Spacing
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px'
  },

  // Gradients for premium feel
  gradients: {
    primary: 'linear-gradient(135deg, #1e40af, #7c3aed, #f59e0b)',
    button: 'linear-gradient(135deg, #f59e0b, #d97706)',
    card: 'linear-gradient(135deg, rgba(30, 64, 175, 0.15), rgba(124, 58, 237, 0.15), rgba(245, 158, 11, 0.15))'
  },

  // Email-specific styles
  emailStyles: {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    button: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: '#0f172a',
      textDecoration: 'none',
      fontWeight: '700',
      fontSize: '16px',
      padding: '15px 30px',
      borderRadius: '8px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    }
  },

  // Content templates
  content: {
    subjects: {
      foundersApplication: (name: string) => `Confirmación de tu solicitud de Fundador, ${name}`,
      internalNotification: (name: string) => `🔥 Nueva Aplicación de Fundador: ${name}`
    },
    signatures: {
      main: 'Construyendo el futuro, un sistema a la vez',
      founders: 'El Equipo de Arquitectos CreaTuActivo'
    }
  }
} as const;
