/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NEXUSWidget from './NEXUSWidget';

interface TrackingState {
  isReady: boolean;
  hasError: boolean;
  retryCount: number;
}

// Configuración de tiempos para el tooltip (en milisegundos)
// 🎯 v2.0 PREMIUM UX: Comportamiento "Concierge 5 Estrellas" (no vendedor ambulante)
const TOOLTIP_CONFIG = {
  scrollDelayMs: 15000,       // Aparece 15 segundos después de carga (da tiempo a explorar)
  visibleDurationMs: 15000,   // Visible por 15 segundos (tiempo suficiente para leer)
  // ❌ ELIMINADO: reappearDelayMs - NO reaparece automáticamente (Quiet Luxury)
};

// 🎨 Elegancia Cinética Color Palette
const QUIET_LUXURY = {
  gold: '#E5C279',           // Champagne Gold - Primary accent (EC)
  goldMuted: '#B89B5E',      // Muted gold
  goldDark: '#9A7D42',       // Dark gold
  bgDeep: '#0B0C0C',         // Obsidian - Primary background (EC)
  bgSurface: '#16181D',      // Gunmetal - Surface (EC)
  bgCard: '#1E2028',         // Card background (EC)
  textPrimary: '#E5E5E5',    // Blanco Humo - Primary text
  textSecondary: '#A3A3A3',  // Secondary text
  textMuted: '#6B7280',      // Muted text (Slate Gray)
  amber: '#F59E0B',          // Amber Industrial - Interactividad
  // 🆕 Botón flotante: Blanco puro para máximo contraste en móvil
  buttonBg: '#FFFFFF',
  buttonIcon: '#0B0C0C',     // Icono Obsidian sobre fondo blanco
};

