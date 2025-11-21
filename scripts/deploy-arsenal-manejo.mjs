#!/usr/bin/env node

/**
 * Script para aplicar arsenal_manejo.txt (Jobs-Style) a Supabase
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

async function aplicarArsenalManejo() {
  console.log('📤 Aplicando arsenal_manejo.txt (Jobs-Style) a Supabase...\n');

  // Leer archivo arsenal_manejo.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_manejo.txt');
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
  console.log('📌 Actualizando documento UUID: d1222011-c8e1-43dd-bebf-9911895b830a');
  console.log('📌 Título: Arsenal Manejo - Jobs-Style v1.0\n');

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: 'Arsenal Manejo - Jobs-Style v1.0',
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'd1222011-c8e1-43dd-bebf-9911895b830a')
    .select();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  console.log('✅ Arsenal Manejo actualizado exitosamente\n');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📌 Content length:', data[0].content.length, 'caracteres\n');

  // Verificaciones
  console.log('🔍 Verificando cambios Jobs-Style...\n');

  const checks = [
    {
      name: 'OBJ_03: Restaurant analogy',
      pattern: 'Alguna vez has recomendado un restaurante',
      found: data[0].content.includes('Alguna vez has recomendado un restaurante')
    },
    {
      name: 'OBJ_07: Fecha correcta (17 Nov)',
      pattern: '17 Nov - 30 Nov 2025',
      found: data[0].content.includes('17 Nov - 30 Nov 2025')
    },
    {
      name: 'Brand seeding: CreaTuActivo.com presente',
      pattern: 'CreaTuActivo.com',
      found: data[0].content.includes('CreaTuActivo.com')
    },
    {
      name: 'TECH_03: Zona horaria (hora Colombia)',
      pattern: 'hora Colombia',
      found: data[0].content.includes('hora Colombia')
    },
    {
      name: 'TECH_15: "Director del sistema" (NO "Arquitecto")',
      pattern: 'Director del sistema',
      found: data[0].content.includes('Director del sistema')
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

aplicarArsenalManejo().catch(console.error);
