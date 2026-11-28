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

// Video del Plan Servilleta (9:16, ~6 min) — página /video-plan-servilleta.
// Mismo pipeline de los reels (subtítulos karaoke + cutaways + atmósfera + outro).
export const PLAN_SERVILLETA_VIDEO = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/plan-servilleta/video-plan-servilleta.mp4'
export const PLAN_SERVILLETA_POSTER = '/videos/plan-servilleta/poster.webp'

// «Cómo funciona» para el canal de WhatsApp (60 s, 720×1280, 10,7 MB — el tope de
// Meta es 16 MB). Lo manda el botón «Cómo funciona» de la apertura, tras la línea
// «Con gusto. Funciona así:», con la pregunta de cierre de WHY_02 como pie: la voz
// dice casi palabra por palabra ese texto.
// v7 (29 oct 2026, Director): el arranque es la definición de la Presentación —
// «Así como Uber mueve el transporte sin ser dueño de los carros, hoy su empresa de
// distribución moderna vende sin ser dueña de la fábrica. Funciona así: usted recibe
// en una sola aplicación los tres elementos que, armados por su cuenta, le costarían
// millones.» (antes «Hoy todos quieren vender por internet… la infraestructura…» y
// «…que eliminan la fricción de montarla»). Espejo de WHY_02 v6.82; el resto de la
// voz y el montaje son los del v6. 62,8 s, 8,8 MB. Receta: armar_v7.py. La v6 queda
// sin uso.
// v6 (18 oct 2026, Director): «Dos: una máquina de ventas. Usted envía a quien
// quiera, y Queswa lo atiende las veinticuatro horas.» y «Tres: una herramienta para
// multiplicar. Acompaña a cada distribuidor, y como en Waze, le va marcando la ruta,
// paso a paso.» — espejo de WHY_02 v6.76. El bloque 3 va sobre la multiplicación y
// «quien quiera distribuir» sobre la ciudad que se enciende. 58,97 s, 8,3 MB.
// Receta: captions/work/como-funciona/armar_v6.py. La v5 queda sin uso.
// v5 (9 oct 2026, Director): el bloque 3 de la voz dice «Tres: saber qué hacer.»
// — los tres elementos quedaron como funciones y la aplicación es el envase
// (WHY_02 v6.69; investigación ENCUADRE_CLIMAX_TRES_ELEMENTOS_OCT2026.md). Mismo
// montaje del 28 sep re-temporizado (58,1 s) con los mismos dos sonidos:
// registradora en «cada recompra» (una venta) y contador de billetes bajo «las
// comisiones las paga el fabricante» (el pago). Receta: captions/work/como-funciona/
// armar_saber.py. La v4 (28 sep, «su aplicación personalizada») queda sin uso;
// la v3 era la v4 sin sonidos; la -v2 es un corte descartado.
// Es el corte del CHAT: termina en Gano Excel, sin pregunta —la hace Queswa en el
// pie—; el que comparten los socios cierra con «toque el enlace» y vive en el
// Dashboard. Si se vuelve a cortar, se sube con otro nombre: Meta y los teléfonos
// guardan copia de la URL.
// v8 (27 nov 2026, Director: «aprobado, publica»): guion al léxico del 26-27 nov —«Se trata de ser
// dueño de un sistema de distribución que cabe en su celular. Usted no construye las piezas: se apoya
// en tres que ya existen…»— y los tres elementos nuevos: un fabricante · un asistente en línea · saber
// qué hacer. Sale Uber; entra «Eso es un activo: sigue produciendo aunque usted no esté presente.».
// Imagen dibujada, como «Cómo entra el dinero» v3. 66,6 s. La v7 queda sin uso.
// Receta: captions/work/como-funciona/v8/ (voz.py → armar.py).
// v9 (27 nov 2026, Director): la voz abre «Así funciona CreaTuActivo.com: se trata de ser dueño…» (los
// reels se comparten como historias: el arranque dice de qué trata) y el rótulo de marca «CREATUACTIVO.COM ·
// CÓMO FUNCIONA» los primeros 3,8 s, como los reels del reto. 71,2 s. La v8 queda sin uso.
// v11 (27 nov 2026, Director): «crea tu activo punto com» en la voz (el subtítulo dice CreaTuActivo.com),
// «que ya existen, y que armadas por su cuenta…» de corrido, y la marca de agua. 72,4 s. La v9 queda sin uso.
export const VIDEO_COMO_FUNCIONA_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/como-funciona-v11.mp4'

