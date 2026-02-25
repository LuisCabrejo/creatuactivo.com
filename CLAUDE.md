# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (**Queswa**, formerly NEXUS - rebranded in v15.0) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

**Design System**: "Quiet Luxury" with Bimetallic Accents v3.0 - See detailed guide below

**Funnel Strategy**: Russell Brunson methodology - Squeeze Page → Bridge Page → Offer (see Section 5)

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
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS (Cookie Banner in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) handles all consent UX)
- ❌ **NO guardar** PII en localStorage (solo fingerprint/session IDs)
- ❌ **NO hacer commit** de `.env.local`, API keys o secretos

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

### Core System: Framework IAA

Three-stage funnel methodology:
1. **INICIAR** (Initiate) - Landing pages, prospect identification
2. **ACOGER** (Welcome) - NEXUS AI engagement, data capture
3. **ACTIVAR** (Activate) - Escalation to human consultant

### 1. NEXUS AI Chatbot

**Naming**: User-facing brand is "Queswa" (since v15.0). Code/components still use "NEXUS" prefix (no refactor planned). Use "Queswa" in UI text, "NEXUS" in code references.

**Two-project architecture**: `creatuactivo.com` (este repo) y `luiscabrejo.com` (sitio personal) comparten el **mismo Supabase DB** y el mismo `system_prompts.nexus_main`. Cambios en el system prompt afectan a ambos proyectos. En `luiscabrejo.com` la ruta activa es `/api/nexus/route.ts` (no `/api/claude-chat/route.ts`, que es legacy sin uso).

**Key Files**:
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Main API (v14.9, fragmented architecture)
- [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts) - **PREFERRED** async queue producer
- [src/lib/vectorSearch.ts](src/lib/vectorSearch.ts) - Voyage AI embeddings + semantic search
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - React hook for chat state
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI container
- [src/components/nexus/NEXUSFloatingButton.tsx](src/components/nexus/NEXUSFloatingButton.tsx) - Floating chat trigger
- [src/components/nexus/Chat.tsx](src/components/nexus/Chat.tsx) - Chat message rendering
- [src/components/nexus/NEXUSDataCaptureCard.tsx](src/components/nexus/NEXUSDataCaptureCard.tsx) - Data capture UI
- [src/components/nexus/useSlidingViewport.ts](src/components/nexus/useSlidingViewport.ts) - Mobile viewport handling

**How It Works**:
1. **Fragmented Vector Search** (v14.9) - 3 arsenales consolidados con Voyage AI embeddings (93% token reduction):
   - `arsenal_inicial` - Initial business questions (34 responses)
   - `arsenal_avanzado` - Objections + System + Value + Escalation + Compensation (63 responses)
   - `catalogo_productos` - Product catalog (22 products + science)

2. **Data Capture** - `captureProspectData()` extracts:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification

3. **System Prompt** - Stored in Supabase `system_prompts` table (name: `nexus_main`)
   - Cached in-memory for 5 minutes
   - **DO NOT modify hardcoded fallback** - update database instead

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
| `/api/nexus/consumer-cron` | Edge | 60s | Legacy queue consumer |
| `/api/funnel` | Node | 10s | Reto 5 Días + Webinar forms |
| `/api/fundadores` | Node | 10s | Founder registration |
| `/api/diagnostico` | Edge | 30s | Audit/self-assessment |
| `/api/cron/process-emails` | Node | 60s | Soap Opera sequence |
| `/api/cron/reto-5-dias` | Node | 60s | 5-day challenge emails |
| `/api/emails/send-sequence` | Node | 30s | Generic email dispatch |
| `/api/constructor/[id]` | Node | 10s | Constructor dashboard |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails   → 0 14 * * *  (9:00 AM UTC-5 Colombia)
/api/cron/reto-5-dias      → 0 13 * * *  (8:00 AM UTC-5 Colombia)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

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

**Location**: [public/sw.js](public/sw.js) (v1.1.0)

Hybrid caching strategy for Next.js App Router:
- **Cache-first**: HTML navigation, static assets (JS, CSS, images)
- **Network-first**: Dynamic data, APIs
- **Auto-cache**: Client-side navigation via RSC (`?_rsc=` params)
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services

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

