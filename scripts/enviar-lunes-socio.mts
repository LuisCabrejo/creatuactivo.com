/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El mensaje de los lunes a mano, con la misma lógica del cron.
 *
 *   npx tsx scripts/enviar-lunes-socio.mts                 # dice a quién le tocaría y por qué (no envía)
 *   npx tsx scripts/enviar-lunes-socio.mts --enviar        # envía a todos los que tocan
 *   npx tsx scripts/enviar-lunes-socio.mts --enviar --solo luis-cabrejo-1288   # solo a uno (prueba)
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { decidir, enviarLunes, enSilencioBogota, semanaISO } from '../src/lib/wa-lunes-socio';
import { dentroDeVentana } from '../src/lib/wa-ventana';

const args = process.argv.slice(2);
const enviar = args.includes('--enviar');
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1] : undefined;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ahora = new Date();

console.log(`📅 Semana ${semanaISO(ahora)} · ${enSilencioBogota(ahora) ? '🌙 horas de silencio' : 'horario permitido'}\n`);

if (!enviar) {
  const decisiones = await decidir(supabase, ahora);
  console.table(decisiones.map(x => ({
    socio: x.d.nombre, telefono: x.d.telefono, accion: x.accion, motivo: x.motivo,
    via: x.accion === 'enviar' ? (dentroDeVentana(x.ultimoMensajeSocio, ahora) ? 'texto libre' : 'plantilla') : '—',
    ultimoMensaje: x.ultimoMensajeSocio ? x.ultimoMensajeSocio.slice(0, 10) : 'nunca',
    ultimoEnvio: x.ultimoEnvio ? x.ultimoEnvio.slice(0, 10) : '—',
  })));
  console.log('🟡 Sin --enviar no se manda nada.');
  process.exit(0);
}

if (enSilencioBogota(ahora)) { console.error('🌙 Horas de silencio en Bogotá: no se envía.'); process.exit(1); }

const { resultados } = await enviarLunes(supabase, ahora, { solo });
console.table(resultados.map(r => ({ socio: r.nombre, via: r.via ?? '—', ok: r.ok, error: r.error ?? '' })));
console.log(`✅ ${resultados.filter(r => r.ok).length} entregados · ❌ ${resultados.filter(r => !r.ok).length} fallidos`);