// «Plan servilleta»: la presentación de /servilleta entera en voz (30 oct 2026,
// Director; 3:03, 720×1280, 7,4 MB). Las nueve pantallas del deck capturadas en
// diseño de teléfono, con los clips de la unión y las piezas, el simulador de los
// 12 niveles con «Ejemplo del cálculo del plan, no un ingreso esperado ni
// garantizado» y la voz de Andres Felipe. Cierra con «el siguiente paso es una
// conversación con quien le compartió este video». Lo rueda el botón de la
// pantalla 1 de /servilleta; el Dashboard comparte el mismo archivo. Receta:
// scripts/dankoe-video/captions/work/plan-servilleta/ (capturar.mjs + armar.py).
// v3 (30 oct 2026, Director): la máquina de ventas dice «Quien llega conoce los
// productos y los compra» en la voz y en pantalla; con «ahí conoce» se entendía que
// el socio compraba. La -v2 queda sin uso. v4 (1 nov 2026, Director, caso Daniela): el
// cierre deja la lista de espera y dice «desde el día en que abre su sistema», como la
// pantalla 9; la -v3 queda sin uso. v5 (1 nov 2026, Director): el activo en tres
// momentos —«La solución: un activo.», «Eso es un activo: sigue produciendo sin que usted
// tenga que estar encima.» y «desde el día en que empieza a construir su activo»—; la -v4
// queda sin uso. v6 (mismo día): la 7 pregunta por el plan «para construir un activo» y la 8
// abre con «Se gana con lo que se compra en su sistema…»; la -v5 queda sin uso. v7
// (mismo día): «Eso es un activo: sigue produciendo aunque usted no esté presente» (antes, «sin que
// usted tenga que estar encima»); la -v6 queda sin uso. v8 (2 nov 2026, fase 1 de la auditoría
// visual, la misma voz): la pantalla 8 son el cubo que se duplica y las barras de los 12 niveles,
// Uber entra en dos líneas, lo ya dicho se atenúa, la 4 trae sus cifras en íconos y las
// pantallas quietas se mueven despacio; la -v7 queda sin uso. v9 (mismo día, Director: «es
// genial»): en la propiedad la compra dibuja un ciclo dorado, cada vuelta deja caer un % sobre usted
// y el ciclo sigue cuando usted se atenúa («aunque usted no esté presente»); la -v8 queda sin uso.
// v10 (mismo día): en la pantalla 2 un trazo dorado lleva cada industria a lo que la modernizó
// (domicilios → Rappi, taxis → Uber, la fila del banco → Nequi), solo los tres que dice la voz;
// la -v9 queda sin uso. v11 (mismo día, Director): cuatro finales de frase que quedaban
// suspendidos (Nequi, informalidad, ruta, empresariales) se regrabaron con contexto y ahora
// caen; «Queswa» se dice Késwa; en la pantalla 8 las personas son la figura humana y el cubo
// (su empresa) es lo que viaja; «cómo se gana» trae el ciclo de la propiedad y un paquete que
// fluye con «paquetes empresariales»; la -v10 queda sin uso. v12 (mismo día, Director: «hazlo»):
// en la solución, «Un activo:» es lo más grande y el único oro de la pantalla, y «Tres elementos
// que le costarían millones:» baja a gris; la voz no cambia; la -v11 queda sin uso.
// v13 (3 nov 2026, Director: «hazlo»): la herramienta «es para usted: cada día le dice qué hacer»
// (sin Waze), y después de «Queswa.app» va «Su día»: compartir y recibir, con Queswa entre las dos,
// en pantallas de queswa.app; la -v12 queda sin uso.
// v14 (3 nov 2026, Director: «aprobado»): «Su día» es una escena con dos teléfonos y una sola
// historia: usted toca su enlace y lo pega en WhatsApp, Ana María conversa con Queswa y pide
// hablar con una persona, y a usted le llega el aviso; la voz va en ese orden. Pantallas de la
// socia de ejemplo de las guías, sin datos reales; la -v13 queda sin uso.
// v15 (7 nov 2026, Director: «aprobado»): sigue a la presentación nueva (el credo con sus dos
// tarjetas y la bicicleta, el dolor en cifras de segundo, pares universales, la 5 en tarjetas con
// «dueña del sistema, no de las piezas», el flujo con su campana, tres paquetes en «cómo se gana»).
// La voz es una toma continua por pantalla, encadenada: las tomas sueltas sonaban pegadas.
// La -v14 queda sin uso.
// v16 (7 nov 2026, Director: «súbelo»): la v15 con la caja registradora en «cómo se gana»,
// cuando el primer % cae sobre usted. La -v15 queda sin uso.
// v17 (7 nov 2026, Director: «aprobado»): cada vez que la compra llega a su empresa cae un % sobre
// usted y suena la registradora (solo el «ching»): cuatro en «la diferencia» y tres en «cómo se gana»,
// donde cada paquete llega con una vuelta del ciclo. La -v16 queda sin uso.
// v18 (11 nov 2026, Director: «me gustó, súbelo»): sigue al deck del 9 nov — sin «Dos sectores»,
// «crecimiento por acumulación» con tres clientes y el Ganoderma en tres datos. La -v17 queda sin uso.
// v19 (26 nov 2026, Director: «aprobado»): la pantalla 1 dibujada (el credo se escribe con la voz, el
// ciclo, la plata que se reparte, la bicicleta, el activo al lado) porque con cuatro imágenes quietas hubo
// quien creyó que el video había terminado; el dolor con los íconos en rojo y su alerta; la solución
// «ser dueño de un sistema de distribución que cabe en su celular»; «queda registrado en su sistema»; y
// las cuatro líneas de productos. 3:55. La -v18 queda sin uso.
// El corte de
// YouTube (horizontal, con el
// cierre hacia creatuactivo.com/servilleta) sale de la misma receta y no va a Blob.
// Un corte nuevo se sube con otro nombre.
// v20 (26 nov 2026, Director): la v19 idéntica con la música alargada en el compás (musica_larga.py): la pista
// dura 3:43 y se apagaba desde ~3:15. La -v19 queda sin uso.
// v21 (27 nov 2026, Director: «de acuerdo»): los tres elementos nuevos —un fabricante · un asistente en línea ·
// saber qué hacer— en la voz de la 5.1 y en sus tarjetas (armar_v21.py). 3:50. La -v20 queda sin uso.
export const VIDEO_PLAN_SERVILLETA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/plan-servilleta-v22.mp4'
// La de ESTADOS UNIDOS (26 nov 2026, Director: «aprobado»): la misma receta (armar_usa.py) con la voz de
// Alejandro (mexicano neutro), las cifras de allá (Pew, Reserva Federal), «tres mil / más de diez mil
// dólares al mes», Blockbuster → Netflix y el centro comercial → Amazon, tres líneas y la regalía en
// dólares con 6 cajas. 4:07. Se mide como `usa-v1`.
// usa-v2 (27 nov 2026, Director): los tres elementos nuevos en la 5.1, como la v21 (armar_usa2.py). 4:05.
// usa-v3 y v22 (27 nov 2026, Director): la marca de agua CreaTuActivo.com durante todo el cuerpo, como en
// los reels, abajo a la IZQUIERDA (a la derecha está el contador del deck). con_marca.py.
export const VIDEO_PLAN_SERVILLETA_US = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/plan-servilleta-usa-v3.mp4'

