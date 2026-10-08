import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Home, 
  Scissors, 
  Calendar, 
  Sparkles, 
  User, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    t, 
    lang,
    currentRole, 
    unreadMessagesCount,
    posts 
  } = useApp();

  const hasNewPost = posts.some(p => {
    const diffHours = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 3600);
    return diffHours < 24;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 md:hidden pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Inicio */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'home' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
            {t('navHome')}
          </span>
        </button>

        {/* Tab 2: Servicios */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'services' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Scissors className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
            {t('navServices')}
          </span>
        </button>

        {/* Tab 3: Reservar (Primary Action) */}
        <button
          onClick={() => setActiveTab(currentRole === 'owner' ? 'admin' : 'book')}
          className="flex flex-col items-center justify-center min-h-[44px] group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/20 group-active:scale-95 transition-transform -mt-3 border-2 border-neutral-950">
            {currentRole === 'owner' ? (
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-amber-400 whitespace-nowrap">
            {currentRole === 'owner' ? (lang === 'fr' ? 'Gestion' : 'Gestión') : t('navBook')}
          </span>
        </button>

        {/* Tab 4: Novedades */}
        <button
          onClick={() => setActiveTab('news')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'news' ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {hasNewPost && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
            {t('navNews')}
          </span>
        </button>

        {/* Tab 5: Perfil / Chat */}
        <button
          onClick={() => setActiveTab(currentRole === 'owner' ? 'messages' : 'profile')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            (activeTab === 'profile' || activeTab === 'messages' || activeTab === 'admin') 
              ? 'text-amber-400 font-semibold' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {currentRole === 'owner' ? (
            <MessageSquare className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
          {unreadMessagesCount > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-rose-500" />
          )}
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
            {currentRole === 'owner' ? t('navMessages') : t('navProfile')}
          </span>
        </button>
      </div>
    </nav>
  );
};
