/**
 * SERVILLETA DIGITAL v6.7 — slides 1 y 2 como card-scrollers con b-rolls 3D
 * 4-Slide Interactive Presentation (Slide Deck)
 *
 * v6.7 (3 jul 2026) — Tríada Slide 2 sin pronombre ambiguo (guión servilleta v5.8):
 *  - Subtítulo/portada: "alguien la fabrica, algo la atiende" → "alguien fabrica, una
 *    plataforma atiende a las personas" (nadie "fabrica" una empresa; "una plataforma"
 *    mapea limpio con Queswa). Sync con reel home + src/app/page.tsx.
 *
 * v6.6 (2 jul 2026) — Auditoría de navegación + media (no parches):
 *  - Control CENTRAL de media: un solo efecto gobierna TODOS los videos (data-slide/
 *    data-card) — antes los clips de la slide abandonada seguían sonando ocultos
 *    (display:none no pausa un <video>) → audio acumulado. Grid desktop = todo en mute.
 *  - Slides 1 y 2 SIMÉTRICAS: cada una abre con SU portada (índice 0) y sigue con
 *    3 clips (1-3). Slide 1 = "CREE SU EMPRESA DIGITAL" · Slide 2 = "3 COSAS TIENEN
 *    QUE SER CIERTAS" (H1 fuera de las diapositivas, solo en su portada).
 *  - Tap = pausa SOLO táctil; en desktop el click conserva el avance (capturarlo
 *    dejaba al presentador trabado en el clip 1) + botón ⏸/▶ de esquina por card.
 *  - Retroceso de slide aterriza en la ÚLTIMA card de la slide destino (LAST_CARD),
 *    no en la portada. Eliminado el efecto reset-a-0 que lo clobbearía.
 *  - Slide 4: swipe-back habilitado desde el simulador (.simulator-panel fuera de la
 *    exoneración táctil) + guard de eje |dx|>|dy| para no navegar con scroll vertical.
 *  - Eliminado IntersectionObserver muerto (one-card usa display:none → nunca intersecta).
 *
 * v6.5 (30 jun 2026) — Slide 2 sincronizado con el guión servilleta v5.7:
 *  - Slide 1 = "qué es una empresa digital" (cards: depende de usted · usted es el puente ·
 *    imagine el suyo). Slide 2 = "LO DIFÍCIL YA ESTÁ HECHO" (primeros principios): alguien la
 *    fabrica (Gano, socio logístico y financiero) · algo la atiende (Queswa, socio digital) ·
 *    usted sabe qué hacer (Método). Eyebrow de rol (frame-before-name); Gano se USA, no se entra
 *
 * v6.4 (jun 2026) — B-rolls 3D en slides 1 y 2 (ver CLAUDE.md "B-rolls 3D en Slides 1 y 2"):
 *  - b-rolls 3D + nombre por card; .card-bg aloja <video> object-fit:contain (full-bleed sin
 *    recorte); one-card-mode generalizado; fix del salto a la card 3 (reset de activeCardIndex
 *    en batch). ⚠️ El mapeo slide→contenido de esta entrada quedó desfasado con el reorden
 *    WHAT→HOW posterior (ver v6.5 arriba)
 *
 * v6.3 (jun 2026) — Migración al léxico actual:
 *  - Slide 1: H1 "INGRESOS RECURRENTES" (antes "Estructura Patrimonial"); pilares = El Respaldo
 *    Operativo · Queswa, su Centro de Mando · El Método Comprobado; rol = Propietario
 *  - Queswa: "explica, atiende y madura" (antes "acompaña / persuadir/filtrar")
 *  - Slide 4: botón "ACTIVAR SU EMPRESA DIGITAL" · "SIMULADOR DE INGRESOS RECURRENTES"
 *
 * v6.1 (15 May 2026, léxico previo v26.5 — histórico):
 *  - Slide 1: reescritura (texto reducido 78%) + imagen 3-pilares.webp; "Patrimonio Paralelo" →
 *    "Estructura Patrimonial"; "tres capas" → "tres pilares"
 *  - Slide 2: "Tres movimientos" → "Tres comandos"; Slide 3: "tecnología patentada" → "propietaria"
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SubscribeModal from '@/components/SubscribeModal';
import { PLAN_SERVILLETA_VIDEO, PLAN_SERVILLETA_POSTER } from '@/lib/reels';

// (El control de pausa es ÚNICO y central — ver clipCenterToggle dentro del componente.
//  Decisión Director 2 jul 2026: un solo botón, el del centro; el de esquina se retiró.)

// Al RETROCEDER de slide se aterriza en la ÚLTIMA card de la slide destino: el usuario
// regresa a revisar lo último que vio, no la portada (pedido Director 2 jul 2026).
// Avanzar o saltar por nav → card 0 (portada). Slides 1 y 2 = portada + 3 clips (máx 3).
const LAST_CARD: Record<number, number> = { 1: 3, 2: 3 };

export default function ServilletaPage() {
  const TOTAL_SLIDES = 4;
  const [activeSlide, setActiveSlide] = useState(1);
  const [simMode, setSimMode] = useState<'gen5' | 'binario'>('gen5');
  const [gen5Socios, setGen5Socios] = useState(2);
  const [gen5Package, setGen5Package] = useState<'ESP1' | 'ESP2' | 'ESP3'>('ESP3');
  const [binarioParejas, setBinarioParejas] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [queswaOpen, setQueswaOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [productCatalogOpen, setProductCatalogOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [pausedKey, setPausedKey] = useState<string | null>(null);
  // Modo Vertical (presentación en Meet): un monitor horizontal no puede ir a
  // fullscreen portrait, así que se SIMULA — un iframe del deck a ancho de móvil
  // (dispara el layout vertical), centrado en negro, con la nav oculta. `isKiosk`
  // = esta instancia corre DENTRO del iframe (?kiosk=1): oculta nav + botón.
  const [isKiosk, setIsKiosk] = useState(false);
  const [verticalMode, setVerticalMode] = useState(false);
  const [vScale, setVScale] = useState(1);
  const vOverlayRef = React.useRef<HTMLDivElement | null>(null);
  // Video del Plan en modal DENTRO del deck (no navega fuera) → tras verlo se
  // vuelve a la portada y se avanza a los clips sin perder el hilo.
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const touchLastX = React.useRef(0);
  const touchLastY = React.useRef(0);
  const touchSwipeIgnore = React.useRef(false);
  const clickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tripleClickCount = React.useRef(0);
  const tripleClickTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fuentes: Rajdhani + Roboto Mono ya cargadas via next/font en layout.tsx
  // Material Symbols Sharp cargado en layout.tsx — no se necesita useEffect aquí

  // ¿Esta instancia corre dentro del iframe del Modo Vertical? (?kiosk=1)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('kiosk') === '1') setIsKiosk(true);
  }, []);

  // Escala del marco portrait 9:16 (412×732 lógicos) para llenar la pantalla.
  // Tamaño fijo de móvil → dispara el layout vertical dentro del iframe; el
  // transform sólo lo agranda para presentar.
  useEffect(() => {
    if (!verticalMode) return;
    const W = 412, H = 732;
    const calc = () => setVScale(Math.min(window.innerHeight / H, window.innerWidth / W));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [verticalMode]);

  // Modo Vertical = también fullscreen NATIVO del overlay (si el navegador está a
  // media pantalla, expande a toda la pantalla igual que el fullscreen normal).
  // Salir del fullscreen (Esc nativo) cierra el modo; cerrar con ✕ sale de ambos.
  useEffect(() => {
    if (!verticalMode) return;
    vOverlayRef.current?.requestFullscreen?.().catch(() => {});
    const onFs = () => { if (!document.fullscreenElement) setVerticalMode(false); };
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      document.removeEventListener('fullscreenchange', onFs);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [verticalMode]);

  // Esc cierra el modal del video o sale del modo vertical (sin tocar el fullscreen)
  useEffect(() => {
    if (!videoModalOpen && !verticalMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (videoModalOpen) setVideoModalOpen(false);
      else if (verticalMode) setVerticalMode(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [videoModalOpen, verticalMode]);

  // Detectar cambios de fullscreen (ESC del navegador)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Detectar viewport mobile/tablet — define el modo one-card-at-a-time
  // en slide 2 (mismo modelo que fullscreen desktop). Breakpoint 1024px coincide
  // con el ya usado en el observer de cards activas (línea ~161).
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Cerrar modal catálogo con tecla Escape
  useEffect(() => {
    if (!productCatalogOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProductCatalogOpen(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [productCatalogOpen]);

  // Fullscreen toggle (Mac + Windows)
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // one-card-mode: contextos donde slides 1 y 2 (portada + 3 clips cada una)
  // muestran una card a la vez, compartiendo activeCardIndex (0 = portada, 1-3 = clips).
  const oneCardMode = (activeSlide === 1 || activeSlide === 2) && (isFullscreen || isMobile);
  const maxCardIndex = 3;

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
      if (isEditable) return;
      // Slide 2 one-card-mode (fullscreen desktop o mobile):
      // avanza/retrocede entre cards antes de cambiar de slide
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (oneCardMode && activeCardIndex < maxCardIndex) {
          setActiveCardIndex((prev) => prev + 1);
        } else {
          setActiveSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES));
          setActiveCardIndex(0);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (oneCardMode && activeCardIndex > 0) {
          setActiveCardIndex((prev) => prev - 1);
        } else {
          const target = Math.max(activeSlide - 1, 1);
          setActiveSlide(target);
          setActiveCardIndex(LAST_CARD[target] ?? 0); // retroceso → última card de la slide destino
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [oneCardMode, activeCardIndex, maxCardIndex, toggleFullscreen, activeSlide]);

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
      // one-card-mode (slide 1/2): avanza entre cards antes de cambiar de slide
      if (oneCardMode && activeCardIndex < maxCardIndex) {
        setActiveCardIndex((prev) => prev + 1);
      } else {
        setActiveSlide((prev) => (prev < TOTAL_SLIDES ? prev + 1 : prev));
        setActiveCardIndex(0);
      }
    }, 300);
  }, [toggleFullscreen, oneCardMode, activeCardIndex, maxCardIndex]);

  // Touch swipe para mobile — debe funcionar en CUALQUIER lugar de la pantalla
  // (pedido Director 2 jul 2026: antes solo respondía en la franja superior; sobre
  // el contenido el navegador secuestraba el gesto como scroll nativo y disparaba
  // touchcancel → nuestro touchend jamás corría). Dos capas de defensa:
  //  1. CSS `touch-action: pan-y` en .deck-container → el navegador NO captura los
  //     gestos horizontales (solo el pan vertical sigue siendo nativo).
  //  2. onTouchMove registra la última posición y onTouchCancel evalúa el swipe con
  //     ella → aunque el gesto sea cancelado, el swipe se procesa igual.
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchLastX.current = e.touches[0].clientX;
    touchLastY.current = e.touches[0].clientY;
    // SOLO los <input> (sliders del simulador) exoneran el swipe: arrastrar el thumb
    // es un gesto horizontal legítimo que NO debe navegar. Todo lo demás (tabs,
    // selector, botones, paneles) permite swipe — un TAP dispara su click normal y
    // un DESPLAZAMIENTO es navegación; no compiten ("la plataforma debe identificar
    // entre un clic y un scroll" — Director 2 jul 2026). Historial: la lista llegó a
    // incluir .simulator-panel (bloqueaba TODO el swipe-back del Slide 4) y luego
    // tabs/selector/botones (dejaban zonas muertas dispersas en el Slide 4).
    const target = e.target as HTMLElement;
    touchSwipeIgnore.current = !!target.closest('input');
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchLastX.current = e.touches[0].clientX;
    touchLastY.current = e.touches[0].clientY;
  }, []);

  // Evalúa el gesto y navega. endX/endY = posición final del dedo.
  const evaluateSwipe = useCallback((endX: number, endY: number) => {
    if (touchSwipeIgnore.current) {
      touchSwipeIgnore.current = false;
      return;
    }
    const diff = touchStartX.current - endX;
    const diffY = touchStartY.current - endY;
    // Solo navega si el gesto es claramente HORIZONTAL: un scroll vertical (simulador,
    // paneles con scroll) que derive un poco en X no debe cambiar de slide.
    if (Math.abs(diff) > 60 && Math.abs(diff) > Math.abs(diffY) * 1.2) {
      if (diff > 0) {
        // swipe izquierda → avanzar
        if (oneCardMode && activeCardIndex < maxCardIndex) {
          setActiveCardIndex((prev) => prev + 1);
        } else {
          setActiveSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES));
          setActiveCardIndex(0);
        }
      } else {
        // swipe derecha → retroceder
        if (oneCardMode && activeCardIndex > 0) {
          setActiveCardIndex((prev) => prev - 1);
        } else {
          const target = Math.max(activeSlide - 1, 1);
          setActiveSlide(target);
          setActiveCardIndex(LAST_CARD[target] ?? 0); // retroceso → última card de la slide destino
        }
      }
    }
  }, [oneCardMode, activeCardIndex, maxCardIndex, activeSlide]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    evaluateSwipe(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, [evaluateSwipe]);

  // El navegador canceló el gesto (scroll nativo, etc.) → evaluar con la última posición
  const handleTouchCancel = useCallback(() => {
    evaluateSwipe(touchLastX.current, touchLastY.current);
  }, [evaluateSwipe]);

  // Núcleo pausa/play de un clip (lo usan el tap táctil y el botón de esquina)
  const toggleClip = useCallback((container: HTMLElement | null, key: string) => {
    const video = container?.querySelector<HTMLVideoElement>('video.card-bg');
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPausedKey(null);
    } else {
      video.pause();
      setPausedKey(key);
    }
  }, []);

  // Tap sobre el clip = pausa/play — SOLO en dispositivos táctiles (estándar Stories/
  // TikTok; ver INVESTIGACION_UX_SERVILLETA_SCROLL_VIDEO.md). En desktop el click
  // CONSERVA el avance de presentación (handleSlideClick): la card llena la pantalla
  // en fullscreen y capturar el click dejaba al presentador "trabado" en el clip 1
  // (reporte Director 2 jul 2026). La pausa en desktop vive en el botón de esquina.
  const handleClipTap = useCallback((e: React.MouseEvent, key: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a')) return; // deja pasar los botones de la card
    if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    e.stopPropagation();
    toggleClip(e.currentTarget as HTMLElement, key);
  }, [toggleClip]);

  // Control ÚNICO de pausa — botón CENTRAL sobre el clip (Director 2 jul 2026: solo
  // el del centro). Estados: pausado → ▶ visible siempre (ambas plataformas);
  // reproduciendo → invisible; en desktop aparece ⏸ al hover (vía CSS @media hover)
  // porque allí el click sobre el clip avanza la presentación, no pausa.
  const clipCenterToggle = (key: string) => {
    const paused = pausedKey === key;
    return (
      <div className={`clip-pause-overlay ${paused ? 'is-paused' : ''}`}>
        <button
          className="clip-pause-btn"
          aria-label={paused ? 'Reproducir clip' : 'Pausar clip'}
          style={{ paddingLeft: paused ? 4 : 0 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleClip((e.currentTarget as HTMLElement).closest('.card-industrial') as HTMLElement, key);
          }}
        >
          {paused ? (
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" aria-hidden="true"><path d="M3 2 L22 14 L3 26 Z" fill="#C5A059" /></svg>
          ) : (
            <svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true"><rect x="2" y="2" width="6" height="22" fill="#C5A059" /><rect x="14" y="2" width="6" height="22" fill="#C5A059" /></svg>
          )}
        </button>
      </div>
    );
  };

  // Lógica del Simulador
  const TRM = 4500;
  const gen5Bonuses: Record<string, number> = { ESP1: 25, ESP2: 75, ESP3: 150 };
  const gen5Income = gen5Socios * gen5Bonuses[gen5Package];
  const binarioIncomeUSD = Math.round(binarioParejas * 4.76);

  const currentUSD = simMode === 'gen5' ? gen5Income : binarioIncomeUSD;
  const currentCOP = (currentUSD * TRM).toLocaleString();

  // Snowball metaphor — el thumb del slider de INGRESO RECURRENTE crece a
  // medida que el usuario lo desliza hacia más hogares (más ingreso recurrente).
  // Visualiza la metáfora literal: bola de nieve rodando montaña abajo.
  // Rango: 20px (10 hogares, ~$50) → 50px (1000 hogares, ~$4,760).
  const snowballSize = Math.round(20 + (binarioParejas / 1000) * 30);

  // Salto directo por nav/botones → siempre card 0 (inicio de esa slide, en el mismo batch).
  // El índice de card NO se resetea en ningún efecto: cada ruta de navegación lo fija
  // explícitamente (avanzar → 0 · retroceder → LAST_CARD · showSlide → 0). El viejo efecto
  // reset-en-[activeSlide] clobbearía el aterrizaje del retroceso (auditoría 2 jul 2026).
  const showSlide = useCallback((index: number) => {
    setActiveSlide(index);
    setActiveCardIndex(0);
  }, []);

  // Al navegar (slide o card), se libera cualquier pausa manual del tap-to-pause
  useEffect(() => { setPausedKey(null); }, [activeSlide, activeCardIndex]);

  // Queswa en servilleta: SIN orbe flotante (la burbuja sobre los clips no es la
  // experiencia buscada — Director 2 jul 2026). El chat abre únicamente desde el botón
  // "PREGÚNTALE ALGO EN VIVO" (open-queswa); UnifiedQueswaOrb monta solo mientras
  // el chat está abierto. No se despacha show-queswa-orb.

  // ═══ CONTROL CENTRAL DE MEDIA (auditoría 2 jul 2026) ═══
  // UN solo efecto gobierna play/pause/mute de TODOS los b-rolls del deck — incluidos
  // los de la slide que se acaba de abandonar. Antes el efecto solo tocaba los videos
  // de `#slide-{activeSlide}`: al cambiar de slide, el clip activo de la slide anterior
  // seguía sonando oculto (display:none NO pausa un <video>) → audio acumulado con
  // cada transición. Cada video declara su posición con data-slide / data-card.
  // Reglas:
  //  · Slide no activa → pausa + rebobina + mute (nada suena "detrás").
  //  · one-card (presentación mobile/fullscreen) → SOLO la card activa reproduce y
  //    suena, desde 0s. Las demás pausadas.
  //  · Grid desktop → los 3 clips de la slide activa reproducen EN MUTE (conviven
  //    visibles: con sonido serían cacofonía — reporte Director 2 jul 2026).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vids = document.querySelectorAll<HTMLVideoElement>('video.card-bg');
    vids.forEach((v) => {
      const slide = Number(v.dataset.slide);
      const card = Number(v.dataset.card);
      const inActiveSlide = slide === activeSlide;
      const isActiveCard = inActiveSlide && card === activeCardIndex;
      const audible = oneCardMode && isActiveCard;
      v.muted = !audible;
      const shouldPlay = inActiveSlide && (!oneCardMode || isActiveCard);
      if (shouldPlay) {
        // La card activa en presentación SIEMPRE arranca desde 0s (avance o retroceso).
        if (oneCardMode && isActiveCard) { try { v.currentTime = 0; } catch { /* noop */ } }
        v.play().catch(() => {
          // Autoplay-con-sonido bloqueado (sin gesto previo) → cae a mute y reproduce.
          if (!v.muted) { v.muted = true; v.play().catch(() => {}); }
        });
      } else {
        try { v.pause(); v.currentTime = 0; } catch { /* noop */ }
      }
    });
  }, [activeSlide, activeCardIndex, oneCardMode]);

  // NOTA auditoría: aquí vivía un IntersectionObserver que fijaba activeCardIndex por
  // scroll. Quedó muerto cuando one-card-mode pasó a ocultar las cards no activas con
  // display:none (nunca intersectan) — y su mapeo por offset corrompería índices tras
  // mover la portada al slide 2. Navegación = swipe / flechas / dots / click fuera del clip.

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
  // Desktop: solo CSS :hover (sin auto-reveal) — el usuario decide con el mouse
  // Mobile: IntersectionObserver activa color al hacer scroll-snap al panel CTA
  useEffect(() => {
    if (activeSlide !== 4) { setCtaVisible(false); return; }
    if (typeof window === 'undefined') return;
    if (window.innerWidth > 1024) {
      // Desktop: imagen queda gris hasta hover — el CSS :hover lo maneja
      return;
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
        /* Servilleta — migrada al Sistema de Diseño Lujo Silencioso (15 May 2026).
           Variables locales mantienen sus nombres legacy (--bg-dark, --concrete, etc.)
           pero apuntan a los tokens globales para coherencia con homepage + funnel. */
        :root {
          --bg-dark: var(--color-bg-primary);          /* #0F1115 */
          --concrete: var(--color-bg-elevated);        /* #15171C */
          --steel: var(--color-titanium-dark);         /* #475569 */
          --cyan: #22D3EE;                             /* Acento data/labels técnicos (consistente con homepage) */
          --orange: var(--color-brand);                /* #C5A059 Dorado Champán — reemplaza el safety orange industrial */
          --text-main: var(--color-text-primary);      /* #E0DFDB titanium-light */
          --text-muted: var(--color-text-muted);       /* #878681 titanium-core */
          --font-head: var(--font-sans);
          --font-mono: var(--font-mono);
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
          /* El pan vertical sigue siendo nativo (scroll del simulador, cards); los
             gestos horizontales son NUESTROS → el swipe navega desde cualquier
             punto de la pantalla, el navegador no lo secuestra. */
          touch-action: pan-y;
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

        /* "Ver video" en la portada → acceso al explainer de 6 min antes de la presentación */
        .ver-video-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono, monospace); font-size: 0.85rem;
          letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none;
          color: var(--orange, #C5A059);
          border: 1.5px solid rgba(197,160,89,0.45); border-radius: 4px;
          padding: 10px 20px; background: rgba(197,160,89,0.08);
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .ver-video-link:hover { background: rgba(197,160,89,0.16); border-color: rgba(197,160,89,0.8); }
        .ver-video-link span { font-size: 0.7rem; }

        /* Botón "Portada" en la cabecera de los clips → vuelve a la portada (enlace al video) */
        .ver-portada-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono, monospace); font-size: 0.72rem;
          letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
          color: var(--orange, #C5A059);
          background: rgba(197,160,89,0.08); border: 1px solid rgba(197,160,89,0.4);
          border-radius: 4px; padding: 6px 12px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .ver-portada-btn:hover { background: rgba(197,160,89,0.16); border-color: rgba(197,160,89,0.8); }
        .ver-portada-btn span { font-size: 0.85rem; line-height: 1; }

        /* Kiosk (dentro del iframe del Modo Vertical): solo la presentación */
        .kiosk .top-hud { display: none !important; }
        .kiosk .mobile-nav { display: none !important; }
        .kiosk .slide-counter { display: none !important; }
        /* Sin navs no hay que reservarles espacio: el @media mobile mete
           padding 70px arriba (top-hud) y 80px abajo (mobile-nav) → aquí se
           compacta y la card activa se ajusta al alto disponible en vez de
           exigir 70vh (que desbordaba el marco 9:16 y cortaba el clip). */
        .kiosk .one-card-mode .grid-layout-slide-2 { padding: 10px 14px 14px !important; gap: 10px !important; }
        .kiosk .slide-2-header { padding-top: 0 !important; }
        .kiosk .slide-2-header .slide-2-subtitle { margin-top: 6px !important; }
        .kiosk .card-dots { margin: 6px 0 0 !important; }
        .kiosk .one-card-mode .card-industrial.card-active,
        .kiosk .one-card-mode .full-width.card-active {
          min-height: 0 !important;
          height: auto !important;
          flex: 1 1 auto;
          overflow: hidden;
        }
        .kiosk #slide-4,
        .kiosk .slide-3-bottom { padding-bottom: 16px !important; }

        /* Modo Vertical: marco portrait 9:16 centrado en negro, tapa la nav */
        .vertical-present-overlay {
          position: fixed; inset: 0; z-index: 10000; background: #000;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .vp-frame { flex: none; transform-origin: center center; }
        .vp-frame iframe { width: 100%; height: 100%; border: 0; display: block; background: #0F1115; }
        .vp-exit {
          position: fixed; top: 16px; right: 16px; z-index: 10001;
          width: 44px; height: 44px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: rgba(8,9,12,0.8); border: 1px solid rgba(197,160,89,0.5);
          color: #C5A059; font-size: 20px; line-height: 1;
        }
        .vp-exit:hover { background: rgba(197,160,89,0.16); border-color: rgba(197,160,89,0.85); }

        /* Modal del video del Plan (dentro del deck): vertical 9:16 centrado en negro */
        .video-plan-overlay {
          position: fixed; inset: 0; z-index: 10002; background: rgba(0,0,0,0.94);
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .video-plan-player {
          height: 92vh; max-height: 92vh; width: auto; max-width: 100vw;
          aspect-ratio: 9 / 16; object-fit: contain; background: #000; display: block;
        }

        /* Slide 1: tratamiento de imagen alineado con la Home — preserva detalle arquitectónico
           del visual de los tres pilares (sin filter agresivo tipo "hormigón") */
        #slide-1 .bg-image {
          filter: grayscale(70%) contrast(110%) brightness(55%);
          opacity: 0.75;
          -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
        }

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
          position: relative; height: 250px; background: var(--bg-dark);
          border: 1px solid #444; overflow: hidden;
          display: flex; align-items: flex-end;
          transition: border-color 0.3s;
        }
        .card-industrial:hover { border-color: var(--orange); }
        .full-width { grid-column: span 2; height: 200px; }

        /* .card-bg aloja b-rolls 3D (video). object-fit:CONTAIN para mostrar el objeto
           3D completo sin recorte; el letterbox es invisible porque el fondo del clip
           es el mismo carbón del deck. Filtro de BRILLO (no grayscale) — no mata el dorado. */
        .card-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          object-fit: contain; background: var(--bg-dark);
          filter: brightness(0.45); transition: filter 0.5s;
        }
        .card-industrial:hover .card-bg { filter: brightness(1); }

        /* Control ÚNICO de pausa — botón central sobre el clip.
           · Pausado → ▶ visible siempre (mobile y desktop).
           · Reproduciendo → invisible; en desktop aparece ⏸ al hover (el click
             sobre el clip allí avanza la presentación, no pausa).
           El overlay NO bloquea (pointer-events: none); solo el botón captura. */
        .clip-pause-overlay {
          position: absolute; inset: 0; z-index: 3;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .clip-pause-overlay.is-paused { opacity: 1; }
        .clip-pause-overlay.is-paused .clip-pause-btn { pointer-events: auto; }
        @media (hover: hover) {
          .card-industrial:hover .clip-pause-overlay { opacity: 1; }
          .card-industrial:hover .clip-pause-btn { pointer-events: auto; }
        }
        .clip-pause-btn {
          width: 72px; height: 72px; border-radius: 50%;
          background: rgba(15,17,21,0.55);
          border: 1.5px solid rgba(197,160,89,0.65);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .clip-pause-btn:hover { background: rgba(15,17,21,0.8); border-color: var(--orange); }
        :fullscreen .clip-pause-btn { width: 104px; height: 104px; }
        :fullscreen .clip-pause-btn svg { width: 34px; height: 40px; }

        .card-content {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 24px 22px;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.3) 68%, transparent 100%);
        }
        .card-content h3 { font-family: var(--font-head); display: flex; align-items: center; gap: 10px; margin: 0 0 8px 0; color: var(--text-main); font-size: 1.2rem; }
        .card-content p { font-size: 0.95rem; margin: 0; color: #CFD8DC; line-height: 1.6; }
        /* Slide 1: nombre del pilar (único texto) — prominente, sin descripción */
        .card-content h3.pillar-name { font-size: 1.7rem; letter-spacing: 0.01em; margin: 0; }
        :fullscreen .card-content h3.pillar-name { font-size: 2.6rem; }
        /* Slide 2: eyebrow de rol (frame-before-name) sobre el nombre del socio/método */
        .card-content .pillar-eyebrow {
          display: block; font-family: var(--font-mono); font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--cyan); margin: 0 0 6px 0;
        }
        :fullscreen .card-content .pillar-eyebrow { font-size: 1rem; margin-bottom: 8px; }
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
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin: 0 0 20px 0; font-size: 1.3rem; color: var(--text-main);
          text-align: center;
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

        /* AMBOS sliders del simulador (gen5 + binario) usan el MISMO padding
           vertical → así la "caja" del controls-container tiene altura idéntica
           al alternar entre INGRESO INMEDIATO ↔ INGRESO RECURRENTE.
           El padding es necesario para que el thumb del snowball (hasta 50px)
           no se choque con elementos vecinos. Al aplicarlo también al slider
           de gen5 (thumb default ~16px), ambos ocupan el mismo espacio
           vertical y el layout no salta. */
        .controls-container input[type=range] {
          padding: 25px 0;
          margin: 8px 0;
          display: block;
          box-sizing: content-box;
        }

        /* ----- SIMULATOR SLIDERS — TRACK + THUMB BASE COMPARTIDO -----
           Ambos sliders (gen5 + binario) usan .sim-slider para garantizar
           EXACTAMENTE el mismo grosor del track y mismo thumb base.
           Sin esto, el accent-color del default OS variaba el grosor visible. */
        .sim-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        /* Track — idéntico en gen5 y binario. 6px + 2 × 1px borde = 8px total */
        .sim-slider::-webkit-slider-runnable-track {
          height: 6px;
          background: #3B3B3B;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }
        .sim-slider::-moz-range-track {
          height: 6px;
          background: #3B3B3B;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.45);
        }
        /* Thumb base — blanco, 20px, mismo estilo en ambos sliders */
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: none;
          margin-top: -7px; /* (8 - 20) / 2 + ajuste fino */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4),
                      0 0 0 1px rgba(255, 255, 255, 0.1);
          cursor: grab;
        }
        .sim-slider::-webkit-slider-thumb:active { cursor: grabbing; }
        .sim-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
          cursor: grab;
        }

        /* Snowball-slider — extiende .sim-slider con thumb DINÁMICO (binario).
           Solo sobrescribe el tamaño del thumb usando --thumb-size inline.
           Track y resto del thumb hereda de .sim-slider (idéntico al de gen5). */
        .snowball-slider::-webkit-slider-thumb {
          width: var(--thumb-size, 20px);
          height: var(--thumb-size, 20px);
          margin-top: calc((8px - var(--thumb-size, 20px)) / 2);
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      margin-top 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .snowball-slider::-moz-range-thumb {
          width: var(--thumb-size, 20px);
          height: var(--thumb-size, 20px);
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                      height 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .insight-text {
          font-size: 0.9rem;
          color: #555;
          margin-top: 10px;
          text-align: center;
          /* min-height igual a la altura del texto MÁS largo (gen5 = 3 líneas).
             El insight-text de binario (2 líneas) se rellena con whitespace.
             Esto elimina el "salto" al alternar entre INGRESO INMEDIATO ↔ RECURRENTE. */
          min-height: 4.2em;
          line-height: 1.5;
        }

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
        .cta-inaccion { display: none; }
        .cta-buttons { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
        .cta-overlay h2 {
          font-family: var(--font-head); font-size: 2rem; text-transform: uppercase;
          letter-spacing: 2px; margin: 0 0 10px 0; color: var(--text-main);
        }
        .cta-overlay p { font-size: 0.85rem; color: #aaa; margin: 0 0 25px 0; line-height: 1.5; }

        /* Botón primario Lujo Silencioso (Carbón + Borde Dorado + Texto Dorado) */
        .btn-industrial {
          background: var(--color-bg-elevated);
          color: var(--color-brand);
          text-decoration: none;
          padding: 16px 36px;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--color-brand);
          border-radius: var(--radius-action);
          cursor: pointer;
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .btn-industrial:hover {
          background: var(--color-bg-surface);
          border-color: var(--color-brand-hover);
          color: var(--color-brand-hover);
        }

        /* Botón secundario Lujo Silencioso (transparente + borde titanio) */
        .btn-industrial.secondary {
          background: transparent;
          border: 1px solid var(--color-titanium-muted);
          color: var(--color-titanium);
          padding: 12px 24px;
          font-size: 0.9rem;
        }
        .btn-industrial.secondary:hover {
          background: rgba(148, 163, 184, 0.06);
          border-color: var(--color-titanium);
          color: var(--color-text-body);
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
            height: 100% !important;
            top: 0;
            background-position: center !important;
            /* NO desplazar el video: cada b-roll lleva su rótulo quemado arriba-izq
               ("LA EMPRESA DE TODA LA VIDA", etc). object-fit:contain muestra el frame
               completo; un translateY hacia arriba recortaba ese rótulo (incl. sonrisaslindas). */
          }
          .card-content {
            height: auto !important;
            background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 30%, transparent 60%) !important;
            padding: 18px 20px 20px !important;
            justify-content: flex-end;
          }
          /* Títulos inferiores más compactos: caben en 1–2 líneas y no tapan la gráfica */
          .card-content h3.pillar-name {
            font-size: 1.25rem !important;
            line-height: 1.2;
          }

          .slide-3-layout { flex-direction: column; align-items: stretch; justify-content: flex-end; }
          .slide-3-bottom {
            flex-direction: column;
            padding: 0 20px 20px;
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
            scroll-snap-type: y proximity; /* proximity (no mandatory): mandatory atrapaba el scroll hacia arriba entre paneles */
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
            justify-content: flex-start; /* NO center: centrar contenido más alto que la pantalla dejaba el tope inalcanzable (solo se podía bajar) */
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
            height: 48%;
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
            top: 48%; left: 0; right: 0; bottom: 0;
            height: auto;
            background: #111;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 24px 24px 40px;
            text-align: center;
          }
          .cta-overlay h2 { font-size: 1.5rem !important; line-height: 1.15 !important; margin: 0 0 8px !important; }
          .cta-overlay p { margin: 0 0 16px !important; font-size: 0.82rem !important; }
          .cta-inaccion { display: block !important; }
          .cta-buttons { gap: 20px !important; }
          .cta-buttons .btn-industrial:not(.secondary) { width: 100% !important; justify-content: center !important; font-size: 1.1rem !important; padding: 16px 24px !important; }
          .cta-buttons .btn-industrial.secondary { font-size: 0.65rem !important; padding: 10px 20px !important; width: auto !important; letter-spacing: 1.5px !important; }
          .digital-display { font-size: 3rem; }
          .btn-industrial { font-size: 1rem; padding: 12px 20px; }
        }

        /* === FULLSCREEN OVERRIDES === */

        /* -- SLIDE 2: ONE CARD AT A TIME --
           Activado en fullscreen desktop Y en mobile (<1024px) vía la clase
           .one-card-mode (toggle JS-driven). Solo la card .card-active es
           visible y ocupa todo el canvas. El usuario avanza con
           click/teclado/swipe izquierda y retrocede con swipe derecha. */
        .one-card-mode .grid-layout-slide-2 {
          gap: 18px;
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          align-content: stretch;
          overflow-y: visible;
          display: grid;
          flex-direction: initial;
        }
        /* Padding amplio solo en desktop fullscreen — en mobile hereda el del @media */
        :fullscreen .one-card-mode .grid-layout-slide-2 {
          padding: 70px 60px 30px;
        }
        .one-card-mode .card-industrial:not(.card-active) {
          display: none !important;
        }
        .one-card-mode .card-industrial.card-active,
        .one-card-mode .full-width.card-active {
          grid-column: 1 / -1;
          height: auto !important;
          min-height: 70vh !important;
          display: flex !important;
        }
        :fullscreen .card-bg {
          background-size: cover;
          background-position: center;
        }

        /* Dots indicador — solo visible en one-card-mode (mobile + fullscreen).
           Patrón visual estándar de carousel ejecutivo, sutil pero discoverable. */
        .card-dots {
          display: flex;
          gap: 14px;
          justify-content: center;
          margin: 14px 0 0;
        }
        .card-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.32);
          padding: 0;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }
        .card-dot:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .card-dot.active {
          background: var(--cyan);
          border-color: var(--cyan);
          transform: scale(1.25);
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
            filter: brightness(0.45) !important;
          }
          :fullscreen .card-industrial.card-active .card-bg {
            filter: brightness(1) !important;
          }
          :fullscreen .card-industrial.card-active {
            border-color: var(--orange);
          }

          /* SLIDE 4: Figuras deben CRECER en fullscreen mobile */
          /* ── Slide 4 fullscreen mobile ── */
          :fullscreen #slide-4 { overflow-y: scroll !important; scroll-snap-type: y proximity !important; height: 100vh !important; padding: 0 !important; -webkit-overflow-scrolling: touch; }
          :fullscreen #slide-4 .simulator-layout { flex-direction: column !important; height: auto !important; padding: 0 !important; gap: 0 !important; align-items: stretch !important; }
          :fullscreen #slide-4 .simulator-panel { height: 100vh !important; min-height: 100vh !important; width: 100% !important; flex: none !important; scroll-snap-align: start !important; display: flex !important; flex-direction: column !important; justify-content: flex-start !important; padding: 20px 20px 60px !important; overflow-y: auto !important; box-sizing: border-box !important; }
          :fullscreen #slide-4 .cta-panel { height: 100vh !important; min-height: 100vh !important; scroll-snap-align: start !important; flex: none !important; width: 100% !important; border: none !important; }
          :fullscreen #slide-4 .bg-image-cta { height: 48% !important; }
          /* flex-start (no center): en fullscreen la .mobile-nav se oculta, así que
             centrar empuja el 2º botón fuera de pantalla. Anclar arriba (justo bajo
             la imagen) replica la vista normal y garantiza ver ambos botones. */
          :fullscreen #slide-4 .cta-overlay { top: 48% !important; justify-content: flex-start !important; padding: 32px 24px 40px !important; }
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
            filter: brightness(1) !important;
          }
          .card-industrial.card-active {
            border-color: var(--orange);
          }
        }

        /* SCROLLBAR */
        .industrial-theme {
          scrollbar-width: thin;
          scrollbar-color: #333 #1a1a1a;
        }

        /* ============ CATÁLOGO DE PRODUCTOS — MODAL OVERLAY ============
           Trigger: link clickable debajo del texto del Slide 3.
           Despliega imagen del catálogo en overlay sin sacar al prospecto
           del deck. Cierre: X arriba derecha, click backdrop, tecla Escape. */

        /* Trigger: link clickable estilo Lujo Clínico */
        .catalog-trigger {
          display: inline-block;
          background: transparent;
          border: none;
          color: var(--cyan);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          margin-top: 14px;
          padding: 4px 0;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 5px;
          transition: color 0.25s ease, text-underline-offset 0.25s ease;
        }
        .catalog-trigger:hover {
          color: var(--orange);
          text-underline-offset: 7px;
        }

        /* Overlay — fondo carbón translúcido con blur sutil */
        .product-catalog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 17, 21, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          animation: catalogFadeIn 0.25s ease;
        }
        @keyframes catalogFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Modal container — limita ancho y respeta viewport */
        .product-catalog-modal {
          position: relative;
          max-width: 1100px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .catalog-image {
          width: 100%;
          height: auto;
          max-height: 88vh;
          object-fit: contain;
          display: block;
        }

        /* Botón cerrar — círculo titanio arriba-derecha */
        .catalog-close {
          position: absolute;
          top: -18px;
          right: -18px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg-dark, #121212);
          border: 1px solid #878681;
          color: #FFFFFF;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          transition: all 0.2s ease;
          padding: 0;
        }
        .catalog-close:hover {
          border-color: var(--cyan);
          color: var(--cyan);
          transform: scale(1.08);
        }

        /* Mobile: cerrar dentro del frame para no quedar fuera de viewport */
        @media (max-width: 768px) {
          .product-catalog-overlay { padding: 20px 12px; }
          .catalog-close {
            top: 8px;
            right: 8px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>

      <div className={`industrial-theme${isKiosk ? ' kiosk' : ''}`}>

        {/* TOP HUD - Desktop */}
        <nav className="top-hud" style={queswaOpen ? { display: 'none' } : undefined}>
          <button className="btn-fullscreen btn-fullscreen-mobile" onClick={toggleFullscreen} title="Pantalla completa (F)">
            <span className="material-symbols-sharp">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>
          <div className="brand">
            <span>CreaTuActivo</span>
          </div>
          <div className="nav-controls">
            {[
              { id: 1, label: '01 SU EMPRESA DIGITAL' },
              { id: 2, label: '02 C\u00d3MO FUNCIONA' },
              { id: 3, label: '03 EL PRODUCTO' },
              { id: 4, label: '04 SIMULADOR' },
            ].map((s) => (
              <button
                key={s.id}
                className={`nav-btn ${activeSlide === s.id ? 'active' : ''}`}
                onClick={() => showSlide(s.id)}
              >
                {s.label}
              </button>
            ))}
            {!isKiosk && (
              <button className="btn-fullscreen" onClick={() => setVerticalMode(true)} title="Modo vertical (para Meet)" aria-label="Modo vertical">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="7" y="2.5" width="10" height="19" rx="2" />
                  <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" />
                </svg>
              </button>
            )}
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
              { id: 1, label: 'Su Empresa Digital' },
              { id: 2, label: 'C\u00f3mo Funciona' },
              { id: 3, label: 'El Producto' },
              { id: 4, label: 'Simulador' },
            ].map((s) => (
              <button
                key={s.id}
                className={`mobile-nav-btn ${activeSlide === s.id ? 'active' : ''}`}
                onClick={() => showSlide(s.id)}
              >
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
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >

          {/* ===== SLIDE 1: ¿QUÉ ES UNA EMPRESA DIGITAL? (card-scroller, clips Gemini Dan Koe) ===== */}
          <section
            id="slide-1"
            className={`slide ${activeSlide === 1 ? 'active' : ''} ${oneCardMode ? 'one-card-mode' : ''}`}
          >
            <div className="grid-layout-slide-2">
              {/* Header: en grid (preview) = H1+subtítulo como título de sección;
                  en one-card (presentación) = solo contador + dots sobre los clips
                  (la portada índice 0 lleva el H1 full-screen). */}
              {!oneCardMode && (
                <div className="slide-2-header">
                  <h2 className="deck-h2" style={{ fontSize: '2rem', marginBottom: 8 }}>
                    CREE SU EMPRESA DIGITAL
                  </h2>
                  <p className="deck-p" style={{ fontSize: '0.95rem', maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
                    El sistema le toma sus mejores a&ntilde;os sin darle seguridad. Su empresa digital la construye.
                  </p>
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <button
                      type="button"
                      className="ver-video-link"
                      onClick={(e) => { e.stopPropagation(); setVideoModalOpen(true); }}
                    >
                      <span aria-hidden="true">▶</span> Ver video
                    </button>
                  </div>
                </div>
              )}
              {oneCardMode && activeCardIndex >= 1 && (
                <div className="slide-2-header">
                  {/* Volver a la portada (ahí está el enlace "Ver video") — acceso
                      directo en vivo/Meet, donde el click avanza y no retrocede */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveCardIndex(0); }}
                    aria-label="Volver a la portada"
                    title="Portada"
                    className="ver-portada-btn"
                  >
                    <span aria-hidden="true">⌂</span>
                  </button>
                  <span className="slide-2-subtitle" style={{ display: 'block', marginTop: 10 }}>
                    0{activeCardIndex} / 03
                  </span>
                  <div className="card-dots">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className={`card-dot ${activeCardIndex === i ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveCardIndex(i); }}
                        aria-label={`Gráfica ${i} de 3`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Portada (índice 0): H1 + subtítulo centrados, pantalla completa.
                  Solo one-card (en grid el H1 vive en el header). */}
              {oneCardMode && activeCardIndex === 0 && (
                <div style={{ gridColumn: '1 / -1', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#0F1115', padding: '2rem' }}>
                  <h2 className="deck-h2" style={{ fontSize: 'clamp(1.9rem, 7vw, 3.6rem)', lineHeight: 1.05, marginBottom: 18 }}>
                    CREE SU EMPRESA DIGITAL
                  </h2>
                  <p className="deck-p" style={{ fontSize: 'clamp(0.98rem, 3.6vw, 1.35rem)', maxWidth: 620, lineHeight: 1.5 }}>
                    El sistema le toma sus mejores a&ntilde;os sin darle seguridad. Su empresa digital la construye.
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setVideoModalOpen(true); }}
                    className="ver-video-link"
                    style={{ marginTop: 22 }}
                  >
                    <span aria-hidden="true">▶</span> Ver video
                  </button>
                </div>
              )}

              {/* Concepto 1: La empresa de toda la vida (depende de usted) */}
              <div className={`card-industrial ${activeCardIndex === 1 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's1-empresa-tradicional')}>
                <video className="card-bg" data-slide="1" data-card="1" src="/videos/servilleta/empresa-tradicional.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s1-empresa-tradicional')}
                <div className="card-content">
                  <h3 className="pillar-name">Depende de que usted est&eacute; ah&iacute;</h3>
                </div>
              </div>

              {/* Concepto 2: El puente (Amazon/MercadoLibre — una empresa digital) */}
              <div className={`card-industrial ${activeCardIndex === 2 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's1-empresa-digital')}>
                <video className="card-bg" data-slide="1" data-card="2" src="/videos/servilleta/empresa-digital.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s1-empresa-digital')}
                <div className="card-content">
                  <h3 className="pillar-name">Son el puente</h3>
                </div>
              </div>

              {/* Concepto 3 (full-width): sonrisaslindas.app (imagine el suyo) */}
              <div className={`card-industrial full-width ${activeCardIndex === 3 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's1-sonrisaslindas')}>
                <video className="card-bg" data-slide="1" data-card="3" src="/videos/servilleta/sonrisaslindas.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s1-sonrisaslindas')}
                <div className="card-content">
                  <h3 className="pillar-name">Imagine el suyo</h3>
                </div>
              </div>

              {/* CTA — en one-card-mode, solo al llegar a la última card */}
              {(!oneCardMode || activeCardIndex === 3) && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                  <button className="btn-next" onClick={() => showSlide(2)}>
                    C&oacute;mo lo hacemos →
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ===== SLIDE 2: LO DIFÍCIL YA ESTÁ HECHO — primeros principios (clips 3D) =====
              Tres condiciones ya resueltas: alguien fabrica (Gano, socio logístico y
              financiero) · una plataforma atiende a las personas (Queswa, socio digital) ·
              usted sabe qué hacer (Método). Gano se USA, no se entra. NUNCA "pilares" ni
              "fuerzas". Guión servilleta v5.8. */}
          <section
            id="slide-2"
            className={`slide ${activeSlide === 2 ? 'active' : ''} ${oneCardMode ? 'one-card-mode' : ''}`}
          >
            <div className="grid-layout-slide-2">
              {/* Header: en grid (preview) = H1+subtítulo como título de sección;
                  en one-card (presentación) = solo contador + dots sobre los clips
                  (el H1 vive en la portada índice 0) — pedido Director 2 jul 2026. */}
              {!oneCardMode && (
                <div className="slide-2-header">
                  <h2 className="deck-h2" style={{ fontSize: '2rem', marginBottom: 4 }}>
                    3 COSAS TIENEN QUE SER CIERTAS
                  </h2>
                  <span className="slide-2-subtitle">
                    Alguien fabrica, una plataforma atiende a las personas, y usted sabe qué hacer. Las tres, ya resueltas.
                  </span>
                </div>
              )}
              {oneCardMode && activeCardIndex >= 1 && (
                <div className="slide-2-header">
                  <span className="slide-2-subtitle" style={{ display: 'block', marginTop: 10 }}>
                    0{activeCardIndex} / 03
                  </span>
                  <div className="card-dots">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        className={`card-dot ${activeCardIndex === i ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveCardIndex(i); }}
                        aria-label={`Parte ${i} de 3`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Portada (índice 0): H1 + subtítulo centrados, espejo de la portada del
                  slide 1. Solo one-card (en grid el H1 vive en el header). */}
              {oneCardMode && activeCardIndex === 0 && (
                <div style={{ gridColumn: '1 / -1', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#0F1115', padding: '2rem' }}>
                  <h2 className="deck-h2" style={{ fontSize: 'clamp(1.9rem, 7vw, 3.6rem)', lineHeight: 1.05, marginBottom: 18 }}>
                    3 COSAS TIENEN QUE SER CIERTAS
                  </h2>
                  <p className="deck-p" style={{ fontSize: 'clamp(0.98rem, 3.6vw, 1.35rem)', maxWidth: 620, lineHeight: 1.5 }}>
                    Alguien fabrica, una plataforma atiende a las personas, y usted sabe qué hacer. Las tres, ya resueltas.
                  </p>
                </div>
              )}

              {/* Lo primero · alguien fabrica → Gano Excel, socio logístico y financiero */}
              <div className={`card-industrial ${activeCardIndex === 1 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's2-respaldo')}>
                <video className="card-bg" data-slide="2" data-card="1" src="/videos/servilleta/respaldo.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s2-respaldo')}
                <div className="card-content">
                  <span className="pillar-eyebrow">Su socio log&iacute;stico y financiero</span>
                  <h3 className="pillar-name">Gano Excel</h3>
                </div>
              </div>

              {/* Lo segundo · una plataforma atiende a las personas → Queswa, socio digital */}
              <div className={`card-industrial ${activeCardIndex === 2 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's2-queswa')}>
                <video className="card-bg" data-slide="2" data-card="2" src="/videos/servilleta/queswa.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s2-queswa')}
                <div className="card-content">
                  <span className="pillar-eyebrow">Su socio digital</span>
                  <h3 className="pillar-name">Queswa, su Centro de Mando</h3>
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

              {/* Lo tercero · usted sabe qué hacer → el Método (clip metodo.mp4, full-width) */}
              <div className={`card-industrial full-width ${activeCardIndex === 3 ? 'card-active' : ''}`} onClick={(e) => handleClipTap(e, 's2-metodo')}>
                <video className="card-bg" data-slide="2" data-card="3" src="/videos/servilleta/metodo.mp4" muted loop playsInline preload="none" />
                {clipCenterToggle('s2-metodo')}
                <div className="card-content">
                  <span className="pillar-eyebrow">Su m&eacute;todo comprobado</span>
                  <h3 className="pillar-name">Los pasos exactos</h3>
                </div>
              </div>

              {/* CTA al fondo — en one-card-mode, solo cuando se llegó a la última card */}
              {(!oneCardMode || activeCardIndex === 3) && (
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                  <button className="btn-next" onClick={() => showSlide(3)}>
                    VER EL PRODUCTO →
                  </button>
                </div>
              )}
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
                  <div className="technical-label">EL PRODUCTO</div>
                  <h2 className="deck-h2">UN H&Aacute;BITO<br />QUE NO CAMBIA</h2>
                  <p className="deck-p">
                    El caf&eacute; de siempre — ahora con Ganoderma, el hongo m&aacute;s estudiado del planeta, en un extracto que el cuerpo asimila por completo.
                  </p>
                  <button
                    type="button"
                    className="catalog-trigger"
                    onClick={(e) => { e.stopPropagation(); setProductCatalogOpen(true); }}
                  >
                    Ver los productos →
                  </button>
                </div>

                <div className="bio-metrics-container">
                  <div className="bio-metrics-panel">
                    <div className="panel-title">
                      GANODERMA LUCIDUM
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
                  {/* CTA debajo del panel de métricas — fluye con el contenido en todos los modos */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                    <button className="btn-next" onClick={() => showSlide(4)}>
                      VER LOS N&Uacute;MEROS →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== SLIDE 4: SIMULACIÓN + DOBLE CTA ===== */}
          <section id="slide-4" className={`slide ${activeSlide === 4 ? 'active' : ''}`}>
            <div className="simulator-layout">
              {/* Panel del Simulador */}
              <div className="simulator-panel">
                <h3 style={{ textAlign: 'center' }}>SIMULADOR DE INGRESOS RECURRENTES</h3>

                {/* Tabs del Simulador */}
                <div className="sim-tabs">
                  <button
                    className={`sim-tab ${simMode === 'gen5' ? 'active' : ''}`}
                    onClick={() => setSimMode('gen5')}
                  >
                    INGRESO INMEDIATO
                  </button>
                  <button
                    className={`sim-tab ${simMode === 'binario' ? 'active' : ''}`}
                    onClick={() => setSimMode('binario')}
                  >
                    INGRESO RECURRENTE
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
                          {pkg === 'ESP1' ? 'Inicial' : pkg === 'ESP2' ? 'Empresarial' : 'Visionario'}
                        </button>
                      ))}
                    </div>
                    <label>
                      PERSONAS EN SU ORGANIZACI&Oacute;N:
                      <span className="highlight-text">{gen5Socios}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={gen5Socios}
                      onChange={(e) => setGen5Socios(parseInt(e.target.value))}
                      className="sim-slider"
                    />
                    <p className="insight-text">Esta velocidad est&aacute; dise&ntilde;ada para un objetivo claro: optimizar su flujo de caja desde la primera semana de activaci&oacute;n.</p>
                  </div>
                )}

                {/* Controles Binario */}
                {simMode === 'binario' && (
                  <div className="controls-container">
                    {/* Placeholder invisible: ocupa el mismo espacio que el
                        pkg-selector de INGRESO INMEDIATO para que label, slider
                        e insight-text queden EXACTAMENTE en la misma posición
                        vertical al alternar entre tabs (sin saltos de layout). */}
                    <div className="pkg-selector" aria-hidden="true" style={{ visibility: 'hidden' }}>
                      <button className="pkg-btn" tabIndex={-1}>·</button>
                    </div>
                    <label>
                      HOGARES EN SU ORGANIZACI&Oacute;N:
                      <span className="highlight-text">{binarioParejas}</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={1000}
                      step={10}
                      value={binarioParejas}
                      onChange={(e) => setBinarioParejas(parseInt(e.target.value))}
                      className="sim-slider snowball-slider"
                      style={{ ['--thumb-size' as string]: `${snowballSize}px` } as React.CSSProperties}
                    />
                    <p className="insight-text">Ingreso recurrente que crece con su organizaci&oacute;n — independiente de su presencia f&iacute;sica.</p>
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
                  <p className="technical-label" style={{ color: 'var(--cyan)', marginBottom: 16 }}>
                    CONSTRUCCI&Oacute;N DE INGRESOS RECURRENTES
                  </p>

                  <div className="cta-buttons">
                    {/* CTA Principal → /paquetes */}
                    <a
                      href="https://creatuactivo.com/paquetes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-industrial"
                    >
                      ACTIVAR SU EMPRESA DIGITAL →
                    </a>

                    {/* CTA Secundario → boletín (OPCIÓN 2 del guion v5.1: puerta suave) */}
                    <button
                      type="button"
                      className="btn-industrial secondary"
                      onClick={() => setSubscribeOpen(true)}
                    >
                      SUSCRIBIRSE AL BOLET&Iacute;N →
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </section>

        </main>

        {/* MODAL BOLETÍN — OPCIÓN 2 del cierre (Slide 4): puerta de entrada suave */}
        <SubscribeModal isOpen={subscribeOpen} onClose={() => setSubscribeOpen(false)} />

        {/* MODAL CATÁLOGO DE PRODUCTOS — opcional, abre desde Slide 3.
            Permite mostrar la línea Gano Excel sin sacar al prospecto del deck. */}
        {productCatalogOpen && (
          <div
            className="product-catalog-overlay"
            onClick={() => setProductCatalogOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Catálogo de productos"
          >
            <div className="product-catalog-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="catalog-close"
                onClick={() => setProductCatalogOpen(false)}
                aria-label="Cerrar catálogo"
              >×</button>
              <img
                src="/productos/productos.webp"
                alt="Catálogo Queswa — productos Gano Excel"
                className="catalog-image"
              />
            </div>
          </div>
        )}

        {/* MODO VERTICAL — deck en marco portrait 9:16 (iframe a ancho de móvil),
            centrado en negro, nav oculta. Para presentar/compartir en Meet. */}
        {verticalMode && !isKiosk && (
          <div className="vertical-present-overlay" ref={vOverlayRef}>
            <div
              className="vp-frame"
              style={{ width: 412, height: 732, transform: `scale(${vScale})` }}
            >
              <iframe src="/servilleta?kiosk=1" title="Presentación vertical" />
            </div>
            <button
              type="button"
              className="vp-exit"
              onClick={() => setVerticalMode(false)}
              aria-label="Salir del modo vertical"
              title="Salir (Esc)"
            >✕</button>
          </div>
        )}

        {/* MODAL VIDEO DEL PLAN — se reproduce DENTRO del deck (no navega fuera):
            tras verlo se cierra y se sigue en la portada para avanzar a los clips. */}
        {videoModalOpen && (
          <div
            className="video-plan-overlay"
            onClick={() => setVideoModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Video del Plan"
          >
            <video
              src={PLAN_SERVILLETA_VIDEO}
              poster={PLAN_SERVILLETA_POSTER}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="video-plan-player"
            />
            <button
              type="button"
              className="vp-exit"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Cerrar video"
              title="Cerrar (Esc)"
            >✕</button>
          </div>
        )}
      </div>
    </>
  );
}
