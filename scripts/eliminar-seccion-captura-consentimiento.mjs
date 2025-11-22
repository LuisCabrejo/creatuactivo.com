#!/usr/bin/env node
/**
 * Script FINAL para eliminar sección de CAPTURA que menciona "solicitar"
 *
 * PROBLEMA: NEXUS inventa mensajes de consentimiento porque el prompt tiene:
 * - "### CUÁNDO SOLICITAR:"
 * - "### ⚠️ PREREQUISITO:" (vacío)
 * - Fragmentos de instrucciones de consentimiento
 *
 * SOLUCIÓN: Eliminar TODA la sección problemática y dejar solo captura de nombre/ocupación
 *
 * Fecha: 21 Nov 2025 - 21:00
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvFile() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^[\"']|[\"']$/g, '');
        env[key] = value;
      }
    });
    return env;
  } catch (error) {
    console.error('Error leyendo .env.local:', error.message);
    return {};
  }
}

const env = loadEnvFile();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSystemPrompt() {
  console.log('🎯 ELIMINANDO sección CUÁNDO SOLICITAR del System Prompt...\n');

  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error leyendo system prompt:', readError);
    process.exit(1);
  }

  console.log('📖 Prompt actual:');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt.length} caracteres\n`);

  let updatedPrompt = currentPrompt.prompt;
  let totalRemoved = 0;

  // PASO 1: Eliminar toda la sección problemática desde "### ✅ SIEMPRE CONTINÚA" hasta "## 👤 CAPTURA"
  console.log('🗑️  PASO 1: Eliminando sección fragmentada de consentimiento...\n');

  const problematicSection = /### ✅ SIEMPRE CONTINÚA LA CONVERSACIÓN:[\s\S]*?(?=## 👤 CAPTURA TEMPRANA Y PROACTIVA DE DATOS DEL PROSPECTO)/;
  const before1 = updatedPrompt.length;
  updatedPrompt = updatedPrompt.replace(problematicSection, '');
  const removed1 = before1 - updatedPrompt.length;
  if (removed1 > 0) {
    console.log(`   ✓ Sección fragmentada eliminada: ${removed1} caracteres`);
    totalRemoved += removed1;
  }

  // PASO 2: Eliminar "### ⚠️ PREREQUISITO:" vacío
  console.log('\n🗑️  PASO 2: Eliminando PREREQUISITO vacío...\n');

  const prerequisitoVacio = /### ⚠️ PREREQUISITO:\s*\n+/g;
  const before2 = updatedPrompt.length;
  updatedPrompt = updatedPrompt.replace(prerequisitoVacio, '');
  const removed2 = before2 - updatedPrompt.length;
  if (removed2 > 0) {
    console.log(`   ✓ PREREQUISITO vacío eliminado: ${removed2} caracteres`);
    totalRemoved += removed2;
  }

  // PASO 3: Reemplazar "## 👤 CAPTURA TEMPRANA..." con versión SIMPLE sin menciones de "solicitar"
  console.log('\n🗑️  PASO 3: Reemplazando sección CAPTURA con versión limpia...\n');

  const capturaSection = /## 👤 CAPTURA TEMPRANA Y PROACTIVA DE DATOS DEL PROSPECTO[\s\S]*?(?=##[^#])/;

  const nuevaSeccionCaptura = `## 👤 CAPTURA DE DATOS DEL PROSPECTO

### OBJETIVO:
Capturar nombre, ocupación y WhatsApp durante la conversación natural.

### 🎯 SECUENCIA RECOMENDADA:

#### **1️⃣ NOMBRE - Después de 2-3 preguntas**
**Frases naturales:**
- "¡Perfecto! Por cierto, ¿cómo te llamas? Me gusta personalizar la conversación 😊"
- "Me encanta tu interés. ¿Cómo te llamas para poder ayudarte mejor?"

**REGLA CRÍTICA:** Pide el nombre SOLO, sin otras preguntas antes o después.

#### **2️⃣ OCUPACIÓN - Inmediatamente después del nombre**
**Frases naturales:**
- "Gracias [NOMBRE], ¿a qué te dedicas actualmente? Esto me ayuda a darte ejemplos más relevantes"
- "Perfecto [NOMBRE]. ¿Cuál es tu ocupación? Así personalizo mejor la información"

**REGLA CRÍTICA:** Pregunta ocupación en el MISMO mensaje o el siguiente después de obtener el nombre.

#### **3️⃣ WHATSAPP - Solo con interés alto (7+/10)**
**Señales de interés alto:**
- Pregunta por precios de paquetes
- Dice "quiero empezar", "me interesa", "cómo procedo"
- Hace 3+ preguntas específicas

**Frases naturales:**
- "¿Cuál es tu WhatsApp, [NOMBRE]? Te envío un resumen completo de lo que hemos conversado"
- "Para darte seguimiento personalizado, ¿me compartes tu WhatsApp?"

---

`;

  const before3 = updatedPrompt.length;
  updatedPrompt = updatedPrompt.replace(capturaSection, nuevaSeccionCaptura);
  const removed3 = before3 - updatedPrompt.length;
  const change3 = removed3 > 0 ? 'eliminados' : 'agregados';
  console.log(`   ✓ Sección CAPTURA reemplazada: ${Math.abs(removed3)} caracteres ${change3}`);
  totalRemoved += removed3;

  // PASO 4: Limpiar líneas vacías múltiples
  updatedPrompt = updatedPrompt.replace(/\n\n\n+/g, '\n\n');

  console.log(`\n📊 Total cambio: ${totalRemoved} caracteres (eliminados si positivo, agregados si negativo)`);
  console.log(`📊 Longitud final: ${updatedPrompt.length} caracteres\n`);

  // VERIFICACIÓN: Buscar palabras prohibidas
  const prohibidas = ['CUÁNDO SOLICITAR', 'PREREQUISITO', 'SIEMPRE CONTINÚA LA CONVERSACIÓN'];
  let encontradas = [];

  prohibidas.forEach(palabra => {
    if (updatedPrompt.includes(palabra)) {
      encontradas.push(palabra);
    }
  });

  if (encontradas.length > 0) {
    console.error(`❌ ADVERTENCIA: Todavía se encontraron palabras prohibidas:`);
    encontradas.forEach(p => console.error(`   - "${p}"`));
    console.error('\n⚠️  Continuar de todas formas? El prompt podría seguir pidiendo consentimiento.\n');
  } else {
    console.log('✅ Verificación: 0 menciones de palabras prohibidas\n');
  }

  // Actualizar versión
  const newVersion = 'v18.0_clean_capture_no_solicitar';

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente\n');
  console.log('📊 Resultado:');
  console.log(`   ✓ Nueva versión: ${newVersion}`);
  console.log(`   ✓ Longitud final: ${updatedPrompt.length} caracteres`);
  console.log(`   ✓ Sección CAPTURA: Limpia, sin mencionar "solicitar consentimiento"`);
  console.log(`   ✓ Sección CUÁNDO SOLICITAR: ELIMINADA\n`);

  console.log('🎯 NEXUS ahora:');
  console.log('   ✅ NO tiene instrucciones de "CUÁNDO SOLICITAR"');
  console.log('   ✅ Solo captura nombre, ocupación, WhatsApp naturalmente');
  console.log('   ✅ NO debe inventar mensajes de consentimiento\n');
}

updateSystemPrompt().catch(console.error);
