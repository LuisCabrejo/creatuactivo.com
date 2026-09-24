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
 * LA ESPINA (7 pantallas)
 * -----------------------
 *  1 QUÉ CREEMOS   · el credo, verbatim aprobado (Home v16, apertura del canal,
 *                    WHY_01). Hace de primera diapositiva de pitch deck porque
 *                    dice quiénes somos y el problema en la misma respiración.
 *  2 EL MOMENTO    · el reclamo va DESPUÉS de la creencia; antes suena a bombo.
 *                    Deliberadamente sin cifras: Jobs abre sin datos.
 *  3 EL CICLO      · el villano NARRADO, con sus tres piezas canónicas
 *                    (STORY_03): el dinero que ya tiene dueño + el ciclo + el
 *                    remate «al que gana dos y al que gana más de veinte». Sin
 *                    el remate, quien gana bien se exime y se acaba la charla.
 *  4 LA OPORTUNIDAD· concede que la categoría funciona ANTES de tocarle nada, y
 *                    gira en la bisagra del deck: «El problema: multiplicarse.
 *                    Solo se multiplica lo que es sencillo.» (Director, 23 sep).
 *                    Todos quieren crecer, crecer es multiplicarse, y ahí era
 *                    donde el modelo se rompía — es la razón por la que él
 *                    empezó esto. ⛔ NO se nombra el gremio ni se invoca el
 *                    fantasma de perseguir conocidos: eso es el SÍNTOMA, y
 *                    enunciarlo se lo planta a quien no lo traía. La causa se
 *                    dice entera y el que tenga el recuerdo lo pone solo.
 *  5 LAS TRES      · la oscilación (5 beats). Aquí se va la mitad del tiempo.
 *                    El remate cierra el círculo de la 4: lo que se le pasa al
 *                    siguiente no es una habilidad —eso no se copia— sino esto
 *                    mismo, armado. Así la multiplicación queda como
 *                    CONSECUENCIA y no como un tercer paso.
 *  6 EL PRODUCTO   · ficha y categorías (patrón servilleta).
 *  7 LOS NÚMEROS   · simulador de la servilleta + simulador de los 12 niveles.
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

const TOTAL_SLIDES = 7;

/** Beats internos por pantalla. Solo la 5 (la oscilación) tiene más de uno. */
const BEATS: Record<number, number> = { 5: 5 };
const beatsOf = (slide: number) => BEATS[slide] ?? 1;

/** Las tres piezas. Mismo lenguaje 3D (objeto gris, fondo negro, piso blanco):
 *  que se vean hechas del mismo material es lo que vuelve creíble «es una sola». */