### 4. Supabase Schema

**Key Tables**:
- `prospects` - Fingerprinted visitors
- `prospect_data` - Captured info (name, email, phone, etc.)
- `nexus_documents` - Knowledge base
- `nexus_conversations` - Chat history
- `system_prompts` - Dynamic NEXUS prompts
- `nexus_queue` - Async message queue

**Key RPC Functions**:
- `identify_prospect()` - Create/update prospect
- `update_prospect_data()` - Merge new data
- `search_nexus_documents()` - Semantic search
- `enqueue_nexus_message()` - Add to queue

**Knowledge Base** (stored in `nexus_documents`, actualizado Feb 2026):
- `arsenal_inicial` - [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt) (34 responses — WHY, STORY, VS, FREQ, CRED, OBJ)
- `arsenal_avanzado` - [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt) (14 responses — OBJ avanzadas, TECH, VAL, SIST, ESC)
- `arsenal_reto` - [knowledge_base/arsenal_reto.txt](knowledge_base/arsenal_reto.txt) (**El Mapa de Salida** v3.0 — 7 responses, nomenclatura definitiva Feb 2026)
- `arsenal_12_niveles` - [knowledge_base/arsenal_12_niveles.txt](knowledge_base/arsenal_12_niveles.txt) (12-level challenge content)
- `catalogo_productos` - [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt) (22 products + science, ~20KB)
- `arsenal_compensacion` - [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt) (38 responses — plan de compensación, **NO modificar**)

**Note**: Ver [knowledge_base/README.md](knowledge_base/README.md) para documentación completa de arsenales.

### 5. Page Structure & Funnel Architecture

**Funnel Strategy** (Russell Brunson methodology - Dic 2025):
```
Tráfico Frío (Ads/Redes) → /reto-5-dias (Squeeze Page)
                              ↓
                         /reto-5-dias/gracias (Bridge Page)
                              ↓
                         WhatsApp 5 días (Nurture)
                              ↓
                         /fundadores (Oferta)

Tráfico SEO (Blog) → /blog/* (Shadow Funnel)
                              ↓
                         /reto-5-dias o /fundadores
```

**Active Pages**:
```
src/app/
├── page.tsx                         # Homepage (Funnel Hub, Quiet Luxury style)
├── layout.tsx                       # Root layout (tracking + Queswa chatbot)
├── reto-5-dias/                     # 🎯 MAIN FUNNEL ENTRY (noindex)
│   ├── page.tsx                     # Squeeze page (minimal, form only)
│   ├── layout.tsx                   # noindex metadata
│   ├── gracias/page.tsx             # Bridge page (Epiphany Bridge story)
│   ├── [ref]/page.tsx               # Referral tracking version
│   ├── dolor/page.tsx               # A/B variant: emotional pain
│   ├── analitico/page.tsx           # A/B variant: analytical approach
│   └── global/page.tsx              # A/B variant: global opportunity
├── fundadores/                      # Main founder signup (oferta)
│   └── [ref]/page.tsx               # Referral tracking
├── nosotros/                        # Epiphany Bridge Story (noindex - SEO en luiscabrejo.com)
├── blog/                            # 📝 SEO SHADOW FUNNEL
│   ├── page.tsx                     # Blog index
│   ├── network-marketing-obsoleto/  # SEO article
│   ├── empleo-vs-activos/           # SEO article
│   └── legalidad-network-marketing/ # SEO article
├── tecnologia/                      # Queswa brand search landing (indexed)
├── infraestructura/                 # Technology infrastructure (Bimetallic reference implementation)
├── presentacion-empresarial/        # Support tool for 1-on-1 (NOT in menu)
├── presentacion-empresarial-inversionistas/  # Investor-focused presentation
├── webinar/                         # Webinar funnel (WIP)
│   ├── page.tsx                     # Registration page
│   └── sala/page.tsx                # Live room with countdown
├── sistema/
│   └── productos/                   # Product catalog (SEO indexed)
│       └── [ref]/page.tsx
├── reto-12-niveles/                 # 12-level challenge (noindex, legacy)
│   └── [ref]/page.tsx
├── socios/                          # Landing for traditional networkers
├── calculadora/                     # Business calculator tool
├── diagnostico/                     # Lead magnet "Mi Auditoría"
├── paquetes/                        # Product packages
│   └── [ref]/page.tsx
├── servilleta/                      # 🎯 "The Industrial Deck" v5.1 (4-slide presentation)
├── servilleta-3/                    # "Bento Grid Industrial" layout
├── animaciones/                     # 🎬 Canvas-based social video renderer (Dan Koe style, 1080×1920 9:16, 60fps)
│   ├── dia5/, dia6/, dia7/, dia8/, dia9/   # Daily video animation projects
│   ├── dia7-v3 through dia7-v6      # A/B variants for Día 7 "Eliminación Radical"
│   └── hook-dia6/                   # Hook variant for Día 6
├── modelo-de-valor/                 # Value model page
├── paises/brasil/                   # Brazil-specific landing
├── planes/                          # Plans page
├── privacidad/                      # Privacy policy
├── offline/                         # PWA offline fallback
└── api/
    ├── nexus/                       # Queswa chatbot API
    ├── funnel/route.ts              # Funnel form submissions (reto + webinar)
    ├── fundadores/route.ts
    └── constructor/[id]/route.ts
```

