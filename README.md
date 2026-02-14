# Echoglot

Real-time voice & chat translation platform. Speak in your language, be heard in theirs — in your own voice.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Backend API | Fastify (Node.js/TypeScript) |
| Database | PostgreSQL (Supabase) |
| Cache | Redis (Upstash) |
| Auth | Supabase Auth |
| Monorepo | Turborepo + pnpm workspaces |

## Project Structure

```
echoglot/
├── apps/
│   └── web/                 # Next.js frontend
├── services/
│   └── api-gateway/         # Fastify API
├── packages/
│   ├── config/
│   │   ├── typescript/      # Shared TypeScript configs
│   │   ├── eslint/          # Shared ESLint configs
│   │   └── tailwind/        # Shared Tailwind config (design system)
│   ├── shared-types/        # Shared TypeScript types
│   └── ui/                  # Shared UI component library
├── supabase/
│   └── migrations/          # Database migrations
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker

### Setup

```bash
# Install dependencies
pnpm install

# Start Redis
docker compose up -d

# Set up environment variables (see docs/PHASE1_SETUP.md)
cp apps/web/.env.local.example apps/web/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env

# Start development
pnpm dev
```

See [docs/PHASE1_SETUP.md](docs/PHASE1_SETUP.md) for detailed setup instructions including Supabase configuration.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run linting across all packages |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Clean all build artifacts |

## Architecture

- **Frontend** calls Supabase Auth directly for sign-in/sign-up/OAuth
- **Frontend** sends Supabase JWT to Fastify API for business logic
- **API Gateway** verifies JWT via Supabase and handles all CRUD operations
- **Database** uses Row Level Security (RLS) for additional protection
