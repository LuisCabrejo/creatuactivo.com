#!/usr/bin/env node
/**
 * Deploy Arsenal Reto 5 Días a Supabase
 *
 * Carga el archivo arsenal_reto.txt como documento único en nexus_documents
 *
 * Ejecutar: node scripts/deploy-arsenal-reto.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deployArsenalReto() {
  console.log('📖 Leyendo arsenal_reto.txt...');

  const filePath = join(__dirname, '..', 'knowledge_base', 'arsenal_reto.txt');
  const content = readFileSync(filePath, 'utf-8');

  console.log(`✅ Archivo leído: ${content.length} caracteres`);

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id')
    .eq('category', 'arsenal_reto')
    .eq('title', 'Arsenal Reto 5 Días')
    .single();

  if (existing) {
    console.log('📝 Actualizando documento existente...');
    const { error } = await supabase
      .from('nexus_documents')
      .update({
        content: content,
        metadata: {
          version: '1.0',
          updated_at: new Date().toISOString(),
          purpose: 'Lead Magnet - Reto de 5 Días'
        }
      })
      .eq('id', existing.id);

    if (error) {
      console.error('❌ Error actualizando:', error);
      process.exit(1);
    }
  } else {
    console.log('📝 Insertando nuevo documento...');
    const { error } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_reto',
        title: 'Arsenal Reto 5 Días',
        content: content,
        metadata: {
          version: '1.0',
          created_at: new Date().toISOString(),
          purpose: 'Lead Magnet - Reto de 5 Días'
        }
      });

    if (error) {
      console.error('❌ Error insertando:', error);
      process.exit(1);
    }
  }

  console.log('✅ Arsenal Reto desplegado correctamente');

  // Verificación
  console.log('\n🔍 Verificando contenido clave...');
  const checks = [
    { pattern: /RETO_01/, name: 'Qué es el Reto' },
    { pattern: /RETO_02/, name: 'Temario 5 días' },
    { pattern: /RETO_03/, name: 'Costo/Beca' },
    { pattern: /RETO_04/, name: 'Formato híbrido' },
    { pattern: /RETO_05/, name: 'Requisitos' },
    { pattern: /RETO_06/, name: 'Registro' },
    { pattern: /RETO_07/, name: 'Objeción/Test Drive' }
  ];

  checks.forEach(check => {
    const found = check.pattern.test(content);
    console.log(`${found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n📋 Próximos pasos:');
  console.log('   1. Ejecutar: node scripts/fragmentar-arsenales-voyage.mjs');
  console.log('   2. Actualizar route.ts con patrones de clasificación');
  console.log('   3. Probar preguntas como:');
  console.log('      - "¿Qué es el Reto de 5 Días?"');
  console.log('      - "¿Cuánto cuesta el reto?"');
  console.log('      - "¿Cómo me registro?"');
}

deployArsenalReto().catch(console.error);
