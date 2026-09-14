/**
 * Manda un texto libre a un número que esté DENTRO de la ventana de 24 h, para
 * probar cómo se ve en el teléfono antes de someter una plantilla (cada versión
 * de plantilla vuelve a revisión). Uso:
 *   npx tsx scripts/probar-texto-wa.mts 5732xxxxxxx archivo-con-el-texto.txt
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { readFileSync } from 'node:fs';
import { sendText } from '../src/lib/wa-channel';
const [tel, archivo] = process.argv.slice(2);
if (!tel || !archivo) { console.error('uso: <teléfono> <archivo>'); process.exit(1); }
const r = await sendText(tel, readFileSync(archivo, 'utf8').trim());
console.log(r.ok ? `✅ enviado ${r.messageId}` : `❌ ${r.error}`);
