#!/usr/bin/env node

/**
 * Script para fragmentar arsenales en respuestas individuales con embeddings
 *
 * ANTES: 1 arsenal = 1 documento = 1 embedding (60K chars enviados por request)
 * DESPUÉS: 1 respuesta = 1 documento = 1 embedding (~1K chars enviados por request)
 *
 * Ahorro estimado: ~90-95% de tokens de entrada por request
 *
 * Fecha: 10 Dic 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar credenciales
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

if (!voyageApiKey) {
  console.error('❌ Error: VOYAGE_API_KEY no encontrada en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Genera embedding usando Voyage AI
 */
async function generateVoyageEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${voyageApiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text.substring(0, 8000),
      input_type: 'document'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Convierte embedding a formato pgvector — columna embedding_512 (512-dim nativo)
 * Usado por getArsenalFragments() en nexus/route.ts
 */
function formatForPgvector512(embedding) {
  return '[' + embedding.join(',') + ']';
}

/**
 * Parsea un arsenal en respuestas individuales
 * Detecta headers ### y extrae ID y contenido
 *
 * Soporta MULTIPLES formatos:
 * - arsenal_compensacion v1: ### **RETO_01: "Pregunta"**
 * - arsenal_compensacion v2: ### COMP_GEN5_01: "Pregunta" (con alphanumeric middle)
 * - arsenal_avanzado v6.0: ### ADV_OBJ_01: "Pregunta"
 * - arsenal_inicial: ### FREQ_01: "Pregunta"
 */
function parseArsenalIntoResponses(content, arsenalName) {
  const responses = [];

  // Split por headers - soporta múltiples formatos:
  // - Con asteriscos: ### **ID:
  // - Sin asteriscos: ### ID:
  // - Con prefijo ADV_: ### ADV_OBJ_01: (arsenal_avanzado v6.0)
  // - Con alphanumeric: ### COMP_GEN5_01: (arsenal_compensacion v2.0)
  // El sufijo del ID casi siempre es numérico (_01), pero PROD_OVERVIEW no lo es —
  // sin la alternativa OVERVIEW ese fragmento no se parsea y solo existía porque
  // alguien lo insertó a mano (se perdió en la purga del 7 ago 2026).
  // El ID DEBE ir seguido de ':' (25 ago 2026). Sin esa exigencia, la alternativa
  // `_\d+` casaba primero y `FREQ_04_PUENTE` colapsaba en `FREQ_04`: mismo
  // fragmentCategory, así que el segundo se saltaba por «ya existe» y la
  // respuesta de las 12 formas de ganar NUNCA llegó a indexarse. Comprobado
  // contra los siete arsenales: mismos conteos, cero duplicados, +FREQ_04_PUENTE.
  const sections = content.split(/(?=###\s+\*{0,2}[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+:)/);

  for (const rawSection of sections) {
    if (!rawSection.trim() || !rawSection.includes('###')) continue;

    // Opción B (jun 2026): el split parte en "### CODE", así que el CHANGELOG
    // (y cualquier sección de documentación al pie del arsenal, marcada con "## ")
    // se pega al ÚLTIMO fragmento. Lo cortamos para que esa metadata de dev
    // —con términos de léxico viejo en notas de mapeo— no contamine el embedding
    // ni el contenido servido al modelo. Las respuestas (### CODE) y sus tablas
    // internas (separadas por ---) quedan intactas.
    let section = rawSection;
    const changelogIdx = section.search(/\n##\s+CHANGELOG/i);
    if (changelogIdx > 0) section = section.slice(0, changelogIdx);

    // Extraer ID del header - soporta múltiples formatos
    // Formato 1: ### **RETO_01: "Pregunta"** (arsenal_compensacion v1, arsenal_inicial)
    // Formato 2: ### ADV_OBJ_01: "Pregunta" (arsenal_avanzado v6.0)
    // Formato 3: ### COMP_GEN5_01: "Pregunta" (arsenal_compensacion v2.0)
    const headerMatch = section.match(/###\s*\*{0,2}([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+):\*{0,2}\s*"?([^"\n*]+)/);
    if (!headerMatch) continue;

    const responseId = headerMatch[1].trim();
    const questionText = headerMatch[2].trim();

    // Limpiar contenido (remover el header para el contenido, pero mantenerlo para contexto)
    const contentStart = section.indexOf('\n');
    const responseContent = section.substring(contentStart).trim();

    // Solo incluir si tiene contenido sustancial
    if (responseContent.length < 50) continue;

    // Encontrar el final de la respuesta (siguiente --- o fin)
    const endMarker = responseContent.indexOf('\n---');
    const cleanContent = endMarker > 0
      ? responseContent.substring(0, endMarker).trim()
      : responseContent.trim();

    // ── Separación índice / doctrina / cuerpo (25 ago 2026) ──
    // Tres piezas con tres destinatarios distintos, y por eso tres destinos:
    //   [Índice]          → SOLO al embedding. Escrito con las palabras que usa la
    //                       persona, para que la búsqueda lo encuentre.
    //   [Concepto Nuclear]→ SOLO al .txt. Es doctrina para los agentes que editan
    //                       este archivo; el modelo no debe leerla nunca. Viajaba
    //                       dentro del fragmento y era el ~47% del corpus servido:
    //                       instrucciones que el modelo copiaba (contextual
    //                       entrainment) y prohibiciones que le dictaban justo lo
    //                       que negaban. Ver docs/investigaciones/resultados/
    //                       CABECERAS_RAG_INVESTIGACION_AGO2026.md
    //   cuerpo            → al contenido servido.
    const tomarBloque = (texto, etiqueta) => {
      const ls = texto.split('\n');
      const dentro = [], fuera = [];
      let en = false;
      for (const l of ls) {
        if (l.startsWith(etiqueta)) { en = true; dentro.push(l); continue; }
        if (en) {
          // El bloque cierra con una línea en blanco O con el inicio de otro
          // marcador **[...]. Sin lo segundo, un [Índice] pegado a un
          // [Concepto Nuclear] se traga la doctrina y la manda al embedding.
          if (l.trim() === '' || l.startsWith('**[')) { en = false; }
          else { dentro.push(l); continue; }
        }
        fuera.push(l);
      }
      return { dentro: dentro.join('\n').trim(), fuera: fuera.join('\n') };
    };

    const a = tomarBloque(cleanContent, '**[Índice]:**');
    const b = tomarBloque(a.fuera, '**[Concepto Nuclear]');
    const indice = a.dentro.replace(/^\*\*\[Índice\]:\*\*\s*/, '').trim();
    const cuerpo = b.fuera.replace(/\n{3,}/g, '\n\n').trim();

    // El contenido SERVIDO se reconstruye sin índice ni doctrina.
    const seccionServida = `### ${responseId}: "${questionText}"\n\n${cuerpo}`;

    responses.push({
      id: responseId,
      question: questionText,
      indice,                      // '' si el fragmento aún no tiene índice escrito
      content: cuerpo,
      fullSection: seccionServida,
      arsenal: arsenalName
    });
  }

  return responses;
}

// Mapa arsenal → tenant_id (sincronizado con middleware.ts)
const ARSENAL_TENANT_MAP = {
  arsenal_compensacion:   'creatuactivo_marketing',
  arsenal_inicial:        'creatuactivo_marketing',
  arsenal_avanzado:       'creatuactivo_marketing',
  arsenal_12_niveles:     'creatuactivo_marketing',  catalogo_productos:     'creatuactivo_marketing',
  arsenal_marca_personal: 'marca_personal',
  arsenal_ganocafe:       'ecommerce',
};

/**
 * Procesa un arsenal y crea fragmentos en Supabase
 */
async function processArsenal(arsenalCategory) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Procesando: ${arsenalCategory}`);
  console.log('='.repeat(60));

  // Obtener arsenal original (filtrar por tenant para evitar PGRST116 cuando hay duplicados)
  const tenantId = ARSENAL_TENANT_MAP[arsenalCategory] || 'creatuactivo_marketing';
  const { data: arsenal, error } = await supabase
    .from('nexus_documents')
    .select('id, category, content, metadata')
    .eq('category', arsenalCategory)
    .eq('tenant_id', tenantId)
    .single();

  if (error || !arsenal) {
    console.error(`❌ Error obteniendo ${arsenalCategory}:`, error);
    return { processed: 0, skipped: 0 };
  }

  console.log(`📄 Arsenal original: ${arsenal.content.length} caracteres`);

  // Parsear en respuestas
  const responses = parseArsenalIntoResponses(arsenal.content, arsenalCategory);
  console.log(`🔍 Respuestas encontradas: ${responses.length}`);

  if (responses.length === 0) {
    console.log('⚠️  No se encontraron respuestas para fragmentar');
    return { processed: 0, skipped: 0 };
  }

  let processed = 0;
  let skipped = 0;

  for (const response of responses) {
    const fragmentCategory = `${arsenalCategory}_${response.id}`;

    // Verificar si ya existe EN ESTE TENANT.
    // El filtro por tenant_id es crítico: arsenal_inicial se clona al tenant
    // 'whatsapp', así que sin él esta query ve 2 filas (creatuactivo + whatsapp),
    // `.single()` falla con PGRST116 → existing=undefined → se crean DUPLICADOS.
    // Y para fragments que solo quedan en whatsapp (tras purgar creatuactivo) ve
    // 1 fila y los salta, dejándolos sin regenerar. Bug confirmado 12 jun 2026.
    const { data: existing } = await supabase
      .from('nexus_documents')
      .select('id')
      .eq('category', fragmentCategory)
      .eq('tenant_id', tenantId)
      .single();

    if (existing) {
      console.log(`⏭️  ${fragmentCategory} ya existe, saltando...`);
      skipped++;
      continue;
    }

    console.log(`\n📝 Creando: ${fragmentCategory}`);
    console.log(`   Pregunta: "${response.question.substring(0, 50)}..."`);
    console.log(`   Contenido: ${response.content.length} chars`);

    // Generar embedding
    console.log(`   🔄 Generando embedding...`);
    try {
      // Lo que se INDEXA no es lo que se sirve (25 ago 2026).
      // Medido sobre este corpus con 40 consultas coloquiales: indexar
      // disparadores + índice sube el acierto en el puesto 1 de 25/40 a 34/40,
      // el top-3 de 32 a 38, y TRIPLICA el margen sobre el segundo (0.023 → 0.082).
      // Ese margen es el que decide los casi-empates — el Δ0.017 que obligó a
      // construir el candado solitario. Añadirle el cuerpo al índice lo empeora
      // (29/40): el texto largo ahoga la señal. Arnés: scripts/experimento-indice-recuperacion.mjs
      // Fallback: sin índice escrito se indexa como antes, para no romper los
      // arsenales que todavía no lo tienen.
      const textForEmbedding = response.indice
        ? `${response.question}\n\n${response.indice}`
        : `${response.question}\n\n${response.content}`;
      const embedding = await generateVoyageEmbedding(textForEmbedding);
      const embedding512  = formatForPgvector512(embedding);   // columna embedding_512 (route.ts)

      // Insertar en Supabase
      // - embedding_512: vector(512)  — para getArsenalFragments() en nexus/route.ts
      // - tenant_id:     multi-tenant FASE C
      const tenantId = ARSENAL_TENANT_MAP[arsenalCategory] ?? 'creatuactivo_marketing';
      const { error: insertError } = await supabase
        .from('nexus_documents')
        .insert({
          category: fragmentCategory,
          title: response.question,
          content: response.fullSection,
      // La columna `embedding` (vector 1536, el mismo de 512 rellenado con ceros)
      // se dejó de escribir el 7 ago 2026 y se dropeó: existía solo para el RPC
      // match_documents, muerto desde su origen. La búsqueda viva usa
      // embedding_512 vía match_fragments_512.
          embedding_512: embedding512,
          tenant_id: tenantId,
          metadata: {
            response_id: response.id,
            parent_arsenal: arsenalCategory,
            char_count: response.content.length,
            tiene_indice: Boolean(response.indice),
            is_fragment: true,
            // Bandera para que otros consumidores (el Dashboard) encuentren los
            // textos de fondo sin buscar una subcadena dentro del contenido.
            // El candado significa "no se parafrasea": quien lo sirve, lo sirve
            // entero. Ver docs/handoff/queswa/RESPUESTA_FAQ01_VS_WHY02.md
            has_verbatim_lock: /<verbatim_lock>/.test(response.fullSection),
            created_at: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error(`   ❌ Error insertando:`, insertError.message);
        continue;
      }

      console.log(`   ✅ Creado exitosamente`);
      processed++;

      // Rate limiting para Voyage API
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
    }
  }

  return { processed, skipped, total: responses.length };
}

async function main() {
  console.log('🚀 FRAGMENTACIÓN DE ARSENALES CON VOYAGE AI');
  console.log('==========================================\n');
  console.log('Objetivo: Reducir tokens de entrada de ~15K a ~400 por request\n');

  const arsenales = [
    // tenant: creatuactivo_marketing
    'arsenal_compensacion',    // 38 respuestas
    'arsenal_inicial',         // 34 respuestas
    'arsenal_avanzado',        // 14 respuestas (v6.0 JOBS/NAVAL)
    'arsenal_12_niveles',      // 13 respuestas (v4.0 JOBS/NAVAL - Los 12 Niveles + Kit de Inicio)
    'catalogo_productos',      // 22 respuestas (v6.0 JOBS/NAVAL - Catálogo completo + ciencia)
    // tenant: marca_personal (luiscabrejo.com)
    'arsenal_marca_personal',  // 11 respuestas (v1.0 - Marca Personal Luis Cabrejo)
    // tenant: ecommerce (ganocafe.online)
    'arsenal_ganocafe',        // 13 respuestas (v1.0 - Catálogo + Beneficios + Compra)
  ];

  const results = {};

  for (const arsenal of arsenales) {
    results[arsenal] = await processArsenal(arsenal);
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));

  let totalProcessed = 0;
  let totalSkipped = 0;

  for (const [arsenal, result] of Object.entries(results)) {
    console.log(`\n${arsenal}:`);
    console.log(`   - Procesados: ${result.processed}`);
    console.log(`   - Saltados: ${result.skipped}`);
    console.log(`   - Total respuestas: ${result.total || 0}`);
    totalProcessed += result.processed || 0;
    totalSkipped += result.skipped || 0;
  }

  console.log(`\n📈 TOTALES:`);
  console.log(`   - Fragmentos creados: ${totalProcessed}`);
  console.log(`   - Fragmentos existentes: ${totalSkipped}`);

  console.log('\n✅ Fragmentación completada');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Verificar fragmentos en Supabase Dashboard');
  console.log('   2. Modificar route.ts para usar fragmentos');
  console.log('   3. Probar búsqueda vectorial con fragmentos');
}

main().catch(console.error);
