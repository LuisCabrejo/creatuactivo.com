#!/usr/bin/env node

/**
 * Script para cambiar "Cómo funciona el sistema" por "Cómo funciona el negocio"
 * en el System Prompt de NEXUS
 *
 * Fecha: 23 Nov 2025
 * Motivo: Ajuste de vocabulario Jobs-Style - enfoque en "negocio" en lugar de "sistema"
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local
const envPath = join(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cambiarSistemaPorNegocio() {
  try {
    console.log('🔍 Leyendo system prompt actual...\n');

    // Leer el prompt actual
    const { data: currentPrompt, error: readError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (readError) {
      throw new Error(`Error al leer system prompt: ${readError.message}`);
    }

    console.log(`📋 Versión actual: ${currentPrompt.version}\n`);

    // Hacer los reemplazos
    let updatedPrompt = currentPrompt.prompt;

    // Contar ocurrencias antes del cambio
    const matchesA = (updatedPrompt.match(/\*\*A\)\*\* ⚙️ Cómo funciona el sistema/g) || []).length;
    const matchesPattern = (updatedPrompt.match(/cómo funciona.*sistema/gi) || []).length;

    console.log(`🔍 Encontradas:`);
    console.log(`   - ${matchesA} ocurrencias exactas de "**A)** ⚙️ Cómo funciona el sistema"`);
    console.log(`   - ${matchesPattern} ocurrencias del patrón "cómo funciona...sistema"\n`);

    // Reemplazos
    updatedPrompt = updatedPrompt.replace(
      /\*\*A\)\*\* ⚙️ Cómo funciona el sistema/g,
      '**A)** ⚙️ Cómo funciona el negocio'
    );

    // Verificar cambios
    const newMatchesA = (updatedPrompt.match(/\*\*A\)\*\* ⚙️ Cómo funciona el negocio/g) || []).length;
    const newMatchesPattern = (updatedPrompt.match(/cómo funciona.*negocio/gi) || []).length;

    console.log(`✅ Después del cambio:`);
    console.log(`   - ${newMatchesA} ocurrencias de "**A)** ⚙️ Cómo funciona el negocio"`);
    console.log(`   - ${newMatchesPattern} ocurrencias del patrón "cómo funciona...negocio"\n`);

    // Generar nueva versión
    const versionMatch = currentPrompt.version.match(/v(\d+)\.(\d+)/);
    const majorVersion = versionMatch ? parseInt(versionMatch[1]) : 17;
    const minorVersion = versionMatch ? parseInt(versionMatch[2]) : 0;
    const newVersion = `v${majorVersion}.${minorVersion + 1}_sistema_to_negocio`;

    console.log(`📝 Nueva versión: ${newVersion}\n`);

    // Actualizar en Supabase
    const { error: updateError } = await supabase
      .from('system_prompts')
      .update({
        prompt: updatedPrompt,
        version: newVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main');

    if (updateError) {
      throw new Error(`Error al actualizar system prompt: ${updateError.message}`);
    }

    console.log('✅ System prompt actualizado exitosamente!');
    console.log(`\n🎯 Cambios realizados:`);
    console.log(`   - "Cómo funciona el sistema" → "Cómo funciona el negocio"`);
    console.log(`   - Versión: ${currentPrompt.version} → ${newVersion}`);
    console.log(`\n⚠️  IMPORTANTE: Espera 5 minutos para que se actualice el caché de Anthropic`);
    console.log(`   O reinicia el servidor de desarrollo (npm run dev)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
cambiarSistemaPorNegocio();
