# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (NEXUS) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

## Development Commands

```bash
# Development
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

## Critical Git Workflow

**BEFORE any development work**:
```bash
git status  # MUST verify repository is working
```

The local repository at `/Users/luiscabrejo/Cta/marketing/` has **lost its `.git` directory** in the past. Always verify git status before starting work.

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
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Legacy API (backward compatible)
- [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts) - **PREFERRED** async queue producer
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - React hook for chat state
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI

**How It Works**:
1. **Hybrid Document Retrieval** - `clasificarDocumentoHibrido()` routes queries to:
   - `arsenal_inicial` - Initial business questions
   - `arsenal_manejo` - Objection handling
   - `arsenal_cierre` - Advanced questions/escalation
   - `catalogo_productos` - Product catalog

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

**Knowledge Base** (stored in `nexus_documents`):
- `arsenal_inicial` - [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt)
- `arsenal_manejo` - [knowledge_base/arsenal_manejo.txt](knowledge_base/arsenal_manejo.txt)
- `arsenal_cierre` - [knowledge_base/arsenal_cierre.txt](knowledge_base/arsenal_cierre.txt)
- `catalogo_productos` - [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt)

### 5. Page Structure

```
src/app/
├── page.tsx                         # Homepage
├── layout.tsx                       # Root layout (tracking + NEXUS)
├── fundadores/page.tsx              # Founder signup
├── presentacion-empresarial/page.tsx
├── modelo-de-valor/page.tsx
├── paquetes/page.tsx
├── ecosistema/                      # 3 pages
├── sistema/                         # 4 pages + productos/
├── soluciones/                      # 6 persona pages
└── api/
    ├── nexus/                       # 3 endpoints
    ├── fundadores/route.ts
    └── constructor/[id]/route.ts
```

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
```

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase (name: `nexus_main`)
2. Use helper scripts:
   - `leer-system-prompt.mjs` - Read current prompt
   - `actualizar-system-prompt-flujo.mjs` - Update conversation flow
   - `actualizar-system-prompt-captura.mjs` - Update data capture
3. Clear cache (restart dev server or wait 5 minutes)

**DO NOT** modify fallback system prompt in [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts).

### Updating NEXUS Knowledge

**Workflow**:

1. Edit `.txt` files in `knowledge_base/`:
   - `arsenal_inicial.txt`
   - `arsenal_manejo.txt`
   - `arsenal_cierre.txt`
   - `catalogo_productos.txt`

2. Copy to Supabase manually:
   - Supabase Dashboard → Table Editor → `nexus_documents`
   - Find record with matching `category`
   - Paste content from `.txt` file
   - Save

3. Verify: `node scripts/verificar-arsenal-supabase.mjs`

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

**Status**: Static counter showing 150 spots (as of Nov 11, 2025). Dynamic system paused waiting for real sales data.

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

**Architecture** (Nov 21, 2025):

```
Cookie Banner (Footer) → Handles ALL consent UX
NEXUS (Chatbot) → System Prompt v17.0 (ZERO consent mentions)
Backend (route.ts) → Clean flow without interception
Supabase → Data persists by fingerprint
```

**Key Files**:
- [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) - Banner component
- Supabase `system_prompts` (v17.0_zero_consent_aggressive_clean)

**DO NOT**:
- ❌ Add consent logic to route.ts
- ❌ Modify System Prompt to ask for consent
- ❌ Create consent modals in NEXUS

**DO**:
- ✅ Modify Cookie Banner UI/text in CookieBanner.tsx
- ✅ Maintain System Prompt v17.0 without consent

## Business Critical Dates

**Current Timeline** (Nov 2025):

1. **Lista Privada**: 10 Nov - 30 Nov 2025 (ACTIVE)
   - 150 Founder spots
   - Role: Fundadores = MENTORES

2. **Pre-Lanzamiento**: 01 Dic 2025 - 01 Mar 2026
   - 22,500 Constructor spots (150 × 150)

3. **Lanzamiento Público**: 02 Mar 2026
   - Target: 4M+ users (3-7 year goal)

**Update dates**: `node scripts/actualizar-fechas-prelanzamiento.mjs`

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

## Important Patterns & Constraints

**Path Aliases** (tsconfig.json):
```typescript
import { X } from '@/components/X'  // → src/components/X
import { Y } from '@/hooks/Y'       // → src/hooks/Y
import type { Z } from '@/types/Z'  // → src/types/Z
```

**Custom Hooks**:
- `useHydration.tsx` - Prevents hydration mismatches
- `useTracking.ts` - React wrapper for tracking API

**Shared Libraries**:
- `branding.ts` - Centralized branding constants

**Prospect Data Flow**:
1. Browser → `tracking.js` → RPC `identify_prospect`
2. NEXUS → `captureProspectData()` → RPC `update_prospect_data`

**Never** store PII in localStorage (only fingerprint/session IDs).

## Key Documentation Files

**Architecture & Deploy**:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Queue system deployment
- [HANDOFF_ARSENALES_JOBS_STYLE_NOV20.md](HANDOFF_ARSENALES_JOBS_STYLE_NOV20.md) - Jobs-Style arsenales (Nov 20)

**SEO & Performance**:
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](GOOGLE_SEARCH_CONSOLE_SETUP.md) - GSC setup
- [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations
- [DEPLOY_EXITOSO_PAGESPEED.md](DEPLOY_EXITOSO_PAGESPEED.md) - PageSpeed verification

**Video & Media**:
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video implementation
- [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) - Quick start guide

**Business Logic**:
- [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) - Spots counter spec

## Utility Scripts

**Location**: `scripts/` directory

**NEXUS Management**:
- `leer-system-prompt.mjs` - Read current prompt
- `actualizar-system-prompt-*.mjs` - Update specific prompt sections
- `habilitar-memoria-largo-plazo.mjs` - Enable long-term memory
- `eliminar-todo-consentimiento-agresivo.mjs` - Remove consent (v17.0)

**Knowledge Base**:
- `actualizar-fechas-prelanzamiento.mjs` - Update launch dates
- `verificar-arsenal-supabase.mjs` - Verify current version
- `diagnostico-knowledge-base.js` - Diagnose issues

**Testing**:
- `test-contador-cupos.mjs` - Test founder counter (15 scenarios)
- `verificar-esquema-completo.mjs` - Verify database schema

**Video**:
- `optimize-video.sh` - Optimize to multiple resolutions (requires FFmpeg)
- `upload-to-blob.mjs` - Upload to Vercel Blob

**Note**: Most scripts require `.env.local` variables.
