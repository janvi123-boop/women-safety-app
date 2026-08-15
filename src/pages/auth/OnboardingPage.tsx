import { useState } from 'react';
import { Shield, Users, MapPin, ArrowRight, Check } from 'lucide-react';

type OnboardingProps = {
  onComplete: () => void;
};

const steps = [
  {
    icon: Shield,
    title: 'How SOS works',
    description: 'Press and hold the SOS button for 3 seconds to trigger an emergency alert. You can cancel before it activates.',
    color: 'bg-emergency-600',
  },
  {
    icon: Users,
    title: 'Emergency contacts',
    description: 'Your selected emergency contacts are notified immediately when you activate SOS, with your live location.',
    color: 'bg-primary-700',
  },
  {
    icon: MapPin,
    title: 'Live location sharing',
    description: 'Share your real-time location with trusted contacts so they can find you quickly in an emergency.',
    color: 'bg-success-600',
  },
];

export function OnboardingPage({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const Icon = step.icon;
  const isLast = current === steps.length - 1;

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md w-full mx-auto">
        <div className="flex items-center justify-center gap-1.5 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-primary-700' : i < current ? 'w-8 bg-primary-300' : 'w-8 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div key={current} className="flex flex-col items-center text-center animate-scale-in">
          <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center shadow-lg mb-8`}>
            <Icon size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-sm">{step.description}</p>
        </div>

        <div className="mt-12 space-y-3">
          <button onClick={next} className="btn btn-primary btn-lg w-full">
            {isLast ? (
              <>
                <Check size={20} /> Get Started
              </>
            ) : (
              <>
                Next <ArrowRight size={20} />
              </>
            )}
          </button>
          {!isLast && (
            <button onClick={onComplete} className="btn btn-ghost w-full text-gray-500">
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
