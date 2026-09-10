/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Asigna slug a los socios activos que no lo tienen (decisión del Director,
 * 10 sep 2026: el slug se aplica por defecto, nadie tiene que reclamarlo).
 *
 *   npx tsx scripts/asignar-slugs-por-defecto.mts [--dry]
 *
 * Por qué existe: el canal reconocía a un socio solo si tenía slug, y 8 de 18
 * socios activos no lo tenían. Patricia Reyes (socia desde julio) y Liliana
 * Moreno (desde noviembre) escribieron a Queswa y recibieron el discurso de
 * prospecto, con el trámite de vinculación incluido. Desde hoy
 * `identificarSocio` asigna el slug al vuelo; este script deja listos a los que
 * ya están, para que el primer mensaje no dependa de eso.
 *
 * Se saltan las cuentas que no son una persona: `admin` y el usuario de
 * ganocafe.online (`ganocafe-online-1716`, el ref del orbe de esa web).
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';

// ⚠️ Se importa con `require`, no con `import {…}`: tsx compila `wa-onboarding.ts`
// como CommonJS y Node detecta los nombres exportados con un lexer que se
// detiene en la `ñ` de `notificarDueño`; todo lo que va después en orden
// alfabético (saludoDeSocio, slugDesdeNombre, slugLibre…) «no existe» para un
// `import` con llaves. Con `require` llega el módulo entero.
const require = createRequire(import.meta.url);
const { asignarSlugPorDefecto, slugLibre } = require('../src/lib/wa-onboarding.ts') as
  typeof import('../src/lib/wa-onboarding.ts');

const dry = process.argv.includes('--dry');
const NO_SON_PERSONA = new Set(['ganocafe-online-1716']);
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const { data: socios, error } = await s.from('private_users')
  .select('name, constructor_id, whatsapp, role').eq('status', 'active').eq('role', 'constructor');
if (error) throw error;
const { data: filas } = await s.from('constructor_slugs').select('constructor_id');
const conSlug = new Set((filas || []).map((f: { constructor_id: string }) => f.constructor_id));

const pendientes = (socios || []).filter((u) => !conSlug.has(u.constructor_id) && !NO_SON_PERSONA.has(u.constructor_id));
console.log(`${dry ? '[DRY] ' : ''}Socios activos sin slug: ${pendientes.length}`);

for (const u of pendientes) {
  if (dry) {
    console.log(`  · ${u.name} (${u.constructor_id}) → /${await slugLibre(s, u.name || u.constructor_id)}`);
    continue;
  }
  const slug = await asignarSlugPorDefecto(s, u);
  console.log(`  · ${u.name} → ${slug ? '/' + slug : 'FALLÓ'}`);
}
