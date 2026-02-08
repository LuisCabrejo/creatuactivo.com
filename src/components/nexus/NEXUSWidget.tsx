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

// 🤖 ELEGANCIA CINÉTICA - Terminal de Comando Avanzada (FASE F)
const QUIET_LUXURY = {
  gold: '#E5C279',           // Champagne Gold - Primary accent (EC)
  goldMuted: '#B89B5E',      // Muted gold
  goldDark: '#9A7D42',       // Dark gold
  bgDeep: '#0B0C0C',         // Obsidian - Primary background (EC)
  bgSurface: '#16181D',      // Gunmetal - Surface background (EC)
  bgCard: '#1E2028',         // Card background
  textPrimary: '#E5E5E5',    // Blanco Humo - Primary text
  textSecondary: '#A3A3A3',  // Secondary text
  textMuted: '#6B7280',      // Muted text (Slate Gray)
  // Nuevos en EC:
  cyan: '#38BDF8',            // Cyan Data - Identidad IA
  amber: '#F59E0B',           // Amber Industrial - Usuario/Interactividad
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
          className="h-full flex flex-col shadow-2xl overflow-hidden relative"
          style={{
            background: `rgba(11, 12, 12, 0.95)`,
            backdropFilter: 'blur(32px)',
            border: `1px solid rgba(56, 189, 248, 0.15)`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.07)`,
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}
        >

          {/* 🤖 Terminal HEADER */}
          <div className="hidden md:flex flex-shrink-0 p-4 justify-between items-center border-b"
               style={{
                 background: QUIET_LUXURY.bgSurface,
                 borderColor: `rgba(56, 189, 248, 0.1)`
               }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10  flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
                style={{
                  background: `rgba(56, 189, 248, 0.12)`,
                  border: `1px solid rgba(56, 189, 248, 0.3)`,
                  boxShadow: `0 4px 12px rgba(56, 189, 248, 0.15)`
                }}
              >
                <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.cyan }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm font-industrial" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5  animate-pulse" style={{ background: QUIET_LUXURY.cyan }}></div>
                  <p className="text-xs font-mono" style={{ color: QUIET_LUXURY.cyan }}>SISTEMA EN LÍNEA</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 transition-all duration-200 "
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.cyan;
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
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
                className="p-2 transition-all duration-200 "
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

          {/* 🤖 Terminal HEADER MOBILE */}
          <div
            className="md:hidden flex-shrink-0 px-4 py-3 flex justify-between items-center"
            style={{
              background: QUIET_LUXURY.bgSurface,
              borderBottom: `1px solid rgba(56, 189, 248, 0.1)`
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8  flex items-center justify-center"
                style={{
                  background: `rgba(56, 189, 248, 0.12)`,
                  border: `1px solid rgba(56, 189, 248, 0.3)`,
                  boxShadow: `0 2px 8px rgba(56, 189, 248, 0.1)`
                }}
              >
                <svg className="w-4 h-4" style={{ color: QUIET_LUXURY.cyan }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm font-industrial" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                <p className="text-[10px] font-mono" style={{ color: QUIET_LUXURY.cyan }}>TERMINAL ACTIVA</p>
              </div>
            </div>

            <button
              className="w-9 h-9 flex items-center justify-center  transition-all duration-200"
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

          {/* 🤖 Terminal STATUS BAR */}
          <div
            className="hidden md:block px-4 py-2"
            style={{
              background: `rgba(11, 12, 12, 0.6)`,
              borderBottom: `1px solid rgba(56, 189, 248, 0.06)`
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 " style={{ background: QUIET_LUXURY.cyan }}></div>
              <span className="text-xs font-mono transition-all duration-300" style={{ color: QUIET_LUXURY.textSecondary }}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span style={{ color: QUIET_LUXURY.cyan }}>PROCESANDO</span>
                    <span className="animate-pulse">_</span>
                  </span>
                ) : isUserScrolling ? (
                  <>
                    <span style={{ color: QUIET_LUXURY.textMuted }}>HISTORIAL</span>
                    <span className="ml-2">• pausado</span>
                  </>
                ) : (
                  <>
                    <span>CANAL ACTIVO</span>
                    <span style={{ color: QUIET_LUXURY.cyan }} className="ml-2">•</span>
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
              scrollbarColor: `rgba(56, 189, 248, 0.4) rgba(22, 24, 29, 0.5)`
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
                    className="flex-1 p-4"
                    style={{
                      background: QUIET_LUXURY.bgSurface,
                      borderLeft: `2px solid rgba(56, 189, 248, 0.5)`,
                      borderRadius: '4px 12px 12px 12px',
                      color: QUIET_LUXURY.textSecondary
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10  flex items-center justify-center"
                        style={{
                          background: `rgba(56, 189, 248, 0.12)`,
                          border: `1px solid rgba(56, 189, 248, 0.3)`,
                          boxShadow: `0 4px 12px rgba(56, 189, 248, 0.15)`
                        }}
                      >
                        <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.cyan }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold font-industrial" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5  animate-pulse" style={{ background: QUIET_LUXURY.cyan }}></div>
                          <p className="text-xs font-mono" style={{ color: QUIET_LUXURY.cyan }}>CONECTADO</p>
                        </div>
                      </div>
                    </div>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textSecondary }}>
                      La mayoría de personas son rehenes del "Plan por Defecto": trabajar, pagar cuentas, repetir.
                    </p>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textPrimary }}>
                      Aquí diseñamos la salida: tu propia <strong style={{ color: QUIET_LUXURY.gold }}>Infraestructura de Soberanía</strong>.
                    </p>
                    <p className="mb-3 leading-relaxed" style={{ color: QUIET_LUXURY.textSecondary }}>
                      ¿Cuál es tu situación actual?
                    </p>
                    <ul className="list-none mb-4 space-y-2 text-sm" style={{ color: QUIET_LUXURY.textPrimary }}>
                      <li><strong className="font-mono" style={{ color: QUIET_LUXURY.amber }}>A)</strong> 🏗️ Quiero construir algo propio</li>
                      <li><strong className="font-mono" style={{ color: QUIET_LUXURY.amber }}>B)</strong> 💭 Me siento estancado y busco un cambio</li>
                      <li><strong className="font-mono" style={{ color: QUIET_LUXURY.amber }}>C)</strong> 🔍 Solo estoy explorando, sin compromiso</li>
                      <li><strong className="font-mono" style={{ color: QUIET_LUXURY.amber }}>D)</strong> 🧠 Quiero entender el Modelo de Negocio</li>
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
                    className={`flex message-item ${message.role === 'user' ? 'justify-end' : ''}`}
                    style={{
                      animation: isLastUserMessage
                        ? 'claudeFadeIn 400ms ease-out 150ms both' // 🎯 Fade-in como Claude.ai con delay
                        : messageAppearing === message.role
                        ? 'messageSlideIn 400ms cubic-bezier(0.25, 0.8, 0.25, 1)'
                        : 'fadeInUp 300ms ease-out'
                    }}
                  >
                    <div
                      className={`p-3 md:p-4 text-sm transition-all duration-200 ${
                        message.role === 'user'
                          ? 'max-w-[85%] md:max-w-[75%]'
                          : 'flex-1 overflow-hidden'
                      }`}
                      style={message.role === 'user' ? {
                        background: 'rgba(245, 158, 11, 0.08)',
                        color: QUIET_LUXURY.textPrimary,
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px 4px 4px 12px'
                      } : {
                        background: QUIET_LUXURY.bgSurface,
                        color: QUIET_LUXURY.textSecondary,
                        borderLeft: `2px solid rgba(56, 189, 248, 0.5)`,
                        borderRadius: '4px 12px 12px 12px'
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
                              style={{ color: QUIET_LUXURY.cyan, textDecoration: 'underline' }}
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
                                style={{ border: `1px solid rgba(56, 189, 248, 0.2)` }}
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
                            <tbody style={{ background: `rgba(22, 24, 29, 0.5)` }}>
                              {children}
                            </tbody>
                          ),
                          tr: ({children}) => (
                            <tr
                              className="transition-colors"
                              style={{ borderBottom: `1px solid rgba(56, 189, 248, 0.08)` }}
                            >
                              {children}
                            </tr>
                          ),
                          th: ({children}) => (
                            <th
                              className="px-3 py-2 text-left font-semibold"
                              style={{
                                border: `1px solid rgba(56, 189, 248, 0.15)`,
                                color: QUIET_LUXURY.cyan
                              }}
                            >
                              {children}
                            </th>
                          ),
                          td: ({children}) => (
                            <td
                              className="px-3 py-2"
                              style={{
                                border: `1px solid rgba(56, 189, 248, 0.08)`,
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
                        className="w-1.5 h-1.5  animate-bounce"
                        style={{
                          background: QUIET_LUXURY.cyan,
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
                    Queswa está pensando en tu situación...
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
            style={{ borderTop: `1px solid rgba(56, 189, 248, 0.1)` }}
          >
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="_ Escribe tu consulta..."
                className={`flex-1 px-4 py-3  transition-all duration-200 ${
                  isExpanded ? 'text-base' : 'text-sm'
                }`}
                style={{
                  background: QUIET_LUXURY.bgSurface,
                  color: QUIET_LUXURY.textPrimary,
                  border: `1px solid rgba(229, 194, 121, 0.15)`,
                  fontFamily: 'var(--font-roboto-mono)',
                  boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.2)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = QUIET_LUXURY.cyan;
                  e.currentTarget.style.boxShadow = `inset 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(56, 189, 248, 0.12)`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(229, 194, 121, 0.15)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0, 0, 0, 0.2)';
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-3  hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#0B0C0C',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
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
                className="text-xs px-3 py-2  transition-all duration-200"
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.amber;
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
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
                Nueva Conversación
              </button>
              <button
                className="text-xs px-3 py-2  transition-all duration-200"
                style={{ color: QUIET_LUXURY.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.amber;
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = QUIET_LUXURY.textMuted;
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => handleSendMessage('Quiero hablar con Liliana Moreno')}
              >
                Hablar con un Estratega
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
          background: rgba(22, 24, 29, 0.5);
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.4);
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.6);
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