**SEO Strategy** (Dic 2025):
- **Indexed pages**: `/`, `/fundadores`, `/socios`, `/blog/*`, `/tecnologia`, `/sistema/productos`, `/paquetes`
- **noindex pages** (funnel interno):
  - `/reto-5-dias/*` → Squeeze/Bridge para ADS
  - `/nosotros` → SEO en página personal Luis Cabrejo Parra

**Removed Pages** (with 301 redirects in next.config.js):
- `/soluciones/*` → `/reto-5-dias` (6 persona pages eliminated)
- `/ecosistema/*` → `/reto-5-dias` (community, academia pages eliminated)
- `/fundadores-network` → `/fundadores`
- `/fundadores-profesionales` → `/fundadores`
- `/sistema/framework-iaa` → `/reto-5-dias`
- `/sistema/tecnologia` → `/reto-5-dias`
- `/reto-12-dias` → `/reto-12-niveles`

**Dynamic `[ref]` Routes**: Landing pages support referral tracking via `/page-name/referrer-id`.

**Navigation** ([src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx)):
- **Desktop Menu**: Nosotros, Tecnología, Productos, Blog + "Reto 5 Días" CTA
- **Mobile CTA**: "Unirme al Reto" → /reto-5-dias
- **Removed from menu**: Soluciones, Ecosistema, Presentación, Auditoría
- **Presentación Empresarial**: Kept as internal tool for partners, not in public menu

### Servilleta Digital - Interactive Presentations

Sales presentation tools for 1-on-1 conversations. Uses "Industrial Realism" design (turbines, gears, concrete imagery) distinct from the main site's Quiet Luxury.

| Version | Route | Style |
|---------|-------|-------|
| v5.1 (Main) | `/servilleta` | 4-slide deck, fullscreen (F key), keyboard nav, swipe |
| v3.0 | `/servilleta-3` | Bento grid layout |

