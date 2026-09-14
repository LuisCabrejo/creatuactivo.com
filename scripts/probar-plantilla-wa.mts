/**
 * Manda una plantilla aprobada a UN número, para ver cómo llega de verdad antes
 * de mandarla a una lista. No toca ningún registro.
 *   npx tsx scripts/probar-plantilla-wa.mts 5732xxxxxxx lunes_socio_v2 Luis
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sendTemplate } from '../src/lib/wa-channel';
const [tel, plantilla, ...params] = process.argv.slice(2);
if (!tel || !plantilla) { console.error('uso: <teléfono> <plantilla> [parámetros…]'); process.exit(1); }
const r = await sendTemplate(tel, plantilla, 'es', params);
console.log(r.ok ? `✅ enviada ${r.messageId}` : `❌ ${r.error}`);
