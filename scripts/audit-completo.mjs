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

  // Agrupar por arsenal padre + tenant (los clones whatsapp cuentan aparte)
  const byArsenal = {};        // clave: `${parent}|${tenant}`
  const byArsenalTenant = {};  // para sincronía: byArsenalTenant[parent][tenant] = count
  let missingEmb512 = 0;
  for (const f of (frags || [])) {
    const parent = f.metadata?.parent_arsenal || 'desconocido';
    const tenant = f.tenant_id || '—';
    const key = `${parent}|${tenant}`;
    if (!byArsenal[key]) byArsenal[key] = { parent, tenant, count: 0, noEmb: 0 };
    byArsenal[key].count++;
    if (!byArsenalTenant[parent]) byArsenalTenant[parent] = {};
    byArsenalTenant[parent][tenant] = (byArsenalTenant[parent][tenant] || 0) + 1;
    if (!f.embedding_512) { byArsenal[key].noEmb++; missingEmb512++; }
  }

  for (const [, stats] of Object.entries(byArsenal).sort()) {
    const warn = stats.noEmb > 0 ? ` ⚠️  SIN embedding_512: ${stats.noEmb}` : ' ✅';
    console.log(`  ${stats.parent.padEnd(35)} ${stats.count.toString().padStart(3)} fragmentos  tenant: ${stats.tenant}${warn}`);
  }
  console.log(`\n  TOTAL fragmentos: ${frags?.length || 0}`);
  console.log(`  Sin embedding_512: ${missingEmb512}`);

  // ── 4. DUPLICADOS ───────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('4. DUPLICADOS (misma category, >1 fila de fragmento)');
  console.log('═'.repeat(60));
  // Duplicado real = misma category EN EL MISMO tenant (los clones whatsapp no son duplicados)
  const fragCats = {};
  for (const f of (frags || [])) {
    const key = `${f.tenant_id || '—'} · ${f.category}`;
    fragCats[key] = (fragCats[key] || 0) + 1;
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

  // Cada arsenal se compara contra SU tenant primario; el clon whatsapp se reporta aparte
  const localFiles = {
    arsenal_inicial:        { path: '../knowledge_base/arsenal_inicial.txt',        tenant: 'creatuactivo_marketing' },
    arsenal_avanzado:       { path: '../knowledge_base/arsenal_avanzado.txt',       tenant: 'creatuactivo_marketing' },
    arsenal_compensacion:   { path: '../knowledge_base/arsenal_compensacion.txt',   tenant: 'creatuactivo_marketing' },
    arsenal_reto:           { path: '../knowledge_base/arsenal_reto.txt',           tenant: 'creatuactivo_marketing' },
    arsenal_12_niveles:     { path: '../knowledge_base/arsenal_12_niveles.txt',     tenant: 'creatuactivo_marketing' },
    arsenal_ganocafe:       { path: '../knowledge_base/arsenal_ganocafe.txt',       tenant: 'ecommerce' },
    arsenal_marca_personal: { path: '../knowledge_base/arsenal_marca_personal.txt', tenant: 'marca_personal' },
  };

  for (const [arsenalName, { path: relPath, tenant }] of Object.entries(localFiles)) {
    try {
      const content = readFileSync(join(__dirname, relPath), 'utf8');
      // Cuenta ### headers de respuesta; (?!\w) excluye sufijos no-fragmentables (ej. FREQ_04_PUENTE)
      const matches = content.match(/###\s+\*?\*?[A-Z]+(?:_[A-Z0-9]+)*_\d+(?!\w)/g) || [];
      const localCount = matches.length;
      const supabaseCount = byArsenalTenant[arsenalName]?.[tenant] || 0;
      const sync = localCount === supabaseCount ? '✅ SYNC' : `⚠️  DESYNC local=${localCount} supabase=${supabaseCount}`;
      console.log(`  ${arsenalName.padEnd(35)} local: ${localCount.toString().padStart(3)} resp  supabase(${tenant}): ${supabaseCount.toString().padStart(3)} frags  ${sync}`);
    } catch {
      console.log(`  ${arsenalName.padEnd(35)} ❌ archivo no encontrado`);
    }
  }

  // Clon whatsapp de arsenal_inicial (clonar-arsenal-whatsapp.mjs NO actualiza existentes — vigilar staleness)
  const waCount = byArsenalTenant['arsenal_inicial']?.['whatsapp'] || 0;
  const mainCount = byArsenalTenant['arsenal_inicial']?.['creatuactivo_marketing'] || 0;
  const waSync = waCount === mainCount ? '✅ mismo conteo que tenant principal' : `⚠️  DESYNC vs principal (${mainCount}) — purgar y re-clonar`;
  console.log(`  ${'arsenal_inicial (clon whatsapp)'.padEnd(35)} supabase(whatsapp): ${waCount.toString().padStart(3)} frags  ${waSync}`);

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
  // NOTA: "regalías" es vocabulario APROBADO (reemplazo de "ingreso residual" — tabla LÉXICO del prompt).
  // "multinivel/MLM/pirámide" son legítimas dentro de triggers y fragmentos de manejo de objeción:
  // se reportan como ℹ️ informativas, no como ⚠️.
  const prohibited = ['ingreso pasivo', 'libertad financiera',
    'reclutar', 'Liliana Moreno',
    'ESP-4', 'ESP-5', 'ESP-6', 'Starter', 'Elite', 'Advanced'];
  const contextual = ['multinivel', 'MLM', 'pirámide'];
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
        // arsenal_12_niveles conserva tuteo/léxico legacy a propósito (NO migrar — ver CLAUDE.md)
        if (fname === 'arsenal_12_niveles.txt' && word === 'ingreso pasivo') continue;
        if (content.toLowerCase().includes(word.toLowerCase())) {
          const lines = content.split('\n');
          const lineNums = lines.reduce((acc, l, i) => l.toLowerCase().includes(word.toLowerCase()) ? [...acc, i+1] : acc, []);
          console.log(`  ⚠️  ${fname}: "${word}" en líneas ${lineNums.join(', ')}`);
          vocabIssues++;
        }
      }
      for (const word of contextual) {
        if (content.toLowerCase().includes(word.toLowerCase())) {
          const lines = content.split('\n');
          const lineNums = lines.reduce((acc, l, i) => l.toLowerCase().includes(word.toLowerCase()) ? [...acc, i+1] : acc, []);
          console.log(`  ℹ️  ${fname}: "${word}" en líneas ${lineNums.join(', ')} (verificar: triggers/objeciones son legítimos)`);
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
    // Archivo fuente vivo (nombre legacy v27_2 — contenido v29.1+)
    const sp = readFileSync(join(__dirname, '../knowledge_base/system-prompt-nexus-main-v27_2.md'), 'utf8');
    const checks = [
      { label: 'Regla verbatim_lock presente', test: sp.includes('<verbatim_lock>') },
      { label: 'Moneda país: "solo COP" para Colombia', test: sp.includes('solo COP') },
      { label: 'Moneda país: "USD por defecto" (sin lista)', test: sp.includes('USD por defecto') },
      { label: 'Sin regla vieja "USD primero" (contradicción v28.x)', test: !sp.includes('USD primero') },
      { label: 'Bloqueo Dashboard presente', test: sp.includes('DASHBOARD') },
      { label: 'Bloqueo KYC presente', test: sp.includes('KYC') },
      { label: 'Filosofía "NADIE filtra" presente', test: sp.includes('NADIE filtra') },
      { label: 'Tres Fuerzas de cara al prospecto', test: sp.includes('TRES FUERZAS') },
      { label: 'Promesa canónica "madura...la decisión"', test: sp.includes('madura en cada interesado la decisión de avanzar') },
      { label: 'PII Liliana Moreno ausente', test: !sp.includes('Liliana Moreno') },
      { label: 'Número viejo 573102066593 ausente', test: !sp.includes('573102066593') },
      { label: 'Tamaño ≤ 22.000 chars (meta compresión)', test: sp.length <= 22000 },
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
