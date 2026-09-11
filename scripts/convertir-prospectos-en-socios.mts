/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Convierte en socio la ficha de todo prospecto de WhatsApp cuyo número ya es de
 * un socio (decisión del Director, 10 sep 2026: el prospecto que pasa a
 * distribuidor queda configurado como distribuidor, y el trato se abre solo así).
 *
 *   npx tsx scripts/convertir-prospectos-en-socios.mts [--dry]
 *
 * Lo mismo que hace el webhook al vuelo (`convertirProspectoEnSocio`), aplicado
 * a los que ya estaban: Patricia y Liliana escribieron como prospectas y
 * quedaron como «calientes» en el pipeline de quien las invitó.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { identificarSocio, convertirProspectoEnSocio } = require('../src/lib/wa-onboarding.ts') as
  typeof import('../src/lib/wa-onboarding.ts');

const dry = process.argv.includes('--dry');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data: prospectos, error } = await s.from('prospects')
  .select('id, fingerprint_id, stage, user_id, device_info').like('fingerprint_id', 'wa_%');
if (error) throw error;

let n = 0;
for (const p of prospectos || []) {
  const tel = p.fingerprint_id.replace(/^wa_/, '');
  if (!/^\d{10,15}$/.test(tel)) continue;
  const socio = await identificarSocio(s, tel);
  if (!socio) continue;
  const ya = p.device_info?.es_socio ? 'ya convertido' : '';
  console.log(`${dry ? '[DRY] ' : ''}${p.fingerprint_id} → /${socio.slug} (${p.device_info?.name ?? '?'}, stage=${p.stage}, momento=${p.device_info?.momento_optimo ?? '-'}) ${ya}`);
  if (dry || ya) continue;
  if (await convertirProspectoEnSocio(s, p.fingerprint_id, socio, p)) n++;
}
console.log(`${dry ? 'Convertibles' : 'Convertidos'}: ${dry ? '(ver arriba)' : n}`);
