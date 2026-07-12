# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (**Queswa**, formerly NEXUS - rebranded in v15.0) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

**Design System**: "Quiet Luxury" with Bimetallic Accents v3.0 - See detailed guide below

**Funnel Strategy**: Russell Brunson methodology - Squeeze Page → Bridge Page → Offer (see Section 5)

> 🧭 **SI ERES NUEVO, LEE PRIMERO (en este orden):** (1) [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer) — lo que rompe producción · (2) [Queswa Vocabulary — Tabla Canónica](#queswa-vocabulary--tabla-canónica-unificada) — léxico aprobado/prohibido (⚠️ la tabla marca el canon viejo pero **la migración léxico accesible ya está en código; nunca "corrijas" copy accesible hacia el término viejo**) · (3) [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) — contexto de negocio. El **historial con fecha** de cada subsistema vive en sus CHANGELOGs/handoffs (enlazados en cada sección); aquí solo está el **estado vigente + las reglas**.

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
| Update creatuactivo.com prompt | `node scripts/actualizar-system-prompt-v27.2.mjs` (despliega la versión indicada en `VERSION_LABEL` del script — el archivo conserva el nombre legacy `v27.2`; verificar lo activo con `leer-system-prompt.mjs`) |
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
- ❌ **NO agregar** textos de flujo o respuestas verbatim al System Prompt (`system-prompt-nexus-main-v27_2.md`) — el backend es el dictador absoluto. Todo texto que el modelo deba imprimir exacto va en `getMicroPromptApertura()`, `getMicroPromptCierre()`, `getCierreEstado4()` en `route.ts`, o en `src/lib/respuestas-maestras.ts` (Camino A para chip-triggers WHY_02/EAM_01 + regex EMPRESA_DIGITAL_01)
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
- **3 fuentes** (Playfair Display, Inter, Roboto Mono) — Montserrat, Oswald y Rajdhani NO están cargadas en la web. `BRAND.fonts` en [src/lib/branding.ts](src/lib/branding.ts) son stacks web-safe SOLO para emails (los keys muertos `industrial`/`logo` con Rajdhani se eliminaron jul 2026)
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

**Respuesta canónica WHY_02** — fuente viva: `knowledge_base/arsenal_inicial.txt` BLOQUE 1 (`<verbatim_lock>`), sincronizado carácter por carácter con `MASTER_WHY_02` en `respuestas-maestras.ts`. Desde v5.21–v5.24 (jun–jul 2026) el frame de cara al prospecto es **primeros principios + socios**: *"para que una empresa digital así exista, tres cosas tienen que ser ciertas — **alguien fabrica** (su socio logístico y financiero, Gano Excel) · **una plataforma atiende a las personas** (su socio digital, Queswa) · **usted sabe qué hacer** (un método comprobado) — y en la suya las tres ya están resueltas"* + bisagra *"Usted no entra a Gano Excel; Gano Excel trabaja para usted"*. De cara al prospecto NUNCA "pilares" ni "capas" ni "Máquina Híbrida" (etiquetas internas); el rol del usuario es **Propietario** que dirige. El canon histórico de los Tres Pilares (Matriz Física / Queswa Centro de Mando / Metodología Automatizada) vive solo como arquitectura interna en arsenales profundos — ver [Queswa Vocabulary](#queswa-vocabulary--tabla-canónica-unificada) y memoria `feedback_socios_apalancamiento`.

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

**Estado integración ganocafe.online** (piloto activo · detalle → `public/investigaciones/HANDOFF-GANOCAFE-WIDGET.md`):
- Prompt `ganocafe_main` **v1.5** + `arsenal_ganocafe.txt` (16 respuestas) + 16 fragmentos Voyage, todo tenant `ecommerce`. v1.5 incluye `## NOMBRES COLOQUIALES` (alias → producto).
- ⚠️ **`ganocafe_main` tiene catálogo de precios hardcodeado** en el system prompt (línea "NUNCA uses otros precios") → el modelo ignora el vector search para precios. Al cambiar precios en el arsenal, **también actualizar el system prompt** con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Los dos deben estar sincronizados.
- Widget JS embebido en `/cafe-3en1/index.html` (cPanel, piloto Google Ads CO). Deploy arsenal: `scripts/deploy-arsenal-ganocafe.mjs`. Rollout WordPress ⏳.

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

**Estado integración WABA WhatsApp** (pipeline activo, modo desarrollo · detalle → `public/contexto/handoff/Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md`):
- Webhook `/api/whatsapp/webhook` (Node, 30s). WABA `+573215193909` | Phone Number ID `1115546358301373` | WABA ID `1436663504253230` (`.env.local` + Vercel). Token permanente `WHATSAPP_SYSTEM_TOKEN`. Prompt `queswa_whatsapp` **v1.2**, tenant `whatsapp`. `src/lib/whatsapp-meta.ts` reemplaza SendPulse. CTWA (`referral` de ads Meta) → `device_info`.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` SOLO inserta categorías nuevas — NO actualiza las existentes** (filtra por `category` ya presente y las salta). Para propagar fragmentos *modificados* al tenant whatsapp hay que **purgar primero** `arsenal_inicial_%` del tenant whatsapp y luego clonar; si solo se re-clona sin purgar, los fragmentos quedan **stale**.
- ⏳ Pendiente: Meta business verification (para salir de modo desarrollo), plantillas Meta (`acceso_auditoria_patrimonial` + 5 de secuencia), eliminar credenciales SendPulse.

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
| `arsenal_inicial` | creatuactivo_marketing | **v5.25** (4 jul 2026) | Doctrina base: WHY, STORY, VS, PERFIL, FREQ, CRED, OBJ, VOICE, EAM, CIERRE, ACTIVACION, EMPRESA_DIGITAL, NET + DIASPORA. **55 fragments** (56 respuestas en el .txt — FREQ_04_PUENTE no se fragmenta; su contenido vive en el doc padre). WHY_02 / EAM_01 / EMPRESA_DIGITAL_01 llevan `<verbatim_lock>` sincronizado carácter por carácter con `respuestas-maestras.ts` (Camino A). ⚠️ **STORY_02** (mesa en dos patas — Mocoa, canónica, "NO inventar detalles") + **FREQ_28** con **GUARD diciembre**: meta personal de Luis, NUNCA fecha de lanzamiento (cupos, no calendario). ⏳ Pendiente: fugas "al sistema" en FREQ_02/FREQ_11. Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_inicial). |
| `arsenal_avanzado` | creatuactivo_marketing | **v12.4** (25 jun 2026) | Objeciones complejas, sistema, valor, escalación (18 fragments). ⚠️ **Cifras del plan INTACTAS**. Villano = dependencia, no el trabajo (ver [[feedback_horas_no_son_el_villano]]). Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_avanzado). |
| `arsenal_reto` | creatuactivo_marketing | **v4.7** (12 jun 2026) | Producto funnel "El Diagnóstico de 5 Días" (7 fragments para días 1-5). ⚠️ La **jerga clínica profunda se conserva a propósito** (Déficit Estructural, Re-Arquitectura, Acoplamiento Híbrido, "Ancho de Banda Mental" — esta última **permitida explícitamente en RETO_05**) — ver [[project_reto_12niveles_no_migrar]]. Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_reto-auditoría-patrimonial). |
| `arsenal_compensacion` | creatuactivo_marketing | **v7.3** (12 jul 2026 — composición ESP corregida + upgrades) | Plan de compensación (**42 fragments**). COMP_PAQ_02/03/04 = composición ESP-1/2/3 actualizada (totales 7/18/35 sin cambio) + **COMP_PAQ_05** = tablas de upgrade (ESP-1→2/1→3/2→3, 11/28/17 productos). ⚠️ Los swaps léxicos (v7.x "negocio/empresa digital") son **SOLO de marca** — **cifras/%/GCV/PV/tasas/nombres del plan INTACTOS** (se conservan los "opera" de Gano Excel y "escala por volumen" de la tabla de rangos). **NO modificar vocabulario ni cifras restantes; término "PVP" prohibido.** Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_compensacion). |
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
   - **Versión activa: v29.2 "triada_sin_pronombre"** (3 jul 2026, ~21K chars — verificar con `leer-system-prompt.mjs`, no asumir que local = Supabase). Reglas vigentes: **regla de moneda por país** (Colombia → solo COP · US → USD · resto/desconocido → USD) · tríada sin pronombre ("alguien fabrica · una plataforma atiende a las personas"). ⚠️ **Promesa canónica:** *"Queswa explica, atiende y **madura en cada interesado la decisión de avanzar**, las 24 horas"* (objeto = la decisión, NO la persona → activo sin presionar). **Regla del espejo:** "madura la decisión" SOLO en 3ª persona (los prospectos del usuario); en CTA/interpelación al lector NO se usa verbo sobre *su* decisión — ver [[feedback_promesa_canonica_queswa]]. La calidez humana (el equipo recibe de la mano al que ya decidió) conserva "acompaña". **Contexto reels:** el prompt sabe que la mayoría llega tras ver un reel; el saludo post-reel lo acompaña `getReelGreeting()` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts). Historial → [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md).
   - ⚠️ **El archivo fuente conserva el nombre legacy `system-prompt-nexus-main-v27_2.md`** — no se renombró pese a las versiones internas v28.x. Migración léxico "negocio/empresa digital" aplicada en v28.0–v28.1.
   - Versiones anteriores del archivo eliminadas — viven en git: `git show <hash>:knowledge_base/system-prompt-nexus-main-vXX_Y.md`
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** en `route.ts` — actualizar en Supabase. Fallback alineado a v26.5.
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente. En la **página de catálogo** (`/sistema/productos`) este modo se fuerza vía `pageContext === 'catalogo_productos'` (route.ts `getPageContextInstructions()` — "MODO ASESOR DE SALUD Y BIENESTAR", enviado por `useNEXUSChat`); el frontend acompaña con chips de salud, saludo de asesor, CTAs `open-queswa` y tooltip del orbe contextual (ver [Active Pages → `sistema/productos/`](#5-page-structure--funnel-architecture)).
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `public/investigaciones/HANDOFF-QUESWA-PRECIOS-CVPV.md`.
   - **Cotización por país (Fase 2, jun 2026)** — ver memoria [[project_cotizacion_moneda_local]]. **Problema:** Gano Excel tasa el USD a **$4,500 COP FIJO** (no de mercado). Un colombiano leía "ESP-3 = $1,000 USD" → convertía a TRM (~$3,500) → *"me sobrecobran el dólar a 4,500"*; peor, Queswa **derivaba** la pregunta a un humano. **Solución (2 partes):**
     1. **Fragmento `FREQ_27`** en `arsenal_inicial.txt` (desplegado + clonado al tenant `whatsapp`) — responde el reclamo con 3 palancas: no compras dólares sino productos / precio fijo del fabricante para 70 países (no margen de CreaTuActivo) / **simetría** (la misma tasa que pagas una vez la cobras en CADA comisión, por encima del mercado). Incluye instrucción "NUNCA derivar a un humano". ⚠️ El slot FREQ_24 ya estaba ocupado (Consumidor VIP, fuera de orden en el .txt) → quedó como **FREQ_27**.
     2. **Detección de país + reorden de precios** en `route.ts`: `detectVisitorCountry()` (web = header `x-vercel-ip-country` de Vercel Edge; whatsapp = prefijo telefónico del `fingerprint`). `getPaquetesPricingPin(country)` + pin de composición ahora **país-aware**. **Regla:** precio de paquetes/productos → **moneda local** (CO=COP solo sin USD al lado; US=USD limpio; resto/desconocido=USD+COP con nota de oficina local). Comisiones/ingresos → **ambas monedas**. La IP es default, no verdad: para diáspora la moneda la define el **país de registro** (Queswa confirma, no asume — ver [Reglas de registro diáspora](#queswa-vocabulary--tabla-canónica-unificada) / memoria `project_diaspora_registro_real`).
     - ⏳ **Gap Fase 3:** no hay listas de precios oficiales de Gano por país (MXN, EUR…) ni precios de productos en USD → para no-CO/no-US se cotiza USD como referencia hasta conseguirlas.

**Camino A — Backend Dictador para chip-triggers (May 2026)**:

Las 2 chips canónicas que concentran el ~80% del tráfico inicial (Chip 1 → WHY_02 **"¿Y esto cómo funciona, exactamente?"** y Chip 2 → EAM_01 **"¿Cómo lo haría yo? ¿Qué hago en el día a día?"** — reescritas en v5.16, jun 2026) se sirven desde [src/lib/respuestas-maestras.ts](src/lib/respuestas-maestras.ts) **antes** del Voyage AI + Anthropic. El bypass en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) detecta match exacto sobre `trim().toLowerCase()` contra `QUESWA_QUICK_REPLIES` y, si coincide, construye un `ReadableStream` con la respuesta Master y retorna `StreamingTextResponse` directamente. **Tercer bypass (v5.18)**: queries de texto libre tipo *"¿qué es una empresa digital?"* matchean el regex `RE_QUE_ES_EMPRESA_DIGITAL` (corre tras el match exacto de chips) → sirven `MASTER_EMPRESA_DIGITAL` verbatim (sync con EMPRESA_DIGITAL_01 del arsenal).

Beneficios:
- ✓ **100% fidelidad** al copy calibrado (cero paráfrasis del LLM)
- ✓ **$0 tokens** en Anthropic para esas queries
- ✓ **Latencia ~50ms** vs ~2s del flujo completo

Patrón arquitectónico: mismo que `getMicroPromptApertura()` / `getCierreEstado4()` — el backend dicta texto exacto cuando hay un nodo determinístico. No es un workaround; es la separación canónica entre LLM (interpretación) y backend (copy calibrado).

**Fuente dual de verdad — regla inviolable**: Los textos en `src/lib/respuestas-maestras.ts` deben coincidir carácter por carácter con los bloques `<verbatim_lock>...</verbatim_lock>` en `knowledge_base/arsenal_inicial.txt` (WHY_02 y EMPRESA_DIGITAL_01 en BLOQUE 1, EAM_01 en BLOQUE 8). El arsenal es la doctrina viva; el módulo TS es el caché operativo del backend. Si edita uno, sincronice el otro.

**Camino B (RAG con marcador XML) — fallback para queries naturales**: WHY_01 ("¿Qué es CreaTuActivo?") y queries naturales que coincidan semánticamente con WHY_02/EAM_01 entran por el flujo RAG normal. Las etiquetas XML `<verbatim_lock>...</verbatim_lock>` envuelven el cuerpo de los 3 fragmentos en el arsenal; la sección "REGLA `<verbatim_lock>` — INVIOLABLE" en el system prompt v26.8 ordena al LLM entregar el contenido exacto entre las etiquetas. Reliability esperada ~95-99% (XML tags activan atención post-entrenada en Claude Sonnet 4.6; investigación Gemini Hipótesis C).

**Histórico de fallos doctrinales (no repetir)**: los dos fallos ya son reglas en [Reglas Críticas](#reglas-críticas-no-hacer) (corchetes planos `[VERBATIM_LOCK]` → parafraseo; extracción de `package` en `extractFromClaudeResponse()` → contaminación de BD). No re-introducir ninguno.

**Warm Handoff con sumario ejecutivo (Opción B · activo)**:

El correo al equipo NO lo dispara `getCierreEstado4()` (eso solo dicta la doble oferta wa.me); lo dispara el callback **`onFinal` del stream** en [route.ts](src/app/api/nexus/route.ts), guardado por `closingState === 4 && !_handoffYaEntregado` (solo el primer turno de Estado 4 → sin duplicados). Corre en `onFinal` **tras** entregar el mensaje al prospecto → cero latencia para él, y `onFinal` mantiene viva la función Edge hasta completar el envío (`await` seguro, no fire-and-forget — Edge cortaría un fire-and-forget). Coexisten AMBAS notificaciones: correo al equipo + link wa.me al prospecto.

Cuando entra Estado 4, [src/lib/handoff-sumario.ts](src/lib/handoff-sumario.ts) (`ejecutarWarmHandoff`):

1. `generarSumarioEjecutivo()` — sub-agente Claude Haiku procesa los últimos 15 turnos + `prospectData` y genera JSON estructurado: `{dolores_expresados, objeciones_manejadas, mensajes_clave, next_best_action}`. Latencia ~1s, costo <$0.005 por handoff. Tiene fallback si Haiku falla.
2. `enviarExpedienteEquipo()` — Resend envía email HTML estilo Quiet Luxury a `EQUIPO_DIRECTIVO_EMAIL` (default: `sistema@creatuactivo.com`), from `hola@creatuactivo.com`. Asunto: `[Handoff Queswa] {Nombre} → ESP-X Visionario (Score X/100)`.
3. En paralelo, el prospecto recibe la **doble oferta wa.me** (Estado 4): (a) Activar ahora / (b) Que el equipo me contacte — links con texto pre-llenado (nombre + WhatsApp + paquete).

Fundamento (investigación corporativa Salesforce/Intercom/HubSpot): el traspaso es el momento de mayor abandono — el equipo humano debe recibir matriz táctica ANTES del primer mensaje del prospecto, no después de saludarlo.

**Variable de entorno opcional**: `EQUIPO_DIRECTIVO_EMAIL` (default hardcoded `sistema@creatuactivo.com`). Reutiliza `ANTHROPIC_API_KEY` y `RESEND_API_KEY` ya configuradas.

**UI Design Decisions** (Mar 2026 — no revertir sin justificación):
- **Layout mobile**: Panel anclado al `bottom` con `items-end` (no centrado). Patrón elite apps (Claude, Gemini).
- **Viewport keyboard**: `interactiveWidget: 'resizes-content'` en `src/app/layout.tsx` → fix Chrome 108+ double-jump. Sin esto el área de escritura salta dos veces al abrir teclado.
- **Input**: `<textarea>` con auto-resize (max 120px), `autoCorrect="on"`, `autoCapitalize="sentences"`, `spellCheck`. Enter=enviar, Shift+Enter=salto de línea. Botones (mic/enviar) anclados al `bottom-3` del contenedor. Acepta sustituciones de texto del sistema operativo.
- **Mic integrado en input** (Abr 2026): el ícono mic y el botón enviar comparten la misma posición — toggle según `voiceState`. Patrón idéntico a Claude/Gemini. El orbe NO muestra ícono de mic cuando el chat está abierto (`isOpen`).
- **Quick Reply Chips** (solo `creatuactivo.com`, NO en `queswa.app`): 4 chips en estado inicial (antes de que el usuario escriba). Llaman `handleSendMessage()` directamente. Eliminan el "área muerta" móvil y bajan la barrera de articulación. Fuente de verdad: `QUESWA_QUICK_REPLIES` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts) — son las **4 preguntas reales del avatar** (reescritas en v5.16, jun 2026, para empatizar con el pensamiento real): `¿Y esto cómo funciona, exactamente?` · `¿Cómo lo haría yo? ¿Qué hago en el día a día?` · `¿Cuáles son los productos y para qué sirven?` · `Quiero ver los números: ¿cómo y cuánto se gana?`. Los chips 1 y 2 disparan **Camino A** (bypass backend dictador, [respuestas-maestras.ts](src/lib/respuestas-maestras.ts)) → su texto exacto es key; cambiar el texto exige sincronizar la key allí + el mapa `QUESWA_QUICK_REPLIES_EXPANSION`. **Excepción catálogo** (`/sistema/productos`): `NEXUSWidget` detecta la ruta y muestra `QUESWA_PRODUCTS_QUICK_REPLIES` (3 chips de salud: beneficios / estudios científicos / seguridad del Ganoderma) en vez de las 4 de negocio, y **oculta el CTA "Suscríbete"** — Queswa es asesor de salud allí (jun 2026). Esos chips NO entran a Camino A ni al mapa de expansión (RAG normal → `catalogo_productos`).
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
| `/api/subscribe` | Node | — | Newsletter "Suscríbete" (jun 2026) — upsert `funnel_leads` (source `newsletter`) + adjunta correo al prospecto (update_prospect_data) + bienvenida institucional (Equipo CreaTuActivo) + aviso a `sistema@`. Single opt-in; pendiente double opt-in + envío real. Ver [[project_newsletter_suscripcion]] |
| `/api/fundadores` | Node | 10s | Founder registration |
| `/api/diagnostico` | Edge | 30s | Audit/self-assessment — guarda quiz + arquetipo en tabla `diagnosticos` |
| `/api/diagnostico/interpretar` | Edge | 30s | Narrativa personalizada del diagnóstico — Queswa (Haiku 4.5) escribe titular+cuerpo desde las 5 respuestas; `{ok:false}` (HTTP 200) si falla → frontend usa fallback determinístico |
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
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services, `/mapa-de-salida`, `/reto-5-dias`, `/negocio-digital` (URLs legacy redirigidas — sus páginas Next ya no existen; van siempre a red para que los redirects 301 funcionen)

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
                         /confirmacion (Bridge Page)
                              ↓
                         Email Secuencia 5 Días — Auditoría Patrimonial (Nurture)
                         5 videos: /empresa-digital/dia-1 … dia-5
                              ↓
                         /fundadores (Oferta)

Tráfico SEO (Blog) → /blog/* (Shadow Funnel)
                              ↓
                         /empresa-digital o /fundadores

Nota: /reto-5-dias/* y /mapa-de-salida/* ya NO son páginas Next — solo redirects
en next.config.js (→ /empresa-digital; sus /gracias → /confirmacion)
```

> 🔤 **NAMING DEL FUNNEL (rename ejecutado jun 2026).** Producto de entrada = **"El Diagnóstico de 5 Días"** (antes "Auditoría Patrimonial"); URL actual = **`/empresa-digital`** (dir `src/app/empresa-digital/`; antes `/auditoria-patrimonial` → `/negocio-digital`). Redirects **301** en `next.config.js` apuntan DIRECTO las URLs viejas y sus subrutas → `/empresa-digital` (correos/blogs/reels publicados siguen vivos); SW bypass incluye las viejas. ⚠️ **Gotchas vivos:** (1) `source: 'auditoria-patrimonial'` en `empresa-digital/page.tsx:96` es **identificador interno de tracking** — coordinar con backend antes de cambiarlo; (2) el diagnóstico de la squeeze conserva «que usted siga trabajando» a propósito (villano = **dependencia**, no el trabajo — [[feedback_dolor_real_por_nicho]]); (3) `arsenal_reto` conserva su jerga clínica deliberadamente ([[project_reto_12niveles_no_migrar]]). **El callout 🏠 de abajo supersede el rol de gancho del Diagnóstico** (desconectado de Home/menú; `/empresa-digital/*` quedan dormidas con 301 vivos). Ver [[project_lexico_negocio_digital]].

> 🏠 **HOME REPOSICIONADA (jun 2026) — supersede lo de arriba PARA LA HOME + EL MENÚ.** El "Diagnóstico de 5 Días" producía **cero aplicaciones** (pedir commitment a tráfico frío sin confianza "olía a desesperado") → se **desconectó como gancho**. La Home (`src/app/page.tsx`) ahora lidera con **"Sea dueño de su empresa digital"** y su estructura es: Hero → Diagnóstico (villano limpio estilo Slide 1) → **¿Qué es una empresa digital?** (Bezos/MercadoLibre + ejemplo `sonrisaslindas.app`) → Perfiles → **Cómo lo hacemos nosotros** (la decisión desde-cero-vs-apalancamiento + 3 pilares: Respaldo/Gano · Queswa · Método Expandir/Activar/Multiplicar) → aforismos → calculadora → Visión → CTA. **CTAs nuevos:** cuerpo → **"Hablar con Queswa"** (`QueswaCTAButton`, evento `open-queswa`); **menú** → **"Suscríbete"** (`SubscribeModal` → `/api/subscribe`). Las páginas `/empresa-digital/*` quedan **dormidas** (301 vivos) — **ya NO se enlazan como gancho desde la Home/menú** (sí se conservan para correos/reels ya publicados). El **resto del sitio + servilleta** se alinea aparte vía `HANDOFF_BARRIDO_SITIO_SERVILLETA.md`. **Doctrina nueva** (Gano = respaldo, nunca titular del ingreso; calidez-no-auditoría en Activar; paleta de analogías Nubank/Amazon-ML/Rappi/McDonald's; confianza > entendimiento → contenido da contexto, el 1-a-1 cierra) → memorias [[project_home_reposicion_2026]] · [[feedback_gano_respaldo_no_titular]] · [[feedback_confianza_precede_entendimiento]] · [[reference_paleta_analogias]] · [[project_newsletter_suscripcion]]. ⏳ Pendiente arsenales+system prompt (incl. `arsenal_inicial.txt` línea ~510 "usted revisa/da el sí" → nadie audita).

**Active Pages** (rutas no-obvias — el resto se descubre con `ls src/app/`):

- `empresa-digital/` — 🎯 FUNNEL ENTRY v4.0 (noindex). **Producto = "El Diagnóstico de 5 Días"** (cuerpo en registro accesible). URL `/empresa-digital` — rename desde `/auditoria-patrimonial` **hecho jun 2026** (+ redirects 301). Squeeze page + `[constructorId]/` re-exporta la misma página. `dia-1/` a `dia-5/` cada uno con variante `[ref]/` para distribuidor.
- `confirmacion/` — Bridge Page v4.0 (noindex; `/auditoria-confirmada` redirige 301 aquí). `TrackingConfirmada.tsx` ('use client') dispara evento `vio_bridge_auditoria`; ⚠️ conserva `source: 'auditoria-confirmada'` como **identificador interno de tracking** (contrato con backend — NO renombrar al cambiar el slug).
- `reto-5-dias/` y `mapa-de-salida/` — **páginas eliminadas (jun 2026)**. Ya NO existen como directorios Next; viven **solo como redirects 301 en `next.config.js`**: la raíz y subrutas → `/empresa-digital`, los `/gracias` → `/confirmacion`. El SW bypass conserva ambas URLs (+ `/negocio-digital`) para que los redirects funcionen (van siempre a red).
- `calculadora/` — Calculadora de ingresos (indexada).
- `diagnostico/` — **Landing huérfana standalone para tráfico pagado** (Meta/Google Ads; cero links internos, sin `<StrategicNavigation/>`, entrada solo por URL de campaña). Quiz de 5 preguntas; resultado escrito por **Queswa IA** vía `POST /api/diagnostico/interpretar` (Haiku 4.5) con doctrina de villano (el sistema, NUNCA el esfuerzo del héroe; villano contextual), **fallback determinístico si la IA falla** (`ok:false`). Sin gráfica radar. Persiste en `/api/diagnostico` (tabla `diagnosticos`, insert resiliente con/sin columna `name`) + arquetipo por promedio de tier. **Botón final → `/confirmacion`**.
- `paises/` — Páginas por destino con sub-ruta dinámica `[destino]/` (ej. `brasil/`).
- `[slug]/` — **Mini-landing personal del Arquitecto de Patrimonio** (`creatuactivo.com/luis-cabrejo`). Micro-sitio personalizado con foto, frase y links del constructor. OG dinámico para WhatsApp. Lee de `constructor_slugs` (slug, display_name, foto_url, frase_personal, whatsapp) + `private_users` (affiliation_link, profile_photo_url). ❌ NO es para blog slugs — esos van bajo `/blog/`.
- `[slug]/[destino]/` — **Bifurca** según el segundo segmento: si `[destino]` ∈ `REEL_NICHOS` **renderiza** la página de Reel (`<ReelPage>`); si `[destino] === 'manifiesto'` **renderiza** el Manifiesto de los Fundadores compartible con atribución (URL limpia `/{slug}/manifiesto` — el `ref` se inyecta a `localStorage`, sin `?ref`; OG image dedicado en `/manifiesto/opengraph-image`); si no, ejecuta el **redirect** con tracking. `DESTINO_MAP` en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) resuelve destinos cortos (home, auditoria, **diagnostico**, calculadora, productos, servilleta, activacion, dia-1..dia-5) a rutas reales con `?ref={constructorId}`. Los slugs de nicho y `manifiesto` no colisionan con `DESTINO_MAP`. Ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp).
  - ⚠️ **GOTCHA (cuesta horas): un destino que NO esté en `DESTINO_MAP` (ni en nichos/manifiesto) cae al fallback `redirect(/{slug})` = la mini-landing, SIN 404.** Síntoma típico: "el enlace `/{slug}/X` lleva a la mini-landing". Caso real (19 jun 2026): `El Diagnóstico de 5 Días` del Arsenal apuntaba a `/{slug}/diagnostico` y caía a la mini-landing hasta que se agregó `'diagnostico' → /diagnostico?ref` al mapa. Al sumar un enlace amigable nuevo en el Dashboard (`src/lib/arsenal.ts`), agregar SIEMPRE su destino aquí.
  - ⚠️ **OG por página estática:** la página destino (ej. `/diagnostico`) debe declarar su **propio `openGraph.url`** en su `layout.tsx`/metadata. Si solo define `title`/`description` y NO `openGraph`, hereda el del root layout (`og:url = dominio raíz`) → al compartir en **Meta**, la publicación enlaza a la raíz aunque el enlace pegado sea correcto. Fix de `/diagnostico` (19 jun 2026): `openGraph.url = '/diagnostico'` (metadataBase lo absolutiza). Tras corregir, forzar re-scrape en el [Sharing Debugger](https://developers.facebook.com/tools/debug/) (Meta cachea el OG viejo).
- `manifiesto/` — **Página pública del Manifiesto de los Fundadores** (`/nosotros` redirige aquí 301; rótulo de menú: **Nosotros**). Narrativa de posicionamiento (April Dunford) + CTA WhatsApp del arquitecto; `opengraph-image.tsx` propio. Cuerpo en [`<ManifiestoDocument/>`](src/components/ManifiestoDocument.tsx) (compartido con `/{slug}/manifiesto`); H1 = **NUESTRA FILOSOFÍA** + lema *"Las cosas no pasan. Se hacen pasar."* ⚠️ "Manifiesto de los Fundadores" persiste como **nombre del documento** (OG, texto WhatsApp, secciones §01–08), NO como H1 — es deliberado.
- `presentacion-empresarial/` — Herramienta interna para 1-on-1, **NO está en el menú público**.
- `infraestructura/` — Implementación de referencia del sistema Bimetallic v3.0. Leer antes de crear nuevas páginas.
- `sistema/productos/` — 🛒 **Catálogo e-commerce "Clinical Luxury"** (indexada; `page.tsx` es la **página viva** — `'use client'`, bioEmerald. `catalogo-productos.tsx` es duplicado WIP sin enlazar, NO es la fuente viva). **Queswa aquí = ASESOR DE SALUD Y BIENESTAR**: backend en modo `pageContext === 'catalogo_productos'` (route.ts `getPageContextInstructions()`, enviado por `useNEXUSChat`) + frontend con chips de salud `QUESWA_PRODUCTS_QUICK_REPLIES` (NO las 4 de negocio; CTA "Suscríbete" oculto), CTAs `open-queswa`, y tooltip del orbe por ruta. **Léxico Fundador retirado del catálogo**: nada de "Fundador"; enlaces de negocio → **Home**; FAQ en léxico accesible ("su organización" no "su red"). **Carrito**: `localStorage` (carga con `try/catch` + filtra productos inexistentes), pre-carga `?carrito=id1,id2`, checkout por WhatsApp del distribuidor. ⚠️ **Envío SIN valor fijo**: carrito muestra "Por definir según ciudad y volumen" (NO hardcodear flete). Orbe se auto-oculta al abrir el carrito (`data-nexus-button`).
- `animaciones/diaX/` — Canvas-based social video renderer (Dan Koe style). Variantes A/B con sufijos `-v3` a `-v6`.
- `servilleta/` — Deck interactivo v6.7 de 4 slides. **Migrado al sistema Lujo Silencioso (15 May 2026)** — usa los mismos tokens que el resto del sitio (`--color-brand`, `--color-bg-elevated`, `--font-sans`, etc.). Slides 1 (qué es una empresa digital) y 2 (primeros principios) son card-scrollers con **b-rolls 3D** y portada propia — ver [Servilleta Digital](#servilleta-digital---interactive-presentations).
- `paquetes/` — Protocolo de Capitalización v3.0. CTAs → WhatsApp pre-filled con nombre+USD+COP.
- `planes/` — 4 planes de suscripción. Sin Framer Motion ni `backdropFilter` (decisión de performance).
- `reto-12-niveles/` — Landing "Los 12 Niveles" (con variante `[ref]/`, layout y OG image propios). `/reto-12-dias` redirige 301 aquí. Contenido servido por `arsenal_12_niveles` — tuteo deliberado, NO migrar a registro accesible.
- `activo-que-sobrevive-a-su-ausencia/` — Deck keynote de conferencia (SER PRO Internacional · Luis Cabrejo). noindex, herramienta interna de presentación en vivo (F = fullscreen, flechas/swipe).
- `offline/` — PWA fallback.

**SEO Strategy** (Dic 2025):
- **Indexed pages**: `/`, `/fundadores`, `/blog/*`, `/tecnologia`, `/sistema/productos`, `/paquetes` (⚠️ `/socios` y `/webinar` fueron eliminadas — commit `6110e9a` "purga global tuteo + eliminar 4 páginas obsoletas")
- **noindex pages** (funnel interno): `/empresa-digital/*` (Squeeze + 5 videos "El Diagnóstico de 5 Días") · `/confirmacion` (Bridge v4.0) · `/manifiesto` (Manifiesto). Slugs viejos (`/auditoria-patrimonial`, `/auditoria-confirmada`, `/nosotros`, `/reto-5-dias/*`, `/mapa-de-salida/*`) → redirects 301.

**Dynamic `[ref]` Routes**: Landing pages support referral tracking via `/page-name/referrer-id`.

**Navigation** ([src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) — array `directLinks`):
- **Desktop/Mobile Menu**: Nosotros (`/manifiesto`) · Tecnología (`/tecnologia`) · Presentación (`/servilleta`) · Insights (`/blog`) + **"Suscríbete"** CTA (abre `SubscribeModal` → `/api/subscribe`; reemplazó "Auditoría Patrimonial"/"Iniciar Diagnóstico" en la reposición de la Home jun 2026 — ver callout 🏠 abajo)
- ⚠️ **Los rótulos NO coinciden con sus rutas a propósito** (decisión Jun 2026 — el menú nombra *qué encuentra el visitante*, no la ruta técnica): "Nosotros" abre la página Manifiesto; "Presentación" abre el deck Servilleta. Esto reemplazó "Manifiesto / El Sistema / Herramientas" (rótulos con fricción o ambiguos).
- **Mobile CTA**: **"Suscríbete"** (abre `SubscribeModal`; antes "Unirme al Reto" → /empresa-digital)
- **Removed from menu**: Soluciones, Ecosistema, Auditoría
- **Presentación Empresarial**: `/presentacion-empresarial` sigue siendo herramienta interna 1-on-1, fuera del menú. ⚠️ NO confundir con el item público "Presentación" → `/servilleta`

### Servilleta Digital - Interactive Presentations

Sales presentation tools for 1-on-1 conversations. **Desde 15 May 2026 usa el mismo sistema de diseño Lujo Silencioso del sitio principal** (no más "Industrial Realism" / paleta steel-orange). La servilleta hereda tokens semánticos via las variables locales `--bg-dark`, `--concrete`, `--steel`, `--orange` que ahora apuntan a tokens globales (`--color-bg-primary`, `--color-bg-elevated`, `--color-titanium-dark`, `--color-brand`).

| Version | Route | Style |
|---------|-------|-------|
| v6.7 (Main) | `/servilleta` | 4-slide deck; **slides 1 y 2 son card-scrollers con b-rolls 3D + portada** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)); fullscreen (F key), keyboard nav, swipe |
| v6.7 (Ref) | `/servilleta/[constructorId]` | Re-exports main page; constructorId read from URL path client-side for tracking |

**Controls**: Arrow keys/Space (avanzar), F (fullscreen), double-click fuera de clip (fullscreen), **swipe horizontal desde cualquier punto** (mobile), **tap sobre un clip = pausa/play solo en táctil** (en desktop el click avanza; pausa desktop = botón central al hover)
**Typography**: `var(--font-sans)` Inter (headings) + `var(--font-mono)` Roboto Mono (data) — unificado con homepage
**Color Palette**: Lujo Silencioso — hereda los tokens del [Design System](#design-system-bimetallic-v30) (Carbón + Dorado Champán + Titanio) + Cyan `#22D3EE` como único acento de data exclusivo de la servilleta

#### Contenido y copy — fuente de verdad

⚠️ **El copy verbatim de las 4 slides NO se duplica aquí** (se desincronizaba con cada recalibración). Fuentes vivas:
- **Copy renderizado de las slides** (nav, H1/H2, CTAs, `getLifestyleTranslation`, etc.) → [src/app/servilleta/page.tsx](src/app/servilleta/page.tsx) (deck v6.7).
- **Narración / teleprompter aprobada** → [guion_maestro_servilleta_v3.md](public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md) + su variante `_TELEPROMPTER.md` (⚠️ nombre de archivo legacy `v3` — el contenido es **v5.8**, 3 jul 2026).

Estructura de las 4 slides (**v6.7** — reorden aplicado en v6.5/v6.6): **01 SU EMPRESA DIGITAL** (portada "CREE SU EMPRESA DIGITAL" + 3 cards de *qué es una empresa digital*: depende de que usted esté ahí · **son el puente** (Amazon/MercadoLibre) · imagine el suyo — clips `empresa-tradicional / empresa-digital / sonrisaslindas`) · **02 "3 COSAS TIENEN QUE SER CIERTAS"** (primeros principios: Gano Excel, socio logístico y financiero · Queswa, socio digital · el Método — clips `respaldo / queswa / metodo`) · **03 EL PRODUCTO** · **04 SIMULADOR**. Slides 1 y 2 son **card-scrollers simétricos**: cada una abre con SU portada (índice 0) y sigue con 3 clips (1-3); el nombre visible lo pone el `<h3>` HTML, **no el video** → un cambio de léxico NO requiere re-render. La card de Queswa (slide 2) tiene el botón inline que dispara `open-queswa` CustomEvent.

⚠️ **Léxico**: el deck v6.2 ya está migrado al registro accesible. El copy "Abr 2026" que vivía aquí (PATRIMONIO PARALELO, Base Operativa, UNIDAD DE SUMINISTRO, "tecnología nutricional") es **léxico retirado** — no reintroducir (ver [Queswa Vocabulary](#queswa-vocabulary--tabla-canónica-unificada)).

#### Arquitectura Mobile (Abr 2026 — no revertir)

**Slides 1 y 2**: Grid de 3 tarjetas (`.card-industrial`). **Desde jun 2026 el fondo es un `<video>` 3D full-bleed** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)), no una imagen split:
- `.card-bg` aloja el `<video>` con **`object-fit: contain` + fondo carbón** → muestra el objeto 3D completo sin recorte (el letterbox es invisible: el clip ya es carbón `#0F1115`). **NO** revertir a `object-fit: cover` ni al split `height: 50%` (recortaba el 3D)
- `.card-content`: overlay absoluto al pie con degradado — solo el **nombre** (slide 1) o nombre + botón Queswa (slide 2 card-1). Sin párrafos ni tachados (name-only)
- Cards inactivas: `filter: brightness(0.45)` → activa: `brightness(1)`; borde activo/hover **dorado** (`var(--orange)`, no cyan)
- `one-card-mode` generalizado de `#slide-2` a `.one-card-mode` (CSS) → aplica a slide 1 y 2; ambas comparten `activeCardIndex` (portada índice 0 + 3 clips índices 1-3, `maxCardIndex=3`)
- ⚠️ **Navegación de card (v6.7 supersede el "bug del salto"):** el índice NO se resetea en ningún efecto — cada ruta lo fija explícitamente: avanzar/`showSlide` → 0 (portada) · **retroceder → `LAST_CARD` (última card de la slide destino)**. El IntersectionObserver de scroll fue **eliminado** (one-card oculta las cards no activas con `display:none` → nunca intersectaban; su mapeo por offset corrompería los índices actuales)

**Slide 3**: `.slide-3-layout` es `flex-direction: column; justify-content: flex-end` en mobile — slide-3-bottom y CTA apilan verticalmente (NO flex-direction: row que hace flotar el CTA a la derecha).

**Slide 4**: Scroll-snap vertical en mobile — dos snap items de `100vh`:
1. `.simulator-panel` — calculadora (INGRESO INMEDIATO / INGRESO RECURRENTE)
2. `.cta-panel` — imagen `boton-accion.jpg` (top 48%) + zona texto (bottom 52%)
   - `.bg-image-cta`: `grayscale(100%) brightness(50%)` por defecto
   - Desktop: imagen gris hasta hover (CSS `:hover` puro — NO setTimeout auto-reveal)
   - Mobile: `ctaVisible` state + IntersectionObserver → `cta-revealed` → color al scroll-snap
   - `#slide-4 { padding-top: 0 }` en fullscreen — elimina espacio negro vacío del HUD
   - **Distribución del overlay:** imagen `48%` + overlay `top: 48%`. **Mobile normal** = `justify-content: center`; **fullscreen mobile** = `justify-content: flex-start` (la `.mobile-nav` se oculta y centrar empujaba el 2º botón fuera de pantalla). ❌ NO unificar ambos a `center`.
   - **Swipe: exoneración SOLO en `<input>`:** `touchSwipeIgnore` ignora el swipe únicamente si el touch nace sobre un `input` (arrastrar el thumb de un slider es horizontal legítimo). ❌ NO añadir `.simulator-panel` ni tabs/botones a esa lista (bloquea el swipe-back del Slide 4). Guard de eje |dx|>|dy| evita que el scroll vertical del simulador cambie de slide. `handleSlideClick` SÍ conserva la lista amplia (click-to-advance dentro del simulador sería caos). Snap del Slide 4 = `proximity` (no `mandatory`) + `.simulator-panel` con `justify-content: flex-start`.
   - Botón primario "ACTIVAR SU EMPRESA DIGITAL →": `width: 100%`, naranja dominante → `/paquetes`
   - Botón secundario "SUSCRIBIRSE AL BOLETÍN →": outline, más angosto → abre `SubscribeModal` (newsletter; OPCIÓN 2 del guion v5.1). Antes empujaba al Diagnóstico de 5 Días → `/empresa-digital`, desconectado como gancho jun 2026

#### B-rolls 3D en Slides 1 y 2 (jun 2026)

Slides 1 (qué es una empresa digital) y 2 (primeros principios) usan **b-rolls 3D** como fondo de cada card, en vez de imágenes. Pensado para uso **en vivo en mobile**: cada b-roll muestra **solo el nombre** (Luis narra el resto). Diseño: el video llena la card (`object-fit: contain`, ver bloque Mobile arriba) y la gráfica debe **explicar sin texto**.

**Assets servidos** (Vercel/Next desde `/public`, no Blob) en [public/videos/servilleta/](public/videos/servilleta/): el deck v6.7 usa 6 clips — `empresa-tradicional · empresa-digital · sonrisaslindas` (slide 1) + `respaldo · queswa · metodo` (slide 2), todos `.mp4`. Son los b-rolls IA (Veo/Vertex) del reel explainer de la Home, CON AUDIO (720×1280 CRF28 + AAC). Prompts/doctrina → `HANDOFF_BROLLS_HOME.md` + `GUIA_IDENTIDAD_VISUAL_IA.md` §9. Reproducción: `preload="none"` + **control central de media** (un solo efecto gobierna TODOS los videos por `data-slide`/`data-card`: la slide abandonada se pausa+rebobina+mutea; en one-card SOLO la card activa reproduce y suena desde 0s; en grid desktop los 3 reproducen EN MUTE).

**UX de clips (v6.7 — no revertir):** tap sobre el clip = pausa/play **SOLO en táctil** (en desktop el click conserva el avance de presentación); **un solo control de pausa, el central** (⏸ al hover en desktop / ▶ persistente al pausar); **retroceso de slide aterriza en la ÚLTIMA card** de la slide destino (`LAST_CARD`, no la portada); **swipe horizontal navega desde CUALQUIER punto** (`touch-action: pan-y` en `.deck-container` + `onTouchMove`/`onTouchCancel`) con guard de eje |dx|>|dy|. Investigación: `public/contexto/produccion/INVESTIGACION_UX_SERVILLETA_SCROLL_VIDEO.md`.

**Fuente histórica (comps Remotion)** → [scripts/dankoe-video/motion/src/](scripts/dankoe-video/motion/src/): las comps `Matriz3D/IAOnda3D/Checklist3D` (con guard `{(eyebrow||title||sub) && (...)}`) y `Expandir3D/Activar3D/Maestria3D` ya **NO alimentan el deck** (reemplazadas por los b-rolls IA) pero siguen sirviendo a los **reels** — no quitar el guard ni des-registrarlas de `Root.tsx`.

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

**Queswa en Servilleta** (decisión Director 2 jul 2026 — la burbuja sobre los clips NO es la experiencia buscada):
- El orbe flotante **nunca se muestra** en `/servilleta`. Gate en `UnifiedQueswaOrb`: `pathname === '/servilleta' && !visibleInServilleta && !isOpen → null` — el componente monta SOLO mientras el chat está abierto y desaparece al cerrarlo. La página **no despacha** `show-queswa-orb`
- El chat abre únicamente desde el botón "PREGÚNTALE ALGO EN VIVO" (card Queswa de slide 2, dispara `open-queswa`)
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
| `creatuactivo.com` | `nexus_main` | `actualizar-system-prompt-v27.2.mjs` (despliega la versión indicada en `VERSION_LABEL` del script — apunta a `system-prompt-nexus-main-v27_2.md`; tanto el script como el archivo conservan el nombre legacy `v27.2`/`v27_2`. Verificar siempre con `leer-system-prompt.mjs`) |
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
| `getCierreEstado4()` | `closingState === 4` | Dicta la **doble oferta wa.me** al prospecto (a) Activar ahora / (b) Que el equipo me contacte. El **correo** al equipo NO sale de aquí — se dispara en `onFinal` del stream (`closingState===4 && !_handoffYaEntregado`), ver Warm Handoff |

**`sessionInstructions` (Bloque 3 — no cacheable):**
- M1: inyecta `getMicroPromptApertura()` (texto verbatim, ignora Pirámide McKinsey)
- M2+: inyecta `📍 ${getMessageContext()}` para orientación del modelo
- Siempre incluye: `getPageContextInstructions()`, `getMicroPromptCierre()`, `getCierreEstado4()`, `<prospect_state>`

**Regla crítica**: NO agregar textos de flujo al System Prompt. El System Prompt es perfil de personalidad puro (identidad + tono + diccionario). Cualquier texto que el modelo deba imprimir verbatim va en las funciones de micro-prompt del backend.

**Clasificador único de marcha — FUENTE DE VERDAD del cierre:** La intención de cierre se decide en **un solo lugar** (`marchaCierre`, route.ts tras `mergedProspectData`), del que derivan `isClosingFlowEarly`, el FSM y la supresión de RAG → no se pueden desincronizar. **Modelo de 3 marchas** — el discriminador es **gramática + recorrido**, NO la palabra "inicio/iniciar" (contaminada: vive en "paquetes de inicio"=info y "quiero iniciar"=intención):

| Marcha | Señal | RAG | Resultado |
|--------|-------|-----|-----------|
| **1 Catálogo** | `señalCatalogo` — pide opciones/valores ("cuáles son los paquetes / de inicio", "formas de inicio") | tabla dictada | Estado 2 informativo (tabla + pregunta exploratoria). **NUNCA ofrece activación** |
| **2 Interés** | nombra UN paquete sin volición (`prospectData.package` de ESTE turno), O frase procedimental EN FRÍO | **ON** | Estado 0 + `marchaInteres` → respuesta sustanciosa del arsenal + **puente suave** (sin pedir datos). Fuerza Sonnet |
| **3 Firme** | `señalVolicion` ("quiero iniciar/hagámoslo/me decido/dónde pago") **O** `señalProcedimental` + `yaRecorrioProceso` | off | con paquete → Estado 3 (pedir nombre); sin paquete → Estado 2 `modoCierre` (tabla + nombre+nivel) |

- **`yaRecorrioProceso`**: el bot ya mostró paquetes, O la conversación tocó compensación, O el usuario ya preguntó precios/paquetes, O hay paquete en BD. Convierte lo procedimental ("ok, ¿cuál es el paso a seguir?") en intención de pagar. En frío esa misma frase es Marcha 2.
- **Guardas**: `_contextoNoCierre` (café/producto/"si se acaba" → no es avance de cierre, evita falso positivo de "qué hago") · `_esInformativaCierre` ("qué es/incluye el ESP-3" → no es selección).
- **`_aceptaConexion` → Marcha 3 (19 jun 2026)**: cuando el bot ofrece conectar con el equipo (`_botOfrecioConectar`, lee el ÚLTIMO msg del bot) y el usuario acepta (`_usuarioAcepta`: "de acuerdo / sí / dale / listo…"), **O** el usuario pide explícitamente conexión (`_señalConectarEquipo`: "conécteme con el equipo / quiero que me contacten"). Sin paquete cae a Estado 2 modoCierre = **pide el nivel primero** (decisión Director Cabrejo). Cierra el hueco donde el modelo improvisaba el handoff (inventaba "en 24 horas", compartía contacto suelto) y no llegaba a Estado 4 (→ no se enviaba correo).

**Continuación del cierre escriturado** (independiente de la marcha, lee lo que el bot ya pidió):
1. `_handoffYaEntregado` (doble oferta Estado 4 ya dada) → Estado 0
2. `_whatsappSolicitado && package && nombreValido && (WhatsApp ahora O guardado)` → Estado 4
3. `_botPidioNivelCombinado && package` (modoCierre) → con nombre → Estado 3b · solo nivel → Estado 3
4. `_nombreSolicitado3a && package` → con nombre → Estado 3b · sin nombre → Estado 0 (no insistir)

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

Archivos fuente y versiones actuales → ver la [tabla de arsenales](#1-nexus-ai-chatbot). Scripts de deploy por arsenal: `deploy-arsenal-inicial.mjs` · `deploy-arsenal-avanzado.mjs` · `deploy-arsenal-reto.mjs` · `deploy-arsenal-12-niveles.mjs` · `actualizar-catalogo-productos.mjs` · `deploy-arsenal-compensacion.mjs`. Luego `fragmentar-arsenales-voyage.mjs` (embeddings Voyage) y verificar con `audit-completo.mjs` (preferido — `verificar-arsenal-supabase.mjs` tiene bug PGRST116).

**Falsa alarma del audit — `desconocido: 40 fragmentos`**: `audit-completo.mjs` clasifica por `metadata.parent_arsenal`; cuando ese campo no está poblado etiqueta "desconocido" aunque la `category` esté bien. Los 40 son fragments reales de `arsenal_compensacion` + los **docs maestros padre** (`arsenal_inicial/ganocafe/reto/marca_personal`, `catalogo_productos`) + `catalogo_productos_PROD_OVERVIEW`. ⚠️ **NO ELIMINAR ninguno** — los docs maestros los necesita el fragmentador para parsear (`.eq('category', arsenalCategory)`). El warning es cosmético; se limpia poblando `metadata.parent_arsenal`.

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

**Documento completo → [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md)** (extraído de CLAUDE.md jul 2026 — leerlo ANTES de ensamblar cualquier reel). Resumen operativo:

- Acabado cinematográfico de reels en M1, todo por código: entrada = export CapCut ya graduado (**SIN música — pista en mute**, o el pipeline la entierra); salida = 1080×1920·24fps con subtítulos (forced alignment `ctc-forced-aligner` + Pillow PNG overlay — **NO libass**), motion graphics Remotion (`--gl=angle` en M1), SFX sintetizados (`motion/sfx.py` → `out/kit/`), música por actos (suspense→corporativa, el cambio cae exacto en el pivot narrativo leído del `*_stamps.json`) y mezcla **voz-anclada** a −14 LUFS (nunca loudnorm sobre toda la mezcla).
- Variante b-roll 100% IA (clips Gemini/Veo + VO ElevenLabs) con logo-bug que tapa la marca ✦ de Gemini. ⚠️ Gotcha zsh: arrays desde 1 y variables de `filter_complex` se vacían en funciones — ffmpeg con filtros va inline.
- Recetas completas en PIPELINE.md: reel de nicho (módulo solución compartido), reel reflexivo de documentación (talking-head + atmósfera grano/halation/viñeta), desenfoque de fondo tipo retrato (`seg_blur.py`, **--blur 10** validado), SFX puntuales, y `clean-pipeline.sh` para purgar intermedios (~9 GB recuperados).
- Niveles de música calibrados por Luis — **al alza, nunca bajar**: nicho 0.80 (networkers 0.90) · reflexivos 1.00 en ambas camas.

### Reels por Nicho (fase orgánica WhatsApp)

6 reels verticales por nicho que cada **Arquitecto de Patrimonio** comparte por WhatsApp a su mercado orgánico: **5 de tráfico** (corporativo · empleados · empresarios · diaspora · informales, con el bloque de solución compartido) + **1 especial `networkers`** (gremio del mercadeo en red que ya conoce a Luis y estuvo en Gano Excel — **estructura propia**, hook/diagnóstico/solución/CTA bespoke, NO usa el módulo compartido). Cada reel vive en `creatuactivo.com/{slug}/{nicho}` + tracking de referido. **NO** se publica reel nativo en IG/TikTok en esta fase.

**Jerarquía de conversión en la página** (secuencial, no compite — investigación CTA May 2026: un solo CTA por momento convierte mejor):
1. **Reel 9:16** alto en pantalla (ojos en el tercio superior; `padding-top` mínimo).
2. **Copy del nicho** (título serif + cuerpo).
3. **Queswa = vía rápida**: al terminar el reel **o** al hacer scroll dejándolo atrás, el `ReelVideo` muestra una burbuja sobre el orbe — copy *"Puedo auditar la viabilidad de su caso ahora mismo. ¿Comenzamos?"* (registro Modulación: autoridad clínica "auditar la viabilidad" + invitación accesible "¿Comenzamos?"; eco del reel, sin ancla de tiempo) → al tocarla dispara `open-queswa`. La burbuja se **oculta** a los 25 s, al volver al video (IntersectionObserver) y al abrir el chat (evento `queswa-opened` que emite el orbe).
4. **Tarjeta YouTube** (presentación de 7 min) — vía reflexiva, facade nativo **full-bleed** (todo el ancho en móvil, cap 680px en desktop).
5. **Los 2 escenarios de cierre del video**: `Diagnóstico de 5 Días` (→ `/empresa-digital?ref`; rótulo migrado desde "Auditoría de 5 Días" jun 2026) + `Activación Inmediata · WhatsApp` (verde, → WhatsApp del arquitecto). La activación NO pasa por Queswa: quien ya decidió no debe encontrar preguntas de cualificación (analogía constructora/concesionario). El botón de compartir (`ShareButton`) dice **"Compartir este diagnóstico"**.

- **Fuente de verdad**: [src/lib/reels.ts](src/lib/reels.ts) — `REEL_NICHOS` (`corporativo`, `empleados`, `empresarios`, `diaspora`, `informales`, `networkers`), `REEL_ASSETS` (solo `{ video }`, URLs Blob), `REEL_COPY` (título/cuerpo/audiencia, versión final aprobada por Luis), `SERVILLETA_YOUTUBE_ID`, `REEL_POSTER`/`REEL_POSTER_OG` (poster branded de fallback) y **`REEL_POSTER_OVERRIDE`** (poster por-nicho).
- **Poster por-nicho (jun 2026)**: con los reels ya en 3D, cada nicho usa un **frame del propio reel** como portada (más nítido y representativo que el branded genérico). `REEL_POSTER_OVERRIDE[nicho] = { poster: '…-poster.webp', posterOg: '…-poster.jpg' }` — los 5 nichos tienen override. Se generan del master con `ffmpeg -ss 0.5 … scale=1080:1920` (jpg q2) + `sharp` a webp; ambos en `public/videos/reels/`, **commiteados** (servidos por Next, no por Blob). `ReelPage`/`generateMetadata` usan el override y caen a `REEL_POSTER`/`REEL_POSTER_OG` si un nicho no lo tiene. `metadataBase` resuelve la ruta relativa del OG a absoluta.
- **Componentes** (construidos May 2026): [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) bifurca render-reel vs redirect; [src/components/ReelPage.tsx](src/components/ReelPage.tsx) (Server Component, estética Bimetálica); [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) ('use client' — video `preload="none"` + burbuja Queswa con auto-hide/scroll/chat); [src/components/YouTubeFacade.tsx](src/components/YouTubeFacade.tsx) ('use client' — miniatura `maxresdefault` + play, iframe carga al click). `generateMetadata` emite OG de video + `REEL_POSTER_OG` (`robots: noindex`). Botón WhatsApp usa clase `.cta-whatsapp` (verde) en globals.css.
- **Orbe en reels**: [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) suprime su tooltip "Concierge" automático (~2s) cuando `isReelRoute` (pathname `/{slug}/{nicho}` con nicho ∈ `REEL_NICHOS`) — el reel controla su propia burbuja. ⚠️ El orbe es global; el cambio está aislado por ruta para no afectar el resto del sitio.
- **Tracking de referido**: como el reel se renderiza inline (no redirige), `ReelPage` resuelve `constructor_id` del slug e inyecta un `<script>` inline (corre **antes** del `tracking.js` diferido) que setea `?ref={constructor_id}` vía `history.replaceState` + `localStorage.constructor_ref`. Atribución idéntica a aterrizar en `/empresa-digital?ref=id`. Funciona para cualquier arquitecto (slug dinámico), no solo `luis-cabrejo`.
- **CTA WhatsApp del arquitecto**: el número vive en **`private_users.whatsapp`** (fuente de verdad — igual que `/api/constructor/[id]` y `/sistema/productos`), **NO** en `constructor_slugs.whatsapp`. El branch del reel lo resuelve por `constructor_id` con fallback al número orgánico `+573206805737`. ⚠️ Bug histórico "cero inicial" en esos números (ver `whatsapp-validator.ts` del repo Dashboard) — el `.replace(/\D/g, '')` lo neutraliza.
- **Engagement tracking** (Reels Engagement Fase 1, Jun 2026): [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) instrumenta el comportamiento del prospecto y reporta a [`/api/track/engagement`](src/app/api/track/engagement/route.ts) (que mergea sin retroceder en `device_info` → webhook Supabase → push al arquitecto en queswa.app). **Contrato de datos cerrado con el Dashboard — NO renombrar los campos**: `reel_nicho`, `reel_pct` (máx % visto), `reel_completed` (✅ push "Vio el reel completo"), `reel_time_s` (segundos activos), `queswa_opened` (✅ push "Abrió Queswa"), `queswa_messages`, `visit_count` (✅ push "Volvió a visitar"). **Anti-spam (CRÍTICO)**: cada escritura dispara el webhook → mantener **≤ ~6 escrituras por sesión**. Reportar solo en milestones del reel (25/50/75/100), `queswa_opened` una vez, y `reel_time_s`+`visit_count` en el beacon de salida (`navigator.sendBeacon`). NO escribir en cada `timeupdate` ni en heartbeats. Handoff: [HANDOFF_REELS_ENGAGEMENT_FASE1.md](HANDOFF_REELS_ENGAGEMENT_FASE1.md).
- **Estado**: **los 6 reels están en 3D y en producción**. Los **5 de tráfico** (corporativo · empleados · empresarios · diaspora · informales) usan inserts 3D de diagnóstico por nicho + módulo de solución compartido (pilares/CTA/outro), atmósfera, subtítulos, música 0.80 y SFX. El **6º, `networkers`**, tiene **estructura propia** (villano `Pulso3D`, inserts bespoke, suspense 0.90 en hook+diagnóstico) y su **música de solución la montó Luis en CapCut** (no el pipeline — deliberado). Masters en `scripts/dankoe-video/masters/{nicho}-3d.mp4` (gitignored); Blob `reels/{nicho}.mp4` (web CRF23). ⏳ Pendiente: "tres pilares"→"3 pilares" en el módulo compartido (re-deploy de los 5). Handoff: `HANDOFF_REELS_PAGINAS.md`.
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

**Reel HOME (desplegado — v2 del explainer, ~187s):** el explainer 9:16 vive en el hero de [src/app/page.tsx](src/app/page.tsx) vía [src/components/HomeManifestoVideo.tsx](src/components/HomeManifestoVideo.tsx) (reemplazó el `YouTubeFacade`/`SERVILLETA_YOUTUBE_ID`). Talking-head Luis + 10 b-rolls IA (Veo/Vertex; la coordinación luz/sonido que Veo no da fiable se compone por código sobre el máster — ver `HANDOFF_BROLLS_HOME.md`), subtítulos karaoke por forced alignment, música por actos montada en CapCut (pipeline: loudnorm −14 del mix), outro canónico. Asset en Blob (`home/home-manifesto.mp4`, misma URL) + poster `public/videos/home/poster.webp` — constantes `HOME_MANIFESTO_VIDEO`/`HOME_MANIFESTO_POSTER` en [src/lib/reels.ts](src/lib/reels.ts). **Comportamiento:** autoplay muted con chip "ACTIVAR SONIDO"; al terminar (`onEnded`) se desvanece en 1000ms y, si sigue ≥40% en viewport, dispara `open-queswa` + foco en `#queswa-chat-input`; si el usuario scrolleó lejos NO se secuestra el foco. **Master:** `scripts/dankoe-video/masters/reel-home.mp4` + stamps/guión/audio en `captions/work/home_*` (un ajuste = re-render parcial, no empezar de cero); base CapCut en `~/Downloads/clips-reel-home/reel-home-final/`.

### Founder Spots Counter

**Location**: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)

**Status**: Static counter showing 150 spots. Dynamic system paused waiting for real sales data. Las fases ya no muestran fechas (retiradas jul 2026 — doctrina sin fecha dura) y el countdown estático con fechas vencidas fue reemplazado por la card "se cierra por cupos, no por calendario".

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

**Fases del Lanzamiento** — ⚠️ **sin fechas duras** (decisión 31 May 2026): la ventana la cierra el cupo, no el calendario. Las fechas vencidas y el countdown estático de `/fundadores` fueron retirados (jul 2026).

1. **Lista Privada** - 150 Founder spots (Fundadores = MENTORES) — fase actual
2. **Pre-Lanzamiento** - 22,500 Constructor spots (150 × 150)
3. **Lanzamiento Público** - Target: 4M+ users

⚠️ **150 vs 15 — no confundir**: **150** = cupos totales de la Lista Privada (contador estático en [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)); **15** = núcleo de socios estratégicos de la fase de cimentación — el número que usan Queswa y los arsenales (ver Queswa Official Constants). Antes de citar cualquiera de los dos en copy nuevo, confirmar con el Director cuál aplica.

**Actualizar fechas**: `node scripts/actualizar-fechas-prelanzamiento.mjs` (legacy — hoy la página no muestra fechas).

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
- `handoff-sumario.ts` - **Warm handoff** (RE-ACTIVADO 19 jun 2026) — sub-agente Haiku genera expediente táctico + envía email HTML al equipo directivo (sistema@creatuactivo.com) via Resend cuando entra Estado 4 del FSM. Disparado en `onFinal` del stream (await, no fire-and-forget — Edge cortaría un fire-and-forget); coexiste con la doble oferta wa.me al prospecto
- `queswa-greeting.ts` - Saludo canónico de Queswa + chips `QUESWA_QUICK_REPLIES` (single source of truth — antes duplicado en 4 lugares). También exporta `QUESWA_PRODUCTS_QUICK_REPLIES` (3 chips de salud para `/sistema/productos` — Queswa asesor de salud y bienestar)
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
| `/reto-5-dias/*` | Eliminada (301) | Página Next borrada jun 2026 — solo redirect en `next.config.js` → `/empresa-digital` (`/gracias` → `/confirmacion`) |
| `/mapa-de-salida/*` | Eliminada (301) | Página Next borrada jun 2026 — solo redirect en `next.config.js` → `/empresa-digital` (`/gracias` → `/confirmacion`) |
| `/auditoria-confirmada` | Legacy (301) | Slug renombrado a `/confirmacion` (jun 2026) — redirige allí |
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

**Location**: `scripts/` directory (~48 scripts). La mayoría requiere variables de `.env.local`; corre `ls scripts/` para la lista completa. Abajo solo los que llevan gotcha o no son auto-descriptivos.

**NEXUS System Prompt**: `leer-system-prompt.mjs` (lee de Supabase — no asumir local=DB) · `descargar-system-prompt.mjs`. `actualizar-system-prompt-v27.2.mjs` despliega la versión de `VERSION_LABEL` (hoy **v29.2**, ~21K); ⚠️ el script y el archivo conservan el **nombre legacy `v27.2`/`v27_2`** — las versiones anteriores viven en git + `CHANGELOG-system-prompts.md`.

**Knowledge Base**: `deploy-arsenal-{inicial,avanzado,reto,12-niveles,compensacion}.mjs` + `actualizar-catalogo-productos.mjs` (deploy por arsenal) · `verificar-arsenal-supabase.mjs` / `descargar-arsenales-supabase.mjs`.

**Embeddings (Voyage)**: `fragmentar-arsenales-voyage.mjs` (crea fragments con embeddings; salta los existentes) · `audit-completo.mjs` (audit completo: cuenta fragments, detecta huérfanos y embeddings faltantes — preferido) · `purgar-fragmentos-duplicados.mjs` · `regenerar-embeddings-voyage.mjs`. ⚠️ `actualizar-fragmentos-modificados.mjs` tiene fragments HARDCODED — **NO** usar como genérico (ver [Updating Queswa Knowledge](#updating-queswa-knowledge)).

**Database**: `verificar-esquema-completo.mjs` · `diagnostico-seguridad-supabase.sql` (chequea RLS) · `fix-rls-seguridad-supabase.sql` (habilita RLS + policies).

**Testing**: `test-contador-cupos.mjs` (15 escenarios del contador) · `test-flow-reto-completo.mjs` (E2E funnel reto) · `validar-schema-funnel-leads.mjs` / `diagnostico-funnel-leads.mjs`.

**Video**: `optimize-video.sh` (multi-res, FFmpeg) · `upload-to-blob.mjs` · `generate_lut.py` → `naval_style.cube` (LUT 3D Naval/Dan Koe; re-generar si se borra) · `davinci_naval.py` (DaVinci: LUT + export 1080/720/poster) · `dankoe-video/process_video.py` (**Fase 1** remoción de fondo BiRefNet/CoreML M1 → 1080×1920). **Fase 2 subtítulos** ya automatizada por forced alignment + Pillow (ver [Reel Post-Production Pipeline](#reel-post-production-pipeline-scriptsdankoe-video)); WhisperX/CapCut descartados. Setup Fase 1: `python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt` (BiRefNet ~973MB → `~/.u2net/`); nube: `dankoe-video/colab_birefnet.ipynb`.

**PWA / SEO**: `generate-favicons.mjs` (PNG desde favicon.svg, requiere sharp) · `gsc-extractor.mjs` (Google Search Console — ver Analytics abajo).

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

**Regla de oro**: Todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido. La **única fuente de verdad** de vocabulario aprobado/prohibido son las tablas completas en **[BRANDING.md §7](BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido)**; esta sección conserva la doctrina de migración + las prohibiciones de alta frecuencia.

> 📖 **Las tablas COMPLETAS (Vocabulario APROBADO + PROHIBIDO, ~60 términos con razón de prohibición) viven en [BRANDING.md §7](BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido).** Consúltalas antes de calibrar copy. Abajo solo las prohibiciones que un agente encuentra a diario:

**Prohibiciones de alta frecuencia** (el resto → BRANDING.md §7):
- **filtrar / filtro / descartar** → conversar · madurar la decisión · reconocer quién está listo ([[feedback_filtrar_prohibido]])
- **Maestría** (3er Comando) → **Multiplicación** ([[project_rename_maestria_multiplicacion]])
- **guía / acompaña** (lo que Queswa hace con la decisión) → **madura** ("madura la decisión", SOLO 3ª persona — regla del espejo) ([[feedback_promesa_canonica_queswa]])
- **cambiar horas/tiempo por dinero** (villano) → el villano es la **DEPENDENCIA** ("no depende de su presencia", no "de sus horas") ([[feedback_horas_no_son_el_villano]])
- **operar / operador** (de cara al prospecto) → hacer el trabajo / trabajar / funcionar; el usuario: dirigir / ser dueño
- **escalar** (el activo del usuario) → **multiplicar**
- **soberanía financiera** → tranquilidad / estabilidad / seguridad (EXCEPCIÓN: el lema de Luis se conserva)
- **"esto" / "eso"** para auto-referirnos → nombrar concretamente qué es
- **oportunidad de negocio · libertad financiera · ingreso pasivo · reclutamiento · sé tu propio jefe** → (eliminar — filtran como MLM)
- **perseguir / convencer** → (eliminar — plantan objeciones inexistentes); **pasivo** → recurrente
- **Máquina Híbrida · capas** → los tres Pilares; **Hardware/Software** → El Músculo / El Cerebro
- ⚠️ **Mostrar USD a visitante de Colombia** → **CO = SOLO COP** para TODO (precios Y comisiones, tasa fija $4,500); US = USD limpio; resto = USD (+COP). País-aware en `getPaquetesPricingPin`/`precioPaqueteLinea`/`getPinCifrasGEN5`/`getTablasComisiones`
- **PII hardcodeada en arsenales** → nunca (seguridad)

**Constantes canónicas de vocabulario** (los números → ver [Queswa Official Constants](#modifying-nexus-behavior)): Tres Pilares (NUNCA "capas"/"Máquina Híbrida") · Tridente EAM = Expandir · Activar · Multiplicación · 90% automatizado · 70 países (Gano) · 15 países operativos (CreaTuActivo) · 15 cupos Fundadores.

**Cierre v5.2 (May 2026) — frase canónica única**: cuando el prospecto pregunta cómo se inicia, Queswa entrega FREQ_03 (los 3 niveles ESP + pregunta de selección) en `<verbatim_lock>`. Sin entrevista BANT, sin "equipo de Dirección Estratégica", sin "Asignación de Capital". El FSM avanza a Estado 3 (nombre) → Estado 4 (warm handoff automático).

## Luis Cabrejo's Real Story (Epiphany Bridge)

**Master Document**: [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Use this for all storytelling.

**Key Quote**: "La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."

| Duration | Use Case |
|----------|----------|
| 60 seconds | Reels, TikTok, Squeeze Page |
| 3 minutes | Bridge Page (`/confirmacion`) |
| 7 minutes | Webinar, Presentations |

### Two Different Audiences

| Audience | Villain | Page |
|----------|---------|------|
| **8,000 personal contacts** (friends, family, ex-Gano) | Plan por defecto | /empresa-digital, /fundadores |
| **Traditional networkers** (know MLM) | "Haz una lista de 100" | (página `/socios` eliminada — commit `6110e9a`; audiencia sin landing dedicada actualmente) |

**Content Style**: Naval Ravikant - philosophical, value-first, no direct selling. Reference: "The Almanack of Naval Ravikant".
