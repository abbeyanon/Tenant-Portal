import React from 'react';
import { useTenant } from '../context/TenantContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTenant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="p-4 rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex items-start gap-3 text-xs animate-in slide-in-from-right-4"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white">{toast.title}</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
