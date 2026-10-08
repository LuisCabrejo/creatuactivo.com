/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los videos de Queswa en la WEB, del lado del servidor (8 oct 2026, Director:
 * «a la pregunta cómo funciona no ofreció el video, que es lo que tenemos
 * aplicado por defecto en WhatsApp y el Dashboard»).
 *
 * Las cuatro preguntas más frecuentes —cómo funciona, cómo entra el dinero, qué
 * tengo que hacer yo y qué estrategia tienen— se responden en WhatsApp con video
 * desde el 26–28 sep 2026. La web las respondía con el texto. Aquí vive lo que el
 * motor necesita para responderlas igual que el canal:
 *
 *   · los textos de cada video, leídos de la MISMA fuente que el canal (las
 *     respuestas maestras, en sincronía con los candados del arsenal), para
 *     partirlos en lo que dice la voz y la pregunta que va de pie;
 *   · `expandirVideosDelHistorial`: el chat devuelve el marcador `[[video:…]]`
 *     en el historial; se expande con lo que dice la voz, que es lo que la fila de
 *     WhatsApp guarda. Sin eso el modelo no sabría qué acaba de ver la persona, y
 *     las firmas de la bitácora no reconocerían el tema como mostrado;
 *   · el pedido con palabras propias (el mismo detector por significado del
 *     nodo 2.9 del webhook) y la pregunta por la estrategia.
 *
 * ⚠️ La pregunta por la estrategia con palabras propias («¿qué estrategia
 * tienen?») hoy solo la reconoce la WEB. En WhatsApp el video de Los 12 Niveles
 * sale con el «sí» a la oferta y con «¿qué son los 12 niveles?» (nodo 2.34 del
 * conductor); «¿cuál es la estrategia?» a secas va al motor. Si se lleva al
 * canal, se mueve al conductor y lo usan los dos.
 */

import { getRespuestaMaestra } from '@/lib/respuestas-maestras';
import { vozVideoDoceNiveles } from '@/lib/wa-apertura';
import { videoQuePide, type VideoIntencion } from '@/lib/queswa-videos-intencion';
import { textoDeCandado, precioKit, type PaisConductor, type RespuestaConductor } from '@/lib/queswa-conductor';
import {
  VIDEOS_QUESWA, separarVozYPie, rotuloDeVoz, marcadorDe, type VideoQueswaId,
} from '@/lib/queswa-videos';

/** La pregunta canónica con que las respuestas maestras entregan cada video de la apertura. */
const CHIP_DEL_VIDEO: Partial<Record<VideoQueswaId, string>> = {
  'como-funciona': '¿Y esto cómo funciona, exactamente?',
  'como-entra-el-dinero': '¿de dónde sale el dinero?',
  'que-debo-hacer-yo': '¿Cómo lo haría yo? ¿Qué hago en el día a día?',
};

export const VIDEO_DE_INTENCION: Record<VideoIntencion, VideoQueswaId> = {
  apertura_sistema: 'como-funciona',
  apertura_dinero: 'como-entra-el-dinero',
  apertura_rol: 'que-debo-hacer-yo',
};

/** La respuesta completa de un video de la apertura (voz + pregunta), en Markdown. */
export function textoDelVideo(id: VideoQueswaId): string | null {
  const chip = CHIP_DEL_VIDEO[id];
  return chip ? getRespuestaMaestra(chip) : null;
}

/** ¿Esta respuesta maestra es la voz de un video? (el Camino A del motor). */
export function videoDeMaestra(texto: string): VideoQueswaId | null {
  for (const id of Object.keys(CHIP_DEL_VIDEO) as VideoQueswaId[]) {
    if (texto && texto === textoDelVideo(id)) return id;
  }
  return null;
}

/** Lo que dice la voz de cada video, para expandir el marcador en el historial. */
export function vozDelVideo(id: VideoQueswaId): string {
  if (id === 'doce-niveles') return vozVideoDoceNiveles();
  const texto = textoDelVideo(id);
  return texto ? separarVozYPie(texto, VIDEOS_QUESWA[id].entrada).voz : '';
}

/**
 * El historial que manda el chat, con cada marcador reemplazado por lo que dice
 * la voz del video: la misma forma de la fila de WhatsApp. Lo demás pasa intacto.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expandirVideosDelHistorial<T>(messages: T): T {
  if (!Array.isArray(messages)) return messages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return messages.map((m: any) => {
    if (m?.role !== 'assistant' || typeof m.content !== 'string' || !m.content.includes('[[video:')) return m;
    let contenido: string = m.content;
    for (const id of Object.keys(VIDEOS_QUESWA) as VideoQueswaId[]) {
      const marcador = marcadorDe(id);
      if (contenido.includes(marcador)) contenido = contenido.split(marcador).join(`${rotuloDeVoz(VIDEOS_QUESWA[id])}\n\n${vozDelVideo(id)}`);
    }
    return { ...m, content: contenido };
  }) as unknown as T;
}

/**
 * 2.9 de la web — el video de la apertura, pedido con palabras propias. El mismo
 * detector por significado del webhook (`videoQuePide`, con sus contrastes). No
 * repite un tema que la persona ya vio.
 */
