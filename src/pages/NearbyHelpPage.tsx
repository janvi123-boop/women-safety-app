import { useState } from 'react';
import { HelpCircle, Phone, MapPin, Navigation, Shield, HeartPulse, Siren } from 'lucide-react';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { EmptyState } from '@/components/ui/EmptyState';
import { classNames } from '@/lib/utils';

type PlaceType = 'police' | 'hospital' | 'emergency';
type Place = {
  id: string;
  name: string;
  type: PlaceType;
  distance: string;
  address: string;
  phone: string;
};

const PLACES: Place[] = [
  { id: '1', name: 'Central Police Station', type: 'police', distance: '0.4 mi', address: '123 Main St, Downtown', phone: '555-0100' },
  { id: '2', name: 'St. Mary General Hospital', type: 'hospital', distance: '0.7 mi', address: '456 Health Ave, Midtown', phone: '555-0200' },
  { id: '3', name: 'Riverside Police Precinct', type: 'police', distance: '1.2 mi', address: '789 River Rd, Eastside', phone: '555-0300' },
  { id: '4', name: 'City Emergency Services', type: 'emergency', distance: '0.9 mi', address: '100 Emergency Way', phone: '555-0400' },
  { id: '5', name: 'Westside Urgent Care', type: 'hospital', distance: '1.5 mi', address: '200 West Blvd', phone: '555-0500' },
  { id: '6', name: 'Fire & Rescue Station 12', type: 'emergency', distance: '1.8 mi', address: '300 Fire House Ln', phone: '555-0600' },
  { id: '7', name: 'North District Police', type: 'police', distance: '2.1 mi', address: '400 North St', phone: '555-0700' },
];

const FILTERS: { id: PlaceType | 'all'; label: string; icon: typeof Shield }[] = [
  { id: 'all', label: 'All', icon: HelpCircle },
  { id: 'police', label: 'Police', icon: Shield },
  { id: 'hospital', label: 'Hospitals', icon: HeartPulse },
  { id: 'emergency', label: 'Emergency', icon: Siren },
];

const typeConfig: Record<PlaceType, { icon: typeof Shield; color: string; bg: string }> = {
  police: { icon: Shield, color: 'text-primary-700', bg: 'bg-primary-50' },
  hospital: { icon: HeartPulse, color: 'text-emergency-700', bg: 'bg-emergency-50' },
  emergency: { icon: Siren, color: 'text-warning-700', bg: 'bg-warning-50' },
};

export function NearbyHelpPage() {
  const [filter, setFilter] = useState<PlaceType | 'all'>('all');

  const filtered = filter === 'all' ? PLACES : PLACES.filter((p) => p.type === filter);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
          <HelpCircle size={22} className="text-warning-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nearby Help</h2>
          <p className="text-sm text-gray-500">Police, hospitals & emergency services</p>
        </div>
      </div>

      <MapPlaceholder className="h-64 sm:h-72" showMarker={true} markerLabel="Your location" />

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={classNames(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                active ? 'bg-primary-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon size={16} />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<HelpCircle size={28} />}
          title="No nearby services found"
          description="Try changing the filter or check your location settings."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((place) => {
            const config = typeConfig[place.type];
            const Icon = config.icon;
            return (
              <div key={place.id} className="card p-4 animate-fade-in">
                <div className="flex items-start gap-3 mb-3">
                  <div className={classNames('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', config.bg)}>
                    <Icon size={22} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-primary-700">{place.distance} away</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 capitalize">{place.type}</span>
                    </div>
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{place.address}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <a href={`tel:${place.phone}`} className="btn btn-success flex-1 py-2.5 text-sm">
                    <Phone size={16} /> Call
                  </a>
                  <button className="btn btn-outline flex-1 py-2.5 text-sm">
                    <Navigation size={16} /> Directions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Nearby help data is simulated for demonstration. Real data requires a places API integration.
      </p>
    </div>
  );
}
