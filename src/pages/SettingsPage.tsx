import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Users,
  MapPin,
  Bell,
  Lock,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Globe,
  Phone,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useUserSettings } from '@/lib/useUserSettings';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { classNames } from '@/lib/utils';
import { type PageId } from '@/components/Navigation';

type SettingsPageProps = {
  onNavigate: (page: PageId) => void;
};

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, signOut } = useAuth();
  const { settings, loading, updateSettings } = useUserSettings();
  const { push } = useToast();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const fullName = (user?.user_metadata?.full_name as string) || 'User';
  const email = user?.email || '';
  const phone = (user?.user_metadata?.phone as string) || '';
  const initials = fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    setLogoutOpen(false);
  };

  const toggleSetting = async (key: keyof typeof settings, value: boolean) => {
    await updateSettings({ [key]: value });
    push('success', 'Setting updated.');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} className="text-primary-600" />
      </div>
    );
  }

  const sections: { title: string; items: { icon: typeof User; label: string; desc?: string; action?: () => void; toggle?: boolean; toggleValue?: boolean; danger?: boolean }[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', desc: 'Name, email, phone', action: () => {} },
        { icon: Users, label: 'Emergency Contacts', desc: `${'Manage contacts'}`, action: () => onNavigate('contacts') },
      ],
    },
    {
      title: 'Location & Privacy',
      items: [
        { icon: MapPin, label: 'Location permissions', desc: 'Required for live sharing', action: () => {} },
        { icon: Share2, label: 'Share live location', desc: 'Allow location sharing', toggle: true, toggleValue: settings?.share_location, action: () => toggleSetting('share_location', !settings?.share_location) },
        { icon: Globe, label: 'Sharing duration', desc: `${settings?.location_sharing_duration || 30} minutes`, action: () => {} },
      ],
    },
    {
      title: 'Notifications & Security',
      items: [
        { icon: Bell, label: 'Notification preferences', desc: 'SOS and safety alerts', action: () => {} },
        { icon: Shield, label: 'Notify contacts on SOS', desc: 'Auto-alert your contacts', toggle: true, toggleValue: settings?.notify_contacts_on_sos, action: () => toggleSetting('notify_contacts_on_sos', !settings?.notify_contacts_on_sos) },
        { icon: Phone, label: 'Auto-call emergency services', desc: 'Call 911 on SOS', toggle: true, toggleValue: settings?.auto_call_emergency, action: () => toggleSetting('auto_call_emergency', !settings?.auto_call_emergency) },
        { icon: Lock, label: 'Privacy settings', desc: 'Data and privacy', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact', action: () => setHelpOpen(true) },
        { icon: LogOut, label: 'Log out', action: () => setLogoutOpen(true), danger: true },
      ],
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 lg:pb-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <SettingsIcon size={22} className="text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{fullName}</p>
          <p className="text-sm text-gray-500 truncate">{email}</p>
          {phone && <p className="text-sm text-gray-500 truncate">{phone}</p>}
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100">
        <Lock size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary-800">Your privacy matters</p>
          <p className="text-xs text-primary-700 mt-0.5">
            Location sharing is only active when you explicitly enable it. Your data is never shared without your consent.
          </p>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 px-1">{section.title}</h3>
          <div className="card divide-y divide-gray-100">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className={classNames(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    item.danger ? 'bg-emergency-50' : 'bg-gray-50'
                  )}>
                    <Icon size={18} className={item.danger ? 'text-emergency-600' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={classNames('text-sm font-medium', item.danger ? 'text-emergency-700' : 'text-gray-900')}>
                      {item.label}
                    </p>
                    {item.desc && <p className="text-xs text-gray-500 truncate">{item.desc}</p>}
                  </div>
                  {item.toggle ? (
                    <div
                      className={classNames(
                        'relative rounded-full transition-colors flex-shrink-0',
                        item.toggleValue ? 'bg-primary-600' : 'bg-gray-300'
                      )}
                      style={{ height: 24, width: 44 }}
                    >
                      <span
                        className={classNames(
                          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                          item.toggleValue ? 'translate-x-6' : 'translate-x-0.5'
                        )}
                      />
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 text-center">SafeGuard v1.0 — Women's Safety App</p>

      {/* Logout modal */}
      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log Out" size="sm">
        <div>
          <p className="text-sm text-gray-600 mb-5">Are you sure you want to log out of your account?</p>
          <div className="flex gap-2">
            <button onClick={() => setLogoutOpen(false)} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button onClick={handleSignOut} className="btn btn-danger flex-1">
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>
      </Modal>

      {/* Help modal */}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help & Support">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emergency-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-emergency-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Emergency SOS</p>
              <p className="text-xs text-gray-500">Press and hold the SOS button for 3 seconds to alert your emergency contacts with your location.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Emergency Contacts</p>
              <p className="text-xs text-gray-500">Add trusted people who will be notified during emergencies. Toggle which contacts receive SOS alerts.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Live Location</p>
              <p className="text-xs text-gray-500">Share your real-time location with trusted contacts so they can find you during an emergency.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Fake Call</p>
              <p className="text-xs text-gray-500">Simulate an incoming call to safely exit uncomfortable situations.</p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              For urgent emergencies, always call your local emergency number (e.g., 911). This app is a supplementary safety tool and does not replace professional emergency services.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
