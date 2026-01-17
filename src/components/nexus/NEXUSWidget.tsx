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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNEXUSChat } from './useNEXUSChat';
import { useSlidingViewport } from './useSlidingViewport';

// 🎨 Quiet Luxury Color Palette (THE ARCHITECT'S SUITE)
const QUIET_LUXURY = {
  gold: '#C5A059',           // Champagne Gold - Primary accent
  goldMuted: '#A68A4A',      // Muted gold for subtle elements
  goldDark: '#8A7340',       // Dark gold for hover states
  bgDeep: '#0F1115',         // Carbono - Primary background
  bgSurface: '#1A1D23',      // Surface background
  bgCard: '#22252B',         // Card background
  textPrimary: '#E5E5E5',    // Blanco Humo - Primary text
  textSecondary: '#A3A3A3',  // Secondary text
  textMuted: '#6B7280',      // Muted text (Slate Gray)
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface NEXUSWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

// 🎯 Función para resaltar preguntas de captura en negrilla
const highlightCaptureQuestions = (text: string) => {
  // Patrones de preguntas de captura (nombre, ocupación, WhatsApp)
  const patterns = [
    // Nombre
    /¿[Cc]ómo te llamas\?/g,
    /¿[Cc]uál es tu nombre\?/g,
    /¿[Mm]e compartes tu nombre\?/g,
    /¿[Cc]ómo puedo llamarte\?/g,
    // Ocupación (incluyendo variaciones con nombres)
    /¿[Aa] qué te dedicas actualmente[^?]*\?/g, // Captura "¿A qué te dedicas actualmente, Federico?"
    /¿[Cc]uál es tu ocupación[^?]*\?/g,
    /¿[Aa] qué te dedicas\?/g,
    /¿[Qq]ué haces\?/g,
    // WhatsApp / Teléfono
    /¿[Cc]uál es tu número de [Ww]hats[Aa]pp\?/g,
    /¿[Mm]e compartes tu [Ww]hats[Aa]pp\?/g,
    /¿[Cc]uál es tu teléfono\?/g,
    /¿[Mm]e das tu contacto\?/g
  ];

  let highlighted = text;
  patterns.forEach(pattern => {
    highlighted = highlighted.replace(pattern, (match) => {
      // Solo negrilla, sin emoji ni fondo dorado
      return `**${match}**`;
    });
  });

  return highlighted;
};

const NEXUSWidget: React.FC<NEXUSWidgetProps> = ({ isOpen, onClose }) => {
  const {
    messages,
    isLoading,
    streamingComplete,
    progressiveReplies,
    sendMessage,
    resetChat
  } = useNEXUSChat();

  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [messageAppearing, setMessageAppearing] = useState<string | null>(null);

  // Referencias para la solución balanceada
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Hook balanceado: slide effect + scroll accesible
  const { offset, registerNode, isUserScrolling } = useSlidingViewport(messages, scrollContainerRef);

  // Track del último mensaje para aplicar fade-in animation
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage.role === 'user' && latestMessage.id !== lastMessageId) {
        setLastMessageId(latestMessage.id);
      }
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      setInputMessage('');
      setMessageAppearing('user');

      setTimeout(() => setMessageAppearing(null), 400);
      await sendMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  if (!isOpen) return null;

  const containerClasses = isExpanded
    ? "w-full max-w-4xl h-[95vh]"
    : "w-full max-w-lg md:max-w-xl lg:max-w-2xl h-[98vh] md:h-[85vh] lg:h-[80vh]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 pt-[36px] md:p-4 bg-black/20 backdrop-blur-sm">
      <div
        className={`${containerClasses} z-50 transition-all duration-500 ease-out relative`}
        style={{
          animation: 'slideInFromBottom 400ms cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <div
          className="h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden relative"
          style={{
            background: `rgba(18, 18, 26, 0.95)`,
            backdropFilter: 'blur(32px)',
            border: `1px solid rgba(197, 160, 89, 0.2)`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(197, 160, 89, 0.1)`
          }}
        >

          {/* 🎨 Quiet Luxury HEADER */}
          <div className="hidden md:flex flex-shrink-0 p-4 justify-between items-center border-b rounded-t-2xl"
               style={{
                 background: QUIET_LUXURY.bgSurface,
                 borderColor: `rgba(197, 160, 89, 0.15)`
               }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
                style={{
                  background: QUIET_LUXURY.gold,
                  boxShadow: `0 4px 12px rgba(197, 160, 89, 0.3)`
                }}
              >
                <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.bgDeep }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: QUIET_LUXURY.gold }}></div>
                  <p className="text-xs" style={{ color: QUIET_LUXURY.gold }}>En línea</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 transition-all duration-200 rounded-lg"
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.gold;
                  e.currentTarget.style.background = 'rgba(197, 160, 89, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Contraer ventana" : "Expandir ventana"}
              >
                {isExpanded ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7h10v10m-2 2H6V9h10v10"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5 5h14v14H5V5z"/>
                  </svg>
                )}
              </button>

              <button
                className="p-2 transition-all duration-200 rounded-lg"
                style={{
                  color: QUIET_LUXURY.textSecondary,
                  background: QUIET_LUXURY.bgCard,
                  border: `1px solid ${QUIET_LUXURY.textMuted}40`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f87171';
                  e.currentTarget.style.borderColor = '#f8717150';
                  e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.textSecondary;
                  e.currentTarget.style.borderColor = `${QUIET_LUXURY.textMuted}40`;
                  e.currentTarget.style.background = QUIET_LUXURY.bgCard;
                }}
                onClick={onClose}
                aria-label="Cerrar asistente Queswa"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 🎨 Quiet Luxury HEADER MOBILE */}
          <div
            className="md:hidden flex-shrink-0 px-4 py-3 flex justify-between items-center"
            style={{
              background: QUIET_LUXURY.bgSurface,
              borderBottom: `1px solid rgba(197, 160, 89, 0.15)`
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: QUIET_LUXURY.gold,
                  boxShadow: `0 2px 8px rgba(197, 160, 89, 0.3)`
                }}
              >
                <svg className="w-4 h-4" style={{ color: QUIET_LUXURY.bgDeep }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                <p className="text-[10px]" style={{ color: QUIET_LUXURY.textMuted }}>por CreaTuActivo.com</p>
              </div>
            </div>

            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
              style={{
                background: QUIET_LUXURY.bgCard,
                color: QUIET_LUXURY.textSecondary,
                border: `1px solid ${QUIET_LUXURY.textMuted}40`
              }}
              onClick={onClose}
              aria-label="Cerrar asistente Queswa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* 🎨 Quiet Luxury STATUS BAR */}
          <div
            className="hidden md:block px-4 py-2.5"
            style={{
              background: `rgba(26, 26, 36, 0.6)`,
              borderBottom: `1px solid rgba(255, 255, 255, 0.03)`
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: QUIET_LUXURY.gold }}></div>
              <span className="text-xs transition-all duration-300" style={{ color: QUIET_LUXURY.textSecondary }}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span>Procesando consulta</span>
                    <span className="animate-pulse">...</span>
                  </span>
                ) : isUserScrolling ? (
                  <>
                    Explorando historial
                    <span style={{ color: QUIET_LUXURY.goldMuted }} className="ml-2">• Pausado</span>
                  </>
                ) : (
                  <>
                    Conversación actual
                    <span style={{ color: QUIET_LUXURY.gold }} className="ml-2">• Activo</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* 🎨 Quiet Luxury CONTENEDOR BALANCEADO: SLIDE + SCROLL ACCESIBLE */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto relative"
            style={{
              // Scrollbar personalizado - dorado sutil
              scrollbarWidth: 'thin',
              scrollbarColor: `rgba(197, 160, 89, 0.4) rgba(26, 26, 36, 0.5)`
            }}
          >
            {/* 🔑 CONTENEDOR CON TRANSFORM + PADDING COMPENSATORIO */}
            <div
              className={`w-full space-y-4 ${
                isExpanded
                  ? 'p-6'
                  : 'p-4 md:p-4'
              }`}
              style={{
                // 🎯 TRANSFORM: Empuja conversaciones anteriores hacia arriba (efecto slide)
                transform: `translateY(-${offset}px)`,

                // 🎯 SIN TRANSICIÓN: Ascenso instantáneo como rayo de luz (como Claude.ai)
                transition: 'none',

                // 🔑 HARDWARE ACCELERATION: Fuerza GPU rendering para eliminar parpadeos
                willChange: 'transform',

                // 🔑 PADDING COMPENSATORIO: Hace que el contenido transformado sea accesible por scroll
                paddingTop: `${offset + 20}px`
              }}
            >

              {/* 🎨 Quiet Luxury MENSAJE DE BIENVENIDA */}
              {messages.length === 0 && (
                <div className="flex message-item">
                  <div
                    className="backdrop-blur-sm flex-1 p-4 rounded-xl"
                    style={{
                      background: QUIET_LUXURY.bgCard,
                      border: `1px solid rgba(197, 160, 89, 0.1)`,
                      color: QUIET_LUXURY.textSecondary
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: QUIET_LUXURY.gold,
                          boxShadow: `0 4px 12px rgba(197, 160, 89, 0.25)`
                        }}
                      >
                        <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.bgDeep }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: QUIET_LUXURY.gold }}></div>
                          <p className="text-xs" style={{ color: QUIET_LUXURY.gold }}>En línea</p>
                        </div>
                      </div>
                    </div>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textSecondary }}>
                      La mayoría de profesionales pasan 40 años construyendo el activo de otro.
                    </p>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textPrimary }}>
                      Aquí enseñamos cómo construir tu propia <strong style={{ color: QUIET_LUXURY.gold }}>Infraestructura de Soberanía</strong>.
                    </p>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textSecondary }}>
                      ¿Cuál es tu situación?
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-sm" style={{ color: QUIET_LUXURY.textPrimary }}>
                      <li><strong style={{ color: QUIET_LUXURY.gold }}>A)</strong> Quiero construir un activo propio</li>
                      <li><strong style={{ color: QUIET_LUXURY.gold }}>B)</strong> Me siento estancado profesionalmente</li>
                      <li><strong style={{ color: QUIET_LUXURY.gold }}>C)</strong> Solo estoy explorando opciones</li>
                      <li><strong style={{ color: QUIET_LUXURY.gold }}>D)</strong> Quiero conocer el producto</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* MESSAGES CON REGISTRO PARA CÁLCULOS */}
              {messages.map((message, index) => {
                // Detectar si es el último mensaje user para aplicar animación especial Claude.ai
                const isLastUserMessage = message.role === 'user' && message.id === lastMessageId;

                return (
                  <div
                    key={message.id}
                    ref={registerNode(message.id)}
                    className="flex message-item"
                    style={{
                      animation: isLastUserMessage
                        ? 'claudeFadeIn 400ms ease-out 150ms both' // 🎯 Fade-in como Claude.ai con delay
                        : messageAppearing === message.role
                        ? 'messageSlideIn 400ms cubic-bezier(0.25, 0.8, 0.25, 1)'
                        : 'fadeInUp 300ms ease-out'
                    }}
                  >
                    <div
                      className={`p-3 md:p-4 rounded-xl text-sm transition-all duration-200 ${
                        message.role === 'user'
                          ? 'max-w-[85%] md:max-w-[75%]'
                          : 'backdrop-blur-sm flex-1 overflow-hidden'
                      }`}
                      style={message.role === 'user' ? {
                        background: QUIET_LUXURY.gold,
                        color: QUIET_LUXURY.bgDeep,
                        boxShadow: '0 4px 16px rgba(197, 160, 89, 0.25)'
                      } : {
                        background: QUIET_LUXURY.bgCard,
                        color: QUIET_LUXURY.textSecondary,
                        border: `1px solid rgba(197, 160, 89, 0.08)`
                      }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({children}) => <strong style={{ fontWeight: 600, color: QUIET_LUXURY.gold }}>{children}</strong>,
                          p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="mb-1 leading-relaxed">{children}</li>,
                          a: ({href, children}) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: QUIET_LUXURY.gold, textDecoration: 'underline' }}
                              className="hover:opacity-80 transition-opacity font-medium"
                            >
                              {children}
                            </a>
                          ),
                          // 🎨 Quiet Luxury TABLAS
                          table: ({children}) => (
                            <div className="overflow-x-auto my-3">
                              <table
                                className="w-full border-collapse text-sm"
                                style={{ border: `1px solid rgba(197, 160, 89, 0.2)` }}
                              >
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({children}) => (
                            <thead style={{ background: QUIET_LUXURY.bgSurface }}>
                              {children}
                            </thead>
                          ),
                          tbody: ({children}) => (
                            <tbody style={{ background: `rgba(26, 26, 36, 0.5)` }}>
                              {children}
                            </tbody>
                          ),
                          tr: ({children}) => (
                            <tr
                              className="transition-colors"
                              style={{ borderBottom: `1px solid rgba(197, 160, 89, 0.1)` }}
                            >
                              {children}
                            </tr>
                          ),
                          th: ({children}) => (
                            <th
                              className="px-3 py-2 text-left font-semibold"
                              style={{
                                border: `1px solid rgba(197, 160, 89, 0.15)`,
                                color: QUIET_LUXURY.gold
                              }}
                            >
                              {children}
                            </th>
                          ),
                          td: ({children}) => (
                            <td
                              className="px-3 py-2"
                              style={{
                                border: `1px solid rgba(197, 160, 89, 0.1)`,
                                color: QUIET_LUXURY.textPrimary
                              }}
                            >
                              {children}
                            </td>
                          )
                        }}
                      >
                        {message.role === 'assistant' ? highlightCaptureQuestions(message.content) : message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}

              {/* 🎨 Quiet Luxury TYPING INDICATOR */}
              {isLoading && (
                <div
                  className="flex items-center gap-3 px-1 transition-all duration-300"
                  style={{
                    minHeight: '32px',
                    animation: 'fadeIn 200ms ease-out'
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: QUIET_LUXURY.gold,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="hidden md:inline text-xs animate-pulse"
                    style={{ color: QUIET_LUXURY.textMuted }}
                  >
                    Queswa está analizando...
                  </span>
                </div>
              )}

              {/* ESPACIADOR FINAL */}
              <div className="h-8" />

            </div>
          </div>

          {/* 🎨 Quiet Luxury INPUT */}
          <div
            className={`${isExpanded ? 'p-4 pt-3' : 'p-3'}`}
            style={{ borderTop: `1px solid rgba(197, 160, 89, 0.1)` }}
          >
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className={`flex-1 backdrop-blur-sm px-4 py-3 rounded-xl transition-all duration-200 ${
                  isExpanded ? 'text-base' : 'text-sm'
                }`}
                style={{
                  background: QUIET_LUXURY.bgCard,
                  color: QUIET_LUXURY.textPrimary,
                  border: `1px solid rgba(197, 160, 89, 0.15)`,
                  boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.2)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = QUIET_LUXURY.gold;
                  e.currentTarget.style.boxShadow = `inset 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(197, 160, 89, 0.15)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.15)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0, 0, 0, 0.2)';
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-3 rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: QUIET_LUXURY.gold,
                  color: QUIET_LUXURY.bgDeep,
                  boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </form>
          </div>

          {/* 🎨 Quiet Luxury FOOTER */}
          <div className={`${isExpanded ? 'px-6 pb-4' : 'px-4 pb-3'}`}>
            <div className="flex justify-center gap-6">
              <button
                className="text-xs px-3 py-2 rounded-lg transition-all duration-200"
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.gold;
                  e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => {
                  resetChat();
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                  }
                }}
              >
                Limpiar Pizarra
              </button>
              <button
                className="text-xs px-3 py-2 rounded-lg transition-all duration-200"
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.gold;
                  e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => handleSendMessage('Quiero hablar con Liliana Moreno')}
              >
                Consultoría Estratégica
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* 🎯 ANIMACIÓN CLAUDE.AI: Fade-in suave para ocultar ascenso */
        @keyframes claudeFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* 🎨 Quiet Luxury SCROLLBAR */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(26, 26, 36, 0.5);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(197, 160, 89, 0.4);
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 160, 89, 0.6);
        }

        /* RESPETO POR PREFERENCIAS DE ACCESIBILIDAD */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NEXUSWidget;
