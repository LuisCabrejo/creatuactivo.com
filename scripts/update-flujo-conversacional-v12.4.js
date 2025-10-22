// Script para actualizar System Prompt v12.4 - Flujo Conversacional Natural
// Fecha: 2025-10-21
// Cambio: Optimizar orden de captura con propuesta de valor + viñetas con letras

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFlujoConversacional() {
  console.log('🔄 Actualizando a v12.4 - Flujo Conversacional Natural...\n');

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error:', fetchError);
      return;
    }

    console.log(`✅ Versión actual: ${currentData.version}\n`);

    // Buscar y reemplazar sección de captura
    const oldCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

1. Nombre - "Para conocerte mejor, como te llamas?"

2. Arquetipo - "Para ofrecerte la mejor asesoria, con cual de estos perfiles te identificas mas?"

   PRESENTAR ARQUETIPOS (formato vertical con emojis):

   - 💼 Profesional con Vision: Tienes un trabajo estable pero buscas mas autonomia
   - 🎯 Emprendedor y Dueno de Negocio: Ya tienes un negocio y buscas escalarlo
   - 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
   - 🏠 Lider del Hogar: Gestionas el hogar y buscas contribuir economicamente
   - 👥 Lider de la Comunidad: Tienes influencia y te apasiona ayudar a otros
   - 📈 Joven con Ambicion: Estas comenzando y quieres construir tu futuro financiero

   Instruccion: "Puedes copiar el que mejor te representa o escribir cual se parece mas a ti."

3. WhatsApp - "Cual es tu WhatsApp para coordinar tu consulta?"
4. Email (opcional) - Solo si el prospecto lo ofrece`;

    const newCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

**PASO 1: CAPTURA DE NOMBRE (con propuesta de valor)**

Despues de que el usuario acepte el consentimiento y tu respondas su primera consulta, captura el nombre asi:

"Para personalizar tu asesoria y darte las mejores recomendaciones segun tu situacion, como te llamas?"

⚠️ IMPORTANTE:
- Solo UNA pregunta en este mensaje (nombre)
- NO preguntes arquetipo todavia
- Enfatiza el BENEFICIO (asesoria personalizada)

---

**PASO 2: CAPTURA DE ARQUETIPO (con viñetas con letras)**

Una vez tengas el nombre, en tu SIGUIENTE mensaje (despues de confirmar el nombre y responder su consulta), presenta los arquetipos asi:

"Perfecto [NOMBRE]. Para ofrecerte la asesoria mas relevante para tu situacion, con cual de estos perfiles te identificas mas?

A) 💼 Profesional con Vision: Tienes un trabajo estable pero buscas mas autonomia
B) 🎯 Emprendedor y Dueno de Negocio: Ya tienes un negocio y buscas escalarlo
C) 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
D) 🏠 Lider del Hogar: Gestionas el hogar y buscas contribuir economicamente
E) 👥 Lider de la Comunidad: Tienes influencia y te apasiona ayudar a otros
F) 📈 Joven con Ambicion: Estas comenzando y quieres construir tu futuro financiero

Puedes responder con la letra (A, B, C...) o copiar el perfil completo."

⚠️ IMPORTANTE:
- USA VIÑETAS CON LETRAS (A, B, C, D, E, F)
- Facilita respuesta rapida del usuario (solo escribir una letra)
- Confirma el nombre antes de hacer esta pregunta
- Enfatiza el BENEFICIO (asesoria mas relevante)

---

**PASO 3: CAPTURA DE WHATSAPP**

Una vez tengas nombre + arquetipo, en el siguiente mensaje:

"Excelente [NOMBRE]. Para coordinar tu consulta personalizada, cual es tu WhatsApp?"

---

**PASO 4: EMAIL (OPCIONAL)**

Solo si el prospecto lo ofrece espontaneamente

---

**FLUJO CONVERSACIONAL COMPLETO:**

1. Usuario pregunta algo → Tu respondes + pides nombre con propuesta de valor
2. Usuario da nombre → Tu confirmas nombre + respondes si hay pregunta + pides arquetipo con letras
3. Usuario elige arquetipo → Tu confirmas arquetipo + OFRECES opciones de preguntas relacionadas al contexto
4. Usuario elige opcion o pregunta → Tu respondes + pides WhatsApp

EJEMPLO DE OPCIONES RELACIONADAS AL CONTEXTO:

Despues de que el usuario elija su arquetipo, ofrece 2-3 opciones asi:

"Perfecto [NOMBRE], veo que eres [ARQUETIPO]. Te puedo ayudar con:

A) Como construir tu sistema de distribucion
B) Que productos especificos distribuimos
C) Como funciona el plan de compensacion

Que te gustaria saber primero?"`;

    if (!currentData.prompt.includes('ORDEN DE CAPTURA (despues del consentimiento)')) {
      console.log('⚠️ Sección no encontrada\n');
      return;
    }

    const updatedPrompt = currentData.prompt.replace(oldCapture, newCapture);

    console.log('📝 CAMBIOS APLICADOS:');
    console.log('━'.repeat(80));
    console.log('✅ Flujo conversacional natural (humano-like)');
    console.log('✅ Viñetas con letras (A-F) para arquetipos');
    console.log('✅ Una pregunta a la vez con propuesta de valor');
    console.log('✅ Opciones relacionadas al contexto después de arquetipo');
    console.log('━'.repeat(80));

    const newVersion = 'v12.4_flujo_conversacional';

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

    console.log(`\n✅ Actualizado a ${newVersion}`);
    console.log('\n🎯 Mejoras implementadas:');
    console.log('  1. ✅ Nombre primero (solo esa pregunta)');
    console.log('  2. ✅ Arquetipo después (con letras A-F)');
    console.log('  3. ✅ Propuesta de valor en cada pregunta');
    console.log('  4. ✅ Opciones contextuales después de arquetipo');
    console.log('  5. ✅ Flujo natural como conversación humana');
    console.log('\n📊 Longitud del prompt:', updatedPrompt.length, 'caracteres');
    console.log('\n⚠️ IMPORTANTE: Espera 5 minutos para que cache se limpie');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateFlujoConversacional();