export async function atenderVideoPorIntencion(mensaje: string, temasMostrados: ReadonlySet<string>): Promise<RespuestaConductor | null> {
  const intencion = await videoQuePide(mensaje);
  if (!intencion) return null;
  const video = VIDEOS_QUESWA[VIDEO_DE_INTENCION[intencion]];
  if (temasMostrados.has(video.tema)) {
    console.log(`🎬 [Video web] Pide «${video.titulo}» con sus palabras, pero ya lo vio — sigue al motor`);
    return null;
  }
  const texto = textoDelVideo(video.id);
  if (!texto) return null;
  return { nodo: `video por pedido propio: ${intencion}`, texto, video: { url: video.url, entrada: video.entrada } };
}

// ── La estrategia, pedida con palabras propias ───────────────────────────────
//
// «¿Qué estrategia tienen?», «¿cuál es la estrategia?», «explíqueme la
// estrategia». Es lo que en el Dashboard abre el video de Los 12 Niveles.
// ⚠️ NO la estrategia de otra cosa: de marketing, de ventas, para conseguir
// clientes —esa es una pregunta del día a día o de la publicidad—, ni cuánto se
// gana con ella, que va a NIVELES_02. Tolerante a un dedo torpe en «estrategia»
// (prueba-typos.mts).
// «estategia», «etsrategia», «esttrategia», «estratejia», «estrategía».
const ESTRATEGIA = 'e(?:s|x|ts|st)t*r?[aá]?t+[eé]?[gj]+[ií]?[aá]';
const CUAL = 'c[uú]?[aá]{1,2}[uú]?l';           // «cául», «cuáál»
const TIENEN = 't[iíeé]{1,3}n?[eé]{0,2}n';      // «tíenen», «tieen», «teinen»
const NO_SIGUE_LETRA = '(?![a-záéíóúñ])';
const RE_PIDE_ESTRATEGIA = new RegExp([
  // ¿cuál es / qué es la estrategia?
  `(${CUAL}|qu[eé])\\s+(es|ser[ií]a)\\s+(la|su|esa|esta|tu)\\s+${ESTRATEGIA}${NO_SIGUE_LETRA}`,
  // ¿qué estrategia tienen / usan / manejan?
  `(qu[eé]|${CUAL})\\s+${ESTRATEGIA}\\s+(${TIENEN}|tiene|usan|usa|manejan|maneja|siguen|sigue|aplican|aplica|hay|es|proponen|recomiendan)${NO_SIGUE_LETRA}`,
  // explíqueme / muéstreme / cuénteme / hábleme de la estrategia
  `(expl[ií]\\w*|mu[eé]str\\w*|cu[eé]nt\\w*|h[aá]bl\\w*|ens[eé][ñn]\\w*)\\s+(me\\s+|nos\\s+)?(de\\s+)?(la|su|esa|esta)\\s+${ESTRATEGIA}${NO_SIGUE_LETRA}`,
  // «¿y la estrategia?», solo
  `^[\\s¿¡]*(y\\s+)?(la|su|esa)\\s+${ESTRATEGIA}[\\s?!.]*$`,
].join('|'), 'i');
const RE_ESTRATEGIA_DE_OTRA_COSA = new RegExp(`${ESTRATEGIA}\\s+(de|para|en)\\s+(marketing|mercadeo|ventas?|publicidad|redes|contenido|vender|conseguir|captar|promocionar|anunciar|publicar|instagram|facebook|tiktok|whatsapp)`, 'i');
const RE_CIFRAS = /cu[aá]nto|gan[ao]|precio|vale|cuesta|tabla|inscrib|vincul/i;

export function pideLaEstrategia(mensaje: string): boolean {
  const m = (mensaje || '').trim();
  return m.length > 0 && m.length <= 160 && RE_PIDE_ESTRATEGIA.test(m) && !RE_ESTRATEGIA_DE_OTRA_COSA.test(m) && !RE_CIFRAS.test(m);
}

/** 2.34 de la web, por palabras propias: NIVELES_01 con su video, si no la vio ya. */
export async function atenderEstrategiaWeb(ctx: {
  mensaje: string; temasMostrados: ReadonlySet<string>; pais: PaisConductor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any; tenant: string;
}): Promise<RespuestaConductor | null> {
  if (!pideLaEstrategia(ctx.mensaje)) return null;
  const video = VIDEOS_QUESWA['doce-niveles'];
  if (ctx.temasMostrados.has(video.tema)) {
    console.log('🎬 [Video web] Pregunta por la estrategia, pero ya la vio — sigue al motor');
    return null;
  }
  try {
    const texto = await textoDeCandado(ctx.supabase, ctx.tenant, video.candado);
    if (!texto) return null;
    return {
      nodo: '2.34 NIVELES_01 (pregunta por la estrategia)',
      texto: texto.replace(/\[PRECIO_KIT\]/g, precioKit(ctx.pais)),
      marcarHiloDoceNiveles: true,
      video: { url: video.url, entrada: video.entrada },
    };
  } catch (err) {
    console.warn('⚠️ [Video web] No se pudo leer NIVELES_01 — sigue al motor:', err);
    return null;
  }
}
