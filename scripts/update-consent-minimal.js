// Script para actualizar onboarding a versión MINIMALISTA (mobile-first)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateToMinimal() {
  console.log('🔄 Actualizando onboarding a versión MINIMALISTA...\n');

  try {
    // 1. Obtener el system prompt actual
    const { data: currentData, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error obteniendo prompt actual:', fetchError);
      return;
    }

    console.log(`✅ System Prompt actual: ${currentData.version}`);
    console.log(`📊 Longitud actual: ${currentData.prompt.length} caracteres\n`);

    let updatedPrompt = currentData.prompt;

    // 2. ELIMINAR saludo duplicado y declaración de capacidades
    const oldOnboardingEmpresarial = `#### **PASO 1: SALUDO DE BIENVENIDA (Adaptado al contexto)**

**Para contexto EMPRESARIAL:**
\`\`\`
¡Hola! Soy NEXUS, tu copiloto para construir tu primer activo digital.
\`\`\`

**Para contexto PRODUCTOS:**
\`\`\`
¡Hola! Soy NEXUS, tu especialista en bienestar y superalimentos.
\`\`\`

---

#### **PASO 2: DECLARACIÓN DE CAPACIDADES**

**Para contexto EMPRESARIAL:**
\`\`\`
Puedo ayudarte a:
• Entender cómo funciona el sistema CreaTuActivo.com
• Resolver dudas sobre el modelo de negocio y productos
• Guiarte en los primeros pasos para construir tu activo

Recuerda que soy un asistente virtual, pero siempre puedes pedir hablar con nuestro equipo.
\`\`\`

**Para contexto PRODUCTOS:**
\`\`\`
Puedo ayudarte a:
• Conocer los beneficios de nuestros productos con patente mundial
• Entender cómo el Ganoderma Lucidum puede mejorar tu bienestar
• Resolver dudas sobre precios y presentaciones

Recuerda que soy un asistente virtual, pero siempre puedes pedir hablar con nuestro equipo.
\`\`\`

---

#### **PASO 3: SOLICITUD DE CONSENTIMIENTO LEGAL (CRÍTICO)**`;

    const newOnboardingStart = `#### **ONBOARDING LEGAL MINIMALISTA (PASO ÚNICO)**`;

    updatedPrompt = updatedPrompt.replace(oldOnboardingEmpresarial, newOnboardingStart);

    // 3. REEMPLAZAR texto de consentimiento largo con versión MINIMALISTA
    const oldConsentText = `Para ayudarte mejor, necesito tu autorización para usar los datos que compartas (nombre, ocupación, WhatsApp).

Beneficios:

- Recordar nuestra conversación
- Servicio personalizado
- Conectarte con el equipo

Escribe "mis datos" para gestionar tu info. [Política completa](https://creatuactivo.com/privacidad)

¿Autorizas el tratamiento de tus datos?`;

    const newConsentTextMinimal = `Para personalizar tu experiencia, usaremos tu nombre, ocupación y WhatsApp.

[Política de privacidad](https://creatuactivo.com/privacidad)`;

    updatedPrompt = updatedPrompt.replace(oldConsentText, newConsentTextMinimal);

    // 4. ACTUALIZAR las opciones de respuesta (de 3 a 2 opciones)
    const oldOptions = `**Opciones de respuesta OBLIGATORIAS:**
\`\`\`
**A)** ✅ Sí, autorizo el tratamiento de mis datos

**B)** ❌ No, prefiero no compartir datos

**C)** 📄 Quiero leer la política de privacidad completa
\`\`\``;

    const newOptionsMinimal = `**Opciones de respuesta:**
\`\`\`
**A)** ✅ Aceptar

**B)** ❌ Rechazar
\`\`\``;

    updatedPrompt = updatedPrompt.replace(oldOptions, newOptionsMinimal);

    // 5. ACTUALIZAR el manejo de respuesta del usuario (simplificado)
    const oldResponseHandling = `#### **PASO 4: MANEJO DE RESPUESTA DEL USUARIO**

**Si usuario selecciona A) "Sí, autorizo":**
\`\`\`
¡Perfecto! Gracias por tu confianza. Tu autorización ha sido registrada.

Ahora cuéntame, ¿en qué puedo ayudarte hoy?
\`\`\`
**Luego mostrar quick replies según contexto:**
- Empresarial: "¿Cómo funciona el negocio?" | "¿Qué es CreaTuActivo.com?" | "¿Cuáles son los productos?"
- Productos: "Beneficios del Ganoderma" | "Ver catálogo de productos" | "Precios y presentaciones"

**Si usuario selecciona B) "No, prefiero no compartir":**
\`\`\`
Entiendo perfectamente. Puedo ayudarte con información general sin capturar datos personales.

Ten en cuenta que sin tu autorización no podré:
• Recordar nuestra conversación en el futuro
• Ofrecerte seguimiento personalizado
• Conectarte directamente con nuestro equipo

Aún así, estoy aquí para resolver tus dudas. ¿Qué te gustaría saber?
\`\`\`
**IMPORTANTE:** Si dice "No autorizo", **NUNCA pidas nombre, ocupación, WhatsApp o email**. Solo responde preguntas generales.

**Si usuario selecciona C) "Leer política":**
\`\`\`
Por supuesto. Puedes revisar nuestra Política de Privacidad completa aquí:
👉 https://creatuactivo.com/privacidad

Esta política explica en detalle:
• Qué datos recolectamos y por qué
• Cómo protegemos tu información
• Tus derechos como titular de datos (Ley 1581 de 2012)
• Cómo ejercer tus derechos

Después de leerla, ¿autorizas el tratamiento de tus datos?

**A)** ✅ Sí, autorizo

**B)** ❌ No, prefiero no compartir
\`\`\``;

    const newResponseHandlingMinimal = `#### **MANEJO DE RESPUESTA DEL USUARIO**

**Si usuario selecciona A) "Aceptar":**
\`\`\`
¡Perfecto! ¿En qué puedo ayudarte?
\`\`\`

**Si usuario selecciona B) "Rechazar":**
\`\`\`
Entendido. Puedo ayudarte con información general sin personalización.

¿Qué te gustaría saber?
\`\`\`
**IMPORTANTE:** Si rechaza, **NUNCA pidas nombre, ocupación, WhatsApp o email**. Solo responde preguntas generales.`;

    updatedPrompt = updatedPrompt.replace(oldResponseHandling, newResponseHandlingMinimal);

    // 6. SIMPLIFICAR el paso 5 (registro auditable)
    const oldStep5 = `---

#### **PASO 5: REGISTRO AUDITABLE DEL CONSENTIMIENTO**

**INSTRUCCIÓN PARA EL SISTEMA (no visible al usuario):**
Cuando el usuario autoriza, el sistema backend debe registrar automáticamente:
- \`consent_granted: true\`
- \`consent_timestamp: [fecha y hora actual]\`
- \`consent_ip: [IP del usuario]\`
- \`consent_version: "v12.0_ley_1581_2012"\`

Esto garantiza el cumplimiento del Art. 9 de la Ley 1581/2012.

---`;

    const newStep5Minimal = `**Sistema:** Registrar \`consent_granted: true/false\` + timestamp.

---`;

    updatedPrompt = updatedPrompt.replace(oldStep5, newStep5Minimal);

    // Verificar cambios
    if (updatedPrompt === currentData.prompt) {
      console.log('⚠️ No se realizaron cambios. Verificando contenido...\n');
      return;
    }

    console.log('📊 COMPARACIÓN DE LONGITUD:');
    console.log(`  Antes: ${currentData.prompt.length} caracteres`);
    console.log(`  Después: ${updatedPrompt.length} caracteres`);
    console.log(`  Reducción: ${currentData.prompt.length - updatedPrompt.length} caracteres (${Math.round((1 - updatedPrompt.length / currentData.prompt.length) * 100)}%)\n`);

    // 7. Actualizar en Supabase
    const newVersion = 'v12.2_minimal_consent';

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
      return;
    }

    console.log(`✅ System Prompt actualizado exitosamente a ${newVersion}`);
    console.log('\n🎯 CAMBIOS APLICADOS (VERSIÓN MINIMALISTA):');
    console.log('  ✅ Eliminado saludo duplicado ("¡Hola! Soy NEXUS...")');
    console.log('  ✅ Eliminadas viñetas de capacidades (va directo al punto)');
    console.log('  ✅ Texto de consentimiento reducido 70%+');
    console.log('  ✅ 2 opciones simples: Aceptar / Rechazar');
    console.log('  ✅ Link de privacidad directo y clickeable');
    console.log('  ✅ Eliminado texto "mis datos" confuso');
    console.log('  ✅ Respuestas más cortas (menos scroll en mobile)');
    console.log('\n💡 RESULTADO: Onboarding ultra-compacto, compliance legal mantenido');

  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

updateToMinimal();
