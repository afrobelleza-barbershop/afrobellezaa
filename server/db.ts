import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { 
  BusinessSettings, 
  BusinessHour, 
  Service, 
  Appointment, 
  Post, 
  Message, 
  Notification, 
  GalleryItem, 
  User 
} from '../src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'afrobelleza_db.json');

export interface DatabaseSchema {
  users: User[];
  settings: BusinessSettings;
  hours: BusinessHour[];
  services: Service[];
  appointments: Appointment[];
  posts: Post[];
  messages: Message[];
  notifications: Notification[];
  gallery: GalleryItem[];
}

const DEFAULT_SETTINGS: BusinessSettings = {
  id: 'settings_1',
  name: 'AFROBELLEZA BARBER SHOP',
  tagline: 'El arte y la pasión de la barbería afro y moderna en México',
  country: 'México',
  countryCode: '+52',
  whatsapp: '+52 962 447 0847',
  address: 'Av. Central Sur #45, Tapachula, Chiapas, México',
  city: 'Tapachula, Chiapas',
  isOpen: true,
  allowBookingWhenClosed: true,
  currency: 'MXN',
  instagram: '@afrobelleza_barber',
  facebook: 'Afrobelleza Barber Shop',
  heroTitle: 'AFROBELLEZA BARBER SHOP',
  heroSubtitle: 'Estilo, elegancia y precisión para caballeros exigentes',
  heroImageUrl: '/src/assets/images/afrobelleza_hero_shop_1791472955050.jpg',
  logoUrl: '',
  theme: {
    preset: 'gold-obsidian',
    primaryColor: '#f59e0b',
    secondaryColor: '#10b981',
    bgColor: '#0a0a0a',
    cardBgColor: '#171717',
    textColor: '#f5f5f5',
    buttonColor: '#f59e0b',
    buttonTextColor: '#0a0a0a',
  },
  sectionsVisibility: {
    showNews: true,
    showServices: true,
    showGallery: true,
    showHours: true,
    showContact: true,
  },
  customButtons: {
    bookButtonTextEs: 'RESERVAR CITA',
    bookButtonTextFr: 'RÉSERVER UN RENDEZ-VOUS',
    whatsappButtonTextEs: 'CONTACTAR POR WHATSAPP',
    whatsappButtonTextFr: 'CONTACTER SUR WHATSAPP',
    servicesButtonTextEs: 'VER SERVICIOS',
    servicesButtonTextFr: 'VOIR LES SERVICES',
  },
  updatedAt: new Date().toISOString()
};

