'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
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
  const { offset, registerNode, isUserScrolling, scrollToLatest } = useSlidingViewport(messages, scrollContainerRef);

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

  const quickReplies = [
    { text: '¿Cómo funciona exactamente el negocio?', icon: '🗏️' },
    { text: '¿Cómo funciona el sistema de distribución?', icon: '⚙️' },
    { text: '¿Qué es CreaTuActivo.com?', icon: '💎' }
  ];

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
                className="text-slate-400 hover:text-white p-2 transition-all duration-200 rounded-lg hover:bg-white/10"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* BOTÓN CERRAR MOBILE */}
          <button
            className="md:hidden absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 backdrop-blur-sm text-slate-400 hover:text-white transition-all duration-200 hover:bg-slate-700/80"
            onClick={onClose}
            style={{
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* STATUS BAR */}
          <div className="hidden md:block px-4 py-3 bg-slate-800/40 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 transition-all duration-300">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span>💭 Procesando consulta</span>
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
                  : 'p-4 md:p-4 pt-12 md:pt-4'
              }`}
              style={{
                // 🎯 TRANSFORM: Empuja conversaciones anteriores hacia arriba (efecto slide)
                transform: `translateY(-${offset}px)`,

                // 🎯 SIN TRANSICIÓN: Cambio completamente instantáneo como asistentes profesionales
                transition: 'none',

                // 🔑 PADDING COMPENSATORIO: Hace que el contenido transformado sea accesible por scroll
                paddingTop: `${offset + 20}px`
              }}
            >

              {/* SALUDO INICIAL */}
              {messages.length === 0 && (
                <div
                  className="flex items-start animate-fadeIn"
                  style={{
                    animation: 'fadeInUp 600ms cubic-bezier(0.25, 0.8, 0.25, 1) 200ms both'
                  }}
                >
                  <div className="w-7 h-7 bg-slate-700/80 rounded-full flex-shrink-0 flex items-center justify-center mr-2 backdrop-blur-sm">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <div className="flex-1 p-3 rounded-lg text-sm bg-slate-800/90 text-slate-200 backdrop-blur-sm border border-slate-700/30">
                    <p className="font-semibold text-white mb-2">Hola, soy NEXUS</p>
                    <p className="mb-3">Estoy aquí para explicarte cómo la construcción de un sistema de distribución del siglo XXI te permite construir un <span className="text-amber-400 font-semibold">activo patrimonial real</span>, donde la tecnología trabaja para ti 24/7.</p>
                    <p>¿Qué aspecto del sistema te interesa conocer?</p>
                  </div>
                </div>
              )}

              {/* MESSAGES CON REGISTRO PARA CÁLCULOS */}
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  ref={registerNode(message.id)}
                  className="flex message-item"
                  style={{
                    animation: messageAppearing === message.role ?
                      'messageSlideIn 400ms cubic-bezier(0.25, 0.8, 0.25, 1)' :
                      'fadeInUp 300ms ease-out'
                  }}
                >
                  <div
                    className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                      message.role === 'user'
                        ? 'text-white max-w-[75%] ml-auto shadow-lg'
                        : 'bg-slate-800/90 text-slate-200 backdrop-blur-sm flex-1 border border-slate-700/20'
                    }`}
                    style={message.role === 'user' ? {
                      background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
                      boxShadow: '0 4px 20px rgba(30, 64, 175, 0.3)'
                    } : {}}
                  >
                    <ReactMarkdown
                      components={{
                        strong: ({children}) => <strong className="font-bold text-amber-400">{children}</strong>,
                        p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        li: ({children}) => <li className="mb-1">{children}</li>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isLoading && (
                <div
                  className="flex items-center gap-3 px-1 transition-all duration-300"
                  style={{
                    minHeight: '32px',
                    animation: 'fadeIn 200ms ease-out'
                  }}
                >
                  <div className="w-6 h-6 bg-slate-700/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
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

          {/* QUICK REPLIES */}
          {messages.length === 0 && (
            <div
              className={`border-t border-white/10 ${isExpanded ? 'p-6 pt-4' : 'p-4'}`}
              style={{
                animation: 'fadeInUp 800ms cubic-bezier(0.25, 0.8, 0.25, 1) 600ms both'
              }}
            >
              <div className={`space-y-2 mb-3 ${isExpanded ? 'grid grid-cols-1 gap-3 space-y-0' : ''}`}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isExpanded ? 'text-sm' : 'text-xs'
                    }`}
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#F59E0B',
                      animation: `fadeInUp 300ms cubic-bezier(0.25, 0.8, 0.25, 1) ${700 + index * 100}ms both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleSendMessage(reply.text)}
                  >
                    <span className="text-lg">{reply.icon}</span>
                    <span>{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT CON BOTÓN DE VOLVER A CONVERSACIÓN ACTUAL */}
          <div className={`border-t border-white/10 ${isExpanded ? 'p-4 pt-3' : 'p-3'}`}>
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
                disabled={isLoading}
              />

              {/* BOTÓN PARA VOLVER A CONVERSACIÓN ACTUAL */}
              {isUserScrolling && (
                <button
                  type="button"
                  onClick={scrollToLatest}
                  className="p-3 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-all duration-200"
                  title="Volver a conversación actual"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-3 rounded-lg text-white hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </form>
          </div>

          {/* FOOTER */}
          <div className={`${isExpanded ? 'px-6 pb-4' : 'px-4 pb-3'}`}>
            <div className="flex justify-center gap-6">
              <button
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50"
                onClick={resetChat}
              >
                🔄 Limpiar Pizarra
              </button>
              <button
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50"
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
