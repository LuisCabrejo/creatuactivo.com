'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /pitch-deck — la herramienta de presentación 1-a-1 (23 sep 2026).
 *
 * POR QUÉ EXISTE, Y POR QUÉ NO ES UN FORK DE /servilleta
 * ------------------------------------------------------
 * La servilleta y /12-niveles se dejaron a un lado a propósito (decisión del
 * Director). Esta pieza tiene otra gramática: es un PITCH DECK — se abre por lo
 * que creemos (de adentro hacia afuera), reclama el momento, narra el villano,
 * nombra un defecto de diseño y remata con la oscilación de Jobs. Forkear 2.900
 * líneas de card-scrollers con b-rolls habría traído mecánica que aquí estorba.
 * Lo que SÍ se reutiliza es lo aprobado: la ficha del producto y los dos
 * simuladores (el de la servilleta y el de los 12 niveles de /12-niveles).
 *
 * LA ESPINA (9 pantallas)
 * -----------------------
 *  1 QUÉ CREEMOS   · el credo, verbatim aprobado (Home v16, apertura del canal,
 *                    WHY_01). Hace de primera diapositiva de pitch deck porque
 *                    dice quiénes somos y el problema en la misma respiración.
 *  2 EL PROBLEMA   · «Aprendimos dos caminos»: el socio los narra en vivo con su
 *                    propia historia, y la pantalla sostiene adónde llevan los
 *                    dos — el mismo ciclo, la bicicleta estática y el remate
 *                    «al que gana dos y al que gana más de veinte». Sin el
 *                    remate, quien gana bien se exime y se acaba la charla.
 *  3 POR QUÉ AHORA · va DESPUÉS del problema (Director, 26 sep 2026): el «por
 *                    qué ahora» solo pega si el oyente ya sabe qué era
 *                    imposible. Hacer empresa siempre fue difícil; una empresa
 *                    moderna de distribución, casi imposible; hoy la ponen en un
 *                    celular CreaTuActivo.com y Queswa.app. Sin cifras.
 *  4 LA OPORTUNIDAD· tres líneas y nada más (Director, 24 sep): el titular cruza
 *                    la bicicleta de la 2 y la paga, la tesis de la conectividad
 *                    («el sistema que conecta, no el que produce») y el cierre
 *                    que baja la amenaza («no es cambiar de vida, es modernizar
 *                    la forma de hacer empresa»). ⛔ NO se nombra el gremio ni se
 *                    invoca el fantasma de perseguir conocidos: eso es el
 *                    SÍNTOMA, y enunciarlo se lo planta a quien no lo traía.
 *  5 LAS TRES      · la oscilación (5 beats). Aquí se va la mitad del tiempo.
 *                    El beat del fabricante carga los hechos verificables, que
 *                    es la pieza que los reclama. Y el remate se lleva la ley de
 *                    la multiplicación —vivía en la 4 hasta el 24 sep— porque
 *                    aquí es donde se cumple: lo que se transmite no es una
 *                    habilidad sino esto mismo, armado. Así la multiplicación
 *                    queda como CONSECUENCIA y no como un tercer paso.
 *  6 EL PRODUCTO   · la taza premium como puerta de entrada a la línea, la
 *                    recompra por resultado (prepara la 8) y una ficha de
 *                    oficio —híbrido, cultivo propio, años—, sin ciencia.
 *  7 EL PROBLEMA,  · tres cifras verificadas y una pregunta, justo antes del
 *    EN CIFRAS       dinero (Director, 26 sep 2026): con los detalles el prospecto
 *                    se oscurece, y lo que lo devuelve es re-aterrizar el
 *                    problema. Cierra en «¿Y usted, qué plan tiene…?».
 *  8 LOS NÚMEROS   · el modelo en una frase («cada cliente que llega por su
 *                    enlace queda a su nombre») y dos simuladores: el Bono GEN5
 *                    hasta la quinta generación y los 12 niveles con el
 *                    porcentaje de cada forma de iniciar. Pesos por defecto.
 *  9 EL SIGUIENTE  · la petición, y el deck cierra como abrió: la segunda mitad
 *    PASO            del credo, la lista de espera dicha como hecho, y «El
 *                    siguiente paso es una conversación» — una afirmación, no
 *                    una pregunta (Director, 26 sep 2026).
 *
 * REGLAS QUE ROMPEN ALGO SI SE TOCAN
 * ----------------------------------
 *  · El botón «PREGÚNTELE ALGO AHORA» es el clímax real de la 5: la tecnología
 *    deja de ser un claim y pasa a ser una experiencia. Por eso /pitch-deck está
 *    en RUTAS_ORBE_QUESWA_WEB (orbe-config.ts) y en `isDeck` de UnifiedQueswaOrb
 *    — mandar esa demo a WhatsApp la rompe: saca al prospecto de la reunión.
 *  · Moneda: pesos con PUNTO de miles, dólares con COMA. Por eso los locales van
 *    explícitos ('es-CO' / 'en-US') y no un toLocaleString() pelado, que depende
 *    del navegador de quien presenta.
 *  · En el simulador NO conviven precio de entrada y comisión — eso es promesa
 *    de ingreso. Aquí solo hay comisiones; los precios viven en /paquetes.
 *  · Swipe: solo los <input> (sliders) exoneran el gesto. No añadir paneles ni
 *    botones a esa lista — bloquea el swipe-back de la última pantalla.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const TOTAL_SLIDES = 9;

