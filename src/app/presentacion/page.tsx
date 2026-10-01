'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /presentacion — la herramienta de presentación 1-a-1. Se llamó /pitch-deck
 * hasta el 30 sep 2026 («pitch deck» no pasa la prueba de la abuela); esa URL
 * redirige aquí.
 *
 * SE PRESENTA EN VIVO (Director, 30 sep 2026): el socio conduce el deck delante
 * de la persona y solo DESPUÉS le comparte el enlace, así que puede apoyarse en
 * su voz.
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
 *  1 EN QUÉ CREEMOS  · solo la primera mitad del credo (el ciclo).
 *  2 LA OPORTUNIDAD  · modernizar industrias frente a nuestros ojos: cinco pares
 *                      (domicilios → Rappi … Adpostal → WhatsApp).
 *  3 DOS SECTORES    · la industria del network marketing y el sector laboral.
 *                      ⚠️ SOLO el nombre del sector, sin describir cómo se hace
 *                      hoy: el contexto lo da el socio en vivo, y una pieza no
 *                      concede (memoria feedback_pieza_no_concede).
 *  4 EL SECTOR       · la fila del banco → los dos caminos → el mismo dolor
 *    LABORAL           (inestabilidad, incertidumbre); beat 2: las dos cifras,
 *                      que prueban justo esas dos palabras.
 *  5 LA PROPUESTA    · beat 0: una empresa de distribución moderna a su nombre,
 *    Y CÓMO FUNCIONA   «se requieren tres elementos»; luego el orden de WHY_02:
 *                      las tres piezas (el fabricante SIN nombre), la oscilación,
 *                      el remate y la propiedad.
 *  6 QUÉ HACE USTED  · Compartir · Recibir con Queswa en medio (EAM_01);
 *                      beat 2: solo se multiplica lo que es sencillo.
 *  7 EL PRODUCTO     · la del deck del 23 sep, sin cambios. Gano se nombra aquí
 *                      por primera vez, como quien lo fabrica.
 *  8 LA PREGUNTA     · «¿Y usted, qué plan tiene…?» sola (caso Marlon).
 *  9 CÓMO SE GANA    · beat 1, lo principal: la recompra le paga + los 12
 *                      niveles desde el Kit. Beat 2: el bono por paquetes
 *                      empresariales (Director, 30 sep 2026: quien inicia muchas
 *                      veces necesita ganar pronto, y la industria lo tiene; no
 *                      puede parecer olvidado). Se dice su FUNCIÓN —financia el
 *                      crecimiento al inicio—, nunca su velocidad. Gano paga, al
 *                      final.
 * 10 EL SIGUIENTE    · la segunda mitad del credo, la lista de espera y la
 *    PASO              conversación con el socio del ?ref (nombre y WhatsApp).
 *
 * REGLAS QUE ROMPEN ALGO SI SE TOCAN
 * ----------------------------------
 *  · El botón «PREGÚNTELE ALGO AHORA» (pieza 2 de la pantalla 5) convierte la
 *    tecnología en experiencia. Por eso /presentacion está en RUTAS_ORBE_QUESWA_WEB
 *    (orbe-config.ts) y en `isDeck` de UnifiedQueswaOrb: mandar esa demo a
 *    WhatsApp la rompe, porque saca al prospecto de la reunión.
 *  · «Network marketing» va SOLO como nombre del sector (pantalla 3). Cómo se hace
 *    hoy lo cuenta el socio en vivo: una pieza no concede, y describirlo aquí sería
 *    un juicio sin voz sobre el método de otros.
 *  · El bono por paquetes se nombra por lo que lo mueve (la compra de un paquete) y
 *    por su función (financia el crecimiento al inicio), NUNCA por su velocidad. Se
 *    cuentan paquetes comprados, nunca personas.
 *  · Sin socio (visita orgánica o ?ref que no se encuentra), la conversación es con
 *    el equipo, por el WhatsApp Business (Director, 1 oct 2026).
 *  · La presentación reporta hasta dónde llegó cada persona en tres hitos, si llegó
 *    al final y si tocó el WhatsApp (/api/track/presentacion → avisos del Dashboard).
 *  · La última pantalla nombra al socio del ?ref y trae su WhatsApp. El socio toca
 *    su nombre y escribe el del prospecto: la prueba en vivo de la pieza 3, su
 *    aplicación personalizada. «En su caso, esta pantalla dirá el suyo» es frase de
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

const TOTAL_SLIDES = 10;
/** Pantallas que se reportan a la ficha: un tercio, dos tercios y la última. */
const HITOS_PRESENTACION = [4, 7, TOTAL_SLIDES];
/** WhatsApp Business del equipo (+57 320 680 5737): el mismo número orgánico de
 *  los reels (`WHATSAPP_ORGANICO_DEFAULT` en [slug]/[destino]). Para quien llega
 *  a la presentación sin el enlace de un socio. */
const WHATSAPP_EQUIPO = '573206805737';

/** Beats internos por pantalla. */
const BEATS: Record<number, number> = { 4: 2, 5: 7, 6: 2, 9: 2 };
const beatsOf = (slide: number) => BEATS[slide] ?? 1;

/** Las tres piezas. Mismo lenguaje 3D (objeto gris, fondo negro, piso blanco):
 *  que se vean hechas del mismo material es lo que vuelve creíble «es una sola». */
const PIEZAS: { label: string; img: string; sub: string; extra?: string }[] = [
  {
    label: 'UN FABRICANTE',
    img: '/images/servilleta/colapso-fabrica.webp',
    // Sin nombre, como en WHY_02: Gano se nombra en el producto y al final, como quien paga.
    sub: 'Fabrica, empaca y despacha cada pedido hasta la casa de su cliente.',
  },
  {
    label: 'UNA TECNOLOGÍA QUE ATIENDE',
    img: '/images/servilleta/colapso-conversacion.webp',
    sub: 'Queswa conversa con cada interesado, le resuelve las dudas y madura su decisión de avanzar. A toda hora.',
    // La segunda cara (metas · redacta · avisa) vivió aquí como `extra` del 24 al
    // 27 sep 2026; se mudó a la pieza 3, que ES esa cara con nombre propio. Esta
    // pieza queda solo de cara al prospecto — no repetirle el contenido a la 3.
  },
  {
    // EL TERCER ELEMENTO ES SU APLICACIÓN PERSONALIZADA (Director, 27 sep 2026,
    // sesión del video «Cómo funciona»): los tres elementos responden qué RECIBE
    // la persona; las dos acciones responden qué HACE y en el deck no se listan
    // (las cuenta Queswa en vivo — EAM_01). Espejo de WHY_02 v6.52 / WHY_APP_01
    // v6.53 del arsenal.
    // ⚠️ Waze va en MECANISMO, nunca en resultado: «le marca la ruta» ✅ ·
    // «lo lleva a donde quiere estar» ⛔ (voz de coach, vetada el 24 sep).
    // El render es un PIN DE MAPA con pasos de ruta — se hizo para «método» pero
    // es la imagen de Waze literal, así que sirve a esta pieza mejor que a la
    // anterior. Va como copia con nombre propio (colapso-aplicacion.webp) para
    // que el deck no dependa del asset «metodo», que es de /servilleta (quieta).
    label: 'SU APLICACIÓN PERSONALIZADA',
    img: '/images/servilleta/colapso-aplicacion.webp',
    sub: 'Como en Waze: usted le dice a dónde quiere llegar, y Queswa le va marcando la ruta, paso a paso.',
    extra: 'Conoce sus metas, le redacta lo que va a enviar y le avisa cuando alguien queda listo.',
  },
];

