/**
 * Manda un video a UN número que esté DENTRO de la ventana de 24 h, para ver en
 * el teléfono la miniatura y la reproducción antes de conectarlo a un nodo. Fuera
 * de la ventana Meta responde 200 y lo descarta después (131047): el script lo
 * busca en `wa_envios_fallidos` pasado un minuto. Uso:
 *   npx tsx scripts/probar-video-wa.mts 5732xxxxxxx [url] [--pie "texto"]
 * Sin url, manda el de «Cómo funciona» (VIDEO_COMO_FUNCIONA_WA).
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';
import { sendVideo } from '../src/lib/wa-channel';
import { VIDEO_COMO_FUNCIONA_WA } from '../src/lib/reels';

const args = process.argv.slice(2);
const iPie = args.indexOf('--pie');
const pie = iPie >= 0 ? args[iPie + 1] : undefined;
const [tel, url = VIDEO_COMO_FUNCIONA_WA] = args.filter((a, i) => i !== iPie && i !== iPie + 1);
if (!tel) { console.error('uso: <teléfono> [url] [--pie "texto"]'); process.exit(1); }

const enviadoEn = new Date().toISOString();
const r = await sendVideo(tel, url, pie);
if (!r.ok) { console.log(`❌ ${r.error}`); process.exit(1); }
console.log(`✅ Meta lo aceptó (${r.messageId}). Reviso en un minuto si lo entregó…`);

// La tabla no guarda el wamid: se busca por destino y hora.
await new Promise((res) => setTimeout(res, 60_000));
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data } = await s.from('wa_envios_fallidos').select('*')
  .like('destino', `%${tel.replace(/\D/g, '').slice(-10)}%`).gte('creado_at', enviadoEn).limit(1);
console.log(data?.length ? `❌ Meta no lo entregó: ${JSON.stringify(data[0])}` : '✅ Sin fallo de entrega registrado');
