#!/usr/bin/env node
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Autoriza la lectura de Google Search Console una sola vez y deja el token en
 * scripts/gsc-token.json, que es donde lo busca scripts/gsc-extractor.mjs.
 *
 *   node scripts/gsc-autorizar.mjs
 *
 * Por qué existe (1 oct 2026): el extractor pedía copiar un código y pegarlo en
 * la terminal (flujo «fuera de banda»), que Google retiró en 2022. Aquí se usa
 * el flujo de retorno local: se abre el navegador, el Director toca «Permitir»,
 * Google vuelve a http://127.0.0.1:{puerto} y este script recibe el código solo.
 *
 * Requiere scripts/gsc-credentials.json: un cliente OAuth de tipo «App de
 * escritorio» del proyecto de Google Cloud con la Search Console API activada.
 * Permiso pedido: solo lectura (webmasters.readonly). Las dos piezas están en
 * .gitignore.
 */
import { google } from 'googleapis';
import http from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const CREDENCIALES = join(aqui, 'gsc-credentials.json');
const TOKEN = join(aqui, 'gsc-token.json');
const PUERTO = 53682;

if (!existsSync(CREDENCIALES)) {
  console.error(`Falta ${CREDENCIALES} (cliente OAuth «App de escritorio» descargado de Google Cloud).`);
  process.exit(1);
}
const cred = JSON.parse(readFileSync(CREDENCIALES, 'utf8'));
const { client_id, client_secret } = cred.installed || cred.web || {};
const redirect = `http://127.0.0.1:${PUERTO}`;
const cliente = new google.auth.OAuth2(client_id, client_secret, redirect);
const url = cliente.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const servidor = http.createServer(async (req, res) => {
  const q = new URL(req.url, redirect).searchParams;
  if (!q.get('code') && !q.get('error')) { res.end(); return; }
  if (q.get('error')) {
    res.end('Autorización cancelada. Puede cerrar esta pestaña.');
    console.error('❌ Google respondió:', q.get('error'));
    servidor.close(); process.exit(1);
  }
  try {
    const { tokens } = await cliente.getToken(q.get('code'));
    writeFileSync(TOKEN, JSON.stringify(tokens));
    res.end('Listo: CreaTuActivo ya puede leer Search Console. Puede cerrar esta pestaña.');
    cliente.setCredentials(tokens);
    const sitios = await google.searchconsole({ version: 'v1', auth: cliente }).sites.list();
    console.log('✅ Token guardado en scripts/gsc-token.json');
    console.log('Propiedades a las que tiene acceso:');
    for (const s of sitios.data.siteEntry || []) console.log(`  ${s.siteUrl}  (${s.permissionLevel})`);
  } catch (e) {
    res.end('No se pudo completar la autorización. Vuelva a la terminal.');
    console.error('❌', e.message);
  }
  servidor.close();
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log('Abriendo el navegador para autorizar. Si no se abre, use esta dirección:\n');
  console.log(url + '\n');
  try { spawn('open', [url], { detached: true, stdio: 'ignore' }); } catch { /* manual */ }
});
