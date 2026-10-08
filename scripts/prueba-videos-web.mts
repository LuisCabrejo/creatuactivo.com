/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * ¿La web responde con VIDEO las cuatro preguntas más frecuentes, como WhatsApp?
 * (8 oct 2026, Director). Cómo funciona · Cómo entra el dinero · Qué debo hacer
 * yo · Qué estrategia tienen.
 *
 *   npx tsx scripts/prueba-videos-web.mts                               (sin red: piezas)
 *   npx tsx scripts/prueba-videos-web.mts --motor http://localhost:3077 (contra un motor local)
 *
 * La parte con motor llama a /api/nexus como la web (tenant
 * creatuactivo_marketing) y con `x-queswa-origen: prueba`. Los cuatro videos se
 * entregan SIN modelo; «explíqueme el negocio» y «¿y yo qué tendría que hacer?»
 * gastan solo una consulta a Voyage (el detector por significado). Al terminar,
 * borra las filas que dejó su huella de prueba. Exit 1 si algo falla.
 *
 * Lo que NO ve: cómo se ve el reproductor (eso es el navegador) ni WhatsApp, que
 * tiene sus propias pruebas (prueba-videos-intencion.mts, repetir-por-webhook.mts).
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import {
  VIDEOS_QUESWA, partirVideos, separarVozYPie, textoWebDelVideo, filaDelVideo, quitarMarcadoresVideo,
} from '../src/lib/queswa-videos.ts';
import {
  expandirVideosDelHistorial, pideLaEstrategia, videoDeMaestra, textoDelVideo, vozDelVideo,
} from '../src/lib/queswa-videos-web.ts';
import { temasDelTexto } from '../src/lib/queswa-bitacora.ts';

let fallos = 0;
const ok = (cond: unknown, que: string) => {
  console.log(`${cond ? '✅' : '❌'} ${que}`);
  if (!cond) fallos++;
};

// ── 1. Las piezas, sin red ───────────────────────────────────────────────────
console.log('── Piezas ──');
for (const v of Object.values(VIDEOS_QUESWA)) {
  if (v.id === 'doce-niveles') continue;
  const texto = textoDelVideo(v.id)!;
  ok(!!texto, `${v.titulo}: la respuesta maestra existe`);
  ok(videoDeMaestra(texto) === v.id, `${v.titulo}: la respuesta maestra se reconoce como su video`);
  const { voz, pie } = separarVozYPie(texto, v.entrada);
  ok(!!pie && pie.endsWith('?'), `${v.titulo}: tiene pregunta de pie («${pie}»)`);
  ok(voz.length > 120 && !voz.includes('?\n'), `${v.titulo}: la voz no trae la pregunta`);
  const web = textoWebDelVideo(v, v.entrada, pie);
  const trozos = partirVideos(web);
  ok(trozos.length === 3 && trozos[1].tipo === 'video', `${v.titulo}: el chat lo parte en entrada · video · pie`);
  ok(!quitarMarcadoresVideo(web).includes('[['), `${v.titulo}: «Escuchar» no lee el marcador`);
  // El historial que devuelve el chat, expandido, es la fila de WhatsApp: la
  // bitácora reconoce el tema y el «sí» se lee contra la misma pregunta.
  const [exp] = expandirVideosDelHistorial([{ role: 'assistant', content: web }]);
  ok(exp.content === filaDelVideo(v, v.entrada, voz, pie), `${v.titulo}: el marcador se expande a la fila de WhatsApp`);
  ok(temasDelTexto(exp.content).has(v.tema), `${v.titulo}: la bitácora lo da por mostrado (${v.tema})`);
}
ok(temasDelTexto(vozDelVideo('doce-niveles')).has('estrategia'), 'Los 12 Niveles: la voz expandida cuenta como la estrategia');
ok(partirVideos('Hola [[video:como-fun', { completo: false })[0].tipo === 'texto'
  && !(partirVideos('Hola [[video:como-fun', { completo: false })[0] as { contenido: string }).contenido.includes('[['),
  'un marcador a medio llegar no se muestra');
ok(partirVideos('[[video:otro-video]]')[0].tipo === 'texto', 'un id desconocido se queda como texto');

console.log('\n── La estrategia, con palabras propias ──');
const SI = ['¿Qué estrategia tienen?', '¿Cuál es la estrategia?', 'cual es la estrategia de ustedes', 'Explíqueme la estrategia',
  '¿Y la estrategia?', 'qué estrategia manejan', 'cuál sería su estrategia', 'muéstreme esa estrategia', '¿Qué estratejia tienen?'];