const NEXUSFloatingButton: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [demoActivated, setDemoActivated] = useState(false);
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isReady: true, // ✅ FIX: Empezar como "ready" para no bloquear UI
    hasError: false,
    retryCount: 0
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;
    let retryCount = 0; // ✅ FIX: Variable local en lugar de state

    const checkTrackingReady = () => {
      // Verificar si FrameworkIAA está disponible y funcional
      if (typeof window !== 'undefined') {
        const isFrameworkReady = !!(
          window.FrameworkIAA &&
          window.FrameworkIAA.fingerprint &&
          window.updateProspectData
        );

        if (isFrameworkReady) {
          console.log('✅ NEXUS: Framework IAA listo');
          // No actualizamos state porque ya empezó como ready
          return true;
        }
      }
      return false;
    };

    const handleTrackingReady = (event: CustomEvent) => {
      console.log('🎯 NEXUS: Evento nexusTrackingReady recibido', event.detail);

      if (event.detail && (event.detail.fingerprint || event.detail.prospect)) {
        setTrackingState(prev => ({
          ...prev,
          isReady: true,
          hasError: false
        }));
      }
    };

    // 🔧 FIX 1: Verificación inmediata si ya está listo
    if (checkTrackingReady()) {
      return; // Ya está listo, no necesitamos listeners
    }

    // 🔧 FIX 2: Listener para evento de tracking listo
    window.addEventListener('nexusTrackingReady', handleTrackingReady as EventListener);

    // 🔧 FIX 3: Polling backup para casos edge
    const pollForTracking = () => {
      if (!checkTrackingReady() && retryCount < 10) {
        retryCount++; // ✅ FIX: Incremento local
        retryTimeoutId = setTimeout(pollForTracking, 500);
      } else if (retryCount >= 10) {
        console.warn('⚠️ NEXUS: Timeout esperando Framework IAA - Modo fallback activo');
        // Ya está ready por defecto, no necesitamos actualizar state
      }
    };

    // 🔧 FIX 4: Timeout inicial - solo para logging
    timeoutId = setTimeout(() => {
      checkTrackingReady(); // Verificación silenciosa
    }, 1000);

    // ✅ FIX: Removido fallback absoluto - no necesitamos bloquear UI

    return () => {
      window.removeEventListener('nexusTrackingReady', handleTrackingReady as EventListener);
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, []); // ✅ FIX: Sin dependencias para evitar loop infinito

  // 🎯 TOOLTIP v2.0: Lógica "Concierge" - UNA SOLA VEZ, luego discreto
  // Comportamiento Premium: Se presenta una vez, ofrece ayuda, y espera pacientemente
  useEffect(() => {
    // Si el usuario ya interactuó o el widget está abierto, no mostrar tooltip
    if (hasInteracted || isOpen) return;

    let initialTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    // 🎯 Mostrar tooltip UNA SOLA VEZ después del delay inicial
    initialTimeout = setTimeout(() => {
      if (hasInteracted || isOpen) return;

      setShowTooltip(true);

      // Ocultar suavemente después del tiempo de visibilidad
      // ❌ NO programar reaparición - Quiet Luxury (Concierge espera, no insiste)
      hideTimeout = setTimeout(() => {
        setShowTooltip(false);
        setHasInteracted(true); // Marcar como "ya mostrado" para no repetir
      }, TOOLTIP_CONFIG.visibleDurationMs);

    }, TOOLTIP_CONFIG.scrollDelayMs);

    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hasInteracted, isOpen]);

  // Escuchar evento de demo (triple clic en servilleta — muestra botón en mobile)
  useEffect(() => {
    const handleDemoToggle = () => setDemoActivated(prev => !prev);
    window.addEventListener('toggle-queswa', handleDemoToggle);
    return () => window.removeEventListener('toggle-queswa', handleDemoToggle);
  }, []);

  // Abrir chat directamente (botón "PREGÚNTALE ALGO EN VIVO" y triple clic desktop)
  useEffect(() => {
    const handleOpenQueswa = () => {
      setDemoActivated(true);
      setIsOpen(true);
    };
    window.addEventListener('open-queswa', handleOpenQueswa);
    return () => window.removeEventListener('open-queswa', handleOpenQueswa);
  }, []);

  // En servilleta: oculta por defecto en todos los dispositivos — solo activa con triple clic o botón demo
  if (pathname === '/servilleta' && !demoActivated) return null;

  const handleButtonClick = () => {
    if (!trackingState.isReady) {
      console.log('🚫 NEXUS: Tracking no está listo aún, intentando recargar...');

      // Forzar verificación una vez más
      if (typeof window !== 'undefined' && window.reidentifyProspect) {
        window.reidentifyProspect();
      }

      // Mostrar feedback visual (opcional)
      const button = document.querySelector('[data-nexus-button]') as HTMLElement;
      if (button) {
        button.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
          button.style.animation = '';
        }, 500);
      }
      return;
    }

    setHasInteracted(true); // Marcar que el usuario interactuó
    setShowTooltip(false);  // Ocultar tooltip
    setIsOpen(true);
  };

  // 🎨 Quiet Luxury: Estado visual del botón
  const getButtonStyles = () => {
    if (!trackingState.isReady) {
      return {
        background: QUIET_LUXURY.bgCard,
        opacity: 0.7,
        border: `1px solid ${QUIET_LUXURY.textMuted}`
      };
    }

    if (trackingState.hasError) {
      return {
        background: '#2a1a1a',
        opacity: 0.9,
        border: '1px solid #6b3030'
      };
    }

    // Blanco puro - Máximo contraste en móvil
    return {
      background: QUIET_LUXURY.buttonBg,
      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.25)`
    };
  };

  return (
    <>
      {/* 🎨 Quiet Luxury TOOLTIP - Alineado con navegación */}
      {!isOpen && trackingState.isReady && !trackingState.hasError && (
        <div
          className={`fixed bottom-24 right-3 sm:right-5 lg:right-7 z-[200] transition-all duration-500 ${
            showTooltip
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div
            className="pl-4 pr-2 py-2.5 shadow-xl flex items-center gap-2"
            style={{
              background: QUIET_LUXURY.bgSurface,
              border: `1px solid rgba(229, 194, 121, 0.3)`,
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(229, 194, 121, 0.15)`,
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
            }}
          >
            <span
              className="text-sm font-medium whitespace-nowrap"
              style={{ color: QUIET_LUXURY.textPrimary }}
            >
              ¿Iniciamos tu <span style={{ color: QUIET_LUXURY.gold, fontWeight: 600 }} className="font-industrial">Auditoría</span>?
            </span>
            {/* Botón para cerrar el tooltip */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
                setHasInteracted(true); // No vuelve a aparecer
              }}
              className="ml-1 p-1 transition-colors"
              style={{ color: QUIET_LUXURY.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = QUIET_LUXURY.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = QUIET_LUXURY.textMuted}
              aria-label="Cerrar sugerencia"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button - Industrial Square (oculto cuando el chat está abierto) */}
      <button
        data-nexus-button
        className={`fixed bottom-6 right-4 sm:right-6 lg:right-8 w-14 h-14 z-[200] flex items-center justify-center transition-all duration-300 hover:scale-105 group${isOpen ? ' hidden' : ''}`}
        style={{
          ...getButtonStyles(),
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          border: trackingState.isReady && !trackingState.hasError ? '1px solid rgba(56, 189, 248, 0.3)' : undefined
        }}
        onMouseEnter={(e) => {
          if (trackingState.isReady && !trackingState.hasError) {
            e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 158, 11, 0.35)`;
          }
        }}
        onMouseLeave={(e) => {
          if (trackingState.isReady && !trackingState.hasError) {
            e.currentTarget.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(245, 158, 11, 0.25)`;
          }
        }}
        onClick={handleButtonClick}
        aria-label="Abrir chat con Queswa"
      >
        <div className="relative">
          {/* Icono dinámico basado en estado */}
          {!trackingState.isReady ? (
            // Spinner de carga - color oscuro sobre fondo gris
            <svg className="w-7 h-7 animate-spin" style={{ color: QUIET_LUXURY.textMuted }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : trackingState.hasError ? (
            // Icono de advertencia
            <svg className="w-7 h-7" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          ) : (
            // 🎨 Icono NEXUS - Rayo estilizado en oscuro sobre blanco
            <svg className="w-7 h-7" style={{ color: QUIET_LUXURY.buttonIcon }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          )}

          {/* 🎨 Quiet Luxury pulse - dorado sobre blanco */}
          {trackingState.isReady && !trackingState.hasError && (
            <div
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
              style={{ background: QUIET_LUXURY.gold }}
            >
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-60"
                style={{ background: QUIET_LUXURY.gold }}
              ></div>
            </div>
          )}
        </div>
      </button>

      {/* Widget - Solo se renderiza cuando tracking está listo */}
      {trackingState.isReady && (
        <NEXUSWidget
          isOpen={isOpen}
          onClose={() => { setIsOpen(false); if (pathname === '/servilleta') { setDemoActivated(false); window.dispatchEvent(new CustomEvent('close-queswa')); } }}
        />
      )}

      {/* 🔧 FIX 9: CSS para animación de pulse personalizada */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

// 🔧 FIX 10: Declarar tipos para window objects si no existen
declare global {
  interface Window {
    FrameworkIAA?: {
      fingerprint?: string;
      prospect?: any;
      updateProspectData?: Function;
    };
    updateProspectData?: Function;
    reidentifyProspect?: Function;
  }
}

export default NEXUSFloatingButton;
