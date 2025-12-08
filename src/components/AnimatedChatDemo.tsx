/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * AnimatedChatDemo - Simulación animada de conversación NEXUS
 * Crea efecto "WOW" mostrando la IA en acción
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  delay: number; // ms antes de mostrar este mensaje
}

interface AnimatedChatDemoProps {
  conversation?: Message[];
  userName?: string;
  loopDelay?: number; // ms antes de reiniciar
  typingSpeed?: number; // ms por caracter
}

// Conversación estratégica basada en arsenal_inicial
const defaultConversation: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hola María, veo que te interesa construir un activo digital. ¿Cuentas con 5-7 horas semanales?',
    delay: 1000,
  },
  {
    id: 2,
    role: 'user',
    content: 'Sí, tengo el tiempo. Pero ¿qué es exactamente CreaTuActivo?',
    delay: 2000,
  },
  {
    id: 3,
    role: 'assistant',
    content: 'Es tu aplicación para construir tu propio sistema de Distribución Masiva de productos Gano Excel a nivel América. No te ofrecemos un empleo, te ofrecemos ser SOCIA de este proyecto.',
    delay: 1800,
  },
  {
    id: 4,
    role: 'user',
    content: '¿Cuánto cuesta empezar?',
    delay: 2200,
  },
  {
    id: 5,
    role: 'assistant',
    content: 'La tecnología es $0 USD. Tu única inversión es tu inventario inicial: desde $200 USD el paquete Inicial hasta $1,000 USD el Visionario. No es inscripción, es capital de trabajo en productos reales.',
    delay: 1800,
  },
  {
    id: 6,
    role: 'user',
    content: 'Interesante. Pero no sé vender...',
    delay: 2500,
  },
  {
    id: 7,
    role: 'assistant',
    content: 'No buscamos vendedores, buscamos conectores. Yo me encargo de explicar el negocio 24/7. Tú solo invitas, yo hago el trabajo pesado. ¿Te hace sentido?',
    delay: 1800,
  },
  {
    id: 8,
    role: 'user',
    content: '¿Y cuándo empiezo a ver resultados?',
    delay: 2000,
  },
  {
    id: 9,
    role: 'assistant',
    content: 'Con 5-7 horas semanales: Mes 1 primeros ingresos, 6 meses ingresos consistentes, Año 1 el sistema crece solo. No es dinero rápido, es construcción acelerada por tecnología.',
    delay: 1800,
  },
  {
    id: 10,
    role: 'user',
    content: 'Me interesa saber más.',
    delay: 2000,
  },
  {
    id: 11,
    role: 'assistant',
    content: '¡Excelente María! Te agendo una llamada con Liliana Moreno, Diamante de Gano Excel, para resolver todas tus dudas personalmente.',
    delay: 1500,
  },
];

// Componente de indicador de escritura
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center gap-1 px-4 py-2"
  >
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-purple-400 rounded-full"
          animate={{
            y: [0, -6, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
    <span className="text-xs text-slate-500 ml-2">NEXUS está escribiendo...</span>
  </motion.div>
);

// Componente de mensaje con efecto typewriter
const TypewriterMessage = ({
  content,
  isUser,
  typingSpeed = 30,
  onComplete,
}: {
  content: string;
  isUser: boolean;
  typingSpeed?: number;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isUser) {
      // Para mensajes de usuario, mostrar todo de una vez con pequeño delay
      const timer = setTimeout(() => {
        setDisplayedText(content);
        setIsComplete(true);
        onComplete?.();
      }, 300);
      return () => clearTimeout(timer);
    }

    // Para NEXUS, efecto typewriter
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [content, isUser, typingSpeed, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-xl max-w-[85%] ${
        isUser
          ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 rounded-tr-none ml-auto text-blue-100'
          : 'bg-slate-800 rounded-tl-none text-slate-300'
      }`}
    >
      {!isUser && (
        <span className="text-purple-400 font-bold text-xs block mb-1">NEXUS:</span>
      )}
      <span className="text-sm leading-relaxed">
        {displayedText}
        {!isComplete && !isUser && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle"
          />
        )}
      </span>
    </motion.div>
  );
};

export default function AnimatedChatDemo({
  conversation = defaultConversation,
  userName = 'Juan',
  loopDelay = 4000,
  typingSpeed = 25,
}: AnimatedChatDemoProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  // Lógica de animación
  useEffect(() => {
    if (!isAnimating) return;

    if (currentIndex >= conversation.length) {
      // Fin de la conversación, esperar y reiniciar
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
        setIsTyping(false);
      }, loopDelay);
      return () => clearTimeout(resetTimer);
    }

    const currentMessage = conversation[currentIndex];

    // Mostrar typing indicator antes de mensaje de NEXUS
    if (currentMessage.role === 'assistant' && currentIndex > 0) {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => [...prev, currentMessage]);
      }, 1200);
      return () => clearTimeout(typingTimer);
    }

    // Para primer mensaje o mensajes de usuario
    const showTimer = setTimeout(() => {
      setVisibleMessages((prev) => [...prev, currentMessage]);
    }, currentMessage.delay);

    return () => clearTimeout(showTimer);
  }, [currentIndex, conversation, isAnimating, loopDelay]);

  // Avanzar al siguiente mensaje cuando se complete el actual
  const handleMessageComplete = () => {
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, conversation[currentIndex]?.delay || 1000);
  };

  return (
    <div className="creatuactivo-component-card p-4 rounded-3xl border border-slate-700 shadow-2xl max-w-sm mx-auto">
      <div className="bg-slate-900 rounded-2xl overflow-hidden h-[580px] flex flex-col relative">
        {/* Header */}
        <div className="bg-slate-800 p-4 flex items-center gap-3 border-b border-slate-700">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            {/* Pulso verde */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">NEXUS AI</p>
            <p className="text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              En línea
            </p>
          </div>
          {/* Badge de demo */}
          <div className="ml-auto">
            <span className="text-[9px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold uppercase tracking-wider">
              Demo en vivo
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={chatRef}
          className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700"
        >
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((message, index) => (
              <TypewriterMessage
                key={message.id}
                content={message.content}
                isUser={message.role === 'user'}
                typingSpeed={typingSpeed}
                onComplete={index === visibleMessages.length - 1 ? handleMessageComplete : undefined}
              />
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          {/* Mensaje final de acción */}
          <AnimatePresence>
            {currentIndex >= conversation.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  ✓ Cita agendada con mentor Diamante
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Mockup */}
        <div className="p-3 bg-slate-800 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-9 bg-slate-700/50 rounded-full px-4 flex items-center">
              <span className="text-slate-500 text-xs">Escribe un mensaje...</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 text-white rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/20 rounded-2xl" />
      </div>
    </div>
  );
}
