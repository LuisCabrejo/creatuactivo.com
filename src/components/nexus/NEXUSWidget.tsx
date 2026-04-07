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

import React, { useState, useEffect, useRef } from 'react';
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
  voiceState?: 'idle' | 'recording' | 'processing' | 'speaking' | 'error';
  onStartVoice?: () => void;
  onStopVoice?: () => void;
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

const NEXUSWidget: React.FC<NEXUSWidgetProps> = ({ isOpen, onClose, voiceState = 'idle', onStartVoice, onStopVoice }) => {
  const {
    messages,
    isLoading,
    sendMessage,
  } = useNEXUSChat();

  const [inputMessage, setInputMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔊 Audio TTS — voz ElevenLabs en burbujas del asistente
  const [playingId, setPlayingId]     = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakMessage = async (text: string, messageId: string) => {
    // Si ya está sonando este mensaje, pararlo
    if (playingId === messageId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    // Parar audio anterior
    audioRef.current?.pause();
    setPlayingId(null);
    setLoadingAudioId(messageId);

    try {
      const res = await fetch('/api/nexus/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlayingId(messageId);
      audio.onended = () => { setPlayingId(null); URL.revokeObjectURL(url); };
      audio.onerror = () => { setPlayingId(null); };
      await audio.play();
    } catch (err) {
      console.error('[TTS]', err);
      setPlayingId(null);
    } finally {
      setLoadingAudioId(null);
    }
  };

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
      await sendMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  if (!isOpen) return null;

  const isInitialState = messages.length === 1 &&
    (messages[0].id === 'initial-greeting' || messages[0].id === 'initial-greeting-products');

  const containerClasses = isExpanded
    ? "w-full max-w-4xl h-[95vh]"
    : "w-full max-w-lg md:max-w-xl lg:max-w-2xl h-full md:h-[85vh] lg:h-[80vh]";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:items-center md:p-4 md:bg-black/20 md:backdrop-blur-sm">
      <div
        className={`${containerClasses} z-50 relative`}
        style={{
          animation: 'slideInFromBottom 400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
      >
        <div
          className="h-full flex flex-col overflow-hidden relative md:shadow-2xl"
          style={{
            background: '#0B0C0C',
            border: `1px solid rgba(255, 255, 255, 0.06)`,
          }}
        >

          {/* 🤖 Terminal HEADER */}
          <div className="hidden md:flex flex-shrink-0 p-4 justify-between items-center border-b"
               style={{
                 background: QUIET_LUXURY.bgSurface,
                 borderColor: `rgba(255, 255, 255, 0.06)`
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
            className="md:hidden flex-shrink-0 px-4 py-2 flex justify-between items-center"
            style={{
              background: '#0B0C0C',
              borderBottom: `1px solid rgba(255, 255, 255, 0.06)`
            }}
          >
            <p className="font-semibold text-sm font-industrial" style={{ color: QUIET_LUXURY.textPrimary }}>Queswa 🪢</p>

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
              borderBottom: `1px solid rgba(255, 255, 255, 0.04)`
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

          {/* 🎨 Estado inicial: saludo estático sin scroll container */}
          {isInitialState && (() => {
            const [firstPara, ...rest] = messages[0].content.split('\n\n');
            const restContent = rest.join('\n\n');
            return (
              <div
                className="flex-1 flex flex-col items-center text-center px-8 pt-8 md:pt-16"
                style={{ animation: 'msgIn 400ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
              >
                {/* Primera línea — grande */}
                <p className="text-lg md:text-xl font-semibold leading-snug mb-5" style={{ color: QUIET_LUXURY.textPrimary }}>
                  {firstPara}
                </p>
                {/* Resto — tamaño normal, palabras clave en oro */}
                {restContent && (
                  <div className="text-sm leading-relaxed" style={{ color: QUIET_LUXURY.textSecondary }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        em: ({children}) => <em style={{ fontStyle: 'italic', color: QUIET_LUXURY.gold }}>{children}</em>,
                        p: ({children}) => <p className="mb-3">{children}</p>,
                      }}
                    >
                      {restContent}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 🎨 Quiet Luxury CONTENEDOR: SLIDE + SCROLL (solo con conversación activa) */}
          {!isInitialState && (
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto relative"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: `rgba(255, 255, 255, 0.15) transparent`
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
                transform: `translateY(-${offset}px)`,
                transition: 'none',
                willChange: 'transform',
                paddingTop: `${offset + 20}px`
              }}
            >

              {/* MESSAGES CON REGISTRO PARA CÁLCULOS (saludo inicial excluido) */}
              {messages.filter(m => m.id !== 'initial-greeting' && m.id !== 'initial-greeting-products').map((message) => {

                return (
                  <div
                    key={message.id}
                    ref={registerNode(message.id)}
                    className={`flex message-item ${message.role === 'user' ? 'justify-end' : ''}`}
                    style={{
                      animation: 'msgIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both'
                    }}
                  >
                    <div
                      className={`p-3 md:p-4 text-sm transition-all duration-200 ${
                        message.role === 'user'
                          ? 'max-w-[85%] md:max-w-[75%]'
                          : 'flex-1 overflow-hidden'
                      }`}
                      style={message.role === 'user' ? {
                        background: '#16181D',
                        color: QUIET_LUXURY.textPrimary,
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        borderRadius: 0
                      } : {
                        color: QUIET_LUXURY.textPrimary,
                        borderRadius: 0
                      }}
                    >
                      {/* 🔊 Botón TTS — iconografía pura, sin bordes rígidos */}
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => speakMessage(message.content, message.id)}
                          title={playingId === message.id ? 'Detener' : 'Escuchar respuesta'}
                          disabled={loadingAudioId !== null && loadingAudioId !== message.id}
                          className="group flex items-center gap-1.5 mb-3 transition-all duration-200 hover:scale-105"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '2px 0',
                            cursor: loadingAudioId === message.id ? 'wait' : 'pointer',
                            opacity: loadingAudioId !== null && loadingAudioId !== message.id ? 0.25 : 1,
                          }}
                        >
                          {/* Ícono dinámico */}
                          {loadingAudioId === message.id ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={QUIET_LUXURY.gold} strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.7 }}>
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                                <animateTransform attributeName="transform" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
                              </path>
                            </svg>
                          ) : playingId === message.id ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={QUIET_LUXURY.gold} strokeWidth="2.5" strokeLinecap="round">
                              <rect x="6" y="4" width="4" height="16" fill={QUIET_LUXURY.gold} stroke="none"/>
                              <rect x="14" y="4" width="4" height="16" fill={QUIET_LUXURY.gold} stroke="none"/>
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={QUIET_LUXURY.textMuted} strokeWidth="2" strokeLinecap="round"
                              className="group-hover:stroke-cyan-400 transition-colors duration-200">
                              <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                          )}
                          <span style={{
                            fontSize: '9px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: playingId === message.id ? QUIET_LUXURY.gold : QUIET_LUXURY.textMuted,
                            fontFamily: 'monospace',
                            transition: 'color 200ms',
                          }}
                          className={playingId === message.id ? '' : 'group-hover:text-cyan-400'}
                          >
                            {loadingAudioId === message.id ? '···' : playingId === message.id ? 'Detener' : 'Escuchar'}
                          </span>
                        </button>
                      )}

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({children}) => <strong style={{ fontWeight: 600, color: QUIET_LUXURY.gold }}>{children}</strong>,
                          em: ({children}) => <em style={{ fontStyle: 'italic', color: QUIET_LUXURY.textSecondary }}>{children}</em>,
                          del: ({children}) => <span>{children}</span>,
                          p: ({children}) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1">{children}</ol>,
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
          )} {/* fin !isInitialState */}

          {/* 🎨 Quiet Luxury INPUT */}
          <div
            className={`${isExpanded ? 'p-4 pt-3' : 'p-3'}`}
            style={{ borderTop: `1px solid rgba(255, 255, 255, 0.06)` }}
          >
            <form className="flex items-center" onSubmit={handleSubmit} autoComplete="off">
              <div className="relative flex-1">
                <input
                  type="search"
                  enterKeyHint="send"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="_ Escribe tu consulta..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`w-full pl-4 pr-12 py-3 transition-all duration-200 ${
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

                {/* Acción derecha: mic (vacío) ↔ enviar (con texto) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {inputMessage.trim() ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="transition-all duration-150 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke={QUIET_LUXURY.gold} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (voiceState === 'recording') onStopVoice?.();
                        else if (voiceState === 'idle') onStartVoice?.();
                      }}
                      disabled={voiceState === 'processing' || voiceState === 'speaking'}
                      className="transition-all duration-150 hover:scale-110 disabled:opacity-30"
                      style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer' }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
                        stroke={voiceState === 'recording' ? QUIET_LUXURY.gold : QUIET_LUXURY.textMuted}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        /* Entrada de mensajes — spring easing, igual que iOS/ChatGPT/Gemini */
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Apertura del widget */
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Typing indicator */
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Legado — mantenido por compatibilidad */
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
          background: rgba(255, 255, 255, 0.15);
        }

        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Ocultar botón clear de type="search" en iOS/Safari */
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration {
          display: none;
          -webkit-appearance: none;
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
