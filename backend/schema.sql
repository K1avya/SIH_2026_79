-- ==============================================================================
-- QUANTIFY — AI-Based Quantum Science Learning Platform (SIH 2026 - SIH26140)
-- Complete PostgreSQL Database Schema Migration for Supabase
-- ==============================================================================
-- Matches TypeScript domain interfaces in types/quantify.ts exactly.
-- Includes Row Level Security (RLS) policies, indexes, foreign keys, and triggers.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- ==============================================================================
-- Holds user profile metadata, quantum proficiency level, progress telemetry,
-- weak/strong diagnostic categories, bookmarked content, and unlocked badges.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Learner',
    email TEXT,
    role TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'admin')),
    "educationLevel" TEXT DEFAULT 'Undergraduate',
    level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    "overallProgress" INTEGER NOT NULL DEFAULT 0 CHECK ("overallProgress" >= 0 AND "overallProgress" <= 100),
    streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
    "quizAverage" NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK ("quizAverage" >= 0 AND "quizAverage" <= 100),
    "weakTopics" TEXT[] NOT NULL DEFAULT '{}',
    "strongTopics" TEXT[] NOT NULL DEFAULT '{}',
    "completedTopics" TEXT[] NOT NULL DEFAULT '{}',
    "assessmentCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "bookmarkedResources" TEXT[] NOT NULL DEFAULT '{}',
    "bookmarkedBooks" TEXT[] NOT NULL DEFAULT '{}',
    "unlockedBadges" TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'Extended learner & admin profile information tied 1:1 with Supabase auth.users';
COMMENT ON COLUMN public.profiles.level IS 'Current quantum knowledge proficiency tier: beginner, intermediate, or advanced';
COMMENT ON COLUMN public.profiles."weakTopics" IS 'Categories where diagnostic assessment or quiz performance requires targeted revision';
COMMENT ON COLUMN public.profiles."strongTopics" IS 'Categories where the learner has demonstrated mastery';

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON public.profiles(streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_progress ON public.profiles("overallProgress" DESC);


-- ==============================================================================
-- 2. ASSESSMENT QUESTIONS TABLE (FR-DIAG-001)
-- ==============================================================================
-- Stores multi-concept diagnostic assessment questions across 5 core categories.
-- Options are stored as JSONB matching AssessmentOption[]: { id, text, isCorrect }.

CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('basics', 'qubits', 'gates', 'circuits', 'algorithms')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    "questionText" TEXT NOT NULL,
    options JSONB NOT NULL,
    explanation TEXT NOT NULL,
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.assessment_questions IS 'Diagnostic evaluation questions for baseline quantum knowledge scoring';
COMMENT ON COLUMN public.assessment_questions.options IS 'JSONB array of options: [{"id": "opt-1", "text": "...", "isCorrect": true}]';

-- Indexes for assessment_questions
CREATE INDEX IF NOT EXISTS idx_assessment_questions_category ON public.assessment_questions(category);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_difficulty ON public.assessment_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_order ON public.assessment_questions("sequenceOrder" ASC);


-- ==============================================================================
-- 3. ASSESSMENT ATTEMPTS TABLE (FR-DIAG-002)
-- ==============================================================================
-- Records each completed diagnostic assessment attempt, score breakdown per
-- category, selected answer map, and the resulting level assigned.

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    timestamp TEXT NOT NULL DEFAULT to_char(timezone('utc'::text, now()), 'YYYY-MM-DD HH24:MI'),
    "totalScore" INTEGER NOT NULL CHECK ("totalScore" >= 0 AND "totalScore" <= 10),
    "levelAssigned" TEXT NOT NULL CHECK ("levelAssigned" IN ('beginner', 'intermediate', 'advanced')),
    "categoryScores" JSONB NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.assessment_attempts IS 'Historical student submissions for the 10-question diagnostic assessment';
COMMENT ON COLUMN public.assessment_attempts."categoryScores" IS 'JSONB array of CategoryScore items: [{"category": "gates", "score": 1, "total": 2, "isWeak": false, "isStrong": false}]';
COMMENT ON COLUMN public.assessment_attempts.answers IS 'JSONB map of questionId -> optionId chosen by user';

-- Indexes for assessment_attempts
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user_id ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_level ON public.assessment_attempts("levelAssigned");
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_created ON public.assessment_attempts(created_at DESC);


-- ==============================================================================
-- 4. TOPICS TABLE (FR-PATH-001)
-- ==============================================================================
-- Curriculum learning modules covering quantum fundamentals, gates, and algorithms.

CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('basics', 'qubits', 'gates', 'circuits', 'algorithms')),
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    "theoryContent" TEXT NOT NULL,
    "videoUrl" TEXT,
    "videoDuration" TEXT,
    "notesUrl" TEXT,
    "practiceQuestionsCount" INTEGER NOT NULL DEFAULT 0,
    "keyFormulas" TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.topics IS 'Canonical syllabus modules for quantum science & computing curriculum';

