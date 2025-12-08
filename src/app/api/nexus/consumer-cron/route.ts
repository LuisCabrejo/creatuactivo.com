/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/app/api/nexus/consumer-cron/route.ts
// ⚠️ DEPRECATED: Este endpoint usaba Kafka y ha sido reemplazado por DB Queue
// La nueva arquitectura usa:
// - Producer: /api/nexus/producer (encola en Supabase)
// - Consumer: Supabase Edge Function (nexus-queue-processor) activada por DB trigger
// Ver: DEPLOYMENT_DB_QUEUE.md para detalles

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    status: 'deprecated',
    message: 'This Kafka consumer endpoint has been deprecated. The system now uses Supabase DB Queue with Edge Functions.',
    documentation: 'See DEPLOYMENT_DB_QUEUE.md for the new architecture',
    newProducerEndpoint: '/api/nexus/producer',
    timestamp: new Date().toISOString()
  }), {
    status: 410, // Gone
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST() {
  return new Response(JSON.stringify({
    status: 'deprecated',
    message: 'This Kafka consumer endpoint has been deprecated. Use /api/nexus/producer instead.',
    newEndpoint: '/api/nexus/producer'
  }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  });
}
