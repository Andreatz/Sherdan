/*
  # Player Character Private Access

  Adds owner_email and owner_user_id to characters table so each player
  can only read their own character. Admin can read/write all.

  Changes:
  - Add is_player_character, owner_email, owner_user_id, private_notes, sigillo columns
  - Drop old public-read policy and replace with owner-or-admin policy
  - Add function + trigger to auto-link owner_user_id from owner_email at login
*/

-- 1. Add new columns
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS is_player_character boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS owner_email text,
  ADD COLUMN IF NOT EXISTS owner_user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS private_notes text,
  ADD COLUMN IF NOT EXISTS sigillo text;

-- 2. Drop old open-read policy
DROP POLICY IF EXISTS "Characters are publicly readable" ON characters;

-- 3. New SELECT policy: public for NPC, owner or admin for PG
CREATE POLICY "characters_select_policy"
  ON characters FOR SELECT
  USING (
    -- NPC o personaggi non-PG: visibili a tutti
    is_player_character = false
    OR
    -- Admin vede tutto
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
    OR
    -- Proprietario vede il proprio PG
    owner_user_id = auth.uid()
  );

-- 4. Function: when a user logs in, link their uid to characters matching owner_email
CREATE OR REPLACE FUNCTION public.link_character_owner()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  UPDATE characters
  SET owner_user_id = v_uid
  WHERE owner_email = lower(v_email)
    AND owner_user_id IS NULL;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.link_character_owner() TO authenticated;
