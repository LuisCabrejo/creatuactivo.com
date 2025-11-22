# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business ecosystem featuring an AI-powered chatbot (NEXUS) that guides prospects through the sales funnel while tracking their engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend (emails)

## Quick Reference

**Most Common Tasks**:
```bash
npm run dev                                      # Start development server
node scripts/leer-system-prompt.mjs             # View current NEXUS prompt
node scripts/test-contador-cupos.mjs            # Test founder spots counter
curl http://localhost:3000/api/nexus            # NEXUS health check
npx supabase functions deploy nexus-queue-processor  # Deploy queue processor
```

**Key Files to Modify**:
- NEXUS behavior → Update `system_prompts` table in Supabase (use scripts in `scripts/`)
- Knowledge base → Edit `.txt` files in `knowledge_base/`, then copy/paste to Supabase
- Tracking logic → [public/tracking.js](public/tracking.js)
- Business dates → `node scripts/actualizar-fechas-prelanzamiento.mjs`

## Quick Decision Tree

**I need to...**

- **Start any development work** → FIRST verify git status: `git status` (see Git Workflow section)
- **Modify NEXUS responses** → Update `system_prompts` table (see "Modifying NEXUS Behavior")
- **Add new knowledge** → Edit `.txt` files in `knowledge_base/` then copy to Supabase (see README.md)
- **Send NEXUS messages (new code)** → Use `/api/nexus/producer` endpoint (async queue, PREFERRED)
- **Test NEXUS locally** → Use `/api/nexus` with GET for health check, POST for sync testing
- **Track new user data** → Update `captureProspectData()` in route.ts
- **Change business dates** → Run `node scripts/actualizar-fechas-prelanzamiento.mjs`
- **Debug tracking issues** → Use `window.debugTracking()` in browser console
- **Fix queue processing** → Check Supabase Edge Function logs
- **Update video content** → See "Working with Video Content" section
- **Add new landing page** → See "Adding New Landing Pages" section
- **Deploy to production** → Verify git, commit, push, then check Vercel deployment (see Git Workflow)

## First Time Setup (New Developers)

1. **Verify git repository** (CRITICAL - see Git Workflow section):
   ```bash
   git status  # Should NOT return "fatal: no es un repositorio git"
   ```

2. Clone repository and install dependencies:
   ```bash
   npm install
   ```

3. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```

4. Configure required environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
   - `ANTHROPIC_API_KEY` - From anthropic.com console
   - `RESEND_API_KEY` - From resend.com (for emails)

5. Start development server:
   ```bash
   npm run dev
   ```

6. Verify NEXUS is working:
   ```bash
   curl http://localhost:3000/api/nexus
   ```

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production (TypeScript errors ignored via next.config.js)
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Testing (via utility scripts - no test runner configured)
node scripts/test-contador-cupos.mjs              # Test founder spots counter
node scripts/verificar-esquema-completo.mjs       # Verify database schema
node scripts/diagnostico-knowledge-base.js        # Diagnose knowledge base
```

**Important**: TypeScript build errors are currently ignored (`ignoreBuildErrors: true` in [next.config.js](next.config.js)). Fix type errors when possible, but builds will succeed regardless.

**Note**: This project does not use a traditional test framework (Jest/Vitest). Testing is done through utility scripts in the `scripts/` directory and manual verification.

## Architecture Overview

### Core System: Framework IAA (Iniciar, Acoger, Activar)

The application implements a three-stage funnel methodology:

1. **INICIAR** (Initiate) - Landing pages, initial prospect identification
2. **ACOGER** (Welcome) - NEXUS AI chatbot engagement, data capture
3. **ACTIVAR** (Activate) - Escalation to human consultant (Liliana Moreno)

### Key Technical Components

#### 1. NEXUS AI Chatbot System

**Location**: [src/components/nexus/](src/components/nexus/)

The NEXUS chatbot is the centerpiece of the prospect engagement system. It uses a hybrid architecture combining classification-based document retrieval with semantic search.

**Key Files**:
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Main API route with streaming responses
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - React hook managing chat state and streaming
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI component
- [src/components/nexus/NEXUSFloatingButton.tsx](src/components/nexus/NEXUSFloatingButton.tsx) - Floating chat trigger
- [src/components/nexus/useSlidingViewport.ts](src/components/nexus/useSlidingViewport.ts) - Custom scroll behavior

**How NEXUS Works**:

1. **Hybrid Document Retrieval** - Uses `clasificarDocumentoHibrido()` to route queries to the correct knowledge base:
   - `arsenal_inicial` - Initial questions about the business
   - `arsenal_manejo` - Objection handling
   - `arsenal_cierre` - Advanced questions and escalation
   - `catalogo_productos` - Product catalog queries

2. **Prospect Data Capture** - Uses `captureProspectData()` to extract:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score based on keywords and data sharing)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification (entrepreneur, professional, etc.)