/** Beats internos por pantalla. Solo la 5 (la oscilación) tiene más de uno. */
const BEATS: Record<number, number> = { 5: 5 };
const beatsOf = (slide: number) => BEATS[slide] ?? 1;

/** Las tres piezas. Mismo lenguaje 3D (objeto gris, fondo negro, piso blanco):
 *  que se vean hechas del mismo material es lo que vuelve creíble «es una sola». */
const PIEZAS: { label: string; img: string; sub: string; extra?: string }[] = [
  {
    label: 'UN FABRICANTE',
    img: '/images/servilleta/colapso-fabrica.webp',
    sub: 'Gano Excel fabrica, almacena y despacha. Treinta años haciéndolo, en más de sesenta países.',
  },
  {
    label: 'UNA TECNOLOGÍA QUE ATIENDE',
    img: '/images/servilleta/colapso-conversacion.webp',
    sub: 'Queswa conversa con cada interesado, le resuelve las dudas y madura su decisión de avanzar. A toda hora.',
    // LA SEGUNDA CARA (Director, 24 sep 2026). La pieza hablaba solo de los
    // prospectos, y buena parte de lo construido vive del otro lado: en el Centro
    // de Mando, donde Queswa es el asistente del distribuidor. Sin esto el
    // prospecto oye que la tecnología atiende a otros y no ve qué hace por él.
    // ⚠️ Va en MECANISMO y no en resultado: qué hace, no a dónde lo lleva.
    // «Pasar de donde está a donde quiere estar» es voz de coach y queda fuera.
    extra: 'Y con usted trabaja aparte: conoce sus metas, le redacta lo que va a enviar y le avisa cuando alguien queda listo.',
  },
  {
    label: 'DOS PASOS SENCILLOS',
    img: '/images/servilleta/colapso-metodo-v2.webp',
    sub: 'Usted comparte. Y recibe a quien llega interesado.',
    // La ley de la multiplicación vive aquí (Director, 24 sep 2026): es la pieza
    // que habla de lo sencillo, así que es donde la ley se comprueba sola. Venía
    // del remate, donde competía con «es una sola, y ya está armada».
    extra: 'Solo se multiplica lo que es sencillo. Y lo que se transmite no es una habilidad: es esto mismo, armado.',
  },
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

/** Las tres cifras de «El problema, en cifras» (aprobadas por el Director, 26 sep
 *  2026). Cada una se verificó en su fuente primaria ese día; si se cambia una, se
 *  vuelve a la fuente — no a un artículo que la cite.
 *  · DANE, Encuesta Nacional de Calidad de Vida 2025 (anexo, cuadro 35): el 31,3 %
 *    de los hogares dice que su ingreso «no alcanza para cubrir los gastos mínimos»
 *    y el 61,0 % que «alcanza para cubrir los gastos mínimos»; solo el 7,7 % que
 *    «cubre más». Se usa la SUMA (92,3 %) a propósito: el «no alcanza» solo viene
 *    bajando desde 2022, mientras que el «cubre más» lleva entre 7 y 8 % desde 2019.
 *    https://www.dane.gov.co/files/operaciones/ECV/anex-ECV-2025.xlsx
 *  · GEM 2023/2024 Global Report, perfil de Colombia (datos 2023, adultos de 18 a
 *    64): «good opportunities to start a business in my area» 60,0 %; TEA 23,6 %
 *    («just under one in four», puesto 7 de 46). Colombia no participó en 2024 ni
 *    en 2025: por eso va con su año. La TEA cuenta negocios NUEVOS (hasta 42
 *    meses), y por eso la frase dice «que abrió hace poco».
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
    n: '6 de cada 10',
    texto: 'adultos en Colombia ven buenas oportunidades para emprender donde viven.',
    fuente: 'Global Entrepreneurship Monitor · 2023',
  },
  {
    n: 'Casi 1 de cada 4',
    texto: 'ya está empezando un negocio propio, o maneja uno que abrió hace poco.',
    fuente: 'Global Entrepreneurship Monitor · 2023',
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
  const [gen5Nivel, setGen5Nivel] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [nivel12, setNivel12] = useState(12);
  const [tarifa12, setTarifa12] = useState(0); // índice en TARIFAS_12: el Kit, al 10%

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
      <style>{`
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

        /* ── 4 · Hechos verificables ─────────────────────────────────────── */
        .pd-hechos {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1px; background: rgba(255,255,255,0.07); margin-top: 2.6rem;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pd-hecho { background: var(--pd-bg); padding: 1rem 1.1rem; }
        /* Dentro de la pieza del fabricante van más apretados: comparten la columna
           con el rótulo y su línea, y el protagonista ahí es la imagen. */
        .pd-hechos--pieza { margin-top: 1.5rem; grid-template-columns: repeat(2, 1fr); }
        .pd-hechos--pieza .pd-hecho { padding: 0.6rem 0.75rem; }
        .pd-hechos--pieza .k { font-size: 0.5rem; margin-bottom: 0.25rem; }
        .pd-hechos--pieza .v { font-size: 0.78rem; }
        .pd-hecho .k {
          font-family: var(--font-mono); font-size: 0.55rem; letter-spacing: 0.2em;
          color: var(--pd-data); text-transform: uppercase; display: block; margin-bottom: 0.4rem;
        }
        .pd-hecho .v { font-size: 0.9rem; color: var(--pd-text); }

        /* ── 5 · La oscilación ───────────────────────────────────────────── */
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

        /* ── 6 · Producto ────────────────────────────────────────────────── */
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

        /* ── 7 · El problema, en cifras ───────────────────────────────────── */
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

        /* ── 8 · Números ─────────────────────────────────────────────────── */
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
        .pd-insight.pd-vigencia { margin-top: 0.6rem; }
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

        /* ── 9 · El siguiente paso ───────────────────────────────────────── */
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
          .pd-hechos { grid-template-columns: 1fr 1fr; }

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
          .pd-numeros .panel:first-child .pd-insight { display: none; }
          .pd-numeros .panel:first-child .pd-slider { margin-bottom: 1.2rem; }
          .pd-numeros .pd-insight:has(+ .pd-vigencia) { display: none; }
          .pd-numeros .pd-insight.pd-vigencia { margin-top: 0; }
          /* La tira de las cinco generaciones sumó ~45px (26 sep 2026): se recuperan
             en márgenes y en el conteo de distribuidores, que cabe en una línea. */
          .pd-numeros .panel h3 { margin-bottom: 0.7rem; }
          .pd-numeros .pd-gens { margin: 0.7rem 0 0.8rem; }
          .pd-numeros .panel:first-child .pd-slider { margin-bottom: 0.8rem; }
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
          .pd-bisagra { font-size: clamp(1.3rem, 6vw, 1.9rem); margin: 1.2rem 0 0.8rem; }
          .pd-credo h1, .pd-credo .pd-credo-linea { font-size: clamp(1.3rem, 5.4vw, 2rem); margin-bottom: 1rem; }
          .pd-credo-rule { margin: 1.4rem 0 0.9rem; }
          .pd-hechos { margin-top: 1.4rem; }
          .pd-hecho { padding: 0.7rem 0.85rem; }
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
          .pd-hechos { grid-template-columns: repeat(4, 1fr); }
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
      `}</style>

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

        {/* ── 1 · QUÉ CREEMOS ─────────────────────────────────────────── */}
        <section className={`pd-slide pd-credo ${slide === 1 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">En qué creemos</p>
            <h1>
              Creemos que nadie debería entregar su vida entera al ciclo de trabajar,
              pagar cuentas y repetir.
            </h1>
            {/* ⚠️ SEGUNDA MITAD PROPIA DEL DECK (Director, 24 sep 2026). En el resto
                del sitio el credo remata en «Creemos en empoderar a las personas para
                que recuperen el control de su tiempo y de su dinero» — Home v16, la
                apertura del canal y WHY_01 🔒. Aquí la reemplaza esta, que conserva la
                anáfora y la mecánica de Nu (adversario, absolución, restitución: el
                esfuerzo se restituye en capital), y además nombra al oyente: «la gente
                que sabe trabajar» lo honra en vez de diagnosticarlo, y «capital real»
                eleva el registro desde las finanzas.
                ⚠️ LAS DOS FRASES LLEVAN EL MISMO MOLDE, «creemos que… debería» (Director,
                26 sep 2026): una norma negativa y una positiva. La versión anterior
                —«Creemos en entregarle una herramienta de alto nivel a…»— desentonaba
                por tres cosas: lo que se creía era la entrega de un producto (una
                oferta, no una creencia; «empoderar» se sostiene porque es una postura),
                el «entregar» repetido con sentido opuesto armaba un trueque (usted le
                dio su vida al ciclo, nosotros le damos una herramienta), y el
                protagonista pasaba a ser la casa. ⛔ La herramienta NO vuelve a esta
                pantalla, ni disfrazada de «el sistema correcto»: esa es frase de cajón
                de la industria y le roba la revelación a la pantalla 4. Llega en la 5.
                ⛔ Tampoco «sobrevivir al mes a mes»: es juicio de cantidad y deja
                eximirse al que gana veinte, contra el remate de la pantalla 2.
                ⚠️ Esto deja al deck DIVERGENTE del credo desplegado en los otros tres
                sitios. Si se decide propagarla, se toca junto: page.tsx de la Home,
                wa-apertura.ts y el candado de WHY_01.
                ⚠️ Va en <p> y no en <h1>: solo puede haber un h1 por página. */}
            <p className="pd-credo-linea segunda">
              Creemos que el esfuerzo de la gente que sabe trabajar debería convertirse
              en capital real.
            </p>
            <div className="pd-credo-rule" />
            <p className="pd-kicker">CreaTuActivo · Presentación</p>
          </div>
        </section>

        {/* ── 2 · EL PROBLEMA ─────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 2 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">El problema</p>
            <h2 className="pd-h2">Aprendimos dos caminos.</h2>
            {/* VA ANTES DEL «POR QUÉ AHORA» (Director, 26 sep 2026). Hasta ese día el
                orden era credo → momento → problema: la pantalla del momento contaba
                el problema y lo resolvía en la misma respiración, y a esta solo le
                quedaba volver al ciclo que el credo ya había dicho. Es el orden de un
                pitch deck: el «por qué ahora» solo pega si el oyente ya sabe qué era
                imposible.
                ⚠️ «Aprendimos» y no «Nos enseñaron»: el que presenta se incluye en vez
                de señalar a otros, y aquí cuenta su propia historia.
                Los dos caminos los NARRA el socio en vivo (Director, 24 sep): la
                pantalla solo sostiene el ciclo, que es donde los dos desembocan.
                ⚠️ «Los dos terminan en el mismo ciclo», y no la tríada otra vez: esta
                pantalla va pegada al credo, y «trabajar, pagar cuentas y repetir» en
                dos pantallas seguidas cansa. «El mismo» la retoma sin repetirla.
                ⚠️ La analogía cierra DENTRO de su propia imagen: «pero sigue en el
                mismo punto» es la física de la bicicleta estática, no una segunda
                tesis (Director, 25 sep). Lo que sigue vetado es el remate LITERAL
                —«pero financieramente avanza muy poco»—, que traduce la imagen a
                dinero y deja al oyente con dos tesis. La frase sin ninguna
                consecuencia quedaba colgando en «con todas sus fuerzas».
                ⛔ El remate de los veinte millones NO se toca aunque la propuesta lo
                omitía: existe para que quien gana bien no se exima («ese no es mi
                caso») — y el mercado de esta herramienta es justamente gente que gana
                bien. Sin él la conversación se acaba en silencio. */}
            <p className="pd-p">
              Los dos terminan en el mismo ciclo. Es como estar en una bicicleta
              estática: usted le da y le da con todas sus fuerzas, pero sigue en el
              mismo punto.
            </p>
            <p className="pd-p pd-gold">
              Y le pasa exactamente igual al que gana dos millones y al que gana más de
              veinte.
            </p>
          </div>
        </section>

        {/* ── 3 · POR QUÉ AHORA ───────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 3 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            {/* «Por qué ahora» y no «El momento» (Director, 26 sep 2026): el rótulo
                dice qué pregunta responde la pantalla. */}
            <p className="pd-eyebrow">Por qué ahora</p>
            {/* EL TITULAR ES UNA FRASE QUE LA PERSONA SE RECONOCE DICIENDO —«siento que
                tengo que hacer algo»— y no un diagnóstico en voz de coach (Director,
                26 sep 2026). De paso pone a la mayoría del lado de actuar: el estigma
                de esta categoría es de popularidad, no de fraude.
                ⚠️ LOS DOS «HOY» SON DELIBERADOS: abren y cierran la pantalla alrededor
                del «hasta hace poco». El primero es la necesidad; el segundo, lo que ya
                la resuelve. Reemplaza a «Pocas veces aparece un momento así», que
                reclamaba el momento sin decir de quién era. */}
            <h2 className="pd-h2">Hoy, la mayoría de las personas siente que tiene que hacer algo.</h2>
            {/* «Hacer empresa siempre ha sido difícil» es el problema en palabras del
                Director y en UNA frase, sin inventario de la faena. Arma la escalera
                difícil → casi imposible → hoy en un celular, y anticipa el cierre de la
                pantalla 4 («modernizar la forma de hacer empresa»).
                ⛔ Se retiró «costaba millones en bodegas, nóminas e inventarios»
                (Director, 24 sep 2026), aunque estaba en la forma aprobada —presencias
                del modelo viejo, no ausencias del nuestro—. El motivo no es la
                polaridad sino el TRÍO: bodega, nómina e inventario es la silueta exacta
                del pitch de la industria del mercadeo en red, y quien ya oyó una
                presentación la reconoce dicha en positivo o en negativo.
                ⛔ Se descartó «con el capital que antes se gastaba en un fin de semana»
                (propuesta del 24 sep): abarata la decisión justo donde tratamos al
                prospecto como inversionista —quien pone plata espera que le cueste—, y
                para buena parte del mercado no es cierto.
                ⚠️ «Tener una empresa de distribución estuvo al alcance de muy pocos»
                SONABA A MENTIRA (Director, 24 sep 2026) y se ganaba la objeción sola:
                cualquiera puede abrir una distribuidora. Por lo mismo tampoco va
                «reservado para grandes corporaciones» (26 sep). La escasez hay que
                ganarla describiendo el objeto, no reclamándola: lo raro no es
                distribuir, es distribuir en un continente y que el negocio facture sin
                el dueño encima. Eso sí era casi imposible, y no se lo discute nadie.
                De paso, esta línea DEFINE «moderna», así que la pantalla 4 puede usar
                la palabra sin explicarla. Y va «empresa MODERNA DE distribución»: el
                adjetivo pegado al sustantivo, porque «distribución moderna» en consumo
                masivo significa supermercados.
                ⚠️ VA EN SUBJUNTIVO, y no es capricho: «una empresa moderna VENDE en todo
                el continente» afirma un hecho sobre una categoría e invita a preguntar
                «¿según quién?» — suena a entrada de diccionario. «Que venda… que
                facture…» deja de definir y pasa a describir algo que uno querría tener,
                y solo entonces la escasez muerde, porque ya lo quiere. Por eso el
                objeto va primero y el veredicto después de la raya.
                ⚠️ Y dice «usted» y no «el dueño»: lo mete a él dentro de la frase.
                ⚠️ Dice «factura» y no «produce»: en la 4 nos definimos por el sistema
                que CONECTA y no por el que produce — se contradiría una pantalla
                después. */}
            <p className="pd-p">
              Hacer empresa siempre ha sido difícil. Una empresa moderna de distribución
              que venda en todo el continente y facture sin que usted tenga que estar
              encima — hasta hace poco, tener una así era casi imposible.
            </p>
            {/* NOMBRA LOS PRODUCTOS, NO LA TECNOLOGÍA (Director, 26 sep 2026). Decía «la
                inteligencia artificial y la logística global»: cierto, pero de todos.
                CreaTuActivo.com y Queswa.app son verificables —el oyente puede abrirlos
                ahí mismo— y la exclusividad se reclama sobre productos con nombre,
                nunca sobre la tecnología. Así el celular deja de ser metáfora.
                ⚠️ Gano Excel NO va aquí: se nombra al final de la explicación, como
                quien fabrica y despacha — en la pantalla 5, con sus hechos. */}
            <p className="pd-p">
              Hoy, CreaTuActivo.com y Queswa.app{' '}
              <span className="pd-gold">la ponen en un celular.</span>
            </p>
          </div>
        </section>

        {/* ── 4 · EL DEFECTO DE DISEÑO ────────────────────────────────── */}
        <section className={`pd-slide ${slide === 4 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            {/* El rótulo NO dice «El problema»: la bisagra de abajo ya lo dice, y
                repetido en mayúsculas a cinco líneas se lee a trompicones. Nombra la
                sección por lo que es — dónde está la oportunidad. */}
            <p className="pd-eyebrow">La oportunidad</p>
            {/* El titular cruza la imagen de la pantalla anterior y la paga: la
                bicicleta estática entra en la 2 y se resuelve aquí (Director, 24 sep).
                «Ser dueño del sistema que conecta, no del que produce» es su tesis de
                la conectividad —Amazon, MercadoLibre— en catorce palabras. */}
            <h2 className="pd-h2">Cómo bajarse de la bicicleta estática.</h2>
            <p className="pd-p">
              Lo que hace falta es ser dueño del sistema que conecta, no del que produce.{' '}
              <span className="pd-gold">Así funciona una empresa moderna.</span>
            </p>
            {/* LA BISAGRA DE TODA LA HERRAMIENTA (Director, 23 sep 2026).
                Antes decía «el modelo dependía de que usted fuera el sistema»: exacto y
                frío — arquitectura, no algo en que alguien se reconozca. Y la otra salida
                que se consideró, nombrar que nadie quiere andar detrás de sus conocidos,
                es el SÍNTOMA: le planta la escena a quien no la traía y nos deja hablando
                de lo que se teme de la categoría en la única pantalla donde decimos que
                funciona.
                La causa es esta: en este negocio todos quieren crecer, crecer es
                multiplicarse, y ahí era donde el modelo se rompía. Es la razón por la que
                el Director empezó esto.
                ⚠️ «Y eso no era sencillo» se deja SIN DECIR a propósito: la ley lo implica
                y el que oye lo completa solo. Y la multiplicación aquí es tarea del modelo
                VIEJO — en el nuestro se nombra como consecuencia, nunca como un tercer
                paso; el contraste refuerza esa regla en vez de romperla. */}

            {/* MODERNIZAR, NO CAMBIAR DE VIDA (Director, 24 sep 2026). El hallazgo de
                campo: presentado como ACTUALIZACIÓN la gente se interesa; presentado
                como cambio, se defiende. Baja la amenaza sin bajar el estatus, y es la
                misma mecánica del «upgrade» que ya usamos para el ingreso en paralelo.
                Va al cierre de la pantalla, justo antes de que la 5 entregue la
                solución: es la última cosa que oye antes de ver de qué se trata.
                ⚠️ NO dice «modernizar la forma de producir» — nos acabamos de definir
                por la conexión y no por la producción; se contradiría a dos líneas. */}
            <p className="pd-kicker">No es cambiar de vida. Es modernizar la forma de hacer empresa</p>
          </div>
        </section>

        {/* ── 5 · LAS TRES PIEZAS (oscilación) ────────────────────────── */}
        <section className={`pd-slide ${slide === 5 ? 'on' : ''}`} onClick={onClickSlide} style={{ padding: 0 }}>
          {/* Beats 0-2: cada pieza a solas y grande */}
          {[0, 1, 2].map((i) => (
            <div key={i} className={`pd-beat ${slide === 5 && beat === i ? 'on' : ''}`}>
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
                  {i === 0 && (
                    <div className="pd-hechos pd-hechos--pieza">
                      <div className="pd-hecho">
                        <span className="k">Marco legal</span>
                        <span className="v">Ley 1700 de 2013</span>
                      </div>
                      <div className="pd-hecho">
                        <span className="k">Operación en América</span>
                        <span className="v">16 países</span>
                      </div>
                      <div className="pd-hecho">
                        <span className="k">Sedes en Colombia</span>
                        <span className="v">Nueve, abiertas al público</span>
                      </div>
                      <div className="pd-hecho">
                        <span className="k">Registro sanitario</span>
                        <span className="v">INVIMA vigente</span>
                      </div>
                      <div className="pd-hecho">
                        <span className="k">Certificación</span>
                        <span className="v">TGA de Australia</span>
                      </div>
                    </div>
                  )}
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
          <div className={`pd-beat ${slide === 5 && beat === 3 ? 'on' : ''}`}>
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
                Un fabricante… una tecnología… dos pasos…
              </p>
            </div>
          </div>

          {/* Beat 4: el remate */}
          <div className={`pd-beat ${slide === 5 && beat === 4 ? 'on' : ''}`}>
            {/* JERARQUÍA EN TRES TIEMPOS (Director, 24 sep 2026: «distribuye mejor los
                textos»). Antes eran cuatro bloques del mismo peso apilados y el remate
                se leía como un párrafo. Ahora: la preparación en pequeño y apagada, el
                golpe en grande y dorado, y el cierre en dos frases cortas separadas —
                el punto y coma metía las dos ideas en un solo renglón denso.
                La línea de la multiplicación se fue al beat de los dos pasos, que es
                donde la ley se comprueba; aquí competía con «es una sola». */}
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

              {/* Dos líneas explícitas y no un solo bloque: el titular rompía en
                  «…Y YA ESTÁ / ARMADA.» y dejaba huérfana la palabra que carga el
                  remate del deck. La coma es la pausa, y aquí es el corte. */}
              <p className="grande">
                Es una sola,<br />y ya está armada.
              </p>
              <p className="pd-p pd-cierre-linea">
                Lo que usted recibe es una empresa moderna de distribución.
              </p>
              <p className="pd-p pd-cierre-linea">
                Usted delega el explicar y el atender. Se queda con decidir y con conectar.
              </p>
              <p className="marca">CreaTuActivo.com</p>
            </div>
          </div>
        </section>

        {/* ── 6 · EL PRODUCTO ─────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 6 ? 'on' : ''}`} onClick={onClickSlide}>
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

        {/* ── 7 · EL PROBLEMA, EN CIFRAS ──────────────────────────────── */}
        <section className={`pd-slide pd-cifras ${slide === 7 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap" style={{ maxWidth: 1040 }}>
            {/* JUSTO ANTES DEL DINERO (Director, 26 sep 2026). En el 1-a-1 el prospecto
                se entusiasma con el problema y, al entrar en los detalles, se le
                oscurece todo: «los productos son caros», «la gente está muy mal»,
                «nadie busca oportunidades». Lo que lo devuelve es re-aterrizar el
                problema. Las cifras contestan esas dos últimas con dato, y la pregunta
                la contesta él («ninguno»): con alguien que duda, mueve que diga sus
                propias razones (CIENCIA_CONDUCTUAL §3).
                ⚠️ Dolor de HOY, no miedo al futuro: las cifras de pensión se dejaron
                fuera a propósito — en quien duda producen «lo pienso». Las cuenta el
                socio en vivo, si el prospecto es mayor.
                ⚠️ «El ciclo» retoma el credo y la pantalla 2 sin repetirlos. La voz de
                confianza con que el Director lo dice en vivo NO se escribe aquí.
                Fuentes y descartes: ver CIFRAS_PROBLEMA. */}
            <p className="pd-eyebrow">El problema, en cifras</p>
            <div className="pd-cifras-lista">
              {CIFRAS_PROBLEMA.map((c) => (
                <div className="pd-cifra" key={c.n}>
                  <p className="n">{c.n}</p>
                  <p className="t">{c.texto}</p>
                  <p className="f">{c.fuente}</p>
                </div>
              ))}
            </div>
            <p className="pd-bisagra">¿Y usted, qué plan tiene para salir del ciclo?</p>
          </div>
        </section>

        {/* ── 8 · LOS NÚMEROS ─────────────────────────────────────────── */}
        <section className={`pd-slide pd-numeros ${slide === 8 ? 'on' : ''}`} onClick={onClickSlide}>
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
            {/* EL MODELO DE NEGOCIO EN UNA FRASE, ANTES DE LAS CIFRAS (Director, 26 sep
                2026) — como la línea de Airbnb antes de sus números. Es el diferencial
                del 25 sep dicho como mecanismo: el cliente que llega por su enlace
                queda a su nombre, y por eso su recompra le paga. La pantalla 6 cerró
                en que el cliente vuelve a pedir; aquí se dice qué le deja a usted.
                ⚠️ La permanencia se dice del CLIENTE, nunca del pago: nada de «de por
                vida». La recompensa se nombra por su repetición. */}
            <h2 className="pd-h2">Cada cliente que llega por su enlace queda a su nombre.</h2>
            <p className="pd-p pd-numeros-lead">Cada vez que vuelve a pedir, usted cobra.</p>
            <div className="pd-paneles">
              {/* Panel A — el Bono GEN5. El simulador de ingreso recurrente por hogares
                  salió (Director, 26 sep 2026): lo recurrente lo cuenta el de los 12
                  niveles, y dos simuladores de lo mismo se estorban.
                  HASTA LA QUINTA GENERACIÓN (Director, 26 sep 2026): antes mostraba
                  solo la primera, que es la mitad de la historia. La tira dice cuánto
                  deja cada generación y la cifra grande es la suma.
                  ⚠️ El MISMO número de paquetes en cada generación, a propósito: en la
                  práctica las de abajo suelen tener más, así que el ejemplo se queda
                  corto y nadie puede decir que infla. Se descartó el 2×2 (2, 4, 8, 16,
                  32): serían dos proyecciones geométricas lado a lado, y exigiría
                  paquetes empresariales en todas las generaciones — contra el Kit que
                  los 12 niveles dejan por defecto.
                  ⚠️ Se cuentan PAQUETES COMPRADOS, nunca personas. */}
              <div className="panel">
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
                <p className="pd-insight">
                  Cada vez que se compra un paquete empresarial en su sistema, hasta la
                  quinta generación, usted cobra este bono. Es lo que financia el
                  crecimiento al inicio.
                </p>
              </div>

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
                <p className="pd-insight">
                  Cada nivel duplica su sistema (2×2). Regalía mensual proyectada: el{' '}
                  {tarifa.pct}% de lo que consumen sus distribuidores.
                </p>
                {tarifa.meses > 0 && (
                  <p className="pd-insight pd-vigencia">
                    Con el {tarifa.paquete}, el {tarifa.pct}% rige los primeros{' '}
                    {tarifa.meses} meses; después aplica el más alto entre el 10% base y el
                    de su rango.
                  </p>
                )}
              </div>
            </div>
            {/* La cadencia real, para no insinuar un pago al día siguiente de la compra.
                ⚠️ Sin la tasa de $4.500: con los pesos por defecto nadie ve una
                conversión, y nombrarla le planta la queja del dólar caro (FREQ_27). */}
            <p className="pd-nota">Gano Excel paga cada semana, los viernes.</p>
          </div>
        </section>

        {/* ── 9 · EL SIGUIENTE PASO ───────────────────────────────────── */}
        <section className={`pd-slide pd-final ${slide === 9 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            {/* EL DECK CIERRA COMO ABRIÓ (Director, 26 sep 2026). El rótulo es el de la
                pantalla 1, y vuelve la SEGUNDA mitad del credo: el ciclo ya se nombró
                en la 1, la 2 y la 7, y aquí el deck termina en la restitución —el
                esfuerzo convertido en capital—, justo después de ver los números.
                La lista de espera va como la dice el arsenal desde el 10 sep (EAM_02):
                una capacidad real, en presente, sin número y sin la mecánica de la
                selección.
                ⚠️ EL CIERRE ES UNA AFIRMACIÓN, NO UNA PREGUNTA (Director, 26 sep 2026).
                Se propusieron «¿Le reservo su lugar?» y «¿Arrancamos con su Kit de
                Inicio?»; el Director prefirió «El siguiente paso es una conversación»,
                que vivía al pie de la pantalla de los números. Encaja con la lista de
                espera, que el arsenal dice «con una conversación de por medio». La
                pregunta la hace el socio en vivo.
                ⛔ Sin paquetes ni precios: el precio de entrada no convive con las
                comisiones de la pantalla anterior. */}
            <p className="pd-eyebrow">En qué creemos</p>
            <p className="pd-final-credo">
              Creemos que el esfuerzo de la gente que sabe trabajar debería convertirse
              en capital real.
            </p>
            <p className="pd-p">
              Acompañamos a cada socio nuevo uno a uno, y eso no alcanza para todos a la
              vez. Por eso el acceso va por lista de espera.
            </p>
            <p className="pd-bisagra">El siguiente paso es una conversación.</p>
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
