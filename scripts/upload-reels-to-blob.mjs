#!/usr/bin/env node
// Sube los reels optimizados + posters a Vercel Blob → imprime mapa de URLs.
// Uso: node scripts/upload-reels-to-blob.mjs   (requiere correr antes optimize-reels.sh)
import { put } from '@vercel/blob';
import { createReadStream, existsSync, readFileSync, statSync } from 'fs';

const DIR = 'public/videos/reels';
const NICHOS = ['corporativo', 'empleados', 'empresarios', 'diaspora', 'informales'];

function loadToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const env = readFileSync('.env.local', 'utf8');
    const m = env.match(/^BLOB_READ_WRITE_TOKEN=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
  return null;
}

const token = loadToken();
if (!token) { console.error('❌ Falta BLOB_READ_WRITE_TOKEN (env o .env.local)'); process.exit(1); }

const urls = {};
for (const nicho of NICHOS) {
  const video = `${DIR}/${nicho}-web.mp4`;
  const poster = `${DIR}/${nicho}-poster.jpg`;
  if (!existsSync(video)) { console.error(`❌ Falta ${video} — corre optimize-reels.sh primero`); process.exit(1); }
  const mb = (statSync(video).size / 1048576).toFixed(1);
  console.log(`📤 ${nicho} (${mb}MB) ...`);
  const v = await put(`reels/${nicho}.mp4`, createReadStream(video), { access: 'public', addRandomSuffix: false, token, contentType: 'video/mp4' });
  let posterUrl = null;
  if (existsSync(poster)) {
    const p = await put(`reels/${nicho}-poster.jpg`, createReadStream(poster), { access: 'public', addRandomSuffix: false, token, contentType: 'image/jpeg' });
    posterUrl = p.url;
  }
  urls[nicho] = { video: v.url, poster: posterUrl };
  console.log(`   ✓ ${v.url}`);
}

console.log('\n━━━ MAPA DE URLS (pegar en src/lib/reels.ts) ━━━\n');
console.log('export const REEL_ASSETS: Record<string, { video: string; poster: string | null }> = ' + JSON.stringify(urls, null, 2));
