#!/usr/bin/env node
/**
 * Test rápido de envío de email con Resend
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env.local') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const targetEmail = process.argv[2] || 'leniscabrejo@gmail.com';

console.log('📧 Test de envío de email con Resend\n');
console.log('   API Key:', RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('   To:', targetEmail);
console.log('');

// HTML simple para el test
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Georgia, serif; background-color: #0a0a0f; color: #E5E5E5; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h1 style="color: #D4AF37;">Hola Lenis 👋</h1>
    <p>Este es un test de reenvío del email del Reto de 5 Días.</p>
    <p>Si recibes este mensaje, el sistema de emails funciona correctamente.</p>
    <hr style="border-color: #333;">
    <p style="color: #888;">— Luis de CreaTuActivo</p>
  </div>
</body>
</html>
`;

async function enviar(fromEmail, label) {
  console.log(`📤 [${label}] Enviando desde: ${fromEmail}`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [targetEmail],
      subject: `[TEST] Reenvío Reto Día 1 - ${new Date().toLocaleTimeString()}`,
      html: htmlContent,
    }),
  });

  const result = await response.json();

  if (response.ok) {
    console.log(`   ✅ ÉXITO! ID: ${result.id}\n`);
    return true;
  } else {
    console.log(`   ❌ Error: ${result.message || JSON.stringify(result)}\n`);
    return false;
  }
}

async function main() {
  // Probar diferentes "from" emails
  const fromOptions = [
    { email: 'Luis de CreaTuActivo <hola@creatuactivo.com>', label: 'hola@' },
    { email: 'CreaTuActivo <notificaciones@creatuactivo.com>', label: 'notificaciones@' },
    { email: 'Luis de CreaTuActivo <test@creatuactivo.com>', label: 'test@' },
  ];

  for (const opt of fromOptions) {
    const success = await enviar(opt.email, opt.label);
    if (success) {
      console.log(`🎉 Email enviado exitosamente con: ${opt.label}`);
      console.log(`   Revisa tu bandeja de entrada (y spam) en: ${targetEmail}`);
      return;
    }
    // Rate limit protection
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('❌ Ningún "from" funcionó.');
  console.log('   Verifica en https://resend.com/domains que tu dominio esté verificado.');
}

main().catch(console.error);
