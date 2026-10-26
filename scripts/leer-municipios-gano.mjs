#!/usr/bin/env node
/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Regenera src/lib/gano-municipios.ts: los municipios de cada departamento tal
 * como los ofrece el checkout de Gano Excel (25 oct 2026, Director: que el
 * municipio se elija de la lista del departamento, como en el back office).
 *
 * Lee `StateCountyListShipping` de RequestAct=0 en OrderingCheckOutBackThread.aspx.
 * Solo lectura: abre la sesión e inicia el checkout, no crea pedido ni carrito.
 * Usa la cuenta que cotiza los envíos (GANO_COTIZADOR_CONSTRUCTOR_ID, por defecto
 * la del Director).
 *
 * Necesita el repositorio del Dashboard al lado (../Dashboard): de ahí toma la
 * sesión de Gano (scripts/lib/gano-sesion.mjs) y su .env.local (la llave de las
 * credenciales vive allá, no aquí).
 *
 *   node scripts/leer-municipios-gano.mjs          → escribe el módulo
 *   node scripts/leer-municipios-gano.mjs --dry    → solo muestra lo que cambiaría
 */

import fs from 'fs'
import path from 'path'

const RAIZ = path.resolve(new URL('..', import.meta.url).pathname)
const DASHBOARD = path.resolve(RAIZ, '..', 'Dashboard')
const SALIDA = path.join(RAIZ, 'src/lib/gano-municipios.ts')
const dry = process.argv.includes('--dry')

if (!fs.existsSync(path.join(DASHBOARD, 'scripts/lib/gano-sesion.mjs'))) {
  console.error(`❌ No encuentro el Dashboard en ${DASHBOARD}: este script usa su sesión de Gano y su .env.local.`)
  process.exit(1)
}
const { abrirSesionGano } = await import(path.join(DASHBOARD, 'scripts/lib/gano-sesion.mjs'))
const env = Object.fromEntries(
  fs.readFileSync(path.join(DASHBOARD, '.env.local'), 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }),
)
const cuenta = env.GANO_COTIZADOR_CONSTRUCTOR_ID || 'luis-cabrejo-1288'

