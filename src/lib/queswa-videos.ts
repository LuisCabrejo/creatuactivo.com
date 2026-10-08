/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los cuatro videos con que Queswa responde las preguntas más frecuentes, en una
 * sola lista que usan el motor web y el chat web (8 oct 2026, Director).
 *
 * ── POR QUÉ EXISTE ──────────────────────────────────────────────────────────
 * Desde el 26–28 sep 2026, en WhatsApp «Cómo funciona», «Cómo entra el dinero»,
 * «Qué debo hacer yo» y «Los 12 Niveles» se responden con VIDEO —de 21 personas
 * que tocaron «Cómo funciona» en septiembre, 7 no pasaron de la respuesta en
 * texto—, y el Dashboard hace lo mismo con el socio. La web seguía entregando el
 * texto: en /servilleta y /presentacion, donde el chat web es la demostración en
 * vivo, la persona recibía el párrafo que en el canal ya no se lee. Y la web es
 * el respaldo de WhatsApp: un respaldo que responde distinto no es respaldo.
 *
 * ── CÓMO VIAJA UN VIDEO EN LA WEB ───────────────────────────────────────────
 * El motor responde la línea de entrada, el marcador `[[video:como-funciona]]`
 * en su propio renglón y la pregunta de cierre —lo mismo que WhatsApp manda como
 * entrada, video y pie—; el chat pinta el marcador como un reproductor. Es el
 * patrón del Dashboard (Dashboard/src/lib/videos-queswa.ts). La fila del turno
 * guarda lo que dice la voz, igual que en el canal, y cuando el historial vuelve
 * al motor el marcador se expande con esa voz (`expandirVideosDelHistorial`, en
 * el conductor): así el modelo sabe lo que la persona acaba de ver y el «sí» se
 * lee contra la pregunta que cerró el video.
 *
 * ⚠️ Este archivo lo importa el CLIENTE: nada de servidor aquí.
 */

import {
  VIDEO_COMO_FUNCIONA_WA, VIDEO_COMO_ENTRA_EL_DINERO_WA, VIDEO_QUE_DEBO_HACER_YO_WA, VIDEO_DOCE_NIVELES_WA,
} from '@/lib/reels';

export type VideoQueswaId = 'como-funciona' | 'como-entra-el-dinero' | 'que-debo-hacer-yo' | 'doce-niveles';

export interface VideoQueswa {
  id: VideoQueswaId;
  titulo: string;
  /** Segundos, para el rótulo y la fila. */
  duracion: number;
  /** El corte del CHAT, el mismo que manda WhatsApp (termina en la marca, sin pedir tocar un enlace). */
  url: string;
  poster: string;
  /** La línea con que Queswa lo anuncia, la misma del canal. */
  entrada: string;
  /** El fragmento del arsenal cuya voz es este video. */
  candado: string;
  /** El tema de la bitácora que cuenta (queswa-bitacora.ts): si ya se mostró, no se repite. */
  tema: string;
}

export const VIDEOS_QUESWA: Record<VideoQueswaId, VideoQueswa> = {
  'como-funciona': {
    id: 'como-funciona', titulo: 'Cómo funciona', duracion: 60,
    url: VIDEO_COMO_FUNCIONA_WA, poster: '/videos/queswa/como-funciona-poster.jpg',
    entrada: 'Con gusto. Funciona así:', candado: 'arsenal_inicial_WHY_02', tema: 'como_funciona',
  },
  'como-entra-el-dinero': {
    id: 'como-entra-el-dinero', titulo: 'Cómo entra el dinero', duracion: 50,
    url: VIDEO_COMO_ENTRA_EL_DINERO_WA, poster: '/videos/queswa/como-entra-el-dinero-poster.jpg',
    entrada: 'Con gusto. Se lo muestro en menos de un minuto:', candado: 'arsenal_inicial_WHY_04', tema: 'dinero',
  },
  'que-debo-hacer-yo': {
    id: 'que-debo-hacer-yo', titulo: 'Qué debo hacer yo', duracion: 42,
    url: VIDEO_QUE_DEBO_HACER_YO_WA, poster: '/videos/queswa/que-debo-hacer-yo-poster.jpg',
    entrada: 'Con gusto. Se lo muestro:', candado: 'arsenal_inicial_EAM_01', tema: 'dia_a_dia',
  },
  'doce-niveles': {
    id: 'doce-niveles', titulo: 'Los 12 Niveles', duracion: 59,
    url: VIDEO_DOCE_NIVELES_WA, poster: '/videos/queswa/doce-niveles-poster.jpg',
    entrada: 'Con gusto. Esta es la estrategia:', candado: 'arsenal_12_niveles_NIVELES_01', tema: 'estrategia',
  },
};

