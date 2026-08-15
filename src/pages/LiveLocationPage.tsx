import { useEffect, useState } from 'react';
import { MapPin, Play, Square, Users, Navigation, AlertTriangle, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type EmergencyContact } from '@/lib/supabase';
import { MapPlaceholder, LocationAccuracy } from '@/components/ui/MapPlaceholder';
import { Banner } from '@/components/ui/Banner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatDuration } from '@/lib/utils';

export function LiveLocationPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [sharing, setSharing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .eq('receives_sos', true)
      .then(({ data }) => {
        if (data) setContacts(data as EmergencyContact[]);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!sharing) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [sharing]);

  useEffect(() => {
    if (!sharing) return;
    if (!('geolocation' in navigator)) {
      setPermissionDenied(true);
      setSharing(false);
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAccuracy(Math.round(pos.coords.accuracy));
        setPermissionDenied(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setPermissionDenied(true);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [sharing]);

  const startSharing = () => {
    setElapsed(0);
    setSharing(true);
    push('info', 'Live location sharing started.');
  };

  const stopSharing = () => {
    setSharing(false);
    setElapsed(0);
    push('success', 'Live location sharing stopped.');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
          <MapPin size={22} className="text-success-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Live Location</h2>
          <p className="text-sm text-gray-500">Share your real-time location</p>
        </div>
      </div>

      {/* Permission denied */}
      {permissionDenied && (
        <Banner type="error">
          Location access is required to share your live location. Please enable location permissions in your browser settings to use this feature.
        </Banner>
      )}

      {/* Status banner */}
      {sharing ? (
        <Banner type="success">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success-600 animate-pulse" />
            Live location sharing is active. {formatDuration(elapsed)}
          </div>
        </Banner>
      ) : !permissionDenied && (
        <Banner type="info">
          Your location is not currently being shared. Start sharing to let your emergency contacts know where you are.
        </Banner>
      )}

      {/* Map */}
      <MapPlaceholder className="h-72 sm:h-80" showMarker={sharing} markerLabel={sharing && coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : undefined} />

      {/* Location details */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Current Location</p>
            <p className="text-xs text-gray-500">
              {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Not available'}
            </p>
          </div>
          {sharing && <LocationAccuracy accuracyMeters={accuracy} />}
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Navigation size={18} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Sharing Status</p>
            <p className="text-sm font-semibold text-gray-900">
              {sharing ? `Active for ${formatDuration(elapsed)}` : 'Not sharing'}
            </p>
          </div>
        </div>
      </div>

      {/* Contacts receiving location */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-primary-600" />
          <h3 className="text-sm font-bold text-gray-900">Receiving Your Location</h3>
        </div>
        {contacts.length === 0 ? (
          <EmptyState
            icon={<Users size={24} />}
            title="No contacts selected"
            description="Add emergency contacts with SOS alerts enabled to share your location with them."
            className="py-6"
          />
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.relationship}</p>
                </div>
                {sharing && (
                  <span className="badge bg-success-100 text-success-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-600 animate-pulse" />
                    Receiving
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!sharing ? (
          <button onClick={startSharing} className="btn btn-success btn-lg flex-1">
            <Play size={20} /> Start Sharing
          </button>
        ) : (
          <button onClick={stopSharing} className="btn btn-danger btn-lg flex-1">
            <Square size={20} /> Stop Sharing
          </button>
        )}
        <button
          onClick={() => push('info', 'Location link copied to clipboard.')}
          className="btn btn-outline btn-lg"
          aria-label="Share location link"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Safety status indicator */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
        <div className={`w-3 h-3 rounded-full ${sharing ? 'bg-success-500 animate-pulse' : 'bg-gray-300'}`} />
        <p className="text-sm font-medium text-gray-700">
          {sharing ? 'Your trusted contacts can see your live location.' : 'Location sharing is off.'}
        </p>
      </div>
    </div>
  );
}
