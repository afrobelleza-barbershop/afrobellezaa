import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Globe, Shield, User, Smartphone } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    showSettingsModal, 
    setShowSettingsModal, 
    lang, 
    setLang, 
    resetOnboarding,
    t 
  } = useApp();

  if (!showSettingsModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setShowSettingsModal(false)}
    >
      <div 
        className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <h2 className="font-display font-extrabold text-lg text-white">
            {t('navSettings')}
          </h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{t('languageSelector')}</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLang('es')}
              className={`p-4 rounded-2xl border text-center transition-colors flex flex-col items-center gap-2 ${
                lang === 'es'
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="text-2xl">🇲🇽</span>
              <span className="text-sm">Español (México)</span>
            </button>

            <button
              onClick={() => setLang('fr')}
              className={`p-4 rounded-2xl border text-center transition-colors flex flex-col items-center gap-2 ${
                lang === 'fr'
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-md'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className="text-2xl">🇫🇷</span>
              <span className="text-sm">Français</span>
            </button>
          </div>
        </div>

        {/* Change identity / reconnect button */}
        <div className="pt-2 border-t border-neutral-800">
          <button
            onClick={() => {
              setShowSettingsModal(false);
              resetOnboarding();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-neutral-400" />
            <span>{lang === 'fr' ? 'Changer de nom d\'utilisateur' : 'Cambiar de nombre de usuario'}</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="w-full h-11 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
