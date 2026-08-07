# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (**Queswa**, formerly NEXUS - rebranded in v15.0) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

**Design System**: "Quiet Luxury" with Bimetallic Accents v3.0 - See detailed guide below

**Funnel Strategy**: Russell Brunson methodology - Squeeze Page → Bridge Page → Offer (see Section 5)

> 🧭 **SI ERES NUEVO, LEE PRIMERO (en este orden):** (1) [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer) — lo que rompe producción · (2) [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy) — cómo se escribe aquí (⚠️ **la migración a léxico accesible ya está en código; nunca "corrijas" copy accesible hacia el término viejo**) · (3) [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) — contexto de negocio. El **historial con fecha** de cada subsistema vive en sus CHANGELOGs/handoffs (enlazados en cada sección); aquí solo está el **estado vigente + las reglas**.

> 📚 **Este archivo se carga en cada sesión — manténgalo delgado.** Lo que es *referencia* vive en documentos hermanos y aquí solo queda el puntero: [BRANDING.md](BRANDING.md) (diseño + tablas de léxico) · [docs/SERVILLETA.md](docs/SERVILLETA.md) (deck) · [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md) (post-producción de reels) · [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](docs/handoff/reels/VIDEO_Y_ANIMACIONES.md) · [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) (estrategia, voz, historia del fundador) · [docs/README.md](docs/README.md) (índice general). **Antes de agregar una sección larga aquí, pregúntese si es una regla que se aplica a diario o una referencia que se consulta.**

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Development Commands](#development-commands)
3. [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer)
4. [Performance — Estado Actual](#performance--estado-actual-abr-2026)
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
9. [Important Patterns & Constraints](#important-patterns--constraints) → [Design System](#design-system-bimetallic-v30)
10. [Utility Scripts](#utility-scripts)
11. [Deployment](#deployment)
12. [Key Documentation Files](#key-documentation-files)
13. [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy)

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
npm run start        # Serve the production build (tras npm run build)
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
- ❌ **NO modificar** el texto de `getCierreEstado4()` sin actualizar los regex de detección en `route.ts` — hoy son `_handoffYaEntregado` (`/WhatsApp Directo de Activación|mesa directiva|sintetizado su evaluación|Su acceso oficial está aquí/i`) y `nombreSolicitado` (`grep -n "nombreSolicitado" src/app/api/nexus/route.ts`). Si el texto cambia y los regex no, el FSM genera handoffs duplicados o pierde estado. ⚠️ **No cite números de línea aquí** — `route.ts` tiene ~4.800 líneas y se corren en cada edición; use `grep -n` sobre el identificador
- ❌ **NO re-introducir** la extracción de `package` desde `extractFromClaudeResponse()` (eliminado 22 May 2026, Fix G). Causaba contaminación silenciosa de `data.package` cada vez que Claude mencionaba el paquete en una respuesta informativa ("ESP-3 incluye 35 productos"). La captura debe venir **exclusivamente** del usuario con `packageMap` + guard de pregunta informativa.
- ❌ **NO disparar Estado 4 sin validar nombre** — el FSM debe verificar con `extractNameFromHandoffReply()` que el usuario respondió con un nombre. Si responde con pregunta o pide pausar, mantener Estado 0 (responder libre) y conservar `package` en BD para el próximo intento. Bug crítico documentado QA 22 May 2026.
- ❌ **NO eliminar `<verbatim_lock>` de PROD_OVERVIEW/BEB_01/LUV_01/SUP_01/PERS_01** en `catalogo_productos.txt`. Sin él, el modelo aluciona nombres simplificados ("Ganotea" en lugar de Oleaf Gano Rooibos, "Gano Cocoa" en lugar de Gano Schokolade, "Gano Supreme" inexistente) y omite categorías enteras (mencionando solo 2 de 4). Bug confirmado QA 22 May 2026, resuelto con v7.2.
- ❌ **NO re-implementar Anthropic Prompt Caching** — ya está activo en `route.ts` con 3 bloques (system base + arsenal + session instructions); localícelo con `grep -n "cache_control" src/app/api/nexus/route.ts`. Logging `[CACHE HIT]`/`[CACHE MISS]` (`cache_read` vs `cache_creation`) unas 30 líneas más abajo. Gemini lo propuso como "Fase 3" en investigación May 2026 sin saber que ya existe — verificado en Fase 0 (23 May 2026). Solo medir hit rate cuando llegue tráfico real.
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS (Cookie Banner in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) handles all consent UX)
- ❌ **NO guardar** PII en localStorage (solo fingerprint/session IDs)
- ❌ **NO hacer commit** de `.env.local`, API keys o secretos
- ❌ **NO agregar** `backdropFilter: blur()` en cards del homepage — elimina GPU compositing en paint inicial
- ❌ **NO agregar** `priority` a imágenes decorativas del hero — usar `loading="lazy"` para que no compitan con LCP
- ❌ **NO editar** archivos `*.tsx.bak` — son respaldos inactivos, no fuente viva
- ❌ **NO declarar** un segundo `<h1>` en el cuerpo si la página ya usa `<IndustrialHeader>` — rompe SEO/a11y. Si necesitas un título visualmente prominente, usa `<h2>` con `font-serif`. Bug recurrente — ver [BRANDING.md §2, jerarquía de encabezados](BRANDING.md#jerarquía-de-encabezados-regla-unificada--23-may-2026)
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
1. **EXPANSIÓN** - Generación de tráfico (reels por nicho + contenido) y distribución del ecosistema
2. **ACTIVACIÓN** - Queswa AI conversa y reconoce a quien levantó la mano (NO "filtra" — ver léxico prohibido); constructor cierra con los listos
3. **MULTIPLICACIÓN** - El 3er Comando (renombrado desde "Maestría" jun 2026, ver [[project_rename_maestria_multiplicacion]]). Multiplicar la empresa digital está a un clic en todo el continente — resuelve el cuello de botella de crecer que atasca a cualquier negocio tradicional. Queswa forma a cada persona nueva (la formación/Academia queda como medio, NO como gancho — "crecimiento personal" en la encuesta = inseguridad, no deseo real)

**Rol del héroe — DIRECCIÓN EJECUTIVA** (elevado en v19.6, Mar 2026):
- La labor del constructor es **puramente gerencial**: suministra la "materia prima" (tráfico) al ecosistema
- La tecnología hace la ejecución técnica; el constructor toma las decisiones de expansión
- **Lenguaje aprobado**: "Director de Expansión", "Dirección Ejecutiva", "orquesta los comandos"
- **Lenguaje prohibido**: "Tu Rol (El Director)" como tercer elemento plano — debe estar bajo METODOLOGÍA (Ejecución Exacta)
- En toda respuesta que explique la Máquina Híbrida, el tercer elemento es METODOLOGÍA, no un rol de ejecución

**Respuesta canónica WHY_02** — fuente viva: `knowledge_base/arsenal_inicial.txt` BLOQUE 1 (`<verbatim_lock>`), sincronizado carácter por carácter con `MASTER_WHY_02` en `respuestas-maestras.ts`. Desde v5.21–v5.24 (jun–jul 2026) el frame de cara al prospecto es **primeros principios + socios**: *"para que una empresa digital así exista, tres cosas tienen que ser ciertas — **alguien fabrica** (su socio logístico y financiero, Gano Excel) · **una plataforma atiende a las personas** (su socio digital, Queswa) · **usted sabe qué hacer** (un método comprobado) — y en la suya las tres ya están resueltas"* + bisagra *"Usted no entra a Gano Excel; Gano Excel trabaja para usted"*. De cara al prospecto NUNCA "pilares" ni "capas" ni "Máquina Híbrida" (etiquetas internas); el rol del usuario es **Propietario** que dirige. El canon histórico de los Tres Pilares (Matriz Física / Queswa Centro de Mando / Metodología Automatizada) vive solo como arquitectura interna en arsenales profundos — ver [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy) y memoria `feedback_socios_apalancamiento`.

### 1. NEXUS AI Chatbot

**Naming**: User-facing brand is "Queswa" (since v15.0). Code/components still use "NEXUS" prefix (no refactor planned). Use "Queswa" in UI text, "NEXUS" in code references.

**Ecosistema de proyectos** (todos comparten el mismo Supabase DB):

| Proyecto | Rol de Queswa | System Prompt | Estado |
|----------|---------------|---------------|--------|
| `creatuactivo.com` | Filtrar prospectos para funnel Fundadores | `nexus_main` | Activo |
| `luiscabrejo.com` | Marca personal — posicionar a Luis, redirigir a creatuactivo.com | `marca_personal_v1.0` | Activo (Mar 2026) |
| `queswa.app` | Chief of Staff del Director Ejecutivo — CRM + pipeline + mensajes | `queswa_dashboard` (en route.ts) | Activo (Mar 2026) |
| `ganocafe.online` | Soporte de producto + venta directa e-commerce | `ganocafe_main` | Activo (Mar 2026) |
| **WABA WhatsApp** | Responde prospectos inbound desde anuncios Meta + orgánico | `queswa_whatsapp` **v2.5 en Supabase** (el v3 local NO está desplegado) | Activo — negocio **verificado** y WABA **APPROVED** (comprobado 4 ago 2026) |

**Regla crítica multi-proyecto**: Un cambio en `system_prompts.nexus_main` afecta SOLO `creatuactivo.com` (caché 5 min). `luiscabrejo.com` usa `marca_personal_v1.0` — prompts independientes desde Mar 2026.

**En `luiscabrejo.com`**: tenant hardcodeado como `marca_personal` en `route.ts` (sin middleware — repo siempre es ese tenant). La ruta `/api/claude-chat/route.ts` es legacy sin uso.

**Estado integración ganocafe.online** (piloto activo · detalle → `docs/handoff/queswa/HANDOFF-GANOCAFE-WIDGET.md`):
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

**Handoff doc para agente widget**: `docs/handoff/queswa/HANDOFF-GANOCAFE-WIDGET.md`

**Estado integración WABA WhatsApp** — ✅ canal **operativo**: negocio `verified`, cuenta `APPROVED`, número `CONNECTED` + `quality_rating: GREEN` (Graph API, 4 ago 2026).

> 📄 **Estado detallado, historial de Meta y decisiones abiertas → [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](docs/handoff/queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md)** (el más reciente) · arquitectura del pipeline → [Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md](docs/handoff/queswa/Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md). **No duplique aquí el estado de la cuenta de Meta** — cambia solo y se desincroniza.

- Webhook `/api/whatsapp/webhook` (Node, 30s). WABA `+573215193909` | Phone Number ID `1115546358301373` | WABA ID `1436663504253230` (`.env.local` + Vercel). Prompt `queswa_whatsapp` — ⚠️ **lo que CORRE en Supabase es v2.5** (5.805 chars, 31 jul 2026), verificado por consulta. El archivo `knowledge_base/system-prompt-queswa-whatsapp-v3.md` (8.269 chars) y el script `...-v3.mjs` existen pero **nunca se desplegaron**: `VERSION_LABEL` es lo que se pretende, no lo que corre. Comprobar siempre contra la BD. CTWA (`referral` de ads Meta) → `device_info`.
- ⚠️ **Tres números, no confundirlos**: `+57 321 519 3909` = el WABA (Queswa) · `+57 320 341 5438` = personal de Luis (el 1-a-1) · `+57 320 680 5737` = WhatsApp Business en su móvil, `WHATSAPP_ORGANICO_DEFAULT` (fallback de reels).

**Reglas que rompen el canal si se ignoran:**
- ⛔ **NO tocar el nombre visible mientras `name_status` esté en revisión** — cada guardado abre una solicitud nueva que pisa la anterior; así se perdió una aprobación previa de "Queswa". Meta permite 10 cambios cada 30 días.
- ⛔ **NO ejecutar `request_code` / `verify_code`** sobre un número `CONNECTED` que funciona. `code_verification_status: EXPIRED` **no bloquea el envío** (medido el 4 ago con `hello_world` entregada); el error #131037 era un riesgo del manual, no algo activo.
- ⚠️ **Ventana de 24 h**: si la persona escribe primero se responde en **texto libre**; iniciar conversación con quien nunca escribió **exige plantilla aprobada**, sin excepción.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` SOLO inserta categorías nuevas — NO actualiza las existentes** (salta las que ya están). Para propagar fragmentos *modificados* al tenant whatsapp hay que **purgar primero** `arsenal_inicial_%` del tenant whatsapp y luego clonar; si no, quedan **stale**.
- 🟢 **El App Review de Meta NO hace falta para este caso de uso** (auditoría cerrada 26 jul 2026). Los permisos figuran "rechazados" y el canal opera igual: sobre activos propios basta el *Acceso estándar*. Solo se retoma si se decide que **cada socio conecte su propio número**. No re-someter sin eso.

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

⛔ **La FSM de cierre del motor NO aplica a WhatsApp** (aislada 5 ago 2026). Los estados 2/3/4 fueron escritos para la web y su último paso entrega **dos enlaces `wa.me` al número del WABA** — a alguien que escribe desde adentro de esa misma conversación. En `route.ts` el guard es `cierreLoManejaElCanal` (`tenantId === 'whatsapp'`): apaga `getMicroPromptCierre()`, `getCierreEstado4()`, la supresión de RAG de `isClosingFlowEarly` y la de `arsenalParaCierre` (sin texto dictado, el RAG es la única fuente de precios). El cierre del canal vive en [src/lib/wa-radicacion.ts](src/lib/wa-radicacion.ts) → `pending_activations`. **NO reactivar la FSM web para el tenant whatsapp.**

**Capa de canal + puente al Dashboard** (jul 2026):
- **`src/lib/wa-channel.ts` es el ÚNICO lugar que habla con graph.facebook.com** y que conoce `WHATSAPP_SYSTEM_TOKEN`: `sendText` · `sendTemplate` · `listTemplates` · `getPhoneAsset`. Si Meta cambia de versión de API, se toca este archivo y nada más.
- **Puente server-to-server** para que el Dashboard opere el canal sin ver el token: `GET /api/wa/assets` + `POST /api/wa/send`, autenticados con header **`x-wa-bridge-secret`** = env `WA_BRIDGE_SECRET` (mismo valor en ambos proyectos de Vercel). ⚠️ **Si la env no está definida el puente DENIEGA** (503) en vez de abrirse.
- **División de responsabilidad:** marketing = plano de datos (token, webhook, envío). Dashboard = plano de control (permisos, UI humana). La consola vive en `queswa.app/admin/wa-tester`. **No copiar el token al Dashboard** — cualquier superficie nueva consume el puente.
- ⏳ **Estrategia Queswa-WhatsApp (WIP)**: captación 1-a-1 del arquitecto → Home (video + Queswa) → cierre en espacio en vivo o llamada. El "plan de dos niveles" (ingreso inmediato + duplicación 2×2 → $103.194.000) es el contexto central; vive en `arsenal_12_niveles` y en el slide 4 de `/12-niveles`.
- ⏸️ **STANDBY**: el "empujón" de Queswa hacia el espacio en vivo del arquitecto queda diferido. Hoy el único empuje al humano es el **warm handoff** (Estado 4 → oferta wa.me). Queswa **no conoce el horario** de cada arquitecto, así que el empujón sería genérico.

**Scripts WABA:**
- `node scripts/actualizar-system-prompt-whatsapp-v3.mjs` — actualiza system prompt WhatsApp en Supabase (`VERSION_LABEL = v3.0`). El `...-v1.mjs` sigue en `scripts/` pero es la versión vieja — **no** usarlo
- `node scripts/clonar-arsenal-whatsapp.mjs` — clona fragmentos arsenal_inicial al tenant whatsapp


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
| `arsenal_avanzado` | creatuactivo_marketing | **v12.4** (25 jun 2026) | Objeciones complejas, sistema, valor, escalación (18 fragments). ⚠️ **Cifras del plan INTACTAS**. Villano = dependencia, no el trabajo (ver [[feedback_horas_no_son_el_villano]]). Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_avanzado). || `arsenal_compensacion` | creatuactivo_marketing | **v7.3** (12 jul 2026 — composición ESP corregida + upgrades) | Plan de compensación (**42 fragments**). COMP_PAQ_02/03/04 = composición ESP-1/2/3 actualizada (totales 7/18/35 sin cambio) + **COMP_PAQ_05** = tablas de upgrade (ESP-1→2/1→3/2→3, 11/28/17 productos). ⚠️ Los swaps léxicos (v7.x "negocio/empresa digital") son **SOLO de marca** — **cifras/%/GCV/PV/tasas/nombres del plan INTACTOS** (se conservan los "opera" de Gano Excel y "escala por volumen" de la tabla de rangos). **NO modificar vocabulario ni cifras restantes; término "PVP" prohibido.** Historial → [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md#arsenal_compensacion). |
| `arsenal_12_niveles` | creatuactivo_marketing | **v5.0** (20 jul 2026 — léxico accesible) | Los 12 Niveles (13 fragments: NIVELES 1-7 + INV 1-6). **Migrado a usted** + "red"→"organización" (conserva "Kit de Inicio" y cifras/PV/CV del plan). NIVELES_02 corregido ($103.194.000 exacto = 25.200×(2¹²−1)); NIVELES_04 sin formulario roto; NIVELES_01 audiencia (nuevos + empresario activo). Activa con "12 niveles"/"kit de inicio" **+ "2×2"/"duplicación"/"103 millones"/"simulador"** (v5.0). |
| `catalogo_productos` | creatuactivo_marketing | **v7.2** (22 May 2026) | 22 productos + ciencia (Lujo Clínico). Fragmentado en 25 fragments + doc maestro. PROD_OVERVIEW + BEB_01/LUV_01/SUP_01/PERS_01 con `<verbatim_lock>` para evitar alucinaciones de nombres (Ganotea/Gano Cocoa/Gano Supreme) y omisión de categorías. Bug pendiente: CV/PV en respuestas individuales. |
| `arsenal_marca_personal` | marca_personal | **v1.1** (Abr 2026) | Identidad/historia/metodología Luis Cabrejo (11 respuestas) — para luiscabrejo.com. |
| `arsenal_ganocafe` | ecommerce | **v1.5** (Mar 2026) | Productos GanoCafe (16 respuestas) — para ganocafe.online. |

**Historial completo de cambios por arsenal** → [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

2. **Clasificación de documentos — 3 capas + override**:
   - **PASO -2 (CQR — anclaje de la consulta)**: [src/lib/query-rewrite.ts](src/lib/query-rewrite.ts) colapsa la conversación en una consulta autónoma **antes** de buscar. Sin ancla temática, un "sí", "panadero" o "y eso cómo sería" recupera ruido y el modelo rellena el vacío con su memoria de entrenamiento (donde "empresa digital" = infoproductos). ⚠️ **Hoy está limitado al tenant `whatsapp`** y se salta en precios / query simple / flujo de cierre — ver el bloque `consultaRecuperacion` en `route.ts`. Gate barato `necesitaReescritura()` (≤8 palabras o deíctico) evita pagar la llamada al modelo; **degrada con gracia** — si falla, se busca con el mensaje original
   - **PASO -1 (MenuExpansion)**: Opciones a/b/c/d del menú inicial se expanden a queries semánticas
   - **PASO 0 (Vector)**: Voyage AI embedding → similitud coseno → threshold 0.4 mínimo
   - **PASO 0.5 (Override crítico)**: Previene falsos positivos vectoriales. Si el vector devuelve `arsenal_compensacion` pero la query es "cómo funciona el negocio" o variante → fuerza `arsenal_inicial`. Está en el array `patrones_inicial` de `clasificarDocumentoHibrido()` (buscar el comentario `FIX 2026-05-19: WHY_02`).
   - **PASO 1 (Patrones)**: Fallback regex si vector no alcanza threshold

   **Falso positivo conocido (resuelto Mar 2026)**: `COMP_MODELO_01` tiene "¿Cómo funciona el negocio?" como trigger → el vector lo confundía con WHY_02. El override en PASO 0.5 lo corrige.

   **Excepción ecommerce (Mar 2026)**: `isSimpleQueryEarly` retorna siempre `false` cuando `tenantId === 'ecommerce'`. En ganocafe.online cualquier query puede ser sobre un producto — no hay queries "simples". Esto garantiza que mensajes de 1–3 palabras ("el té", "cereal", "jabón") igualmente pasen por vector search.

3. **Data Capture** - `captureProspectData()` extracts:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification

4. **System Prompt** - Stored in Supabase `system_prompts` table (name: `nexus_main`)
   - **Versión activa: `v29.5_compartir_recibir_multiplicar`** — es el `VERSION_LABEL` de [scripts/actualizar-system-prompt-v27.2.mjs](scripts/actualizar-system-prompt-v27.2.mjs), es decir lo último que se **intentó** desplegar. ⚠️ **Verificar siempre lo que corre en Supabase con `node scripts/leer-system-prompt.mjs`** — local ≠ DB. Las reglas de abajo se calibraron en v29.2 "triada_sin_pronombre" (3 jul 2026) y siguen vigentes salvo lo que el CHANGELOG diga. Reglas vigentes: **regla de moneda por país** (Colombia → solo COP · US → USD · resto/desconocido → USD) · tríada sin pronombre ("alguien fabrica · una plataforma atiende a las personas"). ⚠️ **Promesa canónica:** *"Queswa explica, atiende y **madura en cada interesado la decisión de avanzar**, las 24 horas"* (objeto = la decisión, NO la persona → activo sin presionar). **Regla del espejo:** "madura la decisión" SOLO en 3ª persona (los prospectos del usuario); en CTA/interpelación al lector NO se usa verbo sobre *su* decisión — ver [[feedback_promesa_canonica_queswa]]. La calidez humana (el equipo recibe de la mano al que ya decidió) conserva "acompaña". **Contexto reels:** el prompt sabe que la mayoría llega tras ver un reel; el saludo post-reel lo acompaña `getReelGreeting()` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts). Historial → [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md).
   - ⚠️ **El archivo fuente conserva el nombre legacy `system-prompt-nexus-main-v27_2.md`** — no se renombró pese a las versiones internas v28.x. Migración léxico "negocio/empresa digital" aplicada en v28.0–v28.1.
   - Versiones anteriores del archivo eliminadas — viven en git: `git show <hash>:knowledge_base/system-prompt-nexus-main-vXX_Y.md`
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** en `route.ts` — actualizar en Supabase. Fallback alineado a v26.5.
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente. En la **página de catálogo** (`/sistema/productos`) este modo se fuerza vía `pageContext === 'catalogo_productos'` (route.ts `getPageContextInstructions()` — "MODO ASESOR DE SALUD Y BIENESTAR", enviado por `useNEXUSChat`); el frontend acompaña con chips de salud, saludo de asesor, CTAs `open-queswa` y tooltip del orbe contextual (ver [Active Pages → `sistema/productos/`](#5-page-structure--funnel-architecture)).
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `docs/handoff/queswa/HANDOFF-QUESWA-PRECIOS-CVPV.md`.
   - **Cotización por país (Fase 2, jun 2026)** — ver memoria [[project_cotizacion_moneda_local]]. **Problema:** Gano Excel tasa el USD a **$4,500 COP FIJO** (no de mercado). Un colombiano leía "ESP-3 = $1,000 USD" → convertía a TRM (~$3,500) → *"me sobrecobran el dólar a 4,500"*; peor, Queswa **derivaba** la pregunta a un humano. **Solución (2 partes):**
     1. **Fragmento `FREQ_27`** en `arsenal_inicial.txt` (desplegado + clonado al tenant `whatsapp`) — responde el reclamo con 3 palancas: no compras dólares sino productos / precio fijo del fabricante para 70 países (no margen de CreaTuActivo) / **simetría** (la misma tasa que pagas una vez la cobras en CADA comisión, por encima del mercado). Incluye instrucción "NUNCA derivar a un humano". ⚠️ El slot FREQ_24 ya estaba ocupado (Consumidor VIP, fuera de orden en el .txt) → quedó como **FREQ_27**.
     2. **Detección de país + reorden de precios** en `route.ts`: `detectVisitorCountry()` (web = header `x-vercel-ip-country` de Vercel Edge; whatsapp = prefijo telefónico del `fingerprint`). `getPaquetesPricingPin(country)` + pin de composición ahora **país-aware**. **Regla:** precio de paquetes/productos → **moneda local** (CO=COP solo sin USD al lado; US=USD limpio; resto/desconocido=USD+COP con nota de oficina local). Comisiones/ingresos → **ambas monedas**. La IP es default, no verdad: para diáspora la moneda la define el **país de registro** (Queswa confirma, no asume — ver memoria `project_diaspora_registro_real` / memoria `project_diaspora_registro_real`).
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
| `/api/funnel` | Node | 10s | Calculadora de Días de Libertad → soap-opera (Email1) + tracking de página |
| `/api/subscribe` | Node | — | Newsletter "Suscríbete" (jun 2026) — upsert `funnel_leads` (source `newsletter`) + adjunta correo al prospecto (update_prospect_data) + bienvenida institucional (Equipo CreaTuActivo) + aviso a `sistema@`. Single opt-in; pendiente double opt-in + envío real. Ver [[project_newsletter_suscripcion]] |
| `/api/fundadores` | Node | 10s | Founder registration || `/api/cron/process-emails` | Node | 60s | Soap Opera sequence || `/api/emails/send-sequence` | Node | 30s | Generic email dispatch |
| `/api/constructor/[id]` | Node | 10s | Constructor dashboard |
| `/api/fundadores/pre-registro` | Node | 10s | Pre-registration flow |
| `/api/fundadores/registro-diciembre` | Node | 10s | Legacy December registration |
| `/api/track/video` | Edge | — | ⚠️ Legacy — las páginas `dia-1..5` de la Auditoría que reportaban aquí fueron eliminadas (jul 2026) |
| `/api/track/engagement` | Edge | — | Reel engagement tracker — merge **sin retroceder** (`Math.max` numéricos / OR lógico bools) sobre `device_info` vía `update_prospect_data`; dispara webhook Supabase → push en queswa.app. Campos = contrato cerrado con el Dashboard (ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)) |
| `/api/email-open` | Node | — | Email open pixel tracker |
| `/api/logo-email` | Edge | — | Logo dinámico (Quiet Luxury) renderizado para emails || `/api/whatsapp/webhook` | Node | 30s | WABA inbound — adaptador de canal WhatsApp → motor `/api/nexus` (ver [Estado integración WABA](#1-nexus-ai-chatbot)) |
| `/api/test-resend` | Node | — | Dev/debug only (not for production use) |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails   → 0 14 * * *  (9:00 AM UTC-5 Colombia)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

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
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services, `/empresa-digital`, `/negocio-digital` (URLs legacy → Home 301; van siempre a red para que el redirect funcione). ⚠️ `public/sw.js` aún lista `/mapa-de-salida` y `/reto-5-dias` (sus redirects se retiraron jul 2026 → hoy 404; se pueden quitar del bypass)

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
- [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt)- [knowledge_base/arsenal_12_niveles.txt](knowledge_base/arsenal_12_niveles.txt)
- [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt)
- [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt)
- [knowledge_base/arsenal_marca_personal.txt](knowledge_base/arsenal_marca_personal.txt)
- [knowledge_base/arsenal_ganocafe.txt](knowledge_base/arsenal_ganocafe.txt)

**Documentación completa**: [knowledge_base/README.md](knowledge_base/README.md) · **Historial de cambios**: [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

### 5. Page Structure & Funnel Architecture

**Funnel Strategy** (actualizado jul 2026 — el funnel reto/mapa/diagnóstico se **eliminó**; ver callout 🔤 abajo):
```
Tráfico (reel por nicho / orgánico WhatsApp) → creatuactivo.com/{slug}/{nicho}
                              ↓
              Reel + Queswa (conversa, madura la decisión) → 1-a-1 con el socio
                              ↓
                         /paquetes (activación) · /fundadores (Oferta)

Home (creatuactivo.com) → "Hablar con Queswa" (open-queswa) + "Suscríbete" (newsletter → /api/subscribe)
Tráfico SEO (Blog) → /blog/* → Home / /fundadores
Calculadora (/calculadora) → soap-opera Email1-5 (nurture, cron process-emails) → Home / /fundadores
```

> 🔤 **FUNNEL RETO/MAPA/DIAGNÓSTICO ELIMINADO (jul 2026 — commits `ca6ff59` + `8256c82`).** Meses de prueba con cero conversión (1 registro que no avanzó). Se retiraron **por completo**: páginas `/empresa-digital` (squeeze + dia-1..5), `/diagnostico`, `/confirmacion`; API `cron/reto-5-dias`, `api/diagnostico`, `webhooks/prospect-capture`, `test-reto-email`; correos `reto-5-dias/Dia1-5` + `Reto5DiasConfirmation` + `MapaDeSalidaConfirmation`; el arsenal `arsenal_reto` (routing fuera del motor; **purga de Supabase pendiente post-deploy** — `like 'arsenal_reto%'`); y las libs `sendpulse.ts` + `whatsapp-meta.ts`. **Funnel vigente: reel → Queswa → 1-a-1.** URLs viejas (`/empresa-digital`, `/negocio-digital`, `/auditoria-patrimonial` + subrutas) → **Home** (301). Ver [[project_home_reposicion_2026]] · [[project_lexico_negocio_digital]].

> 🏠🏠 **HOME v14.0 "LENGUAJE CONCRETO" (2 ago 2026) — supersede el callout de jun 2026 de abajo.** La Home real (`src/app/page.tsx`) es ahora el contenido aprobado del ejercicio `/prueba`: **CERO "empresa digital"** (bautizo diferido a Academia/Maestría — ver memoria `feedback_bautizo_empresa_digital_diferido`), hero = reel explainer + *"Un segundo ingreso, en paralelo al que ya tiene — con el potencial de igualarlo o superarlo"*, villano narrado (trancón 1 + *"le pasa igual al que gana dos millones y al que gana veinte"*), orden WHY_02 (dinero → recurrencia → dos fuerzas), **Compartir · Recibir · Multiplicar**, producto test-Beto, dos puertas, anticlímax + cierre Vélez. Secciones retiradas de la v13.7: Diagnóstico, "¿Qué es una empresa digital?", Perfiles, `CognitiveLoadComparator`, `TridenteAphorisms` (con esto el aforismo "Usted no explica" salió de la Home), calculadora inline y `VisionSection`. Se conservan: `force-static`, footer con "Fundada por Luis Cabrejo" (requisito verificación WhatsApp/Meta), CTAs "Hablar con Queswa"/"Suscríbete". `/prueba` queda como sandbox (noindex). El párrafo de abajo describe la v13.x — **léelo solo como historia**.
>
> 🏠 **HOME REPOSICIONADA (jun 2026) — supersede lo de arriba PARA LA HOME + EL MENÚ.** El "Diagnóstico de 5 Días" producía **cero aplicaciones** (pedir commitment a tráfico frío sin confianza "olía a desesperado") → se **desconectó como gancho**. La Home (`src/app/page.tsx`) ahora lidera con **"Sea dueño de su empresa digital"** y su estructura es: Hero → Diagnóstico (villano limpio estilo Slide 1) → **¿Qué es una empresa digital?** (Bezos/MercadoLibre + ejemplo `sonrisaslindas.app`) → Perfiles → **Cómo lo hacemos nosotros** (la decisión desde-cero-vs-apalancamiento + 3 pilares: Respaldo/Gano · Queswa · Método Expandir/Activar/Multiplicar) → aforismos → calculadora → Visión → CTA. **CTAs nuevos:** cuerpo → **"Hablar con Queswa"** (`QueswaCTAButton`, evento `open-queswa`); **menú** → **"Suscríbete"** (`SubscribeModal` → `/api/subscribe`). Las páginas `/empresa-digital/*` fueron **eliminadas** (jul 2026 → Home 301). El **resto del sitio + servilleta** se alinea aparte vía `docs/handoff/queswa/HANDOFF_BARRIDO_SITIO_SERVILLETA.md`. **Doctrina nueva** (Gano = respaldo, nunca titular del ingreso; calidez-no-auditoría en Activar; paleta de analogías Nubank/Amazon-ML/Rappi/McDonald's; confianza > entendimiento → contenido da contexto, el 1-a-1 cierra) → memorias [[project_home_reposicion_2026]] · [[feedback_gano_respaldo_no_titular]] · [[feedback_confianza_precede_entendimiento]] · [[reference_paleta_analogias]] · [[project_newsletter_suscripcion]]. ⏳ Pendiente arsenales+system prompt (incl. `arsenal_inicial.txt` línea ~510 "usted revisa/da el sí" → nadie audita).

**Active Pages** (rutas no-obvias — el resto se descubre con `ls src/app/`):

- `calculadora/` — Calculadora de ingresos (indexada) → alimenta la secuencia soap-opera (cron `process-emails`).
- ⛔ **Funnel eliminado (jul 2026, commits `ca6ff59`+`8256c82`):** `empresa-digital/` (squeeze + dia-1..5), `confirmacion/` (Bridge), `diagnostico/` (quiz de tráfico pagado), `reto-5-dias/` y `mapa-de-salida/` fueron **borradas** — meses de prueba, cero conversión. Todas las URLs viejas → **Home** (301). Funnel vigente: reel → Queswa → 1-a-1.
- `paises/` — Páginas por destino con sub-ruta dinámica `[destino]/` (ej. `brasil/`).
- `[slug]/` — **Mini-landing personal del Arquitecto de Patrimonio** (`creatuactivo.com/luis-cabrejo`). Micro-sitio personalizado con foto, frase y links del constructor. OG dinámico para WhatsApp. Lee de `constructor_slugs` (slug, display_name, foto_url, frase_personal, whatsapp) + `private_users` (affiliation_link, profile_photo_url). ❌ NO es para blog slugs — esos van bajo `/blog/`.
- `[slug]/[destino]/` — **Bifurca** según el segundo segmento: si `[destino]` ∈ `REEL_NICHOS` **renderiza** la página de Reel (`<ReelPage>`); si `[destino] === 'manifiesto'` **renderiza** el Manifiesto de los Fundadores compartible con atribución (URL limpia `/{slug}/manifiesto` — el `ref` se inyecta a `localStorage`, sin `?ref`; OG image dedicado en `/manifiesto/opengraph-image`); si no, ejecuta el **redirect** con tracking. `DESTINO_MAP` en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) resuelve destinos cortos (home, calculadora, productos, servilleta, `activacion`→`/paquetes`, presentacion, reto/12-niveles) a rutas reales con `?ref={constructorId}`. Los destinos del funnel eliminado (`auditoria`, `diagnostico`, `dia-1..5`) se retiraron (jul 2026). Los slugs de nicho y `manifiesto` no colisionan con `DESTINO_MAP`. Ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp).
  - ⚠️ **GOTCHA (cuesta horas): un destino que NO esté en `DESTINO_MAP` (ni en nichos/manifiesto) cae al fallback `redirect(/{slug})` = la mini-landing, SIN 404.** Síntoma típico: "el enlace `/{slug}/X` lleva a la mini-landing". Caso reciente (jul 2026): `activacion` apuntaba al squeeze muerto y se reapuntó a `/paquetes?ref`. Al sumar un enlace amigable nuevo en el Dashboard (`src/lib/arsenal.ts`), agregar SIEMPRE su destino aquí.
  - ⚠️ **OG por página estática:** la página destino (ej. `/calculadora`) debe declarar su **propio `openGraph.url`** en su `layout.tsx`/metadata. Si solo define `title`/`description` y NO `openGraph`, hereda el del root layout (`og:url = dominio raíz`) → al compartir en **Meta**, la publicación enlaza a la raíz aunque el enlace pegado sea correcto. Tras corregir, forzar re-scrape en el [Sharing Debugger](https://developers.facebook.com/tools/debug/) (Meta cachea el OG viejo).
- `manifiesto/` — **Página pública del Manifiesto de los Fundadores** (`/nosotros` redirige aquí 301; rótulo de menú: **Nosotros**). Narrativa de posicionamiento (April Dunford) + CTA WhatsApp del arquitecto; `opengraph-image.tsx` propio. Cuerpo en [`<ManifiestoDocument/>`](src/components/ManifiestoDocument.tsx) (compartido con `/{slug}/manifiesto`); H1 = **NUESTRA FILOSOFÍA** + lema *"Las cosas no pasan. Se hacen pasar."* ⚠️ "Manifiesto de los Fundadores" persiste como **nombre del documento** (OG, texto WhatsApp, secciones §01–08), NO como H1 — es deliberado.
- `presentacion-empresarial/` — Herramienta interna para 1-on-1, **NO está en el menú público**.
- `infraestructura/` — Implementación de referencia del sistema Bimetallic v3.0. Leer antes de crear nuevas páginas.
- `sistema/productos/` — 🛒 **Catálogo e-commerce "Clinical Luxury"** (indexada; `page.tsx` es la **página viva** — `'use client'`, bioEmerald. `catalogo-productos.tsx` es duplicado WIP sin enlazar, NO es la fuente viva). **Queswa aquí = ASESOR DE SALUD Y BIENESTAR**: backend en modo `pageContext === 'catalogo_productos'` (route.ts `getPageContextInstructions()`, enviado por `useNEXUSChat`) + frontend con chips de salud `QUESWA_PRODUCTS_QUICK_REPLIES` (NO las 4 de negocio; CTA "Suscríbete" oculto), CTAs `open-queswa`, y tooltip del orbe por ruta. **Léxico Fundador retirado del catálogo**: nada de "Fundador"; enlaces de negocio → **Home**; FAQ en léxico accesible ("su organización" no "su red"). **Carrito**: `localStorage` (carga con `try/catch` + filtra productos inexistentes), pre-carga `?carrito=id1,id2`, checkout por WhatsApp del distribuidor. ⚠️ **Envío SIN valor fijo**: carrito muestra "Por definir según ciudad y volumen" (NO hardcodear flete). Orbe se auto-oculta al abrir el carrito (`data-nexus-button`).
- `animaciones/diaX/` — Canvas-based social video renderer (Dan Koe style). Variantes A/B con sufijos `-v3` a `-v6`.
- `servilleta/` — Deck interactivo v6.7 de 4 slides. **Migrado al sistema Lujo Silencioso (15 May 2026)** — usa los mismos tokens que el resto del sitio (`--color-brand`, `--color-bg-elevated`, `--font-sans`, etc.). Slides 1 (qué es una empresa digital) y 2 (primeros principios) son card-scrollers con **b-rolls 3D** y portada propia — ver [Servilleta Digital](#servilleta-digital---interactive-presentations).
- `paquetes/` — Protocolo de Capitalización v3.0. CTAs → WhatsApp pre-filled con nombre+USD+COP.
- `planes/` — 4 planes de suscripción. Sin Framer Motion ni `backdropFilter` (decisión de performance).
- `12-niveles/` — Landing "Los 12 Niveles". **FORK del deck `/servilleta` (jul 2026, decisión Director).** La landing anterior (hero + "3 gigantes" + tabla financiera) se descartó por completo; respaldo en `src/app/12-niveles/page.tsx.bak`. Ahora `/12-niveles` es una **copia del deck servilleta** (`page.tsx` ≈ el de `/servilleta`: 4 slides, swipe, fullscreen, card-scrollers con b-rolls 3D, modales video/catálogo/boletín, modo vertical/kiosk) con **el SLIDE 4 modificado**: el simulador INMEDIATO/RECURRENTE se reemplazó por el **SIMULADOR DE 12 NIVELES** — proyección 2×2 sobre 12 niveles (`PROYECCION_12`, cifras del plan de compensación), 12 puntos marcados (`.nivel-dot`) + slider `nivel12Level`, con **COP dorado como valor primario y USD + nº de usuarios del nivel en texto pequeño**. Slug renombrado desde `/reto-12-niveles` (redirects 301 en `next.config.js` desde `/reto-12-niveles`, `/reto-12-dias` + sus `:ref`); `DESTINO_MAP` (`'reto'`) apunta al nuevo. `layout.tsx` (noindex) y `opengraph-image.tsx` (bimetálico "SU EMPRESA DIGITAL") son **propios del slug** — NO se copiaron de servilleta. El orbe Queswa se comporta como en servilleta vía el helper **`isDeck`** en [UnifiedQueswaOrb](src/components/UnifiedQueswaOrb.tsx) (oculto salvo el botón "PREGÚNTALE ALGO EN VIVO" del slide 2). ⚠️ **Es una COPIA de 2.3K líneas:** cualquier cambio al deck base `/servilleta` debe replicarse aquí a mano. El arsenal `arsenal_12_niveles` **se migró a usted (v5.0, 20 jul 2026)** + "red"→"organización" (conserva "Kit de Inicio"/cifras del plan; NIVELES_02 corregido a $103.194.000, NIVELES_04 sin formulario roto). Disparadores ampliados en route.ts (2×2/duplicación/103 millones/simulador) y **`pageContext: '12_niveles'`** (useNEXUSChat → `getPageContextInstructions()`) le da a Queswa contexto del deck. Ver [[project_reto_12niveles_no_migrar]] (revertido solo para el léxico de trato del arsenal + la página).
- `activo-que-sobrevive-a-su-ausencia/` — Deck keynote de conferencia (SER PRO Internacional · Luis Cabrejo). noindex, herramienta interna de presentación en vivo (F = fullscreen, flechas/swipe).
- `video-plan-servilleta/` — El plan en un video (9:16, ~6 min). **Layout espejo de `ReelPage`** (sin nav, video alto en pantalla) pero reutiliza `HomeManifestoVideo` — autoplay muted + "activar sonido" + transición a Queswa al terminar. Constantes `PLAN_SERVILLETA_VIDEO` / `PLAN_SERVILLETA_POSTER` en [src/lib/reels.ts](src/lib/reels.ts).
- `prueba/` — Sandbox noindex de la Home ("Home 2", ejercicio de lenguaje concreto). Su contenido aprobado **ya se promovió** a la Home real v14.0 (ver callout 🏠🏠); sigue vivo como banco de pruebas A/B — no debe competir en buscadores.
- `lexico/` — **Taller de Voz** (`'use client'`, noindex): rutina diaria de pronunciación para Luis, con frases sacadas de los guiones reales (servilleta + reels). Herramienta interna, no es parte del funnel ni del léxico de marca (para eso → [BRANDING.md §7](BRANDING.md)).
- `privacidad/` · `terminos/` — Legales. Requisito de la verificación de negocio de Meta/WhatsApp — no borrar.
- `offline/` — PWA fallback.

**SEO Strategy** (Dic 2025):
- **Indexed pages**: `/`, `/fundadores`, `/blog/*`, `/tecnologia`, `/sistema/productos`, `/paquetes` (⚠️ `/socios` y `/webinar` fueron eliminadas — commit `6110e9a` "purga global tuteo + eliminar 4 páginas obsoletas")
- **noindex pages**: `/manifiesto` (Manifiesto). El funnel interno (`/empresa-digital/*`, `/confirmacion`, `/diagnostico`) fue **eliminado** (jul 2026); sus URLs viejas (+ `/auditoria-patrimonial`, `/auditoria-confirmada`, `/nosotros`, `/reto-5-dias/*`, `/mapa-de-salida/*`) → redirects 301 a Home / `/manifiesto`.

**Dynamic `[ref]` Routes**: Landing pages support referral tracking via `/page-name/referrer-id`.

**Navigation** ([src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) — array `directLinks`):
- **Desktop/Mobile Menu**: Nosotros (`/manifiesto`) · Tecnología (`/tecnologia`) · Presentación (`/servilleta`) · Insights (`/blog`) + **"Suscríbete"** CTA (abre `SubscribeModal` → `/api/subscribe`; reemplazó "Auditoría Patrimonial"/"Iniciar Diagnóstico" en la reposición de la Home jun 2026 — ver callout 🏠 abajo)
- ⚠️ **Los rótulos NO coinciden con sus rutas a propósito** (decisión Jun 2026 — el menú nombra *qué encuentra el visitante*, no la ruta técnica): "Nosotros" abre la página Manifiesto; "Presentación" abre el deck Servilleta. Esto reemplazó "Manifiesto / El Sistema / Herramientas" (rótulos con fricción o ambiguos).
- **Mobile CTA**: **"Suscríbete"** (abre `SubscribeModal`; antes "Unirme al Reto" → /empresa-digital)
- **Removed from menu**: Soluciones, Ecosistema, Auditoría
- **Presentación Empresarial**: `/presentacion-empresarial` sigue siendo herramienta interna 1-on-1, fuera del menú. ⚠️ NO confundir con el item público "Presentación" → `/servilleta`

### Servilleta Digital - Interactive Presentations

Deck de 4 slides para conversaciones 1-a-1. **Fuente viva completa → [docs/SERVILLETA.md](docs/SERVILLETA.md)** (arquitectura mobile, b-rolls 3D, beat del colapso, comandos de re-render, reglas de iconos).

| Version | Route | Notas |
|---------|-------|-------|
| v6.7 (Main) | `/servilleta` | 4 slides; 1 y 2 son card-scrollers con b-rolls 3D + portada. Fullscreen (F), keyboard nav, swipe |
| v6.7 (Ref) | `/servilleta/[constructorId]` | Re-exporta la página principal; el `constructorId` se lee del path en cliente para tracking |

Estructura (2 ago 2026): **01 EL PROBLEMA** · **02 LAS TRES COSAS** (+ beat del colapso) · **03 EL PRODUCTO** · **04 LOS NÚMEROS**. El slide "QUÉ HACE USTED" se eliminó el 2 ago 2026 (5 → 4 slides).

**Lo que rompe producción si lo toca sin leer el doc:**
- ❌ NO revertir `.card-bg` a `object-fit: cover` ni al split `height: 50%` — recorta el 3D
- ❌ NO añadir `.simulator-panel`, tabs ni botones a `touchSwipeIgnore` — bloquea el swipe-back del Slide 4 (la exoneración es SOLO para `<input>`)
- ❌ NO unificar el Slide 4 a `justify-content: center` en ambos modos — en fullscreen mobile empuja el 2º botón fuera de pantalla
- ❌ NO reintroducir strings de Material Symbols en `<span>` — renderizan como texto en inglés hasta que carga la fuente
- ❌ NO mostrar el orbe Queswa flotante en `/servilleta` — el chat abre solo desde "PREGÚNTALE ALGO EN VIVO" (slide 2)
- ⚠️ El **copy verbatim NO se documenta** — vive en [src/app/servilleta/page.tsx](src/app/servilleta/page.tsx); la narración en [guion_maestro_servilleta_v3.md](public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md) (nombre legacy `v3`, contenido v5.8)

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

**Audiencia objetivo + reglas lingüísticas** → ver [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy). Reglas clave:
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

Archivos fuente y versiones actuales → ver la [tabla de arsenales](#1-nexus-ai-chatbot). Scripts de deploy por arsenal: `deploy-arsenal-inicial.mjs` · `deploy-arsenal-avanzado.mjs` · `deploy-arsenal-12-niveles.mjs` · `deploy-arsenal-compensacion.mjs` · `deploy-arsenal-ganocafe.mjs` · `deploy-arsenal-marca-personal.mjs` · `actualizar-catalogo-productos.mjs`. Luego `fragmentar-arsenales-voyage.mjs` (embeddings Voyage) y verificar con `audit-completo.mjs` (preferido — `verificar-arsenal-supabase.mjs` tiene bug PGRST116).

**Falsa alarma del audit — `desconocido: 40 fragmentos`**: `audit-completo.mjs` clasifica por `metadata.parent_arsenal`; cuando ese campo no está poblado etiqueta "desconocido" aunque la `category` esté bien. Los 40 son fragments reales de `arsenal_compensacion` + los **docs maestros padre** (`arsenal_inicial/ganocafe/reto/marca_personal`, `catalogo_productos`) + `catalogo_productos_PROD_OVERVIEW`. ⚠️ **NO ELIMINAR ninguno** — los docs maestros los necesita el fragmentador para parsear (`.eq('category', arsenalCategory)`). El warning es cosmético; se limpia poblando `metadata.parent_arsenal`.

### Working with Video Content

**Flujo estándar, color grade DaVinci y animaciones Canvas → [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](docs/handoff/reels/VIDEO_Y_ANIMACIONES.md)**

```bash
./scripts/optimize-video.sh /path/to/video.mp4   # 720p/1080p/4K + poster
node scripts/upload-to-blob.mjs                  # → Vercel Blob (URLs a .env.local + Vercel)
```

### Reel Post-Production Pipeline (`scripts/dankoe-video/`)

**Documento completo → [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md) — leerlo ANTES de ensamblar cualquier reel.** Contiene las recetas (reel de nicho, reflexivo de documentación, desenfoque de fondo, SFX puntuales, patrón "PROPIO" con keyword) y la limpieza de intermedios.

Lo que hay que saber antes de abrirlo:
- Acabado cinematográfico en M1, **todo por código**. Entrada = export CapCut ya graduado (**SIN música — pista en mute**, o el pipeline la entierra); salida = 1080×1920·24fps, mezcla **voz-anclada** a −14 LUFS (nunca `loudnorm` sobre toda la mezcla)
- Subtítulos por forced alignment (`ctc-forced-aligner`) + overlay de PNG con Pillow — **NO libass**. El ffmpeg de esta máquina **no trae `drawtext`** (sin libfreetype), así que todo texto quemado va por PNG
- Motion graphics Remotion requieren **`--gl=angle`** en M1
- **Niveles de música calibrados por Luis — al alza, nunca bajar**: nicho 0.80 (networkers 0.90) · reflexivos 1.00 en ambas camas. El cambio suspense→corporativa cae exacto en el pivot narrativo, leído del `*_stamps.json`
- ⚠️ **Gotcha zsh**: los arrays van desde 1 y las variables de un `filter_complex` **se vacían dentro de una función de shell** → ffmpeg con filtros va explícito e inline


### Reels por Nicho (fase orgánica WhatsApp)

6 reels verticales por nicho que cada **Arquitecto de Patrimonio** comparte por WhatsApp a su mercado orgánico: **5 de tráfico** (corporativo · empleados · empresarios · diaspora · informales, con el bloque de solución compartido) + **1 especial `networkers`** (gremio del mercadeo en red que ya conoce a Luis y estuvo en Gano Excel — **estructura propia**, hook/diagnóstico/solución/CTA bespoke, NO usa el módulo compartido). Cada reel vive en `creatuactivo.com/{slug}/{nicho}` + tracking de referido. **NO** se publica reel nativo en IG/TikTok en esta fase.

**Jerarquía de conversión en la página** (secuencial, no compite — investigación CTA May 2026: un solo CTA por momento convierte mejor):
1. **Reel 9:16** alto en pantalla (ojos en el tercio superior; `padding-top` mínimo).
2. **Copy del nicho** (título serif + cuerpo).
3. **Queswa = vía rápida**: al terminar el reel **o** al hacer scroll dejándolo atrás, el `ReelVideo` muestra una burbuja sobre el orbe — copy *"Puedo auditar la viabilidad de su caso ahora mismo. ¿Comenzamos?"* (registro Modulación: autoridad clínica "auditar la viabilidad" + invitación accesible "¿Comenzamos?"; eco del reel, sin ancla de tiempo) → al tocarla dispara `open-queswa`. La burbuja se **oculta** a los 25 s, al volver al video (IntersectionObserver) y al abrir el chat (evento `queswa-opened` que emite el orbe).
4. **Tarjeta YouTube** (presentación de 7 min) — vía reflexiva, facade nativo **full-bleed** (todo el ancho en móvil, cap 680px en desktop).
5. **Los 3 CTA de cierre del reel**: `Hablar con Queswa` (evento `open-queswa`) + `Activar por WhatsApp` (verde, → WhatsApp del arquitecto; la activación NO pasa por Queswa: quien ya decidió no debe encontrar preguntas de cualificación) + `ShareButton` **"Compartir este diagnóstico"**. ⚠️ El CTA viejo "Diagnóstico de 5 Días" → `/empresa-digital` **se retiró** con el funnel (jul 2026); solo quedan estos 3 botones.

- **Fuente de verdad**: [src/lib/reels.ts](src/lib/reels.ts) — `REEL_NICHOS` (`corporativo`, `empleados`, `empresarios`, `diaspora`, `informales`, `networkers`), `REEL_ASSETS` (solo `{ video }`, URLs Blob), `REEL_COPY` (título/cuerpo/audiencia, versión final aprobada por Luis), `SERVILLETA_YOUTUBE_ID`, `REEL_POSTER`/`REEL_POSTER_OG` (poster branded de fallback) y **`REEL_POSTER_OVERRIDE`** (poster por-nicho).
- **Poster por-nicho (jun 2026)**: con los reels ya en 3D, cada nicho usa un **frame del propio reel** como portada (más nítido y representativo que el branded genérico). `REEL_POSTER_OVERRIDE[nicho] = { poster: '…-poster.webp', posterOg: '…-poster.jpg' }` — los 5 nichos tienen override. Se generan del master con `ffmpeg -ss 0.5 … scale=1080:1920` (jpg q2) + `sharp` a webp; ambos en `public/videos/reels/`, **commiteados** (servidos por Next, no por Blob). `ReelPage`/`generateMetadata` usan el override y caen a `REEL_POSTER`/`REEL_POSTER_OG` si un nicho no lo tiene. `metadataBase` resuelve la ruta relativa del OG a absoluta.
- **Componentes** (construidos May 2026): [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) bifurca render-reel vs redirect; [src/components/ReelPage.tsx](src/components/ReelPage.tsx) (Server Component, estética Bimetálica); [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) ('use client' — video `preload="none"` + burbuja Queswa con auto-hide/scroll/chat); [src/components/YouTubeFacade.tsx](src/components/YouTubeFacade.tsx) ('use client' — miniatura `maxresdefault` + play, iframe carga al click). `generateMetadata` emite OG de video + `REEL_POSTER_OG` (`robots: noindex`). Botón WhatsApp usa clase `.cta-whatsapp` (verde) en globals.css.
- **Orbe en reels**: [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) suprime su tooltip "Concierge" automático (~2s) cuando `isReelRoute` (pathname `/{slug}/{nicho}` con nicho ∈ `REEL_NICHOS`) — el reel controla su propia burbuja. ⚠️ El orbe es global; el cambio está aislado por ruta para no afectar el resto del sitio.
- **Tracking de referido**: como el reel se renderiza inline (no redirige), `ReelPage` resuelve `constructor_id` del slug e inyecta un `<script>` inline (corre **antes** del `tracking.js` diferido) que setea `?ref={constructor_id}` vía `history.replaceState` + `localStorage.constructor_ref`. Atribución idéntica a aterrizar en `/?ref=id`. Funciona para cualquier arquitecto (slug dinámico), no solo `luis-cabrejo`.
- **CTA WhatsApp del arquitecto**: el número vive en **`private_users.whatsapp`** (fuente de verdad — igual que `/api/constructor/[id]` y `/sistema/productos`), **NO** en `constructor_slugs.whatsapp`. El branch del reel lo resuelve por `constructor_id` con fallback al número orgánico `+573206805737`. ⚠️ Bug histórico "cero inicial" en esos números (ver `whatsapp-validator.ts` del repo Dashboard) — el `.replace(/\D/g, '')` lo neutraliza.
- **Engagement tracking** (Reels Engagement Fase 1, Jun 2026): [src/components/ReelVideo.tsx](src/components/ReelVideo.tsx) instrumenta el comportamiento del prospecto y reporta a [`/api/track/engagement`](src/app/api/track/engagement/route.ts) (que mergea sin retroceder en `device_info` → webhook Supabase → push al arquitecto en queswa.app). **Contrato de datos cerrado con el Dashboard — NO renombrar los campos**: `reel_nicho`, `reel_pct` (máx % visto), `reel_completed` (✅ push "Vio el reel completo"), `reel_time_s` (segundos activos), `queswa_opened` (✅ push "Abrió Queswa"), `queswa_messages`, `visit_count` (✅ push "Volvió a visitar"). **Anti-spam (CRÍTICO)**: cada escritura dispara el webhook → mantener **≤ ~6 escrituras por sesión**. Reportar solo en milestones del reel (25/50/75/100), `queswa_opened` una vez, y `reel_time_s`+`visit_count` en el beacon de salida (`navigator.sendBeacon`). NO escribir en cada `timeupdate` ni en heartbeats. Handoff: [HANDOFF_REELS_ENGAGEMENT_FASE1.md](docs/handoff/reels/HANDOFF_REELS_ENGAGEMENT_FASE1.md).
- **Estado**: **los 6 reels están en 3D y en producción**. Los **5 de tráfico** (corporativo · empleados · empresarios · diaspora · informales) usan inserts 3D de diagnóstico por nicho + módulo de solución compartido (pilares/CTA/outro), atmósfera, subtítulos, música 0.80 y SFX. El **6º, `networkers`**, tiene **estructura propia** (villano `Pulso3D`, inserts bespoke, suspense 0.90 en hook+diagnóstico) y su **música de solución la montó Luis en CapCut** (no el pipeline — deliberado). Masters en `scripts/dankoe-video/masters/{nicho}-3d.mp4` (gitignored); Blob `reels/{nicho}.mp4` (web CRF23). ⏳ Pendiente: "tres pilares"→"3 pilares" en el módulo compartido (re-deploy de los 5). Handoff: `docs/handoff/reels/HANDOFF_REELS_PAGINAS.md`.
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
| `REELS_SITIO_CREATUACTIVO.md` | **Sitio** | **Explainer**: responde a quien **ya llegó con la pregunta "¿de qué se trata?"**. Voz **neutra** (NO "soy Luis") — la home la alimentan todos los arquitectos con su `?ref`, debe ser reutilizable. Empieza con el reel de la **Home** (reemplaza el video viejo del plan servilleta en el hero). Armonizado con la Home (`/`). | Incrustado en el sitio (hero `page.tsx`, etc.) |

**Léxico (los 3):** "negocio digital" a secas (la corona es de CreaTuActivo, no de Gano) · ingreso que no depende de su presencia · usted dirige, el sistema hace el trabajo. Ver [migración léxico accesible](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy).

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
- `wa-channel.ts` - **Capa única de canal WhatsApp** (Meta Cloud API): `sendText` · `sendTemplate` · `listTemplates` · `getPhoneAsset`. Único lugar con `WHATSAPP_SYSTEM_TOKEN`. (`whatsapp-meta.ts` + `sendpulse.ts` borrados jul 2026)
- `wa-bridge-auth.ts` - Auth del puente `/api/wa/*` que consume el Dashboard server-to-server (header `x-wa-bridge-secret`, `timingSafeEqual`). ⚠️ **Deniega si la env `WA_BRIDGE_SECRET` no está definida** — a diferencia del `x-webhook-secret` de Supabase; un endpoint que envía WhatsApp en nombre de la marca no puede quedar abierto por una env olvidada
- `wa-radicacion.ts` - **Cierre de WhatsApp** — nodo determinístico que pide los **cuatro datos** (nombre completo · cédula · ciudad · paquete) en **un solo mensaje** y radica contra `POST {DASHBOARD_URL}/api/pre-afiliacion` (auth `x-wa-bridge-secret`; escribe en `pending_activations` y dispara plantilla `pre_afiliacion_nueva` al socio + al equipo). Se invoca desde el webhook **antes** de llamar al motor. Extracción con Haiku (nunca lanza; ante fallo vuelve a pedir). ⚠️ El texto de `pedirDatos()` coincide a propósito con el bloque de cierre del system prompt `queswa_whatsapp` — es la red de respaldo si el detector de volición no dispara; **editar uno obliga a editar el otro**
- `query-rewrite.ts` - **CQR (reescritura conversacional de la consulta)** — colapsa el hilo en una consulta autónoma antes del vector search. Ver [PASO -2](#1-nexus-ai-chatbot). Hoy activo **solo en tenant `whatsapp`**; nunca lanza (ante fallo devuelve el mensaje original)
- `tts-normalize.ts` - `normalizarParaVoz()` — convierte símbolos y abreviaturas a palabras antes del TTS (sin esto el motor lee "$200 USD" como "dollar sign 200 U-S-D"). **Fuente única** compartida por `/api/voice-command` y `/api/nexus/tts`

### Design System: Bimetallic v3.0

**Fuente única y completa → [BRANDING.md](BRANDING.md)** (paleta con todos los hex, tipografía, geometría, CTAs, efectos atmosféricos, léxico §7). Aquí solo lo que se aplica en cada decisión:

**Filosofía**: "Quiet Luxury meets Private Equity" — el sitio debe parecer una firma de inversión, no un MLM típico. Dorado = máx 10-20% del lienzo.

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| **Oro (EL PREMIO)** | `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave (hover `#D4AF37`) |
| **Titanio (LA ESTRUCTURA)** | `--color-titanium` | `#94A3B8` | Iconos activos, navegación (hover → oro) |
| **Fondo** | `--color-bg-primary` | `#0F1115` | Carbón; alterna con `#15171C` elevado |
| **Texto** | `--color-text-primary` | `#E5E5E5` | Cuerpo; `#FFFFFF` solo titulares |
| Estado | | `#10B981` / `#FBBF24` / `#F43F5E` | Éxito / pendiente / alerta |

**Reglas que se rompen a diario:**
- **Iconos**: arrancan titanio, hover → oro. Solo CTAs, cifras y logros nacen dorados (`ICON_COLORS` en [src/lib/branding.ts](src/lib/branding.ts))
- **Bordes de card**: glass `rgba(255,255,255,0.1)` neutro; dorado `rgba(197,160,89,0.3)` **solo** en hover
- **Nunca hex hardcodeado** — use los tokens (`var(--color-brand)`, no `#E5C279`; `var(--color-bg-surface)`, no `#18181b`)
- **CTAs**: clases `.cta-primary` / `.cta-secondary` / `.cta-ghost` de [globals.css](src/app/globals.css). Nunca fondo sólido + texto invertido en un primario
- **H1/H2**: Inter uppercase para institucional, Playfair natural para editorial y narrativo; eyebrows en `<p>`, nunca `<h2>`. Un solo `<h1>` por página, vía [IndustrialHeader](src/components/IndustrialHeader.tsx)
- **Fuentes cargadas**: solo Playfair Display, Inter y Roboto Mono. Cualquier otra (Rajdhani, Oswald, Montserrat) hace fallback al sistema
- **Tailwind**: paletas `titanium`/`carbon`/`champagne` + utilidades `shadow-spotlight`, `bg-spotlight-gold` en [tailwind.config.ts](tailwind.config.ts)

**Implementación de referencia**: [src/app/infraestructura/page.tsx](src/app/infraestructura/page.tsx) — léala antes de crear una página nueva.


**Email Templates** (in `src/emails/`):
- `soap-opera/` - Soap Opera sequence (Dia1-5)
- `FounderConfirmation.tsx` - Founder registration confirmation
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
| `src/lib/sendpulse.ts` + `whatsapp-meta.ts` | ✅ Eliminados (jul 2026) | Reemplazados por `wa-channel.ts` (capa única de canal Meta Cloud API) |
| `src/components/nexus/NEXUSFloatingButton.tsx` | Conservado parcial | Reemplazado por `UnifiedQueswaOrb` en layout; aún se usa para eventos servilleta |
| `/reto-5-dias/*` · `/mapa-de-salida/*` · `/auditoria-confirmada` · `/empresa-digital/*` · `/diagnostico` · `/confirmacion` | ✅ Eliminadas (jul 2026, `ca6ff59`) | Funnel muerto retirado — páginas + redirects borrados; URLs viejas del funnel → Home (301) |
| `/api/fundadores/registro-diciembre` | Legacy | Registro Diciembre — reemplazado por flujo Founder actual |
| `/api/test-resend`, `/api/test-reto-email` | Dev only | No para producción |
| `src/app/api/webhooks/` | Directorio **vacío** | Quedó de la purga del funnel (`ca6ff59`) — ya no contiene `route.ts`. Seguro de borrar |
| `scripts/actualizar-system-prompt-whatsapp-v1.mjs` | Legacy | El vigente es `...-whatsapp-v3.mjs` (`VERSION_LABEL = v3.0`) |
| `*.tsx.bak` | Respaldos inactivos | Nunca editar |

## Insights Estratégicos

Posicionamiento, doctrina de venta, diáspora latina, eventos corporativos Gano Excel, distinciones léxicas críticas → ver [public/contexto/INSIGHTS_ESTRATEGICOS_v1.md](public/contexto/INSIGHTS_ESTRATEGICOS_v1.md). Contenido extraído de CLAUDE.md el 18 May 2026 — no es referencia de arquitectura técnica, es referencia de doctrina de venta.

---

## Key Documentation Files

> 📁 **`docs/` (jul 2026)** — handoffs de trabajo e investigaciones, **fuera de `public/`** (no se sirven en la web). Índice en [docs/README.md](docs/README.md). Estructura: `docs/handoff/{reels,queswa,negocio}/` + `docs/investigaciones/{prompts,resultados}/`. Los docs **núcleo** (este archivo, `README.md`, `BRANDING.md`, `POSICIONAMIENTO.md`, `EPIPHANY_BRIDGE_OFICIAL.md`, `MANIFIESTO_FUNDADORES.md`, `HANDOFF_CONTEXTO_COMPLETO.md`, `HANDOFF_QUESWA_TECNICO.md`) siguen en la raíz a propósito.

**Extraídos de este archivo (4 ago 2026)** — se movieron para que CLAUDE.md no los cargue en cada sesión:
- [docs/SERVILLETA.md](docs/SERVILLETA.md) - Deck `/servilleta` completo (aplica igual a su copia `/12-niveles`)
- [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](docs/handoff/reels/VIDEO_Y_ANIMACIONES.md) - Video estándar, color grade DaVinci, animaciones Canvas
- [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) - Estrategia de contenido, voz de Queswa (3 niveles), migración léxica, historia del fundador
- [BRANDING.md](BRANDING.md) - Design System completo + léxico aprobado/prohibido (§7)

**Architecture & Deploy**:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Queue system deployment
- [knowledge_base/README.md](knowledge_base/README.md) - Arsenal structure and sync docs

**SEO & Performance**:
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](GOOGLE_SEARCH_CONSOLE_SETUP.md) - GSC setup
- [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations

**Video & Media**:
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video implementation
- [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) - Quick start guide
- [HANDOFF-VIDEO-NAVAL-DAVINCI.md](docs/handoff/reels/HANDOFF-VIDEO-NAVAL-DAVINCI.md) - DaVinci Resolve color grade handoff

**Business Logic**:
- [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) - Spots counter spec
- [PITCHES_ARQUITECTO_EMPRESARIAL_V3.md](PITCHES_ARQUITECTO_EMPRESARIAL_V3.md) - Sales pitches

**Handoff & Context**:
- [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) - Complete business context for onboarding
- [HANDOFF_QUESWA_TECNICO.md](HANDOFF_QUESWA_TECNICO.md) - Technical handoff for Queswa chatbot
- [HANDOFF_MENSAJES_1A1_FUNDADORES.md](docs/handoff/negocio/HANDOFF_MENSAJES_1A1_FUNDADORES.md) - Guion de mensajes 1-a-1 para captar Fundadores
- [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Luis Cabrejo's story (master doc for all storytelling)

**Research** (in `docs/investigaciones/resultados/`):
- Reducir Fricción Cognitiva en Presentación Servilleta - Cognitive science behind industrial design
- Desarrollo Web Diseño Industrial Técnico - Industrial design implementation
- Sistema Lead Scoring Científico Digital - Lead scoring v3.0 design rationale

**Handoffs técnicos de Queswa** (in `docs/handoff/queswa/`):
- `HANDOFF-QUESWA-PRECIOS-CVPV.md` - Bug parcialmente resuelto (22 May 2026): nombres de productos + categorías ya correctos (catálogo v7.2 con `<verbatim_lock>`); CV/PV individuales todavía pendientes en BEB_02-06 y PROD_*
- `HANDOFF-QUESWA-UX-M3-BUG.md` - UX bug handoff for M3 flow
- `HANDOFF-GANOCAFE-WIDGET.md` - Integración widget ganocafe.online
- `Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md` - Estado integración WABA WhatsApp

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

**NEXUS System Prompt**: `leer-system-prompt.mjs` (lee de Supabase — no asumir local=DB) · `descargar-system-prompt.mjs`. `actualizar-system-prompt-v27.2.mjs` despliega la versión de `VERSION_LABEL` (hoy **v29.5_compartir_recibir_multiplicar**); ⚠️ el script y el archivo conservan el **nombre legacy `v27.2`/`v27_2`** — las versiones anteriores viven en git + `CHANGELOG-system-prompts.md`.

**Knowledge Base**: `deploy-arsenal-{inicial,avanzado,12-niveles,compensacion,ganocafe,marca-personal}.mjs` + `actualizar-catalogo-productos.mjs` (deploy por arsenal) — ⚠️ `deploy-arsenal-reto.mjs` **ya no existe** (se borró con el funnel del reto, jul 2026) · `verificar-arsenal-supabase.mjs` / `descargar-arsenales-supabase.mjs`.

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

## Léxico y voz — lo que se aplica en cada línea de copy

> 📖 **Estrategia de contenido, voz de Queswa (3 niveles), mapa completo de migración léxica e historia del fundador → [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md)**
> 📖 **Tablas completas de vocabulario aprobado/prohibido (~60 términos con su razón) → [BRANDING.md §7](BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido)**

**Regla de oro**: todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido.

> ⏳ **Las prohibiciones caducan.** Directriz del Director (7 ago 2026): *"las prohibiciones explícitas que tienen más de una semana no nos pueden condicionar"*. Buena parte de las de esta lista se escribieron dentro de un léxico que **ya abandonamos**, así que hoy protegen menos de lo que estorban — el caso de "red" es el ejemplo: prohibida en bloque, cuando el problema era solo usarla desnuda. **El orden correcto es: primero se fija el concepto nuclear, y desde ahí se construye el contexto** — nunca al revés. Antes de invocar una prohibición de esta lista, verificar que siga teniendo sentido en el léxico vigente; si no, proponer estrecharla o retirarla en vez de obedecerla.

⚠️ **La migración a léxico accesible ya está en código.** Nunca "corrija" copy accesible hacia el término viejo. Los swaps que más se encuentran: `Matriz Física` → **Respaldo Operativo** · `Tridente EAM` → **Método Comprobado** · `Base Operativa` → **negocio digital** · `Arquitecto de Patrimonio` → **Propietario** · `escalar` → **multiplicar** · `Maestría` → **Multiplicación**. Atribución: "su negocio digital" SIN "de Gano Excel".

> 📐 **Cómo se construye una frase para que fluya → [docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md](docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md)** (ago 2026). Regla madre: **abrir cada frase con lo que el lector ya tiene y terminar con lo nuevo**. Casi todas las fallas de narrativa de este proyecto son esa regla al revés. Incluye la lista de verificación de seis puntos y por qué la fluidez no es cosmética — un texto que hace tropezar **activa el escrutinio analítico**, que es lo último que uno quiere en un negocio al que le sospechan pirámide.

**Cómo se escribe** (no solo qué se dice):
1. **Villano NARRADO, nunca etiquetado** — detalles que el lector reconoce (*"la bicicleta estática: le da y le da y no avanza"*), jamás una etiqueta abstracta ("PPO", "Plan por Defecto", "tiempo por dinero" en seco)
2. **Autopersuasión** — marcos moderados; escenarios que el lector completa, no afirmaciones
3. **Test Beto** — si un profesional inteligente sin MBA no la entiende, la frase está prohibida. El lujo es la claridad
4. **Concepto nuclear (modelo Waze)** — *"empresa de tecnología que ayuda a corregir una vulnerabilidad crítica en la vida financiera… ingresos recurrentes que no dependen de su trabajo físico"*

**Prohibiciones de alta frecuencia** (el resto → BRANDING.md §7):
- **filtrar / filtro / descartar** → conversar · madurar la decisión · reconocer quién está listo ([[feedback_filtrar_prohibido]])
- **Maestría** (3er Comando) → **Multiplicación** ([[project_rename_maestria_multiplicacion]])
- **guía / acompaña** (lo que Queswa hace con la decisión) → **madura** ("madura la decisión", SOLO 3ª persona — regla del espejo) ([[feedback_promesa_canonica_queswa]])
- **cambiar horas/tiempo por dinero** (villano) → el villano es la **DEPENDENCIA** ("no depende de su presencia", no "de sus horas") ([[feedback_horas_no_son_el_villano]])
- **operar / operador** (de cara al prospecto) → hacer el trabajo / trabajar / funcionar; el usuario: dirigir / ser dueño
- **escalar** (el activo del usuario) → **multiplicar**
- **soberanía financiera** → tranquilidad / estabilidad / seguridad (EXCEPCIÓN: el lema de Luis se conserva)
- **personas** (nombrando a quienes componen la organización o a quienes hay que conseguir) → **clientes** y **socios de negocio**. Es literalmente lo que el prospecto teme del multinivel ("meter personas"), y el vocabulario correcto es el de una empresa: se tienen clientes y socios. ✅ SÍ se usa cuando Queswa habla de a quién atiende ("atiendo a cientos de personas") o cuando el prospecto pregunta si habla con una máquina — ahí no nombra reclutamiento ([[feedback_vocabulario_empresarial]])
- **quienes componen el canal** → el bautizo es de estructura, no de gente: **clientes · clientes VIP · red de clientes · consumidores · distribuidores · red de distribuidores · socios de negocio**. Prohibido *"gente que arranca con usted"*, *"personas que inician el proyecto"*, *"conseguir personas"*. La regla se justifica sola: **un canal de distribución está hecho de distribuidores y clientes** — el vocabulario sale de la estructura del negocio y por eso no hay que defenderlo ([[feedback_vocabulario_empresarial]])
- **red** *desnuda* ("una red de personas que compren") → **red de clientes y socios** · organización · canal de distribución. La palabra no está prohibida: lo que la vuelve tóxica es usarla sola. Acompañada nombra una base comercial
- **directamente proporcional · matemáticamente · es la consecuencia matemática de** → decirlo en llano. Nos hace sonar inteligentes y no empáticos; ver también [[feedback_matematica_toque_experto]]
- **pregunta de cierre con dos salidas** ("¿le muestro A, o B?") → **una sola pregunta, una sola salida**. El ser humano retiene la última opción, responde "sí" pensando en una de las dos, y repreguntar convierte el avance en trámite (vivido por el Director con Queswa, 7 ago 2026). Aplica a arsenales, textos dictados y system prompt; quedan ~23 dobles en arsenales para el barrido
- **"esto" / "eso"** para auto-referirnos → nombrar concretamente qué es
- **oportunidad de negocio · libertad financiera · ingreso pasivo · reclutamiento · sé tu propio jefe** → (eliminar — filtran como MLM)
- **perseguir / convencer** → (eliminar — plantan objeciones inexistentes); **pasivo** → recurrente
- **Máquina Híbrida · capas** → los tres Pilares; **Hardware/Software** → El Músculo / El Cerebro
- ⚠️ **Mostrar USD a visitante de Colombia** → **CO = SOLO COP** para TODO (precios Y comisiones, tasa fija $4,500); US = USD limpio; resto = USD (+COP). País-aware en `getPaquetesPricingPin`/`precioPaqueteLinea`/`getPinCifrasGEN5`/`getTablasComisiones`
- **PII hardcodeada en arsenales** → nunca (seguridad)

**Voz del agente (resumen de los 3 niveles)**: aforismos y nombres propios en **tercera** persona ("Queswa explica", "Centro de Mando Queswa"); lo que el agente hace AHORA en la conversación, en **primera** ("yo proceso", "me encargo"). Detalle y casos límite → el doc enlazado arriba.

**Constantes canónicas de vocabulario** (los números → ver [Queswa Official Constants](#modifying-nexus-behavior)): Tres Pilares (NUNCA "capas"/"Máquina Híbrida") · Tridente EAM = Expandir · Activar · Multiplicación · 90% automatizado · 70 países (Gano) · 15 países operativos (CreaTuActivo) · 15 cupos Fundadores.

**Cierre v5.2 (May 2026) — frase canónica única**: cuando el prospecto pregunta cómo se inicia, Queswa entrega FREQ_03 (los 3 niveles ESP + pregunta de selección) en `<verbatim_lock>`. Sin entrevista BANT, sin "equipo de Dirección Estratégica", sin "Asignación de Capital". El FSM avanza a Estado 3 (nombre) → Estado 4 (warm handoff automático).

**Historia del fundador**: [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) es el documento maestro para todo storytelling (versiones de 60s / 3min / 7min). Frase clave: *"La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."*
