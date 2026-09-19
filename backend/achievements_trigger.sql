-- ==============================================================================
-- QUANTIFY — Automated Achievement Unlock System (Functions & Triggers)
-- ==============================================================================
-- Automatically unlocks badges in public.user_achievements and synchronizes
-- public.profiles."unlockedBadges" whenever:
-- 1. An assessment_attempts row is inserted (Unlocks badge-1 'First Step')
-- 2. A quiz_attempts row is inserted with a passing score (Unlocks badge-5 'Quiz Master')
-- 3. profiles.streak / completedTopics / progress is updated (Unlocks badge-2, badge-4, badge-8)
-- 4. A saved_circuits row is inserted (Unlocks badge-3 'Circuit Builder', badge-6 'Algorithm Specialist')
-- ==============================================================================

-- 1. Ensure master achievement badges exist in public.achievements
INSERT INTO public.achievements (id, title, description, icon, category)
VALUES
(
    'badge-1',
    'First Step',
    'Completed your initial quantum diagnostic assessment.',
    'GraduationCap',
    'Milestone'
),
(
    'badge-2',
    'Quantum Explorer',
    'Mastered 3 fundamental quantum topics in the learning path.',
    'Atom',
    'Milestone'
),
(
    'badge-3',
    'Circuit Builder',
    'Successfully created and executed a 2-qubit circuit in the Simulator.',
    'Cpu',
    'Simulator'
),
(
    'badge-4',
    '7-Day Streak',
    'Maintained a active 7-day quantum learning streak.',
    'Flame',
    'Streak'
),
(
    'badge-5',
    'Quiz Master',
    'Scored 100% on 3 consecutive topic quizzes.',
    'Award',
    'Quiz'
),
(
    'badge-6',
    'Algorithm Specialist',
    'Constructed Grover Search or Deutsch-Jozsa quantum algorithm circuit.',
    'Zap',
    'Simulator'
),
(
    'badge-7',
    'Quanta Scholar',
    'Interacted with Quanta AI Tutor for over 10 detailed explanations.',
    'MessageSquare',
    'Milestone'
),
(
    'badge-8',
    'Quantum Architect',
    'Completed 100% of the Personalized Learning Path curriculum.',
    'Trophy',
    'Milestone'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category;

-- ==============================================================================
-- 2. CORE FUNCTION: check_and_unlock_achievements
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.check_and_unlock_achievements(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_profile RECORD;
    v_has_assessment BOOLEAN := FALSE;
    v_perfect_quiz_count INT := 0;
    v_has_saved_circuit BOOLEAN := FALSE;
    v_has_algorithm_circuit BOOLEAN := FALSE;
    v_tutor_msg_count INT := 0;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    IF target_user_id IS NULL THEN
        RETURN;
    END IF;

    -- Fetch user profile
    SELECT * INTO v_profile FROM public.profiles WHERE id = target_user_id;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 1: First Step (Completed diagnostic assessment)
    -- --------------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1 FROM public.assessment_attempts WHERE user_id = target_user_id
    ) INTO v_has_assessment;

    IF v_has_assessment OR v_profile."assessmentCompleted" = TRUE THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-1', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 2: Quantum Explorer (Completed >= 3 topics)
    -- --------------------------------------------------------------------------
    IF cardinality(COALESCE(v_profile."completedTopics", '{}')) >= 3 THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-2', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    ELSE
        -- Track partial progress (0 to 100%)
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", progress)
        VALUES (target_user_id, 'badge-2', FALSE, LEAST(100, cardinality(COALESCE(v_profile."completedTopics", '{}')) * 33))
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            progress = LEAST(100, cardinality(COALESCE(v_profile."completedTopics", '{}')) * 33),
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 3: Circuit Builder (Created / saved a circuit in simulator)
    -- --------------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1 FROM public.saved_circuits WHERE user_id = target_user_id
    ) INTO v_has_saved_circuit;

    IF v_has_saved_circuit THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-3', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 4: 7-Day Streak (Active 7-day streak)
    -- --------------------------------------------------------------------------
    IF COALESCE(v_profile.streak, 0) >= 7 THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-4', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    ELSE
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", progress)
        VALUES (target_user_id, 'badge-4', FALSE, LEAST(100, ROUND((COALESCE(v_profile.streak, 0)::numeric / 7.0) * 100)))
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            progress = LEAST(100, ROUND((COALESCE(v_profile.streak, 0)::numeric / 7.0) * 100)),
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 5: Quiz Master (Scored 100% on 3 quizzes)
    -- --------------------------------------------------------------------------
    SELECT COUNT(*) INTO v_perfect_quiz_count
    FROM public.quiz_attempts
    WHERE user_id = target_user_id AND "scorePercent" >= 100;

    IF v_perfect_quiz_count >= 3 THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-5', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    ELSE
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", progress)
        VALUES (target_user_id, 'badge-5', FALSE, LEAST(100, v_perfect_quiz_count * 33))
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            progress = LEAST(100, v_perfect_quiz_count * 33),
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 6: Algorithm Specialist (Built Grover or Deutsch-Jozsa circuit)
    -- --------------------------------------------------------------------------
    SELECT EXISTS (
        SELECT 1 FROM public.saved_circuits
        WHERE user_id = target_user_id AND (
            LOWER(title) LIKE '%grover%' OR 
            LOWER(title) LIKE '%deutsch%' OR 
            LOWER(COALESCE(description, '')) LIKE '%grover%' OR
            LOWER(COALESCE(description, '')) LIKE '%deutsch%' OR
            "qubitCount" >= 3
        )
    ) INTO v_has_algorithm_circuit;

    IF v_has_algorithm_circuit THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-6', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 7: Quanta Scholar (Interacted with AI tutor for >= 10 messages)
    -- --------------------------------------------------------------------------
    SELECT COUNT(*) INTO v_tutor_msg_count
    FROM public.tutor_messages
    WHERE user_id = target_user_id AND sender = 'user';

    IF v_tutor_msg_count >= 10 THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-7', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    ELSE
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", progress)
        VALUES (target_user_id, 'badge-7', FALSE, LEAST(100, v_tutor_msg_count * 10))
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            progress = LEAST(100, v_tutor_msg_count * 10),
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- BADGE 8: Quantum Architect (Completed 100% of curriculum)
    -- --------------------------------------------------------------------------
    IF COALESCE(v_profile."overallProgress", 0) >= 100 OR cardinality(COALESCE(v_profile."completedTopics", '{}')) >= 12 THEN
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", "earnedAt", progress)
        VALUES (target_user_id, 'badge-8', TRUE, v_now, 100)
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            "isEarned" = TRUE,
            "earnedAt" = COALESCE(user_achievements."earnedAt", v_now),
            progress = 100,
            updated_at = v_now;
    ELSE
        INSERT INTO public.user_achievements (user_id, "achievementId", "isEarned", progress)
        VALUES (target_user_id, 'badge-8', FALSE, COALESCE(v_profile."overallProgress", 0))
        ON CONFLICT (user_id, "achievementId") DO UPDATE SET
            progress = COALESCE(v_profile."overallProgress", 0),
            updated_at = v_now;
    END IF;

    -- --------------------------------------------------------------------------
    -- Synchronize unlocked badge list into profiles."unlockedBadges"
    -- --------------------------------------------------------------------------
    UPDATE public.profiles
    SET "unlockedBadges" = ARRAY(
        SELECT "achievementId"
        FROM public.user_achievements
        WHERE user_id = target_user_id AND "isEarned" = TRUE
        ORDER BY "earnedAt" ASC
    )
    WHERE id = target_user_id;

