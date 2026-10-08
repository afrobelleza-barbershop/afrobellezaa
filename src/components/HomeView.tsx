import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Calendar, 
  MessageCircle, 
  Scissors, 
  Heart, 
  Clock, 
  MapPin, 
  Copy, 
  ChevronRight, 
  Sparkles, 
  Phone,
  CheckCircle2,
  Share2,
  ExternalLink
} from 'lucide-react';
import type { Service, Post } from '../types/index.ts';

export const HomeView: React.FC = () => {
  const { 
    settings, 
    hours, 
    services, 
    posts, 
    gallery, 
    t, 
    lang,
    setActiveTab, 
    setSelectedServiceForBooking, 
    openWhatsApp, 
    copyWhatsAppNumber, 
    toggleLikePost,
    currentUser
  } = useApp();

  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>('all');

  const isOpen = settings?.isOpen ?? true;
  const salonName = settings?.name || 'AFROBELLEZA BARBER SHOP';
  const whatsappNum = settings?.whatsapp || '+52 962 447 0847';
  const heroImg = settings?.heroImageUrl || '/src/assets/images/afrobelleza_hero_shop_1791472955050.jpg';

  const bookBtnText = lang === 'fr' 
    ? (settings?.customButtons?.bookButtonTextFr || t('bookAppointment')) 
    : (settings?.customButtons?.bookButtonTextEs || t('bookAppointment'));

  const whatsappBtnText = lang === 'fr' 
    ? (settings?.customButtons?.whatsappButtonTextFr || t('contactWhatsApp')) 
    : (settings?.customButtons?.whatsappButtonTextEs || t('contactWhatsApp'));

  const servicesBtnText = lang === 'fr' 
    ? (settings?.customButtons?.servicesButtonTextFr || t('viewServices')) 
    : (settings?.customButtons?.servicesButtonTextEs || t('viewServices'));

  const showNews = settings?.sectionsVisibility?.showNews ?? true;
  const showServices = settings?.sectionsVisibility?.showServices ?? true;
  const showGallery = settings?.sectionsVisibility?.showGallery ?? true;
  const showHours = settings?.sectionsVisibility?.showHours ?? true;
  const showContact = settings?.sectionsVisibility?.showContact ?? true;

  const handleBookService = (srv: Service) => {
    setSelectedServiceForBooking(srv);
    setActiveTab('book');
  };

  const filteredGallery = activeGalleryFilter === 'all' 
    ? gallery.slice(0, 4) 
    : gallery.filter(g => g.category === activeGalleryFilter).slice(0, 4);

  return (
    <div className="space-y-12 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
        <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
          <img
            src={heroImg}
            alt={salonName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-700"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-4xl">
            {/* Status & Location Line (Anti-slop zero-pill) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide mb-3">
              <span className={`flex items-center gap-1.5 font-bold ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                {isOpen ? `🟢 ${t('open')}` : `🔴 ${t('closed')}`}
              </span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span className="text-neutral-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {settings?.city || 'Tapachula, Chiapas, México 🇲🇽'}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase leading-tight text-balance">
              {settings?.heroTitle || salonName}
            </h1>
            
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {settings?.heroSubtitle || settings?.tagline || t('tagline')}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('book')}
                className="min-h-[48px] px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-wider uppercase cursor-pointer"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>{bookBtnText}</span>
              </button>

              <button
                onClick={() => openWhatsApp()}
                className="min-h-[48px] px-5 py-3 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 border border-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-wider uppercase cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{whatsappBtnText}</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className="min-h-[48px] px-5 py-3 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 border border-neutral-700 hover:text-white transition-all tracking-wider uppercase cursor-pointer"
              >
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>{servicesBtnText}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOVEDADES & PUBLICACIONES */}
      {showNews && (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {t('sectionNews')}
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {lang === 'fr' ? 'Dernières actualités & styles' : 'Lo más nuevo en el salón'}
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('news')}
            className="text-xs font-semibold text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <span>{lang === 'fr' ? 'Voir tout' : 'Ver todo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900/50 rounded-2xl border border-neutral-800 text-neutral-400">
            No hay publicaciones recientes.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {posts.slice(0, 3).map((post: Post) => {
              const isLiked = post.likedBy?.includes(currentUser.id);
              const isNew = (Date.now() - new Date(post.createdAt).getTime()) < (1000 * 3600 * 36);

              return (
                <article 
                  key={post.id}
                  className="group bg-neutral-900 rounded-2xl border border-neutral-800/80 overflow-hidden flex flex-col hover:border-neutral-700 transition-all shadow-md"
                >
                  {post.mediaUrls?.[0] && (
                    <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
                      <img
                        src={post.mediaUrls[0]}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isNew && (
                        <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          {t('newBadge')}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <span className="capitalize text-amber-400/90 font-medium">{post.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(post.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'es-MX', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white mt-1 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`min-h-[36px] px-3 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          isLiked 
                            ? 'text-rose-400 bg-rose-950/40 border border-rose-900/60' 
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span className="font-mono tabular-nums">{post.likesCount}</span>
                        <span className="text-[11px]">{t('like')}</span>
                      </button>

                      <button
                        onClick={() => openWhatsApp(`Hola, vi su publicación "${post.title}" y quiero más información.`)}
                        className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Consultar</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      )}

      {/* 3. NUESTROS SERVICIOS */}
      {showServices && (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {t('sectionServices')}
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {lang === 'fr' ? 'Prestations & Tarifs' : 'Servicios de Barbería Profesional'}
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('services')}
            className="text-xs font-semibold text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <span>{lang === 'fr' ? 'Voir tous les services' : 'Ver catálogo completo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map((service: Service) => {
            const displayName = lang === 'fr' && service.nameFr ? service.nameFr : service.name;
            const displayDesc = lang === 'fr' && service.descriptionFr ? service.descriptionFr : service.description;

            return (
              <div 
                key={service.id}
                className="bg-neutral-900 rounded-2xl border border-neutral-800/80 p-4 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0">
                    <img 
                      src={service.imageUrl || '/src/assets/images/barber_fade_cut_1791472965182.jpg'} 
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-sm sm:text-base text-white truncate group-hover:text-amber-400 transition-colors">
                      {displayName}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {displayDesc}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        {service.durationMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-500 uppercase">{t('price')}</span>
                    <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                      ${service.price} <span className="text-xs font-normal text-neutral-400">MXN</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookService(service)}
                    className="min-h-[38px] px-3.5 py-1.5 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('bookAppointment')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* 4. GALERÍA PREVIEW */}
      {showGallery && (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {t('sectionGallery')}
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {t('galleryTitle')}
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('gallery')}
            className="text-xs font-semibold text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <span>{lang === 'fr' ? 'Galerie complète' : 'Ver galería'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'cortes', 'barbas', 'diseños', 'salon'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveGalleryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                activeGalleryFilter === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? (lang === 'fr' ? 'Tous' : 'Todos') : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredGallery.map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab('gallery')}
              className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white leading-tight">{item.title}</span>
                <span className="text-[10px] text-amber-400 capitalize">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* 5. HORARIOS DE ATENCIÓN */}
      {showHours && (
      <section className="bg-neutral-900/80 rounded-2xl sm:rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {t('sectionHours')}
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {lang === 'fr' ? 'Jours & Horaires d’Ouverture' : 'Días y Horarios Disponibles'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-extrabold rounded-lg ${isOpen ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {isOpen ? `🟢 ${t('open')}` : `🔴 ${t('closed')}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hours.map((h) => {
            const dayName = lang === 'fr' ? h.dayNameFr : h.dayNameEs;
            return (
              <div 
                key={h.id}
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
                  h.isOpen 
                    ? 'bg-neutral-950/60 border-neutral-800' 
                    : 'bg-neutral-950/30 border-neutral-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${h.isOpen ? 'text-amber-500' : 'text-neutral-600'}`} />
                  <span className="text-xs font-bold text-white capitalize">{dayName}</span>
                </div>
                <div className="text-xs font-mono tabular-nums text-neutral-300">
                  {h.isOpen ? (
                    <span className="font-medium text-amber-400/90">{h.openTime} - {h.closeTime}</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">{t('closedDay')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* 6. CONTACTO & WHATSAPP CARD */}
      {showContact && (
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl sm:rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            {t('sectionContact')}
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
            {salonName}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {settings?.address || 'Av. Central Sur #45, Tapachula, Chiapas, México'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp Card */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t('sectionWhatsApp')}</span>
              </div>
              <span className="text-[11px] text-emerald-400/80 font-semibold">Oficial 🇲🇽</span>
            </div>

            <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
              {whatsappNum}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => openWhatsApp()}
                className="flex-1 min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors uppercase"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('contactWhatsApp')}</span>
              </button>

              <button
                onClick={copyWhatsAppNumber}
                className="min-h-[44px] px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                title={t('copyNumber')}
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">{t('copyNumber')}</span>
              </button>
            </div>
          </div>

          {/* Location & Chat Direct Card */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Ubicación & Mensajes</span>
              </div>
              <p className="text-sm font-semibold text-white mt-2">
                {settings?.address || 'Tapachula, Chiapas, México'}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                ¿Prefieres escribir directamente en la aplicación sin abrir WhatsApp? Usa nuestra mensajería interna.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('messages')}
                className="w-full min-h-[44px] px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>{t('sendMessage')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
