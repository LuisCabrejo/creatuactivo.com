// supabase/functions/notify-stage-change/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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
}

serve(async (req) => {
  try {
    // Solo permitir POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const payload: StageChangePayload = await req.json()

    console.log('📧 [Notify Stage Change] Processing:', payload)

    // Crear cliente Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Obtener información del constructor
    const { data: prospect } = await supabase
      .from('prospects')
      .select(`
        constructor_id,
        constructores(
          nombre,
          email,
          telefono
        )
      `)
      .eq('fingerprint_id', payload.session_id)
      .single()

    if (!prospect || !prospect.constructores) {
      console.error('❌ Constructor not found for session:', payload.session_id)
      return new Response(JSON.stringify({ error: 'Constructor not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const constructor = prospect.constructores

    // Determinar tipo de notificación
    const isHotProspect = payload.new_stage === 'ACTIVAR'

    // Construir email
    const emailSubject = isHotProspect
      ? `🔥 ¡Prospecto CALIENTE! ${payload.name || 'Nuevo prospecto'} avanzó a ACTIVAR`
      : `🎯 Prospecto avanzó a ${payload.new_stage}: ${payload.name || 'Sin nombre'}`

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .badge-hot { background: #10b981; color: white; }
    .badge-warm { background: #3b82f6; color: white; }
    .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #7C3AED; }
    .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; }
    .info-value { font-size: 16px; color: #1f2937; margin-top: 4px; }
    .cta-button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">
        ${isHotProspect ? '🔥 ¡Prospecto CALIENTE!' : '🎯 Actualización de Prospecto'}
      </h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">
        ${isHotProspect ? 'Acción inmediata requerida' : 'Nuevo avance en el funnel'}
      </p>
    </div>

    <div class="content">
      <p>Hola <strong>${constructor.nombre}</strong>,</p>

      <p>
        ${isHotProspect
          ? `Tu prospecto <strong>${payload.name || 'Sin nombre'}</strong> ha alcanzado la etapa <strong>ACTIVAR</strong> y está listo para contacto directo.`
          : `Tu prospecto <strong>${payload.name || 'Sin nombre'}</strong> ha avanzado de <strong>${payload.old_stage}</strong> a <strong>${payload.new_stage}</strong>.`
        }
      </p>

      <div style="text-align: center; margin: 20px 0;">
        <span class="badge ${isHotProspect ? 'badge-hot' : 'badge-warm'}">
          ${payload.new_stage}
        </span>
      </div>

      <div class="info-row">
        <div class="info-label">Nombre</div>
        <div class="info-value">${payload.name || 'No proporcionado'}</div>
      </div>

      ${payload.email ? `
      <div class="info-row">
        <div class="info-label">Email</div>
        <div class="info-value">${payload.email}</div>
      </div>
      ` : ''}

      ${payload.phone ? `
      <div class="info-row">
        <div class="info-label">Teléfono / WhatsApp</div>
        <div class="info-value">${payload.phone}</div>
      </div>
      ` : ''}

      ${payload.archetype ? `
      <div class="info-row">
        <div class="info-label">Perfil</div>
        <div class="info-value">${payload.archetype}</div>
      </div>
      ` : ''}

      <div class="info-row">
        <div class="info-label">Nivel de Interés</div>
        <div class="info-value">${payload.interest_score}/10</div>
      </div>

      ${isHotProspect && payload.phone ? `
      <div style="text-align: center;">
        <a href="https://wa.me/${payload.phone.replace(/\D/g, '')}" class="cta-button">
          💬 Contactar por WhatsApp
        </a>
      </div>
      ` : ''}

      <div style="text-align: center;">
        <a href="https://app.creatuactivo.com" class="cta-button">
          📊 Ver en Dashboard
        </a>
      </div>

      ${isHotProspect ? `
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <strong style="color: #92400e;">⚡ Acción Recomendada:</strong>
        <p style="color: #78350f; margin: 10px 0 0 0;">
          Contacta a este prospecto en las próximas 24 horas para maximizar la conversión.
        </p>
      </div>
      ` : ''}
    </div>

    <div class="footer">
      <p>Este es un email automatizado de <strong>CreaTuActivo</strong></p>
      <p style="font-size: 12px; color: #9ca3af;">
        Enviado por NEXUS AI | Framework IAA (Iniciar → Acoger → Activar)
      </p>
    </div>
  </div>
</body>
</html>
    `

    // Enviar email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NEXUS AI <nexus@creatuactivo.com>',
        to: constructor.email,
        subject: emailSubject,
        html: emailHtml
      })
    })

    const emailResult = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('❌ Resend error:', emailResult)
      throw new Error(`Resend API error: ${emailResult.message}`)
    }

    console.log('✅ Email sent:', emailResult)

    return new Response(JSON.stringify({
      success: true,
      email_id: emailResult.id,
      constructor_email: constructor.email
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Error in notify-stage-change:', error)
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
