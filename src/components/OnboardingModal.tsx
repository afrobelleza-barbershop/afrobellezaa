import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { User, ArrowRight } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboarded, 
    submitOnboarding, 
    lang, 
    setLang, 
    settings 
  } = useApp();

  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (isOnboarded) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setErrorMsg(lang === 'fr' ? 'Veuillez entrer votre nom.' : 'Por favor ingresa tu nombre.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await submitOnboarding(inputName.trim());
      setLoading(false);
      if (!res.success) {
        setErrorMsg(
          res.message ||
          (lang === 'fr' 
            ? 'Impossible de vérifier votre accès pour le moment. Vérifiez votre connexion Internet et réessayez.' 
            : 'No es posible verificar tu acceso en este momento. Revisa tu conexión a Internet e inténtalo de nuevo.')
        );
      }
    } catch {
      setLoading(false);
      setErrorMsg(
        lang === 'fr' 
          ? 'Impossible de vérifier votre accès pour le moment. Vérifiez votre connexion Internet et réessayez.' 
          : 'No es posible verificar tu acceso en este momento. Revisa tu conexión a Internet e inténtalo de nuevo.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand & Language selector in header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-contain bg-neutral-950 p-0.5" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-black text-xs">
                AB
              </div>
            )}
            <span className="font-display font-bold text-xs uppercase text-neutral-300 truncate max-w-[180px]">
              {settings?.name || 'AFROBELLEZA BARBER SHOP'}
            </span>
          </div>

          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                lang === 'es' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              🇲🇽 ES
            </button>
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                lang === 'fr' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
              }`}
            >
              🇫🇷 FR
            </button>
          </div>
        </div>

        {/* Title: Prompting for name */}
        <div className="space-y-2 text-center pt-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {lang === 'fr' ? 'Quel est votre nom ?' : '¿Cuál es tu nombre?'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            {lang === 'fr' 
              ? 'Bienvenue sur l\'application officielle de votre salon.' 
              : 'Bienvenido/a a la aplicación oficial de tu barbería.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              {lang === 'fr' ? 'Entrez votre nom' : 'Ingresa tu nombre'}
            </label>

            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder={lang === 'fr' ? 'Entrez votre nom' : 'Ingresa tu nombre'}
                className="w-full h-14 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-2xl px-4 text-base text-white placeholder-neutral-600 focus:outline-none transition-colors shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium leading-relaxed mt-1">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-neutral-950 font-black text-sm rounded-2xl tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? (lang === 'fr' ? 'Vérification...' : 'Verificando...') : (lang === 'fr' ? 'Continuer' : 'Continuar')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
