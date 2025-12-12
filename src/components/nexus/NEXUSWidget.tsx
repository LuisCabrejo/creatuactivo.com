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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/20 backdrop-blur-sm">
      <div
        className={`${containerClasses} z-50 transition-all duration-500 ease-out relative`}
        style={{
          animation: 'slideInFromBottom 400ms cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <div
          className="h-full flex flex-col shadow-2xl shadow-purple-500/20 rounded-2xl overflow-hidden relative"
          style={{
            background: 'rgba(15, 23, 42, 0.90)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(124, 58, 237, 0.3)'
          }}
        >

          {/* HEADER */}
          <div className="hidden md:flex flex-shrink-0 p-4 justify-between items-center border-b border-white/10 rounded-t-2xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.5) 0%, rgba(124, 58, 237, 0.5) 100%)'
               }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
                }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-sm">NEXUS</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-green-400">En línea</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="text-slate-400 hover:text-white p-2 transition-all duration-200 rounded-lg hover:bg-white/10"
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
                className="text-white hover:text-red-400 p-2 transition-all duration-200 rounded-lg bg-slate-700/50 hover:bg-red-500/20 border border-slate-600/50 hover:border-red-500/50"
                onClick={onClose}
                aria-label="Cerrar asistente NEXUS"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* HEADER MOBILE */}
          <div
            className="md:hidden flex-shrink-0 px-4 py-3 flex justify-between items-center border-b border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.6) 0%, rgba(124, 58, 237, 0.6) 100%)'
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-sm">NEXUS</p>
                <p className="text-[10px] text-slate-300">por CreaTuActivo.com</p>
              </div>
            </div>

            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-700/80 text-white hover:text-red-400 transition-all duration-200 hover:bg-red-500/20 border border-slate-600 hover:border-red-500"
              onClick={onClose}
              aria-label="Cerrar asistente NEXUS"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* STATUS BAR */}
          <div className="hidden md:block px-4 py-3 bg-slate-800/40 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 transition-all duration-300">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span>Procesando consulta</span>
                    <span className="animate-pulse">...</span>
                  </span>
                ) : isUserScrolling ? (
                  <>
                    📜 Explorando historial
                    <span className="text-amber-400 ml-2">• Slide pausado</span>
                  </>
                ) : (
                  <>
                    🎯 Conversación actual
                    <span className="text-green-400 ml-2">• Slide activo</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* 🎯 CONTENEDOR BALANCEADO: SLIDE + SCROLL ACCESIBLE */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto relative"
            style={{
              // Scrollbar personalizado
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(124, 58, 237, 0.5) rgba(30, 41, 59, 0.3)'
            }}
          >
            {/* 🔑 CONTENEDOR CON TRANSFORM + PADDING COMPENSATORIO */}
            <div
              className={`w-full space-y-4 ${
                isExpanded
                  ? 'p-6'
                  : 'p-2 md:p-4'
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

              {/* 🎯 MENSAJE DE BIENVENIDA AUTOMÁTICO - Solo cuando no hay mensajes */}
              {messages.length === 0 && (
                <div className="flex message-item">
                  <div className="bg-slate-800/90 text-slate-200 backdrop-blur-sm flex-1 border border-slate-700/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-white">NEXUS IA</p>
                        <p className="text-xs text-green-400">🟢 En línea</p>
                      </div>
                    </div>
                    <p className="mb-3 leading-relaxed">
                      Hola 👋 Soy <strong className="text-amber-400">NEXUS</strong>, tu asistente con IA.
                    </p>
                    <p className="mb-3 leading-relaxed">
                      Puedo responder cualquier duda sobre:
                    </p>
                    <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-sm">
                      <li>¿Cómo funciona el sistema?</li>
                      <li>¿Cuánto puedo ganar?</li>
                      <li>¿Qué tengo que hacer?</li>
                      <li>Productos Gano Excel</li>
                    </ul>
                    <p className="text-sm text-slate-400 italic">
                      💬 Escribe tu pregunta abajo para empezar...
                    </p>
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
                      className={`p-2 md:p-3 rounded-lg text-sm transition-all duration-200 ${
                        message.role === 'user'
                          ? 'text-white max-w-[85%] md:max-w-[75%] shadow-lg'
                          : 'bg-slate-800/90 text-slate-200 backdrop-blur-sm flex-1 border border-slate-700/20 overflow-hidden'
                      }`}
                      style={message.role === 'user' ? {
                        background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
                        boxShadow: '0 4px 20px rgba(30, 64, 175, 0.3)'
                      } : {}}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({children}) => <strong className="font-bold text-amber-400">{children}</strong>,
                          p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>,
                          li: ({children}) => <li className="mb-1 leading-relaxed">{children}</li>,
                          a: ({href, children}) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline transition-colors font-semibold"
                            >
                              {children}
                            </a>
                          ),
                          // 🎯 TABLAS CON BORDES VISIBLES
                          table: ({children}) => (
                            <div className="overflow-x-auto my-3">
                              <table className="w-full border-collapse border border-slate-600 text-sm">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({children}) => (
                            <thead className="bg-slate-700/80">
                              {children}
                            </thead>
                          ),
                          tbody: ({children}) => (
                            <tbody className="bg-slate-800/50">
                              {children}
                            </tbody>
                          ),
                          tr: ({children}) => (
                            <tr className="border-b border-slate-600 hover:bg-slate-700/30 transition-colors">
                              {children}
                            </tr>
                          ),
                          th: ({children}) => (
                            <th className="border border-slate-600 px-3 py-2 text-left font-semibold text-amber-400">
                              {children}
                            </th>
                          ),
                          td: ({children}) => (
                            <td className="border border-slate-600 px-3 py-2 text-slate-200">
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

              {/* TYPING INDICATOR */}
              {isLoading && (
                <div
                  className="flex items-center gap-3 px-1 transition-all duration-300"
                  style={{
                    minHeight: '32px',
                    animation: 'fadeIn 200ms ease-out'
                  }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                  <span className="hidden md:inline text-xs text-slate-400 animate-pulse">NEXUS está analizando...</span>
                </div>
              )}

              {/* ESPACIADOR FINAL */}
              <div className="h-8" />

            </div>
          </div>

          {/* INPUT CON BOTÓN DE VOLVER A CONVERSACIÓN ACTUAL */}
          <div className={`border-t border-white/10 ${isExpanded ? 'p-4 pt-3' : 'p-2 md:p-3'}`}>
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className={`flex-1 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-slate-700/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 ${
                  isExpanded ? 'text-base' : 'text-sm'
                }`}
                style={{
                  boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.2)'
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-3 rounded-lg text-white hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </form>
          </div>

          {/* FOOTER */}
          <div className={`${isExpanded ? 'px-6 pb-4' : 'px-2 md:px-4 pb-3'}`}>
            <div className="flex justify-center gap-2 md:gap-6">
              <button
                className="text-xs text-slate-400 hover:text-slate-200 px-2 md:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50"
                onClick={() => {
                  resetChat();
                  // ✅ Scroll al tope para ver el nuevo saludo
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0;
                  }
                }}
              >
                🔄 Limpiar Pizarra
              </button>
              <button
                className="text-xs text-slate-400 hover:text-slate-200 px-2 md:px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50"
                onClick={() => handleSendMessage('Quiero hablar con Liliana Moreno')}
              >
                👤 Consultoría Estratégica
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

        /* SCROLLBAR PERSONALIZADO */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.6);
          border-radius: 4px;
          border: 1px solid rgba(30, 41, 59, 0.2);
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.8);
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
