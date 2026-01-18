import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // THE ARCHITECT'S SUITE - Quiet Luxury Palette v3.0
        // Sistema Bimetálico: Oro (Premio) + Titanio (Estructura)

        // Backgrounds
        carbon: {
          DEFAULT: '#0F1115',  // Carbono Profundo (main bg)
          elevated: '#15171C', // Carbono Elevado (alternar secciones)
          light: '#1A1D23',    // Obsidiana Suave (cards)
        },
        // Gold Accents (EL PREMIO - CTAs, dinero, logros)
        champagne: {
          DEFAULT: '#C5A059',  // Champagne Gold (primary)
          hover: '#D4AF37',    // Gold hover
          bronze: '#B38B59',   // Bronze text
        },
        // Titanium Accents (LA ESTRUCTURA - iconos, líneas, navegación)
        titanium: {
          DEFAULT: '#94A3B8',  // Titanio Claro (iconos activos)
          muted: '#64748B',    // Titanio Medio (iconos inactivos)
          dark: '#475569',     // Titanio Oscuro (líneas sutiles)
        },
        // Text
        smoke: {
          DEFAULT: '#E5E5E5',  // Blanco Humo (paragraphs)
          muted: '#A3A3A3',    // Gris Suave (secondary)
          subtle: '#6B7280',   // Gris Muy Sutil
        },
        // Status (Semáforo sofisticado)
        status: {
          success: '#10B981',  // Esmeralda
          warning: '#FBBF24',  // Ámbar
          alert: '#F43F5E',    // Rosa Terracota
        },
        // Legacy (for compatibility)
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Inter', '-apple-system', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(197, 160, 89, 0.2)',
        glass: 'rgba(255, 255, 255, 0.1)',
        titanium: 'rgba(148, 163, 184, 0.2)',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.3)',
        'gold-glow-lg': '0 0 25px rgba(197, 160, 89, 0.4)',
        'spotlight': '0 0 80px 40px rgba(148, 163, 184, 0.08)',
        'warm-spot': '0 0 80px 40px rgba(197, 160, 89, 0.06)',
      },
      backgroundImage: {
        // Gradientes de atmósfera
        'gradient-section': 'linear-gradient(to bottom, #0F1115, #15171C)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
        'spotlight-blue': 'radial-gradient(ellipse at center, rgba(148, 163, 184, 0.08) 0%, transparent 70%)',
        'spotlight-gold': 'radial-gradient(ellipse at center, rgba(197, 160, 89, 0.06) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};
export default config;
