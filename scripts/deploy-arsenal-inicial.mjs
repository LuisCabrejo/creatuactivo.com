#!/usr/bin/env node

/**
 * Script para desplegar arsenal_inicial.txt a Supabase
 * Fecha: 17 Enero 2026
 * Versión: v12.4 PEAJE
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

  // Extraer versión (soporta HÍBRIDO y PEAJE)
  const versionMatch = content.match(/([\d.]+)\s+(HÍBRIDO|PEAJE|JOBS)/i);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  const versionTag = versionMatch ? versionMatch[2].toUpperCase() : 'PEAJE';
  console.log('📌 Versión detectada:', version, versionTag);

  // Actualizar en Supabase por categoría
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: `Arsenal Inicial v${version} ${versionTag}`,
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
        title: `Arsenal Inicial v${version} ${versionTag}`,
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
    { name: 'Versión PEAJE/HÍBRIDO', found: content.includes('PEAJE') || content.includes('HÍBRIDO') },
    { name: 'WHY_01 presente', found: content.includes('WHY_01') },
    { name: 'WHY_02 Peaje', found: content.includes('[Concepto Nuclear]') },
    { name: 'FREQ_01-22 presentes', found: content.includes('FREQ_22') },
    { name: 'CRED_01-04 presentes', found: content.includes('CRED_04') },
    { name: 'OBJ_01-03 presentes', found: content.includes('OBJ_03') },
    { name: 'Analogías Jobs Style', found: content.includes('Peaje') || content.includes('Acueducto') },
    { name: 'Bloque WHY', found: content.includes('BLOQUE 1: PROPÓSITO') },
    { name: 'Bloque FREQ', found: content.includes('BLOQUE 2: PREGUNTAS') },
    { name: 'Bloque CRED', found: content.includes('BLOQUE 3: CONFIANZA') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
}

deployArsenalInicial().catch(console.error);
