/**
 * SERVILLETA DIGITAL v3.0 - BENTO GRID INDUSTRIAL
 * Traducción directa del código HTML/CSS proporcionado a Next.js
 */

'use client';

import React, { useEffect } from 'react';

export default function Servilleta3Page() {

  // Cargar fuentes dinámicamente en el client
  useEffect(() => {
    // Rajdhani + Roboto Mono
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Roboto+Mono:wght@300;400;500&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Material Symbols Sharp
    const iconLink = document.createElement('link');
    iconLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,0,0';
    iconLink.rel = 'stylesheet';
    document.head.appendChild(iconLink);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(iconLink);
    };
  }, []);

  return (
    <>
      {/* ESTILOS COMPLETOS */}
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
          background-image: url('/images/servilleta/fondo-global-hormigon.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-blend-mode: multiply;
          color: var(--text-main);
          font-family: var(--font-mono);
          height: 100vh;
          overflow: hidden;
        }

        /* --- NOISE --- */
        .noise-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
          z-index: 90;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* --- TOP HUD --- */
        .top-hud {
          display: flex;
          justify-content: space-between;
          padding: 15px 25px;
          background: rgba(10, 10, 10, 0.8);
          border-bottom: 1px solid #333;
          backdrop-filter: blur(5px);
          position: relative;
          z-index: 100;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-head);
          font-weight: 700;
          letter-spacing: 2px;
          font-size: 1.2rem;
          color: var(--text-main);
        }

        .user-status {
          font-size: 0.8rem;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .blink {
          animation: blinker 2s linear infinite;
          color: var(--orange);
        }

        @keyframes blinker {
          50% { opacity: 0; }
        }

        /* --- BENTO GRID LAYOUT --- */
        .main-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 10px;
          padding: 10px;
          height: calc(100vh - 60px);
        }

        /* --- MÓDULOS GENERALES --- */
        .module {
          position: relative;
          background: var(--concrete);
          border: 1px solid #333;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .bg-image {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover;
          background-position: center;
          filter: grayscale(80%) contrast(120%) brightness(60%);
          transition: all 0.5s ease;
        }

        .module:hover .bg-image {
          filter: grayscale(0%) contrast(110%) brightness(80%);
          transform: scale(1.02);
        }

        /* --- GRID AREAS --- */
        .hero-module {
          grid-column: 1 / span 2;
          grid-row: 1 / span 2;
          border: 1px solid var(--cyan);
        }

        .mechanic-module { grid-column: 3; grid-row: 1; }
        .structure-module { grid-column: 4; grid-row: 1; }
        .wealth-module { grid-column: 3; grid-row: 2; }
        .health-module { grid-column: 4; grid-row: 2; }

        .cta-module {
          grid-column: 1 / span 4;
          grid-row: 3;
          border: 1px solid var(--orange);
        }

        /* --- TEXTOS Y PANELES --- */
        .content-overlay {
          position: relative;
          z-index: 2;
          padding: 30px;
          background: linear-gradient(to right, rgba(0,0,0,0.9), transparent);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .technical-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--cyan);
          margin-bottom: 10px;
          border-left: 2px solid var(--cyan);
          padding-left: 10px;
        }

        h1 {
          font-family: var(--font-head);
          font-size: 2.5rem;
          line-height: 1;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          color: var(--text-main);
        }

        .mission-text {
          max-width: 400px;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #ccc;
        }

        .glass-panel {
          position: absolute;
          z-index: 2;
          width: 100%;
          padding: 15px;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(8px);
          border-top: 1px solid #444;
        }

        .glass-panel.bottom { bottom: 0; }
        .glass-panel.top { top: 0; border-bottom: 1px solid #444; border-top: none; }

        .glass-panel h3 {
          font-family: var(--font-head);
          margin: 0 0 5px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .glass-panel p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .data-overlay {
          position: absolute;
          bottom: 20px; left: 20px;
          z-index: 2;
        }

        .metric {
          background: rgba(0,0,0,0.8);
          padding: 5px 10px;
          border-left: 3px solid var(--cyan);
        }

        .metric .label {
          display: block;
          font-size: 0.6rem;
          color: #888;
        }

        .metric .value {
          font-family: var(--font-head);
          font-size: 1.2rem;
          color: var(--text-main);
        }

        /* --- CTA MODULE --- */
        .cta-module .cta-content {
          position: relative;
          z-index: 2;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          background: linear-gradient(to right, rgba(0,0,0,0.8), transparent);
        }

        .cta-content h2 {
          font-family: var(--font-head);
          font-size: 2rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
          color: var(--text-main);
        }

        .btn-industrial {
          background: var(--orange);
          color: #000;
          border: none;
          padding: 15px 30px;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.2rem;
          text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .btn-industrial:hover {
          background: #ff6d00;
          letter-spacing: 1px;
        }

        /* --- RESPONSIVE MOBILE --- */
        @media (max-width: 768px) {
          .main-grid {
            display: flex;
            flex-direction: column;
            height: auto;
            overflow-y: auto;
          }
          .hero-module { height: 400px; }
          .module { height: 250px; }
          body { overflow-y: auto; }
          .cta-content h2 { font-size: 1.2rem; }
          .btn-industrial { padding: 12px 20px; font-size: 1rem; }
        }

        /* --- SCROLLBAR --- */
        .industrial-theme {
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
        }
      `}</style>

      <div className="industrial-theme">

        {/* NOISE OVERLAY */}
        <div className="noise-overlay" />

        {/* TOP HUD */}
        <nav className="top-hud">
          <div className="brand">
            <span className="material-symbols-sharp">precision_manufacturing</span>
            <span>QUESWA.SYS</span>
          </div>
          <div className="user-status">
            <span className="label">ESTADO:</span>
            <span className="value blink">ESPERANDO ACTIVACI&Oacute;N</span>
          </div>
        </nav>

        {/* MAIN BENTO GRID */}
        <main className="main-grid">

          {/* HERO MODULE - Turbina */}
          <section className="module hero-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/turbina.jpg')" }}
            />
            <div className="content-overlay">
              <div className="technical-label">REF: APALANCAMIENTO_100X</div>
              <h1>
                INFRAESTRUCTURA<br />DE MULTIPLICACI&Oacute;N
              </h1>
              <p className="mission-text">
                El &quot;Plan por Defecto&quot; tiene una falla estructural: depende de tu presencia f&iacute;sica.
                <br /><br />
                Hemos construido una m&aacute;quina h&iacute;brida donde <strong>Gano Excel</strong> pone la log&iacute;stica ($100M) y <strong>T&uacute;</strong> pones la direcci&oacute;n.
              </p>
            </div>
          </section>

          {/* MECHANIC MODULE - Engranajes */}
          <section className="module mechanic-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/engranajes.jpg')" }}
            />
            <div className="glass-panel bottom">
              <h3>
                <span className="material-symbols-sharp">settings_motion</span>
                CERO FRICCI&Oacute;N
              </h3>
              <p>Sistema de transmisi&oacute;n de alta eficiencia. Tu esfuerzo (engranaje peque&ntilde;o) mueve una infraestructura global (engranaje mayor).</p>
            </div>
          </section>

          {/* STRUCTURE MODULE - Cables */}
          <section className="module structure-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/estructura-cables.jpg')" }}
            />
            <div className="glass-panel top">
              <h3>
                <span className="material-symbols-sharp">engineering</span>
                SOPORTE DE CARGA
              </h3>
              <p>No cargas el peso operativo. La log&iacute;stica, legalidad y env&iacute;os descansan sobre tensores de acero corporativo.</p>
            </div>
          </section>

          {/* WEALTH MODULE - Bóveda */}
          <section className="module wealth-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/riqueza-boveda.jpg')" }}
            />
            <div className="data-overlay">
              <div className="metric">
                <span className="label">ACTIVOS BAJO CUSTODIA</span>
                <span className="value">HEREDABLE</span>
              </div>
            </div>
          </section>

          {/* HEALTH MODULE - Bio */}
          <section className="module health-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/salud-bio.jpg')" }}
            />
            <div className="data-overlay">
              <div className="metric">
                <span className="label">MANTENIMIENTO BIO</span>
                <span className="value">OPTIMIZADO</span>
              </div>
            </div>
          </section>

          {/* CTA MODULE - Botón de Activación */}
          <section className="module cta-module">
            <div
              className="bg-image"
              style={{ backgroundImage: "url('/images/servilleta/boton-accion.jpg')" }}
            />
            <div className="cta-content">
              <h2>INICIAR PROTOCOLO</h2>
              <button className="btn-industrial">
                <span className="material-symbols-sharp">power_settings_new</span>
                AUDITAR PERFIL
              </button>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
