/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Sube una página de estudio privada a /estudio/{slug}.
 *
 * POR QUÉ NO VA EN GIT: el repositorio de GitHub es público. La página y la
 * huella de su clave viven en el bucket PRIVADO `estudio` de Supabase Storage,
 * que solo se lee con la llave de servidor; en el código queda solo la ruta que
 * pide la clave (src/app/estudio/[tema]/route.ts).
 *
 * USO:
 *   node scripts/subir-estudio.mjs <slug> <archivo.html> --clave <clave>
 *   node scripts/subir-estudio.mjs <slug> <archivo.html>        # actualiza la página, conserva la clave
 *
 * Cambiar la clave cierra las sesiones abiertas (cambia el token de la cookie).
 */

import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'estudio';

const args = process.argv.slice(2);
const iClave = args.indexOf('--clave');
const clave = iClave >= 0 ? args[iClave + 1] : null;
const [slug, archivo] = args.filter((a, i) => i !== iClave && i !== iClave + 1);

if (!URL_SB || !KEY) { console.error('❌ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local'); process.exit(1); }
if (!slug || !/^[a-z0-9-]+$/.test(slug) || !archivo) { console.error('Uso: node scripts/subir-estudio.mjs <slug> <archivo.html> [--clave <clave>]'); process.exit(1); }

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function asegurarBucket() {
  const r = await fetch(`${URL_SB}/storage/v1/bucket/${BUCKET}`, { headers });
  if (r.ok) {
    const b = await r.json();
    if (b.public) { console.error(`❌ El bucket ${BUCKET} es público: no se sube nada.`); process.exit(1); }
    return;
  }
  const c = await fetch(`${URL_SB}/storage/v1/bucket`, {
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  });
  if (!c.ok) { console.error('❌ No se pudo crear el bucket:', c.status, await c.text()); process.exit(1); }
  console.log(`🔒 Bucket privado «${BUCKET}» creado`);
}

async function subir(ruta, cuerpo, tipo) {
  const r = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}/${ruta}`, {
    method: 'POST', headers: { ...headers, 'Content-Type': tipo, 'x-upsert': 'true', 'Cache-Control': 'no-store' },
    body: cuerpo,
  });
  if (!r.ok) { console.error(`❌ No se pudo subir ${ruta}:`, r.status, await r.text()); process.exit(1); }
}

async function leerAcceso() {
  const r = await fetch(`${URL_SB}/storage/v1/object/${BUCKET}/${slug}/acceso.json`, { headers });
  return r.ok ? r.json() : null;
}

await asegurarBucket();

// La página del Artifact no trae el esqueleto del documento: se le pone aquí.
let html = fs.readFileSync(archivo, 'utf8');
if (!/^\s*<!doctype/i.test(html)) {
  html = `<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${html}\n</body>\n</html>\n`;
}
await subir(`${slug}/pagina.html`, html, 'text/html; charset=utf-8');

let acceso = await leerAcceso();
if (clave) {
  acceso = {
    clave_hash: crypto.createHash('sha256').update(`${slug}:${clave}`).digest('hex'),
    token: crypto.randomBytes(32).toString('hex'),
  };
  await subir(`${slug}/acceso.json`, JSON.stringify(acceso), 'application/json');
  console.log('🔑 Clave nueva guardada (las sesiones anteriores quedan cerradas)');
} else if (!acceso) {
  console.error('❌ Esta página no tiene clave todavía: pase --clave <clave>.');
  process.exit(1);
}

console.log(`✅ ${slug}: ${(html.length / 1024).toFixed(1)} KB → https://creatuactivo.com/estudio/${slug}`);
