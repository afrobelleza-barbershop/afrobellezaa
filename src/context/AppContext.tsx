import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  BusinessSettings, 
  BusinessHour, 
  Service, 
  Appointment, 
  Post, 
  Message, 
  Notification, 
  GalleryItem, 
  DashboardStats,
  User, 
  Role,
  ThemeConfig,
  SectionsVisibility,
  CustomButtons
} from '../types/index.ts';
import { translations, type Language } from '../i18n/index.ts';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

export const THEME_PRESETS: Record<string, { name: string; theme: ThemeConfig }> = {
  'gold-obsidian': {
    name: 'Gold & Obsidian (Luxe Classique)',
    theme: {
      preset: 'gold-obsidian',
      primaryColor: '#f59e0b',
      secondaryColor: '#10b981',
      bgColor: '#0a0a0a',
      cardBgColor: '#171717',
      textColor: '#f5f5f5',
      buttonColor: '#f59e0b',
      buttonTextColor: '#0a0a0a',
    }
  },
  'emerald-dark': {
    name: 'Emerald & Dark Forest (Barber Premium)',
    theme: {
      preset: 'emerald-dark',
      primaryColor: '#10b981',
      secondaryColor: '#06b6d4',
      bgColor: '#051b14',
      cardBgColor: '#0c2e23',
      textColor: '#f0fdf4',
      buttonColor: '#10b981',
      buttonTextColor: '#022c22',
    }
  },
  'crimson-onyx': {
    name: 'Crimson & Onyx (Barber Traditionnel)',
    theme: {
      preset: 'crimson-onyx',
      primaryColor: '#ef4444',
      secondaryColor: '#f59e0b',
      bgColor: '#100608',
      cardBgColor: '#220b10',
      textColor: '#fff1f2',
      buttonColor: '#ef4444',
      buttonTextColor: '#450a0a',
    }
  },
  'sapphire-midnight': {
    name: 'Sapphire & Midnight (Élégance Moderne)',
    theme: {
      preset: 'sapphire-midnight',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      bgColor: '#030712',
      cardBgColor: '#0f172a',
      textColor: '#f8fafc',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
    }
  },
  'monochrome': {
    name: 'Monochrome Titanium (Minimaliste Urbain)',
    theme: {
      preset: 'monochrome',
      primaryColor: '#e5e5e5',
      secondaryColor: '#a3a3a3',
      bgColor: '#000000',
      cardBgColor: '#171717',
      textColor: '#ffffff',
      buttonColor: '#e5e5e5',
      buttonTextColor: '#000000',
    }
  }
};

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: keyof typeof translations['es']) => string;
  
  // Onboarding & First Launch
  isOnboarded: boolean;
  submitOnboarding: (name: string) => Promise<{ success: boolean; isOwner: boolean; message?: string }>;
  resetOnboarding: () => void;

  // Role & Current User
  currentRole: Role;
  setRole: (r: Role) => void;
  currentUser: User;
  switchRole: () => void;
  
  // Active Navigation Tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedServiceForBooking: Service | null;
  setSelectedServiceForBooking: (s: Service | null) => void;

  // Data & State
  settings: BusinessSettings | null;
  hours: BusinessHour[];
  services: Service[];
  appointments: Appointment[];
  posts: Post[];
  messages: Message[];
  notifications: Notification[];
  gallery: GalleryItem[];
  stats: DashboardStats | null;
  loading: boolean;

  // Actions
  refreshAll: () => Promise<void>;
  toggleSalonStatus: (isOpen?: boolean) => Promise<void>;
  updateSettings: (newSettings: Partial<BusinessSettings>) => Promise<boolean>;
  updateTheme: (newTheme: Partial<ThemeConfig>) => Promise<boolean>;
  applyThemePreset: (presetKey: string) => Promise<boolean>;
  updateSectionsVisibility: (sections: Partial<SectionsVisibility>) => Promise<boolean>;
  updateCustomButtons: (buttons: Partial<CustomButtons>) => Promise<boolean>;
  updateLogo: (logoUrl: string) => Promise<boolean>;
  removeLogo: () => Promise<boolean>;
  updateHours: (newHours: BusinessHour[]) => Promise<boolean>;
  createService: (service: Partial<Service>) => Promise<boolean>;
  updateService: (id: string, updates: Partial<Service>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  createAppointment: (data: { clientName: string; clientPhone: string; serviceId: string; serviceName: string; price: number; date: string; time: string; notes?: string }) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<boolean>;
  createPost: (data: { title: string; content: string; mediaUrls: string[]; type: Post['type']; isImportant: boolean }) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  toggleLikePost: (postId: string) => Promise<void>;
  addGalleryPhoto: (data: { title: string; category: GalleryItem['category']; imageUrl: string; description?: string }) => Promise<boolean>;
  deleteGalleryPhoto: (id: string) => Promise<boolean>;
  sendMessage: (text: string, recipientId?: string, recipientName?: string) => Promise<boolean>;
  markMessagesRead: (conversationId?: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  sendBroadcastNotification: (title: string, message: string) => Promise<boolean>;
  
  // WhatsApp & Helper actions
  openWhatsApp: (customMessage?: string) => void;
  copyWhatsAppNumber: () => void;
  
  // Toasts & Modal states
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  showNotificationsModal: boolean;
  setShowNotificationsModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  
  // Unread counters
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('afrobelleza_lang');
    return (saved === 'fr' ? 'fr' : 'es') as Language;
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('afrobelleza_lang', l);
  };

  const t = useCallback((key: keyof typeof translations['es']): string => {
    return translations[lang]?.[key] || translations['es']?.[key] || (key as string);
  }, [lang]);

  // 2. Onboarding state
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem('afrobelleza_onboarded');
    return saved === 'true';
  });

  // 3. Current User & Role state
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    const saved = localStorage.getItem('afrobelleza_role');
    return (saved === 'owner' ? 'owner' : 'client') as Role;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedName = localStorage.getItem('afrobelleza_username') || (currentRole === 'owner' ? 'AFROBELLEZA ADMIN' : 'Carlos Mendoza');
    return {
      id: currentRole === 'owner' ? 'usr_owner_1' : 'usr_client_1',
      name: savedName,
      email: currentRole === 'owner' ? 'admin@afrobelleza.com' : 'cliente@afrobelleza.com',
      phone: currentRole === 'owner' ? '+52 962 447 0847' : '+52 962 123 4567',
      role: currentRole,
      avatarUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
      createdAt: new Date().toISOString()
    };
  });

  const setRole = (r: Role) => {
    setCurrentRole(r);
    localStorage.setItem('afrobelleza_role', r);
    setCurrentUser(prev => ({
      ...prev,
      role: r,
      id: r === 'owner' ? 'usr_owner_1' : 'usr_client_1',
      name: r === 'owner' ? 'AFROBELLEZA ADMIN' : (localStorage.getItem('afrobelleza_username') || 'Carlos Mendoza')
    }));
    showToast(r === 'owner' ? t('switchedToOwner') : t('switchedToClient'), 'info');
  };

  const switchRole = () => {
    setRole(currentRole === 'client' ? 'owner' : 'client');
  };

  // Submit onboarding
  const submitOnboarding = async (name: string): Promise<{ success: boolean; isOwner: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success) {
        setIsOnboarded(true);
        localStorage.setItem('afrobelleza_onboarded', 'true');
        localStorage.setItem('afrobelleza_username', data.user.name);
        localStorage.setItem('afrobelleza_role', data.role);
        setCurrentRole(data.role);
        setCurrentUser(data.user);

        if (data.isOwner) {
          setActiveTab('admin');
        } else {
          setActiveTab('home');
          showToast(`¡Bienvenido/a, ${data.user.name}!`, 'success');
        }
        return { success: true, isOwner: data.isOwner, message: data.message };
      }
      return { 
        success: false, 
        isOwner: false, 
        message: data.message || (lang === 'fr' 
          ? 'Impossible de vérifier votre accès pour le moment. Vérifiez votre connexion Internet et réessayez.' 
          : 'No es posible verificar tu acceso en este momento. Revisa tu conexión a Internet e inténtalo de nuevo.')
      };
    } catch (err) {
      console.error(err);
      return { 
        success: false, 
        isOwner: false, 
        message: lang === 'fr' 
          ? 'Impossible de vérifier votre accès pour le moment. Vérifiez votre connexion Internet et réessayez.' 
          : 'No es posible verificar tu acceso en este momento. Revisa tu conexión a Internet e inténtalo de nuevo.' 
      };
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('afrobelleza_onboarded');
    localStorage.removeItem('afrobelleza_username');
    localStorage.removeItem('afrobelleza_role');
    setCurrentRole('client');
    setIsOnboarded(false);
  };

  // 4. Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  // 5. Data states
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Toasts
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id));
    }, 3500);
  }, []);

  // Fetch all endpoints
  const refreshAll = useCallback(async () => {
    try {
      const [
        resSettings,
        resHours,
        resServices,
        resAppointments,
        resPosts,
        resMessages,
        resNotifs,
        resGallery,
        resStats
      ] = await Promise.all([
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/hours').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch(`/api/appointments?role=${currentRole}&userId=${currentUser.id}`).then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/messages').then(r => r.json()),
        fetch(`/api/notifications?role=${currentRole}&userId=${currentUser.id}`).then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ]);

      if (resSettings.success) setSettings(resSettings.data);
      if (resHours.success) setHours(resHours.data);
      if (resServices.success) setServices(resServices.data);
      if (resAppointments.success) setAppointments(resAppointments.data);
      if (resPosts.success) setPosts(resPosts.data);
      if (resMessages.success) setMessages(resMessages.data);
      if (resNotifs.success) setNotifications(resNotifs.data);
      if (resGallery.success) setGallery(resGallery.data);
      if (resStats.success) setStats(resStats.data);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  }, [currentRole, currentUser.id]);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 6000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  // Synchronize CSS custom properties when settings change
  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      const th = settings.theme;
      root.style.setProperty('--color-primary', th.primaryColor || '#f59e0b');
      root.style.setProperty('--color-secondary', th.secondaryColor || '#10b981');
      root.style.setProperty('--color-bg', th.bgColor || '#0a0a0a');
      root.style.setProperty('--color-card-bg', th.cardBgColor || '#171717');
      root.style.setProperty('--color-text', th.textColor || '#f5f5f5');
      root.style.setProperty('--color-button', th.buttonColor || '#f59e0b');
      root.style.setProperty('--color-button-text', th.buttonTextColor || '#0a0a0a');
    }
  }, [settings?.theme]);

  // Actions
  const toggleSalonStatus = async (forcedStatus?: boolean) => {
    try {
      const res = await fetch('/api/settings/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: forcedStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showToast(data.data.isOpen ? t('salonIsOpen') : t('salonIsClosed'), data.data.isOpen ? 'success' : 'error');
        refreshAll();
      }
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar estado del salón', 'error');
    }
  };

  const updateSettings = async (newSettings: Partial<BusinessSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showToast('Modificaciones guardadas en la base de datos', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      showToast('Error al guardar configuración', 'error');
      return false;
    }
  };

  const updateTheme = async (newTheme: Partial<ThemeConfig>): Promise<boolean> => {
    if (!settings) return false;
    const mergedTheme = { ...settings.theme, ...newTheme };
    return updateSettings({ theme: mergedTheme });
  };

  const applyThemePreset = async (presetKey: string): Promise<boolean> => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return false;
    return updateSettings({ theme: preset.theme });
  };

  const updateSectionsVisibility = async (sections: Partial<SectionsVisibility>): Promise<boolean> => {
    if (!settings) return false;
    const merged = { ...settings.sectionsVisibility, ...sections };
    return updateSettings({ sectionsVisibility: merged });
  };

  const updateCustomButtons = async (buttons: Partial<CustomButtons>): Promise<boolean> => {
    if (!settings) return false;
    const merged = { ...settings.customButtons, ...buttons };
    return updateSettings({ customButtons: merged });
  };

  const updateLogo = async (logoUrl: string): Promise<boolean> => {
    return updateSettings({ logoUrl });
  };

  const removeLogo = async (): Promise<boolean> => {
    return updateSettings({ logoUrl: '' });
  };

  const updateHours = async (newHours: BusinessHour[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHours)
      });
      const data = await res.json();
      if (data.success) {
        setHours(data.data);
        showToast('Horarios actualizados con éxito', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      showToast('Error al guardar horarios', 'error');
      return false;
    }
  };

  const createService = async (service: Partial<Service>): Promise<boolean> => {
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Servicio agregado correctamente', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      showToast('Error al crear servicio', 'error');
      return false;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Servicio actualizado', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      showToast('Error al editar servicio', 'error');
      return false;
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Servicio eliminado', 'info');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createAppointment = async (formData: {
    clientName: string;
    clientPhone: string;
    serviceId: string;
    serviceName: string;
    price: number;
    date: string;
    time: string;
    notes?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.id
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(t('bookingSuccess'), 'success');
        refreshAll();
        return true;
      } else {
        showToast(data.message || 'Error al agendar cita', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión', 'error');
      return false;
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<boolean> => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Reserva ${status}`, 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createPost = async (data: {
    title: string;
    content: string;
    mediaUrls: string[];
    type: Post['type'];
    isImportant: boolean;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        showToast('Publicación lanzada exitosamente', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        showToast('Publicación eliminada', 'info');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const toggleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? data.data : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addGalleryPhoto = async (data: {
    title: string;
    category: GalleryItem['category'];
    imageUrl: string;
    description?: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        showToast('Foto agregada a la galería', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteGalleryPhoto = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        showToast('Foto eliminada', 'info');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const sendMessage = async (text: string, recipientId?: string, recipientName?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentRole,
          recipientId: recipientId || (currentRole === 'client' ? 'usr_owner_1' : 'usr_client_1'),
          recipientName: recipientName || (currentRole === 'client' ? 'Barbero Afrobelleza' : 'Cliente'),
          conversationId: currentRole === 'client' ? currentUser.id : recipientId || 'usr_client_1'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Mensaje enviado', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      showToast('Error al enviar mensaje', 'error');
      return false;
    }
  };

  const markMessagesRead = async (conversationId?: string) => {
    try {
      await fetch('/api/messages/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, role: currentRole })
      });
      refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
      refreshAll();
      showToast('Notificaciones marcadas como leídas', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const sendBroadcastNotification = async (title: string, message: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Notificación masiva enviada a todos los clientes', 'success');
        refreshAll();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // WhatsApp helpers
  const openWhatsApp = (customMessage?: string) => {
    const phone = (settings?.whatsapp || '+52 962 447 0847').replace(/[^0-9]/g, '');
    const defaultText = lang === 'fr' 
      ? `Bonjour Afrobelleza Barber Shop, je souhaite obtenir des informations sur vos services.` 
      : `Hola Afrobelleza Barber Shop, me gustaría solicitar informes o agendar una cita.`;
    const text = encodeURIComponent(customMessage || defaultText);
    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyWhatsAppNumber = () => {
    const rawNumber = settings?.whatsapp || '+52 962 447 0847';
    navigator.clipboard.writeText(rawNumber);
    showToast(t('numberCopied'), 'success');
  };

  const unreadMessagesCount = messages.filter(m => !m.isRead && m.senderRole !== currentRole).length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      lang,
      setLang,
      t,
      isOnboarded,
      submitOnboarding,
      resetOnboarding,
      currentRole,
      setRole,
      currentUser,
      switchRole,
      activeTab,
      setActiveTab,
      selectedServiceForBooking,
      setSelectedServiceForBooking,
      settings,
      hours,
      services,
      appointments,
      posts,
      messages,
      notifications,
      gallery,
      stats,
      loading,
      refreshAll,
      toggleSalonStatus,
      updateSettings,
      updateTheme,
      applyThemePreset,
      updateSectionsVisibility,
      updateCustomButtons,
      updateLogo,
      removeLogo,
      updateHours,
      createService,
      updateService,
      deleteService,
      createAppointment,
      updateAppointmentStatus,
      createPost,
      deletePost,
      toggleLikePost,
      addGalleryPhoto,
      deleteGalleryPhoto,
      sendMessage,
      markMessagesRead,
      markAllNotificationsRead,
      sendBroadcastNotification,
      openWhatsApp,
      copyWhatsAppNumber,
      toasts,
      showToast,
      showNotificationsModal,
      setShowNotificationsModal,
      showSettingsModal,
      setShowSettingsModal,
      unreadMessagesCount,
      unreadNotificationsCount
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
