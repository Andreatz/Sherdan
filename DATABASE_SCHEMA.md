# Database Schema Documentation

## Overview

The application uses Supabase (PostgreSQL) for all data persistence. All tables have Row Level Security (RLS) enabled with appropriate access policies.

## Tables

### profiles
Stores user account information and admin status.

```
id (uuid) - Primary key, references auth.users
email (text) - User email, unique
is_admin (boolean) - Admin flag for access control
created_at (timestamp)
updated_at (timestamp)
```

**RLS Policies:**
- SELECT: All authenticated users can view profiles
- UPDATE: Users can only update their own profile (except is_admin flag)
- UPDATE (Admin only): Admins can update any profile including admin status

---

### characters
Player character profiles with complete information.

```
id (uuid) - Primary key, auto-generated
name (text) - Character name
class (text) - D&D class (Fighter, Rogue, Wizard, etc.)
race (text) - Character race
level (integer) - Current level (1-20)
backstory (text) - Character backstory and description
portrait_url (text) - URL to character portrait image
stats_json (jsonb) - Optional JSON for storing ability scores and other stats
created_at (timestamp)
updated_at (timestamp)
```

**RLS Policies:**
- SELECT: Public read access
- INSERT/UPDATE/DELETE: Admin only

---

### session_logs
Adventure session records with narratives and details.

```
id (uuid) - Primary key, auto-generated
session_number (integer) - Session number, unique
title (text) - Session title
date (date) - Session date
summary (text) - Brief session summary
detailed_narrative (text) - Full session narrative
featured_image_url (text) - URL to featured image
created_at (timestamp)
updated_at (timestamp)
```

**RLS Policies:**
- SELECT: Public read access
- INSERT/UPDATE/DELETE: Admin only

---

### world_locations
Points of interest on the world map.

```
id (uuid) - Primary key, auto-generated
name (text) - Location name
description (text) - Location description
location_type (text) - Type: port, island, territory, landmark
x_coordinate (numeric) - X position (0-100)
y_coordinate (numeric) - Y position (0-100)
control_status (text) - Status: neutral, player_controlled, enemy_controlled, allied
history (text) - Optional location history
created_at (timestamp)
updated_at (timestamp)
```

**Constraints:**
- location_type must be one of: 'port', 'island', 'territory', 'landmark'
- control_status must be one of: 'neutral', 'player_controlled', 'enemy_controlled', 'allied'

**RLS Policies:**
- SELECT: Public read access
- INSERT/UPDATE/DELETE: Admin only

---

### gallery_items
Campaign screenshots, artwork, and media.

```
id (uuid) - Primary key, auto-generated
image_url (text) - URL to image
title (text) - Image title
description (text) - Image description
session_id (uuid) - Optional foreign key to session_logs
category (text) - Image category (general, character, location, etc.)
upload_date (timestamp) - When image was uploaded
created_at (timestamp)
```

**RLS Policies:**
- SELECT: Public read access
- INSERT/UPDATE/DELETE: Admin only

---

### campaign_settings
Global campaign configuration and lore.

```
id (uuid) - Primary key, auto-generated
campaign_title (text) - Main campaign title
campaign_tagline (text) - Campaign tagline/subtitle
world_lore (text) - World lore and history
main_story_arc (text) - Main narrative arc
house_rules (text) - Special D&D rules
created_at (timestamp)
updated_at (timestamp)
```

**RLS Policies:**
- SELECT: Public read access
- UPDATE: Admin only

---

## Relationships

```
gallery_items.session_id → session_logs.id
  - ON DELETE SET NULL
  - Many gallery items can belong to one session
  - If session is deleted, gallery items remain (but session_id becomes null)
```

---

## Indexes

Recommended indexes for performance:

```sql
-- Characters
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);

-- Session Logs
CREATE INDEX idx_session_logs_number ON session_logs(session_number);
CREATE INDEX idx_session_logs_date ON session_logs(date DESC);

-- Locations
CREATE INDEX idx_locations_name ON world_locations(name);
CREATE INDEX idx_locations_coordinates ON world_locations(x_coordinate, y_coordinate);

-- Gallery
CREATE INDEX idx_gallery_upload_date ON gallery_items(upload_date DESC);
CREATE INDEX idx_gallery_session ON gallery_items(session_id);
CREATE INDEX idx_gallery_category ON gallery_items(category);
```

---

## Query Examples

### Get all characters
```sql
SELECT * FROM characters ORDER BY created_at DESC;
```

### Get sessions with guest count
```sql
SELECT
  session_logs.*,
  COUNT(DISTINCT gallery_items.id) as media_count
FROM session_logs
LEFT JOIN gallery_items ON gallery_items.session_id = session_logs.id
GROUP BY session_logs.id
ORDER BY session_logs.session_number DESC;
```

### Get locations by control status
```sql
SELECT * FROM world_locations
WHERE control_status = 'player_controlled'
ORDER BY name;
```

### Get campaign stats
```sql
SELECT
  (SELECT COUNT(*) FROM characters) as character_count,
  (SELECT COUNT(*) FROM session_logs) as session_count,
  (SELECT COUNT(*) FROM world_locations) as location_count,
  (SELECT COUNT(*) FROM gallery_items) as gallery_count;
```

---

## Data Types

- **uuid**: Universally unique identifier
- **text**: Text strings (unlimited length)
- **date**: Date only (YYYY-MM-DD)
- **timestamp/timestamptz**: Date and time with timezone
- **numeric**: Decimal numbers (for coordinates)
- **integer**: Whole numbers
- **boolean**: True/false
- **jsonb**: JSON binary format (for flexible data)

---

## Row Level Security (RLS) Implementation

All tables implement RLS with the following principle:
- **Public data**: Readable by everyone (public and authenticated users)
- **Admin data**: Only admins can insert, update, or delete

**Admin Check Function:**
```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.is_admin = true
)
```

This checks if the current authenticated user has `is_admin = true` in their profile.

---

## Backup & Recovery

Regular backups are handled by Supabase automatically. To manually backup:

1. Go to Supabase Dashboard
2. Project Settings → Backups
3. Download backup as needed

To restore:
1. Contact Supabase support for restoration
2. Or use pg_dump/pg_restore for manual backups

---

## Performance Considerations

1. **Coordinates**: Using 0-100 range keeps numbers manageable
2. **JSONB**: Using jsonb for stats allows flexible schema
3. **Foreign Keys**: CASCADE delete on gallery_items for clean data
4. **Timestamps**: All tables have automatic timestamp tracking
5. **Indexes**: Add indexes on frequently queried columns for speed

---

## Future Enhancements

- Add `updated_by` field to track who modified data
- Add soft deletes with `deleted_at` timestamp
- Add `published` boolean for draft/published sessions
- Add `tags` array for better categorization
- Add `difficulty` rating to sessions
- Add location connections (sea routes between ports)
