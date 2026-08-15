import { Loader2 } from 'lucide-react';
import { classNames } from '@/lib/utils';

export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return <Loader2 size={size} className={classNames('animate-spin', className)} />;
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50">
      <Spinner size={32} className="text-primary-600" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}
