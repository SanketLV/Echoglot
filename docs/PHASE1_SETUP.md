# Phase 1 Setup Guide

Step-by-step setup instructions for Echoglot Phase 1 (Foundation).

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Redis)
- A Supabase account

## 1. Clone & Install

```bash
git clone <repo-url> echoglot
cd echoglot
pnpm install
```

## 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon public key** (under Settings > API)
   - **Service role key** (under Settings > API — keep this secret!)

## 3. Configure Auth Providers

### Email/Password
- Already enabled by default in Supabase

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web Application)
3. Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google provider
   - Enter Client ID and Client Secret

## 4. Configure Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Add `http://localhost:3000/callback`

## 5. Run Database Migrations

Install the Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
```

Apply migrations:

```bash
npx supabase db push
```

Or apply them manually in the SQL Editor in the Supabase Dashboard by running each migration file in order:
1. `supabase/migrations/001_create_users.sql`
2. `supabase/migrations/002_create_user_preferences.sql`
3. `supabase/migrations/003_create_contacts.sql`
4. `supabase/migrations/004_rls_policies.sql`
5. `supabase/migrations/005_auth_trigger.sql`
6. `supabase/migrations/006_updated_at_trigger.sql`

## 6. Generate TypeScript Types (Optional)

```bash
npx supabase gen types typescript --project-id <your-project-id> > packages/shared-types/src/database.types.ts
```

## 7. Set Up Environment Variables

### Frontend (`apps/web/.env.local`)

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### API Gateway (`services/api-gateway/.env`)

```bash
cp services/api-gateway/.env.example services/api-gateway/.env
```

Fill in:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
REDIS_URL=redis://localhost:6379
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

## 8. Start Local Services

Start Redis:
```bash
docker compose up -d
```

Start the development servers:
```bash
pnpm dev
```

This starts:
- **Next.js frontend** at `http://localhost:3000`
- **Fastify API** at `http://localhost:4000`

## 9. Verify Setup

1. Visit `http://localhost:3000` — should redirect to `/login`
2. `curl http://localhost:4000/v1/health` — should return `{"success":true,"data":{"status":"ok",...}}`
3. Sign up with email/password — user should appear in Supabase Auth and `public.users`
4. After sign-up, should redirect to `/dashboard`

## Troubleshooting

### "Invalid API key" errors
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY` values

### Auth trigger not creating user profile
- Ensure migration `005_auth_trigger.sql` was applied successfully
- Check the trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`

### CORS errors
- Verify `CORS_ORIGIN` in the API gateway matches your frontend URL
