// src/app/api/nexus/producer/route.ts
// FASE 1 - PRODUCTOR: Endpoint que solo encola mensajes
// Responsabilidad: Validar + Encolar → Respuesta 202 Accepted inmediata
// NO procesa IA ni guarda datos directamente

import { Kafka } from '@upstash/kafka';
import { nanoid } from 'nanoid';

// Configuración de Upstash Kafka
const kafka = new Kafka({
  url: process.env.UPSTASH_KAFKA_REST_URL!,
  username: process.env.UPSTASH_KAFKA_REST_USERNAME!,
  password: process.env.UPSTASH_KAFKA_REST_PASSWORD!,
});

export const runtime = 'edge';
export const maxDuration = 10; // Solo encolamos, no procesamos

interface ProducerMessage {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  fingerprint?: string;
  sessionId: string;
  metadata?: {
    url?: string;
    timestamp?: string;
    userAgent?: string;
  };
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // Parsear y validar payload
    const payload: ProducerMessage = await req.json();

    console.log('🔵 [PRODUCTOR] Mensaje recibido:', {
      messageCount: payload.messages.length,
      hasFingerprint: !!payload.fingerprint,
      sessionId: payload.sessionId
    });

    // Validación básica
    if (!payload.messages || payload.messages.length === 0) {
      return new Response(JSON.stringify({
        error: 'Messages array is required and cannot be empty'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!payload.sessionId) {
      return new Response(JSON.stringify({
        error: 'sessionId is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Advertencia si falta fingerprint (no bloqueante)
    if (!payload.fingerprint) {
      console.warn('⚠️ [PRODUCTOR] Mensaje sin fingerprint - Datos personales no se asociarán correctamente');
    }

    // Enriquecer metadata
    const enrichedPayload = {
      ...payload,
      metadata: {
        ...payload.metadata,
        enqueuedAt: new Date().toISOString(),
        producerVersion: '1.0.0',
        url: payload.metadata?.url || req.headers.get('referer') || 'unknown',
        userAgent: payload.metadata?.userAgent || req.headers.get('user-agent') || 'unknown'
      }
    };

    // Generar ID único para tracking
    const messageId = nanoid();

    // Encolar mensaje usando Upstash Kafka
    const producer = kafka.producer();
    const kafkaResult = await producer.produce(
      'nexus-prospect-ingestion', // topic name
      enrichedPayload,
      {
        key: messageId, // Use messageId as key for partitioning
      }
    );

    const totalTime = Date.now() - startTime;
    console.log(`✅ [PRODUCTOR] Mensaje encolado en ${totalTime}ms`, {
      messageId,
      kafkaOffset: kafkaResult?.offset,
      kafkaPartition: kafkaResult?.partition,
      fingerprint: payload.fingerprint?.substring(0, 20) || 'none'
    });

    // Respuesta 202 Accepted (procesamiento asíncrono)
    return new Response(JSON.stringify({
      status: 'accepted',
      messageId,
      kafka: {
        offset: kafkaResult?.offset,
        partition: kafkaResult?.partition,
      },
      message: 'Your message has been queued for processing',
      estimatedProcessingTime: '2-5 seconds'
    }), {
      status: 202,
      headers: {
        'Content-Type': 'application/json',
        'X-Message-Id': messageId,
        'X-Processing-Time': `${totalTime}ms`
      }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [PRODUCTOR] Error después de ${totalTime}ms:`, error);

    return new Response(JSON.stringify({
      error: 'Failed to queue message',
      details: error instanceof Error ? error.message : String(error),
      fallback: 'Contact support: +573102066593'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Verificar que las credenciales de Kafka estén configuradas
    const hasKafkaConfig = !!(
      process.env.UPSTASH_KAFKA_REST_URL &&
      process.env.UPSTASH_KAFKA_REST_USERNAME &&
      process.env.UPSTASH_KAFKA_REST_PASSWORD
    );

    if (!hasKafkaConfig) {
      throw new Error('Kafka credentials not configured');
    }

    return new Response(JSON.stringify({
      status: 'healthy',
      version: '2.0.0-producer-kafka',
      role: 'message-producer',
      transport: 'upstash-kafka',
      topic: 'nexus-prospect-ingestion',
      kafkaConfigured: hasKafkaConfig,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      version: '2.0.0-producer-kafka',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
