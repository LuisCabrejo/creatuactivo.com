#!/usr/bin/env node

/**
 * Script para actualizar arsenales con lenguaje simple (abuela de 75 años)
 * Elimina términos técnicos y reemplaza con vocabulario comprensible
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Diccionario de reemplazos (términos técnicos → lenguaje simple)
const REEMPLAZOS = {
  // Términos técnicos prohibidos
  'Framework IAA': 'el método',
  'framework IAA': 'el método',
  'FRAMEWORK IAA': 'EL MÉTODO',

  // Nombres técnicos internos
  'NodeX': 'la aplicación',
  'Modelo DEA': 'el sistema',
  'arquitectura': 'estructura',
  'ecosistema': 'conjunto de herramientas',
  'plataforma': 'aplicación',
  'metodología': 'método',

  // Términos que se mantienen SOLO cuando son apropiados
  // Pero se simplifican cuando están en contextos técnicos
};

// Función para aplicar reemplazos
function aplicarReemplazos(texto) {
  let textoActualizado = texto;

  for (const [termino, reemplazo] of Object.entries(REEMPLAZOS)) {
    // Usar regex global con case sensitive
    const regex = new RegExp(termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    textoActualizado = textoActualizado.replace(regex, reemplazo);
  }

  return textoActualizado;
}

async function actualizarArsenales() {
  console.log('🔄 Actualizando arsenales con lenguaje simple...\n');

  try {
    // 1. Obtener todos los documentos
    const { data: documentos, error: fetchError } = await supabase
      .from('nexus_documents')
      .select('*')
      .in('category', ['arsenal_inicial', 'arsenal_manejo', 'arsenal_cierre', 'catalogo_productos']);

    if (fetchError) {
      throw new Error(`Error obteniendo documentos: ${fetchError.message}`);
    }

    console.log(`📚 Encontrados ${documentos.length} documentos para revisar\n`);

    let actualizados = 0;
    let sinCambios = 0;

    // 2. Procesar cada documento
    for (const doc of documentos) {
      const contenidoOriginal = doc.content || '';
      const contenidoActualizado = aplicarReemplazos(contenidoOriginal);

      // Solo actualizar si hubo cambios
      if (contenidoOriginal !== contenidoActualizado) {
        const { error: updateError } = await supabase
          .from('nexus_documents')
          .update({
            content: contenidoActualizado,
            updated_at: new Date().toISOString()
          })
          .eq('id', doc.id);

        if (updateError) {
          console.error(`❌ Error actualizando documento ${doc.id}:`, updateError.message);
        } else {
          console.log(`✅ Actualizado: ${doc.category} - ${doc.title.substring(0, 50)}...`);
          actualizados++;
        }
      } else {
        sinCambios++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMEN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Documentos actualizados: ${actualizados}`);
    console.log(`➖ Sin cambios: ${sinCambios}`);
    console.log(`📝 Total procesados: ${documentos.length}\n`);

    if (actualizados > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 PRÓXIMO PASO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('1️⃣  Reiniciar servidor dev (para limpiar cache):');
      console.log('   npm run dev\n');
      console.log('2️⃣  Probar NEXUS en creatuactivo.com');
      console.log('3️⃣  Verificar que NO use términos técnicos\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
actualizarArsenales();
