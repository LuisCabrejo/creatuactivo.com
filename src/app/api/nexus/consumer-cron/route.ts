// src/app/api/nexus/consumer-cron/route.ts
// FASE 1 - CONSUMIDOR: Cron job que consume mensajes de Confluent Kafka
// ARQUITECTURA: Node.js runtime con KafkaJS - Compatible con procesos largos
// DEPLOY: Vercel Cron (cada 10 segundos)

import { Kafka } from 'kafkajs';
import { createClient } from '@supabase/supabase-js';

// Node.js runtime (KafkaJS requiere Node)
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 segundos para consumir batch
export const dynamic = 'force-dynamic'; // Fuerza renderizado dinámico (fix despliegue Vercel)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CONFLUENT_BOOTSTRAP_SERVER = process.env.CONFLUENT_BOOTSTRAP_SERVER!;
const CONFLUENT_API_KEY = process.env.CONFLUENT_API_KEY!;
const CONFLUENT_API_SECRET = process.env.CONFLUENT_API_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'nexus-consumer-cron',
  brokers: [CONFLUENT_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username: CONFLUENT_API_KEY,
    password: CONFLUENT_API_SECRET,
  },
  connectionTimeout: 10000,
  requestTimeout: 15000,
});

// Consumer singleton para reutilizar conexión
let consumer: any = null;
let isConsuming = false;

async function getConsumer() {
  if (!consumer) {
    consumer = kafka.consumer({
      groupId: 'nexus-consumer-group',
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
    await consumer.connect();
    await consumer.subscribe({
      topic: 'nexus-prospect-ingestion',
      fromBeginning: false,
    });
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

// Prompt optimizado para extracción estructurada
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
async function processMessage(payload: QueueMessage): Promise<ProspectData> {
  const conversationText = payload.messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: "${msg.content}"`)
    .join('\n');

  const extractionPrompt = EXTRACTION_PROMPT.replace('{{CONVERSATION}}', conversationText);

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
      temperature: 0.1,
      messages: [
        { role: 'user', content: extractionPrompt },
        { role: 'assistant', content: '{' }
      ]
    })
  });

  if (!claudeResponse.ok) {
    const errorText = await claudeResponse.text();
    throw new Error(`Claude API error: ${claudeResponse.status} - ${errorText}`);
  }

  const claudeData = await claudeResponse.json();

  let extractedData: ProspectData;
  try {
    const rawContent = '{' + claudeData.content[0].text;
    extractedData = JSON.parse(rawContent);
    console.log('✅ [CONSUMIDOR] Datos extraídos:', extractedData);
  } catch (parseError) {
    console.error('❌ [CONSUMIDOR] Error parseando JSON:', parseError);
    throw new Error(`Failed to parse Claude response: ${parseError}`);
  }

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

export async function GET(req: Request) {
  const startTime = Date.now();

  // Verificar autorización del cron job
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Evitar consumo concurrente
  if (isConsuming) {
    console.log('⏳ [CONSUMIDOR] Ya hay un consumo en progreso, saltando...');
    return new Response(JSON.stringify({
      status: 'skipped',
      message: 'Consumer already running'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  isConsuming = true;

  try {
    console.log('🟢 [CONSUMIDOR] Iniciando consumo con KafkaJS...');

    const consumer = await getConsumer();
    let processedCount = 0;
    let messagesReceived = 0;

    // Consumir mensajes con timeout
    await Promise.race([
      consumer.run({
        eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
          console.log(`📦 [KAFKA] Batch recibido: ${batch.messages.length} mensajes`);
          messagesReceived += batch.messages.length;

          for (const message of batch.messages) {
            try {
              const payload: QueueMessage = JSON.parse(message.value?.toString() || '{}');

              console.log('📨 [CONSUMIDOR] Procesando mensaje:', {
                offset: message.offset,
                partition: batch.partition,
                sessionId: payload.sessionId,
                messageCount: payload.messages?.length || 0,
                hasFingerprint: !!payload.fingerprint,
              });

              // Procesar el mensaje
              await processMessage(payload);
              processedCount++;

              // Commit offset después de procesar exitosamente
              await resolveOffset(message.offset);
              await heartbeat();

            } catch (error) {
              console.error('❌ [CONSUMIDOR] Error procesando mensaje individual:', error);
              // Continuar con el siguiente mensaje
            }
          }

          // Detener después de procesar el primer batch
          await consumer.pause([{ topic: 'nexus-prospect-ingestion' }]);
        },
      }),
      // Timeout de 25 segundos (dejar 5s para respuesta)
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 25000)
      ),
    ]);

    // Reanudar para próxima invocación
    await consumer.resume([{ topic: 'nexus-prospect-ingestion' }]);

    const totalTime = Date.now() - startTime;
    console.log(`✅ [CONSUMIDOR] Procesados ${processedCount}/${messagesReceived} mensajes en ${totalTime}ms`);

    isConsuming = false;

    return new Response(JSON.stringify({
      status: 'success',
      messagesReceived,
      processedCount,
      processingTime: `${totalTime}ms`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [CONSUMIDOR] Error después de ${totalTime}ms:`, error);

    isConsuming = false;

    return new Response(JSON.stringify({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      processingTime: `${totalTime}ms`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