**Controls**: Arrow keys/Space (next slide), F (fullscreen), double-click (fullscreen), swipe (mobile)
**Typography**: Rajdhani (headings) + Roboto Mono (data)
**Color Palette**: Industrial (#2C3E50 steel, #009FDF cyan, #E57200 safety orange)

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

1. Update `system_prompts` table in Supabase (name: `nexus_main`)
2. Use helper scripts:
   - `leer-system-prompt.mjs` - Read current prompt
   - `descargar-system-prompt.mjs` - Download prompt to local file
   - `actualizar-system-prompt-v*.mjs` - Versioned update scripts (latest: **v19.4** — El Mapa de Salida, Feb 2026)
3. Clear cache (restart dev server or wait 5 minutes)

**DO NOT** modify fallback system prompt in [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts).

**Queswa Official Constants** (calibradas Feb 2026 — consistencia obligatoria en todos los arsenales):
- Lanzamiento público oficial: **lunes 1 de junio**
- Equipo base Fundadores inicial: **15 socios estratégicos / 15 cupos**
- Porcentaje de automatización tecnológica: **90%** (la tecnología hace el 90% del trabajo pesado)
- Dos engranajes del modelo: **El Músculo** (Gano Excel) + **El Cerebro** (CreaTuActivo)

### Updating Queswa Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Feb 2026):

**IMPORTANTE — Protocolo correcto de actualización de fragmentos:**
1. Editar el `.txt` en `knowledge_base/`
2. Deploy del documento fuente a Supabase (el script actualiza el doc padre)
3. Eliminar los fragmentos obsoletos de `nexus_documents` por `category`
4. Re-ejecutar `fragmentar-arsenales-voyage.mjs` (solo creará los eliminados)

Si saltas el paso 3, el script detectará fragmentos existentes y **NO los actualizará**.

1. Edit `.txt` files in `knowledge_base/`:
   - `arsenal_inicial.txt` - Initial questions (34 responses)
   - `arsenal_avanzado.txt` - Objections + System + Value + Escalation + Activation (14 responses)
   - `arsenal_reto.txt` - **El Mapa de Salida** v3.0 (7 responses — reto de 5 días)
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

```bash
# 1. Optimize video (creates 720p, 1080p, 4K + poster)
./scripts/optimize-video.sh /path/to/video.mp4

# 2. Upload to Vercel Blob
node scripts/upload-to-blob.mjs

# 3. Add URLs to .env.local and Vercel Dashboard
```

See [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) for details.

### Canvas Animation Videos (src/app/animaciones/)

Dan Koe-style vertical videos rendered in-browser via Canvas API + React. Used for social media content.

- **Format**: 1080×1920 (9:16 vertical), 60fps, ~38 seconds
- **Stack**: React + TypeScript + Canvas API + MediaRecorder (recording to WebM/MP4)
- **Assets**: `public/campaign-assets/` — backgrounds, visual effects, sounds
- **Handoff doc**: [HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md](HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md)

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
- `reto-5-dias/` - 5-day challenge emails (Dia1-5)
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

**Security**:
- [scripts/diagnostico-seguridad-supabase.sql](scripts/diagnostico-seguridad-supabase.sql) - RLS diagnostic
- [scripts/fix-rls-seguridad-supabase.sql](scripts/fix-rls-seguridad-supabase.sql) - RLS fix script

## Utility Scripts

**Location**: `scripts/` directory (~35 scripts)

**NEXUS System Prompt**:
- `leer-system-prompt.mjs` - Read current prompt from Supabase
- `descargar-system-prompt.mjs` - Download prompt to local file
- `actualizar-system-prompt-v*.mjs` - Versioned update scripts (latest: **v19.4** — El Mapa de Salida, Feb 2026)

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
- `regenerar-12-niveles-fragments.mjs` - Regenerate 12-level challenge embeddings
- `generar-embeddings-voyage.mjs` - Generate embeddings for new documents
- `regenerar-embeddings-voyage.mjs` - Regenerate all embeddings

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
30 videos de valor puro      →    Squeeze Page /reto-5-dias
         ↓                               ↓
"¿Cómo lo hago?"             →    Soap Opera Emails (5)
         ↓                               ↓
CTA sutil a CreaTuActivo     →    Reto 5 Días (5 videos)
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
| Protocolo de Simulación | El Mapa de Salida |
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
| 3 minutes | Bridge Page (`/reto-5-dias/gracias`) |
| 7 minutes | Webinar, Presentations |

### Two Different Audiences

| Audience | Villain | Page |
|----------|---------|------|
| **8,000 personal contacts** (friends, family, ex-Gano) | Plan por defecto | /reto-5-dias, /fundadores |
| **Traditional networkers** (know MLM) | "Haz una lista de 100" | /socios |

**Content Style**: Naval Ravikant - philosophical, value-first, no direct selling. Reference: "The Almanack of Naval Ravikant".