/** La ola de modernización (Director, 30 sep 2026): lo que antes era una
 *  industria a la antigua, hoy es una aplicación. */
const PARES_MODERNIZACION: [string, string][] = [
  ['Domicilios', 'Rappi'],
  ['Taxis', 'Uber'],
  ['La fila del banco', 'Nequi'],
  ['Comprar DVDs', 'Netflix'],
  ['Adpostal', 'WhatsApp'],
];

const CATEGORIAS = [
  { label: 'BEBIDAS', img: '/productos/compuestas/categoria-bebidas.jpg' },
  { label: 'SUPLEMENTOS', img: '/productos/compuestas/categoria-suplementos.jpg' },
  { label: 'CUIDADO PERSONAL', img: '/productos/compuestas/categoria-cuidado-personal.jpg' },
  { label: 'LUVOCO', img: '/productos/compuestas/categoria-luvoco.jpg' },
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

/** Las cifras del sector laboral (aprobadas por el Director, 26 sep 2026). Desde el
 *  30 sep prueban las dos palabras del dolor: el ingreso que no alcanza es la
 *  inestabilidad; la pensión que no llega, la incertidumbre. La del GEM (casi 1 de
 *  cada 4 empezando un negocio) salió con «Por qué ahora»; su fuente queda abajo. Cada una se verificó en su fuente primaria ese día; si se cambia una, se
 *  vuelve a la fuente — no a un artículo que la cite.
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
 *  · GEM 2023/2024 Global Report, perfil de Colombia (datos 2023, adultos de 18 a
 *    64): TEA 23,6 % («just under one in four», puesto 7 de 46). Colombia no
 *    participó en 2024 ni en 2025: por eso va con su año. La TEA cuenta negocios
 *    NUEVOS (hasta 42 meses), y por eso la frase dice «que abrió hace poco».
 *    https://www.gemconsortium.org/country-profile/52
 *  ⛔ Descartadas: el «9 de cada 10 quieren emprender / 63 % sin recursos» es un
 *  estudio de Amway (2021) — la fuente confirma la categoría que no se nombra —; la
 *  «intención emprendedora» del GEM (18,5 % en el global, 43,2 % en el nacional) es
 *  inconsistente; y la carga financiera del Banco de la República (31 %, feb. 2026)
 *  cubre solo a los hogares con créditos. */
const CIFRAS_PROBLEMA = [
  {
    n: '9 de cada 10',
    texto: 'hogares colombianos dicen que su ingreso no alcanza, o que alcanza solo para lo mínimo.',
    fuente: 'DANE · Encuesta de Calidad de Vida 2025',
  },
  {
    n: '3 de cada 4',
    texto: 'colombianos en edad de pensionarse no reciben una pensión.',
    fuente: 'Colpensiones · U. Javeriana, 2022',
  },
];

/** Tasa fija del fabricante para más de 60 países. No es la TRM del mercado. */
const TRM = 4500;
/** Bono GEN5 por paquete, generación por generación (USD) — COMP_GEN5_04 del arsenal
 *  de compensación. Cada paquete que se compra deja bono en su generación y en las
 *  cuatro de arriba, y el paquete propio es el techo: el ejemplo supone el mismo
 *  paquete arriba y abajo. La quinta va con su valor completo (100 PV en el mes),
 *  igual que el simulador de WhatsApp (GEN5_POR_PAQUETE en wa-simulador.ts). */
const GEN5_POR_GENERACION: Record<'ESP1' | 'ESP2' | 'ESP3', number[]> = {
  ESP1: [25, 5, 5, 5, 10],
  ESP2: [75, 10, 10, 10, 20],
  ESP3: [150, 20, 20, 20, 40],
};

const enUSD = (n: number) => n.toLocaleString('en-US');
const enCOP = (n: number) => n.toLocaleString('es-CO');

export default function PitchDeckPage() {
  const [slide, setSlide] = useState(1);
  const [beat, setBeat] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // El visor no es solo del portafolio: cada categoría se abre en grande desde su
  // miniatura. En la tira caben cuatro y ahí no se lee nada; el producto se mira.
  const [visor, setVisor] = useState<{ src: string; alt: string } | null>(null);

  // Simuladores
  // ⚠️ MONEDA: COP por defecto (Director, 26 sep 2026) — en Colombia se muestra solo
  // pesos. El USD queda a un toque para quien presenta fuera del país, y cada cifra
  // sale en UNA moneda, nunca las dos a la vez.
  const [moneda, setMoneda] = useState<'COP' | 'USD'>('COP');
  const [gen5Paquetes, setGen5Paquetes] = useState(2);
  const [gen5Nivel, setGen5Nivel] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP1');
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
    if (!ref) { setSinSocio(true); return; }
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
  const reportarAvance = useCallback((datos: { pantalla?: number; completa?: boolean; whatsapp?: boolean; en_vivo?: boolean }) => {
    const fingerprint = (window as any).FrameworkIAA?.fingerprint;
    if (!fingerprint) return;
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
  // vivo de la pieza 3, su aplicación personalizada. Solo cambia lo que se VE: el
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
  const hitosReportados = useRef(new Set<number>());
  useEffect(() => {
    const hito = [...HITOS_PRESENTACION].reverse().find((h) => slide >= h);
    if (!hito || hitosReportados.current.has(hito)) return;
    hitosReportados.current.add(hito);
    reportarAvance({ pantalla: slide, completa: slide === TOTAL_SLIDES || undefined });
  }, [slide, reportarAvance]);

  const gen5Por = GEN5_POR_GENERACION[gen5Nivel];
  const ingresoGen5COP = gen5Paquetes * gen5Por.reduce((a, b) => a + b, 0) * TRM;
  const tarifa = TARIFAS_12[tarifa12];
  const monto = (cop: number) => moneda === 'COP'
    ? <>${enCOP(cop)}<span className="u"> COP</span></>
    : <>${enUSD(Math.round(cop / TRM))}<span className="u"> USD</span></>;
  const montoCorto = (cop: number) =>
    moneda === 'COP' ? `$${enCOP(cop)}` : `$${enUSD(Math.round(cop / TRM))}`;

  // Bola de nieve: el thumb crece con el nivel (la metáfora, literal).
  const thumbNivel = Math.round(20 + ((nivel12 - 1) / 11) * 30);

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
    if (slide < TOTAL_SLIDES) { setSlide(slide + 1); setBeat(0); }
  }, [slide, beat]);

  const retroceder = useCallback(() => {
    if (beat > 0) { setBeat(beat - 1); return; }
    if (slide > 1) {
      const destino = slide - 1;
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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
      if (visor && e.key === 'Escape') { setVisor(null); return; }
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) { e.preventDefault(); avanzar(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); retroceder(); }
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      else if (e.key === 'Home') irA(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [avanzar, retroceder, toggleFullscreen, irA, visor]);

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
          position: fixed; inset: 0;
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
        .pd-counter {
          position: absolute; bottom: 14px; right: clamp(16px, 4vw, 40px);
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.2em;
          color: #3d4048; z-index: 40;
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
        /* ⚠️ Playfair se pide por su variable propia y NO por var(--font-serif):
           ese token se declara en :root (globals.css) como var(--font-playfair),
           Georgia, serif, pero --font-playfair lo define next/font en el <body>.
           Una custom property se sustituye en el elemento que la DECLARA, así que
           en :root queda inválida y hereda vacía — el titular caía a Inter. */
        .pd-credo h1, .pd-credo .pd-credo-linea {
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
        .pd-pieza { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 5vw, 64px);
          align-items: center; max-width: 1040px; margin: 0 auto; width: 100%; }
        /* ⚠️ El ancho va EXPLÍCITO. Sin él, como .pd-pieza lleva align-items:center,
           el ítem de la rejilla no se estira, su alto queda en 0 y aspect-ratio le
           deja 2px de ancho: en el teléfono las tres piezas no se veían (bug real,
           24 sep 2026). En escritorio no aparecía porque la columna daba el ancho. */
        .pd-figura {
          width: 100%;
          aspect-ratio: 1 / 1; background-size: cover; background-position: center;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .pd-pieza-label {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.3rem, 3.4vw, 2.3rem); line-height: 1.1; color: #FFFFFF;
          margin: 0 0 1.1rem;
        }
        .pd-demo {
          margin-top: 1.6rem; background: transparent; border: 1px solid var(--pd-gold);
          color: var(--pd-gold); font-family: var(--font-mono); font-size: 0.68rem;
          letter-spacing: 0.2em; padding: 13px 22px; cursor: pointer; transition: all 0.25s;
        }
        .pd-demo:hover { background: var(--pd-gold); color: #0F1115; }

        .pd-tres { display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 3vw, 36px); max-width: 940px; margin: 0 auto; width: 100%; }
        .pd-tres .pd-figura { animation: pdPulso 3.6s infinite; opacity: 0.32; }
        .pd-tres .col:nth-child(1) .pd-figura { animation-delay: 0s; }
        .pd-tres .col:nth-child(2) .pd-figura { animation-delay: 1.2s; }
        .pd-tres .col:nth-child(3) .pd-figura { animation-delay: 2.4s; }
        @keyframes pdPulso { 0%, 24% { opacity: 1; } 34%, 100% { opacity: 0.3; } }
        .pd-tres .cap {
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.18em;
          color: var(--pd-muted); text-transform: uppercase; text-align: center;
          margin-top: 0.9rem; min-height: 2.4em;
        }
        @media (prefers-reduced-motion: reduce) {
          .pd-tres .pd-figura { animation: none; opacity: 1; }
        }
        /* ⚠️ margin:auto en los cuatro lados y NO 0 auto: el cero pisaba el
           margin-block:auto con el que .pd-beat centra a su hijo, y este beat era el
           único que se quedaba pegado arriba con media pantalla vacía debajo. */
        .pd-remate { text-align: center; max-width: 760px; margin: auto; }

        .pd-fusion {
          display: flex; margin: 0 auto;
          width: min(520px, 76vw);
          border: 1px solid rgba(197,160,89,0.55);
          box-shadow: 0 0 70px rgba(197,160,89,0.10);
        }
        .pd-fusion-parte {
          flex: 1; aspect-ratio: 1 / 1;
          background-size: cover; background-position: center;
        }
        .pd-remate .grande {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.6rem, 4.6vw, 3.1rem); line-height: 1.1;
          color: var(--pd-gold); margin: 2rem 0 1.5rem;
        }
        /* La línea del NOMBRE (mecánica de Jobs). Más pequeña que el golpe para que
           las cuatro palabras quepan en UNA línea hasta en el teléfono — los espacios
           duros del JSX impiden el corte que dejaría «distribución moderna» sola.
           El selector con "p." sube la especificidad para ganarle a la media query
           del móvil. OJO: nada de acentos graves en estos comentarios — cierran la
           plantilla de JS que envuelve todo este CSS (rompió el build, 28 sep). */
        .pd-remate p.grande--nombre {
          font-size: clamp(1rem, 3.4vw, 2rem); margin: 0 0 1.5rem;
        }
        .pd-remate .pd-preparacion {
          font-size: clamp(0.95rem, 1.9vw, 1.12rem); line-height: 1.5;
          color: var(--pd-muted); margin: 0 0 1.8rem;
        }
        .pd-remate .pd-cierre-linea {
          margin: 0 auto 0.5rem; text-align: center; max-width: 42ch;
        }
        .pd-remate .pd-cierre-linea:last-of-type { margin-bottom: 0; }
        /* La marca del remate se OCULTA en escritorio: el HUD ya la lleva arriba a
           la izquierda y salía dos veces en la misma pantalla. En el teléfono el HUD
           la esconde, así que allá esta es la única y sí se muestra. */
        .pd-remate .marca {
          display: none;
          font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.3em;
          color: var(--pd-muted); text-transform: uppercase; margin-top: 2rem;
        }

        /* ── 7 · Producto ────────────────────────────────────────────────── */
        .pd-foto {
          position: absolute; inset: 0; background-size: cover; background-position: center;
          opacity: 0.3;
        }
        .pd-producto { display: grid; grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(24px, 5vw, 56px); align-items: center; position: relative; z-index: 2; }
        .pd-ficha { border: 1px solid rgba(255,255,255,0.1); background: rgba(15,17,21,0.82);
          padding: 1.4rem 1.5rem; }
        .pd-ficha .titulo {
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.24em;
          color: var(--pd-gold); text-transform: uppercase; padding-bottom: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.9rem;
        }
        .pd-fila { display: flex; justify-content: space-between; align-items: baseline;
          padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .pd-fila .k { font-family: var(--font-mono); font-size: 0.56rem; letter-spacing: 0.16em;
          color: var(--pd-muted); text-transform: uppercase; }
        .pd-fila .v { font-family: var(--font-mono); font-size: 1.05rem; color: var(--pd-text); }
        .pd-ficha .pie { font-size: 0.78rem; color: var(--pd-muted); line-height: 1.55; margin: 0.9rem 0 0; }
        .pd-cats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 1.6rem; }
        .pd-cats-lead { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.18em;
          color: var(--pd-muted); text-transform: uppercase; margin: 1.6rem 0 0; }
        .pd-cats-lead + .pd-cats { margin-top: 0.7rem; }
        .pd-cat { position: relative; aspect-ratio: 1 / 1; background-size: cover;
          background-position: center; border: 1px solid rgba(255,255,255,0.08);
          padding: 0; cursor: zoom-in; transition: border-color 0.25s, transform 0.25s;
          display: block; width: 100%; }
        .pd-cat:hover { border-color: rgba(197,160,89,0.55); transform: translateY(-2px); }
        .pd-cat span {
          position: absolute; left: 0; right: 0; bottom: 0; padding: 6px 4px;
          background: linear-gradient(transparent, rgba(15,17,21,0.92));
          font-family: var(--font-mono); font-size: 0.5rem; letter-spacing: 0.12em;
          text-align: center; color: var(--pd-text); text-transform: uppercase;
        }
        .pd-link {
          margin-top: 1.4rem; background: transparent; border: none; padding: 0;
          color: var(--pd-gold); font-family: var(--font-mono); font-size: 0.68rem;
          letter-spacing: 0.18em; cursor: pointer; border-bottom: 1px solid rgba(197,160,89,0.4);
        }
        .pd-link:hover { border-bottom-color: var(--pd-gold); }

        /* ── 4 · El sector laboral, en cifras ───────────────────────────────────── */
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
        .pd-gens { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px;
          background: rgba(255,255,255,0.08); margin: 1rem 0 1.1rem; }
        .pd-gen { background: var(--pd-bg); padding: 7px 2px; text-align: center; }
        .pd-gen .k { display: block; font-family: var(--font-mono); font-size: 0.5rem;
          letter-spacing: 0.12em; color: var(--pd-muted); text-transform: uppercase; }
        .pd-gen .v { display: block; font-family: var(--font-mono); font-size: 0.6rem;
          color: var(--pd-text); margin-top: 3px; white-space: nowrap; }
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
        .pd-niveles { display: flex; flex-wrap: wrap; gap: 5px; justify-content: center; margin-bottom: 1.1rem; }
        .pd-nivel { width: 26px; height: 26px; border: 1px solid rgba(255,255,255,0.14);
          background: transparent; color: var(--pd-muted); font-family: var(--font-mono);
          font-size: 0.6rem; cursor: pointer; transition: all 0.2s; }
        .pd-nivel.done { border-color: rgba(197,160,89,0.4); color: var(--pd-gold);
          background: rgba(197,160,89,0.06); }
        .pd-nivel.active { border-color: var(--pd-gold); background: var(--pd-gold); color: #0F1115; }

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

        /* ── Móvil ───────────────────────────────────────────────────────── */
        @media (max-width: 860px) {
          .pd-pieza, .pd-producto, .pd-paneles { grid-template-columns: 1fr; }
          /* La pieza manda en el teléfono: es lo único que se mira mientras el
             socio narra. Ancho fijo y centrada, no un max-width que la colapse. */
          .pd-pieza .pd-figura { width: min(64vw, 310px); margin: 0 auto; }
          .pd-tres { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .pd-tres .cap { font-size: 0.48rem; letter-spacing: 0.1em; }
          /* Dos por dos, no cuatro en fila: a 83px no se distingue un producto de
             otro, y esta es la pantalla donde el producto se mira. Cada una abre
             en grande al tocarla. */
          .pd-cats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
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
          /* El titular y el selector de porcentaje (26 sep 2026) sumaron ~190px, y
             esta pantalla tiene que caber entera. Lo que se aprieta no es la cifra:
             la fila de botones de nivel se va en el teléfono porque el deslizador
             elige el mismo nivel y su rótulo lo dice. */
          .pd-numeros .pd-niveles { display: none; }
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
          .pd-numeros .pd-gens { margin: 0.7rem 0 0.8rem; }
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
          .pd-remate .marca { display: block; }
          .pd-fs-largo { display: none; }
          .pd-fs-corto { display: inline; }
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
          .pd-credo h1, .pd-credo .pd-credo-linea { font-size: clamp(1.3rem, 5.4vw, 2rem); margin-bottom: 1rem; }
          .pd-credo-rule { margin: 1.4rem 0 0.9rem; }
          .pd-pieza-label { font-size: clamp(1.15rem, 5.2vw, 1.9rem); margin-bottom: 0.8rem; }
          .pd-pieza .pd-figura { width: min(48vw, 230px); }
          .pd-remate .grande { font-size: clamp(1.4rem, 6vw, 2.2rem); margin: 0.8rem 0 1.1rem; }
        }

        /* TELÉFONO GIRADO. Ancho de sobra y altura mínima: exactamente lo contrario
           de lo que asume el bloque de móvil, que apila todo en una columna porque
           supone un teléfono vertical. Aquí apilar es el error — se vuelve a dos
           columnas y las figuras se achican, que es como se recupera el alto.
           Pasa de verdad: el socio gira el teléfono para mostrar los números. */
        @media (max-height: 560px) and (min-width: 600px) {
          .pd-pieza, .pd-producto, .pd-paneles { grid-template-columns: 1fr 1fr; }
          .pd-cats { grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .pd-pieza .pd-figura { width: min(34vw, 230px); }
          .pd-slide, .pd-beat { padding-top: 56px; padding-bottom: 26px; }
          /* El credo son dos bloques largos y en 390px de alto no caben: se leen a
             dos columnas, que además es la forma natural de una anáfora. */
          .pd-credo .pd-wrap { display: grid; grid-template-columns: 1fr 1fr;
            gap: 0 2.2rem; align-items: start; max-width: 1100px; }
          .pd-credo .pd-eyebrow,
          .pd-credo .pd-credo-rule,
          .pd-credo .pd-kicker { grid-column: 1 / -1; }
          .pd-credo h1, .pd-credo .pd-credo-linea { font-size: clamp(1.05rem, 2.4vw, 1.6rem);
            margin-bottom: 0; max-width: none; }
          .pd-credo-rule { margin: 1.1rem 0 0.7rem; }
        }

        /* ═══ Columna del 30 sep 2026 ══════════════════════════════════════ */
        .pd-credo--solo h1 { font-size: clamp(1.9rem, 5vw, 3.7rem); max-width: 20ch; }
        .pd-p--grande { font-size: clamp(1.15rem, 2.6vw, 1.6rem); max-width: 40ch; }
        .pd-cifras-lista--dos { grid-template-columns: repeat(2, 1fr); gap: clamp(24px, 5vw, 64px); }
        .pd-cifras-lista--dos .pd-cifra .n { font-size: clamp(2.2rem, 6vw, 4.2rem); }
        .pd-cifras-lista--dos .pd-cifra .t { font-size: clamp(1.05rem, 2vw, 1.35rem); }
        .pd-acciones {
          display: grid; grid-template-columns: 1fr 1.25fr 1fr; gap: 1px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08);
          margin-top: 1.2rem;
        }
        .pd-accion { background: var(--pd-bg); padding: 1.7rem 1.5rem;
          display: flex; flex-direction: column; justify-content: center; }
        .pd-accion .k { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.26em;
          color: var(--pd-data); }
        .pd-accion .t { font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.3rem, 3vw, 2rem); color: #FFFFFF; margin: 0.5rem 0 0.7rem; }
        .pd-accion .d { font-size: clamp(0.98rem, 1.7vw, 1.12rem); line-height: 1.55;
          color: var(--color-text-body, #C8C7C2); margin: 0; }
        .pd-accion--queswa { background: var(--pd-elev); align-items: center; text-align: center; }
        .pd-accion--queswa .img { width: 92px; aspect-ratio: 1 / 1; background-size: cover;
          background-position: center; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem; }
        .pd-accion--queswa .d { font-size: clamp(0.9rem, 1.5vw, 1rem); color: var(--pd-muted); }
        .pd-pregunta { text-align: center; max-width: 920px; }
        .pd-pregunta .pd-bisagra { font-size: clamp(1.9rem, 5.2vw, 3.6rem); margin: 0; text-wrap: balance; }
        .pd-paneles--uno { grid-template-columns: minmax(0, 560px); justify-content: center; }
        .pd-credenciales { text-align: center; font-family: var(--font-mono); font-size: 0.6rem;
          letter-spacing: 0.2em; color: var(--pd-muted); text-transform: uppercase; margin: 0.5rem 0 0; }
        .pd-socio { display: inline-block; text-decoration: none; margin-top: 1.8rem; }
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
          .pd-cifras-lista--dos { grid-template-columns: 1fr; gap: 1.2rem; }
          .pd-acciones { grid-template-columns: 1fr; }
          .pd-accion { padding: 1rem 1.1rem; }
          .pd-accion--queswa .img { width: 60px; margin-bottom: 0.6rem; }
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
        .pd-sectores { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin-top: 2rem;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); }
        .pd-sector { background: var(--pd-bg); padding: clamp(1.4rem, 3vw, 2.4rem); }
        .pd-sector .k { font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.26em;
          color: var(--pd-data); }
        .pd-sector .t { font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.35rem, 3.2vw, 2.3rem); line-height: 1.12; color: #FFFFFF;
          margin: 0.7rem 0 0; }
        .pd-propuesta { font-family: var(--font-sans); font-weight: 700;
          font-size: clamp(1.35rem, 3.4vw, 2.3rem); line-height: 1.25; color: #FFFFFF;
          margin: 0 auto; max-width: 28ch; text-wrap: balance; }
        .pd-remate .pd-bisagra { text-align: center; }
        @media (max-width: 860px) {
          .pd-sectores { grid-template-columns: 1fr; }
          .pd-pares li { grid-template-columns: minmax(0, 10.5rem) 1.8rem 1fr; padding: 0.7rem 0; }
          /* Las cuatro palabras van sin corte; en el teléfono la letra baja para que
             quepan en el ancho y no abran un desplazamiento lateral. */
          .pd-propuesta { font-size: min(1.2rem, 5.1vw); }
        }
      ` }} />

      <div
        className="pd-root"
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
              {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pd-dot ${n === slide ? 'active' : ''} ${n < slide ? 'done' : ''}`}
                  onClick={() => irA(n)}
                  aria-label={`Ir a la pantalla ${n}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="pd-fs"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              <span className="pd-fs-largo">{isFullscreen ? 'SALIR' : 'PANTALLA COMPLETA'}</span>
              <span className="pd-fs-corto">{isFullscreen ? '✕' : '⛶'}</span>
            </button>
          </div>
        </div>

        {/* ── 1 · EN QUÉ CREEMOS (primera mitad) ─────────────────────── */}
        <section className={`pd-slide pd-credo pd-credo--solo ${slide === 1 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">En qué creemos</p>
            <h1>
              Creemos que nadie debería entregar su vida entera al ciclo de trabajar,
              pagar cuentas y repetir.
            </h1>
            <div className="pd-credo-rule" />
            <p className="pd-kicker">CreaTuActivo · Presentación</p>
          </div>
        </section>

        {/* ── 2 · LA OPORTUNIDAD ──────────────────────────────────────── */}
        {/* Palabras del Director (30 sep 2026). Los pares van como lista: la lista
            es la imagen, y el patrón se entiende sin explicarlo. */}
        <section className={`pd-slide ${slide === 2 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">La oportunidad</p>
            <h2 className="pd-h2 pd-h2--media">
              Hay una oportunidad enorme en modernizar industrias que están frente a
              nuestros ojos.
            </h2>
            <ul className="pd-pares">
              {PARES_MODERNIZACION.map(([de, a]) => (
                <li key={a}>
                  <span className="de">{de}</span>
                  <span className="fl">→</span>
                  <span className="a">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 3 · DOS SECTORES ────────────────────────────────────────── */}
        {/* «Network marketing» va ESCRITO (Director, 30 sep 2026): dentro de la ola
            de modernización se lee como oportunidad, y resolvió el «ah, es como
            Herbalife». ⚠️ Solo el nombre: cómo se hace hoy lo cuenta el socio en
            vivo. Describirlo aquí sería un juicio sin voz sobre el método de otros. */}
        <section className={`pd-slide ${slide === 3 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">Dónde la vemos</p>
            <h2 className="pd-h2 pd-h2--media">Nosotros vemos esa oportunidad en dos sectores:</h2>
            <div className="pd-sectores">
              <div className="pd-sector">
                <span className="k">01</span>
                <p className="t">La industria del network marketing</p>
              </div>
              <div className="pd-sector">
                <span className="k">02</span>
                <p className="t">El sector laboral</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4 · EL SECTOR LABORAL ───────────────────────────────────── */}
        <section className={`pd-slide ${slide === 4 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          <div className={`pd-beat ${slide === 4 && beat === 0 ? 'on' : ''}`}>
            <div className="pd-wrap">
              <p className="pd-eyebrow">El sector laboral</p>
              {/* La fila del banco retoma el par de Nequi de la pantalla 2: el
                  trabajo es la próxima fila por modernizar. */}
              <h2 className="pd-h2 pd-h2--media">
                Así como nos acostumbramos a hacer la fila del banco, aprendimos que solo
                había dos caminos para ganar.
              </h2>
              <p className="pd-p pd-p--grande">
                Emplearse, o trabajar como independiente: en ventas, con un negocio
                propio o con una empresa.
              </p>
              <p className="pd-p pd-p--grande pd-gold">
                Y todos manifiestan el mismo dolor: inestabilidad e incertidumbre hacia
                el futuro.
              </p>
              {/* El remate de los veinte: sin él, quien gana bien se exime. */}
              <p className="pd-p" style={{ color: 'var(--pd-muted)' }}>
                Y le pasa exactamente igual al que gana dos millones y al que gana más de
                veinte.
              </p>
            </div>
          </div>
          <div className={`pd-beat ${slide === 4 && beat === 1 ? 'on' : ''}`}>
            <div className="pd-wrap pd-cifras" style={{ maxWidth: 940 }}>
              {/* Las dos cifras prueban las dos palabras: el ingreso que no alcanza
                  es la inestabilidad; la pensión que no llega, la incertidumbre. */}
              <p className="pd-eyebrow">El mismo dolor, en cifras</p>
              <div className="pd-cifras-lista pd-cifras-lista--dos">
                {CIFRAS_PROBLEMA.slice(0, 2).map((c) => (
                  <div className="pd-cifra" key={c.n}>
                    <p className="n">{c.n}</p>
                    <p className="t">{c.texto}</p>
                    <p className="f">{c.fuente}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 · LAS TRES PIEZAS (oscilación) ────────────────────────── */}
        <section className={`pd-slide ${slide === 5 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          {/* Beat 0: la propuesta, en palabras del Director (30 sep 2026). «Le vamos
              a dar» pasó a «le damos»: se afirma, no se anuncia. La primera línea es
              la frase aprobada del 26 sep, que se quedó sin pantalla. */}
          <div className={`pd-beat ${slide === 5 && beat === 0 ? 'on' : ''}`}>
            <div className="pd-remate">
              <p className="pd-eyebrow" style={{ textAlign: 'center' }}>La propuesta</p>
              <p className="pd-preparacion">
                Hoy, la mayoría de las personas siente que tiene que hacer algo.
              </p>
              <p className="pd-propuesta">
                Le damos la oportunidad de montar una{' '}
                <span className="pd-gold">empresa&nbsp;de&nbsp;distribución&nbsp;moderna</span>{' '}
                a su nombre, similar a Uber, Rappi o Nequi.
              </p>
              <p className="pd-bisagra" style={{ marginTop: '1.6rem' }}>Se requieren tres elementos:</p>
            </div>
          </div>

          {/* Beats 1-3: cada pieza a solas y grande */}
          {[0, 1, 2].map((i) => (
            <div key={i} className={`pd-beat ${slide === 5 && beat === i + 1 ? 'on' : ''}`}>
              <div className="pd-pieza">
                <div className="pd-figura" style={{ backgroundImage: `url(${PIEZAS[i].img})` }} />
                <div>
                  <p className="pd-eyebrow">Cómo funciona · {i + 1} de 3</p>
                  <p className="pd-pieza-label">{PIEZAS[i].label}</p>
                  <p className="pd-p">{PIEZAS[i].sub}</p>
                  {PIEZAS[i].extra && <p className="pd-p pd-gold">{PIEZAS[i].extra}</p>}
                  {/* Los hechos verificables viven aquí y no en la pantalla 4 (Director,
                      24 sep 2026): es la pieza que los reclama. Van como ESTATUS —hay
                      una empresa grande detrás—, nunca como alegato: nadie escoge al
                      niño impopular porque le muestren el boletín de notas. */}
                  {i === 1 && (
                    <button
                      type="button"
                      className="pd-demo"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('open-queswa'));
                      }}
                    >
                      PREGÚNTELE ALGO AHORA →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Beat 3: las tres oscilando */}
          <div className={`pd-beat ${slide === 5 && beat === 4 ? 'on' : ''}`}>
            <div className="pd-wrap" style={{ textAlign: 'center' }}>
              <p className="pd-eyebrow" style={{ textAlign: 'center' }}>Cómo funciona</p>
              <div className="pd-tres">
                {PIEZAS.map((p) => (
                  <div className="col" key={p.label}>
                    <div className="pd-figura" style={{ backgroundImage: `url(${p.img})` }} />
                    <p className="cap">{p.label}</p>
                  </div>
                ))}
              </div>
              <p className="pd-p" style={{ margin: '2rem auto 0', textAlign: 'center' }}>
                Un fabricante… una tecnología que atiende… su aplicación…
              </p>
            </div>
          </div>

          {/* Beat 4: el remate */}
          <div className={`pd-beat ${slide === 5 && beat === 5 ? 'on' : ''}`}>
            {/* JERARQUÍA EN TRES TIEMPOS (Director, 24 sep 2026: «distribuye mejor los
                textos»). Antes eran cuatro bloques del mismo peso apilados y el remate
                se leía como un párrafo. Ahora: la preparación en pequeño y apagada, el
                golpe en grande y dorado, y el cierre en dos frases cortas separadas —
                el punto y coma metía las dos ideas en un solo renglón denso.
                La ley de la multiplicación vive AQUÍ desde el 27 sep 2026 (la pieza 3
                pasó a ser la aplicación personalizada) y remata haciendo eco de «ya
                está armada». ⛔ Los dos pasos NO se listan en el remate: se probaron
                ese mismo día y el Director los retiró («este texto sobra») — qué HACE
                la persona lo cuenta Queswa en vivo (EAM_01), no esta pantalla. También
                salió «decidir y conectar», doctrina interna que no se le da al
                prospecto. */}
            <div className="pd-remate">
              <p className="pd-preparacion">No son tres cosas que usted tenga que conseguir.</p>

              {/* LA FUSIÓN — el pago visual de la oscilación (24 sep 2026). Este beat
                  era el ÚNICO sin gráfica: después de cuatro pantallas con la imagen
                  de protagonista, el clímax llegaba en puro texto y con media pantalla
                  en negro. Son las mismas tres figuras del beat anterior, ahora sin
                  separación y dentro de un solo marco dorado: se VE que son una.
                  Es el movimiento de Jobs — estos no son tres aparatos, es uno solo.
                  ⚠️ Sin rótulos: ya se nombraron una por una en los beats 0-2 y otra
                  vez en el 3. Aquí la imagen tiene que hablar sola. */}
              <div className="pd-fusion">
                {PIEZAS.map((p) => (
                  <div
                    key={p.label}
                    className="pd-fusion-parte"
                    style={{ backgroundImage: `url(${p.img})` }}
                  />
                ))}
              </div>

              {/* EL REMATE ES LA MECÁNICA DE JOBS COMPLETA (Director, 28 sep 2026):
                  negar los tres → afirmar el uno → NOMBRAR («…y lo hemos llamado
                  iPhone»). El golpe volvió a «Es una sola» sin sustantivo —la
                  aplicación ya tiene su pieza y su beat— para que el nombre caiga
                  como revelación en su propia línea, no como redundancia. La línea
                  aparte «Lo que usted recibe es…» se fundió aquí: decía qué recibe
                  por segunda vez y diluía el golpe.
                  ⛔ Las cuatro palabras del nombre van JUNTAS en una sola línea
                  (espacios duros + tamaño propio): un corte que deje «distribución
                  moderna» sola a la vista es la jerga del canal de supermercados
                  (doctrina 28 sep). El corte del golpe sigue en la coma: el titular
                  rompía en «…Y YA ESTÁ / ARMADA.» y dejaba huérfana la palabra que
                  carga el remate. */}
              <p className="grande">
                Es una sola,<br />y ya está armada:
              </p>
              <p className="grande grande--nombre">
                su&nbsp;empresa&nbsp;de&nbsp;distribución&nbsp;moderna.
              </p>
              <p className="marca">CreaTuActivo.com</p>
            </div>
          </div>

          {/* Beat 6: la propiedad. Es el «ajá» de WHY_02, y explica el «a su
              nombre» de la propuesta. */}
          <div className={`pd-beat ${slide === 5 && beat === 6 ? 'on' : ''}`}>
            <div className="pd-remate">
              <p className="pd-eyebrow" style={{ textAlign: 'center' }}>La diferencia</p>
              <p className="grande">Cada cliente que llega por su enlace queda a su nombre.</p>
            </div>
          </div>
        </section>

        {/* ── 6 · QUÉ HACE USTED ──────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 6 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          <div className={`pd-beat ${slide === 6 && beat === 0 ? 'on' : ''}`}>
            <div className="pd-wrap" style={{ maxWidth: 1040 }}>
              <p className="pd-eyebrow">Qué hace usted</p>
              <h2 className="pd-h2">Su día a día se resume en dos acciones.</h2>
              {/* EAM_01, con Queswa dibujada ENTRE las dos acciones. */}
              <div className="pd-acciones">
                <div className="pd-accion">
                  <span className="k">01</span>
                  <p className="t">Compartir</p>
                  <p className="d">Usted pasa un enlace a quien quiera.</p>
                </div>
                <div className="pd-accion pd-accion--queswa">
                  <div className="img" style={{ backgroundImage: 'url(/images/servilleta/colapso-conversacion.webp)' }} />
                  <p className="d">
                    Entre las dos está Queswa: conversa con cada persona que llega, resuelve
                    sus dudas y madura su decisión de avanzar. Cuando alguien está listo, le
                    avisa.
                  </p>
                </div>
                <div className="pd-accion">
                  <span className="k">02</span>
                  <p className="t">Recibir</p>
                  <p className="d">Usted saluda a quien llega con interés.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`pd-beat ${slide === 6 && beat === 1 ? 'on' : ''}`}>
            <div className="pd-remate">
              <p className="grande">Solo se multiplica lo que es sencillo.</p>
              <p className="pd-p pd-cierre-linea">
                Quien inicia con usted hace exactamente lo mismo, con las mismas dos acciones.
              </p>
              <p className="pd-p pd-cierre-linea">
                De ahí salen la multiplicación de su negocio y el aumento de su facturación.
              </p>
            </div>
          </div>
        </section>

        {/* ── 7 · EL PRODUCTO ─────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 7 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-foto" style={{ backgroundImage: 'url(/images/servilleta/producto-cafe.webp)' }} />
          <div className="pd-wrap">
            <div className="pd-producto">
              <div>
                <p className="pd-eyebrow">El producto</p>
                {/* LA TAZA ES LA PUERTA DE ENTRADA, NO EL CAFÉ DE SIEMPRE (Director, 26 sep
                    2026). Decía «Un hábito que no cambia» y «El café de siempre»: el marco
                    del consumo diario, vetado porque pone el producto en el estante del
                    supermercado. Ahora el café es la entrada a la línea (PROD_01 del
                    catálogo), y el «todo» anuncia que detrás viene más: la pantalla no
                    reduce el negocio a vender café.
                    ⛔ Salió la ciencia usada para vender —«el hongo más estudiado del
                    planeta, con más de 2.000 estudios»—: el 3 en 1 está registrado como
                    ALIMENTO, y la ciencia al servicio de la venta deja de ser información y
                    pasa a ser publicidad (NUCLEO_EVIDENCIA, wa-guardarrail-salud.ts).
                    Lo sensorial es de BEB_07; «no se queda nada en el fondo de la taza» es
                    del Director, y habla de la composición, no de la absorción. */}
                <h2 className="pd-h2">Todo empieza con una taza premium.</h2>
                <p className="pd-p">
                  Café de cuerpo, aroma y el amargo justo de una buena cafetería, con el
                  extracto de Ganoderma que Gano Excel cultiva y extrae por su cuenta. Se
                  disuelve por completo: no se queda nada en el fondo de la taza.
                </p>
                {/* LA RECOMPRA POR RESULTADO, verbatim de PROD_01 (aprobado 24 sep 2026).
                    Prepara la pantalla 8: aquí se dice por qué el cliente vuelve; allá, por
                    qué esa recompra le paga. El dinero NO entra en esta pantalla.
                    ⚠️ «Incorpora a su rutina» es la fórmula aprobada; lo vetado es el
                    producto como algo que ya se consume. Y nunca «vuelve porque se le
                    acaba»: vuelve porque nota la diferencia. */}
                <p className="pd-p pd-gold">
                  Su cliente lo incorpora a su rutina, nota la diferencia y vuelve a pedirlo
                  el mes siguiente.
                </p>
                <p className="pd-cats-lead">El mismo extracto va en toda la línea</p>
                <div className="pd-cats">
                  {CATEGORIAS.map((c) => (
                    <button
                      type="button"
                      className="pd-cat"
                      key={c.label}
                      style={{ backgroundImage: `url(${c.img})` }}
                      aria-label={`Ver la línea ${c.label} en grande`}
                      onClick={(e) => { e.stopPropagation(); setVisor({ src: c.img, alt: `Línea ${c.label}` }); }}
                    >
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="pd-link"
                  onClick={(e) => { e.stopPropagation(); setVisor({ src: '/productos/productos.webp', alt: 'Portafolio de productos Gano Excel' }); }}
                >
                  VER TODO EL PORTAFOLIO →
                </button>
              </div>

              <div className="pd-ficha panel">
                {/* OFICIO, NO CIENCIA (Director, 26 sep 2026). Salieron «Estudios
                    publicados 2.000+», «Compuestos bioactivos 200+» y «pionero mundial»
                    (superlativo sin fuente). Quedan datos de CÓMO SE HACE —el híbrido, el
                    cultivo propio, los años de proceso—, nunca de lo que hace en el cuerpo.
                    El doctor queda como el origen del producto, no como autoridad
                    científica. Fuente: la respuesta del catálogo sobre el Ganoderma.
                    ⚠️ «lucidum» con minúscula: es nombre de especie (el CSS lo pone en
                    mayúsculas igual). */}
                <div className="titulo">Ganoderma lucidum</div>
                <div className="pd-fila">
                  <span className="k">Variedades en el híbrido</span>
                  <span className="v">6</span>
                </div>
                <div className="pd-fila">
                  <span className="k">Cultivo y extracción</span>
                  <span className="v">Propios</span>
                </div>
                <div className="pd-fila">
                  <span className="k">Años de proceso</span>
                  <span className="v">Más de 30</span>
                </div>
                <p className="pie">
                  Los seis colores del Reishi en un solo híbrido, obra del{' '}
                  <strong>Dr. Leow Soon Seng</strong>, micólogo malasio que estudia este
                  hongo desde 1983.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8 · LA PREGUNTA ─────────────────────────────────────────── */}
        {/* Sola, justo antes del dinero (caso Marlon, 26 sep 2026): con los detalles
            el prospecto se oscurece, y lo que lo devuelve es una pregunta que él
            contesta. Las cifras ya se dieron con el problema, en la 2. */}
        <section className={`pd-slide ${slide === 8 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap pd-pregunta">
            <p className="pd-bisagra">¿Y usted, qué plan tiene para salir del ciclo?</p>
          </div>
        </section>

        {/* ── 9 · CÓMO SE GANA ────────────────────────────────────────── */}
        <section className={`pd-slide pd-numeros ${slide === 9 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          {/* Beat 0 — LO PRINCIPAL: el ingreso que se repite, con los 12 niveles
              desde el Kit. */}
          <div className={`pd-beat ${slide === 9 && beat === 0 ? 'on' : ''}`}>
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
              <h2 className="pd-h2">
                Cada vez que sus clientes y sus distribuidores vuelven a pedir, a usted le
                queda un porcentaje.
              </h2>
              <p className="pd-p pd-numeros-lead">
                Así se ve si su sistema crece de a dos, empezando por el Kit de Inicio.
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
                  <h3>Los 12 niveles (2×2)</h3>
                  <div className="pd-niveles">
                    {PROYECCION_12.map((n) => (
                      <button
                        key={n.level}
                        type="button"
                        className={`pd-nivel ${n.level === nivel12 ? 'active' : ''} ${n.level < nivel12 ? 'done' : ''}`}
                        onClick={() => setNivel12(n.level)}
                        aria-label={`Nivel ${n.level}`}
                      >
                        {n.level}
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

                  <label className="pd-label">
                    Recorra los 12 niveles<b>Nivel {nivel12}</b>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={nivel12}
                    onChange={(e) => setNivel12(parseInt(e.target.value))}
                    className="pd-slider"
                    style={{ ['--thumb' as string]: `${thumbNivel}px` } as React.CSSProperties}
                  />
                  <div className={`pd-tarifa-notas ${tarifa.meses > 0 ? 'temporal' : ''}`}>
                    <p className="pd-insight pd-tarifa-general">
                      Cada nivel duplica su sistema (2×2). Regalía mensual proyectada: el{' '}
                      {tarifa.pct}% del volumen comisionable (GCV) de su sistema.
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
            </div>
          </div>

          {/* Beat 1 — EL BONO POR PAQUETES (Director, 30 sep 2026). Va DESPUÉS de lo
              principal: quien inicia muchas veces necesita ganar pronto, y un deck que
              no lo muestra parece haberlo olvidado. ⚠️ Se nombra por lo que lo mueve
              —la compra de un paquete— y por su función —financia el crecimiento al
              inicio—, NUNCA por su velocidad («rápido», «inmediato»): esa palabra la
              pone el socio en vivo con su propia historia, que tampoco va a la
              pantalla. Se cuentan PAQUETES COMPRADOS, nunca personas. */}
          <div className={`pd-beat ${slide === 9 && beat === 1 ? 'on' : ''}`}>
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
              <h2 className="pd-h2">
                Y cada paquete empresarial que se compra en su sistema le deja un bono.
              </h2>
              <p className="pd-p pd-numeros-lead">
                Hasta la quinta generación. Es lo que financia el crecimiento al inicio.
              </p>
              <div className="pd-paneles pd-paneles--uno">
                <div className="panel panel--gen5">
                  <h3>Ingreso por paquetes</h3>
                  <div className="pd-display">{monto(ingresoGen5COP)}</div>
                  <div className="pd-gens">
                    {gen5Por.map((usd, i) => (
                      <div key={i} className="pd-gen">
                        <span className="k">Gen {i + 1}</span>
                        <span className="v">{montoCorto(gen5Paquetes * usd * TRM)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pd-pkgs">
                    {(['ESP1', 'ESP2', 'ESP3'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`pd-pkg ${gen5Nivel === p ? 'active' : ''}`}
                        onClick={() => setGen5Nivel(p)}
                      >
                        {p === 'ESP1' ? 'Inicial' : p === 'ESP2' ? 'Empresarial' : 'Visionario'}
                      </button>
                    ))}
                  </div>
                  <label className="pd-label">
                    Paquetes comprados en cada generación<b>{gen5Paquetes}</b>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={gen5Paquetes}
                    onChange={(e) => setGen5Paquetes(parseInt(e.target.value))}
                    className="pd-slider"
                  />
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

        {/* ── 10 · EL SIGUIENTE PASO ──────────────────────────────────── */}
        {/* La segunda mitad del credo cierra el deck: el cuerpo ya mostró cómo el
            esfuerzo se vuelve capital (el cliente a su nombre que vuelve a pedir).
            La conversación es con el socio del ?ref, para cuando el deck se envía. */}
        <section className={`pd-slide pd-final ${slide === 10 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">En qué creemos</p>
            <p className="pd-final-credo">
              Creemos que el esfuerzo de la gente que sabe trabajar debería convertirse
              en capital real.
            </p>
            <p className="pd-p">
              Acompañamos a cada socio nuevo uno a uno, y eso no alcanza para todos a la
              vez. Por eso el acceso va por lista de espera.
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
            <div className="pd-credo-rule" />
            <p className="pd-kicker">CreaTuActivo.com</p>
          </div>
        </section>

        <div className="pd-counter">
          {slide} / {TOTAL_SLIDES}
        </div>

        {/* ── Modal del portafolio ────────────────────────────────────── */}
        {visor && (
          <div
            className="pd-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={visor.alt}
            onClick={() => setVisor(null)}
          >
            <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="pd-close"
                onClick={() => setVisor(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={visor.src} alt={visor.alt} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
