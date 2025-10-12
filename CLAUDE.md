# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business ecosystem featuring an AI-powered chatbot (NEXUS) that guides prospects through the sales funnel while tracking their engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend (emails)

## Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production (TypeScript errors ignored via next.config.js)
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

**Important**: TypeScript build errors are currently ignored (`ignoreBuildErrors: true` in [next.config.js](next.config.js)). Fix type errors when possible, but builds will succeed regardless.

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

**Critical Integration**: The tracking script MUST load before NEXUS widget renders. Currently configured as synchronous script (no `defer`) in layout.tsx:111.

**✅ ARQUITECTURA ACTUAL**: Database Queue (Simplified & Free)

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
SUPABASE_SERVICE_ROLE_KEY=...

# Anthropic (already configured)
ANTHROPIC_API_KEY=sk-ant-...
```

See [.env.example](.env.example) for complete reference.

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

**Legacy Endpoint**: `/api/nexus/route.ts` remains for backward compatibility but should be migrated to `/api/nexus/producer`

#### 3. Supabase Schema

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
- `arsenal_inicial` - [knowledge_base/arsenal_conversacional_inicial.txt](knowledge_base/arsenal_conversacional_inicial.txt)
- `arsenal_manejo` - [knowledge_base/arsenal_conversacional_tecnico.txt](knowledge_base/arsenal_conversacional_tecnico.txt)
- `arsenal_cierre` - [knowledge_base/arsenal_conversacional_complementario.txt](knowledge_base/arsenal_conversacional_complementario.txt)
- `catalogo_productos` - [knowledge_base/catalogo_productos_gano_excel.txt](knowledge_base/catalogo_productos_gano_excel.txt)

#### 4. Page Structure & Routing

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
    ├── nexus/route.ts              # Main chatbot API
    ├── fundadores/route.ts         # Founder form submission
    └── test-resend/route.ts        # Email testing
```

**Navigation Components**:
- [src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) - Main site navigation (used on most pages)
- [src/app/sistema/productos/layout.tsx](src/app/sistema/productos/layout.tsx) - Custom navigation for products section

**Mobile Menu Handling**: The root layout includes extensive inline JavaScript for mobile menu toggle. When modifying navigation, be aware of the legacy mobile menu script in [src/app/layout.tsx:181-455](src/app/layout.tsx#L181-L455).

### Environment Variables

Required variables (see [.env.local](.env.local) - **DO NOT commit this file**):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # Server-side only

# Anthropic (for NEXUS)
ANTHROPIC_API_KEY=

# Resend (email service)
RESEND_API_KEY=

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

## Common Development Patterns

### Adding New NEXUS Knowledge

1. Add content to appropriate file in `knowledge_base/`
2. Update Supabase table `nexus_documents` with new content
3. If adding new document type, update `clasificarDocumentoHibrido()` in [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts:236)

### Modifying NEXUS Behavior

**DO NOT** modify the fallback system prompt in code. Instead:

1. Update `system_prompts` table in Supabase (name: `nexus_main`)
2. Clear cache by restarting dev server or waiting 5 minutes
3. Test with `/api/nexus` GET endpoint to verify prompt version

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

## Important Files Reference

### Core Application Files
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - NEXUS chatbot API (1192 lines, core business logic)
- [public/tracking.js](public/tracking.js) - Prospect tracking system (366 lines)
- [src/app/layout.tsx](src/app/layout.tsx) - Root layout with tracking integration (460 lines)
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI component
- [src/components/StrategicNavigation.tsx](src/components/StrategicNavigation.tsx) - Main navigation

### Documentation Files
- [handoff.md](handoff.md) - Phase 1 architectural rebuild roadmap (addresses "Mensaje Fantasma" and async pipeline)
- [inventory-report.md](inventory-report.md) - System inventory and status report
- [README.md](README.md) - Basic Next.js setup instructions

## Deployment Notes

- TypeScript errors do not block builds (by design)
- Ensure all environment variables are set in production
- Supabase RPC functions must be deployed before app deployment
- Knowledge base documents should be seeded into `nexus_documents` table
- Edge runtime requires Vercel or compatible platform

## Git Workflow

Current branch: `main`
Recent commits focus on NEXUS tracking fixes and race condition resolution.

When committing:
- **Never commit** `.env.local` or any files with API keys
- **Do commit** `knowledge_base/` SQL files (they document schema changes)
- Use descriptive commit messages following existing pattern (emojis optional)
