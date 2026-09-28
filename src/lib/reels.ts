/**
 * Copyright © 2026 CreaTuActivo.com
 * Reels por nicho — fase orgánica (WhatsApp).
 *
 * Fuente de verdad para las páginas creatuactivo.com/{slug}/{nicho}.
 * Assets en Vercel Blob (optimizados ~24MB c/u). Copy versión final (cirugía Luis).
 */

export const REEL_NICHOS = ['corporativo', 'empleados', 'empresarios', 'diaspora', 'informales', 'networkers'] as const
export type ReelNicho = (typeof REEL_NICHOS)[number]

export const SERVILLETA_YOUTUBE_ID = 'xHWZfg6prs8'

// Reel explainer de la Home (hero de page.tsx) — reemplaza el facade de YouTube.
// Optimizado con el mismo pipeline de los reels (CRF 23 + faststart, ~31MB).
export const HOME_MANIFESTO_VIDEO = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/home/home-manifesto.mp4'
export const HOME_MANIFESTO_POSTER = '/videos/home/poster.webp'

// Video del Plan Servilleta (9:16, ~6 min) — página /video-plan-servilleta.
// Mismo pipeline de los reels (subtítulos karaoke + cutaways + atmósfera + outro).
export const PLAN_SERVILLETA_VIDEO = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/plan-servilleta/video-plan-servilleta.mp4'
export const PLAN_SERVILLETA_POSTER = '/videos/plan-servilleta/poster.webp'

// «Cómo funciona» para el canal de WhatsApp (60 s, 720×1280, 10,7 MB — el tope de
// Meta es 16 MB). Lo manda el botón «Cómo funciona» de la apertura, tras la línea
// «Con gusto. Funciona así:», con la pregunta de cierre de WHY_02 como pie: la voz
// dice casi palabra por palabra ese texto.
// v3 (28 sep 2026): el corte de 60 s con la aplicación personalizada (WHY_02 v6.52)
// y el gancho con la forma única, «…armar una empresa de distribución moderna».
// Es el corte del CHAT: termina en Gano Excel, sin pregunta —la hace Queswa en el
// pie—; el que comparten los socios cierra con «toque el enlace» y vive en el
// Dashboard. La -v2 de Blob es un corte descartado (frase vieja): no se usa.
// Si se vuelve a cortar, se sube con otro nombre: Meta y los teléfonos guardan
// copia de la URL.
export const VIDEO_COMO_FUNCIONA_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/como-funciona-v3.mp4'

// «Los 12 Niveles» para el canal (59 s, 720×1280, 8,7 MB). La voz es NIVELES_01
// palabra por palabra, sin el precio del Kit; en pantalla, el simulador con su
// advertencia («Potencial matemático… No es un resultado garantizado»). Lo manda
// el nodo 2.34 del conductor con la pregunta de cierre de NIVELES_01 como pie.
export const VIDEO_DOCE_NIVELES_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/doce-niveles-v1.mp4'

// «Cómo entra el dinero» para el canal (50 s, 720×1280, 7,7 MB; 27 sep 2026). La voz
// es WHY_04 palabra por palabra, sin la pregunta de cierre, que va como pie. Lo
// manda el botón del medio de la apertura (`apertura_dinero`), como el de
// «Cómo funciona». Clips nuevos con Gemini sobre el mismo mundo 3D: los paquetes
// que salen del celular, las dos formas de venta, el anillo del cliente, el orbe
// que se posa en un cubo mientras siguen las entregas, y fábrica y banco que
// destellan juntos en la quinta baldosa (cada viernes).
export const VIDEO_COMO_ENTRA_EL_DINERO_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/como-entra-el-dinero-v1.mp4'

// Poster único (branded) para el <video> de todos los reels — local en /public,
// servido desde el mismo dominio. Reemplaza los posters por-nicho del Blob.
export const REEL_POSTER = '/videos/reels/poster.webp'

// Misma portada en JPG para el OG image (preview al compartir el link en WhatsApp,
// que no siempre renderiza WebP). metadataBase la resuelve a URL absoluta.
export const REEL_POSTER_OG = '/videos/reels/poster.jpg'

// Override de portada por-nicho (frame del propio reel, 1080×1920 nítido desde el
// master). Los nichos sin entrada usan el poster branded (REEL_POSTER / REEL_POSTER_OG).
export const REEL_POSTER_OVERRIDE: Partial<Record<ReelNicho, { poster: string; posterOg: string }>> = {
  corporativo: {
    poster: '/videos/reels/corporativo-poster.webp',
    posterOg: '/videos/reels/corporativo-poster.jpg',
  },
  empleados: {
    poster: '/videos/reels/empleados-poster.webp',
    posterOg: '/videos/reels/empleados-poster.jpg',
  },
  empresarios: {
    poster: '/videos/reels/empresarios-poster.webp',
    posterOg: '/videos/reels/empresarios-poster.jpg',
  },
  diaspora: {
    poster: '/videos/reels/diaspora-poster.webp',
    posterOg: '/videos/reels/diaspora-poster.jpg',
  },
  informales: {
    poster: '/videos/reels/informales-poster.webp',
    posterOg: '/videos/reels/informales-poster.jpg',
  },
  networkers: {
    poster: '/videos/reels/networkers-poster.webp',
    posterOg: '/videos/reels/networkers-poster.jpg',
  },
}

