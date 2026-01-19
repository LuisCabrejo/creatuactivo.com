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
 * Convierte embedding a formato pgvector (512 -> 1536 con padding)
 */
function formatForPgvector(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
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
  const sections = content.split(/(?=###\s+\*?\*?[A-Z]+(?:_[A-Z0-9]+)*_\d+)/);

  for (const section of sections) {
    if (!section.trim() || !section.includes('###')) continue;

    // Extraer ID del header - soporta múltiples formatos
    // Formato 1: ### **RETO_01: "Pregunta"** (arsenal_compensacion v1, arsenal_inicial)
    // Formato 2: ### ADV_OBJ_01: "Pregunta" (arsenal_avanzado v6.0)
    // Formato 3: ### COMP_GEN5_01: "Pregunta" (arsenal_compensacion v2.0)
    const headerMatch = section.match(/###\s*\*?\*?([A-Z]+(?:_[A-Z0-9]+)*_\d+):?\s*"?([^"\n*]+)/);
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

    responses.push({
      id: responseId,
      question: questionText,
      content: cleanContent,
      fullSection: section.trim(),
      arsenal: arsenalName
    });
  }

  return responses;
}

/**
 * Procesa un arsenal y crea fragmentos en Supabase
 */
async function processArsenal(arsenalCategory) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📦 Procesando: ${arsenalCategory}`);
  console.log('='.repeat(60));

  // Obtener arsenal original
  const { data: arsenal, error } = await supabase
    .from('nexus_documents')
    .select('id, category, content, metadata')
    .eq('category', arsenalCategory)
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

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('nexus_documents')
      .select('id')
      .eq('category', fragmentCategory)
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
      // Incluir pregunta en el texto para mejor matching semántico
      const textForEmbedding = `${response.question}\n\n${response.content}`;
      const embedding = await generateVoyageEmbedding(textForEmbedding);
      const formattedEmbedding = formatForPgvector(embedding);

      // Insertar en Supabase (sin columna 'source' - no existe en el schema)
      const { error: insertError } = await supabase
        .from('nexus_documents')
        .insert({
          category: fragmentCategory,
          title: response.question,
          content: response.fullSection,
          embedding: formattedEmbedding,
          metadata: {
            response_id: response.id,
            parent_arsenal: arsenalCategory,
            char_count: response.content.length,
            is_fragment: true,
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
    'arsenal_compensacion',  // 38 respuestas
    'arsenal_inicial',       // 34 respuestas
    'arsenal_avanzado',      // 14 respuestas (v6.0 JOBS/NAVAL)
    'arsenal_12_niveles',    // 13 respuestas (v4.0 JOBS/NAVAL - Los 12 Niveles + Kit de Inicio)
    'arsenal_reto',          // 7 respuestas (v1.0 - Reto de 5 Días Challenge Funnel)
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
