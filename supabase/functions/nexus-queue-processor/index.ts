// supabase/functions/nexus-queue-processor/index.ts
// NEXUS QUEUE PROCESSOR: Procesa mensajes desde cola de base de datos
// Invocado por: DB Trigger después de INSERT en nexus_queue
// Arquitectura: Edge Runtime (compatible con fetch)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface QueueMessage {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  fingerprint?: string;
  sessionId: string;
  metadata?: Record<string, any>;
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

// Función para procesar un mensaje de la cola
async function processQueueMessage(queueId: string): Promise<void> {
  const startTime = Date.now();

  try {
    console.log(`🟢 [PROCESSOR] Iniciando procesamiento de mensaje ${queueId}`);

    // 1. Marcar mensaje como "processing"
    await supabase.rpc('update_queue_status', {
      p_queue_id: queueId,
      p_status: 'processing'
    });

    // 2. Obtener mensaje de la cola
    const { data: queueItem, error: fetchError } = await supabase
      .from('nexus_queue')
      .select('*')
      .eq('id', queueId)
      .single();

    if (fetchError || !queueItem) {
      throw new Error(`Failed to fetch queue item: ${fetchError?.message}`);
    }

    console.log(`📦 [PROCESSOR] Mensaje obtenido:`, {
      session_id: queueItem.session_id,
      messageCount: queueItem.messages?.length || 0,
      hasFingerprint: !!queueItem.fingerprint
    });

    // 3. Extraer datos usando Claude
    const conversationText = queueItem.messages
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: "${msg.content}"`)
      .join('\n');

    const extractionPrompt = EXTRACTION_PROMPT.replace('{{CONVERSATION}}', conversationText);

    console.log('🤖 [PROCESSOR] Llamando a Claude API...');

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

    // 4. Parsear datos extraídos
    let extractedData: ProspectData;
    try {
      const rawContent = '{' + claudeData.content[0].text;
      extractedData = JSON.parse(rawContent);
      console.log('✅ [PROCESSOR] Datos extraídos:', extractedData);
    } catch (parseError) {
      console.error('❌ [PROCESSOR] Error parseando JSON:', parseError);
      throw new Error(`Failed to parse Claude response: ${parseError}`);
    }

    // 5. Guardar datos en prospect_data si hay fingerprint
    if (queueItem.fingerprint && Object.keys(extractedData).length > 0) {
      console.log('💾 [PROCESSOR] Guardando datos en BD...');

      const { data: saveResult, error: saveError } = await supabase.rpc('update_prospect_data', {
        p_fingerprint_id: queueItem.fingerprint,
        p_data: extractedData
      });

      if (saveError) {
        console.error('❌ [PROCESSOR] Error guardando datos:', saveError);
        throw saveError;
      }

      console.log('✅ [PROCESSOR] Datos guardados exitosamente');
    } else {
      console.warn('⚠️ [PROCESSOR] Sin fingerprint o sin datos para guardar');
    }

    // 6. Marcar mensaje como "completed"
    await supabase.rpc('update_queue_status', {
      p_queue_id: queueId,
      p_status: 'completed',
      p_error_message: null
    });

    const totalTime = Date.now() - startTime;
    console.log(`✅ [PROCESSOR] Mensaje procesado exitosamente en ${totalTime}ms`);

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [PROCESSOR] Error después de ${totalTime}ms:`, error);

    // Marcar mensaje como "failed" con el error
    await supabase.rpc('update_queue_status', {
      p_queue_id: queueId,
      p_status: 'failed',
      p_error_message: error instanceof Error ? error.message : String(error)
    });

    throw error;
  }
}

serve(async (req: Request) => {
  const startTime = Date.now();

  try {
    // Parsear payload del trigger
    const { queue_id, session_id } = await req.json();

    if (!queue_id) {
      throw new Error('queue_id is required');
    }

    console.log(`📥 [PROCESSOR] Invocación recibida:`, {
      queue_id,
      session_id,
      source: 'db-trigger'
    });

    // Procesar mensaje
    await processQueueMessage(queue_id);

    const totalTime = Date.now() - startTime;

    return new Response(JSON.stringify({
      status: 'success',
      queue_id,
      processingTime: `${totalTime}ms`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`❌ [PROCESSOR] Handler error después de ${totalTime}ms:`, error);

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