const NO = ['¿Qué estrategia de marketing usan?', '¿Cuál es la estrategia para conseguir clientes?', '¿Cuánto se gana con la estrategia?',
  'la estrategia de ventas cuál es', 'Tengo una estrategia propia', 'Es una buena estrategia', '¿Cuál es el precio?'];
for (const f of SI) ok(pideLaEstrategia(f), `dispara: «${f}»`);
for (const f of NO) ok(!pideLaEstrategia(f), `no dispara: «${f}»`);

// ── 2. Contra el motor ───────────────────────────────────────────────────────
const iMotor = process.argv.indexOf('--motor');
if (iMotor > 0) {
  const base = process.argv[iMotor + 1];
  // Una huella por caso: la bitácora se arma de las filas de la huella, y con una
  // sola huella cada caso vería los videos de los anteriores como ya mostrados.
  const prefijo = `prueba_videos_web_${Date.now()}`;
  let n = 0;
  const preguntar = async (mensajes: { role: string; content: string }[], huella = `${prefijo}_${n++}`, pageContext = 'default') => {
    const r = await fetch(`${base}/api/nexus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tenant-id': 'creatuactivo_marketing', 'x-queswa-origen': 'prueba' },
      body: JSON.stringify({ messages: mensajes, sessionId: huella, fingerprint: huella, pageContext }),
    });
    return r.ok ? await r.text() : `HTTP ${r.status}`;
  };
  console.log(`\n── Motor (${base}) ──`);
  const casos: { pregunta: string; video: string }[] = [
    { pregunta: '¿Y esto cómo funciona, exactamente?', video: 'como-funciona' },           // el botón 1
    { pregunta: '¿Cómo lo haría yo? ¿Qué hago en el día a día?', video: 'que-debo-hacer-yo' }, // el botón 2
    { pregunta: '¿De dónde sale el dinero?', video: 'como-entra-el-dinero' },
    { pregunta: 'Explíqueme el negocio', video: 'como-funciona' },                         // por significado
    { pregunta: '¿Y yo qué tendría que hacer?', video: 'que-debo-hacer-yo' },
    { pregunta: '¿Qué estrategia tienen?', video: 'doce-niveles' },
    { pregunta: '¿Qué son los 12 niveles?', video: 'doce-niveles' },
  ];
  let primerVideo = '';
  for (const c of casos) {
    const t = await preguntar([{ role: 'assistant', content: 'Hola. Soy Queswa.' }, { role: 'user', content: c.pregunta }]);
    ok(t.includes(`[[video:${c.video}]]`), `«${c.pregunta}» → video ${c.video}`);
    if (!t.includes('[[video:')) console.log(`      recibió: ${t.slice(0, 160).replace(/\n/g, ' ')}`);
    if (c.video === 'como-funciona' && !primerVideo) primerVideo = t;
  }
  // El «sí» a la pregunta con que cierra «Cómo funciona» trae Los 12 Niveles, igual que en WhatsApp.
  const si = await preguntar([
    { role: 'assistant', content: 'Hola. Soy Queswa.' },
    { role: 'user', content: '¿Y esto cómo funciona, exactamente?' },
    { role: 'assistant', content: primerVideo },
    { role: 'user', content: 'sí' },
  ]);
  ok(si.includes('[[video:doce-niveles]]'), '«sí» tras «Cómo funciona» → video Los 12 Niveles');
  // Y quien ya lo vio no lo recibe otra vez por el botón.
  const otraVez = await preguntar([
    { role: 'assistant', content: primerVideo },
    { role: 'user', content: '¿Y esto cómo funciona, exactamente?' },
  ]);
  // En la página de productos Queswa es asesora de bienestar: el botón no trae video.
  const enProductos = await preguntar([{ role: 'assistant', content: 'Hola.' }, { role: 'user', content: '¿De dónde sale el dinero?' }], undefined, 'catalogo_productos');
  ok(!enProductos.includes('[[video:'), 'en la página de productos no sale el video');
  ok(!otraVez.includes('[[video:como-funciona]]'), 'quien ya vio «Cómo funciona» no lo recibe dos veces');

  const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await s.from('nexus_conversations').delete().like('fingerprint_id', `${prefijo}_%`);
  console.log(error ? `⚠️ No se borraron las filas de ${prefijo}: ${error.message}` : `🧹 Filas de ${prefijo}_* borradas`);
  await s.from('prospects').delete().like('fingerprint_id', `${prefijo}_%`);
}

console.log(`\n${fallos ? `❌ ${fallos} fallo(s)` : '✅ Todo en orden'}`);
process.exit(fallos ? 1 : 0);
