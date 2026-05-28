# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (**Queswa**, formerly NEXUS - rebranded in v15.0) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

**Design System**: "Quiet Luxury" with Bimetallic Accents v3.0 - See detailed guide below

**Funnel Strategy**: Russell Brunson methodology - Squeeze Page → Bridge Page → Offer (see Section 5)

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Development Commands](#development-commands)
3. [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer)
4. [Performance & Architecture Decisions](#performance--estado-actual-abr-2026)
5. [Critical Git Workflow](#critical-git-workflow)
6. [Architecture Overview](#architecture-overview)
   - [NEXUS AI Chatbot](#1-nexus-ai-chatbot)
   - [Prospect Tracking](#2-prospect-tracking)
   - [Async Queue](#3-async-queue-architecture)
   - [Supabase Schema](#4-supabase-schema)
   - [Page Structure & Funnel](#5-page-structure--funnel-architecture)
   - [Servilleta Digital](#servilleta-digital---interactive-presentations)
7. [Environment Variables](#environment-variables)
8. [Common Development Patterns](#common-development-patterns)
9. [Design System: Bimetallic v3.0](#design-system-bimetallic-v30)
10. [Utility Scripts](#utility-scripts)
11. [Deployment](#deployment)
12. [Key Documentation Files](#key-documentation-files)

## Quick Reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Check active system prompt | `node scripts/leer-system-prompt.mjs` |
| Update creatuactivo.com prompt | `node scripts/actualizar-system-prompt-v27.2.mjs` |
| Re-fragmentar WHY_01/WHY_02/EAM_01 | `node scripts/actualizar-fragmentos-master-v25.7.mjs` (genérico, lee del arsenal vivo) |
| Actualizar FREQ_03 cierre + purgar CIERRE_01/02 obsoletos | `node scripts/actualizar-fragmentos-cierre-v5.2.mjs` |
| Actualizar catálogo productos (BEB_01/LUV_01/SUP_01/PERS_01 + PROD_OVERVIEW) | `node scripts/actualizar-fragmentos-catalogo-v7.2.mjs` |
| Benchmark Haiku clasificación (Fase 0 — Tool Calling research) | `node scripts/benchmark-haiku-clasificacion.mjs` |
| POC Tool Calling con Sonnet 4.6 (Fase 0) | `node scripts/poc-tool-calling.mjs` |
| Update luiscabrejo.com prompt | `node scripts/actualizar-system-prompt-marca-personal-v1.mjs` |
| Update ganocafe.online prompt | `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs` |
| Rebuild embeddings after arsenal change | `node scripts/fragmentar-arsenales-voyage.mjs` |
| Deploy Supabase edge function | `npx supabase functions deploy nexus-queue-processor` |
| NEXUS health check | `curl http://localhost:3000/api/nexus` |
| Verify arsenal in Supabase | `node scripts/verificar-arsenal-supabase.mjs` |

**Multi-tenant prompt names**: `nexus_main` (creatuactivo.com) · `marca_personal_v1.0` (luiscabrejo.com) · `ganocafe_main` (ganocafe.online) · hardcoded in `dashboard-ai/route.ts` (queswa.app) · `queswa_whatsapp` (WABA WhatsApp — tenant: `whatsapp`)

## Development Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production (TypeScript errors ignored)
npm run lint         # Run ESLint

# Testing (via utility scripts - no test framework configured)
node scripts/test-contador-cupos.mjs              # Test founder spots counter
node scripts/leer-system-prompt.mjs               # View current NEXUS prompt
curl http://localhost:3000/api/nexus              # NEXUS health check

# Deployment
npx supabase functions deploy nexus-queue-processor  # Deploy queue processor
```

**IMPORTANT**: TypeScript build errors are ignored (`ignoreBuildErrors: true` in next.config.js). Builds succeed regardless of type errors.

## Reglas Críticas (NO HACER)

- ❌ **NO modificar** fallback system prompt en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - actualizar en Supabase
- ❌ **NO agregar** textos de flujo o respuestas verbatim al System Prompt (`system-prompt-nexus-main-v27_2.md`) — el backend es el dictador absoluto. Todo texto que el modelo deba imprimir exacto va en `getMicroPromptApertura()`, `getMicroPromptCierre()`, `getCierreEstado4()` en `route.ts`, o en `src/lib/respuestas-maestras.ts` (Camino A para chip-triggers WHY_02/EAM_01)
- ❌ **NO editar** los textos verbatim de `src/lib/respuestas-maestras.ts` sin sincronizar los bloques `<verbatim_lock>...</verbatim_lock>` en `knowledge_base/arsenal_inicial.txt` (WHY_02 BLOQUE 1, EAM_01 BLOQUE 8). Son fuente dual — backend dictador + RAG fallback — y deben coincidir carácter por carácter
- ❌ **NO regresar** los marcadores XML `<verbatim_lock>` a corchetes planos `[VERBATIM_LOCK]`. La investigación Gemini (18 May 2026) confirmó que Claude Sonnet 4.6 reconoce XML tags como señales de activación de atención, mientras que los corchetes planos son texto inerte. Migración aplicada en v25.8/v26.8.
- ❌ **NO modificar** el texto de `getCierreEstado4()` sin actualizar los regex de detección en `route.ts`: `waLinkEntregado` (línea ~3636) y `nombreSolicitado` (línea ~3641) — si el texto cambia y los regex no, el FSM genera handoffs duplicados o pierde estado
- ❌ **NO re-introducir** la extracción de `package` desde `extractFromClaudeResponse()` (eliminado 22 May 2026, Fix G). Causaba contaminación silenciosa de `data.package` cada vez que Claude mencionaba el paquete en una respuesta informativa ("ESP-3 incluye 35 productos"). La captura debe venir **exclusivamente** del usuario con `packageMap` + guard de pregunta informativa.
- ❌ **NO disparar Estado 4 sin validar nombre** — el FSM debe verificar con `extractNameFromHandoffReply()` que el usuario respondió con un nombre. Si responde con pregunta o pide pausar, mantener Estado 0 (responder libre) y conservar `package` en BD para el próximo intento. Bug crítico documentado QA 22 May 2026.
- ❌ **NO eliminar `<verbatim_lock>` de PROD_OVERVIEW/BEB_01/LUV_01/SUP_01/PERS_01** en `catalogo_productos.txt`. Sin él, el modelo aluciona nombres simplificados ("Ganotea" en lugar de Oleaf Gano Rooibos, "Gano Cocoa" en lugar de Gano Schokolade, "Gano Supreme" inexistente) y omite categorías enteras (mencionando solo 2 de 4). Bug confirmado QA 22 May 2026, resuelto con v7.2.
- ❌ **NO re-implementar Anthropic Prompt Caching** — ya está activo en `route.ts:4072-4090` con 3 bloques (system base + arsenal + session instructions). Logging activo en `route.ts:4110-4118` (`cache_read` vs `cache_creation`). Gemini lo propuso como "Fase 3" en investigación May 2026 sin saber que ya existe — verificado en Fase 0 (23 May 2026). Solo medir hit rate cuando llegue tráfico real.
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS (Cookie Banner in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) handles all consent UX)
- ❌ **NO guardar** PII en localStorage (solo fingerprint/session IDs)
- ❌ **NO hacer commit** de `.env.local`, API keys o secretos
- ❌ **NO agregar** `backdropFilter: blur()` en cards del homepage — elimina GPU compositing en paint inicial
- ❌ **NO agregar** `priority` a imágenes decorativas del hero — usar `loading="lazy"` para que no compitan con LCP
- ❌ **NO editar** archivos `*.tsx.bak` — son respaldos inactivos, no fuente viva
- ❌ **NO declarar** un segundo `<h1>` en el cuerpo si la página ya usa `<IndustrialHeader>` — rompe SEO/a11y. Si necesitas un título visualmente prominente, usa `<h2>` con `font-serif`. Bug recurrente — ver [Typography Hierarchy](#typography-hierarchy-23-may-2026)
- ❌ **NO usar** `fontFamily` con fuentes que no estén cargadas en [src/app/layout.tsx](src/app/layout.tsx) — el navegador hará fallback genérico y el H1 se verá distinto al resto del sitio (caso histórico: Rajdhani en `/paquetes`)
- ❌ **NO usar** `clip-path: polygon(...)` biselado en botones — viola la investigación de branding ("estética cyberpunk antitética a la construcción de patrimonio"). Border-radius del sistema es suficiente
- ⚠️ `queswa.app` es un **repositorio separado** — su código no está en este repo. No buscar `dashboard-ai/route.ts` aquí

## Performance — Estado Actual (Abr 2026)

**Historial LCP homepage** (`/`):

| Fecha | LCP | Speed Index | Cambio |
|-------|-----|-------------|--------|
| Línea base | 6.5s | 4.5s | — |
| Imágenes WebP + next/image | 3.8s | 2.6s | turbina.webp + hormigon-tile.webp |
| force-static homepage | 2.9s | — | TTFB CDN edge ~20ms |
| turbina lazy + CSS gradient LCP | 2.7s | 1.7s | LCP = H1 texto, no imagen |
| backdropFilter eliminado + DeferredOrb | 2.5s | 2.0s | Framer 114KB diferido |
| Cache-Control s-maxage=86400 | 2.5s | 2.0s | CDN cachea HTML 24h |

**Decisiones de arquitectura de performance (NO revertir):**

- **`export const dynamic = 'force-static'`** en [src/app/page.tsx](src/app/page.tsx) — homepage pre-renderizado en build time, servido desde CDN edge
- **Turbina hero con `loading="lazy"`** — el LCP es el H1 texto (no requiere request de red adicional); turbina aparece ~2s después sin bloquear
- **`DeferredOrb`** en [src/components/DeferredOrb.tsx](src/components/DeferredOrb.tsx) — envuelve `UnifiedQueswaOrb` y difiere la carga de Framer Motion (114KB) hasta el primer evento del usuario (scroll/mousemove/touchstart). Fallback: carga a los 3s si no hubo interacción
- **`globals.css` limpio** — reducido de 374 líneas a 166 líneas (9.3KB → 4.3KB). ~18 clases y 4 keyframes eliminados por no tener uso en el proyecto
- **3 fuentes** (Playfair Display, Rajdhani, Roboto Mono) — Montserrat y Oswald eliminados. `fontFamily.logo` en branding.ts usa Rajdhani
- **Preconnects mínimos** en layout.tsx — solo Material Symbols async. Los preconnects de Google Fonts y Supabase fueron eliminados (next/font self-hostea, Queswa carga lazy)
- **`hormigon-tile.webp`** en [public/images/servilleta/hormigon-tile.webp](public/images/servilleta/hormigon-tile.webp) — tile 200×200px de 2KB reemplaza `fondo-global-hormigon.jpg` (299KB) en 12 páginas
- **Cache-Control HTML** en `next.config.js` — `s-maxage=86400, stale-while-revalidate=604800` para todas las páginas excepto `/api/*`

**Techo realista con arquitectura actual:** ~2.3–2.5s LCP en PSI (simulación mobile 3G). Llegar a <1.5s requeriría Critical CSS extraction (frágil con Tailwind) o migrar a servidor con LiteSpeed/full-page cache.

## Critical Git Workflow

**BEFORE any development work**:
```bash
git status  # MUST verify repository is working
```

This repository has **lost its `.git` directory** in the past. Always verify git status before starting work.

**Symptoms of missing .git**:
- ❌ `git status` returns "fatal: no es un repositorio git"
- ❌ Production shows old code despite local changes working
- ⚠️ Vercel deployments show "vercel deploy" instead of `main` branch

**If .git is missing**:
```bash
git init
git remote add origin https://github.com/LuisCabrejo/creatuactivo.com.git
git fetch origin main
git reset --hard origin/main  # WARNING: Overwrites local files
# Restore your changes, then:
git add [files]
git commit -m "✨ Your message"
git push -u origin main
```

**Standard workflow**:
```bash
git status              # Verify repository works
git add [files]
git commit -m "✨ feat: Description"
git push origin main
# ALWAYS verify on GitHub that changes uploaded
```

**Commit Convention** (Conventional Commits):
- `feat(scope):` - New features
- `fix(scope):` - Bug fixes
- `style(scope):` - Visual/style changes
- `content(scope):` - Content updates
- `refactor(scope):` - Code refactoring

## Architecture Overview

### Core System: El Tridente EAM

Metodología oficial v19.6 (Directriz Master v46 — reemplaza Framework IAA):
1. **EXPANSIÓN** - Generación de tráfico y distribución de la Auditoría Patrimonial
2. **ACTIVACIÓN** - Queswa AI filtra prospectos; constructor cierra con quienes levantaron la mano
3. **MAESTRÍA** - La Academia es la ventaja injusta del constructor. Cada semana de aprendizaje acorta la curva que a otros les tomó años.

**Rol del héroe — DIRECCIÓN EJECUTIVA** (elevado en v19.6, Mar 2026):
- La labor del constructor es **puramente gerencial**: suministra la "materia prima" (tráfico) al ecosistema
- La tecnología hace la ejecución técnica; el constructor toma las decisiones de expansión
- **Lenguaje aprobado**: "Director de Expansión", "Dirección Ejecutiva", "orquesta los comandos"
- **Lenguaje prohibido**: "Tu Rol (El Director)" como tercer elemento plano — debe estar bajo METODOLOGÍA (Ejecución Exacta)
- En toda respuesta que explique la Máquina Híbrida, el tercer elemento es METODOLOGÍA, no un rol de ejecución

**Respuesta canónica WHY_02** — ver `knowledge_base/arsenal_inicial.txt` (fragmento WHY_02). Los tres pilares canónicos son: **Pilar 1 — La Matriz Física** (Gano Excel / músculo logístico) · **Pilar 2 — Queswa, su Centro de Mando** (plataforma IA propietaria) · **Pilar 3 — La Metodología Automatizada** (El Tridente EAM: protocolo de ejecución estandarizado que erradica el ensayo y error). El **rol del usuario** es **Arquitecto de Patrimonio** — dirige los tres pilares, NO es uno de ellos. Recategorización aplicada en v26.5 (May 2026): el Arquitecto queda elevado como director; el tercer pilar es un componente entregado por el sistema, no el rol del receptor. Nunca "capas" ni "Máquina Híbrida" — siempre "pilares" y "Base Operativa".

### 1. NEXUS AI Chatbot

**Naming**: User-facing brand is "Queswa" (since v15.0). Code/components still use "NEXUS" prefix (no refactor planned). Use "Queswa" in UI text, "NEXUS" in code references.

**Ecosistema de proyectos** (todos comparten el mismo Supabase DB):

| Proyecto | Rol de Queswa | System Prompt | Estado |
|----------|---------------|---------------|--------|
| `creatuactivo.com` | Filtrar prospectos para funnel Fundadores | `nexus_main` | Activo |
| `luiscabrejo.com` | Marca personal — posicionar a Luis, redirigir a creatuactivo.com | `marca_personal_v1.0` | Activo (Mar 2026) |
| `queswa.app` | Chief of Staff del Director Ejecutivo — CRM + pipeline + mensajes | `queswa_dashboard` (en route.ts) | Activo (Mar 2026) |
| `ganocafe.online` | Soporte de producto + venta directa e-commerce | `ganocafe_main` | Activo (Mar 2026) |
| **WABA WhatsApp** | Responde prospectos inbound desde anuncios Meta + orgánico | `queswa_whatsapp` v1.2 | Activo Abr 2026 — modo desarrollo (pendiente verificación negocio Meta) |

**Regla crítica multi-proyecto**: Un cambio en `system_prompts.nexus_main` afecta SOLO `creatuactivo.com` (caché 5 min). `luiscabrejo.com` usa `marca_personal_v1.0` — prompts independientes desde Mar 2026.

**En `luiscabrejo.com`**: tenant hardcodeado como `marca_personal` en `route.ts` (sin middleware — repo siempre es ese tenant). La ruta `/api/claude-chat/route.ts` es legacy sin uso.

**Estado integración ganocafe.online** (Mar 2026 — fase piloto activa):
- ✅ `system_prompts` row `ganocafe_main` **v1.5_ganocafe_alias_coloquiales** — en Supabase
- ✅ `knowledge_base/arsenal_ganocafe.txt` — **16 respuestas** (PROD_01–07, BENE, COMPRA, OBJ_GC, NEGOCIO, CODIGO) — tenant: `ecommerce`
- ✅ `nexus_documents` — 16 fragmentos con embeddings Voyage AI, tenant `ecommerce` (incluye PROD_05 Rooibos, PROD_06 Spirulina, PROD_07 Luvoco)
- ⚠️ **`ganocafe_main` tiene catálogo de precios hardcodeado** en el system prompt (línea "NUNCA uses otros precios") — esto hace que el model ignore el vector search para precios. Al cambiar precios en el arsenal, **también actualizar el system prompt** con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Los dos deben estar sincronizados.
- ✅ `scripts/deploy-arsenal-ganocafe.mjs` — script de deploy listo
- ✅ **CORS habilitado** en `/api/nexus/route.ts` — ganocafe.online autorizado como origen externo
- ✅ Widget JS embebido en landing `/cafe-3en1/index.html` (cPanel) — piloto Google Ads Colombia
- ✅ **`isSimpleQueryEarly` siempre `false` para tenant `ecommerce`** — todas las queries pasan por vector search, sin atajos por longitud de mensaje
- ✅ **System prompt v1.5** incluye sección `## NOMBRES COLOQUIALES` — mapeo explícito alias → producto (cereal, té, chocolate, capuchino, etc.) para evitar "no tenemos ese producto"
- ✅ **Widget UX** (Mar 2026): orbe con barras ecualizador animadas + anillos de pulso, quick replies rediseñados (catálogo/beneficios/pedido), tarjeta de pedido inline con links directos al carrito WooCommerce + WhatsApp, flecha de envío →, saludo en tercio superior
- ⏳ Rollout a todo el sitio WordPress — pendiente validación del piloto

**Arquitectura widget externo** (ganocafe.online → creatuactivo.com API):
```
ganocafe.online/cafe-3en1/index.html
  └─ widget JS llama POST https://creatuactivo.com/api/nexus
       └─ headers: { 'x-tenant-id': 'ecommerce', 'Content-Type': 'application/json' }
            └─ Supabase carga ganocafe_main + arsenal_ganocafe (tenant: ecommerce)
```

**CORS config** (`src/app/api/nexus/route.ts`):
- Handler `OPTIONS` para preflight (status 204)
- `getCorsHeaders()` en respuesta POST y error fallback
- Dominios permitidos: ganocafe.online, creatuactivo.com, luiscabrejo.com, queswa.app

**Handoff doc para agente widget**: `public/investigaciones/HANDOFF-GANOCAFE-WIDGET.md`

**Estado integración WABA WhatsApp** (Abr 2026 — pipeline activo):
- ✅ Webhook `/api/whatsapp/webhook` — Node runtime, maxDuration 30s
- ✅ WABA número: `+573215193909` | Phone Number ID: `1115546358301373` | WABA ID: `1436663504253230`
- ✅ System User Token permanente: `WHATSAPP_SYSTEM_TOKEN` en `.env.local` + Vercel
- ✅ `WHATSAPP_WABA_ID=1436663504253230` — en `.env.local` + Vercel (Abr 2026)
- ✅ System prompt `queswa_whatsapp` **v1.2** — tenant `whatsapp` en Supabase (Abr 2026)
  - v1.2 cambios: flujo post-nombre sin redirección web, Constructor como naming, tono de filtro reemplazado, cupos/fechas no hardcodeados
- ✅ Arsenal inicial clonado al tenant `whatsapp` — 39 fragmentos RAG en `nexus_documents`
- ✅ CTWA detectado: `referral` de anuncios Meta guardado en `device_info` (ctwa_clid, ad_id, ad_headline)
- ✅ `src/lib/whatsapp-meta.ts` — reemplaza SendPulse (misma interfaz `sendWhatsAppTemplate`)
- ✅ `funnel/route.ts` + `webhooks/prospect-capture/route.ts` migrados a `whatsapp-meta`
- ⏳ Meta business verification — pendiente para salir de modo desarrollo (solo acepta números de prueba)
- ⏳ Plantilla `acceso_auditoria_patrimonial` — por crear y aprobar en Meta WhatsApp Manager
  - Copy aprobado: `Hola {{1}}, tu acceso a la *Auditoría Patrimonial* está listo...` | `{{2}}` = enlace personalizado
- ⏳ 5 templates secuencia de días — Fase 6 del handoff original
- ⏳ Eliminar credenciales SendPulse de `.env.local` y Vercel — tras aprobar plantillas

**Flujo WABA:**
```
WhatsApp (orgánico o CTWA anuncio)
  └─ POST https://creatuactivo.com/api/whatsapp/webhook
       └─ extrae número, texto, referral CTWA
       └─ INSERT en prospects (fingerprint: "wa_{phone}", source: whatsapp_inbound/ctwa)
       └─ POST /api/nexus { x-tenant-id: whatsapp, fingerprint: wa_{phone} }
            └─ system prompt queswa_whatsapp + arsenal_inicial RAG
            └─ StreamingTextResponse consumida completa
       └─ POST graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages
```

**Regla crítica WABA**: NO modificar `/api/nexus/route.ts`. El webhook es solo adaptador de canal. Toda lógica de IA vive en el motor existente.

**Scripts WABA:**
- `node scripts/actualizar-system-prompt-whatsapp-v1.mjs` — actualiza system prompt WhatsApp en Supabase
- `node scripts/clonar-arsenal-whatsapp.mjs` — clona fragmentos arsenal_inicial al tenant whatsapp

**Handoff doc WABA completo**: `public/contexto/handoff/Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md`

**Key Files**:
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Main API (v14.9, FSM architecture — backend como dictador absoluto Abr 2026)
- [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts) - **PREFERRED** async queue producer
- [src/app/api/nexus/tts/route.ts](src/app/api/nexus/tts/route.ts) - TTS endpoint (ElevenLabs → OpenAI fallback, Edge, 30s)
- [src/app/api/voice-command/route.ts](src/app/api/voice-command/route.ts) - Voice pipeline: Whisper → Claude Haiku → ElevenLabs (Node, 60s)
- [src/lib/vectorSearch.ts](src/lib/vectorSearch.ts) - Voyage AI embeddings + semantic search (multi-tenant: `tenantId` param)
- [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) - **Orbe unificado** (reemplaza NEXUSFloatingButton + VoiceCommandButton)
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - React hook for chat state
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI container (incluye botón TTS por mensaje)
- [src/components/nexus/NEXUSFloatingButton.tsx](src/components/nexus/NEXUSFloatingButton.tsx) - Legacy (ya no usado en layout, conservado para servilleta events)
- [src/components/nexus/Chat.tsx](src/components/nexus/Chat.tsx) - Chat message rendering
- [src/components/nexus/NEXUSDataCaptureCard.tsx](src/components/nexus/NEXUSDataCaptureCard.tsx) - Data capture UI
- [src/components/nexus/useSlidingViewport.ts](src/components/nexus/useSlidingViewport.ts) - Mobile viewport handling

**How It Works**:
1. **Fragmented Vector Search** (v14.9) — 8 arsenales con Voyage AI embeddings (95% token reduction, ~135 fragmentos):

| Arsenal | Tenant | Versión actual | Contenido |
|---------|--------|----------------|-----------|
| `arsenal_inicial` | creatuactivo_marketing | **v5.4** (24 May 2026) | WHY, STORY, VS, FREQ, CRED, OBJ, EAM, CIERRE + DIASPORA. 41 respuestas + PERFIL_01. v5.4 introduce: FREQ_02 reescrita (Conexión Directa/Asistida/Automatizada), FREQ_06 reescrita (sin "Plusvalía Estructural"/"ancho de banda"), híbrido contextual de voz Queswa (primera persona Nivel 3, tercera persona Niveles 1+2), limpieza léxico residual (plusvalía/ancho de banda/vector/global selectivo). |
| `arsenal_avanzado` | creatuactivo_marketing | **v10.1** (24 May 2026) | Objeciones complejas, sistema, valor, escalación (18 respuestas). Tridente EAM con Comandos canónicos. v10.1: 4 instancias migradas a primera persona ("yo asumo/proceso/opero") según híbrido contextual v5.4. |
| `arsenal_reto` | creatuactivo_marketing | **v4.2** (24 May 2026) | Auditoría Patrimonial (7 respuestas para dias 1-5). v4.2: "plusvalía" → "valor patrimonial", "ancho de banda ejecutivo" → "agenda ejecutiva". |
| `arsenal_12_niveles` | creatuactivo_marketing | — | Desafío de 12 niveles (13 blocks). |
| `catalogo_productos` | creatuactivo_marketing | **v7.2** (22 May 2026) | 22 productos + ciencia (Lujo Clínico). Fragmentado en 25 fragments + doc maestro. PROD_OVERVIEW + BEB_01/LUV_01/SUP_01/PERS_01 con `<verbatim_lock>` para evitar alucinaciones de nombres (Ganotea/Gano Cocoa/Gano Supreme) y omisión de categorías. Bug pendiente: CV/PV en respuestas individuales. |
| `arsenal_compensacion` | creatuactivo_marketing | **v6.4** (22 May 2026) | Plan de compensación (38 respuestas). **NO modificar vocabulario ni cifras.** |
| `arsenal_marca_personal` | marca_personal | **v1.1** (Abr 2026) | Identidad/historia/metodología Luis Cabrejo (11 respuestas) — para luiscabrejo.com. |
| `arsenal_ganocafe` | ecommerce | **v1.5** (Mar 2026) | Productos GanoCafe (16 respuestas) — para ganocafe.online. |

**Historial completo de cambios por arsenal** → [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

2. **Clasificación de documentos — 3 capas + override**:
   - **PASO -1 (MenuExpansion)**: Opciones a/b/c/d del menú inicial se expanden a queries semánticas
   - **PASO 0 (Vector)**: Voyage AI embedding → similitud coseno → threshold 0.4 mínimo
   - **PASO 0.5 (Override crítico)**: Previene falsos positivos vectoriales. Si el vector devuelve `arsenal_compensacion` pero la query es "cómo funciona el negocio" o variante → fuerza `arsenal_inicial`. Ver `route.ts` línea ~1817.
   - **PASO 1 (Patrones)**: Fallback regex si vector no alcanza threshold

   **Falso positivo conocido (resuelto Mar 2026)**: `COMP_MODELO_01` tiene "¿Cómo funciona el negocio?" como trigger → el vector lo confundía con WHY_02. El override en PASO 0.5 lo corrige.

   **Excepción ecommerce (Mar 2026)**: `isSimpleQueryEarly` retorna siempre `false` cuando `tenantId === 'ecommerce'`. En ganocafe.online cualquier query puede ser sobre un producto — no hay queries "simples". Esto garantiza que mensajes de 1–3 palabras ("el té", "cereal", "jabón") igualmente pasen por vector search.

3. **Data Capture** - `captureProspectData()` extracts:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification

4. **System Prompt** - Stored in Supabase `system_prompts` table (name: `nexus_main`)
   - **Versión activa: v27.2 "modulacion_registro"** (24 May 2026) — Ola 2 doctrinal. Formaliza Modulación de Registro v5.5 (analogía Mario Alonso Puig: autoridad técnica + accesibilidad humana). 6 cambios: (1) sección MODULACIÓN DE REGISTRO en TONO Y VOZ; (2) VECTORES DE CIERRE balanceados en 2 bancos (técnico-clínico + conversacional); (3) refuerzo Pirámide McKinsey al derecho (REGLA ANTI-PREÁMBULO); (4) bloqueo absoluto DASHBOARD inexistente para prospecto; (5) bloqueo absoluto fórmulas matemáticas expuestas (CV × 17% × $1 USD); (6) doctrina 12 VELOCIDADES canónica. Tamaño: 42,577 chars.
   - **Versión previa: v27.1 "limpieza_redundancias"** (22 May 2026) — Ola 1 de auditoría de redundancia. Reducción 45,940 → 35,354 chars (~23%) sin cambios de comportamiento.
   - **Historial completo v19.x → v27.2** → [knowledge_base/CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md)
   - Archivos fuente: `knowledge_base/system-prompt-nexus-main-vXX_Y.md` (todos conservados como referencia histórica)
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** en `route.ts` — actualizar en Supabase. Fallback alineado a v26.5.
   - Verificar versión activa: `node scripts/leer-system-prompt.mjs` (no asumir que local = Supabase)
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente.
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `public/investigaciones/HANDOFF-QUESWA-PRECIOS-CVPV.md`.

**Camino A — Backend Dictador para chip-triggers (May 2026)**:

Las 2 chips canónicas que concentran el ~80% del tráfico inicial (Chip 1 → WHY_02 "¿Cómo funciona el negocio?" y Chip 2 → EAM_01 "¿Cuál es la metodología operativa?") se sirven desde [src/lib/respuestas-maestras.ts](src/lib/respuestas-maestras.ts) **antes** del Voyage AI + Anthropic. El bypass en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) detecta match exacto sobre `trim().toLowerCase()` contra `QUESWA_QUICK_REPLIES` y, si coincide, construye un `ReadableStream` con la respuesta Master del Director Académico y retorna `StreamingTextResponse` directamente.

Beneficios:
- ✓ **100% fidelidad** al copy calibrado (cero paráfrasis del LLM)
- ✓ **$0 tokens** en Anthropic para esas queries
- ✓ **Latencia ~50ms** vs ~2s del flujo completo

Patrón arquitectónico: mismo que `getMicroPromptApertura()` / `getCierreEstado4()` — el backend dicta texto exacto cuando hay un nodo determinístico. No es un workaround; es la separación canónica entre LLM (interpretación) y backend (copy calibrado).

**Fuente dual de verdad — regla inviolable**: Los textos en `src/lib/respuestas-maestras.ts` deben coincidir carácter por carácter con los bloques `[VERBATIM_LOCK]...[/VERBATIM_LOCK]` en `knowledge_base/arsenal_inicial.txt` (WHY_02 en BLOQUE 1, EAM_01 en BLOQUE 8). El arsenal es la doctrina viva; el módulo TS es el caché operativo del backend. Si edita uno, sincronice el otro.

**Camino B (RAG con marcador XML) — fallback para queries naturales**: WHY_01 ("¿Qué es CreaTuActivo?") y queries naturales que coincidan semánticamente con WHY_02/EAM_01 entran por el flujo RAG normal. Las etiquetas XML `<verbatim_lock>...</verbatim_lock>` envuelven el cuerpo de los 3 fragmentos en el arsenal; la sección "REGLA `<verbatim_lock>` — INVIOLABLE" en el system prompt v26.8 ordena al LLM entregar el contenido exacto entre las etiquetas. Reliability esperada ~95-99% (XML tags activan atención post-entrenada en Claude Sonnet 4.6; investigación Gemini Hipótesis C).

**Histórico de fallos doctrinales (no repetir)**:
- v26.7 introdujo `[VERBATIM_LOCK]` con corchetes planos como marcador estructural. Falló empíricamente — modelo seguía parafraseando. Razón: literatura técnica de Anthropic confirma que los corchetes planos son procesados como texto de baja prioridad; solo etiquetas XML genuinas activan el mecanismo de atención post-entrenado. Migración aplicada en v26.8.
- Bloque `package` en `extractFromClaudeResponse()` (eliminado 22 May 2026, Fix G). Razón: extraía `data.package` desde la respuesta de Claude basado en menciones informativas ("ESP-3 incluye 35 productos") y contaminaba la BD. El FSM luego saltaba a Estado 3 tratando al prospecto como si hubiera comprado. La captura de paquete ahora vive EXCLUSIVAMENTE en `captureProspectData` con `packageMap` + guard de pregunta informativa.

**Warm Handoff con sumario ejecutivo (Opción B, 22 May 2026)**:

Cuando entra Estado 4 del FSM, [src/lib/handoff-sumario.ts](src/lib/handoff-sumario.ts) ejecuta en paralelo (fire-and-forget):

1. `generarSumarioEjecutivo()` — sub-agente Claude Haiku procesa los últimos 15 turnos + `prospectData` y genera JSON estructurado: `{dolores_expresados, objeciones_manejadas, mensajes_clave, next_best_action}`. Latencia ~1s, costo <$0.005 por handoff.
2. `enviarExpedienteEquipo()` — Resend envía email HTML estilo Quiet Luxury a `EQUIPO_DIRECTIVO_EMAIL` (default: `sistema@creatuactivo.com`). Asunto: `[Handoff Queswa] {Nombre} → ESP-X Visionario (Score X/100)`.
3. El prospecto recibe texto contextual ("Ya conocen su perfil, el nivel que eligió...") + link WhatsApp con `texto` pre-llenado que incluye el nombre descriptivo completo del paquete.

Fundamento (investigación corporativa Salesforce/Intercom/HubSpot): el traspaso es el momento de mayor abandono — el equipo humano debe recibir matriz táctica ANTES del primer mensaje del prospecto, no después de saludarlo.

**Variable de entorno opcional**: `EQUIPO_DIRECTIVO_EMAIL` (default hardcoded `sistema@creatuactivo.com`). Reutiliza `ANTHROPIC_API_KEY` y `RESEND_API_KEY` ya configuradas.

**UI Design Decisions** (Mar 2026 — no revertir sin justificación):
- **Layout mobile**: Panel anclado al `bottom` con `items-end` (no centrado). Patrón elite apps (Claude, Gemini).
- **Viewport keyboard**: `interactiveWidget: 'resizes-content'` en `src/app/layout.tsx` → fix Chrome 108+ double-jump. Sin esto el área de escritura salta dos veces al abrir teclado.
- **Input**: `<textarea>` con auto-resize (max 120px), `autoCorrect="on"`, `autoCapitalize="sentences"`, `spellCheck`. Enter=enviar, Shift+Enter=salto de línea. Botones (mic/enviar) anclados al `bottom-3` del contenedor. Acepta sustituciones de texto del sistema operativo.
- **Mic integrado en input** (Abr 2026): el ícono mic y el botón enviar comparten la misma posición — toggle según `voiceState`. Patrón idéntico a Claude/Gemini. El orbe NO muestra ícono de mic cuando el chat está abierto (`isOpen`).
- **Quick Reply Chips** (Abr 2026 — solo `creatuactivo.com`, NO en `queswa.app`): 4 chips en estado inicial (antes de que el usuario escriba). Llaman `handleSendMessage()` directamente. Eliminan el "área muerta" móvil y bajan la barrera de articulación. Chips: `📦 Los productos`, `💼 El negocio`, `🤔 ¿Es para mí?`, `⚡ Quiero empezar`.
- **Orbe pointer events** (Abr 2026): `pointerEvents: (!isOpen && orbVisible) ? 'auto' : 'none'` — evita que el orbe invisible (opacity:0, zIndex:200) intercepte clics sobre el widget (z-50).
- **Saludo inicial**: Texto grande centrado (estilo Claude.ai) cuando es el único mensaje. Desaparece al enviar el primer mensaje del usuario. Implementado en `NEXUSWidget.tsx` como caso especial `isInitialGreeting && isOnlyMessage`.
- **Nombre persistido**: Se extrae del mensaje del usuario con regex (`me llamo / mi nombre es / soy`) y se guarda en `localStorage('nexus_prospect_name')`. El saludo siguiente lo usa: `"Hola, {nombre} 🪢"`.
- **Header mobile**: Solo `Queswa 🪢` + botón X. Sin ícono, sin subtítulo "TERMINAL ACTIVA".
- **Fondo**: Panel sobre fondo oscuro puro (`#0F1115`), sin secciones ni cards intermedias. Respuestas sobre el mismo fondo — no agregar `background` a los mensajes del bot.
- **Burbujas usuario**: Sin border-radius (`borderRadius: 0`) — branding Industrial Luxury, 90 grados. Color `#16181D`.
- **UnifiedQueswaOrb** (Mar 2026 — reemplaza NEXUSFloatingButton + VoiceCommandButton):
- Tap corto = abre chat Queswa. Long press 300ms = activa micrófono de voz.
- Posición: `bottom: 1.5rem` cuando chat cerrado, `5rem` cuando chat abierto (evita tapar input). **Excepción queswa.app**: siempre `5rem` para no solapar bottom nav de 64px.
- Glassmorphism + Framer Motion spring scroll hide/show. Safe-area iOS.
- Haptic feedback: `navigator.vibrate(50)` al iniciar, `vibrate(30)` al detener grabación.
- **Icono idle**: 6 barras SVG `<rect>` doradas con animación `scaleY` escalonada (efecto ecualizador de audio, delays 0–0.42s). Complementa `orbBreath` (scale + glow). En estados recording/processing/speaking/error se muestran iconos dedicados.
- Fuente: [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx)

**Servilleta + Queswa**: La servilleta usa eventos custom (`open-queswa` / `close-queswa`) para comunicarse con `NEXUSFloatingButton`. Al abrir Queswa en servilleta, el `body.style.overflow = 'auto'` se restaura temporalmente para que el teclado funcione. El deck-container mantiene `overflow: hidden` independientemente.

**API Endpoints**:
- **Production**: Always use `/api/nexus/producer` (async queue)
- **Cron fallback**: `/api/nexus/consumer-cron` (processes queue without triggers)
- **Health checks**: GET request to `/api/nexus`
- **Legacy**: `/api/nexus` POST (synchronous, still works)

### 1.1. API Routes Reference

| Route | Runtime | Timeout | Purpose |
|-------|---------|---------|---------|
| `/api/nexus` | Edge | 60s | NEXUS AI main (streaming) |
| `/api/nexus/producer` | Edge | 10s | DB Queue producer |
| `/api/nexus/tts` | Edge | 30s | TTS: ElevenLabs → OpenAI fallback |
| `/api/voice-command` | Node | 60s | Voice pipeline: Whisper → Haiku → ElevenLabs |
| `/api/nexus/consumer-cron` | Edge | 60s | Legacy queue consumer |
| `/api/funnel` | Node | 10s | Auditoría Patrimonial + Reto 5 Días + Webinar forms |
| `/api/fundadores` | Node | 10s | Founder registration |
| `/api/diagnostico` | Edge | 30s | Audit/self-assessment |
| `/api/cron/process-emails` | Node | 60s | Soap Opera sequence |
| `/api/cron/reto-5-dias` | Node | 60s | Secuencia Auditoría Patrimonial — Coordenadas 01–05 |
| `/api/emails/send-sequence` | Node | 30s | Generic email dispatch |
| `/api/constructor/[id]` | Node | 10s | Constructor dashboard |
| `/api/fundadores/pre-registro` | Node | 10s | Pre-registration flow |
| `/api/fundadores/registro-diciembre` | Node | 10s | Legacy December registration |
| `/api/track/video` | Edge | — | Video progress tracker — registra `play`/`completado_80` para dias 1–5 de la Auditoría; dispara webhook Supabase → push en queswa.app |
| `/api/email-open` | Node | — | Email open pixel tracker |
| `/api/webhooks/prospect-capture` | Node | — | Webhook Supabase → captura prospectos desde triggers externos |
| `/api/test-resend`, `/api/test-reto-email`, `/api/debug-email` | Node | — | Dev/debug only (not for production use) |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails   → 0 14 * * *  (9:00 AM UTC-5 Colombia)
/api/cron/reto-5-dias      → 0 13 * * *  (8:00 AM UTC-5 Colombia)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

**Secuencia Auditoría Patrimonial** (`/api/cron/reto-5-dias` — `RETO_5_DIAS_SEQUENCE`):
| Día | Subject | Componente | URL destino |
|-----|---------|-----------|-------------|
| 1 | `[COORDENADA 01] Diagnóstico Estructural Habilitado` | `Dia1Diagnostico` | `/auditoria-patrimonial/dia-1` |
| 2 | `[COORDENADA 02] El Techo Técnico (Análisis de Escalabilidad)` | `Dia2Vehiculos` | `/auditoria-patrimonial/dia-2` |
| 3 | `[COORDENADA 03] Acoplamiento Híbrido (La Máquina Operativa)` | `Dia3Modelo` | `/auditoria-patrimonial/dia-3` |
| 4 | `[COORDENADA 04] La Matriz de Amortización (Ingeniería de Liquidez)` | `Dia4Estigma` | `/auditoria-patrimonial/dia-4` |
| 5 | `[COORDENADA 05] Protocolo de Activación (Decisión Directiva)` | `Dia5Invitacion` | `/auditoria-patrimonial/dia-5` |

**`/api/funnel` — `PAGE_VIEW_STEPS`** (eventos de tracking que no requieren email):
`vio_pagina_gracias`, `vio_catalogo`, `vio_calculadora`, `vio_bridge_auditoria`

**Tracking events de video** (páginas `dia-1` a `dia-5`, reportan a `/api/nexus`):
- `video_play_moduloXX` — al iniciar reproducción
- `video_completed_80_moduloXX` — al llegar al 80% del video

### 2. Prospect Tracking

**Location**: [public/tracking.js](public/tracking.js)

Browser fingerprinting loaded in [src/app/layout.tsx](src/app/layout.tsx). Creates `window.FrameworkIAA` global API.

**Deferred loading strategy** (PageSpeed optimized):
- Loads with `defer` attribute (non-blocking)
- Creates stub immediately with localStorage fingerprint
- Defers API call using `requestIdleCallback`
- Achieved ~52% LCP improvement (2.5s → 1.2-1.5s)

**Debug in browser**:
```javascript
window.debugTracking()              // Full state
window.FrameworkIAA                 // Current prospect
window.reidentifyProspect()         // Force re-identification
```

### 2.1. PWA & Service Worker

**Location**: [public/sw.js](public/sw.js) (v1.2.0)

Hybrid caching strategy for Next.js App Router:
- **Cache-first**: HTML navigation, static assets (JS, CSS, images)
- **Network-first**: Dynamic data, APIs
- **Auto-cache**: Client-side navigation via RSC (`?_rsc=` params)
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services, `/mapa-de-salida`, `/reto-5-dias` (legacy URLs redirigidas — siempre van a red para que los 301 funcionen)

**Registered in**: [src/app/layout.tsx](src/app/layout.tsx) via inline script

**PWA Icons & Manifest** (Dic 2025):
- **Manifest**: [public/site.webmanifest](public/site.webmanifest)
- **Theme color**: #D4AF37 (gold - Quiet Luxury)
- **Background**: #0a0a0f (dark)
- **Icons** (generated from [public/favicon.svg](public/favicon.svg)):
  - `web-app-manifest-192x192.png` - PWA icon
  - `web-app-manifest-512x512.png` - PWA splash
  - `favicon-96x96.png` - Browser tab
  - `apple-touch-icon.png` - iOS home screen

**Regenerate icons**: `node scripts/generate-favicons.mjs` (requires sharp)

### 3. Async Queue Architecture

**Database trigger architecture** (no external queue service):

```
Usuario → Producer → nexus_queue (INSERT)
                         ↓ (DB Trigger)
              Edge Function (nexus-queue-processor)
                         ↓
          Claude API + update_prospect_data RPC
```

**Benefits**: $0/month, <2s latency, simple debugging via Supabase Dashboard

**Deployment**: See [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md)

**Edge Functions** (in `supabase/functions/`):
- `nexus-queue-processor` - **Primary**: Processes NEXUS messages from DB queue
- `nexus-consumer` - Legacy: Kafka consumer (deprecated, kept for reference)
- `notify-stage-change` - Sends email notifications when prospects advance stages

### 3.1. Multi-Tenant Architecture (FASE C - Mar 2026)

Aislamiento por tenant_id en todas las capas: Middleware (x-tenant-id header) -> vectorSearch (filter_tenant_id) -> system_prompt (get_tenant_system_prompt RPC) -> nexus_queue (metadata.tenant_id).

Tenants activos: creatuactivo_marketing (creatuactivo.com), marca_personal (luiscabrejo.com), queswa_dashboard (queswa.app), ecommerce (ganocafe.online pendiente).

SQL migration: supabase/migrations/20260316_match_documents_tenant_filter.sql

### 3.2. Voice Pipeline (Mar 2026)

Cadena: Whisper (~2s) -> Claude Haiku (~1s, max 450 tokens) -> ElevenLabs turbo_v2_5 (~2s) = ~5-8s total.
Ruta: /api/voice-command (Node, maxDuration=60, Vercel Pro requerido).
TTS inline: /api/nexus/tts (boton ESCUCHAR en mensajes del chat).
Fallback TTS: ElevenLabs quota/401 -> OpenAI tts-1-hd voz onyx.

### 4. Supabase Schema

**Key Tables**:
- `prospects` - Fingerprinted visitors
- `prospect_data` - Captured info (name, email, phone, etc.)
- `nexus_documents` - Knowledge base
- `nexus_conversations` - Chat history
- `system_prompts` - Dynamic NEXUS prompts
- `nexus_queue` - Async message queue
- `constructor_slugs` - Mini-landing slugs (slug, display_name, foto_url, frase_personal, whatsapp, constructor_id)
- `private_users` - Constructor profile data (affiliation_link, profile_photo_url)

**Key RPC Functions**:
- `identify_prospect()` - Create/update prospect
- `update_prospect_data()` - Merge new data
- `search_nexus_documents()` - Semantic search
- `enqueue_nexus_message()` - Add to queue

**Knowledge Base** (almacenado en `nexus_documents`): ver la tabla de arsenales y versiones actuales en la sección [NEXUS AI Chatbot — Fragmented Vector Search](#1-nexus-ai-chatbot) arriba. Archivos fuente:

- [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt)
- [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt)
- [knowledge_base/arsenal_reto.txt](knowledge_base/arsenal_reto.txt)
- [knowledge_base/arsenal_12_niveles.txt](knowledge_base/arsenal_12_niveles.txt)
- [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt)
- [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt)
- [knowledge_base/arsenal_marca_personal.txt](knowledge_base/arsenal_marca_personal.txt)
- [knowledge_base/arsenal_ganocafe.txt](knowledge_base/arsenal_ganocafe.txt)

**Documentación completa**: [knowledge_base/README.md](knowledge_base/README.md) · **Historial de cambios**: [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

### 5. Page Structure & Funnel Architecture

**Funnel Strategy** (Russell Brunson methodology - actualizado Mar 2026):
```
Tráfico Frío (Ads/Redes) → /auditoria-patrimonial (Squeeze Page — ENTRY v4.0 activo)
                              ↓
                         /auditoria-confirmada (Bridge Page)
                              ↓
                         Email Secuencia 5 Días — Auditoría Patrimonial (Nurture)
                         5 videos: /auditoria-patrimonial/dia-1 … dia-5
                              ↓
                         /fundadores (Oferta)

Tráfico SEO (Blog) → /blog/* (Shadow Funnel)
                              ↓
                         /auditoria-patrimonial o /fundadores

Nota: /reto-5-dias/* y /mapa-de-salida/* siguen activos como legacy (301 → v4.0)
```

**Active Pages** (rutas no-obvias — el resto se descubre con `ls src/app/`):

- `auditoria-patrimonial/` — 🎯 FUNNEL ENTRY v4.0 (noindex). Squeeze page + `[constructorId]/` re-exporta la misma página. `dia-1/` a `dia-5/` cada uno con variante `[ref]/` para distribuidor.
- `auditoria-confirmada/` — Bridge Page v4.0 (noindex). `TrackingConfirmada.tsx` es 'use client' y dispara evento `vio_bridge_auditoria`.
- `reto-5-dias/` — FUNNEL ENTRY v1 (noindex, legacy). Redirect chain: `/reto-5-dias` → `/mapa-de-salida` → `/auditoria-patrimonial` (dos saltos 301 en `next.config.js`). Tiene variantes A/B: `dolor/`, `analitico/`, `global/`.
- `mapa-de-salida/` — Página Next.js aún activa (con `[constructorId]/`, `layout.tsx`, `opengraph-image.tsx`). Redirige 301 → `/auditoria-patrimonial`. El SW bypass incluye ambas URLs (`/mapa-de-salida` y `/reto-5-dias`) para que los 301 funcionen correctamente.
- `calculadora/` — Calculadora de ingresos (indexada).
- `diagnostico/` — **Landing huérfana standalone para tráfico pagado** (Meta Ads / Google Ads). Quiz de 5 dimensiones (autonomía, resiliencia, eficiencia, apalancamiento, paz mental) que perfila al prospecto en uno de 3 arquetipos (Gigante de Pies de Barro / Operador Agotado / Constructor en Progreso) y lo inyecta al funnel principal vía POST a `/api/funnel` con `step: 'auditoria_registered'` (aliased a `mapa_registered` en route.ts). Cero links internos hacia ella desde el sitio — entrada es solo URL directa desde campañas. Sin `<StrategicNavigation/>` (decisión deliberada: 0 fricción de navegación). API endpoint dedicado: `/api/diagnostico` guarda quiz + arquetipo en tabla `diagnosticos` (Supabase). CTA final → `/auditoria-patrimonial` (squeeze del funnel actual).
- `paises/` — Páginas por destino con sub-ruta dinámica `[destino]/` (ej. `brasil/`).
- `[slug]/` — **Mini-landing personal del Arquitecto de Patrimonio** (`creatuactivo.com/luis-cabrejo`). Micro-sitio personalizado con foto, frase y links del constructor. OG dinámico para WhatsApp. Lee de `constructor_slugs` (slug, display_name, foto_url, frase_personal, whatsapp) + `private_users` (affiliation_link, profile_photo_url). ❌ NO es para blog slugs — esos van bajo `/blog/`.
- `[slug]/[destino]/` — Redirect con tracking de referral. `DESTINO_MAP` en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) resuelve destinos cortos (home, auditoria, calculadora, productos, servilleta, activacion, dia-1..dia-5) a rutas reales con `?ref={constructorId}`.
- `presentacion-empresarial/` — Herramienta interna para 1-on-1, **NO está en el menú público**.
- `infraestructura/` — Implementación de referencia del sistema Bimetallic v3.0. Leer antes de crear nuevas páginas.
- `sistema/productos/catalogo-productos.tsx` — 🚧 WIP ("Clinical Luxury" e-commerce), sin enlazar aún desde `page.tsx`.
- `animaciones/diaX/` — Canvas-based social video renderer (Dan Koe style). Variantes A/B con sufijos `-v3` a `-v6`.
- `servilleta/` — Deck interactivo v6.0 de 4 slides. **Migrado al sistema Lujo Silencioso (15 May 2026)** — usa los mismos tokens que el resto del sitio (`--color-brand`, `--color-bg-elevated`, `--font-sans`, etc.). La paleta industrial previa (steel/safety-orange/cyan eléctrico) fue retirada.
- `paquetes/` — Protocolo de Capitalización v3.0. CTAs → WhatsApp pre-filled con nombre+USD+COP.
- `planes/` — 4 planes de suscripción. Sin Framer Motion ni `backdropFilter` (decisión de performance).
- `offline/` — PWA fallback; `webinar/sala/` — live room con countdown.

**SEO Strategy** (Dic 2025):
- **Indexed pages**: `/`, `/fundadores`, `/socios`, `/blog/*`, `/tecnologia`, `/sistema/productos`, `/paquetes`
- **noindex pages** (funnel interno):
  - `/reto-5-dias/*` → Squeeze/Bridge para ADS (v1 — legacy, 301 → v4.0)
  - `/auditoria-patrimonial/*` → Squeeze + 5 páginas de video (v4.0 — "Auditoría de Arquitectura Patrimonial")
  - `/auditoria-confirmada` → Bridge Page v4.0
  - `/nosotros` → SEO en página personal Luis Cabrejo Parra

**Dynamic `[ref]` Routes**: Landing pages support referral tracking via `/page-name/referrer-id`.

**Navigation** ([src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx)):
- **Desktop Menu**: Nosotros, Tecnología, Productos, Blog + "Auditoría Patrimonial" CTA
- **Mobile CTA**: "Unirme al Reto" → /auditoria-patrimonial
- **Removed from menu**: Soluciones, Ecosistema, Presentación, Auditoría
- **Presentación Empresarial**: Kept as internal tool for partners, not in public menu

### Servilleta Digital - Interactive Presentations

Sales presentation tools for 1-on-1 conversations. **Desde 15 May 2026 usa el mismo sistema de diseño Lujo Silencioso del sitio principal** (no más "Industrial Realism" / paleta steel-orange). La servilleta hereda tokens semánticos via las variables locales `--bg-dark`, `--concrete`, `--steel`, `--orange` que ahora apuntan a tokens globales (`--color-bg-primary`, `--color-bg-elevated`, `--color-titanium-dark`, `--color-brand`).

| Version | Route | Style |
|---------|-------|-------|
| v6.0 (Main) | `/servilleta` | 4-slide deck, fullscreen (F key), keyboard nav, swipe |
| v6.0 (Ref) | `/servilleta/[constructorId]` | Re-exports main page; constructorId read from URL path client-side for tracking |

**Controls**: Arrow keys/Space (next slide), F (fullscreen), double-click (fullscreen), swipe (mobile)
**Typography**: `var(--font-sans)` Inter (headings) + `var(--font-mono)` Roboto Mono (data) — unificado con homepage
**Color Palette**: Lujo Silencioso — hereda los tokens del [Design System](#design-system-bimetallic-v30) (Carbón + Dorado Champán + Titanio) + Cyan `#22D3EE` como único acento de data exclusivo de la servilleta

#### Contenido y copy (Abr 2026 — versión final aprobada)

**Nav desktop**: Brand `CreaTuActivo` (sin ícono). Menú: `01 LA MÁQUINA · 02 METODOLOGÍA · 03 EL PRODUCTO · 04 SIMULADOR`
**Nav mobile**: Labels sin número — `La Máquina · Metodología · El Producto · Simulador` (sin íconos Material Symbols — renderizan como texto literal)

**Slide 1 — LA MÁQUINA**: REF `PATRIMONIO_PARALELO`. H1 "CONSTRUCCIÓN DE PATRIMONIO PARALELO". Tres `.comp-row`: CAPA LOGÍSTICA (Gano Excel) / CAPA TECNOLÓGICA (CreaTuActivo y Queswa) / DIRECCIÓN EJECUTIVA (La dirección). CTA → Slide 2.

**Slide 2 — LA METODOLOGÍA EAM**: Tres cards Lujo Clínico (pantalla = soporte, voz = detalle):
- EXPANDIR: "Su terminal móvil es su centro de mando. / Usted dirige tráfico digital hacia el sistema — sin gestión manual." Tachadas: `PROSPECCIÓN MANUAL · FRICCIÓN OPERATIVA · DEPENDENCIA LINEAL`
- ACTIVAR: "Usted no presenta el modelo. / El Protocolo de IA Queswa asume el 90% del desgaste operativo, filtrando y calificando perfiles 24/7." Tachadas: `IMPROVISAR · MEMORIZAR GUIONES · TITUBEAR`
- MAESTRÍA: "La infraestructura académica ejecuta la transferencia de protocolos tácticos de forma autónoma por niveles. / Su activo escala eliminando el tiempo humano como cuello de botella operativo." Tachadas: `CAPACITAR MANUALMENTE · MICROGESTIONAR · CUELLO DE BOTELLA`
- CTA "VER EL PRODUCTO →" al fondo del grid (`gridColumn: '1 / -1'`), no en el header
- Botón "PREGÚNTALE ALGO EN VIVO" en card-1 → dispara `open-queswa` CustomEvent

**Slide 3 — EL PRODUCTO**: Eyebrow "EL PRODUCTO". H2 "UN HÁBITO / QUE NO CAMBIA". Cuerpo: "Optimización de hábitos preexistentes mediante tecnología nutricional patentada con Ganoderma Lucidum." Panel métricas "GANODERMA LUCIDUM" (barras VITALIDAD 94% / RESISTENCIA 89% / RECUPERACIÓN 62%). CTA "VER LOS NÚMEROS →" dentro del `.bio-metrics-container` (no posición absoluta — evita overlap sobre RECUPERACIÓN en fullscreen). Layout mobile: `.slide-3-layout` es `flex-direction: column` en mobile.

**Slide 4 — SIMULADOR DE PATRIMONIO PARALELO**:
- Tabs: INGRESO INMEDIATO / INGRESO RECURRENTE
- Labels: PERSONAS EN SU RED / HOGARES EN SU RED (`Usted` — no tuteo)
- Package selector: ESP-1 / ESP-2 / **Empresarial** (no "Pro")
- `getLifestyleTranslation`: 8 strings McKinsey/BCG (Lujo Clínico — sin jerga MLM):
  - <$100: "Amortización de Pasivos Fijos Operativos."
  - ≤$300: "Auto-Sustentabilidad de su Base Operativa (Carga Operativa Cubierta)."
  - ≤$600: "Flujo de Caja Equivalente a Ingreso Base Profesional."
  - ≤$1,200: "Consolidación de Activo Directivo (Independencia Operativa)."
  - ≤$2,500: "Arquitectura de Patrimonio Diamante (Independencia Financiera Global)."
  - ≤$5,000: "Portafolio de Activos Recurrentes con Tracción Multinacional Activa."
  - ≤$10,000: "Arquitectura Patrimonial de Alto Rendimiento — Velocidad de Crucero."
  - >$10,000: "Infraestructura de patrimonio paralelo operativa. El Déficit Estructural de Ingresos ha sido corregido."
- Panel CTA: eyebrow cyan "CONSTRUCCIÓN DE PATRIMONIO PARALELO" → H3 "Protocolo de Selección Directiva" → párrafo "Los datos técnicos están expuestos. Determine usted el nivel de integración que su arquitectura patrimonial requiere hoy." → botones
- **NO hay párrafo `.cta-inaccion`** — eliminado (residuo de mentalidad de escasez)
- Botón primario: "ACTIVACIÓN DE UNIDAD DE SUMINISTRO →" → `/paquetes`
- Botón secundario: "VER LA AUDITORÍA DE 5 DÍAS →" → `/auditoria-patrimonial`

#### Arquitectura Mobile (Abr 2026 — no revertir)

**Slide 2**: Grid de 3 tarjetas (`.card-industrial`) con layout split imagen/texto:
- `.card-bg`: `position: absolute; top: 0; height: 50%` — imagen pura, sin texto superpuesto
- `.card-content`: `position: absolute; bottom: 0; height: 55%; background: gradient` — zona oscura con texto
- Mobile: scroll vertical dentro del grid (`overflow-y: auto`), tarjetas con `min-height: 55vh`
- Fullscreen mobile: tarjetas con `min-height: 55vh`, scroll normal (NO scroll-snap en slide 2)
- Imágenes: `tech-servers.jpg` (card-1, `cover`), `tech-console.jpg` (card-2, `100% auto`), `tech-duplication.jpg` (card-3, `100% auto`)
- Cards inactivas: `grayscale(100%) brightness(40%)` → activa: `grayscale(0%) brightness(70%)` con `transform: scale(1.05)`

**Slide 3**: `.slide-3-layout` es `flex-direction: column; justify-content: flex-end` en mobile — slide-3-bottom y CTA apilan verticalmente (NO flex-direction: row que hace flotar el CTA a la derecha).

**Slide 4**: Scroll-snap vertical en mobile — dos snap items de `100vh`:
1. `.simulator-panel` — calculadora (INGRESO INMEDIATO / INGRESO RECURRENTE)
2. `.cta-panel` — imagen `boton-accion.jpg` (top 40%) + zona texto (bottom 60%)
   - `.bg-image-cta`: `grayscale(100%) brightness(50%)` por defecto
   - Desktop: imagen queda gris hasta hover (CSS `:hover` puro — NO setTimeout auto-reveal, fue eliminado porque impedía ver la transición)
   - Mobile: `ctaVisible` state + IntersectionObserver → `cta-revealed` → color al scroll-snap
   - `#slide-4 { padding-top: 0 }` en fullscreen — elimina espacio negro vacío del HUD
   - Botón primario "ACTIVACIÓN DE UNIDAD DE SUMINISTRO →": `width: 100%`, naranja dominante → `/paquetes`
   - Botón secundario "VER LA AUDITORÍA DE 5 DÍAS →": outline, más angosto → `/auditoria-patrimonial`

#### Reglas de iconos Material Symbols en Servilleta (NO revertir)

**Problema conocido**: Los íconos Material Symbols Sharp cargan de forma asíncrona. Si un nombre de ícono aparece como string dentro de `<span className="material-symbols-sharp">nombre</span>`, renderiza como texto literal en inglés hasta que la fuente carga.

**Solución aplicada**: Eliminar el span completo y usar texto Unicode `→` o dejar el elemento sin ícono. Íconos eliminados: `precision_manufacturing`, `calculate`, `cell_tower`, `memory`, `hub`, `rocket_launch`, `verified_user`, `biotech`, `bolt`, `autorenew`, `settings`, `eco`, `bar_chart`.

**Íconos que SÍ funcionan** (cargados síncronos): `fullscreen`, `fullscreen_exit` (en botón fullscreen del nav — usan el font ya cargado en layout.tsx).

**Queswa en Servilleta**:
- `UnifiedQueswaOrb` retorna `null` en `/servilleta` (orbe completamente oculto)
- Card-1 de slide-2 tiene botón inline que dispara `window.dispatchEvent(new CustomEvent('open-queswa'))`
- El `body.style.overflow = 'auto'` se restaura temporalmente al abrir Queswa para que el teclado funcione

## Environment Variables

Copia `.env.example` a `.env.local` y configura. Servicios requeridos:

- **Supabase**: Base de datos + Auth + Edge Functions (requires pgvector extension)
- **Anthropic**: Claude API para chatbot Queswa/NEXUS
- **Voyage AI**: Embeddings vectoriales para búsqueda semántica
- **Resend**: Emails transaccionales
- **Vercel Blob**: Almacenamiento de videos (opcional)
- **Twilio**: WhatsApp automation (opcional)

**Production-only variables** (set in Vercel Dashboard, not in .env.example):
- `CRON_SECRET` - Authorization for Vercel cron jobs
- `EQUIPO_DIRECTIVO_EMAIL` - **Opcional** (default hardcoded `sistema@creatuactivo.com`). Destinatario del warm handoff cuando entra Estado 4 del FSM. Sirve para override sin redeploy (ej. testing con otra dirección)

Ver [.env.example](.env.example) para la lista completa con instrucciones de configuración.

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase
2. Use helper scripts por dominio:

| Dominio | Prompt name | Script de actualización |
|---------|-------------|------------------------|
| `creatuactivo.com` | `nexus_main` | `actualizar-system-prompt-v27.2.mjs` (latest: **v27.2 modulacion_registro** — apunta a `system-prompt-nexus-main-v27_2.md`) |
| `luiscabrejo.com` | `marca_personal_v1.0` | `actualizar-system-prompt-marca-personal-v1.mjs` |
| `ganocafe.online` | `ganocafe_main` | `actualizar-system-prompt-ganocafe-v1.3.mjs` (latest: **v1.5_ganocafe_alias_coloquiales**) — ⚠️ tiene catálogo de precios hardcodeado: sincronizar con `arsenal_ganocafe.txt` al cambiar precios |
| `queswa.app` | hardcoded en `dashboard-ai/route.ts` | editar `buildSystemBlocks()` directamente |

3. Clear cache (restart dev server or wait 5 minutes)

**DO NOT** modify fallback system prompt en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts).

**Queswa Official Constants** (calibradas Mar 2026 — consistencia obligatoria en todos los arsenales):
- Lanzamiento público oficial: **lunes 1 de junio**
- Equipo base Fundadores inicial: **15 socios estratégicos / 15 cupos**
- Porcentaje de automatización tecnológica: **90%** (la tecnología hace el 90% del trabajo pesado)
- Tres Pilares canónicos (NO "Máquina Híbrida", NO "capas"): **Pilar 1 — La Matriz Física** (Gano Excel, 70 países, pasivos logísticos) · **Pilar 2 — Queswa, su Centro de Mando** (IA propietaria, queswa.app) · **Pilar 3 — La Metodología Automatizada** (El Tridente EAM: protocolo de ejecución estandarizado que erradica el ensayo y error) — recategorización aplicada en v26.5 (May 2026)
- Activo del Arquitecto: **Base Operativa** — unidad replicable que se escala activando nuevas Bases Operativas
- Rol del usuario: **Arquitecto de Patrimonio** — dirige los tres pilares, NO es uno de ellos. Labor puramente gerencial/directiva, no operativa.
- Maestría: "La Academia es tu ventaja injusta. Cada semana de aprendizaje acorta la curva que a otros les tomó años."
- Gano Excel presencia global: **70 países** (oficial — no usar 60)
- Sub-perfiles del Constructor: **Perfil-A** (ejecutivo/alto ingreso) · **Perfil-B** (negocio propio) · **Perfil-C** (independiente/freelance) — uso interno únicamente. Las etiquetas "Esposas de Oro", "Trampa Operativa", "Creador de Ingreso Lineal" están **eliminadas** — atacaban la identidad del prospecto. El villano es siempre el Plan por Defecto, nunca la actividad del héroe.

**Audiencia objetivo + reglas lingüísticas** → ver tabla canónica unificada en sección [Queswa Vocabulary — Tabla Canónica](#queswa-vocabulary--tabla-canónica-unificada). Reglas clave:
- Audiencia mixta pan-americana (USA, México, Colombia) — vocabulario respetuoso pero accesible (test "abuela de 75 años"). El target original "CEOs/cirujanos" del Lujo Clínico se amplió en v5.2 (May 2026) tras el insight del Director Cabrejo: "el arquitecto no precipita el cierre, pero cuando llega los procesos son sencillos".
- NUNCA plantar objeciones ("vender", "convencer", "perseguir") donde el héroe no las mencionó.
- Referencias geográficas pan-americanas — no Colombia-only.

### Arquitectura FSM — Backend como Dictador Absoluto (rediseñado Opción B, 22 May 2026)

Principio: el LLM es un **procesador semántico**, no un tomador de decisiones de flujo. El backend (`route.ts`) detecta el estado y controla todos los textos verbatim. Patrón: Graph Prompting (Salesforce Agentforce / Intercom Fin / HubSpot Breeze).

**Rediseño Opción B (22 May 2026):** se ELIMINARON Estado 1 (pregunta de horas) y Klaff Prize Frame agresivo. Razón: la investigación corporativa documentó que la entrevista de cualificación al final del flujo destruye conversión — la cualificación BANT debe inferirse de la conversación previa, no preguntarse explícitamente.

**Funciones de micro-prompt en `route.ts`** (cada estado recibe SOLO instrucciones de su nodo):

| Función | Condición de disparo | Qué controla |
|---------|---------------------|--------------|
| `getMicroPromptApertura()` | `messageCount === 1` | Saludo inicial verbatim — M1 |
| `getMicroPromptCierre()` Estado 2 | `closingState === 2` | Tabla ESP (3 niveles). **Modo dual**: `modoCierre=true` (pregunta combinada nombre+nivel cuando trigger cierre sin paquete) · `modoCierre=false` (pregunta abierta cuando solo es informativo) |
| `getMicroPromptCierre()` Estado 3 | `closingState === 3` | Confirmación + solicitud de nombre. Usa nombre descriptivo completo (ESP-3 Visionario) |
| `getCierreEstado4()` | `closingState === 4` | Texto al prospecto contextual + dispara warm handoff (sumario ejecutivo Haiku + Resend al equipo) |

**`sessionInstructions` (Bloque 3 — no cacheable):**
- M1: inyecta `getMicroPromptApertura()` (texto verbatim, ignora Pirámide McKinsey)
- M2+: inyecta `📍 ${getMessageContext()}` para orientación del modelo
- Siempre incluye: `getPageContextInstructions()`, `getMicroPromptCierre()`, `getCierreEstado4()`, `<prospect_state>`

**Regla crítica**: NO agregar textos de flujo al System Prompt. El System Prompt es perfil de personalidad puro (identidad + tono + diccionario). Cualquier texto que el modelo deba imprimir verbatim va en las funciones de micro-prompt del backend.

**Lógica del FSM (route.ts:3625+):**
1. `waLinkEntregado` (link WhatsApp ya entregado en sesión) → Estado 0
2. `nombreSolicitado && package && (usuario dio nombre válido O nombre ya capturado)` → Estado 4
3. `nombreSolicitado && package && usuario NO dio nombre` → Estado 0 (responder pregunta libre, package permanece guardado para próximo intento)
4. `package` capturado explícitamente → Estado 3 (confirmar + pedir nombre)
5. `triggerCierre` ("deseo iniciar", "hagámoslo", "dale", "procedamos") sin paquete → Estado 2 `modoCierre=true`
6. `triggerPaquetes` ("háblame de los paquetes") → Estado 2 `modoCierre=false` (informativo)
7. Default → Estado 0 (conversación normal con RAG)

**Detección Estado 4 (regex):** `/WhatsApp Directo de Activación|mesa directiva|sintetizado su evaluación|Su acceso oficial está aquí/i`. Si se modifica el texto de `getCierreEstado4()`, actualizar el regex.

**Validación de nombre (Fix Bug 1+2, 22 May 2026):** Antes de disparar Estado 4, el FSM valida con `extractNameFromHandoffReply()` que el usuario efectivamente respondió con un nombre. Si la respuesta del usuario es una pregunta nueva o pide pausar, NO se dispara Estado 4 — el sistema responde libremente y el package permanece guardado para que el próximo turno (cuando el usuario dé el nombre) sí dispare el handoff.

**Tratamiento**: Siempre `Usted` — nunca tuteo. Auditado en todos los micro-prompts.

### Lead Scoring v3.0

**Escala**: 0–100. Implementado en `captureProspectData()` dentro de [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts). Umbrales: 0–49 frío, 50–74 tibio, 75–89 caliente, 90–100 SQL. Las señales con mayor peso son: multi-threading +15, WhatsApp +8, verbos de compra +8, preguntas sobre inicio +8. Señal más negativa: "no me interesa" -15.

### Updating Queswa Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Feb 2026):

**IMPORTANTE — Protocolo correcto de actualización de fragmentos:**
1. Editar el `.txt` en `knowledge_base/`
2. Deploy del documento fuente a Supabase: `node scripts/deploy-arsenal-<nombre>.mjs`
3. **Purgar fragmentos obsoletos** por prefijo (NO basta con saltar este paso — el fragmentador lo detecta y skipea: `⏭️  arsenal_inicial_FREQ_03 ya existe, saltando…`)
4. Re-ejecutar `fragmentar-arsenales-voyage.mjs` (regenera solo los purgados — los demás se saltan)
5. Verificar con `node scripts/audit-completo.mjs`

**Patrón validado para purgar (24 May 2026, v5.4 deploy):**

```bash
# Purgar fragments de uno o varios arsenales padre (tenant creatuactivo_marketing)
node -e "
import('dotenv').then(d => { d.config({path: '.env.local'}); return import('@supabase/supabase-js'); })
  .then(({createClient}) => {
    const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    return Promise.all([
      s.from('nexus_documents').select('id').like('category', 'arsenal_inicial_%').eq('tenant_id', 'creatuactivo_marketing'),
      // … repetir por cada arsenal afectado
    ]).then(async ([r]) => {
      const ids = r.data.map(x => x.id);
      await s.from('nexus_documents').delete().in('id', ids);
      console.log('Purgados:', ids.length);
    });
  });
"
```

**⚠️ NO confiar en `actualizar-fragmentos-modificados.mjs` como herramienta genérica** — tiene fragmentos HARDCODED (COMP_MODELO_01, COMP_BIN_08). Sirvió para ediciones puntuales históricas, pero NO detecta cambios actuales por hash/diff. Para v5.3+ usar el patrón purgar+re-fragmentar de arriba.

**Atajo solo si el script genérico cubre tu caso**: `node scripts/fragmentar-arsenales-voyage.mjs` — si los fragments no existen, los crea. Si existen, los salta. Útil cuando se añaden respuestas NUEVAS sin modificar existentes.

1. Edit `.txt` files in `knowledge_base/`:
   - `arsenal_inicial.txt` - Initial questions (43 fragmentos — 42 activas + PERFIL_01)
   - `arsenal_avanzado.txt` - Objections + System + Value + Escalation + Activation (18 responses)
   - `arsenal_reto.txt` - **Auditoría Patrimonial** v4.1 (7 responses — auditoria-patrimonial/dia-1 a dia-5)
   - `arsenal_12_niveles.txt` - 12-level challenge content
   - `catalogo_productos.txt` - Product catalog + science (22 products)
   - `arsenal_compensacion.txt` - Compensation plan (38 responses — **NO modificar vocabulario**)

2. Deploy to Supabase via scripts:
   ```bash
   node scripts/deploy-arsenal-inicial.mjs
   node scripts/deploy-arsenal-avanzado.mjs
   node scripts/deploy-arsenal-reto.mjs
   node scripts/deploy-arsenal-12-niveles.mjs
   node scripts/actualizar-catalogo-productos.mjs
   ```

3. Regenerate embeddings (required after content changes):
   ```bash
   node scripts/fragmentar-arsenales-voyage.mjs    # Creates fragments with Voyage AI embeddings
   ```

4. Verify: `node scripts/audit-completo.mjs` (preferido — `verificar-arsenal-supabase.mjs` tiene bug PGRST116)

**Falsa alarma del audit — `desconocido: 40 fragmentos`**: el script `audit-completo.mjs` clasifica fragments por `metadata.parent_arsenal`. Cuando ese campo no está poblado, los etiqueta "desconocido" aunque la `category` esté bien (ej. `arsenal_compensacion_COMP_PV_06`). Los 40 actuales son:
- 14 fragments individuales de `arsenal_compensacion` (COMP_GEN5_*, COMP_PAQ_*, COMP_PV_*, COMP_VENTA_01, COMP_MONEDA_01) — útiles, son respuestas reales
- 6 docs maestros padre (`arsenal_inicial`, `arsenal_ganocafe`, `arsenal_reto`, `arsenal_marca_personal`, `catalogo_productos`) — **NO ELIMINAR**, el fragmentador los necesita para parsear (`.eq('category', arsenalCategory)`)
- 1 `catalogo_productos_PROD_OVERVIEW` — verbatim_lock activo

Eliminar cualquiera rompe funcionalidad. Si quieres limpiar el warning, enriquece `metadata.parent_arsenal` en esos fragments (cosmético, no operativo).

### Working with Video Content

#### Flujo estándar (video ya editado)

```bash
# 1. Optimize video (creates 720p, 1080p, 4K + poster)
./scripts/optimize-video.sh /path/to/video.mp4

# 2. Upload to Vercel Blob
node scripts/upload-to-blob.mjs

# 3. Add URLs to .env.local and Vercel Dashboard
```

See [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) for details.

#### Color Grade — Naval Ravikant / Dan Koe Style (DaVinci Resolve)

Ver [HANDOFF-VIDEO-NAVAL-DAVINCI.md](HANDOFF-VIDEO-NAVAL-DAVINCI.md) para el flujo completo. Resumen: `python3 scripts/generate_lut.py` genera `naval_style.cube`, luego `python3 scripts/davinci_naval.py --input video.mp4 --name nombre` exporta 1080p + 720p + poster. DaVinci debe estar abierto antes de correr el script.

### Canvas Animation Videos (src/app/animaciones/)

Dan Koe-style vertical videos rendered in-browser via Canvas API + React. Used for social media content.

- **Format**: 1080×1920 (9:16 vertical), 60fps, ~38 seconds
- **Stack**: React + TypeScript + Canvas API + MediaRecorder (recording to WebM/MP4)
- **Assets**: `public/campaign-assets/` — backgrounds, visual effects, sounds
- **Exported videos**: `public/animaciones/` — rendered WebM/HTML exports (static, not source code)
- **Static graphics**: `public/codigo/` — SVG assets and code visuals for animations
- **Handoff doc**: [HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md](HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md)
- **Día 8 post-producción**: [HANDOFF-DIA8-POSTPRODUCCION.md](HANDOFF-DIA8-POSTPRODUCCION.md) — audio, SFX, subtítulos spec para `dia8-v2`

Each `animaciones/diaX/` page renders and exports one video. Variants (e.g. `dia7-v3` through `dia7-v6`) are A/B iterations of the same day's script.

### Founder Spots Counter

**Location**: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)

**Status**: Static counter showing 150 spots. Dynamic system paused waiting for real sales data.

**Test**: `node scripts/test-contador-cupos.mjs`

## Testing & Debugging

### NEXUS Health Check

```bash
curl http://localhost:3000/api/nexus
```

Returns: Arsenal counts, system prompt version, catalog availability, RPC status.

### Common Issues

**NEXUS messages not saving prospect data**:
- Check browser console for "CRÍTICO: Request sin fingerprint"
- Verify `window.FrameworkIAA.fingerprint` exists
- Ensure `tracking.js` loads before NEXUS interaction

**Streaming responses break**:
- Check Network tab for failed `/api/nexus` requests
- Verify `ANTHROPIC_API_KEY` is valid
- Edge runtime has 30s timeout (configurable)

**Wrong knowledge base returned**:
- Check console logs for "Clasificación híbrida"
- Update patterns in `clasificarDocumentoHibrido()`

**Queue messages not processed**:
- Supabase Dashboard → Edge Functions → nexus-queue-processor → Logs
- Check trigger: `SELECT * FROM pg_trigger WHERE tgname LIKE '%nexus_queue%'`
- Check queue: `SELECT * FROM nexus_queue WHERE status = 'pending'`
- Redeploy: `npx supabase functions deploy nexus-queue-processor`

## Business Timeline

**Fases del Lanzamiento** (ver fechas actuales en la aplicación):

1. **Lista Privada** - 150 Founder spots (Fundadores = MENTORES)
2. **Pre-Lanzamiento** - 22,500 Constructor spots (150 × 150)
3. **Lanzamiento Público** - Target: 4M+ users

**Actualizar fechas**: `node scripts/actualizar-fechas-prelanzamiento.mjs`

**Nota**: Las fechas exactas están en el código de las landing pages. Consultar [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx) para la fase actual.

## Deployment

### Vercel (Next.js)

- TypeScript errors don't block builds
- Set all env vars in Vercel Dashboard
- Video URLs required in production

### Supabase

**Prerequisites**:
- Enable `pgvector` extension (for embeddings storage)
- Enable `pg_net` extension (for DB triggers to call Edge Functions)

**Critical order**:
1. Apply migrations: `supabase/APPLY_MANUALLY.sql`
2. Seed knowledge base (copy from `knowledge_base/*.txt`)
3. Deploy Edge Function: `npx supabase functions deploy nexus-queue-processor`
4. Create trigger: `supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`
5. Update system prompts in `system_prompts` table

**Verify**:
- Edge Function logs in Supabase Dashboard
- Test: `curl -X POST https://your-app.vercel.app/api/nexus/producer`
- Check `nexus_queue` table

**Security (RLS)**:
All 34 tables have Row Level Security enabled (Dec 2025). To diagnose/fix:
```bash
# Run in Supabase SQL Editor
# Diagnostic: scripts/diagnostico-seguridad-supabase.sql
# Fix: scripts/fix-rls-seguridad-supabase.sql
```

## Important Patterns & Constraints

**Path Aliases** (tsconfig.json):
```typescript
import { X } from '@/components/X'  // → src/components/X
import { Y } from '@/lib/Y'         // → src/lib/Y
import type { Z } from '@/types/Z'  // → src/types/Z
// All imports starting with @/ resolve to src/*
```

**Custom Hooks** (in `src/hooks/`):
- `useHydration.tsx` - Prevents hydration mismatches
- `useTracking.ts` - React wrapper for tracking API

**Shared Libraries** (in `src/lib/`):
- `branding.ts` - Centralized branding v3.0 (COLORS, BRAND, ICON_COLORS, emailStyles)
- `vectorSearch.ts` - Voyage AI embeddings + cosine similarity for semantic search
- `respuestas-maestras.ts` - **Camino A backend dictador** — textos verbatim WHY_02 + EAM_01 servidos directo sin pasar por Anthropic cuando matchea chip canónico. Sincronizar carácter por carácter con `<verbatim_lock>` en arsenal_inicial.txt
- `handoff-sumario.ts` - **Warm handoff** — sub-agente Haiku genera expediente táctico + envía email HTML al equipo directivo (sistema@creatuactivo.com) via Resend cuando entra Estado 4 del FSM. Fire-and-forget, no bloquea handoff al prospecto
- `queswa-greeting.ts` - Saludo canónico de Queswa + chips `QUESWA_QUICK_REPLIES` (single source of truth — antes duplicado en 4 lugares)
- `whatsapp-meta.ts` - Envío de mensajes WhatsApp via Meta Graph API (reemplaza SendPulse)
- `sendpulse.ts` - Legacy → ver tabla [Heredado / Pendiente de eliminación](#heredado--pendiente-de-eliminación)

## Design System: Bimetallic v3.0

**Philosophy**: "Quiet Luxury meets Private Equity" - The site should look like a high-end investment firm, not a typical MLM.

### Color Hierarchy (Sistema Bimetálico)

| Category | Color | Hex | Usage |
|----------|-------|-----|-------|
| **Gold (EL PREMIO)** | Champagne | `#C5A059` | CTAs, money, achievements, key titles |
| Gold Hover | | `#D4AF37` | Button hover states |
| Gold Bronze | | `#B38B59` | Secondary gold text |
| **Titanium (LA ESTRUCTURA)** | Primary | `#94A3B8` | Active icons, navigation |
| Titanium Muted | | `#64748B` | Inactive icons, labels |
| Titanium Dark | | `#475569` | Subtle lines, dividers |
| **Backgrounds** | Carbon Deep | `#0F1115` | Main background |
| Carbon Elevated | | `#15171C` | Alternate sections |
| Obsidian | | `#1A1D23` | Cards, surfaces |
| **Text** | White | `#FFFFFF` | Headlines |
| Smoke | | `#E5E5E5` | Body text |
| Muted | | `#A3A3A3` | Secondary text |
| **Status** | Success | `#10B981` | Completed, growth |
| Warning | | `#FBBF24` | Pending, in progress |
| Alert | | `#F43F5E` | Errors, required action |

### Icon Color Rules

```typescript
// From src/lib/branding.ts - ICON_COLORS
prize: '#C5A059'      // Trophy, coins, achievements → GOLD
structure: '#94A3B8'  // Navigation, tools, menus → TITANIUM (hover → gold)
success: '#10B981'    // Completed states → GREEN
warning: '#FBBF24'    // Pending states → AMBER
alert: '#F43F5E'      // Error states → RED
trust: 'rgba(255, 255, 255, 0.6)'  // Trust markers on landing pages
```

### Atmospheric Effects

**Spotlights** (for hero sections):
- Titanium: `radial-gradient(ellipse at center, rgba(148, 163, 184, 0.08) 0%, transparent 70%)`
- Gold (CTAs): `radial-gradient(ellipse at center, rgba(197, 160, 89, 0.06) 0%, transparent 70%)`

**Glass Borders** (for cards):
- Standard: `rgba(255, 255, 255, 0.1)` (neutral, not gold)
- Hover: `rgba(197, 160, 89, 0.3)` (gold on interaction)

**Section Gradients**:
- Alternate between `#0F1115` and `#15171C` for visual depth

### Reference Implementation

See [src/app/infraestructura/page.tsx](src/app/infraestructura/page.tsx) (`/infraestructura` route) for a complete example of the Bimetallic system applied:
- Icons start titanium, hover → gold
- Card borders use glass (white 10% opacity)
- Section dividers use titanium (not gold)
- Only CTAs, numbers, and achievements use gold

### Typography Hierarchy (23 May 2026)

Regla unificada aplicada en Home, Nosotros, Tecnología, Blog index, 3 artículos del blog, Paquetes y Sistema/Productos. Origen: [Diseño de Branding Premium Institucional.md](Diseño%20de%20Branding%20Premium%20Institucional.md) — sección "Arquitectura Tipográfica".

**H1 institucional** (páginas con título corto): `var(--font-sans)` Inter, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`, color `var(--color-brand)`. Ejemplos: "MEMORÁNDUM DIRECTIVO", "CATÁLOGO BIO-INTELIGENTE", "CONSTRUCCIÓN DE ESTRUCTURA PATRIMONIAL".

**H1 editorial** (artículos largos `/blog/*`): `var(--font-serif)` Playfair, `font-weight: 600`, natural case, `letter-spacing: -0.01em`. Aplicado vía `<IndustrialHeader variant="editorial" />`.

**H2** — siempre `var(--font-serif)` Playfair natural case (títulos narrativos, citas de tesis: "La Trampa Estructural.", "La arquitectura estaba fracturada.").

**Eyebrows uppercase** — `<p>` con `text-sm uppercase tracking-[0.15em]`. **NUNCA** usar `<h2>` para eyebrows pequeños (rompe estructura DOM).

**Componente canónico**: [src/components/IndustrialHeader.tsx](src/components/IndustrialHeader.tsx) — acepta `variant: 'institutional' | 'editorial'` (default: institutional) y `title: ReactNode` (para preservar `<span>` con highlight dorado en artículos). Renderiza el único `<h1>` de la página.

**Fuentes cargadas en `layout.tsx`** (next/font/google): Playfair Display, Inter, Roboto Mono. Cualquier otra fuente (Rajdhani, Oswald, Söhne, Financier, Montserrat) hace fallback al sistema → usar `var(--font-sans)`, `var(--font-serif)`, `var(--font-mono)`.

**Tokens canónicos** (no hex hardcoded):
- Texto primario → `var(--color-text-primary)` (no `#E5E5E5`)
- Marca dorada → `var(--color-brand)` (no `#E5C279` ni `#C8A84B`)
- Background card → `var(--color-bg-surface)` (no `#18181b` ni `#0d0d0d`)
- Background elevado → `var(--color-bg-elevated)` (no `#15171C` literal)

**CTAs** — usar clases canónicas `.cta-primary` / `.cta-secondary` / `.cta-ghost` de [src/app/globals.css](src/app/globals.css). Para sub-marcas con identidad propia (Clinical Luxury bioEmerald, WhatsApp), el patrón es: fondo con tinte 7-14% del color de acento + borde 1.5-2px + texto del color de acento. **Nunca** fondo sólido + texto invertido en botones primarios.

### Tailwind Config

Extended colors and utilities are defined in [tailwind.config.ts](tailwind.config.ts):
- `titanium`, `carbon`, `champagne` color palettes
- `shadow-spotlight`, `shadow-warm-spot` for atmospheric lighting
- `bg-gradient-section`, `bg-spotlight-blue`, `bg-spotlight-gold` utilities

**Email Templates** (in `src/emails/`):
- `soap-opera/` - Soap Opera sequence (Dia1-5)
- `reto-5-dias/` - Secuencia Auditoría Patrimonial — Coordenadas 01–05 (Lujo Clínico, Abr 2026)
  - `Dia1-Diagnostico.tsx` — Coordenada 01, URL `/auditoria-patrimonial/dia-1`
  - `Dia2-Vehiculos.tsx`   — Coordenada 02, URL `/auditoria-patrimonial/dia-2`
  - `Dia3-Modelo.tsx`      — Coordenada 03, URL `/auditoria-patrimonial/dia-3`
  - `Dia4-Estigma.tsx`     — Coordenada 04, URL `/auditoria-patrimonial/dia-4`
  - `Dia5-Invitacion.tsx`  — Coordenada 05, URL `/auditoria-patrimonial/dia-5`
- `FounderConfirmation.tsx` - Founder registration confirmation
- `Reto5DiasConfirmation.tsx` - Challenge registration confirmation
- `Reto12DiasConfirmation.tsx` - 12-level challenge confirmation
- `PreRegistroAdmin.tsx`, `PreRegistroUser.tsx` - Pre-registration emails

**Prospect Data Flow**:
1. Browser → `tracking.js` → RPC `identify_prospect`
2. NEXUS → `captureProspectData()` → RPC `update_prospect_data`

**Edge Runtime**:
- All NEXUS API routes use `export const runtime = 'edge'`
- Configured with `maxDuration = 60` seconds for heavy requests (product list queries)
- Supports streaming responses via `StreamingTextResponse`

**Build-Time Patterns**:
- Supabase client uses lazy initialization (avoid build-time errors)
- TypeScript errors ignored (`ignoreBuildErrors: true`)
- Environment variables validated at runtime

**Code Headers**:
- All API routes include copyright header (© CreaTuActivo.com)
- Headers specify proprietary licensing and confidentiality

**Global Window Types** (defined in `src/types/global.d.ts`):
```typescript
window.FrameworkIAA?: { fingerprint?: string }  // Tracking API
window.nexusProspect?: { id: string }           // Current prospect
```

**Never** store PII in localStorage (only fingerprint/session IDs).

## Heredado / Pendiente de eliminación

Inventario centralizado de código y rutas legacy. Cada ítem mantiene su nota detallada en la sección original; aquí se listan para que un agente nuevo identifique de un vistazo qué NO es la fuente viva.

| Item | Estado | Detalle |
|------|--------|---------|
| `src/app/api/claude-chat/route.ts` | Sin uso | Reemplazado por `/api/nexus` con tenant `marca_personal` hardcodeado |
| `/api/nexus` POST (síncrono) | Funciona pero legacy | Usar `/api/nexus/producer` (async queue) en producción |
| `/api/nexus/consumer-cron` | Legacy | Fallback sin triggers — el flujo activo es DB trigger → `nexus-queue-processor` |
| `nexus-consumer` (Edge Function) | Deprecated | Consumer Kafka — reemplazado por `nexus-queue-processor` |
| `src/lib/sendpulse.ts` | Legacy | Migrado a `whatsapp-meta.ts` (Abr 2026). Eliminar tras aprobar plantillas Meta WhatsApp |
| `src/components/nexus/NEXUSFloatingButton.tsx` | Conservado parcial | Reemplazado por `UnifiedQueswaOrb` en layout; aún se usa para eventos servilleta |
| `/reto-5-dias/*` | Legacy (301) | Squeeze v1 — redirige a `/auditoria-patrimonial` |
| `/mapa-de-salida/*` | Legacy (301) | Page Next.js viva solo para que funcione el redirect → `/auditoria-patrimonial` |
| `/api/fundadores/registro-diciembre` | Legacy | Registro Diciembre — reemplazado por flujo Founder actual |
| `/api/test-resend`, `/api/test-reto-email`, `/api/debug-email` | Dev only | No para producción |
| `*.tsx.bak` | Respaldos inactivos | Nunca editar |

## Insights Estratégicos

Posicionamiento, doctrina de venta, diáspora latina, eventos corporativos Gano Excel, distinciones léxicas críticas → ver [public/contexto/INSIGHTS_ESTRATEGICOS_v1.md](public/contexto/INSIGHTS_ESTRATEGICOS_v1.md). Contenido extraído de CLAUDE.md el 18 May 2026 — no es referencia de arquitectura técnica, es referencia de doctrina de venta.

---

## Key Documentation Files

**Architecture & Deploy**:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Queue system deployment
- [knowledge_base/README.md](knowledge_base/README.md) - Arsenal structure and sync docs

**SEO & Performance**:
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](GOOGLE_SEARCH_CONSOLE_SETUP.md) - GSC setup
- [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations

**Video & Media**:
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video implementation
- [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) - Quick start guide
- [HANDOFF-VIDEO-NAVAL-DAVINCI.md](HANDOFF-VIDEO-NAVAL-DAVINCI.md) - DaVinci Resolve color grade handoff

**Business Logic**:
- [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) - Spots counter spec
- [PITCHES_ARQUITECTO_EMPRESARIAL_V3.md](PITCHES_ARQUITECTO_EMPRESARIAL_V3.md) - Sales pitches

**Handoff & Context**:
- [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) - Complete business context for onboarding
- [HANDOFF_QUESWA_TECNICO.md](HANDOFF_QUESWA_TECNICO.md) - Technical handoff for Queswa chatbot
- [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Luis Cabrejo's story (master doc for all storytelling)

**Research** (in `public/investigaciones/`):
- Reducir Fricción Cognitiva en Presentación Servilleta - Cognitive science behind industrial design
- Desarrollo Web Diseño Industrial Técnico - Industrial design implementation
- Sistema Lead Scoring Científico Digital - Lead scoring v3.0 design rationale
- HANDOFF-QUESWA-PRECIOS-CVPV.md - Bug parcialmente resuelto (22 May 2026): nombres de productos + categorías ya correctos (catálogo v7.2 con `<verbatim_lock>`); CV/PV individuales todavía pendientes en BEB_02-06 y PROD_*
- HANDOFF-QUESWA-UX-M3-BUG.md - UX bug handoff for M3 flow

**Research — Posicionamiento & UX** (in `public/contexto/investigaciones/`):
- System Prompts de IA Élite - Reference for elite AI system prompt patterns
- Investigación LLM: Máquinas de Estado Conversacional - State machine architecture for conversational AI
- RAG: Formato Markdown Consistente - RAG formatting consistency research
- UX Conversacional para Clase Media Latinoamericana / Servicio Premium - UX research for target audience
- Mejora UX Voz Agente Conversacional - Voice UX improvements research
- Posicionamiento de Producto (Obviously Awesome) / Ideas que Pegan / Storytelling - Positioning & messaging research

**Security**:
- [scripts/diagnostico-seguridad-supabase.sql](scripts/diagnostico-seguridad-supabase.sql) - RLS diagnostic
- [scripts/fix-rls-seguridad-supabase.sql](scripts/fix-rls-seguridad-supabase.sql) - RLS fix script

## Utility Scripts

**Location**: `scripts/` directory (~35 scripts)

**NEXUS System Prompt**:
- `leer-system-prompt.mjs` - Read current prompt from Supabase
- `descargar-system-prompt.mjs` - Download prompt to local file
- `actualizar-system-prompt-v*.mjs` - Versioned update scripts (latest: **v27.2** — modulacion_registro, 24 May 2026)
- `actualizar-fragmentos-master-v25.7.mjs` - Re-fragmenta WHY_01/WHY_02/EAM_01 con embeddings Voyage AI (genérico — lee del arsenal vivo, válido para cualquier vXX.Y subsiguiente)

**Knowledge Base Deployment**:
- `deploy-arsenal-inicial.mjs` - Deploy arsenal_inicial to Supabase
- `deploy-arsenal-avanzado.mjs` - Deploy arsenal_avanzado to Supabase
- `deploy-arsenal-12-niveles.mjs` - Deploy 12-level challenge arsenal
- `deploy-arsenal-reto.mjs` - Deploy arsenal_reto to Supabase
- `deploy-arsenal-compensacion.mjs` - Deploy arsenal_compensacion to Supabase
- `actualizar-catalogo-productos.mjs` - Update product catalog
- `verificar-arsenal-supabase.mjs` - Verify current version in DB
- `descargar-arsenales-supabase.mjs` - Download arsenales from Supabase

**Embeddings** (Voyage AI):
- `fragmentar-arsenales-voyage.mjs` - Fragment arsenales into individual chunks with embeddings
- `actualizar-fragmentos-modificados.mjs` - Update only changed fragments (faster than full regeneration — use after editing individual responses)
- `purgar-fragmentos-duplicados.mjs` - Remove duplicate fragments from `nexus_documents`
- `refragmentar-3-arsenales.mjs` - Refragment specific arsenales (arsenal_inicial, arsenal_avanzado, arsenal_compensacion)
- `regenerar-12-niveles-fragments.mjs` - Regenerate 12-level challenge embeddings
- `generar-embeddings-voyage.mjs` - Generate embeddings for new documents
- `regenerar-embeddings-voyage.mjs` - Regenerate all embeddings
- `audit-completo.mjs` - Full system audit: counts fragments per arsenal, detects orphans and missing embeddings

**Database**:
- `verificar-esquema-completo.mjs` - Verify complete database schema
- `diagnostico-seguridad-supabase.sql` - Check RLS status on all tables
- `fix-rls-seguridad-supabase.sql` - Enable RLS and create policies

**Testing & Utilities**:
- `test-contador-cupos.mjs` - Test founder counter (15 scenarios)
- `test-flow-reto-completo.mjs` - End-to-end test of reto-5-dias funnel flow
- `validar-funnel-simple.mjs` - Validate funnel leads schema
- `validar-schema-funnel-leads.mjs` - Full schema validation for funnel_leads table
- `diagnostico-funnel-leads.mjs` - Diagnose funnel leads data issues
- `actualizar-fechas-prelanzamiento.mjs` - Update pre-launch dates

**Video**:
- `optimize-video.sh` - Optimize to multiple resolutions (requires FFmpeg)
- `upload-to-blob.mjs` - Upload to Vercel Blob
- `generate_lut.py` - Genera `naval_style.cube` — 3D LUT estilo Naval/Dan Koe (temperatura + contraste + blacks)
- `davinci_naval.py` - Automatización DaVinci Resolve: importa video, aplica LUT, exporta 1080p + 720p + poster
- `naval_style.cube` - LUT 3D generado (33×33×33). Re-generar con `generate_lut.py` si se borra
- `dankoe-video/process_video.py` - **Fase 1**: elimina fondo (rembg + BiRefNet + CoreML M1), compone sobre negro cinematográfico con gradiente radial y color grading moody. Salida 1080×1920 (9:16). Uso: `cd scripts/dankoe-video && .venv/bin/python process_video.py [input/archivo.mp4]`
- `dankoe-video/add_subtitles.py` - **Fase 2**: subtítulos kinéticos word-by-word estilo Dan Koe. faster-whisper transcribe con timestamps por palabra → agrupa en chunks de 2 palabras → genera ASS → FFmpeg quema captions (amarillo mostaza `#D4A017`, Georgia Bold 88px, fade-in 80ms). Uso: `.venv/bin/python add_subtitles.py [output/video_dankoe.mp4] [idioma]`. Setup: `python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt` (BiRefNet ~973MB primera vez → `~/.u2net/`; Whisper descarga modelo `base` ~145MB → `~/.cache/`)

**PWA**:
- `generate-favicons.mjs` - Generate PNG icons from favicon.svg (requires sharp)

**Note**: Most scripts require `.env.local` variables. Run `ls scripts/` for full list.

**SEO & Analytics**:
- `gsc-extractor.mjs` - Google Search Console data extractor (see Analytics section below)

## Analytics: Google Search Console Integration

### GSC Data Extractor

**Script**: [scripts/gsc-extractor.mjs](scripts/gsc-extractor.mjs)

Automatically extracts performance data from Google Search Console API.

**Setup (one-time)**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create/select project → Enable "Google Search Console API"
3. APIs & Services → Credentials → Create OAuth Client (Desktop app)
4. Download JSON → rename to `gsc-credentials.json` → move to `scripts/`
5. Run: `node scripts/gsc-extractor.mjs`
6. First run opens browser for OAuth authorization

**Output** (saved to `data/gsc/`):
- `queries_FECHA.csv` - Top 1000 keywords
- `pages_FECHA.csv` - Top 500 pages
- `countries_FECHA.csv` - Traffic by country
- `devices_FECHA.csv` - Traffic by device
- `REPORTE_GSC_FECHA.md` - Full analysis with Quick Wins

**Quick Wins**: Queries in position 5-20 with high impressions = opportunities to optimize and reach top 3.

**Google Account**: luiscabrejo7@gmail.com (owner of GSC for creatuactivo.com)

## Marketing Strategy & Research Prompts

### Two-Pronged Content Strategy (Enero 2026)

The marketing strategy separates **TRAFFIC** (content) from **CONVERSION** (funnels):

```
[NAVAL RAVIKANT - TRÁFICO]        [RUSSELL BRUNSON - CONVERSIÓN]
30 videos de valor puro      →    Squeeze Page /auditoria-patrimonial
         ↓                               ↓
"¿Cómo lo hago?"             →    Soap Opera Emails (5)
         ↓                               ↓
CTA sutil a CreaTuActivo     →    Auditoría Patrimonial (5 videos)
                                         ↓
                                   Webinar (Perfect Webinar)
                                         ↓
                                   Oferta Fundador/Constructor
```

### Research Prompts (for AI agents)

**Location**: Root directory

| Prompt File | Purpose | Entregables |
|-------------|---------|-------------|
| [PROMPT_INVESTIGACION_NAVAL_CONTENIDO.md](PROMPT_INVESTIGACION_NAVAL_CONTENIDO.md) | Content strategy (TRAFFIC) | 30 video scripts, hooks, tone guide |
| [PROMPT_INVESTIGACION_BRUNSON_FUNNELS.md](PROMPT_INVESTIGACION_BRUNSON_FUNNELS.md) | Funnel system (CONVERSION) | Emails, webinar script, challenge videos |

These prompts can be used with any AI research agent (Gemini, Manus, Claude, etc.)

### Key Marketing Constraints

Vocabulario completo (aprobado + prohibido) → ver tabla canónica en sección **[Queswa Vocabulary — Tabla Canónica Unificada](#queswa-vocabulary--tabla-canónica-unificada)** abajo.

**Términos adicionales para positioning de tráfico orgánico** (TRAFFIC, no funnel de venta):
- ✅ Arquitectura de Activos · Soberanía financiera · Cartera de activos · Distribución global
- ✅ El plan por defecto (el villano universal cross-arsenal)

### Queswa Voice — Híbrido Contextual de 3 Niveles (v5.4, 24 May 2026)

Doctrina conversacional para resolver disonancia "¿acaso él no es Queswa?" cuando el agente habla con el usuario. **Regla unificada**:

- **Nivel 1 — Aforismos canónicos** → **tercera persona** ("Queswa explica", "Queswa escala"). Son frases-marca; cambiarlas rompe su fuerza retórica. Ejemplos: *"Usted no explica — Queswa explica"*, *"Usted no enseña; Queswa escala. Usted crece"*.
- **Nivel 2 — Sustantivos/componentes con nombre propio** → **tercera persona** ("Centro de Mando Queswa", "queswa.app", "Academia Queswa", "plataforma Queswa", "Pilar 2 (Queswa)" en referencias arquitectónicas). Son nombres propios del ecosistema.
- **Nivel 3 — Acciones del agente AHORA en la conversación** → **primera persona** ("yo proceso", "yo asumo", "yo opero", "Me encargo"). El agente conversacional ES el avatar del ecosistema completo; al describir lo que hace ahora, habla como ente coherente.

**Por qué importa**: cuando Queswa dice "Queswa filtra los perfiles" en chat directo, el usuario procesa dos identidades en paralelo (el "yo" implícito que escribe + el "Queswa" del que se habla) → fricción cognitiva. La regla híbrida elimina esa fricción donde más se siente sin perder los aforismos como marca verbal.

**Casos límite**: Construcciones tipo "el Pilar 2 (Queswa) asume X" se PRESERVAN en tercera persona porque "Queswa" funciona como apostillo nombrando al Pilar dentro de la doctrina de los Tres Pilares. Cambiarlas a primera persona rompe la arquitectura canónica.

### Queswa Vocabulary — Tabla Canónica Unificada

**Regla de oro**: Todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido. Esta sección es la **única fuente de verdad** sobre vocabulario aprobado y prohibido — versiones consolidadas Feb 2026 (Jobs-Style) + Abr 2026 (Lujo Clínico) + May 2026 (v5.2 cierre simplificado + v5.4 híbrido contextual).

#### Vocabulario APROBADO (doctrina canónica)

| Término | Uso | Razón |
|---------|-----|-------|
| **Tres Pilares** | Arquitectura del sistema — NUNCA "capas" ni "Máquina Híbrida" | Doctrina v26.0 |
| **Pilar 1 — La Matriz Física** | Gano Excel + músculo logístico | — |
| **Pilar 2 — Queswa, su Centro de Mando** | Plataforma IA propietaria | — |
| **Pilar 3 — La Metodología Automatizada** | El Tridente EAM (no "Su Rol") | Recategorización v26.5 |
| **Arquitecto de Patrimonio** | Rol del usuario — director de los 3 pilares, NO uno de ellos | — |
| **Base Operativa** | Activo del Arquitecto (reemplaza "Unidad de Suministro" / "Nodo Logístico") | Retirados 15 May 2026 |
| **Tridente EAM** | Comando Expandir · Comando Activar · Comando Maestría | v26.2 — "Comandos" no "Protocolos" |
| **Déficit Estructural de Ingresos** | El villano sistémico (causa raíz, no consecuencia) | v26.6 — jerarquía causal |
| **Monetización de Doble Velocidad** | Capitalización Inmediata (GEN5) + Renta Vitalicia (Binario) | v26.2 |
| **Estructura Patrimonial** | Sustantivo doctrinal — reemplaza "Patrimonio Paralelo" | v26.3 — Glosario v1.4 |
| **El Tridente EAM** | Reemplaza "Framework IAA" (eliminado) | v19.6 |
| **90% automatizado** | NO usar "80% automatizado" | Doctrina actual |
| **70 países** | Gano Excel presencia global — NO usar 60 | Oficial |
| **15 países operativos** | CreaTuActivo cobertura geográfica — NO confundir con 70 | v6.4 compensación |
| **Cupos Fundadores: 15** | Base fundacional inicial | — |
| **Acueducto / Alquiler vs. Propiedad / Ferrari gratis / Waze / Faro** | Metáforas universales aprobadas | Jobs-Style Feb 2026 |

#### Vocabulario PROHIBIDO (no usar bajo ninguna circunstancia)

| Prohibido | Reemplazar con | Razón de prohibición |
|-----------|---------------|---------------------|
| Hardware / Software | El Músculo / El Cerebro | Jerga técnica |
| Protocolo de Simulación | Auditoría Patrimonial | Test abuela falla |
| Cupo de Validación | acceso gratuito | Test abuela falla |
| Módulos Estratégicos | Videos de instrucción | Test abuela falla |
| Iniciar Simulación / Iniciar Protocolo | Toca el botón para comenzar | Test abuela falla |
| Despliegue | Acceso / Activación | Jerga técnica |
| Nodo de distribución | Base Operativa | Eufemismo opaco |
| Ancho de Banda Mental | (solo permitido en RETO_05) | Contexto específico únicamente |
| Pipeline / Embudo | Tubería / Canal | Jerga tech |
| Asignación de Capital para la Activación de Infraestructura | Selección del nivel de inventario / capital se convierte en productos físicos | v5.2 (May 2026) — opacidad en cierre |
| Apalancamiento Asimétrico / Apalancamiento Estratégico Máximo | Apalancamiento estratégico (a secas, sin "asimétrico/máximo") | v26.4 — fricción nivel 5/5 Wall Street |
| Tecnología nutricional | Productos físicos / bebidas enriquecidas y suplementos Gano Excel | v5.2 (May 2026) — opacidad |
| Su arquitectura actual (en preguntas de cierre/seguimiento) | Su modelo de ingresos / Su Estructura Patrimonial | v5.3 (24 May 2026) — claridad para avatar de primera visita |
| 100% / íntegramente (al describir transferencia de capital a productos) | Su capital se transfiere a productos físicos (sin cuantificador absoluto) | v5.3 — México tiene cobros pequeños de afiliación (~$10 USD); afirmar 100% es factualmente impreciso y auditable |
| "No existen cuotas de inscripción ni cobros por afiliación" | (omitir esta frase) | v5.3 — falsa en México |
| Tabla Binario con columna "Cálculo CV × % × $1" | Tabla Binario simplificada (Paquete + Rentabilidad %) | v5.3 — la fórmula técnica añade fricción al prospecto que recién entiende Base Operativa. Solo servirla si el usuario pregunta explícitamente "¿cómo se calcula?" |
| plusvalía (estructural / del posicionamiento / de su Base Operativa) | ventaja estructural / ventaja del posicionamiento / valor patrimonial | v5.4 — término inmobiliario opaco; "ventaja" o "valor patrimonial" comunican mejor |
| ancho de banda (en preguntas de seguimiento, contextos de tiempo/agenda) | disponibilidad / agenda directiva / agenda ejecutiva | v5.4 — jerga tech; "disponibilidad" o "agenda" son universales |
| vector de tráfico / vector de adquisición | camino de expansión / ruta / canal | v5.4 — jerga militar; absorbido en reescritura FREQ_02 |
| Modo Relacional / Modo Híbrido / Modo de Escalabilidad (los 3 modos de tráfico de FREQ_02) | Conexión Directa / Conexión Asistida / Conexión Automatizada | v5.4 — los nuevos nombres son auto-explicativos (cada uno indica QUÉ hace) |
| global (cuando refiere al activo del usuario: "consumo global", "Base Operativa global") | internacional | v5.4 — el usuario opera en 15 países América, no en todo el mundo. "Global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público del 1 de junio |
| Auditoría de acoplamiento | (eliminado) | Klaff Prize Frame zombi |
| 7-10 horas semanales (entrevista BANT) | (eliminado) | Opción B colapsó Estado 1 |
| Tracción | dirección asimétrica / gobernanza | Wall Street/Anglo |
| Ancho de banda operativo | disponibilidad real para la dirección | Jerga tech |
| Máquina Híbrida | Base Operativa / los tres pilares | v26.0 |
| Capas (arquitectura de negocio) | Pilares | Doctrina |
| Unidad de Suministro / Nodo Logístico | Base Operativa | Retirados 15 May 2026 |
| Gobernanza estratégica/de activos | dirección estratégica/dirigir activo | v26.4 — fricción nivel 5/5 corporativo |
| Actualización de software financiero | instalación de Estructura Patrimonial en paralelo | v26.4 — sesgo WEIRD/tech-noir |
| Perseguir, convencer | (eliminar) | Plantar objeciones inexistentes |
| Multinacional (contexto MLM) | (evitar) | Asociación negativa |
| Pasivo | recurrente | — |
| Libertad financiera, ingreso pasivo, reclutamiento | (eliminar) | Filtra como MLM |
| Esposas de Oro / Trampa Operativa / Creador de Ingreso Lineal | (eliminado) | Atacaban identidad del prospecto |
| Sé tu propio jefe / Trabaja desde casa | (eliminar) | Filtra como MLM |
| Oportunidad de negocio | (eliminar) | Filtra como MLM |
| "Haz una lista de 100" | (eliminar — contexto: viejo MLM) | — |
| La salida es / Escape de / Sal del | (eliminar) | MLM tradicional colombiano |
| NO es reemplazo. NO es escape. | (eliminar — describir qué ES) | v26.3 |
| Tu Rol (El Director) como tercer elemento plano | METODOLOGÍA (Ejecución Exacta) | v19.6 |
| PII hardcodeada en arsenales | (nunca) | Seguridad |

**Cierre v5.2 (May 2026) — frase canónica única**: cuando el prospecto pregunta cómo se inicia, Queswa entrega FREQ_03 (los 3 niveles ESP + pregunta de selección) en `<verbatim_lock>`. Sin entrevista BANT, sin "equipo de Dirección Estratégica", sin "Asignación de Capital". El FSM avanza a Estado 3 (nombre) → Estado 4 (warm handoff automático).

## Luis Cabrejo's Real Story (Epiphany Bridge)

**Master Document**: [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Use this for all storytelling.

**Key Quote**: "La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."

| Duration | Use Case |
|----------|----------|
| 60 seconds | Reels, TikTok, Squeeze Page |
| 3 minutes | Bridge Page (`/auditoria-confirmada`) |
| 7 minutes | Webinar, Presentations |

### Two Different Audiences

| Audience | Villain | Page |
|----------|---------|------|
| **8,000 personal contacts** (friends, family, ex-Gano) | Plan por defecto | /auditoria-patrimonial, /fundadores |
| **Traditional networkers** (know MLM) | "Haz una lista de 100" | /socios |

**Content Style**: Naval Ravikant - philosophical, value-first, no direct selling. Reference: "The Almanack of Naval Ravikant".
