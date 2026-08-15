import { useEffect, useState } from 'react';
import { Shield, Users, MapPin, HelpCircle, Route, PhoneCall, FileWarning, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type EmergencyContact } from '@/lib/supabase';
import { SOSButton, SOSActivePanel } from '@/components/SOSButton';
import { Banner } from '@/components/ui/Banner';
import { EmptyState } from '@/components/ui/EmptyState';
import { type PageId } from '@/components/Navigation';
import { classNames } from '@/lib/utils';

type DashboardProps = {
  onNavigate: (page: PageId) => void;
};

export function DashboardPage({ onNavigate }: DashboardProps) {
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
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setContacts(data as EmergencyContact[]);
      });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => setLocationText('Location unavailable'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationText('Geolocation not supported');
    }
  }, [user]);

  const sosContacts = contacts.filter((c) => c.receives_sos);
  const fullName = (user?.user_metadata?.full_name as string) || 'there';

  const quickActions: { id: PageId; label: string; icon: typeof Shield; color: string }[] = [
    { id: 'location', label: 'Share Location', icon: MapPin, color: 'bg-success-50 text-success-700' },
    { id: 'nearby', label: 'Nearby Help', icon: HelpCircle, color: 'bg-warning-50 text-warning-700' },
    { id: 'fakecall', label: 'Fake Call', icon: PhoneCall, color: 'bg-primary-50 text-primary-700' },
    { id: 'report', label: 'Report Incident', icon: FileWarning, color: 'bg-emergency-50 text-emergency-700' },
    { id: 'route', label: 'Safe Route', icon: Route, color: 'bg-primary-50 text-primary-700' },
    { id: 'contacts', label: 'Contacts', icon: Users, color: 'bg-primary-50 text-primary-700' },
  ];

  if (sosActive) {
    return (
      <div className="px-4 py-8 sm:py-12">
        <SOSActivePanel
          locationText={locationText}
          contactsNotified={sosContacts.length}
          onEnd={() => setSosActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto pb-24 lg:pb-8 space-y-6">
      {/* Safety status */}
      <div className="card p-4 flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={26} className="text-success-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-base">You're Safe</p>
          <p className="text-sm text-gray-500">No active emergencies. Stay aware of your surroundings.</p>
        </div>
      </div>

      {/* No contacts warning */}
      {contacts.length === 0 && (
        <Banner type="warning" onClose={() => {}}>
          You haven't added any emergency contacts yet.{' '}
          <button onClick={() => onNavigate('contacts')} className="font-bold underline ml-1">Add one now</button>
        </Banner>
      )}

      {/* SOS Section */}
      <div className="card p-8 sm:p-10 flex flex-col items-center animate-slide-up">
        <SOSButton onActivate={() => setSosActive(true)} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('contacts')}
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            <p className="text-xs text-gray-500">Emergency Contacts</p>
          </div>
        </button>
        <button
          onClick={() => onNavigate('location')}
          className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-success-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Location</p>
            <p className="text-xs text-gray-500 truncate">{locationText}</p>
          </div>
        </button>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Quick Actions</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="card p-3 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
              >
                <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center', action.color)}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary contact card */}
      {contacts.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Primary Emergency Contact</h3>
          {contacts.find((c) => c.is_primary) ? (
            <div className="card p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center flex-shrink-0">
                {contacts.find((c) => c.is_primary)!.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{contacts.find((c) => c.is_primary)!.name}</p>
                <p className="text-sm text-gray-500">{contacts.find((c) => c.is_primary)!.relationship}</p>
              </div>
              <a
                href={`tel:${contacts.find((c) => c.is_primary)!.phone}`}
                className="btn btn-success px-4 py-2 text-sm"
              >
                <PhoneCall size={16} /> Call
              </a>
            </div>
          ) : (
            <button onClick={() => onNavigate('contacts')} className="card p-4 w-full flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Plus size={22} className="text-gray-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700 text-sm">Set a primary contact</p>
                <p className="text-xs text-gray-500">Your primary contact is called first during SOS</p>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
