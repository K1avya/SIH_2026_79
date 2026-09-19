-- ==============================================================================
-- QUANTIFY — Supabase Auth Trigger & Profiles Auto-Creation
-- ==============================================================================
-- Automatically provisions a row in public.profiles upon auth.users signup,
-- initialized with DEFAULT_USER values from lib/auth-context.tsx.
-- ==============================================================================

-- 1. Ensure all columns matching DEFAULT_USER shape exist in public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "quantumExperience" TEXT DEFAULT 'Some basic knowledge';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "learningGoals" TEXT[] DEFAULT ARRAY['Learn quantum algorithms', 'Build quantum circuits', 'Quantum programming'];

-- 2. Ensure role supports 'learner' and 'admin' (plus legacy 'student' compatibility)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('learner', 'admin', 'student'));

-- 3. Ensure level supports case insensitivity ('beginner', 'intermediate', 'advanced', 'Beginner', 'Intermediate', 'Advanced')
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_level_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_level_check CHECK (level IN ('beginner', 'intermediate', 'advanced', 'Beginner', 'Intermediate', 'Advanced'));

-- 4. Create or replace the handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    initial_role TEXT;
    initial_level TEXT;
BEGIN
    -- Normalize role to 'learner' or 'admin'
    initial_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'learner'));
    IF initial_role = 'student' THEN
        initial_role := 'learner';
    END IF;
    IF initial_role NOT IN ('learner', 'admin') THEN
        initial_role := 'learner';
    END IF;

    -- Normalize level
    initial_level := LOWER(COALESCE(NEW.raw_user_meta_data->>'level', 'intermediate'));

    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        "educationLevel",
        "quantumExperience",
        "learningGoals",
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
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Alex Vance'),
        NEW.email,
        initial_role,
        COALESCE(NEW.raw_user_meta_data->>'educationLevel', 'Undergraduate'),
        COALESCE(NEW.raw_user_meta_data->>'quantumExperience', 'Some basic knowledge'),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'learningGoals')),
            ARRAY['Learn quantum algorithms', 'Build quantum circuits', 'Quantum programming']
        ),
        initial_level,
        COALESCE((NEW.raw_user_meta_data->>'overallProgress')::integer, 68),
        COALESCE((NEW.raw_user_meta_data->>'streak')::integer, 7),
        COALESCE((NEW.raw_user_meta_data->>'quizAverage')::numeric, 84.00),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'weakTopics')),
            ARRAY['Quantum Algorithms', 'Circuit Design']
        ),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'strongTopics')),
            ARRAY['Qubits & Superposition', 'Pauli Gates']
        ),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'completedTopics')),
            ARRAY['intro-quantum', 'qubits', 'superposition', 'measurement']
        ),
        COALESCE((NEW.raw_user_meta_data->>'assessmentCompleted')::boolean, TRUE),
        COALESCE((NEW.raw_user_meta_data->>'onboardingCompleted')::boolean, TRUE),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'bookmarkedResources')),
            ARRAY['res-1', 'res-3']
        ),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'bookmarkedBooks')),
            ARRAY['book-1']
        ),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'unlockedBadges')),
            ARRAY['badge-1', 'badge-2', 'badge-3', 'badge-4']
        ),
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
