/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * /estudio/{tema} — PÁGINAS DE ESTUDIO PRIVADAS DEL DIRECTOR.
 *
 * Nació el 27 oct 2026 con el resumen de la entrevista de David Vélez en Cracks:
 * una página para leer en el navegador, fuera del menú y de los buscadores, con
 * clave. El repositorio de GitHub es público, así que ni la página ni la clave
 * viven aquí: están en el bucket PRIVADO `estudio` de Supabase Storage
 * ({tema}/pagina.html y {tema}/acceso.json), que solo se lee con la llave de
 * servidor. Se suben con `node scripts/subir-estudio.mjs`.
 *
 * La respuesta es HTML completo, sin el layout del sitio: sin menú, sin
 * tracking.js y sin Queswa. La cookie guarda un token aleatorio, nunca la clave.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BUCKET = 'estudio';

const CABECERAS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

type Acceso = { clave_hash: string; token: string };

function cookieDe(tema: string) {
  return `estudio_${tema.replace(/-/g, '_')}`;
}

async function leer(ruta: string): Promise<Response | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const r = await fetch(`${url}/storage/v1/object/${BUCKET}/${ruta}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  });
  return r.ok ? r : null;
}

async function leerAcceso(tema: string): Promise<Acceso | null> {
  const r = await leer(`${tema}/acceso.json`);
  return r ? ((await r.json()) as Acceso) : null;
}

function iguales(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function formulario(tema: string, error = false) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Estudio</title>
<style>
:root{--bg:#0F1115;--card:#15171C;--fg:#E5E5E5;--muted:#94A3B8;--oro:#C5A059;--alerta:#F43F5E;color-scheme:dark}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:0 16px}
form{background:var(--card);border:1px solid rgba(255,255,255,.1);padding:28px;display:grid;gap:14px;width:100%;max-width:20rem}
label{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
input{font:inherit;font-size:1.4rem;letter-spacing:.3em;text-align:center;padding:10px;background:var(--bg);color:var(--fg);border:1px solid rgba(255,255,255,.15)}
input:focus{outline:2px solid var(--oro);outline-offset:1px}
button{font:inherit;font-weight:600;padding:10px;background:transparent;color:var(--oro);border:1px solid var(--oro);cursor:pointer}
button:hover{background:rgba(197,160,89,.1)}
p{margin:0;color:var(--alerta);font-size:.9rem}
</style></head>
<body><form method="post" action="/estudio/${tema}">
<label for="clave">Clave</label>
<input id="clave" name="clave" type="password" inputmode="numeric" autocomplete="current-password" autofocus required>
${error ? '<p>La clave no es correcta.</p>' : ''}
<button type="submit">Entrar</button>
</form></body></html>`;
}

const NO_EXISTE = () => new NextResponse('No encontrado', { status: 404, headers: CABECERAS });

export async function GET(req: NextRequest, { params }: { params: { tema: string } }) {
  const tema = params.tema;
  if (!/^[a-z0-9-]+$/.test(tema)) return NO_EXISTE();
  const acceso = await leerAcceso(tema);
  if (!acceso) return NO_EXISTE();

  const cookie = req.cookies.get(cookieDe(tema))?.value || '';
  if (!cookie || !iguales(cookie, acceso.token)) {
    return new NextResponse(formulario(tema), { headers: CABECERAS });
  }

  const pagina = await leer(`${tema}/pagina.html`);
  if (!pagina) return NO_EXISTE();
  return new NextResponse(await pagina.text(), { headers: CABECERAS });
}

export async function POST(req: NextRequest, { params }: { params: { tema: string } }) {
  const tema = params.tema;
  if (!/^[a-z0-9-]+$/.test(tema)) return NO_EXISTE();
  const acceso = await leerAcceso(tema);
  if (!acceso) return NO_EXISTE();

  const datos = await req.formData();
  const clave = String(datos.get('clave') || '').trim();
  const hash = crypto.createHash('sha256').update(`${tema}:${clave}`).digest('hex');

  if (!iguales(hash, acceso.clave_hash)) {
    // Una clave corta se adivina probando: cada intento fallido tarda un segundo.
    await new Promise((r) => setTimeout(r, 1000));
    return new NextResponse(formulario(tema, true), { status: 401, headers: CABECERAS });
  }

  const res = NextResponse.redirect(new URL(`/estudio/${tema}`, req.url), 303);
  res.cookies.set(cookieDe(tema), acceso.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: `/estudio/${tema}`,
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
