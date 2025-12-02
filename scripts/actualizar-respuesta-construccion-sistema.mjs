#!/usr/bin/env node

/**
 * Script para actualizar la respuesta "Cómo construir el sistema"
 * Cambio crítico: Distinguir entre COMPONENTES del sistema vs ACCIONES del constructor
 * Versión: Híbrida (Analogía edificio + Detalle Gano Excel)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local
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
  console.error('❌ Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Nueva sección para agregar al System Prompt
const SECCION_NUEVA_RESPUESTA_CONSTRUCCION = `

## 🎯 DISTINCIÓN CRÍTICA: Pregunta sobre COMPONENTES vs ACCIONES

### CUANDO PREGUNTAN sobre CONSTRUIR EL SISTEMA:
- "¿Cómo construir tu sistema de distribución paso a paso?"
- "¿Cómo funciona el sistema?"
- "¿Qué necesito para construir esto?"
- "¿Cuáles son los componentes?"

➡️ **RESPONDE con los 3 COMPONENTES** (Analogía del Edificio):

---

### FAQ_COMPONENTES: "¿Cómo construir tu sistema de distribución de productos Gano Excel paso a paso?"

Perfecto {nombre}. Es como construir un edificio. Necesitas 3 elementos fundamentales:

**1. LOS MATERIALES (Gano Excel - El Productor)**
• La compañía que fabrica productos de calidad certificados
• Maneja permisos sanitarios, registros, embalaje y envíos internacionales
• Similar a Amazon: tú no te preocupas por logística ni inventarios
• Garantiza que cada producto llegue a la puerta del cliente

**2. EL PLANO (El Método Probado - Los 3 Pasos IAA)**
• Las instrucciones paso a paso de cómo construir tu red
• Sistema automatizado con más de 9 años de resultados comprobados
• La tecnología (NEXUS + Dashboard) hace el trabajo pesado por ti
• Tú solo sigues el método, el sistema educa y cualifica automáticamente

**3. EL CONSTRUCTOR (Tú)**
• Eres quien pone el sistema en marcha
• Conectas personas con las herramientas automatizadas
• Construyes tu red de clientes y socios distribuidores
• Ganas por cada venta que se genera en toda tu red

Así como un edificio necesita materiales + plano + constructor, tu sistema de distribución necesita estos 3 elementos trabajando juntos para crear tu activo patrimonial.

**¿Qué elemento te gustaría explorar a fondo?**

A) 🏢 Gano Excel - Los materiales (productos y logística)
B) 📋 El Método IAA - El plano (cómo construir paso a paso)
C) 👷 Tu rol - El constructor (qué haces exactamente)

---

### CUANDO PREGUNTAN sobre ACCIONES DEL CONSTRUCTOR:
- "¿Qué tengo que hacer?"
- "¿Cuál es mi trabajo?"
- "¿Qué hago yo en el día a día?"
- "¿Cuáles son mis tareas?"

➡️ **RESPONDE con las 3 ACCIONES** (INICIAR → ACOGER → ACTIVAR):

(Mantener la respuesta existente de FAQ_04)

---

🎯 **REGLA DE ORO:**
- Pregunta sobre el SISTEMA → Habla de COMPONENTES (Materiales, Plano, Constructor)
- Pregunta sobre TU TRABAJO → Habla de ACCIONES (Iniciar, Acoger, Activar)
`;

async function actualizarSystemPrompt() {
  console.log('🔄 Actualizando System Prompt con nueva respuesta construcción sistema...\n');

  try {
    // 1. Leer el system prompt actual
    const { data: currentPrompt, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error al leer system prompt:', fetchError);
      process.exit(1);
    }

    console.log('✅ System prompt actual leído correctamente');
    console.log(`📌 Versión actual: ${currentPrompt.version}`);
    console.log(`📌 Longitud actual: ${currentPrompt.prompt?.length || 0} caracteres\n`);

    // 2. Verificar si ya existe la sección
    if (currentPrompt.prompt.includes('FAQ_COMPONENTES')) {
      console.log('⚠️  La sección FAQ_COMPONENTES ya existe en el system prompt');
      console.log('   Si quieres reemplazarla, edita el script para hacer replace en lugar de append\n');
      return;
    }

    // 3. Agregar la nueva sección
    const nuevoContenido = currentPrompt.prompt + SECCION_NUEVA_RESPUESTA_CONSTRUCCION;

    // 4. Incrementar versión
    const versionActual = currentPrompt.version || 'v13.5';
    const nuevaVersion = 'v13.6_construccion_sistema_analogia_edificio';

    console.log(`🔄 Actualizando a versión: ${nuevaVersion}\n`);

    // 5. Actualizar en Supabase
    const { error: updateError } = await supabase
      .from('system_prompts')
      .update({
        prompt: nuevoContenido,
        version: nuevaVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main');

    if (updateError) {
      console.error('❌ Error al actualizar system prompt:', updateError);
      process.exit(1);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ACTUALIZACIÓN EXITOSA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📌 Versión nueva: ${nuevaVersion}`);
    console.log(`📌 Longitud nueva: ${nuevoContenido.length} caracteres`);
    console.log(`📊 Incremento: +${nuevoContenido.length - currentPrompt.prompt.length} caracteres\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 CAMBIOS REALIZADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Nueva FAQ_COMPONENTES agregada');
    console.log('   Pregunta: "¿Cómo construir tu sistema de distribución de productos Gano Excel paso a paso?"');
    console.log('   Respuesta: Analogía del edificio (Materiales + Plano + Constructor)\n');
    console.log('✅ Distinción clara entre:');
    console.log('   - Preguntas sobre SISTEMA → Responde COMPONENTES');
    console.log('   - Preguntas sobre TRABAJO → Responde ACCIONES\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 PRÓXIMO PASO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1️⃣  Esperar 5 minutos (cache expiry)');
    console.log('2️⃣  Probar NEXUS con preguntas:');
    console.log('    • "¿Cómo construir el sistema?"');
    console.log('    • "¿Qué tengo que hacer?"\n');
    console.log('3️⃣  Verificar que:');
    console.log('    ✅ Primera pregunta → Habla de COMPONENTES (edificio)');
    console.log('    ✅ Segunda pregunta → Habla de ACCIONES (iniciar, acoger, activar)\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 IMPACTO ESPERADO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Respuesta más clara y contextual');
    console.log('✅ Analogía del edificio fácil de entender');
    console.log('✅ Menos confusión entre "qué es" vs "qué hago"');
    console.log('✅ Lenguaje más concreto (productos Gano Excel, no "sistema abstracto")\n');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

// Ejecutar
actualizarSystemPrompt();
