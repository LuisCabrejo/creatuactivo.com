/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/app/api/nexus/producer/route.ts
// ARQUITECTURA SIMPLIFICADA: DB Queue en lugar de Kafka
// Responsabilidad: Validar + Encolar en Supabase → Trigger invoca procesamiento
// Ventajas: Gratis, simple, latencia <2s, idempotencia nativa

import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// ✅ FIX: Lazy initialization de Supabase client para build-time
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
}

// Edge runtime compatible (no necesitamos Node.js)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

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
    const metadata = {
      ...payload.metadata,
      enqueuedAt: new Date().toISOString(),
      producerVersion: '2.0.0-db-queue',
      url: payload.metadata?.url || req.headers.get('referer') || 'unknown',
      userAgent: payload.metadata?.userAgent || req.headers.get('user-agent') || 'unknown'
    };

    // Generar ID único para tracking
    const messageId = nanoid();

    // Encolar mensaje en Supabase (idempotente por session_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: queueId, error: enqueueError } = await (getSupabaseClient().rpc as any)('enqueue_nexus_message', {
      p_messages: payload.messages,
      p_session_id: payload.sessionId,
      p_fingerprint: payload.fingerprint || null,
      p_metadata: metadata
    });

    if (enqueueError) {
      console.error('❌ [PRODUCTOR] Error encolando mensaje:', enqueueError);
      throw new Error(`Failed to enqueue: ${enqueueError.message}`);
    }

    const totalTime = Date.now() - startTime;
    console.log(`✅ [PRODUCTOR] Mensaje encolado en ${totalTime}ms`, {
      messageId,
      queueId,
      fingerprint: payload.fingerprint?.substring(0, 20) || 'none'
    });

    // Respuesta 202 Accepted (procesamiento asíncrono vía DB trigger)
    return new Response(JSON.stringify({
      status: 'accepted',
      messageId,
      queueId,
      message: 'Your message has been queued for processing',
      estimatedProcessingTime: '<2 seconds'
    }), {
      status: 202,
      headers: {
        'Content-Type': 'application/json',
        'X-Message-Id': messageId,
        'X-Queue-Id': queueId,
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

// Health check endpoint (lightweight - no actual queue insertion)
export async function GET() {
  try {
    // Verificar configuración de Supabase
    const hasSupabaseConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (!hasSupabaseConfig) {
      throw new Error('Supabase credentials not configured');
    }

    // Verificar conexión a Supabase sin insertar en la queue
    const { error } = await getSupabaseClient()
      .from('nexus_queue')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    return new Response(JSON.stringify({
      status: 'healthy',
      version: '2.0.0-db-queue',
      role: 'message-producer',
      transport: 'supabase-database-queue',
      supabaseConfigured: hasSupabaseConfig,
      connectionTestPassed: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      version: '2.0.0-db-queue',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
