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

const { decisiones, resultados } = await enviarLunes(supabase, ahora, { solo });

// ── Conciliación ─────────────────────────────────────────────────────────────
// Meta acepta el envío (200 + wamid) y lo rechaza DESPUÉS por el webhook: texto
// fuera de ventana (131047), plantilla de marketing a un número de EE. UU., número
// sin WhatsApp (131026). Un «ok» de la llamada no prueba entrega, así que se
// espera y se cruza contra wa_envios_fallidos; lo que Meta tumbó se marca como
// fallido en el registro y se retira del historial de Queswa (no le escribimos).
const telefonoDe = new Map(decisiones.map(x => [x.d.constructorId, x.d.telefono]));
const aceptados = resultados.filter(r => r.ok);
if (aceptados.length) {
  console.log('\n⏳ Esperando 20 s los estados que Meta reporta por el webhook…');
  await new Promise(r => setTimeout(r, 20_000));
  const telefonos = aceptados.map(r => telefonoDe.get(r.constructorId)!).filter(Boolean);
  const { data: fallos } = await supabase
    .from('wa_envios_fallidos')
    .select('destino, codigo, titulo, creado_at')
    .in('destino', telefonos)
    .gte('creado_at', ahora.toISOString());
  for (const f of fallos ?? []) {
    const r = aceptados.find(x => telefonoDe.get(x.constructorId) === f.destino);
    if (!r) continue;
    r.ok = false;
    r.error = `#${f.codigo} ${f.titulo ?? ''}`.trim();
    await supabase.from('wa_lunes_socio_envios')
      .update({ ok: false, error: `${r.error} (rechazado por Meta después de aceptar el envío)` })
      .eq('constructor_id', r.constructorId).eq('semana', semanaISO(ahora)).eq('ok', true);
    await supabase.from('nexus_conversations')
      .delete().eq('fingerprint_id', `wa_${f.destino}`).gte('created_at', ahora.toISOString());
  }
}

console.table(resultados.map(r => ({ socio: r.nombre, via: r.via ?? '—', entregado: r.ok, error: r.error ?? '' })));
console.log(`✅ ${resultados.filter(r => r.ok).length} entregados · ❌ ${resultados.filter(r => !r.ok).length} fallidos`);
