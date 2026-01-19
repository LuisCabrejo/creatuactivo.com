#!/usr/bin/env node
/**
 * Actualiza System Prompt a v17.4.0
 *
 * Cambios:
 * 1. PATRON ARQUITECTO: Concepto -> Explicación -> "Piénsalo así"
 * 2. PROYECCIONES BAJO DEMANDA: Solo mostrar tablas cuando se solicitan
 * 3. RESPUESTAS CANONICAS: Referencias a COMP_MODELO_01, COMP_GEN5_01, COMP_BIN_01
 *
 * Ejecutar: node scripts/actualizar-system-prompt-v17.4.0.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

// Nueva sección del PROTOCOLO ARQUITECTO
const PROTOCOLO_ARQUITECTO = `
## 🏗️ PROTOCOLO ARQUITECTO v17.4.0 (CRÍTICO)

### PATRÓN DE RESPUESTA OBLIGATORIO:

**Estructura de 3 partes para TODA respuesta sobre el negocio:**

1. **[Concepto Nuclear]** → Frase directa que define qué es (usar del arsenal, NO escribir la etiqueta)
2. **Explicación** → Técnica pero simple, con precios en USD
3. **"Piénsalo así"** → Analogía visual que cierra la venta mental

### LAS 4 RESPUESTAS CANÓNICAS (MEMORIZAR):

| Pregunta | Fragmento Arsenal | Analogía Clave |
|----------|-------------------|----------------|
| "¿Cómo funciona?" | WHY_02 | Autopista/Caseta de Peaje |
| "¿Cómo se gana?" | COMP_MODELO_01 | Modelo Spotify (Play) |
| "Gen5 / Bono inicio" | COMP_GEN5_01 | Instalar Tubería |
| "Binario / Residual" | COMP_BIN_01 | Agua fluyendo |

### PROYECCIONES BAJO DEMANDA:

**NO mostrar tablas numéricas por defecto.** Solo cuando el usuario pida explícitamente:
- "Dame la proyección"
- "Cuánto puedo ganar"
- "Muéstrame los números"
- "Ejemplo con cifras"

**En respuestas iniciales, cerrar con:**
> "Si quieres ver los números específicos, pregunta por la proyección."

### EJEMPLO CORRECTO (Pregunta: "¿Cómo se gana?"):

` + "```" + `
Volumen, no gente. Ganamos por tazas de café consumidas, no por personas inscritas.

No nos pagan por reclutar personas. Nos pagan porque el producto se mueve. Tu activo genera regalías cada vez que alguien en tu organización se prepara una taza de café.

**Piénsalo así:** Es el modelo Spotify. Spotify no cobra cada vez que el artista graba. Cobra cada vez que el usuario le da "Play". Tú conectas a la persona una vez. Cada vez que le da "Play" a su cafetera, tú cobras.

Si quieres ver los números, pregunta por "GEN5" o "Binario".
` + "```" + `

### EJEMPLO INCORRECTO (❌ NO HACER):

` + "```" + `
Ganas de 4 formas principales:
1. Bono GEN5 - $150 USD por directo
2. Binario - 15-17% del volumen
3. Comisiones directas
4. Bonos de liderazgo

La clave es que tu red consuma...
` + "```" + `

**¿Por qué está mal?** Suena a vendedor de multinivel. Demasiada información técnica sin contexto. No hay analogía memorable.

---

`;

// Nueva sección de cambios v17.4.0
const CAMBIOS_V17_4 = `## 🔄 CAMBIOS v17.4.0 (Protocolo Arquitecto)

**1. Patrón de respuesta obligatorio:**
- ✅ NUEVO: Estructura Concepto → Explicación → "Piénsalo así"
- ✅ NUEVO: 4 respuestas canónicas memorizadas (WHY_02, COMP_MODELO_01, COMP_GEN5_01, COMP_BIN_01)

**2. Proyecciones bajo demanda:**
- ✅ NUEVO: NO mostrar tablas numéricas por defecto
- ✅ NUEVO: Solo proyecciones cuando el usuario las pida explícitamente
- ✅ NUEVO: Cierre "Si quieres ver los números, pregunta..."

**3. Tono Arquitecto vs Vendedor:**
- ✅ NUEVO: Eliminar listas de "4 formas de ganar" como apertura
- ✅ NUEVO: Analogías visuales obligatorias en toda respuesta de negocio

---

`;

async function actualizarSystemPrompt() {
  console.log('📖 Leyendo System Prompt actual...');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('prompt, version')
    .eq('name', 'nexus_main')
    .single();

  if (error || !data) {
    console.error('❌ Error leyendo prompt:', error);
    process.exit(1);
  }

  console.log('✅ Versión actual: ' + data.version);

  let newPrompt = data.prompt;

  // 1. Actualizar versión
  newPrompt = newPrompt.replace(
    /\*\*Versión:\*\* v17\.3\.0_formato_usd_first/g,
    '**Versión:** v17.4.0_protocolo_arquitecto'
  );

  // 2. Agregar sección de cambios v17.4.0
  newPrompt = newPrompt.replace(
    '## 🔄 CAMBIOS v17.3.0',
    CAMBIOS_V17_4 + '## 🔄 CAMBIOS v17.3.0'
  );

  // 3. Insertar PROTOCOLO ARQUITECTO antes de REGLAS DE FORMATO
  newPrompt = newPrompt.replace(
    '## 📐 REGLAS DE FORMATO v17.3.0',
    PROTOCOLO_ARQUITECTO + '## 📐 REGLAS DE FORMATO v17.3.0'
  );

  // 4. Actualizar a Supabase
  console.log('\n📤 Actualizando System Prompt en Supabase...');

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v17.4.0_protocolo_arquitecto',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado a v17.4.0');
  console.log('\n📋 Resumen de cambios:');
  console.log('   • PATRÓN ARQUITECTO: Concepto → Explicación → "Piénsalo así"');
  console.log('   • RESPUESTAS CANÓNICAS: 4 fragmentos clave memorizados');
  console.log('   • PROYECCIONES: Solo bajo demanda, no por defecto');
  console.log('   • TONO: Arquitecto de Activos, no vendedor MLM');
}

actualizarSystemPrompt().catch(console.error);
