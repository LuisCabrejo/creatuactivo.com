#!/usr/bin/env node

/**
 * Script para desplegar arsenal_avanzado.txt a Supabase
 * Fecha: 7 Diciembre 2025
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

async function deployArsenalAvanzado() {
  console.log('📤 Desplegando arsenal_avanzado.txt a Supabase...\n');

  // Leer archivo arsenal_avanzado.txt
  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_avanzado.txt');
  const content = readFileSync(arsenalPath, 'utf8');

  console.log('📌 Longitud del contenido:', content.length, 'caracteres');

  // Extraer versión
  const versionMatch = content.match(/\*\*Versión:\*\* ([\d.]+)/);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  console.log('📌 Versión detectada:', version);

  // Actualizar en Supabase por categoría
  const { data, error } = await supabase
    .from('nexus_documents')
    .update({
      title: `Arsenal Avanzado v${version}`,
      content: content,
      updated_at: new Date().toISOString()
    })
    .eq('category', 'arsenal_avanzado')
    .select();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No se encontró documento con category=arsenal_avanzado');
    console.log('   Intentando insertar nuevo documento...');

    const { data: insertData, error: insertError } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_avanzado',
        title: `Arsenal Avanzado v${version}`,
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
    console.log('\n✅ Arsenal Avanzado actualizado exitosamente');
    console.log('📌 ID:', data[0].id);
    console.log('📌 Updated at:', data[0].updated_at);
  }

  // Verificaciones
  console.log('\n🔍 Verificando contenido...\n');

  const checks = [
    { name: 'VAL_03b presente', found: content.includes('VAL_03b') },
    { name: 'VAL_03d presente', found: content.includes('VAL_03d') },
    { name: 'Proyección mensual al 17%', found: content.includes('Proyección mensual al 17%') },
    { name: 'Lista formato mobile-friendly', found: content.includes('• 10 personas cada lado') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
}

deployArsenalAvanzado().catch(console.error);
