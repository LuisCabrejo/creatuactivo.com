/**
 * Copyright © 2026 CreaTuActivo.com
 * Email Open Tracking Pixel
 *
 * GET /api/email-open?e=BASE64_EMAIL&id=EMAIL_NUMBER&s=SEQUENCE
 *
 * 1. Decodifica el email del lead
 * 2. Busca el constructor que invitó al prospecto (device_info.invited_by)
 * 3. Dispara push notification al constructor en queswa.app
 * 4. Retorna una imagen GIF 1×1 transparente
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://queswa.app'

// GIF 1×1 transparente (base64)
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

// Supabase con service role para leer device_info sin restricciones
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const EMAIL_LABELS: Record<number, string> = {
  0: 'el email de bienvenida',
  1: 'Email 1 – Backstory',
  2: 'Email 2 – El Muro',
  3: 'Email 3 – La Epifanía',
  4: 'Email 4 – El Plan Oculto',
  5: 'Email 5 – Urgencia',
  11: 'Día 1 – El Diagnóstico',
  12: 'Día 2 – Los Vehículos',
  13: 'Día 3 – El Modelo',
  14: 'Día 4 – El Estigma',
  15: 'Día 5 – La Invitación',
}

async function notifyConstructor(constructorId: string, title: string, body: string) {
  try {
    await fetch(`${DASHBOARD_URL}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        constructorId,
        type: 'new_prospect',
        title,
        body,
        url: '/inteligencia/primer-iniciar',
      }),
    })
  } catch {
    // silencioso — no bloqueante
  }
}

export async function GET(request: NextRequest) {
  // Siempre devolver el pixel primero (respuesta inmediata)
  const response = new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })

  // Procesar tracking en background (no bloquea la respuesta del pixel)
  const { searchParams } = new URL(request.url)
  const encodedEmail = searchParams.get('e')
  const emailId = parseInt(searchParams.get('id') || '0', 10)

  if (!encodedEmail) return response

  // Decodificar email
  let leadEmail: string
  try {
    leadEmail = Buffer.from(encodedEmail, 'base64').toString('utf8').toLowerCase().trim()
    if (!leadEmail.includes('@')) return response
  } catch {
    return response
  }

  const emailLabel = EMAIL_LABELS[emailId] || `email #${emailId}`

  // Buscar constructor en device_info por email (async, no bloquea pixel)
  ;(async () => {
    try {
      const supabase = getSupabase()

      // 1. Buscar en device_info por email para obtener el constructor que lo invitó
      const { data: deviceRows } = await supabase
        .from('device_info')
        .select('invited_by, name')
        .eq('email', leadEmail)
        .not('invited_by', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      const constructorId = deviceRows?.[0]?.invited_by
      const prospectName = deviceRows?.[0]?.name

      if (!constructorId) {
        console.log(`ℹ️ [EmailOpen] No hay constructor para ${leadEmail}`)
        return
      }

      const displayName = prospectName?.split(' ')[0] || 'Un prospecto'
      console.log(`📧 [EmailOpen] ${displayName} abrió ${emailLabel} → notificando ${constructorId}`)

      await notifyConstructor(
        constructorId,
        `📧 ¡${displayName} abrió ${emailLabel}!`,
        `${displayName} acaba de leer tu secuencia de emails. Es el momento de contactar.`
      )
    } catch (err) {
      console.error('❌ [EmailOpen] Error en tracking:', err)
    }
  })()

  return response
}
