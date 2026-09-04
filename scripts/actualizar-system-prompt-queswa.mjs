/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Despliega el prompt maestro de Queswa a los DOS canales en un solo paso.
 *
 *   knowledge_base/system-prompt-queswa.md
 *     ├─ tenant `whatsapp`               → fila `queswa_whatsapp`
 *     └─ tenant `creatuactivo_marketing` → fila `nexus_main`
 *
 * El archivo lleva marcadores `<!-- canal:whatsapp -->…<!-- /canal -->` y
 * `<!-- canal:web -->…<!-- /canal -->`. Aquí se recorta el canal que no aplica,
 * se quitan TODOS los comentarios HTML y se sube cada variante. Los dos canales
 * comparten cada palabra que no esté entre marcadores: esa es la garantía de
 * que la web responde igual que WhatsApp (decisión del Director, 4 sep 2026).
 *
 *   node scripts/actualizar-system-prompt-queswa.mjs            # despliega los dos
 *   node scripts/actualizar-system-prompt-queswa.mjs --solo web # o whatsapp
 *   node scripts/actualizar-system-prompt-queswa.mjs --dry      # solo muestra lo que subiría
 *   node scripts/actualizar-system-prompt-queswa.mjs --ver web  # imprime la variante
 *
 * ⚠️ Reemplaza a `actualizar-system-prompt-whatsapp-v4.mjs` y a
 * `actualizar-system-prompt-v27.2.mjs`, borrados el 4 sep 2026. Historial →
 * knowledge_base/CHANGELOG-system-prompts.md
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERSION_LABEL = 'v5.0_prompt_unico_web_y_whatsapp';
const ARCHIVO = 'system-prompt-queswa.md';

const CANALES = {
  whatsapp: { tenant: 'whatsapp',               name: 'queswa_whatsapp' },
  web:      { tenant: 'creatuactivo_marketing', name: 'nexus_main' },
};

const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
const DRY  = process.argv.includes('--dry');
const SOLO = arg('--solo');
const VER  = arg('--ver');

const __dirname = dirname(fileURLToPath(import.meta.url));
const maestro = readFileSync(join(__dirname, '../knowledge_base', ARCHIVO), 'utf-8');

/** Recorta el canal ajeno, quita los marcadores propios y todo comentario HTML. */
export function renderizarCanal(fuente, canal) {
  const otro = canal === 'web' ? 'whatsapp' : 'web';
  let t = fuente;
  // El encabezado del archivo es un comentario que empieza en la primera línea.
  if (t.startsWith('<!--')) t = t.slice(t.indexOf('-->') + 3);
  // Bloques del otro canal. Primero los que ocupan líneas enteras (se llevan su
  // salto de línea, para no dejar huecos en una cita o una lista); después los
  // que van dentro de una línea.
  t = t.replace(new RegExp(`^[ \\t]*<!-- canal:${otro} -->[\\s\\S]*?<!-- /canal -->[ \\t]*\\n`, 'gm'), '');
  t = t.replace(new RegExp(`<!-- canal:${otro} -->[\\s\\S]*?<!-- /canal -->`, 'g'), '');
  // Marcadores del canal propio, con el mismo criterio.
  t = t.replace(new RegExp(`^[ \\t]*<!-- canal:${canal} -->[ \\t]*\\n`, 'gm'), '');
  t = t.replace(/^[ \t]*<!-- \/canal -->[ \t]*\n/gm, '');
  t = t.replace(new RegExp(`<!-- canal:${canal} -->`, 'g'), '').replace(/<!-- \/canal -->/g, '');
  if (/<!--/.test(t)) {
    throw new Error(`Quedó un comentario sin resolver en la variante ${canal}: ${t.slice(t.indexOf('<!--'), t.indexOf('<!--') + 80)}`);
  }
  // Los bloques que ocupaban líneas enteras dejan líneas vacías de más.
  t = t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  return t.trim() + '\n';
}

async function main() {
  if (VER) { process.stdout.write(renderizarCanal(maestro, VER)); return; }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const canales = SOLO ? [SOLO] : Object.keys(CANALES);

  for (const canal of canales) {
    const cfg = CANALES[canal];
    if (!cfg) { console.error(`❌ Canal desconocido: ${canal} (web | whatsapp)`); process.exit(1); }
    const prompt = renderizarCanal(maestro, canal);
    console.log(`\n📄 ${ARCHIVO} → ${canal}: ${prompt.length} caracteres (${VERSION_LABEL})`);

    if (DRY) { console.log('   --dry: no se sube'); continue; }

    const { data: existing } = await supabase
      .from('system_prompts').select('id, name, version').eq('tenant_id', cfg.tenant).maybeSingle();
    if (existing) console.log(`📌 Reemplaza a ${existing.name} ${existing.version}`);

    const payload = { prompt, version: VERSION_LABEL, updated_at: new Date().toISOString() };
    const { data, error } = existing
      ? await supabase.from('system_prompts').update(payload).eq('tenant_id', cfg.tenant).select().single()
      : await supabase.from('system_prompts').insert({ name: cfg.name, tenant_id: cfg.tenant, is_active: true, ...payload }).select().single();
    if (error) { console.error(`❌ ${canal}:`, error.message); process.exit(1); }
    console.log(`✅ ${data.name} (${cfg.tenant}) → ${data.version}`);

    const { data: rpc } = await supabase.rpc('get_tenant_system_prompt', { p_tenant_id: cfg.tenant });
    if (rpc?.[0]?.prompt?.length === prompt.length) console.log(`✅ RPC verificado: ${rpc[0].name}, ${rpc[0].prompt.length} chars`);
    else console.warn(`⚠️  El RPC devolvió otra cosa para ${cfg.tenant}: ${rpc?.[0]?.name ?? 'nada'}`);
  }

  if (!DRY) console.log('\n⏳ El motor cachea el prompt 5 minutos por tenant.');
}

main();
