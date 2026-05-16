#!/usr/bin/env node
/**
 * Genera todos los PNG de favicons + PWA icons desde el SVG vector master.
 * Single source of truth: public/favicon.svg
 * Editar el SVG y re-ejecutar este script regenera todos los tamaños.
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const svgSource = readFileSync(join(publicDir, 'favicon.svg'));

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
];

console.log('🎨 Regenerando favicons + PWA icons desde favicon.svg...\n');

try {
  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);
    await sharp(svgSource)
      .resize(size, size)
      .png({ quality: 100 })
      .toFile(outputPath);
    console.log(`✅ ${name} (${size}×${size})`);
  }
  console.log('\n🎉 Todos los iconos regenerados desde el SVG master.');
  console.log('   Si cambió el branding, bumpear ?v=N en src/app/layout.tsx para invalidar caches del navegador.');
} catch (error) {
  console.error('❌ Error generando favicons:', error.message);
  process.exit(1);
}
