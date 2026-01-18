#!/usr/bin/env node

/**
 * Script para REGENERAR fragmentos de arsenal_12_niveles con v4.0 JOBS/NAVAL
 * Elimina fragmentos antiguos y crea nuevos con embeddings actualizados
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

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

function formatForPgvector(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

function parseArsenalIntoResponses(content, arsenalName) {
  const responses = [];
  const sections = content.split(/(?=###\s+\*?\*?[A-Z]+(?:_[A-Z]+)?_\d+)/);

  for (const section of sections) {
    if (!section.trim() || !section.includes('###')) continue;

    const headerMatch = section.match(/###\s*\*?\*?([A-Z]+(?:_[A-Z]+)?_\d+):?\s*"?([^"\n*]+)/);
    if (!headerMatch) continue;

    const responseId = headerMatch[1].trim();
    const questionText = headerMatch[2].trim();
    const contentStart = section.indexOf('\n');
    const responseContent = section.substring(contentStart).trim();

    if (responseContent.length < 50) continue;

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

async function main() {
  console.log('🔄 REGENERANDO fragmentos de arsenal_12_niveles v4.0 JOBS/NAVAL\n');

  // 1. Eliminar fragmentos existentes
  console.log('🗑️  Eliminando fragmentos antiguos...');

  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .like('category', 'arsenal_12_niveles_%');

  console.log(`   Encontrados: ${existing?.length || 0} fragmentos`);

  if (existing && existing.length > 0) {
    const { error: deleteError } = await supabase
      .from('nexus_documents')
      .delete()
      .like('category', 'arsenal_12_niveles_%');

    if (deleteError) {
      console.error('❌ Error eliminando:', deleteError);
      return;
    }

    console.log(`✅ ${existing.length} fragmentos eliminados\n`);
  }

  // 2. Obtener arsenal actualizado
  const { data: arsenal, error: fetchError } = await supabase
    .from('nexus_documents')
    .select('content')
    .eq('category', 'arsenal_12_niveles')
    .single();

  if (fetchError || !arsenal) {
    console.error('❌ Error obteniendo arsenal:', fetchError);
    return;
  }

  console.log(`📄 Arsenal: ${arsenal.content.length} caracteres`);

  // 3. Parsear respuestas
  const responses = parseArsenalIntoResponses(arsenal.content, 'arsenal_12_niveles');
  console.log(`🔍 Respuestas encontradas: ${responses.length}\n`);

  // 4. Crear nuevos fragmentos con embeddings
  let created = 0;
  for (const response of responses) {
    const fragmentCategory = `arsenal_12_niveles_${response.id}`;

    console.log(`📝 Creando: ${fragmentCategory}`);
    console.log(`   Pregunta: "${response.question.substring(0, 50)}..."`);

    try {
      const textForEmbedding = `${response.question}\n\n${response.content}`;
      const embedding = await generateVoyageEmbedding(textForEmbedding);
      const formattedEmbedding = formatForPgvector(embedding);

      const { error: insertError } = await supabase
        .from('nexus_documents')
        .insert({
          category: fragmentCategory,
          title: response.question,
          content: response.fullSection,
          embedding: formattedEmbedding,
          metadata: {
            response_id: response.id,
            parent_arsenal: 'arsenal_12_niveles',
            char_count: response.content.length,
            is_fragment: true,
            version: '4.0 JOBS/NAVAL',
            created_at: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error(`   ❌ Error:`, insertError.message);
        continue;
      }

      console.log(`   ✅ Creado`);
      created++;

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.error(`   ❌ Error:`, err.message);
    }
  }

  console.log(`\n📊 RESUMEN:`);
  console.log(`   - Fragmentos creados: ${created}/${responses.length}`);
  console.log('\n✅ Regeneración completada');
}

main().catch(console.error);
