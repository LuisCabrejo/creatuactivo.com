/**
 * Genera los logos para emails de CreaTuActivo
 * Estilo: THE ARCHITECT'S SUITE - Text-Only Logo
 * Estrategia: Claridad > Complejidad en email
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
  tagline: '#666666',
};

async function generateLogos() {
  console.log('🎨 Generando logos de solo texto para emails...\n');

  // Logo header: 280x80 - Text only
  const headerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="80" viewBox="0 0 280 80">
  <rect width="280" height="80" fill="${colors.dark}"/>
  <!-- Wordmark principal -->
  <text x="20" y="42" font-family="'Inter', -apple-system, sans-serif" font-weight="300" font-size="26" letter-spacing="-0.5" fill="${colors.text}">Crea<tspan font-weight="600" fill="${colors.gold}">Tu</tspan><tspan font-weight="600">Activo</tspan></text>
  <!-- Tagline -->
  <text x="20" y="62" font-family="'Inter', sans-serif" font-size="9" letter-spacing="2.5" fill="${colors.tagline}">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(headerSVG)).png().toFile(join(publicDir, 'logo-email-header-280x80.png'));
  console.log('✅ logo-email-header-280x80.png (280x80)');

  // Logo footer: 180x48 - Text only
  const footerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 180 48">
  <rect width="180" height="48" fill="${colors.dark}"/>
  <!-- Wordmark principal -->
  <text x="12" y="26" font-family="'Inter', -apple-system, sans-serif" font-weight="300" font-size="16" letter-spacing="-0.3" fill="${colors.text}">Crea<tspan font-weight="600" fill="${colors.gold}">Tu</tspan><tspan font-weight="600">Activo</tspan></text>
  <!-- Tagline -->
  <text x="12" y="39" font-family="'Inter', sans-serif" font-size="6.5" letter-spacing="1.8" fill="${colors.tagline}">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(footerSVG)).png().toFile(join(publicDir, 'logo-email-footer-180x48.png'));
  console.log('✅ logo-email-footer-180x48.png (180x48)');

  // Logo signature: 200x60 - Text only
  const signatureSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="${colors.dark}"/>
  <!-- Wordmark principal -->
  <text x="14" y="32" font-family="'Inter', -apple-system, sans-serif" font-weight="300" font-size="18" letter-spacing="-0.4" fill="${colors.text}">Crea<tspan font-weight="600" fill="${colors.gold}">Tu</tspan><tspan font-weight="600">Activo</tspan></text>
  <!-- Tagline -->
  <text x="14" y="46" font-family="'Inter', sans-serif" font-size="7" letter-spacing="2" fill="${colors.tagline}">THE ARCHITECT'S SUITE</text>
</svg>`;

  await sharp(Buffer.from(signatureSVG)).png().toFile(join(publicDir, 'logo-email-signature-200x60.png'));
  console.log('✅ logo-email-signature-200x60.png (200x60)');

  console.log('\n🎉 Logos de texto generados!');
  console.log('\n📋 Decisión estratégica:');
  console.log('   - Eliminar monograma CA de emails');
  console.log('   - Logo de solo texto = mayor claridad');
  console.log('   - Consistente con el menú del sitio');
  console.log('   - "THE ARCHITECT\'S SUITE" como diferenciador');
}

generateLogos().catch(console.error);
