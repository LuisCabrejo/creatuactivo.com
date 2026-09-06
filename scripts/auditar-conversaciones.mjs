/**
 * Auditoría del tráfico real de Queswa — vuelca las conversaciones de
 * `nexus_conversations` a dos archivos legibles, separando a las personas de
 * los arneses.
 *
 *   node scripts/auditar-conversaciones.mjs [--dias 10] [--todo] [--salida carpeta]
 *
 * Deja en la carpeta de salida (por defecto docs/respaldos/auditoria-<fecha>/):
 *   conversaciones.txt  hilos completos por persona, en orden, con el
 *                       search_method y los fragmentos que llegaron en cada turno
 *   preguntas.tsv       una fila por mensaje de la persona (para ver CÓMO preguntan)
 *
 * Por defecto solo salen las HUELLAS REALES: una persona llega por el enlace
 * del socio («Hola Queswa, vengo del enlace de …») o saludando, desde `wa_57`
 * + 10 dígitos, un BSUID `wa_CO.…` o una huella web nula. Los arneses arrancan
 * con la pregunta de prueba directamente (wa_5730…, wa_5731… de 4 turnos,
 * wa_conv_*, web_probe_*, wa_e3_*…) y son la mayoría de las filas; salen con --todo.
 *
 * Cómo leerlo: un «sí» de la persona con `search_method = fragment_vector_search`
 * es un nodo que NO disparó — la aceptación cayó al motor y el modelo improvisó.
 * Un turno con `-` lo dictó el webhook (apertura, botones, conductor).
 *
 * Dinámica completa → docs/handoff/queswa/AUDITORIA_TRAFICO_ORGANICO_SEP2026.md
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const dias = Number(arg('--dias', 10));
const todo = process.argv.includes('--todo');
const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
const salida = arg('--salida', path.join('docs', 'respaldos', `auditoria-${hoy}`));

const RE_ARNES = /conv|probe|_p_|q23|wa_e3_|^wa_5730\d{9,}|sede_probe|deploy/;
const huellaDePersona = (fp) => !fp || fp === 'null' || (!RE_ARNES.test(fp) && /^wa_(57\d{10}|CO\.\d+|[A-Z]{2}\.\d+)$/.test(fp));
const abreComoPersona = (primerMensaje) => /vengo del enlace|^\s*(hola|buenas|buenos)/i.test(primerMensaje || '');

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const desde = new Date(Date.now() - dias * 864e5).toISOString();
const { data, error } = await s.from('nexus_conversations')
  .select('fingerprint_id,created_at,messages,metadata').gt('created_at', desde).order('created_at');
if (error) throw error;

const bogota = (iso) => new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', hour12: false }).replace(',', '');
const porHuella = {};
for (const r of data) (porHuella[r.fingerprint_id ?? 'null'] ||= []).push(r);
if (!todo) {
  for (const [fp, filas] of Object.entries(porHuella)) {
    const primero = (filas[0].messages || []).find((m) => m.role === 'user')?.content;
    if (!huellaDePersona(fp) || (fp !== 'null' && !abreComoPersona(primero))) delete porHuella[fp];
  }
}

let txt = '', tsv = 'canal\thuella\tfecha_bogota\tturno\tmensaje\tsearch_method\tfragmentos\n';
for (const [fp, filas] of Object.entries(porHuella).sort((a, b) => a[1][0].created_at.localeCompare(b[1][0].created_at))) {
  const canal = fp.startsWith('wa_') ? 'WA' : 'WEB';
  txt += `\n\n==================== ${canal} ${fp} · ${filas.length} turnos · ${bogota(filas[0].created_at)} → ${bogota(filas.at(-1).created_at)} ====================\n`;
  filas.forEach((r, i) => {
    const sm = r.metadata?.search_method || '-';
    const docs = (r.metadata?.documents_used || []).map((d) => String(d).replace(/^.*\//, '')).join(',');
    txt += `\n--- turno ${i + 1} · ${bogota(r.created_at).slice(-8, -3)} · ${sm} · ${docs}\n`;
    for (const m of r.messages || []) {
      txt += `[${String(m.role).toUpperCase()}] ${m.content}\n`;
      if (m.role === 'user') tsv += `${canal}\t${fp}\t${bogota(r.created_at)}\t${i + 1}\t${String(m.content).replace(/\s+/g, ' ')}\t${sm}\t${docs}\n`;
    }
  });
}

fs.mkdirSync(salida, { recursive: true });
fs.writeFileSync(path.join(salida, 'conversaciones.txt'), txt);
fs.writeFileSync(path.join(salida, 'preguntas.tsv'), tsv);
const personas = Object.keys(porHuella).length;
console.log(`${personas} huella(s) ${todo ? '(reales + arnés)' : 'reales'} · ${data.length} turnos en la base en ${dias} días → ${salida}/`);
