/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Los pendientes del socio en modo Waze, a mano, con la misma lógica del cron
 * de los jueves (src/lib/wa-pendientes-socio.ts).
 *
 *   npx tsx scripts/enviar-pendientes-socio.mts                    # a quién le toca y qué le falta (no envía)
 *   npx tsx scripts/enviar-pendientes-socio.mts --enviar           # envía
 *   npx tsx scripts/enviar-pendientes-socio.mts --enviar --solo <constructor_id>
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';
import { decidirPendientes, enviarPendientes } from '../src/lib/wa-pendientes-socio';
import { enSilencioBogota, semanaISO } from '../src/lib/wa-lunes-socio';
import { dentroDeVentana } from '../src/lib/wa-ventana';

const args = process.argv.slice(2);
const solo = args.includes('--solo') ? args[args.indexOf('--solo') + 1] : undefined;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ahora = new Date();
console.log(`📅 Semana ${semanaISO(ahora)} · ${enSilencioBogota(ahora) ? '🌙 horas de silencio' : 'horario permitido'}\n`);

if (!args.includes('--enviar')) {
  const d = await decidirPendientes(supabase, ahora);
  console.table(d.map(x => ({ socio: x.d.nombre, accion: x.accion, motivo: x.motivo, via: x.accion === 'enviar' ? (dentroDeVentana(x.ultimoMensaje, ahora) ? 'texto libre' : 'plantilla') : '—' })));
  console.log('🟡 Sin --enviar no se manda nada.');
  process.exit(0);
}
if (enSilencioBogota(ahora)) { console.error('🌙 Horas de silencio en Bogotá: no se envía.'); process.exit(1); }
const { resultados } = await enviarPendientes(supabase, ahora, { solo });
console.table(resultados);
console.log(`✅ ${resultados.filter(r => r.ok).length} enviados · ❌ ${resultados.filter(r => !r.ok).length} fallidos`);
