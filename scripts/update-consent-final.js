// Script para aplicar texto de consentimiento FINAL acordado (sin saludo duplicado)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateConsentFinal() {
  console.log('🔄 Aplicando texto de consentimiento FINAL (acordado con usuario)...\n');

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

    // 2. Texto INCORRECTO actual (con saludo duplicado)
    const oldOnboardingText = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

Cuando detectes que es la primera interaccion, usa este texto CORTO:

Hola, soy NEXUS. Tu copiloto de IA en CreaTuActivo.

Para continuar, autorizo el tratamiento de mis datos segun la Ley 1581/2012.

Politica de privacidad: https://app.creatuactivo.com/privacidad

¿Autorizas?

Opciones:
A) Si, autorizo
B) No, gracias

NO usar saludo largo ni lista de capacidades.`;

    // 3. Texto CORRECTO acordado (sin saludo, con viñetas)
    const newOnboardingText = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

Cuando detectes que es la primera interaccion, usa este texto CORTO (SIN saludo, el saludo ya se dio antes):

Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.

[Politica de privacidad](https://app.creatuactivo.com/privacidad)

¿Autorizas?

- Si, autorizo
- No, gracias

IMPORTANTE: NO incluir saludo aqui (ya se dio en mensaje inicial).`;

    // 4. Reemplazar en el prompt
    const updatedPrompt = currentData.prompt.replace(oldOnboardingText, newOnboardingText);

    if (updatedPrompt === currentData.prompt) {
      console.log('⚠️ No se encontró el texto a reemplazar. Mostrando texto actual...\n');
      console.log(currentData.prompt.substring(0, 1000));
      return;
    }

    console.log('📝 TEXTO ANTERIOR (CON SALUDO DUPLICADO):');
    console.log('━'.repeat(80));
    console.log(oldOnboardingText);
    console.log('━'.repeat(80));

    console.log('\n📝 TEXTO NUEVO (SIN SALUDO, CON VIÑETAS):');
    console.log('━'.repeat(80));
    console.log(newOnboardingText);
    console.log('━'.repeat(80));

    // 5. Actualizar en Supabase
    const newVersion = 'v12.2_final_sin_saludo';

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

    console.log(`\n✅ System Prompt actualizado exitosamente a ${newVersion}`);
    console.log('\n🎯 CAMBIOS APLICADOS:');
    console.log('  ✅ Eliminado saludo duplicado "Hola, soy NEXUS"');
    console.log('  ✅ Opciones como viñetas (- en vez de A/B)');
    console.log('  ✅ Texto más clickeable y natural');
    console.log('  ✅ Mantiene compliance Ley 1581/2012');

  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

updateConsentFinal();
