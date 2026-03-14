/*
  # Create D&D Pirate Campaign Database Schema

  1. New Tables
    - `profiles` - Store user profiles and admin status
    - `characters` - Player character profiles with backstories and stats
    - `session_logs` - Adventure session records with narratives
    - `world_locations` - Interactive map locations with coordinates
    - `gallery_items` - Campaign screenshots and artwork
    - `campaign_settings` - Global campaign configuration and lore

  2. Security
    - Enable RLS on all tables
    - Public read access to campaign content
    - Authenticated admin write access
    - Users can only modify their own profile data
    
  3. Features
    - Automatic timestamp management
    - Foreign key relationships
    - Support for rich media and coordinates
*/

-- Create profiles table for admin user management
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class text NOT NULL,
  race text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  backstory text NOT NULL,
  portrait_url text,
  stats_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Characters are publicly readable"
  ON characters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage characters"
  ON characters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update characters"
  ON characters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete characters"
  ON characters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create session_logs table
CREATE TABLE IF NOT EXISTS session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  date date NOT NULL,
  summary text NOT NULL,
  detailed_narrative text NOT NULL,
  featured_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session logs are publicly readable"
  ON session_logs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage session logs"
  ON session_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update session logs"
  ON session_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete session logs"
  ON session_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create world_locations table
CREATE TABLE IF NOT EXISTS world_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location_type text NOT NULL CHECK (location_type IN ('port', 'island', 'territory', 'landmark')),
  x_coordinate numeric NOT NULL,
  y_coordinate numeric NOT NULL,
  control_status text DEFAULT 'neutral' CHECK (control_status IN ('neutral', 'player_controlled', 'enemy_controlled', 'allied')),
  history text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE world_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are publicly readable"
  ON world_locations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage locations"
  ON world_locations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update locations"
  ON world_locations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete locations"
  ON world_locations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL,
  description text,
  session_id uuid REFERENCES session_logs ON DELETE SET NULL,
  category text DEFAULT 'general',
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery items are publicly readable"
  ON gallery_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update gallery"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete gallery"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Create campaign_settings table for global configuration
CREATE TABLE IF NOT EXISTS campaign_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_title text NOT NULL DEFAULT 'Pirate Campaign',
  campaign_tagline text DEFAULT 'High seas adventure awaits',
  world_lore text DEFAULT '',
  main_story_arc text DEFAULT '',
  house_rules text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign settings are publicly readable"
  ON campaign_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage campaign settings"
  ON campaign_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Insert default campaign settings
INSERT INTO campaign_settings (campaign_title, campaign_tagline)
VALUES ('Pirate Campaign', 'High seas adventure awaits')
ON CONFLICT DO NOTHING;
