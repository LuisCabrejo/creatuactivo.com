/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Le pide el cumpleaños a cada distribuidor que todavía no lo tiene anotado
 * (9 oct 2026, Director). Envío de una sola vez, no un cron.
 *
 * Sin --enviar solo muestra a quién le llegaría y por qué vía. Con --enviar
 * manda: dentro de la ventana de 24 h como texto (sin costo), fuera por la
 * plantilla `cumpleanos_socio_v1` (que tiene que estar APROBADA:
 * someter-plantilla-cumpleanos-socio.mjs --estado). A números de EE. UU. fuera
 * de la ventana no se manda: Meta no entrega plantillas de marketing allá.
 *
 *   npx tsx scripts/pedir-cumpleanos-socios.mts               # en seco
 *   npx tsx scripts/pedir-cumpleanos-socios.mts --enviar      # envía
 *   npx tsx scripts/pedir-cumpleanos-socios.mts --enviar --solo luis-cabrejo-1288
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { sociosSinCumple, pedirCumpleA } from '../src/lib/wa-cumpleanos-socio';
import { ultimoMensajeDelSocio } from '../src/lib/wa-lunes-socio';
import { dentroDeVentana } from '../src/lib/wa-ventana';

const args = process.argv.slice(2);
const enviar = args.includes('--enviar');
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1] : null;

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const lista = (await sociosSinCumple(supabase)).filter((d) => !solo || d.constructorId === solo);
const ahora = new Date();

let enviados = 0, omitidos = 0;
for (const d of lista) {
  const enVentana = dentroDeVentana(await ultimoMensajeDelSocio(supabase, d), ahora);
  if (d.telefono.startsWith('1') && !enVentana) {
    console.log(`⏭  ${d.nombre.padEnd(34)} número de EE. UU. fuera de la ventana: Meta no lo entrega`);
    omitidos++;
    continue;
  }
  if (!enviar) {
    console.log(`·  ${d.nombre.padEnd(34)} → ${enVentana ? 'texto (sin costo)' : 'plantilla'}`);
    continue;
  }
  const r = await pedirCumpleA(supabase, d, ahora);
  console.log(`${r.ok ? '✅' : '❌'} ${d.nombre.padEnd(34)} ${r.via ?? ''}${r.error ? ` · ${r.error}` : ''}`);
  if (r.ok) enviados++;
  await new Promise((res) => setTimeout(res, 400));
}
console.log(`\n${lista.length} socios sin cumpleaños · ${enviar ? `${enviados} enviados` : 'en seco'} · ${omitidos} omitidos`);
