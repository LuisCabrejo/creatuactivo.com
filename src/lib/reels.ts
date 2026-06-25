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
      'El mercado rara vez paga afuera lo que usted vale adentro de una empresa que no es suya. La respuesta no es trabajar más duro, ni renunciar a lo que ya construyó: es tener algo propio, en paralelo. Una empresa digital —un negocio que vive en internet y produce aunque usted no esté ahí, sin local ni empleados, y crece sin techo—. Hoy, con inteligencia artificial, cualquiera puede tenerla. Pregúntele a Queswa cómo sería en su caso.',
  },
  empleados: {
    audiencia: 'Empleado del Estado / sector público',
    titulo: 'La estabilidad de un cargo es prestada. Si las cuotas siempre le llevan la delantera, usted no tiene estabilidad real: tiene una calma que dura lo que dura su quincena.',
    cuerpo:
      'Por más duro que trabaje, entrega sus mejores años y su salud, y solo suma antigüedad… nada que de verdad sea suyo. Eso no es falta de esfuerzo: así está calibrado el sistema. La respuesta no es trabajar más: es tener algo propio, en paralelo. Una empresa digital que produce por usted —vive en internet, sin local ni empleados, y crece por diseño, no por su desgaste—. Hoy, con inteligencia artificial, cualquiera puede tenerla. Pregúntele a Queswa cómo sería en su caso.',
  },
  empresarios: {
    audiencia: 'Empresario / dueño de negocio',
    titulo: 'Si su empresa no crece sin usted durante tres meses, su empresa no trabaja para usted: usted trabaja para ella.',
    cuerpo:
      'Un negocio que depende de su presencia no es un patrimonio; es un puesto que usted mismo creó: no se hereda tranquilo, no se vende por lo que vale y no produce sin su supervisión. La respuesta es tener algo que sí funcione sin usted: una empresa digital —un negocio que vive en internet y produce aunque usted no esté, en paralelo a lo que ya construyó—. Hoy, con inteligencia artificial, cualquiera puede tenerla. Pregúntele a Queswa cómo sería en su caso.',
  },
  diaspora: {
    audiencia: 'Latinos en el exterior',
    titulo: 'Ganar en dólares o euros es una trampa elegante si su propio desgaste físico es el único motor de su economía.',
    cuerpo:
      'Usted ya construyó una nueva vida; pero si se detiene 30 días, todo se tambalea. La respuesta no es sumar más horas a su semana: es tener algo propio que funcione sin usted. Una empresa digital —un negocio que vive en internet y produce aunque usted no esté ahí, sin importar en qué país esté—. Hoy, con inteligencia artificial, cualquiera puede tenerla. Pregúntele a Queswa cómo sería en su caso.',
  },
  informales: {
    audiencia: 'Trabajador independiente / economía popular',
    titulo: 'Trabaja todos los días, pero la plata se va tan rápido como llega. Eso no es falta de capacidad: es un sistema calibrado para que viva al día.',
    cuerpo:
      'Vivir en el ciclo de trabajar, pagar cuentas y repetir —donde la plata se va tan rápido como llega— no es falla suya: así está calibrado el sistema. Hay una ruta para construir un ingreso que siga entrando aunque usted no esté de pie todo el día: tener algo propio, una empresa digital que produce por usted —vive en internet, sin local ni empleados—. Hoy, con inteligencia artificial, cualquiera puede tenerla. Pregúntele a Queswa cómo sería en su caso.',
  },
  networkers: {
    audiencia: 'Networkers / mercadeo en red',
    titulo: 'Usted ya sabe que el mercadeo en red funciona. El problema nunca fue su esfuerzo: es que la conversión depende de hacerla a pulso —y eso es justo lo que no se duplica.',
    cuerpo:
      'CreaTuActivo cambia esa pieza: las recompensas del mercadeo en red que usted ya conoce, ahora con las ventajas de una empresa digital. La conversión deja de depender de hacerla a pulso —Queswa, su inteligencia artificial, conversa con cada interesado, resuelve las dudas y madura su decisión de avanzar, las 24 horas, por usted y por toda su organización. Detrás está Gano Excel, la compañía que usted ya conoce, con presencia en 70 países, y un método probado que le marca los pasos exactos. Usted dirige; el sistema hace el trabajo.',
  },
}
