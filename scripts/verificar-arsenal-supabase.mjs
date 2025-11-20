#!/usr/bin/env node

/**
 * Script para verificar qué versión de arsenal_inicial está en Supabase
 * Uso: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/verificar-arsenal-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local manualmente
const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) {
        supabaseUrl = value.trim();
      }
      if (key.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && !supabaseKey) {
        supabaseKey = value.trim();
      }
    }
  }
} catch (error) {
  console.warn('⚠️  No se pudo leer .env.local, usando variables de entorno');
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarArsenal() {
  console.log('🔍 Verificando arsenal_inicial en Supabase...\n');

  // Primero, obtener todos los documentos para ver la estructura
  const { data: allDocs, error: listError } = await supabase
    .from('nexus_documents')
    .select('*')
    .limit(5);

  if (listError) {
    console.error('❌ Error al listar documentos:', listError.message);
    return;
  }

  console.log('📋 Estructura de documentos disponibles:');
  if (allDocs && allDocs.length > 0) {
    console.log('   Campos:', Object.keys(allDocs[0]).join(', '));
    console.log('   Total documentos en muestra:', allDocs.length);
  }

  // Buscar el documento arsenal_inicial
  const { data, error } = await supabase
    .from('nexus_documents')
    .select('*')
    .eq('category', 'arsenal_inicial')
    .single();

  if (error) {
    console.error('❌ Error al consultar:', error.message);
    return;
  }

  if (!data) {
    console.log('❌ No se encontró el documento arsenal_inicial');
    return;
  }

  console.log('\n✅ Documento encontrado:');
  console.log('   ID:', data.id);
  console.log('   Category:', data.category);
  console.log('   Title:', data.title);
  console.log('\n📄 PRIMERAS 50 LÍNEAS DEL CONTENIDO:\n');
  console.log('─'.repeat(80));

  const lines = data.content.split('\n').slice(0, 50);
  lines.forEach((line, i) => {
    console.log(`${(i + 1).toString().padStart(2, '0')}: ${line}`);
  });

  console.log('─'.repeat(80));
  console.log(`\n📊 Total de líneas en el documento: ${data.content.split('\n').length}`);
  console.log(`📊 Total de caracteres: ${data.content.length}`);

  // Detectar versión
  const versionMatch = data.content.match(/v(\d+\.\d+)/);
  if (versionMatch) {
    console.log(`\n🏷️  Versión detectada: v${versionMatch[1]}`);
  }

  // Buscar secciones WHY
  const tieneWHY = data.content.includes('WHY_01') || data.content.includes('PREGUNTAS SOBRE NUESTRA CREENCIA');
  console.log(`\n🎯 Tiene sección WHY: ${tieneWHY ? '✅ SÍ (v9.0)' : '❌ NO (v8.5 o anterior)'}`);
}

verificarArsenal().catch(console.error);
