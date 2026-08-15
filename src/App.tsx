import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider } from '@/components/ui/Toast';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { OnboardingPage } from '@/pages/auth/OnboardingPage';
import { Sidebar, BottomNav, type PageId } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { DashboardPage } from '@/pages/DashboardPage';
import { SOSPage } from '@/pages/SOSPage';
import { EmergencyContactsPage } from '@/pages/EmergencyContactsPage';
import { LiveLocationPage } from '@/pages/LiveLocationPage';
import { NearbyHelpPage } from '@/pages/NearbyHelpPage';
import { SafeRoutePage } from '@/pages/SafeRoutePage';
import { FakeCallPage } from '@/pages/FakeCallPage';
import { ReportIncidentPage } from '@/pages/ReportIncidentPage';
import { SettingsPage } from '@/pages/SettingsPage';

const ONBOARDED_KEY = 'safeguard_onboarded';

function AppContent() {
  const { session, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem(ONBOARDED_KEY) === 'true');
  const [page, setPage] = useState<PageId>('dashboard');

  useEffect(() => {
    if (!session) {
      setOnboarded(localStorage.getItem(ONBOARDED_KEY) === 'true');
    }
  }, [session]);

  if (loading) return <FullPageSpinner label="Loading SafeGuard..." />;

  if (!session) {
    if (authView === 'signup') {
      return (
        <SignUpPage
          onSwitchToLogin={() => setAuthView('login')}
          onComplete={() => {
            localStorage.setItem(ONBOARDED_KEY, 'true');
            setOnboarded(true);
          }}
        />
      );
    }
    return <LoginPage onSwitchToSignUp={() => setAuthView('signup')} />;
  }

  if (!onboarded) {
    return (
      <OnboardingPage
        onComplete={() => {
          localStorage.setItem(ONBOARDED_KEY, 'true');
          setOnboarded(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar current={page} onNavigate={setPage} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header current={page} onNavigate={setPage} />
        <main className="flex-1">
          {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
          {page === 'sos' && <SOSPage />}
          {page === 'contacts' && <EmergencyContactsPage />}
          {page === 'location' && <LiveLocationPage />}
          {page === 'nearby' && <NearbyHelpPage />}
          {page === 'route' && <SafeRoutePage />}
          {page === 'fakecall' && <FakeCallPage />}
          {page === 'report' && <ReportIncidentPage />}
          {page === 'settings' && <SettingsPage onNavigate={setPage} />}
        </main>
      </div>
      <BottomNav current={page} onNavigate={setPage} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
