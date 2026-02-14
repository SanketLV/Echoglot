# Echoglot — System Architecture & Tech Stack

| Field             | Detail                     |
|-------------------|----------------------------|
| **Document Owner**| Sanket Lakhani             |
| **Status**        | Draft                      |
| **Version**       | 1.0                        |
| **Last Updated**  | 2026-02-11                 |

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack Decisions](#2-tech-stack-decisions)
3. [System Components Deep Dive](#3-system-components-deep-dive)
4. [The Translation Pipeline — The Core Engine](#4-the-translation-pipeline)
5. [Real-Time Communication Layer](#5-real-time-communication-layer)
6. [Data Architecture](#6-data-architecture)
7. [API Design](#7-api-design)
8. [Infrastructure & Deployment](#8-infrastructure--deployment)
9. [Security Architecture](#9-security-architecture)
10. [Scalability & Performance](#10-scalability--performance)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Cost Estimation](#12-cost-estimation)
13. [MVP Build Sequence](#13-mvp-build-sequence)

---

## 1. Architecture Overview

### 1.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ECHOGLOT PLATFORM                                       │
│                                                                                      │
│  ┌──────────┐    ┌──────────────────────────────────────────────┐    ┌──────────┐   │
│  │ Client A │    │            REAL-TIME LAYER                    │    │ Client B │   │
│  │ (Web/    │◄──►│                                              │◄──►│ (Web/    │   │
│  │  Mobile) │    │  ┌────────────────────────────────────────┐  │    │  Mobile) │   │
│  │          │    │  │     LiveKit Media Server (WebRTC)       │  │    │          │   │
│  │ Lang: FR │    │  │  ┌─────┐  ┌────────┐  ┌────────────┐  │  │    │ Lang: EN │   │
│  │          │    │  │  │Audio│──│ Server │──│ Translation │  │  │    │          │   │
│  │          │    │  │  │Track│  │ Plugin │  │  Pipeline   │  │  │    │          │   │
│  │          │    │  │  └─────┘  └────────┘  └────────────┘  │  │    │          │   │
│  └──────────┘    │  └────────────────────────────────────────┘  │    └──────────┘   │
│                  └──────────────────────────────────────────────┘                    │
│                                       │                                              │
│                                       ▼                                              │
│  ┌──────────────────────────────────────────────────────────────────────────────┐    │
│  │                        TRANSLATION PIPELINE                                  │    │
│  │                                                                              │    │
│  │  ┌──────────┐    ┌──────────────┐    ┌───────────────┐    ┌──────────────┐  │    │
│  │  │  Deepgram│───▶│   DeepL /    │───▶│  Voice Clone  │───▶│  Streaming   │  │    │
│  │  │   STT    │    │  Google NMT  │    │   TTS (XTTS)  │    │  Audio Out   │  │    │
│  │  │(Streaming│    │  Translation │    │  + ElevenLabs │    │  via WebRTC  │  │    │
│  │  │  ~300ms) │    │   (~200ms)   │    │   (~500ms)    │    │              │  │    │
│  │  └──────────┘    └──────────────┘    └───────────────┘    └──────────────┘  │    │
│  │                                                                              │    │
│  │  Total Target Latency: ≤ 1.5 seconds end-to-end                             │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐    │
│  │                          APPLICATION LAYER                                   │    │
│  │                                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐   │    │
│  │  │  API Gateway  │  │  Auth Service │  │ Chat Service│  │ Voice Profile  │   │    │
│  │  │   (Kong/     │  │  (Supabase   │  │  (WebSocket) │  │    Service     │   │    │
│  │  │   Nginx)     │  │   Auth)      │  │             │  │               │   │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  └────────────────┘   │    │
│  │                                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐   │    │
│  │  │  User Service │  │  Call Service │  │Subscription │  │  Notification  │   │    │
│  │  │              │  │              │  │   Service   │  │    Service     │   │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  └────────────────┘   │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────┐    │
│  │                           DATA LAYER                                         │    │
│  │                                                                              │    │
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │    │
│  │  │PostgreSQL│   │  Redis   │   │   S3 /   │   │ClickHouse│   │  Kafka   │ │    │
│  │  │ (Primary │   │ (Cache + │   │   R2     │   │(Analytics│   │ (Event   │ │    │
│  │  │   DB)    │   │  PubSub) │   │(Blobs)   │   │  OLAP)   │   │ Stream)  │ │    │
│  │  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘ │    │
│  └──────────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Style

**Event-Driven Microservices** with a **Streaming Media Core**.

Why this architecture:
- **Microservices**: Each concern (auth, chat, voice, translation) has different scaling characteristics. The translation pipeline needs GPU instances; the chat service needs WebSocket connections; auth is stateless.
- **Event-Driven**: Call events, translation completions, and chat messages are naturally asynchronous events. Kafka/Redis Pub-Sub decouples producers from consumers.
- **Streaming Core**: The translation pipeline is fundamentally a streaming data pipeline (audio in → processed audio out). It must be designed as a stream processor, not a request/response service.

---

## 2. Tech Stack Decisions

### 2.1 Summary Table

| Layer                  | Choice                            | Alternative Considered     | Rationale                                         |
|------------------------|-----------------------------------|----------------------------|---------------------------------------------------|
| **STT**                | Deepgram (API)                    | Whisper (self-hosted), AssemblyAI | Lowest streaming latency (~300ms), best real-time support, all 5 languages |
| **Translation**        | DeepL API (primary) + Google Cloud Translation (fallback) | Meta NLLB, GPT-4 | Best quality for EN↔EU langs, Google covers Mandarin/Hindi better |
| **Voice Clone / TTS**  | ElevenLabs API (MVP) → XTTS self-hosted (scale) | PlayHT, Coqui, Azure CNV | Best cross-lingual cloning quality; migrate to self-hosted for cost |
| **Media Server**       | LiveKit (self-hosted)             | Janus, Mediasoup, Agora    | Best server-side audio processing, open-source, built for AI pipelines |
| **Frontend (Web)**     | Next.js 15 + React 19             | SvelteKit, Vue              | SSR for landing/marketing, React ecosystem, team familiarity |
| **Frontend (Mobile)**  | React Native + Expo               | Flutter                     | Code sharing with web (React), mature ecosystem   |
| **Backend**            | Node.js (Fastify) + Python (FastAPI) | Go, Express               | Fastify for API speed; Python for ML pipeline integration |
| **Database**           | PostgreSQL (Supabase)             | PlanetScale, CockroachDB   | Full-featured, Supabase gives auth + realtime + storage free |
| **Cache**              | Redis (Upstash)                   | Memcached, DragonflyDB     | Pub/Sub + cache + rate limiting in one; serverless pricing |
| **Object Storage**     | Cloudflare R2                     | AWS S3, GCS                | Zero egress fees (critical for audio file serving) |
| **Message Queue**      | Redis Streams (MVP) → Kafka (scale) | RabbitMQ, SQS           | Redis Streams sufficient for MVP; Kafka for multi-consumer at scale |
| **Infrastructure**     | AWS (primary) + Cloudflare (edge) | GCP, Azure                | Best GPU instance availability; Cloudflare for global edge |
| **CI/CD**              | GitHub Actions                    | GitLab CI, CircleCI        | Native GitHub integration, generous free tier      |
| **Monitoring**         | Grafana Cloud + Sentry            | Datadog, New Relic         | Open-source compatible; cost-effective at scale    |

### 2.2 Detailed Tech Decisions

#### Decision 1: STT — Deepgram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STT COMPARISON                                │
├──────────────┬──────────┬──────────┬──────────┬────────────────┤
│              │ Deepgram │ Whisper  │AssemblyAI│ Google STT V2  │
│              │  (API)   │(self-host│  (API)   │    (API)       │
├──────────────┼──────────┼──────────┼──────────┼────────────────┤
│ Streaming    │ ✅ Yes   │ ⚠️ Hack │ ✅ Yes   │ ✅ Yes         │
│ Latency      │ ~300ms   │ ~1-2s   │ ~500ms   │ ~400ms         │
│ EN/ZH/ES/FR/HI│ ✅ All  │ ✅ All  │ ⚠️ 4/5  │ ✅ All         │
│ Accuracy     │ High     │ Highest │ High     │ High           │
│ Pricing      │$0.0043/m │ GPU cost│$0.0050/m │ $0.0060/min    │
│ Interim Results│ ✅ Yes │ ❌ No   │ ✅ Yes   │ ✅ Yes         │
└──────────────┴──────────┴──────────┴──────────┴────────────────┘
```

**Decision**: Deepgram Nova-3.
- Lowest real-time streaming latency (~300ms to first interim result)
- Native streaming WebSocket API with interim/final results
- Supports all 5 target languages
- Competitive pricing at $0.0043/min
- Endpointing detection (knows when speaker finishes a phrase — critical for pipeline)

**Migration Path**: If we need lower latency or higher accuracy later, we can self-host Whisper Large V3 on GPU instances with a custom streaming wrapper. Keep the STT interface abstract.

#### Decision 2: Translation — DeepL + Google Cloud Translation (Hybrid)

```
┌──────────────────────────────────────────────────────────────┐
│                 TRANSLATION COMPARISON                        │
├──────────────┬──────────┬──────────┬──────────┬─────────────┤
│              │  DeepL   │Google NMT│ Meta NLLB│  GPT-4      │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Quality (EN↔EU)│ Best   │ Good    │ Good     │ Excellent   │
│ Quality (ZH/HI)│ Good  │ Best    │ Good     │ Excellent   │
│ Latency      │ ~150ms  │ ~200ms  │ ~100ms*  │ ~800ms      │
│ Streaming    │ ❌ No   │ ❌ No   │ ❌ No    │ ✅ Yes      │
│ Idiom handling│ Good   │ Average │ Average  │ Best        │
│ Pricing      │$25/1M ch│$20/1M ch│ Free*    │ ~$5/1M tok  │
│ Self-hosted  │ ❌ No   │ ❌ No   │ ✅ Yes   │ ❌ No       │
└──────────────┴──────────┴──────────┴──────────┴─────────────┘
                                      * requires GPU infrastructure
```

**Decision**: Hybrid approach.
- **DeepL API** as primary for EN↔ES, EN↔FR (highest quality for European languages)
- **Google Cloud Translation V3** for EN↔ZH, EN↔HI (better CJK and Indic support)
- **Translation Router** service that picks the best engine per language pair
- Sentences are short (voice utterances), so per-request latency is ~150-200ms

**Why not GPT-4?**: Latency (~800ms) is too high for a pipeline already budgeting 1.5s total. Quality is excellent but we can't afford the latency. May use for post-call transcript polishing (async).

**Migration Path**: Self-host Meta NLLB-200 or SeamlessM4T on GPU for cost reduction and latency at scale. Keep the translation router abstraction.

#### Decision 3: Voice Cloning / TTS — ElevenLabs (MVP) → XTTS (Scale)

```
┌──────────────────────────────────────────────────────────────────┐
│                   VOICE CLONING COMPARISON                        │
├──────────────┬───────────┬──────────┬──────────┬────────────────┤
│              │ElevenLabs │  XTTS v2 │  PlayHT  │ Azure CNV      │
├──────────────┼───────────┼──────────┼──────────┼────────────────┤
│ Clone from   │ ✅ 30s   │ ✅ 6s   │ ✅ 30s  │ ⚠️ 30min+      │
│ Cross-lingual│ ✅ Yes   │ ✅ Yes  │ ✅ Yes  │ ✅ Yes          │
│ Streaming    │ ✅ Yes   │ ⚠️ Chunk│ ✅ Yes  │ ✅ Yes          │
│ First-byte   │ ~300ms   │ ~400ms* │ ~350ms  │ ~500ms          │
│ Quality      │ Best     │ Good    │ Good    │ Good            │
│ Languages    │ 32+      │ 17      │ 20+     │ 100+            │
│ EN/ZH/ES/FR/HI│ ✅ All │ ✅ All  │ ✅ All  │ ✅ All          │
│ Self-hosted  │ ❌ No    │ ✅ Yes  │ ❌ No   │ ❌ No           │
│ Pricing      │$0.30/1K ch│ GPU cost│$0.25/1K │ $0.24/1K ch    │
└──────────────┴───────────┴──────────┴──────────┴────────────────┘
                                       * self-hosted GPU dependent
```

**Decision**: ElevenLabs Turbo v2.5 API for MVP.
- Best voice cloning quality with minimal sample (30s)
- Excellent cross-lingual synthesis (clone English voice, output Mandarin)
- Streaming output with ~300ms time-to-first-byte
- All 5 target languages supported
- Handles emotion/prosody transfer well

**Migration Path**: Migrate to self-hosted XTTS v2 or Fish Speech on GPU for cost reduction at scale. ElevenLabs at $0.30/1K characters becomes expensive at volume. Self-hosted XTTS on an A10G GPU can do ~50 concurrent streams at ~$1.50/hr.

#### Decision 4: Media Server — LiveKit (Self-Hosted)

```
┌──────────────────────────────────────────────────────────────┐
│                  MEDIA SERVER COMPARISON                      │
├──────────────┬──────────┬──────────┬──────────┬─────────────┤
│              │ LiveKit  │  Janus   │Mediasoup │   Agora     │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Server-side  │ ✅ Agents│ ⚠️ Plugin│ ⚠️ Manual│ ✅ Extension│
│ audio proc.  │ Framework│          │          │             │
│ Open-source  │ ✅ Yes   │ ✅ Yes  │ ✅ Yes  │ ❌ No       │
│ Scalability  │ Excellent│ Good    │ Good    │ Excellent   │
│ SDK quality  │ Excellent│ Average │ Good    │ Excellent   │
│ AI pipeline  │ ✅ Native│ ❌ No   │ ❌ No   │ ⚠️ Limited  │
│ Self-hosted  │ ✅ Yes   │ ✅ Yes  │ ✅ Yes  │ ❌ No       │
│ Pricing      │ Free OSS │ Free OSS│ Free OSS│ $0.99/1K min│
└──────────────┴──────────┴──────────┴──────────┴─────────────┘
```

**Decision**: LiveKit (self-hosted).
- **LiveKit Agents Framework** is purpose-built for our use case: server-side AI processing of audio streams
- Receive audio track → process through STT/translate/TTS → publish translated track back to room
- Built-in room management, participant tracking, track subscription
- Excellent SDKs for JavaScript, React, React Native, Python
- Scales horizontally; can run multiple SFU instances behind a load balancer
- Open-source, no per-minute fees

**Architecture Pattern**: Each call room has a **LiveKit Agent** (Python process) that:
1. Subscribes to each participant's audio track
2. Pipes audio to Deepgram STT (streaming)
3. Sends transcribed text to Translation Router
4. Sends translated text to ElevenLabs TTS (with participant's voice profile)
5. Publishes translated audio as a new track for the target participant

#### Decision 5: Frontend — Next.js + React Native

| Platform | Framework | Rationale |
|----------|-----------|-----------|
| **Web** | Next.js 15 (App Router) | SSR for landing/SEO, React Server Components for performance, great DX |
| **Mobile** | React Native + Expo | Share business logic with web, mature audio/WebRTC libraries, Expo for fast iteration |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design system, accessible components |
| **State** | Zustand (client) + TanStack Query (server) | Lightweight, no boilerplate, excellent cache management |
| **WebRTC** | LiveKit Client SDK | Native integration with our media server |

#### Decision 6: Backend — Fastify (API) + Python FastAPI (ML Pipeline)

```
┌──────────────────────────────────────────────────────────┐
│                    BACKEND SPLIT                          │
│                                                          │
│  ┌─────────────────────┐   ┌──────────────────────────┐ │
│  │   Node.js (Fastify)  │   │   Python (FastAPI)        │ │
│  │                     │   │                          │ │
│  │  • REST API         │   │  • Translation Pipeline  │ │
│  │  • WebSocket (chat) │   │  • Voice Profile Proc.   │ │
│  │  • Auth middleware   │   │  • LiveKit Agent         │ │
│  │  • Rate limiting    │   │  • STT/TTS orchestration │ │
│  │  • Subscription mgmt│   │  • ML model serving      │ │
│  │                     │   │                          │ │
│  │  Why: Fast I/O,     │   │  Why: ML ecosystem,      │ │
│  │  WebSocket native,  │   │  numpy/torch, LiveKit    │ │
│  │  JS/TS shared with  │   │  Agents SDK is Python    │ │
│  │  frontend           │   │                          │ │
│  └─────────────────────┘   └──────────────────────────┘ │
│              │                         │                  │
│              └─────────┬───────────────┘                  │
│                        ▼                                  │
│              ┌─────────────────┐                          │
│              │  Redis (PubSub) │                          │
│              │  Event Bridge   │                          │
│              └─────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

**Why two languages?**
- **Fastify (Node.js/TypeScript)**: Handles all HTTP API, WebSocket connections (chat), auth, subscriptions. TypeScript shared with frontend. Fastify is 2-3x faster than Express for JSON serialization.
- **FastAPI (Python)**: Handles the ML/AI pipeline. The LiveKit Agents SDK is Python-native. All ML libraries (torch, numpy, audio processing) are Python. FastAPI provides async support for high-throughput inference orchestration.
- **Communication**: Redis Pub/Sub for cross-service events. Shared PostgreSQL for persistent data.

#### Decision 7: Infrastructure — AWS + Cloudflare

| Component | Service | Why |
|-----------|---------|-----|
| **Compute (API)** | AWS ECS Fargate | Serverless containers, auto-scaling, no server management |
| **Compute (GPU)** | AWS EC2 g5 (A10G) | For self-hosted models later; spot instances for cost |
| **LiveKit** | AWS EC2 (c6i instances) | CPU-optimized for media processing; self-managed for control |
| **Database** | Supabase (managed Postgres) | Free tier to start; auth + realtime + storage bundled |
| **Cache** | Upstash Redis | Serverless; pay-per-request; global replication |
| **CDN / Edge** | Cloudflare | Global edge, R2 storage (zero egress), Workers for edge logic |
| **DNS** | Cloudflare | Fast propagation, DDoS protection included |
| **Secrets** | AWS Secrets Manager | Rotation, IAM integration, audit trail |
| **CI/CD** | GitHub Actions | Native, free for public repos, good parallelism |

---

## 3. System Components Deep Dive

### 3.1 Component Map

```
echoglot/
├── apps/
│   ├── web/                    # Next.js 15 web application
│   ├── mobile/                 # React Native + Expo mobile app
│   └── landing/                # Marketing site (could be in web/)
│
├── services/
│   ├── api-gateway/            # Fastify API gateway + routing
│   ├── auth-service/           # Supabase Auth wrapper + session management
│   ├── user-service/           # User profiles, contacts, preferences
│   ├── chat-service/           # WebSocket chat + message translation
│   ├── call-service/           # Call session management + LiveKit room orchestration
│   ├── voice-profile-service/  # Voice sample processing + clone profile management
│   ├── translation-service/    # Translation router (DeepL / Google)
│   ├── subscription-service/   # Billing, tiers, usage tracking (Stripe)
│   └── notification-service/   # Push notifications, email
│
├── agents/
│   └── translation-agent/      # LiveKit Agent (Python) — the real-time translation pipeline
│
├── packages/
│   ├── shared-types/           # TypeScript types shared across services
│   ├── ui/                     # Shared React component library (shadcn/ui based)
│   ├── config/                 # Shared configuration (ESLint, TSConfig, etc.)
│   └── utils/                  # Shared utility functions
│
├── infrastructure/
│   ├── terraform/              # IaC for AWS + Cloudflare
│   ├── docker/                 # Dockerfiles for each service
│   └── k8s/                    # Kubernetes manifests (future)
│
└── docs/
    ├── architecture/           # This document + ADRs
    ├── api/                    # OpenAPI specs
    └── runbooks/               # Operational runbooks
```

### 3.2 Service Responsibilities

#### API Gateway (`api-gateway/`)
- Route incoming HTTP requests to appropriate services
- Rate limiting (per user, per tier)
- Request validation & sanitization
- API versioning (`/v1/`)
- CORS, security headers
- Request/response logging

#### Auth Service (`auth-service/`)
- Wraps Supabase Auth
- Email + password registration
- Google OAuth, Apple Sign-In
- JWT token issuance + refresh
- Session management
- Role-based access (free/pro/enterprise)

#### User Service (`user-service/`)
- CRUD for user profiles
- Contact management (add, remove, block)
- Language preference management
- Voice profile status tracking
- Account deletion (GDPR)

#### Chat Service (`chat-service/`)
- WebSocket connection management
- Message send/receive
- Calls Translation Service for each message
- Stores original + translated messages
- Offline message queue
- Typing indicators, read receipts
- Message search (in user's language)

#### Call Service (`call-service/`)
- Creates LiveKit rooms for calls
- Manages call sessions (initiate, accept, reject, end)
- Generates LiveKit access tokens
- Tracks call duration + usage (for billing)
- Post-call cleanup
- Coordinates with Translation Agent

#### Voice Profile Service (`voice-profile-service/`)
- Receives voice recording upload
- Validates audio quality (SNR, duration, sample rate)
- Creates voice clone via ElevenLabs API
- Stores voice profile reference (encrypted)
- Manages re-record and deletion flows
- Caches voice profile IDs for quick lookup during calls

#### Translation Service (`translation-service/`)
- **Translation Router**: Routes to DeepL or Google based on language pair
- Caches frequent translations (Redis)
- Handles text translation for chat
- Returns confidence scores
- Fallback chain: Primary → Secondary → Raw text with warning

#### Translation Agent (`agents/translation-agent/`)
- **This is the heart of the system** — detailed in Section 4
- LiveKit Agent (Python) that joins each call room
- Real-time audio processing pipeline
- STT → Translate → TTS orchestration

#### Subscription Service (`subscription-service/`)
- Stripe integration for billing
- Tier management (Free/Pro/Enterprise)
- Usage metering (minutes, messages)
- Webhook handling for payment events
- Enforce tier limits

---

## 4. The Translation Pipeline — The Core Engine

This is the most critical and complex component. It runs as a **LiveKit Agent** — a Python process that participates in the WebRTC room as a server-side bot.

### 4.1 Pipeline Architecture

```
                    THE TRANSLATION PIPELINE (per speaker, per listener)

  Speaker A                                                              Listener B
  (French)                                                               (English)
     │                                                                       ▲
     │  Audio Stream (Opus/WebRTC)                                          │ Translated Audio
     ▼                                                                       │  (English, A's voice)
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│ LiveKit  │────▶│   STAGE 1    │────▶│   STAGE 2    │────▶│   STAGE 3    │──┘
│  Room    │     │              │     │              │     │              │
│ (Audio   │     │  Deepgram    │     │  Translation │     │  ElevenLabs  │
│  Track)  │     │  STT         │     │  Router      │     │  TTS         │
│          │     │              │     │              │     │  (Voice      │
│          │     │  Streaming   │     │  DeepL /     │     │   Clone of   │
│          │     │  Transcribe  │     │  Google NMT  │     │   Speaker A) │
│          │     │              │     │              │     │              │
│          │     │  IN: PCM     │     │  IN: "Bonjour│     │  IN: "Hello  │
│          │     │  audio       │     │   comment"   │     │   how are    │
│          │     │  OUT: text   │     │  OUT: "Hello │     │   you"       │
│          │     │  + language  │     │   how are    │     │  OUT: PCM    │
│          │     │  detection   │     │   you"       │     │  audio       │
│          │     │              │     │              │     │  (sounds     │
│          │     │  ~300ms      │     │  ~200ms      │     │  like A)     │
│          │     │              │     │              │     │  ~500ms      │
└─────────┘     └──────────────┘     └──────────────┘     └──────────────┘

                 ◄──────────── Total: ~1000-1200ms ────────────────────►
                          + ~200ms WebRTC transport overhead
                          = ~1200-1400ms end-to-end ✅ (under 1.5s target)
```

### 4.2 Pipeline Stages Detail

#### Stage 1: Speech-to-Text (Deepgram)

```python
# Pseudocode for STT stage
class STTStage:
    """
    Receives raw audio frames from LiveKit, streams to Deepgram,
    emits transcribed text segments.
    """

    def __init__(self, source_language: str):
        self.deepgram = DeepgramClient(api_key=DEEPGRAM_KEY)
        self.connection = self.deepgram.listen.websocket.v("1")
        self.connection.configure({
            "model": "nova-3",
            "language": source_language,    # e.g., "fr"
            "smart_format": True,
            "interim_results": True,        # Get partial results fast
            "endpointing": 300,             # 300ms silence = end of utterance
            "utterance_end_ms": 1000,       # Max wait for utterance end
            "vad_events": True,             # Voice activity detection
            "encoding": "linear16",
            "sample_rate": 48000,
        })

    async def process_audio_frame(self, frame: AudioFrame):
        """Send audio frame to Deepgram for streaming transcription."""
        self.connection.send(frame.data)

    async def on_transcript(self, result):
        """Called when Deepgram returns a transcript."""
        if result.is_final:
            # Final transcript for this utterance — send to translation
            yield TranscriptSegment(
                text=result.transcript,
                language=result.detected_language,
                is_final=True,
                confidence=result.confidence,
            )
        else:
            # Interim result — can show as live subtitle
            yield TranscriptSegment(
                text=result.transcript,
                is_final=False,
            )
```

**Key Design Choices:**
- **Endpointing at 300ms**: Detects when the speaker pauses (end of phrase). Triggers translation immediately rather than waiting for a long silence.
- **Interim results**: Used for live subtitles (low-confidence, fast). Final results used for translation (high-confidence).
- **VAD (Voice Activity Detection)**: Skips silence, reducing unnecessary processing.

#### Stage 2: Translation Router

```python
class TranslationRouter:
    """
    Routes translation requests to the best engine for each language pair.
    Includes caching and fallback.
    """

    # Routing table: (source, target) → engine
    ROUTING = {
        ("en", "es"): "deepl",  ("es", "en"): "deepl",
        ("en", "fr"): "deepl",  ("fr", "en"): "deepl",
        ("en", "zh"): "google", ("zh", "en"): "google",
        ("en", "hi"): "google", ("hi", "en"): "google",
        ("es", "fr"): "deepl",  ("fr", "es"): "deepl",
        ("es", "zh"): "google", ("zh", "es"): "google",
        ("es", "hi"): "google", ("hi", "es"): "google",
        ("fr", "zh"): "google", ("zh", "fr"): "google",
        ("fr", "hi"): "google", ("hi", "fr"): "google",
        ("zh", "hi"): "google", ("hi", "zh"): "google",
    }

    async def translate(self, text: str, source: str, target: str) -> TranslationResult:
        # 1. Check cache
        cache_key = f"tr:{source}:{target}:{hash(text)}"
        cached = await redis.get(cache_key)
        if cached:
            return TranslationResult.from_cache(cached)

        # 2. Route to best engine
        engine = self.ROUTING.get((source, target), "google")

        # 3. Translate with fallback
        try:
            result = await self.engines[engine].translate(text, source, target)
        except Exception:
            # Fallback to other engine
            fallback = "google" if engine == "deepl" else "deepl"
            result = await self.engines[fallback].translate(text, source, target)

        # 4. Cache result (1 hour TTL)
        await redis.setex(cache_key, 3600, result.to_json())

        return result
```

#### Stage 3: Voice Clone TTS (ElevenLabs)

```python
class VoiceCloneTTS:
    """
    Generates speech in the target language using the speaker's cloned voice.
    Streams audio chunks back for low latency.
    """

    async def synthesize_stream(
        self,
        text: str,
        voice_id: str,          # Speaker's ElevenLabs voice clone ID
        target_language: str,
    ) -> AsyncIterator[AudioChunk]:
        """
        Stream synthesized audio chunks.
        First chunk arrives in ~300ms, enabling progressive playback.
        """
        response = await elevenlabs.text_to_speech.convert_as_stream(
            text=text,
            voice_id=voice_id,
            model_id="eleven_turbo_v2_5",
            language_code=target_language,
            output_format="pcm_24000",      # Raw PCM for LiveKit
            optimize_streaming_latency=4,    # Max optimization
        )

        async for chunk in response:
            yield AudioChunk(
                data=chunk,
                sample_rate=24000,
                channels=1,
            )
```

### 4.3 The LiveKit Agent — Orchestrator

```python
class TranslationAgent(Agent):
    """
    LiveKit Agent that joins a call room and handles real-time translation
    for all participants.
    """

    async def on_room_joined(self, room: Room):
        """Called when the agent joins a call room."""
        self.participants = {}

        # Subscribe to all participant audio tracks
        for participant in room.remote_participants.values():
            await self.setup_participant_pipeline(participant)

    async def on_participant_connected(self, participant: RemoteParticipant):
        """New participant joined — set up their translation pipeline."""
        await self.setup_participant_pipeline(participant)

    async def setup_participant_pipeline(self, participant: RemoteParticipant):
        """Create a dedicated translation pipeline for each participant."""
        # Get participant's language and voice profile from metadata
        metadata = json.loads(participant.metadata)
        source_lang = metadata["language"]       # e.g., "fr"
        voice_id = metadata["voice_profile_id"]  # ElevenLabs voice ID

        pipeline = TranslationPipeline(
            stt=STTStage(source_language=source_lang),
            translator=TranslationRouter(),
            tts=VoiceCloneTTS(),
            source_language=source_lang,
            voice_id=voice_id,
        )

        self.participants[participant.identity] = pipeline

    async def on_audio_frame(self, frame: AudioFrame, participant: RemoteParticipant):
        """Process each audio frame through the translation pipeline."""
        pipeline = self.participants[participant.identity]

        # Feed audio to STT
        async for transcript in pipeline.stt.process_audio_frame(frame):
            if not transcript.is_final:
                # Emit interim subtitle via data channel
                await self.emit_subtitle(participant, transcript.text)
                continue

            # Final transcript — translate and synthesize for each listener
            for listener in self.room.remote_participants.values():
                if listener.identity == participant.identity:
                    continue  # Don't translate for self

                listener_lang = json.loads(listener.metadata)["language"]

                if listener_lang == pipeline.source_language:
                    continue  # Same language, no translation needed

                # Translate
                translation = await pipeline.translator.translate(
                    text=transcript.text,
                    source=pipeline.source_language,
                    target=listener_lang,
                )

                # Synthesize in speaker's voice
                audio_stream = pipeline.tts.synthesize_stream(
                    text=translation.text,
                    voice_id=pipeline.voice_id,
                    target_language=listener_lang,
                )

                # Publish translated audio to listener's personal track
                await self.publish_audio_to_participant(
                    audio_stream,
                    listener,
                    source_participant=participant,
                )
```

### 4.4 Latency Budget Breakdown

```
┌──────────────────────────────────────────────────────────────┐
│              LATENCY BUDGET (1500ms target)                   │
├──────────────────────────────────────┬───────────────────────┤
│ Component                            │ Budget    │ Actual*   │
├──────────────────────────────────────┼───────────┼───────────┤
│ WebRTC capture + upload              │   50ms    │  30-50ms  │
│ Deepgram STT (streaming, final)      │  350ms    │ 250-350ms │
│ Translation (DeepL/Google)           │  250ms    │ 150-250ms │
│ ElevenLabs TTS (first byte)         │  400ms    │ 300-400ms │
│ TTS audio buffering (first chunk)    │  100ms    │  50-100ms │
│ WebRTC delivery to listener          │   50ms    │  30-50ms  │
├──────────────────────────────────────┼───────────┼───────────┤
│ TOTAL                                │ 1200ms    │ 810-1200ms│
│ Buffer                               │  300ms    │           │
│ TARGET                               │ 1500ms    │     ✅    │
└──────────────────────────────────────┴───────────┴───────────┘
  * Actual depends on network, sentence length, server load
```

### 4.5 Pipeline Optimizations

| Optimization | Description | Impact |
|-------------|-------------|--------|
| **Streaming STT** | Process audio as it arrives, don't wait for silence | -200ms |
| **Streaming TTS** | Start playing first audio chunk before full synthesis completes | -300ms |
| **Translation caching** | Cache repeated phrases (greetings, common expressions) | -200ms for cache hits |
| **Sentence splitting** | Translate short phrases as they complete rather than waiting for full sentences | -100ms perceived |
| **Connection pooling** | Keep persistent connections to Deepgram, DeepL, ElevenLabs | -50ms per request |
| **Edge deployment** | Run pipeline close to users (AWS regions) | -50-100ms network |
| **Pre-warm TTS** | Keep ElevenLabs connection warm with periodic keepalive | -100ms cold start |

---

## 5. Real-Time Communication Layer

### 5.1 Call Flow Sequence

```
  Client A                API Server         LiveKit          Translation Agent       Client B
     │                        │                 │                     │                    │
     │ POST /calls/initiate   │                 │                     │                    │
     │───────────────────────▶│                 │                     │                    │
     │                        │ Create Room     │                     │                    │
     │                        │────────────────▶│                     │                    │
     │                        │ Room Created    │                     │                    │
     │                        │◀────────────────│                     │                    │
     │                        │                 │  Dispatch Agent     │                    │
     │                        │                 │────────────────────▶│                    │
     │                        │                 │  Agent Joined       │                    │
     │                        │                 │◀────────────────────│                    │
     │   Token A + Room ID    │                 │                     │                    │
     │◀───────────────────────│                 │                     │                    │
     │                        │ Push notification to B                │                    │
     │                        │──────────────────────────────────────────────────────────▶│
     │                        │                 │                     │                    │
     │                        │                 │                     │    POST /calls/accept
     │                        │                 │                     │◀───────────────────│
     │                        │                 │                     │    Token B          │
     │                        │                 │                     │───────────────────▶│
     │                        │                 │                     │                    │
     │  Connect to LiveKit    │                 │                     │  Connect to LiveKit│
     │──────────────────────────────────────────▶                     │◀──────────────────│
     │                        │                 │                     │                    │
     │  Audio Track Published │                 │                     │                    │
     │──────────────────────────────────────────▶  Agent subscribes   │                    │
     │                        │                 │────────────────────▶│                    │
     │                        │                 │                     │                    │
     │  ┌─────── REAL-TIME TRANSLATION LOOP ─────────────────────────────────────┐        │
     │  │ A speaks French     │                 │   Agent processes   │           │        │
     │  │─────────────────────────────────────────────────────────── ▶│           │        │
     │  │                     │                 │   STT→Translate→TTS │           │        │
     │  │                     │                 │   Publishes English │audio to B │        │
     │  │                     │                 │   ─────────────────────────────▶│        │
     │  │                     │                 │                     │           │        │
     │  │ B speaks English    │                 │   Agent processes   │           │        │
     │  │◀──────────────────────────────────────────────────────────  │           │        │
     │  │                     │                 │   Publishes French  │audio to A │        │
     │  └─────────────────────────────────────────────────────────────────────────┘        │
     │                        │                 │                     │                    │
```

### 5.2 Chat Architecture

```
┌──────────┐     WebSocket      ┌──────────────┐     Redis PubSub    ┌──────────┐
│ Client A │◄──────────────────▶│ Chat Service  │◄──────────────────▶│ Client B │
│          │                    │              │                    │          │
└──────────┘                    │  1. Receive  │                    └──────────┘
                                │  2. Store    │
                                │  3. Translate│──▶ Translation Service
                                │  4. Publish  │
                                └──────────────┘
                                       │
                                       ▼
                                  PostgreSQL
                                (messages table)
```

**Chat Message Flow:**
1. Client A sends message via WebSocket (in French)
2. Chat Service stores original message in PostgreSQL
3. Chat Service calls Translation Service to translate to Client B's language (English)
4. Stores translation alongside original
5. Publishes translated message to Client B via Redis PubSub → WebSocket
6. Client B receives message in English
7. Client B can tap to see original French text

---

## 6. Data Architecture

### 6.1 Database Schema (PostgreSQL)

```sql
-- Users & Authentication
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    avatar_url      TEXT,
    preferred_lang  TEXT NOT NULL DEFAULT 'en',  -- ISO 639-1
    voice_profile_id TEXT,                        -- ElevenLabs voice ID (encrypted)
    voice_profile_status TEXT DEFAULT 'not_setup', -- not_setup | processing | active
    subscription_tier TEXT DEFAULT 'free',        -- free | pro | enterprise
    stripe_customer_id TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts / Relationships
CREATE TABLE contacts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_id  UUID REFERENCES users(id) ON DELETE CASCADE,
    nickname    TEXT,
    status      TEXT DEFAULT 'active',  -- active | blocked
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);

-- Call Sessions
CREATE TABLE calls (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         TEXT UNIQUE NOT NULL,         -- LiveKit room name
    initiator_id    UUID REFERENCES users(id),
    status          TEXT DEFAULT 'ringing',       -- ringing | active | ended | missed
    started_at      TIMESTAMPTZ,
    ended_at        TIMESTAMPTZ,
    duration_seconds INTEGER,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Call Participants
CREATE TABLE call_participants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id     UUID REFERENCES calls(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id),
    language    TEXT NOT NULL,                    -- Language used in this call
    joined_at   TIMESTAMPTZ,
    left_at     TIMESTAMPTZ
);

-- Chat Conversations
CREATE TABLE conversations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        TEXT DEFAULT 'direct',           -- direct | group
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation Members
CREATE TABLE conversation_members (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    language        TEXT NOT NULL,
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Chat Messages
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       UUID REFERENCES users(id),
    original_text   TEXT NOT NULL,
    original_lang   TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Message Translations (one per target language)
CREATE TABLE message_translations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id  UUID REFERENCES messages(id) ON DELETE CASCADE,
    target_lang TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    engine_used TEXT,                             -- deepl | google
    confidence  FLOAT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, target_lang)
);

-- Usage Tracking (for billing)
CREATE TABLE usage_records (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id),
    type        TEXT NOT NULL,                    -- voice_minutes | chat_messages
    quantity    INTEGER NOT NULL,
    period      DATE NOT NULL,                    -- Billing period (month)
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_translations_message ON message_translations(message_id);
CREATE INDEX idx_contacts_user ON contacts(user_id);
CREATE INDEX idx_calls_initiator ON calls(initiator_id, created_at DESC);
CREATE INDEX idx_usage_user_period ON usage_records(user_id, period);
```

### 6.2 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOWS                               │
│                                                                  │
│  Voice Profiles:                                                 │
│  User → Upload audio → Voice Profile Service → ElevenLabs API   │
│       → Store voice_id (encrypted) in PostgreSQL                 │
│       → Store raw audio temporarily in R2 (deleted after clone)  │
│                                                                  │
│  Chat Messages:                                                  │
│  User → WebSocket → Chat Service → PostgreSQL (original)         │
│       → Translation Service → PostgreSQL (translations)          │
│       → Redis PubSub → WebSocket → Recipient                    │
│                                                                  │
│  Voice Calls:                                                    │
│  User → WebRTC → LiveKit → Translation Agent                    │
│       → Deepgram (audio → text) [not stored]                    │
│       → DeepL/Google (text → text) [not stored]                 │
│       → ElevenLabs (text → audio) [not stored]                  │
│       → WebRTC → Recipient                                      │
│       → Call metadata only stored in PostgreSQL                  │
│                                                                  │
│  ⚠️  PRIVACY: Real-time voice audio is NEVER stored.            │
│      Only call metadata (duration, participants, languages).     │
│      Transcripts only stored if user explicitly opts in.         │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Caching Strategy

| Data | Cache | TTL | Reason |
|------|-------|-----|--------|
| User profiles | Redis | 15 min | Frequent reads during calls |
| Voice profile IDs | Redis | 1 hour | Needed for every TTS call |
| Translation cache | Redis | 1 hour | Common phrases repeated in conversations |
| LiveKit tokens | None | N/A | Generated per-request, short-lived |
| Chat history | PostgreSQL only | N/A | Too variable to cache effectively |
| Subscription tier | Redis | 5 min | Checked on every API call for rate limiting |

---

## 7. API Design

### 7.1 API Overview

Base URL: `https://api.echoglot.com/v1`

Authentication: Bearer token (JWT from Supabase Auth)

### 7.2 Core Endpoints

#### Authentication

```
POST   /auth/register          # Create account (email + password)
POST   /auth/login             # Login, returns JWT
POST   /auth/logout            # Invalidate session
POST   /auth/refresh           # Refresh JWT token
POST   /auth/oauth/google      # Google OAuth flow
POST   /auth/oauth/apple       # Apple Sign-In flow
DELETE /auth/account            # Delete account (GDPR)
```

#### Users

```
GET    /users/me                # Get current user profile
PATCH  /users/me                # Update profile (name, avatar, language)
GET    /users/me/preferences    # Get preferences
PATCH  /users/me/preferences    # Update preferences
GET    /users/:id               # Get public profile of another user
```

#### Voice Profiles

```
POST   /voice-profiles/upload   # Upload voice recording (multipart)
GET    /voice-profiles/status   # Check voice clone processing status
POST   /voice-profiles/rerecord # Re-record voice profile
DELETE /voice-profiles           # Delete voice profile permanently
```

#### Contacts

```
GET    /contacts                # List contacts
POST   /contacts                # Add contact (by email or invite code)
DELETE /contacts/:id            # Remove contact
POST   /contacts/:id/block     # Block contact
POST   /invite/generate        # Generate invite link
POST   /invite/accept/:code    # Accept invite
```

#### Calls

```
POST   /calls/initiate         # Start a call (creates LiveKit room)
POST   /calls/:id/accept       # Accept incoming call
POST   /calls/:id/reject       # Reject incoming call
POST   /calls/:id/end          # End active call
GET    /calls/history           # Call history
GET    /calls/:id              # Call details
GET    /calls/:id/token        # Get LiveKit access token
```

#### Chat / Messages

```
# REST endpoints
GET    /conversations                    # List conversations
POST   /conversations                    # Create conversation
GET    /conversations/:id/messages       # Get messages (paginated)
GET    /conversations/:id/messages/:mid/original  # Get original text

# WebSocket (persistent connection)
WS     /ws/chat
  → Event: message.send     { conversationId, text }
  → Event: message.received { conversationId, messageId, translatedText, senderName }
  → Event: typing.start     { conversationId, userId }
  → Event: typing.stop      { conversationId, userId }
  → Event: read.receipt      { conversationId, messageId }
```

#### Subscription

```
GET    /subscription              # Current subscription details
POST   /subscription/checkout     # Create Stripe checkout session
POST   /subscription/portal       # Stripe customer portal URL
GET    /subscription/usage        # Current period usage
POST   /webhooks/stripe           # Stripe webhook handler
```

### 7.3 Key Request/Response Examples

#### Initiate a Call

```json
// POST /v1/calls/initiate
// Request:
{
  "contactId": "uuid-of-contact",
  "callType": "voice"
}

// Response (200):
{
  "callId": "call-uuid",
  "roomId": "echoglot-room-abc123",
  "livekitToken": "eyJ...",
  "livekitUrl": "wss://livekit.echoglot.com",
  "participants": {
    "caller": {
      "userId": "caller-uuid",
      "language": "fr",
      "voiceProfileStatus": "active"
    },
    "callee": {
      "userId": "callee-uuid",
      "language": "en",
      "voiceProfileStatus": "active"
    }
  }
}
```

#### Send a Chat Message

```json
// WebSocket event: message.send
{
  "type": "message.send",
  "conversationId": "conv-uuid",
  "text": "Bonjour, comment allez-vous?"
}

// WebSocket event received by other participant: message.received
{
  "type": "message.received",
  "conversationId": "conv-uuid",
  "messageId": "msg-uuid",
  "senderId": "sender-uuid",
  "senderName": "Jean-Pierre",
  "translatedText": "Hello, how are you?",
  "originalLang": "fr",
  "translatedLang": "en",
  "timestamp": "2026-02-11T14:30:00Z"
}
```

#### Upload Voice Profile

```json
// POST /v1/voice-profiles/upload
// Content-Type: multipart/form-data
// Body: audio file (WAV/WebM, 30-60 seconds)

// Response (202 Accepted):
{
  "status": "processing",
  "estimatedReadyIn": 60,
  "message": "Your voice profile is being created. This usually takes about a minute."
}

// Polling: GET /v1/voice-profiles/status
// Response (200):
{
  "status": "active",      // not_setup | processing | active | failed
  "createdAt": "2026-02-11T14:25:00Z",
  "sampleDuration": 45.2,
  "qualityScore": 0.92
}
```

---

## 8. Infrastructure & Deployment

### 8.1 AWS Infrastructure Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE                                     │
│  ┌─────────┐  ┌──────────────┐  ┌─────────────┐                     │
│  │   DNS   │  │     CDN      │  │  R2 Storage  │                     │
│  │         │  │ (static +    │  │ (voice files,│                     │
│  │         │  │  API cache)  │  │  avatars)    │                     │
│  └─────────┘  └──────────────┘  └─────────────┘                     │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     AWS (us-east-1 primary)                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    VPC (10.0.0.0/16)                             │ │
│  │                                                                  │ │
│  │  Public Subnet                                                   │ │
│  │  ┌──────────────┐  ┌──────────────┐                             │ │
│  │  │     ALB      │  │   NAT GW     │                             │ │
│  │  │ (API + WS)   │  │              │                             │ │
│  │  └──────────────┘  └──────────────┘                             │ │
│  │                                                                  │ │
│  │  Private Subnet A                                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │  ECS Fargate │  │  ECS Fargate │  │  ECS Fargate │          │ │
│  │  │  API Gateway │  │ Chat Service │  │ Other Svcs   │          │ │
│  │  │  (Fastify)   │  │ (Fastify+WS) │  │              │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  │                                                                  │ │
│  │  Private Subnet B (Compute-Optimized)                           │ │
│  │  ┌──────────────┐  ┌──────────────┐                             │ │
│  │  │   EC2 c6i    │  │   EC2 c6i    │                             │ │
│  │  │  LiveKit SFU │  │  LiveKit SFU │                             │ │
│  │  │   Server     │  │   Server     │                             │ │
│  │  └──────────────┘  └──────────────┘                             │ │
│  │                                                                  │ │
│  │  Private Subnet C (AI / GPU — future)                           │ │
│  │  ┌──────────────┐  ┌──────────────┐                             │ │
│  │  │  EC2 g5      │  │  EC2 g5      │                             │ │
│  │  │  Translation │  │  TTS/Voice   │                             │ │
│  │  │  Agent       │  │  Clone       │                             │ │
│  │  └──────────────┘  └──────────────┘                             │ │
│  │                                                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Managed Services                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ Supabase │  │ Upstash  │  │  ECR     │  │ Secrets Manager  │    │
│  │(Postgres)│  │ (Redis)  │  │(Container│  │  (API keys)      │    │
│  │          │  │          │  │ Registry)│  │                  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

### 8.2 MVP Deployment (Simplified)

For MVP, we simplify significantly:

```
MVP Deployment:
├── Supabase (managed)          → Auth + PostgreSQL + Realtime + Storage
├── Vercel                      → Next.js web app
├── Cloudflare R2               → Voice profile audio storage
├── Upstash Redis               → Cache + PubSub
├── Railway / Render            → Fastify API (containerized)
├── Fly.io                      → LiveKit Server + Translation Agent
│   (GPU machines for agent)
├── Deepgram                    → STT (API)
├── DeepL + Google              → Translation (API)
├── ElevenLabs                  → TTS + Voice Cloning (API)
└── Stripe                      → Billing
```

**Why this simplification for MVP:**
- No AWS infrastructure management needed initially
- Supabase gives auth + DB + realtime for free tier
- Vercel has excellent Next.js support with free tier
- Fly.io supports GPU machines and is great for LiveKit deployment
- All AI services are API-based (no self-hosting yet)
- Total infrastructure cost: ~$50-100/month for low traffic

### 8.3 Scaling Path

```
Phase 1 (MVP, 0-1K users):
  Managed services (Supabase, Vercel, Fly.io, API-based AI)
  Cost: ~$100-500/month

Phase 2 (Growth, 1K-50K users):
  Move to AWS ECS Fargate for API services
  Self-host LiveKit on EC2 c6i
  Add Redis cluster
  Keep AI services as APIs
  Cost: ~$2K-10K/month

Phase 3 (Scale, 50K+ users):
  Self-host STT (Whisper) and TTS (XTTS) on GPU instances
  Multi-region deployment (US, EU, Asia)
  Kubernetes for orchestration
  Cost: $10K-50K/month (but unit cost drops significantly)
```

---

## 9. Security Architecture

### 9.1 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                      │
│                                                              │
│  Layer 1: Network                                            │
│  ├── Cloudflare DDoS protection                              │
│  ├── WAF (Web Application Firewall)                          │
│  ├── Rate limiting at edge                                   │
│  └── TLS 1.3 everywhere                                     │
│                                                              │
│  Layer 2: Authentication                                     │
│  ├── Supabase Auth (bcrypt password hashing)                 │
│  ├── JWT tokens (short-lived: 1 hour)                        │
│  ├── Refresh tokens (long-lived: 30 days, rotated)           │
│  ├── OAuth 2.0 (Google, Apple)                               │
│  └── LiveKit tokens (short-lived: per-call)                  │
│                                                              │
│  Layer 3: Authorization                                      │
│  ├── Row-Level Security (Supabase RLS policies)              │
│  ├── Tier-based access control                               │
│  ├── API rate limiting (per user, per tier)                   │
│  └── Resource ownership validation                           │
│                                                              │
│  Layer 4: Data Protection                                    │
│  ├── AES-256 encryption at rest (voice profiles)             │
│  ├── SRTP for real-time media (WebRTC default)               │
│  ├── TLS for all API communication                           │
│  ├── Voice data: processed in-memory, never persisted        │
│  └── PII encryption in database                              │
│                                                              │
│  Layer 5: Compliance                                         │
│  ├── GDPR: data export, deletion, consent management         │
│  ├── BIPA: voice biometric consent flow                      │
│  ├── CCPA: opt-out mechanisms                                │
│  └── SOC 2 Type II (target for Enterprise launch)            │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Voice Data Security

```
Voice Profile Lifecycle:
  1. User records voice → uploaded over TLS to API
  2. Audio temporarily stored in R2 (encrypted, 24-hour TTL)
  3. Sent to ElevenLabs API for voice cloning
  4. ElevenLabs returns voice_id
  5. voice_id stored encrypted in PostgreSQL
  6. Temporary audio in R2 is deleted
  7. Only voice_id is retained — no raw audio stored long-term

Real-Time Call Audio:
  1. Audio streamed via SRTP (WebRTC encrypted)
  2. Processed in-memory by Translation Agent
  3. Sent to Deepgram, DeepL, ElevenLabs via TLS
  4. NO audio is stored, logged, or persisted
  5. Call metadata only (duration, participants) stored in DB
```

### 9.3 API Rate Limits

| Tier       | API Calls/min | WebSocket Connections | Voice Minutes/month | Chat Messages/day |
|------------|---------------|----------------------|---------------------|--------------------|
| Free       | 60            | 2                    | 30                  | 100                |
| Pro        | 300           | 10                   | Unlimited           | Unlimited          |
| Enterprise | 1000          | 100                  | Unlimited           | Unlimited          |

---

## 10. Scalability & Performance

### 10.1 Scaling Strategy per Component

| Component | Scaling Method | Bottleneck | Solution |
|-----------|---------------|------------|----------|
| **API Gateway** | Horizontal (add containers) | Connection count | ECS auto-scaling on CPU/memory |
| **Chat Service** | Horizontal + Redis PubSub | WebSocket connections per instance | Sticky sessions + Redis for cross-instance messaging |
| **LiveKit SFU** | Horizontal (add nodes) | CPU (media processing) | LiveKit's built-in multi-node support |
| **Translation Agent** | Horizontal (one per room) | Concurrent API calls | Connection pooling; scale agents independently |
| **PostgreSQL** | Vertical + read replicas | Write throughput | Supabase handles this; migrate to RDS if needed |
| **Redis** | Cluster mode | Memory | Upstash auto-scales; move to Redis Cluster at scale |

### 10.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (P95) | < 200ms | New Relic / Grafana |
| WebSocket message delivery | < 100ms | Custom instrumentation |
| Voice translation E2E (P95) | < 1500ms | Pipeline instrumentation |
| Chat translation (P95) | < 500ms | Pipeline instrumentation |
| Concurrent calls supported | 10,000 | Load testing (k6) |
| Concurrent WebSocket connections | 100,000 | Load testing |
| Database query time (P95) | < 50ms | pg_stat_statements |

### 10.3 Load Testing Plan

```
Tool: k6 (open-source load testing)

Scenarios:
1. API load test:     1000 VUs, ramp up over 5 min, sustain 10 min
2. WebSocket test:    5000 concurrent connections, message throughput
3. Voice call test:   500 concurrent rooms, measure pipeline latency
4. Mixed workload:    Realistic mix of API, chat, and voice traffic
```

---

## 11. Monitoring & Observability

### 11.1 Observability Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY STACK                        │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │    Metrics     │  │    Logging     │  │    Tracing     │  │
│  │               │  │               │  │               │  │
│  │  Prometheus   │  │  Grafana Loki │  │  OpenTelemetry│  │
│  │  + Grafana    │  │  (structured  │  │  + Grafana    │  │
│  │               │  │   JSON logs)  │  │  Tempo        │  │
│  └───────────────┘  └───────────────┘  └────────────────┘  │
│         │                   │                   │            │
│         └───────────────────┼───────────────────┘            │
│                             ▼                                │
│                    ┌────────────────┐                        │
│                    │ Grafana Cloud  │                        │
│                    │  (Dashboards)  │                        │
│                    └────────────────┘                        │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐                       │
│  │    Errors      │  │    Uptime     │                       │
│  │               │  │               │                       │
│  │    Sentry     │  │  Better Stack │                       │
│  │  (exceptions) │  │ (status page) │                       │
│  └───────────────┘  └───────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### 11.2 Critical Dashboards

| Dashboard | Key Metrics |
|-----------|-------------|
| **Translation Pipeline** | E2E latency (P50, P95, P99), STT latency, translation latency, TTS latency, error rate per stage |
| **Call Health** | Active calls, call duration distribution, call setup time, drop rate, agent CPU/memory |
| **Chat Performance** | Message throughput, translation latency, WebSocket connections, delivery rate |
| **Business Metrics** | Active users, calls/day, messages/day, minutes translated, tier distribution |
| **Infrastructure** | CPU/memory per service, DB connections, Redis memory, API error rates |
| **Cost Tracking** | Deepgram spend, DeepL spend, ElevenLabs spend, infrastructure cost, cost per translated minute |

### 11.3 Alerting Rules

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| Pipeline latency high | P95 > 2.0s for 5 min | Critical | Page on-call |
| STT errors elevated | Error rate > 5% for 3 min | High | Page on-call |
| TTS errors elevated | Error rate > 5% for 3 min | High | Page on-call |
| API error rate | 5xx > 1% for 5 min | High | Notify Slack |
| Database connections | > 80% pool utilized | Warning | Notify Slack |
| Redis memory | > 80% capacity | Warning | Notify Slack |
| ElevenLabs quota | > 90% monthly limit | Warning | Notify Slack + email |

---

## 12. Cost Estimation

### 12.1 Per-Translated-Minute Cost Breakdown

```
For 1 minute of voice translation (one direction):

┌──────────────────────────────────────────────────────┐
│  Component              │ Cost per minute             │
├─────────────────────────┼────────────────────────────┤
│  Deepgram STT           │ $0.0043                    │
│  DeepL/Google Translate │ ~$0.002 (avg sentence len) │
│  ElevenLabs TTS         │ ~$0.015 (avg 100 chars/min)│
│  LiveKit server compute │ ~$0.002                    │
│  Infrastructure overhead│ ~$0.001                    │
├─────────────────────────┼────────────────────────────┤
│  TOTAL per minute       │ ~$0.024                    │
│  Bidirectional (x2)     │ ~$0.048                    │
└─────────────────────────┴────────────────────────────┘

At Pro pricing of $19.99/month:
  - Break-even: ~416 minutes/month per user
  - Average expected usage: ~120 minutes/month
  - Gross margin: ~71% ✅
```

### 12.2 Monthly Infrastructure Cost (MVP Scale)

| Component | Service | Estimated Cost |
|-----------|---------|---------------|
| Database | Supabase Pro | $25/month |
| Redis | Upstash Pro | $10/month |
| Web hosting | Vercel Pro | $20/month |
| API servers | Railway / Render | $50/month |
| LiveKit servers | Fly.io (2x shared-cpu-4x) | $60/month |
| Object storage | Cloudflare R2 | $5/month |
| Monitoring | Grafana Cloud Free + Sentry | $0/month |
| **TOTAL (infrastructure)** | | **~$170/month** |

Plus variable API costs (per usage):
| Service | At 1K users, ~5K min/month |
|---------|---------------------------|
| Deepgram | ~$22/month |
| DeepL/Google | ~$10/month |
| ElevenLabs | ~$75/month |
| **TOTAL (APIs)** | **~$107/month** |

**Total MVP cost at 1K users: ~$277/month**

---

## 13. MVP Build Sequence

### 13.1 Phase Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│                     MVP BUILD PHASES                             │
│                                                                  │
│  PHASE 1: Foundation                                             │
│  ├── Project setup (monorepo, CI/CD, linting)                    │
│  ├── Supabase setup (auth, database, RLS policies)               │
│  ├── Next.js app shell (routing, auth pages, basic UI)           │
│  ├── Fastify API scaffold (health check, auth middleware)        │
│  └── Basic user registration + login flow                        │
│                                                                  │
│  PHASE 2: Chat Translation                                       │
│  ├── Chat service (WebSocket + Redis PubSub)                     │
│  ├── Translation service (DeepL + Google router)                 │
│  ├── Chat UI (conversation list, message thread, translation)    │
│  ├── Contact management (add, invite, list)                      │
│  └── End-to-end chat translation working                         │
│                                                                  │
│  PHASE 3: Voice Infrastructure                                   │
│  ├── LiveKit server deployment (Fly.io)                          │
│  ├── LiveKit client integration (web)                            │
│  ├── Basic 1:1 voice call (no translation yet)                   │
│  ├── Call UI (ringing, in-call, end-call)                        │
│  └── Call session management (initiate, accept, reject, end)     │
│                                                                  │
│  PHASE 4: Voice Translation Pipeline                             │
│  ├── Translation Agent (Python, LiveKit Agents SDK)              │
│  ├── Deepgram STT integration (streaming)                        │
│  ├── Pipeline: STT → Translation → text output                   │
│  ├── ElevenLabs TTS integration (streaming)                      │
│  ├── Full pipeline: STT → Translate → TTS → audio output         │
│  └── Latency optimization + testing                              │
│                                                                  │
│  PHASE 5: Voice Cloning                                          │
│  ├── Voice recording onboarding UI                               │
│  ├── Voice profile service (upload, validate, clone)             │
│  ├── ElevenLabs voice clone API integration                      │
│  ├── Use cloned voice in translation pipeline                    │
│  └── Voice profile management (re-record, delete)                │
│                                                                  │
│  PHASE 6: Polish & Launch Prep                                   │
│  ├── Usage tracking + tier enforcement                           │
│  ├── Stripe billing integration                                  │
│  ├── Error handling + graceful degradation                        │
│  ├── Performance testing + optimization                          │
│  ├── Security audit                                              │
│  ├── Landing page                                                │
│  └── Beta testing                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Tech Stack Quick Reference

```
Frontend:       Next.js 15 + React 19 + TypeScript + Tailwind + shadcn/ui
Mobile:         React Native + Expo (Phase 2+)
Backend API:    Fastify (Node.js/TypeScript)
AI Pipeline:    FastAPI (Python) + LiveKit Agents
Database:       PostgreSQL (Supabase)
Cache:          Redis (Upstash)
Storage:        Cloudflare R2
Media Server:   LiveKit (self-hosted on Fly.io)
STT:            Deepgram Nova-3 (streaming API)
Translation:    DeepL API + Google Cloud Translation V3
TTS/Clone:      ElevenLabs Turbo v2.5 (API)
Auth:           Supabase Auth
Billing:        Stripe
Monitoring:     Grafana Cloud + Sentry
CI/CD:          GitHub Actions
Hosting:        Vercel (web) + Railway (API) + Fly.io (LiveKit)
```

---

## Appendix A: Architecture Decision Records (ADRs)

### ADR-001: Use LiveKit over Janus/Mediasoup for media server
- **Decision**: LiveKit
- **Context**: We need server-side audio interception for translation pipeline
- **Rationale**: LiveKit Agents framework is purpose-built for AI audio processing. Janus/Mediasoup require custom plugins. Agora locks us into a vendor.
- **Consequences**: Must manage LiveKit infrastructure ourselves. Good OSS community support.

### ADR-002: Hybrid translation engine (DeepL + Google)
- **Decision**: Use DeepL for European language pairs, Google for CJK/Indic
- **Context**: No single translation API is best for all language pairs
- **Rationale**: DeepL excels at EN↔ES/FR. Google has better ZH/HI support. Router pattern keeps it flexible.
- **Consequences**: Two API integrations to maintain. Router adds ~10ms overhead. Easy to swap/add engines later.

### ADR-003: ElevenLabs for MVP voice cloning, with migration path to XTTS
- **Decision**: Start with ElevenLabs API, plan migration to self-hosted XTTS
- **Context**: Voice cloning quality is the key differentiator; must be excellent from day 1
- **Rationale**: ElevenLabs has the best cross-lingual voice cloning quality. Self-hosted XTTS is cheaper at scale but slightly lower quality. Start with best quality, optimize cost later.
- **Consequences**: Higher variable cost initially (~$0.015/min). Clear migration path to self-hosted. Keep TTS interface abstracted.

### ADR-004: Monorepo with Turborepo
- **Decision**: Single monorepo for all apps and services
- **Context**: Multiple apps (web, mobile) and services (API, chat, translation) with shared types
- **Rationale**: Shared TypeScript types, atomic changes across services, single CI pipeline, easier refactoring.
- **Consequences**: Slightly more complex CI setup. Need Turborepo for efficient builds. Worth it for team velocity.

### ADR-005: Supabase as the initial backend platform
- **Decision**: Use Supabase for auth, database, and realtime subscriptions
- **Context**: Need auth + PostgreSQL + realtime capabilities with minimal setup time
- **Rationale**: Free tier covers MVP. Bundled auth (JWT, OAuth). Built-in realtime via WebSockets. Easy migration to raw PostgreSQL later since it's standard Postgres under the hood.
- **Consequences**: Some vendor coupling for auth layer. Supabase RLS policies need careful management. Standard SQL underneath means easy exit.

---

*This is a living document. It will be updated as architectural decisions are made and refined during implementation.*
