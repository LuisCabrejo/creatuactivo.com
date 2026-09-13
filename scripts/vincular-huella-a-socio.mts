/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Ata a mano una huella de WhatsApp a la cuenta de un socio y la deja
 * configurada como tal (es_socio, stage maestria, user_id, sin temperatura ni
 * paquete de prospecto).
 *
 *   npx tsx scripts/vincular-huella-a-socio.mts <fingerprint> <constructor_id> [--nombre "Nombre Apellido"] [--dry]
 *
 *   npx tsx scripts/vincular-huella-a-socio.mts wa_CO.1955991631759265 victor-armando-rojas-beltran-9097
 *   npx tsx scripts/vincular-huella-a-socio.mts wa_573188292631 miguel-barahona-7020577 --nombre "Miguel Barahona"
 *
 * Para qué sirve (12 sep 2026): quien escribe con nombre de usuario de WhatsApp
 * llega con un BSUID (`wa_CO.…`) en vez de teléfono, y el canal no puede
 * reconocerlo como socio. El vínculo por token (enlace del Dashboard) lo
 * resuelve hacia adelante; esto es para los que ya escribieron —Victor Armando
 * Rojas, 19:05— y para reparar una ficha de socio que quedó contaminada como
 * prospecto —Miguel Barahona, que tocó su propio enlace y terminó con paquete
 * ESP-3, arquetipo y un nombre de perfil basura—. `--nombre` corrige el nombre.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { socioPorConstructorId, convertirProspectoEnSocio } =
  require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const iNombre = args.indexOf('--nombre');
const nombre = iNombre > -1 ? args[iNombre + 1] : null;
const [fingerprint, constructorId] = args.filter((a, i) => !a.startsWith('--') && (iNombre === -1 || i !== iNombre + 1));
if (!fingerprint || !constructorId) {
  console.error('Uso: npx tsx scripts/vincular-huella-a-socio.mts <fingerprint> <constructor_id> [--nombre "…"] [--dry]');
  process.exit(2);
}

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data: ficha } = await s.from('prospects').select('id, stage, user_id, device_info').eq('fingerprint_id', fingerprint).maybeSingle();
if (!ficha) { console.error(`No hay ficha con fingerprint ${fingerprint}`); process.exit(1); }
const socio = await socioPorConstructorId(s, constructorId);
if (!socio) { console.error(`No hay socio con constructor_id ${constructorId}`); process.exit(1); }

const d = ficha.device_info || {};
console.log(`Ficha ${fingerprint}: stage=${ficha.stage} user_id=${ficha.user_id ?? '—'} name=«${d.name ?? '—'}» es_socio=${d.es_socio ?? false} package=${d.package ?? '—'} archetype=${d.archetype ?? '—'} momento=${d.momento_optimo ?? '—'}`);
console.log(`Socio: /${socio.slug} · ${socio.nombreCompleto ?? socio.nombre} · user_id=${socio.userId ?? '—'}`);
if (dry) { console.log('[DRY] sin cambios'); process.exit(0); }

// Para que la conversión limpie aunque ya esté marcada, se le quita la marca antes.
const previo = { ...ficha, device_info: { ...d, es_socio: undefined } };
const ok = await convertirProspectoEnSocio(s, fingerprint, socio, previo);
if (nombre) {
  const { data: actual } = await s.from('prospects').select('device_info').eq('fingerprint_id', fingerprint).maybeSingle();
  await s.from('prospects').update({ device_info: { ...(actual?.device_info || {}), name: nombre } }).eq('fingerprint_id', fingerprint);
}
const { data: despues } = await s.from('prospects').select('stage, user_id, device_info').eq('fingerprint_id', fingerprint).maybeSingle();
const dd = despues?.device_info || {};
console.log(`${ok ? '✅' : '⚠️'} Ahora: stage=${despues?.stage} user_id=${despues?.user_id ?? '—'} name=«${dd.name}» es_socio=${dd.es_socio} socio_slug=${dd.socio_slug} package=${dd.package ?? '—'} archetype=${dd.archetype ?? '—'} hilo_12=${dd.hilo_12_niveles ?? '—'}`);
