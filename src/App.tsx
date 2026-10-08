import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { ClosedBanner } from './components/ClosedBanner.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { WhatsAppButton } from './components/WhatsAppButton.tsx';
import { HomeView } from './components/HomeView.tsx';
import { ServicesView } from './components/ServicesView.tsx';
import { BookingView } from './components/BookingView.tsx';
import { NewsView } from './components/NewsView.tsx';
import { GalleryView } from './components/GalleryView.tsx';
import { MessagesView } from './components/MessagesView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { NotificationsModal } from './components/NotificationsModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { CheckCircle2, AlertTriangle, Info, Clock, MapPin, MessageCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    currentRole, 
    toasts, 
    settings, 
    hours, 
    t, 
    lang, 
    openWhatsApp,
    copyWhatsAppNumber,
    setActiveTab 
  } = useApp();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* 1. Top Bar */}
      <Header />

      {/* 2. Closed Salon Notification Banner (if closed) */}
      <ClosedBanner />

      {/* 3. Main Dynamic Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'book' && <BookingView />}
        {activeTab === 'news' && <NewsView />}
        {activeTab === 'gallery' && <GalleryView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'hours' && (
          <div className="max-w-2xl mx-auto space-y-6 pb-24">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                {t('sectionHours')}
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                {lang === 'fr' ? 'Horaires d’Ouverture du Salon' : 'Horarios Oficiales de Atención'}
              </h1>
            </div>
            <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-3">
              {hours.map((h) => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-neutral-800/80 text-sm">
                  <span className="font-bold text-white capitalize">{lang === 'fr' ? h.dayNameFr : h.dayNameEs}</span>
                  <span className="font-mono text-neutral-300">
                    {h.isOpen ? `${h.openTime} - ${h.closeTime}` : <span className="text-rose-400 font-bold">{t('closedDay')}</span>}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl"
            >
              {t('back')}
            </button>
          </div>
        )}
      </main>

      {/* 4. Editorial Footer adhering to anti-slop rules (quiet, useful links, real contact) */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10 px-4 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="font-display font-extrabold text-base text-white tracking-tight uppercase">
              {settings?.name || 'AFROBELLEZA BARBER SHOP'}
            </div>
            <p className="text-xs text-neutral-400">
              {settings?.address || 'Av. Central Sur #45, Tapachula, Chiapas, México 🇲🇽'}
            </p>
          </div>

          {/* Quick links & WhatsApp official display */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors">
              {t('navHome')}
            </button>
            <button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">
              {t('navServices')}
            </button>
            <button onClick={() => setActiveTab('news')} className="hover:text-amber-400 transition-colors">
              {t('navNews')}
            </button>
            <button onClick={() => setActiveTab('gallery')} className="hover:text-amber-400 transition-colors">
              {t('navGallery')}
            </button>
            <button onClick={() => openWhatsApp()} className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{settings?.whatsapp || '+52 962 447 0847'}</span>
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            © {new Date().getFullYear()} {settings?.name || 'Afrobelleza Barber Shop'}
          </div>
        </div>
      </footer>

      {/* 5. Mobile Thumb Navigation Bar */}
      <BottomNav />

      {/* 6. Floating Official WhatsApp Trigger */}
      <WhatsAppButton />

      {/* 7. Modals */}
      <OnboardingModal />
      <NotificationsModal />
      <SettingsModal />

      {/* 8. Toast Feedback Stack */}
      <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all animate-bounceIn border ${
              toast.type === 'error'
                ? 'bg-rose-950 border-rose-800 text-rose-200'
                : toast.type === 'info'
                ? 'bg-sky-950 border-sky-800 text-sky-200'
                : 'bg-neutral-900 border-amber-500/50 text-amber-300'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
