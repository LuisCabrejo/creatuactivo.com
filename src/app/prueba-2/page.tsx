'use client';

import { useState, useEffect, useRef } from 'react';

export default function QuietTechPage() {
  const [counter, setCounter] = useState(0);
  const [expenses, setExpenses] = useState(5000000);
  const [income, setIncome] = useState(1000000);
  const [freedomDays, setFreedomDays] = useState(73);
  const resultRingRef = useRef<HTMLDivElement>(null);

  // Contador de familias
  useEffect(() => {
    const target = 15000;
    let count = 0;
    const timer = setInterval(() => {
      count += 100;
      if (count >= target) {
        setCounter(target);
        clearInterval(timer);
      } else {
        setCounter(count);
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  // Calculadora de libertad
  useEffect(() => {
    if (expenses === 0) return;
    let days = (income / expenses) * 365;
    if (days > 365) days = 365;
    setFreedomDays(Math.floor(days));

    const percentage = (days / 365) * 100;
    if (resultRingRef.current) {
      resultRingRef.current.style.background = `conic-gradient(var(--accent-gold) 0% ${percentage}%, rgba(255,255,255,0.05) ${percentage}% 100%)`;
    }
  }, [expenses, income]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@200;300;400;600&display=swap" rel="stylesheet" />

      <style>{`
        :root {
            --bg-deep: #080808;
            --bg-panel: #121212;
            --bg-overlay: rgba(20, 20, 20, 0.95);
            --text-primary: #EAEAEA;
            --text-secondary: #A0A0A0;
            --text-muted: #555555;
            --accent-gold: #D4AF37;
            --accent-gold-dim: rgba(212, 175, 55, 0.1);
            --accent-titanium: #3A4A5A;
            --font-editorial: 'Cormorant Garamond', serif;
            --font-tech: 'Inter', sans-serif;
            --space-xs: 0.5rem;
            --space-sm: 1.5rem;
            --space-md: 3rem;
            --space-lg: 6rem;
            --space-xl: 10rem;
            --border-thin: 1px solid rgba(255, 255, 255, 0.08);
            --radius-soft: 4px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-deep);
            color: var(--text-primary);
            font-family: var(--font-tech);
            line-height: 1.6;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4 { font-family: var(--font-editorial); font-weight: 400; }

        h1 {
            font-size: clamp(3rem, 5vw, 5.5rem);
            line-height: 1.05;
            letter-spacing: -0.02em;
            margin-bottom: var(--space-sm);
        }

        h2 {
            font-size: clamp(2rem, 3vw, 3rem);
            margin-bottom: var(--space-sm);
            color: var(--text-primary);
        }

        p {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 60ch;
            margin-bottom: var(--space-sm);
        }

        a { text-decoration: none; color: inherit; transition: all 0.4s ease; }
        ul { list-style: none; }

        .lacy-holder {
            width: 100%;
            height: 100%;
            min-height: 300px;
            position: relative;
            background-color: var(--bg-panel);
            background-image:
                radial-gradient(circle at center, transparent 30%, var(--bg-panel) 80%),
                repeating-linear-gradient(45deg, var(--accent-gold-dim) 0px, var(--accent-gold-dim) 1px, transparent 1px, transparent 15px),
                repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 15px);
            border: var(--border-thin);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lacy-holder::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15), transparent 60%);
            opacity: 0;
            animation: pulse-light 6s infinite ease-in-out;
        }

        @keyframes pulse-light {
            0%, 100% { opacity: 0.2; transform: scale(0.9); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }

        .lacy-caption {
            position: absolute;
            bottom: var(--space-sm);
            left: var(--space-sm);
            font-family: var(--font-tech);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--accent-gold);
            z-index: 2;
            background: rgba(0,0,0,0.6);
            padding: 5px 10px;
            border: 1px solid var(--accent-gold-dim);
        }

        .btn {
            display: inline-flex;
            align-items: center;
            padding: 1rem 2.5rem;
            border: 1px solid var(--text-primary);
            font-family: var(--font-tech);
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .btn-primary {
            background-color: var(--text-primary);
            color: var(--bg-deep);
            font-weight: 600;
        }

        .btn-primary:hover {
            background-color: var(--accent-gold);
            border-color: var(--accent-gold);
            color: #000;
        }

        .btn-secondary {
            background: transparent;
            color: var(--text-primary);
        }

        .btn-secondary:hover {
            border-color: var(--accent-gold);
            color: var(--accent-gold);
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 5vw;
        }

        .grid-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-lg);
            align-items: center;
        }

        .grid-products {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: var(--space-md);
        }

        header {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1.5rem 5vw;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            background: rgba(8, 8, 8, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: var(--border-thin);
        }

        .logo {
            font-family: var(--font-tech);
            font-weight: 700;
            letter-spacing: -0.05em;
            font-size: 1.25rem;
        }

        .logo span { color: var(--accent-gold); }

        nav ul { display: flex; gap: var(--space-md); }
        nav a { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); }
        nav a:hover { color: var(--text-primary); }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding-top: var(--space-lg);
            position: relative;
        }

        .hero-content {
            position: relative;
            z-index: 10;
        }

        .hero-label {
            display: block;
            font-family: var(--font-tech);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--accent-gold);
            margin-bottom: var(--space-sm);
        }

        .metrics-bar {
            display: flex;
            gap: var(--space-lg);
            margin-top: var(--space-md);
            border-top: var(--border-thin);
            padding-top: var(--space-sm);
        }

        .metric h4 { font-family: var(--font-tech); font-size: 2rem; font-weight: 300; color: var(--text-primary); }
        .metric span { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-top: 5px; }

        .iaa-section {
            padding: var(--space-xl) 0;
            border-bottom: var(--border-thin);
        }

        .step-card {
            background: var(--bg-panel);
            padding: var(--space-md);
            border: var(--border-thin);
            transition: transform 0.3s ease;
        }

        .step-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-gold);
        }

        .step-number {
            font-family: var(--font-editorial);
            font-size: 4rem;
            color: var(--accent-gold);
            opacity: 0.2;
            line-height: 1;
            margin-bottom: var(--space-sm);
        }

        .freedom-calc {
            background: linear-gradient(135deg, var(--bg-panel) 0%, #1a1a1a 100%);
            padding: var(--space-lg);
            border-radius: var(--radius-soft);
            margin: var(--space-xl) 0;
            border: var(--border-thin);
        }

        .calc-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-lg);
        }

        .input-group { margin-bottom: var(--space-sm); }
        .input-group label { display: block; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-secondary); }
        .input-group input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--text-muted);
            color: var(--text-primary);
            font-size: 1.5rem;
            padding: 0.5rem 0;
            font-family: var(--font-tech);
        }
        .input-group input:focus { outline: none; border-color: var(--accent-gold); }

        .result-circle {
            width: 200px;
            height: 200px;
            border: 2px solid var(--bg-deep);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            margin: 0 auto;
            position: relative;
            background: conic-gradient(var(--accent-gold) 0% 0%, rgba(255,255,255,0.05) 0% 100%);
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
        }

        .result-inner {
            width: 180px;
            height: 180px;
            background: var(--bg-panel);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 2;
        }

        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: var(--space-md);
        }
        .comparison-table th,.comparison-table td {
            text-align: left;
            padding: 1.5rem;
            border-bottom: var(--border-thin);
        }
        .comparison-table th { color: var(--accent-gold); font-family: var(--font-tech); text-transform: uppercase; font-size: 0.8rem; }
        .comparison-table td { color: var(--text-secondary); }
        .comparison-table tr:hover td { color: var(--text-primary); background: rgba(255,255,255,0.02); }

        footer {
            padding: var(--space-lg) 0;
            border-top: var(--border-thin);
            margin-top: var(--space-xl);
            text-align: center;
        }

        @media (max-width: 768px) {
            .grid-split,.calc-grid { grid-template-columns: 1fr; }
            h1 { font-size: 3rem; }
            nav { display: none; }
        }
      `}</style>

      <header>
        <div className="logo">CREA<span>TU</span>ACTIVO</div>
        <nav>
          <a href="#sistema">El Sistema</a>
          <a href="#metodologia">Metodología IAA</a>
          <a href="#ecosistema">Ecosistema</a>
          <a href="#libertad">Calculadora</a>
        </nav>
        <a href="#aplicar" className="btn btn-primary">Sé Fundador</a>
      </header>

      <section className="hero container">
        <div className="grid-split">
          <div className="hero-content">
            <span className="hero-label">Infraestructura de Automatización v2.0</span>
            <h1>Tu Libertad no debería depender de tu Presencia.</h1>
            <p>No vendemos café. Construimos la infraestructura digital que distribuye bienestar globalmente mientras tú recuperas tu tiempo. Bienvenido a la era del <em>Quiet Tech</em>.</p>

            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: '1rem' }}>
              <a href="#aplicar" className="btn btn-primary">Aplicar a Lista Privada</a>
              <a href="#demo" className="btn btn-secondary">Ver Demo (3 min)</a>
            </div>

            <div className="metrics-bar">
              <div className="metric">
                <h4>{counter.toLocaleString()}+</h4>
                <span>Familias Impactadas</span>
              </div>
              <div className="metric">
                <h4>150</h4>
                <span>Cupos Fundadores</span>
              </div>
              <div className="metric">
                <h4>365</h4>
                <span>Objetivo Días/Libertad</span>
              </div>
            </div>
          </div>

          <div className="lacy-holder" style={{ borderRadius: 'var(--radius-soft)', height: '600px' }}>
            <span className="lacy-caption">Visualización: Red Neural NodeX (En Tiempo Real)</span>
          </div>
        </div>
      </section>

      <section id="sistema" className="container" style={{ paddingTop: 'var(--space-xl)' }}>
        <div className="grid-split">
          <div className="lacy-holder" style={{ height: '500px' }}>
            <span className="lacy-caption">Arquitectura del Sistema</span>
          </div>

          <div className="content">
            <h2>El Código vs. El Ladrillo</h2>
            <p>El modelo industrial (&quot;El Ladrillo&quot;) exige capital intensivo y presencia física. El modelo digital (&quot;El Código&quot;) apalanca infraestructuras existentes.</p>

            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Operador Tradicional (Ladrillo)</th>
                  <th>Arquitecto de Sistemas (Código)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Escalabilidad</td>
                  <td>Limitada por horas hombre</td>
                  <td>Infinita (Software + Red)</td>
                </tr>
                <tr>
                  <td>Inventario</td>
                  <td>Almacenamiento físico en casa</td>
                  <td>Logística Gano Excel (0 Stock)</td>
                </tr>
                <tr>
                  <td>Ingreso</td>
                  <td>Lineal (Salario/Venta Directa)</td>
                  <td>Exponencial (Regalías Globales)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="metodologia" className="container iaa-section">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <span className="hero-label">Framework Operativo</span>
          <h2>Metodología I.A.A.</h2>
          <p style={{ margin: '0 auto' }}>Tres pasos de precisión militar para automatizar la construcción de activos.</p>
        </div>

        <div className="grid-products">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Iniciar</h3>
            <p>La Chispa. Utilizamos tecnología NEXUS para despertar curiosidad sin perseguir. Filtramos, no convencemos.</p>
            <div className="lacy-holder" style={{ height: '150px', marginTop: '1rem' }}></div>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Acoger</h3>
            <p>El Host. El sistema educa y nutre al prospecto con información estandarizada, eliminando el error humano.</p>
            <div className="lacy-holder" style={{ height: '150px', marginTop: '1rem' }}></div>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Activar</h3>
            <p>El Launch. Conexión directa con Gano Excel. El nuevo socio se convierte en un nodo activo de la red.</p>
            <div className="lacy-holder" style={{ height: '150px', marginTop: '1rem' }}></div>
          </div>
        </div>
      </section>

      <section id="libertad" className="container">
        <div className="freedom-calc">
          <div className="grid-split">
            <div>
              <h2>Calculadora de Días de Libertad</h2>
              <p>La libertad no es un concepto abstracto. Es una métrica matemática. ¿Cuántos días del año podrías vivir sin trabajar hoy?</p>

              <form style={{ marginTop: 'var(--space-md)' }} onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <label>Gastos Mensuales Totales (COP/USD)</label>
                  <input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    placeholder="Ej: 5000000"
                  />
                </div>
                <div className="input-group" style={{ marginTop: '2rem' }}>
                  <label>Ingreso Pasivo Actual (Activos)</label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    placeholder="Ej: 0"
                  />
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="result-circle" ref={resultRingRef}>
                <div className="result-inner">
                  <h3 style={{ fontSize: '3rem', margin: 0, color: 'var(--accent-gold)' }}>{freedomDays}</h3>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Días de Libertad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecosistema" className="container">
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <h2>El Motor del Activo: Gano Excel</h2>
          <p>Productos de consumo masivo repetitivo, elevados por la infusión de Ganoderma Lucidum. Sin modas pasajeras. Salud real.</p>
        </div>

        <div className="grid-products">
          <div className="step-card">
            <div className="lacy-holder" style={{ height: '250px', marginBottom: '1rem' }}>
              <span className="lacy-caption">GanoCafé 3-in-1</span>
            </div>
            <h4>Sistema de Energía</h4>
            <p style={{ fontSize: '0.9rem' }}>El primer café saludable del mundo. Rotación diaria.</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>INVIMA: SD2012-0002589</span>
          </div>
          <div className="step-card">
            <div className="lacy-holder" style={{ height: '250px', marginBottom: '1rem' }}>
              <span className="lacy-caption">Excellium</span>
            </div>
            <h4>Cognición &amp; Enfoque</h4>
            <p style={{ fontSize: '0.9rem' }}>Micelio puro para rendimiento mental sostenido (Brain Tonic).</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>INVIMA: NSA-0012958-2022</span>
          </div>
          <div className="step-card">
            <div className="lacy-holder" style={{ height: '250px', marginBottom: '1rem' }}>
              <span className="lacy-caption">Luvoco Pods</span>
            </div>
            <h4>Experiencia Barista</h4>
            <p style={{ fontSize: '0.9rem' }}>Tecnología de cápsulas para el mercado de alta gama.</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Patente: 15-Bar System</span>
          </div>
        </div>
      </section>

      <footer className="container">
        <div className="logo" style={{ marginBottom: '1rem' }}>CREA<span>TU</span>ACTIVO</div>
        <p style={{ margin: '0 auto', fontSize: '0.9rem' }}>&copy; 2025 CreaTuActivo. Potenciado por Tecnología NodeX &amp; Infraestructura Gano Excel.</p>
        <div style={{ marginTop: '2rem', opacity: 0.5 }}>
          <a href="#" style={{ margin: '0 10px' }}>Política de Privacidad</a>
          <a href="#" style={{ margin: '0 10px' }}>Términos de Servicio</a>
          <a href="#" style={{ margin: '0 10px' }}>Soporte NEXUS</a>
        </div>
      </footer>
    </>
  );
}
