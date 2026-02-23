/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/components/nexus/useNEXUSChat.ts
// 🎯 SIMPLIFICADO - Sin lógica de scroll (movida al componente)
'use client';
import { useState, useCallback, useEffect } from 'react';

interface Message {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
 isStreaming?: boolean;
}

export const useNEXUSChat = () => {
// 🎯 MENSAJE INICIAL CONTEXTUAL DE NEXUS
const getInitialGreeting = (): Message => {
  // Detectar si estamos en la página de productos
  const isProductsPage = typeof window !== 'undefined' && window.location.pathname.includes('/sistema/productos');

  if (isProductsPage) {
    // Saludo especializado para página de productos (bienestar y salud)
    return {
      id: 'initial-greeting-products',
      role: 'assistant',
      content: `Soy Queswa 🪢

Tu asesor de bienestar en CreaTuActivo.

El Ganoderma lucidum tiene más de 2,000 estudios científicos publicados.

¿Qué te gustaría explorar?

**A)** 🌿 Beneficios de los productos

**B)** 🔬 Estudios científicos

**C)** 💰 Precios y presentaciones

**D)** 📋 Cómo tomar los productos`,
      timestamp: new Date(),
      isStreaming: false
    };
  }

  // Saludo genérico - Ataque al Villano "Plan por Defecto" + Calidez v17.5.0
  return {
    id: 'initial-greeting',
    role: 'assistant',
    content: `Hola, soy Queswa 🪢

La mayoría de personas son rehenes del "Plan por Defecto": trabajar, pagar cuentas, repetir.

Aquí diseñamos tu salida.

¿Cuál es tu situación actual?

**A)** 🏗️ Quiero construir algo propio

**B)** 💭 Me siento estancado y busco un cambio

**C)** 🔍 Solo estoy explorando, sin compromiso

**D)** 🧠 Quiero entender el Modelo de Negocio`,
    timestamp: new Date(),
    isStreaming: false
  };
};

const [messages, setMessages] = useState<Message[]>([getInitialGreeting()]);
const [isLoading, setIsLoading] = useState(false);
const [isStreaming, setIsStreaming] = useState(false);
const [progressiveReplies, setProgressiveReplies] = useState<string[]>([]);
const [streamingComplete, setStreamingComplete] = useState(false);

const generateId = () => Math.random().toString(36).substring(7);

const parseQuickReplies = (content: string) => {
  console.log('🔧 parseQuickReplies DESACTIVADO - usando solo formato texto A, B, C');
  setProgressiveReplies([]);
  return [];
};

const cleanMessageContent = (content: string) => {
  return content
    .replace(/QUICK REPLIES:/gi, '')
    .replace(/🏭 ".*?"|⚡ ".*?"|💡 ".*?"|■ ".*?"/g, '')
    .trim();
};

const sendMessage = useCallback(async (content: string) => {
  // Agregar mensaje del usuario
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date(),
  };

  // ✅ APPEND: Agregar al FINAL (orden cronológico: antiguo→nuevo)
  setMessages(prev => [...prev, userMessage]);

  // Preparar respuesta en streaming
  setIsLoading(true);
  setIsStreaming(true);
  setStreamingComplete(false);
  setProgressiveReplies([]);

  // Crear mensaje asistente vacío
  const assistantMessageId = generateId();
  const initialAssistantMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    isStreaming: true
  };

  // Agregar mensaje asistente vacío después de delay (APPEND)
  setTimeout(() => {
    setMessages(prev => [...prev, initialAssistantMessage]);
  }, 200);

  try {
    const controller = new AbortController();
    // ✅ FIX: Aumentar timeout de 30s → 60s para respuestas largas (lista de precios)
    // (debe ser mayor que max_duration de la API route edge que es 30s)
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // ========================================
    // FIX: Race Condition - Esperar fingerprint
    // ========================================
    const waitForFingerprint = async (maxWait = 5000): Promise<string | undefined> => {
      const start = Date.now();

      // Intentar obtener fingerprint cada 100ms durante máximo 5 segundos
      while (Date.now() - start < maxWait) {
        const fp = (window as any).FrameworkIAA?.fingerprint;
        if (fp) {
          console.log('✅ [NEXUS Widget] Fingerprint obtenido:', fp.substring(0, 20) + '...');
          return fp;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Fallback a localStorage si no se inicializó FrameworkIAA
      const stored = localStorage.getItem('nexus_fingerprint');
      if (stored) {
        console.log('⚠️ [NEXUS Widget] Fingerprint desde localStorage (fallback)');
        return stored;
      }

      console.error('❌ [NEXUS Widget] CRÍTICO: No se pudo obtener fingerprint después de', maxWait, 'ms');
      return undefined;
    };

    // ✅ ESPERAR fingerprint antes de hacer la petición
    const fingerprint = await waitForFingerprint();
    const sessionId = (window as any).nexusProspect?.id || `session_${Date.now()}`;

    if (!fingerprint) {
      console.error('❌ [NEXUS Widget] Enviando mensaje SIN fingerprint - Los datos NO se guardarán');
    }

    // 🔑 EXTRAER constructor_id usando FrameworkIAA (captura de URL path, query param y localStorage)
    let constructorId: string | null = null;
    if (typeof window !== 'undefined') {
      // FrameworkIAA ya captura el ref de múltiples fuentes y lo persiste
      constructorId = (window as any).FrameworkIAA?.constructorRef || null;

      // Fallback: extraer directamente del URL path si FrameworkIAA no está listo
      if (!constructorId) {
        const pathname = window.location.pathname;
        const match = pathname.match(/\/fundadores\/([a-z0-9-]+)/);
        if (match) {
          constructorId = match[1];
        }
      }

      if (constructorId) {
        console.log(`✅ [NEXUS Widget] Constructor detectado: ${constructorId}`);
      }
    }

    // 🆕 Verificar si el usuario ya tuvo su primer saludo
    const hasSeenGreeting = localStorage.getItem('nexus_first_greeting_shown') === 'true';

    // 🎯 CONTEXTO DE PÁGINA: Detectar si estamos en catálogo de productos
    const pageContext = typeof window !== 'undefined' && window.location.pathname.includes('/sistema/productos')
      ? 'catalogo_productos'  // Modo asesor de salud/bienestar
      : 'default';            // Modo asesor de negocio

    console.log('🔍 [NEXUS] Estado de usuario:', {
      hasSeenGreeting,
      isFirstMessageOfConversation: messages.length === 0,
      pageContext
    });

    const response = await fetch('/api/nexus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ Orden cronológico natural (antiguo→nuevo)
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        fingerprint: fingerprint,
        sessionId: sessionId,
        constructorId: constructorId,  // ✅ Pasar constructor_id para tracking
        isReturningUser: hasSeenGreeting,  // 🆕 Enviar si ya vio el saludo completo
        pageContext: pageContext  // 🎯 Contexto de página para ajustar comportamiento
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error del servidor');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('text/plain') || contentType?.includes('text/stream')) {
      // 🎯 STREAMING SIMPLE - Sin triggers de scroll
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo leer la respuesta streaming');
      }

      let accumulatedContent = '';
      let lastUpdateTime = Date.now();
      const minUpdateInterval = 50;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Control de velocidad de streaming
        const now = Date.now();
        if (now - lastUpdateTime >= minUpdateInterval) {
          const cleanContent = cleanMessageContent(accumulatedContent);

          // 🎯 SOLO UPDATE CONTENT - Scroll automático lo maneja el componente
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: cleanContent,
                    isStreaming: true
                  }
                : msg
            )
          );

          lastUpdateTime = now;
        }
      }

      // 🎯 FINALIZAR STREAMING
      const finalCleanContent = cleanMessageContent(accumulatedContent);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: finalCleanContent,
                isStreaming: false
              }
            : msg
        )
      );

      setStreamingComplete(true);

      // 🆕 Marcar que el usuario ya vio el primer saludo (si es el primer mensaje)
      if (messages.length === 0 && !hasSeenGreeting) {
        localStorage.setItem('nexus_first_greeting_shown', 'true');
        localStorage.setItem('nexus_first_greeting_timestamp', Date.now().toString());
        console.log('✅ [NEXUS] Primer saludo mostrado, marcado en localStorage');
      }

    } else {
      // 🎯 MANEJAR RESPUESTA JSON
      const data = await response.json();

      if (data.error) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: data.error,
                  isStreaming: false
                }
              : msg
          )
        );
      } else if (data.response) {
        const cleanContent = cleanMessageContent(data.response);

        // 🎯 SIMULAR STREAMING SIMPLE
        let currentIndex = 0;
        const fullText = cleanContent;
        const streamInterval = setInterval(() => {
          currentIndex += Math.floor(Math.random() * 5) + 1;

          if (currentIndex >= fullText.length) {
            clearInterval(streamInterval);
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: fullText,
                      isStreaming: false
                    }
                  : msg
              )
            );
            setStreamingComplete(true);

            // 🆕 Marcar que el usuario ya vio el primer saludo (si es el primer mensaje)
            if (messages.length === 0 && !hasSeenGreeting) {
              localStorage.setItem('nexus_first_greeting_shown', 'true');
              localStorage.setItem('nexus_first_greeting_timestamp', Date.now().toString());
              console.log('✅ [NEXUS] Primer saludo mostrado, marcado en localStorage');
            }
          } else {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: fullText.substring(0, currentIndex),
                      isStreaming: true
                    }
                  : msg
              )
            );
          }
        }, 50);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    }

  } catch (error: any) {
    console.error('Error sending message:', error);

    let errorMessage = '';

    if (error.name === 'AbortError') {
      errorMessage = `Parece que estoy tardando más de lo esperado en responder. Esto puede pasar cuando hay mucho tráfico.

¿Te gustaría intentar de nuevo o prefieres hablar directamente con **Liliana Moreno**?

Ella es nuestra Estratega Senior y puede resolver tu consulta de inmediato:
→ [WhatsApp](https://wa.me/573102066593)
→ Horario: 8:00 AM - 8:00 PM (Colombia)`;

    } else if (error.message?.includes('500') || error.message?.includes('servidor')) {
      errorMessage = error.message;

    } else if (error.message?.includes('fetch')) {
      errorMessage = `Parece que perdimos la conexión por un momento.

Mientras tanto, te comparto los puntos de entrada disponibles:
• **Inicial:** $200 USD (~$900K COP) - Acceso completo
• **Empresarial:** $500 USD (~$2.25M COP) - El más popular
• **Visionario:** $1,000 USD (~$4.5M COP) - Máxima rentabilidad

¿Quieres que lo intentemos de nuevo o prefieres hablar con **Liliana**?
→ [WhatsApp](https://wa.me/573102066593)`;

    } else {
      errorMessage = `Estoy teniendo dificultades técnicas en este momento.

La buena noticia: puedes hablar directamente con **Liliana Moreno**, nuestra Estratega Senior. Ella puede resolver cualquier duda sobre el modelo de negocio.

→ [Hablar con Liliana](https://wa.me/573102066593)

¿O prefieres que intentemos de nuevo en unos segundos?`;
    }

    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMessageId
          ? {
              ...msg,
              content: errorMessage,
              isStreaming: false
            }
          : msg
      )
    );

  } finally {
    setIsLoading(false);
    setIsStreaming(false);
  }
 }, [messages]);

