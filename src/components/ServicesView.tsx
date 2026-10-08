import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Scissors, Clock, Calendar, Check, Sparkles } from 'lucide-react';
import type { Service } from '../types/index.ts';

export const ServicesView: React.FC = () => {
  const { services, t, lang, setActiveTab, setSelectedServiceForBooking } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t('allCategories') },
    { id: 'corte', label: t('catCorte') },
    { id: 'barba', label: t('catBarba') },
    { id: 'combo', label: t('catCombo') },
    { id: 'diseno', label: t('catDiseno') },
    { id: 'tratamiento', label: t('catTratamiento') },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const handleBook = (service: Service) => {
    setSelectedServiceForBooking(service);
    setActiveTab('book');
  };

  return (
    <div className="space-y-8 pb-24">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
          {t('sectionServices')}
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
          {lang === 'fr' ? 'Nos Prestations Barber Shop' : 'Menú de Servicios Profesionales'}
        </h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-xl">
          {lang === 'fr' 
            ? 'Chaque prestation inclut un diagnostic morphologique, des produits haut de gamme et une finition rasoir.' 
            : 'Cada servicio incluye asesoramiento de imagen, productos prémium y acabado a navaja con toalla caliente.'}
        </p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredServices.map((service) => {
          const displayName = lang === 'fr' && service.nameFr ? service.nameFr : service.name;
          const displayDesc = lang === 'fr' && service.descriptionFr ? service.descriptionFr : service.description;

          return (
            <div
              key={service.id}
              className="bg-neutral-900 rounded-3xl border border-neutral-800 p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-950 shrink-0">
                  <img
                    src={service.imageUrl || '/src/assets/images/barber_fade_cut_1791472965182.jpg'}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold uppercase tracking-wider">
                    <Scissors className="w-3.5 h-3.5" />
                    <span className="capitalize">{service.category}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white mt-0.5 group-hover:text-amber-400 transition-colors">
                    {displayName}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {displayDesc}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-500 font-mono">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {service.durationMinutes} min
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">{t('price')}</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 tabular-nums">
                    ${service.price} <span className="text-xs font-normal text-neutral-400">MXN</span>
                  </span>
                </div>

                <button
                  onClick={() => handleBook(service)}
                  className="min-h-[44px] px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('bookAppointment')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
