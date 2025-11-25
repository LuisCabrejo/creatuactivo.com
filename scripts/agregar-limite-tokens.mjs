#!/usr/bin/env node

/**
 * Script para agregar límite explícito de tokens al System Prompt de NEXUS
 * Objetivo: Reducir costos de output en API de Claude
 * Ahorro esperado: 30-50% en tokens de output
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente desde .env.local
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
const supabaseServiceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.error('Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const SECCION_LIMITE_TOKENS = `

---

## ⚡ LÍMITE DE RESPUESTA (Control de Costos)

### 🚨 REGLA CRÍTICA - CONCISIÓN EXTREMA:

**Máximo 150-200 palabras por respuesta** (aprox. 200-250 tokens).

**Por qué es importante:**
- Respuestas largas aumentan costos de API
- El usuario promedio lee solo las primeras 3-4 líneas
- Concisión = profesionalismo

### ✅ FORMATO ÓPTIMO:

**Estructura ideal de respuesta:**
1. **Respuesta directa** (1-2 líneas) - Lo que preguntó
2. **Contexto clave** (2-3 bullets) - Información esencial
3. **Opciones** (máximo 3) - Siguiente paso

**Ejemplo CORRECTO (conciso):**
\`\`\`
Los productos de Gano Excel tienen **patente mundial** por su tecnología única de Ganoderma lucidum.

Esto significa:
* **Exclusividad:** Solo Gano Excel puede producirlos legalmente
* **Calidad verificada:** Certificaciones internacionales
* **Ventaja competitiva:** No hay productos similares en el mercado

¿Quieres saber sobre:
**A)** 📦 Catálogo de productos
**B)** 💰 Plan de compensación
**C)** ⚙️ Cómo empezar
\`\`\`
**Conteo:** ~80 palabras (perfecto) ✅

**Ejemplo PROHIBIDO (muy largo):**
\`\`\`
Los productos de Gano Excel son realmente excepcionales porque tienen una patente mundial...
[3 párrafos más de explicación detallada]
[Historia de la empresa]
[Certificaciones con nombres completos]
[Etc...]
\`\`\`
**Conteo:** 300+ palabras (demasiado largo) ❌

### 🎯 EXCEPCIONES (puedes extenderte):

Solo cuando el usuario **EXPLÍCITAMENTE pida detalles:**
- "Explícame en detalle..."
- "Dame toda la información..."
- "Cuéntame más sobre..."

En estos casos, máximo 300-350 palabras.

### ⚠️ RECORDATORIO:

**Conciso ≠ Frío**
- Mantén el tono cercano y visionario
- Usa emojis estratégicos
- Sé empático pero directo

**Una respuesta perfecta:**
- Responde la pregunta
- Aporta valor único
- Ofrece siguiente paso claro
- **Todo en <200 palabras**

`;

async function agregarLimiteTokens() {
  console.log('🔄 Agregando límite de tokens al System Prompt...\n');

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
    console.log(`📌 Versión actual: ${currentPrompt.version}`);
    console.log(`📌 Longitud actual: ${currentPrompt.prompt?.length || 0} caracteres\n`);

    // 2. Verificar si ya tiene la sección
    if (currentPrompt.prompt?.includes('## ⚡ LÍMITE DE RESPUESTA')) {
      console.log('⚠️  La sección de límite de tokens YA EXISTE en el prompt');
      console.log('❌ No se realizarán cambios para evitar duplicados\n');

      console.log('💡 Si quieres actualizar la sección existente:');
      console.log('   1. Ve a Supabase Dashboard');
      console.log('   2. Tabla: system_prompts');
      console.log('   3. Edita manualmente el registro "nexus_main"');
      process.exit(0);
    }

    // 3. Agregar nueva sección al final
    const nuevoContenido = currentPrompt.prompt + SECCION_LIMITE_TOKENS;

    // 4. Crear nueva versión
    const versionActual = currentPrompt.version;
    const nuevaVersion = versionActual.includes('_limite_tokens')
      ? versionActual
      : `${versionActual}_limite_tokens`;

    // 5. Actualizar en Supabase
    const { data: updateResult, error: updateError } = await supabase
      .from('system_prompts')
      .update({
        prompt: nuevoContenido,
        version: nuevaVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main')
      .select();

    if (updateError) {
      throw new Error(`Error actualizando: ${updateError.message}`);
    }

    console.log('✅ System Prompt actualizado exitosamente!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 CAMBIOS REALIZADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`✅ Nueva sección agregada: "⚡ LÍMITE DE RESPUESTA"`);
    console.log(`✅ Versión actualizada: ${versionActual} → ${nuevaVersion}`);
    console.log(`✅ Longitud nueva: ${currentPrompt.prompt.length} → ${nuevoContenido.length} caracteres`);
    console.log(`✅ Incremento: +${nuevoContenido.length - currentPrompt.prompt.length} caracteres\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 IMPACTO ESPERADO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📉 Reducción tokens output: 30-50%');
    console.log('💰 Ahorro proyectado: $15-25 COP por mensaje');
    console.log('📊 De ~400 tokens → ~200 tokens por respuesta');
    console.log('⚡ Respuestas más rápidas y enfocadas\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 PRÓXIMO PASO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1️⃣  Reiniciar servidor dev (para limpiar cache):');
    console.log('   npm run dev\n');
    console.log('2️⃣  Probar NEXUS en creatuactivo.com');
    console.log('3️⃣  Verificar que respuestas sean más concisas');
    console.log('4️⃣  Monitorear costos en Anthropic Dashboard\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
agregarLimiteTokens();
