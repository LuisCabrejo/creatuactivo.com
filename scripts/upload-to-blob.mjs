#!/usr/bin/env node
// Script para subir videos optimizados a Vercel Blob
// Uso: node scripts/upload-to-blob.mjs

import { put, list } from '@vercel/blob';
import { createReadStream, statSync, existsSync } from 'fs';
import { basename } from 'path';

const VIDEOS_DIR = 'public/videos';
const VIDEOS = [
  { path: `${VIDEOS_DIR}/fundadores-1080p.mp4`, blobPath: 'videos/fundadores-1080p.mp4' },
  { path: `${VIDEOS_DIR}/fundadores-720p.mp4`, blobPath: 'videos/fundadores-720p.mp4' },
  { path: `${VIDEOS_DIR}/fundadores-4k.mp4`, blobPath: 'videos/fundadores-4k.mp4' },
  { path: `${VIDEOS_DIR}/fundadores-poster.jpg`, blobPath: 'videos/fundadores-poster.jpg' },
];

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function uploadVideos() {
  log('blue', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('blue', '   SUBIDA A VERCEL BLOB - Videos Fundadores');
  log('blue', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Verificar token
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    log('red', '❌ Error: Variable BLOB_READ_WRITE_TOKEN no está configurada');
    log('yellow', '\n📝 Pasos para obtener el token:');
    log('cyan', '   1. Ve a: https://vercel.com/dashboard');
    log('cyan', '   2. Selecciona tu proyecto');
    log('cyan', '   3. Ve a Storage → Blob → Settings');
    log('cyan', '   4. Click en "Generate Token"');
    log('cyan', '   5. Exporta la variable: export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."');
    process.exit(1);
  }

  log('green', '✓ Token de Vercel Blob encontrado\n');

  const uploadedUrls = {};
  let totalSize = 0;

  // Verificar que existen los archivos
  for (const video of VIDEOS) {
    if (!existsSync(video.path)) {
      log('red', `❌ Error: No se encontró el archivo: ${video.path}`);
      log('yellow', '   Ejecuta primero: ./scripts/optimize-video.sh [video-original.mp4]');
      process.exit(1);
    }
  }

  log('green', '✓ Todos los archivos encontrados\n');

  // Subir cada video
  for (const video of VIDEOS) {
    const fileName = basename(video.path);
    const stats = statSync(video.path);
    const sizeFormatted = formatBytes(stats.size);
    totalSize += stats.size;

    log('cyan', `📤 Subiendo: ${fileName} (${sizeFormatted})...`);

    try {
      const blob = await put(video.blobPath, createReadStream(video.path), {
        access: 'public',
        addRandomSuffix: false,
        token: token,
      });

      uploadedUrls[fileName] = blob.url;
      log('green', `   ✓ Subido: ${blob.url}\n`);
    } catch (error) {
      log('red', `   ❌ Error subiendo ${fileName}:`);
      console.error(error);
      process.exit(1);
    }
  }

  log('green', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('green', '   ✅ SUBIDA COMPLETADA');
  log('green', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  log('blue', `📦 Total subido: ${formatBytes(totalSize)}\n`);

  // Mostrar URLs para agregar a .env.local
  log('yellow', '📝 Agrega estas variables a tu archivo .env.local:\n');
  log('cyan', '# Videos Fundadores - Vercel Blob');

  if (uploadedUrls['fundadores-1080p.mp4']) {
    log('cyan', `NEXT_PUBLIC_VIDEO_FUNDADORES_1080P="${uploadedUrls['fundadores-1080p.mp4']}"`);
  }
  if (uploadedUrls['fundadores-720p.mp4']) {
    log('cyan', `NEXT_PUBLIC_VIDEO_FUNDADORES_720P="${uploadedUrls['fundadores-720p.mp4']}"`);
  }
  if (uploadedUrls['fundadores-4k.mp4']) {
    log('cyan', `NEXT_PUBLIC_VIDEO_FUNDADORES_4K="${uploadedUrls['fundadores-4k.mp4']}"`);
  }
  if (uploadedUrls['fundadores-poster.jpg']) {
    log('cyan', `NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER="${uploadedUrls['fundadores-poster.jpg']}"`);
  }

  log('yellow', '\n🚀 Siguiente paso:');
  log('cyan', '   1. Copia las variables de arriba a .env.local');
  log('cyan', '   2. Reinicia el servidor de desarrollo: npm run dev');
  log('cyan', '   3. Visita: http://localhost:3000/fundadores\n');

  // Verificar archivos en Blob
  log('blue', '📋 Verificando archivos en Vercel Blob...\n');
  try {
    const { blobs } = await list({ token });
    const videoBlobs = blobs.filter(b => b.pathname.startsWith('videos/fundadores'));

    log('green', `✓ Archivos en Blob (${videoBlobs.length}):`);
    videoBlobs.forEach(blob => {
      log('cyan', `   • ${blob.pathname} - ${formatBytes(blob.size)}`);
    });
  } catch (error) {
    log('yellow', '⚠️  No se pudo listar archivos en Blob (esto es normal)');
  }

  console.log('');
}

uploadVideos().catch((error) => {
  log('red', '\n❌ Error fatal:');
  console.error(error);
  process.exit(1);
});
