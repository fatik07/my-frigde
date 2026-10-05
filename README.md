# What's in My Fridge?

**Tell me what you have. I'll tell you what you can cook.**

## What is it?

A small web app for anyone who opens the fridge, sees a handful of
ingredients, and has no idea what to make with them. You add what you
have — a few eggs, some chicken, half a bag of rice — and the app suggests
a handful of realistic meals you can actually cook right now, telling you
exactly what you already have and what (if anything) you'd still need to
buy.

It's deliberately small. There's no chat window, no meal planner, no
nutrition tracker — just: ingredients in, meal ideas out.

## Why I built it

I built this for a friend who regularly has food in the fridge but draws
a blank on what to cook with it. This isn't a generic AI demo — it's meant
to solve that one specific, recurring problem as simply as possible.

## Open Source AI

The app uses **open/free models through [OpenRouter](https://openrouter.ai)**,
not a proprietary model from a single vendor. By default it uses
`openrouter/free`, OpenRouter's free-model router, which picks a free model
automatically — so running this app costs nothing in model fees.

To be precise about what that means:

- Inference does **not** run locally on your machine — it still happens on
  OpenRouter's infrastructure.
- What you get instead is **choice**: the app isn't locked into one
  proprietary model or vendor. Any model OpenRouter hosts can be swapped in.
- The AI provider is fully isolated behind one small module
  ([`src/server/ai/adapter.ts`](src/server/ai/adapter.ts)), so changing the
  model or even the provider later doesn't touch any other part of the app.

## Features

- Add, view, and remove pantry ingredients (name, optional quantity/unit),
  persisted in Supabase.
- Optional free-text cooking constraint ("no spicy food", "only 15
  minutes", "I only have a rice cooker", …).
- One button — **"What can I cook?"** — that sends your pantry + constraint
  to the server, which calls an AI model and returns ~3 structured meal
  suggestions.
- Each suggestion shows a name, description, estimated time, difficulty,
  which of your ingredients it uses, and what's missing.
- A detail page per suggestion (`/recipe/:id`) with full steps.
- Loading, empty-pantry, and error states, with retry on failure.
- The AI's ingredient claims are cross-checked against your actual pantry
  server-side before anything is shown, so it can't claim you have
  something you don't.

## Tech Stack

- [TanStack Start](https://tanstack.com/start)
- TypeScript
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack AI](https://tanstack.com/ai) (`@tanstack/ai` + `@tanstack/ai-openrouter`)
- [Supabase](https://supabase.com) (PostgreSQL)
- [OpenRouter](https://openrouter.ai)
- Tailwind CSS

## Local Development

**Requires Node.js >= 22.12.0** (the TanStack Start packages this app
depends on declare that minimum).

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

```env
# Public — safe in the client bundle
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Secret — server-only, never prefix with VITE_
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=

# Optional
AI_MODEL=
```

Notes on this layout:

- All database access in this app happens **server-side only**, using the
  Supabase **service role key**. There's no login/auth in this MVP, so
  there's no safe way to let the browser talk to Supabase directly with an
  anon key under Row Level Security — the service-role approach keeps the
  data safe by never exposing it to the client at all.
- `VITE_SUPABASE_ANON_KEY` is included for completeness and future use
  (e.g. if you add auth later) but isn't read by any code today.
- Get your Supabase URL and keys from your project's **Settings → API**
  page.
- Get an OpenRouter API key at [openrouter.ai/keys](https://openrouter.ai/keys).

### 3. Create the Supabase tables

Open your Supabase project's SQL editor and run the contents of
[`supabase/schema.sql`](supabase/schema.sql). It creates the `ingredients`
and `suggestions` tables with Row Level Security enabled and no public
policies (access is server-only via the service role key).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build       # production build
npm run start        # run the production build locally
npm run typecheck    # type-check with tsc
```

## AI Configuration

The AI integration is isolated in `src/server/ai/`:

- [`adapter.ts`](src/server/ai/adapter.ts) builds the OpenRouter adapter.
  The model comes from the `AI_MODEL` env var, defaulting to
  `openrouter/free`.
- [`prompt.ts`](src/server/ai/prompt.ts) builds the prompt from the
  pantry + optional constraint.
- [`generate.ts`](src/server/ai/generate.ts) calls the model for
  structured JSON output (validated with Zod), with a plain-JSON fallback
  if the model doesn't support strict structured output.
- [`reconcile.ts`](src/server/ai/reconcile.ts) cross-checks the model's
  claimed "ingredients used" against the real pantry.

**To change the model**, set `AI_MODEL` in `.env` to any OpenRouter model
id, e.g.:

```env
AI_MODEL=qwen/qwen3.8-27b:free
```

Browse available models (and which ones support structured JSON output)
at [openrouter.ai/models](https://openrouter.ai/models).

## Security

- The OpenRouter API key and the Supabase service role key are read from
  `process.env` only inside server-only modules/functions. Neither is ever
  sent to the browser.
- All AI responses are validated with Zod before being persisted or
  rendered; invalid responses are rejected rather than shown.
- Server function errors are sanitized before reaching the client — the
  real error is logged server-side, and only a generic message is ever
  returned to the browser.
