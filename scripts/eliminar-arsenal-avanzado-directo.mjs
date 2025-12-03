#!/usr/bin/env node
/**
 * Script para eliminar arsenal_avanzado de Supabase (sin confirmación)
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

async function eliminarArsenalAvanzado() {
  console.log('🗑️  Eliminando arsenal_avanzado de Supabase...\n');

  // Verificar que existe
  const { data: existing, error: checkError } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .eq('category', 'arsenal_avanzado')
    .single();

  if (checkError || !existing) {
    console.log('❌ No se encontró arsenal_avanzado en Supabase');
    console.log('✅ Ya está limpio');
    return;
  }

  console.log(`📄 Arsenal encontrado:`);
  console.log(`   ID: ${existing.id}`);
  console.log(`   Título: ${existing.title}`);
  console.log(`   Tamaño: ${existing.content.length} caracteres\n`);

  // Eliminar de Supabase
  const { error } = await supabase
    .from('nexus_documents')
    .delete()
    .eq('category', 'arsenal_avanzado');

  if (error) {
    console.error('❌ Error al eliminar:', error);
  } else {
    console.log('✅ Arsenal avanzado eliminado exitosamente de Supabase\n');

    // Verificar arsenales restantes
    console.log('📊 Arsenales restantes en Supabase:');
    const { data: remaining } = await supabase
      .from('nexus_documents')
      .select('category, title')
      .like('category', 'arsenal_%')
      .order('category');

    remaining.forEach(doc => {
      console.log(`   ✅ ${doc.category} - ${doc.title}`);
    });
  }
}

eliminarArsenalAvanzado();
