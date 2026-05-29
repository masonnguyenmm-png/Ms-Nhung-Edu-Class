import React from 'react';
import { useClass } from '../../context/ClassContext';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const ToastOverlay: React.FC = () => {
  const { toasts, removeToast } = useClass();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 w-full max-w-sm px-4 md:px-0">
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-outline-variant';
        let iconColor = 'text-primary';
        let IconComponent = Info;

        if (toast.type === 'success') {
          bgStyle = 'bg-primary-container/95 border-primary/40 text-white';
          iconColor = 'text-secondary-container';
          IconComponent = CheckCircle;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-secondary-fixed/95 border-secondary/20 text-on-secondary-fixed';
          iconColor = 'text-secondary';
          IconComponent = AlertTriangle;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-error-container/95 border-error/20 text-on-error-container';
          iconColor = 'text-error';
          IconComponent = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start justify-between gap-4 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 ${bgStyle}`}
          >
            <div className="flex gap-3">
              <IconComponent size={20} className={`${iconColor} flex-shrink-0 mt-0.5`} />
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-white/20 transition-all text-current opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
