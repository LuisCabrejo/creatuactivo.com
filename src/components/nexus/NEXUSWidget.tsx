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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const quickReplies = [
    { text: '¿Cómo funciona la arquitectura completa?', icon: '🏗️' },
    { text: 'Ver los paquetes de inversión', icon: '💎' },
    { text: '¿Qué productos únicos tienen?', icon: '🌿' }
  ];

  if (!isOpen) return null;

  // Clases responsive optimizadas
  const containerClasses = isExpanded
    ? "w-full max-w-4xl h-[95vh]" // Expandido
    : "w-full max-w-sm md:max-w-md lg:max-w-lg h-[90vh] md:h-[85vh] lg:h-[80vh]"; // Responsive normal

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
                {/* ✅ ICONOS ESTÁNDAR DE VENTANA - MÁXIMAMENTE INTUITIVOS */}
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

            {/* Mensaje de bienvenida optimizado para progresión */}
            {messages.length === 0 && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="flex-1 max-w-[85%] p-3 rounded-lg text-sm bg-slate-800/80 text-slate-200 backdrop-blur-sm">
                  <p className="font-semibold text-white mb-2">Hola, soy NEXUS 👋</p>
                  <p className="mb-3">Tu copiloto estratégico del ecosistema <span className="text-amber-400 font-semibold">CreaTuActivo.com</span></p>

                  {/* Mini Component Display - Responsivo */}
                  <div className={`grid grid-cols-3 gap-1 my-3 ${isExpanded ? 'gap-2' : ''}`}>
                    <div className="text-center p-1.5 rounded text-xs border border-amber-600/30" style={{ background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.15) 0%, rgba(116, 66, 16, 0.1) 100%)', color: '#f59e0b' }}>
                      <div className="text-sm">🏭</div>
                      <div className="text-xs font-medium">MOTOR</div>
                    </div>
                    <div className="text-center p-1.5 rounded text-xs border border-green-600/30" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)', color: '#10b981' }}>
                      <div className="text-sm">📋</div>
                      <div className="text-xs font-medium">PLANO</div>
                    </div>
                    <div className="text-center p-1.5 rounded text-xs border border-blue-600/30" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)', color: '#3b82f6' }}>
                      <div className="text-sm">⚡</div>
                      <div className="text-xs font-medium">MAQUINARIA</div>
                    </div>
                  </div>

                  <p>Te guío paso a paso en la arquitectura completa.</p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                )}

                <div
                  className={`${isExpanded ? 'max-w-[80%]' : 'max-w-[85%]'} p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'bg-slate-800/80 text-slate-200 backdrop-blur-sm'
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

                {message.role === 'user' && (
                  <div className="w-7 h-7 bg-slate-600 rounded-full flex-shrink-0 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className="max-w-[85%] p-3 rounded-lg text-sm bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Dinámicos */}
          {(messages.length === 0 || (streamingComplete && !isLoading && progressiveReplies.length > 0)) && (
            <div className={`border-t border-white/10 ${isExpanded ? 'p-6 pt-4' : 'p-4'}`}>
              <div className={`space-y-2 mb-3 ${isExpanded ? 'grid grid-cols-2 gap-3 space-y-0' : ''}`}>
                {(messages.length === 0 ? quickReplies : progressiveReplies.map(text => ({ text, icon: '⚡' }))).map((reply, index) => (
                  <button
                    key={`${messages.length}-${index}`} // Key único para re-render
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

          {/* Input optimizado para responsive */}
          <div className={`border-t border-white/10 ${isExpanded ? 'p-6 pt-4' : 'p-4'}`}>
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu pregunta sobre el ecosistema..."
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

          {/* Footer Controls - Responsivo */}
          <div className={`${isExpanded ? 'px-6 pb-4' : 'px-4 pb-3'}`}>
            <div className="flex justify-center gap-4">
              <button
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded transition-colors"
                onClick={resetChat}
              >
                🔄 Reiniciar
              </button>
              <button
                className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded transition-colors"
                onClick={() => handleSendMessage('Quiero hablar con Liliana Moreno')}
              >
                👤 Hablar con Liliana
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NEXUSWidget;
