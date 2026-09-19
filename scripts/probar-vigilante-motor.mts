/**
 * Prueba del vigilante del motor sin pasar por Vercel.
 *
 *   npx tsx scripts/probar-vigilante-motor.mts                 sondeo real, sin correo
 *   npx tsx scripts/probar-vigilante-motor.mts --enviar        sondeo real, con correo si cambia el estado
 *   npx tsx scripts/probar-vigilante-motor.mts --simular facturacion --enviar
 *   npx tsx scripts/probar-vigilante-motor.mts --clave-mala    sondea con una clave inválida (debe clasificar `facturacion`)
 *
 * Deja el estado guardado en `alertas_sistema` como lo dejaría el cron; para
 * volver a `ok` después de una simulación, correrlo una vez sin `--simular`.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { sondear, vigilar, DESTINO_ALERTA, type EstadoMotor } from '../src/lib/vigilar-motor';

const arg = (k: string) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : undefined; };
const enviar = process.argv.includes('--enviar');

if (process.argv.includes('--clave-mala')) {
  const s = await sondear('sk-ant-clave-invalida-de-prueba');
  console.log('Clave inválida →', s);
  if (s.estado !== 'facturacion') { console.error('❌ Debía clasificar como facturacion'); process.exit(1); }
  console.log('✅ clasifica bien una clave inválida');
  process.exit(0);
}

const simular = arg('--simular') as EstadoMotor | undefined;
const r = await vigilar({ simular, enviar });
console.log(JSON.stringify(r, null, 2));
console.log(`\nDestino del aviso: ${DESTINO_ALERTA.join(', ')} · correo ${enviar ? 'habilitado' : 'deshabilitado (--enviar para mandarlo)'}`);
if (r.correo && !r.correo.ok) process.exit(1);
