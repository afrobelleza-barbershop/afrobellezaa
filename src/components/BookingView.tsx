import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Scissors, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';

export const BookingView: React.FC = () => {
  const { 
    services, 
    settings, 
    hours, 
    selectedServiceForBooking, 
    setSelectedServiceForBooking, 
    createAppointment, 
    currentUser, 
    t, 
    lang, 
    setActiveTab 
  } = useApp();

  // Form states
  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [serviceId, setServiceId] = useState(selectedServiceForBooking?.id || services[0]?.id || '');
  
  // Date default to tomorrow YYYY-MM-DD
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setServiceId(selectedServiceForBooking.id);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }
  }, [selectedServiceForBooking, services, serviceId]);

  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const isOpen = settings?.isOpen ?? true;
  const allowBookingWhenClosed = settings?.allowBookingWhenClosed ?? true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !date || !time) {
      return;
    }

    setIsSubmitting(true);
    const success = await createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceId: selectedService?.id || 'srv_1',
      serviceName: (lang === 'fr' && selectedService?.nameFr) ? selectedService.nameFr : (selectedService?.name || 'Corte'),
      price: selectedService?.price || 200,
      date,
      time,
      notes: notes.trim()
    });

    setIsSubmitting(false);
    if (success) {
      setBookingSuccess(true);
    }
  };

  // Generate selectable time slots
  const availableTimeSlots = [
    '09:00', '09:45', '10:30', '11:15', '12:00', 
    '13:00', '14:00', '15:00', '15:45', '16:30', 
    '17:15', '18:00', '18:45', '19:30'
  ];

  if (!isOpen && !allowBookingWhenClosed) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-neutral-900 rounded-3xl border border-rose-900/60 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold font-display text-white">
          {t('salonIsClosed')}
        </h2>
        <p className="text-sm text-neutral-400">
          {t('bookingClosedAlert')}
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-neutral-900 rounded-3xl border border-neutral-800 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">
            {lang === 'fr' ? '¡Demande Envoyée!' : '¡Solicitud Registrada!'}
          </h2>
          <p className="text-sm text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
            {t('bookingSuccess')}
          </p>
        </div>

        <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">{t('clientName')}:</span>
            <span className="font-semibold text-white">{clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Servicio:</span>
            <span className="font-semibold text-amber-400">
              {(lang === 'fr' && selectedService?.nameFr) ? selectedService.nameFr : selectedService?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Fecha y hora:</span>
            <span className="font-semibold text-white">{date} · {time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Estado:</span>
            <span className="font-bold text-amber-500 uppercase">{t('statusPending')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors uppercase"
          >
            {t('myAppointments')}
          </button>
          <button
            onClick={() => {
              setBookingSuccess(false);
              setNotes('');
            }}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs rounded-xl transition-colors"
          >
            Nueva cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
          {t('bookAppointment')}
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
          {t('bookingTitle')}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          {t('bookingSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Service selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span>{t('selectService')} *</span>
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {(lang === 'fr' && s.nameFr) ? s.nameFr : s.name} — ${s.price} MXN ({s.durationMinutes} min)
              </option>
            ))}
          </select>
          {selectedService && (
            <div className="p-3 bg-neutral-950/70 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-400 truncate mr-2">
                {(lang === 'fr' && selectedService.descriptionFr) ? selectedService.descriptionFr : selectedService.description}
              </span>
              <span className="font-bold text-amber-400 font-mono shrink-0">
                ${selectedService.price} MXN
              </span>
            </div>
          )}
        </div>

        {/* Client Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              <span>{t('clientName')} *</span>
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. Roberto Sánchez"
              className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{t('clientPhone')} *</span>
            </label>
            <input
              type="tel"
              required
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+52 962..."
              className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{t('selectDate')} *</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{t('selectTime')} *</span>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-12 bg-neutral-950 border border-neutral-800 rounded-xl px-4 text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
            >
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time chips quick selection */}
        <div>
          <span className="text-[11px] text-neutral-400 block mb-2 font-medium">
            Horarios populares disponibles:
          </span>
          <div className="flex flex-wrap gap-2">
            {availableTimeSlots.slice(0, 6).map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => setTime(slot)}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors ${
                  time === slot
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>{t('optionalMessage')}</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Prefiero degradado bajo, barba perfilada con navaja..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-neutral-950 font-extrabold text-sm rounded-xl tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Calendar className="w-5 h-5 stroke-[2.5]" />
            <span>{isSubmitting ? 'Enviando solicitud...' : t('submitBooking')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
