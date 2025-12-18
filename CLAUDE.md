# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (NEXUS) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

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
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS
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

**Never commit**: `.env.local`, API keys, or secrets.

## Architecture Overview

### Core System: Framework IAA

Three-stage funnel methodology:
1. **INICIAR** (Initiate) - Landing pages, prospect identification
2. **ACOGER** (Welcome) - NEXUS AI engagement, data capture
3. **ACTIVAR** (Activate) - Escalation to human consultant

### 1. NEXUS AI Chatbot

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

**Knowledge Base** (stored in `nexus_documents`, consolidado Dic 2025):
- `arsenal_inicial` - [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt) (34 responses, ~21KB)
- `arsenal_avanzado` - [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt) (63 responses consolidadas, ~61KB)
- `arsenal_compensacion` - [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt) (compensation plan details, ~14KB)
- `catalogo_productos` - [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt) (22 products + science, ~18KB)

**Note**: Ver [knowledge_base/README.md](knowledge_base/README.md) para documentación completa de arsenales.

### 5. Page Structure

```
src/app/
├── page.tsx                         # Homepage
├── layout.tsx                       # Root layout (tracking + NEXUS)
├── fundadores/                      # Main founder signup
│   └── [ref]/page.tsx               # Referral tracking (/fundadores/luis123)
├── fundadores-network/              # Network-focused landing
│   └── [ref]/page.tsx               # Referral tracking
├── fundadores-profesionales/        # Professional-focused landing
│   └── [ref]/page.tsx               # Referral tracking
├── presentacion-empresarial/        # Business presentation
│   └── [ref]/page.tsx               # Referral tracking
├── presentacion-empresarial-inversionistas/  # Investor presentation
├── modelo-de-valor/page.tsx
├── paquetes/                        # Product packages
│   └── [ref]/page.tsx               # Referral tracking
├── paises/                          # Country-specific pages (brasil/)
├── planes/                          # Pricing plans
├── reto-12-niveles/                 # 12-level challenge landing page
│   └── [ref]/page.tsx               # Referral tracking
├── offline/                         # Offline fallback page (PWA)
├── ecosistema/                      # 3 ecosystem pages + [ref]/
├── sistema/                         # System pages + productos/[ref]/
├── soluciones/                      # Persona-specific pages (6 archetypes)
├── privacidad/                      # Privacy policy
└── api/
    ├── nexus/                       # producer/, consumer-cron/, legacy route
    ├── fundadores/route.ts
    ├── constructor/[id]/route.ts
    └── test-resend/                 # Email testing
```

**Dynamic `[ref]` Routes**: Most landing pages support referral tracking via `/page-name/referrer-id`. The `ref` parameter identifies the referring user for attribution.

**Navigation**: [src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) used on most pages.

## Environment Variables

Required in `.env.local` (see [.env.example](.env.example)):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # Server-side only

# Anthropic
ANTHROPIC_API_KEY=

# Voyage AI (vector search)
VOYAGE_API_KEY=                    # Required for semantic search in NEXUS

# Resend (emails)
RESEND_API_KEY=

# Vercel Blob (videos)
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_VIDEO_FUNDADORES_1080P=
NEXT_PUBLIC_VIDEO_FUNDADORES_720P=
NEXT_PUBLIC_VIDEO_FUNDADORES_4K=
NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER=

# Site config
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=

# SEO
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase (name: `nexus_main`)
2. Use helper scripts:
   - `leer-system-prompt.mjs` - Read current prompt
   - `descargar-system-prompt.mjs` - Download prompt to local file
   - `actualizar-system-prompt-v{VERSION}.mjs` - Versioned update scripts (e.g., v13.8)
3. Clear cache (restart dev server or wait 5 minutes)

**DO NOT** modify fallback system prompt in [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts).

### Updating NEXUS Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Dic 2025):

1. Edit `.txt` files in `knowledge_base/`:
   - `arsenal_inicial.txt` - Initial questions (34 responses)
   - `arsenal_avanzado.txt` - Objections + System + Value + Escalation + Compensation (63 responses)
   - `catalogo_productos.txt` - Product catalog + science (22 products)

2. Deploy to Supabase via scripts:
   ```bash
   node scripts/deploy-arsenal-inicial.mjs
   node scripts/deploy-arsenal-avanzado.mjs
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

## Cookie Banner & Consent

**Arquitectura**: Cookie Banner maneja TODO el UX de consentimiento. NEXUS no menciona consentimiento.

**Key File**: [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx)

**Importante**: Ver "Reglas Críticas (NO HACER)" al inicio del documento.

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

**Custom Hooks**:
- `useHydration.tsx` - Prevents hydration mismatches
- `useTracking.ts` - React wrapper for tracking API

**Shared Libraries** (in `src/lib/`):
- `branding.ts` - Centralized branding constants
- `vectorSearch.ts` - Voyage AI embeddings + cosine similarity for semantic search

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

**Security**:
- [scripts/diagnostico-seguridad-supabase.sql](scripts/diagnostico-seguridad-supabase.sql) - RLS diagnostic
- [scripts/fix-rls-seguridad-supabase.sql](scripts/fix-rls-seguridad-supabase.sql) - RLS fix script

## Utility Scripts

**Location**: `scripts/` directory (~38 scripts after Dec 2025 cleanup)

**NEXUS Management**:
- `leer-system-prompt.mjs` - Read current prompt from Supabase
- `descargar-system-prompt.mjs` - Download prompt to local file
- `actualizar-system-prompt-v{VERSION}.mjs` - Versioned update scripts (see `ls scripts/actualizar-system-prompt-*`)

**Knowledge Base**:
- `deploy-arsenal-inicial.mjs` - Deploy arsenal_inicial to Supabase
- `deploy-arsenal-avanzado.mjs` - Deploy arsenal_avanzado to Supabase
- `actualizar-catalogo-productos.mjs` - Update product catalog
- `verificar-arsenal-supabase.mjs` - Verify current version
- `descargar-arsenales-supabase.mjs` - Download arsenales from Supabase

**Embeddings** (Voyage AI):
- `fragmentar-arsenales-voyage.mjs` - Fragment arsenales into individual chunks with embeddings
- `generar-embeddings-voyage.mjs` - Generate embeddings for new documents

**Security**:
- `diagnostico-seguridad-supabase.sql` - Check RLS status on all tables
- `fix-rls-seguridad-supabase.sql` - Enable RLS and create policies

**Testing**:
- `test-contador-cupos.mjs` - Test founder counter (15 scenarios)

**Video**:
- `optimize-video.sh` - Optimize to multiple resolutions (requires FFmpeg)
- `upload-to-blob.mjs` - Upload to Vercel Blob

**Note**: Most scripts require `.env.local` variables. Run `ls scripts/` for full list.
