import { useEffect, useRef, useState } from 'react';
import { Shield, X, Phone, MapPin, Users, AlertTriangle } from 'lucide-react';
import { classNames } from '@/lib/utils';

type SOSButtonProps = {
  onActivate: () => void;
  onCancel?: () => void;
};

export function SOSButton({ onActivate }: SOSButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_DURATION = 3000;

  const clearTimers = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
  };

  const startHold = () => {
    setHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setHolding(false);
        setProgress(0);
        onActivate();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    setHolding(false);
    setProgress(0);
    clearTimers();
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 280, height: 280 }}>
        {/* Pulse rings when idle */}
        {!holding && (
          <>
            <div className="absolute inset-0 rounded-full bg-emergency-500/10 animate-pulse-ring" />
            <div className="absolute inset-4 rounded-full bg-emergency-500/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        {/* SVG progress ring */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="rgba(239,68,68,0.1)"
            strokeWidth="8"
          />
          {holding && (
            <circle
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="#dc2626"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'none' }}
            />
          )}
        </svg>

        {/* Button */}
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            startHold();
          }}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          disabled={holding}
          className={classNames(
            'absolute inset-8 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-transform select-none',
            holding
              ? 'bg-emergency-800 scale-95'
              : 'bg-emergency-600 hover:bg-emergency-700 active:scale-95'
          )}
          aria-label="Emergency SOS - press and hold for 3 seconds"
        >
          <Shield size={48} className="mb-2" />
          <span className="text-2xl font-bold tracking-wide">SOS</span>
          <span className="text-xs font-medium opacity-80 mt-0.5">Emergency</span>
        </button>

        {/* Cancel overlay */}
        {holding && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 pointer-events-none">
            <div className="text-center mb-2">
              <p className="text-sm font-bold text-emergency-700">
                {Math.ceil((HOLD_DURATION - (Date.now() - startTimeRef.current)) / 1000)}s
              </p>
              <p className="text-xs text-gray-600">Keep holding to activate</p>
            </div>
            <button
              onClick={cancelHold}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-900">Emergency SOS</p>
        <p className="text-sm text-gray-500 mt-0.5">Press and hold for 3 seconds</p>
      </div>
    </div>
  );
}

export function SOSActivePanel({
  locationText,
  contactsNotified,
  onEnd,
}: {
  locationText: string;
  contactsNotified: number;
  onEnd: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center animate-scale-in">
      {/* Pulsing emergency icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-emergency-500/30 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-emergency-500/20 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
        <div className="relative w-24 h-24 rounded-full bg-emergency-600 flex items-center justify-center shadow-lg">
          <AlertTriangle size={44} className="text-white" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emergency-600 text-white text-sm font-bold mb-6">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        SOS ACTIVE
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-1">Emergency Activated</p>
      <p className="text-sm text-gray-500 mb-6">Help is being dispatched. Stay calm.</p>

      <div className="w-full max-w-sm space-y-3 mb-6">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500">Current Location</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{locationText}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-medium text-success-700">Sharing</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Users size={20} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Emergency Contacts Notified</p>
            <p className="text-sm font-semibold text-gray-900">{contactsNotified} contact{contactsNotified !== 1 ? 's' : ''}</p>
          </div>
          <span className="text-xs font-medium text-success-700">Sent</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-700">{Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">Elapsed Time</p>
            <p className="text-sm font-semibold text-gray-900">Since activation</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-2.5">
        <a href="tel:911" className="btn btn-danger btn-lg w-full">
          <Phone size={20} /> Call Emergency Services
        </a>
        <button onClick={onEnd} className="btn btn-outline btn-lg w-full">
          End SOS
        </button>
      </div>
    </div>
  );
}
