import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type EmergencyContact = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  receives_sos: boolean;
  created_at: string;
};

export type IncidentType = 'harassment' | 'suspicious' | 'unsafe_area' | 'stalking' | 'other';

export type Incident = {
  id: string;
  user_id: string;
  incident_type: IncidentType;
  description: string | null;
  location_text: string | null;
  latitude: number | null;
  longitude: number | null;
  image_path: string | null;
  status: string;
  created_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  share_location: boolean;
  location_sharing_duration: number;
  notify_contacts_on_sos: boolean;
  share_location_with_contacts: boolean;
  auto_call_emergency: boolean;
  created_at: string;
  updated_at: string;
};

export const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  share_location: false,
  location_sharing_duration: 30,
  notify_contacts_on_sos: true,
  share_location_with_contacts: true,
  auto_call_emergency: false,
};
