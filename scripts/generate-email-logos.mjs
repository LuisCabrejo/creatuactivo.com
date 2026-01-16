/**
 * Genera los logos para emails de CreaTuActivo
 * Ejecutar: node scripts/generate-email-logos.mjs
 */

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Colores Quiet Luxury
const colors = {
  gold: '#D4AF37',
  dark: '#0a0a0f',
  text: '#f5f5f5',
};

/**
 * Crea un SVG del logo de CreaTuActivo
 */
function createLogoSVG(width, height, iconSize) {
  const iconRadius = Math.round(iconSize * 0.15);
  const fontSize = Math.round(iconSize * 0.6);
  const textFontSize = Math.round(height * 0.35);
  const iconX = Math.round((height - iconSize) / 2);
  const iconY = iconX;
  const textX = iconX + iconSize + Math.round(iconSize * 0.3);
  const textY = height / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" rx="${iconRadius}" fill="${colors.gold}"/>
  <text x="${iconX + iconSize / 2}" y="${iconY + iconSize / 2}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="700" fill="${colors.dark}" text-anchor="middle" dominant-baseline="central">C</text>
  <text x="${textX}" y="${textY}" font-family="system-ui, sans-serif" font-size="${textFontSize}" font-weight="500" fill="${colors.text}" dominant-baseline="central">Crea<tspan fill="${colors.gold}">Tu</tspan>Activo</text>
</svg>`;
}

async function generateLogos() {
  console.log('🎨 Generando logos para emails...\n');

  // Logo header con fondo oscuro: 280x80
  const headerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80" viewBox="0 0 280 80">
  <rect width="280" height="80" fill="${colors.dark}"/>
  <rect x="12" y="12" width="56" height="56" rx="8" fill="${colors.gold}"/>
  <text x="40" y="40" font-family="Georgia, serif" font-size="34" font-weight="700" fill="${colors.dark}" text-anchor="middle" dominant-baseline="central">C</text>
  <text x="84" y="40" font-family="system-ui, sans-serif" font-size="28" font-weight="500" fill="${colors.text}" dominant-baseline="central">Crea<tspan fill="${colors.gold}">Tu</tspan>Activo</text>
</svg>`;

  await sharp(Buffer.from(headerSVG)).png().toFile(join(publicDir, 'logo-email-header-280x80.png'));
  console.log('✅ logo-email-header-280x80.png');

  // Logo footer con fondo oscuro: 180x48
  const footerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48">
  <rect width="180" height="48" fill="${colors.dark}"/>
  <rect x="6" y="6" width="36" height="36" rx="5" fill="${colors.gold}"/>
  <text x="24" y="24" font-family="Georgia, serif" font-size="22" font-weight="700" fill="${colors.dark}" text-anchor="middle" dominant-baseline="central">C</text>
  <text x="52" y="24" font-family="system-ui, sans-serif" font-size="17" font-weight="500" fill="${colors.text}" dominant-baseline="central">Crea<tspan fill="${colors.gold}">Tu</tspan>Activo</text>
</svg>`;

  await sharp(Buffer.from(footerSVG)).png().toFile(join(publicDir, 'logo-email-footer-180x48.png'));
  console.log('✅ logo-email-footer-180x48.png');

  console.log('\n🎉 Logos generados!');
}

generateLogos().catch(console.error);
