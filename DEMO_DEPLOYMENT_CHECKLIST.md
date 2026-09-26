# QUANTIFY — Pre-Demo Deployment & Environment Readiness Checklist

> **SIH 2026 · Problem Statement SIH26140**
> Generated after 7 commits landed in this session. Run through every section
> **in order** before the demo. Each checkbox is a hard gate — do not skip.

---

## 0. Prerequisites

- [ ] Supabase CLI installed and authenticated: `supabase login`
- [ ] Linked to the correct project: `supabase link --project-ref <YOUR_PROJECT_REF>`
- [ ] Node.js 22+ installed on the host running the Next.js front-end
  (Node 20 works but triggers a deprecation warning from `@supabase/supabase-js`)
- [ ] The `.env.local` file exists at the repo root with the two Next.js public
  variables set (see §3 below)

> **No CI / deploy script exists in this repo.** There is no `.github/workflows/`,
> no `deploy.sh`, and no deploy-related `npm` script in `package.json`. Every
> deployment step below must be run manually until CI is added.

---

## 1. Database Migrations

Three migration files must be applied to the Supabase project **in date order**.
Run each via the Supabase CLI or paste into the SQL Editor in the Supabase Dashboard.

```
supabase db push
```

or, if applying manually one by one:

```bash
# 1 — Discussion Forum (may already be applied if run previously)
supabase db execute --file supabase/migrations/20260926_discussions.sql

# 2 — Daily Challenges & Attempt Tracking  ← NEW this session
supabase db execute --file supabase/migrations/20260926_daily_challenges.sql

# 3 — Quantum Events Hub + 10 seed rows    ← NEW this session
supabase db execute --file supabase/migrations/20260926_quantum_events.sql
```

**What each migration creates:**

| Migration | Tables Created | RLS | Seed Data |
|---|---|---|---|
| `20260926_discussions.sql` | `discussion_categories`, `discussion_tags`, `discussions`, `discussion_replies`, `discussion_votes`, `discussion_reports` | Yes — per-user + admin policies | 12 quantum category rows |
| `20260926_daily_challenges.sql` | `daily_challenges`, `daily_challenge_attempts` | Yes — per-user | None (admin seeds via dashboard) |
| `20260926_quantum_events.sql` | `quantum_events` | Yes — read-all, write-admin-only | 10 real events (India + Global) |

**Also required — RPC functions** (in `backend/rpc_functions.sql`).
These must be applied separately since they are not in the `supabase/migrations/` folder:

```bash
supabase db execute --file backend/rpc_functions.sql
```

This file contains three functions:
1. `get_learning_path(p_user_id)` — dynamic curriculum ordering
2. `submit_quiz(p_user_id, p_topic_id, p_answers)` — server-side grading
3. `record_daily_challenge_completion(target_user_id, target_challenge_date, target_score_percent)` ← **NEW this session**

> **Verify:** After applying, open the Supabase Dashboard → Database → Functions
> and confirm all three appear. Also confirm `check_and_unlock_achievements` is
> present — `record_daily_challenge_completion` calls it at the end. If it is
> missing, apply `backend/achievements_trigger.sql` first.

---

## 2. Edge Functions

No deploy script exists. Deploy each function individually using the Supabase CLI.
All 11 functions live under `supabase/functions/<name>/index.ts`.

> **Architecture note:** Most `supabase/functions/<name>/index.ts` files are
> thin re-export shims (`export * from '../../../backend/functions/<name>/index.ts'`).
> The real logic lives in `backend/functions/`. The Supabase CLI deploys the
> `supabase/functions/` copy — do not deploy the `backend/functions/` directory
> directly.

### 2a. Functions that existed before this session (verify still deployed)

```bash
supabase functions deploy admin-cutoffs
supabase functions deploy admin-questions-crud
supabase functions deploy admin-stats
supabase functions deploy get-learning-path
supabase functions deploy get-my-circuits
supabase functions deploy save-circuit
supabase functions deploy simulate-circuit
supabase functions deploy submit-assessment
supabase functions deploy submit-quiz
```

### 2b. Functions that were CHANGED or CREATED this session (must redeploy)

| Function | Change in this session | Must redeploy? |
|---|---|---|
| `tutor-chat` | Added `mode` field routing (`analogy`, `mistake-doctor`); added `questionText`, `chosenOptionText`, `correctOptionText` body reads | **YES — redeploy** |
| `admin-events-crud` | Brand new — targets `quantum_events` table | **YES — deploy for first time** |

```bash
# Redeploy tutor-chat (edited twice this session)
supabase functions deploy tutor-chat

# Deploy admin-events-crud for the first time
supabase functions deploy admin-events-crud
```

### 2c. Deploy-all convenience command

```bash
supabase functions deploy --project-ref <YOUR_PROJECT_REF>
```

This deploys every function found under `supabase/functions/` in one pass.
Use with caution — it will overwrite currently-live functions.

---

## 3. Secrets & Environment Variables

### 3a. Next.js front-end — `.env.local` at repo root

These two variables must be present for the Next.js app to reach Supabase.
Copy `.env.example` and fill in your project values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL | **Yes** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → Project API Keys → anon/public | **Yes** |

### 3b. Edge Function secrets — set via Supabase CLI

These secrets are read via `Deno.env.get(...)` inside the functions.
They are **never** in `.env.local` — they live in the Supabase project's secret store.

```bash
supabase secrets set SUPABASE_URL="https://<your-project-ref>.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"
supabase secrets set GEMINI_API_KEY="<your-gemini-api-key>"
supabase secrets set GEMINI_MODEL="gemini-2.5-flash"
```

