#!/usr/bin/env node

/**
 * Script para desplegar arsenal_12_niveles.txt a Supabase
 * Fecha: 17 Enero 2026
 * Versión: v4.0 JOBS/NAVAL
 * Contenido: Los 12 Niveles + Kit de Inicio (separado de compensación general)
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

async function deployArsenal12Niveles() {
  console.log('📤 Desplegando arsenal_12_niveles.txt a Supabase...\n');

  // Leer archivo arsenal_12_niveles.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_12_niveles.txt');
  const content = readFileSync(arsenalPath, 'utf8');

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');

  // Extraer versión
  const versionMatch = content.match(/Versión:\s*([\d.]+\s*[A-Z\/]*)/);
  const version = versionMatch ? versionMatch[1].trim() : '4.0';
  console.log('📌 Versión detectada:', version);

  // Contar respuestas
  const nivelesCount = (content.match(/NIVELES_\d+/g) || []).length;
  const invCount = (content.match(/INV_\d+/g) || []).length;
  const totalRespuestas = nivelesCount + invCount;

  console.log('📌 Respuestas detectadas:');
  console.log(`   - NIVELES: ${nivelesCount}`);
  console.log(`   - INV: ${invCount}`);
  console.log(`   - TOTAL: ${totalRespuestas}`);

  // Verificar si ya existe el documento
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'arsenal_12_niveles')
    .limit(1);

  if (existing && existing.length > 0) {
    // Actualizar documento existente
    console.log('\n📝 Documento existente encontrado. Actualizando...');

    const { data, error } = await supabase
      .from('nexus_documents')
      .update({
        title: `Arsenal Los 12 Niveles v${version}`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            NIVELES: nivelesCount,
            INV: invCount
          },
          audiencia: 'Socios activos (modelos análogo e híbrido)',
          trigger_keywords: ['12 niveles', 'kit de inicio', 'kit inicial'],
          fecha_actualizacion: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('category', 'arsenal_12_niveles')
      .select();

    if (error) {
      console.error('❌ Error al actualizar:', error);
      process.exit(1);
    }

    console.log('\n✅ Arsenal 12 Niveles actualizado exitosamente');
    console.log('📌 ID:', data[0].id);
    console.log('📌 Updated at:', data[0].updated_at);
  } else {
    // Insertar nuevo documento
    console.log('\n📝 Creando nuevo documento...');

    const { data, error } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_12_niveles',
        title: `Arsenal Los 12 Niveles v${version}`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            NIVELES: nivelesCount,
            INV: invCount
          },
          audiencia: 'Socios activos (modelos análogo e híbrido)',
          trigger_keywords: ['12 niveles', 'kit de inicio', 'kit inicial'],
          fecha_creacion: new Date().toISOString()
        }
      })
      .select();

    if (error) {
      console.error('❌ Error al insertar:', error);
      process.exit(1);
    }

    console.log('\n✅ Arsenal 12 Niveles creado exitosamente');
    console.log('📌 ID:', data[0].id);
  }

  // Verificaciones de contenido
  console.log('\n🔍 Verificando contenido v4.0 JOBS/NAVAL...\n');

  const checks = [
    { name: '[Concepto Nuclear] presente', found: content.includes('[Concepto Nuclear]') },
    { name: 'NIVELES_01 (Qué son Los 12 Niveles)', found: content.includes('NIVELES_01') },
    { name: 'Terminología limpia (Regalía de Equipo)', found: content.includes('Regalía de Equipo') },
    { name: 'Sin "Bono Binario" (MLM cleanup)', found: !content.includes('Bono Binario') },
    { name: 'Lado de menor crecimiento (no pierna débil)', found: content.includes('lado de menor crecimiento') },
    { name: 'Advertencia ⚠️ Kit de Inicio', found: content.includes('⚠️') },
    { name: 'Kit Inicio $443,600', found: content.includes('443,600') || content.includes('443.600') },
    { name: 'Tabla de proyección (103 millones)', found: content.includes('103') },
    { name: 'Porcentajes correctos (10%, 15%, 16%, 17%)', found: content.includes('10%') && content.includes('15%') && content.includes('16%') && content.includes('17%') },
    { name: 'INV_06 (Catálogo productos)', found: content.includes('INV_06') && content.includes('Gano Café') }
  ];

  let passed = 0;
  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
    if (check.found) passed++;
  });

  console.log(`\n📊 Verificaciones: ${passed}/${checks.length} pasadas`);

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Próximos pasos:');
  console.log('   1. Ejecutar: node scripts/fragmentar-arsenales-voyage.mjs');
  console.log('   2. Verificar fragmentos en Supabase Dashboard');
  console.log('   3. Probar Queswa con preguntas como:');
  console.log('      - "¿Qué son los 12 niveles?"');
  console.log('      - "¿Cuánto cuesta el kit de inicio?"');
  console.log('      - "¿Cómo gano con el kit?"');
  console.log('');
}

deployArsenal12Niveles().catch(console.error);
