ALTER TABLE users
  ADD COLUMN IF NOT EXISTS reset_token TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_token TEXT;

CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users(reset_token) WHERE reset_token IS NOT NULL;
