import React, { useState } from 'react';
import { useApp, THEME_PRESETS } from '../context/AppContext.tsx';
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Scissors, 
  Sparkles, 
  Image as ImageIcon, 
  Clock, 
  Bell, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  Save, 
  Power, 
  Users, 
  Heart, 
  Palette, 
  Layers, 
  Eye, 
  EyeOff, 
  Upload, 
  Check, 
  HelpCircle,
  Type,
  FileImage,
  RefreshCw,
  Download
} from 'lucide-react';
import type { 
  Service, 
  BusinessHour, 
  Post, 
  Appointment, 
  GalleryItem,
  ThemeConfig,
  SectionsVisibility,
  CustomButtons
} from '../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    updateTheme,
    applyThemePreset,
    updateSectionsVisibility,
    updateCustomButtons,
    updateLogo,
    removeLogo,
    toggleSalonStatus, 
    stats, 
    appointments, 
    updateAppointmentStatus, 
    services, 
    createService, 
    updateService, 
    deleteService, 
    hours, 
    updateHours, 
    posts, 
    createPost, 
    deletePost, 
    gallery, 
    addGalleryPhoto, 
    deleteGalleryPhoto, 
    sendBroadcastNotification, 
    t, 
    lang, 
    setActiveTab,
    resetOnboarding
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'customize' | 'photos' | 'bookings' | 'services' | 'posts' | 'hours' | 'notifications' | 'settings'
  >('overview');

  const isOpen = settings?.isOpen ?? true;

  // 1. General Settings Form
  const [formDataSettings, setFormDataSettings] = useState({
    name: settings?.name || '',
    whatsapp: settings?.whatsapp || '',
    address: settings?.address || '',
    city: settings?.city || '',
    heroTitle: settings?.heroTitle || '',
    heroSubtitle: settings?.heroSubtitle || '',
    heroImageUrl: settings?.heroImageUrl || '',
    instagram: settings?.instagram || '',
    allowBookingWhenClosed: settings?.allowBookingWhenClosed ?? true
  });

  // 2. Custom Theme state
  const [themeForm, setThemeForm] = useState<ThemeConfig>({
    preset: settings?.theme?.preset || 'gold-obsidian',
    primaryColor: settings?.theme?.primaryColor || '#f59e0b',
    secondaryColor: settings?.theme?.secondaryColor || '#10b981',
    bgColor: settings?.theme?.bgColor || '#0a0a0a',
    cardBgColor: settings?.theme?.cardBgColor || '#171717',
    textColor: settings?.theme?.textColor || '#f5f5f5',
    buttonColor: settings?.theme?.buttonColor || '#f59e0b',
    buttonTextColor: settings?.theme?.buttonTextColor || '#0a0a0a',
  });

  // 3. Sections Visibility state
  const [sectionsForm, setSectionsForm] = useState<SectionsVisibility>({
    showNews: settings?.sectionsVisibility?.showNews ?? true,
    showServices: settings?.sectionsVisibility?.showServices ?? true,
    showGallery: settings?.sectionsVisibility?.showGallery ?? true,
    showHours: settings?.sectionsVisibility?.showHours ?? true,
    showContact: settings?.sectionsVisibility?.showContact ?? true,
  });

  // 4. Custom Buttons text state
  const [buttonsForm, setButtonsForm] = useState<CustomButtons>({
    bookButtonTextEs: settings?.customButtons?.bookButtonTextEs || 'RESERVAR CITA',
    bookButtonTextFr: settings?.customButtons?.bookButtonTextFr || 'RÉSERVER UN RENDEZ-VOUS',
    whatsappButtonTextEs: settings?.customButtons?.whatsappButtonTextEs || 'CONTACTAR POR WHATSAPP',
    whatsappButtonTextFr: settings?.customButtons?.whatsappButtonTextFr || 'CONTACTER SUR WHATSAPP',
    servicesButtonTextEs: settings?.customButtons?.servicesButtonTextEs || 'VER SERVICIOS',
    servicesButtonTextFr: settings?.customButtons?.servicesButtonTextFr || 'VOIR LES SERVICES',
  });

  // 5. Logo Management state
  const [logoInput, setLogoInput] = useState(settings?.logoUrl || '');
  const [showLogoModal, setShowLogoModal] = useState(false);

  // 6. Photo Central Hub state
  const [showPhotoHubModal, setShowPhotoHubModal] = useState(false);
  const [photoDestination, setPhotoDestination] = useState<
    'banner' | 'logo' | 'gallery' | 'service' | 'post'
  >('gallery');
  const [photoHubUrl, setPhotoHubUrl] = useState('');
  const [photoHubTitle, setPhotoHubTitle] = useState('');
  const [photoHubCategory, setPhotoHubCategory] = useState<GalleryItem['category']>('cortes');
  const [photoHubTargetServiceId, setPhotoHubTargetServiceId] = useState(services[0]?.id || '');

  // 7. Services state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    nameFr: '',
    description: '',
    descriptionFr: '',
    price: 200,
    durationMinutes: 30,
    category: 'corte' as Service['category'],
    imageUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg'
  });

  // 8. New Post state
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    type: 'promocion' as Post['type'],
    mediaUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    isImportant: true
  });

  // 9. Hours state
  const [editableHours, setEditableHours] = useState<BusinessHour[]>(hours);

  // 10. Broadcast notification state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formDataSettings);
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTheme(themeForm);
  };

  const handlePresetSelect = async (presetKey: string) => {
    await applyThemePreset(presetKey);
    const p = THEME_PRESETS[presetKey];
    if (p) setThemeForm(p.theme);
  };

  const handleSaveSections = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSectionsVisibility(sectionsForm);
  };

  const handleSaveButtons = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCustomButtons(buttonsForm);
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateLogo(logoInput.trim());
    setShowLogoModal(false);
  };

  const handleRemoveLogo = async () => {
    await removeLogo();
    setLogoInput('');
    setShowLogoModal(false);
  };

  // Photo Hub handler
  const handlePhotoHubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoHubUrl.trim()) return;

    const url = photoHubUrl.trim();

    if (photoDestination === 'banner') {
      await updateSettings({ heroImageUrl: url });
      setFormDataSettings(prev => ({ ...prev, heroImageUrl: url }));
    } else if (photoDestination === 'logo') {
      await updateLogo(url);
      setLogoInput(url);
    } else if (photoDestination === 'gallery') {
      await addGalleryPhoto({
        title: photoHubTitle || 'Foto de corte y estilo',
        category: photoHubCategory,
        imageUrl: url,
        description: 'Agregada desde el centro de fotos de administración.'
      });
    } else if (photoDestination === 'service' && photoHubTargetServiceId) {
      await updateService(photoHubTargetServiceId, { imageUrl: url });
    } else if (photoDestination === 'post') {
      await createPost({
        title: photoHubTitle || 'Nuevo trabajo realizado',
        content: 'Descubre este nuevo diseño realizado por nuestros barberos en Afrobelleza.',
        mediaUrls: [url],
        type: 'estilo',
        isImportant: false
      });
    }

    setShowPhotoHubModal(false);
    setPhotoHubUrl('');
    setPhotoHubTitle('');
  };

  // Services
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await updateService(editingService.id, serviceForm);
    } else {
      await createService(serviceForm);
    }
    setShowServiceModal(false);
    setEditingService(null);
  };

  const openEditService = (s: Service) => {
    setEditingService(s);
    setServiceForm({
      name: s.name,
      nameFr: s.nameFr || s.name,
      description: s.description,
      descriptionFr: s.descriptionFr || s.description,
      price: s.price,
      durationMinutes: s.durationMinutes,
      category: s.category,
      imageUrl: s.imageUrl
    });
    setShowServiceModal(true);
  };

  const openNewService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      nameFr: '',
      description: '',
      descriptionFr: '',
      price: 220,
      durationMinutes: 35,
      category: 'corte',
      imageUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg'
    });
    setShowServiceModal(true);
  };

  // Posts
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    await createPost({
      title: postForm.title,
      content: postForm.content,
      mediaUrls: [postForm.mediaUrl],
      type: postForm.type,
      isImportant: postForm.isImportant
    });

    setShowPostModal(false);
    setPostForm({
      title: '',
      content: '',
      type: 'promocion',
      mediaUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
      isImportant: true
    });
  };

  // Hours
  const handleHourChange = (idx: number, field: keyof BusinessHour, val: any) => {
    const updated = [...editableHours];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditableHours(updated);
  };

  const handleSaveHours = async () => {
    await updateHours(editableHours);
  };

  // Notifications
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    await sendBroadcastNotification(broadcastTitle, broadcastMessage);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Top Admin Header with Salon Switch */}
      <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Espace Propriétaire · Contrôle Total
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {settings?.name || 'AFROBELLEZA BARBER SHOP'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Personnalisez tout le contenu, les couleurs, le logo, les photos et les textes en temps réel sans modifier le code.
          </p>
        </div>

        {/* Salon Status Toggle + Reset Onboarding + Download ZIP button */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/afrobelleza-barber-shop.zip"
            download="afrobelleza-barber-shop.zip"
            className="px-3.5 py-2 text-xs font-bold bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            title="Telechaje tout fichye kòd app la (.ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Telechaje ZIP</span>
          </a>

          <button
            onClick={resetOnboarding}
            className="px-3 py-2 text-xs font-semibold bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-xl transition-colors flex items-center gap-1.5"
            title="Tester l'écran de premier lancement (Quel est votre nom ?)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Tester Premier Lancement</span>
          </button>

          <div className="flex items-center gap-3 bg-neutral-950 p-2 rounded-2xl border border-neutral-800">
            <div className="text-left px-2">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">{t('salonStatusToggle')}</span>
              <span className={`text-xs font-black flex items-center gap-1.5 ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                {isOpen ? t('open') : t('closed')}
              </span>
            </div>

            <button
              onClick={() => toggleSalonStatus(!isOpen)}
              className={`min-h-[44px] px-5 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isOpen
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isOpen ? t('closeSalon') : t('openSalon')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: '📊 Aperçu', icon: BarChart3 },
          { id: 'customize', label: '🎨 PERSONNALISER L\'APPLICATION', icon: Palette, highlight: true },
          { id: 'photos', label: '🖼️ GESTION DES PHOTOS', icon: FileImage },
          { id: 'bookings', label: t('adminTabBookings'), icon: Calendar, badge: appointments.filter(a => a.status === 'pendiente').length },
          { id: 'services', label: t('adminTabServices'), icon: Scissors },
          { id: 'posts', label: t('adminTabPosts'), icon: Sparkles },
          { id: 'hours', label: t('adminTabHours'), icon: Clock },
          { id: 'notifications', label: t('adminTabNotifications'), icon: Bell },
          { id: 'settings', label: t('adminTabSettings'), icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`min-h-[42px] px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                  : tab.highlight
                  ? 'bg-amber-950/60 border border-amber-600/50 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badge) && (
                <span className="w-5 h-5 text-[10px] bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase">{t('totalClients')}</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                {stats?.totalClients || 24}
              </div>
            </div>

            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase">{t('totalAppointments')}</span>
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
                {appointments.length}
              </div>
            </div>

            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase">{t('pendingBookings')}</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400 tabular-nums">
                {appointments.filter(a => a.status === 'pendiente').length}
              </div>
            </div>

            <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase">{t('totalLikes')}</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">
                {posts.reduce((s, p) => s + p.likesCount, 0)}
              </div>
            </div>
          </div>

          {/* Quick Hub */}
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
            <h2 className="font-display font-extrabold text-lg text-white">
              Accès Direct aux Modules de Gestion
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveSubTab('customize')}
                className="p-4 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 rounded-2xl text-left transition-colors flex flex-col justify-between h-28"
              >
                <Palette className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-xs font-extrabold text-white block">Personnaliser l'Application</span>
                  <span className="text-[10px] text-amber-300/80">Couleurs, Textes, Boutons</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSubTab('photos')}
                className="p-4 bg-neutral-950 hover:bg-neutral-800 rounded-2xl border border-neutral-800 text-left transition-colors flex flex-col justify-between h-28"
              >
                <FileImage className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-xs font-extrabold text-white block">Gestion des Photos</span>
                  <span className="text-[10px] text-neutral-400">Bannières, Galerie, Services</span>
                </div>
              </button>

              <button
                onClick={() => { setActiveSubTab('posts'); setShowPostModal(true); }}
                className="p-4 bg-neutral-950 hover:bg-neutral-800 rounded-2xl border border-neutral-800 text-left transition-colors flex flex-col justify-between h-28"
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-xs font-extrabold text-white block">{t('newPostButton')}</span>
                  <span className="text-[10px] text-neutral-400">Annonces & Styles</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className="p-4 bg-neutral-950 hover:bg-neutral-800 rounded-2xl border border-neutral-800 text-left transition-colors flex flex-col justify-between h-28"
              >
                <MessageSquare className="w-6 h-6 text-amber-400" />
                <div>
                  <span className="text-xs font-extrabold text-white block">Messagerie Clients</span>
                  <span className="text-[10px] text-neutral-400">Répondre aux demandes</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PERSONNALISER L'APPLICATION */}
      {activeSubTab === 'customize' && (
        <div className="space-y-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Panneau de Contrôle Esthétique & Structurel
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              PERSONNALISER L'APPLICATION
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
              Modifiez l'apparence, les couleurs, le logo, les boutons et les sections. Chaque modification est sauvegardée dans la base de données et appliquée immédiatement aux clients.
            </p>
          </div>

          {/* 1. GESTION DU LOGO */}
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                  <span>🏷️ GESTION DU LOGO DU SALON</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Ajoutez, remplacez ou supprimez le logo de l'application. S'il n'y a pas de logo, le monogramme textuel "AB" est affiché.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogoModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors uppercase"
                >
                  {settings?.logoUrl ? 'Remplacer le logo' : 'Ajouter un logo'}
                </button>
                {settings?.logoUrl && (
                  <button
                    onClick={handleRemoveLogo}
                    className="px-3 py-2 bg-neutral-800 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Supprimer le logo
                  </button>
                )}
              </div>
            </div>

            {/* Current Logo Preview */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center overflow-hidden">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                ) : (
                  <span className="font-black text-amber-500 text-xl">AB</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {settings?.logoUrl ? 'Logo personnalisé actif' : 'Monogramme officiel par défaut'}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {settings?.logoUrl || 'Aucun fichier logo externe'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. GESTION DES COULEURS & THÈME */}
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <span>🎨 GESTION DES COULEURS & THÈME VISUEL</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sélectionnez un thème prédéfini ou personnalisez précisément les couleurs de l'application.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Thèmes Prédéfinis :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(THEME_PRESETS).map(([key, item]) => {
                  const isSelected = settings?.theme?.preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-neutral-950 shadow-md ring-1 ring-amber-500'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full border border-black/30" style={{ backgroundColor: item.theme.primaryColor }} />
                        <span className="w-5 h-5 rounded-full border border-black/30" style={{ backgroundColor: item.theme.secondaryColor }} />
                        <span className="w-5 h-5 rounded-full border border-black/30" style={{ backgroundColor: item.theme.bgColor }} />
                        <span className="w-5 h-5 rounded-full border border-black/30" style={{ backgroundColor: item.theme.cardBgColor }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fine Color Pickers */}
            <form onSubmit={handleSaveTheme} className="space-y-4 pt-4 border-t border-neutral-800">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Personnalisation Manuelle des Teintes :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Couleur Principale</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.primaryColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.primaryColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Couleur Secondaire</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.secondaryColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.secondaryColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Couleur des Boutons</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.buttonColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.buttonColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Texte des Boutons</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.buttonTextColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.buttonTextColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Fond Général</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.bgColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.bgColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, bgColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400">Fond des Cartes</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeForm.cardBgColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, cardBgColor: e.target.value }))}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeForm.cardBgColor}
                      onChange={(e) => setThemeForm(prev => ({ ...prev, cardBgColor: e.target.value }))}
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded px-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Couleurs</span>
              </button>
            </form>
          </div>

          {/* 3. VISIBILITÉ DES SECTIONS */}
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
            <div>
              <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <span>👁️ GESTION DES SECTIONS DE LA PAGE D'ACCUEIL</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Activez ou désactivez les blocs de la page d'accueil. Si une section est masquée, elle disparaît immédiatement pour tous les clients.
              </p>
            </div>

            <form onSubmit={handleSaveSections} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'showNews', label: 'Section Nouveautés & Styles (Novedades)' },
                  { key: 'showServices', label: 'Section Prestations & Tarifs (Servicios)' },
                  { key: 'showGallery', label: 'Section Galerie de Réalisations (Galería)' },
                  { key: 'showHours', label: 'Section Horaires d’Ouverture (Horarios)' },
                  { key: 'showContact', label: 'Section Contact & WhatsApp (Contacto)' },
                ].map(({ key, label }) => {
                  const isChecked = sectionsForm[key as keyof SectionsVisibility];
                  return (
                    <label
                      key={key}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-neutral-950 border-emerald-800/80 text-white'
                          : 'bg-neutral-950/40 border-neutral-800 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-neutral-600" />}
                        <span className="text-xs font-bold">{label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setSectionsForm(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded text-amber-500"
                      />
                    </label>
                  );
                })}
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Visibilité des Sections</span>
              </button>
            </form>
          </div>

          {/* 4. TEXTES DES BOUTONS */}
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
            <div>
              <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
                <span>✍️ TEXTES PERSONNALISÉS DES BOUTONS D'ACCUEIL</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Modifiez le libellé des boutons principaux (en espagnol et en français).
              </p>
            </div>

            <form onSubmit={handleSaveButtons} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300">Bouton Réservation</label>
                  <input
                    type="text"
                    value={buttonsForm.bookButtonTextEs}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, bookButtonTextEs: e.target.value }))}
                    placeholder="Espagnol: RESERVAR CITA"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={buttonsForm.bookButtonTextFr}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, bookButtonTextFr: e.target.value }))}
                    placeholder="Français: RÉSERVER UN RENDEZ-VOUS"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300">Bouton WhatsApp</label>
                  <input
                    type="text"
                    value={buttonsForm.whatsappButtonTextEs}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, whatsappButtonTextEs: e.target.value }))}
                    placeholder="Espagnol: CONTACTAR POR WHATSAPP"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={buttonsForm.whatsappButtonTextFr}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, whatsappButtonTextFr: e.target.value }))}
                    placeholder="Français: CONTACTER SUR WHATSAPP"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300">Bouton Services</label>
                  <input
                    type="text"
                    value={buttonsForm.servicesButtonTextEs}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, servicesButtonTextEs: e.target.value }))}
                    placeholder="Espagnol: VER SERVICIOS"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={buttonsForm.servicesButtonTextFr}
                    onChange={(e) => setButtonsForm(prev => ({ ...prev, servicesButtonTextFr: e.target.value }))}
                    placeholder="Français: VOIR LES SERVICES"
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Libellés des Boutons</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GESTION DES PHOTOS CENTRALISÉE */}
      {activeSubTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Centre de Médias
              </div>
              <h2 className="font-display font-black text-2xl text-white">
                GESTION DE TOUTES LES PHOTOS
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Ajoutez, remplacez ou assignez vos photos directement vers la Bannière principale, le Logo, la Galerie, ou les Services.
              </p>
            </div>

            <button
              onClick={() => setShowPhotoHubModal(true)}
              className="min-h-[44px] px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-md uppercase self-start"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Ajouter / Assigner une photo</span>
            </button>
          </div>

          {/* Current Key Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner current */}
            <div className="p-5 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Bannière Principale Accueil</span>
                <button
                  onClick={() => {
                    setPhotoDestination('banner');
                    setShowPhotoHubModal(true);
                  }}
                  className="text-xs text-neutral-400 hover:text-white underline font-semibold"
                >
                  Remplacer
                </button>
              </div>
              <div className="h-44 rounded-2xl overflow-hidden bg-neutral-950">
                <img
                  src={settings?.heroImageUrl || '/src/assets/images/afrobelleza_hero_shop_1791472955050.jpg'}
                  alt="Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Logo current */}
            <div className="p-5 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Logo Officiel</span>
                <button
                  onClick={() => setShowLogoModal(true)}
                  className="text-xs text-neutral-400 hover:text-white underline font-semibold"
                >
                  Remplacer / Modifier
                </button>
              </div>
              <div className="h-44 rounded-2xl bg-neutral-950 flex items-center justify-center p-4">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" referrerPolicy="no-referrer" className="max-h-36 max-w-full object-contain" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center font-black text-2xl text-neutral-950">
                    AB
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Photos list in gallery */}
          <div className="space-y-3">
            <h3 className="font-display font-extrabold text-base text-white">
              Photos dans la Galerie ({gallery.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden group relative">
                  <img src={g.imageUrl} alt={g.title} referrerPolicy="no-referrer" className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <span className="text-xs font-bold text-white block truncate">{g.title}</span>
                    <span className="text-[10px] text-amber-400 capitalize">{g.category}</span>
                  </div>
                  <button
                    onClick={() => deleteGalleryPhoto(g.id)}
                    className="absolute top-2 right-2 p-1.5 bg-neutral-950/80 hover:bg-rose-950 hover:text-rose-400 text-white rounded-lg transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: BOOKINGS */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white">
              Gestión de Citas y Reservas ({appointments.length})
            </h2>
          </div>

          {appointments.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-400">
              No hay citas registradas.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{app.clientName}</span>
                      <span className="text-xs text-neutral-500 font-mono">({app.clientPhone})</span>
                    </div>
                    <div className="text-xs text-amber-400 font-semibold">
                      {app.serviceName} · ${app.price} MXN
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2">
                      <span>📅 {app.date} a las {app.time}</span>
                      {app.notes && <span className="italic text-neutral-500">· "{app.notes}"</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                      app.status === 'confirmada' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      app.status === 'rechazada' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {app.status}
                    </span>

                    {app.status === 'pendiente' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'confirmada')}
                          className="min-h-[36px] px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('confirm')}</span>
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'rechazada')}
                          className="min-h-[36px] px-3 bg-neutral-800 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{t('reject')}</span>
                        </button>
                      </>
                    )}

                    {app.status === 'confirmada' && (
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'completada')}
                        className="min-h-[36px] px-3 bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Marcar Completada
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: SERVICES */}
      {activeSubTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white">
              Catálogo de Servicios & Precios ({services.length})
            </h2>
            <button
              onClick={openNewService}
              className="min-h-[40px] px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('newServiceButton')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-start justify-between gap-4"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 shrink-0">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-500 uppercase font-bold">{service.category}</span>
                    <h3 className="font-bold text-white text-sm">{service.name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-1">{service.description}</p>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                      ${service.price} MXN · {service.durationMinutes} min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditService(service)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                    title={t('edit')}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: POSTS */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white">
              Publicaciones & Novedades ({posts.length})
            </h2>
            <button
              onClick={() => setShowPostModal(true)}
              className="min-h-[40px] px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('newPostButton')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-amber-500">{post.type}</span>
                    {post.isImportant && (
                      <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded font-bold">
                        Importante
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base">{post.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{post.content}</p>
                  <div className="text-xs text-neutral-500 flex items-center gap-2 pt-1 font-mono">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{post.likesCount} {t('like')}s</span>
                  </div>
                </div>

                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg shrink-0"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: HOURS */}
      {activeSubTab === 'hours' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-white">
              Configuración de Horarios de Atención
            </h2>
            <button
              onClick={handleSaveHours}
              className="min-h-[40px] px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          </div>

          <div className="space-y-3">
            {editableHours.map((h, idx) => (
              <div
                key={h.id}
                className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={h.isOpen}
                    onChange={(e) => handleHourChange(idx, 'isOpen', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-bold text-sm text-white capitalize w-24">
                    {lang === 'fr' ? h.dayNameFr : h.dayNameEs}
                  </span>
                </div>

                {h.isOpen ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Apertura:</span>
                    <input
                      type="time"
                      value={h.openTime}
                      onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                    />
                    <span className="text-xs text-neutral-400">Cierre:</span>
                    <input
                      type="time"
                      value={h.closeTime}
                      onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                      className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-rose-400 font-bold uppercase">
                    {t('closedDay')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 8: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="max-w-xl space-y-6">
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">
              {t('sendNotificationButton')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Diffusez instantanément une alerte ou promotion à l'ensemble des clients connectés.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">Titre de la notification *</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Ex. 15% de rabais sur le forfait coupe + barbe !"
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">Message détaillé *</label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Détails de l'annonce envoyée à tous les clients..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Envoyer à tous les clients</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 9: GENERAL SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">
              {t('navSettings')} du Salon
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Modifiez le nom officiel, le numéro WhatsApp, l'adresse physique et les liens des réseaux sociaux.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">{t('businessNameField')} *</label>
              <input
                type="text"
                required
                value={formDataSettings.name}
                onChange={(e) => setFormDataSettings(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">{t('whatsappField')} *</label>
              <input
                type="text"
                required
                value={formDataSettings.whatsapp}
                onChange={(e) => setFormDataSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-neutral-500">
                Numéro WhatsApp officiel (par défaut +52 962 447 0847). Modifiable dynamiquement partout.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">{t('addressField')}</label>
                <input
                  type="text"
                  value={formDataSettings.address}
                  onChange={(e) => setFormDataSettings(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Ville / État</label>
                <input
                  type="text"
                  value={formDataSettings.city}
                  onChange={(e) => setFormDataSettings(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">{t('heroTitleField')}</label>
              <input
                type="text"
                value={formDataSettings.heroTitle}
                onChange={(e) => setFormDataSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">{t('heroSubtitleField')}</label>
              <input
                type="text"
                value={formDataSettings.heroSubtitle}
                onChange={(e) => setFormDataSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="allowBooking"
                checked={formDataSettings.allowBookingWhenClosed}
                onChange={(e) => setFormDataSettings(prev => ({ ...prev, allowBookingWhenClosed: e.target.checked }))}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="allowBooking" className="text-xs font-medium text-neutral-300 cursor-pointer">
                {t('allowBookingLabel')}
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          </form>
        </div>
      )}

      {/* LOGO MODAL */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white">
              {settings?.logoUrl ? 'Remplacer le Logo' : 'Ajouter un Logo'}
            </h3>
            <p className="text-xs text-neutral-400">
              Entrez l'URL de votre image de logo (format PNG, JPG ou SVG).
            </p>

            <form onSubmit={handleSaveLogo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">URL du Logo</label>
                <input
                  type="text"
                  required
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  placeholder="https://... ou /src/assets/..."
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                />
              </div>

              {logoInput && (
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center h-24">
                  <img src={logoInput} alt="Preview" referrerPolicy="no-referrer" className="max-h-20 max-w-full object-contain" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl uppercase"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO HUB MODAL */}
      {showPhotoHubModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white">
              Ajouter / Assigner une Photo
            </h3>
            <p className="text-xs text-neutral-400">
              Choisissez où la photo doit apparaître dans l'application.
            </p>

            <form onSubmit={handlePhotoHubSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Destination de la photo *</label>
                <select
                  value={photoDestination}
                  onChange={(e) => setPhotoDestination(e.target.value as any)}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                >
                  <option value="banner">Bannière principale (Hero)</option>
                  <option value="logo">Logo officiel du salon</option>
                  <option value="gallery">Galerie de réalisations</option>
                  <option value="service">Associer à un Service existant</option>
                  <option value="post">Créer une Publication avec cette photo</option>
                </select>
              </div>

              {photoDestination === 'service' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Service cible</label>
                  <select
                    value={photoHubTargetServiceId}
                    onChange={(e) => setPhotoHubTargetServiceId(e.target.value)}
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Titre ou description</label>
                <input
                  type="text"
                  value={photoHubTitle}
                  onChange={(e) => setPhotoHubTitle(e.target.value)}
                  placeholder="Ex. Dégradé Taper Fade Premium"
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">URL de l'image *</label>
                <input
                  type="text"
                  required
                  value={photoHubUrl}
                  onChange={(e) => setPhotoHubUrl(e.target.value)}
                  placeholder="/src/assets/... ou URL externe"
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                />
                <div className="flex gap-2 pt-1 text-[11px] text-neutral-400">
                  <span>Modèles :</span>
                  <button type="button" onClick={() => setPhotoHubUrl('/src/assets/images/barber_fade_cut_1791472965182.jpg')} className="text-amber-400 underline">Fade</button>
                  <button type="button" onClick={() => setPhotoHubUrl('/src/assets/images/barber_beard_sculpt_1791472974300.jpg')} className="text-amber-400 underline">Barbe</button>
                  <button type="button" onClick={() => setPhotoHubUrl('/src/assets/images/barber_interior_salon_1791472983242.jpg')} className="text-amber-400 underline">Salón</button>
                  <button type="button" onClick={() => setPhotoHubUrl('/src/assets/images/barber_artistic_design_1791472991635.jpg')} className="text-amber-400 underline">Design</button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoHubModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl uppercase"
                >
                  Assigner la photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white">
              {editingService ? t('edit') + ' Servicio' : t('newServiceButton')}
            </h3>

            <form onSubmit={handleServiceSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Nombre (Español) *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Nom (Français)</label>
                <input
                  type="text"
                  value={serviceForm.nameFr}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, nameFr: e.target.value }))}
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Precio (MXN) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-300">Duración (min) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.durationMinutes}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, durationMinutes: Number(e.target.value) }))}
                    className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Categoría</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                >
                  <option value="corte">Corte</option>
                  <option value="barba">Barba</option>
                  <option value="combo">Combo</option>
                  <option value="diseno">Diseño</option>
                  <option value="tratamiento">Tratamiento</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Descripción</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white">
              {t('newPostButton')}
            </h3>

            <form onSubmit={handlePostSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Título de la publicación *</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej. Promoción de fin de semana"
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Tipo</label>
                <select
                  value={postForm.type}
                  onChange={(e) => setPostForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white"
                >
                  <option value="promocion">Promoción</option>
                  <option value="estilo">Nuevo Estilo / Corte</option>
                  <option value="anuncio">Anuncio Oficial</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Contenido / Texto *</label>
                <textarea
                  rows={3}
                  required
                  value={postForm.content}
                  onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Detalles de la publicación..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">URL de imagen</label>
                <input
                  type="text"
                  value={postForm.mediaUrl}
                  onChange={(e) => setPostForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                  className="w-full h-10 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="postImportant"
                  checked={postForm.isImportant}
                  onChange={(e) => setPostForm(prev => ({ ...prev, isImportant: e.target.checked }))}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <label htmlFor="postImportant" className="text-xs text-neutral-300">
                  Marcar como Novedad destacada con badge 🔴 NUEVO
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl uppercase"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
