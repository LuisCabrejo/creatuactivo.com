/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Despliega el prompt maestro de Queswa a los TRES canales en un solo paso.
 *
 *   knowledge_base/system-prompt-queswa.md
 *     ├─ tenant `whatsapp`               → fila `queswa_whatsapp`   (el canal)
 *     ├─ tenant `creatuactivo_marketing` → fila `nexus_main`        (la web)
 *     └─ tenant `dashboard`              → fila `queswa_dashboard`  (queswa.app — otro repo,
 *                                                                    lo lee de esta fila)
 *
 * El archivo lleva marcadores `<!-- canal:X -->…<!-- /canal -->`. X puede ser un
 * canal o varios separados por espacio (`<!-- canal:web whatsapp -->`): el bloque
 * queda en los canales nombrados y se recorta en los demás. Se quitan TODOS los
 * comentarios HTML y se sube cada variante. Los tres canales comparten cada
 * palabra que no esté entre marcadores: esa es la garantía de que la web y el
 * Dashboard responden igual que WhatsApp (decisión del Director, 4 sep 2026 para
 * la web; 12 sep 2026 para el Dashboard).
 *
 *   node scripts/actualizar-system-prompt-queswa.mjs                  # despliega los tres
 *   node scripts/actualizar-system-prompt-queswa.mjs --solo dashboard # o web | whatsapp
 *   node scripts/actualizar-system-prompt-queswa.mjs --dry            # solo muestra lo que subiría
 *   node scripts/actualizar-system-prompt-queswa.mjs --ver dashboard  # imprime la variante
 *
 * ⚠️ Reemplaza a `actualizar-system-prompt-whatsapp-v4.mjs` y a
 * `actualizar-system-prompt-v27.2.mjs`, borrados el 4 sep 2026. Historial →
 * knowledge_base/CHANGELOG-system-prompts.md
 *
 * ⚠️ La fila del Dashboard se lee en queswa.app con la misma RPC
 * (`get_tenant_system_prompt('dashboard')`) y caché de 5 min. El esqueleto de
 * redacción de mensajes del socio va aparte: scripts/desplegar-redaccion-socio.mts.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERSION_LABEL = 'v5.2_canal_dashboard';
const ARCHIVO = 'system-prompt-queswa.md';

export const CANALES = {
  whatsapp:  { tenant: 'whatsapp',               name: 'queswa_whatsapp'  },
  web:       { tenant: 'creatuactivo_marketing', name: 'nexus_main'       },
  dashboard: { tenant: 'dashboard',              name: 'queswa_dashboard' },
};

const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
const DRY  = process.argv.includes('--dry');
const SOLO = arg('--solo');
const VER  = arg('--ver');

const __dirname = dirname(fileURLToPath(import.meta.url));
const maestro = readFileSync(join(__dirname, '../knowledge_base', ARCHIVO), 'utf-8');

/**
 * Recorta los bloques de los canales ajenos, quita los marcadores propios y todo
 * comentario HTML. Un marcador puede nombrar varios canales: `canal:web whatsapp`.
 */
export function renderizarCanal(fuente, canal) {
  if (!CANALES[canal]) throw new Error(`Canal desconocido: ${canal} (${Object.keys(CANALES).join(' | ')})`);
  const aplica = (lista) => lista.trim().split(/[\s,]+/).filter(Boolean).every((c) => {
    if (!CANALES[c]) throw new Error(`Marcador con canal desconocido: "${c}"`);
    return true;
  }) && lista.trim().split(/[\s,]+/).includes(canal);
  let t = fuente;
  // El encabezado del archivo es un comentario que empieza en la primera línea.
  if (t.startsWith('<!--')) t = t.slice(t.indexOf('-->') + 3);
  // Bloques que ocupan líneas enteras (se llevan sus saltos de línea, para no
  // dejar huecos en una cita o una lista); después los que van dentro de una línea.
  t = t.replace(
    /^[ \t]*<!-- canal:([^>]+?) -->[ \t]*\n([\s\S]*?)^[ \t]*<!-- \/canal -->[ \t]*\n/gm,
    (_, lista, cuerpo) => (aplica(lista) ? cuerpo : ''),
  );
  t = t.replace(
    /<!-- canal:([^>]+?) -->([\s\S]*?)<!-- \/canal -->/g,
    (_, lista, cuerpo) => (aplica(lista) ? cuerpo : ''),
  );
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
    if (!cfg) { console.error(`❌ Canal desconocido: ${canal} (${Object.keys(CANALES).join(' | ')})`); process.exit(1); }
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

  if (!DRY) console.log('\n⏳ Los motores cachean el prompt 5 minutos por tenant (marketing y el Dashboard).');
}

main();
