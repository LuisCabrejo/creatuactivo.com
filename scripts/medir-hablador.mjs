/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Cuánta gente escanea el hablador de mostrador? (20 nov 2026, Director)
 *
 * El hablador (/hablador/{slug}) lleva un QR a `creatuactivo.com/{slug}/hablador`,
 * que abre el catálogo del socio y deja una fila en `page_visits` por escaneo
 * (page_entry `/{slug}/hablador`, origen 'qr'). La escribe
 * src/app/[slug]/[destino]/page.tsx. Este script la lee por día y por socio.
 *
 *   node scripts/medir-hablador.mjs [--dias 7]
 *
 * ⚠️ Un escaneo no es una persona: quien escanea dos veces cuenta dos; por eso va
 * también la cuenta de navegadores (la cookie). Sin cookie, el escaneo se cuenta
 * pero no se distingue de otro.
 * ⚠️ Lo que pasa después (la conversación con Queswa en el catálogo, el pedido por
 * WhatsApp) no se cruza aquí: este script mide si el hablador hace que la gente
 * saque el celular, que es lo primero que hay que saber.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 7;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const dia = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

const { data: visitas, error } = await sb
  .from('page_visits')
  .select('mentor_ref_id, page_entry, timestamp, dispositivo, visitante')
  .like('page_entry', '%/hablador%')
  .gte('timestamp', desde);
if (error) { console.error(error.message); process.exit(1); }

const filas = new Map();
const navegadores = new Set();
let total = 0;
for (const v of visitas ?? []) {
  // `/{slug}/hablador-us`: el de Estados Unidos (27 nov 2026).
  if (!/^\/[^/]+\/hablador(?:-us)?$/.test(v.page_entry ?? '')) continue;
  total++;
  const k = `${dia(v.timestamp)} · ${v.mentor_ref_id}${v.page_entry.endsWith('-us') ? ' (EE. UU.)' : ''}`;
  const f = filas.get(k) ?? { escaneos: 0, navegadores: new Set(), sinCookie: 0 };
  f.escaneos++;
  if (v.visitante) { f.navegadores.add(v.visitante); navegadores.add(v.visitante); } else f.sinCookie++;
  filas.set(k, f);
}

console.log(`\nEl hablador de mostrador (/{slug}/hablador) · últimos ${dias} días\n`);
if (!filas.size) console.log('   Todavía nadie lo ha escaneado con la medición puesta (desde el 20 nov 2026).');
else {
  console.log(`   ${'día · socio'.padEnd(40)} escaneos  navegadores`);
  for (const [k, f] of [...filas].sort()) {
    console.log(`   ${k.padEnd(40)} ${String(f.escaneos).padStart(8)}  ${String(f.navegadores.size + f.sinCookie).padStart(11)}`);
  }
  console.log(`   Total: ${total} escaneos · ${navegadores.size} navegadores con cookie`);
}
console.log('');
