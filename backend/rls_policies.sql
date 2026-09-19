-- ==============================================================================
-- QUANTIFY — AI-Based Quantum Science Learning Platform (SIH 2026 - SIH26140)
-- Complete Row Level Security (RLS) Policies Migration for Supabase
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

-- ------------------------------------------------------------------------------
-- HELPER FUNCTION: is_admin()
-- ------------------------------------------------------------------------------
-- Uses SECURITY DEFINER to bypass RLS recursion while checking caller's role.
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

COMMENT ON FUNCTION public.is_admin() IS 'Returns true if the authenticated user has the admin role in public.profiles';


-- ==============================================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES (NO EXCEPTIONS)
-- ==============================================================================
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


-- ==============================================================================
-- 2. PROFILES
-- ==============================================================================
-- Users can only read/update/delete their own profile. Admin can read/write everything.

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


-- ==============================================================================
-- 3. ASSESSMENT ATTEMPTS
-- ==============================================================================
-- Users can only read/write their own attempts. Admin can read/write everything.

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


-- ==============================================================================
-- 4. LEARNING PATH ITEMS
-- ==============================================================================
-- Users can only read/write their own roadmap items. Admin can read/write everything.

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


-- ==============================================================================
-- 5. QUIZ ATTEMPTS
-- ==============================================================================
-- Users can only read/write their own quiz attempts. Admin can read/write everything.

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


-- ==============================================================================
-- 6. TUTOR CONVERSATIONS
-- ==============================================================================
-- Users can only read/write their own conversations. Admin can read/write everything.

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


-- ==============================================================================
-- 7. TUTOR MESSAGES
-- ==============================================================================
-- Users can only read/write their own messages. Admin can read/write everything.

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


-- ==============================================================================
-- 8. SAVED CIRCUITS
-- ==============================================================================
-- Users can only read/write their own circuits, plus view public preset circuits.
-- Admin can read/write everything.

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


-- ==============================================================================
-- 9. USER ACHIEVEMENTS
-- ==============================================================================
-- Users can only read/write their own achievements. Admin can read/write everything.

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


-- ==============================================================================
-- 10. ASSESSMENT QUESTIONS
-- ==============================================================================
-- Public read (anyone can view questions). Write restricted to admin.

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


-- ==============================================================================
-- 11. TOPICS
-- ==============================================================================
-- Public read (anyone can view topics). Write restricted to admin.

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


-- ==============================================================================
-- 12. QUIZ QUESTIONS
-- ==============================================================================
-- Public read (anyone can view quiz questions). Write restricted to admin.

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


-- ==============================================================================
-- 13. RESOURCES
-- ==============================================================================
-- Public read (anyone can view resources). Write restricted to admin.

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


-- ==============================================================================
-- 14. BOOKS
-- ==============================================================================
-- Public read (anyone can view books). Write restricted to admin.

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


-- ==============================================================================
-- 15. ACHIEVEMENTS
-- ==============================================================================
-- Public read (anyone can view global achievements). Write restricted to admin.

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


-- ==============================================================================
-- 16. PLATFORM SETTINGS
-- ==============================================================================
-- Public read (anyone can view thresholds). Write restricted to admin.

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
