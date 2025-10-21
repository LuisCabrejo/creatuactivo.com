// Script para agregar instrucción ESTRICTA: usar EXACTAMENTE el texto acordado
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOnboardingStrict() {
  console.log('🔄 Aplicando instrucción ESTRICTA para onboarding...\n');

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

    // Texto actual
    const oldOnboarding = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

Cuando detectes que es la primera interaccion, usa este texto CORTO (SIN saludo, el saludo ya se dio antes):

Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.

[Politica de privacidad](https://app.creatuactivo.com/privacidad)

¿Autorizas?

- Si, autorizo
- No, gracias

IMPORTANTE: NO incluir saludo aqui (ya se dio en mensaje inicial).`;

    // Texto con instrucción ESTRICTA
    const newOnboarding = `## ONBOARDING MINIMALISTA (PRIMERA INTERACCION)

🚨 INSTRUCCION CRITICA: En la primera interaccion, usa EXACTAMENTE este texto (palabra por palabra, SIN agregar emojis, SIN agregar saludos, SIN expandir):

---
Para personalizar tu experiencia, usaremos tu nombre, ocupacion y WhatsApp.

[Politica de privacidad](https://app.creatuactivo.com/privacidad)

¿Autorizas?

- Si, autorizo
- No, gracias
---

PROHIBIDO:
❌ Agregar "Hola" o cualquier saludo
❌ Agregar emojis (🚀, ✅, ❌, etc.)
❌ Agregar texto sobre "arquitecto tecnologico" o "tiempo de vuelta"
❌ Agregar "Una vez que tengamos eso claro..." o similares
❌ Expandir o interpretar - USA EL TEXTO EXACTO

OBLIGATORIO:
✅ Copiar y pegar el texto de arriba palabra por palabra
✅ Mantener el formato markdown simple
✅ Mantener las viñetas (- Si, autorizo / - No, gracias)`;

    const updatedPrompt = currentData.prompt.replace(oldOnboarding, newOnboarding);

    if (updatedPrompt === currentData.prompt) {
      console.log('⚠️ No se encontró el texto a reemplazar\n');
      return;
    }

    const newVersion = 'v12.2_strict_onboarding';

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

    console.log(`✅ Actualizado a ${newVersion}`);
    console.log('\n🎯 CAMBIOS:');
    console.log('  ✅ Instrucción ESTRICTA: usar texto EXACTO');
    console.log('  ✅ PROHIBIDO agregar saludos, emojis, o texto adicional');
    console.log('  ✅ Lista detallada de qué NO hacer');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

fixOnboardingStrict();
