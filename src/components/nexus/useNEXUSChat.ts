// src/components/nexus/useNEXUSChat.ts
// 🔧 FIX APLICADO: Integración con tracking.js para envío de fingerprint a NEXUS API
'use client';
import { useState, useCallback } from 'react';

interface Message {
 id: string;
 role: 'user' | 'assistant';
 content: string;
 timestamp: Date;
}

export const useNEXUSChat = () => {
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isStreaming, setIsStreaming] = useState(false);
const [progressiveReplies, setProgressiveReplies] = useState<string[]>([]);
const [streamingComplete, setStreamingComplete] = useState(false);

const generateId = () => Math.random().toString(36).substring(7);

// Función para parsear quick replies del contenido
const parseQuickReplies = (content: string) => {
  const quickRepliesRegex = /🏭 "(.*?)"|⚡ "(.*?)"|🎯 "(.*?)"|■ "(.*?)"/g;
  const replies: string[] = [];
  let match;

  while ((match = quickRepliesRegex.exec(content)) !== null) {
    const reply = match[1] || match[2] || match[3] || match[4];
    if (reply) {
      replies.push(reply);
    }
  }

  setProgressiveReplies(replies.slice(0, 3)); // Máximo 3 quick replies
};

// Función para limpiar contenido de elementos técnicos
const cleanMessageContent = (content: string) => {
  return content
    .replace(/QUICK REPLIES:/gi, '')
    .replace(/🏭 ".*?"|⚡ ".*?"|🎯 ".*?"|■ ".*?"/g, '')
    .trim();
};

const sendMessage = useCallback(async (content: string) => {
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);
  setIsStreaming(true);
  setStreamingComplete(false);
  setProgressiveReplies([]); // Limpiar quick replies anteriores

  // Crear mensaje asistente temporal para streaming
  const assistantMessageId = generateId();
  const initialAssistantMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, initialAssistantMessage]);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout

    // 🔧 FIX CRÍTICO: Obtener datos del tracking.js para NEXUS API
    // ✅ CORREGIDO: Casting de window para TypeScript
    const fingerprint = (window as any).FrameworkIAA?.fingerprint || localStorage.getItem('nexus_fingerprint') || undefined;
    const sessionId = (window as any).nexusProspect?.id || `session_${Date.now()}`;

    // 🔍 DEBUG: Log para verificar datos del tracking
    console.log('🔧 NEXUS Frontend - Enviando datos:', {
      fingerprint: fingerprint ? fingerprint.substring(0, 16) + '...' : 'undefined',
      sessionId: sessionId,
      // ✅ CORREGIDO: Casting de window para TypeScript
      hasFrameworkIAA: !!(window as any).FrameworkIAA,
      hasNexusProspect: !!(window as any).nexusProspect
    });

    const response = await fetch('/api/nexus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        // 🔧 CRÍTICO: Incluir datos del tracking para Framework IAA
        fingerprint: fingerprint,
        sessionId: sessionId
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Manejar errores HTTP
      if (response.status === 500) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error del servidor');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Verificar si la respuesta es streaming o JSON
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('text/plain') || contentType?.includes('text/stream')) {
      // Manejar streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo leer la respuesta streaming');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Actualizar mensaje en tiempo real con contenido limpio
        const cleanContent = cleanMessageContent(accumulatedContent);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: cleanContent }
              : msg
          )
        );
      }

      // Parsear quick replies del contenido final
      parseQuickReplies(accumulatedContent);
      setStreamingComplete(true);

    } else {
      // Manejar respuesta JSON (fallback o error)
      const data = await response.json();

      if (data.error) {
        // Error con mensaje formateado
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: data.error }
              : msg
          )
        );
      } else if (data.response) {
        // Respuesta normal JSON
        const cleanContent = cleanMessageContent(data.response);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: cleanContent }
              : msg
          )
        );
        parseQuickReplies(data.response);
        setStreamingComplete(true);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    }

  } catch (error: any) {
    console.error('Error sending message:', error);

    let errorMessage = '';

    if (error.name === 'AbortError') {
      errorMessage = `⏱️ La respuesta está tomando más tiempo del esperado.

**Contacto directo disponible:**
Liliana Moreno - Consultora Senior
WhatsApp: +573102066593
Horario: 8:00 AM - 8:00 PM (GMT-5)

¿Hay algo específico sobre CreaTuActivo.com que pueda ayudarte mientras tanto?`;

    } else if (error.message?.includes('500') || error.message?.includes('servidor')) {
      errorMessage = error.message; // Ya viene formateado del servidor

    } else if (error.message?.includes('fetch')) {
      errorMessage = `🔧 Problema de conexión temporalmente.

**Información básica disponible:**
• **EMPRENDEDOR:** $200 USD - Acceso completo al ecosistema
• **EMPRESARIAL:** $500 USD - Más popular, inventario sólido
• **VISIONARIO:** $1,000 USD - Premium con consultoría VIP

**Contacto:** Liliana Moreno +573102066593`;

    } else {
      errorMessage = `🤖 Estoy experimentando dificultades técnicas.

**Opciones mientras resolvemos:**
1. **Arquitectura** - Cómo funciona el ecosistema Motor+Plano+Maquinaria
2. **Paquetes** - EMPRENDEDOR, EMPRESARIAL, VISIONARIO
3. **Contacto directo** - Liliana Moreno +573102066593

¿Qué te interesa más saber?`;
    }

    // Actualizar mensaje con error formateado
    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: errorMessage }
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

// Funciones auxiliares para quick replies
const handleQuickReply = useCallback((reply: string) => {
  sendMessage(reply);
}, [sendMessage]);

const contactLiliana = useCallback(() => {
  const contactMessage: Message = {
    id: generateId(),
    role: 'assistant',
    content: `📞 **Contacto Directo - Liliana Moreno**

**WhatsApp:** +573102066593
**Horario:** 8:00 AM - 8:00 PM (GMT-5)
**Experiencia:** 9 años consecutivos líder
**Especialidad:** Consultoría estratégica CreaTuActivo.com

Liliana puede ayudarte con:
• La arquitectura completa del ecosistema
• Cuál paquete fundador es mejor para tu situación
• El proceso paso a paso personalizado
• Responder todas tus preguntas específicas

**¿Prefieres que te prepare algunas preguntas clave antes de contactarla?**`,
    timestamp: new Date(),
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
  contactLiliana,
 };
};
