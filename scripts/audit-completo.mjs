/**
 * Auditoría completa: Supabase + fragmentos + system prompts + queue
 * Uso: node scripts/audit-completo.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function audit() {
  console.log('🔍 AUDITORÍA COMPLETA — CreaTuActivo NEXUS\n');

  // ── 1. SYSTEM PROMPTS ────────────────────────────────────────────────────
  console.log('═'.repeat(60));
  console.log('1. SYSTEM PROMPTS');
  console.log('═'.repeat(60));
  const { data: sp } = await supabase
    .from('system_prompts')
    .select('name, version, updated_at, prompt')
    .order('updated_at', { ascending: false });

  for (const row of (sp || [])) {
    console.log(`  ${row.name.padEnd(30)} → ${(row.version || 'sin versión').padEnd(35)} ${row.updated_at?.substring(0,19)}  (${row.prompt?.length || 0} chars)`);
  }

  // ── 2. NEXUS_DOCUMENTS — ARSENALES PADRE ────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('2. ARSENALES PADRE (nexus_documents — no fragmentos)');
  console.log('═'.repeat(60));
  const { data: arsenales } = await supabase
    .from('nexus_documents')
    .select('id, category, tenant_id, content, updated_at')
    .not('metadata->>is_fragment', 'eq', 'true')
    .order('category');

  for (const a of (arsenales || [])) {
    console.log(`  ${a.category.padEnd(35)} tenant: ${(a.tenant_id || '—').padEnd(25)} ${(a.content?.length || 0).toString().padStart(6)} chars  ${a.updated_at?.substring(0,10)}`);
  }
  console.log(`\n  TOTAL arsenales padre: ${arsenales?.length || 0}`);

  // ── 3. FRAGMENTOS — CONTEO POR ARSENAL ─────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('3. FRAGMENTOS VOYAGE AI — CONTEO POR ARSENAL PADRE');
  console.log('═'.repeat(60));
  const { data: frags } = await supabase
    .from('nexus_documents')
    .select('category, tenant_id, metadata, embedding_512')
    .eq('metadata->>is_fragment', 'true')
    .order('category');

  const byArsenal = {};
  let missingEmb512 = 0;
  for (const f of (frags || [])) {
    const parent = f.metadata?.parent_arsenal || 'desconocido';
    if (!byArsenal[parent]) byArsenal[parent] = { count: 0, tenant: f.tenant_id, noEmb: 0 };
    byArsenal[parent].count++;
    if (!f.embedding_512) { byArsenal[parent].noEmb++; missingEmb512++; }
  }

  for (const [arsenal, stats] of Object.entries(byArsenal).sort()) {
    const warn = stats.noEmb > 0 ? ` ⚠️  SIN embedding_512: ${stats.noEmb}` : ' ✅';
    console.log(`  ${arsenal.padEnd(35)} ${stats.count.toString().padStart(3)} fragmentos  tenant: ${stats.tenant || '—'}${warn}`);
  }
  console.log(`\n  TOTAL fragmentos: ${frags?.length || 0}`);
  console.log(`  Sin embedding_512: ${missingEmb512}`);

  // ── 4. DUPLICADOS ───────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('4. DUPLICADOS (misma category, >1 fila de fragmento)');
  console.log('═'.repeat(60));
  const fragCats = {};
  for (const f of (frags || [])) {
    fragCats[f.category] = (fragCats[f.category] || 0) + 1;
  }
  const dupes = Object.entries(fragCats).filter(([,c]) => c > 1);
  if (dupes.length === 0) {
    console.log('  ✅ Sin duplicados');
  } else {
    for (const [cat, count] of dupes) {
      console.log(`  ⚠️  ${cat} → ${count} filas`);
    }
  }

  // ── 5. DESINCRONÍA LOCAL vs SUPABASE ────────────────────────────────────
  // Cuenta respuestas en archivos locales vs fragmentos en Supabase
  console.log('\n' + '═'.repeat(60));
  console.log('5. SINCRONÍA LOCAL vs SUPABASE');
  console.log('═'.repeat(60));

  const localFiles = {
    arsenal_inicial:        '../knowledge_base/arsenal_inicial.txt',
    arsenal_avanzado:       '../knowledge_base/arsenal_avanzado.txt',
    arsenal_compensacion:   '../knowledge_base/arsenal_compensacion.txt',
    arsenal_reto:           '../knowledge_base/arsenal_reto.txt',
    arsenal_12_niveles:     '../knowledge_base/arsenal_12_niveles.txt',
    arsenal_ganocafe:       '../knowledge_base/arsenal_ganocafe.txt',
    arsenal_marca_personal: '../knowledge_base/arsenal_marca_personal.txt',
  };

  for (const [arsenalName, relPath] of Object.entries(localFiles)) {
    try {
      const content = readFileSync(join(__dirname, relPath), 'utf8');
      // Count ### headers
      const matches = content.match(/###\s+\*?\*?[A-Z]+(?:_[A-Z0-9]+)*_\d+/g) || [];
      const localCount = matches.length;
      const supabaseCount = byArsenal[arsenalName]?.count || 0;
      const sync = localCount === supabaseCount ? '✅ SYNC' : `⚠️  DESYNC local=${localCount} supabase=${supabaseCount}`;
      console.log(`  ${arsenalName.padEnd(35)} local: ${localCount.toString().padStart(3)} resp  supabase: ${supabaseCount.toString().padStart(3)} frags  ${sync}`);
    } catch {
      console.log(`  ${arsenalName.padEnd(35)} ❌ archivo no encontrado`);
    }
  }

  // ── 6. NEXUS_QUEUE ──────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('6. NEXUS_QUEUE — MENSAJES PENDIENTES');
  console.log('═'.repeat(60));
  const { data: pending } = await supabase
    .from('nexus_queue')
    .select('id, status, created_at, metadata')
    .eq('status', 'pending')
    .limit(20);
  if (!pending?.length) {
    console.log('  ✅ Sin mensajes pendientes');
  } else {
    for (const q of pending) {
      console.log(`  ⚠️  ${q.id} — pending desde ${q.created_at?.substring(0,19)} tenant: ${q.metadata?.tenant_id || '—'}`);
    }
  }

  // ── 7. VOYAGE AI ────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('7. VOYAGE AI — ESTADO DE CREDENCIALES');
  console.log('═'.repeat(60));
  if (!voyageApiKey) {
    console.log('  ❌ VOYAGE_API_KEY no encontrada en .env.local');
  } else {
    console.log(`  ✅ VOYAGE_API_KEY presente (${voyageApiKey.substring(0,12)}...)`);
    // Quick test embedding
    try {
      const res = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${voyageApiKey}` },
        body: JSON.stringify({ model: 'voyage-3-lite', input: 'test', input_type: 'query' })
      });
      if (res.ok) {
        const data = await res.json();
        const dim = data.data?.[0]?.embedding?.length;
        console.log(`  ✅ Voyage AI respondió OK — dimensión: ${dim}d`);
      } else {
        const err = await res.text();
        console.log(`  ❌ Voyage API error ${res.status}: ${err}`);
      }
    } catch (e) {
      console.log(`  ❌ Voyage API fetch error: ${e.message}`);
    }
  }

  // ── 8. VOCABULARIO PROHIBIDO EN ARSENALES ───────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('8. VOCABULARIO PROHIBIDO — SCAN EN ARSENALES LOCALES');
  console.log('═'.repeat(60));
  const prohibited = ['regalías', 'regalias', 'ingreso pasivo', 'libertad financiera',
    'reclutar', 'multinivel', 'MLM', 'pirámide', 'Liliana Moreno',
    'ESP-4', 'ESP-5', 'ESP-6', 'Starter', 'Elite', 'Advanced'];
  const allFiles = [
    'arsenal_inicial.txt', 'arsenal_avanzado.txt', 'arsenal_compensacion.txt',
    'arsenal_reto.txt', 'arsenal_12_niveles.txt', 'arsenal_ganocafe.txt',
    'arsenal_marca_personal.txt', 'catalogo_productos.txt'
  ];
  let vocabIssues = 0;
  for (const fname of allFiles) {
    try {
      const content = readFileSync(join(__dirname, '../knowledge_base', fname), 'utf8');
      for (const word of prohibited) {
        // Skip 'regalias' in arsenal_compensacion — it's technical vocabulary there
        if (fname === 'arsenal_compensacion.txt' && (word === 'regalías' || word === 'regalias')) continue;
        if (content.toLowerCase().includes(word.toLowerCase())) {
          const lines = content.split('\n');
          const lineNums = lines.reduce((acc, l, i) => l.toLowerCase().includes(word.toLowerCase()) ? [...acc, i+1] : acc, []);
          console.log(`  ⚠️  ${fname}: "${word}" en líneas ${lineNums.join(', ')}`);
          vocabIssues++;
        }
      }
    } catch {}
  }
  if (vocabIssues === 0) console.log('  ✅ Sin vocabulario prohibido en arsenales locales');

  // ── 9. SYSTEM PROMPT — SCAN RÁPIDO ─────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('9. SYSTEM PROMPT LOCAL — SCAN CRÍTICO');
  console.log('═'.repeat(60));
  try {
    const sp = readFileSync(join(__dirname, '../knowledge_base/system-prompt-nexus-v19.6_lifestyle_bienestar_v3.2.md'), 'utf8');
    const checks = [
      { label: 'Trigger "guíame" en ESTADO 1', test: sp.includes('guíame') },
      { label: 'Prohibición "regalías" en vocab table', test: sp.includes('Regalías / Regalias') },
      { label: '"regalías" en Velocidad 2 eliminada', test: !sp.includes('cobras regalías') },
      { label: 'Bloqueo ESP-6/Starter en ESTADO 2', test: sp.includes('ESP-6') && sp.includes('Starter') },
      { label: 'Estado 3 verbatim wa.me/573215193909', test: sp.includes('wa.me/573215193909') },
      { label: 'PII Liliana Moreno ausente', test: !sp.includes('Liliana Moreno') },
      { label: 'Número viejo 573102066593 ausente', test: !sp.includes('573102066593') },
      { label: 'M3 few-shot negativo presente', test: sp.includes('RESPUESTA INCORRECTA') || sp.includes('few-shot') || sp.includes('NEGATIVO') },
      { label: 'CIERRE máquina de estados presente', test: sp.includes('MÁQUINA DE ESTADOS') },
      { label: 'Patrimonio Paralelo bold (**) presente', test: sp.includes('**Patrimonio Paralelo**') || sp.includes('**PATRIMONIO PARALELO**') },
    ];
    for (const c of checks) {
      console.log(`  ${c.test ? '✅' : '❌'}  ${c.label}`);
    }
    console.log(`\n  Tamaño: ${sp.length} chars (${Math.round(sp.length/1024)}KB)`);
  } catch (e) {
    console.log(`  ❌ No se pudo leer system prompt: ${e.message}`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ AUDITORÍA COMPLETADA');
  console.log('═'.repeat(60));
}

audit().catch(console.error);
