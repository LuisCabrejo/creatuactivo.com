#!/usr/bin/env node

/**
 * Script para aplicar arsenal_cierre.txt (Jobs-Style) a Supabase
 * Fecha: 20 Noviembre 2025
 * Versión: Jobs-Style v1.0
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno desde .env.local en la raíz
const envPath = join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function aplicarArsenalCierre() {
  console.log('📤 Aplicando arsenal_cierre.txt (Jobs-Style) a Supabase...\n');

  // Leer archivo arsenal_cierre.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_cierre.txt');
  const fileContent = fs.readFileSync(arsenalPath, 'utf8');

  // Extraer contenido entre comillas del UPDATE
  const contentMatch = fileContent.match(/content = '([\s\S]+)'\s*WHERE/);
  if (!contentMatch) {
    console.error('❌ No se pudo extraer el contenido del archivo');
    console.error('Nota: Asegúrate de que el archivo tiene formato SQL UPDATE con content = \'...\' ');
    process.exit(1);
  }

  const content = contentMatch[1];

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');
  console.log('📌 Actualizando documento UUID: fe6a174c-8f06-4fc5-987a-5cc627d1ee6b');
  console.log('📌 Título: Arsenal Cierre - Jobs-Style v1.0\n');

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: 'Arsenal Cierre - Jobs-Style v1.0',
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'fe6a174c-8f06-4fc5-987a-5cc627d1ee6b')
    .select();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  console.log('✅ Arsenal Cierre actualizado exitosamente\n');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📌 Content length:', data[0].content.length, 'caracteres\n');

  // Verificaciones
  console.log('🔍 Verificando cambios Jobs-Style...\n');

  const checks = [
    {
      name: 'SIST_02: Herramientas tecnológicas (reescrito completo)',
      pattern: '¿Qué herramientas tecnológicas me proporciona CreaTuActivo.com?',
      found: data[0].content.includes('¿Qué herramientas tecnológicas me proporciona CreaTuActivo.com?')
    },
    {
      name: 'SIST_02: NEXUS mencionado explícitamente',
      pattern: 'NEXUS (IA)',
      found: data[0].content.includes('NEXUS (IA)') || data[0].content.includes('**NEXUS')
    },
    {
      name: 'Brand seeding: CreaTuActivo.com presente',
      pattern: 'CreaTuActivo.com',
      found: data[0].content.includes('CreaTuActivo.com')
    },
    {
      name: 'VAL_05: Brand seeding presente',
      pattern: 'CreaTuActivo.com',
      found: data[0].content.includes('VAL_05')
    },
    {
      name: 'Sección SIST (Sistema) presente',
      pattern: 'SIST_',
      found: data[0].content.includes('SIST_')
    }
  ];

  checks.forEach(check => {
    if (check.found) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
    }
  });

  console.log('\n🎉 Proceso completado\n');
}

aplicarArsenalCierre().catch(console.error);
