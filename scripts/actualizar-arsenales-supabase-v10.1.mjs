#!/usr/bin/env node
/**
 * Script para actualizar Arsenal Inicial v10.1 HÍBRIDO + Arsenal Avanzado v3.0
 * con lenguaje quirúrgico en Supabase
 *
 * Cambios aplicados:
 * - Patrones de "Distribución Masiva" + "SOCIO" + "3 componentes"
 * - Corrección semántica: "tecnología propietaria" (no "patente mundial")
 * - "Columna financiera alterna" para emprendedores
 * - Reducción quirúrgica de respuestas largas
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  console.error('Asegúrate de que .env.local tenga:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function actualizarArsenalInicial() {
  console.log('\n📝 Actualizando Arsenal Inicial v10.1 HÍBRIDO...');

  const contenido = readFileSync(
    join(__dirname, '../knowledge_base/arsenal_inicial_v10.1_hibrido.txt'),
    'utf-8'
  );

  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      content: contenido,
      title: 'Arsenal Inicial v10.1 HÍBRIDO - Distribución Masiva',
      metadata: {
        version: '10.1_hibrido_quirurgico',
        fecha_actualizacion: new Date().toISOString(),
        cambios: [
          'Lenguaje quirúrgico: "Distribución Masiva" + "SOCIO" + "3 componentes"',
          'Corrección semántica: "tecnología propietaria" (NO "patente mundial")',
          'FREQ_01: Socio de proyecto de expansión continental',
          'FREQ_02: Jeff Bezos + socio para distribución masiva (quirúrgico)',
          'FREQ_03-07: Versiones reducidas (-40% a -78%)',
          'OBJ_01-03: Versiones ultra-simplificadas',
          'Integra "columna financiera alterna" para emprendedores',
          'Tecnología exclusiva del equipo'
        ],
        estrategia: 'Combina empatía (v9.0) + autoridad tecnológica (v10.0)',
        objetivo: 'Máxima comprensión (abuela 75 años) + Máximo posicionamiento (empresarios)'
      }
    })
    .eq('category', 'arsenal_inicial');

  if (error) {
    console.error('❌ Error actualizando arsenal_inicial:', error);
    return false;
  }

  console.log('✅ Arsenal Inicial v10.1 HÍBRIDO actualizado exitosamente');
  console.log(`   - ${contenido.split('\n').length} líneas`);
  console.log(`   - ${(contenido.length / 1024).toFixed(1)} KB`);
  return true;
}

async function actualizarArsenalAvanzado() {
  console.log('\n📝 Actualizando Arsenal Avanzado v3.0...');

  const contenido = readFileSync(
    join(__dirname, '../knowledge_base/arsenal_avanzado.txt'),
    'utf-8'
  );

  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      content: contenido,
      title: 'Arsenal Avanzado v3.0 - Quirúrgico Distribución Masiva',
      metadata: {
        version: '3.0_quirurgico',
        fecha_actualizacion: new Date().toISOString(),
        cambios: [
          'OBJ_01: Integra "SOCIO" + "3 componentes" + "tecnología exclusiva del equipo"',
          'OBJ_10: "Columna financiera alterna" (diversificación)',
          'COMP_06: Refuerza "columna financiera alterna"',
          'VAL_05: "Te invitamos a ser SOCIO" + 3 componentes explícitos',
          'VAL_10: Contraste "tú puedes campeón" vs "SOCIO con 3 componentes"',
          'SIST_05: "SOCIO con tecnología exclusiva" + 3 componentes',
          'Corrección semántica: "tecnología propietaria" (NO "patente mundial")',
          '63 respuestas consolidadas (OBJ: 11 + TECH: 16 + COMP: 8 + SIST: 12 + VAL: 11 + ESC: 5)'
        ],
        categorias: {
          OBJ: 11,
          TECH: 16,
          COMP: 8,
          SIST: 12,
          VAL: 11,
          ESC: 5
        },
        total_respuestas: 63
      }
    })
    .eq('category', 'arsenal_manejo');

  if (error) {
    console.error('❌ Error actualizando arsenal_manejo:', error);
    return false;
  }

  console.log('✅ Arsenal Avanzado v3.0 actualizado exitosamente');
  console.log(`   - ${contenido.split('\n').length} líneas`);
  console.log(`   - ${(contenido.length / 1024).toFixed(1)} KB`);
  return true;
}

async function verificarActualizacion() {
  console.log('\n🔍 Verificando actualizaciones...');

  const { data, error } = await supabase
    .from('nexus_documents')
    .select('category, title, metadata')
    .in('category', ['arsenal_inicial', 'arsenal_manejo']);

  if (error) {
    console.error('❌ Error verificando:', error);
    return;
  }

  console.log('\n📊 Estado actual en Supabase:');
  data.forEach(doc => {
    console.log(`\n   ${doc.category}:`);
    console.log(`   - Título: ${doc.title}`);
    console.log(`   - Versión: ${doc.metadata?.version || 'N/A'}`);
    console.log(`   - Fecha: ${doc.metadata?.fecha_actualizacion || 'N/A'}`);
  });
}

// Ejecutar actualización
async function main() {
  console.log('🚀 ACTUALIZACIÓN ARSENALES NEXUS v10.1 + v3.0 QUIRÚRGICO');
  console.log('=========================================================\n');

  const inicialOk = await actualizarArsenalInicial();
  const avanzadoOk = await actualizarArsenalAvanzado();

  if (inicialOk && avanzadoOk) {
    await verificarActualizacion();
    console.log('\n✅ ACTUALIZACIÓN COMPLETA');
    console.log('\n📌 Próximo paso: Actualizar System Prompt v13.7');
  } else {
    console.log('\n❌ ACTUALIZACIÓN INCOMPLETA - Revisar errores arriba');
    process.exit(1);
  }
}

main().catch(console.error);
