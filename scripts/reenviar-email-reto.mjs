#!/usr/bin/env node
/**
 * Reenviar email del Reto manualmente
 * Uso: node scripts/reenviar-email-reto.mjs [email] [dia]
 */

import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

// Importar componentes de email
const { Dia1Diagnostico } = await import('../src/emails/reto-5-dias/Dia1-Diagnostico.js');

const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración
const targetEmail = process.argv[2] || 'leniscabrejo@gmail.com';
const firstName = 'Lenis';

console.log('📧 Reenviando email del Reto de 5 Días\n');
console.log('   To:', targetEmail);
console.log('   Día: 1 (Diagnóstico)');
console.log('');

async function reenviar() {
  try {
    // Renderizar el email
    console.log('🔄 Renderizando template...');
    const emailHtml = await render(Dia1Diagnostico({ firstName }));
    console.log('✅ Template renderizado\n');

    // Enviar con diferentes "from" para ver cuál funciona
    const fromOptions = [
      'Luis de CreaTuActivo <hola@creatuactivo.com>',
      'CreaTuActivo <notificaciones@creatuactivo.com>',
      'Luis de CreaTuActivo <reto@creatuactivo.com>',
    ];

    for (const from of fromOptions) {
      console.log(`📤 Intentando con: ${from}`);

      try {
        const { data, error } = await resend.emails.send({
          from: from,
          to: [targetEmail],
          subject: 'La métrica que te quita el sueño (Días de Libertad)',
          html: emailHtml,
        });

        if (error) {
          console.log(`   ❌ Error: ${error.message}`);
        } else {
          console.log(`   ✅ ÉXITO! Email ID: ${data.id}`);
          console.log(`\n🎉 Email enviado exitosamente con: ${from}`);
          console.log(`   Revisa tu bandeja de entrada (y spam) en ${targetEmail}`);
          return; // Salir después del primer éxito
        }
      } catch (err) {
        console.log(`   ❌ Exception: ${err.message}`);
      }

      // Esperar para no exceder rate limit
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n❌ Ningún "from" funcionó. Verifica la configuración de Resend.');

  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

reenviar();
