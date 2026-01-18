#!/usr/bin/env node
/**
 * Script para actualizar el catálogo de productos en Supabase
 * Versión 6.0 JOBS/NAVAL - [Concepto Nuclear] + Estilo Naval
 * Fecha: 17 Enero 2026
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function actualizarCatalogo() {
  console.log('📦 ACTUALIZACIÓN CATÁLOGO DE PRODUCTOS EN SUPABASE\n');
  console.log('='.repeat(60));
  console.log('');

  // Leer contenido del archivo actualizado
  const catalogoPath = join(__dirname, '..', 'knowledge_base', 'catalogo_productos.txt');
  const contenido = readFileSync(catalogoPath, 'utf8');

  console.log(`📄 Archivo leído: catalogo_productos.txt`);
  console.log(`📊 Tamaño: ${contenido.length} caracteres`);
  console.log('');

  // Actualizar en Supabase
  console.log('🔄 Actualizando en Supabase...\n');

  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      content: contenido,
      title: 'Catálogo Oficial Productos Gano Excel 2026 v6.0',
      metadata: {
        version: '6.0 JOBS/NAVAL',
        last_updated: new Date().toISOString(),
        changes: [
          '[Concepto Nuclear] agregado a cada sección',
          'Estilo Naval/Jobs (frases cortas, sin exclamaciones)',
          'Actualización año 2025 → 2026',
          'Reorganización por categorías de respuesta'
        ],
        total_productos: 22,
        categorias: [
          'Estrategia de Portafolio',
          'Respaldo Científico',
          'Bebidas Funcionales',
          'Línea LUVOCO',
          'Suplementos Avanzados',
          'Cuidado Personal',
          'FAQs'
        ]
      },
      updated_at: new Date().toISOString()
    })
    .eq('category', 'catalogo_productos');

  if (error) {
    console.error('❌ Error al actualizar Supabase:', error);
    process.exit(1);
  }

  console.log('✅ Catálogo actualizado correctamente en Supabase\n');
  console.log('='.repeat(60));
  console.log('\n📋 CAMBIOS v6.0 JOBS/NAVAL:\n');
  console.log('  ✅ [Concepto Nuclear] en cada sección');
  console.log('  ✅ Estilo Naval/Jobs (frases cortas)');
  console.log('  ✅ Año actualizado: 2025 → 2026');
  console.log('  ✅ Reorganizado por categorías de respuesta');
  console.log('');
  console.log('🎯 Catálogo v6.0 JOBS/NAVAL desplegado correctamente');
  console.log('');
}

actualizarCatalogo().catch(console.error);
