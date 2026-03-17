/**
 * SendPulse CRM + WhatsApp Service
 * Queswa.app — Infraestructura de Élite Fase 1
 *
 * Autenticación OAuth2 + inyección de prospectos en CRM + disparo de plantilla WhatsApp.
 */

const SP_BASE = 'https://api.sendpulse.com'
const API_ID  = process.env.SENDPULSE_API_ID!
const SECRET  = process.env.SENDPULSE_API_SECRET!

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
      client_id: API_ID,
      client_secret: SECRET,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`[SendPulse] Auth failed ${res.status}: ${body}`)
  }

  const data = await res.json()
  _token = data.access_token as string
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000   // refresh 1 min antes
  return _token
}

// ─── Helpers de bajo nivel ────────────────────────────────────────────────────
async function spFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken()
  return fetch(`${SP_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
}

// ─── Tipos públicos ───────────────────────────────────────────────────────────
export interface ProspectData {
  /** Nombre completo del prospecto */
  name: string
  /** WhatsApp en formato +57XXXXXXXXXX */
  whatsapp: string
  /** Email (opcional) */
  email?: string
  /** Arquetipo detectado por NEXUS */
  archetype?: string
  /** URL del mapa de salida personalizado */
  mapaUrl?: string
  /** Fingerprint del prospecto en Supabase */
  fingerprint?: string
}

export interface ConstructorInfo {
  /** constructor_id slug, p.ej. "luis-cabrejo-1288" */
  constructorId: string
  /** Nombre del socio */
  name: string
  /** WhatsApp del socio */
  whatsapp?: string
}

// ─── Buscar o crear pipeline "Activación (Consumiendo Mapa)" ─────────────────
async function getOrCreatePipeline(name = 'Activación (Consumiendo Mapa)'): Promise<string | null> {
  try {
    const res = await spFetch('/crm/v1/pipelines')
    if (!res.ok) return null
    const { data } = await res.json()
    const pipelines: Array<{ id: string; name: string }> = Array.isArray(data) ? data : []
    const found = pipelines.find(p => p.name === name)
    if (found) return found.id

    // Crear pipeline si no existe
    const create = await spFetch('/crm/v1/pipelines', {
      method: 'POST',
      body: JSON.stringify({ name, is_active: true }),
    })
    if (!create.ok) return null
    const { data: newPipeline } = await create.json()
    return newPipeline?.id ?? null
  } catch {
    return null
  }
}

// ─── Función principal ────────────────────────────────────────────────────────
/**
 * Inyecta al prospecto en el CRM SendPulse (etapa "Activación (Consumiendo Mapa)")
 * y dispara la plantilla WhatsApp `acceso_mapa_salida`.
 */
export async function createDealAndTriggerWhatsApp(
  prospect: ProspectData,
  constructor: ConstructorInfo,
): Promise<{ dealId: string | null; whatsappSent: boolean }> {
  let dealId: string | null = null
  let whatsappSent = false

  // 1. Obtener pipeline id
  const pipelineId = await getOrCreatePipeline()

  // 2. Crear o actualizar contacto en CRM
  try {
    const contactRes = await spFetch('/crm/v1/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email: prospect.email ?? undefined,
        phone: prospect.whatsapp,
        first_name: prospect.name.split(' ')[0],
        last_name: prospect.name.split(' ').slice(1).join(' ') || undefined,
        custom_fields: [
          { name: 'arquetipo', value: prospect.archetype ?? '' },
          { name: 'fingerprint', value: prospect.fingerprint ?? '' },
          { name: 'Socio_Nombre', value: constructor.name },
          { name: 'Socio_WhatsApp', value: constructor.whatsapp ?? '' },
        ],
      }),
    })

    const contactData = contactRes.ok ? await contactRes.json() : null
    const contactId: string | null = contactData?.data?.id ?? null

    // 3. Crear deal en pipeline si tenemos contact + pipeline
    if (contactId && pipelineId) {
      const dealRes = await spFetch('/crm/v1/deals', {
        method: 'POST',
        body: JSON.stringify({
          name: `Prospecto ${prospect.name} → ${constructor.constructorId}`,
          pipeline_id: pipelineId,
          contact_id: contactId,
          custom_fields: [
            { name: 'mapa_url', value: prospect.mapaUrl ?? '' },
            { name: 'constructor_id', value: constructor.constructorId },
          ],
        }),
      })
      const dealData = dealRes.ok ? await dealRes.json() : null
      dealId = dealData?.data?.id ?? null
    }
  } catch (err) {
    console.error('❌ [SendPulse] CRM error:', err)
  }

  // 4. Disparar plantilla WhatsApp vía SendPulse Chatbots API
  try {
    const mapaLink = prospect.mapaUrl ?? `https://creatuactivo.com/mapa-de-salida?ref=${constructor.constructorId}`

    const waRes = await spFetch('/whatsapp/contacts/sendTemplate', {
      method: 'POST',
      body: JSON.stringify({
        contact_phone: prospect.whatsapp,
        template: {
          name: 'acceso_mapa_salida',
          language: { code: 'es' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: prospect.name.split(' ')[0] },  // {{1}} nombre prospecto
                { type: 'text', text: mapaLink },                      // {{2}} enlace privado
              ],
            },
          ],
        },
      }),
    })

    whatsappSent = waRes.ok
    if (!waRes.ok) {
      const err = await waRes.text()
      console.warn('⚠️ [SendPulse] WhatsApp template error:', err)
    }
  } catch (err) {
    console.error('❌ [SendPulse] WhatsApp error:', err)
  }

  console.log(`✅ [SendPulse] deal=${dealId} whatsapp=${whatsappSent} prospect=${prospect.name}`)
  return { dealId, whatsappSent }
}