3. **Streaming Responses** - Anthropic Claude Sonnet 4 with streaming for real-time UX

4. **System Prompt Architecture**:
   - Stored in Supabase `system_prompts` table
   - Cached in-memory for 5 minutes
   - Fallback to hardcoded prompt if database unavailable
   - Context augmentation with relevant documents and prospect data

**Critical Pattern**: When modifying NEXUS behavior, update the system prompt in Supabase table `system_prompts` (name: `nexus_main`) rather than hardcoded fallback. The API reads from database first.

#### 2. Prospect Tracking System

**Location**: [public/tracking.js](public/tracking.js)

Browser-based fingerprinting and session tracking loaded in [src/app/layout.tsx](src/app/layout.tsx:111).

**How Tracking Works**:

1. **Fingerprint Generation** - Creates unique browser fingerprint using:
   - Canvas fingerprinting
   - User agent, language, screen properties
   - Timezone offset
   - Random salt for uniqueness

2. **Multi-Layer Identification**:
   - Browser fingerprint (primary, persists across sessions)
   - Cookie-based ID (secondary)
   - Constructor referral parameter (`?ref=` in URL)

3. **Global API** exposed as `window.FrameworkIAA`:
   ```javascript
   window.FrameworkIAA = {
     fingerprint: "...",
     constructorRef: "...",
     prospect: { id, constructorId, isReturning, visits },
     updateProspectData: async (data) => {...}
   }
   ```