// ── Leer de Gano ──
const rc = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_gano_credentials`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
  body: JSON.stringify({ p_constructor_id: cuenta, p_secret_key: env.GANO_ENCRYPTION_KEY }),
})
const cred = await rc.json()
if (!cred?.success) { console.error(`❌ ${cuenta} no tiene credenciales de Gano legibles.`); process.exit(1) }
const sesion = await abrirSesionGano({ usuario: cred.gano_user_id, clave: cred.gano_password })
const ctx = await sesion.post('OrderingCheckOutBackThread.aspx', 'RequestAct=0')
const crudo = ctx.json?.StateCountyListShipping
if (!crudo || typeof crudo !== 'object' || !Object.keys(crudo).length) {
  console.error(`❌ Gano no devolvió StateCountyListShipping (HTTP ${ctx.status}). No se toca nada.`)
  process.exit(1)
}

// ── Lo que se guarda: el nombre EXACTO de Gano, ordenado ──
const municipios = {}
for (const [depto, v] of Object.entries(crudo)) {
  const nombres = [...new Set((v?.CountyList || []).map((c) => String(c?.CountyName || '').trim()).filter(Boolean))]
  if (nombres.length) municipios[depto] = nombres.sort((a, b) => a.localeCompare(b, 'es'))
}

// ── Lo que se muestra: legible, sin mayúscula sostenida ──
// Gano marca homónimos con la inicial del departamento entre paréntesis
// («ARMENIA (Q)»): se quita solo si el nombre no choca con otro del mismo
// departamento («RICAURTE (N)» y «RICAURTE (Na)» se quedan como están).
// Y arregla lo que viene dañado de origen («EL PIÃON» es El Piñón).
const DAÑADOS = { 'EL PIÃON': 'EL PIÑÓN' }
const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e'])
const mayus = (w) => (w[0] === '(' ? '(' + w.charAt(1).toUpperCase() + w.slice(2) : w.charAt(0).toUpperCase() + w.slice(1))
const titulo = (n) => n.toLowerCase().split(' ').map((w, i) => (i > 0 && MINUSCULAS.has(w) ? w : mayus(w))).join(' ').replace(/D\.c\.$/, 'D.C.')
const SUFIJO = /\s*\(\s*[A-Za-z]{1,2}\s*\)$/
const etiquetas = {}
for (const nombres of Object.values(municipios)) {
  const base = (n) => (DAÑADOS[n] ?? n).replace(SUFIJO, '').trim()
  for (const n of nombres) {
    const limpio = nombres.filter((m) => base(m) === base(n)).length === 1 ? base(n) : (DAÑADOS[n] ?? n)
    if (titulo(limpio) !== titulo(n)) etiquetas[n] = titulo(limpio)
  }
}

// ── Escribir ──
const deptos = Object.keys(municipios).sort()
const total = deptos.reduce((s, d) => s + municipios[d].length, 0)
const hoy = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Bogota' })
const cuerpo = `/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * GENERADO por scripts/leer-municipios-gano.mjs (${hoy}): no se edita a mano.
 *
 * Los municipios a los que despacha Gano Excel, por departamento, como los ofrece
 * su checkout (\`StateCountyListShipping\`): ${deptos.length} departamentos, ${total} destinos.
 * Incluye corregimientos e inspecciones que Servientrega atiende (Apiay, en el Meta).
 * El valor que va a Gano es el nombre EXACTO de esta lista; lo que se muestra
 * sale de \`etiquetaMunicipio\`. Lo carga la hoja de pago con import() al abrirse,
 * para que el catálogo no pese más.
 */

export const MUNICIPIOS_GANO: Record<string, string[]> = {
${deptos.map((d) => `  ${d}: ${JSON.stringify(municipios[d])},`).join('\n')}
}

/** Los nombres que no se leen bien con solo quitar la mayúscula sostenida. */
const ETIQUETAS: Record<string, string> = ${JSON.stringify(etiquetas, null, 2).replace(/\n}/, ',\n}').replace(/,\n,/, ',')}

const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e'])
const mayus = (w: string) => (w[0] === '(' ? '(' + w.charAt(1).toUpperCase() + w.slice(2) : w.charAt(0).toUpperCase() + w.slice(1))

/** «PUERTO GAITÁN» → «Puerto Gaitán»; «ARMENIA (Q)» → «Armenia». */
export function etiquetaMunicipio(nombre: string): string {
  return ETIQUETAS[nombre] ?? nombre.toLowerCase().split(' ').map((w, i) => (i > 0 && MINUSCULAS.has(w) ? w : mayus(w))).join(' ').replace(/D\\.c\\.$/, 'D.C.')
}
`

const anterior = fs.existsSync(SALIDA) ? fs.readFileSync(SALIDA, 'utf8') : ''
const sinFecha = (s) => s.replace(/\(\d{1,2} [a-z.]+ \d{4}\)/, '')
console.log(`${deptos.length} departamentos, ${total} destinos, ${Object.keys(etiquetas).length} etiquetas especiales.`)
console.log('Etiquetas:', Object.entries(etiquetas).map(([k, v]) => `${k} → ${v}`).join(' · '))
if (sinFecha(anterior) === sinFecha(cuerpo)) { console.log('✅ Sin cambios frente a lo guardado.'); process.exit(0) }
if (dry) { console.log(`(--dry) ${anterior ? 'Cambió' : 'Es nuevo'}; no se escribió ${path.relative(RAIZ, SALIDA)}.`); process.exit(0) }
fs.writeFileSync(SALIDA, cuerpo)
console.log(`✅ Escrito ${path.relative(RAIZ, SALIDA)}.`)
