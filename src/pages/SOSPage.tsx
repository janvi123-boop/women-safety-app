import { useEffect, useState } from 'react';
import { Shield, Phone, MapPin, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type EmergencyContact } from '@/lib/supabase';
import { SOSButton, SOSActivePanel } from '@/components/SOSButton';
import { Banner } from '@/components/ui/Banner';

export function SOSPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [sosActive, setSosActive] = useState(false);
  const [locationText, setLocationText] = useState('Locating...');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('receives_sos', true)
      .then(({ data }) => {
        if (data) setContacts(data as EmergencyContact[]);
      });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setLocationText('Location unavailable'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [user]);

  if (sosActive) {
    return (
      <div className="px-4 py-8 sm:py-12 max-w-2xl mx-auto pb-24 lg:pb-8">
        <SOSActivePanel
          locationText={locationText}
          contactsNotified={contacts.length}
          onEnd={() => setSosActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emergency-50 flex items-center justify-center">
          <Shield size={22} className="text-emergency-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Emergency SOS</h2>
          <p className="text-sm text-gray-500">Trigger emergency assistance</p>
        </div>
      </div>

      {contacts.length === 0 && (
        <Banner type="warning">
          You have no emergency contacts set up to receive SOS alerts. Add contacts in the Emergency Contacts page.
        </Banner>
      )}

      <div className="card p-8 sm:p-10 flex flex-col items-center">
        <SOSButton onActivate={() => setSosActive(true)} />
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-emergency-600" />
          <h3 className="text-sm font-bold text-gray-900">What happens when you activate SOS?</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={14} className="text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">Your live location is shared with your emergency contacts.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Users size={14} className="text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">
              {contacts.length > 0
                ? `${contacts.length} emergency contact${contacts.length !== 1 ? 's' : ''} will be notified immediately.`
                : 'Your emergency contacts will be notified immediately (add contacts first).'}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Phone size={14} className="text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">You can call emergency services directly from the SOS screen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
