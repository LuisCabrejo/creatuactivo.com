/**
 * Generate PWA icons from SVG
 * Run: node scripts/generate-pwa-icons.mjs
 *
 * Note: Requires sharp to be installed: npm install sharp --save-dev
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Read the SVG favicon
const svgPath = join(publicDir, 'favicon.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

// Sizes to generate
const sizes = [
  { name: 'web-app-manifest-192x192.png', size: 192 },
  { name: 'web-app-manifest-512x512.png', size: 512 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('🎨 Generating PWA icons from favicon.svg...\n');

  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated ${name} (${size}x${size})`);
  }

  console.log('\n🎉 All PWA icons generated successfully!');
  console.log('\nNext steps:');
  console.log('1. Users need to clear their browser cache');
  console.log('2. For installed PWAs, users may need to uninstall and reinstall');
}

generateIcons().catch(err => {
  console.error('❌ Error generating icons:', err.message);
  console.log('\nMake sure to install sharp first: npm install sharp --save-dev');
  process.exit(1);
});
