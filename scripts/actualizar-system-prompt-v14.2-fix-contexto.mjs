#!/usr/bin/env node

/**
 * Script para actualizar System Prompt de NEXUS a v14.2
 * Fecha: 9 Diciembre 2025
 *
 * FIX: Quitar contexto interno del MODO TURBO
 * - NO decir "velocidad > volumen" (es contexto interno)
 * - NO decir "DE POR VIDA" directamente
 * - NO decir "demostrar que funciona"
 * - NO decir "antes que el mercado despierte"
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

// NUEVO MODO TURBO (sin contexto interno)
const NUEVO_MODO_TURBO = `
---

## 🔥 MODO TURBO - RETO DE LOS 12 DÍAS (PRIORIDAD ALTA)

### 🚨 ACTIVACIÓN AUTOMÁTICA:

Cuando el usuario mencione o pregunte sobre:
- "Reto de los 12 Días" / "Reto 12 Días"
- "Inversión mínima" / "$443,600" / "443 mil"
- "Kit de Inicio" (en contexto de comenzar)
- "Cómo empezar con poco" / "poca inversión"

**ACTIVA MODO TURBO:** Usa arsenal_compensacion para respuestas precisas.

### 📋 RESPUESTA CORRECTA PARA "¿QUÉ ES EL RETO?":

El Reto de los 12 Días es una estrategia de CreaTuActivo.com que busca premiar la velocidad.

En este plan se refleja cómo una persona, al hacer un trabajo sencillo de unir dos personas, puede construir un sistema de distribución masiva de productos Gano Excel.

En el día 12 (nivel 12), como resultado de ese trabajo, tu red puede tener más de 8,000 clientes y constructores.

**Contenido del Kit de Inicio ($443,600 COP):**
- Productos Gano Excel con fórmula exclusiva
- My Gano Plan Negocios (acceso al sistema)
- Bono Binario al 10% (única forma de ganar con este paquete)

### 🚫 CONTEXTO INTERNO - NO COMPARTIR CON PROSPECTOS:

Las siguientes frases son CONTEXTO INTERNO para ti (Claude), NO para decirlas al usuario:

❌ "La velocidad es más importante que el volumen"
❌ "El rápido se come al lento"
❌ "Demostrar que este modelo funciona"
❌ "DE POR VIDA por todo el trabajo de alguien"
❌ "Antes que el mercado despierte"
❌ "Posicionamiento estratégico temprano"
❌ "No es probar con poco riesgo"

Estas frases te ayudan a entender el contexto, pero NO las repitas al usuario.

### ✅ LO QUE SÍ PUEDES DECIR:

- "Busca premiar la velocidad"
- "Trabajo sencillo de unir dos personas"
- "Tu red puede tener más de 8,000 clientes"
- "Inversión mínima de $443,600 COP"
- "Bono Binario al 10%"

### 📊 CUANDO PREGUNTEN SOBRE EL RETO:

1. **Usa arsenal_compensacion** para respuestas detalladas (RETO_01 a RETO_07)
2. **NO uses frases de contexto interno**
3. **Sé directo y factual** sobre las cifras

---
`;

async function actualizarSystemPrompt() {
  console.log('🔄 Actualizando System Prompt de NEXUS a v14.2 - FIX Contexto...\n');

  // 1. Leer System Prompt actual
  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error al leer prompt actual:', readError);
    process.exit(1);
  }

  console.log('📖 Prompt actual encontrado:');
  console.log(`   - Versión: ${currentPrompt.version}`);
  console.log(`   - Longitud: ${currentPrompt.prompt.length} caracteres`);

  let newPrompt = currentPrompt.prompt;

  // 2. Buscar y reemplazar la sección MODO TURBO
  console.log('\n📝 Reemplazando sección MODO TURBO...');

  // Regex para encontrar toda la sección MODO TURBO
  const modoTurboRegex = /---\s*\n\s*## 🔥 MODO TURBO - RETO DE LOS 12 DÍAS[\s\S]*?(?=---\s*\n\s*## 🚨 REGLA CRÍTICA: KIT DE INICIO vs GEN5|---\s*\n\s*## 📐 FORMATO)/;

  if (modoTurboRegex.test(newPrompt)) {
    newPrompt = newPrompt.replace(modoTurboRegex, NUEVO_MODO_TURBO);
    console.log('   ✅ Sección MODO TURBO reemplazada');
  } else {
    console.log('   ⚠️  No se encontró la sección MODO TURBO con el patrón esperado');
    console.log('   Intentando inserción alternativa...');

    // Buscar cualquier mención de MODO TURBO
    if (newPrompt.includes('MODO TURBO')) {
      console.log('   ⚠️  MODO TURBO existe pero con formato diferente. Revisa manualmente.');
    }
  }

  // 3. Actualizar versión
  newPrompt = newPrompt.replace(/v14\.1/g, 'v14.2');
  newPrompt = newPrompt.replace(/14\.1\.0/g, '14.2.0');

  // 4. Guardar en Supabase
  console.log('\n💾 Guardando en Supabase...');

  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.2.0_fix_contexto_interno',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.error('❌ Error al actualizar:', updateError);
    process.exit(1);
  }

  console.log('\n✅ System Prompt actualizado exitosamente a v14.2');
  console.log(`📌 Nueva longitud: ${newPrompt.length} caracteres`);
  console.log(`📌 Updated at: ${data[0].updated_at}`);

  // 5. Verificaciones
  console.log('\n🔍 Verificando cambios...\n');

  const checks = [
    { name: 'NO contiene "velocidad es más importante"', found: !newPrompt.includes('velocidad es más importante que el volumen') },
    { name: 'NO contiene "rápido se come al lento"', found: !newPrompt.includes('rápido se come al lento') },
    { name: 'NO contiene "DE POR VIDA por todo"', found: !newPrompt.includes('DE POR VIDA por todo el trabajo') },
    { name: 'Sección CONTEXTO INTERNO presente', found: newPrompt.includes('CONTEXTO INTERNO - NO COMPARTIR') },
    { name: 'Respuesta correcta presente', found: newPrompt.includes('estrategia de CreaTuActivo.com que busca premiar la velocidad') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
}

actualizarSystemPrompt().catch(console.error);
