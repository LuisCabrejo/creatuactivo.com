/**
 * Webhook — Prospect Capture → WhatsApp Template
 * Queswa.app
 *
 * Recibe señal cuando un prospecto solicita el Mapa de Salida,
 * resuelve datos del constructor desde Supabase y dispara
 * la plantilla WhatsApp `acceso_mapa_salida` via SendPulse.
 *
 * Header requerido: x-webhook-secret = {WEBHOOK_SECRET}
 *
 * Body esperado:
 * {
 *   prospect: { name, whatsapp, email?, archetype?, mapaUrl?, fingerprint? },
 *   constructorId: "luis-cabrejo-1288"
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { sendWhatsAppTemplate, type ProspectData, type ConstructorInfo } from '@/lib/whatsapp-meta'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET?.trim()

// ─── Health check ─────────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'webhooks/prospect-capture', version: '2.0' })
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Verificar secret
  if (WEBHOOK_SECRET) {
    const incoming = request.headers.get('x-webhook-secret')?.trim()
    if (incoming !== WEBHOOK_SECRET) {
      console.warn('🔐 [prospect-capture] Unauthorized — secret mismatch')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 2. Validar campos mínimos
  const raw = body.prospect as Partial<ProspectData> | undefined
  const constructorSlug = (body.constructorId as string | undefined)?.trim()

  if (!raw?.name || !raw?.whatsapp || !constructorSlug) {
    return NextResponse.json(
      { error: 'Missing required fields: prospect.name, prospect.whatsapp, constructorId' },
      { status: 400 },
    )
  }

  const prospect: ProspectData = {
    name:        raw.name.trim(),
    whatsapp:    normalizePhone(raw.whatsapp),
    email:       raw.email?.toLowerCase().trim(),
    archetype:   raw.archetype,
    mapaUrl:     raw.mapaUrl,
    fingerprint: raw.fingerprint,
  }

  // 3. Resolver datos del constructor desde Supabase
  const { data: user } = await supabase
    .from('private_users')
    .select('name, whatsapp')
    .eq('constructor_id', constructorSlug)
    .single()

  if (!user) {
    console.warn(`⚠️ [prospect-capture] Constructor not found: ${constructorSlug}`)
  }

  const constructor: ConstructorInfo = {
    constructorId: constructorSlug,
    name:      (user as any)?.name     ?? constructorSlug,
    whatsapp:  (user as any)?.whatsapp ?? undefined,
  }

  // 4. Disparar plantilla WhatsApp
  const result = await sendWhatsAppTemplate(prospect, constructor)

  console.log(`✅ [prospect-capture] ${prospect.name} → whatsapp=${result.whatsappSent}`)
  return NextResponse.json({ ok: true, ...result })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('57') && digits.length === 12) return `+${digits}`
  if (digits.length === 10) return `+57${digits}`
  return phone.startsWith('+') ? phone : `+${digits}`
}
