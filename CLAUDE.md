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
| Update creatuactivo.com prompt | `node scripts/actualizar-system-prompt-v26.5.mjs` |
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
- ❌ **NO agregar** textos de flujo o respuestas verbatim al System Prompt (`system-prompt-nexus-main-v26_5.md`) — el backend es el dictador absoluto. Todo texto que el modelo deba imprimir exacto va en `getMicroPromptApertura()`, `getMicroPromptCierre()` o `getCierreEstado4()` en `route.ts`
- ❌ **NO modificar** el texto de `getCierreEstado4()` sin actualizar el regex de detección Estado 4 en las líneas ~3204 y ~3471 de `route.ts` — si el texto cambia y el regex no, el FSM genera handoffs duplicados
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS (Cookie Banner in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) handles all consent UX)
- ❌ **NO guardar** PII en localStorage (solo fingerprint/session IDs)
- ❌ **NO hacer commit** de `.env.local`, API keys o secretos
- ❌ **NO agregar** `backdropFilter: blur()` en cards del homepage — elimina GPU compositing en paint inicial
- ❌ **NO agregar** `priority` a imágenes decorativas del hero — usar `loading="lazy"` para que no compitan con LCP
- ❌ **NO editar** archivos `*.tsx.bak` — son respaldos inactivos, no fuente viva
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
1. **Fragmented Vector Search** (v14.9) - 8 arsenales con Voyage AI embeddings (95% token reduction, 135 fragmentos):
   - `arsenal_inicial` - WHY, STORY, VS, FREQ, CRED, OBJ, EAM, CIERRE + DIASPORA (42 respuestas activas + PERFIL_01 = 43 fragmentos) — tenant: `creatuactivo_marketing` — **v25.3** (15 May 2026) — Pilar 3 recategorizado a "La Metodología Automatizada (Tridente EAM)"; Arquitecto elevado como director, no como pilar. Bloque DIASPORA_01-03, Tres Pilares, Base Operativa, aforismos Tridente EAM, verbos de paridad
   - `arsenal_avanzado` - Objeciones complejas, sistema, valor, escalación (18 responses) — tenant: `creatuactivo_marketing` — **v10.0** (May 2026) — ADV_VAL_05 nueva (incentivos corporativos Gano Excel); **Tridente EAM con Comandos canónicos en METH_01** (Comando Expandir / Comando Activar / Comando Maestría + aforismos); Patrimonio Paralelo en OBJ_02; Queswa nombrado en OBJ_01; USD/COP unificado VAL_01/VAL_04; **ADV_TECH_03 con "Queswa, el Centro de Mando" + "sistemas de contingencia"** (Capas — no Pilares); ADV_SIST_02 "Infraestructura Continental"; ADV_SIST_03 reordenado
   - `arsenal_reto` - Auditoría Patrimonial (7 responses) — tenant: `creatuactivo_marketing` — **v4.1** (May 2026) — Arquitecto de Patrimonio, jerarquía causal Protocolo→Inestabilidad→Déficit, Pilares 1/2 en Día 3, Base Operativa digital
   - `arsenal_12_niveles` - Desafío de 12 niveles (13 blocks) — tenant: `creatuactivo_marketing`
   - `catalogo_productos` - Product catalog + science (22 products) — tenant: `creatuactivo_marketing` — **v7.0** (Abr 2026) — Lujo Clínico
   - `arsenal_compensacion` - Plan de compensación (38 responses — **NO modificar vocabulario ni cifras**) — tenant: `creatuactivo_marketing` — **v6.2** (May 2026) — Capitalización Inmediata (GEN5) / Renta Vitalicia (Binario); "su organización" reemplaza "su equipo/red"; Arquitectos de Patrimonio; Analogía del Acueducto eliminada
   - `arsenal_marca_personal` - Identidad, historia, metodología Luis Cabrejo (11 responses) — tenant: `marca_personal`
   - `arsenal_ganocafe` - Productos GanoCafe, beneficios, compra, objeciones (14 responses — incluye PROD_05 Oleaf Rooibos + PROD_06 Gano C'Real Spirulina) — tenant: `ecommerce`

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
   - Versión activa: **v26.5 "pilar3_metodologia_automatizada"** (15 May 2026) — Pilar 3 recategorizado: "Su Rol como Arquitecto" → "La Metodología Automatizada (Tridente EAM)". El Arquitecto queda elevado como director de los tres pilares, no como pieza dentro de ellos. Resuelve disonancia arquitectónica (si Pilar 3 = usuario, solo se entregan 2 pilares). 26,816 chars.
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** - update database instead (fallback ya alineado a v26.5 en `route.ts` líneas 2460-2487)
   - Verificar versión activa: `node scripts/leer-system-prompt.mjs` (no asumir que local = Supabase)
   - **Bifurcación de embudos**: `nexus_main` v26.5 sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya la landing `/executive` o `/private`. No crear aún — pendiente.
   - **v26.0 unificacion_servilleta (May 2026)**: Unifica semántica con Servilleta Digital — Tres Pilares canónicos (Matriz Física + Queswa Centro de Mando + Arquitecto de Patrimonio), Base Operativa como activo del Arquitecto, diccionario industrial completo, bloqueo de datos de entrenamiento Gano Excel obsoletos.
   - **v26.1 blindaje_why02 (May 2026)**: Añade instrucción explícita en sección LÍMITE DE RESPUESTA para entregar WHY_02 verbatim desde RAG (sin reescritura creativa). WHY_02 reformulado: pilares numerados 1/2/3, "Gano Excel" explícito, gerundios EAM (Expandir/Activar/Maestría), "Usted no vende, usted dirige", nueva pregunta de cierre como analista de capital.
   - **v26.2 comandos_tridente (May 2026)**: Resuelve conflicto semántico — "Protocolo" quedaba reservado al villano (PPO) y a procesos técnicos genéricos, pero también se usaba para el Tridente. Ahora los tres elementos del Tridente EAM se llaman **Comandos** (Comando Expandir · Comando Activar · Comando Maestría). Trinidad resultante: Centro de Mando (Queswa) → emite Comandos (Tridente EAM) → sobre la Base Operativa.
   - **v26.3 alineacion_glosario_v14 (09 May 2026)**: Alineación con Glosario Léxico Canónico v1.4 — `Patrimonio Paralelo` (sustantivo) → `Estructura Patrimonial` (fricción nivel 3 documentada en Léxico Reels), recategorización canónica `Trampa Estructural`, jerarquía causal Modelo→Inestabilidad→Déficit, vocabulario MLM tradicional colombiano prohibido (`La salida es / Escape de / Sal del`).
   - **v26.4 retrofit_friccion_nivel_5 (10 May 2026)**: Retrofit léxico contra 4 investigaciones canónicas (`public/contexto/investigaciones/`). 11 ediciones quirúrgicas: (1) eliminación frame `actualización de software financiero` × 6 instancias → `instalación de Estructura Patrimonial en paralelo` (sesgo WEIRD/tech-noir documentado); (2) `apalancamiento asimétrico` → `apalancamiento estratégico` (fricción nivel 5/5 Wall Street/Anglo); (3) `gobernanza estratégica/de activos` → `dirección estratégica/dirigir activo` (fricción nivel 5/5 corporativo); (4) eliminación negaciones discursivas (`NO es reemplazo. NO es escape.` × 2 + 3 antiejemplos en Directrices de Voz) — aplica regla v26.3 línea 25 "Describe qué ES — no qué NO ES".
   - **v26.5 pilar3_metodologia_automatizada (15 May 2026)**: Resolución de disonancia arquitectónica. **Pilar 3** recategorizado de "Su Rol como Arquitecto de Patrimonio" → "La Metodología Automatizada (El Tridente EAM)". Si Pilar 3 = el usuario, solo se entregan 2 pilares de infraestructura (Matriz Física + Queswa), no 3. El tercer pilar debe ser un componente entregado por el sistema, no el rol del receptor. El **Arquitecto de Patrimonio** queda elevado como **director de los tres pilares**, no como pieza dentro de ellos. Cross-canal: servilleta v3.1 (cierre transicional "Esta es su Base Operativa. Tres pilares. Una sola dirección: la suya." + SLIDE 2 intro reformulado), arsenal_inicial v25.3 (WHY_02 reescrito + 3 referencias `(Pilar 3)` eliminadas), home v13.3 (3 instancias + cleanup "tecnología celular"), fallback route.ts sincronizado.
   - **Archivo fuente v26.5**: `knowledge_base/system-prompt-nexus-main-v26_5.md` — deploy: `node scripts/actualizar-system-prompt-v26.5.mjs`
   - **Archivo fuente v26.4**: `knowledge_base/system-prompt-nexus-main-v26_4.md` — conservar como referencia histórica
   - **Archivo fuente v26.3**: `knowledge_base/system-prompt-nexus-main-v26_3.md` — conservar como referencia histórica
   - **Archivo fuente v26.2**: `knowledge_base/system-prompt-nexus-main-v26_2.md` — conservar como referencia histórica
   - **Archivo fuente v26.1**: `knowledge_base/system-prompt-nexus-main-v26_1.md` — conservar como referencia histórica
   - **Archivo fuente v26.0**: `knowledge_base/system-prompt-nexus-main-v26_0.md` — conservar como referencia histórica
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente.
   - **Bug activo sin resolver (Abr 2026):** PRECIOS Y CV/PV — Queswa da precios incorrectos de productos individuales en COP, CV/PV incorrectos/faltantes, y los precios de paquetes en USD sin mostrar COP. Causa raíz más probable: `catalogo_productos` no está fragmentado — se entrega como documento único de 14,748 chars. Pendiente: fragmentar catalogo_productos igual que los arsenales. Ver handoff: `public/investigaciones/HANDOFF-QUESWA-PRECIOS-CVPV.md`

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

**Knowledge Base** (stored in `nexus_documents`, actualizado Mar 2026):
- `arsenal_inicial` - [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt) (43 fragmentos — 42 respuestas activas + PERFIL_01) — **v25.3** (15 May 2026) — Pilar 3 recategorizado: "Su Rol como Arquitecto" → "La Metodología Automatizada (Tridente EAM)"; Arquitecto elevado como director de los tres pilares. Bloque DIASPORA_01-03, Tres Pilares, Base Operativa, aforismos Tridente EAM ("Usted no explica — Queswa explica", "Usted no enseña; Queswa escala"), verbos de paridad en todos los cierres, vocabulario MLM extirpado
- `arsenal_avanzado` - [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt) (18 responses — OBJ avanzadas, TECH, VAL + ADV_VAL_05, SIST, ESC) — **v10.0** (May 2026)
- `arsenal_reto` - [knowledge_base/arsenal_reto.txt](knowledge_base/arsenal_reto.txt) (**Auditoría Patrimonial** v4.1 — 7 responses — Arquitecto de Patrimonio, jerarquía causal Protocolo→Inestabilidad→Déficit, May 2026)
- `arsenal_12_niveles` - [knowledge_base/arsenal_12_niveles.txt](knowledge_base/arsenal_12_niveles.txt) (13 blocks)
- `catalogo_productos` - [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt) (22 products + science, ~20KB) — **v7.0** (Abr 2026) — Lujo Clínico
- `arsenal_compensacion` - [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt) (38 responses — **NO modificar vocabulario ni cifras**) — tenant: `creatuactivo_marketing` — **v6.2** (May 2026) — COMP_MODELO_01 "Monetización de Doble Velocidad / Capitalización Inmediata / Renta Vitalicia"; "su organización"; Análogía del Acueducto eliminada
- `arsenal_marca_personal` - [knowledge_base/arsenal_marca_personal.txt](knowledge_base/arsenal_marca_personal.txt) (11 responses — QUIEN, HIST, VISION, METOD, ACTIVO, OBJ, CONTACTO) — tenant: `marca_personal` — **v1.1** (Abr 2026)
- `arsenal_ganocafe` - [knowledge_base/arsenal_ganocafe.txt](knowledge_base/arsenal_ganocafe.txt) (16 responses — PROD_01–07, BENE, COMPRA, OBJ_GC, NEGOCIO, CODIGO) — tenant: `ecommerce`

**Note**: Ver [knowledge_base/README.md](knowledge_base/README.md) para documentación completa de arsenales.

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
- `paises/` — Páginas por destino con sub-ruta dinámica `[destino]/` (ej. `brasil/`).
- `[slug]/` — **Mini-landing personal del Arquitecto de Patrimonio** (`creatuactivo.com/luis-cabrejo`). Micro-sitio personalizado con foto, frase y links del constructor. OG dinámico para WhatsApp. Lee de `constructor_slugs` (slug, display_name, foto_url, frase_personal, whatsapp) + `private_users` (affiliation_link, profile_photo_url). ❌ NO es para blog slugs — esos van bajo `/blog/`.
- `[slug]/[destino]/` — Redirect con tracking de referral. `DESTINO_MAP` en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx) resuelve destinos cortos (home, auditoria, calculadora, productos, servilleta, activacion, dia-1..dia-5) a rutas reales con `?ref={constructorId}`.
- `presentacion-empresarial/` — Herramienta interna para 1-on-1, **NO está en el menú público**.
- `infraestructura/` — Implementación de referencia del sistema Bimetallic v3.0. Leer antes de crear nuevas páginas.
- `sistema/productos/catalogo-productos.tsx` — 🚧 WIP ("Clinical Luxury" e-commerce), sin enlazar aún desde `page.tsx`.
- `animaciones/diaX/` — Canvas-based social video renderer (Dan Koe style). Variantes A/B con sufijos `-v3` a `-v6`.
- `servilleta/` — "The Industrial Deck" v6.0. Diseño Industrial distinto al Quiet Luxury del sitio principal.
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

