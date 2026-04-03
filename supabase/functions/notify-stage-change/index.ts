// supabase/functions/notify-stage-change/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const ADMIN_EMAIL = 'sistema@creatuactivo.com'
const ADMIN_WHATSAPP = '573215193909'

interface StageChangePayload {
  prospect_id: number
  session_id: string
  name: string | null
  email: string | null
  phone: string | null
  old_stage: string
  new_stage: string
  archetype: string | null
  interest_score: number
  package?: string | null
}

function buildEmailHtml(payload: StageChangePayload, constructorName: string, isHotProspect: boolean): string {
  const packageLabel = payload.package || 'No especificado'
  const prospectName = payload.name || 'Sin nombre'

  const waTextEncoded = encodeURIComponent(
    `Hola CreaTuActivo. Soy ${prospectName}. Completé mi evaluación con Queswa y confirmo activación con inventario ${packageLabel}. Quedo atento a instrucciones.`
  )

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0F1115 0%, #1A1D23 100%); border-bottom: 2px solid #C5A059; color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .gold { color: #C5A059; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .badge-hot { background: #10b981; color: white; }
    .badge-warm { background: #3b82f6; color: white; }
    .info-row { margin: 12px 0; padding: 14px; background: white; border-radius: 8px; border-left: 4px solid #C5A059; }
    .info-label { font-size: 11px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; }
    .info-value { font-size: 16px; color: #1f2937; margin-top: 4px; font-weight: 500; }
    .cta-button { display: inline-block; padding: 14px 28px; background: #C5A059; color: #0F1115; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 8px 4px; }
    .cta-secondary { display: inline-block; padding: 12px 22px; background: transparent; border: 1px solid #C5A059; color: #C5A059; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 8px 4px; font-size: 14px; }
    .alert-box { background: #fef3c7; border-left: 4px solid #C5A059; padding: 15px; border-radius: 8px; margin-top: 20px; }
    .package-highlight { background: #0F1115; color: #C5A059; padding: 10px 18px; border-radius: 6px; font-size: 18px; font-weight: bold; display: inline-block; margin: 10px 0; }
    .footer { text-align: center; margin-top: 24px; color: #9ca3af; font-size: 13px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 22px; font-weight: 700;">
        ${isHotProspect ? '🔥 Prospecto en fase <span class="gold">ACTIVAR</span>' : `🎯 Avance a ${payload.new_stage}`}
      </h1>
      <p style="margin: 8px 0 0 0; opacity: 0.8; font-size: 14px;">
        ${isHotProspect ? 'Acción requerida — prospecto listo para iniciar' : 'Nuevo avance en el embudo'}
      </p>
    </div>

    <div class="content">
      <p>Hola <strong>${constructorName}</strong>,</p>
      <p>
        ${isHotProspect
          ? `<strong>${prospectName}</strong> completó su evaluación con Queswa y está listo para activar su posición.`
          : `<strong>${prospectName}</strong> avanzó de <strong>${payload.old_stage}</strong> a <strong>${payload.new_stage}</strong>.`
        }
      </p>

      <div style="text-align: center; margin: 16px 0;">
        <span class="badge ${isHotProspect ? 'badge-hot' : 'badge-warm'}">${payload.new_stage}</span>
      </div>

      ${isHotProspect && payload.package ? `
      <div style="text-align: center; margin: 16px 0;">
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Paquete seleccionado</div>
        <span class="package-highlight">${payload.package}</span>
      </div>
      ` : ''}

      <hr class="divider">

      <div class="info-row">
        <div class="info-label">Nombre</div>
        <div class="info-value">${prospectName}</div>
      </div>

      ${payload.email ? `
      <div class="info-row">
        <div class="info-label">Email</div>
        <div class="info-value">${payload.email}</div>
      </div>` : ''}

      ${payload.phone ? `
      <div class="info-row">
        <div class="info-label">WhatsApp</div>
        <div class="info-value">${payload.phone}</div>
      </div>` : ''}

      ${payload.archetype ? `
      <div class="info-row">
        <div class="info-label">Perfil</div>
        <div class="info-value">${payload.archetype}</div>
      </div>` : ''}

      ${payload.package ? `
      <div class="info-row">
        <div class="info-label">Paquete elegido</div>
        <div class="info-value">${payload.package}</div>
      </div>` : ''}

      <div class="info-row">
        <div class="info-label">Nivel de interés</div>
        <div class="info-value">${payload.interest_score}/10</div>
      </div>

      <hr class="divider">

      <div style="text-align: center; margin: 20px 0;">
        ${payload.phone ? `
        <a href="https://wa.me/${payload.phone.replace(/\D/g, '')}" class="cta-button">
          💬 WhatsApp al prospecto
        </a>` : ''}
        <a href="https://wa.me/${ADMIN_WHATSAPP}?text=${waTextEncoded}" class="cta-secondary">
          📋 Ver expediente en WA admin
        </a>
      </div>

      ${isHotProspect ? `
      <div class="alert-box">
        <strong style="color: #92400e;">⚡ Acción recomendada:</strong>
        <p style="color: #78350f; margin: 8px 0 0 0; font-size: 14px;">
          Contacta a ${prospectName} en las próximas 2 horas para coordinar la transacción y activar su acceso a la plataforma.
        </p>
      </div>` : ''}
    </div>

    <div class="footer">
      <p>Queswa AI · <a href="https://creatuactivo.com" style="color: #C5A059;">CreaTuActivo</a></p>
    </div>
  </div>
</body>
</html>`
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const payload: StageChangePayload = await req.json()
    console.log('📧 [Notify Stage Change] Processing:', payload)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const isHotProspect = payload.new_stage === 'ACTIVAR'

    // Obtener constructor del prospecto (puede ser null para tráfico orgánico)
    const { data: prospect } = await supabase
      .from('prospects')
      .select(`
        constructor_id,
        constructores(nombre, email, telefono)
      `)
      .eq('fingerprint_id', payload.session_id)
      .single()

    const constructor = prospect?.constructores as { nombre: string; email: string; telefono?: string } | null

    // Determinar destinatarios
    // - Constructor asignado: siempre recibe si existe
    // - Admin: siempre recibe CC (tráfico orgánico o con constructor)
    const toAddresses: string[] = []
    const constructorName = constructor?.nombre || 'Equipo CreaTuActivo'

    if (constructor?.email) {
      toAddresses.push(constructor.email)
    }

    // Admin siempre recibe (sea tráfico orgánico o referido)
    if (!toAddresses.includes(ADMIN_EMAIL)) {
      toAddresses.push(ADMIN_EMAIL)
    }

    const emailSubject = isHotProspect
      ? `🔥 ACTIVAR — ${payload.name || 'Prospecto'} ${payload.package ? `· ${payload.package}` : ''}`
      : `🎯 ${payload.new_stage} — ${payload.name || 'Nuevo prospecto'}`

    const emailHtml = buildEmailHtml(payload, constructorName, isHotProspect)

    // Enviar a todos los destinatarios
    const emailResults = await Promise.all(toAddresses.map(async (to) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Queswa <nexus@creatuactivo.com>',
          to,
          subject: emailSubject,
          html: emailHtml
        })
      })
      const result = await res.json()
      if (!res.ok) console.error(`❌ Resend error for ${to}:`, result)
      else console.log(`✅ Email sent to ${to}:`, result.id)
      return { to, ok: res.ok, id: result.id }
    }))

    return new Response(JSON.stringify({
      success: true,
      recipients: emailResults,
      organic_traffic: !constructor
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Error in notify-stage-change:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
