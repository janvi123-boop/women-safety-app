import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { classNames } from '@/lib/utils';

type BannerProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
  className?: string;
};

const config = {
  success: { icon: CheckCircle2, bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-800', iconColor: 'text-success-600' },
  error: { icon: AlertCircle, bg: 'bg-emergency-50', border: 'border-emergency-200', text: 'text-emergency-800', iconColor: 'text-emergency-600' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-800', iconColor: 'text-warning-600' },
  info: { icon: Info, bg: 'bg-primary-50', border: 'border-primary-200', text: 'text-primary-800', iconColor: 'text-primary-600' },
};

export function Banner({ type, children, onClose, className }: BannerProps) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <div
      className={classNames(
        'flex items-start gap-3 px-4 py-3 rounded-xl border',
        c.bg,
        c.border,
        c.text,
        className
      )}
      role="alert"
    >
      <Icon size={20} className={classNames('flex-shrink-0 mt-0.5', c.iconColor)} />
      <div className="flex-1 text-sm font-medium">{children}</div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-lg hover:bg-black/5 transition-colors" aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
