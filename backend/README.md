# ⚛️ QUANTIFY Backend Architecture & Database Documentation

Built for **Smart India Hackathon (SIH 2026)** — Problem Statement ID: **SIH26140**  
Stack: **Supabase (PostgreSQL + Auth + Edge Functions) + Next.js 14**

---

## 📁 Backend Directory Structure

```
backend/
├── schema.sql           # Single comprehensive PostgreSQL migration file (schema + RLS + triggers)
├── rls_policies.sql     # Standalone RLS policies script with is_admin() helper
├── seed.sql             # Canonical seed data (assessment questions, topics, quizzes, books)
├── supabase-client.ts   # Typed Supabase client initialized with environment tokens
├── migrate.js           # Migration runner for direct PostgreSQL connections
├── verify.js            # Live verification script for Supabase tables & row counts
└── README.md            # Backend setup and schema documentation
```

---

## 🗄️ Database Tables Overview

| Table Name | Description | Key Relationships & Types |
|---|---|---|
| `public.profiles` | Extended user profile extending Supabase `auth.users` | `id` (UUID PK → `auth.users`), `level` ('beginner', 'intermediate', 'advanced'), `role` ('learner', 'admin'), `weakTopics[]`, `strongTopics[]`, `completedTopics[]`, etc. |
| `public.assessment_questions` | 10 baseline diagnostic questions across 5 quantum categories | `category` ('basics', 'qubits', 'gates', 'circuits', 'algorithms'), `options` (JSONB `AssessmentOption[]`), `sequenceOrder`. |
| `public.assessment_attempts` | Historical student submissions and level calculations | `user_id` (FK → `profiles`), `categoryScores` (JSONB `CategoryScore[]`), `answers` (JSONB `Record<string, string>`). |
| `public.topics` | Curriculum syllabus modules | `name`, `level`, `sequenceOrder`, `theoryContent`, `videoUrl`, `practiceQuestionsCount`, `keyFormulas[]`. |
| `public.learning_path_items` | Per-user dynamic curriculum order & completion status | `user_id` (FK), `topicId` (FK), `status` ('locked', 'available', 'in_progress', 'completed'), `isWeakPriority` (boolean). |
| `public.quiz_questions` | Post-topic checkpoint comprehension questions | `topicId` (FK → `topics`), `options` (JSONB array), `explanation`. |
| `public.quiz_attempts` | Per-topic recorded test scores and accuracy | `user_id` (FK), `topicId` (FK), `scorePercent` (numeric), `answers` (JSONB). |
| `public.resources` | Research papers, video lectures, and notebooks | `type` ('video', 'notes', 'article', 'documentation', 'practice'), `topicId` (FK), `level`. |
| `public.books` | Curated textbooks with personalized rationale | `levelTag`, `relatedCategory`, `whyRecommended`, `isbn`, `rating`, `previewUrl`. |
| `public.achievements` | Global milestone badges catalog | `title`, `description`, `icon`, `category` ('Milestone', 'Simulator', 'Quiz', 'Streak'). |
| `public.user_achievements` | Per-user badge unlock telemetry | `user_id` (FK), `achievementId` (FK), `isEarned`, `progress` (0-100%). |
| `public.tutor_conversations` | Grouped chat threads with Quanta AI | `user_id` (FK → `profiles`), `title`, `groundedTopic`. |
| `public.tutor_messages` | Individual chat messages with code snippets | `conversation_id` (FK), `user_id` (FK), `sender` ('user'/'assistant'), `codeSnippet`, `conceptCard` (JSONB). |
| `public.saved_circuits` | Multi-qubit circuit matrix workspaces | `user_id` (FK), `qubitCount` (1-5), `placedGates` (JSONB `PlacedGate[]`), `simulationResult` (JSONB `SimulationResult`), `backend`, `shots`. |
| `public.platform_settings` | Admin cutoff thresholds for scoring | `beginnerMax` (default 3), `intermediateMax` (default 7). |

---

## 🔐 Security & Triggers

1. **Row Level Security (RLS)**: Enabled across all 15 tables.
   - Learners can strictly access and modify their own private attempts, learning paths, messages, and saved circuits (`auth.uid() = user_id`).
   - Educational content (`assessment_questions`, `topics`, `resources`, `books`, `achievements`) is public-read (`SELECT true`), but write-restricted to administrators.
2. **Auto-Profile Trigger (`handle_new_user`)**:
   - Automatically executes whenever a learner registers via Supabase Auth (`auth.users`), creating their matching entry in `public.profiles`.
3. **Auto-Timestamp Trigger (`handle_updated_at`)**:
   - Automatically keeps `updated_at` timestamps in sync.

---

## 🚀 How to Apply the Migration

### Option A: Via Supabase Dashboard (Recommended)
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/project/lpegmwrbdixvwwjfhhuo).
2. Navigate to the **SQL Editor** tab on the left sidebar.
3. Click **New Query**.
4. Paste the entire content of [`backend/schema.sql`](./schema.sql) and click **Run**.
5. (Optional) Run [`backend/seed.sql`](./seed.sql) to populate initial questions, topics, books, and resources.

### Option B: Via Connection Pooler / CLI
```bash
# Set your connection string with IPv4 pooler or direct connection:
node backend/migrate.js
```