END;
$$;

COMMENT ON FUNCTION public.check_and_unlock_achievements IS 'Evaluates and unlocks all achievements for a given user';


-- ==============================================================================
-- 3. TRIGGERS
-- ==============================================================================

-- TRIGGER 1: When an assessment_attempts row is inserted
CREATE OR REPLACE FUNCTION public.handle_assessment_attempt_achievement()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.check_and_unlock_achievements(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_assessment_attempt_achievement ON public.assessment_attempts;
CREATE TRIGGER trg_assessment_attempt_achievement
    AFTER INSERT ON public.assessment_attempts
    FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_attempt_achievement();


-- TRIGGER 2: When a quiz_attempts row is inserted with a passing score
CREATE OR REPLACE FUNCTION public.handle_quiz_attempt_achievement()
RETURNS TRIGGER AS $$
BEGIN
    -- Check achievements whenever a quiz is taken (especially passing or 100% scores)
    IF NEW."scorePercent" >= 70 THEN
        PERFORM public.check_and_unlock_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_quiz_attempt_achievement ON public.quiz_attempts;
CREATE TRIGGER trg_quiz_attempt_achievement
    AFTER INSERT ON public.quiz_attempts
    FOR EACH ROW EXECUTE FUNCTION public.handle_quiz_attempt_achievement();


-- TRIGGER 3: When profiles.streak, completedTopics, or overallProgress updates
CREATE OR REPLACE FUNCTION public.handle_profile_update_achievement()
RETURNS TRIGGER AS $$
BEGIN
    -- Only evaluate if tracked gamification fields changed to prevent recursive loops
    IF (OLD.streak IS DISTINCT FROM NEW.streak) OR
       (OLD."completedTopics" IS DISTINCT FROM NEW."completedTopics") OR
       (OLD."overallProgress" IS DISTINCT FROM NEW."overallProgress") OR
       (OLD."assessmentCompleted" IS DISTINCT FROM NEW."assessmentCompleted") THEN
        PERFORM public.check_and_unlock_achievements(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_profile_update_achievement ON public.profiles;
CREATE TRIGGER trg_profile_update_achievement
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_profile_update_achievement();


-- TRIGGER 4: When a circuit is saved in simulator
CREATE OR REPLACE FUNCTION public.handle_saved_circuit_achievement()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.check_and_unlock_achievements(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_saved_circuit_achievement ON public.saved_circuits;
CREATE TRIGGER trg_saved_circuit_achievement
    AFTER INSERT OR UPDATE ON public.saved_circuits
    FOR EACH ROW EXECUTE FUNCTION public.handle_saved_circuit_achievement();


-- TRIGGER 5: When an AI tutor message is sent
CREATE OR REPLACE FUNCTION public.handle_tutor_message_achievement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sender = 'user' THEN
        PERFORM public.check_and_unlock_achievements(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_tutor_message_achievement ON public.tutor_messages;
CREATE TRIGGER trg_tutor_message_achievement
    AFTER INSERT ON public.tutor_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_tutor_message_achievement();
