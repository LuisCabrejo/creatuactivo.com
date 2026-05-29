#!/usr/bin/env node
/**
 * Genera todos los PNG de favicons + PWA icons.
 *
 * Dos fuentes (single source of truth por familia):
 *  1. public/favicon.svg          → favicons chicos + PWA icons (isotipo PLANO).
 *     A tamaño pequeño el 3D es ruido; el plano lee limpio en la pestaña.
 *  2. public/images/logotipo.png  → ícono grande de marca (logo 3D bimetálico)
 *     sobre fondo carbón. Se usa en tarjetas de compartir / pantalla de carga
 *     (manifest "any" 1200×1200 + OG de servilleta), donde el detalle 3D luce.
 *
 * Editar el SVG / el logo y re-ejecutar este script regenera todos los tamaños.
 */

import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Fondo carbón del sistema Bimetálico v3.0
const CARBON = { r: 0x0f, g: 0x11, b: 0x15, alpha: 1 };

const svgSource = readFileSync(join(publicDir, 'favicon.svg'));
const logoSource = join(publicDir, 'images', 'logotipo.png');

// Familia 1: isotipo plano desde el SVG master (transparente)
const flatSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

// Familia 2: marca 3D sobre carbón (icono grande para compartir/carga)
// padFactor = proporción del lienzo reservada como margen total (logo respira)
const brandSizes = [
  { name: 'favicon-cta.png', size: 1200, padFactor: 0.30 },
];

console.log('🎨 Regenerando favicons + PWA icons...\n');

try {
  console.log('— Familia plana (favicon.svg):');
  for (const { name, size } of flatSizes) {
    await sharp(svgSource)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(join(publicDir, name));
    console.log(`  ✅ ${name} (${size}×${size})`);
  }

  console.log('\n— Familia de marca 3D (images/logotipo.png sobre carbón):');
  for (const { name, size, padFactor } of brandSizes) {
    const logoSize = Math.round(size * (1 - padFactor));
    const logo = await sharp(logoSource)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: CARBON },
    })
      .composite([{ input: logo, gravity: 'center' }])
      .png({ quality: 100 })
      .toFile(join(publicDir, name));
    const kb = Math.round(statSync(join(publicDir, name)).size / 1024);
    console.log(`  ✅ ${name} (${size}×${size}, ${kb}KB)`);
  }

  console.log('\n🎉 Todos los iconos regenerados.');
  console.log('   Si cambió el branding, bumpear ?v=N en src/app/layout.tsx y public/site.webmanifest para invalidar caches.');
} catch (error) {
  console.error('❌ Error generando favicons:', error.message);
  process.exit(1);
}
