import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { classNames } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type Toast = { id: number; type: ToastType; message: string };

const ToastContext = createContext<{ push: (type: ToastType, message: string) => void } | undefined>(undefined);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: AlertCircle,
};

const styles = {
  success: 'bg-success-50 border-success-200 text-success-800',
  error: 'bg-emergency-50 border-emergency-200 text-emergency-800',
  warning: 'bg-warning-50 border-warning-200 text-warning-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
};

const iconColors = {
  success: 'text-success-600',
  error: 'text-emergency-600',
  warning: 'text-warning-600',
  info: 'text-primary-600',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={classNames(
                'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in-right',
                styles[toast.type]
              )}
            >
              <Icon size={20} className={classNames('flex-shrink-0 mt-0.5', iconColors[toast.type])} />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button onClick={() => remove(toast.id)} className="flex-shrink-0 -mt-1 -mr-1 p-1 rounded-lg hover:bg-black/5">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
