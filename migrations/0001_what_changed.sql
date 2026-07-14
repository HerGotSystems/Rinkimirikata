-- WHAT CHANGED? aggregate-only storage.
-- No visitor, session, IP, user-agent, timestamp, or per-crossing response row is stored.

CREATE TABLE IF NOT EXISTS what_changed_meta (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0 CHECK (value >= 0)
);

CREATE TABLE IF NOT EXISTS what_changed_situation_stats (
  situation_id TEXT PRIMARY KEY CHECK (situation_id IN ('healthcare', 'shelter', 'work', 'care', 'forgiveness')),
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  steady INTEGER NOT NULL DEFAULT 0 CHECK (steady >= 0),
  moved INTEGER NOT NULL DEFAULT 0 CHECK (moved >= 0),
  condition_moved INTEGER NOT NULL DEFAULT 0 CHECK (condition_moved >= 0),
  first_yes INTEGER NOT NULL DEFAULT 0 CHECK (first_yes >= 0),
  first_no INTEGER NOT NULL DEFAULT 0 CHECK (first_no >= 0),
  first_depends INTEGER NOT NULL DEFAULT 0 CHECK (first_depends >= 0),
  second_yes INTEGER NOT NULL DEFAULT 0 CHECK (second_yes >= 0),
  second_no INTEGER NOT NULL DEFAULT 0 CHECK (second_no >= 0),
  second_depends INTEGER NOT NULL DEFAULT 0 CHECK (second_depends >= 0)
);

CREATE TABLE IF NOT EXISTS what_changed_reason_stats (
  situation_id TEXT NOT NULL CHECK (situation_id IN ('healthcare', 'shelter', 'work', 'care', 'forgiveness')),
  pass TEXT NOT NULL CHECK (pass IN ('first', 'second')),
  reason_id TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  PRIMARY KEY (situation_id, pass, reason_id)
);

-- Seed the total counter so GET has a real zero value before crossing #1.
INSERT INTO what_changed_meta (key, value)
VALUES ('total_crossings', 0)
ON CONFLICT(key) DO NOTHING;

-- Seed one row per situation so GET returns a stable five-row baseline
-- before the first POST and all later writes can use ON CONFLICT upserts.
INSERT INTO what_changed_situation_stats (situation_id) VALUES
  ('healthcare'),
  ('shelter'),
  ('work'),
  ('care'),
  ('forgiveness')
ON CONFLICT(situation_id) DO NOTHING;
