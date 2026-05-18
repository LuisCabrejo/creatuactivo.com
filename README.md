# CreaTuActivo Marketing Platform

Next.js 14 application for a multilevel marketing business ecosystem featuring an AI-powered chatbot (NEXUS) that guides prospects through the sales funnel.

## 📚 Documentation

**→ See [CLAUDE.md](CLAUDE.md) for complete development documentation** ←

The CLAUDE.md file contains:
- Development commands and workflow
- Architecture overview (NEXUS AI, tracking system, async queue)
- Common development patterns
- Testing and debugging guides
- Deployment procedures
- Utility scripts reference

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Anthropic API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (Sonnet 4)
- **Email**: Resend
- **Video**: Vercel Blob

## Key Features

- **NEXUS AI Chatbot** - Intelligent prospect engagement with hybrid document retrieval
- **Prospect Tracking** - Browser fingerprinting with multi-layer identification
- **Async Processing** - Database queue with Edge Functions for scalable message handling
- **Dynamic Content** - Founder spots counter, video hosting, email automation
- **El Tridente EAM** - Three-stage funnel (Expansión, Activación, Maestría)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/nexus/         # NEXUS chatbot API (producer/consumer/legacy)
│   ├── fundadores/        # Founder signup page
│   └── ...                # Landing pages and feature pages
├── components/            # React components
│   ├── nexus/            # NEXUS chatbot UI and hooks
│   └── ...
├── lib/                   # Shared utilities and branding
├── types/                 # TypeScript type definitions
└── emails/                # Email templates (React Email)

supabase/
├── functions/             # Edge Functions for async processing
└── migrations/            # Database migrations

knowledge_base/            # NEXUS knowledge base documents and SQL scripts
scripts/                   # Utility scripts for maintenance and testing
```

## Contributing

When committing:
- **Never commit** `.env.local` or files with API keys
- Use descriptive commit messages
- Refer to [CLAUDE.md](CLAUDE.md) for development patterns and guidelines

## Support

For questions about working with this codebase, see [CLAUDE.md](CLAUDE.md) which provides comprehensive guidance for Claude Code and human developers.
