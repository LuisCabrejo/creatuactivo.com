'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /servilleta — LA presentación única de CreaTuActivo (consolidada el 10 oct
 * 2026, Director). Nació como /presentacion (antes /pitch-deck, 23 sep 2026) y
 * se mudó a esta URL porque es la que tiene el SEO de «plan servilleta». El deck
 * viejo de la servilleta (4 pantallas) y /12-niveles se retiraron (viven en git);
 * /presentacion, /pitch-deck, /presentacion-empresarial y /12-niveles redirigen
 * aquí conservando el ?ref (y /12-niveles abre en ?pantalla=8). Debajo del deck
 * va la guía en texto (GuiaPlanServilleta.tsx) con el ÚNICO h1 de la página.
 *
 * SE PRESENTA EN VIVO (Director, 30 sep 2026): el socio conduce el deck delante
 * de la persona y solo DESPUÉS le comparte el enlace, así que puede apoyarse en
 * su voz.
 *
 * CONSOLIDACIÓN (Director, 10 oct 2026): quien busca «plan servilleta» es un
 * distribuidor buscando una herramienta (reports/Plan servilleta top 3
 * Google.md), así que la presentación que se usa y la que se encuentra son la
 * misma. TODO apunta aquí, incluido el simulador que Queswa ofrece en la web
 * (textoSimuladorWeb → ?pantalla=8). Pendiente: Fase 3, el video-herramienta del
 * socio (doble destino: WhatsApp y el carrusel de YouTube de «plan servilleta»).
 *
 * LA PÁGINA TIENE DOS PISOS: el deck ocupa la primera pantalla (100dvh) y debajo
 * va la guía. Al presentar, la guía no existe (en pantalla completa se oculta) y
 * mientras alguien la lee el deck no escucha el teclado ni reproduce videos.
 * La página no baja hasta la última pantalla (13 oct 2026): ver `guiaAbierta`.
 * Desde el 18 oct 2026 el dedo no la abre ni si el navegador deja pasar el gesto:
 * el desplazamiento de la persona se devuelve al deck (`huboGesto`).
 *
 * COLUMNA NUEVA (30 sep 2026). La del 23 sep se construyó pantalla por pantalla y
 * tenía disonancias: revelaba la solución tres veces antes del clímax, contaba el
 * negocio distinto a WHY_02 y la pantalla del dinero discutía consigo misma. Esa
 * versión queda navegable en /presentacion/anterior (commit 7e5cc61).
 *
 * REGLA: cada pantalla responde UNA pregunta del prospecto, y el titular es la
 * respuesta. Cada idea se dice una vez.
 *
 * Las pantallas 2 a 5 son la columna del Director, probada en sus conversaciones:
 * modernizar dos sectores. Nombrar «network marketing» dentro de la ola de
 * modernización resolvió el «ah, es como Herbalife»: el enfoque queda en la
 * oportunidad. Tiene la forma de la narrativa estratégica de Andy Raskin: un
 * cambio en el mundo → quién se queda atrás → la tierra prometida → las
 * herramientas.
 *
 *  1 EN QUÉ CREEMOS  · la primera mitad del credo (el ciclo) de titular y, desde el
 *                      7 nov 2026 (Director, del ejercicio de Vélez «Del estrés
 *                      crónico al activo familiar»), dos tarjetas: HOY (el dinero
 *                      que ya tiene dueño · trabajar más es la bicicleta estática) y LO
 *                      QUE CREEMOS (construir sin quemar los barcos · que el
 *                      trabajo se convierta en un activo). Sin el mecanismo del
 *                      activo: eso es la pantalla 5. Y el botón VER LA
 *                      PRESENTACIÓN EN VIDEO (30 oct 2026, Director): el deck
 *                      entero en voz —al terminar salta a la 9— o lo presenta el
 *                      socio. Es el ÚNICO video en ventana del deck.
 *  2 EL DOLOR,       · (la 4 hasta el 7 nov 2026, Director: primero el dolor,
 *    EN CIFRAS         después la oportunidad, y entonces la solución). Tres
 *                      cifras verificadas en fuente primaria (el ingreso que
 *                      no alcanza · la informalidad · la pensión que no llega) y,
 *                      debajo, la frase en la que la gente asiente: «Hoy, la
 *                      mayoría de las personas siente que tiene que hacer algo»
 *                      (Director, 18 oct 2026). El beat de «dos caminos» se
 *                      eliminó el 9 oct 2026: ese contexto lo da el socio en vivo.
 *  3 LA OPORTUNIDAD  · modernizar industrias frente a nuestros ojos: cinco pares
 *                      universales desde el 7 nov 2026 (taxis → Uber … ir a la
 *                      tienda → Amazon).
 *  4 DOS SECTORES    · la industria del network marketing y el sector laboral.
 *                      ⚠️ SOLO el nombre del sector, sin describir cómo se hace
 *                      hoy: el contexto lo da el socio en vivo, y una pieza no
 *                      concede (memoria feedback_pieza_no_concede).
 *                      ⚠️ Se intercambiaron pantallas, no se fundieron: de la 5 a
 *                      la 9 los números no se mueven (`?pantalla=8` vive en
 *                      Queswa, el webhook, /paquetes, los enlaces del socio y el
 *                      Dashboard).
 *  5 LA SOLUCIÓN     · beat 0: «Un activo: una empresa de distribución moderna a su
 *    Y CÓMO FUNCIONA   nombre.» —«Un activo» lo más grande y el único oro (2 nov
 *                      2026)— y el obstáculo con precio, en gris, «Tres elementos que le
 *                      costarían millones:» (28 oct 2026; la definición completa
 *                      con Uber va en la voz del socio), con aire entre las dos
 *                      frases. El botón del video «Cómo funciona» (13-30 oct 2026)
 *                      SALIÓ: el video de la presentación entera vive en la 1.
 *                      Desde el 7 nov 2026 (Director: «una idea en una sola imagen
 *                      es mucho más sencillo y potente») son 4 beats y no 10:
 *                      beat 1, «Tres elementos en Queswa.app», las tres tarjetas
 *                      con la unión en el titular (antes: cada pieza a solas, las
 *                      tres quietas y la unión con el clip del celular, cinco
 *                      beats) · beat 2, «Experiencia sin fricción en dos pasos», tres
 *                      tarjetas Compartir · Queswa · Recibir con una luz que
 *                      recorre el flujo (antes: la escena de los dos teléfonos,
 *                      tres toques) · beat 3, la propiedad con su porcentaje: la
 *                      cadena del modelo completa, como WHY_02. Ver ELEMENTOS y
 *                      ACCIONES.
 *                      → ENCUADRE_CLIMAX_TRES_ELEMENTOS_OCT2026.md
 *  6 EL PRODUCTO     · la del deck del 23 sep, sin cambios. Gano se nombra aquí
 *                      por primera vez, como quien lo fabrica.
 *  7 LA PREGUNTA     · «¿Y usted, qué plan tiene para construir un activo?» sola
 *                      (caso Marlon; «para salir del ciclo» hasta el 1 nov 2026).
 *  8 CÓMO SE GANA    · beat 0 (1 nov 2026), la respuesta corta del Director: «Se
 *                      gana por las compras que hacen sus clientes y
 *                      distribuidores: de producto y de paquetes
 *                      empresariales.» (7 nov 2026) Beat 1, lo principal: «Así se ve
 *                      su activo si crece de a dos.», los 12 niveles desde el Kit
 *                      y la línea del ejemplo. `?pantalla=8` abre aquí, en el
 *                      simulador (BEAT_DEL_ENLACE). Beat 2: el bono por paquetes
 *                      empresariales (Director, 30 sep 2026: quien inicia muchas
 *                      veces necesita ganar pronto, y la industria lo tiene; no
 *                      puede parecer olvidado). Se nombra por lo que lo mueve —la
 *                      compra de un paquete—, nunca por su velocidad ni por una
 *                      etapa: se paga igual al que inicia y al que lleva décadas
 *                      (Director, 2 nov 2026). Gano paga, al final.
 *  9 EL SIGUIENTE    · la segunda mitad del credo, el acompañamiento «desde el
 *    PASO              día en que empieza a construir su activo» y la
 *                      conversación con el socio del ?ref (nombre y WhatsApp).
 *                      En el 1-a-1, el socio toca el nombre y escribe el de la
 *                      persona: ve cómo termina SU presentación cuando la comparta.
 *                      ⛔ La lista de espera SALIÓ el 1 nov 2026 (Director, caso
 *                      Daniela): en una reunión para decidir, la fila le da
 *                      permiso para aplazar, y se contradice cuando el socio
 *                      puede iniciarla ese mismo día. La línea repite la pregunta
 *                      de cierre del socio («¿Cómo se siente para empezar a
 *                      construir su propio activo?»): el verbo de lo propio en
 *                      lugar de «entrar».
 *
 *  EL ACTIVO, EN TRES MOMENTOS (Director, 1 nov 2026): la solución abre con «Un
 *  activo:» (beat 0 de la 5), la propiedad lo define pegado a su causa («Eso es un
 *  activo: sigue produciendo aunque usted no esté presente», beat 6) y la 9
 *  cierra con él. Es el hilo que el Director abre en vivo con Buenavista.
 *
 *  ⛔ «QUÉ HACE USTED» (las dos acciones, EAM_01) SALIÓ DEL DECK el 18 oct 2026
 *     (Director, tras presentarlo): en vivo las dos acciones se MUESTRAN —el
 *     socio comparte su enlace delante de la persona y recibe el aviso en
 *     queswa.app— y la pantalla se sentía redundante. Sobreviven en una línea
 *     de la multiplicación («comparte su enlace y recibe a quien llega»), en la
 *     guía de abajo (Google) y en Queswa (EAM_01). Era una recomendación del
 *     30 sep que nunca se confirmó. No la reponga.
 *
 * REGLAS QUE ROMPEN ALGO SI SE TOCAN
 * ----------------------------------
 *  · El botón «PREGÚNTELE ALGO AHORA» (pieza 2 de la pantalla 5) convierte la
 *    tecnología en experiencia. Por eso /presentacion está en RUTAS_ORBE_QUESWA_WEB
 *    (orbe-config.ts) y en `isDeck` de UnifiedQueswaOrb: mandar esa demo a
 *    WhatsApp la rompe, porque saca al prospecto de la reunión.
 *  · «Network marketing» va SOLO como nombre del sector (pantalla 4). Cómo se hace
 *    hoy lo cuenta el socio en vivo: una pieza no concede, y describirlo aquí sería
 *    un juicio sin voz sobre el método de otros.
 *  · El bono por paquetes se nombra por lo que lo mueve (la compra de un paquete),
 *    NUNCA por su velocidad ni por una etapa («financia el crecimiento al inicio» se
 *    retiró el 2 nov 2026: se paga igual al que inicia y al que lleva décadas). Se
 *    cuentan paquetes comprados, nunca personas.
 *  · Sin socio (visita orgánica o ?ref que no se encuentra), la conversación es con
 *    el equipo, por el WhatsApp Business (Director, 1 oct 2026).
 *  · La presentación reporta hasta dónde llegó cada persona en tres hitos, si llegó
 *    al final y si tocó el WhatsApp (/api/track/presentacion → avisos del Dashboard).
 *  · La última pantalla nombra al socio del ?ref y trae su WhatsApp. El socio toca
 *    su nombre y escribe el del prospecto: la prueba en vivo de la personalización
 *    de Queswa.app, la aplicación que el remate nombra. «En su caso, esta pantalla
 *    dirá el suyo» es frase de
 *    la voz del socio: no va escrita.
 *  · Moneda: pesos con PUNTO de miles, dólares con COMA. Por eso los locales van
 *    explícitos ('es-CO' / 'en-US') y no un toLocaleString() pelado, que depende
 *    del navegador de quien presenta.
 *  · En el deck NO conviven precio de entrada y comisión: eso es promesa de
 *    ingreso. Aquí solo hay comisiones; los precios viven en /paquetes.
 *  · Swipe: solo los <input> (sliders y el nombre) exoneran el gesto. No añadir
 *    paneles ni botones a esa lista: bloquea el swipe-back de la última pantalla.
 *  · Nada de acentos graves en los comentarios del CSS: cierran la plantilla de JS
 *    que lo envuelve (rompió el build el 28 sep 2026).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import GuiaPlanServilleta from './GuiaPlanServilleta';
import CicloPropiedad from './CicloPropiedad';
import { VIDEO_PLAN_SERVILLETA } from '@/lib/reels';
import { marcarVioComoFunciona } from '@/lib/orbe-config';
import { dispositivoDe } from '@/lib/dispositivo';

const TOTAL_SLIDES = 9;
/** El recorrido (9 nov 2026, Director): «Dos sectores por modernizar» (la 4) salió;
 *  la oportunidad cierra con «Ahora le toca a la forma de hacer empresa». ⚠️ Los
 *  números NO se corren: `?pantalla=8` vive en Queswa, el webhook, /paquetes, los
 *  enlaces del socio y el Dashboard, y la medición del avance guarda estos números.
 *  La navegación salta la 4; el contador y los puntos cuentan las que quedan. */
const PANTALLAS = [1, 2, 3, 5, 6, 7, 8, 9];
const siguienteDe = (n: number) => PANTALLAS[PANTALLAS.indexOf(n) + 1];
const anteriorDe = (n: number) => PANTALLAS[PANTALLAS.indexOf(n) - 1];
/** Pantallas que se reportan a la ficha: un tercio, dos tercios y la última. */
const HITOS_PRESENTACION = [4, 6, TOTAL_SLIDES];
/** WhatsApp Business del equipo (+57 320 680 5737): el mismo número orgánico de
 *  los reels (`WHATSAPP_ORGANICO_DEFAULT` en [slug]/[destino]). Para quien llega
 *  a la presentación sin el enlace de un socio. */
const WHATSAPP_EQUIPO = '573206805737';

/** Beats internos por pantalla. */
const BEATS: Record<number, number> = { 5: 4, 8: 3 };
const beatsOf = (slide: number) => BEATS[slide] ?? 1;
/** El beat donde abre `?pantalla=N`: la 8 abre en el simulador (beat 1), no en la
 *  respuesta corta, porque ese enlace es «Abrir el simulador» (Queswa y el webhook). */
const BEAT_DEL_ENLACE: Record<number, number> = { 8: 1 };

/** Los tres elementos, en UNA diapositiva con su unión (Director, 7 nov 2026: «una idea
 *  en una sola imagen es mucho más sencillo y potente»). Hasta ese día eran cinco beats
 *  —cada pieza a solas con su loop, las tres quietas y la unión con el clip del
 *  celular—, y la pantalla 5 tenía 10 toques: entre los hitos 4 y 6 era donde más se iba
 *  la gente que la veía sola. Sencillo en la explicación, como lo que se vende: lo
 *  complejo da cortisol; lo sencillo, la sensación de «yo puedo».
 *  Los NOMBRES son el canon de todas partes (WHY_02, el video, Queswa). Los subtítulos
 *  los eligió el Director entre dos ejercicios de primeros principios (Musk y Vélez):
 *  cortos, que pinten y le den al socio de qué hablar. ⚠️ «Máquina de ventas» va aquí
 *  sin su mecanismo en la misma frase, por decisión del Director para esta tarjeta: el
 *  mecanismo lo dice la diapositiva siguiente (usted envía, Queswa conversa, usted
 *  recibe). Fuera de la presentación la regla sigue igual. */
const ELEMENTOS: { label: string; sub: string; icono: 'fabrica' | 'conversa' | 'celular'; boton?: 'queswa' | 'app' }[] = [
  { label: 'Un fabricante', sub: 'Respaldo operativo directo al cliente y al distribuidor.', icono: 'fabrica' },
  // El FRENTE de la máquina: lo que ve quien usted envía (el chat se abre en la misma
  // página, así que en Meet sí se ve).
  { label: 'Una máquina de ventas', sub: 'Atención empática a toda hora.', icono: 'conversa', boton: 'queswa' },
  // queswa.app por dentro, en una ventana del tamaño de un celular (en el teléfono, pestaña nueva).
  { label: 'Una herramienta para multiplicar', sub: 'Ruta diaria idéntica para todos.', icono: 'celular', boton: 'app' },
];

/** Las dos acciones (Director, 7 nov 2026; título y textos suyos, tomados del ejercicio
 *  de Vélez: «Experiencia sin fricción en dos pasos»), en tarjetas en lugar de la escena animada
 *  de los dos teléfonos (3-6 nov 2026, tres toques): quien entiende que son dos pasos
 *  siente que puede, y le da curiosidad de verlo en la app. La del centro es el trabajo
 *  que no hace usted, en el cian de «Queswa en línea»; una luz recorre el flujo. */
const ACCIONES: { rotulo: string; titulo: string; sub: string; queswa?: boolean; campana?: boolean }[] = [
  // Textos cortos (9 nov 2026, Director, del ejercicio de Gemini).
  { rotulo: '01 · Compartir', titulo: 'Invitación natural', sub: 'Envía un enlace personal.' },
  { rotulo: 'Queswa', titulo: 'Queswa conversa', sub: 'Resuelve dudas sin presión.', queswa: true },
  // La campana con su «1» (Director, 9 nov 2026): la notificación se ve, no se lee.
  { rotulo: '02 · Recibir', titulo: 'Notificación en su celular', sub: 'Saluda al interesado informado.', campana: true },
];

/** «La diferencia» en tres puntos (9 nov 2026, Director). El 02 va en oro: es el dinero. */
const PUNTOS_DIFERENCIA: { t: string; s: string; oro?: boolean }[] = [
  { t: 'Cada cliente queda a su nombre', s: 'El cliente que llega por su enlace queda registrado en su empresa.' },
  { t: 'Un porcentaje en cada recompra', s: 'Cada vez que vuelve a comprar, a usted le queda un porcentaje.', oro: true },
  { t: 'Eso es un activo', s: 'Sigue produciendo aunque usted no esté presente.' },
];

/** Los íconos de las tarjetas, dibujados aquí (trazo de 1,5, como el resto del deck). */
function IconoElemento({ cual }: { cual: 'fabrica' | 'conversa' | 'celular' }) {
  const comun = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  if (cual === 'fabrica') return (
    <svg {...comun}><path d="M3 21V10l5 3V10l5 3V10l5 3V5h3v16Z" /><path d="M7 17h2M12 17h2M17 17h1" /></svg>
  );
  if (cual === 'conversa') return (
    <svg {...comun}><path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-4-3h-3" /></svg>
  );
  return (
    <svg {...comun}><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M10.5 18.5h3" /></svg>
  );
}

/** La ola de modernización (Director, 30 sep 2026): lo que antes era una
 *  industria a la antigua, hoy es una aplicación. */
// Universales (Director, 7 nov 2026): presentando en vivo a mexicanos y a latinos en
// Estados Unidos, Rappi, Nequi y Adpostal no se reconocían. Los tres primeros son los
// que dice la voz del video. Hasta ese día: Domicilios → Rappi, Taxis → Uber, La fila
// del banco → Nequi, Comprar DVDs → Netflix, Adpostal → WhatsApp. ⚠️ La columna de la
// izquierda no parte línea: rótulos de 18 caracteres como máximo.
const PARES_MODERNIZACION: [string, string][] = [
  ['Taxis', 'Uber'],
  ['Alquilar películas', 'Netflix'],
  ['Llamar al exterior', 'WhatsApp'],
  ['Hoteles', 'Airbnb'],
  ['Ir a la tienda', 'Amazon'],
];

/** LAS CUATRO LÍNEAS, CADA UNA CON SU FICHA (Director, 9 nov 2026: «quitémosle
 *  densidad… que al dar clic en cada categoría se explique la imagen»). La pantalla
 *  queda con la taza, la recompra y los cuatro botones; lo que hace valiosa a cada
 *  línea se abre con el botón «Ver las cuatro líneas» (sin miniaturas en la pantalla,
 *  por decisión del Director el mismo día). Orden y conteos de PROD_OVERVIEW.
 *  ⚠️ Cada texto sale del catálogo aprobado: BEB_01/BEB_07, LUV_00, SUP_01-04 y
 *  PERS_01/PROD_03. El oficio del Ganoderma (seis variedades, hidrosoluble, 1983) va
 *  en la pantalla misma, no aquí: no se repite.
 *  ⛔ Salió «El mismo extracto va en toda la línea»: el Cordygold no lleva Ganoderma.
 *  Por eso su fila nombra el Cordyceps, y nunca se dice «con» ni «sin» Ganoderma. */
const CATEGORIAS: {
  label: string; img: string; n: number; titulo: string; texto: string;
  rasgos: [string, string][];
}[] = [
  {
    label: 'BEBIDAS', img: '/productos/compuestas/categoria-bebidas.jpg', n: 9,
    titulo: 'La taza de cada momento',
    texto: 'Café de cuerpo, aroma y el amargo justo de una buena cafetería, con el extracto de Ganoderma de Gano Excel.',
    rasgos: [
      ['Cuatro cafés', 'Clásico, 3 en 1, Latte y Mocha'],
      ['Sin café', 'Dos chocolates, té rooibos y un cereal con spirulina'],
      ['Colágeno', 'Reskine, para la piel y las articulaciones'],
    ],
  },
  {
    label: 'LUVOCO', img: '/productos/compuestas/categoria-luvoco.jpg', n: 4,
    titulo: 'El espresso de la casa',
    texto: 'Una máquina italiana de 15 bares y cápsulas propias de café infundido con los betaglucanos del Ganoderma. A presión, el aroma se concentra y la taza tiene el cuerpo de una cafetería.',
    rasgos: [
      ['Tres intensidades', 'Suave, medio y fuerte, por paladar'],
      ['La máquina, una vez', 'Las cápsulas son las que se repiten'],
    ],
  },
  {
    label: 'SUPLEMENTOS', img: '/productos/compuestas/categoria-suplementos.jpg', n: 3,
    titulo: 'Concentrados en cápsula',
    texto: 'Una cápsula al día, sin café de por medio. Para quien quiere el hongo solo, o sumarlo al café de la mañana.',
    rasgos: [
      ['Ganoderma', 'El extracto concentrado, apoyo inmune'],
      ['Excellium', 'El micelio joven del hongo, para el enfoque'],
      ['Cordygold', 'Cordyceps: energía natural y rendimiento físico'],
    ],
  },
  {
    label: 'CUIDADO PERSONAL', img: '/productos/compuestas/categoria-cuidado-personal.jpg', n: 6,
    titulo: 'Para quien no toma café',
    texto: 'La línea entra a la casa por el baño: pasta dental, dos jabones, champú, acondicionador y exfoliante, con el extracto de Ganoderma.',
    rasgos: [
      ['Gano Fresh', 'Pasta dental sin flúor'],
      ['Jabón Transparente', 'Para pieles sensibles'],
      ['Piel&Brillo', 'Champú, acondicionador y exfoliante'],
    ],
  },
];

/** Proyección 2×2 sobre 12 niveles — misma tabla que NIVELES_02 del arsenal
 *  (v6.8: 10% del CV emparejado, cada distribuidor consumiendo 56 CV al mes).
 *  `people` = distribuidores NUEVOS en ese nivel. Copiada de /12-niveles: si allá
 *  cambia, aquí también. */
const PROYECCION_12: { level: number; people: number; income: number }[] = [
  { level: 1, people: 2, income: 25200 },
  { level: 2, people: 4, income: 75600 },
  { level: 3, people: 8, income: 176400 },
  { level: 4, people: 16, income: 378000 },
  { level: 5, people: 32, income: 781200 },
  { level: 6, people: 64, income: 1587600 },
  { level: 7, people: 128, income: 3200400 },
  { level: 8, people: 256, income: 6426000 },
  { level: 9, people: 512, income: 12877200 },
  { level: 10, people: 1024, income: 25779600 },
  { level: 11, people: 2048, income: 51584400 },
  { level: 12, people: 4096, income: 103194000 },
];