const DEFAULT_HOURS: BusinessHour[] = [
  { id: 'h_1', dayOfWeek: 1, dayNameEs: 'Lunes', dayNameFr: 'Lundi', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: 'h_2', dayOfWeek: 2, dayNameEs: 'Martes', dayNameFr: 'Mardi', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: 'h_3', dayOfWeek: 3, dayNameEs: 'Miércoles', dayNameFr: 'Mercredi', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: 'h_4', dayOfWeek: 4, dayNameEs: 'Jueves', dayNameFr: 'Jeudi', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { id: 'h_5', dayOfWeek: 5, dayNameEs: 'Viernes', dayNameFr: 'Vendredi', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { id: 'h_6', dayOfWeek: 6, dayNameEs: 'Sábado', dayNameFr: 'Samedi', isOpen: true, openTime: '09:00', closeTime: '20:00' },
  { id: 'h_0', dayOfWeek: 0, dayNameEs: 'Domingo', dayNameFr: 'Dimanche', isOpen: false, openTime: '10:00', closeTime: '16:00' },
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv_1',
    name: 'Corte Clásico & Degradado',
    nameFr: 'Coupe Classique & Dégradé',
    description: 'Corte personalizado con tijera o máquina, degradado limpio y perfilado con navaja.',
    descriptionFr: 'Coupe sur-mesure aux ciseaux ou tondeuse, fondu précis et finitions rasoir.',
    price: 220,
    durationMinutes: 40,
    category: 'corte',
    imageUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    isActive: true
  },
  {
    id: 'srv_2',
    name: 'Corte + Arreglo de Barba Premium',
    nameFr: 'Coupe + Barbe Sculptée Premium',
    description: 'Servicio completo: corte de cabello de precisión, toalla caliente y delineado de barba con aceites esenciales.',
    descriptionFr: 'Service complet : coupe précision, serviette chaude et sculpture de barbe aux huiles essentielles.',
    price: 340,
    durationMinutes: 60,
    category: 'combo',
    imageUrl: '/src/assets/images/barber_beard_sculpt_1791472974300.jpg',
    isActive: true
  },
  {
    id: 'srv_3',
    name: 'Esculpido de Barba & Toalla Caliente',
    nameFr: 'Taille de Barbe & Serviette Chaude',
    description: 'Ritual tradicional de afeitado y diseño de barba con vapor ozonizado y toalla caliente.',
    descriptionFr: 'Rituel traditionnel de rasage et dessin de barbe à la vapeur ozonée et serviette chaude.',
    price: 180,
    durationMinutes: 30,
    category: 'barba',
    imageUrl: '/src/assets/images/barber_beard_sculpt_1791472974300.jpg',
    isActive: true
  },
  {
    id: 'srv_4',
    name: 'Diseño Artístico Freestyle',
    nameFr: 'Design Artistique Freestyle',
    description: 'Líneas geométricas, sombras y dibujos grabados a navaja de alta precisión sobre degradado.',
    descriptionFr: 'Lignes géométriques, ombrages et gravures au rasoir de haute précision sur fondu.',
    price: 280,
    durationMinutes: 50,
    category: 'diseno',
    imageUrl: '/src/assets/images/barber_artistic_design_1791472991635.jpg',
    isActive: true
  },
  {
    id: 'srv_5',
    name: 'Corte Infantil (Menores de 12)',
    nameFr: 'Coupe Enfant (Moins de 12 ans)',
    description: 'Atención paciente y divertida con estilos modernos para los más pequeños.',
    descriptionFr: 'Accueil patient et chaleureux avec styles modernes pour les plus jeunes.',
    price: 170,
    durationMinutes: 30,
    category: 'corte',
    imageUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    isActive: true
  },
  {
    id: 'srv_6',
    name: 'Tratamiento Capilar & Lavado Spa',
    nameFr: 'Soin Capillaire & Shampoing Spa',
    description: 'Exfoliación del cuero cabelludo, mascarilla nutritiva profunda y masaje relajante.',
    descriptionFr: 'Gommage du cuir chevelu, masque nourrissant profond et massage relaxant.',
    price: 190,
    durationMinutes: 25,
    category: 'tratamiento',
    imageUrl: '/src/assets/images/barber_interior_salon_1791472983242.jpg',
    isActive: true
  }
];

const DEFAULT_POSTS: Post[] = [
  {
    id: 'post_1',
    title: '¡Bienvenidos a Afrobelleza Barber Shop en México!',
    content: 'Descubre nuestra nueva experiencia premium de barbería en Tapachula. Te esperamos con el mejor café, atención exclusiva y maestros barberos especializados en cortes afro, degradados y perfilado de barba.',
    mediaUrls: ['/src/assets/images/afrobelleza_hero_shop_1791472955050.jpg'],
    type: 'anuncio',
    isImportant: true,
    likesCount: 24,
    likedBy: ['usr_client_1'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'post_2',
    title: 'Tendencia: Diseños Geométricos & Razor Fade',
    content: 'Nuestros barberos dominan las técnicas de navaja más exigentes. Pide tu diseño freestyle en tu próxima cita y marca la diferencia este fin de semana.',
    mediaUrls: ['/src/assets/images/barber_artistic_design_1791472991635.jpg'],
    type: 'estilo',
    isImportant: false,
    likesCount: 42,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'post_3',
    title: 'Promo de la Semana: Corte + Barba con Toalla Caliente',
    content: 'Aprovecha un 15% de descuento especial al reservar tu paquete combo de Lunes a Miércoles. Reserva directamente desde la aplicación.',
    mediaUrls: ['/src/assets/images/barber_beard_sculpt_1791472974300.jpg'],
    type: 'promocion',
    isImportant: true,
    likesCount: 31,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal_1',
    title: 'Degradado Low Fade Impecable',
    category: 'cortes',
    imageUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    description: 'Perfilado de frente con navaja y difuminado continuo.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'gal_2',
    title: 'Esculpido de Barba & Contorno',
    category: 'barbas',
    imageUrl: '/src/assets/images/barber_beard_sculpt_1791472974300.jpg',
    description: 'Tratamiento con toalla caliente e hidratación con aceites prémium.',
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString()
  },
  {
    id: 'gal_3',
    title: 'Arte Geométrico Freestyle',
    category: 'diseños',
    imageUrl: '/src/assets/images/barber_artistic_design_1791472991635.jpg',
    description: 'Diseño exclusivo realizado a mano alzada con navaja recta.',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'gal_4',
    title: 'Instalaciones Afrobelleza',
    category: 'salon',
    imageUrl: '/src/assets/images/barber_interior_salon_1791472983242.jpg',
    description: 'Espacio climatizado, sillones ergonómicos y ambiente de primer nivel.',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'usr_owner_1',
    name: 'Maestro Barbero Afrobelleza',
    email: 'admin@afrobelleza.com',
    phone: '+52 962 447 0847',
    role: 'owner',
    avatarUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_client_1',
    name: 'Carlos Mendoza',
    email: 'carlos@ejemplo.com',
    phone: '+52 962 123 4567',
    role: 'client',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'app_1',
    userId: 'usr_client_1',
    clientName: 'Carlos Mendoza',
    clientPhone: '+52 962 123 4567',
    serviceId: 'srv_2',
    serviceName: 'Corte + Arreglo de Barba Premium',
    price: 340,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '15:00',
    notes: 'Por favor con toalla caliente extra.',
    status: 'confirmada',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'app_2',
    userId: 'usr_client_1',
    clientName: 'Alejandro Morales',
    clientPhone: '+52 962 888 9911',
    serviceId: 'srv_1',
    serviceName: 'Corte Clásico & Degradado',
    price: 220,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '16:30',
    notes: 'Degradado bajo (low taper).',
    status: 'pendiente',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString()
  }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    conversationId: 'usr_client_1',
    senderId: 'usr_client_1',
    senderName: 'Carlos Mendoza',
    senderRole: 'client',
    recipientId: 'usr_owner_1',
    recipientName: 'Maestro Barbero Afrobelleza',
    text: 'Hola, buenas tardes. ¿Tienen disponibilidad para mañana en la tarde?',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'msg_2',
    conversationId: 'usr_client_1',
    senderId: 'usr_owner_1',
    senderName: 'Maestro Barbero Afrobelleza',
    senderRole: 'owner',
    recipientId: 'usr_client_1',
    recipientName: 'Carlos Mendoza',
    text: '¡Hola Carlos! Sí, tenemos espacio a las 15:00 y a las 17:30. ¿Cuál te queda mejor?',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'msg_3',
    conversationId: 'usr_client_1',
    senderId: 'usr_client_1',
    senderName: 'Carlos Mendoza',
    senderRole: 'client',
    recipientId: 'usr_owner_1',
    recipientName: 'Maestro Barbero Afrobelleza',
    text: 'Perfecto, ya agendé a las 15:00 por la app. ¡Nos vemos mañana!',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    recipientRole: 'owner',
    title: 'Nueva solicitud de reserva',
    message: 'Alejandro Morales ha reservado "Corte Clásico & Degradado" para pasado mañana a las 16:30.',
    type: 'appointment',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    linkTab: 'bookings'
  },
  {
    id: 'notif_2',
    recipientRole: 'client',
    recipientId: 'usr_client_1',
    title: 'Reserva Confirmada',
    message: 'Tu cita para "Corte + Arreglo de Barba Premium" ha sido confirmada para mañana a las 15:00.',
    type: 'appointment',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    linkTab: 'profile'
  },
  {
    id: 'notif_3',
    recipientRole: 'all',
    title: 'Nueva promoción disponible',
    message: 'Aprovecha 15% de descuento en paquetes combo de Lunes a Miércoles.',
    type: 'announcement',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    linkTab: 'news'
  }
];

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          users: parsed.users || DEFAULT_USERS,
          settings: { 
            ...DEFAULT_SETTINGS, 
            ...(parsed.settings || {}),
            theme: { ...DEFAULT_SETTINGS.theme, ...(parsed.settings?.theme || {}) },
            sectionsVisibility: { ...DEFAULT_SETTINGS.sectionsVisibility, ...(parsed.settings?.sectionsVisibility || {}) },
            customButtons: { ...DEFAULT_SETTINGS.customButtons, ...(parsed.settings?.customButtons || {}) }
          },
          hours: parsed.hours || DEFAULT_HOURS,
          services: parsed.services || DEFAULT_SERVICES,
          appointments: parsed.appointments || DEFAULT_APPOINTMENTS,
          posts: parsed.posts || DEFAULT_POSTS,
          messages: parsed.messages || DEFAULT_MESSAGES,
          notifications: parsed.notifications || DEFAULT_NOTIFICATIONS,
          gallery: parsed.gallery || DEFAULT_GALLERY,
        };
      }
    } catch (err) {
      console.error('Error reading database file, using defaults:', err);
    }

    const initial: DatabaseSchema = {
      users: DEFAULT_USERS,
      settings: DEFAULT_SETTINGS,
      hours: DEFAULT_HOURS,
      services: DEFAULT_SERVICES,
      appointments: DEFAULT_APPOINTMENTS,
      posts: DEFAULT_POSTS,
      messages: DEFAULT_MESSAGES,
      notifications: DEFAULT_NOTIFICATIONS,
      gallery: DEFAULT_GALLERY,
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public update(updater: (db: DatabaseSchema) => void) {
    updater(this.data);
    this.saveData(this.data);
  }
}

export const db = new DatabaseStore();
