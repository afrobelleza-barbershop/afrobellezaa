import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { openWhatsApp, settings } = useApp();

  return (
    <button
      onClick={() => openWhatsApp()}
      aria-label={`Contactar por WhatsApp: ${settings?.whatsapp || '+52 962 447 0847'}`}
      className="fixed bottom-20 md:bottom-6 right-4 z-30 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all group border border-emerald-400/30"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping" />
      </div>
      <span className="text-xs font-bold tracking-wide hidden sm:inline uppercase">
        WhatsApp
      </span>
      <span className="text-[11px] font-mono opacity-90 hidden lg:inline">
        {settings?.whatsapp || '+52 962 447 0847'}
      </span>
    </button>
  );
};
