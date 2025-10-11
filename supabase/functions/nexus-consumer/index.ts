// supabase/functions/nexus-consumer/index.ts
// FASE 1 - CONSUMIDOR: Edge Function que procesa mensajes de Confluent Kafka
// ARQUITECTURA: Polling sincrónico compatible con Edge Runtime de corta duración

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CONFLUENT_CLUSTER_ID = Deno.env.get('CONFLUENT_CLUSTER_ID')!;
const CONFLUENT_API_KEY = Deno.env.get('CONFLUENT_API_KEY')!;
const CONFLUENT_API_SECRET = Deno.env.get('CONFLUENT_API_SECRET')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuración para Confluent REST Proxy
const CONSUMER_INSTANCE_ID = 'nexus-consumer-edge-1';
const CONSUMER_GROUP_ID = 'nexus-consumer-group';
const BASE_URL = `https://pkc-921jm.us-east-2.aws.confluent.cloud`;

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

// Función para consumir mensajes usando Confluent REST Proxy API
async function consumeFromConfluentREST(): Promise<any[]> {
  const auth = btoa(`${CONFLUENT_API_KEY}:${CONFLUENT_API_SECRET}`);

  // Endpoint para consumir mensajes
  const consumeUrl = `${BASE_URL}/kafka/v3/clusters/${CONFLUENT_CLUSTER_ID}/consumer-groups/${CONSUMER_GROUP_ID}/consumers/${CONSUMER_INSTANCE_ID}/records`;

  console.log('📥 [CONSUMIDOR] Fetching mensajes desde Confluent REST API...');

  const response = await fetch(consumeUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Confluent REST API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.records || [];
}

serve(async (_req: any) => {
  const startTime = Date.now();

  try {
    console.log('🟢 [CONSUMIDOR] Iniciando consumo con Confluent REST API...');

    // Consumir mensajes usando REST API
    const records = await consumeFromConfluentREST();

    if (!records || records.length === 0) {
      console.log('📭 [CONSUMIDOR] Sin mensajes nuevos en Kafka');
      const totalTime = Date.now() - startTime;
      return new Response(JSON.stringify({
        status: 'idle',
        message: 'No new messages in Kafka topic',
        processingTime: `${totalTime}ms`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`📦 [CONSUMIDOR] Recibidos ${records.length} mensajes`);

    let processedCount = 0;
    let lastPayload: QueueMessage | null = null;
    let lastExtractedData: ProspectData | null = null;

    // Procesar cada mensaje
    for (const record of records) {
      try {
        const payload: QueueMessage = JSON.parse(record.value);
        lastPayload = payload;

        console.log('📨 [CONSUMIDOR] Procesando mensaje:', {
          offset: record.offset,
          partition: record.partition,
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

    const totalTime = Date.now() - startTime;
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
