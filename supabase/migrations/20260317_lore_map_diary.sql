-- ============================================================
-- MIGRATION: Lore, Map pins, Character Notes
-- Esegui questo file nel SQL Editor di Supabase
-- ============================================================

-- 1. LORE ENTRIES
CREATE TABLE IF NOT EXISTS lore_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'altro'
                CHECK (category IN ('storia','luogo','cultura','fazione','divinita','altro')),
  content     TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  is_public   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE lore_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public lore visible to all"
  ON lore_entries FOR SELECT
  USING (is_public = true);

CREATE POLICY "DM manages lore"
  ON lore_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- 2. MAP PINS
CREATE TABLE IF NOT EXISTS map_pins (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  map_x       FLOAT NOT NULL,   -- percentuale X sull'immagine (0-100)
  map_y       FLOAT NOT NULL,   -- percentuale Y sull'immagine (0-100)
  category    TEXT DEFAULT 'città'
                CHECK (category IN ('città','regione','dungeon','punto_interesse','segreto')),
  is_visible  BOOLEAN NOT NULL DEFAULT true,
  lore_entry_id UUID REFERENCES lore_entries(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE map_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible pins to all"
  ON map_pins FOR SELECT
  USING (is_visible = true);

CREATE POLICY "DM manages map pins"
  ON map_pins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- 3. CHARACTER NOTES (diario privato giocatore)
CREATE TABLE IF NOT EXISTS character_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Nuova voce',
  content     TEXT NOT NULL DEFAULT '',
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE character_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players see own diary"
  ON character_notes FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "DM sees all diary entries"
  ON character_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
