// src/components/nexus/useNEXUSChat.ts
// 🎯 SIMPLIFICADO - Sin lógica de scroll (movida al componente)
'use client';
import { useState, useCallback } from 'react';

interface Message {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
 isStreaming?: boolean;
}

export const useNEXUSChat = () => {
const [messages, setMessages] = useState<Message[]>([]);
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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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
        sessionId: sessionId
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
      errorMessage = `⏱️ La arquitectura está procesando tu consulta más tiempo del esperado.

**Consultoría estratégica inmediata:**
Liliana Moreno - Arquitecta Senior
WhatsApp: +573102066593
Horario: 8:00 AM - 8:00 PM (GMT-5)

¿Hay algo específico sobre la arquitectura de CreaTuActivo.com que pueda ayudarte mientras tanto?`;

    } else if (error.message?.includes('500') || error.message?.includes('servidor')) {
      errorMessage = error.message;

    } else if (error.message?.includes('fetch')) {
      errorMessage = `🔧 Conexión temporalmente interrumpida.

**Información básica de la arquitectura:**
• **PUNTO DE ENTRADA FUNDADOR:** $200 USD - Acceso completo al ecosistema
• **PUNTO DE ENTRADA EMPRESARIAL:** $500 USD - Más popular, inventario sólido
• **PUNTO DE ENTRADA VISIONARIO:** $1,000 USD - Premium con consultoría VIP

**Consultoría:** Liliana Moreno +573102066593`;

    } else {
      errorMessage = `🤖 Estoy experimentando dificultades en mi arquitectura de procesamiento.

**Opciones mientras optimizamos:**
1. **El Motor de Valor** - Los productos únicos con patente mundial
2. **El Plano Estratégico** - Framework IAA y metodología
3. **La Maquinaria Tecnológica** - NodeX y automatización
4. **Consultoría Estratégica** - Liliana Moreno +573102066593

¿Qué pieza de la arquitectura te interesa más?`;
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
  setMessages([]);
  setIsLoading(false);
  setIsStreaming(false);
  setProgressiveReplies([]);
  setStreamingComplete(false);
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
• Implementación paso a paso del Framework IAA
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
