import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Bell, 
  MessageSquare, 
  Globe, 
  ShieldCheck, 
  User as UserIcon, 
  Store
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    settings, 
    lang, 
    setLang, 
    currentRole, 
    t, 
    unreadNotificationsCount, 
    unreadMessagesCount,
    setShowNotificationsModal,
    setActiveTab,
    activeTab
  } = useApp();

  const isOpen = settings?.isOpen ?? true;
  const salonName = settings?.name || 'AFROBELLEZA BARBER SHOP';

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            {settings?.logoUrl ? (
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img src={settings.logoUrl} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-black text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform shrink-0">
                AB
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase">
                {salonName}
              </span>
              {/* Unboxed metadata separator, NO pill */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <span>{settings?.city || 'México 🇲🇽'}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className={`font-semibold flex items-center gap-1 ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                  {isOpen ? t('open') : t('closed')}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for desktop/tablet */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-300">
          <button 
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-white ${activeTab === 'home' ? 'text-amber-400 font-semibold' : ''}`}
          >
            {t('navHome')}
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`transition-colors hover:text-white ${activeTab === 'services' ? 'text-amber-400 font-semibold' : ''}`}
          >
            {t('navServices')}
          </button>
          <button 
            onClick={() => setActiveTab('news')}
            className={`transition-colors hover:text-white ${activeTab === 'news' ? 'text-amber-400 font-semibold' : ''}`}
          >
            {t('navNews')}
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`transition-colors hover:text-white ${activeTab === 'gallery' ? 'text-amber-400 font-semibold' : ''}`}
          >
            {t('navGallery')}
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`relative transition-colors hover:text-white flex items-center gap-1 ${activeTab === 'messages' ? 'text-amber-400 font-semibold' : ''}`}
          >
            {t('navMessages')}
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-0.5" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              onClick={() => setLang('es')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                lang === 'es' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Español (México)"
            >
              🇲🇽 ES
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                lang === 'fr' ? 'bg-amber-500 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="Français"
            >
              🇫🇷 FR
            </button>
          </div>

          {/* Messages shortcut on mobile */}
          <button
            onClick={() => setActiveTab('messages')}
            className="md:hidden relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label={t('navMessages')}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label={t('notificationsTitle')}
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 text-[10px] font-bold bg-amber-500 text-neutral-950 rounded-full flex items-center justify-center font-mono">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Only visible when already authenticated as owner */}
          {currentRole === 'owner' && (
            <button
              onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
              className="min-h-[40px] px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-amber-500/60"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{activeTab === 'admin' ? (lang === 'fr' ? 'Aperçu client' : 'Ver cliente') : (lang === 'fr' ? 'Gestion' : 'Gestión')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
