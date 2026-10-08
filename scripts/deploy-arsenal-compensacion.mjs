#!/usr/bin/env node

/**
 * Script para desplegar arsenal_compensacion.txt a Supabase
 * Fecha: 18 Enero 2026
 * Versión: v2.0
 * Contenido: GEN5 + Binario + PV/CV + Paquetes + Auto Envio
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
  // La cabecera dice «**Versión actual: v8.13**»; el patrón viejo no casaba y el
  // respaldo '2.0' dejaba el título congelado en «v2.0» sin que se notara.
  const versionMatch = content.match(/\*\*Versión actual: v([\d.]+)\*\*/);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  console.log('📌 Version detectada:', version);

  // Contar respuestas por categoría v2.0
  const gen5Count = (content.match(/COMP_GEN5_\d+/g) || []).length;
  const pvCount = (content.match(/COMP_PV_\d+/g) || []).length;
  const binCount = (content.match(/COMP_BIN_\d+/g) || []).length;
  const paqCount = (content.match(/COMP_PAQ_\d+/g) || []).length;
  const autoCount = (content.match(/COMP_AUTO_\d+/g) || []).length;
  const ventaCount = (content.match(/COMP_VENTA_\d+/g) || []).length;
  const totalRespuestas = gen5Count + pvCount + binCount + paqCount + autoCount + ventaCount;

  console.log('📌 Respuestas detectadas:');
  console.log(`   - COMP_GEN5: ${gen5Count}`);
  console.log(`   - COMP_PV: ${pvCount}`);
  console.log(`   - COMP_BIN: ${binCount}`);
  console.log(`   - COMP_PAQ: ${paqCount}`);
  console.log(`   - COMP_AUTO: ${autoCount}`);
  console.log(`   - COMP_VENTA: ${ventaCount}`);
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
        title: `Arsenal Compensacion v${version} - GEN5 + Binario + PV`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            COMP_GEN5: gen5Count,
            COMP_PV: pvCount,
            COMP_BIN: binCount,
            COMP_PAQ: paqCount,
            COMP_AUTO: autoCount,
            COMP_VENTA: ventaCount
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
        title: `Arsenal Compensacion v${version} - GEN5 + Binario + PV`,
        content: content,
        metadata: {
          version: version,
          respuestas_totales: totalRespuestas,
          categorias: {
            COMP_GEN5: gen5Count,
            COMP_PV: pvCount,
            COMP_BIN: binCount,
            COMP_PAQ: paqCount,
            COMP_AUTO: autoCount,
            COMP_VENTA: ventaCount
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

  // Verificaciones de contenido v2.0
  console.log('\n🔍 Verificando contenido...\n');

  const checks = [
    { name: 'GEN5 - Regla del techo', found: /determina su techo/i.test(content) && /determina lo que genera/i.test(content) },
    // Ocho de estas salían en rojo con el contenido presente: buscaban el formato de la v2.0.
    // Revisadas contra el .txt el 8 oct 2026. El ciclo es de lunes a domingo (dato del Director, ago 2026).
    { name: 'GEN5 - Techos por paquete ($25 / $75 / $150)', found: content.includes('| Gen 1 | $25 USD | $75 USD | $150 USD |') },
    { name: 'Gen 5 Doble (100 PV)', found: content.includes('100 PV') && content.includes('DOBLE') },
    { name: 'Ciclo semanal de lunes a domingo', found: content.includes('lunes a domingo') },
    { name: 'PV/CV/GCV definiciones', found: content.includes('COMP_PV_01') && content.includes('COMP_PV_04') },
    { name: 'Binario porcentajes (10-17%)', found: content.includes('15%') && content.includes('16%') && content.includes('17%') },
    { name: 'Estrategias para mantener el %', found: content.includes('Estrategias para Mantener % Alto') },
    { name: 'Regla mayor porcentaje', found: content.includes('MAS ALTO') },
    { name: 'Paquetes: qué trae cada uno (COMP_PAQ_01 a 05)', found: [1, 2, 3, 4, 5].every(n => content.includes(`### COMP_PAQ_0${n}:`)) },
    { name: 'Auto Envío (COMP_AUTO_01)', found: content.includes('### COMP_AUTO_01:') },
    { name: 'Rangos CV semanal (Bronce 1.500 → 11%)', found: /\| Bronce \| 1[.,]500 \| 11% \|/.test(content) }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Proximos pasos:');
  console.log('   1. Ejecutar: node scripts/fragmentar-arsenales-voyage.mjs');
  console.log('   2. Probar Queswa con preguntas como:');
  console.log('      - "¿Cuanto gano por GEN5 si soy ESP-1?"');
  console.log('      - "¿Cual es la regla del techo?"');
  console.log('      - "¿Como funciona el bono doble de Gen 5?"');
  console.log('      - "¿Cuantos productos trae el ESP-3?"');
  console.log('');
}

deployArsenalCompensacion().catch(console.error);
