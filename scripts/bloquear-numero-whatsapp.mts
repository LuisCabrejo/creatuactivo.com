/**
 * Bloquea (o desbloquea) números en el WABA de Queswa. Un número bloqueado ya no
 * puede escribirle al canal.
 *
 *   npx tsx scripts/bloquear-numero-whatsapp.mts 573167414801 [otro…]
 *   npx tsx scripts/bloquear-numero-whatsapp.mts --desbloquear 573167414801
 *   npx tsx scripts/bloquear-numero-whatsapp.mts --lista
 *
 * ⚠️ Meta solo deja bloquear a quien escribió en las últimas 24 horas.
 * ⚠️ Bloquear a un socio o a un prospecto real le corta el canal: confirme el
 * número contra private_users y prospects antes de correrlo.
 */
process.loadEnvFile('.env.local');
const { bloquearUsuarios, usuariosBloqueados } = await import('../src/lib/wa-channel');

const args = process.argv.slice(2);
if (args.includes('--lista')) {
  const r = await usuariosBloqueados();
  console.log(r.error ? `❌ ${r.error}` : `🚫 Bloqueados (${r.numeros.length}): ${r.numeros.join(', ') || '—'}`);
  process.exit(r.error ? 1 : 0);
}
const desbloquear = args.includes('--desbloquear');
const numeros = args.filter((a) => !a.startsWith('--'));
if (!numeros.length) { console.error('Uso: npx tsx scripts/bloquear-numero-whatsapp.mts [--desbloquear] <número…> | --lista'); process.exit(1); }

const r = await bloquearUsuarios(numeros, desbloquear ? 'desbloquear' : 'bloquear');
for (const n of r.bloqueados) console.log(`✅ ${desbloquear ? 'Desbloqueado' : 'Bloqueado'}: ${n}`);
for (const f of r.fallidos) console.log(`❌ ${f.numero}: ${f.error}`);
if (r.error) console.log(`❌ ${r.error}`);
const lista = await usuariosBloqueados();
console.log(lista.error ? `(no se pudo leer la lista: ${lista.error})` : `🚫 Bloqueados ahora (${lista.numeros.length}): ${lista.numeros.join(', ') || '—'}`);
process.exit(r.ok ? 0 : 1);
