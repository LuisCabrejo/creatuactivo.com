// supabase/functions/nexus-consumer/index.ts
// FASE 1 - CONSUMIDOR: Edge Function que procesa mensajes de Confluent Kafka
// Responsabilidad: Consume mensaje → Procesar con Claude → Guardar datos → Commit offset

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Kafka } from 'npm:kafkajs@2.2.4';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CONFLUENT_BOOTSTRAP_SERVER = Deno.env.get('CONFLUENT_BOOTSTRAP_SERVER')!;
const CONFLUENT_API_KEY = Deno.env.get('CONFLUENT_API_KEY')!;
const CONFLUENT_API_SECRET = Deno.env.get('CONFLUENT_API_SECRET')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuración de Confluent Cloud Kafka
const kafka = new Kafka({
  clientId: 'nexus-consumer',
  brokers: [CONFLUENT_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256', // Confluent Cloud requiere SCRAM-SHA-256
    username: CONFLUENT_API_KEY,
    password: CONFLUENT_API_SECRET,
  },
});

// NO usar singleton - crear nueva instancia en cada invocación
// para evitar EarlyDrop del runtime de Supabase

interface QueueMessage {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  fingerprint?: string;
  sessionId: string;
  metadata?: {
    enqueuedAt?: string;
    url?: string;
    userAgent?: string;
  };
}

interface ProspectData {
  nombre?: string;
  email?: string;
  telefono?: string;
  ocupacion?: string;
  nivel_interes?: number;
  objeciones?: string[];
  arquetipo?: string;
  momento_optimo?: string;
}

// Prompt optimizado para extracción estructurada (Fase 1 - Acción 3.1)
const EXTRACTION_PROMPT = `Eres un asistente experto en extracción de datos de conversaciones de ventas.

Tu tarea es analizar el historial de chat y extraer información estructurada del prospecto.

<schema>
{
  "nombre": "string | null",
  "email": "string | null",
  "telefono": "string | null",
  "ocupacion": "string | null",
  "nivel_interes": "number (0-10)",
  "objeciones": "string[] (price, time, trust, mlm)",
  "arquetipo": "string | null (emprendedor_dueno_negocio, profesional_vision, lider_hogar, joven_ambicion, independiente_freelancer, lider_comunidad)",
  "momento_optimo": "string (caliente, tibio, frio)"
}
</schema>

<rules>
1. Extrae SOLO información explícita. No inventes datos.
2. Nivel de interés:
   - +2 si comparte nombre
   - +3 si comparte teléfono
   - +1.5 si comparte email
   - +2 si menciona "quiero", "empezar", "inversión"
   - -3 si dice "no me interesa"
3. Momento óptimo:
   - "caliente" si nivel_interes >= 7
   - "tibio" si nivel_interes >= 4
   - "frio" si nivel_interes < 4
4. Detecta objeciones comunes (precio, tiempo, confianza, mlm)
5. Identifica arquetipo por palabras clave (empresa, negocio, trabajo, familia, estudiante)
</rules>

<example>
<conversation>
User: "Hola, me llamo Carlos y trabajo en una empresa de software"
Assistant: "Hola Carlos, ¿qué te trae por aquí?"
User: "Quiero saber sobre las oportunidades de inversión"
</conversation>

<output>
{
  "nombre": "Carlos",
  "email": null,
  "telefono": null,
  "ocupacion": "empresa de software",
  "nivel_interes": 7,
  "objeciones": [],
  "arquetipo": "profesional_vision",
  "momento_optimo": "caliente"
}
</output>
</example>

Ahora analiza esta conversación y devuelve SOLO el objeto JSON:

<conversation>
{{CONVERSATION}}
</conversation>

Responde ÚNICAMENTE con el objeto JSON, sin explicaciones adicionales.`;

// Función auxiliar para procesar cada mensaje
async function processMessage(payload: QueueMessage) {
  // Construir conversación para el prompt
  const conversationText = payload.messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: "${msg.content}"`)
    .join('\n');

  const extractionPrompt = EXTRACTION_PROMPT.replace('{{CONVERSATION}}', conversationText);

  // Llamar a Claude API con prompt optimizado
  console.log('🤖 [CONSUMIDOR] Llamando a Claude API...');

  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.1, // Baja temperatura para respuestas más deterministas
      messages: [
        {
          role: 'user',
          content: extractionPrompt
        },
        {
          role: 'assistant',
          content: '{' // Pre-llenado de respuesta (Acción 3.1)
        }
      ]
    })
  });

  if (!claudeResponse.ok) {
    const errorText = await claudeResponse.text();
    throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`);
  }

  const claudeData = await claudeResponse.json();

  // Extraer JSON de la respuesta
  let extractedData: ProspectData;
  try {
    const rawContent = '{' + claudeData.content[0].text; // Agregar el { que pre-llenamos
    extractedData = JSON.parse(rawContent);
    console.log('✅ [CONSUMIDOR] Datos extraídos:', extractedData);
  } catch (parseError) {
    console.error('❌ [CONSUMIDOR] Error parseando JSON:', parseError);
    throw new Error(`Failed to parse Claude response: ${parseError}`);
  }

  // Guardar datos usando la función SQL existente
  if (payload.fingerprint && Object.keys(extractedData).length > 0) {
    console.log('💾 [CONSUMIDOR] Guardando datos en BD...');

    const { data: saveResult, error: saveError } = await supabase.rpc('update_prospect_data', {
      p_fingerprint_id: payload.fingerprint,
      p_data: extractedData
    });

    if (saveError) {
      console.error('❌ [CONSUMIDOR] Error guardando datos:', saveError);
      throw saveError;
    }

    console.log('✅ [CONSUMIDOR] Datos guardados exitosamente:', saveResult);
  } else {
    console.warn('⚠️ [CONSUMIDOR] Sin fingerprint o sin datos para guardar');
  }

  return extractedData;
}