4. **Race Condition Fix**: NEXUS waits for fingerprint availability (up to 5 seconds) before sending messages. See [src/components/nexus/useNEXUSChat.ts:76-98](src/components/nexus/useNEXUSChat.ts#L76-L98).

**Critical Integration**: The tracking script uses a **deferred loading strategy** optimized for PageSpeed (deployed Nov 7, 2025):
- Script loads with `defer` attribute (non-blocking, eliminates 570ms render-blocking)
- Creates `window.FrameworkIAA` stub immediately with localStorage fingerprint
- Defers API call to `identify_prospect` using `requestIdleCallback`
- NEXUS can send messages immediately using stub, full data loads in background
- Achieved ~52% LCP improvement (2.5s → 1.2-1.5s)

**See**: [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md), [PRUEBAS_PAGESPEED_OPTIMIZACIONES.md](PRUEBAS_PAGESPEED_OPTIMIZACIONES.md), and [DEPLOY_EXITOSO_PAGESPEED.md](DEPLOY_EXITOSO_PAGESPEED.md) for details.

#### 3. Async Processing Architecture (Database Queue)

The NEXUS system uses a **database trigger architecture** with **Supabase** (no external queue service):

**Architecture**:

```
Usuario → Producer → nexus_queue (INSERT)
                           ↓ (DB Trigger)
                  Edge Function (nexus-queue-processor)
                           ↓
              Claude API + update_prospect_data RPC
```

1. **Producer** - [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts)
   - Validates incoming chat messages
   - Inserts into `nexus_queue` table via RPC `enqueue_nexus_message()`
   - Returns `202 Accepted` immediately (<100ms)
   - Idempotent by `session_id` (UNIQUE constraint)
   - Runtime: Edge (faster than Node.js)

2. **Database Queue** - `nexus_queue` table
   - States: `pending`, `processing`, `completed`, `failed`
   - Automatic trigger on INSERT → invokes Edge Function
   - Built-in retry mechanism (retry_count)
   - Auto-cleanup of old messages (7 days)

3. **Processor** - [supabase/functions/nexus-queue-processor/index.ts](supabase/functions/nexus-queue-processor/index.ts)
   - Supabase Edge Function invoked by database trigger
   - Processes message immediately (<2s latency)
   - Calls Claude API with optimized extraction prompt
   - Persists data via `update_prospect_data` RPC
   - Updates queue status (completed/failed)

**Environment Variables Required**:
```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Anthropic (already configured)
ANTHROPIC_API_KEY=sk-ant-...
```

See [.env.example](.env.example) for complete reference.

**Note**: The `.env.example` file contains outdated Confluent Kafka references from a previous architecture. These variables are no longer needed and can be ignored.

**Benefits vs Kafka**:
- ✅ **$0/month** (no Confluent Cloud, no Vercel Pro)
- ✅ **<2s latency** (vs 30-60s with polling)
- ✅ **Simpler**: One table, one trigger, one function
- ✅ **Native idempotency**: UNIQUE(session_id) constraint
- ✅ **Easy debugging**: View queue in Supabase Dashboard
- ✅ **No external dependencies**: Everything in Supabase

**Migration History**:
- ❌ pgmq was blocked due to Supabase infrastructure limitations
- ❌ Upstash Kafka (REST API) - complex setup
- ❌ Confluent Cloud (native Kafka) - required Vercel Pro ($20/mo)
- ✅ **Database Queue** (current) - free, simple, fast

**Deployment**:
See [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) for complete step-by-step guide.

Quick steps:
1. Apply SQL migration: `supabase/APPLY_MANUALLY.sql`
2. Deploy Edge Function: `npx supabase functions deploy nexus-queue-processor`
3. Create trigger: `supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`
4. Test: Send message to `/api/nexus/producer`

**API Endpoints**:
- `/api/nexus/producer` - **PREFERRED** for all new implementations. Enqueues messages for async processing
- `/api/nexus` (route.ts) - Legacy endpoint with synchronous processing. Still functional but use producer instead
- `/api/nexus/consumer-cron` - Internal cron job endpoint (not for direct use)

**When to use which**:
- **Production/New features**: Always use `/api/nexus/producer`
- **Health checks/diagnostics**: Use GET request to `/api/nexus` to verify system status
- **Backward compatibility**: Existing integrations using `/api/nexus` still work but migrate when possible

#### 4. Supabase Schema

**Tables**:
- `prospects` - Identified visitors with fingerprint, cookie, and metadata
- `prospect_data` - Captured information (name, email, phone, occupation, interest level)
- `constructors` - Referral attribution for multi-level marketing
- `nexus_documents` - Knowledge base for chatbot responses
- `nexus_conversations` - Chat history logging
- `system_prompts` - Dynamic system prompts for NEXUS
- **`nexus_queue`** - Async message queue for NEXUS processing (NEW)
  - Fields: `id`, `messages`, `fingerprint`, `session_id`, `status`, `metadata`, `created_at`, `processed_at`, `error_message`, `retry_count`
  - Idempotency: UNIQUE constraint on `session_id`
  - States: `pending`, `processing`, `completed`, `failed`

**RPC Functions**:
- `identify_prospect(p_fingerprint, p_cookie, p_url, p_device)` - Creates or updates prospect record
- `update_prospect_data(p_fingerprint_id, p_data)` - Merges new prospect data
- `search_nexus_documents(search_query, match_count)` - Semantic search over knowledge base
- **`enqueue_nexus_message(p_messages, p_session_id, p_fingerprint, p_metadata)`** - Adds message to queue (NEW)
- **`update_queue_status(p_queue_id, p_status, p_error_message)`** - Updates processing status (NEW)
- **`cleanup_old_nexus_queue()`** - Removes old completed/failed messages (NEW)

**Schema Location**: [src/types/database.ts](src/types/database.ts) (partial), [supabase-setup.sql](supabase-setup.sql)

**Knowledge Base Documents** (stored in `nexus_documents` table):
- `arsenal_inicial` - [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt)
- `arsenal_manejo` - [knowledge_base/arsenal_manejo.txt](knowledge_base/arsenal_manejo.txt)
- `arsenal_cierre` - [knowledge_base/arsenal_cierre.txt](knowledge_base/arsenal_cierre.txt)
- `catalogo_productos` - [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt)

**Note**: File names now match exactly with Supabase `category` field. See [knowledge_base/README.md](knowledge_base/README.md) for update workflow.

#### 5. Email System (Resend)

**Location**: [src/app/api/fundadores/route.ts](src/app/api/fundadores/route.ts)

The platform uses **Resend** for transactional emails:

**Key Features**:
- Welcome email to new founders with video tutorial
- Confirmation email with next steps
- Automatic redirect to `/ecosistema` after email confirmation

**Email Components** ([src/emails/](src/emails/)):
- React Email templates using `@react-email/components`
- HTML rendering via `@react-email/render`
- Styled with inline CSS for email client compatibility

**Configuration**:
- `RESEND_API_KEY` - API key from resend.com
- `NEXT_PUBLIC_SITE_URL` - Base URL for email links
- Test endpoint: `/api/test-resend`

**Pattern**: All emails send from `noreply@` domain with branded styling matching [src/lib/branding.ts](src/lib/branding.ts).

#### 6. Page Structure & Routing

**App Router Structure** (Next.js 14):

```
src/app/
├── page.tsx                         # Homepage
├── layout.tsx                       # Root layout with tracking + NEXUS
├── fundadores/page.tsx              # Founder signup form
├── presentacion-empresarial/page.tsx
├── modelo-de-valor/page.tsx
├── paquetes/page.tsx                # Investment packages
├── planes/page.tsx                  # Same as paquetes
├── ecosistema/
│   ├── page.tsx
│   ├── academia/page.tsx
│   └── comunidad/page.tsx
├── sistema/
│   ├── framework-iaa/page.tsx
│   ├── tecnologia/page.tsx
│   ├── productos/
│   │   ├── layout.tsx              # Special navigation for products
│   │   └── page.tsx
│   └── socio-corporativo/page.tsx
├── soluciones/                      # 6 different persona pages
│   ├── profesional-con-vision/page.tsx
│   ├── emprendedor-negocio/page.tsx
│   ├── independiente-freelancer/page.tsx
│   ├── lider-del-hogar/page.tsx
│   ├── lider-comunidad/page.tsx
│   └── joven-con-ambicion/page.tsx
└── api/
    ├── nexus/
    │   ├── route.ts                # Legacy chatbot API (backward compatible)
    │   ├── producer/route.ts       # Queue producer (PREFERRED)
    │   └── consumer-cron/route.ts  # Queue consumer (cron job)
    ├── fundadores/route.ts         # Founder form submission
    ├── constructor/[id]/route.ts   # Constructor profile API
    └── test-resend/route.ts        # Email testing
```

**Supabase Edge Functions** (deployed separately):
```
supabase/functions/
├── nexus-queue-processor/       # Process NEXUS messages from queue
├── nexus-consumer/              # Legacy Kafka consumer
└── notify-stage-change/         # Notify on prospect stage changes
```

**Navigation Components**:
- [src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) - Main site navigation (used on most pages)
- [src/app/sistema/productos/layout.tsx](src/app/sistema/productos/layout.tsx) - Custom navigation for products section

**Mobile Menu Handling**: The root layout includes extensive inline JavaScript for mobile menu toggle. When modifying navigation, be aware of the legacy mobile menu script in [src/app/layout.tsx:181-455](src/app/layout.tsx#L181-L455).

### Environment Variables

Required variables (see [.env.example](.env.example) for complete reference, **DO NOT commit .env.local**):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # Server-side only

# Anthropic (for NEXUS)
ANTHROPIC_API_KEY=

# Resend (for transactional emails)
RESEND_API_KEY=                    # Get from resend.com

# Vercel Blob (for video storage)
BLOB_READ_WRITE_TOKEN=             # For uploading videos
NEXT_PUBLIC_VIDEO_FUNDADORES_1080P=
NEXT_PUBLIC_VIDEO_FUNDADORES_720P=
NEXT_PUBLIC_VIDEO_FUNDADORES_4K=
NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER=

# Site config
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=        # For escalation to consultant
```

### Path Aliases

TypeScript path mapping configured in [tsconfig.json](tsconfig.json:21-23):

```typescript
import { Something } from '@/components/Something'  // → src/components/Something
import { useHook } from '@/hooks/useHook'           // → src/hooks/useHook
import type { Type } from '@/types/nexus'           // → src/types/nexus
```

### Utility Hooks & Libraries

**Custom Hooks** ([src/hooks/](src/hooks/)):
- `useHydration.tsx` - Prevents hydration mismatches by checking if component is client-side mounted
- `useTracking.ts` - React wrapper for `window.FrameworkIAA` tracking API

**Shared Libraries** ([src/lib/](src/lib/)):
- `branding.ts` - Centralized branding constants (colors, fonts, company info)

## Common Development Patterns

### Working with Video Content

**Location**: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx) (lines 204-275)

The platform uses **Vercel Blob** for video hosting with adaptive streaming:

1. **Optimize video** (creates 720p, 1080p, 4K versions + poster):
   ```bash
   ./scripts/optimize-video.sh /path/to/video.mp4
   ```

2. **Upload to Vercel Blob**:
   ```bash
   node scripts/upload-to-blob.mjs
   ```

3. **Add URLs to environment variables** (both `.env.local` and Vercel Dashboard)

**See**: [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) and [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) for complete guides.

**Cost**: ~$0.75-$2/month (vs $10-20 with Mux). Uses progressive download with automatic resolution selection.

### Founder Spots Counter

**Location**: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)

**Current Status**: Static counter showing 150 spots (as of Nov 11, 2025)

The dynamic countdown system has been **paused** and replaced with a static display:
- **Current value**: 150 spots (fixed)
- **Started**: Monday 10 Nov 2025
- **Reason for pause**: Waiting for real sales data from user

**Previous dynamic system** (now inactive):
- Start: Monday Oct 27, 2025 at 10:00 AM (UTC-5)
- Reduction: -1 spot per hour (11:00, 12:00... 20:00)
- Daily reduction: -10 spots total per day

**Testing**: Use `node scripts/test-contador-cupos.mjs` to validate logic if dynamic counter is re-enabled.

**To re-enable dynamic counter**: Edit `calcularCuposDisponibles()` function in fundadores/page.tsx and provide real sales offset.

**See**: [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) for complete specification.

### Adding New NEXUS Knowledge

**Workflow** (Updated Nov 17, 2025):

1. **Edit `.txt` files** in `knowledge_base/`:
   - `arsenal_inicial.txt` - Initial business questions (category: `arsenal_inicial`)
   - `arsenal_manejo.txt` - Objection handling (category: `arsenal_manejo`)
   - `arsenal_cierre.txt` - Advanced/closing questions (category: `arsenal_cierre`)
   - `catalogo_productos.txt` - Product catalog (category: `catalogo_productos`)

2. **Apply to Supabase manually**:
   - Copy content from `.txt` file
   - Go to Supabase Dashboard → Table Editor → `nexus_documents`
   - Find record with matching `category`
   - Paste into `content` field
   - Save changes

   **Verification**: Run `node scripts/verificar-arsenal-supabase.mjs` to check current version

3. **Update classifier** (if adding new document type):
   - Modify `clasificarDocumentoHibrido()` in [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts:236)
   - Add new classification patterns and keywords

**Important**:
- File names now match exactly with Supabase `category` field (no more `_conversacional_` prefix)
- No SQL scripts needed (simplified workflow)
- See [knowledge_base/README.md](knowledge_base/README.md) for detailed instructions

### Modifying NEXUS Behavior

**DO NOT** modify the fallback system prompt in code. Instead:

1. Update `system_prompts` table in Supabase (name: `nexus_main`)
2. Use helper scripts in `scripts/` directory:
   - `actualizar-system-prompt-flujo.mjs` - Update conversation flow
   - `actualizar-system-prompt-captura.mjs` - Update data capture behavior
   - `actualizar-system-prompt-paquetes.mjs` - Update package information
   - `leer-system-prompt.mjs` - Read current prompt version
3. Clear cache by restarting dev server or waiting 5 minutes
4. Test with `/api/nexus` GET endpoint to verify prompt version

**NEXUS Memory System**:
- Uses Anthropic's long-term memory feature (enabled via `habilitar-memoria-largo-plazo.mjs`)
- Stores conversation context across sessions using RESUMEN blocks
- Cache can be force-refreshed with `forzar-refresh-anthropic-cache.mjs`

### Adding New Landing Pages

1. Create page in appropriate `src/app/` subdirectory
2. Import and use `<StrategicNavigation />` component (unless custom nav needed)
3. Ensure NEXUS floating button renders (inherited from root layout)
4. Consider adding Quick Replies specific to page context

### Handling Prospect Data

All prospect data capture flows through:

1. Browser → `tracking.js` → Supabase RPC `identify_prospect`
2. NEXUS chat → `captureProspectData()` → Supabase RPC `update_prospect_data`

**Never** store PII in localStorage beyond fingerprint/session IDs. All persistent data goes to Supabase.

## Testing & Debugging

### NEXUS Health Check

```bash
curl http://localhost:3000/api/nexus
```

Returns system status including:
- Arsenal document counts
- System prompt version
- Catalog availability
- RPC function status

### Tracking Debug

In browser console:

```javascript
window.debugTracking()              // Full tracking state
window.FrameworkIAA                 // Current prospect context
window.reidentifyProspect()         // Force re-identification
```

### Common Issues

**Issue**: NEXUS messages not saving prospect data
- **Check**: Browser console for "CRÍTICO: Request sin fingerprint" error
- **Fix**: Ensure `tracking.js` loads before first NEXUS interaction
- **Verify**: `window.FrameworkIAA.fingerprint` exists

**Issue**: Streaming responses break or timeout
- **Check**: Network tab for failed `/api/nexus` requests
- **Fix**: Verify `ANTHROPIC_API_KEY` is valid
- **Note**: Edge runtime has 30s timeout (configurable in route.ts:22)

**Issue**: Wrong knowledge base returned
- **Debug**: Check console logs for "Clasificación híbrida" output
- **Fix**: Update classification patterns in `clasificarDocumentoHibrido()`
- **Verify**: Test with specific query patterns in Quick Replies

**Issue**: NEXUS messages queued but not processed
- **Check**: Supabase Dashboard → Edge Functions → nexus-queue-processor → Logs
- **Verify**: Database trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE '%nexus_queue%'`
- **Debug**: Check queue status: `SELECT * FROM nexus_queue WHERE status = 'pending' ORDER BY created_at DESC`
- **Fix**: Redeploy Edge Function if missing: `npx supabase functions deploy nexus-queue-processor`
- **Manual retry**: Update failed messages: `UPDATE nexus_queue SET status = 'pending' WHERE id = 'xxx'`

## Utility Scripts Reference

**Location**: [scripts/](scripts/) directory

### NEXUS System Prompt Management
- `actualizar-system-prompt-flujo.mjs` - Update conversation flow prompts
- `actualizar-system-prompt-captura.mjs` - Update data capture prompts
- `actualizar-system-prompt-paquetes.mjs` - Update package pricing prompts
- `leer-system-prompt.mjs` - Read current system prompt from Supabase
- `habilitar-memoria-largo-plazo.mjs` - Enable long-term memory feature
- `forzar-refresh-anthropic-cache.mjs` - Force refresh Anthropic cache

### Knowledge Base Management
- `actualizar-fechas-prelanzamiento.mjs` - Update launch dates in knowledge base
- `diagnostico-knowledge-base.js` - Diagnose knowledge base issues
- `auditoria-completa-knowledge-base.js` - Full knowledge base audit
- `comparar-lista-oficial.js` - Compare with official product list

### Video & Media
- `optimize-video.sh` - Optimize video to multiple resolutions (requires FFmpeg)

### Database & Schema
- `check-prospect-structure.js` - Check prospect data structure
- `fix-onboarding-strict.js` - Fix onboarding data issues

### Testing & Verification
- `test-contador-cupos.mjs` - Test founder spots counter logic (15 scenarios)
- `verificar-estructura-nexus-prospects.mjs` - Verify NEXUS-prospects data structure
- `verificar-datos-usuario-prueba.mjs` - Verify test user data
- `verificar-esquema-completo.mjs` - Verify complete database schema

**Note**: Most scripts require environment variables from `.env.local`. Run with `node scripts/script-name.mjs`.

## Important Files Reference

### Core Application Files
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - NEXUS chatbot API (legacy, use producer instead)
- [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts) - Queue producer (PREFERRED)
- [src/app/api/fundadores/route.ts](src/app/api/fundadores/route.ts) - Founder form submission & email sending
- [public/tracking.js](public/tracking.js) - Prospect tracking system (366 lines)
- [src/app/layout.tsx](src/app/layout.tsx) - Root layout with tracking integration
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI component
- [src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) - Main navigation
- [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx) - Founder signup page with video & counter
- [src/lib/branding.ts](src/lib/branding.ts) - Centralized branding constants (colors, company info)

### SEO Files (New - Nov 7, 2025)
- [src/app/sitemap.ts](src/app/sitemap.ts) - Dynamic sitemap with 24 public URLs
- [src/app/robots.ts](src/app/robots.ts) - Robots.txt configuration (blocks /api/, /dashboard/, /admin/)
- [src/app/layout.tsx](src/app/layout.tsx) - Enhanced JSON-LD structured data (Organization, Offer, ContactPoint)

### Supabase Edge Functions
- [supabase/functions/nexus-queue-processor/](supabase/functions/nexus-queue-processor/) - Process queued NEXUS messages

### Documentation Files

**NEXUS & Arsenales:**
- [HANDOFF_ARSENALES_JOBS_STYLE_NOV20.md](HANDOFF_ARSENALES_JOBS_STYLE_NOV20.md) - **MASTER**: Filosofía Jobs-Style + Deploy arsenales (20 Nov 2025)
- [DEPLOY_SUCCESS_ARSENALES_JOBS_STYLE.md](DEPLOY_SUCCESS_ARSENALES_JOBS_STYLE.md) - Deploy report arsenales Jobs-Style (20 Nov 2025)
- [HANDOFF_FUNDADORES_PROFESIONALES_REDESIGN.md](HANDOFF_FUNDADORES_PROFESIONALES_REDESIGN.md) - Rediseño /fundadores-profesionales (18 Nov 2025)
- [HANDOFF_VIDEO_FUNDADORES_CONTEXTO_COMPLETO.md](HANDOFF_VIDEO_FUNDADORES_CONTEXTO_COMPLETO.md) - Video hero context (17 Nov 2025)

**SEO & PageSpeed (Nov 7, 2025):**
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](GOOGLE_SEARCH_CONSOLE_SETUP.md) - Complete GSC setup guide
- [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations (defer tracking.js, preconnect)
- [PRUEBAS_PAGESPEED_OPTIMIZACIONES.md](PRUEBAS_PAGESPEED_OPTIMIZACIONES.md) - Testing guide for PageSpeed
- [DEPLOY_EXITOSO_PAGESPEED.md](DEPLOY_EXITOSO_PAGESPEED.md) - PageSpeed deployment verification
- [LIMPIEZA_SEO_NOV20.md](LIMPIEZA_SEO_NOV20.md) - SEO documentation cleanup (20 Nov 2025)

**Infrastructure & Queue:**
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Complete deployment guide for queue system

**Video & Media:**
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video implementation guide
- [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) - Quick start for video upload

**Business Logic:**
- [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) - Spots counter specification

**Cleanup Reports:**
- [LIMPIEZA_HANDOFF_NOV20.md](LIMPIEZA_HANDOFF_NOV20.md) - HANDOFF files cleanup (20 Nov 2025)
- [RESUMEN_ACTUALIZACIONES_26OCT.md](RESUMEN_ACTUALIZACIONES_26OCT.md) - Updates summary (Oct 26, 2025)

## Business Critical Dates

**Current Timeline** (as of November 2025):

1. **Lista Privada (Private List)**: 10 Nov - 30 Nov 2025 (ACTIVE)
   - 150 Founder spots
   - Started: Monday 10 Nov, 2025
   - Mentorship ratio: 1 Founder → 150 Constructors
   - **Role emphasis**: Fundadores actúan como **MENTORES**

2. **Pre-Lanzamiento (Pre-Launch)**: 01 Dic 2025 - 01 Mar 2026 (UPCOMING)
   - 22,500 Constructor spots (150 Founders × 150)
   - 3-month mentorship period
   - 150 Fundadores become **MENTORES** to new Constructors

3. **Lanzamiento Público (Public Launch)**: 02 Mar 2026
   - Target: 4M+ users across Latin America (3-7 year goal)

**IMPORTANT**: These dates are reflected across:
- Frontend: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx) - Timeline visual
- Knowledge base: All 3 arsenales (inicial, manejo, cierre)
- Database: Supabase `nexus_documents` table

**Date Change History**:
- Original dates (Oct 27 - Nov 16 - Jan 5, 2026): OBSOLETE
- Current dates (Nov 10 - Dec 1 - Mar 2, 2026): ACTIVE since Nov 11, 2025

When updating dates, use `node scripts/actualizar-fechas-prelanzamiento.mjs` to sync across all systems.

## Deployment Notes

### Next.js Application (Vercel)

- TypeScript errors do not block builds (by design via `next.config.js`)
- Ensure all environment variables are set in production (Vercel Dashboard → Settings → Environment Variables)
- Edge runtime requires Vercel or compatible platform
- Video URLs must be configured in production environment variables

### Supabase Deployment

**Critical order**:
1. **First**: Apply database migrations from `supabase/migrations/` or `supabase/APPLY_MANUALLY.sql`
2. **Second**: Seed knowledge base documents into `nexus_documents` table (copy from `.txt` files in `knowledge_base/`)
3. **Third**: Deploy Edge Functions:
   ```bash
   # Required for queue processing
   npx supabase functions deploy nexus-queue-processor

   # Optional (legacy)
   npx supabase functions deploy nexus-consumer
   npx supabase functions deploy notify-stage-change
   ```
4. **Fourth**: Create database triggers (see `supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`)
5. **Finally**: Update system prompts in `system_prompts` table

**Verify deployment**:
- Check Edge Function logs: Supabase Dashboard → Edge Functions → nexus-queue-processor → Logs
- Test queue: `curl -X POST https://your-app.vercel.app/api/nexus/producer -d '...'`
- Check queue table: Supabase Dashboard → Table Editor → nexus_queue

## Git Workflow

Current branch: `main`

### ⚠️ CRITICAL: Git Repository Setup Issue (Nov 15, 2025)

**PROBLEM DISCOVERED**: The local repository at `/Users/luiscabrejo/Cta/marketing/` may lose its `.git` directory, causing deployment issues.

**Symptoms**:
- ✅ Local changes work perfectly (http://localhost:3000)
- ❌ Production shows old code (https://creatuactivo.com)
- ❌ `git status` returns: "fatal: no es un repositorio git"
- ⚠️ Vercel deployments show "vercel deploy" instead of `main` branch

**Root Cause**: The `.git` directory was missing from the local repository, preventing Git operations.

**Solution (Step-by-Step)**:
```bash
# 1. Verify if .git exists
ls -la | grep "\.git"

# 2. If missing, reinitialize git
git init

# 3. Connect to GitHub remote
git remote add origin https://github.com/LuisCabrejo/creatuactivo.com.git

# 4. Fetch remote state
git fetch origin main

# 5. Reset to match remote (WARNING: This overwrites local files)
git reset --hard origin/main

# 6. IMPORTANT: If you have local changes, restore them BEFORE step 5
# Save your changed files elsewhere first!

# 7. Add and commit changes
git add src/app/fundadores/page.tsx  # or other changed files
git commit -m "✨ Your commit message"

# 8. Rename master to main if needed
git branch -m master main

# 9. Push to GitHub
git push -u origin main
```

**BEST PRACTICE for Agents**:
1. **Always verify git status FIRST** before making changes: `git status`
2. **If .git is missing**, follow the solution above
3. **NEVER use `git reset --hard`** without confirming user has backups of local changes
4. **Save work in progress** to a temporary file before git operations
5. **Verify GitHub after push**: Check the actual file on GitHub matches local version

**Verification Checklist**:
- [ ] `git status` works (no "fatal: no es un repositorio git")
- [ ] `git remote -v` shows correct GitHub URL
- [ ] `git branch` shows `main` (not `master`)
- [ ] After push, GitHub shows updated code
- [ ] Vercel deployment shows `main` branch source (not "vercel deploy")
- [ ] Production site shows new content after deployment completes

**Post-Deployment Verification**:
```bash
# 1. Verify GitHub has the changes
# Visit: https://github.com/LuisCabrejo/creatuactivo.com/blob/main/[your-file]

# 2. Monitor Vercel deployment
# Vercel Dashboard → Deployments → Look for "main" branch icon

# 3. Test production (wait 1-2 min after deploy shows "Ready")
# Visit: https://creatuactivo.com/[your-page]
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
```

### Recent Significant Updates

- **Nov 21, 2025**: Cookie Banner implementation + System Prompt v17.0 (zero consent)
- **Nov 20, 2025**: Optimización PageSpeed /sistema/productos - Next.js Image component (ahorro ~2.4 MB)
- **Nov 15, 2025**: Fixed git repository setup issue + deployed fundadores v3-simplified
- **Nov 11, 2025**: Business dates updated (10 Nov - 01 Dic - 02 Mar) + MENTOR role emphasis
- **Nov 11, 2025**: Founder spots counter paused at 150 (static)
- Nov 7, 2025: PageSpeed optimizations (defer tracking.js, preconnect Supabase)
- Oct 26, 2025: Massive cleanup (70+ obsolete files removed)
- Oct 26, 2025: Email redirect fix for Founders

### Standard Git Operations

**BEFORE starting ANY development work**:
```bash
git status  # Verify repository is working
```

When committing:
- **Never commit** `.env.local` or any files with API keys
- **Do commit** `knowledge_base/` `.txt` files (they are the source of truth for NEXUS knowledge)
- Use descriptive commit messages following existing pattern (emojis optional)
- **Always verify** git status before starting work
- **Always check GitHub** after pushing to confirm changes uploaded

**Standard commit workflow**:
```bash
# 1. Verify git is working
git status

# 2. Stage changes
git add [files]

# 3. Commit with descriptive message
git commit -m "✨ feat: Your descriptive message"

# 4. Push to main
git push origin main

# 5. VERIFY on GitHub that changes are there
# Visit: https://github.com/LuisCabrejo/creatuactivo.com/blob/main/[your-file]

# 6. Monitor Vercel deployment
# Vercel Dashboard → Look for "main" branch deployment
```

## Cookie Banner & Consent Management

**Last Updated:** Nov 21, 2025

### Architecture Overview

The platform uses a **professional Cookie Banner** approach (like Amazon/Google) instead of NEXUS asking for consent:

```
Cookie Banner (Footer) → Handles ALL consent UX
       ↓
NEXUS (Chatbot) → System Prompt v17.0 (ZERO consent mentions)
       ↓
Backend (route.ts) → Clean flow without interception
       ↓
Supabase → Data persists by fingerprint
```

### Key Components

**1. Cookie Banner Component**
- **File:** [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx)
- **Appears:** 1 second after page load (first visit only)
- **Position:** Fixed footer, professional design
- **Storage:** `localStorage.cookie_consent` (accepted/rejected)
- **Integration:** Root layout ([src/app/layout.tsx](src/app/layout.tsx))

**2. System Prompt (NEXUS Behavior)**
- **Version:** v17.0_zero_consent_aggressive_clean
- **Table:** Supabase `system_prompts` (name: `nexus_main`)
- **Status:** 100% free of consent mentions (8,307 characters removed)
- **Script:** [scripts/eliminar-todo-consentimiento-agresivo.mjs](scripts/eliminar-todo-consentimiento-agresivo.mjs)
- **Verification:** `grep -i "consentimiento\|autorización\|aceptas"` returns 0 matches

**3. Backend Clean Flow**
- **File:** [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts)
- **Removed:** Lines 1850-1914 (consent interception logic)
- **Flow:** User message → Load history → Call Claude API → Stream response
- **No blocking:** NEXUS never interrupts conversation for consent

### Modifying NEXUS Consent Behavior

**DO NOT:**
- ❌ Add consent logic to route.ts
- ❌ Modify System Prompt to ask for consent
- ❌ Create new consent modals in NEXUS

**DO:**
- ✅ Modify Cookie Banner UI/text in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx)
- ✅ Update privacy policy link in Cookie Banner
- ✅ Maintain System Prompt v17.0 without consent mentions

### Common Issues & Solutions

**Issue:** NEXUS asks for consent again
- **Check:** System Prompt version in Supabase (`SELECT version FROM system_prompts WHERE name = 'nexus_main'`)
- **Expected:** v17.0_zero_consent_aggressive_clean
- **Fix:** Wait 5 minutes for Anthropic cache to expire, or run aggressive cleanup script again

**Issue:** Cookie Banner appears every time
- **Check:** Browser localStorage for `cookie_consent` key
- **Fix:** Verify CookieBanner component `useEffect` logic and localStorage.setItem calls

**Issue:** "Limpiar Pizarra" re-asks for name/occupation
- **Status:** Known issue (Nov 21, 2025)
- **Cause:** resetChat() clears localStorage flags, backend loses context
- **Fix needed:** Persist session_id across resets, load historical data by fingerprint

### Scripts Reference

**Cookie Banner & Consent:**
- `scripts/eliminar-todo-consentimiento-agresivo.mjs` - Remove ALL consent from System Prompt (v17.0)
- `scripts/leer-system-prompt.mjs` - Read current System Prompt version

**Historical (obsolete):**
- `scripts/solucion-radical-consentimiento.mjs` - v14.0 attempt (failed)
- `scripts/aplicar-solucion-limpia-consentimiento.mjs` - v13.0 attempt (failed)
- `scripts/eliminar-consentimiento-system-prompt.mjs` - v16.0 attempt (incomplete)
