import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  Heart, 
  Settings, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Scissors
} from 'lucide-react';
import type { Appointment } from '../types/index.ts';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    appointments, 
    posts, 
    t, 
    lang, 
    setLang, 
    currentRole, 
    setActiveTab, 
    setShowSettingsModal,
    resetOnboarding
  } = useApp();

  const userAppointments = appointments.filter(a => a.userId === currentUser.id || currentRole === 'client');
  const upcoming = userAppointments.filter(a => a.status === 'pendiente' || a.status === 'confirmada');
  const past = userAppointments.filter(a => a.status === 'completada' || a.status === 'rechazada' || a.status === 'cancelada');
  const likedPosts = posts.filter(p => p.likedBy?.includes(currentUser.id));

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmada':
        return (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('statusConfirmed')}</span>
          </span>
        );
      case 'rechazada':
        return (
          <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>{t('statusRejected')}</span>
          </span>
        );
      case 'completada':
        return (
          <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2.5 py-1 rounded-lg">
            {t('statusCompleted')}
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t('statusPending')}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      {/* Profile Header */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-neutral-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg">
          {currentUser.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-white">
                {currentUser.name}
              </h1>
              <p className="text-xs text-neutral-400 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-mono">{currentUser.phone}</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={resetOnboarding}
                className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded-xl transition-colors"
                title={lang === 'fr' ? 'Changer de nom ou se déconnecter' : 'Cambiar de nombre o desconectarse'}
              >
                {lang === 'fr' ? 'Changer de nom' : 'Cambiar de nombre'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language & Settings Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language selector card */}
        <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Globe className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-wider">{t('languageSelector')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLang('es')}
              className={`p-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                lang === 'es'
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>🇲🇽</span>
              <span>Español</span>
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`p-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                lang === 'fr'
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>🇫🇷</span>
              <span>Français</span>
            </button>
          </div>
        </div>

        {/* Quick action card */}
        <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Settings className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-wider">{t('navSettings')}</h2>
          </div>
          <p className="text-xs text-neutral-400">
            {currentRole === 'owner' 
              ? (lang === 'fr' ? 'Accéder à votre espace de gestion du salon.' : 'Acceder al panel de gestión del salón.')
              : (lang === 'fr' ? 'Consultez l\'historique de vos rendez-vous ou planifiez un nouveau créneau.' : 'Consulta el historial de tus citas o agenda una nueva cita.')}
          </p>
          <button
            onClick={() => setActiveTab(currentRole === 'owner' ? 'admin' : 'book')}
            className="w-full min-h-[40px] px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
          >
            {currentRole === 'owner' ? (lang === 'fr' ? 'Espace de Gestion' : 'Espacio de Gestión') : t('bookAppointment')}
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-white">
            {t('upcomingAppointments')} ({upcoming.length})
          </h2>
          <button
            onClick={() => setActiveTab('book')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            + Nueva cita
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-6 text-center bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-400 text-sm">
            {t('noAppointments')}
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((app) => (
              <div
                key={app.id}
                className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-amber-500" />
                    <h3 className="font-display font-bold text-base text-white">{app.serviceName}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {app.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {app.time}
                    </span>
                  </div>
                  {app.notes && (
                    <p className="text-xs text-neutral-400 italic">"{app.notes}"</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-neutral-800">
                  <span className="text-sm font-bold font-mono text-amber-400">
                    ${app.price} MXN
                  </span>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liked Posts */}
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-lg sm:text-xl text-white">
          {t('myLikedPosts')} ({likedPosts.length})
        </h2>

        {likedPosts.length === 0 ? (
          <div className="p-6 text-center bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-400 text-sm">
            Aún no has dado Me Gusta a ninguna publicación.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {likedPosts.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveTab('news')}
                className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 cursor-pointer hover:border-amber-500/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-500 capitalize">{p.type}</span>
                  <div className="flex items-center gap-1 text-xs text-rose-400">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{p.likesCount}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-sm text-white line-clamp-1">{p.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2">{p.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
