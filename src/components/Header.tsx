import { Bell, Settings as SettingsIcon, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { type PageId, NAV_ITEMS } from '@/components/Navigation';

export function Header({ current, onNavigate }: { current: PageId; onNavigate: (id: PageId) => void }) {
  const { user } = useAuth();
  const navItem = NAV_ITEMS.find((n) => n.id === current);
  const fullName = (user?.user_metadata?.full_name as string) || 'User';
  const initials = fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="lg:hidden w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{navItem?.label}</h2>
            <p className="text-xs text-gray-500 hidden sm:block">SafeGuard Women's Safety</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onNavigate('settings')}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emergency-500" />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm flex items-center justify-center hover:bg-primary-200 transition-colors"
            aria-label="Profile"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}
