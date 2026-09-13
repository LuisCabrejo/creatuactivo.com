#!/usr/bin/env node
/**
 * Despliega `knowledge_base/arsenal_ciencia_socio.txt` SOLO al tenant `dashboard`.
 *
 * Es el único arsenal que no se clona a los tres tenants (13 sep 2026, Director):
 * el Dashboard es privado y no se indexa, y ahí Queswa le habla al distribuidor
 * de la evidencia con su calibre. El canal y la web conservan sus guardarraíles y
 * NO deben recibirlo. Ver CLAUDE.md → «Los tenants deben tener los mismos
 * fragmentos… salvo arsenal_ciencia_socio».
 *
 * Qué hace, en el orden sin ventana:
 *   1. upsert del documento PADRE (category arsenal_ciencia_socio, tenant dashboard)
 *      — el motor del Dashboard sirve el padre entero tras clasificar al bucket.
 *   2. renombra los fragmentos vigentes a `_old` (siguen sirviendo mientras tanto)
 *   3. genera los fragmentos nuevos con embedding Voyage (título + [Índice], como
 *      fragmentar-arsenales-voyage.mjs) — sirven para que la clasificación
 *      vectorial del Dashboard enrute al bucket.
 *   4. borra los `_old`.
 *
 *   node scripts/desplegar-arsenal-ciencia-socio.mjs [--dry]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local'), quiet: true });

const DRY = process.argv.includes('--dry');
const TENANT = 'dashboard';
const CATEGORY = 'arsenal_ciencia_socio';
const FILE = path.join(__dirname, '..', 'knowledge_base', 'arsenal_ciencia_socio.txt');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function embed(text) {
  const r = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.VOYAGE_API_KEY}` },
    body: JSON.stringify({ input: [text], model: 'voyage-3-lite', input_type: 'document' }),
  });
  if (!r.ok) throw new Error(`Voyage ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return `[${j.data[0].embedding.join(',')}]`;
}

/** Misma separación que fragmentar-arsenales-voyage.mjs: [Índice] → embedding · cuerpo → servido. */
function parse(content) {
  const out = [];
  const sections = content.split(/(?=###\s+\*{0,2}[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+:)/);
  for (const raw of sections) {
    const h = raw.match(/###\s*\*{0,2}([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+):\*{0,2}\s*"?([^"\n*]+)/);
    if (!h) continue;
    const id = h[1].trim(), question = h[2].trim();
    let body = raw.substring(raw.indexOf('\n')).trim();
    const end = body.indexOf('\n---'); if (end > 0) body = body.substring(0, end).trim();
    const lines = body.split('\n'); let indice = ''; const rest = [];
    let en = false;
    for (const l of lines) {
      if (l.startsWith('**[Índice]:**')) { en = true; indice += l.replace(/^\*\*\[Índice\]:\*\*\s*/, ''); continue; }
      if (en) { if (l.trim() === '' || l.startsWith('**[')) en = false; else { indice += ' ' + l; continue; } }
      rest.push(l);
    }
    const cuerpo = rest.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!indice.trim()) throw new Error(`${id} sin [Índice]`);
    out.push({ id, question, indice: indice.trim(), cuerpo, served: `### ${id}: "${question}"\n\n${cuerpo}` });
  }
  return out;
}

const content = fs.readFileSync(FILE, 'utf8');
const respuestas = parse(content);
const version = content.match(/\*\*Versión actual: (v[\d.]+)\*\*/)?.[1] ?? 'v?';
console.log(`📦 ${CATEGORY} ${version} · ${respuestas.length} respuestas · ${content.length} caracteres · tenant ${TENANT}${DRY ? ' · DRY' : ''}`);
for (const r of respuestas) console.log(`   ${r.id.padEnd(6)} índice ${String(r.indice.length).padStart(3)} · cuerpo ${String(r.cuerpo.length).padStart(4)} · "${r.question.slice(0, 60)}"`);
if (DRY) process.exit(0);

// 1. padre
const { data: padre } = await supabase.from('nexus_documents').select('id').eq('category', CATEGORY).eq('tenant_id', TENANT).order('created_at', { ascending: false }).limit(1);
const meta = { version, respuestas_totales: respuestas.length, solo_dashboard: true, updated_at: new Date().toISOString() };
if (padre?.length) {
  const { error } = await supabase.from('nexus_documents').update({ content, title: `Arsenal de Ciencia para el Socio ${version}`, metadata: meta }).eq('id', padre[0].id);
  if (error) throw error; console.log('✅ padre actualizado');
} else {
  const { error } = await supabase.from('nexus_documents').insert({ category: CATEGORY, tenant_id: TENANT, title: `Arsenal de Ciencia para el Socio ${version}`, content, metadata: meta });
  if (error) throw error; console.log('✅ padre insertado');
}

// 2. renombrar vigentes
const { data: viejos, error: e1 } = await supabase.from('nexus_documents').select('id,category').like('category', `${CATEGORY}_%`).not('category', 'like', '%_old').eq('tenant_id', TENANT);
if (e1) throw e1;
for (const v of viejos) { const { error } = await supabase.from('nexus_documents').update({ category: v.category + '_old' }).eq('id', v.id); if (error) throw error; }
console.log(`↪ ${viejos.length} fragmentos previos renombrados a _old`);

// 3. nuevos
let n = 0;
for (const r of respuestas) {
  const embedding_512 = await embed(`${r.question}\n\n${r.indice}`);
  const { error } = await supabase.from('nexus_documents').insert({
    category: `${CATEGORY}_${r.id}`, tenant_id: TENANT, title: r.question, content: r.served, embedding_512,
    metadata: { response_id: r.id, parent_arsenal: CATEGORY, char_count: r.cuerpo.length, tiene_indice: true, is_fragment: true, has_verbatim_lock: false, solo_dashboard: true, created_at: new Date().toISOString() },
  });
  if (error) throw error; n++;
}
console.log(`✅ ${n} fragmentos nuevos con embedding`);

// 4. borrar _old
const { data: del, error: e2 } = await supabase.from('nexus_documents').delete().like('category', `${CATEGORY}_%_old`).eq('tenant_id', TENANT).select('id');
if (e2) throw e2;
console.log(`🧹 ${del.length} _old borrados`);

// 5. verificación
const { data: fin } = await supabase.from('nexus_documents').select('category,tenant_id').like('category', `${CATEGORY}%`);
const porTenant = {}; for (const f of fin) porTenant[f.tenant_id] = (porTenant[f.tenant_id] || 0) + 1;
console.log('filas por tenant (solo debe haber dashboard):', porTenant);
if (Object.keys(porTenant).some(t => t !== TENANT)) { console.error('❌ el arsenal de ciencia apareció en otro tenant'); process.exit(1); }