-- Indexes for topics
CREATE INDEX IF NOT EXISTS idx_topics_category ON public.topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_level ON public.topics(level);
CREATE INDEX IF NOT EXISTS idx_topics_order ON public.topics("sequenceOrder" ASC);


-- ==============================================================================
-- 5. LEARNING PATH ITEMS TABLE (FR-PATH-002)
-- ==============================================================================
-- Per-user status of topics in their personalized learning path.
-- isWeakPriority dynamically bubbles weak topics earlier in the sequence.

CREATE TABLE IF NOT EXISTS public.learning_path_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "topicId" TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
    "isWeakPriority" BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_topic_path UNIQUE (user_id, "topicId")
);

COMMENT ON TABLE public.learning_path_items IS 'Personalized curriculum roadmap sequence and completion status per learner';

-- Indexes for learning_path_items
CREATE INDEX IF NOT EXISTS idx_learning_path_user_id ON public.learning_path_items(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_topicId ON public.learning_path_items("topicId");
CREATE INDEX IF NOT EXISTS idx_learning_path_status ON public.learning_path_items(status);
CREATE INDEX IF NOT EXISTS idx_learning_path_order ON public.learning_path_items("sequenceOrder" ASC);


-- ==============================================================================
-- 6. QUIZ QUESTIONS TABLE
-- ==============================================================================
-- Practice and comprehension questions attached to topics.
-- options: JSONB array of { id, text, isCorrect }

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id TEXT PRIMARY KEY,
    "topicId" TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    "questionText" TEXT NOT NULL,
    options JSONB NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.quiz_questions IS 'Post-topic checkpoint quizzes with interactive feedback';

-- Indexes for quiz_questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_topicId ON public.quiz_questions("topicId");


-- ==============================================================================
-- 7. QUIZ ATTEMPTS TABLE
-- ==============================================================================
-- Records per-topic quiz scores, accuracy percentages, and timestamped attempts.

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "topicId" TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    "scorePercent" NUMERIC(5,2) NOT NULL CHECK ("scorePercent" >= 0 AND "scorePercent" <= 100),
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.quiz_attempts IS 'Recorded quiz attempts per learner and topic';

-- Indexes for quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_topicId ON public.quiz_attempts("topicId");
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON public.quiz_attempts(created_at DESC);


-- ==============================================================================
-- 8. RESOURCES TABLE (ResourceItem)
-- ==============================================================================
-- Curated research papers, video lectures, jupyter notebooks, and documentation.

CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'notes', 'article', 'documentation', 'practice')),
    "topicId" TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    "topicName" TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    url TEXT NOT NULL,
    "durationOrPages" TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.resources IS 'Searchable quantum computing resource repository';

-- Indexes for resources
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_level ON public.resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_topicId ON public.resources("topicId");


-- ==============================================================================
-- 9. BOOKS TABLE (BookRecommendation)
-- ==============================================================================
-- Curated textbooks with personalized "whyRecommended" rationale linked to diagnostics.

CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    "levelTag" TEXT NOT NULL CHECK ("levelTag" IN ('beginner', 'intermediate', 'advanced')),
    "relatedCategory" TEXT NOT NULL CHECK ("relatedCategory" IN ('basics', 'qubits', 'gates', 'circuits', 'algorithms')),
    "coverImage" TEXT,
    "whyRecommended" TEXT NOT NULL,
    isbn TEXT,
    bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    "previewUrl" TEXT,
    pages INTEGER,
    rating NUMERIC(3,2),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.books IS 'Curated textbook suggestions tailored to diagnostic strengths and weaknesses';

-- Indexes for books
CREATE INDEX IF NOT EXISTS idx_books_levelTag ON public.books("levelTag");
CREATE INDEX IF NOT EXISTS idx_books_relatedCategory ON public.books("relatedCategory");


-- ==============================================================================
-- 10. ACHIEVEMENTS TABLE (Achievement)
-- ==============================================================================
-- Master registry of unlockable badges and honors in the gamification system.

CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Milestone' CHECK (category IN ('Milestone', 'Simulator', 'Quiz', 'Streak')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.achievements IS 'Global achievement badges for milestones, streaks, and simulator challenges';

-- Indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);


-- ==============================================================================
-- 11. USER ACHIEVEMENTS TABLE
-- ==============================================================================
-- Tracks per-user achievement completion status, progress, and unlock date.

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    "achievementId" TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    "isEarned" BOOLEAN NOT NULL DEFAULT FALSE,
    "earnedAt" TIMESTAMPTZ,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_achievement UNIQUE (user_id, "achievementId")
);

COMMENT ON TABLE public.user_achievements IS 'Learner unlock progress for platform achievements and badges';

-- Indexes for user_achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement ON public.user_achievements("achievementId");


-- ==============================================================================
-- 12. TUTOR CONVERSATIONS TABLE
-- ==============================================================================
-- Groups chat sessions with the Quanta AI Tutor.

CREATE TABLE IF NOT EXISTS public.tutor_conversations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Quantum Tutor Session',
    "groundedTopic" TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.tutor_conversations IS 'Chat conversation threads between learner and Quanta AI mentor';

-- Indexes for tutor_conversations
CREATE INDEX IF NOT EXISTS idx_tutor_conversations_user ON public.tutor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_conversations_updated ON public.tutor_conversations(updated_at DESC);


-- ==============================================================================
-- 13. TUTOR MESSAGES TABLE (QuantaAIMessage)
-- ==============================================================================
-- Individual messages inside a tutor conversation, with code snippets & hints.

CREATE TABLE IF NOT EXISTS public.tutor_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    conversation_id TEXT NOT NULL REFERENCES public.tutor_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT 'Just now',
    "isHint" BOOLEAN NOT NULL DEFAULT FALSE,
    "groundedTopic" TEXT,
    "codeSnippet" TEXT,
    "conceptCard" JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.tutor_messages IS 'Conversational messages between learner and Quanta AI tutor';
COMMENT ON COLUMN public.tutor_messages."conceptCard" IS 'JSONB concept card: {"title": "...", "summary": "..."}';

-- Indexes for tutor_messages
CREATE INDEX IF NOT EXISTS idx_tutor_messages_conversation ON public.tutor_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_user ON public.tutor_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_created ON public.tutor_messages(created_at ASC);


-- ==============================================================================
-- 14. SAVED CIRCUITS TABLE (PlacedGate[] & SimulationResult)
-- ==============================================================================
-- Interactive Quantum Circuit simulator workspaces created and saved by learners.

