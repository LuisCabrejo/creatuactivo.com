/**
 * Genera los logos para emails de CreaTuActivo
 * Estilo: THE ARCHITECT'S SUITE - CA Monogram
 * Ejecutar: node scripts/generate-email-logos.mjs
 */

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Colores Architect's Suite
const colors = {
  gold: '#C5A059',
  dark: '#0F1115',
  text: '#E5E5E5',
};

/**
 * Genera el CA monogram SVG escalado
 */
function createCAMonogram(size, strokeWidth) {
  const scale = size / 60; // Base 60px
  return `
    <g transform="scale(${scale})">
      <path d="M25 5 H5 V55 H35" stroke="${colors.gold}" stroke-width="${strokeWidth}" stroke-linecap="square" fill="none"/>
      <path d="M30 55 V15 H55 V55" stroke="${colors.gold}" stroke-width="${strokeWidth}" stroke-linecap="square" fill="none"/>
      <path d="M30 35 H55" stroke="${colors.gold}" stroke-width="${strokeWidth}" fill="none"/>
    </g>`;
}

async function generateLogos() {
  console.log('🎨 Generando logos para emails (CA Monogram)...\n');

  // Logo header: 280x80
  const headerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80" viewBox="0 0 280 80">
  <rect width="280" height="80" rx="4" fill="${colors.dark}"/>
  <g transform="translate(10, 10)">
    ${createCAMonogram(60, 3)}
  </g>
  <text x="85" y="35" font-family="Montserrat, sans-serif" font-weight="400" font-size="20" letter-spacing="1" fill="${colors.text}">CreaTu</text>
  <text x="170" y="35" font-family="'Playfair Display', serif" font-weight="700" font-size="20" letter-spacing="0.5" fill="${colors.gold}">Activo</text>
  <text x="85" y="58" font-family="sans-serif" font-size="10" letter-spacing="2" fill="#666">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(headerSVG)).png().toFile(join(publicDir, 'logo-email-header-280x80.png'));
  console.log('✅ logo-email-header-280x80.png');

  // Logo footer: 180x48
  const footerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48">
  <rect width="180" height="48" rx="4" fill="${colors.dark}"/>
  <g transform="translate(6, 6)">
    ${createCAMonogram(36, 2)}
  </g>
  <text x="52" y="22" font-family="Montserrat, sans-serif" font-weight="400" font-size="12" letter-spacing="0.5" fill="${colors.text}">CreaTu</text>
  <text x="103" y="22" font-family="'Playfair Display', serif" font-weight="700" font-size="12" fill="${colors.gold}">Activo</text>
  <text x="52" y="36" font-family="sans-serif" font-size="7" letter-spacing="1.5" fill="#555">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(footerSVG)).png().toFile(join(publicDir, 'logo-email-footer-180x48.png'));
  console.log('✅ logo-email-footer-180x48.png');

  // Logo signature: 200x60
  const signatureSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <rect width="200" height="60" rx="4" fill="${colors.dark}"/>
  <g transform="translate(8, 8)">
    ${createCAMonogram(44, 2.5)}
  </g>
  <text x="62" y="28" font-family="Montserrat, sans-serif" font-weight="400" font-size="14" letter-spacing="0.5" fill="${colors.text}">CreaTu</text>
  <text x="122" y="28" font-family="'Playfair Display', serif" font-weight="700" font-size="14" fill="${colors.gold}">Activo</text>
  <text x="62" y="44" font-family="sans-serif" font-size="8" letter-spacing="1.5" fill="#555">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(signatureSVG)).png().toFile(join(publicDir, 'logo-email-signature-200x60.png'));
  console.log('✅ logo-email-signature-200x60.png');

  console.log('\n🎉 Logos de email generados con estilo CA Monogram!');
}

generateLogos().catch(console.error);
