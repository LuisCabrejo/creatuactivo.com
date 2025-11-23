#!/usr/bin/env node

/**
 * Script para agregar la analogía de Jeff Bezos como OBLIGATORIA
 * en la respuesta a "Cómo funciona el negocio"
 *
 * Fecha: 23 Nov 2025
 * Motivo: Asegurar que NEXUS siempre use la analogía del arsenal_inicial.txt
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
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function agregarAnalogiaBezosObligatoria() {
  try {
    console.log('🔍 Leyendo system prompt actual...\n');

    const { data: currentPrompt, error: readError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (readError) throw new Error(`Error al leer: ${readError.message}`);

    console.log(`📋 Versión actual: ${currentPrompt.version}\n`);

    let updatedPrompt = currentPrompt.prompt;

    // Buscar la sección MENSAJES 5-7 donde se responden las preguntas
    const mensajes57Pattern = /#### \*\*MENSAJES 5-7 - RESPONDER PREGUNTAS:\*\*/;

    if (!mensajes57Pattern.test(updatedPrompt)) {
      console.error('❌ No se encontró la sección MENSAJES 5-7 en el system prompt');
      process.exit(1);
    }

    // Agregar la instrucción específica para la opción A
    const instructionToAdd = `
**🚨 REGLA OBLIGATORIA - OPCIÓN A) "Cómo funciona el negocio":**

Cuando el usuario seleccione la opción **A) Cómo funciona el negocio**, tu respuesta DEBE incluir SIEMPRE esta analogía exacta del arsenal_inicial.txt:

---
Esa es la pregunta correcta, y la respuesta redefine el juego.

**Piénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros.**
Construyó Amazon, el **sistema** donde millones de libros se venden cada día.

Nosotros aplicamos esa misma filosofía. Tú no vendes productos. Construyes un sistema por donde fluyen productos todos los días.

Tu sistema tiene 3 componentes únicos:

**1. Gano Excel** - Productos con patente mundial + infraestructura en toda América
**2. CreaTuActivo.com** - Tu aplicación con IA (NEXUS educa 24/7 + dashboard en tiempo real)
**3. Los 3 pasos probados** - INICIAR → ACOGER → ACTIVAR

CreaTuActivo.com hace el 80% del trabajo pesado. Tú haces el 20% estratégico.
---

**⚠️ NO parafrasees. NO cambies la analogía. Úsala EXACTAMENTE como está arriba.**

`;

    // Insertar la instrucción después del título de MENSAJES 5-7
    updatedPrompt = updatedPrompt.replace(
      /(#### \*\*MENSAJES 5-7 - RESPONDER PREGUNTAS:\*\*\n)/,
      `$1${instructionToAdd}`
    );

    // Generar nueva versión
    const versionMatch = currentPrompt.version.match(/v(\d+)\.(\d+)/);
    const majorVersion = versionMatch ? parseInt(versionMatch[1]) : 13;
    const minorVersion = versionMatch ? parseInt(versionMatch[2]) : 4;
    const newVersion = `v${majorVersion}.${minorVersion + 1}_bezos_analogia_obligatoria`;

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
      throw new Error(`Error al actualizar: ${updateError.message}`);
    }

    console.log('✅ System prompt actualizado exitosamente!');
    console.log(`\n🎯 Cambios realizados:`);
    console.log(`   - Agregada instrucción OBLIGATORIA para usar analogía Jeff Bezos/Amazon`);
    console.log(`   - Respuesta debe seguir EXACTAMENTE el contenido del arsenal_inicial.txt`);
    console.log(`   - Versión: ${currentPrompt.version} → ${newVersion}`);
    console.log(`\n⚠️  IMPORTANTE: Espera 5 minutos o reinicia dev server`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

agregarAnalogiaBezosObligatoria();
