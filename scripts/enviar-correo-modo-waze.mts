/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El mensaje del modo Waze POR CORREO, a quien no lo recibe por WhatsApp
 * (Director, 5 oct 2026: Susana, en EE. UU., donde Meta no entrega plantillas de
 * marketing). Mismo texto del gancho, sin lo que solo existe en WhatsApp (el
 * formulario y el recordatorio de las 2): el botón abre queswa.app con la sesión
 * iniciada, justo en sus referencias (`/api/auth/enlace-canal` → `#destino`).
 *
 * ⚠️ Cada destinatario recibe SU enlace: es una llave de su cuenta, de un solo
 * uso y 24 h. Nunca se reenvía el correo de uno a otro.
 *
 *   npx tsx scripts/enviar-correo-modo-waze.mts <constructor_id>…            # muestra sin enviar
 *   npx tsx scripts/enviar-correo-modo-waze.mts <constructor_id>… --enviar
 */
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { enlaceAjustes } from '../src/lib/wa-destino-socio';

const args = process.argv.slice(2);
const enviar = args.includes('--enviar');
const ids = args.filter(a => !a.startsWith('--'));
if (!ids.length) { console.error('Uso: npx tsx scripts/enviar-correo-modo-waze.mts <constructor_id>… [--enviar]'); process.exit(1); }

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

const ASUNTO = '¿Ya conoce mi modo Waze?';

function cuerpoTexto(nombre: string, url: string): string {
  return (
    `Hola ${nombre} 👋, iniciamos semana. ¿Ya conoce mi modo Waze?\n\n` +
    'Igual que Waze, le marco la ruta hacia donde usted quiere llegar. Solo me falta saber a dónde va: lo que necesita al mes, la vida que quiere y su razón.\n\n' +
    'Son tres datos y un minuto, en sus Ajustes de Cuenta de queswa.app. Con este botón entra directo, con su sesión abierta:\n\n' +
    `Anotar mi destino: ${url}\n\n` +
    'El botón sirve por 24 horas. Si lo abre después, entre a queswa.app con su correo.\n\n' +
    'Queswa'
  );
}

function cuerpoHtml(nombre: string, url: string): string {
  const p = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#1F2328;';
  return `<!doctype html><html lang="es"><body style="margin:0;padding:0;background:#F4F2EE;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F2EE;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border:1px solid #E6E1D6;padding:32px 28px;font-family:Inter,Helvetica,Arial,sans-serif;">
<tr><td>
<p style="${p}">Hola ${nombre} 👋, iniciamos semana. ¿Ya conoce mi modo Waze?</p>
<p style="${p}">Igual que Waze, le marco la ruta hacia donde usted quiere llegar. Solo me falta saber a dónde va: lo que necesita al mes, la vida que quiere y su razón.</p>
<p style="${p}">Son tres datos y un minuto, en sus Ajustes de Cuenta de queswa.app. Con este botón entra directo, con su sesión abierta:</p>
<p style="margin:24px 0;"><a href="${url}" style="display:inline-block;background:#C5A059;color:#0F1115;text-decoration:none;font-weight:600;font-size:16px;padding:14px 28px;">Anotar mi destino</a></p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#5B616B;">El botón sirve por 24 horas. Si lo abre después, entre a queswa.app con su correo.</p>
<p style="margin:0;font-size:15px;color:#1F2328;">Queswa</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

for (const id of ids) {
  const { data: u } = await sb.from('private_users').select('name, email, status').eq('constructor_id', id).maybeSingle();
  if (!u?.email || u.status !== 'active') { console.error(`❌ ${id}: sin correo o no activo`); continue; }
  const crudo = String(u.name ?? '').trim().split(/\s+/)[0] || 'buenas';
  const nombre = crudo.charAt(0).toLocaleUpperCase('es') + crudo.slice(1).toLocaleLowerCase('es');
  if (!enviar) { console.log(`🟡 ${id} → ${u.email} · «${ASUNTO}» · Hola ${nombre}`); continue; }
  const url = await enlaceAjustes(id, 'ajustes-destino');
  if (!url) { console.error(`❌ ${id}: el Dashboard no dio el enlace`); continue; }
  if (!url.includes('destino=ajustes-destino')) { console.error(`❌ ${id}: el enlace no trae el destino (¿Dashboard sin desplegar?)`); continue; }
  const { data, error } = await resend.emails.send({
    from: 'Queswa <hola@creatuactivo.com>',
    to: [u.email],
    subject: ASUNTO,
    html: cuerpoHtml(nombre, url),
    text: cuerpoTexto(nombre, url),
  });
  console.log(error ? `❌ ${id}: ${error.message}` : `✅ ${id} → ${u.email} (id ${data?.id})`);
}
