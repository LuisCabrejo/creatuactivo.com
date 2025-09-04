'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNEXUSChat } from './useNEXUSChat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface NEXUSWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const NEXUSWidget: React.FC<NEXUSWidgetProps> = ({ isOpen, onClose }) => {
  const { messages, isLoading, streamingComplete, progressiveReplies, sendMessage, resetChat } = useNEXUSChat();
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🎨 SCROLL INTELIGENTE COMO CLAUDE: Solo cuando es natural
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        // Scroll más conservador: solo si está cerca del final o es el primer mensaje
        if (isNearBottom || messages.length <= 2) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  // Scroll suave cuando aparecen nuevos mensajes
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages.length]);

  // 🎨 FUNCIONALIDAD CLAUDE: Envío con scroll inmediato
  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      setInputMessage(''); // Limpiar input inmediatamente

      // Esto agregará el mensaje del usuario y activará el scroll inmediato
      await sendMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  // Quick replies iniciales
  const quickReplies = [
    { text: 'Explícame el sistema, paso a paso', icon: '🏗️' },
    { text: '¿Cuál es el punto de entrada a la arquitectura?', icon: '💎' },
    { text: 'Háblame del motor de valor', icon: '🌿' }
  ];

  if (!isOpen) return null;

  const containerClasses = isExpanded
    ? "w-full max-w-4xl h-[95vh]"
    : "w-full max-w-lg md:max-w-xl lg:max-w-2xl h-[98vh] md:h-[85vh] lg:h-[80vh]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/20 backdrop-blur-sm">
      <div
        className={`${containerClasses} z-50 transition-all duration-500 ease-out`}
        style={{
          animation: 'slideInFromBottom 400ms cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <div
          className="h-full flex flex-col shadow-2xl shadow-purple-500/20 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.90)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(124, 58, 237, 0.3)'
          }}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 p-4 flex justify-between items-center border-b border-white/10 rounded-t-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.5) 0%, rgba(124, 58, 237, 0.5) 100%)'
            }}
          >
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
                className="hidden md:block text-slate-400 hover:text-white p-2 transition-all duration-200 rounded-lg hover:bg-white/10"
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

          {/* Status Bar Dinámico como Claude */}
          <div className="px-4 py-3 bg-slate-800/40 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-300 transition-all duration-300">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span>💭 NEXUS está escribiendo</span>
                    <span className="animate-pulse">...</span>
                  </span>
                ) : (
                  <>
                    🧠 Copiloto del ecosistema activo
                    <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse ml-2"></span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* 🎨 MESSAGES CONTAINER ESTILO CLAUDE */}
          <div
            className={`flex-1 overflow-y-auto space-y-4 ${isExpanded ? 'p-6' : 'p-4'}`}
            style={{
              scrollbarWidth: 'thin',
              scrollBehavior: 'smooth'
            }}
          >

            {/* Saludo inicial */}
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
                  <p className="font-semibold text-white mb-2">Hola, soy NEXUS 🤖</p>
                  <p className="mb-3">Tu copiloto estratégico. Estoy aquí para mostrarte la arquitectura que usan los constructores inteligentes para crear activos que les <span className="text-amber-400 font-semibold">compran su tiempo de vuelta</span>.</p>

                  <div className={`grid grid-cols-1 gap-2 my-3 ${isExpanded ? 'gap-2' : ''}`}>
                    {[
                      { icon: '🏭', text: 'El Motor de Valor', color: 'amber' },
                      { icon: '📋', text: 'El Plano Estratégico', color: 'green' },
                      { icon: '⚡', text: 'La Maquinaria Tecnológica', color: 'blue' }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`text-center p-2 rounded text-xs border transition-all duration-300 hover:scale-105 cursor-pointer`}
                        style={{
                          background: item.color === 'amber' ?
                            'linear-gradient(135deg, rgba(146, 64, 14, 0.15) 0%, rgba(116, 66, 16, 0.1) 100%)' :
                            item.color === 'green' ?
                            'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)' :
                            'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                          color: item.color === 'amber' ? '#f59e0b' : item.color === 'green' ? '#10b981' : '#3b82f6',
                          borderColor: item.color === 'amber' ? 'rgba(245, 158, 11, 0.3)' :
                                     item.color === 'green' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                          animation: `fadeInUp 400ms cubic-bezier(0.25, 0.8, 0.25, 1) ${400 + index * 100}ms both`
                        }}
                      >
                        <div className="text-sm">{item.icon}</div>
                        <div className="text-xs font-medium">{item.text}</div>
                      </div>
                    ))}
                  </div>

                  <p>¿Qué pieza de la arquitectura te genera más curiosidad?</p>
                </div>
              </div>
            )}

            {/* 🎨 MESSAGES COMO CLAUDE: Pregunta arriba, lectura progresiva */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="flex"
                style={{
                  animation: index === messages.length - 1 ?
                    'messageSlideIn 300ms cubic-bezier(0.25, 0.8, 0.25, 1)' :
                    'none'
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
                  {/* 🎨 CONTENIDO CON CURSOR DE ESCRITURA SI ESTÁ STREAMING */}
                  <div className="relative">
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

                    {/* 🎨 CURSOR DE ESCRITURA COMO CLAUDE */}
                    {message.isStreaming && (
                      <span
                        className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse"
                        style={{
                          animation: 'blink 1s infinite'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 🎨 TYPING INDICATOR SOLO CUANDO NO HAY MENSAJE STREAMING */}
            {isLoading && !messages.some(m => m.isStreaming) && (
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
                <span className="text-xs text-slate-400 animate-pulse">Preparando respuesta...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies iniciales */}
          {messages.length === 0 && (
            <div
              className={`border-t border-white/10 ${isExpanded ? 'p-6 pt-4' : 'p-4'}`}
              style={{
                animation: 'fadeInUp 800ms cubic-bezier(0.25, 0.8, 0.25, 1) 600ms both'
              }}
            >
              <div className={`space-y-2 mb-3 ${isExpanded ? 'grid grid-cols-2 gap-3 space-y-0' : ''}`}>
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

          {/* 🎨 INPUT CON ANIMACIÓN DE ENVÍO COMO CLAUDE */}
          <div className={`border-t border-white/10 ${isExpanded ? 'p-4 pt-3' : 'p-3'}`}>
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregúntame sobre la arquitectura de tu activo..."
                className={`flex-1 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg border border-slate-700/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 ${
                  isExpanded ? 'text-base' : 'text-sm'
                }`}
                style={{
                  boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.2)'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-3 rounded-lg text-white hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputMessage.trim()) {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.4)';
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </form>
          </div>

          {/* Footer */}
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

      {/* 🎨 CSS PERSONALIZADO PARA EFECTOS COMO CLAUDE */}
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

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NEXUSWidget;
