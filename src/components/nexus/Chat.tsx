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

// src/components/nexus/Chat.tsx
// Componente Chat NEXUS MVP - VOCABULARIO SIMPLIFICADO "LECHE PRIMERO"

import { useChat } from 'ai/react'; // Importación clásica para ai@2.2.37
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, X } from 'lucide-react';

interface NexusChatProps {
  onClose?: () => void;
  isMinimized?: boolean;
}

export default function NexusChat({ onClose, isMinimized = false }: NexusChatProps) {
  const [isOpen, setIsOpen] = useState(!isMinimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/nexus',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        // 🔧 MENSAJE INICIAL Jobs-Style - Coordinado con NEXUSWidget
        content: 'Hola, soy NEXUS\n\nPiénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros. Construyó Amazon, el sistema.\n\nNosotros aplicamos esa misma filosofía. Te ayudamos a construir TU sistema.\n\n¿Por dónde empezamos?'
      }
    ]
  });

  // Auto-scroll a último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen && isMinimized) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Abrir chat NEXUS"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold">NEXUS</h3>
            <p className="text-xs opacity-90">Especialista en sistemas de distribución</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMinimized && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Minimizar"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                message.role === 'user'
                  ? 'bg-gray-600'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gray-100 text-gray-900 ml-4'
                  : 'bg-blue-50 text-gray-900 mr-4 border border-blue-100'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-2">
                {new Date().toLocaleTimeString('es-CO', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm ml-2">NEXUS está analizando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            // 🔧 PLACEHOLDER SIMPLIFICADO
            placeholder="Pregúntame sobre el sistema de distribución..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          NEXUS • Especialista en sistemas inteligentes CreaTuActivo.com
        </div>
      </div>
    </div>
  );
}
