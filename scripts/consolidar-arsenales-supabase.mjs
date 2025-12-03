#!/usr/bin/env node
/**
 * Script para consolidar arsenales en Supabase
 * 1. Subir arsenal_avanzado (nuevo)
 * 2. Actualizar catalogo_productos v3.0
 * 3. Eliminar documentos redundantes
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const knowledgeBasePath = path.join(__dirname, '..', 'knowledge_base');

async function consolidarArsenales() {
  console.log('🔧 CONSOLIDACIÓN DE ARSENALES EN SUPABASE');
  console.log('==========================================\n');

  // PASO 1: Subir arsenal_avanzado
  console.log('📤 PASO 1: Subiendo arsenal_avanzado.txt...\n');

  const arsenalAvanzadoPath = path.join(knowledgeBasePath, 'arsenal_avanzado.txt');
  const arsenalAvanzadoContent = fs.readFileSync(arsenalAvanzadoPath, 'utf8');

  // Verificar si ya existe
  const { data: existingAvanzado, error: checkAvanzado } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'arsenal_avanzado')
    .maybeSingle();

  if (existingAvanzado) {
    // Actualizar
    const { error: updateError } = await supabase
      .from('nexus_documents')
      .update({
        title: 'Arsenal Avanzado - Consolidado (63 respuestas)',
        content: arsenalAvanzadoContent,
        updated_at: new Date().toISOString(),
        metadata: { version: '3.0', date: '2025-12-03', consolidado: true }
      })
      .eq('id', existingAvanzado.id);

    if (updateError) {
      console.error('❌ Error actualizando arsenal_avanzado:', updateError);
    } else {
      console.log('✅ arsenal_avanzado ACTUALIZADO en Supabase');
      console.log(`   ID: ${existingAvanzado.id}`);
      console.log(`   Tamaño: ${arsenalAvanzadoContent.length} caracteres\n`);
    }
  } else {
    // Crear nuevo
    const { data: newDoc, error: insertError } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_avanzado',
        title: 'Arsenal Avanzado - Consolidado (63 respuestas)',
        content: arsenalAvanzadoContent,
        metadata: { version: '3.0', date: '2025-12-03', consolidado: true }
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creando arsenal_avanzado:', insertError);
    } else {
      console.log('✅ arsenal_avanzado CREADO en Supabase');
      console.log(`   ID: ${newDoc.id}`);
      console.log(`   Tamaño: ${arsenalAvanzadoContent.length} caracteres\n`);
    }
  }

  // PASO 2: Actualizar catalogo_productos
  console.log('📤 PASO 2: Actualizando catalogo_productos.txt v3.0...\n');

  const catalogoPath = path.join(knowledgeBasePath, 'catalogo_productos.txt');
  const catalogoContent = fs.readFileSync(catalogoPath, 'utf8');

  const { data: existingCatalogo, error: checkCatalogo } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'catalogo_productos')
    .single();

  if (existingCatalogo) {
    const { error: updateError } = await supabase
      .from('nexus_documents')
      .update({
        title: 'Catálogo Productos Gano Excel 2025 v3.0 (con preguntas técnicas)',
        content: catalogoContent,
        updated_at: new Date().toISOString(),
        metadata: { version: '3.0', date: '2025-12-03', tech_questions: true }
      })
      .eq('id', existingCatalogo.id);

    if (updateError) {
      console.error('❌ Error actualizando catalogo_productos:', updateError);
    } else {
      console.log('✅ catalogo_productos ACTUALIZADO a v3.0');
      console.log(`   ID: ${existingCatalogo.id}`);
      console.log(`   Tamaño: ${catalogoContent.length} caracteres\n`);
    }
  } else {
    console.error('❌ catalogo_productos no encontrado en Supabase');
  }

  // PASO 3: Eliminar documentos redundantes
  console.log('🗑️  PASO 3: Eliminando documentos redundantes...\n');

  const documentosEliminar = [
    'arsenal_manejo',
    'arsenal_cierre',
    'arsenal_productos',
    'productos_ciencia',
    'framework_iaa',
    'escalacion_liliana'
  ];

  for (const categoria of documentosEliminar) {
    const { data: doc, error: checkError } = await supabase
      .from('nexus_documents')
      .select('id, title')
      .eq('category', categoria)
      .maybeSingle();

    if (doc) {
      const { error: deleteError } = await supabase
        .from('nexus_documents')
        .delete()
        .eq('id', doc.id);

      if (deleteError) {
        console.error(`❌ Error eliminando ${categoria}:`, deleteError);
      } else {
        console.log(`✅ ${categoria} eliminado`);
        console.log(`   Título: ${doc.title}`);
      }
    } else {
      console.log(`⚠️  ${categoria} no encontrado (ya eliminado)`);
    }
  }

  // RESUMEN FINAL
  console.log('\n==========================================');
  console.log('📊 RESUMEN FINAL DE ARSENALES EN SUPABASE');
  console.log('==========================================\n');

  const { data: arsenalesFinales, error: finalError } = await supabase
    .from('nexus_documents')
    .select('category, title, metadata')
    .order('category');

  if (finalError) {
    console.error('❌ Error obteniendo resumen:', finalError);
  } else {
    console.log(`Total de documentos: ${arsenalesFinales.length}\n`);

    arsenalesFinales.forEach(doc => {
      const version = doc.metadata?.version || 'N/A';
      console.log(`✅ ${doc.category} (v${version})`);
      console.log(`   ${doc.title}\n`);
    });
  }

  console.log('✨ Consolidación completada exitosamente!\n');
}

consolidarArsenales();
