import { useEffect, useState } from 'react';
import { supabase, type UserSettings, DEFAULT_SETTINGS } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (!active) return;
      if (error) {
        setLoading(false);
        return;
      }
      if (data) {
        setSettings(data as UserSettings);
      } else {
        const { data: inserted } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id, ...DEFAULT_SETTINGS })
          .select('*')
          .maybeSingle();
        if (inserted) setSettings(inserted as UserSettings);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const updateSettings = async (patch: Partial<UserSettings>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_settings')
      .update(patch)
      .eq('user_id', user.id)
      .select('*')
      .maybeSingle();
    if (!error && data) setSettings(data as UserSettings);
  };

  return { settings, loading, updateSettings };
}