Sales presentation tools for 1-on-1 conversations. Uses "Industrial Realism" design (turbines, gears, concrete imagery) distinct from the main site's Quiet Luxury.

| Version | Route | Style |
|---------|-------|-------|
| v6.0 (Main) | `/servilleta` | 4-slide deck, fullscreen (F key), keyboard nav, swipe |
| v6.0 (Ref) | `/servilleta/[constructorId]` | Re-exports main page; constructorId read from URL path client-side for tracking |

**Controls**: Arrow keys/Space (next slide), F (fullscreen), double-click (fullscreen), swipe (mobile)
**Typography**: Rajdhani (headings) + Roboto Mono (data)
**Color Palette**: Industrial (#2C3E50 steel, #009FDF cyan, #E57200 safety orange)

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
  - ≤$300: "Auto-Sustentabilidad de su Unidad de Suministro (Carga Operativa Cubierta)."
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

Ver [.env.example](.env.example) para la lista completa con instrucciones de configuración.

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase
2. Use helper scripts por dominio:

| Dominio | Prompt name | Script de actualización |
|---------|-------------|------------------------|
| `creatuactivo.com` | `nexus_main` | `actualizar-system-prompt-v26.5.mjs` (latest: **v26.5** — apunta a `system-prompt-nexus-main-v26_5.md`) |
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

**Estándar Lujo Clínico** (Abr 2026 — auditado en todos los arsenales):
- Audiencia objetivo: CEOs, cirujanos, ejecutivos — toda América (USA, México, Colombia)
- Vocabulario aprobado: Apalancamiento Asimétrico, Demanda Biológica, Ingreso Inmediato/Recurrente, Portabilidad Patrimonial, Prueba Ácida Empírica, costo de oportunidad silencioso, **Base Operativa** (activo del Arquitecto), **Tres Pilares** (arquitectura canónica), **Arquitecto de Patrimonio** (rol del usuario), **Asignación de Capital para la Activación de Infraestructura** (reemplaza "compra"/"inversión"), **Subsidio de Activación Tecnológica** (reemplaza "Bono Tecnológico"/"Meses Cortesía"), **Unidad de Suministro** (reemplaza "Nodo Logístico" en copy público), **Monetización de Doble Velocidad** (Inmediata + Recurrente), **Déficit Estructural de Ingresos** (el villano sistémico)
- Vocabulario prohibido adicional: "tracción" (reemplazar por "dirección asimétrica" o "gobernanza"), "ancho de banda operativo" (reemplazar por "disponibilidad real para la dirección"), "Máquina Híbrida" (reemplazar por "Base Operativa" o "los tres pilares"), "capas" en contexto de arquitectura de negocio (usar "pilares"), "perseguir", "convencer", "multinacional" (en contexto MLM), "pasivo" (reemplazar por "recurrente"), "libertad financiera", "ingreso pasivo", "reclutamiento", PII hardcodeada, etiquetas de sub-perfil antiguas ("Esposas de Oro", "Trampa Operativa", "Creador de Ingreso Lineal")
- Regla 4: NUNCA plantar objeciones ("vender", "convencer", "perseguir") donde el héroe no las mencionó
- Referencias geográficas: pan-americanas — no Colombia-only

### Arquitectura FSM — Backend como Dictador Absoluto (Abr 2026)

Principio: el LLM es un **procesador semántico**, no un tomador de decisiones de flujo. El backend (`route.ts`) detecta el estado y controla todos los textos verbatim. Patrón: Graph Prompting (Salesforce Atlas / Bland AI / 11x.ai).

**Funciones de micro-prompt en `route.ts`** (cada estado recibe SOLO instrucciones de su nodo):

| Función | Condición de disparo | Qué controla |
|---------|---------------------|--------------|
| `getMicroPromptApertura()` | `messageCount === 1` | Saludo inicial verbatim — M1 |
| `getMicroPromptCierre()` Estado 1 | `closingState === 1` | Pregunta horas disponibles |
| `getMicroPromptCierre()` Estado 2 | `closingState === 2` | Tabla ESP (3 niveles) — **"Asignación de Capital para la Activación de Infraestructura"** — Phil Jones Three Options + Klaff Prize Frame ("No estoy seguro de si su arquitectura patrimonial está lista para el nivel máximo hoy") |
| `getMicroPromptCierre()` Estado 3 | `closingState === 3` | Solicitud nombre para expediente |
| `getCierreEstado4()` | `closingState === 4` | Entrega link WhatsApp — cierre final |

**`sessionInstructions` (Bloque 3 — no cacheable):**
- M1: inyecta `getMicroPromptApertura()` (texto verbatim, ignora Pirámide McKinsey)
- M2+: inyecta `📍 ${getMessageContext()}` para orientación del modelo
- Siempre incluye: `getPageContextInstructions()`, `getMicroPromptCierre()`, `getCierreEstado4()`, `<prospect_state>`

**Regla crítica**: NO agregar textos de flujo al System Prompt. El System Prompt es perfil de personalidad puro (identidad + tono + diccionario). Cualquier texto que el modelo deba imprimir verbatim va en las funciones de micro-prompt del backend.

**Detección Estado 4**: regex `/He consolidado su expediente|WhatsApp Directo de Activación|mesa directiva|privilegio orquestar/i` en líneas ~3204 y ~3471 de `route.ts`. Si se modifica el texto de `getCierreEstado4()`, actualizar el regex en ambas líneas.

**Tratamiento**: Siempre `Usted` — nunca tuteo. Auditado en todos los micro-prompts (Abr 2026).

### Lead Scoring v3.0

**Escala**: 0–100. Implementado en `captureProspectData()` dentro de [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts). Umbrales: 0–49 frío, 50–74 tibio, 75–89 caliente, 90–100 SQL. Las señales con mayor peso son: multi-threading +15, WhatsApp +8, verbos de compra +8, preguntas sobre inicio +8. Señal más negativa: "no me interesa" -15.

### Updating Queswa Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Feb 2026):

**IMPORTANTE — Protocolo correcto de actualización de fragmentos:**
1. Editar el `.txt` en `knowledge_base/`
2. Deploy del documento fuente a Supabase (el script actualiza el doc padre)
3. Eliminar los fragmentos obsoletos de `nexus_documents` por `category`
4. Re-ejecutar `fragmentar-arsenales-voyage.mjs` (solo creará los eliminados)

Si saltas el paso 3, el script detectará fragmentos existentes y **NO los actualizará**.

**Atajo para ediciones pequeñas** (1–3 respuestas modificadas): `node scripts/actualizar-fragmentos-modificados.mjs` — detecta y actualiza solo los fragmentos que cambiaron, sin purgar todo el arsenal. Más rápido que el flujo completo.

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

4. Verify: `node scripts/verificar-arsenal-supabase.mjs`

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
- `whatsapp-meta.ts` - Envío de mensajes WhatsApp via Meta Graph API (reemplaza SendPulse)
- `sendpulse.ts` - **LEGACY** — migrado a `whatsapp-meta.ts` (Abr 2026). Pendiente eliminar tras aprobar plantillas Meta WhatsApp

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

## Insights Estratégicos — Calibración May 2026

> **⚠️ Activos competitivos no documentados previamente.** Esta sección captura insights estratégicos de venta consolidados en sesión Luis Cabrejo + Claude (04 May 2026). Referencia para equipo de marketing, desarrollo de contenido y onboarding.

### Insight 1: Diáspora Latina como mercado no capitalizado

**Tamaño del mercado:** 800+ millones de hispanohablantes residiendo fuera de sus países de origen.

**Por qué el modelo tradicional no lo ha capitalizado:** El paradigma del marketing de redes tradicional exige reuniones presenciales y proximidad física. Esto excluye estructuralmente al latino residente en Europa, Asia, Norteamérica, etc.

**Cómo CreaTuActivo lo neutraliza:** Queswa permite construir patrimonio paralelo desde cualquier ubicación geográfica con anclaje al país natal del Arquitecto. Un colombiano en España, un peruano en Japón, un mexicano en Alemania — todos pueden desarrollar su Base Operativa en los 15 países operativos de América.

**Marco mental clave:** *"Un colombiano viviendo en España puede ser propietario de una empresa en Colombia y operarla a distancia. Esta lógica aplica idénticamente al desarrollo de patrimonio paralelo."*

**Referencia operativa:** Bloque DIÁSPORA en `arsenal_inicial.txt` v24.0 (DIASPORA_01, DIASPORA_02, DIASPORA_03).

### Insight 2: Caso Países Sin Operación Directa (Cuba, Venezuela, Argentina)

**El error común:** El prospecto originario de un país sin operación directa de Gano Excel asume que no puede participar.

**La realidad operativa:** Existen Arquitectos en posición Diamante originarios de Cuba, Venezuela y Argentina, registrados bajo Colombia, desarrollando organizaciones consistentes. Registro bajo código de país operativo cercano (típicamente Colombia).

**Referencia operativa:** DIASPORA_02 en `arsenal_inicial.txt` v24.0.

### Insight 3: Requisitos Operativos Transnacionales

Para activar Base Operativa con anclaje internacional: (1) Documento de identificación del país natal, (2) Dirección de correspondencia en el país de registro (puede ser de familiar autorizado), (3) Cuenta bancaria del país de registro.

**Referencia operativa:** DIASPORA_03 en `arsenal_inicial.txt` v24.0.

### Insight 4: Incentivos Corporativos como Activo de Retención

Gano Excel ejecuta dos eventos corporativos internacionales al año, financiados íntegramente por la corporación: Evento Continental Americano (15 países) + Evento Continental Asia-Europa (sede rotativa). El Arquitecto los promueve sin asumir pasivo financiero — corporación absorbe 100% costos.

**⚠️ Pendiente validación:** Confirmar con Gano Excel datos exactos de eventos 2026 antes de publicar ampliamente.

**Referencia operativa:** ADV_VAL_05 en `arsenal_avanzado.txt` v10.0.

### Insight 5: Diferenciación "Quién Paga Las Comisiones"

**Activo de venta crítico:** Las comisiones las paga directamente **Gano Excel**, no CreaTuActivo. Reduce significativamente fricción cognitiva sobre estabilidad del modelo.

**Referencia operativa:** ADV_VAL_02 reformulado en `arsenal_avanzado.txt` v10.0.

### Insight 6: Distinción "Continental" vs "Internacional"

- **Operación Continental:** 15 países de América donde Gano Excel opera comercialmente (capacidad operativa del Arquitecto)
- **Operación Internacional / Global:** 70 países donde Gano Excel tiene presencia corporativa (Matriz Física)
- Evitar "70 países" cuando se habla de la distribución del Arquitecto — eso es presencia corporativa, no su capacidad operativa.

**Referencia operativa:** ADV_SIST_02 en `arsenal_avanzado.txt` v10.0.

### Insight 7: WHY_02 como pregunta de máximo apalancamiento (80% del tráfico)

**Hallazgo clave:** La pregunta "¿Cómo funciona el negocio?" (WHY_02) es la consulta que concentra la mayor fracción del tráfico conversacional con prospectos. Es el momento de mayor palanca para fijar la arquitectura conceptual: Tres Pilares + Tridente EAM + Rol Arquitecto.

**Cambio de doctrina aplicado (v26.1):** WHY_02 fue reformulado para:
1. Usar formato numerado 1./2./3. (más legible y más memorable en pantalla móvil)
2. Nombrar explícitamente "Gano Excel" en Pilar 1 (evita ambigüedad sobre quién opera la Matriz Física)
3. Nombrar "bebidas enriquecidas y suplementos" (evita "productos" genérico; refuerza Lujo Clínico)
4. Verbos en gerundio "Expandir, Activar, Maestría" en el Tridente EAM
5. Afirmación "Usted no vende, usted dirige" en Pilar 3 (máxima de posicionamiento ejecutivo)
6. Nueva pregunta de seguimiento: "Como analista de su propio capital y tiempo..." (reemplaza "Al auditar su carga de trabajo actual")

**Impacto doctrinal:** System Prompt v26.2 (`blindaje_why02_comandos_tridente`) incluyó instrucción explícita de entregar WHY_02 verbatim desde el RAG sin reescritura creativa del LLM, y consolidó el vocabulario Comandos del Tridente EAM. Heredado por v26.3 (Glosario v1.4), v26.4 (retrofit fricción nivel 5) y v26.5 (Pilar 3 = Metodología Automatizada).

**Referencia operativa:** WHY_02 en `arsenal_inicial.txt` v25.3; System Prompt `nexus_main` **v26.5** en Supabase.

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
- HANDOFF-QUESWA-PRECIOS-CVPV.md - Active bug: incorrect prices/CV/PV from unfragmented `catalogo_productos`
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
- `actualizar-system-prompt-v*.mjs` - Versioned update scripts (latest: **v26.5** — pilar3_metodologia_automatizada, 15 May 2026)

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

**Words to AVOID** (activate MLM filter):
- ❌ MLM, network marketing, multinivel
- ❌ "Oportunidad de negocio"
- ❌ Reclutar, downline, upline
- ❌ "Sé tu propio jefe", "Trabaja desde casa"
- ❌ "Ingresos pasivos", "Libertad financiera" (overused)

**Words to USE** (new category positioning):
- ✅ Arquitectura de Activos
- ✅ Soberanía financiera
- ✅ Construir patrimonio
- ✅ El plan por defecto (villain)
- ✅ Leverage / Apalancamiento
- ✅ Cartera de activos
- ✅ Distribución global

### Queswa Vocabulary Rules — Jobs-Style (Feb 2026)

**Regla de oro**: Todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido.

**Vocabulario PROHIBIDO en arsenales** (erradicado en v3.0):

| Prohibido | Reemplazar con |
|-----------|---------------|
| Hardware / Software | El Músculo / El Cerebro |
| Protocolo de Simulación | Auditoría Patrimonial |
| Cupo de Validación | acceso gratuito |
| Módulos Estratégicos | Videos de instrucción |
| Iniciar Simulación / Iniciar Protocolo | Toca el botón para comenzar |
| Despliegue | Acceso / Activación |
| Nodo de distribución | (evitar) |
| Ancho de Banda Mental | (solo permitido en RETO_05 — contexto específico) |
| Pipeline / Embudo | Tubería / Canal |
| 80% automatizado | 90% automatizado |

**Metáforas aprobadas** (universales, sin jerga):
- Acueducto / Tubería / Cargar baldes
- Alquiler vs. Propiedad / Título de escrituras
- Ferrari gratis / Probar antes de comprar
- GPS Waze vs. mapa de papel
- Faro que atrae barcos

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
