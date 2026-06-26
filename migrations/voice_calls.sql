ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  call_sid TEXT UNIQUE NOT NULL,
  caller_number TEXT,
  transcript JSONB DEFAULT '[]',
  lead_captured JSONB,
  duration INT,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS voice_calls_agent_id_idx ON voice_calls(agent_id);
CREATE INDEX IF NOT EXISTS voice_calls_call_sid_idx ON voice_calls(call_sid);