// «Los 12 Niveles» para el canal (59,5 s, 720×1280, 8,4 MB). La voz es NIVELES_01
// sin el precio del Kit; en pantalla, el simulador con su advertencia («Potencial
// matemático… No es un resultado garantizado»). Lo manda el nodo 2.34 del conductor
// con la pregunta de cierre de NIVELES_01 como pie.
// v2 (6 oct 2026, Director): el «No» con acento y medio segundo de silencio, sobre
// el orbe solo —la tienda entra con «Su sistema factura»—; «de cada uno de ellos» →
// «de ellos», y la cifra cierra con «el mismo 10% que empezó a cobrar con el Kit»
// en vez de repetir la definición del GCV. Por eso la voz ya no es el candado
// palabra por palabra: lo que se oye está en `notaVideoDoceNivelesVisto()`.
// Sale de scripts/dankoe-video/captions/work/doce-niveles/armar_v2.py.
// v3 (27 nov 2026, Director): la misma voz con escenas dibujadas (nada de árbol: la duplicación es un
// campo de puntos y lo que se mueve son compras), el rótulo de marca y la marca de agua; 59,5 s con la
// marca al final. Sale de scripts/dankoe-video/captions/work/doce-niveles/v3/armar.py. La v2 queda sin uso.
export const VIDEO_DOCE_NIVELES_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/doce-niveles-v3.mp4'