CREATE TABLE IF NOT EXISTS public.saved_circuits (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Quantum Circuit',
    description TEXT,
    "qubitCount" INTEGER NOT NULL DEFAULT 2 CHECK ("qubitCount" >= 1 AND "qubitCount" <= 5),
    "placedGates" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "simulationResult" JSONB,
    backend TEXT NOT NULL DEFAULT 'Qiskit Aer',
    shots INTEGER NOT NULL DEFAULT 1000 CHECK (shots >= 100 AND shots <= 10000),
    "isPreset" BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.saved_circuits IS 'Saved quantum circuit layouts and simulation probabilities per user';
COMMENT ON COLUMN public.saved_circuits."placedGates" IS 'JSONB array of PlacedGate: [{"id": "g-1", "type": "H", "targetQubit": 0, "step": 0}]';
COMMENT ON COLUMN public.saved_circuits."simulationResult" IS 'JSONB cache of SimulationResult with basis state measurement probabilities';

-- Indexes for saved_circuits
CREATE INDEX IF NOT EXISTS idx_saved_circuits_user ON public.saved_circuits(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_circuits_preset ON public.saved_circuits("isPreset");
CREATE INDEX IF NOT EXISTS idx_saved_circuits_updated ON public.saved_circuits(updated_at DESC);


-- ==============================================================================
-- 15. PLATFORM SETTINGS TABLE (Admin Thresholds FR-LEVEL-005)
-- ==============================================================================
-- Configurable cutoffs for level classification and admin telemetry.

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "beginnerMax" INTEGER NOT NULL DEFAULT 3,
    "intermediateMax" INTEGER NOT NULL DEFAULT 7,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.platform_settings IS 'Global platform thresholds for diagnostic score level assignment';

INSERT INTO public.platform_settings (id, "beginnerMax", "intermediateMax")
VALUES ('default', 3, 7)
ON CONFLICT (id) DO NOTHING;


-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SUPABASE AUTH SIGNUP
-- ==============================================================================
-- Automatically provisions a row in public.profiles when an auth.users row is inserted.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        "educationLevel",
        level,
        "overallProgress",
        streak,
        "quizAverage",
        "weakTopics",
        "strongTopics",
        "completedTopics",
        "assessmentCompleted",
        "onboardingCompleted",
        "bookmarkedResources",
        "bookmarkedBooks",
        "unlockedBadges",
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Learner'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'learner'),
        COALESCE(NEW.raw_user_meta_data->>'educationLevel', 'Undergraduate'),
        COALESCE(NEW.raw_user_meta_data->>'level', 'beginner'),
        0,
        0,
        0.00,
        '{}',
        '{}',
        '{}',
        FALSE,
        FALSE,
        '{}',
        '{}',
        '{}',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if existing, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_learning_path_modtime ON public.learning_path_items;
CREATE TRIGGER update_learning_path_modtime
    BEFORE UPDATE ON public.learning_path_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_saved_circuits_modtime ON public.saved_circuits;
CREATE TRIGGER update_saved_circuits_modtime
    BEFORE UPDATE ON public.saved_circuits
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_tutor_conversations_modtime ON public.tutor_conversations;
CREATE TRIGGER update_tutor_conversations_modtime
    BEFORE UPDATE ON public.tutor_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Rules Implemented:
-- 1. Enable RLS on EVERY table, no exceptions.
-- 2. Users can ONLY read/write their own rows in:
--    - profiles
--    - assessment_attempts
--    - learning_path_items
--    - quiz_attempts
--    - tutor_conversations
--    - tutor_messages
--    - saved_circuits
--    - user_achievements
-- 3. Public read, admin-only write for:
--    - assessment_questions
--    - topics
--    - quiz_questions
--    - resources
--    - books
--    - achievements
--    - platform_settings
-- 4. Admin role (profiles.role = 'admin') can read/write EVERYTHING.
-- ==============================================================================

-- Helper function with SECURITY DEFINER to bypass RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. Enable RLS on all 15 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id OR public.is_admin());

-- 3. ASSESSMENT ATTEMPTS
DROP POLICY IF EXISTS "assessment_attempts_select_policy" ON public.assessment_attempts;
CREATE POLICY "assessment_attempts_select_policy"
    ON public.assessment_attempts FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "assessment_attempts_insert_policy" ON public.assessment_attempts;
CREATE POLICY "assessment_attempts_insert_policy"
    ON public.assessment_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "assessment_attempts_update_policy" ON public.assessment_attempts;
CREATE POLICY "assessment_attempts_update_policy"
    ON public.assessment_attempts FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "assessment_attempts_delete_policy" ON public.assessment_attempts;
CREATE POLICY "assessment_attempts_delete_policy"
    ON public.assessment_attempts FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 4. LEARNING PATH ITEMS
DROP POLICY IF EXISTS "learning_path_items_select_policy" ON public.learning_path_items;
CREATE POLICY "learning_path_items_select_policy"
    ON public.learning_path_items FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "learning_path_items_insert_policy" ON public.learning_path_items;
CREATE POLICY "learning_path_items_insert_policy"
    ON public.learning_path_items FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "learning_path_items_update_policy" ON public.learning_path_items;
CREATE POLICY "learning_path_items_update_policy"
    ON public.learning_path_items FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "learning_path_items_delete_policy" ON public.learning_path_items;
CREATE POLICY "learning_path_items_delete_policy"
    ON public.learning_path_items FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 5. QUIZ ATTEMPTS
DROP POLICY IF EXISTS "quiz_attempts_select_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_select_policy"
    ON public.quiz_attempts FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "quiz_attempts_insert_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_insert_policy"
    ON public.quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "quiz_attempts_update_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_update_policy"
    ON public.quiz_attempts FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "quiz_attempts_delete_policy" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_delete_policy"
    ON public.quiz_attempts FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 6. TUTOR CONVERSATIONS
DROP POLICY IF EXISTS "tutor_conversations_select_policy" ON public.tutor_conversations;
CREATE POLICY "tutor_conversations_select_policy"
    ON public.tutor_conversations FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_conversations_insert_policy" ON public.tutor_conversations;
CREATE POLICY "tutor_conversations_insert_policy"
    ON public.tutor_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_conversations_update_policy" ON public.tutor_conversations;
CREATE POLICY "tutor_conversations_update_policy"
    ON public.tutor_conversations FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_conversations_delete_policy" ON public.tutor_conversations;
CREATE POLICY "tutor_conversations_delete_policy"
    ON public.tutor_conversations FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 7. TUTOR MESSAGES
DROP POLICY IF EXISTS "tutor_messages_select_policy" ON public.tutor_messages;
CREATE POLICY "tutor_messages_select_policy"
    ON public.tutor_messages FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_messages_insert_policy" ON public.tutor_messages;
CREATE POLICY "tutor_messages_insert_policy"
    ON public.tutor_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_messages_update_policy" ON public.tutor_messages;
CREATE POLICY "tutor_messages_update_policy"
    ON public.tutor_messages FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "tutor_messages_delete_policy" ON public.tutor_messages;
CREATE POLICY "tutor_messages_delete_policy"
    ON public.tutor_messages FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 8. SAVED CIRCUITS
DROP POLICY IF EXISTS "saved_circuits_select_policy" ON public.saved_circuits;
CREATE POLICY "saved_circuits_select_policy"
    ON public.saved_circuits FOR SELECT
    USING (auth.uid() = user_id OR "isPreset" = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "saved_circuits_insert_policy" ON public.saved_circuits;
CREATE POLICY "saved_circuits_insert_policy"
    ON public.saved_circuits FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "saved_circuits_update_policy" ON public.saved_circuits;
CREATE POLICY "saved_circuits_update_policy"
    ON public.saved_circuits FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "saved_circuits_delete_policy" ON public.saved_circuits;
CREATE POLICY "saved_circuits_delete_policy"
    ON public.saved_circuits FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 9. USER ACHIEVEMENTS
DROP POLICY IF EXISTS "user_achievements_select_policy" ON public.user_achievements;
CREATE POLICY "user_achievements_select_policy"
    ON public.user_achievements FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_achievements_insert_policy" ON public.user_achievements;
CREATE POLICY "user_achievements_insert_policy"
    ON public.user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_achievements_update_policy" ON public.user_achievements;
CREATE POLICY "user_achievements_update_policy"
    ON public.user_achievements FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "user_achievements_delete_policy" ON public.user_achievements;
CREATE POLICY "user_achievements_delete_policy"
    ON public.user_achievements FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- 10. ASSESSMENT QUESTIONS (Public read, admin write)
DROP POLICY IF EXISTS "assessment_questions_select_policy" ON public.assessment_questions;
CREATE POLICY "assessment_questions_select_policy"
    ON public.assessment_questions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "assessment_questions_insert_policy" ON public.assessment_questions;
CREATE POLICY "assessment_questions_insert_policy"
    ON public.assessment_questions FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "assessment_questions_update_policy" ON public.assessment_questions;
CREATE POLICY "assessment_questions_update_policy"
    ON public.assessment_questions FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "assessment_questions_delete_policy" ON public.assessment_questions;
CREATE POLICY "assessment_questions_delete_policy"
    ON public.assessment_questions FOR DELETE
    USING (public.is_admin());

-- 11. TOPICS (Public read, admin write)
DROP POLICY IF EXISTS "topics_select_policy" ON public.topics;
CREATE POLICY "topics_select_policy"
    ON public.topics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "topics_insert_policy" ON public.topics;
CREATE POLICY "topics_insert_policy"
    ON public.topics FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "topics_update_policy" ON public.topics;
CREATE POLICY "topics_update_policy"
    ON public.topics FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "topics_delete_policy" ON public.topics;
CREATE POLICY "topics_delete_policy"
    ON public.topics FOR DELETE
    USING (public.is_admin());

-- 12. QUIZ QUESTIONS (Public read, admin write)
DROP POLICY IF EXISTS "quiz_questions_select_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_select_policy"
    ON public.quiz_questions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "quiz_questions_insert_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_insert_policy"
    ON public.quiz_questions FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quiz_questions_update_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_update_policy"
    ON public.quiz_questions FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quiz_questions_delete_policy" ON public.quiz_questions;
CREATE POLICY "quiz_questions_delete_policy"
    ON public.quiz_questions FOR DELETE
    USING (public.is_admin());

-- 13. RESOURCES (Public read, admin write)
DROP POLICY IF EXISTS "resources_select_policy" ON public.resources;
CREATE POLICY "resources_select_policy"
    ON public.resources FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "resources_insert_policy" ON public.resources;
CREATE POLICY "resources_insert_policy"
    ON public.resources FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "resources_update_policy" ON public.resources;
CREATE POLICY "resources_update_policy"
    ON public.resources FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "resources_delete_policy" ON public.resources;
CREATE POLICY "resources_delete_policy"
    ON public.resources FOR DELETE
    USING (public.is_admin());

-- 14. BOOKS (Public read, admin write)
DROP POLICY IF EXISTS "books_select_policy" ON public.books;
CREATE POLICY "books_select_policy"
    ON public.books FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "books_insert_policy" ON public.books;
CREATE POLICY "books_insert_policy"
    ON public.books FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "books_update_policy" ON public.books;
CREATE POLICY "books_update_policy"
    ON public.books FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "books_delete_policy" ON public.books;
CREATE POLICY "books_delete_policy"
    ON public.books FOR DELETE
    USING (public.is_admin());

-- 15. ACHIEVEMENTS (Public read, admin write)
DROP POLICY IF EXISTS "achievements_select_policy" ON public.achievements;
CREATE POLICY "achievements_select_policy"
    ON public.achievements FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "achievements_insert_policy" ON public.achievements;
CREATE POLICY "achievements_insert_policy"
    ON public.achievements FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "achievements_update_policy" ON public.achievements;
CREATE POLICY "achievements_update_policy"
    ON public.achievements FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "achievements_delete_policy" ON public.achievements;
CREATE POLICY "achievements_delete_policy"
    ON public.achievements FOR DELETE
    USING (public.is_admin());

-- 16. PLATFORM SETTINGS (Public read, admin write)
DROP POLICY IF EXISTS "platform_settings_select_policy" ON public.platform_settings;
CREATE POLICY "platform_settings_select_policy"
    ON public.platform_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "platform_settings_insert_policy" ON public.platform_settings;
CREATE POLICY "platform_settings_insert_policy"
    ON public.platform_settings FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "platform_settings_update_policy" ON public.platform_settings;
CREATE POLICY "platform_settings_update_policy"
    ON public.platform_settings FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "platform_settings_delete_policy" ON public.platform_settings;
CREATE POLICY "platform_settings_delete_policy"
    ON public.platform_settings FOR DELETE
    USING (public.is_admin());