const resetChat = useCallback(() => {
  // 🔄 Restaurar mensaje inicial CONTEXTUAL de NEXUS
  setMessages([getInitialGreeting()]);
  setIsLoading(false);
  setIsStreaming(false);
  setProgressiveReplies([]);
  setStreamingComplete(false);

  // ✅ Limpiar solo flags de UI (el consentimiento persiste en BD)
  localStorage.removeItem('nexus_first_greeting_shown');
  localStorage.removeItem('nexus_first_greeting_timestamp');
  // Nota: NO limpiamos nexus_fingerprint (identificación del dispositivo debe persistir)

  console.log('✅ [NEXUS] Chat reseteado - Mensaje inicial contextual restaurado, consentimiento persiste en BD');
 }, []);

const handleQuickReply = useCallback((reply: string) => {
  console.log('🎯 Enviando quick reply:', reply);
  sendMessage(reply);
}, [sendMessage]);

const contactLiliana = useCallback(() => {
  const contactMessage: Message = {
    id: generateId(),
    role: 'assistant',
    content: `🏗️ **Consultoría Estratégica Disponible**

**Liliana Moreno - Arquitecta Senior**
**WhatsApp:** +573102066593
**Horario:** 8:00 AM - 8:00 PM (GMT-5)
**Experiencia:** 9 años consecutivos líder en arquitectura de activos

**Especialidades de la consultoría:**
• Diseño completo de la arquitectura personalizada para tu perfil
• Análisis de cuál punto de entrada optimiza tu situación específica
• Implementación paso a paso del método probado
• Mentoring estratégico para construcción de activo patrimonial

**Tu consultoría estratégica incluye:**
✓ Evaluación de tu situación actual y objetivos
✓ Diseño de arquitectura personalizada Motor+Plano+Maquinaria
✓ Plan de implementación con cronograma específico
✓ Soporte continuo durante la construcción de tu activo

**¿Te gustaría que prepare algunos puntos estratégicos antes de tu consultoría?**`,
    timestamp: new Date(),
    isStreaming: false
  };

  setMessages(prev => [...prev, contactMessage]);
}, []);

// 🚫 SALUDO AUTOMÁTICO ELIMINADO (23 Nov 2025)
// Ya no enviamos "Hola" automáticamente. NEXUS responde directamente cuando el usuario escribe.

return {
  messages,
  isLoading,
  isStreaming,
  streamingComplete,
  progressiveReplies,
  sendMessage,
  resetChat,
  handleQuickReply,
  contactLiliana
 };
};