export function marcadorDe(id: VideoQueswaId): string {
  return `[[video:${id}]]`;
}

export function videoDeUrl(url: string): VideoQueswa | null {
  return Object.values(VIDEOS_QUESWA).find((v) => v.url === url) ?? null;
}

export function videoDeCandado(categoria: string): VideoQueswa | null {
  return Object.values(VIDEOS_QUESWA).find((v) => v.candado === categoria) ?? null;
}

/**
 * Parte la respuesta de un nodo con video en lo que dice la voz y la pregunta
 * que va de pie. Mismo corte que el webhook: el pie es la última línea que
 * termina en «?», y la voz son las demás.
 */
export function separarVozYPie(texto: string, entrada: string): { voz: string; pie: string | null } {
  const t = (texto || '').trim();
  const resto = t.startsWith(entrada) ? t.slice(entrada.length).trim() : t;
  const pie = resto.split('\n').map((l) => l.trim()).filter(Boolean).reverse().find((l) => l.endsWith('?')) ?? null;
  const voz = resto.split('\n').filter((l) => !l.trim().endsWith('?')).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { voz, pie };
}

/** Lo que recibe el chat: la entrada, el marcador y la pregunta. */
export function textoWebDelVideo(video: VideoQueswa, entrada: string, pie: string | null): string {
  return [entrada, marcadorDe(video.id), pie].filter(Boolean).join('\n\n');
}

/** El renglón que reemplaza al marcador cuando se guarda o se le pasa al modelo. */
export function rotuloDeVoz(video: VideoQueswa): string {
  return `[Video «${video.titulo}», ${video.duracion} s. Lo que dice la voz:]`;
}

/** Lo que guarda la fila del turno: la misma forma que la de WhatsApp. */
export function filaDelVideo(video: VideoQueswa, entrada: string, voz: string, pie: string | null): string {
  return `${entrada}\n\n${rotuloDeVoz(video)}\n\n${voz}${pie ? `\n\n${pie}` : ''}`;
}

// ── Del lado del chat ────────────────────────────────────────────────────────

const RE_MARCADOR = /\[\[video:([a-z0-9-]+)\]\]/g;
/** Un marcador a medio llegar al final del texto (el texto llega por partes). */
const RE_MARCADOR_INCOMPLETO = /\[\[[^\]\n]*$/;

export type TrozoVideo =
  | { tipo: 'texto'; contenido: string }
  | { tipo: 'video'; video: VideoQueswa };

/**
 * Parte un mensaje en texto y videos. Un marcador con un id desconocido se queda
 * como texto. Mientras el mensaje llega, un marcador a medio escribir se oculta.
 */
export function partirVideos(texto: string, opts: { completo?: boolean } = {}): TrozoVideo[] {
  let t = texto || '';
  if (opts.completo === false) t = t.replace(RE_MARCADOR_INCOMPLETO, '');
  if (!t.includes('[[video:')) return [{ tipo: 'texto', contenido: t }];
  const trozos: TrozoVideo[] = [];
  let ultimo = 0;
  for (const m of t.matchAll(RE_MARCADOR)) {
    const video = VIDEOS_QUESWA[m[1] as VideoQueswaId];
    if (!video) continue;
    const antes = t.slice(ultimo, m.index).trim();
    if (antes) trozos.push({ tipo: 'texto', contenido: antes });
    trozos.push({ tipo: 'video', video });
    ultimo = (m.index ?? 0) + m[0].length;
  }
  const cola = t.slice(ultimo).trim();
  if (cola) trozos.push({ tipo: 'texto', contenido: cola });
  return trozos.length ? trozos : [{ tipo: 'texto', contenido: t }];
}

/** Para el «Escuchar» y cualquier superficie que no pinte el reproductor. */
export function quitarMarcadoresVideo(texto: string): string {
  return (texto || '').replace(RE_MARCADOR, '').replace(/\n{3,}/g, '\n\n').trim();
}
