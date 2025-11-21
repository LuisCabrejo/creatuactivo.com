#!/usr/bin/env node

/**
 * Script para aplicar arsenal_inicial.txt (Jobs-Style v9.0) a Supabase
 * Fecha: 20 Noviembre 2025
 * Versión: Jobs-Style v9.0
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

async function aplicarArsenalInicial() {
  console.log('📤 Aplicando arsenal_inicial.txt (Jobs-Style v9.0) a Supabase...\n');

  // Leer archivo arsenal_inicial.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_inicial.txt');
  const fileContent = fs.readFileSync(arsenalPath, 'utf8');

  // Extraer contenido entre comillas del UPDATE
  const contentMatch = fileContent.match(/content = '([\s\S]+)'\s*,?\s*updated_at/);
  if (!contentMatch) {
    console.error('❌ No se pudo extraer el contenido del archivo');
    console.error('Nota: Asegúrate de que el archivo tiene formato SQL UPDATE con content = \'...\' ');
    process.exit(1);
  }

  const content = contentMatch[1];

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');
  console.log('📌 Actualizando documento UUID: 2c3e3a8b-f75e-4c78-8bb2-630c7d8b60a7');
  console.log('📌 Título: Arsenal Inicial - Jobs-Style v9.0\n');

  // Actualizar en Supabase
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: 'Arsenal Inicial - Jobs-Style v9.0',
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('id', '2c3e3a8b-f75e-4c78-8bb2-630c7d8b60a7')
    .select();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  console.log('✅ Arsenal Inicial actualizado exitosamente\n');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📌 Content length:', data[0].content.length, 'caracteres\n');

  // Verificaciones
  console.log('🔍 Verificando cambios Jobs-Style...\n');

  const checks = [
    {
      name: 'Versión v9.0',
      pattern: 'v9.0',
      found: data[0].content.includes('v9.0')
    },
    {
      name: 'Fecha correcta (17 Nov - 30 Nov 2025)',
      pattern: '17 Nov - 30 Nov 2025',
      found: data[0].content.includes('17 Nov - 30 Nov 2025')
    },
    {
      name: 'Brand seeding: CreaTuActivo.com presente',
      pattern: 'CreaTuActivo.com',
      found: data[0].content.includes('CreaTuActivo.com')
    },
    {
      name: 'Restaurant analogy presente',
      pattern: 'restaurante',
      found: data[0].content.includes('restaurante') || data[0].content.includes('Restaurante')
    },
    {
      name: 'Sección WHY_01 presente',
      pattern: 'WHY_01',
      found: data[0].content.includes('WHY_01')
    },
    {
      name: 'Terminología: "constructores" (NO "arquitectos")',
      pattern: 'constructores',
      found: data[0].content.includes('constructores') && !data[0].content.includes('arquitectos')
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

aplicarArsenalInicial().catch(console.error);
