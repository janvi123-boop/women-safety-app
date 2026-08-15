import { MapPin, Navigation } from 'lucide-react';
import { classNames } from '@/lib/utils';

type MapPlaceholderProps = {
  className?: string;
  showMarker?: boolean;
  markerLabel?: string;
  children?: React.ReactNode;
};

export function MapPlaceholder({ className, showMarker = true, markerLabel, children }: MapPlaceholderProps) {
  return (
    <div
      className={classNames(
        'relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200',
        className
      )}
    >
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Simulated roads */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M 0 30% Q 50% 35% 100% 25%" stroke="#d1d5db" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 20% 0 L 25% 100%" stroke="#d1d5db" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 0 70% L 100% 65%" stroke="#e5e7eb" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 60% 0 L 65% 100%" stroke="#e5e7eb" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 0 50% Q 30% 55% 60% 48% T 100% 52%" stroke="#d1d5db" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      {/* Water area */}
      <div
        className="absolute bottom-0 right-0 w-2/5 h-1/3 bg-blue-50 rounded-tl-3xl"
        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
      />
      {/* Green park area */}
      <div className="absolute top-10 left-8 w-24 h-20 bg-green-100 rounded-lg opacity-60" />

      {/* Marker */}
      {showMarker && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-pulse-ring" />
            <div className="relative w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin size={18} className="text-white" />
            </div>
          </div>
          {markerLabel && (
            <div className="mt-1 px-2 py-0.5 bg-white rounded-md shadow-sm text-xs font-medium text-gray-700 whitespace-nowrap">
              {markerLabel}
            </div>
          )}
        </div>
      )}

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 text-[10px] text-gray-400 font-medium">
        Map UI Placeholder
      </div>

      {/* Overlay children */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

export function LocationAccuracy({ accuracyMeters }: { accuracyMeters: number | null }) {
  if (accuracyMeters === null) return null;
  const good = accuracyMeters <= 20;
  const moderate = accuracyMeters <= 50;
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        good ? 'bg-success-100 text-success-700' : moderate ? 'bg-warning-100 text-warning-700' : 'bg-emergency-100 text-emergency-700'
      )}
    >
      <Navigation size={12} />
      Accuracy: ±{accuracyMeters}m
    </div>
  );
}
