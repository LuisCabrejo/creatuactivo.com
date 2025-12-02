#!/usr/bin/env node

/**
 * Script para actualizar system prompt con instrucciones de formato de viñetas
 * Objetivo: Mejorar legibilidad - viñetas SIEMPRE verticales, NUNCA horizontales
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function actualizarFormatoVinetas() {
  console.log('🔄 Actualizando formato de viñetas en System Prompt...\n');

  try {
    // 1. Leer system prompt actual
    const { data: currentPrompt, error: readError } = await supabase
      .from('system_prompts')
      .select('*')
      .eq('name', 'nexus_main')
      .single();

    if (readError || !currentPrompt) {
      throw new Error(`Error leyendo system prompt: ${readError?.message}`);
    }

    console.log('✅ System Prompt actual leído');
    console.log(`📌 Versión actual: ${currentPrompt.version}\n`);

    // 2. Buscar la sección "ESTRUCTURA VISUAL OBLIGATORIA"
    const contenidoActual = currentPrompt.prompt;

    // Definir el reemplazo
    const SECCION_VIEJA = `### ESTRUCTURA VISUAL OBLIGATORIA:
* **CONCISIÓN:** Respuestas directas y potentes
* **NEGRITAS ESTRATÉGICAS:** **conceptos clave**
* **LISTAS:** Usa viñetas para desglosar información
* **EMOJIS CONTEXTUALES:** Profesionales y sutiles`;

    const SECCION_NUEVA = `### ESTRUCTURA VISUAL OBLIGATORIA:
* **CONCISIÓN:** Respuestas directas y potentes
* **NEGRITAS ESTRATÉGICAS:** **conceptos clave**
* **VIÑETAS VERTICALES:** SIEMPRE una por línea (NUNCA horizontales)
* **EMOJIS CONTEXTUALES:** Profesionales y sutiles

### 🚨 REGLA CRÍTICA - VIÑETAS VERTICALES:

**SIEMPRE usa este formato:**

✅ CORRECTO (una por línea):
\`\`\`
Tu aplicación CreaTuActivo incluye:

* NEXUS (IA Conversacional) - Educa y cualifica prospectos automáticamente
* Dashboard en tiempo real - Ves todo lo que pasa en tu sistema
* Herramientas de conexión - Para que inicies conversaciones estratégicamente
* Sistema de seguimiento - Nunca pierdes una oportunidad
\`\`\`

❌ PROHIBIDO (horizontal - ilegible):
\`\`\`
Tu aplicación CreaTuActivo incluye: • NEXUS (IA Conversacional) - Educa... • Dashboard en tiempo real - Ves... • Herramientas de conexión - Para...
\`\`\`

**Por qué es crítico:**
- Viñetas horizontales son ilegibles en móvil
- El usuario no puede escanear la información rápidamente
- Parece spam o mensaje generado sin cuidado

**Aplica esto a:**
- ✅ Checkmarks (uno por línea)
- • Bullets (uno por línea)
- → Flechas (una por línea)
- ** Negritas con guiones (una por línea)`;

    // 3. Verificar que la sección existe
    if (!contenidoActual.includes('ESTRUCTURA VISUAL OBLIGATORIA')) {
      console.error('❌ No se encontró la sección "ESTRUCTURA VISUAL OBLIGATORIA"');
      console.error('El system prompt puede haber cambiado su estructura.');
      process.exit(1);
    }

    // 4. Hacer el reemplazo
    const contenidoNuevo = contenidoActual.replace(SECCION_VIEJA, SECCION_NUEVA);

    if (contenidoActual === contenidoNuevo) {
      console.log('⚠️  El contenido no cambió. Posible que ya esté actualizado o la sección sea diferente.\n');
      console.log('Mostrando primeras líneas de ESTRUCTURA VISUAL:');
      const inicio = contenidoActual.indexOf('ESTRUCTURA VISUAL');
      if (inicio !== -1) {
        console.log(contenidoActual.substring(inicio, inicio + 300));
      }
      process.exit(0);
    }

    // 5. Actualizar versión
    const versionActual = currentPrompt.version;
    const nuevaVersion = versionActual.includes('_vinetas_verticales')
      ? versionActual
      : `${versionActual}_vinetas_verticales`;

    // 6. Guardar en Supabase
    const { error: updateError } = await supabase
      .from('system_prompts')
      .update({
        prompt: contenidoNuevo,
        version: nuevaVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main');

    if (updateError) {
      throw new Error(`Error actualizando: ${updateError.message}`);
    }

    console.log('✅ System Prompt actualizado exitosamente!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 CAMBIOS REALIZADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Nueva sección: "🚨 REGLA CRÍTICA - VIÑETAS VERTICALES"`);
    console.log(`✅ Versión actualizada: ${versionActual} → ${nuevaVersion}`);
    console.log(`✅ Incremento: +${contenidoNuevo.length - contenidoActual.length} caracteres\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 IMPACTO ESPERADO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📱 Mejora legibilidad en móvil (90% usuarios)');
    console.log('✅ Viñetas siempre una por línea');
    console.log('👁️  Información más escaneable');
    console.log('💬 Conversaciones más profesionales\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 PRÓXIMO PASO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1️⃣  Reiniciar servidor dev:');
    console.log('   npm run dev\n');
    console.log('2️⃣  Probar NEXUS en móvil y desktop');
    console.log('3️⃣  Verificar que viñetas sean verticales\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
actualizarFormatoVinetas();