/** El porcentaje del Binario según la forma de iniciar (COMP_BIN_02 del arsenal de
 *  compensación). ⚠️ Solo el 10% del Kit es permanente: el 15, 16 y 17% rigen 2, 4
 *  y 6 meses, y después el sistema aplica el más alto entre el 10% base y el del
 *  rango. Por eso la pantalla lo dice cada vez que se elige uno de los tres — sin
 *  esa línea, el nivel 12 al 17% sería una cifra que el plan no paga. */
const TARIFAS_12 = [
  { pct: 10, nombre: 'Kit', paquete: 'Kit de Inicio', meses: 0 },
  { pct: 15, nombre: 'Inicial', paquete: 'paquete Inicial', meses: 2 },
  { pct: 16, nombre: 'Empresarial', paquete: 'paquete Empresarial', meses: 4 },
  { pct: 17, nombre: 'Visionario', paquete: 'paquete Visionario', meses: 6 },
] as const;

/** Las cifras del dolor (las dos primeras aprobadas por el Director el 26 sep 2026;
 *  la de informalidad, el 9 oct 2026). Cuentan una sola historia: el ingreso de hoy
 *  no alcanza → así se trabaja hoy → así termina. Cada una se verificó en su fuente
 *  primaria; si se cambia una, se vuelve a la fuente — no a un artículo que la cite.
 *  · DANE, Empleo informal y seguridad social (GEIH): proporción de ocupación
 *    informal 54,6 % para el total nacional, trimestre móvil may–jul 2026 (un año
 *    antes: 55,0 %). ⚠️ El dato ROTA cada mes: al tocar esta pantalla, re-verificar
 *    el trimestre vigente y actualizar cifra + rótulo de fuente juntos.
 *    https://www.dane.gov.co/index.php/estadisticas-por-tema/mercado-laboral/empleo-informal-y-seguridad-social
 *  · DANE, Encuesta Nacional de Calidad de Vida 2025 (anexo, cuadro 35): el 31,3 %
 *    de los hogares dice que su ingreso «no alcanza para cubrir los gastos mínimos»
 *    y el 61,0 % que «alcanza para cubrir los gastos mínimos»; solo el 7,7 % que
 *    «cubre más». Se usa la SUMA (92,3 %) a propósito: el «no alcanza» solo viene
 *    bajando desde 2022, mientras que el «cubre más» lleva entre 7 y 8 % desde 2019.
 *    https://www.dane.gov.co/files/operaciones/ECV/anex-ECV-2025.xlsx
 *  · Colpensiones + U. Javeriana, primer estudio de Silver Economy en Colombia
 *    (presentado jul. 2022, datos 2021): de 7,1 millones de personas en edad de
 *    retiro (hombres 62+, mujeres 57+), 1,6 millones reciben alguna pensión —
 *    cobertura del 23 %. «3 de cada 4» sin pensión es la versión CONSERVADORA
 *    (el real es 77 %): solo puede sorprender hacia arriba. Reemplazó el 27 sep
 *    2026 (Director) a la cifra del GEM de «buenas oportunidades» (60 %): la
 *    pensión es el destino del ciclo y cierra mejor el arco hoy → final → los
 *    demás ya se mueven.
 *    https://www.larepublica.co/finanzas/cobertura-pensional-es-de-apenas-23-segun-estudio-de-colpensiones-y-unijaveriana-3398629
 *  ⛔ Descartadas: la del GEM (TEA 23,6 %, «casi 1 de cada 4 montando un negocio»)
 *  la descartó el Director el 9 oct 2026 — «casi uno de cada cuatro» produce
 *  disonancia aritmética en vivo («¿cómo así, casi uno?»), y prefirió un porcentaje
 *  exacto y de dolor puro (la informalidad); el «9 de cada 10 quieren emprender /
 *  63 % sin recursos» es un estudio de Amway (2021) — la fuente confirma la
 *  categoría que no se nombra —; la «intención emprendedora» del GEM es
 *  inconsistente; y la carga financiera del Banco de la República (31 %, feb. 2026)
 *  cubre solo a los hogares con créditos. */
/*  Cada cifra lleva su proporción en imagen (2 nov 2026): diez casas con nueve
 *  encendidas, la barra que pasa la marca de la mitad (la voz del video dice «más de
 *  la mitad»; la pantalla, el porcentaje exacto que eligió el Director) y cuatro
 *  personas con tres encendidas. Con íconos se entiende y se recuerda más la
 *  proporción, sobre todo quien tiene poca costumbre de leer cifras (revisión de
 *  García-Retamero y Cokely, 2013). Encendido en blanco, no en oro: el oro es el premio. */
const CIFRAS_PROBLEMA: {
  n: string; texto: string; fuente: string;
  icono: { tipo: 'casa' | 'persona'; de: number; en: number } | { tipo: 'barra'; pct: number };
}[] = [
  {
    n: '9 de cada 10',
    texto: 'Hogares a los que no les sobra al final del mes',
    fuente: 'DANE · Encuesta de Calidad de Vida 2025',
    icono: { tipo: 'casa', de: 10, en: 9 },
  },
  {
    n: '54,6 %',
    texto: 'Trabajadores en la informalidad',
    fuente: 'DANE · GEIH, may–jul 2026',
    icono: { tipo: 'barra', pct: 54.6 },
  },
  {
    n: '3 de cada 4',
    texto: 'Adultos mayores sin pensión',
    fuente: 'Colpensiones · U. Javeriana, 2022',
    icono: { tipo: 'persona', de: 4, en: 3 },
  },
];

/** Tasa fija del fabricante para más de 60 países. No es la TRM del mercado. */
const TRM = 4500;
/** Bono GEN5 por paquete, generación por generación (USD) — COMP_GEN5_04 del arsenal
 *  de compensación. Cada paquete que se compra deja bono en su generación y en las
 *  cuatro de arriba, y el paquete propio es el techo: el ejemplo supone el mismo
 *  paquete arriba y abajo. La quinta va con su valor completo (100 PV en el mes),
 *  igual que el simulador de WhatsApp (GEN5_POR_PAQUETE en wa-simulador.ts). El panel
 *  la muestra como la tabla del Flow —valor × paquetes = subtotal por generación— y
 *  cierra con el total atado a sus compras (Director, 1 nov 2026). */
const GEN5_POR_GENERACION: Record<'ESP1' | 'ESP2' | 'ESP3', number[]> = {
  ESP1: [25, 5, 5, 5, 10],
  ESP2: [75, 10, 10, 10, 20],
  ESP3: [150, 20, 20, 20, 40],
};

/** Las columnas de la tabla del bono: el Visionario primero, como anclaje. */
const PAQUETES_GEN5: { k: 'ESP1' | 'ESP2' | 'ESP3'; nombre: string }[] = [
  { k: 'ESP3', nombre: 'Visionario' },
  { k: 'ESP2', nombre: 'Empresarial' },
  { k: 'ESP1', nombre: 'Inicial' },
];

const enUSD = (n: number) => n.toLocaleString('en-US');
const enCOP = (n: number) => n.toLocaleString('es-CO');