export const REEL_ASSETS: Record<ReelNicho, { video: string }> = {
  corporativo: { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/corporativo.mp4' },
  empleados:   { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/empleados.mp4' },
  empresarios: { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/empresarios.mp4' },
  diaspora:    { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/diaspora.mp4' },
  informales:  { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/informales.mp4' },
  networkers:  { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/networkers.mp4' },
}

export const REEL_COPY: Record<ReelNicho, { titulo: string; cuerpo: string; audiencia: string }> = {
  corporativo: {
    audiencia: 'Empleado corporativo / ejecutivo',
    titulo: 'Su salario le cubre el mes hoy. ¿Y si mañana la empresa decide prescindir de su cargo?',
    cuerpo:
      'Por bueno que sea el sueldo, en una empresa que no es suya las cartas las tiene otro: basta una reestructuración o un recorte y todo lo que sostiene queda en el aire. La respuesta no es trabajar más duro, ni renunciar a lo que ya construyó: es tener algo propio, en paralelo. Un sistema de distribución —un negocio que se maneja desde el celular y produce aunque usted no esté ahí—. Hoy, con inteligencia artificial, cualquiera puede tenerlo. Pregúntele a Queswa cómo sería en su caso.',
  },
  empleados: {
    audiencia: 'Empleado del Estado / sector público',
    titulo: 'La estabilidad de un cargo es prestada. Si las cuotas siempre le llevan la delantera, usted no tiene estabilidad real: tiene una calma que dura lo que dura su quincena.',
    cuerpo:
      'Por más duro que trabaje, entrega sus mejores años y su salud, y solo suma antigüedad… nada que de verdad sea suyo. Eso no es falta de esfuerzo: así está armado el modelo. La respuesta no es trabajar más: es tener algo propio, en paralelo. Un sistema de distribución que produce por usted —se maneja desde el celular y crece por diseño, no por su desgaste—. Hoy, con inteligencia artificial, cualquiera puede tenerlo. Pregúntele a Queswa cómo sería en su caso.',
  },
  empresarios: {
    audiencia: 'Empresario / dueño de negocio',
    titulo: 'Si su empresa no crece sin usted durante tres meses, su empresa no trabaja para usted: usted trabaja para ella.',
    cuerpo:
      'Un negocio que depende de su presencia no es un patrimonio; es un puesto que usted mismo creó: no se hereda tranquilo, no se vende por lo que vale y no produce sin su supervisión. La respuesta es tener algo que sí funcione sin usted: un sistema de distribución —un negocio que produce aunque usted no esté, en paralelo a lo que ya construyó—. Hoy, con inteligencia artificial, cualquiera puede tenerlo. Pregúntele a Queswa cómo sería en su caso.',
  },
  diaspora: {
    audiencia: 'Latinos en el exterior',
    titulo: 'Ganar en dólares o euros es una trampa elegante si su propio desgaste físico es el único motor de su economía.',
    cuerpo:
      'Usted ya construyó una nueva vida; pero si se detiene 30 días, todo se tambalea. La respuesta no es sumar más horas a su semana: es tener algo propio que funcione sin usted. Un sistema de distribución —un negocio que se maneja desde el celular y produce aunque usted no esté ahí, sin importar en qué país esté—. Hoy, con inteligencia artificial, cualquiera puede tenerlo. Pregúntele a Queswa cómo sería en su caso.',
  },
  informales: {
    audiencia: 'Trabajador independiente / economía popular',
    titulo: 'Trabaja todos los días, pero la plata se va tan rápido como llega. Eso no es falta de capacidad: es un modelo armado para que viva al día.',
    cuerpo:
      'Vivir en el ciclo de trabajar, pagar cuentas y repetir —donde la plata se va tan rápido como llega— no es falla suya: así está armado el modelo. Hay una ruta para construir un ingreso que siga entrando aunque usted no esté de pie todo el día: tener algo propio, un sistema de distribución que produce por usted, y que se maneja desde el celular. Hoy, con inteligencia artificial, cualquiera puede tenerlo. Pregúntele a Queswa cómo sería en su caso.',
  },
  networkers: {
    audiencia: 'Networkers / mercadeo en red',
    titulo: 'Usted ya sabe que el mercadeo en red funciona. El problema nunca fue su esfuerzo: es que la conversión depende de hacerla a pulso —y eso es justo lo que no se duplica.',
    cuerpo:
      'CreaTuActivo cambia esa pieza: las recompensas del mercadeo en red que usted ya conoce, ahora con un sistema de distribución que se maneja desde el celular. La conversión deja de depender de hacerla a pulso —Queswa, su inteligencia artificial, conversa con cada interesado, resuelve las dudas y madura su decisión de avanzar, las 24 horas, por usted y por todo su sistema. Detrás está Gano Excel, la compañía que usted ya conoce, con presencia en más de 60 países, y un método probado que le marca los pasos exactos. Usted decide; el sistema hace el trabajo.',
  },
}
