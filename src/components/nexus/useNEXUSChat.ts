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
// Palabras que NO son nombres propios — se capturan por el regex "soy X" pero son profesiones/arquetipos
const NOMBRE_BLACKLIST = /^(empleado|independiente|gerente|director|ejecutivo|médico|doctor|abogado|ingeniero|contador|consultor|freelance|emprendedor|empresario|dueño|dueno|pensionado|jubilado|estudiante|otro|ninguno|nada|hola|ok|sí|no|si)$/i;

const isValidName = (name: string | null): boolean => {
  if (!name) return false;
  if (NOMBRE_BLACKLIST.test(name.trim())) return false;
  // Nombre válido: al menos 2 chars y empieza con letra
  return name.trim().length >= 2 && /^[A-ZÀ-ÿa-z]/i.test(name.trim());
};

const getInitialGreeting = (): Message => {
  const isProductsPage = typeof window !== 'undefined' && window.location.pathname.includes('/sistema/productos');
  const rawSavedName = typeof window !== 'undefined' ? localStorage.getItem('nexus_prospect_name') : null;
  const savedName = isValidName(rawSavedName) ? rawSavedName : null;
  const greeting = savedName ? `Hola, ${savedName}` : 'Hola';

  if (isProductsPage) {
    return {
      id: 'initial-greeting-products',
      role: 'assistant',
      content: `${greeting} 🪢

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
      isStreaming: false
    };
  }

  // Usuario que regresa — saludo personalizado sin repetir el pitch
  if (savedName) {
    return {
      id: 'initial-greeting',
      role: 'assistant',
      content: `Hola, ${savedName} 🪢

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
      isStreaming: false
    };
  }

  // Primera visita — texto Premium Accesible v22.0
  return {
    id: 'initial-greeting',
    role: 'assistant',
    content: `Hola. Soy Queswa 🪢, el Motor Cognitivo de CreaTuActivo.com.

Entendemos que tu tiempo es escaso y valioso. Nuestro propósito es explicarte cómo profesionales y comerciantes estructuran un **Patrimonio Paralelo** — una fuente de ingresos adicional diseñada para no interferir con tu empleo o negocio actual.

Selecciona abajo qué aspecto te gustaría evaluar primero:`,
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

      // Persistir nombre para saludo personalizado en visitas futuras
      if (!localStorage.getItem('nexus_prospect_name')) {
        // Patrón 1: frases explícitas de presentación
        const explicitMatch = userMessage.content.match(
          /(?:me llamo|mi nombre es|puedes llamarme|me puedes llamar|soy)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)/i
        );
        if (explicitMatch && isValidName(explicitMatch[1])) {
          localStorage.setItem('nexus_prospect_name', explicitMatch[1]);
        } else {
          // Patrón 2: respuesta contextual — el bot preguntó el nombre y el usuario respondió con 1-3 palabras
          const lastBotMsg = [...messages].reverse().find(m => m.role === 'assistant');
          const botAskedName = /nombre|llamarte|cómo te llamas|cómo puedo llamar|¿y tú\?/i.test(lastBotMsg?.content ?? '');
          const looksLikeName = /^[A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+){0,2}$/.test(userMessage.content.trim());
          if (botAskedName && looksLikeName && isValidName(userMessage.content.trim())) {
            localStorage.setItem('nexus_prospect_name', userMessage.content.trim());
          }
        }
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

¿Te gustaría intentar de nuevo o prefieres escribirnos directamente?

→ [WhatsApp](https://wa.me/573215193909)`;

    } else if (error.message?.includes('500') || error.message?.includes('servidor')) {
      errorMessage = error.message;

    } else if (error.message?.includes('fetch')) {
      errorMessage = `Parece que perdimos la conexión por un momento.

Puedes escribirnos directamente y con gusto te atendemos:
→ [WhatsApp](https://wa.me/573215193909)

¿O prefieres que lo intentemos de nuevo?`;

    } else {
      errorMessage = `Estoy teniendo dificultades técnicas en este momento.

Puedes escribirnos directamente por WhatsApp y te atendemos de inmediato:
→ [WhatsApp](https://wa.me/573215193909)

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
    content: `📲 **Contacto Directo**

Escríbenos por WhatsApp y nuestro equipo te atiende personalmente:

→ [WhatsApp](https://wa.me/573215193909)

**¿Te gustaría que prepare algunos puntos antes de esa conversación?**`,
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
