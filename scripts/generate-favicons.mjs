#!/usr/bin/env node
/**
 * Generate Favicon Sizes
 * Optimizes favicon.png into multiple sizes for different use cases
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const sourceFavicon = join(publicDir, 'favicon.png');

// Favicon sizes for different platforms
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
];

console.log('🎨 Generando favicons optimizados...\n');

try {
  // Generate each size
  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);

    await sharp(sourceFavicon)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100 })
      .toFile(outputPath);

    console.log(`✅ ${name} (${size}x${size})`);
  }

  console.log('\n🎉 Favicons generados exitosamente!');
  console.log('\nArchivos creados:');
  console.log('  - favicon-16x16.png (navegadores antiguos)');
  console.log('  - favicon-32x32.png (navegadores modernos)');
  console.log('  - favicon-96x96.png (alta resolución)');
  console.log('  - apple-touch-icon.png (iOS home screen)');

} catch (error) {
  console.error('❌ Error generando favicons:', error.message);
  process.exit(1);
}
