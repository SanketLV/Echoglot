# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root using `pnpm` and Turborepo.

```bash
# Install dependencies
pnpm install

# Run all dev servers (Next.js :3000 + Fastify :4000)
pnpm dev

# Run a single workspace dev server
pnpm --filter @echoglot/web dev
pnpm --filter @echoglot/api-gateway dev

# Build all packages
pnpm build

# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Format code (Prettier)
pnpm format
pnpm format:check

# Clean all build artifacts and node_modules
pnpm clean
```

Local Redis is required for the API gateway cache. Start it with:
```bash
docker compose up -d
```

## Environment Variables

**`apps/web/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**`services/api-gateway/.env`**
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=
REDIS_URL=redis://localhost:6379
PORT=4000
CORS_ORIGIN=http://localhost:3000
DEEPL_API_KEY=           # optional
GOOGLE_TRANSLATE_API_KEY= # optional
TRANSLATION_MOCK=false   # set true to skip real translation APIs
```

## Architecture

### Monorepo Layout

```
apps/web/                  Next.js 15 frontend
services/api-gateway/      Fastify 5 backend (Node.js, ESM)
packages/shared-types/     TypeScript types shared across all packages
packages/ui/               shadcn/ui component library (dark-themed)
packages/config/           Shared ESLint, Tailwind, and TypeScript configs
supabase/migrations/       SQL migrations (001–010, applied in order)
```

Turborepo manages the build pipeline. `build` tasks respect dependency order (`^build`). The `dev` task is persistent with no caching.

### Auth Flow

Supabase Auth handles authentication. The frontend uses `@supabase/ssr` to manage sessions via cookies. On every request, `apps/web/src/middleware.ts` calls `updateSession()` to refresh the Supabase session. Route groups `(auth)` and `(app)` separate public and protected pages.

When a user authenticates, the frontend passes the Supabase JWT as a Bearer token to the Fastify API. The `authPlugin` (`services/api-gateway/src/plugins/auth.ts`) validates JWTs server-side using the Supabase anon key and attaches `request.user` to every authenticated request.

A Postgres trigger (`005_auth_trigger.sql`) auto-creates a `public.users` row on first sign-up via `auth.users`.

### Frontend State

- **Zustand** manages client state: `useChatStore` (conversations, messages, typing indicators, unread counts), `useUserStore` (profile, preferences).
- **TanStack Query** handles server data fetching/caching via custom hooks in `src/hooks/`.
- WebSocket state is managed by a singleton `WsClient` in `src/lib/ws.ts` — connects with the Supabase JWT, auto-reconnects with exponential backoff, and emits typed events consumed by `useChatWs`.

### Chat / Real-time Messaging

The chat flow has two parallel channels:
1. **REST API** — CRUD for conversations and messages (`/v1/conversations/*`).
2. **WebSocket** — `ws://localhost:4000/ws/chat?token=<jwt>`. The `chatWsRoute` handles `message.send`, `typing.start`, `typing.stop`, and `read.receipt` events. Redis pub/sub (`services/api-gateway/src/services/pubsub.ts`) fans out messages to all connected instances. Incoming messages are translated at send time before being broadcast.

### Translation Pipeline

`TranslationRouter` (`services/api-gateway/src/services/translation/router.ts`) selects an engine per request:
- **DeepL** — preferred for European languages (`en/es/fr/de/pt/ko/ja/zh`) when `DEEPL_API_KEY` is set.
- **Google Cloud Translation** — fallback when `GOOGLE_TRANSLATE_API_KEY` is set.
- **MyMemory** — always available, no key required; used as the final fallback.
- **Mock** — used when `TRANSLATION_MOCK=true`.

Results are cached in Redis via `TranslationCache`. If the primary engine throws, it falls back to MyMemory automatically.

### Database

10 Supabase migrations in `supabase/migrations/` (applied in numeric order). Apply with `npx supabase db push` or manually via the SQL Editor. Key tables: `users`, `user_preferences`, `contacts`, `conversations`, `messages`, `message_translations`. All tables have RLS enabled.

Generate updated TypeScript types after schema changes:
```bash
npx supabase gen types typescript --project-id <id> > packages/shared-types/src/database.types.ts
```

### Package Imports

- Internal packages are referenced as workspace deps: `@echoglot/shared-types`, `@echoglot/ui`, `@echoglot/tsconfig`, `@echoglot/eslint-config`, `@echoglot/tailwind-config`.
- `packages/shared-types` exports source TypeScript directly (no build step) via `"exports": { ".": "./src/index.ts" }`.
- The API gateway is ESM (`"type": "module"`). All internal imports must use `.js` extensions even for `.ts` source files.
- Use `import { Redis } from 'ioredis'` (named export) — not the default export.
