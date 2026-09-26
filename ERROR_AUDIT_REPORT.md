# QUANTIFY — Error Audit Report

> **SIH 2026 · Problem Statement SIH26140**  
> Status: Audit Complete  
> Note: **DO NOT FIX** — this is an observation report only.

---

## 1. Build-Check Integrity (Step 0)

**Strict checks are INTACT.**
The `next.config.mjs` file does **not** contain `ignoreBuildErrors: true` nor `ignoreDuringBuilds: true`. The `next build` results recorded during this session successfully passed native Next.js strict TS and ESLint layers.

---

## 2. TypeScript Errors (Step 1)

> Ran `npx tsc --noEmit` across the entire codebase.

| File | Line | Error | Severity |
|---|---|---|---|
| *None* | - | Zero TypeScript errors detected in the current workspace. | - |

---

## 3. Lint Errors / Warnings (Step 2)

> Ran `npx next lint` across the codebase. (ESLint strict mode invoked)

| File | Line | Warning | Severity |
|---|---|---|---|
| *None* | - | Zero ESLint warnings or errors detected. | - |

---

## 4. `any`-Cast Inventory (Step 3)

The following type bypasses were found across the codebase. While these do not break the build, they defeat TypeScript's safety guarantees and should be tightened.

| File | Line | Code | Proposed Proper Type |
|---|---|---|---|
| `app/simulator/page.tsx` | 123, 145 | `type: selectedGateType as any` | `GateType` |
| `app/challenges/page.tsx` | 94 | `type: selectedGateType as any` | `GateType` |
| `app/admin/page.tsx` | 89 | `statsRes.data.recentUsers as any` | `UserProfile[]` |
| `app/admin/page.tsx` | 93 | `(o: any) => o.isCorrect` | `QuizOption` |
| `app/admin/page.tsx` | 300 | `setActiveTab(tab.id as any)` | `AdminTab` |
| `lib/api/tutor.ts` | 122, 185 | `gates: any[]` | `PlacedGate[]` |
| `backend/functions/tutor-chat/index.ts` | 95 | `catch(() => ({} as any))` | `Partial<TutorChatPayload>` |
| `backend/functions/tutor-chat/index.ts` | 201-205 | `const mode = (body as any).mode` | Defined `TutorChatPayload` |
| `backend/functions/admin-events-crud/index.ts` | 82 | `catch (error: any)` | `unknown` / `Error` |

---

## 5. Runtime Edge-Case Findings (Step 4)

### 4a. Mistake Doctor Null Safety (`app/quiz/[id]/page.tsx`)
**Severity: Low**
- *Finding:* `q.options[userChoice]` and `q.options[q.correctIndex]` do not have explicit bounds checks before being sent to the AI. However, the UI strictly enforces valid `userChoice` via mapped rendering, and `q.correctIndex` is guaranteed by the DB schema.
- *Finding:* The edge function response `data.text` is safely extracted with fallback logic in the API utility, mitigating null responses.

### 4b. Analogy Engine Empty State (`app/simulator/page.tsx`)
**Severity: Moderate**
- *Finding:* If a user clicks "Explain Like I'm New" with an empty circuit (`placedGates.length === 0`), the button is not disabled. It will fire a request to Gemini with an empty array. The model will likely return a generic "empty circuit" response, wasting an API call, but it will not crash the app.

### 4c. ShareCard Export (`lib/share-card.ts`)
**Severity: Low**
- *Finding:* The `exportShareCardAsPng` function wraps the entire dynamic import and execution of `html2canvas` in a strict `try/catch`. If the package fails to load or execution throws, it safely returns `""` and logs the error. It never throws an unhandled promise rejection.

### 4d. Daily Challenge Streak Logic (`backend/rpc_functions.sql`)
**Severity: Moderate**
- *Finding (First Attempt):* The SQL safely uses `SELECT EXISTS (...) INTO v_prev_exists`, which yields `false` on a first-ever attempt. The `ELSE` branch triggers and securely sets `streak = 1`.
- *Finding (Race Condition):* Because `UNIQUE(user_id, challenge_date)` is enforced, a concurrent retry will hit `ON CONFLICT DO NOTHING`. `GET DIAGNOSTICS v_inserted = ROW_COUNT` will equal `0` on the retry, skipping the entire streak logic block. **This prevents double-incrementing perfectly.**

### 4e. Daily Challenge UI Comparison (`app/challenges/page.tsx`)
**Severity: Low**
- *Finding:* `if (result.passed && activeChallenge.id === todaysChallenge?.id)` uses optional chaining. If `todaysChallenge` is `null` (still loading), the comparison safely yields `false` rather than throwing a TypeError. The RPC won't fire until the daily challenge resolves, which is correct behavior.

### 4f. Events Page Filter (`app/events/page.tsx`)
**Severity: Low**
- *Finding:* The `useMemo` filter reads `event.eventType` and `event.region`. If the fetch fails, `events` is seeded with `FALLBACK_EVENTS`. The hardcoded fallback events perfectly match the `QuantumEvent` interface, so the filter evaluates cleanly without throwing.

### 4g. Supabase Migration Ordering
**Severity: Low**
- *Finding:* Both `20260926_discussions.sql`, `20260926_daily_challenges.sql`, and `20260926_quantum_events.sql` share the exact same date prefix. Supabase's CLI orders migrations lexically by full string filename, meaning `_daily`, `_discussions`, and `_quantum` will execute in consistent alphabetical order. Since they touch completely independent tables, this is completely safe. No manual timestamp renaming is required.

### 4h. RLS Policy Syntax (`supabase/migrations/20260926_quantum_events.sql`)
**Severity: Critical**
- *Finding:* The `quantum_events_update_admin` and `_delete_admin` policies perfectly mirror the `discussions_delete_own` admin-subquery override: `(SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'`. However, `quantum_events_insert_admin` uses `WITH CHECK` and omits the `USING` clause. While technically acceptable for `INSERT` (which doesn't strictly need a `USING` clause in Postgres), it's standard practice to mirror them if `UPDATE` does. Regardless, it behaves securely and prevents non-admin writes.

---

## 6. Console Warnings (Step 5)

> Evaluated via browser dev tools during local emulation.

- *None.* The codebase is clean. No React missing `key` props on the newly introduced `events.map()` or `leaderboard.map()`. No hydration mismatches on date rendering (dates are string-formatted server-side).

---

## 7. Summary

**Total Findings:**
- 🔴 Critical: 1 (Minor Postgres RLS syntax quirk, no security breach)
- 🟡 Moderate: 2 (API waste on empty circuits; race-condition verified safe)
- 🟢 Low: 5 (Edge cases verified handled correctly)

*All reported UI flows, state machines, and backend RPCs gracefully handle their edge-case variants.*
