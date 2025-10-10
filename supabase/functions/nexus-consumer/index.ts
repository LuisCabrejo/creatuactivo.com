// supabase/functions/nexus-consumer/index.ts
// FASE 1 - CONSUMIDOR: Edge Function que procesa mensajes de Kafka
// Responsabilidad: Consume mensaje → Procesar con Claude → Guardar datos → Commit offset

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Kafka } from 'npm:@upstash/kafka@1.3.5';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const UPSTASH_KAFKA_REST_URL = Deno.env.get('UPSTASH_KAFKA_REST_URL')!;
const UPSTASH_KAFKA_REST_USERNAME = Deno.env.get('UPSTASH_KAFKA_REST_USERNAME')!;
const UPSTASH_KAFKA_REST_PASSWORD = Deno.env.get('UPSTASH_KAFKA_REST_PASSWORD')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const kafka = new Kafka({
  url: UPSTASH_KAFKA_REST_URL,
  username: UPSTASH_KAFKA_REST_USERNAME,
  password: UPSTASH_KAFKA_REST_PASSWORD,
});

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

serve(async (req) => {
  const startTime = Date.now();

  try {
    console.log('🟢 [CONSUMIDOR] Iniciando procesamiento de Kafka...');

    // Consumir mensajes de Kafka
    const consumer = kafka.consumer();
    const messages = await consumer.consume({
      consumerGroupId: 'nexus-consumer-group',
      instanceId: 'nexus-consumer-1',
      topics: ['nexus-prospect-ingestion'],
      autoCommit: true,
      autoCommitInterval: 5000,
    });

    // Si no hay mensajes, retornar
    if (!messages || messages.length === 0) {
      console.log('📭 [CONSUMIDOR] Kafka sin mensajes, nada que procesar');
      return new Response(JSON.stringify({
        status: 'idle',
        message: 'No messages in Kafka topic'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const kafkaMessage = messages[0];
    const payload: QueueMessage = typeof kafkaMessage.value === 'string'
      ? JSON.parse(kafkaMessage.value)
      : kafkaMessage.value;

    console.log('📨 [CONSUMIDOR] Procesando mensaje:', {
      offset: kafkaMessage.offset,
      partition: kafkaMessage.partition,
      sessionId: payload.sessionId,
      messageCount: payload.messages.length,
      hasFingerprint: !!payload.fingerprint,
      enqueuedAt: payload.metadata?.enqueuedAt
    });

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

    // El offset se commitea automáticamente por autoCommit: true
    const totalTime = Date.now() - startTime;
    console.log(`✅ [CONSUMIDOR] Procesamiento completado en ${totalTime}ms`);

    return new Response(JSON.stringify({
      status: 'success',
      offset: kafkaMessage.offset,
      partition: kafkaMessage.partition,
      sessionId: payload.sessionId,
      extractedData,
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
