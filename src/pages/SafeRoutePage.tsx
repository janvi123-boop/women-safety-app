import { useState } from 'react';
import { Route, MapPin, Navigation, Clock, Shield, AlertTriangle, ArrowRight, Plus, Minus } from 'lucide-react';
import { MapPlaceholder } from '@/components/ui/MapPlaceholder';
import { Banner } from '@/components/ui/Banner';
import { classNames } from '@/lib/utils';

type RouteOption = {
  id: string;
  name: string;
  distance: string;
  duration: string;
  safetyScore: 'high' | 'moderate' | 'low';
  isRecommended?: boolean;
};

const ROUTES: RouteOption[] = [
  { id: '1', name: 'Well-lit Main Route', distance: '1.8 mi', duration: '22 min', safetyScore: 'high', isRecommended: true },
  { id: '2', name: 'Riverside Path', distance: '1.5 mi', duration: '18 min', safetyScore: 'moderate' },
  { id: '3', name: 'Short Cut', distance: '1.2 mi', duration: '15 min', safetyScore: 'low' },
];

const safetyConfig = {
  high: { label: 'High Safety', color: 'text-success-700', bg: 'bg-success-100', dot: 'bg-success-500' },
  moderate: { label: 'Moderate Safety', color: 'text-warning-700', bg: 'bg-warning-100', dot: 'bg-warning-500' },
  low: { label: 'Low Safety', color: 'text-emergency-700', bg: 'bg-emergency-100', dot: 'bg-emergency-500' },
};

export function SafeRoutePage() {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!start.trim() || !destination.trim()) return;
    setHasSearched(true);
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Route size={22} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Safe Route</h2>
          <p className="text-sm text-gray-500">Plan a safer journey</p>
        </div>
      </div>

      {/* Search inputs */}
      <div className="card p-4 space-y-3">
        <div>
          <label className="label" htmlFor="start">Starting location</label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-success-500 border-2 border-white shadow-sm" />
            <input
              id="start"
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="input pl-10"
              placeholder="Enter starting point"
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="destination">Destination</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emergency-600" />
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input pl-10"
              placeholder="Enter destination"
            />
          </div>
        </div>
        <button onClick={handleSearch} disabled={!start.trim() || !destination.trim()} className="btn btn-primary btn-lg w-full">
          <Navigation size={20} /> Find Safe Routes
        </button>
      </div>

      {hasSearched && (
        <>
          {/* Map */}
          <MapPlaceholder className="h-64 sm:h-72" showMarker={false}>
            {/* Route line overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path
                d="M 10% 80% Q 30% 60% 45% 65% T 70% 40% T 90% 20%"
                stroke="#7c3aed"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8 4"
              />
            </svg>
            <div className="absolute top-[78%] left-[8%]">
              <div className="w-4 h-4 rounded-full bg-success-500 border-2 border-white shadow-md" />
            </div>
            <div className="absolute top-[18%] left-[88%] -translate-x-full">
              <div className="w-4 h-4 rounded-full bg-emergency-500 border-2 border-white shadow-md" />
            </div>
          </MapPlaceholder>

          {/* Disclaimer */}
          <Banner type="warning">
            Route safety information depends on available data and should not be treated as a guarantee of safety. Always stay aware of your surroundings.
          </Banner>

          {/* Route options */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 px-1">Route Options</h3>
            {ROUTES.map((route) => {
              const safety = safetyConfig[route.safetyScore];
              return (
                <div
                  key={route.id}
                  className={classNames(
                    'card p-4 animate-fade-in',
                    route.isRecommended && 'ring-2 ring-primary-500'
                  )}
                >
                  {route.isRecommended && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Shield size={14} className="text-primary-600" />
                      <span className="text-xs font-bold text-primary-700">Recommended Route</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{route.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">{route.distance}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} /> {route.duration}
                        </span>
                      </div>
                    </div>
                    <span className={classNames('badge', safety.bg, safety.color)}>
                      <span className={classNames('w-1.5 h-1.5 rounded-full', safety.dot)} />
                      {safety.label}
                    </span>
                  </div>
                  <button className="btn btn-outline w-full py-2.5 text-sm">
                    <Navigation size={16} /> Start Route
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!hasSearched && (
        <div className="card p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
            <Route size={28} className="text-primary-600" />
          </div>
          <p className="text-sm text-gray-500">
            Enter your starting location and destination to find safer route options with safety indicators.
          </p>
        </div>
      )}
    </div>
  );
}
