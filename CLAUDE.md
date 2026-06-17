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
| Update creatuactivo.com prompt | `node scripts/actualizar-system-prompt-v27.2.mjs` (despliega **v28.4 "multiplicacion_sin_filtrar"** — el archivo conserva el nombre legacy `v27.2`) |
| Re-fragmentar arsenal tras editar (genérico) | Patrón purgar + `node scripts/fragmentar-arsenales-voyage.mjs` (ver [Updating Queswa Knowledge](#updating-queswa-knowledge)) |
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
2. **ACTIVACIÓN** - Queswa AI conversa y reconoce a quien levantó la mano (NO "filtra" — ver léxico prohibido); constructor cierra con los listos
3. **MULTIPLICACIÓN** - El 3er Comando (renombrado desde "Maestría" jun 2026, ver [[project_rename_maestria_multiplicacion]]). Multiplicar la empresa digital está a un clic en todo el continente — resuelve el cuello de botella de crecer que atasca a cualquier negocio tradicional. Queswa forma a cada persona nueva (la formación/Academia queda como medio, NO como gancho — "crecimiento personal" en la encuesta = inseguridad, no deseo real)

**Rol del héroe — DIRECCIÓN EJECUTIVA** (elevado en v19.6, Mar 2026):
- La labor del constructor es **puramente gerencial**: suministra la "materia prima" (tráfico) al ecosistema
- La tecnología hace la ejecución técnica; el constructor toma las decisiones de expansión
- **Lenguaje aprobado**: "Director de Expansión", "Dirección Ejecutiva", "orquesta los comandos"
- **Lenguaje prohibido**: "Tu Rol (El Director)" como tercer elemento plano — debe estar bajo METODOLOGÍA (Ejecución Exacta)
- En toda respuesta que explique la Máquina Híbrida, el tercer elemento es METODOLOGÍA, no un rol de ejecución

**Respuesta canónica WHY_02** — ver `knowledge_base/arsenal_inicial.txt` (fragmento WHY_02). Los tres pilares canónicos son: **Pilar 1 — La Matriz Física** (Gano Excel / músculo logístico) · **Pilar 2 — Queswa, su Centro de Mando** (plataforma IA propietaria) · **Pilar 3 — La Metodología Automatizada** (El Tridente EAM: protocolo de ejecución estandarizado que erradica el ensayo y error). El **rol del usuario** es **Arquitecto de Patrimonio** — dirige los tres pilares, NO es uno de ellos. Recategorización aplicada en v26.5 (May 2026): el Arquitecto queda elevado como director; el tercer pilar es un componente entregado por el sistema, no el rol del receptor. Nunca "capas" ni "Máquina Híbrida" — siempre "pilares" y "Base Operativa". ⚠️ **Nota (jun 2026):** WHY_02 **ya está migrado** al léxico accesible (Pilar 1 → *El Respaldo Operativo* · Pilar 3 → *El Método Comprobado* · rol → *Propietario de Base Operativa* · *ingresos recurrentes*) en `arsenal_inicial.txt` + `respuestas-maestras.ts`. Los nombres de arriba son el canon histórico previo a la migración — ver Queswa Vocabulary.

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
- ✅ Arsenal inicial clonado al tenant `whatsapp` — 48 fragmentos RAG + doc maestro en `nexus_documents` (re-clonado 12 jun 2026 con léxico v5.9 "empresa digital"; los clones previos habían desaparecido — re-clonar con `clonar-arsenal-whatsapp.mjs` tras cada re-fragmentación de arsenal_inicial)
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
1. **Fragmented Vector Search** (v14.9) — 8 arsenales con Voyage AI embeddings (95% token reduction, **179 fragments en Supabase**):

| Arsenal | Tenant | Versión actual | Contenido |
|---------|--------|----------------|-----------|
| `arsenal_inicial` | creatuactivo_marketing | **v5.12** (17 jun 2026) | **v5.12** = (1) **EAM_01 versión simple** (3 pasos Expandir/Activar/Multiplicación, Activar=conversión, sin lista "no requiere"/Protocolo de Validación, acompañamiento Queswa+humano), (2) **"filtrar" desterrado** → conversar/acompañar/reconocer quién está listo, (3) **3er Comando Maestría → Multiplicación**. WHY_02 + EAM_01 re-sincronizados carácter por carácter con `respuestas-maestras.ts`. Previa **v5.11 = villano "años y salud"** — WHY_01 + WHY_02 reemplazan «asfixia mensual» y el escenario ausencia/«bienes del banco» por un sistema diseñado para tomar sus mejores años y su salud. **v5.10** (12 jun 2026) = villano narrado sin atacar el esfuerzo. **v5.9 = swap quirúrgico "empresa digital"** (el activo que entregamos; concordancias de género corregidas; se conserva "negocio" en el chip canónico + negocio actual del prospecto). Previo **v5.8 = swap léxico "negocio digital"** (`HANDOFF_AGENTE_LEXICO_ARSENALES.md`): Base Operativa→**negocio digital** (a secas, NO "de Gano Excel") · rol→**Propietario** · operar→trabajar/dirigir · escalar→**multiplicar** · CTA_01 "Iniciar Auditoría"→**"Iniciar Diagnóstico"** + "el Diagnóstico de 5 Días". WHY_02 sincronizado con `respuestas-maestras.ts`. — WHY, STORY, VS, PERFIL, FREQ, CRED, OBJ, VOICE, EAM, CIERRE + DIASPORA. **48 fragments** (49 respuestas en .txt — FREQ_04_PUENTE no se fragmenta por el sufijo `_PUENTE`; su contenido vive en el doc padre). **v5.7 = Migración al registro accesible (Beto)**: villano narrado, autopersuasión, test Beto, giro de delegación Jim Rohn, "gente"→"las personas/el mercado", preguntas de seguimiento abiertas (eliminadas las cerradas con jerga "¿audita usted la diferencia matemática…?"). STORY_01 = historia real del fundador. DIÁSPORA corregida (país natal con/sin oficina Gano). v5.5–v5.6.1 (previas) introdujeron FREQ_20–26 (VIP/GCV/tasa Gano/back office). |
| `arsenal_avanzado` | creatuactivo_marketing | **v12.3** (17 jun 2026) | **v12.3** = "filtrar" desterrado (5 hits → conversar/acompañar/reconocer) + 3er Comando Maestría → Multiplicación (Comando Multiplicación reescrito: formación enlaza con multiplicación 1·2·4·8). Cifras intactas. Previo **v12.2 = swap "empresa digital"** (cifras intactas). Previo **v12.1 = swap léxico "negocio digital"** (Base Operativa→negocio digital · "Operando en el nivel"→"En el nivel" · aforismo "Queswa escala"→"Queswa multiplica" · "Calibre ESP-3"→"nivel ESP-3"). Cifras intactas. — Objeciones complejas, sistema, valor, escalación (18 fragments). **v12.0 = Migración al registro accesible (Beto)**: léxico canónico→accesible, "Capas"→"respaldos independientes" (ADV_TECH_03), "calibre"→"nivel", GCV correcto ("17% compensado sobre el volumen comisionable", "hasta 15/17% del GCV"), 50 PV como compra personal mínima, ADV_SIST_03 reescrito con técnica Mario Puig (analogía director de orquesta). Cifras del plan intactas. Aforismos canónicos preservados (Activar suavizado: "revisa y da el sí"). |
| `arsenal_reto` | creatuactivo_marketing | **v4.7** (12 jun 2026 — swap "empresa digital"; jerga clínica intacta) | Producto funnel "El Diagnóstico de 5 Días" (7 fragments para días 1-5). **v4.6 = solo swap de marca** Base Operativa→negocio digital + "WhatsApp operará"→"funcionará". ⚠️ La **jerga clínica profunda se conserva a propósito** (Déficit Estructural, Re-Arquitectura, Acoplamiento Híbrido, "Ancho de Banda Mental" — esta última **permitida explícitamente en RETO_05**) — ver [[project_reto_12niveles_no_migrar]]. Migración profunda + rename del producto = pase cross-channel pendiente. |
| `arsenal_compensacion` | creatuactivo_marketing | **v7.2** (12 jun 2026 — swap "empresa digital", cifras/GCV/PV INTACTOS) | Plan de compensación (**41 fragments**). **v7.1 = swap léxico "negocio digital"** SOLO de marca — **cifras/%/GCV/PV/tasas/nombres del plan INTACTOS** (verificado con git diff); se conservan los "opera" de Gano Excel y "escala por volumen" de la tabla de rangos. v5.5+: añadidas COMP_BIN_11 (cómo liquida Gano las comisiones — GCV explícito, anti-malentendido "17% de $100M = $17M"), COMP_VIP_01 (VIP sin paquete ni compras mensuales obligatorias) y COMP_PV_08 (combinaciones para 50 PV mensuales, portado desde INV_06 vigente 2026). **NO modificar vocabulario ni cifras restantes.** |
| `arsenal_12_niveles` | creatuactivo_marketing | — | Desafío de 12 niveles (13 blocks). |
| `catalogo_productos` | creatuactivo_marketing | **v7.2** (22 May 2026) | 22 productos + ciencia (Lujo Clínico). Fragmentado en 25 fragments + doc maestro. PROD_OVERVIEW + BEB_01/LUV_01/SUP_01/PERS_01 con `<verbatim_lock>` para evitar alucinaciones de nombres (Ganotea/Gano Cocoa/Gano Supreme) y omisión de categorías. Bug pendiente: CV/PV en respuestas individuales. |
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
   - **Versión activa: v28.4 "multiplicacion_sin_filtrar"** (17 jun 2026 — desplegada y verificada con `leer-system-prompt.mjs`): (1) 3er Comando Maestría → Multiplicación (aforística "Queswa multiplica" intacta), (2) "filtrar" desterrado en Pilar 2 → "conversa y acompaña", (3) aforística Activar suavizada a "revisa y da el sí". Previa: v28.3 "villano_anos_salud" (13 jun 2026 — villano = un sistema que toma sus mejores años y su salud; se retiran los frames de ausencia futura y de falta de patrimonio). v28.2 "villano_narrado" (12 jun 2026) — el diagnóstico narra el sistema de asfixia en vez de etiquetar "depende de su presencia", aforismo "Queswa multiplica", recategorización "punto ciego". v28.1 "empresa_digital" (12 jun 2026) — swap quirúrgico "negocio digital" → "empresa digital" para el activo que entregamos, decisión Luis alineada con Home v13.6. v28.0 "negocio_digital" (jun 2026) — Migración léxico "negocio digital" + Ola 2 de redundancia. (1) **Léxico**: "Base Operativa" → negocio digital; "Propietario de Base Operativa" → Propietario; "soberanía financiera" → tranquilidad/estabilidad; "arquitectura patrimonial" → modelo de ingresos; nuevas reglas **operar/operador** + auto-referencia **esto/eso**; "escalar" → "multiplicar". (2) **Consolidación de redundancia**: ~30 secciones → ~15, **sin cambios de comportamiento** (bloqueos compensación/dashboard/KYC/verbatim_lock intactos). ⚠️ **El archivo fuente conserva el nombre legacy `system-prompt-nexus-main-v27_2.md`** — la versión interna es v28.0 (no se renombró el archivo).
   - **Versión previa: v27.2 "modulacion_registro"** (24 May 2026) — Ola 2 doctrinal. Formaliza Modulación de Registro v5.5 (analogía Mario Alonso Puig: autoridad técnica + accesibilidad humana). Incluía: sección MODULACIÓN DE REGISTRO, VECTORES DE CIERRE en 2 bancos, REGLA ANTI-PREÁMBULO, bloqueos DASHBOARD/fórmulas, doctrina 12 VELOCIDADES.
   - **Historial completo v19.x → v27.2** → [knowledge_base/CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md)
   - Archivo fuente actual: `knowledge_base/system-prompt-nexus-main-v27_2.md`. Versiones anteriores eliminadas — el historial vive en git + [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md). Si necesita una versión histórica: `git show <hash>:knowledge_base/system-prompt-nexus-main-vXX_Y.md`
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** en `route.ts` — actualizar en Supabase. Fallback alineado a v26.5.
   - Verificar versión activa: `node scripts/leer-system-prompt.mjs` (no asumir que local = Supabase)
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente.
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `public/investigaciones/HANDOFF-QUESWA-PRECIOS-CVPV.md`.

**Camino A — Backend Dictador para chip-triggers (May 2026)**:

Las 2 chips canónicas que concentran el ~80% del tráfico inicial (Chip 1 → WHY_02 "¿Cómo funciona el modelo de negocio?" y Chip 2 → EAM_01 "¿Cuál es la metodología? ¿Qué hago yo en el día a día?") se sirven desde [src/lib/respuestas-maestras.ts](src/lib/respuestas-maestras.ts) **antes** del Voyage AI + Anthropic. El bypass en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) detecta match exacto sobre `trim().toLowerCase()` contra `QUESWA_QUICK_REPLIES` y, si coincide, construye un `ReadableStream` con la respuesta Master del Director Académico y retorna `StreamingTextResponse` directamente.

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
- **Quick Reply Chips** (solo `creatuactivo.com`, NO en `queswa.app`): 4 chips en estado inicial (antes de que el usuario escriba). Llaman `handleSendMessage()` directamente. Eliminan el "área muerta" móvil y bajan la barrera de articulación. Fuente de verdad: `QUESWA_QUICK_REPLIES` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts) — son las **4 preguntas reales del avatar** (jun 2026, léxico accesible sin jerga McKinsey): `¿Cómo funciona el modelo de negocio?` · `¿Cuál es la metodología? ¿Qué hago yo en el día a día?` · `¿Cuáles son los productos y para qué sirven?` · `Quiero ver los números: ¿cómo y cuánto se gana?`. Los chips 1 y 2 disparan **Camino A** (bypass backend dictador, [respuestas-maestras.ts](src/lib/respuestas-maestras.ts)) → su texto exacto es key; cambiar el texto exige sincronizar la key allí + el mapa `QUESWA_QUICK_REPLIES_EXPANSION`.
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
| `/api/track/engagement` | Edge | — | Reel engagement tracker — merge **sin retroceder** (`Math.max` numéricos / OR lógico bools) sobre `device_info` vía `update_prospect_data`; dispara webhook Supabase → push en queswa.app. Campos = contrato cerrado con el Dashboard (ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)) |
| `/api/email-open` | Node | — | Email open pixel tracker |
| `/api/logo-email` | Edge | — | Logo dinámico (Quiet Luxury) renderizado para emails |
| `/api/webhooks/prospect-capture` | Node | — | Webhook Supabase → captura prospectos desde triggers externos |
| `/api/whatsapp/webhook` | Node | 30s | WABA inbound — adaptador de canal WhatsApp → motor `/api/nexus` (ver [Estado integración WABA](#1-nexus-ai-chatbot)) |
| `/api/test-resend`, `/api/test-reto-email` | Node | — | Dev/debug only (not for production use) |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails   → 0 14 * * *  (9:00 AM UTC-5 Colombia)
/api/cron/reto-5-dias      → 0 13 * * *  (8:00 AM UTC-5 Colombia)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

**Secuencia Auditoría Patrimonial** (`/api/cron/reto-5-dias` — `RETO_5_DIAS_SEQUENCE`):
| Día | Subject | Componente | URL destino |
|-----|---------|-----------|-------------|
| 1 | `[COORDENADA 01] Diagnóstico Estructural Habilitado` | `Dia1Diagnostico` | `/empresa-digital/dia-1` |
| 2 | `[COORDENADA 02] El Techo Técnico (Análisis de Escalabilidad)` | `Dia2Vehiculos` | `/empresa-digital/dia-2` |
| 3 | `[COORDENADA 03] Acoplamiento Híbrido (La Máquina Operativa)` | `Dia3Modelo` | `/empresa-digital/dia-3` |
| 4 | `[COORDENADA 04] La Matriz de Amortización (Ingeniería de Liquidez)` | `Dia4Estigma` | `/empresa-digital/dia-4` |
| 5 | `[COORDENADA 05] Protocolo de Activación (Decisión Directiva)` | `Dia5Invitacion` | `/empresa-digital/dia-5` |

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
Tráfico Frío (Ads/Redes) → /empresa-digital (Squeeze Page — ENTRY v4.0 activo)
                              ↓
                         /auditoria-confirmada (Bridge Page)
                              ↓
                         Email Secuencia 5 Días — Auditoría Patrimonial (Nurture)
                         5 videos: /empresa-digital/dia-1 … dia-5
                              ↓
                         /fundadores (Oferta)

Tráfico SEO (Blog) → /blog/* (Shadow Funnel)
                              ↓
                         /empresa-digital o /fundadores

Nota: /reto-5-dias/* y /mapa-de-salida/* siguen activos como legacy (301 → v4.0)
```

> 🔤 **NAMING DEL FUNNEL EN TRANSICIÓN (jun 2026) — leer antes de editar copy del funnel.** El producto de entrada se está renombrando **"Auditoría (de Arquitectura) Patrimonial" → "El Diagnóstico de 5 Días"** (investigación `public/investigaciones/Léxico CreaTuActivo_ Comprensión y Duplicabilidad.md`: "patrimonial/auditoría" = Fricción Muy Alta para tráfico frío). **YA HECHO y desplegado:** (1) cuerpo de las páginas squeeze `auditoria-patrimonial` + bridge `auditoria-confirmada` reescrito al **registro accesible** (sin Protocolo/escrutinio/Soberanía/Expediente/sala táctica); (2) **rótulos CTA** "Iniciar Auditoría…" → **"Iniciar el Diagnóstico de 5 Días"** en menú (`StrategicNavigation`), home, deck `/servilleta`, tecnología, planes, 4 blogs, mini-landing `[slug]`; (3) `QUESWA_CTA_LABEL` = **"Iniciar Diagnóstico"** (`queswa-greeting.ts`) + su acople soft (arsenal_inicial CTA_01 + system-prompt L259); (4) `/diagnostico` (quiz) → "Diagnóstico rápido → diagnóstico profundo de 5 días". ✅ **RENAME DE URL HECHO (jun 2026, dos saltos):** `/auditoria-patrimonial` → `/negocio-digital` (jun) → **`/empresa-digital`** (12 jun, swap léxico "empresa digital") — directorio `src/app/empresa-digital/` (squeeze `page.tsx` + `dia-1…5` + `[constructorId]`), con redirects **301** en `next.config.js`: ambas URLs viejas y sus subrutas apuntan DIRECTO a `/empresa-digital` (1 salto), así que correos/blogs/reels ya publicados siguen funcionando. SW bypass incluye `/negocio-digital` (v1.3.0). CTAs vivos (nav, home, calculadora) ya enlazan directo sin pasar por `/mapa-de-salida`. El **diagnóstico de la squeeze** quedó (jun 2026): *«Hoy su ingreso depende de una sola cosa: que usted siga trabajando. Si para —por salud, por un despido, por un imprevisto—, el dinero para con usted»* (ajustes: «cansancio»→«despido», «también para»→«para con usted»). ⚠️ **Se conserva «que usted siga trabajando» a propósito**: aquí el villano es la **dependencia** (su ingreso *depende* de seguir trabajando), no el trabajo en sí — distinto del villano «trabajar más duro» que sí se evita en los reels de nicho. Ver [[feedback_dolor_real_por_nicho]]. ⏳ **Queda por verificar/alinear (no bloquea — los 301 cubren):** **nombres de día** (EL DIAGNÓSTICO · EL TECHO · LA MÁQUINA · LOS NÚMEROS · LA DECISIÓN), migración profunda de `arsenal_reto`, metadata/SEO + prosa de blogs que aún citen la URL/nombre viejos, y el `source: 'auditoria-patrimonial'` de tracking en `empresa-digital/page.tsx:96` (identificador interno — coordinar con backend antes de cambiarlo). ✅ Barrido de consistencia de este CLAUDE.md hecho (jun 2026) — Active Pages, tabla de API Routes y secuencia de correos ya citan `/empresa-digital`. Ver memorias [[project_lexico_negocio_digital]] · [[project_reto_12niveles_no_migrar]].

**Active Pages** (rutas no-obvias — el resto se descubre con `ls src/app/`):

- `empresa-digital/` — 🎯 FUNNEL ENTRY v4.0 (noindex). **Producto = "El Diagnóstico de 5 Días"** (cuerpo en registro accesible). URL `/empresa-digital` — rename desde `/auditoria-patrimonial` **hecho jun 2026** (+ redirects 301). Squeeze page + `[constructorId]/` re-exporta la misma página. `dia-1/` a `dia-5/` cada uno con variante `[ref]/` para distribuidor.
- `auditoria-confirmada/` — Bridge Page v4.0 (noindex). `TrackingConfirmada.tsx` es 'use client' y dispara evento `vio_bridge_auditoria`.
- `reto-5-dias/` — FUNNEL ENTRY v1 (noindex, legacy). Redirect chain: `/reto-5-dias` → `/mapa-de-salida` → `/empresa-digital` (dos saltos 301 en `next.config.js`). Tiene variantes A/B: `dolor/`, `analitico/`, `global/`.
- `mapa-de-salida/` — Página Next.js aún activa (con `[constructorId]/`, `layout.tsx`, `opengraph-image.tsx`). Redirige 301 → `/empresa-digital`. El SW bypass incluye ambas URLs (`/mapa-de-salida` y `/reto-5-dias`) para que los 301 funcionen correctamente.
- `calculadora/` — Calculadora de ingresos (indexada).
- `diagnostico/` — **Landing huérfana standalone para tráfico pagado** (Meta Ads / Google Ads). Quiz de 5 dimensiones (autonomía, resiliencia, eficiencia, apalancamiento, paz mental) que perfila al prospecto en uno de 3 arquetipos (Gigante de Pies de Barro / Operador Agotado / Constructor en Progreso) y lo inyecta al funnel principal vía POST a `/api/funnel` con `step: 'auditoria_registered'` (aliased a `mapa_registered` en route.ts). Cero links internos hacia ella desde el sitio — entrada es solo URL directa desde campañas. Sin `<StrategicNavigation/>` (decisión deliberada: 0 fricción de navegación). API endpoint dedicado: `/api/diagnostico` guarda quiz + arquetipo en tabla `diagnosticos` (Supabase). CTA final → `/empresa-digital` (squeeze del funnel actual).
- `paises/` — Páginas por destino con sub-ruta dinámica `[destino]/` (ej. `brasil/`).
- `[slug]/` — **Mini-landing personal del Arquitecto de Patrimonio** (`creatuactivo.com/luis-cabrejo`). Micro-sitio personalizado con foto, frase y links del constructor. OG dinámico para WhatsApp. Lee de `constructor_slugs` (slug, display_name, foto_url, frase_personal, whatsapp) + `private_users` (affiliation_link, profile_photo_url). ❌ NO es para blog slugs — esos van bajo `/blog/`.
- `[slug]/[destino]/` — **Bifurca** según el segundo segmento: si `[destino]` ∈ `REEL_NICHOS` **renderiza** la página de Reel (`<ReelPage>`); si `[destino] === 'manifiesto'` **renderiza** el Manifiesto de los Fundadores compartible con atribución (URL limpia `/{slug}/manifiesto` — el `ref` se inyecta a `localStorage`, sin `?ref`; OG image dedicado en `/manifiesto/opengraph-image`); si no, ejecuta el **redirect** con tracking. `DESTINO_MAP` en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) resuelve destinos cortos (home, auditoria, calculadora, productos, servilleta, activacion, dia-1..dia-5) a rutas reales con `?ref={constructorId}`. Los slugs de nicho y `manifiesto` no colisionan con `DESTINO_MAP`. Ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp).
- `manifiesto/` — **Página pública del Manifiesto de los Fundadores** (antes `/nosotros` — renombrada Jun 2026 para coherencia con `/{slug}/manifiesto`). Narrativa de posicionamiento (April Dunford/Gemini) + CTA al WhatsApp del arquitecto. `/nosotros` redirige aquí (301). Tiene `opengraph-image.tsx` propio. Rótulo en el menú: **Nosotros**. El cuerpo vive en [`<ManifiestoDocument/>`](src/components/ManifiestoDocument.tsx) (compartido con `/{slug}/manifiesto`); su H1 visible es **NUESTRA FILOSOFÍA** + lema *"Las cosas no pasan. Se hacen pasar."* (Jun 2026 — antes "MEMORÁNDUM DIRECTIVO"). ⚠️ "Manifiesto de los Fundadores" persiste como **nombre del documento** (OG image, texto pre-cargado de WhatsApp, etiquetas de sección §01–08), NO como H1 — es deliberado, no incoherencia.
- `presentacion-empresarial/` — Herramienta interna para 1-on-1, **NO está en el menú público**.
- `infraestructura/` — Implementación de referencia del sistema Bimetallic v3.0. Leer antes de crear nuevas páginas.
- `sistema/productos/catalogo-productos.tsx` — 🚧 WIP ("Clinical Luxury" e-commerce), sin enlazar aún desde `page.tsx`.
- `animaciones/diaX/` — Canvas-based social video renderer (Dan Koe style). Variantes A/B con sufijos `-v3` a `-v6`.
- `servilleta/` — Deck interactivo v6.4 de 4 slides. **Migrado al sistema Lujo Silencioso (15 May 2026)** — usa los mismos tokens que el resto del sitio (`--color-brand`, `--color-bg-elevated`, `--font-sans`, etc.). La paleta industrial previa (steel/safety-orange/cyan eléctrico) fue retirada. Slides 1 y 2 son card-scrollers con **b-rolls 3D** (jun 2026) — ver [Servilleta Digital](#servilleta-digital---interactive-presentations).
- `paquetes/` — Protocolo de Capitalización v3.0. CTAs → WhatsApp pre-filled con nombre+USD+COP.
- `planes/` — 4 planes de suscripción. Sin Framer Motion ni `backdropFilter` (decisión de performance).
- `reto-12-niveles/` — Landing "Los 12 Niveles" (con variante `[ref]/`, layout y OG image propios). `/reto-12-dias` redirige 301 aquí. Contenido servido por `arsenal_12_niveles` — tuteo deliberado, NO migrar a registro accesible.
- `activo-que-sobrevive-a-su-ausencia/` — Deck keynote de conferencia (SER PRO Internacional · Luis Cabrejo). noindex, herramienta interna de presentación en vivo (F = fullscreen, flechas/swipe).
- `offline/` — PWA fallback.

**SEO Strategy** (Dic 2025):
- **Indexed pages**: `/`, `/fundadores`, `/blog/*`, `/tecnologia`, `/sistema/productos`, `/paquetes` (⚠️ `/socios` y `/webinar` fueron eliminadas — commit `6110e9a` "purga global tuteo + eliminar 4 páginas obsoletas")
- **noindex pages** (funnel interno):
  - `/reto-5-dias/*` → Squeeze/Bridge para ADS (v1 — legacy, 301 → v4.0)
  - `/empresa-digital/*` → Squeeze + 5 páginas de video (v4.0 — "El Diagnóstico de 5 Días"; rename desde `/auditoria-patrimonial` jun 2026)
  - `/auditoria-confirmada` → Bridge Page v4.0
  - `/manifiesto` → Manifiesto de los Fundadores (antes `/nosotros`; `/nosotros` redirige 301 aquí)

**Dynamic `[ref]` Routes**: Landing pages support referral tracking via `/page-name/referrer-id`.

**Navigation** ([src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) — array `directLinks`):
- **Desktop/Mobile Menu**: Nosotros (`/manifiesto`) · Tecnología (`/tecnologia`) · Presentación (`/servilleta`) · Insights (`/blog`) + "Auditoría Patrimonial" CTA
- ⚠️ **Los rótulos NO coinciden con sus rutas a propósito** (decisión Jun 2026 — el menú nombra *qué encuentra el visitante*, no la ruta técnica): "Nosotros" abre la página Manifiesto; "Presentación" abre el deck Servilleta. Esto reemplazó "Manifiesto / El Sistema / Herramientas" (rótulos con fricción o ambiguos).
- **Mobile CTA**: "Unirme al Reto" → /empresa-digital
- **Removed from menu**: Soluciones, Ecosistema, Auditoría
- **Presentación Empresarial**: `/presentacion-empresarial` sigue siendo herramienta interna 1-on-1, fuera del menú. ⚠️ NO confundir con el item público "Presentación" → `/servilleta`

### Servilleta Digital - Interactive Presentations

Sales presentation tools for 1-on-1 conversations. **Desde 15 May 2026 usa el mismo sistema de diseño Lujo Silencioso del sitio principal** (no más "Industrial Realism" / paleta steel-orange). La servilleta hereda tokens semánticos via las variables locales `--bg-dark`, `--concrete`, `--steel`, `--orange` que ahora apuntan a tokens globales (`--color-bg-primary`, `--color-bg-elevated`, `--color-titanium-dark`, `--color-brand`).

| Version | Route | Style |
|---------|-------|-------|
| v6.4 (Main) | `/servilleta` | 4-slide deck; **slides 1 y 2 son card-scrollers con b-rolls 3D** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)); fullscreen (F key), keyboard nav, swipe |
| v6.4 (Ref) | `/servilleta/[constructorId]` | Re-exports main page; constructorId read from URL path client-side for tracking |

**Controls**: Arrow keys/Space (next slide), F (fullscreen), double-click (fullscreen), swipe (mobile)
**Typography**: `var(--font-sans)` Inter (headings) + `var(--font-mono)` Roboto Mono (data) — unificado con homepage
**Color Palette**: Lujo Silencioso — hereda los tokens del [Design System](#design-system-bimetallic-v30) (Carbón + Dorado Champán + Titanio) + Cyan `#22D3EE` como único acento de data exclusivo de la servilleta

#### Contenido y copy — fuente de verdad

⚠️ **El copy verbatim de las 4 slides NO se duplica aquí** (se desincronizaba con cada recalibración). Fuentes vivas:
- **Copy renderizado de las slides** (nav, H1/H2, CTAs, `getLifestyleTranslation`, etc.) → [src/app/servilleta/page.tsx](src/app/servilleta/page.tsx) (deck v6.4).
- **Narración / teleprompter aprobada** → [guion_maestro_servilleta_v3.md](public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md) + su variante `_TELEPROMPTER.md`.

Estructura de las 4 slides: **01 SU EMPRESA · 02 METODOLOGÍA (EAM) · 03 EL PRODUCTO · 04 SIMULADOR** (el rótulo de slide 1 era "LA MÁQUINA" hasta jun 2026). Slides 1 y 2 son **card-scrollers** de 3 cards con b-rolls 3D + nombre (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)): slide 1 = los **3 pilares** (El Respaldo Operativo · Queswa, su Centro de Mando · El Método Comprobado), slide 2 = el **Método** en 3 comandos (EXPANDIR · ACTIVAR · MULTIPLICACIÓN — 3er comando renombrado desde "Maestría" jun 2026; el nombre visible lo pone el `<h3>` HTML, **no el video** → un cambio de léxico NO requiere re-render. El asset `maestria.mp4` y la comp `Maestria3D` son nombres internos, no user-facing, y se conservan). El botón "PREGÚNTALE ALGO EN VIVO" en card-1 de slide 2 dispara `open-queswa` CustomEvent.

⚠️ **Léxico**: el deck v6.2 ya está migrado al registro accesible. El copy "Abr 2026" que vivía aquí (PATRIMONIO PARALELO, Base Operativa, UNIDAD DE SUMINISTRO, "tecnología nutricional") es **léxico retirado** — no reintroducir (ver [Queswa Vocabulary](#queswa-vocabulary--tabla-canónica-unificada)).

#### Arquitectura Mobile (Abr 2026 — no revertir)

**Slides 1 y 2**: Grid de 3 tarjetas (`.card-industrial`). **Desde jun 2026 el fondo es un `<video>` 3D full-bleed** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)), no una imagen split:
- `.card-bg` aloja el `<video>` con **`object-fit: contain` + fondo carbón** → muestra el objeto 3D completo sin recorte (el letterbox es invisible: el clip ya es carbón `#0F1115`). **NO** revertir a `object-fit: cover` ni al split `height: 50%` (recortaba el 3D)
- `.card-content`: overlay absoluto al pie con degradado — solo el **nombre** (slide 1) o nombre + botón Queswa (slide 2 card-1). Sin párrafos ni tachados (name-only)
- Cards inactivas: `filter: brightness(0.45)` → activa: `brightness(1)`; borde activo/hover **dorado** (`var(--orange)`, no cyan)
- `one-card-mode` generalizado de `#slide-2` a `.one-card-mode` (CSS) → aplica a slide 1 y 2; ambas comparten `activeCardIndex` (3 cards c/u)
- ⚠️ **Bug del salto resuelto (jun 2026):** `showSlide()` y los handlers de swipe/teclado/click resetean `activeCardIndex` a 0 **en el mismo batch** del cambio de slide. Sin esto, al pasar de slide 1 (en card 3) a slide 2 el IntersectionObserver fijaba la card 3 (Maestría) antes del reset → slide 2 abría en Maestría en vez de Expandir

**Slide 3**: `.slide-3-layout` es `flex-direction: column; justify-content: flex-end` en mobile — slide-3-bottom y CTA apilan verticalmente (NO flex-direction: row que hace flotar el CTA a la derecha).

**Slide 4**: Scroll-snap vertical en mobile — dos snap items de `100vh`:
1. `.simulator-panel` — calculadora (INGRESO INMEDIATO / INGRESO RECURRENTE)
2. `.cta-panel` — imagen `boton-accion.jpg` (top 40%) + zona texto (bottom 60%)
   - `.bg-image-cta`: `grayscale(100%) brightness(50%)` por defecto
   - Desktop: imagen queda gris hasta hover (CSS `:hover` puro — NO setTimeout auto-reveal, fue eliminado porque impedía ver la transición)
   - Mobile: `ctaVisible` state + IntersectionObserver → `cta-revealed` → color al scroll-snap
   - `#slide-4 { padding-top: 0 }` en fullscreen — elimina espacio negro vacío del HUD
   - Botón primario "ACTIVACIÓN DE UNIDAD DE SUMINISTRO →": `width: 100%`, naranja dominante → `/paquetes`
   - Botón secundario "VER LA AUDITORÍA DE 5 DÍAS →": outline, más angosto → `/empresa-digital`

#### B-rolls 3D en Slides 1 y 2 (jun 2026)

Slides 1 (3 pilares) y 2 (3 comandos del Método) usan **b-rolls 3D** como fondo de cada card, en vez de imágenes. Pensado para uso **en vivo en mobile**: cada b-roll muestra **solo el nombre** (Luis narra el resto). Diseño: el video llena la card (`object-fit: contain`, ver bloque Mobile arriba) y la gráfica debe **explicar sin texto**.

**Assets servidos** (Vercel/Next desde `/public`, no Blob): 6 clips en [public/videos/servilleta/](public/videos/servilleta/) — `respaldo.mp4 · queswa.mp4 · metodo.mp4` (slide 1) + `expandir.mp4 · activar.mp4 · maestria.mp4` (slide 2). 720×1280, H.264, faststart, sin audio (~55–450 KB c/u). Reproducción perezosa: cada `<video>` usa `preload="none"` y solo reproduce la card activa (en desktop grid, todas).

**Fuente (comps Remotion)** → [scripts/dankoe-video/motion/src/](scripts/dankoe-video/motion/src/) (mismo proyecto que los reels, ver [Reel Post-Production Pipeline](#reel-post-production-pipeline-scriptsdankoe-video)):
- **Pilares (slide 1)** reutilizan comps de los reels renderizadas **"limpias"**: `Matriz3D` (globo · Respaldo Operativo), `IAOnda3D` (orbe ecualizador · Queswa), `Checklist3D` (PASO 01-03 · Método). Se renderizan con `--props` de texto vacío; un guard `{(eyebrow||title||sub) && (...)}` oculta el bloque de título inferior (el nombre lo pone el overlay HTML de la card). ⚠️ Ese guard también protege el uso de estas comps **en los reels** (con texto) — no quitarlo.
- **Comandos (slide 2)** son comps **nuevas**, registradas en `Root.tsx`: `Expandir3D`, `Activar3D`, `Maestria3D`.

**Semántica de cada gráfica — NO cambiar el mensaje** (calibrado con Luis jun 2026; la gráfica debe gritar el concepto sin texto):
- **Expandir = distribución / alcance.** La orbe central (su celular) emite una **onda que se expande y enciende un campo de ~22 contactos** (espiral girasol) de adentro hacia afuera = "comparte con un clic → su alcance llega a muchos". ❌ NO debe **atraer** nodos hacia el centro (eso comunica lo contrario; fue el bug de la v1).
- **Activar = conversión.** Un prospecto parte **rojo**, un anillo de progreso se llena **rojo→verde** mientras la orbe Queswa lo acompaña desde arriba, y cierra en **verde con ✓** (de acuerdo / listo). Colores de estado de marca (`#F43F5E`→`#10B981`).
- **Multiplicación** (comp `Maestria3D` — nombre interno conservado; los b-rolls del deck son **name-only**, sin texto quemado, así que el rename de léxico no exige re-render)**.** Réplicas **idénticas** (mismo tamaño = iguales) que se duplican **1→2→4→8 de abajo hacia arriba**. ❌ NO usar pirámide ni cascada **top-down** ni nodos de distinto tamaño — es lenguaje MLM (downline) y está prohibido.

**Re-render + deploy de un b-roll:**
```bash
cd scripts/dankoe-video/motion
# comps de pilares: props de texto vacías para render limpio
npx remotion render Matriz3D  out/deck-respaldo.mp4 --gl=angle --props='{"eyebrow":"","count":0,"unit":"","sub":""}'
npx remotion render IAOnda3D  out/deck-queswa.mp4   --gl=angle --props='{"eyebrow":"","title":"","sub":""}'
npx remotion render Checklist3D out/deck-metodo.mp4 --gl=angle --props='{"eyebrow":"","title":"","sub":"","steps":["PASO 01","PASO 02","PASO 03"]}'
# comandos slide 2: defaultProps ya vienen vacíos
npx remotion render Expandir3D out/deck-expandir.mp4 --gl=angle
npx remotion render Activar3D  out/deck-activar.mp4  --gl=angle
npx remotion render Maestria3D out/deck-maestria.mp4 --gl=angle
# optimizar a /public (ej. expandir)
ffmpeg -y -i out/deck-expandir.mp4 -vf scale=720:1280 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow -an -movflags +faststart ../../../public/videos/servilleta/expandir.mp4
```
⚠️ Render headless M1 requiere `--gl=angle`. Las comps Remotion en `motion/src` están **untracked** en git (igual que las de los reels — son herramientas de build); en producción solo se versionan los `.mp4` de `public/videos/servilleta/` + `page.tsx`.

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
| `creatuactivo.com` | `nexus_main` | `actualizar-system-prompt-v27.2.mjs` (despliega **v28.4 "multiplicacion_sin_filtrar"** — apunta a `system-prompt-nexus-main-v27_2.md`; tanto el script como el archivo conservan el nombre legacy `v27.2`/`v27_2`. Verificar siempre con `leer-system-prompt.mjs`) |
| `luiscabrejo.com` | `marca_personal_v1.0` | `actualizar-system-prompt-marca-personal-v1.mjs` |
| `ganocafe.online` | `ganocafe_main` | `actualizar-system-prompt-ganocafe-v1.3.mjs` (latest: **v1.5_ganocafe_alias_coloquiales**) — ⚠️ tiene catálogo de precios hardcodeado: sincronizar con `arsenal_ganocafe.txt` al cambiar precios |
| `queswa.app` | hardcoded en `dashboard-ai/route.ts` | editar `buildSystemBlocks()` directamente |

3. Clear cache (restart dev server or wait 5 minutes)

**DO NOT** modify fallback system prompt en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts).

**Queswa Official Constants** (calibradas Mar 2026 — consistencia obligatoria en todos los arsenales):
- Lanzamiento público: **sin fecha dura** (decisión 31 May 2026). La fase de cimentación está **en curso** (selección de los 15); el despliegue público global llega **una vez consolidada la base fundacional**. La urgencia es la **banda directiva finita** (tiempo del núcleo para los 15), NO un calendario. ❌ No usar "1 de junio" ni ninguna fecha de lanzamiento en arsenales/Queswa.
- Equipo base Fundadores inicial: **15 socios estratégicos / 15 cupos**
- Porcentaje de automatización tecnológica: **90%** (la tecnología hace el 90% del trabajo pesado)
- Tres Pilares canónicos (NO "Máquina Híbrida", NO "capas"): **Pilar 1 — La Matriz Física** (Gano Excel, 70 países, pasivos logísticos) · **Pilar 2 — Queswa, su Centro de Mando** (IA propietaria, queswa.app) · **Pilar 3 — La Metodología Automatizada** (El Tridente EAM: protocolo de ejecución estandarizado que erradica el ensayo y error) — recategorización aplicada en v26.5 (May 2026). ⚠️ **De cara al prospecto (jun 2026) usar léxico accesible:** Pilar 1 → **El Respaldo Operativo** · Pilar 3 → **El Método Comprobado**. Los nombres canónicos de arriba siguen vivos solo en arsenales profundos + system prompt aún sin migrar (ver Queswa Vocabulary).
- Activo del Arquitecto: **Base Operativa** — unidad replicable que se escala activando nuevas Bases Operativas
- Rol del usuario: **Arquitecto de Patrimonio** — dirige los tres pilares, NO es uno de ellos. Labor puramente gerencial/directiva, no operativa. ⚠️ **De cara al prospecto (jun 2026): "Propietario de Base Operativa"** (léxico accesible; "Arquitecto" generaba barrera de autoeficacia — analogía Ray Kroc: vende la propiedad de un sistema que ya funciona).
- Multiplicación (3er Comando, renombrado desde "Maestría" jun 2026): multiplicar la empresa digital está a un clic en todo el continente — resuelve el cuello de botella de crecer. La Academia/formación es el medio (Queswa forma a cada persona nueva), NO el gancho. Ver [[project_rename_maestria_multiplicacion]]
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
   - `arsenal_inicial.txt` - Initial questions (**48 fragments** — 47 activas + PERFIL_01)
   - `arsenal_avanzado.txt` - Objections + System + Value + Escalation + Activation (18 fragments)
   - `arsenal_reto.txt` - **El Diagnóstico de 5 Días** v4.6 (7 fragments — empresa-digital/dia-1 a dia-5)
   - `arsenal_12_niveles.txt` - 12-level challenge content (13 fragments — flujo Reto, NO accesible al chat principal creatuactivo.com)
   - `catalogo_productos.txt` - Product catalog + science (22 products, 25 fragments + doc maestro)
   - `arsenal_compensacion.txt` - Compensation plan (**41 fragments** — **NO modificar vocabulario**; PVP prohibido)

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

Each `animaciones/diaX/` page renders and exports one video. Variants (e.g. `dia7-v3` through `dia7-v6`) are A/B iterations of the same day's script. Algunas animaciones usan nombre de concepto en vez de `diaX` (`acoplamiento/`, `depreciacion-biologica/`, `laberinto-infinito/`, `turbina-prisionero/`).

### Reel Post-Production Pipeline (`scripts/dankoe-video/`)

Acabado cinematográfico de reels (estilo Dan Koe/Naval) en M1, todo por código. Entrada: export de CapCut ya graduado (LUT Osmo Pocket 3 + ajustes); salida: 1080×1920·24fps con subtítulos + motion graphics de marca + SFX + atmósfera + música, mezclado a −14 LUFS. **La música ahora vive en el pipeline (no en CapCut).**

> ⚠️ **El base de CapCut debe exportarse SIN música (pista de música en MUTE)** — solo voz + grade. Si trae la música de CapCut bakeada, el pipeline la trata como "voz" y nuestra música queda enterrada (doble música). Verificar con `silencedetect`/`volumedetect`: en una pausa del habla un base limpio mide ~−60 dB; con música bakeada ~−30 dB. Si el video ya viene con música y no se puede re-exportar, separar la voz con Demucs (IA) — imperfecto.

**Estructura del reel (los 5 producidos en 3D, jun 2026):** **Hook+Diagnóstico** (base grabada por nicho, 24–34s) + **Solución+CTA** (módulo compartido `captions/work/solucion_module.mp4` — el mismo en los 5, extraído del corte de corporativo). El módulo se concatena tras la base. **Excepción `empresarios`:** graba su propia intro de solución (variante "…otro negocio tradicional"), así que su base llega hasta "CreaTuActivo.com" y se le anexa el módulo **desde los 3 pilares** (corte en módulo-t **16.0s**, justo en "Todo el trabajo pesado", evitando el "de creatuactivo.com" duplicado); en ese caso la corporativa del segmento A se posiciona con `atrim` para empatar la posición-de-pista del módulo en la costura. Los otros 4 anexan el módulo **completo** (desde "La respuesta").

- **`captions/`** — subtítulos word-level por **forced alignment** (`ctc-forced-aligner`, modelo MMS onnx, **sin torch**; toma el guion exacto y resuelve el *cuándo*, sin drift). Se queman con **Pillow PNG overlay** (Montserrat Black), **NO con libass** (el libass de este ffmpeg antepone una `,` espuria a cada línea — ver `align.py`/`render_captions.py`). `render_captions.py --display-map` mapea lo hablado→escrito (`setenta`→`70`, `cien por ciento`→`100%`, `creatuactivo punto com`→`CreaTuActivo.com`). ⚠️ El `collapse` matchea por token exacto tras `strip()` (no quita puntuación): si la última palabra alineada es `com.` con punto, el `from` debe ser `["creatuactivo","punto","com."]` o no colapsa. venv py3.12 en `captions/.venv`. Orquestador: `caption-reel.sh` (pero el ensamble real va inline — ver abajo).
- **`motion/`** — inserts 3D de marca en **Remotion + @remotion/three (React Three Fiber)**, tokens Bimetálicos en `src/brand.ts`, todos bajo el motivo del **orbe-héroe dorado**. Render headless en M1 requiere `--gl=angle` (`npx remotion render <id> out/<x>.mp4 --gl=angle`). **Relabel por nicho vía `--props='{...}'`** (no se duplica composición salvo que cambie duración/comportamiento). Biblioteca de inserts (componentes en `motion/src/`, registrados en `Root.tsx`):
  - **Pilares (módulo solución):** `Matriz3D` (globo punteado, América al frente, 70 países), `IAOnda3D` (orbe + ecualizador horizontal = asistente IA), `Checklist3D` (3 tarjetas con ✓ dorado en cascada = método).
  - **Villanos (diagnóstico, por nicho):** `Ciclo3D` (bucle TRABAJAR·PAGAR·REPETIR), `Metricas3D` (barras divergentes años/patrimonio), `Sever3D` (hilo que se corta, orbe cae), `Dependencia3D` (bases→nudo→hilo→UN TERCERO, flip a rojo), `PrisionOperativa3D` (torre sobre el orbe-clave que **se queda tambaleando** al retirarlo — relabel `towerLabel`: "SU EMPRESA" / "SU ESTILO DE VIDA"), `TresFallas3D` (3 tarjetas con ✗ rojo — espejo invertido del checklist), `MotorCongela3D` (engranajes movidos por el orbe; congela en rojo en una palabra de "parar"; props `freezeAt`/`titleAt`; variantes registradas `MotorGira3D` = gira sin congelar / `MotorFrena3D`), `RemesasFuga3D` (embudo con fuga: entra plata, drena a CUENTAS/CASA, frasco "LO SUYO" vacío), `PuntoCritico3D` (SU INGRESO sobre **un solo pilar = USTED de pie**; estrés escala a rojo "VULNERABILIDAD CRÍTICA" — para informales, donde el villano es ser uno la única pieza, NO un tercero).
  - **`sfx.py`** sintetiza el kit de SFX (whoosh/boom/riser/shimmer/finale_boom) por numpy → `out/kit/*.wav` (cero licencias). Colocar cada insert con `enable='between(t,…)'` y un whoosh de entrada/salida; dejar ≥~1.5s de talking-head entre cutaways (gaps <1s = "parpadeo", se nota).
- **Assets de audio versionados en git** (aunque `out/` esté gitignored para los `.mp4`): el **kit de SFX** (`motion/out/kit/*.wav`) y **`motion/sfx.py`** sí están commiteados; si se borran los wavs, regenerarlos con `python sfx.py`. La **música** también (ver abajo). Así un clon fresco re-ensambla cualquier reel sin assets externos.
- **`music/`** — camas de fondo (royalty-free, **commiteadas**): `hook-diagnostico_suspense.mp3` (acto 1) + `solucion-cta_calm-corporate.mp3` (acto 2; ~29s). **Convención de audio fija (ver [knowledge_base]/memorias):** suspense del hook+diag a **`volume=0.80`** (Luis la calibra al alza — nunca bajar). El **cambio suspense→corporativa cae exacto en "La respuesta a este sistema…"** (límite diagnóstico→solución): en los 4 nichos normales eso coincide con la costura (el módulo trae la corporativa); en `empresarios` la solución-intro está en la base, así que la corporativa entra en "La respuesta" dentro del segmento A. Camas **ducked bajo la voz** (`sidechaincompress`).
- **Atmósfera** (ffmpeg, sobre el grade existente, NO re-graduar): grano + halation + viñeta. **Outro** (`motion/assets/emblema.png` + texto Pillow): emblema + `CreaTuActivo.com` (3s) con `finale_boom` (sub-bass de cierre en `sfx.py`).
- **Mezcla de audio — VOZ ANCLADA** (clave, no usar loudnorm sobre toda la mezcla → diluye la voz): `[voz]loudnorm=I=-14` como ancla protagonista → `asplit` (mezcla + key de sidechain); música/SFX/boom **por debajo** a niveles fijos; cierre con `alimiter` (sin loudnorm final). Niveles calibrados por LUFS medido de cada pista.
- **Cómo ensamblar un reel:** correr `align.py`→`render_captions.py` (frames de subtítulos), luego una pasada ffmpeg de video (scale + overlays de subtítulos + cutaways de inserts con `enable='between(t,…)'` + atmósfera) y una de audio (voz+SFX+música+loudnorm). Los masters a CRF20 con grano pesan mucho → entregar comprimido (CRF23 + faststart).

> ⚠️ Esto **reemplaza** la "Fase 2 (subtítulos) manual en CapCut / pendiente WhisperX" descrita más abajo en Utility Scripts — los subtítulos ya están automatizados por forced alignment.

### Reels por Nicho (fase orgánica WhatsApp)

5 reels verticales (uno por nicho de audiencia) que cada **Arquitecto de Patrimonio** comparte por WhatsApp a su mercado orgánico. Cada reel vive en `creatuactivo.com/{slug}/{nicho}` + tracking de referido. **NO** se publica reel nativo en IG/TikTok en esta fase.

**Jerarquía de conversión en la página** (secuencial, no compite — investigación CTA May 2026: un solo CTA por momento convierte mejor):
1. **Reel 9:16** alto en pantalla (ojos en el tercio superior; `padding-top` mínimo).
2. **Copy del nicho** (título serif + cuerpo).
3. **Queswa = vía rápida**: al terminar el reel **o** al hacer scroll dejándolo atrás, el `ReelVideo` muestra una burbuja sobre el orbe — copy *"Puedo auditar la viabilidad de su caso ahora mismo. ¿Comenzamos?"* (registro Modulación: autoridad clínica "auditar la viabilidad" + invitación accesible "¿Comenzamos?"; eco del reel, sin ancla de tiempo) → al tocarla dispara `open-queswa`. La burbuja se **oculta** a los 25 s, al volver al video (IntersectionObserver) y al abrir el chat (evento `queswa-opened` que emite el orbe).
4. **Tarjeta YouTube** (presentación de 7 min) — vía reflexiva, facade nativo **full-bleed** (todo el ancho en móvil, cap 680px en desktop).
5. **Los 2 escenarios de cierre del video**: `Diagnóstico de 5 Días` (→ `/empresa-digital?ref`; rótulo migrado desde "Auditoría de 5 Días" jun 2026) + `Activación Inmediata · WhatsApp` (verde, → WhatsApp del arquitecto). La activación NO pasa por Queswa: quien ya decidió no debe encontrar preguntas de cualificación (analogía constructora/concesionario). El botón de compartir (`ShareButton`) dice **"Compartir este diagnóstico"**.

- **Fuente de verdad**: [src/lib/reels.ts](src/lib/reels.ts) — `REEL_NICHOS` (`corporativo`, `empleados`, `empresarios`, `diaspora`, `informales`), `REEL_ASSETS` (solo `{ video }`, URLs Blob), `REEL_COPY` (título/cuerpo/audiencia, versión final aprobada por Luis), `SERVILLETA_YOUTUBE_ID`, `REEL_POSTER`/`REEL_POSTER_OG` (poster branded de fallback) y **`REEL_POSTER_OVERRIDE`** (poster por-nicho).
- **Poster por-nicho (jun 2026)**: con los reels ya en 3D, cada nicho usa un **frame del propio reel** como portada (más nítido y representativo que el branded genérico). `REEL_POSTER_OVERRIDE[nicho] = { poster: '…-poster.webp', posterOg: '…-poster.jpg' }` — los 5 nichos tienen override. Se generan del master con `ffmpeg -ss 0.5 … scale=1080:1920` (jpg q2) + `sharp` a webp; ambos en `public/videos/reels/`, **commiteados** (servidos por Next, no por Blob). `ReelPage`/`generateMetadata` usan el override y caen a `REEL_POSTER`/`REEL_POSTER_OG` si un nicho no lo tiene. `metadataBase` resuelve la ruta relativa del OG a absoluta.
- **Componentes** (construidos May 2026): [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) bifurca render-reel vs redirect; [src/components/ReelPage.tsx](src/components/ReelPage.tsx) (Server Component, estética Bimetálica); [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) ('use client' — video `preload="none"` + burbuja Queswa con auto-hide/scroll/chat); [src/components/YouTubeFacade.tsx](src/components/YouTubeFacade.tsx) ('use client' — miniatura `maxresdefault` + play, iframe carga al click). `generateMetadata` emite OG de video + `REEL_POSTER_OG` (`robots: noindex`). Botón WhatsApp usa clase `.cta-whatsapp` (verde) en globals.css.
- **Orbe en reels**: [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) suprime su tooltip "Concierge" automático (~2s) cuando `isReelRoute` (pathname `/{slug}/{nicho}` con nicho ∈ `REEL_NICHOS`) — el reel controla su propia burbuja. ⚠️ El orbe es global; el cambio está aislado por ruta para no afectar el resto del sitio.
- **Tracking de referido**: como el reel se renderiza inline (no redirige), `ReelPage` resuelve `constructor_id` del slug e inyecta un `<script>` inline (corre **antes** del `tracking.js` diferido) que setea `?ref={constructor_id}` vía `history.replaceState` + `localStorage.constructor_ref`. Atribución idéntica a aterrizar en `/empresa-digital?ref=id`. Funciona para cualquier arquitecto (slug dinámico), no solo `luis-cabrejo`.
- **CTA WhatsApp del arquitecto**: el número vive en **`private_users.whatsapp`** (fuente de verdad — igual que `/api/constructor/[id]` y `/sistema/productos`), **NO** en `constructor_slugs.whatsapp`. El branch del reel lo resuelve por `constructor_id` con fallback al número orgánico `+573206805737`. ⚠️ Bug histórico "cero inicial" en esos números (ver `whatsapp-validator.ts` del repo Dashboard) — el `.replace(/\D/g, '')` lo neutraliza.
- **Engagement tracking** (Reels Engagement Fase 1, Jun 2026): [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) instrumenta el comportamiento del prospecto y reporta a [`/api/track/engagement`](src/app/api/track/engagement/route.ts) (que mergea sin retroceder en `device_info` → webhook Supabase → push al arquitecto en queswa.app). **Contrato de datos cerrado con el Dashboard — NO renombrar los campos**: `reel_nicho`, `reel_pct` (máx % visto), `reel_completed` (✅ push "Vio el reel completo"), `reel_time_s` (segundos activos), `queswa_opened` (✅ push "Abrió Queswa"), `queswa_messages`, `visit_count` (✅ push "Volvió a visitar"). **Anti-spam (CRÍTICO)**: cada escritura dispara el webhook → mantener **≤ ~6 escrituras por sesión**. Reportar solo en milestones del reel (25/50/75/100), `queswa_opened` una vez, y `reel_time_s`+`visit_count` en el beacon de salida (`navigator.sendBeacon`). NO escribir en cada `timeupdate` ni en heartbeats. Handoff: [HANDOFF_REELS_ENGAGEMENT_FASE1.md](HANDOFF_REELS_ENGAGEMENT_FASE1.md).
- **Estado**: **los 5 reels están en 3D y en producción** (jun 2026 — corporativo · empleados · empresarios · diaspora · informales), cada uno con sus inserts 3D de diagnóstico por nicho + módulo de solución compartido (pilares/CTA/outro), atmósfera, subtítulos, música 0.80 y SFX. Masters locales en `scripts/dankoe-video/masters/{nicho}-3d.mp4` (gitignored); en Blob `reels/{nicho}.mp4` (web CRF23, ~63-72MB). Pendiente abierto: "tres pilares"→"3 pilares" en el módulo compartido (re-deploy de los 5). Handoff original: `HANDOFF_REELS_PAGINAS.md`.
- **Hosting**: Vercel Blob (migrar a Bunny Stream solo si el egress lo justifica). Servilleta NO se auto-hospeda → YouTube. `public/videos/reels/` conserva el poster branded (`poster.webp`/`poster.jpg`), **los posters por-nicho (`{nicho}-poster.webp`/`.jpg`)** y los `.md` — los `.mp4` (crudos + `-web`) son locales/intermedios y se borran tras subir (gitignored, no se sirven; los masters 3D viven en `scripts/dankoe-video/masters/`, el base limpio en CapCut).
- **Léxico del copy**: usted · Lujo Clínico · **negocio digital** (a secas), ingreso recurrente, 3 pilares. Prohibido: vehículo, red (MLM), patrimonio paralelo, capas, Máquina Híbrida, **Estructura Patrimonial / Base Operativa** (migrados a negocio digital — `REEL_COPY` en `reels.ts` ya migrado).
- **Pipeline de actualización de video**: export CapCut a `public/videos/reels/{nicho}.mp4` (1080p·24fps·H.264·~20Mbps fuente) → `bash scripts/optimize-reels.sh` (→ `{nicho}-web.mp4`, CRF 23 + `+faststart`) → `node scripts/upload-reels-to-blob.mjs` (sube a `reels/{nicho}.mp4`, **mismas URLs** → no se toca `reels.ts`).
- **Deploy de un reel 3D** (jun 2026): el reel se ensambla en `scripts/dankoe-video/` (ver [Reel Post-Production Pipeline](#reel-post-production-pipeline-scriptsdankoe-video)) → master a `masters/{nicho}-3d.mp4` → comprimir web (CRF23 + `maxrate 6M` + faststart) → subir a Blob `reels/{nicho}.mp4` (`@vercel/blob put`, `allowOverwrite:true`, **misma URL** → no se toca `REEL_ASSETS`) → generar poster del frame + `REEL_POSTER_OVERRIDE[nicho]` + commit del `.webp`/`.jpg`. El `optimize-reels.sh`/`upload-reels-to-blob.mjs` originales (flujo simple sin 3D) siguen existiendo pero el flujo vivo es el de arriba.

### Guiones de Reels — Taxonomía (3 tipos)

Los guiones (texto hablado) viven en `public/contexto/produccion/guiones/reels/`. **Tres archivos, tres propósitos distintos — NO mezclar el registro entre ellos:**

| Archivo | Tipo | Propósito / registro | Conducto |
|---------|------|---------------------|----------|
| `REELS_DIARIOS_DOCUMENTACION.md` | **Documentación** (build-in-public) | **Despierta curiosidad, NO confronta.** Primera persona (Luis), registro Naval. Su mercado natural ya cree que "hace Gano Excel" — si cada reel fuera un hook de negocio incómodo, los quema (analogía: hablar de plata en todo cumpleaños). Documenta cómo, con IA, construye un ingreso recurrente. Orden cronológico (más antiguo arriba). | Historias orgánicas (IG/WhatsApp) + enlace `creatuactivo.com?ref=…` → la persona llega a la home |
| `REELS_NICHOS_DOCUMENTACION.md` | **Nicho** | Aborda una **oportunidad de negocio directa** por nicho de audiencia. Es el copy de las páginas `/{slug}/{nicho}` (ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)). | Páginas web `/{slug}/{nicho}` |
| `REELS_SITIO_CREATUACTIVO.md` | **Sitio** | **Explainer**: responde a quien **ya llegó con la pregunta "¿de qué se trata?"**. Voz **neutra** (NO "soy Luis") — la home la alimentan todos los arquitectos con su `?ref`, debe ser reutilizable. Empieza con el reel de la **Home** (reemplaza el video viejo del plan servilleta en el hero). Armonizado con la squeeze `/empresa-digital`. | Incrustado en el sitio (hero `page.tsx`, etc.) |

**Léxico (los 3):** "negocio digital" a secas (la corona es de CreaTuActivo, no de Gano) · ingreso que no depende de su presencia · usted dirige, el sistema hace el trabajo. Ver [migración léxico accesible](#queswa-vocabulary--tabla-canónica-unificada).

**Reel HOME (✅ producido y desplegado, jun 2026):** el explainer 9:16 vive en el hero de [src/app/page.tsx](src/app/page.tsx) vía [src/components/HomeManifestoVideo.tsx](src/components/HomeManifestoVideo.tsx) (reemplazó el `YouTubeFacade`/`SERVILLETA_YOUTUBE_ID`). Asset en Blob (`home/home-manifesto.mp4`, mismo pipeline CRF 23 + faststart) + poster local `public/videos/home/poster.webp` — constantes `HOME_MANIFESTO_VIDEO`/`HOME_MANIFESTO_POSTER` en [src/lib/reels.ts](src/lib/reels.ts). **Comportamiento:** autoplay muted con chip "ACTIVAR SONIDO"; al terminar (`onEnded`) el video se desvanece en 1000ms y, si sigue ≥40% en viewport, dispara `open-queswa` + foco programático en `#queswa-chat-input` (id en el textarea de `NEXUSWidget`). Si el usuario scrolleó lejos, no se secuestra el foco — el panel revelado ofrece "Hablar con Queswa". El `.mp4` local intermedio está gitignored; el master vive en `~/Downloads/home-1/` + Blob.

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
- `reels.ts` - **Fuente de verdad de Reels por Nicho** (`REEL_NICHOS`, `REEL_ASSETS`, `REEL_COPY`). Ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)
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

Regla unificada aplicada en Home, Manifiesto, Tecnología, Blog index, 3 artículos del blog, Paquetes y Sistema/Productos. Parámetros canónicos completos en [BRANDING.md](BRANDING.md) — sección "Tipografía".

**H1 institucional** (páginas con título corto): `var(--font-sans)` Inter, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`, color `var(--color-brand)`. Ejemplos: "NUESTRA FILOSOFÍA", "TECNOLOGÍA QUE TRABAJA POR USTED", "CATÁLOGO BIO-INTELIGENTE", "CONSTRUCCIÓN DE ESTRUCTURA PATRIMONIAL".

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
  - `Dia1-Diagnostico.tsx` — Coordenada 01, URL `/empresa-digital/dia-1`
  - `Dia2-Vehiculos.tsx`   — Coordenada 02, URL `/empresa-digital/dia-2`
  - `Dia3-Modelo.tsx`      — Coordenada 03, URL `/empresa-digital/dia-3`
  - `Dia4-Estigma.tsx`     — Coordenada 04, URL `/empresa-digital/dia-4`
  - `Dia5-Invitacion.tsx`  — Coordenada 05, URL `/empresa-digital/dia-5`
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
| `/api/claude-chat` (repo **luiscabrejo.com**, no este) | Sin uso | Reemplazado por `/api/nexus` con tenant `marca_personal` hardcodeado. En este repo la ruta no existe |
| `/api/nexus` POST (síncrono) | Funciona pero legacy | Usar `/api/nexus/producer` (async queue) en producción |
| `/api/nexus/consumer-cron` | Legacy | Fallback sin triggers — el flujo activo es DB trigger → `nexus-queue-processor` |
| `nexus-consumer` (Edge Function) | Deprecated | Consumer Kafka — reemplazado por `nexus-queue-processor` |
| `src/lib/sendpulse.ts` | Legacy | Migrado a `whatsapp-meta.ts` (Abr 2026). Eliminar tras aprobar plantillas Meta WhatsApp |
| `src/components/nexus/NEXUSFloatingButton.tsx` | Conservado parcial | Reemplazado por `UnifiedQueswaOrb` en layout; aún se usa para eventos servilleta |
| `/reto-5-dias/*` | Legacy (301) | Squeeze v1 — redirige a `/empresa-digital` |
| `/mapa-de-salida/*` | Legacy (301) | Page Next.js viva solo para que funcione el redirect → `/empresa-digital` |
| `/api/fundadores/registro-diciembre` | Legacy | Registro Diciembre — reemplazado por flujo Founder actual |
| `/api/test-resend`, `/api/test-reto-email` | Dev only | No para producción |
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
- [HANDOFF_MENSAJES_1A1_FUNDADORES.md](HANDOFF_MENSAJES_1A1_FUNDADORES.md) - Guion de mensajes 1-a-1 para captar Fundadores
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

**Location**: `scripts/` directory (~48 scripts)

**NEXUS System Prompt**:
- `leer-system-prompt.mjs` - Read current prompt from Supabase
- `descargar-system-prompt.mjs` - Download prompt to local file
- `actualizar-system-prompt-v27.2.mjs` - Deploy del system prompt actual (**v28.2 "villano_narrado"**) a Supabase. El script y el archivo fuente conservan el nombre legacy `v27.2`/`v27_2`; el contenido interno es v28.2. Las versiones anteriores viven en git

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
- **Fase 2 (subtítulos)** — **ya automatizada** por forced alignment + Pillow (ver [Reel Post-Production Pipeline](#reel-post-production-pipeline-scriptsdankoe-video)). El plan viejo de WhisperX/CapCut quedó descartado (WhisperX derivaba el timing en chunks cortos; el forced alignment con guion exacto no). Setup Fase 1 (remoción de fondo, ya no necesaria con telón gris): `python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt` (BiRefNet ~973MB primera vez → `~/.u2net/`). Variante en la nube: `dankoe-video/colab_birefnet.ipynb`

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
30 videos de valor puro      →    Squeeze Page /empresa-digital
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

> ⚠️ **MIGRACIÓN LÉXICO ACCESIBLE EN CURSO (Jun 2026) — leer antes de "corregir" textos.** El léxico premium/canónico se está reemplazando por léxico accesible (servilleta / Mario Alonso Puig). Mapa de reemplazo: `Estructura Patrimonial` → **estructura de ingresos recurrentes** · `La Matriz Física` → **El Respaldo Operativo** · `El Tridente EAM` → **El Método Comprobado** (subtítulo: "Comando Expandir · Activar · **Multiplicación**" — 3er comando renombrado desde "Maestría" jun 2026) · `Base Operativa` → **negocio digital** (a secas) · `Arquitecto de Patrimonio` → **Propietario (de su negocio digital)** · `Dirección Ejecutiva / gobernanza` → **dirige / dirección** · `Apalancamiento Asimétrico` → **Apalancamiento Estratégico** · `escalar` → **multiplicar**. ⚠️ **Swap "negocio digital" (jun 2026, `HANDOFF_AGENTE_LEXICO_ARSENALES.md`) supersede el mapping previo: "Base Operativa" también se retira de cara al prospecto. Atribución: "su negocio digital" SIN "de Gano Excel" — la corona es de CreaTuActivo; Gano Excel se nombra solo como Respaldo Operativo (Pilar 1, el estudio detrás de cámaras).** Concepto nuclear de "¿qué es CreaTuActivo?" (modelo Waze, empatía primero): *"empresa de tecnología que ayuda a corregir una vulnerabilidad crítica en la vida financiera… ingresos recurrentes que no dependen de su trabajo físico"*.
>
> **Estado (jun 2026):** ✅ migrado y **desplegado** en todas las superficies de cara al prospecto: **home completa** (`src/app/page.tsx` — Hero, Diagnóstico, Perfiles, Tres Caminos, Producto, Prueba de Estrés, Queswa, CTA + `CognitiveLoadComparator` + nueva `VisionSection` "futuro absurdo / la norma"), **manifiesto** (`src/components/ManifiestoDocument.tsx` — `/manifiesto` + `/{slug}/manifiesto`; §2 reescrita con la visión, "soberanía financiera" conservada como excepción temática del documento), **deck `/servilleta`** (`src/app/servilleta/page.tsx` v6.2) + guion maestro v5.0 + teleprompter, **chips** (`queswa-greeting.ts`), **Camino A** (`respuestas-maestras.ts`), **WHY_01/WHY_02/EAM_01** (`arsenal_inicial.txt`, local) y los **reels de la serie de documentación** (Día 1–6) + reel explainer de la Home. **NO revertir hacia los términos viejos.** ⏳ pendiente: FREQ_04/FREQ_04_PUENTE/PERFIL_01 + migración profunda (~200 hits en arsenales restantes + system prompt) + deploy de `arsenal_inicial` a Supabase. La tabla de abajo aún refleja el canon viejo en los términos migrados; al editar copy de cara al usuario, **siempre el léxico accesible**.
>
> **Doctrina vigente del copy (el CÓMO, no solo el qué):** (1) **Villano NARRADO, nunca etiquetado** — método NuBank: detalles vividos que el lector reconoce (*"los créditos siempre le llevan la delantera"*, *"la bicicleta estática: le da y le da y no avanza"*, *"trabajar, pagar cuentas y repetir"*, *"un sistema diseñado para construir el patrimonio de otros"*), nunca una etiqueta abstracta (prohibido "PPO", "Plan por Defecto", "tiempo por dinero" en seco). "Trampa" sí, como recategorización, sin victimizar. (2) **Autopersuasión** — marcos moderados (*"meses"*, no "días"; sin cifras extremas tipo "en ceros"); escenarios que el lector completa, no afirmaciones. (3) **Test Beto** — si un profesional inteligente sin MBA no entiende la frase, está prohibida; densidad técnica ≠ autoridad, el lujo es la claridad. (4) **Concepto nuclear (modelo Waze):** *"empresa de tecnología que ayuda a corregir una vulnerabilidad crítica en la vida financiera… ingresos recurrentes que no dependen de su trabajo físico"*. Detalle: `HANDOFF_RECALIBRACION_LEXICO_QUESWA.md` (Queswa/sitio) · `HANDOFF_AGENTE_MARKETING_REELS.md` (reels/redes, con la serie de documentación diaria).

**Regla de oro**: Todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido. Esta sección es la **única fuente de verdad** sobre vocabulario aprobado y prohibido — versiones consolidadas Feb 2026 (Jobs-Style) + Abr 2026 (Lujo Clínico) + May 2026 (v5.2 cierre simplificado + v5.4 híbrido contextual).

#### Vocabulario APROBADO (doctrina canónica)

> 🔁 **Las filas marcadas 🪶 son CANON INTERNO ya migrado de cara al prospecto (jun 2026).** El "Término" sigue vivo en arsenales profundos + system prompt sin migrar, pero en copy que ve el prospecto va el **reemplazo accesible en negrita dentro de "Uso"** — NO uses el término canónico ni "corrijas" copy accesible hacia él. Detalle: bloque ⚠️ al inicio de esta sección + [[project_migracion_lexico_accesible]].

| Término | Uso | Razón |
|---------|-----|-------|
| **Tres Pilares** | Arquitectura del sistema — NUNCA "capas" ni "Máquina Híbrida" | Doctrina v26.0 |
| 🪶 **Pilar 1 — La Matriz Física** | Gano Excel + músculo logístico · prospecto → **El Respaldo Operativo** | — |
| **Pilar 2 — Queswa, su Centro de Mando** | Plataforma IA propietaria | — |
| 🪶 **Pilar 3 — La Metodología Automatizada** | El Tridente EAM (no "Su Rol") · prospecto → **El Método Comprobado** | Recategorización v26.5 |
| 🪶 **Arquitecto de Patrimonio** | Rol del usuario — director de los 3 pilares, NO uno de ellos · prospecto → **Propietario (de su negocio digital)** | — |
| 🪶 **Base Operativa** | Activo del usuario · prospecto → **negocio digital** (a secas — NO "de Gano Excel": la corona es de CreaTuActivo, no del proveedor). "Base Operativa" sale de cara al prospecto (swap jun 2026, `HANDOFF_AGENTE_LEXICO_ARSENALES.md`) | Retirado 15 May 2026 (Unidad de Suministro/Nodo Logístico) |
| 🪶 **Tridente EAM** | Comando Expandir · Comando Activar · Comando **Multiplicación** (3er comando renombrado desde "Maestría" jun 2026) · prospecto → **El Método Comprobado** | v26.2 — "Comandos" no "Protocolos" |
| **Déficit Estructural de Ingresos** | El villano sistémico (causa raíz, no consecuencia) · prospecto → villano NARRADO, nunca etiquetado | v26.6 — jerarquía causal |
| **Monetización de Doble Velocidad** | Capitalización Inmediata (GEN5) + Renta Vitalicia (Binario) | v26.2 |
| 🪶 **Estructura Patrimonial** | Sustantivo doctrinal — reemplaza "Patrimonio Paralelo" · prospecto → **estructura de ingresos recurrentes** | v26.3 — Glosario v1.4 |
| **El Tridente EAM** | Reemplaza "Framework IAA" (eliminado) | v19.6 |
| **90% automatizado** | NO usar "80% automatizado" | Doctrina actual |
| **70 países** | Gano Excel presencia global — NO usar 60 | Oficial |
| **15 países operativos** | CreaTuActivo cobertura geográfica — NO confundir con 70 | v6.4 compensación |
| **Cupos Fundadores: 15** | Base fundacional inicial | — |
| **Acueducto / Alquiler vs. Propiedad / Ferrari gratis / Waze / Faro** | Metáforas universales aprobadas | Jobs-Style Feb 2026 |

#### Vocabulario PROHIBIDO (no usar bajo ninguna circunstancia)

| Prohibido | Reemplazar con | Razón de prohibición |
|-----------|---------------|---------------------|
| filtrar / filtro / filtrado / descartar a quien no encaja (lo que hace Queswa de cara al prospecto) | conversar · acompañar la decisión de avanzar · reconocer quién está listo | jun 2026 — para un dueño de negocio físico "que filtre a sus visitantes" suena a perder clientes; reencuadrar en clave de **conversión**, no de rechazo. Ver [[feedback_filtrar_prohibido]] |
| Maestría (3er Comando del Tridente EAM) | **Multiplicación** | jun 2026 — "Maestría" obliga a explicar luego; "Multiplicación" comunica el lever directo. Ver [[project_rename_maestria_multiplicacion]] |
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
| global (cuando refiere al activo del usuario: "consumo global", "Base Operativa global") | internacional | v5.4 — el usuario opera en 15 países América, no en todo el mundo. "Global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público global |
| pierna fuerte / pierna débil (Binario) | Centro de Negocios de Mayor Tracción / Centro de Negocios de Cobro | v5.5 — "pierna" suena a cosa, no a Lujo Clínico. "Centro de Negocios" eleva el status |
| "las dos principales" (al introducir GEN5 + Binario) | "Analicemos dos" (sin jerarquía) | v5.5 — "las dos principales" implica jerarquía falsa sobre las otras 10 velocidades. Apertura canónica: *"Su Base Operativa genera ganancias en 12 velocidades que cubren su flujo de corto, mediano y largo plazo. Analicemos dos:"* |
| "17% sobre la pierna débil" / "17% sobre el Centro de Negocios de Cobro" (sin GCV) | "17% del GCV sobre el Centro de Negocios de Cobro" | v5.5 — sin "GCV" el usuario puede asumir 17% sobre $100M de venta = $17M (absurdo). El GCV es valor comisionable asignado por Gano Excel, distinto al PVP |
| Tabla "Personas/Lado" en Binario (alucinación del modelo) | Tabla con "Bases Operativas" + contexto de estimado (4 cajas Ganocafé/Base/mes) | v5.5 — el modelo inventa esta tabla para "ilustrar" matemática. Refuerza paradigma MLM "ganas por meter gente". Prohibida en `getTablasComisiones()` |
| "Con gusto" (apertura única repetitiva) | Banco rotativo: Claro / Por supuesto / Entiendo / Excelente / OK / Comprendo / De acuerdo | v5.5 — repetir "Con gusto" suena a guion comercial. Documentado en system prompt v27.2 sección Modulación de Registro |
| USD sin COP entre paréntesis | USD ($X COP) — SIEMPRE ambas monedas con tasa fija Gano Excel ($1 USD = $4,500 COP) | v5.5 — la tasa Gano es FIJA, NO de mercado. Sin COP el usuario asume tasa representativa (~$3,631) y subestima la liquidación |
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
| "esto" / "eso" para auto-referirnos (a CreaTuActivo o al proyecto) | Nombrar concretamente qué es — ej. *"la nueva forma de construir ingresos recurrentes que no dependen de su presencia"* | Jun 2026 — auto-referencia vaga debilita la categoría; un creador de categoría se nombra, no se señala |
| operar / operador (de cara al prospecto, para el usuario o el sistema) | hacer el trabajo / trabajar / funcionar; el usuario: dirigir / ser dueño | Jun 2026 — para el latino promedio "operar" evoca cirugía; nadie se identifica como "operador" (es empleado/trabajador/dueño). ⚠️ Afecta el canónico "el sistema opera" / "Usted dirige; el sistema opera" — revisar en el sweep de servilleta + arsenales + system prompt |
| escalar (el activo del usuario) | multiplicar | Jun 2026 — swap "negocio digital" (`HANDOFF_AGENTE_LEXICO_ARSENALES.md`) |
| soberanía financiera | tranquilidad / estabilidad / seguridad | Jun 2026 — swap "negocio digital". **EXCEPCIÓN:** el lema de Luis *"la soberanía financiera no se trata de lujos"* se conserva donde es su frase-marca / Epiphany Bridge |
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
| **8,000 personal contacts** (friends, family, ex-Gano) | Plan por defecto | /empresa-digital, /fundadores |
| **Traditional networkers** (know MLM) | "Haz una lista de 100" | (página `/socios` eliminada — commit `6110e9a`; audiencia sin landing dedicada actualmente) |

**Content Style**: Naval Ravikant - philosophical, value-first, no direct selling. Reference: "The Almanack of Naval Ravikant".
