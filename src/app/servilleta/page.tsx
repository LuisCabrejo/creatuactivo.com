/**
 * SERVILLETA DIGITAL v5.1 - THE INDUSTRIAL DECK
 * 4-Slide Interactive Presentation (Slide Deck)
 * v2.1: Oscilaciones Duarte/Jobs + Bio-Metría consolidada + Doble CTA
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function ServilletaPage() {
  const TOTAL_SLIDES = 4;
  const [activeSlide, setActiveSlide] = useState(1);
  const [simMode, setSimMode] = useState<'gen5' | 'binario'>('gen5');
  const [gen5Socios, setGen5Socios] = useState(2);
  const [gen5Package, setGen5Package] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [binarioParejas, setBinarioParejas] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [queswaOpen, setQueswaOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const touchStartX = React.useRef(0);
  const clickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tripleClickCount = React.useRef(0);
  const tripleClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fuentes: Rajdhani + Roboto Mono ya cargadas via next/font en layout.tsx
  // Material Symbols Sharp cargado en layout.tsx — no se necesita useEffect aquí

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (isEditable) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setActiveSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlide((prev) => Math.max(prev - 1, 1));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Detectar cambios de fullscreen (ESC del navegador)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Fullscreen toggle (Mac + Windows)
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Click-to-advance (single clic) / Fullscreen (double clic) / Queswa demo (triple clic)
  const handleSlideClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, .sim-tabs, .pkg-selector, .controls-container, .simulator-panel, .cta-buttons')) {
      return;
    }

    // Triple click → toggle Queswa (puerta trasera para demos)
    tripleClickCount.current += 1;
    if (tripleClickTimer.current) clearTimeout(tripleClickTimer.current);
    if (tripleClickCount.current >= 3) {
      tripleClickCount.current = 0;
      if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = null; }
      window.dispatchEvent(new CustomEvent('open-queswa'));
      return;
    }
    tripleClickTimer.current = setTimeout(() => { tripleClickCount.current = 0; }, 600);

    // Si hay timer pendiente → es double-click → fullscreen
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      toggleFullscreen();
      return;
    }
    // Single click → esperar 300ms para confirmar que no es double
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      setActiveSlide((prev) => (prev < TOTAL_SLIDES ? prev + 1 : prev));
    }, 300);
  }, [toggleFullscreen]);

  // Touch swipe para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        setActiveSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES));
      } else {
        setActiveSlide((prev) => Math.max(prev - 1, 1));
      }
    }
  }, []);

  // Lógica del Simulador
  const TRM = 4500;
  const gen5Bonuses: Record<string, number> = { ESP1: 25, ESP2: 75, ESP3: 150 };
  const gen5Income = gen5Socios * gen5Bonuses[gen5Package];
  const binarioIncomeUSD = Math.round(binarioParejas * 4.76);

  const currentUSD = simMode === 'gen5' ? gen5Income : binarioIncomeUSD;
  const currentCOP = (currentUSD * TRM).toLocaleString();

  const getLifestyleTranslation = (usd: number) => {
    if (usd < 100) return "Neutraliza costos operativos digitales (Suscripciones, Telecomunicaciones).";
    if (usd <= 300) return "Cubre la carga base de mantenimiento estructural del hogar.";
    if (usd <= 600) return "Libera capital para movilidad premium o upgrade de vivienda.";
    if (usd <= 1200) return "Punto de Equilibrio: Supera el ingreso de un profesional corporativo.";
    if (usd <= 2500) return "Soberanía Táctica: Elimina presión mensual. Permite delegar y reinvertir.";
    if (usd <= 5000) return "Arquitectura de Riqueza: Ingresos Top 1%. Aceleración en adquisición de activos.";
    if (usd <= 10000) return "Posición de Inversor: Flujo de capital masivo para diversificación y expansión.";
    return "Soberanía Absoluta: El ecosistema opera con máxima eficiencia. Libertad total.";
  };

  const showSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  // Reset tarjeta activa al entrar a slide 2
  useEffect(() => {
    if (activeSlide === 2) setActiveCardIndex(0);
  }, [activeSlide]);

  // Orbe Queswa visible solo en slide 2, card 1
  useEffect(() => {
    const visible = activeSlide === 2 && activeCardIndex === 0;
    window.dispatchEvent(new CustomEvent(visible ? 'show-queswa-orb' : 'hide-queswa-orb'));
    return () => { window.dispatchEvent(new CustomEvent('hide-queswa-orb')); };
  }, [activeSlide, activeCardIndex]);

  // Scroll-activated card highlight — solo mobile/tablet
  useEffect(() => {
    if (activeSlide !== 2) return;
    if (typeof window === 'undefined') return;
    if (window.innerWidth > 1024) return;

    // En fullscreen el contenedor de scroll es .slide (CSS: overflow-y: auto en :fullscreen .slide)
    // En mobile normal el contenedor es .grid-layout-slide-2
    const scrollRoot = document.fullscreenElement
      ? document.querySelector<HTMLElement>('#slide-2')
      : document.querySelector<HTMLElement>('#slide-2 .grid-layout-slide-2');
    const cards = document.querySelectorAll<HTMLElement>('#slide-2 .card-industrial');
    if (!cards.length || !scrollRoot) return;

    const observers: IntersectionObserver[] = [];
    cards.forEach((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setActiveCardIndex(index);
            }
          });
        },
        { root: scrollRoot, threshold: 0.5 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [activeSlide, isFullscreen]);

  // Ocultar nav mobile cuando Queswa está abierto
  // También libera body overflow para que el teclado virtual no tape el input
  useEffect(() => {
    const open = () => {
      setQueswaOpen(true);
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    };
    const close = () => {
      setQueswaOpen(false);
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
    window.addEventListener('open-queswa', open);
    window.addEventListener('close-queswa', close);
    return () => {
      window.removeEventListener('open-queswa', open);
      window.removeEventListener('close-queswa', close);
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  // CTA reveal: grayscale → color
  useEffect(() => {
    if (activeSlide !== 4) { setCtaVisible(false); return; }
    if (typeof window === 'undefined') return;
    if (window.innerWidth > 1024) {
      // Desktop: activa color con delay al llegar a slide 4
      const t = setTimeout(() => setCtaVisible(true), 400);
      return () => clearTimeout(t);
    }
    // Mobile: IntersectionObserver cuando el panel hace scroll-snap
    setCtaVisible(false);
    const scrollRoot = document.querySelector('#slide-4');
    const cta = document.querySelector('#slide-4 .cta-panel');
    if (!cta || !scrollRoot) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => setCtaVisible(e.isIntersecting && e.intersectionRatio >= 0.4)); },
      { root: scrollRoot, threshold: 0.4 }
    );
    observer.observe(cta);
    return () => observer.disconnect();
  }, [activeSlide, isFullscreen]);

  return (
    <>
      <style>{`
        /* --- VARIABLES INDUSTRIALES --- */
        :root {
          --bg-dark: #121212;
          --concrete: #1e1e1e;
          --steel: #37474f;
          --cyan: #00e5ff;
          --orange: #EB4F27;
          --text-main: #e0e0e0;
          --text-muted: #9e9e9e;
          --font-head: 'Rajdhani', sans-serif;
          --font-mono: 'Roboto Mono', monospace;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          background-color: var(--bg-dark);
          color: var(--text-main);
          font-family: var(--font-mono);
        }

        .deck-container {
          height: 100vh;
          overflow: hidden;
        }

        /* RUIDO */
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 5;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* HUD SUPERIOR */
        .top-hud {
          position: fixed;
          top: 0; left: 0; width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 25px;
          background: rgba(10, 10, 10, 0.9);
          border-bottom: 1px solid #333;
          z-index: 100;
          backdrop-filter: blur(5px);
        }

        .brand {
          display: flex; gap: 10px; align-items: center;
          font-family: var(--font-head); font-weight: 700; letter-spacing: 2px;
        }

        .nav-controls { display: flex; gap: 5px; align-items: center; }
        .nav-btn {
          background: transparent; border: 1px solid transparent; color: #555;
          font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer;
          padding: 8px 12px; transition: all 0.3s; border-radius: 0;
        }
        .nav-btn:hover { color: var(--text-main); background: #222; }
        .nav-btn.active { color: var(--cyan); background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.2); }

        /* Fullscreen button */
        .btn-fullscreen {
          background: transparent; border: 1px solid #444; color: #666;
          cursor: pointer; padding: 6px 8px; border-radius: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; margin-left: 10px; flex-shrink: 0;
        }
        .btn-fullscreen-mobile {
          display: none;
        }
        .btn-fullscreen:hover { color: var(--cyan); border-color: var(--cyan); background: rgba(0,229,255,0.1); }
        .btn-fullscreen .material-symbols-sharp { font-size: 18px; }

        /* Slide counter indicator */
        .slide-counter {
          position: fixed; bottom: 15px; right: 20px;
          font-family: var(--font-mono); font-size: 0.65rem; color: #444;
          z-index: 101; letter-spacing: 1px;
        }

        /* Click cursor on slides */
        .slide { cursor: pointer; }

        /* CONTENEDOR DE DIAPOSITIVAS */
        .deck-container {
          position: relative;
          width: 100%; height: 100vh;
        }

        .slide {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          display: none;
          padding-top: 60px;
          animation: fadeIn 0.5s ease;
        }
        .slide.active { display: block; }

        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

        /* ELEMENTOS COMUNES */
        .bg-image {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          filter: grayscale(80%) contrast(120%) brightness(50%);
          z-index: 0;
        }

        .content-overlay {
          position: relative; z-index: 10;
          height: 100%; display: flex; flex-direction: column; justify-content: center;
          padding: 0 50px;
        }
        .center-focus { align-items: center; text-align: center; }
        .side-focus { align-items: flex-start; text-align: left; max-width: 600px; background: linear-gradient(to right, rgba(0,0,0,0.9), transparent); padding: 40px 50px; }

        .technical-label {
          color: var(--cyan); font-family: var(--font-mono); font-size: 0.8rem;
          border-left: 3px solid var(--cyan); padding-left: 10px; margin-bottom: 20px;
        }

        .deck-h1, .deck-h2 { font-family: var(--font-head); text-transform: uppercase; margin: 0 0 20px 0; line-height: 0.9; color: var(--text-main); }
        .deck-h1 { font-size: 4rem; }
        .deck-h2 { font-size: 3rem; }
        .deck-p { color: #ccc; line-height: 1.6; max-width: 600px; margin: 0; text-shadow: 0px 1px 3px black; }

        /* PLACA DE CONTRASTE (Slide 1 readability) */
        .contrast-plate {
          background: rgba(0, 0, 0, 0.7);
          padding: 20px 25px;
          border-radius: 0;
          backdrop-filter: blur(4px);
        }

        /* H1 Slide 1: placa oscura + sombra para máxima legibilidad */
        #slide-1 .deck-h1 {
          text-shadow:
            0 0 4px rgba(0,0,0,1),
            0 0 15px rgba(0,0,0,1),
            0 0 35px rgba(0,0,0,0.9),
            2px 2px 0 rgba(0,0,0,1),
            -2px -2px 0 rgba(0,0,0,1);
          background: rgba(0, 0, 0, 0.45);
          padding: 12px 28px;
          backdrop-filter: blur(6px);
          border-radius: 0;
          margin-bottom: 24px;
        }

        /* LISTA DE COMPONENTES (Slide 1) */
        .components-list {
          width: 100%; margin-top: 25px;
          display: flex; flex-direction: column; gap: 15px;
          font-family: var(--font-head); font-size: 1.1rem; color: var(--text-main);
        }
        .components-list .comp-row {
          background: rgba(15, 15, 15, 0.85);
          border: 1px solid #222;
          padding: 18px 20px;
          border-radius: 0;
          border-left: 3px solid var(--cyan);
          opacity: 0;
          transform: translateY(15px);
          animation: bootSequence 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .components-list .comp-row:nth-child(1) { animation-delay: 0.2s; border-left-color: var(--cyan); }
        .components-list .comp-row:nth-child(2) { animation-delay: 0.4s; border-left-color: var(--cyan); }
        .components-list .comp-row:nth-child(3) { animation-delay: 0.6s; border-left-color: var(--orange); }
        @keyframes bootSequence {
          to { opacity: 1; transform: translateY(0); }
        }

        /* BOTÓN SIGUIENTE */
        .btn-next {
          margin-top: 30px;
          padding: 15px 30px;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid var(--orange);
          color: var(--orange);
          font-family: var(--font-head);
          font-size: 1.2rem;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s ease;
          backdrop-filter: blur(6px);
          text-shadow: none;
          border-radius: 0;
        }
        .btn-next:hover { background: var(--orange); color: #000; }

        /* --- SLIDE 2: GRID LAYOUT --- */
        .slide-2-header {
          grid-column: span 2;
          text-align: center;
          padding-bottom: 5px;
        }
        .slide-2-subtitle {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--cyan);
          letter-spacing: 2px;
        }
        .grid-layout-slide-2 {
          position: relative; z-index: 10;
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
          padding: 80px 50px 30px; height: 100%; align-content: center;
        }
        .card-industrial {
          position: relative; height: 250px; background: #222;
          border: 1px solid #444; overflow: hidden;
          display: flex; align-items: flex-end;
          transition: border-color 0.3s;
        }
        .card-industrial:hover { border-color: var(--cyan); }
        .full-width { grid-column: span 2; height: 200px; }

        .card-bg {
          position: absolute; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          filter: grayscale(100%) brightness(40%); transition: 0.5s;
        }
        .card-industrial:hover .card-bg { filter: grayscale(0%) brightness(70%); transform: scale(1.05); }

        .card-content {
          position: relative; z-index: 2; padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); width: 100%;
        }
        .card-content h3 { font-family: var(--font-head); display: flex; align-items: center; gap: 10px; margin: 0 0 8px 0; color: var(--text-main); font-size: 1.2rem; }
        .card-content p { font-size: 0.95rem; margin: 0; color: #CFD8DC; line-height: 1.6; }
        /* Oculto en desktop — solo visible en mobile dentro de card-1 */


        /* OSCILACIONES DUARTE (Slide 2) */
        .oscillation-text {
          background: rgba(0,0,0,0.4);
          padding: 8px;
          border-radius: 0;
          margin-bottom: 10px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .oscillation-text .bad {
          color: #b8b8b8;
          text-decoration: line-through;
          text-decoration-color: rgba(255,80,80,0.7);
          text-decoration-thickness: 2px;
          font-size: 0.7rem;
        }
        .oscillation-text .arrow {
          color: var(--text-muted);
          font-size: 0.6rem;
          align-self: center;
        }
        .oscillation-text .good {
          color: var(--cyan);
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* --- SLIDE 3: BIO-METRÍA --- */
        .slide-3-layout {
          position: relative; z-index: 10;
          display: flex; width: 100%; height: 100%;
          padding: 0;
          align-items: center;
          justify-content: center;
        }

        .slide-3-bottom {
          width: 100%;
          display: flex; gap: 30px; align-items: flex-end;
          padding: 40px 60px;
          margin-left: 10%;
          max-width: 900px;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.4) 100%);
          border-radius: 0;
        }

        .bio-text-panel {
          flex: 1; max-width: 450px;
          padding-bottom: 10px;
        }

        .bio-metrics-container {
          flex: 1; max-width: 400px;
          display: flex; flex-direction: column; gap: 20px;
        }

        .bio-metrics-panel {
          width: 100%;
          background: rgba(15, 15, 15, 0.9);
          border: 1px solid #333;
          padding: 20px 25px;
          backdrop-filter: blur(10px);
          border-radius: 0;
        }

        .bio-metrics-panel .panel-title {
          font-family: var(--font-head);
          font-size: 0.85rem;
          color: var(--cyan);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #444;
          padding-bottom: 8px;
        }

        .metric-row { margin-bottom: 14px; }
        .metric-row:last-child { margin-bottom: 0; }
        .metric-header-row {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 6px;
        }
        .metric-label { font-size: 0.7rem; color: #888; letter-spacing: 1px; }
        .metric-value { font-family: var(--font-head); color: var(--cyan); font-size: 1.1rem; font-weight: 600; }
        .metric-value.warning-text {
          color: var(--orange);
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          font-family: var(--font-mono);
          font-weight: 500;
        }
        .progress-bar { width: 100%; height: 8px; background: #333; }
        .fill { height: 100%; background: var(--cyan); box-shadow: 0 0 4px var(--cyan); transition: width 1s ease; }
        .fill.warning { background: var(--orange); box-shadow: 0 0 4px var(--orange); }

        /* --- SLIDE 4: SIMULADOR --- */
        .simulator-layout {
          position: relative; z-index: 10;
          display: flex; height: 100%; padding: 80px 40px 40px; gap: 40px;
          align-items: center;
        }

        .simulator-panel {
          flex: 1; background: #1a1a1a; border: 1px solid #444;
          padding: 30px; border-radius: 0;
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }

        .simulator-panel h3 {
          font-family: var(--font-head);
          display: flex; align-items: center; gap: 10px;
          margin: 0 0 20px 0; font-size: 1.3rem; color: var(--text-main);
        }

        .sim-tabs { display: flex; border-bottom: 1px solid #333; margin-bottom: 30px; }
        .sim-tab {
          flex: 1; background: transparent; border: none; border-bottom: 2px solid transparent; color: #666;
          padding: 15px; font-family: var(--font-mono); font-weight: bold; cursor: pointer;
          font-size: 0.75rem; transition: all 0.3s;
        }
        .sim-tab:hover { color: #aaa; }
        .sim-tab.active { color: var(--cyan); border-bottom: 2px solid var(--cyan); background: rgba(0,229,255,0.05); }

        .digital-display {
          font-family: var(--font-head); text-align: center;
          font-size: 4rem; color: var(--text-main); margin: 20px 0;
        }
        .digital-display .currency { color: #666; font-size: 2rem; vertical-align: top; }
        .digital-display .unit { font-size: 1.5rem; color: var(--cyan); }
        .cop-ref { text-align: center; color: #666; font-family: var(--font-mono); margin-bottom: 20px; font-size: 1.05rem; }

        .lifestyle-insight {
          text-align: center; padding: 10px 15px; margin-bottom: 25px;
          background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15);
          font-size: 0.75rem; color: var(--cyan);
        }

        .pkg-selector { display: flex; gap: 8px; justify-content: center; margin-bottom: 20px; }
        .pkg-btn {
          padding: 8px 16px; background: transparent; border: 1px solid #444;
          color: #666; font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer;
          text-transform: uppercase; font-weight: bold; transition: all 0.3s;
        }
        .pkg-btn:hover { border-color: #888; color: #aaa; }
        .pkg-btn.active {
          background: rgba(0, 229, 255, 0.1);
          color: var(--cyan);
          border-color: var(--cyan);
          box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.2);
        }

        .controls-container label {
          display: flex; justify-content: space-between; font-size: 0.8rem; color: #aaa; margin-bottom: 10px;
        }
        .highlight-text { color: var(--cyan); font-weight: bold; font-size: 1.1rem; }
        input[type=range] { width: 100%; accent-color: var(--cyan); }
        .insight-text { font-size: 0.9rem; color: #555; margin-top: 10px; text-align: center; }

        .cta-panel {
          flex: 1; position: relative; height: 450px;
          border: 1px solid var(--orange); overflow: hidden;
        }
        .bg-image-cta {
          position: absolute; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          filter: grayscale(100%) brightness(55%);
          transition: filter 1s ease-in-out;
        }
        .cta-panel.cta-revealed .bg-image-cta,
        .cta-panel:hover .bg-image-cta { filter: grayscale(0%) brightness(85%); }
        .cta-overlay {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          gap: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: 40px; text-align: center;
        }
        .cta-buttons { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
        .cta-overlay h2 {
          font-family: var(--font-head); font-size: 2rem; text-transform: uppercase;
          letter-spacing: 2px; margin: 0 0 10px 0; color: var(--text-main);
        }
        .cta-overlay p { font-size: 0.85rem; color: #aaa; margin: 0 0 25px 0; line-height: 1.5; }

        .btn-industrial {
          background: var(--orange); color: #000; text-decoration: none;
          padding: 18px 36px; font-family: var(--font-head); font-weight: 700;
          font-size: 1.3rem; display: inline-flex; align-items: center; gap: 10px;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          transition: all 0.2s; border: none; cursor: pointer;
          box-shadow: 0 0 20px rgba(255, 61, 0, 0.3);
        }
        .btn-industrial:hover { transform: scale(1.05); background: #ff6d00; box-shadow: 0 0 30px rgba(255, 61, 0, 0.5); }

        /* Botón Secundario (Outline Cyan - menos prominente) */
        .btn-industrial.secondary {
          background: transparent;
          border: 1px solid rgba(0, 229, 255, 0.5);
          color: var(--cyan);
          clip-path: none;
          padding: 12px 24px;
          font-size: 0.9rem;
          box-shadow: none;
        }
        .btn-industrial.secondary:hover {
          background: rgba(0, 229, 255, 0.1);
          border-color: var(--cyan);
          transform: scale(1.02);
        }

        /* MOBILE NAV (bottom) */
        .mobile-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; width: 100%;
          background: rgba(10, 10, 10, 0.95); border-top: 1px solid #333;
          z-index: 100; backdrop-filter: blur(5px);
        }
        .mobile-nav-inner {
          display: flex; justify-content: space-around; padding: 8px 0;
        }
        .mobile-nav-btn {
          background: none; border: none; color: #555; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 6px 10px; transition: all 0.3s;
        }
        .mobile-nav-btn span.nav-icon { font-size: 20px; }
        .mobile-nav-btn span.nav-label { font-size: 0.55rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px; }
        .mobile-nav-btn.active { color: var(--cyan); }
        .mobile-nav-btn.active span.nav-label { font-weight: bold; }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .deck-h1 { font-size: 2rem !important; line-height: 1.1; margin-bottom: 25px !important; }
          .deck-h2 { font-size: 2rem; }
          .content-overlay { padding: 0 25px; }
          .side-focus { padding: 30px 25px; max-width: 100%; }

          .nav-controls { display: none; }
          .btn-fullscreen-mobile { display: flex; position: absolute; right: 15px; }
          .top-hud { justify-content: center; }
          .mobile-nav { display: block; }
          .slide-counter { display: none; }

          /* Slide 1: Contraste mobile */
          .deck-p { font-weight: 500; }
          .components-list { font-weight: 500; }
          .deck-h1 { text-shadow: 0px 2px 6px rgba(0,0,0,0.8); }
          .technical-label { text-shadow: 0px 1px 3px black; }

          .slide {
            padding-bottom: 70px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior-y: contain;
          }

          /* Slide 1 mobile: permitir scroll suave y optimizado */
          #slide-1 {
            scroll-behavior: smooth;
          }
          #slide-1 .content-overlay {
            height: auto;
            justify-content: flex-start;
            padding-top: 60px;
            padding-bottom: 20px;
            will-change: transform;
          }
          .contrast-plate {
            margin-bottom: 40px !important;
            padding: 30px 24px !important;
          }

          /* Scroll-snap: cada tarjeta ocupa pantalla completa */
          .grid-layout-slide-2 {
            grid-template-columns: 1fr;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            padding: 70px 15px 80px;
            gap: 15px;
          }
          .slide-2-header { text-align: center; padding-bottom: 0; }
          .slide-2-header .deck-h2 { font-size: 1.5rem !important; }
          /* Split layout: imagen arriba 50%, texto abajo 55% (5% solapamiento) */
          .card-industrial, .full-width {
            min-height: 55vh !important;
            height: auto !important;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .card-bg {
            height: 50% !important;
            top: 0;
            background-position: center !important;
          }
          .card-content {
            height: 55% !important;
            background: linear-gradient(to top, #121212 85%, transparent 100%) !important;
            padding: 20px 20px 30px !important;
            justify-content: flex-end;
          }

          .slide-3-layout { align-items: flex-end; }
          .slide-3-bottom {
            flex-direction: column;
            padding: 0 20px 80px;
            margin-left: 0;
            max-width: 100%;
            border-radius: 0;
            gap: 30px !important;
          }
          #slide-3 .slide-3-bottom {
            gap: 40px !important;
            padding-bottom: 60px !important;
          }
          #slide-3 .bio-text-panel .deck-p {
            font-size: 1.05rem !important;
            line-height: 1.6 !important;
          }
          #slide-3 .metric-label {
            font-size: 0.85rem !important;
            font-weight: 600 !important;
            letter-spacing: 1.5px !important;
            color: #B0BEC5 !important;
          }
          .bio-text-panel { max-width: 100%; }
          .bio-metrics-container { max-width: 100%; }

          /* ── Slide 4 mobile: scroll-snap vertical ── */
          #slide-4 {
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
            -webkit-overflow-scrolling: touch;
            padding-top: 0;
          }
          .simulator-layout {
            flex-direction: column;
            height: auto;
            padding: 0;
            gap: 0;
            align-items: stretch;
          }
          .simulator-panel {
            height: 100vh;
            min-height: 100vh;
            width: 100%;
            flex-shrink: 0;
            scroll-snap-align: start;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 70px 20px 90px;
            overflow-y: auto;
            box-sizing: border-box;
          }
          .cta-panel {
            height: 100vh;
            min-height: 100vh;
            width: 100%;
            flex-shrink: 0;
            scroll-snap-align: start;
            position: relative;
            overflow: hidden;
            border-left: none;
            border-right: none;
          }
          .bg-image-cta {
            position: absolute;
            top: 0; left: 0; right: 0;
            width: 100%;
            height: 40%;
            background-size: cover;
            background-position: center;
            filter: grayscale(100%) brightness(50%);
            transition: filter 0.8s ease-in-out;
          }
          .cta-panel.cta-revealed .bg-image-cta {
            filter: grayscale(0%) brightness(90%);
          }
          .cta-overlay {
            position: absolute;
            top: 40%; left: 0; right: 0; bottom: 0;
            height: auto;
            background: #111;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 20px 24px 100px;
            text-align: center;
          }
          .cta-overlay h2 { font-size: 1.5rem !important; line-height: 1.15 !important; margin: 0 0 8px !important; }
          .cta-overlay p { margin: 0 0 16px !important; font-size: 0.82rem !important; }
          .cta-buttons { gap: 20px !important; }
          .cta-buttons .btn-industrial:not(.secondary) { width: 100% !important; justify-content: center !important; font-size: 1.1rem !important; padding: 16px 24px !important; }
          .cta-buttons .btn-industrial.secondary { font-size: 0.65rem !important; padding: 10px 20px !important; width: auto !important; letter-spacing: 1.5px !important; }
          .digital-display { font-size: 3rem; }
          .btn-industrial { font-size: 1rem; padding: 12px 20px; }
        }

        /* === FULLSCREEN OVERRIDES === */

        /* -- SLIDE 2: Constrain grid, center, taller cards -- */
        :fullscreen .grid-layout-slide-2 {
          padding: 70px 60px 30px;
          gap: 18px;
          grid-template-rows: auto 1fr 1fr;
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          align-content: stretch;
        }
        :fullscreen .card-industrial {
          height: auto;
          min-height: 28vh;
        }
        :fullscreen .card-bg {
          background-size: cover;
          background-position: center;
        }
        :fullscreen .full-width {
          height: auto;
          min-height: 28vh;
        }

        /* -- SLIDE 3: Center content vertically, scale up -- */
        :fullscreen .slide-3-layout {
          align-items: center;
          justify-content: center;
        }
        :fullscreen .slide-3-bottom {
          padding: 40px 60px;
          margin-left: 10%;
          max-width: 900px;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.4) 100%);
          border-radius: 0;
        }
        :fullscreen .bio-text-panel {
          max-width: 500px;
        }
        :fullscreen .bio-text-panel .deck-h2 {
          font-size: 3.5rem;
        }
        :fullscreen .bio-text-panel .deck-p {
          font-size: 1.1rem;
        }
        :fullscreen .bio-metrics-container {
          max-width: 450px;
        }
        :fullscreen .bio-metrics-panel {
          padding: 30px 35px;
        }
        :fullscreen .metric-value {
          font-size: 1.4rem;
        }
        :fullscreen .metric-label {
          font-size: 0.8rem;
        }
        :fullscreen .progress-bar {
          height: 10px;
        }

        /* -- SLIDE 4: Simulator + massive CTA door -- */
        :fullscreen .simulator-layout {
          padding: 80px 60px 40px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 40px;
        }
        :fullscreen .simulator-panel {
          flex: 1;
          padding: 40px;
        }
        :fullscreen .cta-panel {
          flex: 2;
          height: auto;
          min-height: 600px;
          align-self: stretch;
        }
        :fullscreen .cta-overlay {
          height: 100%;
          padding: 60px;
          gap: 15px;
          justify-content: center;
        }
        :fullscreen .cta-overlay h2 {
          font-size: 3rem;
          letter-spacing: 4px;
        }
        :fullscreen .cta-overlay p {
          font-size: 1.1rem;
        }
        :fullscreen .digital-display {
          font-size: 5rem;
        }
        :fullscreen .btn-industrial {
          font-size: 1.6rem;
          padding: 24px 50px;
        }
        :fullscreen .btn-industrial.secondary {
          font-size: 1.1rem;
          padding: 16px 32px;
        }

        /* === MOBILE FULLSCREEN OPTIMIZATIONS === */
        /* Override fullscreen rules on mobile to MAXIMIZE screen usage */
        @media (max-width: 768px) {
          /* SLIDE 2: Ventanas en fullscreen mobile */
          :fullscreen .grid-layout-slide-2 {
            padding: 20px 15px 40px !important;
            gap: 15px !important;
            grid-template-rows: unset !important;
            height: auto !important;
            min-height: 100% !important;
          }
          :fullscreen .slide-2-header {
            padding-bottom: 0 !important;
          }
          :fullscreen .slide-2-header .deck-h2 {
            font-size: 1.6rem !important;
            margin-bottom: 2px !important;
          }
          :fullscreen .slide-2-subtitle {
            font-size: 0.6rem !important;
          }
          :fullscreen .card-industrial,
          :fullscreen .full-width {
            min-height: 55vh !important;
            height: auto !important;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          /* Base en fullscreen mobile — la tarjeta activa lo sobreescribe abajo */
          :fullscreen .card-industrial .card-bg {
            filter: grayscale(100%) brightness(40%) !important;
          }
          :fullscreen .card-industrial.card-active .card-bg {
            filter: grayscale(0%) brightness(70%) !important;
            transform: scale(1.05);
          }
          :fullscreen .card-industrial.card-active {
            border-color: var(--cyan);
          }

          /* SLIDE 4: Figuras deben CRECER en fullscreen mobile */
          /* ── Slide 4 fullscreen mobile ── */
          :fullscreen #slide-4 { overflow-y: scroll !important; scroll-snap-type: y mandatory !important; height: 100vh !important; padding: 0 !important; -webkit-overflow-scrolling: touch; }
          :fullscreen #slide-4 .simulator-layout { flex-direction: column !important; height: auto !important; padding: 0 !important; gap: 0 !important; align-items: stretch !important; }
          :fullscreen #slide-4 .simulator-panel { height: 100vh !important; min-height: 100vh !important; width: 100% !important; flex: none !important; scroll-snap-align: start !important; display: flex !important; flex-direction: column !important; justify-content: center !important; padding: 20px 20px 60px !important; overflow-y: auto !important; box-sizing: border-box !important; }
          :fullscreen #slide-4 .cta-panel { height: 100vh !important; min-height: 100vh !important; scroll-snap-align: start !important; flex: none !important; width: 100% !important; border: none !important; }
          :fullscreen #slide-4 .bg-image-cta { height: 40% !important; }
          :fullscreen #slide-4 .cta-overlay { top: 40% !important; justify-content: flex-start !important; padding: 20px 24px 60px !important; }
          :fullscreen .cta-overlay h2 {
            font-size: 2rem !important;
            letter-spacing: 2px !important;
          }
          :fullscreen .digital-display {
            font-size: 3rem !important;
          }
          :fullscreen .btn-industrial {
            font-size: 1.2rem !important;
            padding: 18px 35px !important;
          }

          /* HIDE NAV IN FULLSCREEN (both orientations) */
          :fullscreen .top-hud { display: none !important; }
          :fullscreen .mobile-nav { display: none !important; }

          /* SLIDE 3: mobile vertical fullscreen — evitar overflow */
          :fullscreen #slide-3 { overflow-y: auto !important; }
          :fullscreen .slide-3-layout {
            align-items: flex-start !important;
            overflow-y: auto !important;
            padding-top: 20px !important;
          }
          :fullscreen .slide-3-bottom {
            flex-direction: column !important;
            padding: 20px 20px 40px !important;
            margin-left: 0 !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            gap: 15px !important;
          }
          :fullscreen .bio-text-panel { max-width: 100% !important; }
          :fullscreen .bio-text-panel .deck-h2 { font-size: 2rem !important; }
          :fullscreen .bio-text-panel .deck-p { font-size: 0.85rem !important; line-height: 1.5 !important; }
          :fullscreen .bio-metrics-container { max-width: 100% !important; }
          :fullscreen .bio-metrics-panel { padding: 15px 18px !important; }
          :fullscreen .metric-value { font-size: 1rem !important; }
          :fullscreen .metric-label { font-size: 0.65rem !important; }
          :fullscreen .progress-bar { height: 6px !important; }
        }

        /* === LANDSCAPE MOBILE FULLSCREEN === */
        /* Phones in landscape are 844–926px wide — outside max-width:768px, need separate rule */
        @media (orientation: landscape) and (max-width: 1024px) {
          :fullscreen .slide {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          :fullscreen .top-hud { display: none !important; }
          :fullscreen .mobile-nav { display: none !important; }
        }

        /* === LARGE SCREEN OVERRIDES (same as fullscreen, for manual resize) === */
        @media (min-width: 1200px) {
          /* -- SLIDE 2 -- */
          .grid-layout-slide-2 {
            max-width: 1200px;
            margin: 0 auto;
          }
          .card-industrial {
            height: auto;
            min-height: 28vh;
          }
          .full-width {
            height: auto;
            min-height: 28vh;
          }

          /* -- SLIDE 4 -- */
          .simulator-layout {
            max-width: 1400px;
            margin: 0 auto;
          }
          .cta-panel {
            flex: 2;
            height: auto;
            min-height: 500px;
          }
          .cta-overlay {
            height: 100%;
            padding: 50px;
          }
          .cta-overlay h2 {
            font-size: 2.5rem;
            letter-spacing: 3px;
          }
        }

        /* === MOBILE SCROLL-ACTIVATED CARD HIGHLIGHT === */
        /* Mismo efecto que el hover en desktop: imagen a color completo + scale */
        @media (max-width: 1024px) {
          .card-industrial.card-active .card-bg {
            filter: grayscale(0%) brightness(70%) !important;
            transform: scale(1.05);
          }
          .card-industrial.card-active {
            border-color: var(--cyan);
          }
        }

        /* SCROLLBAR */
        .industrial-theme {
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
        }
      `}</style>

      <div className="industrial-theme">
        <div className="noise-overlay" />

        {/* TOP HUD - Desktop */}
        <nav className="top-hud" style={queswaOpen ? { display: 'none' } : undefined}>
          <button className="btn-fullscreen btn-fullscreen-mobile" onClick={toggleFullscreen} title="Pantalla completa (F)">
            <span className="material-symbols-sharp">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
          <div className="brand">
            <span className="material-symbols-sharp">precision_manufacturing</span>
            <span>CREATUACTIVO.SYS // V2.1</span>
          </div>
          <div className="nav-controls">
            {[
              { id: 1, label: '01 INFRAESTRUCTURA' },
              { id: 2, label: '02 MEC\u00c1NICA' },
              { id: 3, label: '03 BIO-METR\u00cdA' },
              { id: 4, label: '04 SIMULACI\u00d3N' },
            ].map((s) => (
              <button
                key={s.id}
                className={`nav-btn ${activeSlide === s.id ? 'active' : ''}`}
                onClick={() => showSlide(s.id)}
              >
                {s.label}
              </button>
            ))}
            <button className="btn-fullscreen" onClick={toggleFullscreen} title="Pantalla completa (F)">
              <span className="material-symbols-sharp">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </nav>

        {/* MOBILE BOTTOM NAV */}
        <div className="mobile-nav" style={queswaOpen ? { display: 'none' } : undefined}>
          <div className="mobile-nav-inner">
            {[
              { id: 1, icon: 'bolt', label: 'Infra' },
              { id: 2, icon: 'autorenew', label: 'Mec\u00e1nica' },
              { id: 3, icon: 'biotech', label: 'Bio' },
              { id: 4, icon: 'calculate', label: 'Simular' },
            ].map((s) => (
              <button
                key={s.id}
                className={`mobile-nav-btn ${activeSlide === s.id ? 'active' : ''}`}
                onClick={() => showSlide(s.id)}
              >
                <span className="material-symbols-sharp nav-icon">{s.icon}</span>
                <span className="nav-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Slide counter (desktop) */}
        <div className="slide-counter">{activeSlide} / {TOTAL_SLIDES}</div>

        {/* MAIN DECK */}
        <main
          className="deck-container"
          onClick={handleSlideClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* ===== SLIDE 1: INFRAESTRUCTURA ===== */}
          <section id="slide-1" className={`slide ${activeSlide === 1 ? 'active' : ''}`}>
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/turbina.jpg')" }}
            />
            <div className="content-overlay center-focus">
              <div className="technical-label">REF: APALANCAMIENTO_100X</div>
              <h1 className="deck-h1">
                INFRAESTRUCTURA<br />
                <span style={{ color: 'var(--orange)' }}>DE MULTIPLICACI&Oacute;N</span>
              </h1>
              <div className="contrast-plate">
                <p className="deck-p" style={{ textAlign: 'center', margin: '0 auto' }}>
                  El &quot;Plan por Defecto&quot; falla porque exige tu presencia f&iacute;sica. Hemos ensamblado una m&aacute;quina h&iacute;brida de 3 componentes que elimina esa falla:
                </p>

                <div className="components-list">
                  <div className="comp-row">
                    <span style={{ color: 'var(--cyan)' }}>EL M&Uacute;SCULO LOG&Iacute;STICO</span><span style={{ color: '#90A4AE' }}> (Gano Excel):</span> Infraestructura y Capital. Ellos fabrican, manejan inventarios y realizan env&iacute;os a toda Am&eacute;rica. Tu trabajo no es empacar cajas.
                  </div>
                  <div className="comp-row">
                    <span style={{ color: 'var(--cyan)' }}>EL CEREBRO DIGITAL</span><span style={{ color: '#90A4AE' }}> (CreaTuActivo):</span> Plataforma tecnol&oacute;gica de 11 Estrellas. Un sistema operativo impulsado por IA que trabaja por ti 24/7 en internet.
                  </div>
                  <div className="comp-row">
                    <span style={{ color: 'var(--orange)' }}>LA DIRECCI&Oacute;N</span><span style={{ color: '#90A4AE' }}> (Tu Rol):</span> Labor 100% gerencial. Desde tu celular diriges el tr&aacute;fico hacia el sistema. Nosotros operamos la f&aacute;brica; t&uacute; diriges y cobras.
                  </div>
                </div>
              </div>

              <button className="btn-next" onClick={() => showSlide(2)}>
                ANALIZAR MEC&Aacute;NICA <span className="material-symbols-sharp">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* ===== SLIDE 2: LA VENTAJA INJUSTA ===== */}
          <section id="slide-2" className={`slide ${activeSlide === 2 ? 'active' : ''}`}>
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/fondo-global-hormigon.jpg')", opacity: 0.4 }}
            />
            <div className="grid-layout-slide-2">
              {/* Título */}
              <div className="slide-2-header">
                <h2 className="deck-h2" style={{ fontSize: '2rem', marginBottom: 4 }}>
                  LA VENTAJA INJUSTA.
                </h2>
                <span className="slide-2-subtitle">
                  EL FIN DE LA FRICCI&Oacute;N OPERATIVA &mdash;{' '}
                </span>
                <div className="exclusive-badge" style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '2px',
                  color: '#90A4AE',
                  border: '1px solid #3f3f46',
                  display: 'inline-block',
                  padding: '4px 8px',
                  marginTop: '10px',
                  marginLeft: '8px',
                }}>
                  EXCLUSIVO: <span style={{ color: 'var(--orange)', fontWeight: 'bold' }}>C.T.A.</span>
                </div>
              </div>

              {/* Tarjeta 1 (izquierda): EXPANSIÓN DIGITAL */}
              <div className={`card-industrial ${activeCardIndex === 0 ? 'card-active' : ''}`}>
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/tech-servers.jpg')", backgroundPosition: "center center", backgroundSize: "cover" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad"><s>ROGAR</s> &middot; <s>CONVENCER</s> &middot; <s>PERSEGUIR</s></span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">cell_tower</span>
                    EXPANSI&Oacute;N DIGITAL
                  </h3>
                  <p>Tu celular es tu centro de mando. Despliegas informaci&oacute;n 100% digital llegando a cientos de personas. Dejas de ser el vendedor que ruega para ser el arquitecto que orquesta tr&aacute;fico.</p>
                  <button
                    style={{
                      marginTop: 10, background: 'transparent',
                      border: '1px solid rgba(0,229,255,0.4)', color: 'var(--cyan)',
                      fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                      padding: '5px 10px', cursor: 'pointer', letterSpacing: 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(0,229,255,0.1)'; (e.target as HTMLElement).style.borderColor = 'var(--cyan)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.borderColor = 'rgba(0,229,255,0.4)'; }}
                    onClick={e => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('open-queswa')); }}
                  >
                    PREGÚNTALE ALGO EN VIVO ›
                  </button>
                </div>
              </div>

              {/* Tarjeta 2 (sup. derecha): EL CEREBRO QUESWA AI */}
              <div className={`card-industrial ${activeCardIndex === 1 ? 'card-active' : ''}`}>
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/tech-console.jpg')", backgroundPosition: "center center", backgroundSize: "cover" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad"><s>IMPROVISAR</s> &middot; <s>MEMORIZAR GUIONES</s> &middot; <s>TITUBEAR</s></span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">memory</span>
                    EL CEREBRO QUESWA AI
                  </h3>
                  <p>El 90% del trabajo pesado resuelto. Nuestro agente IA perfila, procesa objeciones y filtra curiosos 24/7. Cero improvisaci&oacute;n; solo hablas con quienes est&aacute;n listos.</p>
                </div>
              </div>

              {/* Tarjeta 3 (full-width): ESCALA AUTÓNOMA */}
              <div className={`card-industrial full-width ${activeCardIndex === 2 ? 'card-active' : ''}`}>
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/tech-duplication.jpg')", backgroundPosition: "center center", backgroundSize: "cover" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad"><s>CAPACITAR MANUALMENTE</s> &middot; <s>MICROMANEJAR</s> &middot; <s>CUELLO DE BOTELLA</s></span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">hub</span>
                    ESCALA AUT&Oacute;NOMA
                  </h3>
                  <p>La Academia Queswa educa a tus socios en autom&aacute;tico. Desarrollan maestr&iacute;a, liderazgo e inteligencia financiera. La red crece sin que tu tiempo sea el l&iacute;mite.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SLIDE 3: BIO-METRÍA (Panel único consolidado) ===== */}
          <section id="slide-3" className={`slide ${activeSlide === 3 ? 'active' : ''}`}>
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/salud-bio.jpg')", filter: 'grayscale(40%) contrast(110%) brightness(70%)' }}
            />
            <div className="slide-3-layout">
              <div className="slide-3-bottom">
                <div className="bio-text-panel">
                  <div className="technical-label">VEH&Iacute;CULO BIOL&Oacute;GICO</div>
                  <h2 className="deck-h2">OPTIMIZACI&Oacute;N<br />CELULAR</h2>
                  <p className="deck-p">
                    La riqueza sin salud es un error de c&aacute;lculo. Operamos con una estrategia de &ldquo;fricci&oacute;n cero&rdquo;, transformando el consumo diario en tecnolog&iacute;a nutricional impulsada por Ganoderma. Nuestro ecosistema est&aacute; coronado por LUVOCO: infraestructura de lujo (m&aacute;quinas de precisi&oacute;n y c&aacute;psulas premium) para hogares y corporativos. La regla es simple: Un h&aacute;bito irrompible genera un flujo de caja inquebrantable.
                  </p>
                </div>

                <div className="bio-metrics-container">
                  <div className="bio-metrics-panel">
                    <div className="panel-title">
                      <span className="material-symbols-sharp" style={{ fontSize: 18 }}>biotech</span>
                      SCAN: BIO-METR&Iacute;A
                    </div>
                    <div className="metric-row">
                      <div className="metric-header-row">
                        <span className="metric-label">VITALIDAD</span>
                        <span className="metric-value">94%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="fill" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div className="metric-row">
                      <div className="metric-header-row">
                        <span className="metric-label">RESISTENCIA</span>
                        <span className="metric-value">89%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="fill" style={{ width: '89%' }} />
                      </div>
                    </div>
                    <div className="metric-row">
                      <div className="metric-header-row">
                        <span className="metric-label">RECUPERACI&Oacute;N</span>
                        <span className="metric-value warning-text">62% - EN PROCESO</span>
                      </div>
                      <div className="progress-bar">
                        <div className="fill warning" style={{ width: '62%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SLIDE 4: SIMULACIÓN + DOBLE CTA ===== */}
          <section id="slide-4" className={`slide ${activeSlide === 4 ? 'active' : ''}`}>
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/fondo-global-hormigon.jpg')", opacity: 0.3 }}
            />
            <div className="simulator-layout">
              {/* Panel del Simulador */}
              <div className="simulator-panel">
                <h3>
                  <span className="material-symbols-sharp">calculate</span>
                  SIMULADOR DE FLUJO
                </h3>

                {/* Tabs del Simulador */}
                <div className="sim-tabs">
                  <button
                    className={`sim-tab ${simMode === 'gen5' ? 'active' : ''}`}
                    onClick={() => setSimMode('gen5')}
                  >
                    CAPITAL R&Aacute;PIDO (GEN5)
                  </button>
                  <button
                    className={`sim-tab ${simMode === 'binario' ? 'active' : ''}`}
                    onClick={() => setSimMode('binario')}
                  >
                    RENTA VITALICIA
                  </button>
                </div>

                {/* Display Digital */}
                <div className="digital-display">
                  <span className="currency">$</span>
                  <span>{currentUSD.toLocaleString()}</span>
                  <span className="unit"> USD</span>
                </div>
                <div className="cop-ref">
                  &asymp; ${currentCOP} COP
                </div>

                {/* Insight de Estilo de Vida */}
                <div className="lifestyle-insight">
                  {getLifestyleTranslation(currentUSD)}
                </div>

                {/* Controles GEN5 */}
                {simMode === 'gen5' && (
                  <div className="controls-container">
                    <div className="pkg-selector">
                      {(['ESP1', 'ESP2', 'ESP3'] as const).map((pkg) => (
                        <button
                          key={pkg}
                          className={`pkg-btn ${gen5Package === pkg ? 'active' : ''}`}
                          onClick={() => setGen5Package(pkg)}
                        >
                          {pkg === 'ESP1' ? 'Inicial' : pkg === 'ESP2' ? 'Pro' : 'Visionario'}
                        </button>
                      ))}
                    </div>
                    <label>
                      SOCIOS ACTIVADOS POR EL ECOSISTEMA:
                      <span className="highlight-text">{gen5Socios}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={gen5Socios}
                      onChange={(e) => setGen5Socios(parseInt(e.target.value))}
                    />
                    <p className="insight-text">Capitalizaci&oacute;n generada a partir del tr&aacute;fico suministrado a la plataforma.</p>
                  </div>
                )}

                {/* Controles Binario */}
                {simMode === 'binario' && (
                  <div className="controls-container">
                    <label>
                      HOGARES FIDELIZADOS:
                      <span className="highlight-text">{binarioParejas}</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={binarioParejas}
                      onChange={(e) => setBinarioParejas(parseInt(e.target.value))}
                    />
                    <p className="insight-text">Flujo de caja semanal generado por el volumen de consumo.</p>
                  </div>
                )}
              </div>

              {/* Panel CTA - Doble acción */}
              <div className={`cta-panel${ctaVisible ? ' cta-revealed' : ''}`}>
                <div
                  className="bg-image-cta"
                  style={{ backgroundImage: "url('/images/servilleta/boton-accion.jpg')" }}
                />
                <div className="cta-overlay">
                  <h2>TOMA EL MANDO OPERATIVO</h2>
                  <p>Dos rutas para asumir tu posici&oacute;n en la junta:</p>

                  <div className="cta-buttons">
                    {/* CTA Principal: Asumir Dirección → /paquetes */}
                    <a
                      href="https://creatuactivo.com/paquetes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-industrial"
                    >
                      <span className="material-symbols-sharp">rocket_launch</span>
                      ASUMIR DIRECCI&Oacute;N
                    </a>

                    {/* CTA Secundario: Auditar Infraestructura → /mapa-de-salida */}
                    <a
                      href="https://creatuactivo.com/mapa-de-salida"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-industrial secondary"
                    >
                      <span className="material-symbols-sharp">verified_user</span>
                      AUDITAR INFRAESTRUCTURA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