// «Los 12 Niveles» para ESTADOS UNIDOS (27 nov 2026, Director: «aprobado»). La voz es
// NIVELES_01_US palabra por palabra (src/lib/doce-niveles-usa.ts: 6 cajas al mes por
// distribuidor, el 10 % base, más de $47,000 USD, sin Kit), con la voz de Alejandro de
// la Presentación de allá, y el simulador en dólares. 58 s. Sale de
// scripts/dankoe-video/captions/work/doce-niveles-usa/armar.py.
export const VIDEO_DOCE_NIVELES_US_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/doce-niveles-usa-v1.mp4'

// «Cómo entra el dinero» para el canal (50 s, 720×1280, 7,7 MB; 27 sep 2026). La voz
// es WHY_04 palabra por palabra, sin la pregunta de cierre, que va como pie. Lo
// manda el botón del medio de la apertura (`apertura_dinero`), como el de
// «Cómo funciona». Clips nuevos con Gemini sobre el mismo mundo 3D: los paquetes
// que salen del celular, las dos formas de venta, el anillo del cliente, el orbe
// que se posa en un cubo mientras siguen las entregas, y fábrica y banco que
// destellan juntos en la quinta baldosa (cada viernes).
// v2 (2 nov 2026, Director): «Esa repetición es la que vuelve su sistema un activo: produce
// aunque usted no esté presente» (antes, «sin que usted tenga que estar encima»), como
// WHY_04; la -v1 queda sin uso. Receta: captions/work/como-entra-el-dinero/armar_v5.py.
// v3 (27 nov 2026, Director: «aprobado»): la misma voz, mezcla, subtítulos y cierre de la v2;
// cambia solo la imagen: en vez de los clips 3D, escenas dibujadas en el estilo de las gráficas
// del reto y de la Presentación v19 (el producto con tres fotos reales, las dos formas de venta,
// el ciclo que deja un % por compra, el calendario de los viernes y los dos carriles producto/plata).
// La -v2 queda sin uso. Receta: captions/work/como-entra-el-dinero/opcion-2/armar_opcion2.py.
// v4 (27 nov 2026, Director): la v3 con el rótulo de marca de los reels del reto en los primeros 3,8 s
// («CREATUACTIVO.COM / CÓMO ENTRA EL DINERO»): se comparte como historia. La v3 queda sin uso.
export const VIDEO_COMO_ENTRA_EL_DINERO_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/como-entra-el-dinero-v4.mp4'

// «Qué debo hacer yo» para el canal (42 s, 720×1280, 6,4 MB; 28 sep 2026). La voz es
// EAM_01 palabra por palabra, sin los emojis ni la pregunta de cierre, que va como
// pie. Lo manda el tercer botón de la apertura (`apertura_rol`). Usted es la figura
// blanca con su celular y el orbe encima: comparte (avioncitos hacia las figuras que
// se encienden), recibe (saluda a la que llega), Queswa conversa y, cuando alguien
// está listo, le llega la notificación. Abre con el boom preferido del Director y la
// voz entra a 1,9 s, al 90 % de velocidad.
// v2 (27 nov 2026, Director): la misma voz (EAM_01) a su velocidad normal, con escenas dibujadas —la fila
// Compartir · Queswa · Recibir, la notificación «Alguien está listo para avanzar», la misma fila para quien
// inicia con usted y la rejilla plana con las compras hacia la facturación—, el rótulo de marca y la marca
// de agua; 36 s. Sale de scripts/dankoe-video/captions/work/que-debo-hacer-yo/v2/armar.py. La v1 queda sin uso.
export const VIDEO_QUE_DEBO_HACER_YO_WA = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/queswa/que-debo-hacer-yo-v2.mp4'

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
