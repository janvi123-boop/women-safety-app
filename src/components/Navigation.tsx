import {
  LayoutDashboard,
  Shield,
  Users,
  MapPin,
  HelpCircle,
  Route,
  PhoneCall,
  FileWarning,
  Settings,
} from 'lucide-react';
import { classNames } from '@/lib/utils';

export type PageId =
  | 'dashboard'
  | 'sos'
  | 'contacts'
  | 'location'
  | 'nearby'
  | 'route'
  | 'fakecall'
  | 'report'
  | 'settings';

export const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sos', label: 'SOS', icon: Shield },
  { id: 'contacts', label: 'Emergency Contacts', icon: Users },
  { id: 'location', label: 'Live Location', icon: MapPin },
  { id: 'nearby', label: 'Nearby Help', icon: HelpCircle },
  { id: 'route', label: 'Safe Route', icon: Route },
  { id: 'fakecall', label: 'Fake Call', icon: PhoneCall },
  { id: 'report', label: 'Report Incident', icon: FileWarning },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BOTTOM_NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'sos', label: 'SOS', icon: Shield },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ current, onNavigate }: { current: PageId; onNavigate: (id: PageId) => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center shadow-sm">
          <Shield size={22} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-base leading-tight">SafeGuard</h1>
          <p className="text-xs text-gray-500">Women's Safety</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          const isSOS = item.id === 'sos';
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={classNames(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? isSOS
                    ? 'bg-emergency-600 text-white shadow-sm'
                    : 'bg-primary-50 text-primary-800'
                  : 'text-gray-600 hover:bg-gray-50',
                isSOS && !active && 'text-emergency-700'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function BottomNav({ current, onNavigate }: { current: PageId; onNavigate: (id: PageId) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-stretch justify-around px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          const isSOS = item.id === 'sos';
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={classNames(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg flex-1 transition-colors',
                isSOS && '-mt-4'
              )}
            >
              {isSOS ? (
                <div
                  className={classNames(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all',
                    active ? 'bg-emergency-700 ring-4 ring-emergency-100' : 'bg-emergency-600'
                  )}
                >
                  <Icon size={22} className="text-white" />
                </div>
              ) : (
                <Icon
                  size={22}
                  className={classNames('transition-colors', active ? 'text-primary-700' : 'text-gray-400')}
                />
              )}
              <span
                className={classNames(
                  'text-[10px] font-medium transition-colors',
                  isSOS && 'mt-0.5',
                  active ? (isSOS ? 'text-emergency-700' : 'text-primary-700') : 'text-gray-500'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
