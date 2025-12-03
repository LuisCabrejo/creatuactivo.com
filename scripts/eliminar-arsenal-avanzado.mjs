#!/usr/bin/env node
/**
 * Script para eliminar arsenal_avanzado de Supabase (duplicado)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function eliminarArsenalAvanzado() {
  console.log('🗑️  Eliminar Arsenal Avanzado de Supabase\n');
  console.log('⚠️  ADVERTENCIA: Esta acción eliminará permanentemente:');
  console.log('    - arsenal_avanzado (32K)\n');

  console.log('📋 Arsenales que se mantendrán:');
  console.log('    ✅ arsenal_inicial (21K)');
  console.log('    ✅ arsenal_manejo (28K)');
  console.log('    ✅ arsenal_cierre (25K)\n');

  // Primero verificar que existe
  const { data: existing, error: checkError } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .eq('category', 'arsenal_avanzado')
    .single();

  if (checkError || !existing) {
    console.log('❌ No se encontró arsenal_avanzado en Supabase');
    rl.close();
    return;
  }

  console.log(`📄 Arsenal encontrado:`);
  console.log(`   ID: ${existing.id}`);
  console.log(`   Título: ${existing.title}`);
  console.log(`   Tamaño: ${existing.content.length} caracteres\n`);

  rl.question('¿Confirmas que deseas ELIMINAR arsenal_avanzado? (escribe "SI" para confirmar): ', async (answer) => {
    if (answer.trim().toUpperCase() === 'SI') {
      console.log('\n🗑️  Eliminando arsenal_avanzado...');

      const { error } = await supabase
        .from('nexus_documents')
        .delete()
        .eq('category', 'arsenal_avanzado');

      if (error) {
        console.error('❌ Error al eliminar:', error);
      } else {
        console.log('✅ Arsenal avanzado eliminado exitosamente de Supabase\n');

        // También eliminar archivo local
        const localFile = path.join(__dirname, '..', 'knowledge_base', 'arsenal_avanzado.txt');
        if (fs.existsSync(localFile)) {
          fs.unlinkSync(localFile);
          console.log('✅ Archivo local eliminado: knowledge_base/arsenal_avanzado.txt\n');
        }

        console.log('📊 Arsenales restantes en Supabase:');
        const { data: remaining } = await supabase
          .from('nexus_documents')
          .select('category, title')
          .like('category', 'arsenal_%')
          .order('category');

        remaining.forEach(doc => {
          console.log(`   ✅ ${doc.category} - ${doc.title}`);
        });
      }
    } else {
      console.log('\n❌ Operación cancelada');
    }

    rl.close();
  });
}

eliminarArsenalAvanzado();
