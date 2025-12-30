#!/usr/bin/env node
/**
 * Genera los logos PNG para emails con el nuevo estilo "C" Quiet Luxury
 * Ejecutar: node scripts/generate-email-logos.mjs
 */

import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Colores del branding
const GOLD = '#D4AF37';
const DARK = '#0a0a0f';
const LIGHT = '#f5f5f5';

/**
 * Genera un SVG del logo completo (icono + wordmark)
 */
function generateFullLogoSVG(width, height) {
  const iconSize = Math.floor(height * 0.7);
  const iconRadius = Math.floor(iconSize * 0.15);
  const fontSize = Math.floor(height * 0.35);
  const iconFontSize = Math.floor(iconSize * 0.65);
  const iconX = Math.floor(height * 0.15);
  const iconY = Math.floor((height - iconSize) / 2);
  const textX = iconX + iconSize + Math.floor(height * 0.15);
  const textY = Math.floor(height * 0.62);

  // Calcular posiciones de texto
  const creaWidth = fontSize * 2.2;
  const tuWidth = fontSize * 1.1;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Fondo transparente -->

  <!-- Icono C dorado -->
  <rect x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" rx="${iconRadius}" fill="${GOLD}"/>
  <text x="${iconX + iconSize/2}" y="${iconY + iconSize/2}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${iconFontSize}"
        font-weight="700"
        fill="${DARK}"
        text-anchor="middle"
        dominant-baseline="central">C</text>

  <!-- Wordmark CreaTuActivo -->
  <text x="${textX}" y="${textY}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="400"
        fill="${LIGHT}">Crea</text>
  <text x="${textX + creaWidth}" y="${textY}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="400"
        fill="${GOLD}">Tu</text>
  <text x="${textX + creaWidth + tuWidth}" y="${textY}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="400"
        fill="${LIGHT}">Activo</text>
</svg>`;
}

/**
 * Genera un SVG del logo solo icono
 */
function generateIconOnlySVG(size) {
  const radius = Math.floor(size * 0.15);
  const fontSize = Math.floor(size * 0.65);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${GOLD}"/>
  <text x="${size/2}" y="${size/2}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="${DARK}"
        text-anchor="middle"
        dominant-baseline="central">C</text>
</svg>`;
}

async function generateLogos() {
  console.log('Generando logos de email con nuevo estilo "C"...\n');

  const logos = [
    {
      name: 'logo-email-header-200x80.png',
      width: 200,
      height: 80,
      type: 'full'
    },
    {
      name: 'logo-email-footer-120x48.png',
      width: 120,
      height: 48,
      type: 'full'
    },
    {
      name: 'logo-email-signature-150x60.png',
      width: 150,
      height: 60,
      type: 'full'
    },
  ];

  for (const logo of logos) {
    try {
      const svg = logo.type === 'full'
        ? generateFullLogoSVG(logo.width, logo.height)
        : generateIconOnlySVG(logo.width);

      const outputPath = join(publicDir, logo.name);

      await sharp(Buffer.from(svg))
        .png()
        .toFile(outputPath);

      console.log(`✅ ${logo.name} (${logo.width}x${logo.height})`);
    } catch (error) {
      console.error(`❌ Error generando ${logo.name}:`, error.message);
    }
  }

  console.log('\n✨ Logos de email generados exitosamente');
  console.log('\nNota: Los emails que usan /api/logo-email ya generan el logo dinámicamente.');
  console.log('Los PNGs estáticos son para clientes de email que no soportan imágenes dinámicas.');
}

generateLogos().catch(console.error);
