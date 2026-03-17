/**
 * middleware.ts — Capa de Enrutamiento Multi-Tenant (FASE C)
 * Queswa Ecosystem — Arquitectura IA Multi-Dominio
 *
 * Responsabilidad: interceptar cada petición a las APIs de Queswa,
 * identificar el dominio de origen y propagar la identidad del tenant
 * como headers hacia el handler (x-tenant-id, x-tenant-role).
 *
 * Latencia objetivo: <1ms (lookup en memoria, sin I/O, sin red).
 * No requiere Edge Config ni base de datos — mapa estático en Edge.
 *
 * Dominios mapeados:
 *   queswa.app        → queswa_dashboard   / chief_of_staff
 *   creatuactivo.com  → creatuactivo_marketing / embajador_publico
 *   luiscabrejo.com   → marca_personal     / avatar_luis
 *   ganocafe.online   → ecommerce          / concierge_ventas
 */

import { NextRequest, NextResponse } from 'next/server'

// ─── Configuración de rutas interceptadas ────────────────────────────────────
export const config = {
  matcher: [
    '/api/nexus/:path*',
    '/api/voice-command/:path*',
  ],
}

// ─── Mapa determinista dominio → tenant (en memoria Edge, 0ms) ───────────────
type TenantConfig = { tenantId: string; role: string }

const TENANT_MAP: Record<string, TenantConfig> = {
  // Queswa.app — Dashboard de socios estratégicos
  'queswa.app':               { tenantId: 'queswa_dashboard',       role: 'chief_of_staff' },
  'www.queswa.app':           { tenantId: 'queswa_dashboard',       role: 'chief_of_staff' },

  // CreaTuActivo.com — Marketing y funnel Fundadores
  'creatuactivo.com':         { tenantId: 'creatuactivo_marketing', role: 'embajador_publico' },
  'www.creatuactivo.com':     { tenantId: 'creatuactivo_marketing', role: 'embajador_publico' },

  // LuisCabrejo.com — Marca personal / Avatar Luis
  'luiscabrejo.com':          { tenantId: 'marca_personal',         role: 'avatar_luis' },
  'www.luiscabrejo.com':      { tenantId: 'marca_personal',         role: 'avatar_luis' },

  // GanoCafe.online — E-commerce (próximamente activo)
  'ganocafe.online':          { tenantId: 'ecommerce',              role: 'concierge_ventas' },
  'www.ganocafe.online':      { tenantId: 'ecommerce',              role: 'concierge_ventas' },
}

// Default: creatuactivo_marketing (localhost, preview deployments, CI)
const DEFAULT_TENANT: TenantConfig = {
  tenantId: 'creatuactivo_marketing',
  role: 'embajador_publico',
}

// ─── Resolución de tenant ─────────────────────────────────────────────────────
function resolveTenant(req: NextRequest): TenantConfig {
  // 1. Header explícito — útil en pruebas Postman, Playwright, llamadas SSR
  const explicit = req.headers.get('x-tenant-domain')
  if (explicit) {
    const match = TENANT_MAP[explicit.toLowerCase()]
    if (match) return match
  }

  // 2. Origin CORS — peticiones del navegador cross-origin
  const origin = req.headers.get('origin') ?? ''
  if (origin) {
    try {
      const hostname = new URL(origin).hostname.toLowerCase()
      const match = TENANT_MAP[hostname]
      if (match) return match
    } catch { /* origin malformado — continuar */ }
  }

  // 3. Referer — cubre SSR, prefetch de Next.js y navegación interna
  const referer = req.headers.get('referer') ?? ''
  if (referer) {
    try {
      const hostname = new URL(referer).hostname.toLowerCase()
      const match = TENANT_MAP[hostname]
      if (match) return match
    } catch { /* referer malformado — continuar */ }
  }

  // 4. Host header — peticiones directas al servidor (API calls internos)
  const host = (req.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const hostMatch = TENANT_MAP[host]
  if (hostMatch) return hostMatch

  return DEFAULT_TENANT
}

// ─── Middleware principal ─────────────────────────────────────────────────────
export function middleware(req: NextRequest) {
  const tenant = resolveTenant(req)

  // Clonar headers de la request e inyectar identidad del tenant
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-tenant-id',   tenant.tenantId)
  requestHeaders.set('x-tenant-role', tenant.role)

  console.log(
    `[Tenant] ${req.method} ${req.nextUrl.pathname} → ` +
    `tenant=${tenant.tenantId} role=${tenant.role}`
  )

  // Propagar headers modificados al API route handler
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}
