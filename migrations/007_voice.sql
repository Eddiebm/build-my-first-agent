-- Voice agent support: phone numbers, call transcripts

ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS voice_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS vapi_assistant_id TEXT,
  ADD COLUMN IF NOT EXISTS vapi_phone_number_id TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT;

CREATE TABLE IF NOT EXISTS calls (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  vapi_call_id    TEXT,
  caller_number   TEXT,
  duration_seconds INTEGER,
  transcript      TEXT,
  summary         TEXT,
  ended_reason    TEXT,
  leads_captured  INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calls_agent_id_idx ON calls(agent_id);
CREATE INDEX IF NOT EXISTS agents_vapi_assistant_id_idx ON agents(vapi_assistant_id) WHERE vapi_assistant_id IS NOT NULL;
