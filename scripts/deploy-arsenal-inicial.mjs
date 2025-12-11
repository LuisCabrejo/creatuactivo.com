#!/usr/bin/env node

/**
 * Script para desplegar arsenal_inicial.txt a Supabase
 * Fecha: 8 Diciembre 2025
 * Versión: v10.2 HÍBRIDO
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

async function deployArsenalInicial() {
  console.log('📤 Desplegando arsenal_inicial.txt a Supabase...\n');

  // Leer archivo arsenal_inicial.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const content = readFileSync(arsenalPath, 'utf8');

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');

  // Extraer versión
  const versionMatch = content.match(/v([\d.]+)\s+HÍBRIDO/);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  console.log('📌 Versión detectada:', version);

  // Actualizar en Supabase por categoría
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: `Arsenal Inicial v${version} HÍBRIDO`,
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('category', 'arsenal_inicial')
    .select();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No se encontró documento con category=arsenal_inicial');
    console.log('   Intentando insertar nuevo documento...');

    const { data: insertData, error: insertError } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_inicial',
        title: `Arsenal Inicial v${version} HÍBRIDO`,
        content: content
      })
      .select();

    if (insertError) {
      console.error('❌ Error al insertar:', insertError);
      process.exit(1);
    }

    console.log('✅ Documento insertado exitosamente');
    console.log('📌 ID:', insertData[0].id);
  } else {
    console.log('\n✅ Arsenal Inicial actualizado exitosamente');
    console.log('📌 ID:', data[0].id);
    console.log('📌 Updated at:', data[0].updated_at);
  }

  // Verificaciones
  console.log('\n🔍 Verificando contenido...\n');

  const checks = [
    { name: 'Versión HÍBRIDO', found: content.includes('HÍBRIDO') },
    { name: 'WHY_01 presente', found: content.includes('WHY_01') },
    { name: 'FREQ_03 tabla paquetes', found: content.includes('| Paquete | USD |') },
    { name: 'FREQ_04 tabla resultados', found: content.includes('| Tiempo | Resultado |') },
    { name: 'FREQ_06 tabla fases', found: content.includes('| Fase | Fechas |') },
    { name: 'FREQ_08 tabla Academia', found: content.includes('| Nivel | Enfoque |') },
    { name: 'FREQ_09 tabla costos', found: content.includes('| Concepto | Costo |') },
    { name: 'FREQ_11 tabla ganancias', found: content.includes('| Plazo | Tipo |') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
}

deployArsenalInicial().catch(console.error);
