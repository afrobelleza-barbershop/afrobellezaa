import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Bell, Calendar, Sparkles, MessageSquare, AlertCircle, Check } from 'lucide-react';
import type { Notification } from '../types/index.ts';

export const NotificationsModal: React.FC = () => {
  const { 
    showNotificationsModal, 
    setShowNotificationsModal, 
    notifications, 
    markAllNotificationsRead, 
    t, 
    lang, 
    setActiveTab 
  } = useApp();

  if (!showNotificationsModal) return null;

  const handleNotificationClick = (notif: Notification) => {
    setShowNotificationsModal(false);
    if (notif.linkTab) {
      if (notif.linkTab === 'bookings') setActiveTab('admin');
      else if (notif.linkTab === 'news') setActiveTab('news');
      else if (notif.linkTab === 'messages') setActiveTab('messages');
      else if (notif.linkTab === 'profile') setActiveTab('profile');
      else setActiveTab(notif.linkTab);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'post':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setShowNotificationsModal(false)}
    >
      <div 
        className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-display font-extrabold text-lg text-white">
              {t('notificationsTitle')}
            </h2>
          </div>
          <button
            onClick={() => setShowNotificationsModal(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('markAllRead')}</span>
            </button>
          </div>
        )}

        <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-neutral-400 text-sm">
              {t('noNotifications')}
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border transition-colors cursor-pointer flex items-start gap-3 ${
                  n.isRead
                    ? 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-950'
                    : 'bg-neutral-950 border-amber-500/40 hover:border-amber-500 shadow-sm'
                }`}
              >
                <div className="p-2 rounded-xl bg-neutral-900 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
