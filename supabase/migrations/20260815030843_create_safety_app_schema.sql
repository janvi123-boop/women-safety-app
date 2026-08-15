/*
# Women Safety App — Initial Schema

1. Purpose
A multi-user women's safety application. Each user manages their own emergency contacts,
incident reports, and personal settings. Data is scoped per authenticated user.

2. New Tables
- `emergency_contacts`: Stores a user's emergency contacts (name, phone, relationship, primary flag, SOS alert flag).
- `incidents`: Stores user-submitted safety incident reports (type, description, location, optional image path).
- `user_settings`: Per-user settings row (notification prefs, location sharing, privacy toggles).

3. Columns
`emergency_contacts`:
  - id (uuid PK)
  - user_id (uuid, owner, defaults to auth.uid())
  - name (text, not null)
  - phone (text, not null)
  - relationship (text, e.g. Mother, Father, Friend, Spouse, Sibling, Other)
  - is_primary (boolean, default false)
  - receives_sos (boolean, default true)
  - created_at (timestamptz)

`incidents`:
  - id (uuid PK)
  - user_id (uuid, owner, defaults to auth.uid())
  - incident_type (text: harassment, suspicious, unsafe_area, stalking, other)
  - description (text)
  - location_text (text)
  - latitude (double precision, nullable)
  - longitude (double precision, nullable)
  - image_path (text, nullable)
  - status (text, default 'submitted')
  - created_at (timestamptz)

`user_settings`:
  - id (uuid PK)
  - user_id (uuid, owner, defaults to auth.uid(), unique)
  - share_location (boolean, default false)
  - location_sharing_duration (integer, default 30, in minutes)
  - notify_contacts_on_sos (boolean, default true)
  - share_location_with_contacts (boolean, default true)
  - auto_call_emergency (boolean, default false)
  - created_at (timestamptz)
  - updated_at (timestamptz)

4. Security
- RLS enabled on all tables.
- Owner-scoped CRUD policies (auth.uid() = user_id) for all four verbs on each table.
- No public access — app requires sign-in.
*/

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  relationship text NOT NULL DEFAULT 'Other',
  is_primary boolean NOT NULL DEFAULT false,
  receives_sos boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "select_own_emergency_contacts" ON emergency_contacts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "insert_own_emergency_contacts" ON emergency_contacts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "update_own_emergency_contacts" ON emergency_contacts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_emergency_contacts" ON emergency_contacts;
CREATE POLICY "delete_own_emergency_contacts" ON emergency_contacts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Incidents
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  incident_type text NOT NULL DEFAULT 'other',
  description text,
  location_text text,
  latitude double precision,
  longitude double precision,
  image_path text,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_incidents" ON incidents;
CREATE POLICY "select_own_incidents" ON incidents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_incidents" ON incidents;
CREATE POLICY "insert_own_incidents" ON incidents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_incidents" ON incidents;
CREATE POLICY "update_own_incidents" ON incidents
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_incidents" ON incidents;
CREATE POLICY "delete_own_incidents" ON incidents
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  share_location boolean NOT NULL DEFAULT false,
  location_sharing_duration integer NOT NULL DEFAULT 30,
  notify_contacts_on_sos boolean NOT NULL DEFAULT true,
  share_location_with_contacts boolean NOT NULL DEFAULT true,
  auto_call_emergency boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user_settings" ON user_settings;
CREATE POLICY "select_own_user_settings" ON user_settings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_user_settings" ON user_settings;
CREATE POLICY "insert_own_user_settings" ON user_settings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_user_settings" ON user_settings;
CREATE POLICY "update_own_user_settings" ON user_settings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_user_settings" ON user_settings;
CREATE POLICY "delete_own_user_settings" ON user_settings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- updated_at trigger for user_settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON user_settings;
CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();