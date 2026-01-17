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
        // THE ARCHITECT'S SUITE - Quiet Luxury Palette
        // Backgrounds
        carbon: {
          DEFAULT: '#0F1115',  // Carbono Profundo (main bg)
          light: '#1A1D23',    // Obsidiana Suave (cards)
        },
        // Accents
        champagne: {
          DEFAULT: '#C5A059',  // Champagne Gold (primary)
          hover: '#D4AF37',    // Gold hover
          bronze: '#B38B59',   // Bronze text
        },
        // Text
        smoke: {
          DEFAULT: '#E5E5E5',  // Blanco Humo (paragraphs)
          muted: '#A3A3A3',    // Gris Titanio (secondary)
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
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.3)',
        'gold-glow-lg': '0 0 25px rgba(197, 160, 89, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
