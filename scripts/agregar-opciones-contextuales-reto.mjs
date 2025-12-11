#!/usr/bin/env node

/**
 * Script para agregar OPCIONES CONTEXTUALES al System Prompt
 * Fecha: 10 Dic 2025
 * Problema: Después del arquetipo, NEXUS ofrece opciones genéricas
 *           aunque el usuario preguntó por el Reto de los 12 Días
 * Solución: Opciones contextuales según tema inicial
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// REGLA DE OPCIONES CONTEXTUALES
const REGLA_OPCIONES_CONTEXTUALES = `

### 🎯 OPCIONES CONTEXTUALES POST-ARQUETIPO (CRÍTICO):

**Las opciones del MENSAJE 4 deben ser CONTEXTUALES según el tema inicial:**

#### SI EL USUARIO EMPEZÓ CON EL RETO DE LOS 12 DÍAS (opción A):

\`\`\`
Perfecto [NOMBRE], veo que eres [ARQUETIPO]. Sobre el Reto de los 12 Días:

**A)** 💰 ¿Cómo se gana en el Reto?

**B)** 💵 ¿Cuánto cuesta participar?

**C)** 🚀 ¿Cómo me vinculo al Reto?
\`\`\`

#### SI EL USUARIO EMPEZÓ CON "CÓMO FUNCIONA" (opción B):

\`\`\`
Perfecto [NOMBRE], veo que eres [ARQUETIPO]. Te puedo ayudar con:

**A)** ⚙️ Cómo construir tu sistema paso a paso

**B)** 📦 Qué productos distribuimos

**C)** 💰 Cómo funciona el plan de compensación
\`\`\`

#### SI EL USUARIO EMPEZÓ CON "PRODUCTOS" (opción C):

\`\`\`
Perfecto [NOMBRE], veo que eres [ARQUETIPO]. Sobre los productos:

**A)** ☕ Línea de café Gano Excel

**B)** 💊 Suplementos y bienestar

**C)** 💰 Cómo ganar distribuyendo productos
\`\`\`

#### SI EL USUARIO EMPEZÓ CON "INVERSIÓN" (opción D):

\`\`\`
Perfecto [NOMBRE], veo que eres [ARQUETIPO]. Sobre inversión y ganancias:

**A)** 💵 ¿Cuánto cuesta empezar?

**B)** 📊 Proyección de ganancias

**C)** 🚀 ¿Cómo me vinculo?
\`\`\`

### 🚨 REGLA CRÍTICA - MANTENER CONTEXTO:

**NO ofrezcas opciones genéricas si el usuario ya mostró interés en un tema específico.**

El contexto de la conversación determina las opciones. Si empezó con el Reto, mantén las opciones sobre el Reto.

`;

async function agregarRegla() {
  console.log('🔄 Agregando regla de OPCIONES CONTEXTUALES al System Prompt...\n');

  const { data: prompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError || !prompt) {
    console.log('❌ No se encontró el System Prompt:', readError);
    return;
  }

  console.log('📖 Versión actual:', prompt.version);
  console.log('📏 Longitud:', prompt.prompt.length, 'caracteres');

  // Verificar si ya existe
  if (prompt.prompt.includes('OPCIONES CONTEXTUALES POST-ARQUETIPO')) {
    console.log('\n⚠️  La regla ya existe. No se realizarán cambios duplicados.');
    return;
  }

  let newPrompt = prompt.prompt;

  // Buscar el MENSAJE 4 y agregar la regla después del ejemplo
  const mensaje4Pattern = /#### \*\*MENSAJE 4 - CONFIRMAR ARQUETIPO \+ OFRECER OPCIONES CONTEXTUALES:\*\*[\s\S]*?```\s*\n\s*---/;

  if (mensaje4Pattern.test(newPrompt)) {
    // Reemplazar la sección completa de MENSAJE 4
    const nuevoMensaje4 = `#### **MENSAJE 4 - CONFIRMAR ARQUETIPO + OFRECER OPCIONES CONTEXTUALES:**

**🚨 REGLA CRÍTICA - NO REPETIR SALUDO:**
- ❌ **NO escribir:** "¡Hola! 👋 Soy NEXUS..."
- ❌ **NO repetir** presentación inicial
- ✅ **SOLO confirmar** arquetipo y ofrecer opciones CONTEXTUALES
${REGLA_OPCIONES_CONTEXTUALES}
---`;

    newPrompt = newPrompt.replace(mensaje4Pattern, nuevoMensaje4);
    console.log('\n✅ MENSAJE 4 actualizado con opciones contextuales');
  } else {
    // Insertar antes de MENSAJE 5
    const insertPoint = '#### **MENSAJES 5-7';
    if (newPrompt.includes(insertPoint)) {
      newPrompt = newPrompt.replace(insertPoint, REGLA_OPCIONES_CONTEXTUALES + '\n' + insertPoint);
      console.log('\n✅ Regla insertada antes de MENSAJES 5-7');
    } else {
      console.log('\n⚠️  No se encontró punto de inserción');
      return;
    }
  }

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.7.0_opciones_contextuales_reto',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.7.0');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📏 Nueva longitud:', newPrompt.length, 'caracteres');

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  const checks = [
    { name: 'Opciones contextuales', found: verify.prompt.includes('OPCIONES CONTEXTUALES POST-ARQUETIPO') },
    { name: 'Opciones Reto', found: verify.prompt.includes('¿Cómo se gana en el Reto?') },
    { name: 'Opciones vinculación', found: verify.prompt.includes('¿Cómo me vinculo al Reto?') },
    { name: 'Regla mantener contexto', found: verify.prompt.includes('MANTENER CONTEXTO') }
  ];

  console.log('\n🔍 Verificaciones:');
  checks.forEach(check => {
    console.log(`   ${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado');
  console.log('\n📋 NEXUS ahora:');
  console.log('   - Si usuario empezó con Reto → opciones sobre el Reto');
  console.log('   - Si usuario empezó con Productos → opciones sobre productos');
  console.log('   - Mantiene el contexto de la conversación');
}

agregarRegla().catch(console.error);
