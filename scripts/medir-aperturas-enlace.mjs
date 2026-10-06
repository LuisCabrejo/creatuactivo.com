/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * ¿Cuántos abren el enlace de Queswa y no le escriben? (6 oct 2026, caso Felipe)
 *
 * El enlace del socio (/{slug}/queswa y los de los videos) redirige a WhatsApp
 * con el mensaje escrito; la persona tiene que tocar «Enviar». Las aperturas se
 * registran en `page_visits` desde el 6 oct; los primeros mensajes, en
 * `nexus_conversations` («Hola Queswa, vengo del enlace de {slug}»). Este script
 * los cruza por día y por socio.
 *
 *   node scripts/medir-aperturas-enlace.mjs [--dias 7]
 *
 * ⚠️ Una apertura no es una persona: quien toca dos veces cuenta dos. Y el primer
 * mensaje puede llegar horas después, o al día siguiente.
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';

const i = process.argv.indexOf('--dias');
const dias = i > -1 ? Number(process.argv[i + 1]) : 7;
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: visitas } = await sb.from('page_visits').select('mentor_ref_id, page_entry, timestamp').gte('timestamp', desde);
const { data: conv } = await sb.from('nexus_conversations').select('fingerprint_id, messages, created_at').like('fingerprint_id', 'wa_%').gte('created_at', desde);

const dia = (t) => new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
const filas = new Map();
const clave = (d, slug) => `${d} · ${slug}`;
for (const v of visitas ?? []) {
  if (!/\/(queswa|acceso|como-funciona|estrategia|como-entra-el-dinero|que-debo-hacer-yo)$/.test(v.page_entry)) continue;
  const k = clave(dia(v.timestamp), v.mentor_ref_id); const f = filas.get(k) ?? { aperturas: 0, escribieron: new Set() };
  f.aperturas++; filas.set(k, f);
}
for (const c of conv ?? []) {
  for (const m of c.messages ?? []) {
    const r = m.role === 'user' && String(m.content ?? '').match(/vengo del enlace de ([a-z0-9-]+)/i);
    if (!r) continue;
    const k = clave(dia(c.created_at), r[1].toLowerCase()); const f = filas.get(k) ?? { aperturas: 0, escribieron: new Set() };
    f.escribieron.add(c.fingerprint_id); filas.set(k, f);
  }
}
const orden = [...filas.entries()].sort(([a], [b]) => a.localeCompare(b));
let A = 0, E = 0;
console.log(`Aperturas del enlace vs personas que escribieron — últimos ${dias} días\n`);
for (const [k, f] of orden) { A += f.aperturas; E += f.escribieron.size; console.log(`${k.padEnd(42)} abrieron ${String(f.aperturas).padStart(3)} · escribieron ${String(f.escribieron.size).padStart(3)}`); }
console.log(`\nTotal: ${A} aperturas · ${E} personas escribieron${A ? ` · ${Math.round((E / A) * 100)}% llegó a Queswa` : ''}`);
console.log('(Las aperturas se registran desde el 6 oct 2026: antes de esa fecha solo hay mensajes.)');
