/**
 * SendPulse — WhatsApp Template Service
 * Queswa.app
 *
 * Responsabilidad única: autenticar con SendPulse y disparar
 * la plantilla WhatsApp aprobada por Meta.
 */

const SP_BASE = 'https://api.sendpulse.com'

// ─── Token cache in-memory (válido 1 hora) ───────────────────────────────────
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

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[SendPulse] Auth failed ${res.status}: ${body}`)
  }

  const data = await res.json()
  _token = data.access_token as string
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token
}

// ─── Tipos públicos ───────────────────────────────────────────────────────────
export interface ProspectData {
  name: string
  whatsapp: string    // +57XXXXXXXXXX
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
 * Dispara la plantilla WhatsApp `acceso_mapa_salida` al prospecto.
 * Variables: {{1}} = nombre prospecto, {{2}} = enlace mapa
 */
export async function sendWhatsAppTemplate(
  prospect: ProspectData,
  constructor: ConstructorInfo,
): Promise<{ whatsappSent: boolean; error?: string }> {
  const mapaLink = prospect.mapaUrl
    ?? `https://creatuactivo.com/mapa-de-salida/${constructor.constructorId}`

  try {
    const token = await getAccessToken()

    const res = await fetch(`${SP_BASE}/whatsapp/contacts/sendTemplate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contact_phone: prospect.whatsapp,
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
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.warn(`⚠️ [SendPulse] WhatsApp ${res.status}: ${errBody}`)
      return { whatsappSent: false, error: errBody }
    }

    console.log(`✅ [SendPulse] acceso_mapa_salida → ${prospect.whatsapp} (${prospect.name})`)
    return { whatsappSent: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ [SendPulse] WhatsApp error:', msg)
    return { whatsappSent: false, error: msg }
  }
}
