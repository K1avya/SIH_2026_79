-- ==============================================================================
-- QUANTIFY — PostgreSQL RPC Stored Functions
-- ==============================================================================
-- 1. get_learning_path(p_user_id UUID)
--    Returns an array of LearningPathItem objects with dynamically computed
--    statuses ('locked', 'available', 'in_progress', 'completed') and priority
--    flags based on the learner's diagnostic level and progress.
--
-- 2. submit_quiz(p_user_id UUID, p_topic_id TEXT, p_answers JSONB)
--    Server-side quiz grading, quiz_attempts insertion, profiles.quizAverage
--    recalculation, and topic completion tracking with overallProgress update.
-- ==============================================================================

-- ==============================================================================
-- 1. FUNCTION: get_learning_path
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_learning_path(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_level TEXT := 'beginner';
    v_completed_topics TEXT[] := '{}';
    v_weak_topics TEXT[] := '{}';
    v_user_tier INT := 1;
    v_found_active BOOLEAN := FALSE;
    v_topic RECORD;
    v_status TEXT;
    v_is_weak BOOLEAN;
    v_topic_tier INT;
    v_idx INT := 0;
    v_items JSONB := '[]'::jsonb;
BEGIN
    -- 1. Retrieve learner's diagnostic profile
    SELECT 
        COALESCE(level, 'beginner'),
        COALESCE("completedTopics", '{}'),
        COALESCE("weakTopics", '{}')
    INTO 
        v_user_level,
        v_completed_topics,
        v_weak_topics
    FROM public.profiles
    WHERE id = p_user_id;

    -- Map user level to numeric rank
    v_user_tier := CASE LOWER(v_user_level)
        WHEN 'advanced' THEN 3
        WHEN 'intermediate' THEN 2
        ELSE 1
    END;

    -- 2. Loop through curriculum topics in sequence
    FOR v_topic IN (
        SELECT *
        FROM public.topics
        ORDER BY "sequenceOrder" ASC
    ) LOOP
        v_idx := v_idx + 1;
        
        -- Check if topic tier
        v_topic_tier := CASE LOWER(v_topic.level)
            WHEN 'advanced' THEN 3
            WHEN 'intermediate' THEN 2
            ELSE 1
        END;

        -- Check if topic is in user's diagnostic weak focus list
        v_is_weak := (
            v_topic.name = ANY(v_weak_topics) OR 
            v_topic.category = ANY(v_weak_topics) OR
            EXISTS (
                SELECT 1 FROM unnest(v_weak_topics) w 
                WHERE LOWER(v_topic.name) LIKE '%' || LOWER(w) || '%' 
                   OR LOWER(v_topic.category) LIKE '%' || LOWER(w) || '%'
            )
        );

        -- Determine status
        IF v_topic.id = ANY(v_completed_topics) THEN
            v_status := 'completed';
        ELSIF NOT v_found_active THEN
            v_status := 'in_progress';
            v_found_active := TRUE;
        ELSE
            IF v_user_tier >= v_topic_tier OR v_idx <= (cardinality(v_completed_topics) + 2) THEN
                v_status := 'available';
            ELSE
                v_status := 'locked';
            END IF;
        END IF;

        -- Append to items array
        v_items := v_items || jsonb_build_object(
            'id', 'path-item-' || v_topic.id,
            'topicId', v_topic.id,
            'topic', to_jsonb(v_topic),
            'status', v_status,
            'sequenceOrder', CASE WHEN v_is_weak THEN v_topic."sequenceOrder" - 100 ELSE v_topic."sequenceOrder" END,
            'isWeakPriority', v_is_weak
        );
    END LOOP;

    RETURN v_items;
END;
$$;

COMMENT ON FUNCTION public.get_learning_path IS 'Returns dynamic LearningPathItem[] with locked/available/in_progress/completed statuses';


-- ==============================================================================
-- 2. FUNCTION: submit_quiz
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.submit_quiz(
    p_user_id UUID,
    p_topic_id TEXT,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_q RECORD;
    v_total_questions INT := 0;
    v_correct_count INT := 0;
    v_score_percent NUMERIC(5,2) := 0.00;
    v_passed BOOLEAN := FALSE;
    v_attempt_id TEXT := gen_random_uuid()::text;
    v_correct_opt_id TEXT;
    v_user_ans_str TEXT;
    v_new_avg NUMERIC(5,2) := 0.00;
    v_completed_topics TEXT[] := '{}';
    v_total_topics_count INT := 12;
    v_new_progress INT := 0;
    v_opt RECORD;
BEGIN
    -- 1. Count and grade questions for the topic (fallback to 'default')
    FOR v_q IN (
        SELECT id, options
        FROM public.quiz_questions
        WHERE "topicId" = p_topic_id
    ) LOOP
        v_total_questions := v_total_questions + 1;
        
        -- Extract the correct option id from JSONB options array
        SELECT (opt->>'id') INTO v_correct_opt_id
        FROM jsonb_array_elements(v_q.options) opt
        WHERE (opt->>'isCorrect')::boolean IS TRUE
        LIMIT 1;

        -- Extract user answer
        v_user_ans_str := p_answers->>v_q.id;

        IF v_correct_opt_id IS NOT NULL AND v_user_ans_str IS NOT NULL THEN
            IF LOWER(v_correct_opt_id) = LOWER(v_user_ans_str) THEN
                v_correct_count := v_correct_count + 1;
            END IF;
        END IF;
    END LOOP;

    -- If no questions for topic, check 'default' topic
    IF v_total_questions = 0 THEN
        FOR v_q IN (
            SELECT id, options
            FROM public.quiz_questions
            WHERE "topicId" = 'default'
        ) LOOP
            v_total_questions := v_total_questions + 1;
            
            SELECT (opt->>'id') INTO v_correct_opt_id
            FROM jsonb_array_elements(v_q.options) opt
            WHERE (opt->>'isCorrect')::boolean IS TRUE
            LIMIT 1;

            v_user_ans_str := p_answers->>v_q.id;

            IF v_correct_opt_id IS NOT NULL AND v_user_ans_str IS NOT NULL THEN
                IF LOWER(v_correct_opt_id) = LOWER(v_user_ans_str) THEN
                    v_correct_count := v_correct_count + 1;
                END IF;
            END IF;
        END LOOP;
    END IF;

    IF v_total_questions = 0 THEN
        RAISE EXCEPTION 'No quiz questions available for topic: %', p_topic_id;
    END IF;

    -- 2. Calculate score percentage (passing benchmark 70%)
    v_score_percent := ROUND((v_correct_count::numeric / v_total_questions::numeric) * 100, 2);
    v_passed := (v_score_percent >= 70.00);

    -- 3. Log attempt into public.quiz_attempts
    INSERT INTO public.quiz_attempts (
        id,
        user_id,
        "topicId",
        "scorePercent",
        "totalQuestions",
        "correctCount",
        answers,
        created_at
    ) VALUES (
        v_attempt_id,
        p_user_id,
        p_topic_id,
        v_score_percent,
        v_total_questions,
        v_correct_count,
        p_answers,
        timezone('utc'::text, now())
    );

    -- 4. Calculate new cumulative quiz average
    SELECT COALESCE(ROUND(AVG("scorePercent"), 2), v_score_percent)
    INTO v_new_avg
    FROM public.quiz_attempts
    WHERE user_id = p_user_id;

    -- 5. Fetch profile completedTopics
    SELECT COALESCE("completedTopics", '{}')
    INTO v_completed_topics
    FROM public.profiles
    WHERE id = p_user_id;

    -- Count total topics in curriculum
    SELECT COUNT(*) INTO v_total_topics_count FROM public.topics;
    IF v_total_topics_count = 0 THEN
        v_total_topics_count := 12;
    END IF;

    -- 6. If passed, mark topic completed and update overallProgress
    IF v_passed AND p_topic_id != 'default' THEN
        IF NOT (p_topic_id = ANY(v_completed_topics)) THEN
            v_completed_topics := array_append(v_completed_topics, p_topic_id);
        END IF;

        v_new_progress := LEAST(100, ROUND((cardinality(v_completed_topics)::numeric / v_total_topics_count::numeric) * 100));

        UPDATE public.profiles
        SET 
            "quizAverage" = v_new_avg,
            "completedTopics" = v_completed_topics,
            "overallProgress" = v_new_progress,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_user_id;
    ELSE
        UPDATE public.profiles
        SET 
            "quizAverage" = v_new_avg,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_user_id;
    END IF;

    -- 7. Return complete quiz result
    RETURN jsonb_build_object(
        'attemptId', v_attempt_id,
        'topicId', p_topic_id,
        'scorePercent', v_score_percent,
        'correctCount', v_correct_count,
        'totalQuestions', v_total_questions,
        'passed', v_passed,
        'newQuizAverage', v_new_avg,
        'newOverallProgress', v_new_progress,
        'completedTopics', v_completed_topics
    );
END;
$$;

COMMENT ON FUNCTION public.submit_quiz IS 'Grades quiz, saves attempt, recalculates profiles.quizAverage, and updates topic completion';
