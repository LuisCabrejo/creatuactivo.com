#!/usr/bin/env node
/**
 * Sube knowledge_base/catalogo_productos.txt como documento padre a Supabase.
 * La versión la lee de la cabecera del archivo.
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

  // La versión sale de la cabecera («**Versión actual: v7.13**»). Hasta el 8 oct 2026
  // el título y la lista de cambios estaban fijos en la v6.0 de enero, y el health
  // check de /api/nexus reportaba esa versión. El historial vive en CHANGELOG-arsenales.md.
  const versionMatch = contenido.match(/\*\*Versión actual: v([\d.]+)\*\*/);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  console.log(`📌 Versión detectada: ${version}\n`);

  // Actualizar en Supabase (el documento padre, en todos los tenants que lo tengan)
  console.log('🔄 Actualizando en Supabase...\n');

  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      content: contenido,
      title: `Catálogo Oficial Productos Gano Excel v${version}`,
      metadata: {
        version,
        last_updated: new Date().toISOString(),
        total_productos: 22
      },
      updated_at: new Date().toISOString()
    })
    .eq('category', 'catalogo_productos')
    .select('tenant_id');

  if (error) {
    console.error('❌ Error al actualizar Supabase:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.error('❌ No se encontró ningún documento con category=catalogo_productos');
    process.exit(1);
  }

  console.log(`✅ Catálogo v${version} actualizado en: ${data.map(d => d.tenant_id).join(', ')}`);
  console.log('');
  console.log('⚠️  Esto sube el documento padre. Si cambió el cuerpo de un fragmento,');
  console.log('   siga la receta de despliegue de CLAUDE.md (purgar, fragmentar, clonar).');
  console.log('');
}

actualizarCatalogo().catch(console.error);
