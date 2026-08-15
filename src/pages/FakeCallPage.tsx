import { useEffect, useRef, useState } from 'react';
import { PhoneCall, Phone, PhoneOff, User, Clock, ChevronDown } from 'lucide-react';
import { classNames } from '@/lib/utils';

type CallState = 'idle' | 'scheduling' | 'ringing' | 'active';
type Caller = { name: string; isCustom?: boolean };

const PRESET_CALLERS: Caller[] = [
  { name: 'Mom' },
  { name: 'Dad' },
  { name: 'Friend' },
];

const DELAYS = [
  { label: '5 seconds', value: 5 },
  { label: '10 seconds', value: 10 },
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
];

export function FakeCallPage() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [selectedCaller, setSelectedCaller] = useState('Mom');
  const [customName, setCustomName] = useState('');
  const [delay, setDelay] = useState(10);
  const [callDuration, setCallDuration] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const callerName = selectedCaller === 'Custom' ? customName || 'Unknown' : selectedCaller;

  const startSchedule = () => {
    setCallState('scheduling');
    setCountdown(delay);
  };

  const cancelSchedule = () => {
    setCallState('idle');
    setCountdown(0);
  };

  const answer = () => {
    setCallState('active');
    setCallDuration(0);
  };

  const decline = () => {
    setCallState('idle');
    setCountdown(0);
  };

  const endCall = () => {
    setCallState('idle');
    setCallDuration(0);
  };

  // Countdown to ring
  useEffect(() => {
    if (callState !== 'scheduling') return;
    if (countdown <= 0) {
      setCallState('ringing');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [callState, countdown]);

  // Call duration
  useEffect(() => {
    if (callState !== 'active') return;
    const interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  // Auto-stop ringing after 30s
  useEffect(() => {
    if (callState !== 'ringing') return;
    const t = setTimeout(() => setCallState('idle'), 30000);
    return () => clearTimeout(t);
  }, [callState]);

  // Ringing vibration
  useEffect(() => {
    if (callState !== 'ringing') return;
    if ('vibrate' in navigator) {
      navigator.vibrate?.([400, 200, 400]);
    }
  }, [callState]);

  if (callState === 'ringing' || callState === 'active') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-between py-12 px-6 animate-fade-in">
        {/* Caller info */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl mb-4">
            <User size={56} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{callerName}</h2>
          {callState === 'active' ? (
            <p className="text-white/70 text-sm">
              {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
            </p>
          ) : (
            <p className="text-white/70 text-sm">Incoming call...</p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emergency-500 animate-pulse" />
            <span className="text-xs text-white/50">Simulated call</span>
          </div>
        </div>

        {/* Call controls */}
        <div className="w-full max-w-sm">
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around">
              <button
                onClick={decline}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-emergency-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                  <PhoneOff size={28} className="text-white" />
                </div>
                <span className="text-sm text-white/70">Decline</span>
              </button>
              <button
                onClick={answer}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-success-600 flex items-center justify-center shadow-lg animate-bounce active:scale-90 transition-transform">
                  <Phone size={28} className="text-white" />
                </div>
                <span className="text-sm text-white/70">Answer</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={endCall}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full bg-emergency-600 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                  <PhoneOff size={28} className="text-white" />
                </div>
                <span className="text-sm text-white/70">End Call</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <PhoneCall size={22} className="text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Fake Call</h2>
          <p className="text-sm text-gray-500">Simulate an incoming call</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100">
        <PhoneCall size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-primary-800">
          Use this feature to simulate an incoming call when you feel uncomfortable. This is separate from the real emergency SOS.
        </p>
      </div>

      {/* Scheduling countdown */}
      {callState === 'scheduling' && (
        <div className="card p-8 flex flex-col items-center animate-scale-in">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full bg-primary-100 animate-pulse" />
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-700">{countdown}</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-4">Fake call from {callerName} in {countdown}s...</p>
          <button onClick={cancelSchedule} className="btn btn-outline">
            Cancel
          </button>
        </div>
      )}

      {callState === 'idle' && (
        <>
          {/* Caller selection */}
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Caller name</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_CALLERS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCaller(c.name)}
                    className={classNames(
                      'px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      selectedCaller === c.name
                        ? 'bg-primary-700 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {c.name}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedCaller('Custom')}
                  className={classNames(
                    'px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    selectedCaller === 'Custom'
                      ? 'bg-primary-700 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  Custom
                </button>
              </div>
              {selectedCaller === 'Custom' && (
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="input mt-3"
                  placeholder="Enter caller name"
                />
              )}
            </div>

            <div>
              <label className="label">Delay before call</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={delay}
                  onChange={(e) => setDelay(Number(e.target.value))}
                  className="input pl-11 appearance-none"
                >
                  {DELAYS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <button onClick={startSchedule} className="btn btn-primary btn-lg w-full">
            <PhoneCall size={20} /> Start Fake Call
          </button>

          <p className="text-xs text-gray-400 text-center">
            The fake call screen will appear after the delay. This is a simulated call for safety purposes only.
          </p>
        </>
      )}
    </div>
  );
}
