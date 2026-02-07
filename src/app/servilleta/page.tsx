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
  const touchStartX = React.useRef(0);

  // Cargar fuentes dinámicamente
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Roboto+Mono:wght@300;400;500&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const iconLink = document.createElement('link');
    iconLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0';
    iconLink.rel = 'stylesheet';
    document.head.appendChild(iconLink);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(iconLink);
    };
  }, []);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Click-to-advance (ignora elementos interactivos)
  const handleSlideClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // No avanzar si se hace clic en elementos interactivos
    if (target.closest('button, a, input, .sim-tabs, .pkg-selector, .controls-container, .simulator-panel, .cta-buttons')) {
      return;
    }
    setActiveSlide((prev) => (prev < TOTAL_SLIDES ? prev + 1 : prev));
  }, []);

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
    if (usd < 100) return "Cubre factura de celular e internet.";
    if (usd <= 300) return "Cubre todos los servicios del hogar.";
    if (usd < 600) return "Paga la cuota de un vehículo gama media.";
    if (usd < 1000) return "Cubre un arriendo en zona exclusiva.";
    if (usd < 2000) return "Libertad de la presión financiera mensual.";
    return "Estilo de vida de abundancia (Top 5% ingresos).";
  };

  const showSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  return (
    <>
      <style>{`
        /* --- VARIABLES INDUSTRIALES --- */
        :root {
          --bg-dark: #121212;
          --concrete: #1e1e1e;
          --steel: #37474f;
          --cyan: #00e5ff;
          --orange: #ff3d00;
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
          padding: 8px 12px; transition: all 0.3s; border-radius: 4px;
        }
        .nav-btn:hover { color: var(--text-main); background: #222; }
        .nav-btn.active { color: var(--cyan); background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.2); }

        /* Fullscreen button */
        .btn-fullscreen {
          background: transparent; border: 1px solid #444; color: #666;
          cursor: pointer; padding: 6px 8px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; margin-left: 10px;
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
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        /* LISTA DE COMPONENTES (Slide 1) */
        .components-list {
          text-align: left; display: inline-block; margin-top: 20px;
          font-family: var(--font-head); font-size: 1.1rem; color: var(--text-main);
        }
        .components-list .comp-row {
          border-bottom: 1px solid #333; padding-bottom: 8px; margin-bottom: 10px;
        }
        .components-list .comp-row:last-child { border-bottom: none; margin-bottom: 0; }

        /* BOTÓN SIGUIENTE */
        .btn-next {
          margin-top: 30px; padding: 15px 30px;
          background: transparent; border: 1px solid var(--text-main); color: var(--text-main);
          font-family: var(--font-head); font-size: 1.2rem; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s;
        }
        .btn-next:hover { background: var(--text-main); color: #000; }

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
        .card-content h3 { font-family: var(--font-head); display: flex; align-items: center; gap: 10px; margin: 0 0 5px 0; color: var(--text-main); font-size: 1.1rem; }
        .card-content p { font-size: 0.8rem; margin: 0; color: #aaa; line-height: 1.4; }

        /* OSCILACIONES DUARTE (Slide 2) */
        .oscillation-text {
          background: rgba(0,0,0,0.4);
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .oscillation-text .bad {
          color: #777;
          text-decoration: line-through;
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
          align-items: flex-end;
        }

        .slide-3-bottom {
          width: 100%;
          display: flex; gap: 30px; align-items: flex-end;
          padding: 0 40px 40px;
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%);
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
        .metric-value.warning-text { color: var(--orange); font-size: 0.75rem; }
        .progress-bar { width: 100%; height: 8px; background: #333; }
        .fill { height: 100%; background: var(--cyan); box-shadow: 0 0 10px var(--cyan); transition: width 1s ease; }
        .fill.warning { background: var(--orange); box-shadow: 0 0 10px var(--orange); }

        /* --- SLIDE 4: SIMULADOR --- */
        .simulator-layout {
          position: relative; z-index: 10;
          display: flex; height: 100%; padding: 80px 40px 40px; gap: 40px;
          align-items: center;
        }

        .simulator-panel {
          flex: 1; background: #1a1a1a; border: 1px solid #444;
          padding: 30px; border-radius: 4px;
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
        .cop-ref { text-align: center; color: #666; font-family: var(--font-mono); margin-bottom: 20px; font-size: 0.85rem; }

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
        .pkg-btn.active { background: var(--cyan); color: #000; border-color: var(--cyan); }

        .controls-container label {
          display: flex; justify-content: space-between; font-size: 0.8rem; color: #aaa; margin-bottom: 10px;
        }
        .highlight-text { color: var(--cyan); font-weight: bold; font-size: 1.1rem; }
        input[type=range] { width: 100%; accent-color: var(--cyan); }
        .insight-text { font-size: 0.7rem; color: #555; margin-top: 10px; text-align: center; }

        .cta-panel {
          flex: 1; position: relative; height: 450px;
          border: 1px solid var(--orange); overflow: hidden;
        }
        .bg-image-cta {
          position: absolute; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          filter: grayscale(50%) brightness(60%);
        }
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
          body { overflow: hidden; }
          .deck-h1 { font-size: 2.5rem; }
          .deck-h2 { font-size: 2rem; }
          .content-overlay { padding: 0 25px; }
          .side-focus { padding: 30px 25px; max-width: 100%; }

          .nav-controls { display: none; }
          .top-hud { justify-content: center; }
          .mobile-nav { display: block; }
          .slide-counter { display: none; }

          /* Slide 1: Contraste mobile */
          .deck-p { font-weight: 500; }
          .components-list { font-weight: 500; }
          .deck-h1 { text-shadow: 0px 2px 6px rgba(0,0,0,0.8); }
          .technical-label { text-shadow: 0px 1px 3px black; }

          .slide { padding-bottom: 70px; overflow-y: auto; }

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
          .card-industrial { height: 220px; flex-shrink: 0; }
          .full-width { height: 200px; }

          .slide-3-layout { align-items: flex-end; }
          .slide-3-bottom {
            flex-direction: column;
            padding: 0 20px 80px;
            gap: 20px;
          }
          .bio-text-panel { max-width: 100%; }
          .bio-metrics-container { max-width: 100%; }

          .simulator-layout {
            flex-direction: column;
            height: auto;
            overflow-y: visible;
            padding: 70px 15px 80px;
            gap: 20px;
            align-items: stretch;
          }
          .simulator-panel { width: 100%; flex-shrink: 0; }
          .cta-panel { width: 100%; height: 350px; flex-shrink: 0; }
          .digital-display { font-size: 3rem; }
          .btn-industrial { font-size: 1rem; padding: 12px 20px; }
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
        <nav className="top-hud">
          <button className="btn-fullscreen" onClick={toggleFullscreen} title="Pantalla completa (F)"
            style={{ position: 'absolute', right: 15 }}>
            <span className="material-symbols-sharp">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
          <div className="brand">
            <span className="material-symbols-sharp">precision_manufacturing</span>
            <span>QUESWA.SYS // V2.1</span>
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
          </div>
        </nav>

        {/* MOBILE BOTTOM NAV */}
        <div className="mobile-nav">
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
                INFRAESTRUCTURA<br />DE MULTIPLICACI&Oacute;N
              </h1>
              <div className="contrast-plate">
                <p className="deck-p" style={{ textAlign: 'center', margin: '0 auto' }}>
                  El &quot;Plan por Defecto&quot; tiene una falla estructural: depende de tu presencia f&iacute;sica.
                  <br /><br />
                  Hemos construido una m&aacute;quina h&iacute;brida de 3 componentes:
                </p>

                <div className="components-list">
                  <div className="comp-row">
                    <span style={{ color: 'var(--cyan)' }}>1. GANO EXCEL:</span> Infraestructura y Capital ($100M USD).
                  </div>
                  <div className="comp-row">
                    <span style={{ color: 'var(--cyan)' }}>2. QUESWA:</span> Nuestra Plataforma Digital Propietaria.
                  </div>
                  <div className="comp-row">
                    <span style={{ color: 'var(--orange)' }}>3. T&Uacute;:</span> Direcci&oacute;n y Expansi&oacute;n.
                  </div>
                </div>
              </div>

              <button className="btn-next" onClick={() => showSlide(2)}>
                ANALIZAR MEC&Aacute;NICA <span className="material-symbols-sharp">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* ===== SLIDE 2: MECÁNICA (Oscilaciones Duarte/Jobs) ===== */}
          <section id="slide-2" className={`slide ${activeSlide === 2 ? 'active' : ''}`}>
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/fondo-global-hormigon.jpg')", opacity: 0.4 }}
            />
            <div className="grid-layout-slide-2">
              {/* Título de la diapositiva */}
              <div className="slide-2-header">
                <h2 className="deck-h2" style={{ fontSize: '2rem', marginBottom: 4 }}>MEC&Aacute;NICA DE APALANCAMIENTO</h2>
                <span className="slide-2-subtitle">COMPARATIVA DE RENDIMIENTO</span>
              </div>

              {/* Tracción Híbrida */}
              <div className="card-industrial">
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/engranajes.jpg')" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad">TU ESFUERZO F&Iacute;SICO</span>
                    <span className="arrow">&#10148;</span>
                    <span className="good">SISTEMA DE APALANCAMIENTO</span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">autorenew</span>
                    TRACCI&Oacute;N H&Iacute;BRIDA
                  </h3>
                  <p>Tu peque&ntilde;o aporte se multiplica x100 mediante engranajes digitales.</p>
                </div>
              </div>

              {/* Carga Cero */}
              <div className="card-industrial">
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/estructura-cables.jpg')" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad">RESPONSABILIDAD 100%</span>
                    <span className="arrow">&#10148;</span>
                    <span className="good">RESPALDO CORPORATIVO</span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">engineering</span>
                    CARGA CERO
                  </h3>
                  <p>La log&iacute;stica y legalidad descansan sobre tensores de acero, no sobre tu espalda.</p>
                </div>
              </div>

              {/* Patrimonio Real */}
              <div className="card-industrial full-width">
                <div className="card-bg" style={{ backgroundImage: "url('/images/servilleta/riqueza-boveda.jpg')" }} />
                <div className="card-content">
                  <div className="oscillation-text">
                    <span className="bad">INGRESO LINEAL</span>
                    <span className="arrow">&#10148;</span>
                    <span className="good">ACTIVO HEREDABLE</span>
                  </div>
                  <h3>
                    <span className="material-symbols-sharp">lock</span>
                    PATRIMONIO REAL
                  </h3>
                  <p>No construyes para fin de mes. Construyes un c&oacute;digo transferible a tu familia.</p>
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
                  <div className="technical-label">MANTENIMIENTO BIOL&Oacute;GICO</div>
                  <h2 className="deck-h2">OPTIMIZACI&Oacute;N<br />CELULAR</h2>
                  <p className="deck-p">
                    La riqueza sin salud es un error de c&aacute;lculo. Nuestro producto no es &quot;caf&eacute;&quot;, es tecnolog&iacute;a nutricional 100% hidrosoluble.
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
                        <span className="metric-label">SISTEMA INMUNE</span>
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
                      SOCIOS DIRECTOS:
                      <span className="highlight-text">{gen5Socios}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={gen5Socios}
                      onChange={(e) => setGen5Socios(parseInt(e.target.value))}
                    />
                    <p className="insight-text">Pago &uacute;nico por expansi&oacute;n de infraestructura.</p>
                  </div>
                )}

                {/* Controles Binario */}
                {simMode === 'binario' && (
                  <div className="controls-container">
                    <label>
                      RED DE CONSUMO (PERSONAS):
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
                    <p className="insight-text">Ingreso semanal recurrente por consumo de caf&eacute;.</p>
                  </div>
                )}
              </div>

              {/* Panel CTA - Doble acción */}
              <div className="cta-panel">
                <div
                  className="bg-image-cta"
                  style={{ backgroundImage: "url('/images/servilleta/boton-accion.jpg')" }}
                />
                <div className="cta-overlay">
                  <h2>INICIAR ACTUALIZACI&Oacute;N</h2>
                  <p>Dos caminos para activar tu c&oacute;digo:</p>

                  <div className="cta-buttons">
                    {/* CTA Principal: Iniciar → /paquetes */}
                    <a
                      href="https://creatuactivo.com/paquetes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-industrial"
                    >
                      <span className="material-symbols-sharp">rocket_launch</span>
                      INICIAR EJECUCI&Oacute;N
                    </a>

                    {/* CTA Secundario: Auditar → /reto-5-dias */}
                    <a
                      href="https://creatuactivo.com/reto-5-dias"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-industrial secondary"
                    >
                      <span className="material-symbols-sharp">verified_user</span>
                      AUDITAR EL MODELO (RETO 5 D&Iacute;AS)
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
