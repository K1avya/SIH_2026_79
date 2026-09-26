-- ============================================================
-- Quantify — Daily Challenges + Streak Leaderboard Migration
-- 2026-09-26
-- ============================================================

-- 1. daily_challenges -----------------------------------------
--    Stores which SEED_CHALLENGES challenge_id is assigned to each calendar date.
--    challenge_id is validated client-side against SEED_CHALLENGES (TS constant),
--    not as a DB foreign key.
CREATE TABLE IF NOT EXISTS daily_challenges (
  challenge_date  date PRIMARY KEY,
  challenge_id    text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_challenges_select_auth"
  ON daily_challenges FOR SELECT TO authenticated USING (true);

-- 2. daily_challenge_attempts ----------------------------------
--    One row per (user, date). UNIQUE constraint prevents double-counting.
CREATE TABLE IF NOT EXISTS daily_challenge_attempts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_date  date REFERENCES daily_challenges(challenge_date) NOT NULL,
  score_percent   int  NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (user_id, challenge_date)
);

ALTER TABLE daily_challenge_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_attempts_select_own"
  ON daily_challenge_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "daily_attempts_insert_own"
  ON daily_challenge_attempts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_attempts_user_date
  ON daily_challenge_attempts (user_id, challenge_date DESC);