const PIEZAS = [
  {
    label: 'UN FABRICANTE',
    img: '/images/servilleta/colapso-fabrica.webp',
    sub: 'Gano Excel fabrica, almacena y despacha. Treinta años haciéndolo, en más de sesenta países.',
  },
  {
    label: 'UNA TECNOLOGÍA QUE ATIENDE',
    img: '/images/servilleta/colapso-conversacion.webp',
    sub: 'Queswa conversa con cada interesado, le resuelve las dudas y madura la decisión de avanzar. A toda hora.',
  },
  {
    label: 'DOS PASOS SENCILLOS',
    img: '/images/servilleta/colapso-metodo-v2.webp',
    sub: 'Usted comparte. Y recibe a quien llega interesado.',
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

/** Tasa fija del fabricante para más de 60 países. No es la TRM del mercado. */
const TRM = 4500;
const GEN5_BONOS: Record<string, number> = { ESP1: 25, ESP2: 75, ESP3: 150 };

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
  const [simMode, setSimMode] = useState<'binario' | 'gen5'>('binario');
  const [gen5Paquetes, setGen5Paquetes] = useState(2);
  const [gen5Nivel, setGen5Nivel] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [hogares, setHogares] = useState(50);
  const [nivel12, setNivel12] = useState(12);

  const ingresoGen5 = gen5Paquetes * GEN5_BONOS[gen5Nivel];
  const ingresoBinario = Math.round(hogares * 4.76);
  const usd = simMode === 'gen5' ? ingresoGen5 : ingresoBinario;
  const cop = usd * TRM;

  // Bola de nieve: el thumb crece con los hogares (la metáfora, literal).
  const thumbHogares = Math.round(20 + (hogares / 1000) * 30);
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
        .pd-credo h1 {
          font-family: var(--font-playfair), Georgia, serif; font-weight: 400;
          font-size: clamp(1.55rem, 4.2vw, 3rem); line-height: 1.3;
          margin: 0 0 1.4rem; color: #FFFFFF; max-width: 22ch;
        }
        .pd-credo .segunda { color: var(--pd-gold); max-width: 24ch; }
        .pd-credo-rule {
          width: 56px; height: 1px; background: var(--pd-gold); margin: 2.4rem 0 1.2rem;
        }
        .pd-credo-sub { margin-top: 1.8rem; max-width: 52ch; }

        /* ── 4 · Hechos verificables ─────────────────────────────────────── */
        .pd-hechos {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 1px; background: rgba(255,255,255,0.07); margin-top: 2.6rem;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pd-hecho { background: var(--pd-bg); padding: 1rem 1.1rem; }
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
        .pd-remate { text-align: center; max-width: 720px; margin: 0 auto; }
        .pd-remate .grande {
          font-family: var(--font-sans); font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.6rem, 4.6vw, 3.1rem); line-height: 1.1;
          color: var(--pd-gold); margin: 1rem 0 1.6rem;
        }
        .pd-remate .marca {
          font-family: var(--font-mono); font-size: 0.66rem; letter-spacing: 0.3em;
          color: var(--pd-muted); text-transform: uppercase; margin-top: 2.2rem;
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

        /* ── 7 · Números ─────────────────────────────────────────────────── */
        .pd-paneles { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(16px, 3vw, 32px); }
        .panel { border: 1px solid rgba(255,255,255,0.1); background: var(--pd-elev);
          padding: 1.4rem 1.4rem 1.6rem; cursor: default; }
        .panel h3 {
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.22em;
          color: var(--pd-muted); text-transform: uppercase; text-align: center;
          margin: 0 0 1.2rem;
        }
        .pd-tabs { display: flex; gap: 1px; background: rgba(255,255,255,0.08); margin-bottom: 1.2rem; }
        .pd-tab { flex: 1; background: var(--pd-bg); border: none; color: var(--pd-muted);
          font-family: var(--font-mono); font-size: 0.56rem; letter-spacing: 0.14em;
          padding: 10px 6px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
        .pd-tab.active { background: rgba(197,160,89,0.12); color: var(--pd-gold); }
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
        .pd-cierre { text-align: center; font-family: var(--font-mono); font-size: 0.62rem;
          letter-spacing: 0.2em; color: var(--pd-muted); text-transform: uppercase;
          margin-top: 1.8rem; }

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
          .pd-numeros .pd-tabs,
          .pd-numeros .pd-pkgs,
          .pd-numeros .pd-niveles { margin-bottom: 0.9rem; }
          .pd-numeros .pd-sub { margin-bottom: 0.9rem; }
          .pd-numeros .pd-slider { margin: 0.7rem 0 1.9rem; }
          .pd-numeros .pd-insight { font-size: 0.74rem; }
          .pd-numeros .pd-cierre { margin-top: 1.1rem; }
          .pd-numeros { padding-bottom: 28px; }

          /* ANCLAJE DE DESPLAZAMIENTO — el patrón de la servilleta para las
             pantallas que no caben en un teléfono. En «el producto» no caben a la
             vez la historia (título, párrafo, las cuatro líneas, el portafolio) y
             la ficha del Ganoderma: son 985px contra 728 útiles. Sin anclaje la
             ficha queda debajo del borde y quien presenta ni se entera de que está.
             Con él, un deslizamiento la trae entera.
             ⚠️ proximity y NO mandatory: en la servilleta el obligatorio peleaba
             con el gesto horizontal. El guard de eje del swipe (|dx| > |dy| * 1.2)
             ya impide que bajar cambie de pantalla. */
          .pd-slide { scroll-snap-type: y proximity; }
          .pd-producto > * { scroll-snap-align: start; }
          .pd-numeros .panel { scroll-snap-align: start; }
          /* En un teléfono la marca y los puntos se montaban encima del botón.
             La marca ya está en la pantalla 1 y en el remate: aquí sobra. */
          .pd-brand { display: none; }
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
          .pd-eyebrow { margin-bottom: 1rem; }
          .pd-h2 { font-size: clamp(1.4rem, 5.6vw, 2rem); margin-bottom: 1rem; }
          .pd-p { font-size: 0.95rem; line-height: 1.5; margin-bottom: 0.8rem; }
          .pd-bisagra { font-size: clamp(1.3rem, 6vw, 1.9rem); margin: 1.2rem 0 0.8rem; }
          .pd-credo h1 { font-size: clamp(1.3rem, 5.4vw, 2rem); margin-bottom: 1rem; }
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
          .pd-credo .pd-credo-sub,
          .pd-credo .pd-credo-rule,
          .pd-credo .pd-kicker { grid-column: 1 / -1; }
          .pd-credo h1 { font-size: clamp(1.05rem, 2.4vw, 1.6rem); margin-bottom: 0;
            max-width: none; }
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
            <h1 className="segunda" aria-hidden="false">
              Creemos en empoderar a las personas para que recuperen el control de su
              tiempo y de su dinero.
            </h1>
            {/* Subtítulo del Director (24 sep 2026). «La gente que sabe trabajar»
                honra al héroe en vez de diagnosticarlo, y «capital real» eleva el
                registro desde las finanzas. ⚠️ Se le cortó el remate original («y no
                solo en pagar el mes a mes»): el credo, dos líneas arriba, ya dice el
                ciclo — repetirlo con palabras más flojas apaga la frase. Termina en
                lo nuevo, que es donde debe terminar. */}
            <p className="pd-p pd-credo-sub">
              Creemos en entregarle una herramienta de alto nivel a la gente que sabe
              trabajar, para que su esfuerzo se traduzca en capital real.
            </p>
            <div className="pd-credo-rule" />
            <p className="pd-kicker">CreaTuActivo · Presentación</p>
          </div>
        </section>

        {/* ── 2 · EL MOMENTO ──────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 2 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">El momento</p>
            <h2 className="pd-h2">Pocas veces aparece un momento así.</h2>
            {/* El antes y el después, que es la gramática del «por qué ahora» de un
                pitch deck. El eje es el ALCANCE, no el costo.
                ⛔ Se retiró «costaba millones en bodegas, nóminas e inventarios»
                (Director, 24 sep 2026), aunque estaba en la forma aprobada —presencias
                del modelo viejo, no ausencias del nuestro—. El motivo no es la
                polaridad sino el TRÍO: bodega, nómina e inventario es la silueta exacta
                del pitch de la industria del mercadeo en red, y quien ya oyó una
                presentación la reconoce dicha en positivo o en negativo. «Estuvo al
                alcance de muy pocos» cambia el eje a un privilegio que se abrió, que es
                el registro de una firma de inversión y no el de un catálogo.
                ⛔ Se descartó «con el capital que antes se gastaba en un fin de semana»
                (propuesta del 24 sep): abarata la decisión justo donde tratamos al
                prospecto como inversionista —quien pone plata espera que le cueste—, y
                para buena parte del mercado no es cierto, que es una fuga de
                credibilidad en la pantalla donde reclamamos un momento histórico. */}
            <p className="pd-p">
              Tener una empresa de distribución estuvo siempre al alcance de muy pocos.
            </p>
            <p className="pd-p">
              Hoy, la inteligencia artificial y la logística global{' '}
              <span className="pd-gold">la ponen en un celular.</span>
            </p>
          </div>
        </section>

        {/* ── 3 · EL CICLO ────────────────────────────────────────────── */}
        <section className={`pd-slide ${slide === 3 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap">
            <p className="pd-eyebrow">El problema</p>
            <h2 className="pd-h2">Nos enseñaron dos caminos.</h2>
            {/* Los dos caminos los NARRA el socio en vivo (Director, 24 sep): la
                pantalla solo sostiene el ciclo, que es donde los dos desembocan.
                ⚠️ La analogía va SIN remate propio: «pero financieramente avanza muy
                poco» explica en literal lo que la imagen ya dijo, y con dos tesis el
                oyente no se queda con ninguna. Quítela y el párrafo sigue en pie.
                ⛔ El remate de los veinte millones NO se toca aunque la propuesta lo
                omitía: existe para que quien gana bien no se exima («ese no es mi
                caso») — y el mercado de esta herramienta es justamente gente que gana
                bien. Sin él la conversación se acaba en silencio. */}
            <p className="pd-p">
              Usted trabaja el mes entero. Y al día siguiente de que le entra la plata,
              ese dinero ya tiene dueño: el banco, las cuotas, los recibos.
            </p>
            <p className="pd-p">
              Es un ciclo infinito de trabajar, pagar cuentas y repetir. Es como estar en
              una bicicleta estática: usted le da y le da con todas sus fuerzas.
            </p>
            <p className="pd-p pd-gold">
              Y le pasa exactamente igual al que gana dos millones y al que gana más de
              veinte.
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
                bicicleta estática entra en la 3 y se resuelve aquí (Director, 24 sep).
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
            <p className="pd-bisagra">El problema: multiplicarse.</p>
            <p className="pd-p">Solo se multiplica lo que es sencillo.</p>
            {/* MODERNIZAR, NO CAMBIAR DE VIDA (Director, 24 sep 2026). El hallazgo de
                campo: presentado como ACTUALIZACIÓN la gente se interesa; presentado
                como cambio, se defiende. Baja la amenaza sin bajar el estatus, y es la
                misma mecánica del «upgrade» que ya usamos para el ingreso en paralelo.
                Va al cierre de la pantalla, justo antes de que la 5 entregue la
                solución: es la última cosa que oye antes de ver de qué se trata.
                ⚠️ NO dice «modernizar la forma de producir» — nos acabamos de definir
                por la conexión y no por la producción; se contradiría a dos líneas. */}
            <p className="pd-kicker">No es cambiar de vida. Es modernizar la forma de hacer empresa</p>

            <div className="pd-hechos">
              <div className="pd-hecho">
                <span className="k">Marco legal</span>
                <span className="v">Ley 1700 de 2013</span>
              </div>
              <div className="pd-hecho">
                <span className="k">Presencia en Colombia</span>
                <span className="v">Nueve sedes abiertas al público</span>
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
            <div className="pd-remate">
              <p className="pd-p" style={{ margin: '0 auto', textAlign: 'center' }}>
                No son tres cosas que usted tenga que conseguir.
              </p>
              <p className="grande">Es una sola, y ya está armada.</p>
              <p className="pd-p" style={{ margin: '0 auto', textAlign: 'center' }}>
                Lo que usted recibe es una empresa de distribución moderna. Usted delega
                el explicar y el atender; se queda con decidir y con conectar.
              </p>
              {/* Cierra el círculo que abre la pantalla 4 («solo se multiplica lo que es
                  sencillo»): lo que se transmite NO es una habilidad —eso no se copia—
                  sino esto mismo, funcionando. Así la multiplicación queda dicha como
                  CONSECUENCIA y no como un tercer paso que le encargamos.
                  ⚠️ Decía «lo que usted le pasa AL SIGUIENTE» y se corrigió: «el
                  siguiente» dibuja una cadena de personas, que es la silueta que el
                  prospecto reconoce como pirámide. Se nombra lo que se transmite, no
                  a quién — misma regla que cuenta el GEN5 en compras y nunca en gente. */}
              <p className="pd-p pd-gold" style={{ margin: '1.2rem auto 0', textAlign: 'center' }}>
                Por eso se multiplica: lo que se transmite no es una habilidad, es esto
                mismo, armado.
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
                <h2 className="pd-h2">Un hábito que no cambia</h2>
                <p className="pd-p">
                  El café de siempre — ahora con Ganoderma Lucidum, el hongo más estudiado
                  del planeta, con más de 2.000 estudios publicados. En un extracto que se
                  disuelve por completo en el agua: no se queda nada en el fondo de la taza.
                </p>
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
                <div className="titulo">Ganoderma Lucidum</div>
                <div className="pd-fila">
                  <span className="k">Estudios publicados</span>
                  <span className="v">2.000+</span>
                </div>
                <div className="pd-fila">
                  <span className="k">Variedades en el híbrido</span>
                  <span className="v">6</span>
                </div>
                <div className="pd-fila">
                  <span className="k">Compuestos bioactivos</span>
                  <span className="v">200+</span>
                </div>
                <p className="pie">
                  Tres décadas de ciencia del <strong>Dr. Leow Soon Seng</strong>, pionero
                  mundial en el cultivo de este hongo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · LOS NÚMEROS ─────────────────────────────────────────── */}
        <section className={`pd-slide pd-numeros ${slide === 7 ? 'on' : ''}`} onClick={onClickSlide}>
          <div className="pd-wrap" style={{ maxWidth: 1040 }}>
            <p className="pd-eyebrow">Cómo se gana</p>
            <div className="pd-paneles">
              {/* Panel A — el mecanismo, con su cifra */}
              <div className="panel">
                <h3>Simulador de ingresos</h3>
                <div className="pd-tabs">
                  <button
                    type="button"
                    className={`pd-tab ${simMode === 'binario' ? 'active' : ''}`}
                    onClick={() => setSimMode('binario')}
                  >
                    Ingreso recurrente
                  </button>
                  <button
                    type="button"
                    className={`pd-tab ${simMode === 'gen5' ? 'active' : ''}`}
                    onClick={() => setSimMode('gen5')}
                  >
                    Ingreso por paquetes
                  </button>
                </div>

                <div className="pd-display">
                  ${enUSD(usd)}<span className="u"> USD</span>
                </div>
                <div className="pd-sub">≈ ${enCOP(cop)} COP</div>

                {simMode === 'gen5' ? (
                  <>
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
                      Paquetes comprados en su sistema<b>{gen5Paquetes}</b>
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
                      Cada vez que se compra un paquete empresarial en su sistema, usted cobra
                      este bono. Es lo que financia el crecimiento al inicio.
                    </p>
                  </>
                ) : (
                  <>
                    <label className="pd-label">
                      Hogares en su sistema<b>{hogares}</b>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={hogares}
                      onChange={(e) => setHogares(parseInt(e.target.value))}
                      className="pd-slider"
                      style={{ ['--thumb' as string]: `${thumbHogares}px` } as React.CSSProperties}
                    />
                    <p className="pd-insight">
                      Ingreso recurrente que crece con lo que consumen sus clientes y
                      distribuidores, y no depende de su presencia.
                    </p>
                  </>
                )}
              </div>

              {/* Panel B — los 12 niveles (2×2), de /12-niveles */}
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

                <div className="pd-display">
                  ${enCOP(nivelSel.income)}<span className="u"> COP</span>
                </div>
                <div className="pd-sub">
                  ≈ ${enUSD(Math.round(nivelSel.income / TRM))} USD · {enCOP(nivelSel.people)} distribuidores
                  nuevos en este nivel · total: {enCOP(totalDistribuidores)}
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
                  Cada nivel duplica su sistema (2×2). Regalía mensual proyectada: el 10% de
                  lo que consumen sus distribuidores.
                </p>
              </div>
            </div>
            <p className="pd-cierre">El siguiente paso es una conversación</p>
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
