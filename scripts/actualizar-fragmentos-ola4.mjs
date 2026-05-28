#!/usr/bin/env node
/**
 * Ola 4 (25 May 2026) — Refinamiento narrativo + Refactor FSM
 *
 * Actualiza fragmentos con doctrina v5.6:
 *   - arsenal_inicial_WHY_02: "trabajo pesado" → "operación logística"; "protocolo" → "metodología paso a paso"
 *   - arsenal_inicial_FREQ_03: intro nueva "tres niveles de inventario estratégico" + ESP-1 "Para iniciar rápido"
 *   - arsenal_inicial_FREQ_04: narrativa humana + 12 formas + centro negocios de pago + peaje logístico + CV
 *   - arsenal_compensacion_COMP_PAQ_01/02/03/04: triggers ampliados con variantes coloquiales
 *
 * Uso: node scripts/actualizar-fragmentos-ola4.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const voyageApiKey = process.env.VOYAGE_API_KEY;

if (!supabaseUrl || !supabaseKey || !voyageApiKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEmbedding(text, model = 'voyage-large-2') {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: `Bearer ${voyageApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: model === 'voyage-3-lite' ? text.substring(0, 8000) : text, input_type: 'document' }),
  });
  if (!response.ok) throw new Error(`Voyage AI ${model}: ${response.status} ${await response.text()}`);
  return (await response.json()).data[0].embedding;
}

const formatPgvector = (e) => '[' + e.join(',') + ']';

/**
 * Extrae sección — usa el próximo `### **CODE` o `### CODE` como delimitador estricto.
 * Funciona para bloques con `<verbatim_lock>` y bloques sin él.
 */
function extraerSeccion(arsenalContent, codigo, conNegrita = true) {
  const prefijo = conNegrita ? `### \\*\\*${codigo}:` : `### ${codigo}:`;
  // Lookahead: next `### **`, `### `, `## ` (nivel 2) o `# ` (nivel 1), o EOF
  const regex = new RegExp(`${prefijo}[\\s\\S]*?(?=\\n+---\\n+(### \\*\\*|### |## |# )|\\n+(### \\*\\*|### |## |# )|$)`);
  const match = arsenalContent.match(regex);
  return match ? match[0].trim() : null;
}

async function upsertFragmento(categoryId, nuevoContenido, parentArsenal) {
  console.log(`\n🔄 ${categoryId} (${nuevoContenido.length} chars)`);
  const textoParaEmbedding = nuevoContenido
    .replace(/<verbatim_lock>/g, '')
    .replace(/<\/verbatim_lock>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const embedding1536 = await getEmbedding(textoParaEmbedding, 'voyage-large-2');
  const embedding512 = await getEmbedding(textoParaEmbedding, 'voyage-3-lite');

  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, metadata')
    .eq('category', categoryId)
    .maybeSingle();

  const metadata = { ...(existing?.metadata || {}), is_fragment: true, parent_arsenal: parentArsenal };

  if (existing) {
    const { error } = await supabase
      .from('nexus_documents')
      .update({
        content: nuevoContenido,
        embedding: embedding1536,
        embedding_512: formatPgvector(embedding512),
        metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) { console.error(`   ❌ UPDATE:`, error.message); return false; }
    console.log(`   ✅ UPDATE`);
    return true;
  } else {
    const { error } = await supabase
      .from('nexus_documents')
      .insert({
        category: categoryId,
        title: categoryId,
        content: nuevoContenido,
        embedding: embedding1536,
        embedding_512: formatPgvector(embedding512),
        metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    if (error) { console.error(`   ❌ INSERT:`, error.message); return false; }
    console.log(`   ✅ INSERT`);
    return true;
  }
}

async function main() {
  console.log('📦 Ola 4 — Refinamiento narrativo + Refactor FSM (25 May 2026)\n');
  console.log('='.repeat(70));

  const inicialPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const compensacionPath = join(__dirname, '..', 'knowledge_base', 'arsenal_compensacion.txt');
  const inicialContent = fs.readFileSync(inicialPath, 'utf-8');
  const compensacionContent = fs.readFileSync(compensacionPath, 'utf-8');

  const fragmentos = [
    { codigo: 'WHY_02', category: 'arsenal_inicial_WHY_02', source: inicialContent, parent: 'arsenal_inicial', conNegrita: true },
    { codigo: 'FREQ_03', category: 'arsenal_inicial_FREQ_03', source: inicialContent, parent: 'arsenal_inicial', conNegrita: true },
    { codigo: 'FREQ_04', category: 'arsenal_inicial_FREQ_04', source: inicialContent, parent: 'arsenal_inicial', conNegrita: true },
    { codigo: 'COMP_PAQ_01', category: 'arsenal_compensacion_COMP_PAQ_01', source: compensacionContent, parent: 'arsenal_compensacion', conNegrita: false },
    { codigo: 'COMP_PAQ_02', category: 'arsenal_compensacion_COMP_PAQ_02', source: compensacionContent, parent: 'arsenal_compensacion', conNegrita: false },
    { codigo: 'COMP_PAQ_03', category: 'arsenal_compensacion_COMP_PAQ_03', source: compensacionContent, parent: 'arsenal_compensacion', conNegrita: false },
    { codigo: 'COMP_PAQ_04', category: 'arsenal_compensacion_COMP_PAQ_04', source: compensacionContent, parent: 'arsenal_compensacion', conNegrita: false },
  ];

  let exitos = 0;
  let fallos = 0;

  for (const { codigo, category, source, parent, conNegrita } of fragmentos) {
    const contenido = extraerSeccion(source, codigo, conNegrita);
    if (!contenido) {
      console.error(`\n❌ No se encontró ${codigo}`);
      fallos++;
      continue;
    }
    console.log(`\n📄 ${codigo}: "${contenido.substring(0, 80).replace(/\n/g, ' ')}..."`);
    const ok = await upsertFragmento(category, contenido, parent);
    ok ? exitos++ : fallos++;
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Éxitos: ${exitos}/${fragmentos.length}`);
  if (fallos > 0) console.log(`❌ Fallos: ${fallos}`);
  console.log('='.repeat(70));
  console.log('\n📋 QA sugerido:');
  console.log('   1. "¿cómo funciona?" → WHY_02 v5.6 (sin "trabajo pesado", sin "protocolo")');
  console.log('   2. "háblame de los paquetes" → FREQ_03 v5.6 con intro nueva + ESP-1 "Para iniciar rápido"');
  console.log('   3. "cómo se gana?" → FREQ_04 v5.6 con narrativa humana + centro de negocios de pago');
  console.log('   4. "qué productos vienen en el esp3?" → debe entregar COMP_PAQ_04 con 35 productos');
  console.log('   5. Cierre: nombre → WhatsApp → doble oferta de activación (NO email)');
}

main().catch(err => { console.error('❌ Fatal:', err); process.exit(1); });
