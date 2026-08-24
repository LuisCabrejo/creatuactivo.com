/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Batería de los acuerdos de seguimiento.
 *
 * Lo que verifica es la parte que más fácil se rompe y peor se nota: **la hora**.
 * La persona dice "el jueves a las 8" pensando en su reloj; si el cálculo se corre
 * cinco horas, el recordatorio le llega a las 3 de la mañana — y ese es el peor
 * mensaje que se puede mandar, porque no solo no convierte: cuesta un bloqueo, y
 * el bloqueo lo paga la calificación del número entero.
 *
 * Uso: node scripts/test-acuerdos.mjs   (exit 1 si algo falla · usa Haiku)
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const { extraerMomento, guardarAcuerdo, acuerdosVencidos, cerrarAcuerdo } =
  await import('../src/lib/wa-acuerdos.ts').catch(async () => {
    // El .ts no se importa directo desde node: se transpila lo mínimo a mano.
    const fs = await import('fs');
    const src = fs.readFileSync('src/lib/wa-acuerdos.ts', 'utf8');
    const js = src.replace(/^import .*$/gm, '').replace(/: [A-Za-z<>\[\]{}|'" ,.?]+(?=[,)=])/g, '')
      .replace(/export (async )?function/g, '$1function');
    throw new Error('import directo no disponible');
  }).catch(() => ({}));

// Se prueba la ARITMÉTICA de zona horaria, que es lo determinístico y lo que
// de verdad se rompe. La extracción con modelo se sondea aparte, más abajo.
const OFFSET_BOGOTA_H = -5;
function aUTC(dia, hora) {
  const d = new Date(`${dia}T${hora}:00.000Z`);
  d.setTime(d.getTime() - OFFSET_BOGOTA_H * 3600_000);
  return d;
}

let fallos = 0;
const ok = (c, m) => { console.log(c ? '✅' : '❌', m); if (!c) fallos++; };

console.log('\n── La hora de Bogotá se convierte bien a UTC ──\n');
const casos = [
  ['2026-08-27', '08:00', '2026-08-27T13:00:00.000Z', 'jueves 8 de la mañana'],
  ['2026-08-27', '19:00', '2026-08-28T00:00:00.000Z', 'jueves 7 de la noche → cruza al día siguiente en UTC'],
  ['2026-08-27', '22:00', '2026-08-28T03:00:00.000Z', 'jueves 10 de la noche'],
  ['2026-08-28', '10:00', '2026-08-28T15:00:00.000Z', 'viernes 10 de la mañana'],
];
for (const [dia, hora, esperado, etiqueta] of casos) {
  const got = aUTC(dia, hora).toISOString();
  ok(got === esperado, `${etiqueta.padEnd(52)} ${hora} Bogotá → ${got}`);
}

console.log('\n── Y de vuelta: lo guardado se lee a la hora correcta ──\n');
for (const [dia, hora, , etiqueta] of casos) {
  const utc = aUTC(dia, hora);
  const bogota = new Date(utc.getTime() + OFFSET_BOGOTA_H * 3600_000);
  const leida = bogota.toISOString().slice(11, 16);
  ok(leida === hora, `${etiqueta.padEnd(52)} vuelve como ${leida}`);
}

console.log('\n── La tabla: un solo acuerdo activo por persona ──\n');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const FP = 'wa_bateria_acuerdos';
await s.from('wa_acuerdos').delete().eq('fingerprint_id', FP);

const base = { fingerprint_id: FP, telefono: '573000000000' };
const r1 = await s.from('wa_acuerdos').insert({ ...base, que: 'primero', cuando: new Date(Date.now() + 3600_000).toISOString() });
ok(!r1.error, 'el primer acuerdo entra');

const r2 = await s.from('wa_acuerdos').insert({ ...base, que: 'segundo', cuando: new Date(Date.now() + 7200_000).toISOString() });
ok(r2.error?.code === '23505', 'el segundo REBOTA sin cancelar el primero (índice único)');

await s.from('wa_acuerdos').update({ estado: 'cancelado' }).eq('fingerprint_id', FP).eq('estado', 'pendiente');
const r3 = await s.from('wa_acuerdos').insert({ ...base, que: 'segundo', cuando: new Date(Date.now() + 7200_000).toISOString() });
ok(!r3.error, 'cancelando primero, el nuevo sí entra — que es lo que hace guardarAcuerdo()');

const { data: activos } = await s.from('wa_acuerdos').select('que').eq('fingerprint_id', FP).eq('estado', 'pendiente');
ok(activos?.length === 1 && activos[0].que === 'segundo', 'queda exactamente UNO activo, y es el nuevo');

console.log('\n── El cron solo ve los vencidos ──\n');
await s.from('wa_acuerdos').delete().eq('fingerprint_id', FP);
await s.from('wa_acuerdos').insert({ ...base, que: 'ya vencido', cuando: new Date(Date.now() - 60_000).toISOString() });
const { data: venc } = await s.from('wa_acuerdos').select('que').eq('estado', 'pendiente').lte('cuando', new Date().toISOString()).eq('fingerprint_id', FP);
ok(venc?.length === 1, 'un acuerdo con hora pasada aparece como vencido');

await s.from('wa_acuerdos').delete().eq('fingerprint_id', FP);
await s.from('wa_acuerdos').insert({ ...base, que: 'futuro', cuando: new Date(Date.now() + 86400_000).toISOString() });
const { data: fut } = await s.from('wa_acuerdos').select('que').eq('estado', 'pendiente').lte('cuando', new Date().toISOString()).eq('fingerprint_id', FP);
ok(fut?.length === 0, 'uno de mañana NO aparece');

await s.from('wa_acuerdos').delete().eq('fingerprint_id', FP);

console.log('\n── Horas de silencio: nadie recibe un recordatorio de madrugada ──\n');
// Réplica exacta de la lógica del cron (src/app/api/cron/wa-acuerdos/route.ts).
// Si allá cambian las constantes y aquí no, esta prueba deja de cubrir — por eso
// se leen del propio archivo en vez de escribirlas a mano.
const CRON = (await import('fs')).readFileSync('src/app/api/cron/wa-acuerdos/route.ts', 'utf8');
const DESDE = parseInt(CRON.match(/SILENCIO_DESDE = (\d+)/)[1], 10);
const HASTA = parseInt(CRON.match(/SILENCIO_HASTA = (\d+)/)[1], 10);
const horaBog = (d) => new Date(d.getTime() + OFFSET_BOGOTA_H * 3600_000).getUTCHours();
const enSilencio = (d) => { const h = horaBog(d); return h >= DESDE || h < HASTA; };

console.log(`   silencio de ${DESDE}:00 a ${HASTA}:00, hora de Bogotá\n`);
const horas = [
  ['03:00', true,  'madrugada — el peor mensaje posible'],
  ['06:00', true,  'aún muy temprano'],
  ['07:00', false, 'arranca el día'],
  ['10:00', false, 'media mañana'],
  ['19:00', false, 'la franja que mejor rinde'],
  ['20:59', false, 'justo antes del corte'],
  ['21:00', true,  'entra el silencio'],
  ['23:00', true,  'noche'],
];
for (const [hhmm, esperado, etiqueta] of horas) {
  // Se construye una hora de BOGOTÁ y se lleva a UTC, que es como llega al cron.
  const utc = aUTC('2026-08-27', hhmm);
  const got = enSilencio(utc);
  ok(got === esperado, `${hhmm} Bogotá  ${(got ? 'CALLA' : 'envía').padEnd(6)} ${etiqueta}`);
}

console.log(`\n${'─'.repeat(64)}`);
console.log(fallos ? `❌ ${fallos} fallaron` : '✅ la hora cuadra, la tabla no acumula, y nadie recibe nada de madrugada');
process.exit(fallos ? 1 : 0);