> `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are **automatically injected**
> into every Supabase Edge Function as built-in secrets — you only need to set
> them manually if the auto-injection is not working (e.g. local dev via
> `supabase functions serve`).

**Which functions use which secrets:**

| Secret | Functions that read it |
|---|---|
| `SUPABASE_URL` | `get-learning-path`, `submit-quiz`, `tutor-chat`, `admin-events-crud`, `admin-questions-crud` |
| `SUPABASE_SERVICE_ROLE_KEY` | Same set as above (preferred over ANON key for write access) |
| `SUPABASE_ANON_KEY` | Fallback in `tutor-chat`, `admin-events-crud`, `admin-questions-crud` if SERVICE_ROLE_KEY is absent |
| `GEMINI_API_KEY` | `tutor-chat` **only** |
| `GEMINI_MODEL` | `tutor-chat` **only** (falls back to `gemini-3.5-flash-lite` if unset) |

**Verify secrets are set:**

```bash
supabase secrets list
```

Expected output should include all four variable names above.

### 3c. GEMINI_API_KEY — what breaks without it

| Feature | Behaviour without key |
|---|---|
| "Explain Like I'm New" (Analogy Engine, `/simulator`) | Button renders; API returns error; callout shows empty/error text. No crash. |
| "Ask AI to explain my mistake" (Mistake Doctor, `/quiz`) | Button renders; API returns error; callout shows fallback text. No crash. |
| Quanta AI tutor (`/tutor`) | Every message returns an error response from the edge function. |

This is a graceful degradation, not a crash. For a live demo with judges, the
Gemini key **must** be set.

---

## 4. Vercel (Front-end Hosting)

If deploying to Vercel:

- [ ] Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Trigger a new deployment after setting variables (existing deployments don't pick up new vars automatically)
- [ ] Confirm build command is `next build` and output directory is `.next`

---

## 5. Supabase Auth Settings

- [ ] In Dashboard → Authentication → URL Configuration:
  - **Site URL:** set to your Vercel production URL (e.g. `https://quantify.vercel.app`)
  - **Redirect URLs:** add `https://quantify.vercel.app/**` and `http://localhost:3000/**`
- [ ] In Dashboard → Authentication → Providers:
  - Email provider must be **enabled**
  - "Confirm email" setting: set to **disabled** for a demo (avoids email flow friction)

---

## 6. Row Level Security Verification

After applying migrations, verify RLS is **enabled** on all new tables.
Run in the Supabase SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'daily_challenges',
    'daily_challenge_attempts',
    'quantum_events'
  );
```

Expected: `rowsecurity = true` for all three rows.

---

## 7. Demo Data & Admin Role

- [ ] Seed today's daily challenge. The `/challenges` page falls back
  deterministically (day-of-year index into `SEED_CHALLENGES`) if the
  `daily_challenges` table has no row for today — no manual step required
  for the demo unless you want to pin a specific challenge.

- [ ] To demonstrate the `/events` admin panel, the logged-in demo account
  must have `role = 'admin'` in the `profiles` table. Set it via SQL:

  ```sql
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = 'your-demo-account@example.com';
  ```

  Alternatively, use the role-switcher toggle in the app sidebar (Demo Mode
  Role button — sets role in the auth context client-side only, without
  touching the DB, which is sufficient for UI gating but not for write
  operations against the edge function's admin check).

---

## 8. Final Pre-Demo Smoke Test

Run through this in a fresh browser session (incognito) immediately before the demo:

- [ ] `/` (landing) loads without 404
- [ ] `/login` → sign in → redirects to `/dashboard`
- [ ] `/simulator` → SimulatorIntro modal appears, dismiss, place gates, run circuit
- [ ] `/simulator` → "Explain Like I'm New" button → analogy renders (requires GEMINI_API_KEY)
- [ ] `/quiz/qubits` → answer one wrong → "Ask AI to explain my mistake" appears
- [ ] `/challenges` → Today's Challenge hero renders; solve it; Leaderboard tab works
- [ ] `/events` → 10 events render; type/region filters narrow grid; Register links open new tab
- [ ] `/profile` → "Share Progress" → PNG downloads with name, level, streak
- [ ] `/achievements` → "Share My Progress" → PNG downloads
- [ ] `/admin` (as admin role) → Quantum Events tab → add entry → appears in `/events`
- [ ] Sidebar: "Quantum Hub" nav entry appears exactly once

---

## 9. Quick Reference — Deployed Assets by Commit

| Commit | What was deployed | Files changed |
|---|---|---|
| `71fdd05` | `tutor-chat` function (circuitContext sync) | `supabase/functions/tutor-chat/index.ts` |
| `5031f22` | Front-end only (SimulatorIntro, GateTooltip) | `app/simulator/page.tsx` + 2 new components |
| `8434ea8` | `tutor-chat` function (mode field) + front-end analogy UI | Both tutor-chat copies + `lib/api/tutor.ts` + simulator page |
| `5f47111` | Front-end only (ShareCard, profile/achievements pages) | 4 files, `html2canvas` dependency |
| `0b55509` | Front-end only (Mistake Doctor quiz UI) | `app/quiz/[id]/page.tsx` + `lib/api/tutor.ts` |
| `a7edef0` | Migration (`daily_challenges`) + RPC + front-end challenges page | 4 files |
| `f167746` | Migration (`quantum_events` + seed) + `admin-events-crud` function + front-end events page + AppShell nav | 8+ files |

**Functions requiring redeploy for this session: `tutor-chat` (changed), `admin-events-crud` (new)**
**Migrations requiring application: `20260926_daily_challenges.sql`, `20260926_quantum_events.sql`**
**RPC requiring application: function 3 in `backend/rpc_functions.sql`**
