import React from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(toast => {
        const bg =
          toast.type === 'success'
            ? 'bg-[#0F1B2D] text-white border-l-4 border-l-[#14B8A6]'
            : toast.type === 'error'
            ? 'bg-[#0F1B2D] text-white border-l-4 border-l-[#FF6B4A]'
            : 'bg-[#0F1B2D] text-white border-l-4 border-l-[#F59E0B]';

        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#14B8A6] shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-[#FF6B4A] shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#F59E0B] shrink-0" />
          );

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 animate-slide-in ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
