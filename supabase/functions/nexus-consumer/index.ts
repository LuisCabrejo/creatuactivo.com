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

// Crear consumer singleton
let consumer: any = null;

async function getConsumer() {
  if (!consumer) {
    consumer = kafka.consumer({ groupId: 'nexus-consumer-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'nexus-prospect-ingestion', fromBeginning: false });
  }
  return consumer;
}

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

  try {
    console.log('🟢 [CONSUMIDOR] Iniciando procesamiento de Confluent Kafka...');

    // Obtener consumer singleton
    const consumer = await getConsumer();

    let processedCount = 0;
    let lastPayload: QueueMessage | null = null as QueueMessage | null;
    let lastExtractedData: ProspectData | null = null;

    // Configurar timeout para procesar al menos 1 mensaje y retornar
    const timeout = setTimeout(() => {
      consumer.disconnect();
    }, 8000); // 8 segundos timeout

    // Consumir mensajes
    await consumer.run({
      eachBatch: async ({ batch }: any) => {
        console.log(`📦 [CONSUMIDOR] Batch recibido: ${batch.messages.length} mensajes`);

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

          } catch (error) {
            console.error('❌ [CONSUMIDOR] Error procesando mensaje individual:', error);
            // Continuar con el siguiente mensaje
          }
        }

        // Limpiar timeout después de procesar batch
        clearTimeout(timeout);

        // Detener consumer después de procesar este batch
        await consumer.disconnect();
      },
    });

    const totalTime = Date.now() - startTime;

    if (processedCount === 0) {
      console.log('📭 [CONSUMIDOR] Sin mensajes nuevos en Kafka');
      return new Response(JSON.stringify({
        status: 'idle',
        message: 'No new messages in Kafka topic',
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
