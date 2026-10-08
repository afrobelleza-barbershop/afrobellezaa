export type Language = 'es' | 'fr';

export const translations = {
  es: {
    // Top Bar & General
    appName: 'AFROBELLEZA BARBER SHOP',
    country: 'México 🇲🇽',
    open: 'ABIERTO',
    closed: 'CERRADO',
    salonIsOpen: 'AFROBELLEZA BARBER SHOP ESTÁ ABIERTO',
    salonIsClosed: 'AFROBELLEZA BARBER SHOP ESTÁ CERRADO',
    salonClosedNotice: 'Actualmente estamos cerrados. Puedes consultar nuestros servicios y agendar tu próxima cita.',
    tagline: 'El arte de la barbería clásica y moderna en México',
    
    // Navigation
    navHome: 'Inicio',
    navServices: 'Servicios',
    navBook: 'Reservar',
    navNews: 'Novedades',
    navGallery: 'Galería',
    navMessages: 'Mensajes',
    navProfile: 'Perfil',
    navAdmin: 'Administración',
    navSettings: 'Configuración',
    
    // Actions & Buttons
    bookAppointment: 'RESERVAR CITA',
    contactWhatsApp: 'CONTACTAR POR WHATSAPP',
    viewServices: 'VER SERVICIOS',
    copyNumber: 'Copiar número',
    numberCopied: '¡Número copiado al portapapeles!',
    sendMessage: 'Enviar mensaje',
    confirm: 'Confirmar',
    reject: 'Rechazar',
    cancel: 'Cancelar',
    save: 'Guardar cambios',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    close: 'Cerrar',
    back: 'Volver',
    like: 'Me gusta',
    liked: 'Te gusta',
    newBadge: 'NUEVO',
    importantBadge: 'IMPORTANTE',
    
    // Home sections
    sectionNews: 'NOVEDADES & ESTILOS',
    sectionServices: 'NUESTROS SERVICIOS',
    sectionGallery: 'GALERÍA DE TRABAJOS',
    sectionHours: 'HORARIOS DE ATENCIÓN',
    sectionContact: 'CONTACTO & UBICACIÓN',
    sectionWhatsApp: 'WHATSAPP OFICIAL',
    
    // Booking Form
    bookingTitle: 'Reserva tu Cita',
    bookingSubtitle: 'Selecciona tu servicio y horario ideal. Te confirmaremos de inmediato.',
    clientName: 'Nombre completo',
    clientPhone: 'Número de teléfono (WhatsApp)',
    selectService: 'Seleccionar servicio',
    selectDate: 'Fecha deseada',
    selectTime: 'Hora deseada',
    optionalMessage: 'Mensaje o notas adicionales (opcional)',
    submitBooking: 'CONFIRMAR RESERVA',
    bookingSuccess: '¡Tu solicitud ha sido enviada con éxito! El barbero la revisará de inmediato.',
    bookingClosedAlert: 'El salón no está aceptando nuevas reservas en este momento.',
    
    // Statuses
    statusPending: 'Pendiente',
    statusConfirmed: 'Confirmada',
    statusRejected: 'Rechazada',
    statusCompleted: 'Completada',
    statusCancelled: 'Cancelada',
    
    // Services
    duration: 'minutos',
    price: 'Precio',
    allCategories: 'Todos',
    catCorte: 'Cortes',
    catBarba: 'Barba',
    catCombo: 'Combos',
    catDiseno: 'Diseños',
    catTratamiento: 'Tratamientos',
    
    // Hours
    daySunday: 'Domingo',
    dayMonday: 'Lunes',
    dayTuesday: 'Martes',
    dayWednesday: 'Miércoles',
    dayThursday: 'Jueves',
    dayFriday: 'Viernes',
    daySaturday: 'Sábado',
    closedDay: 'Cerrado',
    
    // Messaging
    chatTitle: 'Mensajería Directa',
    chatSubtitle: 'Habla directamente con el barbero',
    typeMessage: 'Escribe un mensaje aquí...',
    noMessagesYet: 'No hay mensajes en esta conversación. ¡Escríbenos!',
    newMessagesBadge: 'nuevo mensaje',
    
    // Gallery
    galleryTitle: 'Nuestra Galería',
    gallerySubtitle: 'Conoce la calidad y precisión de nuestros cortes y diseños',
    
    // Profile
    profileTitle: 'Mi Perfil',
    myAppointments: 'Mis Reservas',
    myLikedPosts: 'Publicaciones que me gustan',
    upcomingAppointments: 'Próximas Citas',
    pastAppointments: 'Historial',
    noAppointments: 'No tienes citas registradas aún.',
    guestUser: 'Cliente Invitado',
    
    // Admin Dashboard
    adminDashboard: 'Panel de Administración',
    statsOverview: 'Estadísticas del Negocio',
    totalClients: 'Clientes registrados',
    totalAppointments: 'Total de reservas',
    pendingBookings: 'Reservas pendientes',
    confirmedBookings: 'Reservas confirmadas',
    totalMessages: 'Mensajes totales',
    unreadMessages: 'Mensajes sin leer',
    totalPosts: 'Publicaciones',
    totalLikes: 'Total Me Gusta',
    
    adminTabOverview: 'Resumen',
    adminTabBookings: 'Reservas',
    adminTabMessages: 'Mensajes',
    adminTabPosts: 'Publicaciones',
    adminTabServices: 'Servicios',
    adminTabGallery: 'Galería',
    adminTabHours: 'Horarios',
    adminTabNotifications: 'Notificaciones',
    adminTabSettings: 'Configuración',
    
    openSalon: 'ABRIR SALÓN',
    closeSalon: 'CERRAR SALÓN',
    salonStatusToggle: 'Estado del Salón',
    allowBookingLabel: 'Permitir reservas cuando el salón esté cerrado',
    
    newPostButton: '+ Nueva publicación',
    newServiceButton: '+ Agregar servicio',
    newPhotoButton: '+ Agregar foto',
    sendNotificationButton: 'Enviar notificación masiva',
    
    // Notification & Settings
    notificationsTitle: 'Notificaciones',
    markAllRead: 'Marcar todas como leídas',
    noNotifications: 'No tienes notificaciones pendientes.',
    languageSelector: 'Idioma / Langue',
    roleSelector: 'Cambiar de Rol (Modo Evaluación)',
    currentRole: 'Rol actual',
    roleOwner: 'Propietario / Barbero',
    roleClient: 'Cliente',
    switchedToOwner: 'Has cambiado al espacio del Propietario',
    switchedToClient: 'Has cambiado a la vista de Cliente',
    
    // Settings fields
    businessNameField: 'Nombre del Barber Shop',
    whatsappField: 'Número oficial de WhatsApp',
    addressField: 'Dirección física',
    heroTitleField: 'Título principal de bienvenida',
    heroSubtitleField: 'Subtítulo del banner',
    heroImageField: 'URL de la imagen principal',
  },
  fr: {
    // Top Bar & General
    appName: 'AFROBELLEZA BARBER SHOP',
    country: 'Mexique 🇲🇽',
    open: 'OUVERT',
    closed: 'FERMÉ',
    salonIsOpen: 'AFROBELLEZA BARBER SHOP EST OUVERT',
    salonIsClosed: 'AFROBELLEZA BARBER SHOP EST FERMÉ',
    salonClosedNotice: 'Nous sommes actuellement fermés. Vous pouvez consulter nos services et réserver votre prochain créneau.',
    tagline: 'L’art de la coiffure classique et moderne au Mexique',
    
    // Navigation
    navHome: 'Accueil',
    navServices: 'Services',
    navBook: 'Réserver',
    navNews: 'Nouveautés',
    navGallery: 'Galerie',
    navMessages: 'Messages',
    navProfile: 'Profil',
    navAdmin: 'Administration',
    navSettings: 'Paramètres',
    
    // Actions & Buttons
    bookAppointment: 'RÉSERVER UN RENDEZ-VOUS',
    contactWhatsApp: 'CONTACTER SUR WHATSAPP',
    viewServices: 'VOIR LES SERVICES',
    copyNumber: 'Copier le numéro',
    numberCopied: 'Numéro copié dans le presse-papiers !',
    sendMessage: 'Envoyer le message',
    confirm: 'Confirmer',
    reject: 'Refuser',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    close: 'Fermer',
    back: 'Retour',
    like: "J'aime",
    liked: 'Aimé',
    newBadge: 'NOUVEAUTÉ',
    importantBadge: 'IMPORTANT',
    
    // Home sections
    sectionNews: 'NOUVEAUTÉS & STYLES',
    sectionServices: 'NOS SERVICES',
    sectionGallery: 'GALERIE DE RÉALISATIONS',
    sectionHours: 'HORAIRES D’OUVERTURE',
    sectionContact: 'CONTACT & LOCALISATION',
    sectionWhatsApp: 'WHATSAPP OFFICIEL',
    
    // Booking Form
    bookingTitle: 'Réserver votre Rendez-vous',
    bookingSubtitle: 'Choisissez votre prestation et votre horaire idéal. Nous vous confirmerons rapidement.',
    clientName: 'Nom complet',
    clientPhone: 'Numéro de téléphone (WhatsApp)',
    selectService: 'Choisir une prestation',
    selectDate: 'Date souhaitée',
    selectTime: 'Heure souhaitée',
    optionalMessage: 'Message ou remarque (facultatif)',
    submitBooking: 'CONFIRMER LA RÉSERVATION',
    bookingSuccess: 'Votre demande a été envoyée avec succès ! Le barbier va la traiter sans attendre.',
    bookingClosedAlert: 'Le salon n’accepte pas de nouvelles réservations pour le moment.',
    
    // Statuses
    statusPending: 'En attente',
    statusConfirmed: 'Confirmée',
    statusRejected: 'Refusée',
    statusCompleted: 'Terminée',
    statusCancelled: 'Annulée',
    
    // Services
    duration: 'minutes',
    price: 'Prix',
    allCategories: 'Tous',
    catCorte: 'Coupes',
    catBarba: 'Barbe',
    catCombo: 'Combos',
    catDiseno: 'Designs',
    catTratamiento: 'Soins',
    
    // Hours
    daySunday: 'Dimanche',
    dayMonday: 'Lundi',
    dayTuesday: 'Mardi',
    dayWednesday: 'Mercredi',
    dayThursday: 'Jeudi',
    dayFriday: 'Vendredi',
    daySaturday: 'Samedi',
    closedDay: 'Fermé',
    
    // Messaging
    chatTitle: 'Messagerie Directe',
    chatSubtitle: 'Échangez directement avec le barbier',
    typeMessage: 'Écrivez votre message ici...',
    noMessagesYet: 'Aucun message pour l’instant. Écrivez-nous !',
    newMessagesBadge: 'nouveau message',
    
    // Gallery
    galleryTitle: 'Notre Galerie',
    gallerySubtitle: 'Découvrez la précision et l’excellence de nos coupes et créations',
    
    // Profile
    profileTitle: 'Mon Profil',
    myAppointments: 'Mes Rendez-vous',
    myLikedPosts: 'Publications aimées',
    upcomingAppointments: 'Prochains Rendez-vous',
    pastAppointments: 'Historique',
    noAppointments: 'Aucun rendez-vous pour le moment.',
    guestUser: 'Client Invité',
    
    // Admin Dashboard
    adminDashboard: 'Espace Propriétaire',
    statsOverview: 'Statistiques du Salon',
    totalClients: 'Clients enregistrés',
    totalAppointments: 'Total réservations',
    pendingBookings: 'Réservations en attente',
    confirmedBookings: 'Réservations confirmées',
    totalMessages: 'Messages totaux',
    unreadMessages: 'Messages non lus',
    totalPosts: 'Publications',
    totalLikes: 'Total J’aime',
    
    adminTabOverview: 'Aperçu',
    adminTabBookings: 'Réservations',
    adminTabMessages: 'Messages',
    adminTabPosts: 'Publications',
    adminTabServices: 'Services',
    adminTabGallery: 'Galerie',
    adminTabHours: 'Horaires',
    adminTabNotifications: 'Notifications',
    adminTabSettings: 'Paramètres',
    
    openSalon: 'OUVRIR LE SALON',
    closeSalon: 'FERMER LE SALON',
    salonStatusToggle: 'Statut du Salon',
    allowBookingLabel: 'Autoriser les réservations quand le salon est fermé',
    
    newPostButton: '+ Nouvelle publication',
    newServiceButton: '+ Ajouter un service',
    newPhotoButton: '+ Ajouter une photo',
    sendNotificationButton: 'Envoyer une notification groupée',
    
    // Notification & Settings
    notificationsTitle: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    noNotifications: 'Aucune notification en attente.',
    languageSelector: 'Idioma / Langue',
    roleSelector: 'Changer de rôle (Mode évaluation)',
    currentRole: 'Rôle actuel',
    roleOwner: 'Propriétaire / Barbier',
    roleClient: 'Client',
    switchedToOwner: 'Vous êtes passé dans l’espace Propriétaire',
    switchedToClient: 'Vous êtes passé dans la vue Client',
    
    // Settings fields
    businessNameField: 'Nom du Barber Shop',
    whatsappField: 'Numéro WhatsApp officiel',
    addressField: 'Adresse physique',
    heroTitleField: 'Titre principal d’accueil',
    heroSubtitleField: 'Sous-titre de la bannière',
    heroImageField: 'URL de l’image principale',
  }
};
