#!/usr/bin/env node
/**
 * Inspección de URL en Google Search Console — SOLO LECTURA (7 oct 2026).
 *
 * Responde, por URL, lo que dice el informe «Inspección de URL» del panel:
 * si está indexada, cuándo la rastreó Google por última vez, qué canonical
 * eligió (el suyo y el que declaró la página) y qué resultados enriquecidos
 * detectó. Sirve para comprobar un cambio de SEO después del deploy sin abrir
 * el panel, en las dos propiedades del ecosistema.
 *
 * Usa el mismo acceso OAuth que gsc-extractor.mjs (permiso webmasters.readonly,
 * credenciales en scripts/gsc-credentials.json y scripts/gsc-token.json, los dos
 * en .gitignore). Si el permiso venció: `node scripts/gsc-autorizar.mjs`.
 *
 * ⚠️ Lo que el API NO hace: «Solicitar indexación». Esa acción solo existe en el
 * panel de Search Console (Inspección de URL → Solicitar indexación). El API de
 * Indexing de Google es solo para ofertas de empleo y transmisiones en vivo.
 *
 * Uso:
 *   node scripts/gsc-inspeccionar.mjs https://creatuactivo.com/ https://creatuactivo.com/tecnologia
 *   node scripts/gsc-inspeccionar.mjs --propiedad https://luiscabrejo.com/ https://luiscabrejo.com/historia
 *
 * La propiedad se deduce del dominio de la primera URL si no se pasa.
 */
import { google } from 'googleapis';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = join(__dirname, 'gsc-credentials.json');
const TOKEN_PATH = join(__dirname, 'gsc-token.json');

const args = process.argv.slice(2);
let propiedad = null;
const urls = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--propiedad') propiedad = args[++i];
  else urls.push(args[i]);
}
if (!urls.length) {
  console.error('Uso: node scripts/gsc-inspeccionar.mjs [--propiedad https://dominio/] URL [URL…]');
  process.exit(2);
}
if (!propiedad) propiedad = new URL(urls[0]).origin + '/';

if (!existsSync(CREDENTIALS_PATH) || !existsSync(TOKEN_PATH)) {
  console.error('❌ Faltan scripts/gsc-credentials.json o scripts/gsc-token.json. Ejecute: node scripts/gsc-autorizar.mjs');
  process.exit(1);
}
const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'));
auth.setCredentials(token);
if (token.expiry_date && token.expiry_date < Date.now()) {
  const { credentials: nuevo } = await auth.refreshAccessToken();
  auth.setCredentials(nuevo);
  writeFileSync(TOKEN_PATH, JSON.stringify(nuevo));
}

const sc = google.searchconsole({ version: 'v1', auth });
console.log(`Propiedad: ${propiedad}\n`);
for (const url of urls) {
  try {
    const { data } = await sc.urlInspection.index.inspect({
      requestBody: { inspectionUrl: url, siteUrl: propiedad, languageCode: 'es' },
    });
    const r = data.inspectionResult || {};
    const ix = r.indexStatusResult || {};
    const rich = r.richResultsResult?.detectedItems?.map((d) => d.richResultType).join(', ') || 'ninguno';
    console.log(url);
    console.log(`  Veredicto:            ${ix.verdict ?? '—'} · ${ix.coverageState ?? '—'}`);
    console.log(`  Último rastreo:       ${ix.lastCrawlTime ?? '—'}`);
    console.log(`  Canonical declarado:  ${ix.userCanonical ?? '—'}`);
    console.log(`  Canonical de Google:  ${ix.googleCanonical ?? '—'}`);
    console.log(`  Resultados enriquecidos detectados: ${rich}`);
    console.log('');
  } catch (e) {
    console.log(`${url}\n  ❌ ${e.message}\n`);
  }
}
