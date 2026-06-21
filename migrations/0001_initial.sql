-- Let Football Flow — initial schema

CREATE TABLE IF NOT EXISTS polls (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active',
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS votes (
  id           TEXT PRIMARY KEY,
  poll_id      TEXT NOT NULL,
  choice       TEXT NOT NULL CHECK (choice IN ('flow', 'breaks', 'depends')),
  country_code TEXT,
  handle       TEXT,
  voter_hash   TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(id),
  -- One anonymous voter token may only vote once per poll.
  UNIQUE (poll_id, voter_hash)
);

-- Speeds up results aggregation by poll/choice and country leaderboards.
CREATE INDEX IF NOT EXISTS idx_votes_poll_choice ON votes (poll_id, choice);
CREATE INDEX IF NOT EXISTS idx_votes_poll_country ON votes (poll_id, country_code);

-- Seed the global poll.
INSERT INTO polls (id, slug, title, description, status)
VALUES (
  'global-2026',
  'global',
  'Should every match have mandatory hydration breaks?',
  'Hydrate the players. Don''t dam the game.',
  'active'
)
ON CONFLICT (slug) DO NOTHING;