export default function PitchDeckPage() {
  const [slide, setSlide] = useState(1);
  const [beat, setBeat] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // MODO VERTICAL PARA MEET (Director, 10 oct 2026 — portado de la servilleta
  // vieja). Un monitor horizontal no puede ir a pantalla completa en vertical,
  // así que se SIMULA: un iframe de esta misma página a tamaño de celular
  // (412×732 lógicos, que dispara el diseño de teléfono), escalado para llenar la
  // pantalla, centrado en negro y en pantalla completa nativa. `isKiosk` = esta
  // instancia corre DENTRO del iframe (?kiosk=1): sin guía, sin botones de modo,
  // sin reportar avance (lo reporta la página de afuera).
  const [isKiosk, setIsKiosk] = useState(false);
  const [verticalMode, setVerticalMode] = useState(false);
  const [vScale, setVScale] = useState(1);
  const vOverlayRef = useRef<HTMLDivElement | null>(null);
  const vIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [refSocio, setRefSocio] = useState<string | null>(null);
  // La ficha de una línea del producto (índice en CATEGORIAS), o null si está cerrada.
  // En la tira caben cuatro miniaturas y ahí no se lee nada: cada una abre su imagen
  // en grande con lo que hace valiosa a esa línea.
  const [linea, setLinea] = useState<number | null>(null);

  // Simuladores
  // ⚠️ MONEDA: COP por defecto (Director, 26 sep 2026) — en Colombia se muestra solo
  // pesos, y cada cifra sale en UNA moneda, nunca las dos a la vez. Fuera de
  // Colombia arranca en dólares (Director, 11 oct 2026: «para quien está afuera
  // es mejor dólar»): el país lo da /api/pais, y si no llega se queda en pesos.
  // El botón sigue a un toque, y lo que la persona elija no se lo pisa nadie.
  const [moneda, setMonedaEstado] = useState<'COP' | 'USD'>('COP');
  const monedaElegida = useRef(false);
  const setMoneda = (m: 'COP' | 'USD') => { monedaElegida.current = true; setMonedaEstado(m); };
  useEffect(() => {
    fetch('/api/pais')
      .then((r) => r.json())
      .then(({ pais }: { pais: string | null }) => {
        if (pais && pais !== 'CO' && !monedaElegida.current) setMonedaEstado('USD');
      })
      .catch(() => {});
  }, []);
  // PARA EXPLICAR EN VIVO (Director, 2 nov 2026): tocar una generación la enciende
  // (y apaga las otras); tocar el total enciende la suma de arriba abajo; las
  // teclas 1 a 5 encienden la generación y la 0 la suma. Las flechas ya cambian
  // de pantalla, por eso los números.
  const [gen5Activa, setGen5Activa] = useState<number | null>(null);
  // En el teléfono la tabla muestra un paquete a la vez, el Visionario de entrada.
  const [gen5Paq, setGen5Paq] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [gen5Sumando, setGen5Sumando] = useState(false);
  const gen5SumaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const encenderSumaGen5 = useCallback(() => {
    setGen5Activa(null);
    if (gen5SumaTimer.current) clearTimeout(gen5SumaTimer.current);
    setGen5Sumando(false);
    // Un cuadro después, para que la animación arranque de cero si ya corría.
    requestAnimationFrame(() => {
      setGen5Sumando(true);
      gen5SumaTimer.current = setTimeout(() => setGen5Sumando(false), 1500);
    });
  }, []);
  const [nivel12, setNivel12] = useState(12);
  const [tarifa12, setTarifa12] = useState(0); // índice en TARIFAS_12: el Kit, al 10%

  // El socio del ?ref: la última pantalla lo nombra y abre su WhatsApp. Sin ref,
  // o si la consulta falla, la pantalla queda genérica.
  const [socio, setSocio] = useState<{ nombre: string; whatsapp: string | null } | null>(null);
  // Sin socio —visita orgánica, o un ?ref que no se encuentra— la conversación es
  // con el equipo, por el WhatsApp Business (Director, 1 oct 2026). Hasta ese día
  // la pantalla quedaba sin botón y quien la abría solo no tenía a quién escribir.
  // Se espera a la consulta: con ?ref, el equipo no asoma mientras carga el socio.
  const [sinSocio, setSinSocio] = useState(false);
  useEffect(() => {
    let ref: string | null = null;
    try { ref = new URL(window.location.href).searchParams.get('ref'); } catch { /* sin ref */ }
    // Desde el menú se llega sin ?ref (1 oct 2026): quien entró antes por el enlace
    // de un socio lo trae guardado (tracking.js lo deja en `constructor_ref`, y el
    // catálogo ya lo lee así). Esa persona ve a su socio, no al equipo.
    if (!ref) { try { ref = localStorage.getItem('constructor_ref'); } catch { /* sin almacenamiento */ } }
    if (!ref) { setSinSocio(true); return; }
    setRefSocio(ref);
    fetch(`/api/constructor/${encodeURIComponent(ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.nombre) setSocio({ nombre: d.nombre, whatsapp: d.whatsapp ?? null }); else setSinSocio(true); })
      .catch(() => setSinSocio(true));
  }, []);
  const waEquipo = `https://wa.me/${WHATSAPP_EQUIPO}?text=${encodeURIComponent('Hola, acabo de ver la presentación de CreaTuActivo.')}`;

  // ── Hasta dónde llegó (1 oct 2026) ─────────────────────────────────────────
  // De quien abría la presentación solo se sabía la página: no si pasó de la
  // primera pantalla ni si llegó al botón del final. Se guarda la pantalla más
  // lejana, si llegó al final y si tocó el WhatsApp (/api/track/presentacion).
  // ⚠️ Cada escritura dispara un webhook: solo en hitos, nunca en cada pantalla.
  // ⚠️ En FILA, una después de otra: la ruta lee la ficha y escribe encima, así
  // que dos peticiones cruzadas se pisan. Probado en producción el 1 oct 2026:
  // pasando rápido, la de la pantalla 7 llegó después de la de la 10 y la ficha
  // quedó «completa» en la pantalla 7.
  const colaAvance = useRef<Promise<unknown>>(Promise.resolve());
  const reportarAvance = useCallback((datos: {
    pantalla?: number; completa?: boolean; whatsapp?: boolean; en_vivo?: boolean;
    video?: { v: string; seg: number; dur: number; enlace?: boolean }; paso?: { pantalla: number; beat: number };
  }) => {
    const fingerprint = (window as any).FrameworkIAA?.fingerprint;
    if (!fingerprint) return;
    if (new URLSearchParams(window.location.search).get('kiosk') === '1') return;
    colaAvance.current = colaAvance.current.then(() => fetch('/api/track/presentacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint, ...datos }),
      keepalive: true,
    })).catch(() => {});
  }, []);
  const primerNombre = socio?.nombre?.trim().split(/\s+/)[0] ?? null;
  const waSocio = socio?.whatsapp && primerNombre
    ? `https://wa.me/${socio.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${primerNombre}, acabo de ver la presentación de CreaTuActivo.`)}`
    : null;

  // EL NOMBRE DEL PROSPECTO, EN VIVO (Director, 30 sep 2026). El socio presenta a
  // su nombre y, en la última pantalla, toca su nombre y escribe el de la persona
  // que tiene enfrente: «en su caso, esta pantalla dirá el suyo». Es la prueba en
  // vivo de la personalización de Queswa.app. Solo cambia lo que se VE: el
  // botón queda sin enlace mientras se muestra otro nombre, porque abriría el
  // WhatsApp del socio con el nombre del prospecto. Al salir de la pantalla vuelve
  // el nombre del socio.
  const [nombreDemo, setNombreDemo] = useState<string | null>(null);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreEscrito, setNombreEscrito] = useState('');
  const nombreVisible = nombreDemo ?? primerNombre;
  useEffect(() => {
    if (slide !== TOTAL_SLIDES) { setNombreDemo(null); setEditandoNombre(false); }
  }, [slide]);
  // Quien escribe un nombre en la demo es el socio presentando: esa ficha deja de
  // generarle avisos (`dispositivo_del_socio`), o cada reunión le sonaría a él.
  const demoReportada = useRef(false);
  const confirmarNombre = (valor: string) => {
    const v = valor.trim();
    const otro = !!v && v.toLowerCase() !== (primerNombre ?? '').toLowerCase();
    setNombreDemo(otro ? v : null);
    setEditandoNombre(false);
    if (otro && !demoReportada.current) { demoReportada.current = true; reportarAvance({ en_vivo: true }); }
  };

  // Los hitos: un tercio, dos tercios y el final. Un salto (teclado, retroceso)
  // reporta el hito más alto que alcanzó, una sola vez cada uno.
  // EL PASO MÁS LEJANO, BEAT INCLUIDO (6 nov 2026): los hitos no ven dentro de la
  // pantalla 5 (10 beats) ni de la 8 (3), y entre los hitos 4 y 6 era donde se iba
  // la gente. Viaja con cada hito y, si avanzó desde el último envío, al salir de la
  // página o cambiar de app (en el teléfono `pagehide` no siempre llega). Una o dos
  // escrituras más por visita, y el campo no dispara avisos en el Dashboard.
  // Lo lee scripts/medir-avance-presentacion.mjs.
  const pasoMax = useRef({ pantalla: 0, beat: 0 });
  const pasoEnviado = useRef({ pantalla: 0, beat: -1 });
  const pasoDespues = (a: { pantalla: number; beat: number }, b: { pantalla: number; beat: number }) =>
    a.pantalla > b.pantalla || (a.pantalla === b.pantalla && a.beat > b.beat);
  useEffect(() => {
    const p = { pantalla: slide, beat };
    if (pasoDespues(p, pasoMax.current)) pasoMax.current = p;
  }, [slide, beat]);
  const enviarPaso = useCallback(() => {
    if (!pasoMax.current.pantalla || !pasoDespues(pasoMax.current, pasoEnviado.current)) return;
    pasoEnviado.current = { ...pasoMax.current };
    reportarAvance({ paso: pasoEnviado.current });
  }, [reportarAvance]);
  useEffect(() => {
    const alOcultar = () => { if (document.visibilityState === 'hidden') enviarPaso(); };
    window.addEventListener('pagehide', enviarPaso);
    document.addEventListener('visibilitychange', alOcultar);
    return () => {
      window.removeEventListener('pagehide', enviarPaso);
      document.removeEventListener('visibilitychange', alOcultar);
    };
  }, [enviarPaso]);

  const hitosReportados = useRef(new Set<number>());
  useEffect(() => {
    const hito = [...HITOS_PRESENTACION].reverse().find((h) => slide >= h);
    if (!hito || hitosReportados.current.has(hito)) return;
    hitosReportados.current.add(hito);
    const paso = pasoDespues(pasoMax.current, pasoEnviado.current) ? { ...pasoMax.current } : undefined;
    if (paso) pasoEnviado.current = paso;
    reportarAvance({ pantalla: slide, completa: slide === TOTAL_SLIDES || undefined, paso });
  }, [slide, reportarAvance]);

  const tarifa = TARIFAS_12[tarifa12];
  const monto = (cop: number) => moneda === 'COP'
    ? <>${enCOP(cop)}<span className="u"> COP</span></>
    : <>${enUSD(Math.round(cop / TRM))}<span className="u"> USD</span></>;
  const montoCorto = (cop: number) =>
    moneda === 'COP' ? `$${enCOP(cop)}` : `$${enUSD(Math.round(cop / TRM))}`;

  // Bola de nieve: el thumb crece con el nivel (la metáfora, literal).

  // ¿La persona bajó a leer la guía? Con el deck casi fuera de vista, el teclado
  // deja de pasar diapositivas (las flechas y la barra espaciadora vuelven a
  // desplazar la página) y los videos se pausan.
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [leyendoGuia, setLeyendoGuia] = useState(false);
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setLeyendoGuia(entry.intersectionRatio < 0.25),
      { threshold: [0, 0.25, 0.5] }
    );
    observer.observe(deck);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!leyendoGuia) return;
    deckRef.current?.querySelectorAll('video').forEach((v) => v.pause());
  }, [leyendoGuia]);

  // LA GUÍA SE ABRE EN LA ÚLTIMA PANTALLA (Director, 13 oct 2026). En la portada,
  // el gesto natural en un teléfono es deslizar hacia arriba, y eso sacaba el deck
  // de la vista y mostraba la guía: la persona creía que la presentación era ese
  // texto (le pasó al propio Director, que sabe que el deck se pasa de lado). Por
  // eso la página no baja hasta la última pantalla, cuando ya se sabe que el deck es
  // lateral; ahí la guía queda debajo, con su señal (.pd-a-la-guia).
  // ⚠️ La guía NO se quita del HTML ni se oculta: Google la lee con un viewport
  // tan alto como la página, y es lo que la posiciona. Solo se bloquea el
  // desplazamiento (html:has(.pd-root[data-guia="cerrada"]) en el CSS).
  // También cierra el otro escape: en las pantallas que se desplazan por dentro
  // (el producto, los números), el final del desplazamiento seguía hacia la página.
  // Si la página llega YA desplazada —un enlace de Google con #:~:text=, la
  // posición que el navegador restaura al recargar, el tabulador que enfoca el
  // botón de la guía—, la persona vino a leer: la guía queda abierta.
  const [guiaPorEnlace, setGuiaPorEnlace] = useState(false);
  const guiaAbierta = slide === TOTAL_SLIDES || guiaPorEnlace;
  const guiaBloqueada = useRef(true);
  // ¿La persona ya tocó la pantalla, giró la rueda o usó el teclado? Un
  // desplazamiento que llega DESPUÉS de un gesto es suyo; uno que llega antes lo
  // hizo el navegador (el enlace de Google con #:~:text=, la posición que
  // restaura al recargar).
  const huboGesto = useRef(false);
  useEffect(() => {
    if (guiaAbierta) { guiaBloqueada.current = false; return; }
    // Volvió a una pantalla anterior con la página a medio bajar: sube al deck.
    if (!guiaBloqueada.current) window.scrollTo(0, 0);
    guiaBloqueada.current = true;
  }, [guiaAbierta]);
  useEffect(() => {
    // LA GUÍA NO SE ABRE CON EL DEDO (Director, 18 oct 2026: «las personas en la
    // primera diapositiva tienden a hacer scroll hacia abajo, perdiéndose la
    // presentación»). Hasta este día, CUALQUIER desplazamiento con la guía
    // bloqueada la abría para siempre: si un navegador dejaba pasar el gesto
    // (sin soporte de :has, un WebView viejo), el dedo en la portada era justo
    // lo que el bloqueo existe para impedir. Ahora el desplazamiento de la
    // persona se devuelve al deck, y solo el del navegador abre la guía.
    // ⚠️ No se fija el body con position: fixed: el documento quedaría del alto
    // de la pantalla y Google, que renderiza con una ventana tan alta como la
    // página, dejaría de ver la guía entera.
    const marcar = () => { huboGesto.current = true; };
    const opciones: AddEventListenerOptions = { passive: true, capture: true };
    const gestos = ['touchstart', 'wheel', 'keydown', 'pointerdown'] as const;
    gestos.forEach((g) => window.addEventListener(g, marcar, opciones));
    const revisar = () => {
      if (!guiaBloqueada.current || window.scrollY <= 0) return;
      // El de la persona vuelve entero, sin umbral: 39 px corridos ya le cortan
      // el HUD. El del navegador abre la guía solo pasados 40 px.
      if (huboGesto.current) window.scrollTo(0, 0);
      else if (window.scrollY > 40) setGuiaPorEnlace(true);
    };
    revisar();
    window.addEventListener('scroll', revisar, { passive: true });
    // El tabulador que llega a la guía (un enlace, el botón de Queswa): vino a
    // leer. Se desbloquea en el acto, antes del desplazamiento que provoca el
    // foco, para que ese desplazamiento no se devuelva al deck.
    const guia = document.getElementById('guia-plan-servilleta');
    const alEnfocar = () => {
      if (!guiaBloqueada.current) return;
      guiaBloqueada.current = false;
      setGuiaPorEnlace(true);
    };
    guia?.addEventListener('focusin', alEnfocar);
    return () => {
      gestos.forEach((g) => window.removeEventListener(g, marcar, opciones));
      window.removeEventListener('scroll', revisar);
      guia?.removeEventListener('focusin', alEnfocar);
    };
  }, []);
  const irALaGuia = (e: React.MouseEvent) => {
    e.preventDefault();
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('guia-plan-servilleta')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchLastX = useRef(0);
  const touchLastY = useRef(0);
  const swipeIgnore = useRef(false);

  // ⚠️ Las dos transiciones se calculan con los valores actuales y NO anidando un
  // setSlide dentro del updater de setBeat: un updater debe ser puro, React lo
  // ejecuta dos veces en desarrollo y el efecto colateral se pierde — con esa
  // versión el deck no pasaba de la primera pantalla (bug real, 23 sep 2026).
  const avanzar = useCallback(() => {
    if (beat < beatsOf(slide) - 1) { setBeat(beat + 1); return; }
    const sig = siguienteDe(slide);
    if (sig) { setSlide(sig); setBeat(0); }
  }, [slide, beat]);

  const retroceder = useCallback(() => {
    if (beat > 0) { setBeat(beat - 1); return; }
    const destino = anteriorDe(slide);
    if (destino) {
      setSlide(destino);
      // El retroceso aterriza en el ÚLTIMO beat de la pantalla destino: quien
      // vuelve quiere ver de nuevo el remate, no empezar esa pantalla otra vez.
      setBeat(beatsOf(destino) - 1);
    }
  }, [slide, beat]);

  const irA = useCallback((n: number) => {
    setSlide(n);
    setBeat(0);
  }, []);

  // LA PRESENTACIÓN EN VIDEO (Director, 30 oct 2026): el botón de la pantalla 1
  // rueda el deck entero en voz (VIDEO_PLAN_SERVILLETA, 3 min). El socio elige si
  // lo rueda o si presenta él, igual que con el «Cómo funciona» que vivió en la
  // pantalla 5 del 13 al 30 oct 2026 y salió de ahí. Al terminar, el deck salta a
  // la 9: el video cierra con «el siguiente paso es una conversación con quien le
  // compartió este video», y la 9 pone el nombre y el WhatsApp de ese socio. Si se
  // cierra antes, se queda en la 1. Va en ventana, no en la diapositiva, para que
  // la pantalla siga igual para quien presenta. Visto al 80 %, Queswa no le vuelve
  // a ofrecer el «Cómo funciona»: el video ya lo contó.
  const [videoPresentacion, setVideoPresentacion] = useState(false);
  // En qué punto va el ciclo de «La diferencia» (CicloPropiedad lo avisa): enciende sus números.
  const [etapaDif, setEtapaDif] = useState(-1);
  // EL VIDEO COMO ACCIÓN PRINCIPAL PARA QUIEN LA VE SOLO (6 nov 2026, Director): el
  // deck se apoya en la voz del socio (la 3 solo nombra los sectores, la definición
  // con Uber va hablada, «Su día» va sin voz), pero quien la ve en su teléfono con el
  // enlace de un socio casi siempre la ve sin él: en los 60 días hasta el 5 nov, unas
  // 22 fichas pasaron el deck, y en los últimos 30 solo 2 empezaron el video. Con
  // socio, en el celular y la tableta el botón crece y es lo que se ve primero. En el computador no
  // cambia: ahí presenta el socio, por Meet o en el modo vertical (kiosco), que va
  // en computador. El texto del botón es el mismo. Se mide comparando cuántos
  // empiezan el video antes y después del 6 nov (medir-video-presentacion.mjs).
  const [videoPrincipal, setVideoPrincipal] = useState(false);
  useEffect(() => {
    if (!refSocio || isKiosk) { setVideoPrincipal(false); return; }
    const nav = navigator as Navigator & { userAgentData?: { mobile?: boolean } };
    setVideoPrincipal(dispositivoDe(nav.userAgent, nav.userAgentData?.mobile) !== 'computador');
  }, [refSocio, isKiosk]);
  const alTerminarVideoPresentacion = () => {
    // Se lee antes de cerrar: al cerrarse la ventana la marca se limpia.
    const porEnlace = videoPorEnlace.current;
    setVideoPresentacion(false);
    irA(TOTAL_SLIDES);
    // QUIEN LLEGÓ POR EL ENLACE DIRECTO TERMINA EN QUESWA (13 nov 2026, Director):
    // viene de una publicación, casi siempre sin haber hablado con el socio, y el
    // paso que sigue en el funnel es la conversación con Queswa. El chat se abre
    // con el cursor listo, sobre la última pantalla, que conserva el nombre y el
    // WhatsApp del socio para cuando lo cierre. En /servilleta el chat es el web en
    // todos los dispositivos (DeferredOrb), así que no hay salto a otra app. Con el
    // botón de la pantalla 1 no se abre: ahí suele presentar el socio en vivo.
    if (porEnlace) {
      setTimeout(() => window.dispatchEvent(new CustomEvent('open-queswa', { detail: { origen: 'video', enfocar: true } })), 350);
    }
  };
  // EL VIDEO DIRECTO DESDE UN ENLACE (12 nov 2026, Director): `?video=1` —y el
  // enlace corto `/{slug}/video`— abre esta misma ventana al cargar, para quien
  // llega de una publicación a «ver el video». El navegador no deja arrancar con
  // voz un video que la persona no ha tocado, así que la ventana espera con un
  // solo botón encima; si el navegador sí lo deja arrancar (computador con
  // permiso), el botón se quita solo. Es la misma ventana del botón de la
  // pantalla 1: la medición y el salto a la última pantalla no cambian.
  const [videoEsperaToque, setVideoEsperaToque] = useState(false);
  const videoPresentacionRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('video') !== '1' || q.get('kiosk') === '1') return;
    videoPorEnlace.current = true;
    setVideoEsperaToque(true);
    setVideoPresentacion(true);
  }, []);
  useEffect(() => {
    if (videoPresentacion && videoEsperaToque) {
      videoPresentacionRef.current?.play().catch(() => { /* espera el toque */ });
    }
  }, [videoPresentacion, videoEsperaToque]);
  // Al cerrar la ventana, el botón de la pantalla 1 vuelve a arrancar con voz, y
  // lo que se vea después ya no cuenta como llegado por el enlace.
  useEffect(() => {
    if (!videoPresentacion) return;
    return () => { setVideoEsperaToque(false); videoPorEnlace.current = false; };
  }, [videoPresentacion]);
  // HASTA DÓNDE SE VE EL VIDEO (2 nov 2026, fase 2 de la auditoría visual): el segundo
  // más lejano y la versión, para comparar la retención de una versión con la de la
  // siguiente. Se reporta al empezar, al cruzar el 25, 50, 75 y 95 %, al cerrar y al
  // salir de la página; la ruta guarda el máximo, y el campo no dispara avisos.
  const videoVisto = useRef({ seg: 0, dur: 0, enviado: -1, cuartos: 0 });
  // ¿Llegó por el enlace directo (?video=1)? Viaja con el reporte, para separar su
  // tráfico del botón de la pantalla 1 (medir-enlace-video.mjs).
  const videoPorEnlace = useRef(false);
  const versionVideo = VIDEO_PLAN_SERVILLETA.match(/-(v\d+)\.mp4$/)?.[1] ?? 'v0';
  const enviarVideoVisto = useCallback(() => {
    const r = videoVisto.current;
    if (!r.dur || r.seg <= r.enviado) return;
    r.enviado = r.seg;
    reportarAvance({ video: { v: versionVideo, seg: r.seg, dur: Math.round(r.dur), ...(videoPorEnlace.current ? { enlace: true } : {}) } });
  }, [reportarAvance, versionVideo]);
  useEffect(() => {
    if (!videoPresentacion) return;
    videoVisto.current = { seg: 0, dur: 0, enviado: -1, cuartos: 0 };
    window.addEventListener('pagehide', enviarVideoVisto);
    return () => { window.removeEventListener('pagehide', enviarVideoVisto); enviarVideoVisto(); };
  }, [videoPresentacion, enviarVideoVisto]);

  // LA HERRAMIENTA POR DENTRO (Director, 18 oct 2026): queswa.app en una ventana del
  // tamaño de un celular sobre el deck. Desde el 2 nov 2026 el botón vive en la pieza
  // de la herramienta y abre la portada, donde Queswa acompaña al socio y le marca la
  // ruta; hasta ese día vivía en la máquina de ventas y abría en Enlaces, que sigue a
  // un toque en la barra de abajo. El socio ya tiene la sesión abierta en su
  // navegador. En el teléfono (o si el navegador no abre ventanas) cae a pestaña
  // nueva. ⚠️ Nombre fijo de ventana: un segundo toque la reutiliza en vez de abrir otra.
  const abrirQueswaAppPorDentro = () => {
    window.open(
      'https://queswa.app/',
      'queswa-app-por-dentro',
      'popup=yes,width=412,height=780,noopener',
    );
  };

  // ── Los videos del deck (10 oct 2026) ──────────────────────────────────────
  // Cada <video> declara su beat en data-beat="pantalla-beat". Solo el activo
  // reproduce; el abandonado se pausa y rebobina — el control central de media
  // de la servilleta, adaptado. Con movimiento reducido del sistema, el video no
  // arranca y queda el poster.
  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const activo = `${slide}-${beat}`;
    document.querySelectorAll<HTMLVideoElement>('video[data-beat]').forEach((v) => {
      if (v.dataset.beat === activo && !reduce) {
        v.play().catch(() => { /* autoplay bloqueado: queda el poster */ });
      } else {
        v.pause();
        try { v.currentTime = 0; } catch { /* sin metadata todavía */ }
      }
    });
  }, [slide, beat]);

  // Enlace a una pantalla (2 oct 2026): `?pantalla=8` abre en la de los números
  // (fue la 9 hasta el 18 oct 2026, cuando salió «Qué hace usted»).
  // Queswa se lo da al socio que quiere estudiar Los 12 Niveles y mover el
  // porcentaje él mismo; sin el parámetro se entra por la portada, como siempre.
  useEffect(() => {
    try {
      const p = Number(new URL(window.location.href).searchParams.get('pantalla'));
      if (Number.isInteger(p) && p >= 1 && p <= TOTAL_SLIDES) {
        // Un enlace viejo a la 4 («Dos sectores», retirada) abre en la oportunidad.
        if (p === 4) { irA(3); return; }
        irA(p);
        if (BEAT_DEL_ENLACE[p]) setBeat(BEAT_DEL_ENLACE[p]);
      }
    } catch { /* sin parámetro */ }
  }, [irA]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // ¿Esta instancia es el iframe del modo vertical? La clase va en <html> porque
  // la guía es hermana del deck, no hija, y también tiene que ocultarse.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('kiosk') !== '1') return;
    setIsKiosk(true);
    document.documentElement.classList.add('kiosk');
    return () => document.documentElement.classList.remove('kiosk');
  }, []);

  // El marco de 412×732 escala para llenar la pantalla sin deformarse.
  useEffect(() => {
    if (!verticalMode) return;
    const W = 412, H = 732;
    const calc = () => setVScale(Math.min(window.innerHeight / H, window.innerWidth / W));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [verticalMode]);

  // El modo vertical es también pantalla completa NATIVA del marco; salir de ella
  // (Esc del navegador) cierra el modo, y cerrar con ✕ sale de los dos. Los
  // videos de afuera se pausan: el que se presenta es el de adentro.
  useEffect(() => {
    if (!verticalMode) return;
    deckRef.current?.querySelectorAll('video').forEach((v) => v.pause());
    vOverlayRef.current?.requestFullscreen?.().catch(() => {});
    const onFs = () => { if (!document.fullscreenElement) setVerticalMode(false); };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setVerticalMode(false); };
    document.addEventListener('fullscreenchange', onFs);
    window.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      window.removeEventListener('keydown', onEsc);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [verticalMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
      // Con la ficha de una línea abierta, las flechas pasan a la línea vecina y Esc
      // la cierra: el deck no se mueve por debajo.
      if (linea !== null) {
        if (e.key === 'Escape') setLinea(null);
        else if (e.key === 'ArrowRight') setLinea((linea + 1) % CATEGORIAS.length);
        else if (e.key === 'ArrowLeft') setLinea((linea + CATEGORIAS.length - 1) % CATEGORIAS.length);
        return;
      }
      // Con el video de la presentación abierto, el teclado no mueve el deck: Esc lo
      // cierra y la barra espaciadora queda para el reproductor.
      if (videoPresentacion) { if (e.key === 'Escape') setVideoPresentacion(false); return; }
      if (leyendoGuia || verticalMode) return;
      // En la tabla del Bono GEN5, los números encienden una generación (1-5) o la suma (0).
      if (slide === 8 && beat === 2 && /^[0-5]$/.test(e.key)) {
        e.preventDefault();
        if (e.key === '0') encenderSumaGen5();
        else setGen5Activa((g) => (g === Number(e.key) - 1 ? null : Number(e.key) - 1));
        return;
      }
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); avanzar(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); retroceder(); }
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      else if (e.key === 'Home') irA(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [avanzar, retroceder, toggleFullscreen, irA, linea, leyendoGuia, verticalMode, videoPresentacion, slide, beat, encenderSumaGen5]);

  // El clic avanza, salvo sobre controles. La lista es amplia a propósito: un
  // clic dentro del simulador que cambiara de pantalla sería un caos en vivo.
  const onClickSlide = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('button, a, input, label, .panel, .no-advance')) return;
    avanzar();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchLastX.current = e.touches[0].clientX;
    touchLastY.current = e.touches[0].clientY;
    // SOLO los <input>: arrastrar el thumb de un slider es horizontal legítimo.
    swipeIgnore.current = !!(e.target as HTMLElement).closest('input');
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchLastX.current = e.touches[0].clientX;
    touchLastY.current = e.touches[0].clientY;
  };

  const evaluarSwipe = (endX: number, endY: number) => {
    if (swipeIgnore.current) { swipeIgnore.current = false; return; }
    // La ventana del video vive dentro del deck: un gesto sobre ella no pasa
    // diapositivas por debajo.
    if (videoPresentacion) return;
    const dx = touchStartX.current - endX;
    const dy = touchStartY.current - endY;
    // Guard de eje: un scroll vertical que derive en X no debe navegar.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx > 0) avanzar(); else retroceder();
    }
  };

  const nivelSel = PROYECCION_12[nivel12 - 1];
  const totalDistribuidores = Math.pow(2, nivelSel.level + 1) - 2;

  return (
    <>
      {/* El CSS va por dangerouslySetInnerHTML y NO como hijo de <style> (30 sep 2026):
         como hijo, React lo escapa en el servidor (' → &#x27;, > → &gt;) y dentro de
         <style> el navegador no decodifica entidades, así que el CSS llegaba roto
         y la hidratación fallaba en toda la página. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pd-root {
          --pd-gold: var(--color-brand, #C5A059);
          --pd-data: var(--color-data, #22D3EE);
          --pd-bg: var(--color-bg-primary, #0F1115);
          --pd-elev: var(--color-bg-elevated, #15171C);
          --pd-text: var(--color-text-primary, #E0DFDB);
          --pd-muted: var(--color-text-muted, #878681);
          /* Primer piso de la página (10 oct 2026): antes era una capa fija; ahora
             ocupa la primera pantalla y debajo va la guía (GuiaPlanServilleta). */
          position: relative; width: 100%; height: 100vh; height: 100dvh;
          background: var(--pd-bg);
          color: var(--pd-text);
          font-family: var(--font-sans);
          overflow: hidden;
          touch-action: pan-y;
        }
        .pd-root * { box-sizing: border-box; }

        /* ── HUD ─────────────────────────────────────────────────────────── */
        .pd-hud {
          position: absolute; top: 0; left: 0; right: 0; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(16px, 4vw, 40px);
          z-index: 40; pointer-events: none;
        }
        .pd-brand {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.28em;
          color: var(--pd-muted); text-transform: uppercase;
        }
        .pd-hud-right { display: flex; align-items: center; gap: 14px; pointer-events: auto; }
        .pd-dots { display: flex; gap: 7px; }
        .pd-dot {
          width: 7px; height: 7px; border-radius: 50%; padding: 0;
          border: 1px solid rgba(255,255,255,0.22); background: transparent;
          cursor: pointer; transition: all 0.25s;
        }
        .pd-dot.done { border-color: rgba(197,160,89,0.45); background: rgba(197,160,89,0.28); }
        .pd-dot.active { border-color: var(--pd-gold); background: var(--pd-gold); transform: scale(1.35); }
        .pd-fs {
          background: transparent; border: 1px solid rgba(255,255,255,0.14);
          color: var(--pd-muted); font-family: var(--font-mono); font-size: 0.6rem;
          letter-spacing: 0.18em; padding: 7px 11px; cursor: pointer; transition: all 0.25s;
        }
        .pd-fs:hover { color: var(--pd-gold); border-color: rgba(197,160,89,0.45); }
        .pd-fs-corto { display: none; }
        .pd-vertical { display: flex; align-items: center; padding: 6px 9px; }
        /* Dentro del kiosco no hay pantalla completa propia: la pone el marco. */
        .kiosk .pd-fs-principal { display: none; }
        /* El aviso de cookies lo muestra la página de afuera (mismo origen, misma
           decisión guardada); dentro del marco solo taparía la diapositiva. */
        .kiosk [data-cookie-banner] { display: none !important; }
        /* En el marco de 732px de alto alguna pantalla se pasa por poco: se puede
           desplazar, pero sin la barra dorada a la vista de Meet. */
        .kiosk, .kiosk * { scrollbar-width: none; }
        .kiosk ::-webkit-scrollbar { display: none; }
        /* Modo vertical: marco portrait centrado en negro, encima de todo. */
        .pd-vertical-overlay {
          position: fixed; inset: 0; z-index: 10000; background: #000;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .pd-vertical-marco { flex: none; transform-origin: center center; }
        .pd-vertical-marco iframe { width: 100%; height: 100%; border: 0; display: block; background: #0F1115; }
        .pd-vertical-salir {
          position: fixed; top: 16px; right: 16px; z-index: 10001;
          width: 44px; height: 44px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: rgba(8,9,12,0.8); border: 1px solid rgba(197,160,89,0.5);
          color: var(--color-brand, #C5A059); font-size: 20px; line-height: 1;
        }
        .pd-vertical-salir:hover { background: rgba(197,160,89,0.16); border-color: rgba(197,160,89,0.85); }
        .pd-counter {
          position: absolute; bottom: 14px; right: clamp(16px, 4vw, 40px);
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em;
          color: #3d4048; z-index: 40;
        }

        /* La guía se abre en la última pantalla (13 oct 2026): antes, la página no
           baja. Va desde el primer HTML, sin esperar a React, para que el primer
           gesto en la portada tampoco la descubra. Ver guiaAbierta en el código.
           ⚠️ SOLO en html, nunca en body: el body del sitio mide la pantalla
           (h-full), y con overflow hidden se vuelve su propio contenedor — un
           enlace directo a la guía la desplazaba dentro del body, fuera del alcance
           de la ventana, y la persona quedaba viendo la guía sin poder bajar. */
        html:has(.pd-root[data-guia="cerrada"]) { overflow: hidden; }

        /* La señal: discreta, por debajo del botón de WhatsApp en peso. */
        .pd-a-la-guia {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 2.2rem; padding: 6px 0; white-space: nowrap;
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em;
          color: var(--pd-muted); text-decoration: none;
          animation: pdGuiaEntra 0.6s ease 0.8s both;
          transition: color 0.25s;
        }
        .pd-a-la-guia:hover { color: var(--pd-gold); }
        .pd-a-la-guia .flecha { display: inline-block; font-size: 0.8rem; animation: pdGuiaFlecha 2.4s ease-in-out 1.4s infinite; }
        :fullscreen .pd-a-la-guia { display: none; }
        @keyframes pdGuiaEntra { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pdGuiaFlecha { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(3px); } }
        @media (prefers-reduced-motion: reduce) {
          .pd-a-la-guia, .pd-a-la-guia .flecha { animation: none; }
        }

        /* ── Pantallas ───────────────────────────────────────────────────── */
        /* margin:auto en el hijo centra cuando sobra espacio y NO recorta por
           arriba cuando falta — con justify-content: center, el contenido alto se
           salía de la pantalla por el borde superior y quedaba inalcanzable. */
        .pd-slide {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          padding: 74px clamp(20px, 6vw, 80px) 56px;
          opacity: 0; visibility: hidden; pointer-events: none;
          transition: opacity 0.5s ease;
          overflow-y: auto; cursor: pointer;
        }
        .pd-slide.on { opacity: 1; visibility: visible; pointer-events: auto; }
        .pd-wrap { width: 100%; max-width: 980px; margin: auto; }

        .pd-eyebrow {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.32em;
          color: var(--pd-data); text-transform: uppercase; margin: 0 0 1.6rem;
        }
        .pd-h2 {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.02em; line-height: 1.08;
          font-size: clamp(1.7rem, 4.6vw, 3.1rem); margin: 0 0 1.5rem;
          color: #FFFFFF;
        }
        .pd-p {
          font-size: clamp(1rem, 2.1vw, 1.32rem); line-height: 1.62;
          color: var(--color-text-body, #C8C7C2); margin: 0 0 1.1rem; max-width: 46ch;
        }
        /* Viñetas del deck (Director, 28 sep 2026): mismo cuerpo que .pd-p, marcador
           dorado sobrio. Nacieron para despiezar «Por qué ahora». */
        .pd-vinetas {
          list-style: none; margin: 0 0 1.1rem; padding: 0; max-width: 46ch;
        }
        .pd-vinetas li {
          font-size: clamp(1rem, 2.1vw, 1.32rem); line-height: 1.62;
          color: var(--color-text-body, #C8C7C2);
          position: relative; padding-left: 1.15rem;
        }
        .pd-vinetas li::before {
          content: '·'; position: absolute; left: 0;
          color: var(--pd-gold); font-weight: 700;
        }
        .pd-gold { color: var(--pd-gold); }
        /* La bisagra: la línea más grande de la pantalla después del titular.
           Es el giro del deck entero, así que pesa como tal. */
        .pd-bisagra {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.5rem, 3.8vw, 2.5rem); line-height: 1.1; letter-spacing: 0.01em;
          color: var(--pd-gold); margin: 2rem 0 1.2rem;
        }
        .pd-kicker {
          font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.16em;
          color: var(--pd-muted); text-transform: uppercase; margin-top: 2rem;
        }

        /* ── 1 · El credo ────────────────────────────────────────────────── */
        /* Playfair se pide por su variable propia. Hasta el 8 oct 2026 era
           obligatorio: --font-serif se declara en :root y --font-playfair vivía en
           el <body>, así que el token llegaba vacío y el titular caía a Inter. Hoy
           las variables de next/font están en <html> y var(--font-serif) también
           sirve; esto se deja como está porque funciona igual. */
        .pd-credo .pd-credo-titulo, .pd-credo .pd-credo-linea {
          font-family: var(--font-playfair), Georgia, serif; font-weight: 400;
          font-size: clamp(1.55rem, 4.2vw, 3rem); line-height: 1.3;
          margin: 0 0 1.4rem; color: #FFFFFF; max-width: 22ch;
        }
        .pd-credo .segunda { color: var(--pd-gold); max-width: 26ch; }
        .pd-credo-rule {
          width: 56px; height: 1px; background: var(--pd-gold); margin: 2.4rem 0 1.2rem;
        }

        /* ── 5 · La propuesta y la oscilación ───────────────────────────────────────────── */
        .pd-beat { position: absolute; inset: 0; display: flex; flex-direction: column;
          padding: 74px clamp(20px, 6vw, 80px) 56px; overflow-y: auto;
          opacity: 0; visibility: hidden; transition: opacity 0.45s ease; }
        .pd-beat > * { margin-block: auto; }
        .pd-beat.on { opacity: 1; visibility: visible; }
        .pd-demo {
          margin-top: 1.6rem; background: transparent; border: 1px solid var(--pd-gold);
          color: var(--pd-gold); font-family: var(--font-mono); font-size: 0.68rem;
          letter-spacing: 0.2em; padding: 13px 22px; cursor: pointer; transition: all 0.25s;
        }
        .pd-demo:hover { background: var(--pd-gold); color: #0F1115; }

        /* ── 5 · Las tarjetas (Director, 7 nov 2026) ─────────────────────────
           Los tres elementos en Queswa.app y las dos acciones: una idea por
           diapositiva, título corto y tarjetas con título y subtítulo cortos. El
           borde es el vidrio neutro de la marca; el oro, solo en hover. */
        .pd-tarjetas-wrap { width: 100%; max-width: 1080px; margin: auto; text-align: center; }
        .pd-tarjetas-wrap .pd-eyebrow { text-align: center; margin-bottom: 1rem; }
        .pd-tarjetas-titulo {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.45rem, 3.8vw, 2.7rem); line-height: 1.1; letter-spacing: 0.01em;
          color: #FFFFFF; margin: 0 auto clamp(1.6rem, 5vh, 3rem); text-wrap: balance;
        }
        .pd-tarjetas, .pd-flujo {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); text-align: left;
        }
        .pd-tarjetas { gap: clamp(12px, 2vw, 24px); }
        .pd-tarjeta {
          display: flex; flex-direction: column; flex: 1;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: clamp(18px, 2.4vw, 30px);
          transition: border-color 0.3s ease;
        }
        .pd-tarjeta:hover { border-color: rgba(197,160,89,0.45); }
        .pd-tarjeta-icono { display: block; color: var(--color-titanium, #94A3B8); margin-bottom: 1.1rem; }
        .pd-tarjeta--queswa-icono .pd-tarjeta-icono { color: var(--pd-data); }
        .pd-tarjeta-rotulo {
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.24em;
          text-transform: uppercase; color: var(--color-titanium, #94A3B8); margin: 0 0 0.9rem;
        }
        .pd-tarjeta-titulo {
          font-family: var(--font-sans); font-weight: 700; color: #FFFFFF;
          font-size: clamp(1.05rem, 1.9vw, 1.45rem); line-height: 1.2; margin: 0 0 0.55rem;
        }
        .pd-tarjeta-sub {
          color: var(--color-text-body, #C8C7C2); font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          line-height: 1.5; margin: 0;
        }
        .pd-demo.pd-demo--tarjeta {
          margin-top: auto; align-self: flex-start; padding: 10px 14px;
          font-size: 0.6rem; letter-spacing: 0.16em;
        }
        .pd-tarjeta-sub:has(+ .pd-demo--tarjeta) { padding-bottom: 1.3rem; }
        /* Entran una tras otra: el ritmo de tres, sin pedirle un toque a nadie. */
        .pd-beat.on .pd-tarjetas > *, .pd-beat.on .pd-flujo > * { animation: pdEntra 0.6s ease-out both; }
        .pd-beat.on .pd-tarjetas > :nth-child(1), .pd-beat.on .pd-flujo > :nth-child(1) { animation-delay: 0.15s; }
        .pd-beat.on .pd-tarjetas > :nth-child(2), .pd-beat.on .pd-flujo > :nth-child(2) { animation-delay: 0.85s; }
        .pd-beat.on .pd-tarjetas > :nth-child(3), .pd-beat.on .pd-flujo > :nth-child(3) { animation-delay: 1.55s; }

        /* Las dos acciones. La del centro es el trabajo que no hace usted: carbón
           elevado y el cian de «Queswa en línea». Una luz recorre el flujo
           (Compartir → Queswa → Recibir); cuando llega al centro, el halo late, y
           cuando llega a Recibir, el borde se enciende en oro: ahí está el premio. */
        .pd-flujo { --hueco: clamp(30px, 4vw, 56px); gap: var(--hueco); }
        .pd-flujo-paso { position: relative; display: flex; }
        .pd-tarjeta--queswa {
          background: #15171C; border-color: rgba(34,211,238,0.4);
          box-shadow: 0 0 34px rgba(34,211,238,0.08);
        }
        .pd-tarjeta--queswa .pd-tarjeta-rotulo { color: var(--pd-data); }
        .pd-luz {
          position: absolute; top: 50%; left: calc(-1 * var(--hueco)); width: var(--hueco);
          height: 1px; background: rgba(197,160,89,0.35);
        }
        .pd-luz::before {
          content: ''; position: absolute; right: 1px; top: -3px; width: 7px; height: 7px;
          border-top: 1px solid rgba(197,160,89,0.6); border-right: 1px solid rgba(197,160,89,0.6);
          transform: rotate(45deg);
        }
        .pd-luz::after {
          content: ''; position: absolute; top: -3px; left: 0; width: 7px; height: 7px;
          border-radius: 50%; background: #F1E3BE; opacity: 0;
          box-shadow: 0 0 10px 3px rgba(197,160,89,0.7);
        }
        .pd-beat.on .pd-luz--1::after { animation: pdLuz1 6s 2.4s infinite; }
        .pd-beat.on .pd-luz--2::after { animation: pdLuz2 6s 2.4s infinite; }
        .pd-beat.on .pd-tarjeta--queswa { animation: pdHalo 6s 2.4s infinite; }
        .pd-beat.on .pd-flujo-paso:nth-child(3) .pd-tarjeta { animation: pdLlega 6s 2.4s infinite; }
        @keyframes pdLuz1 {
          0% { left: 0; opacity: 0; } 3% { opacity: 1; }
          15% { left: calc(100% - 7px); opacity: 1; } 18%, 100% { left: calc(100% - 7px); opacity: 0; }
        }
        @keyframes pdLuz2 {
          0%, 38% { left: 0; opacity: 0; } 41% { opacity: 1; }
          53% { left: calc(100% - 7px); opacity: 1; } 56%, 100% { left: calc(100% - 7px); opacity: 0; }
        }
        @keyframes pdHalo {
          0%, 15% { box-shadow: 0 0 34px rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.4); }
          23% { box-shadow: 0 0 60px rgba(34,211,238,0.28); border-color: rgba(34,211,238,0.85); }
          40%, 100% { box-shadow: 0 0 34px rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.4); }
        }
        /* La campana de Recibir: suena cuando la luz llega y su «1» aparece la primera
           vez y se queda. Rojo de alerta del sistema: es el globo de una notificación. */
        .pd-flujo-paso .pd-tarjeta { position: relative; }
        .pd-campana { position: absolute; top: 14px; right: 16px; color: var(--pd-gold); line-height: 0; }
        .pd-campana svg { transform-origin: 50% 8%; }
        .pd-campana-n { position: absolute; top: -6px; right: -8px; min-width: 18px; height: 18px;
          padding: 0 5px; border-radius: 9px; background: #F43F5E; color: #FFFFFF;
          font-family: var(--font-sans); font-size: 0.68rem; font-weight: 700; line-height: 18px;
          text-align: center; box-shadow: 0 0 0 2px var(--pd-bg); }
        .pd-beat.on .pd-campana svg { animation: pdTimbre 6s 2.4s infinite; }
        .pd-beat.on .pd-campana-n { animation: pdGlobo 0.45s 5.8s both; }
        @keyframes pdTimbre {
          0%, 56% { transform: rotate(0); } 59% { transform: rotate(16deg); }
          62% { transform: rotate(-14deg); } 65% { transform: rotate(9deg); }
          68% { transform: rotate(-5deg); } 71%, 100% { transform: rotate(0); }
        }
        @keyframes pdGlobo { 0% { transform: scale(0); } 70% { transform: scale(1.25); } 100% { transform: scale(1); } }
        @keyframes pdLlega {
          0%, 53% { border-color: rgba(255,255,255,0.1); }
          60% { border-color: rgba(197,160,89,0.75); }
          80%, 100% { border-color: rgba(255,255,255,0.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-beat.on .pd-tarjetas > *, .pd-beat.on .pd-flujo > *,
          .pd-beat.on .pd-luz::after, .pd-beat.on .pd-tarjeta--queswa,
          .pd-beat.on .pd-flujo-paso:nth-child(3) .pd-tarjeta,
          .pd-beat.on .pd-campana svg, .pd-beat.on .pd-campana-n { animation: none; }
        }
        /* En el teléfono, una debajo de otra; en el flujo, la luz baja. */
        @media (max-width: 860px) and (min-height: 561px) {
          .pd-tarjetas, .pd-flujo { grid-template-columns: 1fr; }
          .pd-tarjetas { gap: 10px; }
          .pd-flujo { --hueco: 26px; }
          .pd-tarjeta { padding: 14px 16px; border-radius: 12px; }
          .pd-tarjetas .pd-tarjeta {
            display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 14px; align-items: start;
          }
          .pd-tarjetas .pd-tarjeta-icono { grid-row: span 2; margin: 2px 0 0; }
          .pd-tarjetas .pd-demo--tarjeta { grid-column: 2; margin-top: 0.7rem; }
          .pd-tarjeta-sub:has(+ .pd-demo--tarjeta) { padding-bottom: 0; }
          .pd-tarjeta-rotulo { margin-bottom: 0.4rem; }
          .pd-tarjeta-titulo { font-size: 1.05rem; margin-bottom: 0.3rem; }
          .pd-tarjeta-sub { font-size: 0.92rem; }
          .pd-tarjetas-titulo { font-size: clamp(1.3rem, 6vw, 1.8rem); margin-bottom: 1.2rem; }
          .pd-luz { top: calc(-1 * var(--hueco)); left: 50%; width: 1px; height: var(--hueco); }
          .pd-luz::before { right: auto; left: -3px; top: auto; bottom: 1px; transform: rotate(135deg); }
          .pd-luz::after { left: -3px; top: 0; }
          .pd-beat.on .pd-luz--1::after { animation-name: pdLuzV1; }
          .pd-beat.on .pd-luz--2::after { animation-name: pdLuzV2; }
        }
        @keyframes pdLuzV1 {
          0% { top: 0; opacity: 0; } 3% { opacity: 1; }
          15% { top: calc(100% - 7px); opacity: 1; } 18%, 100% { top: calc(100% - 7px); opacity: 0; }
        }
        @keyframes pdLuzV2 {
          0%, 38% { top: 0; opacity: 0; } 41% { opacity: 1; }
          53% { top: calc(100% - 7px); opacity: 1; } 56%, 100% { top: calc(100% - 7px); opacity: 0; }
        }
        /* Teléfono girado: las tres a lo ancho, más compactas. */
        @media (max-height: 560px) {
          .pd-tarjetas-wrap .pd-eyebrow { display: none; }
          .pd-tarjetas-titulo { font-size: 1.25rem; margin-bottom: 0.9rem; }
          .pd-tarjeta { padding: 12px 14px; }
          .pd-tarjeta-icono { margin-bottom: 0.5rem; }
          .pd-tarjeta-titulo { font-size: 0.98rem; }
          .pd-tarjeta-sub { font-size: 0.85rem; }
        }

        /* ⚠️ margin:auto en los cuatro lados y NO 0 auto: el cero pisaba el
           margin-block:auto con el que .pd-beat centra a su hijo, y este beat era el
           único que se quedaba pegado arriba con media pantalla vacía debajo. */
        .pd-remate { text-align: center; max-width: 760px; margin: auto; }

        .pd-remate .grande {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.6rem, 4.6vw, 3.1rem); line-height: 1.1;
          color: var(--pd-gold); margin: 2rem 0 1.5rem;
        }
        .pd-remate .pd-cierre-linea {
          margin: 0 auto 0.5rem; text-align: center; max-width: 42ch; text-wrap: balance;
        }
        .pd-remate .pd-cierre-linea:last-of-type { margin-bottom: 0; }
        /* La definición del activo es otra idea, no la segunda mitad del porcentaje. */
        .pd-remate .pd-activo-linea { margin-top: 1.4rem; }
        /* Con el ciclo dibujado (2 nov 2026): en el teléfono el ciclo va debajo del texto;
           en el computador, a su derecha. */
        .pd-remate.pd-con-ciclo { max-width: 1120px; display: grid; justify-items: center; gap: 1.4rem; }
        .pd-con-ciclo-texto { text-align: center; }
        .pd-con-ciclo-texto .pd-eyebrow { text-align: center; }
        .pd-ciclo { display: block; width: min(360px, 88vw); height: auto; overflow: visible; }
        .pd-remate p.grande.pd-grande-blanco { color: #FFFFFF; margin-top: 0; }
        .pd-remate .pd-linea-fuerte { font-size: clamp(1.08rem, 2.2vw, 1.5rem); font-weight: 600; line-height: 1.4; }
        .pd-remate .pd-activo-linea.pd-linea-fuerte { color: #FFFFFF; }
        /* Los 12 niveles en barras (9 nov 2026); el alto, en el JSX. */
        .pd-barras { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: clamp(3px, 0.8vw, 8px);
          height: clamp(96px, 17vh, 160px); margin: 0.4rem 0 1.1rem; }
        .pd-barra { display: grid; grid-template-rows: 1fr auto; gap: 6px; height: 100%; padding: 0;
          background: none; border: 0; cursor: pointer; }
        .pd-barra .c { position: relative; border-bottom: 1px solid rgba(255,255,255,0.14); }
        .pd-barra .b { position: absolute; left: 0; right: 0; bottom: 0; min-height: 2px; border-radius: 2px 2px 0 0;
          background: rgba(255,255,255,0.12); transition: background 0.3s ease; }
        .pd-barra.done .b { background: rgba(148,163,184,0.6); }
        .pd-barra.active .b { background: var(--pd-gold); }
        .pd-barra .l { font-family: var(--font-mono); font-size: 0.66rem; color: var(--pd-muted); text-align: center; }
        .pd-barra.active .l { color: var(--pd-gold); }
        .pd-barra:focus-visible { outline: 1px solid var(--pd-gold); outline-offset: 3px; }
        /* «La diferencia» (9 nov 2026): tres puntos numerados que se encienden con el ciclo. */
        .pd-dif-puntos { list-style: none; padding: 0; margin: 0 auto; max-width: 34rem; text-align: left;
          display: flex; flex-direction: column; gap: 0.85rem; }
        .pd-dif { display: grid; grid-template-columns: auto 1fr; column-gap: 0.9rem; align-items: baseline;
          opacity: 0.18; transition: opacity 0.5s ease; }
        .pd-dif .n { font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 0.08em; color: var(--pd-muted); }
        .pd-dif .t { font-family: var(--font-sans); font-weight: 700; font-size: clamp(1rem, 1.9vw, 1.3rem); color: #FFFFFF; line-height: 1.25; }
        .pd-dif .s { grid-column: 2; font-size: clamp(0.85rem, 1.4vw, 1rem); color: var(--pd-muted); line-height: 1.4; }
        .pd-dif.oro .t { color: var(--pd-gold); }
        .pd-dif.on { opacity: 1; }
        .pd-dif.on .n { color: var(--pd-gold); }
        .pd-dif.antes { opacity: 0.35; }
        .pd-dif-suma { margin: 1.1rem auto 0; max-width: 34rem; text-align: left; padding-top: 0.9rem;
          border-top: 1px solid rgba(255,255,255,0.1); font-family: var(--font-sans); font-weight: 700;
          font-size: clamp(1rem, 1.9vw, 1.3rem); color: #FFFFFF; opacity: 0.18; transition: opacity 0.6s ease; }
        .pd-dif-suma.on { opacity: 1; }
        /* En el computador y en el teléfono girado, dos columnas: apilado, el ciclo
           quedaba debajo del borde. */
        @media (min-width: 861px), (max-height: 560px) and (min-width: 600px) {
          .pd-remate.pd-con-ciclo { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); align-items: center; gap: 3rem; }
          .pd-con-ciclo-texto, .pd-con-ciclo-texto .pd-eyebrow { text-align: left; }
          .pd-con-ciclo-texto .pd-cierre-linea, .pd-con-ciclo-texto .pd-propuesta { margin-left: 0; text-align: left; }
          .pd-con-ciclo-texto .pd-dif-puntos, .pd-con-ciclo-texto .pd-dif-suma { margin-left: 0; }
          .pd-con-ciclo .grande.pd-grande-blanco { font-size: clamp(1.4rem, 3.3vw, 2.6rem); margin-bottom: 1.2rem; }
          .pd-ciclo { width: min(480px, 100%); }
        }
        @media (max-height: 560px) and (min-width: 600px) {
          .pd-remate.pd-con-ciclo { gap: 1.6rem; }
          .pd-con-ciclo .pd-eyebrow { margin-bottom: 0.8rem; }
          .pd-remate .pd-linea-fuerte { font-size: 1rem; }
          .pd-ciclo { width: min(330px, calc((100vh - 90px) * 1.56)); }
        }
        /* ── 6 · Producto ────────────────────────────────────────────────── */
        .pd-foto {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0.3;
        }
        /* La taza a la vista (9 nov 2026): la foto entera a la derecha y un velo de
           carbón que solo cubre el lado del texto. */
        .pd-foto--cafe {
          opacity: 1; background-image: url(/images/servilleta/producto-cafe-wide.webp);
          background-position: 72% center;
        }
        .pd-foto--cafe::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(15,17,21,0.97) 0%, rgba(15,17,21,0.9) 34%,
            rgba(15,17,21,0.35) 62%, rgba(15,17,21,0.1) 100%);
        }
        .pd-producto { display: grid; grid-template-columns: minmax(0, 520px);
          position: relative; z-index: 2; }
        /* El Ganoderma en tres hechos: la cifra grande y su porqué debajo. */
        .pd-gano { margin-top: 2.2rem; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 1.3rem; }
        .pd-gano-titulo { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em;
          color: var(--pd-data); text-transform: uppercase; margin: 0 0 1.2rem; }
        .pd-gano-datos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 2.4vw, 28px); }
        .pd-gano-dato .n { font-family: var(--font-sans); font-weight: 700; color: #FFFFFF;
          font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1; margin: 0 0 0.55rem; }
        .pd-gano-dato .t { font-size: 0.86rem; line-height: 1.45;
          color: var(--color-text-body, #C8C7C2); margin: 0; }
        .pd-gano-colores { display: flex; gap: 5px; margin-top: 0.7rem; }
        .pd-gano-colores i { width: 11px; height: 11px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25); }
        .pd-producto .pd-demo { margin-top: 2rem; }

        /* La ficha de cada línea: la imagen y lo que la hace valiosa. */
        .pd-modal.pd-linea { width: min(94vw, 1040px); max-width: none; max-height: 90vh;
          overflow-y: auto; background: var(--pd-elev); border: 1px solid rgba(255,255,255,0.1);
          padding: 20px 28px 28px; }
        .pd-linea .pd-close { top: 10px; right: 16px; }
        .pd-linea-tabs { display: flex; flex-wrap: wrap; gap: 6px 22px; margin: 0 40px 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.08); }
        .pd-linea-tabs button { background: transparent; border: none; cursor: pointer;
          padding: 8px 0 10px; margin-bottom: -1px; border-bottom: 1px solid transparent;
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.16em;
          color: var(--pd-muted); transition: color 0.2s, border-color 0.2s; }
        .pd-linea-tabs button:hover { color: var(--pd-text); }
        .pd-linea-tabs button.on { color: var(--pd-gold); border-bottom-color: var(--pd-gold); }
        .pd-linea-cuerpo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: clamp(20px, 3.5vw, 40px); align-items: center; animation: pdLineaIn 0.35s ease both; }
        @keyframes pdLineaIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .pd-modal .pd-linea-cuerpo img { width: 100%; height: auto; max-height: 68vh;
          aspect-ratio: 1 / 1; object-fit: cover; }
        .pd-linea-n { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.24em;
          color: var(--pd-data); text-transform: uppercase; margin: 0 0 0.8rem; }
        .pd-linea-titulo { font-family: var(--font-playfair), Georgia, serif; font-weight: 400;
          font-size: clamp(1.5rem, 2.8vw, 2.2rem); line-height: 1.2; color: #FFFFFF; margin: 0 0 1rem; }
        .pd-linea-texto { font-size: clamp(0.95rem, 1.4vw, 1.08rem); line-height: 1.6;
          color: var(--color-text-body, #C8C7C2); margin: 0 0 1.3rem; }
        .pd-linea-rasgos { list-style: none; margin: 0; padding: 0; }
        .pd-linea-rasgos li { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 14px; padding: 0.7rem 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .pd-linea-rasgos .k { font-weight: 600; color: #FFFFFF; font-size: 0.95rem; }
        .pd-linea-rasgos .v { color: var(--pd-text); font-size: 0.95rem; line-height: 1.45; }

        /* ── 2 · El dolor, en cifras ────────────────────────────────────── */
        .pd-cifras-lista { display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 3vw, 32px); margin-top: 0.4rem; }
        .pd-cifra { border-top: 1px solid rgba(255,255,255,0.14); padding-top: 1.1rem; }
        .pd-cifra .n { font-family: var(--font-sans); font-weight: 700; color: #FFFFFF;
          font-size: clamp(1.5rem, 3.2vw, 2.3rem); line-height: 1.1; margin: 0 0 0.6rem; }
        .pd-cifra .t { font-size: clamp(0.95rem, 1.6vw, 1.08rem); line-height: 1.5;
          color: var(--color-text-body, #C8C7C2); margin: 0 0 0.8rem; }
        /* La pregunta del cierre: en computador partía en «…SALIR DEL / CICLO?» y
           dejaba huérfana la palabra que la amarra al credo. */
        .pd-cifras .pd-bisagra { text-wrap: balance; }
        .pd-cifra .f { font-family: var(--font-mono); font-size: 0.58rem; letter-spacing: 0.14em;
          color: var(--pd-muted); text-transform: uppercase; margin: 0; }
        /* La proporción en imagen: lo encendido es lo que la cifra cuenta. */
        .pd-cifra-iconos { display: flex; gap: 5px; margin: 0 0 0.75rem; }
        .pd-cifra-iconos svg { width: 21px; height: 21px; fill: rgba(255,255,255,0.13); flex: none; }
        .pd-cifra-iconos svg.on { fill: #E5E5E5; }
        .pd-slide.on .pd-cifra-iconos svg.on {
          animation: pdIcono 0.35s ease-out both; animation-delay: calc(0.5s + var(--k) * 0.07s); }
        @keyframes pdIcono { from { fill: rgba(255,255,255,0.13); } to { fill: #E5E5E5; } }
        .pd-cifra-barra { position: relative; height: 12px; margin: 0.45rem 0 1.05rem;
          background: rgba(255,255,255,0.13); }
        .pd-cifra-barra span { position: absolute; left: 0; top: 0; bottom: 0; background: #E5E5E5; }
        .pd-slide.on .pd-cifra-barra span { animation: pdBarra 0.9s 0.5s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes pdBarra { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .pd-cifra-barra span { transform-origin: left center; }
        /* La marca de la mitad: el corte oscuro sobre la barra y «½» debajo. */
        .pd-cifra-barra i { position: absolute; left: 50%; top: -4px; bottom: -4px; width: 2px;
          margin-left: -1px; background: var(--pd-bg); }
        .pd-cifra-barra i::after { content: '½'; position: absolute; top: calc(100% + 2px); left: 50%;
          transform: translateX(-50%); font-family: var(--font-mono); font-size: 0.6rem;
          color: var(--pd-muted); }
        @media (prefers-reduced-motion: reduce) {
          .pd-slide.on .pd-cifra-iconos svg.on, .pd-slide.on .pd-cifra-barra span { animation: none; }
        }
        /* En el teléfono la proporción va en la línea de la cifra: debajo, las tres
           no cabían en la pantalla. Los íconos se encogen con el ancho que queda. */
        @media (max-width: 860px) {
          .pd-cifra { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 14px;
            align-items: center; }
          .pd-cifra .t, .pd-cifra .f { grid-column: 1 / -1; }
          .pd-cifra-iconos { margin: 0 0 0.35rem; gap: 3px; }
          .pd-cifra-iconos svg { width: auto; height: auto; flex: 1 1 0; max-width: 17px; aspect-ratio: 1; }
          /* Las diez casas no caben al lado de «9 de cada 10» (quedaban de 10 px): van debajo. */
          .pd-cifra-iconos--diez { grid-column: 1 / -1; gap: 5px; margin: 0.1rem 0 0.45rem; }
          .pd-cifra-iconos--diez svg { flex: none; width: 21px; height: 21px; max-width: none; }
          /* Y su fila se paga con aire: sin esto, a 375×667 la pantalla pasaba de largo. */
          .pd-cifras .pd-cifras-lista--tres { gap: 0.75rem; }
          .pd-cifras .pd-bisagra { margin-top: 0.6rem; }
          .pd-cifra-barra { margin: 0 0 0.85rem; }
        }

        /* ── 9 · Cómo se gana ─────────────────────────────────────────────────── */
        .pd-paneles { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 3vw, 32px); }
        .panel { border: 1px solid rgba(255,255,255,0.1); background: var(--pd-elev);
          padding: 1.4rem 1.4rem 1.6rem; cursor: default; }
        .panel h3 {
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.22em;
          color: var(--pd-muted); text-transform: uppercase; text-align: center;
          margin: 0 0 1.2rem;
        }
        .pd-numeros-top { display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; margin-bottom: 1.1rem; }
        .pd-numeros-top .pd-eyebrow { margin: 0; }
        .pd-moneda { display: flex; gap: 1px; background: rgba(255,255,255,0.08); }
        .pd-moneda button { background: var(--pd-bg); border: none; color: var(--pd-muted);
          font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.14em;
          padding: 6px 11px; cursor: pointer; }
        .pd-moneda button.active { background: rgba(197,160,89,0.12); color: var(--pd-gold); }
        .pd-numeros .pd-h2 { font-size: clamp(1.25rem, 2.6vw, 1.9rem); margin-bottom: 0.5rem; }
        .pd-numeros-lead { margin-bottom: 1.5rem; }
        /* LA TABLA DEL FLOW (Director, 1 nov 2026). Hasta ese día el panel traía cinco
           casillas con el subtotal de cada generación y la cifra total encima: no se
           veía ni el valor por paquete ni cuántas compras producían el total, y una
           cifra suelta se lee como el precio de los paquetes (Adazuni, 10 oct). Ahora
           cada generación es una fila con su operación —valor × paquetes = subtotal—,
           como en el simulador de WhatsApp, y el total cierra atado a sus compras. */
        /* LOS NÚMEROS MANDAN (Director, 2 nov 2026): el panel se ensancha, el subtotal
           de cada generación es la cifra grande de su fila, el total cierra la columna
           como una suma —alineado a la derecha, bajo una regla— y los controles
           (paquete y cantidad) bajan a una sola línea compacta. */
        .pd-paneles--gen5 { grid-template-columns: minmax(0, 840px); }
        /* EL BEAT USA EL ALTO ENTERO (Director, 2 nov 2026): sube hasta debajo del
           HUD y baja casi al borde, para que las filas respiren y el título no
           quede pegado a la tabla. */
        .pd-beat--gen5 { padding-top: 58px; padding-bottom: 34px; }
        .pd-numeros .pd-h2--gen5 { margin-bottom: 1.4rem; }
        .pd-beat--gen5 .pd-numeros-top { margin-bottom: 0.8rem; }
        .pd-beat--gen5 .pd-nota { margin-top: 1rem; }
        .pd-gen5-filas { display: grid; gap: 1px; background: rgba(255,255,255,0.08); }
        /* Alturas medidas para 1280×720 (proyector) y 375×667: la pantalla entera, con
           la nota de Gano, tiene que quedar sobre el borde. */
        .pd-gen5-fila { display: grid; grid-template-columns: minmax(0, 1.15fr) repeat(3, minmax(0, 1fr));
          gap: 0 20px; align-items: baseline; background: var(--pd-bg); padding: 13px 18px;
          font-family: var(--font-mono); line-height: 1.15; }
        .pd-numeros .panel--gen5 { padding: 1.1rem 1.3rem 1.2rem; }
        .pd-numeros .panel--gen5 h3 { margin-bottom: 0.9rem; }
        .pd-gen5-fila .g { color: var(--pd-muted); font-size: 0.6rem; letter-spacing: 0.1em;
          text-transform: uppercase; }
        .pd-gen5-fila .g .pd-gen5-corto { display: none; }
        .pd-gen5-fila .op { color: var(--pd-muted); font-size: 0.72rem; white-space: nowrap; }
        .pd-gen5-fila .st { color: var(--pd-text); font-size: clamp(0.82rem, 1.9vw, 1.3rem);
          white-space: nowrap; text-align: right; }
        /* ENCENDER PARA EXPLICAR (Director, 2 nov 2026): la fila tocada toma borde
           y cifra en oro y las otras bajan; el total, al tocarlo, enciende las cinco
           de arriba abajo y después a sí mismo: la suma se ve sumar. */
        .pd-gen5-fila[role="button"] { cursor: pointer; outline: none;
          transition: opacity 0.25s ease, background 0.25s ease, box-shadow 0.25s ease; }
        .pd-gen5-fila[role="button"]:focus-visible { box-shadow: inset 0 0 0 1px rgba(197,160,89,0.5); }
        .pd-gen5-fila.on { background: rgba(197,160,89,0.10); box-shadow: inset 3px 0 0 var(--pd-gold); }
        .pd-gen5-fila.on .st { color: var(--pd-gold); }
        .pd-gen5-fila.on .g, .pd-gen5-fila.on .op { color: var(--pd-text); }
        .pd-gen5-fila.off { opacity: 0.38; }
        .pd-gen5-filas.sumando .pd-gen5-fila { animation: pd-gen5-luz 0.55s ease both; }
        .pd-gen5-filas.sumando .pd-gen5-fila:nth-child(1) { animation-delay: 0s; }
        .pd-gen5-filas.sumando .pd-gen5-fila:nth-child(2) { animation-delay: 0.13s; }
        .pd-gen5-filas.sumando .pd-gen5-fila:nth-child(3) { animation-delay: 0.26s; }
        .pd-gen5-filas.sumando .pd-gen5-fila:nth-child(4) { animation-delay: 0.39s; }
        .pd-gen5-filas.sumando .pd-gen5-fila:nth-child(5) { animation-delay: 0.52s; }
        .pd-gen5-filas.sumando .pd-gen5-fila--total { animation: pd-gen5-luz-total 0.7s ease both; animation-delay: 0.72s; }
        @keyframes pd-gen5-luz {
          0% { background: var(--pd-bg); box-shadow: none; }
          45% { background: rgba(197,160,89,0.22); box-shadow: inset 3px 0 0 var(--pd-gold); }
          100% { background: var(--pd-bg); box-shadow: none; }
        }
        @keyframes pd-gen5-luz-total {
          0% { background: var(--pd-bg); }
          50% { background: rgba(197,160,89,0.26); }
          100% { background: var(--pd-bg); }
        }
        .pd-gen5-fila--total { border-top: 1px solid rgba(197,160,89,0.45); padding: 10px 18px; }
        .pd-gen5-fila--cab { padding: 8px 18px; }
        .pd-pkgs.pd-gen5-paqs { display: none; }
        @media (max-width: 860px) {
          .pd-pkgs.pd-gen5-paqs { display: flex; margin-bottom: 0.8rem; }
          .pd-gen5-paqs .pd-pkg { flex: 1; }
          .pd-gen5-fila--cab, .pd-gen5-fila .st:not(.sel) { display: none; }
        }
        .pd-gen5-fila--cab .v { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--pd-muted); text-align: right; }
        .pd-gen5-fila--cab .v.oro { color: var(--pd-gold); }
        .pd-gen5-fila--total .g { color: var(--pd-text); }
        .pd-gen5-fila--total .st { color: var(--pd-gold); font-size: clamp(1rem, 2.4vw, 1.6rem); }
        .pd-gen5-fila--total .st .u { font-size: 0.42em; color: var(--pd-muted); letter-spacing: 0.1em; }
        .pd-gen5-controles { display: flex; justify-content: space-between; align-items: center;
          gap: 1.5rem; margin-top: 0.8rem; }
        .pd-gen5-controles .pd-pkgs { margin: 0; flex: none; }
        .pd-gen5-controles .pd-pkg { flex: none; padding: 5px 10px; font-size: 0.5rem; }
        .pd-gen5-cantidad { flex: 1; max-width: 380px; }
        .pd-gen5-cantidad .pd-label { margin-bottom: 0.2rem; }
        .pd-gen5-cantidad .pd-slider { margin: 0.4rem 0 0; }
        .pd-pkg b { display: block; font-weight: 400; margin-top: 3px; font-size: 0.62rem; }
        /* LA FORMA NO CAMBIA AL ELEGIR PORCENTAJE (Director, 26 sep 2026). La línea
           de vigencia existía solo con el 15, 16 y 17%: al pasar del Kit a otro, el
           panel crecía, la fila de paneles con él, y se reacomodaba la pantalla
           entera. Ahora las cuatro variantes ocupan la MISMA celda de una rejilla y
           solo se ve la elegida: la celda mide lo que la más larga, siempre. */
        .pd-tarifa-notas .pd-vigencias { display: grid; margin-top: 0.6rem; }
        .pd-tarifa-notas .pd-vigencias > p { grid-area: 1 / 1; visibility: hidden; }
        .pd-tarifa-notas .pd-vigencias > p.on { visibility: visible; }
        .pd-nota { text-align: center; font-size: 0.72rem; color: var(--pd-muted); margin: 1.4rem 0 0; }
        .pd-display { font-family: var(--font-mono); font-size: clamp(1.6rem, 4.6vw, 2.5rem);
          color: var(--pd-gold); text-align: center; letter-spacing: -0.02em; line-height: 1.1; }
        .pd-display .u { font-size: 0.42em; color: var(--pd-muted); letter-spacing: 0.1em; }
        .pd-sub { font-family: var(--font-mono); font-size: 0.72rem; color: var(--pd-muted);
          text-align: center; margin: 0.4rem 0 1.3rem; }
        .pd-pkgs { display: flex; gap: 1px; background: rgba(255,255,255,0.08); margin-bottom: 1.1rem; }
        .pd-pkg { flex: 1; background: var(--pd-bg); border: none; color: var(--pd-muted);
          font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.1em;
          padding: 9px 4px; cursor: pointer; text-transform: uppercase; }
        .pd-pkg.active { background: rgba(197,160,89,0.12); color: var(--pd-gold); }
        .pd-label { display: block; font-family: var(--font-mono); font-size: 0.58rem;
          letter-spacing: 0.14em; color: var(--pd-muted); text-transform: uppercase;
          margin-bottom: 0.7rem; }
        .pd-label b { color: var(--pd-gold); font-weight: 400; margin-left: 6px; }
        /* El margen inferior deja pasar el thumb grande del último nivel (50px):
           con 1rem, la bola se montaba encima del texto de abajo. */
        .pd-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 2px;
          background: rgba(255,255,255,0.14); outline: none; margin: 0.9rem 0 2.6rem; }
        .pd-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
          width: var(--thumb, 22px); height: var(--thumb, 22px); border-radius: 50%;
          background: var(--pd-gold); cursor: pointer; }
        .pd-slider::-moz-range-thumb { width: var(--thumb, 22px); height: var(--thumb, 22px);
          border-radius: 50%; background: var(--pd-gold); border: none; cursor: pointer; }
        .pd-insight { font-size: 0.78rem; line-height: 1.55; color: var(--pd-muted); margin: 0; }
        /* Los 12 niveles son CÍRCULOS, como en el deck de /12-niveles donde nacieron
           (Director, 2 oct 2026): van sincronizados con el deslizador, y a medida que
           se avanza se ve en qué nivel va y cuántos quedaron atrás. */
        .pd-niveles { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 1.1rem; }
        .pd-nivel { width: 28px; height: 28px; border-radius: 50%; padding: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.14);
          background: transparent; color: var(--pd-muted); font-family: var(--font-mono);
          font-size: 0.6rem; cursor: pointer; transition: all 0.2s; }
        .pd-nivel.done { border-color: rgba(197,160,89,0.4); color: var(--pd-gold);
          background: rgba(197,160,89,0.06); }
        .pd-nivel.active { border-color: var(--pd-gold); background: var(--pd-gold); color: #0F1115;
          box-shadow: 0 0 12px rgba(197,160,89,0.45); }

        /* ── 10 · El siguiente paso ───────────────────────────────────────── */
        /* El credo con la misma letra de la pantalla 1: se tiene que VER que el deck
           cierra donde abrió. Ver el aviso de Playfair en «1 · El credo». */
        .pd-final-credo {
          font-family: var(--font-playfair), Georgia, serif; font-weight: 400;
          font-size: clamp(1.4rem, 3.4vw, 2.5rem); line-height: 1.3;
          margin: 0 0 1.4rem; color: #FFFFFF; max-width: 26ch;
        }
        .pd-final .pd-bisagra { margin: 1.8rem 0 0; text-wrap: balance; }
        .pd-final .pd-p { text-wrap: pretty; }

        /* ── Modal catálogo ──────────────────────────────────────────────── */
        .pd-overlay { position: fixed; inset: 0; background: rgba(5,6,8,0.94); z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px; }
        .pd-modal { position: relative; max-width: min(92vw, 900px); max-height: 88vh; }
        .pd-modal img { width: 100%; height: auto; max-height: 88vh; object-fit: contain; display: block; }
        .pd-close { position: absolute; top: -40px; right: 0; background: transparent;
          border: none; color: var(--pd-muted); font-size: 1.7rem; cursor: pointer; line-height: 1; }
        /* El video de la propuesta: vertical, acotado por la altura de la pantalla
           (en un proyector manda la altura; en el teléfono, el ancho). */
        .pd-modal--video { width: min(92vw, calc((100dvh - 110px) * 0.5625)); max-height: none; }
        .pd-modal--video video { width: 100%; aspect-ratio: 9 / 16; display: block;
          background: #0F1115; border: 1px solid rgba(255,255,255,0.1); }
        /* Quien llega por el enlace directo (?video=1) ve un solo botón sobre la
           ventana: el navegador no arranca con voz sin un toque. */
        .pd-video-toque { position: absolute; inset: 0; z-index: 2; display: flex;
          flex-direction: column; align-items: center; justify-content: center; gap: 0.7rem;
          background: rgba(15,17,21,0.72); border: none; cursor: pointer;
          color: var(--color-brand); font-family: var(--font-mono);
          font-size: 0.95rem; letter-spacing: 0.18em; text-transform: uppercase; }
        .pd-video-toque-icono { display: flex; align-items: center; justify-content: center;
          width: 84px; height: 84px; border-radius: 50%; border: 1px solid var(--color-brand);
          font-size: 1.8rem; padding-left: 6px; }
        .pd-video-toque-sub { color: var(--pd-muted); font-size: 0.7rem; letter-spacing: 0.2em; }
        /* El botón de la presentación en video, bajo el kicker del credo. */
        .pd-credo .pd-ver-video { display: inline-block; margin-top: 2.2rem; }
        /* Para quien la ve solo en el teléfono (6 nov 2026): el mismo botón, a lo ancho,
           más grande y con un velo dorado. Borde y texto en oro, nunca fondo sólido con
           texto invertido (BRANDING: un primario no se invierte). */
        .pd-credo .pd-ver-video--principal {
          display: block; width: 100%; max-width: 420px; margin-top: 2.6rem;
          font-size: min(0.8rem, 3.4vw); letter-spacing: 0.14em; padding: 18px 16px;
          background: rgba(197,160,89,0.12); white-space: nowrap;
        }

        /* ── Móvil ───────────────────────────────────────────────────────── */
        @media (max-width: 860px) {
          .pd-producto, .pd-paneles { grid-template-columns: 1fr; }
          .pd-gano-dato .t { font-size: 0.78rem; }
          /* En el teléfono, la toma vertical: la taza queda abajo y el velo baja
             de arriba, donde va el texto. */
          .pd-foto--cafe { background-image: url(/images/servilleta/producto-cafe.webp);
            background-position: center bottom; }
          .pd-foto--cafe::after { background: linear-gradient(180deg, rgba(15,17,21,0.94) 0%,
            rgba(15,17,21,0.82) 55%, rgba(15,17,21,0.45) 100%); }
          .pd-modal.pd-linea { padding: 14px 16px 20px; max-height: 92dvh; }
          .pd-linea-tabs { gap: 4px 16px; margin-bottom: 14px; }
          .pd-linea-tabs button { font-size: 0.55rem; letter-spacing: 0.12em; }
          .pd-linea-cuerpo { grid-template-columns: 1fr; gap: 16px; }
          .pd-modal .pd-linea-cuerpo img { max-height: 34dvh; width: auto; max-width: 100%; margin: 0 auto; }
          .pd-linea-titulo { font-size: 1.4rem; margin-bottom: 0.7rem; }
          .pd-linea-rasgos li { grid-template-columns: 1fr; gap: 2px; padding: 0.55rem 0; }
          .pd-slide { padding: 68px 20px 48px; }
          .pd-beat { padding: 68px 20px 48px; }

          /* LOS NÚMEROS CABEN ENTEROS EN EL TELÉFONO (24 sep 2026). Desbordaban
             114px y el segundo simulador quedaba debajo del borde: quien presenta
             no se entera de que hay algo más abajo, y el prospecto tampoco. Se
             aprieta lo que no es la cifra; la cifra no se toca. */
          .pd-numeros .panel { padding: 1rem 1.1rem 1.2rem; }
          .pd-numeros .panel h3 { margin-bottom: 0.9rem; }
          .pd-numeros .pd-pkgs,
          .pd-numeros .pd-niveles { margin-bottom: 0.9rem; }
          .pd-numeros .pd-sub { margin-bottom: 0.9rem; }
          .pd-numeros .pd-slider { margin: 0.7rem 0 1.9rem; }
          .pd-numeros .pd-insight { font-size: 0.74rem; }
          .pd-numeros { padding-bottom: 28px; }
          .pd-cifras-lista { grid-template-columns: 1fr; gap: 1rem; }
          .pd-cifra { padding-top: 0.8rem; }
          .pd-cifra .n { margin-bottom: 0.35rem; }
          .pd-cifra .t { margin-bottom: 0.45rem; }
          /* LOS 12 CÍRCULOS VUELVEN AL TELÉFONO (Director, 2 oct 2026). El 26 sep se
             ocultaron para que la pantalla cupiera —el deslizador elige el mismo nivel
             y su rótulo lo dice—, pero lo que hace creíble el crecimiento es ver en
             qué nivel va, y el rótulo solo no lo muestra. Van en UNA fila de doce que
             se reparte el ancho: medido el 2 oct, en 375×667 sobraban 89 px y la fila
             ocupa unos 36; en 390×844 sobraban 182. */
          .pd-numeros .pd-niveles { display: grid; grid-template-columns: repeat(12, 1fr);
            gap: 3px; margin-bottom: 0.8rem; }
          .pd-numeros .pd-nivel { width: 100%; height: auto; aspect-ratio: 1; max-width: 26px;
            justify-self: center; font-size: 0.55rem; }
          .pd-numeros-top { margin-bottom: 0.7rem; }
          .pd-numeros .pd-h2 { font-size: 1.05rem; margin-bottom: 0.3rem; }
          .pd-numeros-lead { font-size: 0.9rem; margin-bottom: 0.9rem; }
          .pd-numeros .pd-nota { margin-top: 0.8rem; }
          .pd-final-credo { font-size: clamp(1.2rem, 5.2vw, 1.8rem); }
          /* En el teléfono el panel de paquetes se queda con su título y su rótulo,
             que ya dicen qué cuenta. Y cuando se elige un porcentaje temporal, su
             vigencia REEMPLAZA a la línea general en vez de sumarse: es la línea que
             no puede quedar debajo del borde. */
          .pd-numeros .panel--gen5 .pd-insight { display: none; }
          .pd-numeros .panel--gen5 .pd-slider { margin-bottom: 1.2rem; }
          /* En el teléfono la línea general y las tres de vigencia comparten UNA
             celda: la vigencia la reemplaza, y la celda mide lo que la más larga. */
          .pd-numeros .pd-tarifa-notas { display: grid; }
          .pd-numeros .pd-tarifa-notas > * { grid-area: 1 / 1; }
          .pd-numeros .pd-tarifa-notas .pd-vigencias { margin-top: 0; }
          .pd-numeros .pd-tarifa-notas.temporal .pd-tarifa-general { visibility: hidden; }
          /* La tira de las cinco generaciones sumó ~45px (26 sep 2026): se recuperan
             en márgenes y en el conteo de distribuidores, que cabe en una línea. */
          .pd-numeros .panel h3 { margin-bottom: 0.7rem; }
          /* LAS CINCO FILAS CABEN EN EL TELÉFONO (1 nov 2026): una línea por generación,
             con «Gen 1» en vez de «Generación 1» —a 375 px, «Generación 5 · 5 paquetes»,
             «$3.375.000 × 5» y «$3.375.000» juntos no caben en los 280 px de la fila—.
             Medido en 375×667: el panel con dos líneas por fila terminaba 22 px debajo
             del borde, y el deslizador quedaba fuera. */
          .pd-beat--gen5 { padding-top: 56px; padding-bottom: 30px; }
          .pd-numeros .pd-h2--gen5 { margin-bottom: 0.9rem; }
          /* Desde el 9 nov 2026 va una sola columna (el paquete elegido), así que
             «Generación» vuelve entero y la fila tiene aire. */
          .pd-numeros .pd-gen5-fila { grid-template-columns: minmax(0, 1fr) auto; gap: 0 8px; padding: 11px 12px; }
          .pd-numeros .pd-gen5-fila .g { font-size: 0.62rem; letter-spacing: 0.1em; white-space: nowrap; }
          .pd-numeros .pd-gen5-fila .op { text-align: right; }
          .pd-numeros .pd-gen5-fila--total { grid-template-columns: 1fr auto; }
          .pd-numeros .pd-gen5-fila--total .g { white-space: normal; max-width: 19ch; line-height: 1.25; }
          .pd-numeros .pd-gen5-fila .op { font-size: 0.58rem; }
          .pd-numeros .pd-gen5-fila .st { font-size: 1.05rem; }
          .pd-numeros .pd-gen5-fila--total { padding: 7px 10px; }
          .pd-numeros .pd-gen5-fila--total .st { font-size: 1.4rem; }
          .pd-numeros .panel--gen5 { padding: 0.9rem 1rem 1rem; }
          .pd-numeros .panel--gen5 h3 { margin-bottom: 0.7rem; }
          .pd-numeros .pd-gen5-controles { flex-direction: column; align-items: stretch; gap: 0.6rem;
            margin-top: 0.8rem; }
          .pd-numeros .pd-gen5-controles .pd-pkgs { display: flex; }
          .pd-numeros .pd-gen5-controles .pd-pkg { flex: 1; padding: 5px 4px; }
          .pd-numeros .pd-gen5-cantidad { max-width: none; }
          .pd-numeros .pd-gen5-cantidad .pd-slider { margin: 0.3rem 0 0.6rem; }
          .pd-numeros .panel--gen5 .pd-slider { margin-bottom: 0.8rem; }
          .pd-numeros .pd-sub { font-size: 0.64rem; margin-bottom: 0.8rem; }
          .pd-numeros-top { margin-bottom: 0.5rem; }
          .pd-numeros-lead { margin-bottom: 0.6rem; }
          .pd-numeros .pd-nota { margin-top: 0.5rem; }
          .pd-numeros .panel { padding-bottom: 0.9rem; }

          /* ANCLAJE DE DESPLAZAMIENTO — el patrón de la servilleta para las
             pantallas que no caben en un teléfono. En «el producto» no caben a la
             vez la historia (título, párrafo, las cuatro líneas, el portafolio) y
             la ficha del Ganoderma: son 985px contra 728 útiles. Sin anclaje la
             ficha queda debajo del borde y quien presenta ni se entera de que está.
             Con él, un deslizamiento la trae entera.
             ⚠️ proximity y NO mandatory: en la servilleta el obligatorio peleaba
             con el gesto horizontal. El guard de eje del swipe (|dx| > |dy| * 1.2)
             ya impide que bajar cambie de pantalla. */
          /* ⚠️ scroll-padding-top = el margen superior de la pantalla (26 sep 2026).
             Sin él, el anclaje alineaba la primera columna con el borde de arriba:
             la pantalla se desplazaba justo esos 68px al abrir y el rótulo
             quedaba debajo de la barra de puntos. */
          .pd-slide { scroll-snap-type: y proximity; scroll-padding-top: 68px; }
          .pd-producto > * { scroll-snap-align: start; }
          .pd-numeros .panel { scroll-snap-align: start; }
          /* En un teléfono la marca y los puntos se montaban encima del botón.
             La marca ya está en la pantalla 1 y en el remate: aquí sobra. */
          .pd-brand { display: none; }
          .pd-fs-largo { display: none; }
          .pd-vertical { display: none; }
          .pd-fs-corto { display: inline-flex; }
          /* PANTALLA COMPLETA EN LA ESQUINA (Director, 9 nov 2026): sin la marca, los
             puntos y el botón quedaban juntos a la izquierda y el botón era un
             cuadrito difícil de tocar. Ahora los puntos a la izquierda y el botón en
             la esquina superior derecha, de 44 px, el mínimo cómodo para un dedo. */
          .pd-hud-right { flex: 1; justify-content: space-between; }
          .pd-fs-principal { width: 44px; height: 44px; padding: 0; display: inline-flex;
            align-items: center; justify-content: center; color: var(--pd-text);
            border-color: rgba(255,255,255,0.22); }
        }

        /* PANTALLAS CORTAS (teléfonos de 640px de alto, y cualquiera en apaisado).
           No es un ancho distinto: es un ALTO distinto, y por eso va por max-height
           y no por max-width. Se aprieta el aire — titulares y cuerpo bajan un
           punto; las cifras no se tocan.
           El caso que lo obligó: la pantalla 4 se pasaba 77px en un teléfono de
           640, y es la única del deck que NO puede pedir desplazamiento — si la ley
           (solo se multiplica lo que es sencillo) queda debajo del borde, el giro
           del deck se pierde. */
        @media (max-height: 700px) {
          .pd-slide, .pd-beat { padding-top: 60px; padding-bottom: 34px; }
          .pd-slide { scroll-padding-top: 60px; }
          .pd-eyebrow { margin-bottom: 1rem; }
          .pd-h2 { font-size: clamp(1.4rem, 5.6vw, 2rem); margin-bottom: 1rem; }
          .pd-p { font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.8rem; }
          .pd-vinetas { margin-bottom: 0.8rem; }
          .pd-vinetas li { font-size: 0.95rem; line-height: 1.5; }
          .pd-bisagra { font-size: clamp(1.3rem, 6vw, 1.9rem); margin: 1.2rem 0 0.8rem; }
          .pd-credo .pd-credo-titulo, .pd-credo .pd-credo-linea { font-size: clamp(1.3rem, 5.4vw, 2rem); margin-bottom: 1rem; }
          .pd-credo-rule { margin: 1.4rem 0 0.9rem; }
          .pd-remate .grande { font-size: clamp(1.4rem, 6vw, 2.2rem); margin: 0.8rem 0 1.1rem; }
        }

        /* TELÉFONO GIRADO. Ancho de sobra y altura mínima: exactamente lo contrario
           de lo que asume el bloque de móvil, que apila todo en una columna porque
           supone un teléfono vertical. Aquí apilar es el error — se vuelve a dos
           columnas y las figuras se achican, que es como se recupera el alto.
           Pasa de verdad: el socio gira el teléfono para mostrar los números. */
        @media (max-height: 560px) and (min-width: 600px) {
          .pd-producto, .pd-paneles { grid-template-columns: 1fr 1fr; }
          .pd-slide, .pd-beat { padding-top: 56px; padding-bottom: 26px; }
          /* El credo son dos bloques largos y en 390px de alto no caben: se leen a
             dos columnas, que además es la forma natural de una anáfora. */
          .pd-credo .pd-wrap { display: grid; grid-template-columns: 1fr 1fr;
            gap: 0 2.2rem; align-items: start; max-width: 1100px; }
          .pd-credo .pd-eyebrow,
          .pd-credo .pd-credo-rule,
          .pd-credo .pd-kicker { grid-column: 1 / -1; }
          .pd-credo .pd-credo-titulo, .pd-credo .pd-credo-linea { font-size: clamp(1.05rem, 2.4vw, 1.6rem);
            margin-bottom: 0; max-width: none; }
          .pd-credo-rule { margin: 1.1rem 0 0.7rem; }
        }

        /* ═══ Columna del 30 sep 2026 ══════════════════════════════════════ */
        .pd-credo--solo .pd-credo-titulo { font-size: clamp(1.9rem, 5vw, 3.7rem); max-width: 20ch; }
        /* El contraste de la pantalla 1 (7 nov 2026): HOY apagada, LO QUE CREEMOS
           encendida, con el oro que el credo ya usaba para su segunda mitad. Con las
           tarjetas, el credo baja un punto para que todo quepa en un teléfono. */
        .pd-credo--solo .pd-credo-titulo { font-size: clamp(1.5rem, 3.4vw, 2.6rem); max-width: 28ch; margin-bottom: 2rem; }
        .pd-contraste {
          display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(12px, 2vw, 22px); max-width: 900px; margin: 0 0 1.6rem;
        }
        .pd-contraste .pd-tarjeta { padding: clamp(16px, 2vw, 24px); }
        .pd-contraste .pd-tarjeta-titulo { font-size: clamp(1.05rem, 1.7vw, 1.3rem); }
        .pd-contraste-hoy { background: rgba(255,255,255,0.02); }
        .pd-contraste-hoy .pd-tarjeta-titulo { color: #B9B8B3; }
        .pd-contraste-hoy .pd-tarjeta-sub { color: var(--pd-muted); }
        .pd-contraste-creemos { background: #15171C; border-color: rgba(197,160,89,0.35); }
        .pd-contraste-creemos .pd-tarjeta-rotulo { color: var(--pd-gold); }
        .pd-slide.on .pd-contraste > * { animation: pdEntra 0.6s ease-out both; }
        .pd-slide.on .pd-contraste > :nth-child(1) { animation-delay: 0.35s; }
        .pd-slide.on .pd-contraste > :nth-child(2) { animation-delay: 1.1s; }
        @media (prefers-reduced-motion: reduce) { .pd-slide.on .pd-contraste > * { animation: none; } }
        .pd-credo .pd-contraste ~ .pd-ver-video { margin-top: 0.4rem; }
        .pd-credo .pd-contraste ~ .pd-ver-video--principal { margin-top: 0.6rem; }
        @media (max-width: 860px) and (min-height: 561px) {
          .pd-contraste { grid-template-columns: 1fr; gap: 10px; margin-bottom: 1.4rem; }
          .pd-contraste .pd-tarjeta { padding: 12px 14px; border-radius: 12px; }
          .pd-contraste .pd-tarjeta-rotulo { margin-bottom: 0.45rem; }
          .pd-contraste .pd-tarjeta-titulo { font-size: 1.02rem; }
          .pd-credo--solo .pd-credo-titulo { font-size: clamp(1.3rem, 5.6vw, 1.9rem); margin-bottom: 1.1rem; }
        }
        @media (max-height: 560px) and (min-width: 600px) {
          .pd-credo .pd-contraste { grid-column: 1 / -1; margin: 0.8rem 0; }
          .pd-contraste .pd-tarjeta-sub { font-size: 0.85rem; }
        }
        .pd-p--grande { font-size: clamp(1.15rem, 2.6vw, 1.6rem); max-width: 40ch; }
        .pd-cifras-lista--tres { gap: clamp(20px, 4vw, 48px); }
        /* Sin partir la cifra (7 nov 2026): «9 de cada 10» se partía en dos líneas en el
           computador; el tope baja y la cifra va en una sola línea. */
        .pd-cifras-lista--tres .pd-cifra .n { font-size: clamp(1.9rem, 3.2vw, 2.6rem); white-space: nowrap; }
        .pd-cifras .pd-bisagra { margin-top: clamp(1.6rem, 4vh, 2.4rem); }
        .pd-cifras-lista--tres .pd-cifra .t { font-size: clamp(1rem, 1.8vw, 1.22rem); }
        /* El flujo de las dos acciones (10 oct 2026): tarjetas separadas con
           flechas doradas entre ellas — el orden se lee solo — y entrada
           escalonada cuando el beat se activa. */
        .pd-acciones {
          display: grid; grid-template-columns: 1fr auto 1.25fr auto 1fr;
          gap: clamp(10px, 1.6vw, 18px); align-items: stretch;
          margin-top: 1.2rem;
        }
        .pd-accion { background: var(--pd-bg); padding: 1.7rem 1.5rem;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column; justify-content: center; }
        /* El glifo va en ::before y cambia a ↓ en columna — NO con rotate:
           la animacion de entrada anima transform y lo pisaria (fill both). */
        .pd-flecha {
          display: flex; align-items: center; justify-content: center;
          color: var(--pd-gold); font-size: clamp(1.3rem, 2.4vw, 1.9rem);
          font-weight: 700;
        }
        .pd-flecha::before { content: '→'; }
        @keyframes pdEntra {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .pd-beat.on .pd-acciones > * { animation: pdEntra 0.45s ease-out both; }
        .pd-beat.on .pd-acciones > :nth-child(1) { animation-delay: 0.1s; }
        .pd-beat.on .pd-acciones > :nth-child(2) { animation-delay: 0.5s; }
        .pd-beat.on .pd-acciones > :nth-child(3) { animation-delay: 0.75s; }
        .pd-beat.on .pd-acciones > :nth-child(4) { animation-delay: 1.3s; }
        .pd-beat.on .pd-acciones > :nth-child(5) { animation-delay: 1.55s; }
        @media (prefers-reduced-motion: reduce) {
          .pd-beat.on .pd-acciones > * { animation: none; }
        }
        .pd-accion .k { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.26em;
          color: var(--pd-data); }
        .pd-accion .t { font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.3rem, 3vw, 2rem); color: #FFFFFF; margin: 0.5rem 0 0.7rem; }
        .pd-accion .d { font-size: clamp(0.98rem, 1.7vw, 1.12rem); line-height: 1.55;
          color: var(--color-text-body, #C8C7C2); margin: 0; }
        .pd-accion--queswa { background: var(--pd-elev); align-items: center; text-align: center; }
        .pd-accion--queswa .img { width: clamp(96px, 15vh, 150px); aspect-ratio: 1 / 1;
          background-size: cover; background-position: center; object-fit: cover;
          display: block; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem; }
        .pd-accion--queswa .d { font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--pd-muted); }
        .pd-pregunta { text-align: center; max-width: 920px; }
        .pd-pregunta .pd-bisagra { font-size: clamp(1.9rem, 5.2vw, 3.6rem); margin: 0; text-wrap: balance; }
        .pd-paneles--uno { grid-template-columns: minmax(0, 720px); justify-content: center; }
        /* Sin la barra (7 nov 2026): el panel es más ancho, la cifra más grande y las
           formas de iniciar se separan de la línea de abajo. */
        .pd-paneles--uno .pd-display { font-size: clamp(1.9rem, 5vw, 3.4rem); }
        .pd-paneles--uno .pd-pkgs { margin-bottom: 1.4rem; }
        .pd-credenciales { text-align: center; font-family: var(--font-mono); font-size: 0.6rem;
          letter-spacing: 0.2em; color: var(--pd-muted); text-transform: uppercase; margin: 0.5rem 0 0; }
        .pd-socio { display: inline-block; text-decoration: none; margin-top: 1.8rem; }
        /* Sin la línea ni la marca (7 nov 2026), la señal de la guía va en su propia línea. */
        .pd-final .pd-a-la-guia { display: flex; width: fit-content; margin: 2rem auto 0; flex: none; }
        .pd-nombre {
          font: inherit; letter-spacing: inherit; text-transform: inherit; color: inherit;
          background: none; border: none; padding: 0; cursor: text;
          border-bottom: 2px dotted rgba(197,160,89,0.45);
        }
        .pd-nombre-input {
          font: inherit; letter-spacing: inherit; text-transform: uppercase;
          color: var(--pd-gold); background: transparent; border: none; outline: none;
          border-bottom: 2px solid var(--pd-gold); padding: 0; min-width: 4ch;
        }
        .pd-nombre-input::placeholder { color: rgba(197,160,89,0.35); }
        @media (max-width: 860px) {
          .pd-cifras-lista--tres { grid-template-columns: 1fr; gap: 1.2rem; }
          .pd-acciones { grid-template-columns: 1fr; gap: 8px; }
          .pd-accion { padding: 1rem 1.1rem; }
          /* En columna el flujo baja. */
          .pd-flecha { font-size: 1.2rem; line-height: 1; }
          .pd-flecha::before { content: '↓'; }
          .pd-accion--queswa .img { width: 76px; margin-bottom: 0.6rem; }
        }

        /* ═══ Oportunidad, dos sectores y propuesta (30 sep 2026) ═══════════ */
        .pd-h2--media { font-size: clamp(1.45rem, 3.6vw, 2.5rem); max-width: 30ch; }
        .pd-pares { list-style: none; padding: 0; margin: 2rem 0 0; max-width: 720px;
          border-top: 1px solid rgba(255,255,255,0.1); }
        .pd-pares li { display: grid; grid-template-columns: minmax(0, 15rem) 2.6rem 1fr; align-items: baseline;
          padding: 0.85rem 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .pd-pares .de { font-size: clamp(1.05rem, 2.4vw, 1.5rem); color: var(--pd-muted); white-space: nowrap; }
        .pd-pares .fl { color: var(--pd-gold); text-align: center; font-size: clamp(1rem, 2.2vw, 1.4rem); }
        .pd-pares .a { font-weight: 700; font-size: clamp(1.15rem, 2.8vw, 1.8rem); color: #FFFFFF; }
        /* El trazo (2 nov 2026): una línea dorada desde el final de lo viejo hasta lo nuevo.
           La flecha de texto queda para el lector de pantalla y se dibuja con CSS. El estado
           sin animación es el cuadro final. */
        .pd-pares .de, .pd-pares .fl { line-height: 1.3; font-size: clamp(1.05rem, 2.4vw, 1.5rem); }
        .pd-pares .de { display: flex; align-items: center; color: color-mix(in srgb, var(--pd-muted) 62%, transparent); }
        .pd-pares .de::after { content: ''; flex: 1; min-width: 0.6rem; height: 1.5px; margin-left: 0.7rem;
          background: var(--pd-gold); transform-origin: left center; }
        .pd-pares .fl { position: relative; color: transparent; }
        .pd-pares .fl::before { content: ''; position: absolute; left: 0; right: 10px; top: 50%; height: 1.5px;
          margin-top: -0.75px; background: var(--pd-gold); transform-origin: left center; }
        .pd-pares .fl::after { content: ''; position: absolute; right: 7px; top: 50%; width: 7px; height: 7px;
          border-top: 1.5px solid var(--pd-gold); border-right: 1.5px solid var(--pd-gold);
          transform: translateY(-50%) rotate(45deg); }
        @keyframes pdTrazo { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes pdPunta { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pdApaga { from { color: var(--pd-muted); } to { color: color-mix(in srgb, var(--pd-muted) 62%, transparent); } }
        @keyframes pdNace { 0% { opacity: 0; color: var(--pd-gold); } 30% { opacity: 1; color: var(--pd-gold); } 100% { opacity: 1; color: #FFFFFF; } }
        .pd-slide.on .pd-pares li { --d: calc(0.35s + var(--k, 0) * 0.5s); }
        .pd-slide.on .pd-pares .de::after { animation: pdTrazo 0.45s cubic-bezier(.2,.7,.3,1) var(--d) both; }
        .pd-slide.on .pd-pares .fl::before { animation: pdTrazo 0.2s linear calc(var(--d) + 0.45s) both; }
        .pd-slide.on .pd-pares .fl::after { animation: pdPunta 0.12s linear calc(var(--d) + 0.6s) both; }
        .pd-slide.on .pd-pares .de { animation: pdApaga 0.5s ease calc(var(--d) + 0.3s) both; }
        .pd-slide.on .pd-pares .a { animation: pdNace 1.4s ease calc(var(--d) + 0.62s) both; }
        @media (prefers-reduced-motion: reduce) {
          .pd-slide.on .pd-pares .de, .pd-slide.on .pd-pares .a,
          .pd-slide.on .pd-pares .de::after, .pd-slide.on .pd-pares .fl::before,
          .pd-slide.on .pd-pares .fl::after, .pd-slide.on .pd-forma { animation: none; }
        }
        /* El remate de la oportunidad (9 nov 2026): entra después del quinto par. */
        .pd-forma { font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.2rem, 2.9vw, 1.9rem); line-height: 1.15; color: #FFFFFF;
          margin: 1.8rem 0 0; max-width: 720px; text-wrap: balance; }
        .pd-slide.on .pd-forma { animation: pdNace 1.4s ease calc(0.35s + 5 * 0.5s + 0.5s) both; }
        .pd-propuesta { font-family: var(--font-sans); font-weight: 700;
          font-size: clamp(1.35rem, 3.4vw, 2.3rem); line-height: 1.25; color: #FFFFFF;
          margin: 0 auto; max-width: 28ch; text-wrap: balance; }
        .pd-remate .pd-bisagra { text-align: center; }
        /* La solución (2 nov 2026): el activo encabeza y es el único oro de la pantalla. */
        .pd-activo-titular { display: block; color: var(--pd-gold); font-weight: 800;
          font-size: clamp(2.8rem, 7vw, 5.4rem); line-height: 1; letter-spacing: -0.015em;
          margin-bottom: 0.25em; }
        .pd-obstaculo { font-family: var(--font-sans); font-weight: 600; text-align: center;
          font-size: clamp(1.02rem, 1.9vw, 1.4rem); line-height: 1.35;
          color: var(--pd-gold); margin: 60px auto 0; max-width: 32ch; }
        @media (max-width: 860px) {
          .pd-sectores { grid-template-columns: 1fr; }
          .pd-pares li { grid-template-columns: minmax(0, 10.5rem) 1.8rem 1fr; padding: 0.7rem 0; }
          /* Las cuatro palabras van sin corte; en el teléfono la letra baja para que
             quepan en el ancho y no abran un desplazamiento lateral. */
          .pd-propuesta { font-size: min(1.2rem, 5.1vw); }
          /* Con 5,1vw las cuatro palabras sin corte pasaban 1-4 px del borde en teléfonos
             de 375 px o menos (medido el 2 nov 2026). */
          .pd-propuesta--solucion { font-size: min(1.2rem, 4.6vw); }
        }
        /* EN EL TELÉFONO, ARRIBA Y CON AIRE (Director, 7 nov 2026), pantallas 1 a 5. Centrado,
           el contenido quedaba en medio con un cuarto de pantalla vacío arriba y otro
           abajo. Ahora arranca debajo de los puntos y el alto que sobra se reparte entre
           los bloques, en vh: en un teléfono alto respira más, en uno bajo se aprieta. */
        @media (max-width: 860px) and (min-height: 600px) and (orientation: portrait) {
          .pd-slide.pd-movil-arriba { padding-top: 76px; padding-bottom: 28px; }
          .pd-movil-arriba > .pd-wrap { margin: 0 auto auto; }
          .pd-movil-arriba .pd-beat { padding-top: 76px; padding-bottom: 28px; }
          .pd-movil-arriba .pd-beat > * { margin-top: 0; margin-bottom: auto; }
          .pd-movil-arriba .pd-eyebrow { margin-bottom: clamp(1.1rem, 3.6vh, 2.2rem); }
          .pd-movil-arriba .pd-credo-titulo,
          .pd-movil-arriba .pd-h2,
          .pd-movil-arriba .pd-tarjetas-titulo { margin-bottom: clamp(1.6rem, 6.5vh, 3.8rem); }
          /* 1 · el contraste */
          .pd-movil-arriba.pd-credo--solo .pd-credo-titulo { font-size: clamp(1.45rem, 6.4vw, 2.1rem); line-height: 1.28; }
          .pd-movil-arriba .pd-contraste { gap: clamp(12px, 2.6vh, 24px); margin-bottom: clamp(1.8rem, 6.5vh, 3.8rem); }
          .pd-movil-arriba .pd-contraste .pd-tarjeta { padding: clamp(16px, 3vh, 28px) 18px; }
          .pd-movil-arriba .pd-contraste .pd-tarjeta-rotulo { margin-bottom: clamp(0.5rem, 1.4vh, 0.9rem); }
          .pd-movil-arriba .pd-contraste .pd-tarjeta-titulo { font-size: 1.1rem; margin-bottom: 0.4rem; }
          .pd-movil-arriba .pd-contraste .pd-tarjeta-sub { font-size: 0.98rem; }
          /* 2 · las cifras */
          .pd-movil-arriba .pd-cifras .pd-cifras-lista--tres { gap: clamp(1.1rem, 5vh, 2.8rem); }
          .pd-movil-arriba .pd-cifras .pd-cifra { padding-top: clamp(0.9rem, 2.4vh, 1.4rem); }
          .pd-movil-arriba .pd-cifras .pd-bisagra { margin-top: clamp(1.8rem, 7vh, 4rem); }
          /* 3 · los pares */
          .pd-movil-arriba .pd-pares { margin-top: clamp(1.2rem, 3vh, 2rem); }
          .pd-movil-arriba .pd-pares li { padding: clamp(0.8rem, 3.6vh, 1.7rem) 0; }
          .pd-movil-arriba .pd-pares .de, .pd-movil-arriba .pd-pares .fl { font-size: 1.12rem; }
          .pd-movil-arriba .pd-pares .a { font-size: 1.3rem; }
          /* 4 · los sectores */
          .pd-movil-arriba .pd-sectores { margin-top: clamp(1.2rem, 3vh, 2rem); }
          .pd-movil-arriba .pd-sector { padding: clamp(1.6rem, 8vh, 4.4rem) 1.5rem; }
          .pd-movil-arriba .pd-sector .t { font-size: 1.55rem; }
          /* 5 · la solución y las tarjetas */
          /* Más abajo (Director, 9 nov 2026): con poco texto, la tesis quedaba en el
             tercio de arriba. El rótulo sigue arriba, como en las otras pantallas;
             lo que baja es la frase, hasta cerca del centro óptico. */
          .pd-movil-arriba .pd-activo-titular { margin-top: clamp(2rem, 18vh, 9.5rem); }
          /* 60 px de la definición (Director, 9 nov 2026): con 24vh se leía como otra
             pantalla, no como la línea que sigue. */
          .pd-movil-arriba .pd-obstaculo { margin-top: 60px; }
          .pd-movil-arriba .pd-tarjetas { gap: clamp(12px, 2.8vh, 24px); }
          .pd-movil-arriba .pd-tarjetas .pd-tarjeta { padding: clamp(16px, 3vh, 26px) 16px; }
          .pd-movil-arriba .pd-flujo { --hueco: clamp(28px, 7.5vh, 64px); }
          .pd-movil-arriba .pd-flujo .pd-tarjeta { padding: clamp(16px, 3vh, 26px) 16px; }
          .pd-movil-arriba .pd-con-ciclo { gap: clamp(1.4rem, 5vh, 3rem); }
          .pd-movil-arriba .pd-con-ciclo .pd-grande-blanco { margin-bottom: clamp(1rem, 4vh, 2.4rem); }
        }
        /* 8 · cómo se gana y 9 · el siguiente paso, en el teléfono (7 nov 2026): arriba
           también, pero el titular de los números va pegado a su línea. */
        @media (max-width: 860px) and (min-height: 600px) and (orientation: portrait) {
          .pd-movil-arriba .pd-h2 { text-wrap: balance; }
          .pd-movil-arriba.pd-numeros .pd-h2 { margin-bottom: 0.6rem; }
          .pd-movil-arriba.pd-numeros .pd-h2--gen5 { margin-bottom: clamp(1rem, 3.5vh, 2rem); }
          .pd-movil-arriba.pd-numeros .pd-numeros-lead { margin-bottom: clamp(1rem, 3.5vh, 2rem); }
          .pd-movil-arriba.pd-final .pd-final-credo { margin-bottom: clamp(1.2rem, 4vh, 2.4rem); }
          .pd-movil-arriba.pd-final .pd-bisagra { margin-top: clamp(1.6rem, 6vh, 3.4rem); }
          .pd-movil-arriba.pd-final .pd-a-la-guia { margin-top: 2rem; }
        }
        /* Teléfonos bajos (≤ 760 px de alto): el mismo reparto, un punto más apretado. */
        @media (max-width: 860px) and (min-height: 600px) and (max-height: 760px) and (orientation: portrait) {
          .pd-movil-arriba.pd-credo--solo .pd-credo-titulo { font-size: clamp(1.3rem, 5.8vw, 1.8rem); }
          .pd-movil-arriba .pd-credo-titulo,
          .pd-movil-arriba .pd-h2,
          .pd-movil-arriba .pd-tarjetas-titulo { margin-bottom: clamp(1.4rem, 4.5vh, 3rem); }
          .pd-movil-arriba .pd-contraste .pd-tarjeta { padding: 14px 16px; }
          .pd-movil-arriba .pd-contraste { margin-bottom: clamp(1.4rem, 4.5vh, 3rem); }
          .pd-movil-arriba .pd-cifras .pd-cifras-lista--tres { gap: clamp(1rem, 3.4vh, 2rem); }
          .pd-movil-arriba .pd-cifras .pd-bisagra { margin-top: clamp(1.4rem, 4.5vh, 3rem); }
        }
      ` }} />

      <div
        className="pd-root"
        ref={deckRef}
        data-guia={guiaAbierta ? 'abierta' : 'cerrada'}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={(e) => evaluarSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
        onTouchCancel={() => evaluarSwipe(touchLastX.current, touchLastY.current)}
      >
        {/* ── HUD ─────────────────────────────────────────────────────── */}
        <div className="pd-hud">
          <span className="pd-brand">CreaTuActivo.com</span>
          <div className="pd-hud-right">
            <div className="pd-dots">
              {PANTALLAS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pd-dot ${n === slide ? 'active' : ''} ${n < slide ? 'done' : ''}`}
                  onClick={() => irA(n)}
                  aria-label={`Ir a la pantalla ${PANTALLAS.indexOf(n) + 1}`}
                />
              ))}
            </div>
            {!isKiosk && (
              <button
                type="button"
                className="pd-fs pd-vertical"
                onClick={() => setVerticalMode(true)}
                title="Modo vertical (para Meet)"
                aria-label="Modo vertical, para presentar en Meet"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="7" y="2.5" width="10" height="19" rx="2" />
                  <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="pd-fs pd-fs-principal"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              <span className="pd-fs-largo">{isFullscreen ? 'SALIR' : 'PANTALLA COMPLETA'}</span>
              <span className="pd-fs-corto" aria-hidden="true">
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* ── 1 · EN QUÉ CREEMOS (primera mitad) ─────────────────────── */}
        <section className={`pd-slide pd-movil-arriba pd-credo pd-credo--solo ${slide === 1 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">En qué creemos</p>
            {/* h2 y no h1: el único h1 de la página es el de la guía de abajo
                (GuiaPlanServilleta.tsx) — dos h1 rompen SEO y accesibilidad. */}
            <h2 className="pd-credo-titulo">
              Creemos que nadie debería entregar su vida entera al ciclo de trabajar,
              pagar cuentas y repetir.
            </h2>
            {/* El contraste (Director, 7 nov 2026, del ejercicio de Vélez «Del estrés crónico
                al activo familiar»). HOY narra el villano con las dos piezas de STORY_03 que
                el credo no dice —la tercera, «al que gana dos y al que gana más de veinte»,
                la cubre la cifra del DANE de la pantalla siguiente— y el falso remedio
                (Musk), que es la bicicleta estática. LO QUE CREEMOS trae «construir sin quemar
                los barcos», una de las tres creencias que desarma el simulador, y la segunda
                mitad del credo, que vuelve en la 9. ⛔ Sin el mecanismo del activo («produce
                sin su presencia»): es la pantalla 5, y aquí revelaría la solución antes del
                clímax, la disonancia que corrigió la columna del 30 sep. */}
            <div className="pd-contraste">
              {/* Título corto y una línea (Director, 7 nov 2026: el estilo de los ejemplos
                  es más limpio). «Al día siguiente de que le entra la plata» lo dice el
                  socio; el título se queda con la idea. */}
              <div className="pd-tarjeta pd-contraste-hoy">
                <p className="pd-tarjeta-rotulo">Hoy</p>
                <p className="pd-tarjeta-titulo">Su dinero ya tiene dueño</p>
                {/* «Trabajar más», sin «horas» (Director, 7 nov 2026): así lo dice el latino;
                    las horas son del registro norteamericano. La bicicleta le da al remedio
                    su contexto: sin ella, «el remedio de siempre» suena a que lo quieren timar. */}
                <p className="pd-tarjeta-sub">Trabajar más es pedalear más rápido en una bicicleta estática.</p>
              </div>
              <div className="pd-tarjeta pd-contraste-creemos">
                <p className="pd-tarjeta-rotulo">Lo que creemos</p>
                <p className="pd-tarjeta-titulo">Construir sin quemar los barcos</p>
                <p className="pd-tarjeta-sub">Que el trabajo de cada persona se convierta en un activo.</p>
              </div>
            </div>
            {/* El rótulo «CreaTuActivo · Presentación» salió de aquí (7 nov 2026): con las
                tarjetas apiñaba la pantalla, y la marca ya va en el HUD. */}
            {/* La presentación entera en video (Director, 30 oct 2026): el socio
                elige si la rueda o si la presenta él (ver videoPresentacion). */}
            <button
              type="button"
              className={`pd-demo pd-ver-video ${videoPrincipal ? 'pd-ver-video--principal' : ''}`}
              onClick={(e) => { e.stopPropagation(); setVideoPresentacion(true); }}
            >
              VER LA PRESENTACIÓN EN VIDEO →
            </button>
          </div>
        </section>

        {/* ── 2 · EL DOLOR, EN CIFRAS ─────────────────────────────────── */}
        {/* Va justo después del credo desde el 7 nov 2026 (Director): primero el dolor
            en cifras, después la oportunidad y los dos sectores, y entonces la
            solución. Hasta ese día era la 4, pegada a la solución. */}
        {/* El beat de «dos caminos para ganar» se ELIMINÓ el 9 oct 2026 (Director):
            la pantalla de los dos sectores ya aplica la regla — el contexto lo da el socio en vivo, y
            una pieza no concede. Las analogías (la fila del banco → Nequi, el taxi →
            Uber) tampoco se escriben: la paleta del orador es la pantalla de la oportunidad, y él
            aplica la que le sirva a su público. El ciclo ya abrió el deck (credo).
            El remate de los veinte lo cubre la cifra del DANE: 9 de cada 10 incluye
            al que gana bien (solo el 7,7 % dice que le sobra). */}
        <section className={`pd-slide pd-movil-arriba ${slide === 2 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap pd-cifras" style={{ maxWidth: 1040 }}>
            {/* Tres cifras, una historia: hoy no alcanza → así se trabaja → así termina. */}
            <p className="pd-eyebrow">El dolor, en cifras</p>
            <div className="pd-cifras-lista pd-cifras-lista--tres">
              {CIFRAS_PROBLEMA.map((c) => (
                <div className="pd-cifra" key={c.n}>
                  <p className="n">{c.n}</p>
                  {c.icono.tipo === 'barra' ? (
                    <div className="pd-cifra-barra" aria-hidden="true">
                      <span style={{ width: `${c.icono.pct}%` }} />
                      <i />
                    </div>
                  ) : (
                    <div className={`pd-cifra-iconos ${c.icono.de >= 10 ? 'pd-cifra-iconos--diez' : ''}`} aria-hidden="true">
                      {Array.from({ length: c.icono.de }, (_, k) => (
                        <svg
                          key={k}
                          viewBox="0 0 24 24"
                          className={k < (c.icono as { en: number }).en ? 'on' : ''}
                          style={{ ['--k' as string]: k } as React.CSSProperties}
                        >
                          {c.icono.tipo === 'casa'
                            ? <path d="M2.5 11.2 12 3l9.5 8.2V21h-6.2v-5.6H8.7V21H2.5z" />
                            : <><circle cx="12" cy="6.8" r="4.3" /><path d="M3.2 22c0-5.2 3.9-8.6 8.8-8.6s8.8 3.4 8.8 8.6z" /></>}
                        </svg>
                      ))}
                    </div>
                  )}
                  <p className="t">{c.texto}</p>
                  <p className="f">{c.fuente}</p>
                </div>
              ))}
            </div>
            {/* La frase del asentimiento (Director, 18 oct 2026): cierra las tres
                cifras como el ciclo cierra el credo. Visible con las cifras, al
                tamaño de la pregunta del cierre, no en gris pequeño. */}
            <p className="pd-bisagra">Hoy, la mayoría de las personas siente que tiene que hacer algo.</p>
          </div>
        </section>

        {/* ── 3 · LA OPORTUNIDAD ──────────────────────────────────────── */}
        {/* Palabras del Director (30 sep 2026). Los pares van como lista: la lista
            es la imagen, y el patrón se entiende sin explicarlo. */}
        <section className={`pd-slide pd-movil-arriba ${slide === 3 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">La oportunidad</p>
            <h2 className="pd-h2 pd-h2--media">
              {/* Corto (Director, 7 nov 2026): decía «Hay una oportunidad enorme en
                  modernizar industrias…»; «oportunidad» ya la dice el rótulo. */}
              Modernizar industrias que están frente a nuestros ojos.
            </h2>
            <ul className="pd-pares">
              {/* El trazo (2 nov 2026, Director: «si»), como en el video v10: al entrar, un
                  trazo dorado lleva cada industria a lo que la modernizó, lo viejo se apaga
                  y lo nuevo nace en oro y asienta en blanco, una fila tras otra. Es solo
                  CSS: sin animación (movimiento reducido o la captura del video) queda el
                  cuadro final. */}
              {PARES_MODERNIZACION.map(([de, a], k) => (
                <li key={a} style={{ '--k': k } as React.CSSProperties}>
                  <span className="de">{de}</span>
                  <span className="fl">→</span>
                  <span className="a">{a}</span>
                </li>
              ))}
            </ul>
            {/* El remate (9 nov 2026, Director): «no me siento dentro de la industria del
                network marketing; me siento haciendo empresa». Reemplaza a la pantalla
                «Dos sectores por modernizar». Entra después del último par, con el mismo
                nacimiento en oro que asienta en blanco. */}
            <p className="pd-forma">Ahora le toca a la forma de hacer empresa.</p>
          </div>
        </section>

        {/* ── 4 · DOS SECTORES: retirada el 9 nov 2026 (Director). Decía «la industria
            del network marketing» y «el sector laboral»; la oportunidad cierra ahora con
            «Ahora le toca a la forma de hacer empresa». El número 4 queda sin pantalla
            a propósito: ver PANTALLAS. Su versión vive en git (antes de este cambio). */}

        {/* ── 5 · LA SOLUCIÓN Y CÓMO FUNCIONA ─────────────────────────── */}
        <section className={`pd-slide pd-movil-arriba ${slide === 5 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          {/* Beat 0: la solución, en palabras del Director (30 sep 2026). «Le vamos
              a dar» pasó a «le damos»: se afirma, no se anuncia. Se llama «La
              solución» desde el 18 oct 2026 (Director: así lo dice en vivo, y
              cierra el arco que abren las cifras); la frase de «hacer algo» que
              abría este beat se mudó a la del dolor (hoy la 2), y aquí se abre directo. */}
          <div className={`pd-beat ${slide === 5 && beat === 0 ? 'on' : ''}`}>
            <div className="pd-remate">
              <p className="pd-eyebrow" style={{ textAlign: 'center' }}>La solución</p>
              {/* (Director, 28 oct 2026, probado en /servilleta/borrador): la pantalla lleva SOLO la
                  solución y el obstáculo. La definición completa —«todo lo que
                  necesita… desde el celular» y la analogía de Uber (su empresa vende
                  sin ser dueña de la fábrica, como Uber sin carros)— va en la voz del
                  socio. Sin «similar a Uber, Rappi o Nequi»: la ola ya la contó la
                  pantalla 3. «Moderna» lo pagan las tres piezas y el celular de la
                  unión. */}
              {/* «Un activo» primero (Director, 1 nov 2026): es la idea central que la
                  persona se lleva, y la empresa de distribución moderna es el vehículo
                  que la concreta — la misma forma del H1 de la Home. El oro va en el
                  activo; la definición llega en el beat 6, pegada a su causa. */}
              {/* La jerarquía dice lo mismo que el orden (2 nov 2026, Director: «hazlo»):
                  «Un activo:» es lo más grande de la pantalla y el único oro; hasta ese
                  día el obstáculo, en mayúsculas doradas, pesaba más que la tesis. Se
                  recuerda lo que se aísla, y dos dorados se anulan. Sigue siendo UNA
                  frase: el activo nunca va suelto, la definición queda pegada debajo. */}
              <p className="pd-propuesta pd-propuesta--solucion">
                <span className="pd-activo-titular">Un activo:</span>{' '}
                una&nbsp;empresa&nbsp;de&nbsp;distribución&nbsp;moderna a su nombre.
              </p>
              {/* El obstáculo con precio, en lugar de «Se requieren tres elementos»:
                  un requisito es una lista que aprender; un obstáculo es algo que la
                  persona ya siente. Lo cobra la frase de la unión («No son tres
                  elementos que usted tenga que conseguir»). Corta a propósito: «armados
                  por su cuenta…» va en la voz del socio. */}
              {/* El aire entre la solución y el obstáculo (Director, 30 oct 2026), en
                  lugar del botón del video «Cómo funciona», que se mudó a la pantalla 1
                  como la presentación entera. */}
              {/* El obstáculo es bisagra hacia las tres piezas, no la tesis: sin
                  mayúsculas y por debajo de la definición (2 nov 2026). En oro desde el
                  9 nov 2026 (Director); hasta ese día, gris claro. */}
              {/* «Dueña del sistema, no de las piezas» (Director, 7 nov 2026): en dos
                  presentaciones, independientes concluyeron que con Gano Excel «le iban a
                  trabajar a otro». La línea invierte la dirección antes de los tres
                  elementos; la unión la cobra con «los tres trabajan para usted». Hasta ese
                  día, «Tres elementos que le costarían millones:» (los millones van en la
                  voz, con lo que se paga tradicionalmente: fábrica, vendedores, tecnología). */}
              <p className="pd-obstaculo">Una empresa moderna es dueña del sistema, no de las piezas.</p>
            </div>
          </div>

          {/* Beat 1: LOS TRES ELEMENTOS EN QUESWA.APP, en una sola diapositiva (Director,
              7 nov 2026; ver ELEMENTOS). El titular es la unión: los tres, en una sola
              aplicación. Las tarjetas entran una tras otra, así que el ritmo de tres
              se conserva sin pedirle un toque a nadie. */}
          <div className={`pd-beat ${slide === 5 && beat === 1 ? 'on' : ''}`}>
            <div className="pd-tarjetas-wrap">
              <p className="pd-eyebrow">Cómo funciona</p>
              <p className="pd-tarjetas-titulo">
                Tres elementos en <span className="pd-gold">Queswa.app</span>
              </p>
              <div className="pd-tarjetas">
                {ELEMENTOS.map((el) => (
                  <div key={el.label} className={`pd-tarjeta ${el.icono === 'conversa' ? 'pd-tarjeta--queswa-icono' : ''}`}>
                    <span className="pd-tarjeta-icono"><IconoElemento cual={el.icono} /></span>
                    <p className="pd-tarjeta-titulo">{el.label}</p>
                    <p className="pd-tarjeta-sub">{el.sub}</p>
                    {el.boton === 'queswa' && (
                      <button
                        type="button"
                        className="pd-demo pd-demo--tarjeta"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent('open-queswa'));
                        }}
                      >
                        PREGÚNTELE ALGO AHORA →
                      </button>
                    )}
                    {el.boton === 'app' && (
                      <button
                        type="button"
                        className="pd-demo pd-demo--tarjeta"
                        onClick={(e) => { e.stopPropagation(); abrirQueswaAppPorDentro(); }}
                      >
                        VERLA POR DENTRO →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Beat 2: LAS DOS ACCIONES (Director, 7 nov 2026; ver ACCIONES): Compartir y
              Recibir, y entre las dos, quién hace el trabajo. El título es del Director
              («Experiencia sin fricción en dos pasos»), elegido sobre «Su día se resume
              en dos acciones», la frase del video. */}
          <div className={`pd-beat ${slide === 5 && beat === 2 ? 'on' : ''}`}>
            <div className="pd-tarjetas-wrap">
              <p className="pd-tarjetas-titulo">Experiencia sin fricción en dos pasos</p>
              <div className="pd-flujo">
                {ACCIONES.map((ac, i) => (
                  <div key={ac.rotulo} className="pd-flujo-paso">
                    {i > 0 && <span className={`pd-luz pd-luz--${i}`} aria-hidden="true" />}
                    <div className={`pd-tarjeta ${ac.queswa ? 'pd-tarjeta--queswa' : ''}`}>
                      {ac.campana && (
                        <span className="pd-campana" aria-label="Una notificación nueva">
                          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                          </svg>
                          <span className="pd-campana-n">1</span>
                        </span>
                      )}
                      <p className="pd-tarjeta-rotulo">{ac.rotulo}</p>
                      <p className="pd-tarjeta-titulo">{ac.titulo}</p>
                      <p className="pd-tarjeta-sub">{ac.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Beat 3 (el último): la propiedad. Es el «ajá» de WHY_02, y explica el «a su
              nombre» de la propuesta. ⚠️ Sin «por su enlace» (Director, 9 oct
              2026): el enlace se presenta en la pantalla siguiente (Compartir) y
              aquí nombraba algo que el prospecto aún no conoce. «Su empresa» hace
              eco del golpe recién revelado. ⛔ No volver a «el mercado que se va
              creando»: en Colombia «el mercado» a secas es el de la casa, y la
              permanencia se dice del CLIENTE, nunca en abstracto. */}
          {/* Desde el 28 oct 2026 la propiedad cierra la cadena del modelo en el mismo beat,
              como WHY_02 — queda a su nombre → por eso cada recompra le deja un
              porcentaje. Sin cifra: la cifra es de la pantalla 8. */}
          {/* El ciclo dibujado y la jerarquía (2 nov 2026, Director: «si»): el mismo dibujo del
              video v9, y un solo oro, el del porcentaje, porque el oro es el premio. El titular
              va en blanco; «Eso es un activo» sube a blanco y al tamaño del porcentaje: hasta
              ese día era la línea más débil de la pantalla, en gris pequeño. */}
          <div className={`pd-beat ${slide === 5 && beat === 3 ? 'on' : ''}`}>
            <div className="pd-remate pd-con-ciclo">
              <div className="pd-con-ciclo-texto">
              <p className="pd-eyebrow">La diferencia</p>
              {/* «Crecimiento por acumulación» (9 nov 2026, Director): la frase que era el
                  titular («cada cliente que llega a su empresa queda a su nombre») pasó al
                  punto 01. Los tres puntos, numerados como los propuso Gemini, se encienden
                  con el dibujo; lo ya dicho baja al 35 %. La definición del activo va
                  DESPUÉS de su causa (Director, 1 nov 2026), y «aunque usted no esté
                  presente», no «sin estar encima»: «presente» cubre al empleado y al
                  empresario. */}
              <p className="grande pd-grande-blanco">Crecimiento por acumulación</p>
              <ol className="pd-dif-puntos">
                {PUNTOS_DIFERENCIA.map((p, i) => (
                  <li key={p.t} className={`pd-dif ${p.oro ? 'oro' : ''} ${etapaDif === i || etapaDif === 4 ? 'on' : ''} ${etapaDif > i && etapaDif !== 4 ? 'antes' : ''}`}>
                    <span className="n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t">{p.t}</span>
                    <span className="s">{p.s}</span>
                  </li>
                ))}
              </ol>
              <p className={`pd-dif-suma ${etapaDif >= 3 ? 'on' : ''}`}>Los clientes de hoy se suman a los de mañana.</p>
              </div>
              <CicloPropiedad modo="propiedad" activo={slide === 5 && beat === 3} onEtapa={setEtapaDif} />
            </div>
          </div>

          {/* «Solo se multiplica lo que es sencillo» (el remate de la
              multiplicación, 18 oct 2026) SALIÓ (Director, 28 oct 2026). La
              multiplicación la dicen la tercera pieza («a usted y a quien inicie
              con usted») y la pantalla 8 (los distribuidores); las dos acciones
              se muestran en vivo, al compartir el enlace delante de la persona. */}
        </section>

        {/* ── 6 · EL PRODUCTO ─────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 6 ? 'on' : ''}`} onClick={onClickSlide}>
          {/* LA TAZA A LA VISTA (Director, 9 nov 2026): la foto era un fondo al 30 %
              detrás de dos columnas de texto. Ahora es la imagen de la pantalla, con un
              velo de carbón solo del lado del texto. */}
          <div className="pd-foto pd-foto--cafe" />
          <div className="pd-wrap">
            <div className="pd-producto">
              <div>
                <p className="pd-eyebrow">El producto</p>
                {/* LA TAZA ES LA PUERTA DE ENTRADA, NO EL CAFÉ DE SIEMPRE (Director, 26 sep
                    2026). Decía «Un hábito que no cambia» y «El café de siempre»: el marco
                    del consumo diario, vetado porque pone el producto en el estante del
                    supermercado. El «todo» anuncia que detrás viene más.
                    ⛔ Sin ciencia usada para vender (NUCLEO_EVIDENCIA): el 3 en 1 está
                    registrado como ALIMENTO. Lo sensorial (BEB_07) vive en la ficha de
                    Bebidas desde el 9 nov 2026. */}
                <h2 className="pd-h2">Todo empieza con una taza premium.</h2>
                {/* LA RECOMPRA POR RESULTADO, verbatim de PROD_01 (aprobado 24 sep 2026).
                    Prepara la pantalla 8. ⚠️ Nunca «vuelve porque se le acaba»: vuelve
                    porque nota la diferencia. */}
                <p className="pd-p pd-gold">
                  Su cliente lo incorpora a su rutina, nota la diferencia y vuelve a pedirlo
                  el mes siguiente.
                </p>
                {/* EL GANODERMA EN TRES HECHOS (Director, 9 nov 2026: «darle realce a…
                    las seis variedades, etc., hidrosoluble»). Oficio, no ciencia (26 sep):
                    cómo se hace, nunca lo que hace en el cuerpo. De CIENCIA_01/04/05.
                    ⛔ La composición se afirma; la absorción no: «se disuelve por completo»
                    sí, «se absorbe» nunca. Los seis puntos son los seis colores del Reishi. */}
                <div className="pd-gano">
                  <p className="pd-gano-titulo">Ganoderma lucidum · cultivo y extracción propios</p>
                  <div className="pd-gano-datos">
                    <div className="pd-gano-dato">
                      <p className="n">6</p>
                      <p className="t">variedades del Reishi en un solo híbrido</p>
                      <span className="pd-gano-colores" aria-hidden="true">
                        {['#B3262E', '#6B3A86', '#3F7D4E', '#E8E4DA', '#D9A925', '#22232A'].map((c) => (
                          <i key={c} style={{ background: c }} />
                        ))}
                      </span>
                    </div>
                    <div className="pd-gano-dato">
                      <p className="n">100 %</p>
                      <p className="t">hidrosoluble: se disuelve por completo en la taza</p>
                    </div>
                    <div className="pd-gano-dato">
                      <p className="n">1983</p>
                      <p className="t">desde entonces lo estudia el Dr. Leow Soon Seng, su fundador</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="pd-demo"
                  onClick={(e) => { e.stopPropagation(); setLinea(0); }}
                >
                  VER LAS CUATRO LÍNEAS →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · LA PREGUNTA ─────────────────────────────────────────── */}
        {/* Sola, justo antes del dinero (caso Marlon, 26 sep 2026): con los detalles
            el prospecto se oscurece, y lo que lo devuelve es una pregunta que él
            contesta. Las cifras ya se dieron con el problema, en la 2. */}
        <section className={`pd-slide ${slide === 7 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap pd-pregunta">
            {/* «Para construir un activo» desde el 1 nov 2026 (Director): la persona
                ya dijo por qué le serviría uno, y la pregunta le muestra que no tiene
                cómo; la 8 le entrega el plan. Hasta ese día, «para salir del ciclo». */}
            <p className="pd-bisagra">¿Y usted, qué plan tiene para construir un activo?</p>
          </div>
        </section>

        {/* ── 8 · CÓMO SE GANA ────────────────────────────────────────── */}
        <section className={`pd-slide pd-movil-arriba pd-numeros ${slide === 8 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          {/* Beat 0 — LA RESPUESTA CORTA (Director, 1 nov 2026): el rótulo pregunta
              «Cómo se gana» y el titular responde, en sus palabras, nombrando cada
              fuente por lo que la mueve y en el orden en que llegan los dos beats
              siguientes. ⛔ Nunca «dos formas de ganar»: el plan tiene doce. */}
          <div className={`pd-beat ${slide === 8 && beat === 0 ? 'on' : ''}`}>
            {/* El ciclo con el paquete (2 nov 2026, Director: «si»), como en el video v11: el
                producto que vuelven a pedir es el ciclo de la propiedad, que la persona ya vio,
                y el paquete es una caja que entra a su empresa por su propio camino. */}
            <div className="pd-remate pd-con-ciclo">
              <div className="pd-con-ciclo-texto">
              <p className="pd-eyebrow">Cómo se gana</p>
              {/* Las dos compras, por su nombre (Director, 7 nov 2026): «lo que se compra en su
                  sistema» no dejaba claro que se gana por el producto y por los paquetes.
                  ⛔ Sin «sistema de consumo»: un sistema no consume ni compra. */}
              <p className="pd-propuesta">Se gana por las compras que hacen sus clientes y distribuidores:</p>
              <div style={{ marginTop: '1.4rem' }}>
                <p className="pd-p pd-cierre-linea pd-gold">de producto</p>
                <p className="pd-p pd-cierre-linea pd-gold">y de paquetes empresariales.</p>
              </div>
              </div>
              <CicloPropiedad modo="gana" activo={slide === 8 && beat === 0} />
            </div>
          </div>

          {/* Beat 1 — LO PRINCIPAL: el ingreso que se repite, con los 12 niveles
              desde el Kit. */}
          <div className={`pd-beat ${slide === 8 && beat === 1 ? 'on' : ''}`}>
            <div className="pd-wrap" style={{ maxWidth: 1040 }}>
              <div className="pd-numeros-top">
                <p className="pd-eyebrow">Cómo se gana</p>
                <div className="pd-moneda" role="group" aria-label="Moneda">
                  {(['COP', 'USD'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={moneda === m ? 'active' : ''}
                      onClick={() => setMoneda(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* El titular dice lo que el panel muestra: consumo que se repite, de
                  clientes y de distribuidores. La propiedad ya se dijo en la 5. */}
              {/* 28 oct 2026: el porcentaje ya lo dijo la propiedad (pantalla 5), así
                  que el titular pasa a ser lo nuevo —la proyección— y los
                  distribuidores, que la 5 no nombró, quedan en la línea de abajo. */}
              <h2 className="pd-h2">
                Así se ve su activo si crece de a dos.
              </h2>
              <p className="pd-p pd-numeros-lead">
                Suma lo que vuelven a pedir sus clientes y sus distribuidores.
              </p>
              <div className="pd-paneles pd-paneles--uno">
                {/* Panel B — los 12 niveles (2×2), de /12-niveles.
                    SE QUEDA EN EL DECK (Director, 26 sep 2026): quien oye esto no es un
                    inversionista acostumbrado al largo plazo, y trae tres creencias —que
                    esto es para ganar en 50 años, que hay que quemar los barcos, y que
                    para ganar de verdad hay que iniciar con el paquete grande—. Este
                    simulador desarma las tres.
                    EL PORCENTAJE SE ELIGE, y arranca en el 10% del Kit: la cifra por
                    defecto es la de la forma más pequeña de iniciar, que es justo la
                    tercera creencia desarmada. El 15, 16 y 17% son temporales, y la línea
                    de abajo lo dice cada vez que se elige uno (ver TARIFAS_12). */}
                <div className="panel">
                  {/* Sin «(2×2)» (Director, 7 nov 2026): era jerga; el titular ya dice «de a dos». */}
                  <h3>Los 12 niveles</h3>
                  {/* BARRAS (9 nov 2026, Director: «las barras se ven corporativas,
                      empresariales; nos alejan de los círculos»). Se tocan igual que los
                      círculos que reemplazan. ⚠️ NO van a escala real (Director, el mismo
                      día): a escala, del nivel 1 al 6 no se veía nada, y parecía que ahí
                      no pasaba nada. El alto es la regalía elevada a 0,35: cada nivel crece
                      a la vista y la curva sigue subiendo hacia el 12. La cifra exacta la
                      dice el número grande. */}
                  <div className="pd-barras" role="group" aria-label="Los 12 niveles">
                    {PROYECCION_12.map((n) => (
                      <button
                        key={n.level}
                        type="button"
                        className={`pd-barra ${n.level === nivel12 ? 'active' : ''} ${n.level < nivel12 ? 'done' : ''}`}
                        onClick={() => setNivel12(n.level)}
                        aria-label={`Nivel ${n.level}`}
                      >
                        <span className="c">
                          <span className="b" style={{ height: `${(Math.pow(n.income / PROYECCION_12[PROYECCION_12.length - 1].income, 0.35) * 100).toFixed(2)}%` }} />
                        </span>
                        <span className="l">{n.level}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pd-display">{monto(Math.round(nivelSel.income * tarifa.pct / 10))}</div>
                  <div className="pd-sub">
                    {enCOP(nivelSel.people)} distribuidores nuevos · {enCOP(totalDistribuidores)} en
                    total
                  </div>

                  <div className="pd-pkgs">
                    {TARIFAS_12.map((t, i) => (
                      <button
                        key={t.pct}
                        type="button"
                        className={`pd-pkg ${tarifa12 === i ? 'active' : ''}`}
                        onClick={() => setTarifa12(i)}
                      >
                        {t.nombre}<b>{t.pct}%</b>
                      </button>
                    ))}
                  </div>

                  {/* La barra «Recorra los 12 niveles» salió (Director, 7 nov 2026): eran dos
                      controles para lo mismo. Quedan las 12 barras. */}
                  <div className={`pd-tarifa-notas ${tarifa.meses > 0 ? 'temporal' : ''}`}>
                    {/* Sin jerga (6 nov 2026, Director): decía «Cada nivel duplica su
                        sistema (2×2). Regalía mensual proyectada: el 10% del volumen
                        comisionable (GCV) de su sistema», tres términos técnicos en una
                        línea. Lo conocido primero y el nombre del plan al final. ⚠️ El
                        porcentaje es sobre lo EMPAREJADO, no sobre todo lo que se compra:
                        decir «el 10 % de lo que se compra» duplicaría la cifra en la cabeza
                        de quien lee. La mecánica, con las palabras de la guía y de
                        COMP_BIN_11. «Cada mes» porque la proyección es mensual (56 CV por
                        distribuidor al mes); Gano paga semanal, y eso lo dice la 8.2. */}
                    {/* Corta (Director, 7 nov 2026): decía «Cada nivel duplica su sistema. Lo que
                        se compra en su canal izquierdo se empareja con lo de su canal derecho, y
                        cada mes a usted le queda el X % de lo emparejado: la Regalía de Equipo.»
                        La duplicación ya la dice el titular («si crece de a dos»). */}
                    <p className="pd-insight pd-tarifa-general">
                      Cada mes le queda el {tarifa.pct}&nbsp;% de lo que se empareja entre sus dos
                      canales: la Regalía de Equipo.
                    </p>
                    <div className="pd-vigencias">
                      {TARIFAS_12.map((t, i) => (
                        <p
                          key={t.pct}
                          className={`pd-insight ${tarifa12 === i && t.meses > 0 ? 'on' : ''}`}
                          aria-hidden={tarifa12 !== i || t.meses === 0}
                        >
                          {t.meses > 0 &&
                            `Con el ${t.paquete}, el ${t.pct}% rige los primeros ${t.meses} meses; después aplica el más alto entre el 10% base y el de su rango.`}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Con «su activo» en el titular, la cifra va marcada como ejemplo
                  (1 nov 2026): hasta ese día la línea solo existía en el video. */}
              <p className="pd-nota">
                Ejemplo del cálculo del plan, no un ingreso esperado ni garantizado.
              </p>
            </div>
          </div>

          {/* Beat 2 — EL BONO POR PAQUETES (Director, 30 sep 2026). Va DESPUÉS de lo
              principal: quien inicia muchas veces necesita ganar pronto, y un deck que
              no lo muestra parece haberlo olvidado. ⚠️ Se nombra por lo que lo mueve
              —la compra de un paquete—, NUNCA por su velocidad («rápido», «inmediato»)
              ni por una etapa: «es lo que financia el crecimiento al inicio» se retiró
              el 2 nov 2026 (Director), porque el bono se paga igual al que inicia y al
              que lleva décadas. La velocidad la pone el socio en vivo con su propia
              historia, que tampoco va a la pantalla. Se cuentan PAQUETES COMPRADOS,
              nunca personas. */}
          <div className={`pd-beat pd-beat--gen5 ${slide === 8 && beat === 2 ? 'on' : ''}`}>
            <div className="pd-wrap" style={{ maxWidth: 1040 }}>
              <div className="pd-numeros-top">
                <p className="pd-eyebrow">Cómo se gana</p>
                <div className="pd-moneda" role="group" aria-label="Moneda">
                  {(['COP', 'USD'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={moneda === m ? 'active' : ''}
                      onClick={() => setMoneda(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Corto (Director, 7 nov 2026): decía «Y cada paquete empresarial que se compra
                  en su sistema le deja un bono.» La tabla ya dice «paquetes comprados». */}
              <h2 className="pd-h2 pd-h2--gen5">Un bono por cada paquete empresarial</h2>
              {/* Sin línea de apoyo (Director, 2 nov 2026): «hasta la quinta generación»
                  ya lo muestran las cinco filas, y lo dice quien presenta. El espacio
                  se lo quedan las filas. */}
              <div className="pd-paneles pd-paneles--gen5">
                <div className="panel panel--gen5">
                  {/* El bono por su nombre del plan, como la pantalla del Flow. */}
                  <h3>Bono GEN5 · Paquetes comprados</h3>
                  {/* LA TABLA LIMPIA (9 nov 2026, Director: «más comprensible que la que
                      tenemos, que se ve saturada»). Las tres formas de iniciar lado a lado,
                      el Visionario primero como anclaje, y UN paquete en cada generación:
                      sin multiplicar ni controles. Salieron el selector de paquete y la barra
                      de cantidad. La fila del total se queda (Director, 11 oct y 9 nov 2026):
                      la cifra va pegada a su origen, las compras, para que no se lea como lo
                      que valen los paquetes. Tocar una fila la enciende; tocar el total
                      enciende la suma. */}
                  {/* EN EL TELÉFONO, UN PAQUETE A LA VEZ (Director, 9 nov 2026: «un paquete
                      en cada generación… me había tomado tiempo entenderlo, es fricción»).
                      Sale la cabecera y queda una columna, la del Visionario de entrada;
                      Empresarial e Inicial se tocan. En el computador, las tres. */}
                  <div className="pd-pkgs pd-gen5-paqs" role="group" aria-label="Paquete">
                    {PAQUETES_GEN5.map((p) => (
                      <button
                        key={p.k}
                        type="button"
                        className={`pd-pkg ${gen5Paq === p.k ? 'active' : ''}`}
                        aria-pressed={gen5Paq === p.k}
                        onClick={() => setGen5Paq(p.k)}
                      >
                        {p.nombre}
                      </button>
                    ))}
                  </div>
                  <div className={`pd-gen5-filas ${gen5Sumando ? 'sumando' : ''}`}>
                    <div className="pd-gen5-fila pd-gen5-fila--cab" aria-hidden="true">
                      <span className="g">Un paquete en cada generación</span>
                      {PAQUETES_GEN5.map((p) => <span key={p.k} className={`v ${p.k === 'ESP3' ? 'oro' : ''}`}>{p.nombre}</span>)}
                    </div>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`pd-gen5-fila ${gen5Activa === i ? 'on' : ''} ${gen5Activa !== null && gen5Activa !== i ? 'off' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-pressed={gen5Activa === i}
                        aria-label={`Generación ${i + 1}`}
                        onClick={() => setGen5Activa(gen5Activa === i ? null : i)}
                        onKeyDown={(e) => { if (e.key === 'Enter') setGen5Activa(gen5Activa === i ? null : i); }}
                      >
                        <span className="g">
                          <span className="pd-gen5-largo">Generación</span>
                          <span className="pd-gen5-corto">Gen</span> {i + 1}
                        </span>
                        {PAQUETES_GEN5.map((p) => <span key={p.k} className={`st ${gen5Paq === p.k ? 'sel' : ''}`}>{montoCorto(GEN5_POR_GENERACION[p.k][i] * TRM)}</span>)}
                      </div>
                    ))}
                    <div
                      className="pd-gen5-fila pd-gen5-fila--total"
                      role="button"
                      tabIndex={0}
                      aria-label="Encender la suma"
                      onClick={encenderSumaGen5}
                      onKeyDown={(e) => { if (e.key === 'Enter') encenderSumaGen5(); }}
                    >
                      <span className="g">Su bono por esas 5 compras</span>
                      {PAQUETES_GEN5.map((p) => (
                        <span key={p.k} className={`st ${gen5Paq === p.k ? 'sel' : ''}`}>{montoCorto(GEN5_POR_GENERACION[p.k].reduce((a, b) => a + b, 0) * TRM)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Gano al final, como quien paga (WHY_02), con sus credenciales como
                  estatus y no como alegato. */}
              <p className="pd-nota">
                Las comisiones las paga el fabricante, Gano Excel, cada semana, los viernes.
              </p>
              <p className="pd-credenciales">30 años · Más de 60 países · Nueve sedes en Colombia</p>
            </div>
          </div>
        </section>

        {/* ── 9 · EL SIGUIENTE PASO ──────────────────────────────────── */}
        {/* La segunda mitad del credo cierra el deck: el cuerpo ya mostró cómo el
            esfuerzo se vuelve capital (el cliente a su nombre que vuelve a pedir).
            La conversación es con el socio del ?ref, para cuando el deck se envía. */}
        <section className={`pd-slide pd-movil-arriba pd-final ${slide === 9 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">En qué creemos</p>
            {/* La frase de identidad vigente (Director, 30 oct 2026, la misma del video
                de la presentación): «un activo», no «capital real». */}
            <p className="pd-final-credo">
              Creemos que el trabajo de cada persona debería convertirse en un activo.
            </p>
            {/* Menos texto (9 nov 2026, Director: prefirió el cierre de la prueba). Salió
                «En 16 países de América,» que abría la línea (Director, 6 nov 2026); el
                hecho sigue en /nosotros y /paquetes. Las credenciales de Gano quedan en la 8. */}
            <p className="pd-p">
              Acompañamos a cada socio nuevo uno a uno, desde el día en que empieza a
              construir su activo.
            </p>
            <p className="pd-bisagra">
              El siguiente paso es una conversación
              {nombreVisible && (
                <>
                  {' con '}
                  {editandoNombre ? (
                    <input
                      className="pd-nombre-input"
                      autoFocus
                      value={nombreEscrito}
                      maxLength={24}
                      placeholder="Nombre"
                      aria-label="Escriba el nombre de la persona"
                      style={{ width: `${Math.max(6, nombreEscrito.length + 1)}ch` }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setNombreEscrito(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmarNombre(nombreEscrito);
                        if (e.key === 'Escape') confirmarNombre('');
                      }}
                      onBlur={() => confirmarNombre(nombreEscrito)}
                    />
                  ) : (
                    <button
                      type="button"
                      className="pd-nombre"
                      title="Toque para escribir el nombre de la persona"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNombreEscrito('');
                        setEditandoNombre(true);
                      }}
                    >
                      {nombreVisible}
                    </button>
                  )}
                </>
              )}
              {!nombreVisible && sinSocio && ' con el equipo'}
              .
            </p>
            {!waSocio && sinSocio && (
              <a
                className="pd-demo pd-socio"
                href={waEquipo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); reportarAvance({ whatsapp: true }); }}
              >
                ESCRIBIRLE AL EQUIPO POR WHATSAPP →
              </a>
            )}
            {waSocio && (nombreDemo ? (
              <span className="pd-demo pd-socio" aria-hidden="true">
                ESCRIBIRLE A {nombreDemo.toUpperCase()} POR WHATSAPP →
              </span>
            ) : (
              <a
                className="pd-demo pd-socio"
                href={waSocio}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { e.stopPropagation(); reportarAvance({ whatsapp: true }); }}
              >
                ESCRIBIRLE A {primerNombre!.toUpperCase()} POR WHATSAPP →
              </a>
            ))}
            {/* La línea y «CreaTuActivo.com» salieron (Director, 7 nov 2026): la marca va
                arriba, y el cierre tiene una sola salida, el WhatsApp. */}
          </div>
          {/* La señal de la guía, en la parte inferior de la última pantalla (Director,
              9 nov 2026; hasta ese día iba dentro del contenido, bajo el WhatsApp, para
              que no la tapara el aviso de cookies). Va fuera de .pd-wrap: el margen
              automático del contenido la empuja al pie sin posición absoluta, así que
              en un teléfono bajo no se monta sobre el botón. Es un enlace: tocarla no
              avanza. En pantalla completa y en el kiosco no aparece. */}
          {slide === TOTAL_SLIDES && !isKiosk && (
            <a className="pd-a-la-guia" href="#guia-plan-servilleta" onClick={irALaGuia}>
              LA PRESENTACIÓN, EN TEXTO
              <span className="flecha" aria-hidden="true">↓</span>
            </a>
          )}
        </section>

        <div className="pd-counter">
          {PANTALLAS.indexOf(slide) + 1} / {PANTALLAS.length}
        </div>


        {/* ── Ventana de la presentación en video ────────────────────── */}
        {/* El <video> se monta con el toque del socio, así suena: el navegador
            deja arrancar con voz lo que la persona acaba de pedir (el mismo
            patrón del video de la Home). */}
        {videoPresentacion && (
          <div
            className="pd-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Video: la presentación"
            onClick={() => setVideoPresentacion(false)}
          >
            <div className="pd-modal pd-modal--video" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="pd-close"
                onClick={() => setVideoPresentacion(false)}
                aria-label="Cerrar el video"
              >
                ×
              </button>
              {videoEsperaToque && (
                <button
                  type="button"
                  className="pd-video-toque"
                  onClick={() => { videoPresentacionRef.current?.play().catch(() => { /* queda el botón */ }); }}
                >
                  <span className="pd-video-toque-icono" aria-hidden="true">▶</span>
                  VER EL VIDEO
                  <span className="pd-video-toque-sub">4 minutos</span>
                </button>
              )}
              <video
                ref={videoPresentacionRef}
                src={VIDEO_PLAN_SERVILLETA}
                autoPlay={!videoEsperaToque}
                preload="metadata"
                controls={!videoEsperaToque}
                playsInline
                onPlay={() => setVideoEsperaToque(false)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration && v.currentTime / v.duration >= 0.8) marcarVioComoFunciona();
                  if (!v.duration) return;
                  const r = videoVisto.current;
                  r.dur = v.duration;
                  r.seg = Math.max(r.seg, Math.floor(v.currentTime));
                  // El primer reporte (seg 0) cuenta quién lo empezó; después, cada cuarto.
                  const cuartos = [0, 0.25, 0.5, 0.75, 0.95].filter((c) => v.currentTime / v.duration >= c).length;
                  if (cuartos > r.cuartos) { r.cuartos = cuartos; enviarVideoVisto(); }
                }}
                onEnded={alTerminarVideoPresentacion}
              />
            </div>
          </div>
        )}

        {/* ── La ficha de cada línea del producto ─────────────────────── */}
        {/* La imagen y, al lado, lo que hace valiosa a la línea. Las pestañas pasan
            de una línea a otra sin cerrar: quien presenta recorre las cuatro. */}
        {linea !== null && (
          <div
            className="pd-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Línea ${CATEGORIAS[linea].label}`}
            onClick={() => setLinea(null)}
          >
            <div className="pd-modal pd-linea" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="pd-close"
                onClick={() => setLinea(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="pd-linea-tabs">
                {CATEGORIAS.map((c, i) => (
                  <button
                    type="button"
                    key={c.label}
                    className={i === linea ? 'on' : ''}
                    aria-pressed={i === linea}
                    onClick={() => setLinea(i)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="pd-linea-cuerpo" key={linea}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CATEGORIAS[linea].img} alt={`Línea ${CATEGORIAS[linea].label}`} />
                <div>
                  <p className="pd-linea-n">{CATEGORIAS[linea].n} productos</p>
                  <p className="pd-linea-titulo">{CATEGORIAS[linea].titulo}</p>
                  <p className="pd-linea-texto">{CATEGORIAS[linea].texto}</p>
                  <ul className="pd-linea-rasgos">
                    {CATEGORIAS[linea].rasgos.map(([k, v]) => (
                      <li key={k}><span className="k">{k}</span><span className="v">{v}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LA GUÍA EN TEXTO — segundo piso, fuera del deck a propósito: ahí no la
          alcanzan el clic que avanza ni el swipe, y Google la lee sin interacción.
          Lleva el único h1 de la página. En pantalla completa se oculta. */}
      <GuiaPlanServilleta />

      {/* MODO VERTICAL — la presentación en un marco de celular, para Meet. Abre
          en la pantalla donde va el socio y con su ?ref; el teclado pasa al marco
          apenas carga. */}
      {verticalMode && !isKiosk && (
        <div className="pd-vertical-overlay" ref={vOverlayRef}>
          <div className="pd-vertical-marco" style={{ width: 412, height: 732, transform: `scale(${vScale})` }}>
            <iframe
              ref={vIframeRef}
              src={`/servilleta?kiosk=1&pantalla=${slide}${refSocio ? `&ref=${encodeURIComponent(refSocio)}` : ''}`}
              title="Presentación en modo vertical"
              onLoad={() => vIframeRef.current?.contentWindow?.focus()}
            />
          </div>
          <button
            type="button"
            className="pd-vertical-salir"
            onClick={() => setVerticalMode(false)}
            aria-label="Salir del modo vertical"
            title="Salir (Esc)"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
