ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS daily_message_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_reset_at DATE NOT NULL DEFAULT CURRENT_DATE;

-- Allow 'business' as a valid plan value
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE users ADD CONSTRAINT users_plan_check
  CHECK (plan IN ('free', 'pro', 'business'));
