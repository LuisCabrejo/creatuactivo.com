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
      'El mercado jamás le pagará una fracción real de lo que usted genera dentro de una estructura que no le pertenece. La respuesta para blindarse no es trabajar más duro: es asumir la dirección de una Estructura Patrimonial sólida. Una Base Operativa con presencia en 15 países, sostenida por tres pilares que absorben la fricción operativa por usted.\n\nVea la auditoría de 7 minutos y determine si su modelo de ingresos exige este nivel de arquitectura hoy.',
  },
  empleados: {
    audiencia: 'Empleado del Estado / sector público',
    titulo: 'Estabilidad no es soberanía. Si las cuotas siempre le llevan la delantera, usted tiene una suscripción al agotamiento.',
    cuerpo:
      'Mientras su ingreso dependa de sus horas de oficina o de la firma de un tercero, su tranquilidad es solo una tregua temporal. Existe una salida estructural: una Base Operativa que se expande por diseño, no por desgaste físico. Sostenida por una matriz global, un motor de inteligencia artificial que califica contactos 24/7, y un protocolo exacto de ejecución.\n\nVea la presentación técnica y evalúe los datos con frialdad matemática.',
  },
  empresarios: {
    audiencia: 'Empresario / dueño de negocio',
    titulo: 'Si su empresa no crece sin usted durante tres meses, no tiene un activo: tiene una prisión operativa de alto estatus.',
    cuerpo:
      'Un cargo autogestionado no se hereda, no se escala y no produce sin su supervisión. La arquitectura correcta transforma su tiempo en un activo que factura de forma autónoma, apalancado en tres pilares que asumen la logística, el despliegue tecnológico y la metodología comercial.\n\nVea el desglose operativo en 7 minutos y audite la diferencia entre ser un engranaje y ser un director.',
  },
  diaspora: {
    audiencia: 'Latinos en el exterior',
    titulo: 'Ganar en dólares o euros es una trampa elegante si su propio desgaste físico es el único motor de su economía.',
    cuerpo:
      'Usted ya construyó una nueva vida; pero si se detiene 30 días, su flujo de caja colapsa. La respuesta no exige sumar más horas operativas a su semana: exige instalar una Estructura Patrimonial que facture a su favor desde una Base Operativa consolidada en 15 países de América.\n\nVea la presentación y determine, con números en mano, si su tranquilidad financiera requiere esta base hoy.',
  },
  informales: {
    audiencia: 'Trabajador independiente / economía popular',
    titulo: 'Si usted se detiene, su ingreso se detiene. Eso no es falta de capacidad: es un sistema calibrado para vivir al día.',
    cuerpo:
      'Cambiar sus horas por un dinero que no le deja margen de maniobra es una falla estructural. Existe una ruta matemática para construir un ingreso que no dependa del sudor diario: asumir el control de una Base Operativa real, impulsada por una corporación global, tecnología que absorbe la fricción y un protocolo de ejecución probado.\n\nVea la auditoría de 7 minutos y determine el escenario que su economía necesita hoy.',
  },
}
