import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';

export const ClosedBanner: React.FC = () => {
  const { settings, t, setActiveTab } = useApp();

  if (settings?.isOpen) {
    return null;
  }

  const salonName = settings?.name || 'AFROBELLEZA BARBER SHOP';

  return (
    <div className="w-full bg-rose-950/80 border-b border-rose-800/80 text-rose-100 px-4 py-3 transition-all animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
          <div>
            <h2 className="font-display font-black text-sm sm:text-base tracking-wide text-rose-200">
              🔴 {salonName} {t('closed').toUpperCase()}
            </h2>
            <p className="text-xs text-rose-300/90 mt-0.5">
              {t('salonClosedNotice')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hours')}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-900/60 hover:bg-rose-900 border border-rose-700/60 rounded-lg text-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('sectionHours')}</span>
          </button>
          {settings?.allowBookingWhenClosed && (
            <button
              onClick={() => setActiveTab('book')}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('bookAppointment')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
