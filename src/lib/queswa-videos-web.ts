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
 *     nodo 2.9 del webhook).
 *
 * La estrategia («¿qué estrategia tienen?», «¿qué son los 12 niveles?», el «sí»
 * a la oferta) NO vive aquí: la atiende el nodo 2.34 del conductor, que usan los
 * dos canales (`pideLaEstrategia`, 8 oct 2026).
 */

import { getRespuestaMaestra } from '@/lib/respuestas-maestras';
import { vozVideoDoceNiveles } from '@/lib/wa-apertura';
import { videoQuePide, type VideoIntencion } from '@/lib/queswa-videos-intencion';
import type { RespuestaConductor } from '@/lib/queswa-conductor';
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
