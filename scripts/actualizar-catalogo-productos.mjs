#!/usr/bin/env node
/**
 * Script para actualizar el catálogo de productos en Supabase
 * Versión 3.1 - Con correcciones semánticas (patente → tecnología propietaria)
 * Fecha: 3 Dic 2025
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
      title: 'Catálogo Oficial Productos Gano Excel 2025',
      metadata: {
        version: '3.1',
        last_updated: new Date().toISOString(),
        changes: [
          'Eliminadas todas las referencias incorrectas a "patente"',
          'Actualizado con semántica correcta: secretos industriales + tecnología propietaria',
          'Agregada información del fundador Dr. Leow Soon Seng',
          'Agregadas certificaciones internacionales (NPRA, INVIMA, TGA, Halal JAKIM)',
          'Enriquecido con detalles de tecnologías propietarias (cultivo de tejidos, sustrato exclusivo, extracción dual, spray drying)'
        ],
        total_productos: 22,
        categorias: [
          'Bebidas funcionales',
          'Línea Premium LUVOCO',
          'Suplementos avanzados',
          'Cuidado personal natural'
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
  console.log('\n📋 CAMBIOS APLICADOS:\n');
  console.log('  ❌ Eliminado: Referencias a "patente mundial"');
  console.log('  ✅ Agregado: Secretos industriales como protección principal');
  console.log('  ✅ Agregado: Tecnologías propietarias detalladas');
  console.log('  ✅ Agregado: Dr. Leow Soon Seng (fundador)');
  console.log('  ✅ Agregado: Certificaciones internacionales');
  console.log('  ✅ Actualizado: 21 ocurrencias "patentado" → "propietario"');
  console.log('');
  console.log('🎯 SIGUIENTE PASO:');
  console.log('   Hacer deploy a producción: git push origin main');
  console.log('');
}

actualizarCatalogo().catch(console.error);
