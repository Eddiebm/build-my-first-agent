-- Add publishing and usage tracking to agents
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS published     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS message_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS agents_published_idx ON agents(published);
