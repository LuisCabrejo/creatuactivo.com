/**
 * Copyright © 2026 CreaTuActivo.com
 * Reels por nicho — fase orgánica (WhatsApp).
 *
 * Fuente de verdad para las páginas creatuactivo.com/{slug}/{nicho}.
 * Assets en Vercel Blob (optimizados ~24MB c/u). Copy versión final (cirugía Luis).
 */

export const REEL_NICHOS = ['corporativo', 'empleados', 'empresarios', 'diaspora', 'informales'] as const
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

export const REEL_ASSETS: Record<ReelNicho, { video: string }> = {
  corporativo: { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/corporativo.mp4' },
  empleados:   { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/empleados.mp4' },
  empresarios: { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/empresarios.mp4' },
  diaspora:    { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/diaspora.mp4' },
  informales:  { video: 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/reels/informales.mp4' },
}

export const REEL_COPY: Record<ReelNicho, { titulo: string; cuerpo: string; audiencia: string }> = {
  corporativo: {
    audiencia: 'Empleado corporativo / ejecutivo',
    titulo: 'Su salario resuelve su liquidez hoy. ¿Y si mañana el sistema decide prescindir de su cargo?',
    cuerpo:
      'El mercado rara vez paga afuera lo que usted vale adentro de una empresa que no es suya. La respuesta no es trabajar más duro, ni renunciar a lo que ya construyó: es tener algo propio, en paralelo. Una empresa digital que produce por usted —ya funcionando en 15 países de América— sostenida por tres pilares que cargan el trabajo pesado: Gano Excel pone la logística; Queswa, su inteligencia artificial, atiende a los interesados las 24 horas; y un método probado le marca cada paso.\n\nVea la presentación de 7 minutos y, en el enlace, deje que Queswa revise su caso.',
  },
  empleados: {
    audiencia: 'Empleado del Estado / sector público',
    titulo: 'La estabilidad de un cargo es prestada. Si las cuotas siempre le llevan la delantera, usted no tiene estabilidad real: tiene una suscripción al agotamiento.',
    cuerpo:
      'Mientras su ingreso dependa de sus horas de oficina o de la firma de un tercero, su tranquilidad es solo una tregua temporal. La salida no es trabajar más: es tener algo propio, en paralelo. Una empresa digital que crece por diseño, no por su desgaste —sostenida por Gano Excel, que pone la logística; Queswa, su inteligencia artificial, que atiende a los interesados 24/7; y un método probado que le marca cada paso.\n\nVea la presentación y, en el enlace, deje que Queswa revise su caso.',
  },
  empresarios: {
    audiencia: 'Empresario / dueño de negocio',
    titulo: 'Si su empresa no crece sin usted durante tres meses, no tiene un activo: tiene una prisión operativa de alto estatus.',
    cuerpo:
      'Un cargo autogestionado no se hereda, no se vende y no produce sin su supervisión. La salida es tener algo que sí funcione sin usted: una empresa digital, sostenida por tres pilares que cargan el trabajo pesado —Gano Excel pone la logística; Queswa atiende a los interesados 24/7; y un método probado le marca cada paso.\n\nVea la presentación de 7 minutos y, en el enlace, deje que Queswa revise su caso.',
  },
  diaspora: {
    audiencia: 'Latinos en el exterior',
    titulo: 'Ganar en dólares o euros es una trampa elegante si su propio desgaste físico es el único motor de su economía.',
    cuerpo:
      'Usted ya construyó una nueva vida; pero si se detiene 30 días, todo se tambalea. La respuesta no es sumar más horas a su semana: es tener algo propio que funcione sin usted. Una empresa digital, ya funcionando en 15 países de América, sostenida por tres pilares que cargan el trabajo pesado —Gano Excel pone la logística; Queswa atiende a los interesados 24/7; y un método probado le marca cada paso.\n\nVea la presentación y, en el enlace, deje que Queswa revise su caso.',
  },
  informales: {
    audiencia: 'Trabajador independiente / economía popular',
    titulo: 'Si usted se detiene, su ingreso se detiene. Eso no es falta de capacidad: es un sistema calibrado para vivir al día.',
    cuerpo:
      'Cambiar sus horas por un dinero que se le va de las manos es una falla del sistema, no suya. Hay una ruta para construir un ingreso que no dependa del sudor diario: tener algo propio, una empresa digital que produce por usted —sostenida por Gano Excel, que pone la logística; Queswa, que atiende a los interesados 24/7; y un método probado que le marca cada paso.\n\nVea la presentación de 7 minutos y, en el enlace, deje que Queswa revise su caso.',
  },
}
