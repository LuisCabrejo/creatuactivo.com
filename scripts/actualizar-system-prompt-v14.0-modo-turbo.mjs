#!/usr/bin/env node

/**
 * Script para actualizar System Prompt de NEXUS a v14.0
 * Fecha: 9 Diciembre 2025
 *
 * CAMBIOS:
 * 1. MENSAJE 1: Primera opción = "Conocer el Reto de los 12 Días"
 * 2. MENSAJE 1: Eliminar opción "Si esto es para ti"
 * 3. NUEVA SECCIÓN: MODO TURBO para Reto 12 Días
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

// SECCIÓN MODO TURBO - RETO 12 DÍAS
const MODO_TURBO_SECTION = `
---

## 🔥 MODO TURBO - RETO DE LOS 12 DÍAS (PRIORIDAD ALTA)

### 🚨 ACTIVACIÓN AUTOMÁTICA:

Cuando el usuario mencione o pregunte sobre:
- "Reto de los 12 Días" / "Reto 12 Días"
- "Inversión mínima" / "$443,600" / "443 mil"
- "Kit de Inicio" (en contexto de comenzar)
- "Cómo empezar con poco" / "poca inversión"

**ACTIVA MODO TURBO:** Energía alta, urgencia real, enfoque en VELOCIDAD.

### 🎯 PRINCIPIO CLAVE DEL RETO:

**"La VELOCIDAD es más importante que el volumen. En el siglo XXI, el rápido se come al lento."**

El Reto de los 12 Días NO es para personas que quieren "probar" con poco riesgo.
Es para personas que entienden que **posicionarse HOY vale más que esperar**.

### 📋 PUNTOS CLAVE DEL RETO (usa arsenal_compensacion):

1. **Inversión mínima:** $443,600 COP (Kit de Inicio)
2. **Meta:** Unir 2 personas en 12 días (una de cada lado)
3. **Proyección:** Hasta $95,823,000 COP en 12 días si todos unen 2
4. **Contenido del Kit:** Productos Gano Excel + My Gano Plan Negocios

### 🔥 TONO MODO TURBO:

**✅ SÍ (Energía alta, urgencia real):**
- "Este reto es para personas que entienden que la velocidad gana"
- "No es probar. Es posicionarte antes que el mercado despierte"
- "12 días para demostrar que este modelo funciona"
- "La persona más rápida en tu red puede generar ingresos para ti DE POR VIDA"

**❌ NO (Tono tibio de "probar"):**
- "Es una opción para quienes tienen poco presupuesto"
- "Si no funciona, no pierdes mucho"
- "Es solo para ver si te gusta"

### 🎯 DATO CLAVE A COMPARTIR:

**"Una persona que inicia con Kit de Inicio puede ganar DE POR VIDA por todo el trabajo de alguien que le coloquen debajo con Paquete Visionario (ESP-3)."**

Esto cambia la conversación: No es "poco para empezar", es "posicionamiento estratégico temprano".

### 📊 CUANDO PREGUNTEN SOBRE EL RETO:

1. **Usa arsenal_compensacion** para respuestas detalladas (RETO_01 a RETO_07, INV_01 a INV_05)
2. **Menciona la proyección** ($95,823,000 COP posibles en 12 días)
3. **Enfatiza velocidad** sobre volumen
4. **Ofrece detalle** con opciones contextuales

---
`;

// NUEVO MENSAJE 1 con Reto como primera opción
const NUEVO_MENSAJE_1 = `#### **MENSAJE 1 - SALUDO INICIAL:**
- Presentarte como Socio Digital (no asistente)
- **NO pedir datos aún**, solo contexto inicial
- Ofrecer 4 respuestas rápidas según intención

**Ejemplo:**
\`\`\`
¡Hola! 👋 Soy NEXUS, tu Socio Digital en CreaTuActivo.

Estoy aquí para mostrarte cómo construir tu propio sistema de **Distribución Masiva** de productos Gano Excel.

¿Qué te gustaría saber?

**A)** 🔥 Conocer el Reto de los 12 Días

**B)** ⚙️ Cómo funciona el negocio

**C)** 📦 Qué productos distribuimos

**D)** 💰 Inversión y ganancias
\`\`\``;

// MENSAJE 1 ORIGINAL A REEMPLAZAR
const MENSAJE_1_ORIGINAL = `#### **MENSAJE 1 - SALUDO INICIAL:**
- Presentarte como Socio Digital (no asistente)
- **NO pedir datos aún**, solo contexto inicial
- Ofrecer 4 respuestas rápidas según intención

**Ejemplo:**
\`\`\`
¡Hola! 👋 Soy NEXUS, tu Socio Digital en CreaTuActivo.

Estoy aquí para mostrarte cómo construir tu propio sistema de **Distribución Masiva** de productos Gano Excel.

¿Qué te gustaría saber?

**A)** ⚙️ Cómo funciona el negocio

**B)** 📦 Qué productos distribuimos

**C)** 💰 Inversión y ganancias

**D)** 🎯 Si esto es para ti
\`\`\``;

async function actualizarSystemPrompt() {
  console.log('🔄 Actualizando System Prompt de NEXUS a v14.0 - MODO TURBO...\n');

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

  // 2. Actualizar versión en el header
  console.log('\n📝 Actualizando versión...');

  // Actualizar múltiples lugares donde aparece la versión
  newPrompt = newPrompt.replace(
    /\*\*Versión:\*\* 13\.\d+\.\d+[^\n]*/g,
    '**Versión:** 14.0.0 - Modo Turbo Reto 12 Días'
  );

  newPrompt = newPrompt.replace(
    /v13\.\d+\.\d+[^\s]*/g,
    'v14.0.0'
  );

  // Actualizar fecha
  const fechaHoy = '9 de diciembre de 2025';
  newPrompt = newPrompt.replace(
    /\*\*Actualizado:\*\* \d+ de \w+ de 2025/g,
    `**Actualizado:** ${fechaHoy}`
  );
  newPrompt = newPrompt.replace(
    /\*\*Fecha:\*\* \d+ de \w+ de 2025/g,
    `**Fecha:** ${fechaHoy}`
  );

  // 3. Reemplazar MENSAJE 1 con nuevas opciones
  console.log('📝 Actualizando MENSAJE 1 con Reto como primera opción...');

  if (newPrompt.includes('**D)** 🎯 Si esto es para ti')) {
    newPrompt = newPrompt.replace(MENSAJE_1_ORIGINAL, NUEVO_MENSAJE_1);
    console.log('   ✅ MENSAJE 1 actualizado');
  } else {
    console.log('   ⚠️  Patrón de MENSAJE 1 no encontrado exacto, buscando alternativo...');

    // Buscar y reemplazar solo las opciones
    const oldOptions = `**A)** ⚙️ Cómo funciona el negocio

**B)** 📦 Qué productos distribuimos

**C)** 💰 Inversión y ganancias

**D)** 🎯 Si esto es para ti`;

    const newOptions = `**A)** 🔥 Conocer el Reto de los 12 Días

**B)** ⚙️ Cómo funciona el negocio

**C)** 📦 Qué productos distribuimos

**D)** 💰 Inversión y ganancias`;

    if (newPrompt.includes(oldOptions)) {
      newPrompt = newPrompt.replace(oldOptions, newOptions);
      console.log('   ✅ Opciones actualizadas (método alternativo)');
    } else {
      console.log('   ⚠️  No se encontró el patrón de opciones. Verificar manualmente.');
    }
  }

  // 4. Agregar sección MODO TURBO después de la sección de FLUJO DE 14 MENSAJES
  console.log('📝 Agregando sección MODO TURBO...');

  // Buscar un buen lugar para insertar (después del flujo de mensajes, antes de formato)
  const insertPoint = '## 📐 FORMATO Y LEGIBILIDAD';

  if (newPrompt.includes(insertPoint) && !newPrompt.includes('MODO TURBO')) {
    newPrompt = newPrompt.replace(
      insertPoint,
      MODO_TURBO_SECTION + '\n' + insertPoint
    );
    console.log('   ✅ Sección MODO TURBO agregada');
  } else if (newPrompt.includes('MODO TURBO')) {
    console.log('   ⚠️  MODO TURBO ya existe en el prompt');
  } else {
    // Agregar al final antes de la activación
    const altInsertPoint = '## 🚀 ACTIVACIÓN NEXUS';
    if (newPrompt.includes(altInsertPoint)) {
      newPrompt = newPrompt.replace(
        altInsertPoint,
        MODO_TURBO_SECTION + '\n' + altInsertPoint
      );
      console.log('   ✅ Sección MODO TURBO agregada (ubicación alternativa)');
    }
  }

  // 5. Actualizar el footer de versión
  newPrompt = newPrompt.replace(
    /🎯 \*\*READY AS DIGITAL PARTNER[^*]+\*\*/g,
    '🎯 **READY AS DIGITAL PARTNER - VERSIÓN 14.0 MODO TURBO RETO 12 DÍAS - 9 DICIEMBRE 2025**'
  );

  // 6. Guardar en Supabase
  console.log('\n💾 Guardando en Supabase...');

  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.0.0_modo_turbo_reto_12_dias',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.error('❌ Error al actualizar:', updateError);
    process.exit(1);
  }

  console.log('\n✅ System Prompt actualizado exitosamente a v14.0');
  console.log(`📌 Nueva longitud: ${newPrompt.length} caracteres`);
  console.log(`📌 Updated at: ${data[0].updated_at}`);

  // 7. Verificaciones
  console.log('\n🔍 Verificando cambios...\n');

  const checks = [
    { name: 'Opción A = Reto 12 Días', found: newPrompt.includes('**A)** 🔥 Conocer el Reto de los 12 Días') },
    { name: 'Opción D = Inversión (NO "Si esto es para ti")', found: newPrompt.includes('**D)** 💰 Inversión y ganancias') && !newPrompt.includes('**D)** 🎯 Si esto es para ti') },
    { name: 'Sección MODO TURBO presente', found: newPrompt.includes('## 🔥 MODO TURBO - RETO DE LOS 12 DÍAS') },
    { name: 'Principio velocidad > volumen', found: newPrompt.includes('La VELOCIDAD es más importante que el volumen') },
    { name: 'Dato clave DE POR VIDA', found: newPrompt.includes('puede ganar DE POR VIDA') },
    { name: 'Versión v14.0', found: newPrompt.includes('v14.0') || newPrompt.includes('14.0.0') },
    { name: 'arsenal_compensacion mencionado', found: newPrompt.includes('arsenal_compensacion') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Próximos pasos:');
  console.log('   1. Probar NEXUS con saludo inicial (debe mostrar Reto como opción A)');
  console.log('   2. Preguntar "¿Qué es el Reto de los 12 Días?" (debe usar arsenal_compensacion)');
  console.log('   3. Verificar tono MODO TURBO (energía alta, velocidad)');
  console.log('');
}

actualizarSystemPrompt().catch(console.error);
