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

  // Chequeos vivos (9 sep 2026). Los anteriores buscaban «BLOQUE 2: PREGUNTAS»,
  // «OBJ_03» y las analogías del Peaje: nombres de una estructura que ya no
  // existe, así que salían en rojo en cada despliegue bueno y ensuciaban la
  // lectura. Lo que vale comprobar es lo que el motor necesita: la versión en
  // la cabecera y los candados de doble fuente.
  const respuestas = (content.match(/^### \*\*[A-Z_]+\d*[A-Z_]*:/gm) || []).length;
  const candado = (id) => new RegExp(`### \\*\\*${id}:[\\s\\S]*?<verbatim_lock>`).test(content);
  const checks = [
    { name: 'Versión actual en la cabecera', found: /\*\*Versión actual: v[\d.]+\*\*/.test(content) },
    { name: `Respuestas encontradas: ${respuestas}`, found: respuestas > 40 },
    { name: 'WHY_01 con candado', found: candado('WHY_01') },
    { name: 'WHY_02 con candado (doble fuente con respuestas-maestras.ts)', found: candado('WHY_02') },
    { name: 'EAM_01 con candado (doble fuente con respuestas-maestras.ts)', found: candado('EAM_01') },
    { name: 'EMPRESA_DIGITAL_01 con candado (doble fuente)', found: candado('EMPRESA_DIGITAL_01') },
    { name: 'Sin marcadores viejos [VERBATIM_LOCK]', found: !content.includes('[VERBATIM_LOCK]') },
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
}

deployArsenalInicial().catch(console.error);
