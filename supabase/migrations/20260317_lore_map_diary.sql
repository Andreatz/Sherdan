-- ============================================================
-- LORE ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS lore_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'altro',
  content     TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  location_id TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE lore_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public lore visible to all"
  ON lore_entries FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users see all lore"
  ON lore_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only DM can manage lore"
  ON lore_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- CHARACTER NOTES (Diario del Personaggio)
-- ============================================================
CREATE TABLE IF NOT EXISTS character_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name  TEXT NOT NULL DEFAULT '',
  title           TEXT NOT NULL,
  content         TEXT NOT NULL DEFAULT '',
  pinned          BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE character_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players see own character notes"
  ON character_notes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "DM sees all character notes"
  ON character_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
