/**
 * SendPulse — WhatsApp Template Service
 * Queswa.app
 *
 * Flujo de dos pasos:
 *   1. Enrollar número → obtener contact_id del bot de WhatsApp
 *   2. Disparar plantilla acceso_mapa_salida con ese contact_id
 */

const SP_BASE = 'https://api.sendpulse.com'

// ─── Token cache ──────────────────────────────────────────────────────────────
let _token: string | null = null
let _tokenExpiry = 0

async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token

  const res = await fetch(`${SP_BASE}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.SENDPULSE_API_ID,
      client_secret: process.env.SENDPULSE_API_SECRET,
    }),
  })

  if (!res.ok) throw new Error(`[SendPulse] Auth ${res.status}: ${await res.text()}`)

  const data = await res.json()
  _token = data.access_token as string
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token
}

async function spPost(path: string, body: object): Promise<{ ok: boolean; data: unknown; raw: string }> {
  const token = await getAccessToken()
  const res = await fetch(`${SP_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const raw = await res.text()
  let data: unknown
  try { data = JSON.parse(raw) } catch { data = raw }
  return { ok: res.ok, data, raw }
}

async function spGet(path: string): Promise<{ ok: boolean; data: unknown }> {
  const token = await getAccessToken()
  const res = await fetch(`${SP_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const raw = await res.text()
  let data: unknown
  try { data = JSON.parse(raw) } catch { data = raw }
  return { ok: res.ok, data }
}

// ─── Bot ID cache ─────────────────────────────────────────────────────────────
let _botId: string | null = null

async function getWhatsAppBotId(): Promise<string> {
  if (_botId) return _botId

  const { ok, data } = await spGet('/whatsapp/bots')
  if (!ok) throw new Error(`[SendPulse] No se pudo obtener bots: ${JSON.stringify(data)}`)

  const bots = (data as any)?.data ?? data
  const list = Array.isArray(bots) ? bots : []
  if (!list.length) throw new Error('[SendPulse] No hay bots de WhatsApp configurados')

  _botId = String(list[0].id)
  console.log(`🤖 [SendPulse] Bot WhatsApp: ${_botId}`)
  return _botId
}

// ─── Tipos públicos ───────────────────────────────────────────────────────────
export interface ProspectData {
  name: string
  whatsapp: string   // +57XXXXXXXXXX
  email?: string
  archetype?: string
  mapaUrl?: string
  fingerprint?: string
}

export interface ConstructorInfo {
  constructorId: string
  name: string
  whatsapp?: string
}

// ─── Función principal ────────────────────────────────────────────────────────
/**
 * Paso 1: Enrolla el número en el bot de WhatsApp → obtiene contact_id
 * Paso 2: Dispara plantilla `acceso_mapa_salida` con ese contact_id
 */
export async function sendWhatsAppTemplate(
  prospect: ProspectData,
  constructor: ConstructorInfo,
): Promise<{ whatsappSent: boolean; contactId?: string; error?: string }> {

  const mapaLink = prospect.mapaUrl
    ?? `https://creatuactivo.com/mapa-de-salida/${constructor.constructorId}`

  // ── Paso 1: Obtener contact_id (enroll o lookup si ya existe) ────────────
  let contactId: string
  try {
    const botId = await getWhatsAppBotId()

    const enroll = await spPost('/whatsapp/contacts', {
      phone: prospect.whatsapp,
      bot_id: botId,
    })

    console.log(`📲 [SendPulse] Enroll response: ${enroll.raw}`)

    const enrolled = enroll.data as any
    contactId =
      enrolled?.data?.id         ??
      enrolled?.data?.contact_id ??
      enrolled?.id               ??
      enrolled?.contact_id       ??
      null

    // Contacto ya existía → buscarlo por teléfono
    if (!contactId) {
      const alreadyExists = (enrolled?.errors?.phone ?? [])
        .some((e: string) => e.toLowerCase().includes('already exists'))

      if (alreadyExists) {
        console.log(`🔍 [SendPulse] Contacto ya existe — lookup por teléfono...`)
        const lookup = await spGet(
          `/whatsapp/contacts?phone=${encodeURIComponent(prospect.whatsapp)}&bot_id=${botId}`,
        )
        console.log(`🔍 [SendPulse] Lookup: ${JSON.stringify(lookup.data)}`)

        const ld = lookup.data as any
        const list: any[] = Array.isArray(ld?.data) ? ld.data : Array.isArray(ld) ? ld : [ld]
        contactId = list[0]?.id ?? list[0]?.contact_id ?? null
      }
    }

    if (!contactId) {
      return { whatsappSent: false, error: `Sin contact_id: ${enroll.raw}` }
    }
    console.log(`✅ [SendPulse] contact_id: ${contactId}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ [SendPulse] Enroll error:', msg)
    return { whatsappSent: false, error: msg }
  }

  // ── Paso 2: Disparo de plantilla ─────────────────────────────────────────
  try {
    const send = await spPost('/whatsapp/contacts/sendTemplate', {
      contact_id: contactId,
      template: {
        name: 'acceso_mapa_salida',
        language: { code: 'es' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: prospect.name.split(' ')[0] }, // {{1}} nombre
              { type: 'text', text: mapaLink },                     // {{2}} enlace
            ],
          },
        ],
      },
    })

    console.log(`📨 [SendPulse] Template response: ${send.raw}`)

    if (!send.ok) {
      return { whatsappSent: false, contactId, error: send.raw }
    }

    console.log(`✅ [SendPulse] acceso_mapa_salida enviado → ${prospect.whatsapp}`)
    return { whatsappSent: true, contactId }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ [SendPulse] Template error:', msg)
    return { whatsappSent: false, contactId, error: msg }
  }
}
