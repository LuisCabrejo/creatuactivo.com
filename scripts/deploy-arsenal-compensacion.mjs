#!/usr/bin/env node

/**
 * Script para desplegar arsenal_compensacion.txt a Supabase
 * Fecha: 9 Diciembre 2025
 * Versión: v1.0
 * Contenido: Reto 12 Días + Inversión + Compensación
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local manualmente
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function deployArsenalCompensacion() {
  console.log('📤 Desplegando arsenal_compensacion.txt a Supabase...\n');

  // Leer archivo arsenal_compensacion.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_compensacion.txt');
  const content = readFileSync(arsenalPath, 'utf8');

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');

  // Extraer versión
  const versionMatch = content.match(/Versión:\s*([\d.]+)/);
  const version = versionMatch ? versionMatch[1] : '1.0';
  console.log('📌 Versión detectada:', version);

  // Contar respuestas
  const retoCount = (content.match(/RETO_\d+/g) || []).length;
  const invCount = (content.match(/INV_\d+/g) || []).length;
  const compCount = (content.match(/COMP_\d+/g) || []).length;
  const objinvCount = (content.match(/OBJINV_\d+/g) || []).length;
  const totalRespuestas = retoCount + invCount + compCount + objinvCount;

  console.log('📌 Respuestas detectadas:');
  console.log(`   - RETO: ${retoCount}`);
  console.log(`   - INV: ${invCount}`);
  console.log(`   - COMP: ${compCount}`);
  console.log(`   - OBJINV: ${objinvCount}`);
  console.log(`   - TOTAL: ${totalRespuestas}`);

  // Verificar si ya existe el documento
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'arsenal_compensacion')
    .limit(1);

  if (existing && existing.length > 0) {
    // Actualizar documento existente
    console.log('\n📝 Documento existente encontrado. Actualizando...');

    const { data, error } = await supabase
      .from('nexus_documents')
      .update({
        title: `Arsenal Compensación v${version} - Reto 12 Días`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            RETO: retoCount,
            INV: invCount,
            COMP: compCount,
            OBJINV: objinvCount
          },
          fecha_actualizacion: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('category', 'arsenal_compensacion')
      .select();

    if (error) {
      console.error('❌ Error al actualizar:', error);
      process.exit(1);
    }

    console.log('\n✅ Arsenal Compensación actualizado exitosamente');
    console.log('📌 ID:', data[0].id);
    console.log('📌 Updated at:', data[0].updated_at);
  } else {
    // Insertar nuevo documento
    console.log('\n📝 Creando nuevo documento...');

    const { data, error } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_compensacion',
        title: `Arsenal Compensación v${version} - Reto 12 Días`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            RETO: retoCount,
            INV: invCount,
            COMP: compCount,
            OBJINV: objinvCount
          },
          fecha_creacion: new Date().toISOString()
        }
      })
      .select();

    if (error) {
      console.error('❌ Error al insertar:', error);
      process.exit(1);
    }

    console.log('\n✅ Arsenal Compensación creado exitosamente');
    console.log('📌 ID:', data[0].id);
  }

  // Verificaciones de contenido
  console.log('\n🔍 Verificando contenido...\n');

  const checks = [
    { name: 'RETO_01 (Qué es el Reto)', found: content.includes('RETO_01') },
    { name: 'RETO_02 (Inversión mínima)', found: content.includes('$443,600') },
    { name: 'RETO_03 (Proyección)', found: content.includes('$95,823,000') || content.includes('95.8 millones') },
    { name: 'INV_02 (Tabla paquetes)', found: content.includes('Kit de Inicio') && content.includes('ESP3') },
    { name: 'COMP_02 (Bono Binario)', found: content.includes('binario') || content.includes('Binario') },
    { name: 'Porcentajes correctos (15%, 16%, 17%)', found: content.includes('15%') && content.includes('16%') && content.includes('17%') },
    { name: 'Kit Inicio 10%', found: content.includes('Kit') && content.includes('10%') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Próximos pasos:');
  console.log('   1. Verificar en Supabase Dashboard que el documento existe');
  console.log('   2. Probar NEXUS con preguntas como:');
  console.log('      - "¿Qué es el Reto de los 12 Días?"');
  console.log('      - "¿Cuál es la inversión mínima?"');
  console.log('      - "¿Cuánto puedo ganar con el reto?"');
  console.log('');
}

deployArsenalCompensacion().catch(console.error);