serve(async (_req: any) => {
  const startTime = Date.now();
  let consumer: any = null;

  try {
    console.log('🟢 [CONSUMIDOR] Iniciando single poll de Confluent Kafka...');

    // Crear nueva instancia de consumer (NO singleton)
    consumer = kafka.consumer({
      groupId: 'nexus-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    // Conectar
    console.log('🔌 [CONSUMIDOR] Conectando a Confluent...');
    await consumer.connect();

    // Suscribirse al topic
    await consumer.subscribe({
      topic: 'nexus-prospect-ingestion',
      fromBeginning: false
    });

    console.log('📥 [CONSUMIDOR] Solicitando batch de mensajes...');

    let processedCount = 0;
    let lastPayload: QueueMessage | null = null as QueueMessage | null;
    let lastExtractedData: ProspectData | null = null;
    let batchReceived = false;

    // Patrón "single poll" - consumir UNA SOLA VEZ
    await consumer.run({
      eachBatch: async ({ batch, resolveOffset, heartbeat }: any) => {
        batchReceived = true;
        const batchSize = batch.messages.length;

        console.log(`📦 [CONSUMIDOR] Batch recibido: ${batchSize} mensajes`);

        if (batchSize === 0) {
          // No hay mensajes, salir inmediatamente
          await consumer.stop();
          return;
        }

        // Procesar cada mensaje del batch
        for (const message of batch.messages) {
          try {
            const payload: QueueMessage = JSON.parse(message.value.toString());
            lastPayload = payload;

            console.log('📨 [CONSUMIDOR] Procesando mensaje:', {
              topic: batch.topic,
              partition: batch.partition,
              offset: message.offset,
              sessionId: payload.sessionId,
              messageCount: payload.messages.length,
              hasFingerprint: !!payload.fingerprint,
            });

            // Procesar el mensaje
            lastExtractedData = await processMessage(payload);
            processedCount++;

            // Commit offset inmediatamente después de procesar
            await resolveOffset(message.offset);

            // Enviar heartbeat para mantener sesión activa
            await heartbeat();

          } catch (error) {
            console.error('❌ [CONSUMIDOR] Error procesando mensaje individual:', error);
            // Continuar con el siguiente mensaje sin hacer commit del offset fallido
          }
        }

        // Detener consumer después de procesar el batch
        console.log('🛑 [CONSUMIDOR] Deteniendo consumer después del batch...');
        await consumer.stop();
      },
    });

    // Esperar un momento para que el batch se procese
    // Si no hay mensajes, esto termina rápidamente
    await new Promise(resolve => setTimeout(resolve, 100));

    // Desconectar explícitamente
    console.log('🔌 [CONSUMIDOR] Desconectando...');
    if (consumer) {
      try {
        await consumer.disconnect();
      } catch (disconnectError) {
        console.warn('⚠️ [CONSUMIDOR] Error al desconectar (ignorado):', disconnectError);
      }
    }

    const totalTime = Date.now() - startTime;

    if (processedCount === 0) {
      console.log('📭 [CONSUMIDOR] Sin mensajes nuevos en Kafka');
      return new Response(JSON.stringify({
        status: 'idle',
        message: 'No new messages in Kafka topic',
        batchReceived,
        processingTime: `${totalTime}ms`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ [CONSUMIDOR] Procesados ${processedCount} mensajes en ${totalTime}ms`);

    return new Response(JSON.stringify({
      status: 'success',
      processedCount,
      lastSessionId: lastPayload ? lastPayload.sessionId : null,
      extractedData: lastExtractedData,
      processingTime: `${totalTime}ms`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [CONSUMIDOR] Error después de ${totalTime}ms:`, error);

    // Intentar desconectar en caso de error
    if (consumer) {
      try {
        await consumer.disconnect();
      } catch (disconnectError) {
        console.warn('⚠️ [CONSUMIDOR] Error al desconectar en cleanup:', disconnectError);
      }
    }

    return new Response(JSON.stringify({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      processingTime: `${totalTime}ms`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
