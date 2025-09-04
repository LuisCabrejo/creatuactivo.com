'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNEXUSChat } from './useNEXUSChat';

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
  const { messages, isLoading, streamingComplete, progressiveReplies, sendMessage, resetChat } = useNEXUSChat();
  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔧 FIX PRINCIPAL: Scroll optimizado para evitar layout shift
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Solo hacer scroll si el usuario no está leyendo arriba
      const container = messagesEndRef.current.parentElement;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (isNearBottom || messages.length === 1) {
          // Scroll más suave y específico
          messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest', // En lugar de 'end' - más conservador
            inline: 'nearest'
          });
        }
      }
    }
  };

  // 🔧 FIX: useEffect optimizado - Solo scroll cuando sea realmente necesario
  useEffect(() => {
    // Delay mínimo para evitar interrumpir lectura
    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 50); // 50ms delay para estabilidad

    return () => clearTimeout(scrollTimer);
  }, [messages.length]); // Solo cuando cambia el número de mensajes, no el contenido

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      setInputMessage('');
      await sendMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  // 🔧 QUICK REPLIES INICIALES SOLO PARA SALUDO - Sin superposición
  const quickReplies = [
    { text: 'Explícame el sistema, paso a paso', icon: '🏗️' },
    { text: '¿Cuál es el punto de entrada a la arquitectura?', icon: '💎' },
    { text: 'Háblame del motor de valor', icon: '🌿' }
  ];

  if (!isOpen) return null;

  // Clases responsive optimizadas
  const containerClasses = isExpanded
    ? "w-full max-w-4xl h-[95vh]" // Expandido
    : "w-full max-w-lg md:max-w-xl lg:max-w-2xl h-[98vh] md:h-[85vh] lg:h-[80vh]"; // Responsive normal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/20 backdrop-blur-sm">
      <div className={`${containerClasses} z-50 transition-all duration-300`}>
        <div
          className="h-full flex flex-col shadow-2xl shadow-purple-500/20 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(124, 58, 237, 0.2)'
          }}
        >
          {/* Header con controles de expansión */}
          <div
            className="flex-shrink-0 p-4 flex justify-between items-center border-b border-white/10 rounded-t-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(124, 58, 237, 0.4) 100%)'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
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

            {/* Controles header */}
            <div className="flex items-center gap-2">
              {/* Solo mostrar expand en desktop */}
              <button
                className="hidden md:block text-slate-400 hover:text-white p-1 transition-colors rounded"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Contraer ventana" : "Expandir ventana"}
              >
                {isExpanded ? (
                  // Estado EXPANDIDO → Mostrar icono RESTAURAR (dos cuadrados)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7h10v10m-2 2H6V9h10v10"/>
                  </svg>
                ) : (
                  // Estado CONTRAÍDO → Mostrar icono MAXIMIZAR (cuadrado simple)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M5 5h14v14H5V5z"/>
                  </svg>
                )}
              </button>

              <button
                className="text-slate-400 hover:text-white p-1 transition-colors"
                onClick={onClose}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-slate-800/30 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">
                {isLoading ? '💭 Procesando consulta...' : '🧠 Copiloto del ecosistema activo'}
                {!isLoading && <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse ml-2"></span>}
              </span>
            </div>
          </div>

          {/* Messages Container - Optimizado para diferentes tamaños */}
          <div className={`flex-1 overflow-y-auto space-y-4 ${isExpanded ? 'p-6' : 'p-4'}`}
               style={{ scrollbarWidth: 'thin' }}>

            {/* 🔧 SALUDO INICIAL OPTIMIZADO - Textos Actualizados */}
            {messages.length === 0 && (
              <div className="flex items-start">
                <div className="w-7 h-7 bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="flex-1 p-3 rounded-lg text-sm bg-slate-800/80 text-slate-200 backdrop-blur-sm">
                  {/* 🔧 TEXTOS ACTUALIZADOS */}
                  <p className="font-semibold text-white mb-2">Hola, soy NEXUS 🤖</p>
                  <p className="mb-3">Tu copiloto estratégico. Estoy aquí para mostrarte la arquitectura que usan los constructores inteligentes para crear activos que les <span className="text-amber-400 font-semibold">compran su tiempo de vuelta</span>.</p>

                  {/* 🔧 COMPONENTES ACTUALIZADOS - Textos de Botones Optimizados */}
                  <div className={`grid grid-cols-1 gap-2 my-3 ${isExpanded ? 'gap-2' : ''}`}>
                    <div className="text-center p-2 rounded text-xs border border-amber-600/30" style={{ background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.15) 0%, rgba(116, 66, 16, 0.1) 100%)', color: '#f59e0b' }}>
                      <div className="text-sm">🏭</div>
                      <div className="text-xs font-medium">El Motor de Valor</div>
                    </div>
                    <div className="text-center p-2 rounded text-xs border border-green-600/30" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)', color: '#10b981' }}>
                      <div className="text-sm">📋</div>
                      <div className="text-xs font-medium">El Plano Estratégico</div>
                    </div>
                    <div className="text-center p-2 rounded text-xs border border-blue-600/30" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)', color: '#3b82f6' }}>
                      <div className="text-sm">⚡</div>
                      <div className="text-xs font-medium">La Maquinaria Tecnológica</div>
                    </div>
                  </div>

                  {/* 🔧 PREGUNTA GUÍA ACTUALIZADA */}
                  <p>¿Qué pieza de la arquitectura te genera más curiosidad?</p>
                </div>
              </div>
            )}

            {/* Messages - ✅ OPTIMIZADOS PARA MÁXIMO APROVECHAMIENTO ESPACIAL */}
            {messages.map((message) => (
              <div key={message.id} className="flex">
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'text-white max-w-[75%] ml-auto'
                      : 'bg-slate-800/80 text-slate-200 backdrop-blur-sm flex-1'
                  }`}
                  style={message.role === 'user' ? {
                    background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
                  } : {}}
                >
                  <ReactMarkdown
                    components={{
                      strong: ({children}) => <strong className="font-bold text-amber-400">{children}</strong>,
                      p: ({children}) => <p className="mb-2">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                      li: ({children}) => <li className="mb-1">{children}</li>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* 🔧 FIX CRÍTICO: Typing indicator con altura reservada */}
            {isLoading && (
              <div className="flex items-center gap-2 px-1" style={{ minHeight: '32px' }}>
                <div className="w-6 h-6 bg-slate-700/60 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 🔧 FIX CRÍTICO: Solo Quick Replies iniciales, NO los automáticos */}
          {messages.length === 0 && (
            <div className={`border-t border-white/10 ${isExpanded ? 'p-6 pt-4' : 'p-4'}`}>
              <div className={`space-y-2 mb-3 ${isExpanded ? 'grid grid-cols-2 gap-3 space-y-0' : ''}`}>
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                      isExpanded ? 'text-sm' : 'text-xs'
                    }`}
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#F59E0B'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => handleSendMessage(reply.text)}
                  >
                    {reply.icon} <span>{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🔧 ELIMINADO: Sección de Quick Replies automáticos que causaba superposición */}
          {/*
          La sección que renderizaba progressiveReplies se ha eliminado completamente
          para evitar superposición con las opciones A, B, C que aparecen en el texto de NEXUS
          */}

          {/* 🔧 INPUT OPTIMIZADO - Placeholder Actualizado */}
          <div className={`border-t border-white/10 ${isExpanded ? 'p-4 pt-3' : 'p-3'}`}>
            <form className="flex items-center gap-1" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregúntame sobre la arquitectura de tu activo..."
                className={`flex-1 bg-slate-800/80 backdrop-blur-sm text-white px-3 py-2.5 rounded-lg border border-slate-700/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all ${
                  isExpanded ? 'text-base' : 'text-sm'
                }`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-lg text-white hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </form>
          </div>

          {/* 🔧 FOOTER CONTROLS - Textos Actualizados */}
          <div className={`${isExpanded ? 'px-6 pb-4' : 'px-4 pb-3'}`}>
            <div className="flex justify-center gap-4">
              <button
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded transition-colors"
                onClick={resetChat}
              >
                🔄 Limpiar Pizarra
              </button>
              <button
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded transition-colors"
                onClick={() => handleSendMessage('Quiero hablar con Liliana Moreno')}
              >
                👤 Consultoría Estratégica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NEXUSWidget;
