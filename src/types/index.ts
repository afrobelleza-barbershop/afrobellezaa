export type Role = 'owner' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface ThemeConfig {
  preset: string; // 'gold-obsidian' | 'emerald-dark' | 'crimson-onyx' | 'sapphire-midnight' | 'monochrome'
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardBgColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export interface SectionsVisibility {
  showNews: boolean;
  showServices: boolean;
  showGallery: boolean;
  showHours: boolean;
  showContact: boolean;
}

export interface CustomButtons {
  bookButtonTextEs: string;
  bookButtonTextFr: string;
  whatsappButtonTextEs: string;
  whatsappButtonTextFr: string;
  servicesButtonTextEs: string;
  servicesButtonTextFr: string;
}

export interface BusinessSettings {
  id: string;
  name: string;
  tagline: string;
  country: string;
  countryCode: string;
  whatsapp: string;
  address: string;
  city: string;
  isOpen: boolean;
  allowBookingWhenClosed: boolean;
  currency: string;
  instagram: string;
  facebook: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl?: string;
  theme: ThemeConfig;
  sectionsVisibility: SectionsVisibility;
  customButtons: CustomButtons;
  updatedAt: string;
}

export interface BusinessHour {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayNameEs: string;
  dayNameFr: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Service {
  id: string;
  name: string;
  nameFr?: string;
  description: string;
  descriptionFr?: string;
  price: number;
  durationMinutes: number;
  category: 'corte' | 'barba' | 'combo' | 'diseno' | 'tratamiento' | 'otro';
  imageUrl: string;
  isActive: boolean;
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'rechazada' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  userId?: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrls: string[];
  type: 'anuncio' | 'promocion' | 'estilo' | 'general';
  isImportant: boolean;
  likesCount: number;
  likedBy: string[]; // User IDs who liked
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string; // usually client userId or phone
  senderId: string;
  senderName: string;
  senderRole: Role;
  recipientId: string;
  recipientName: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  recipientRole: 'owner' | 'client' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  type: 'appointment' | 'post' | 'message' | 'status' | 'announcement';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'cortes' | 'barbas' | 'diseños' | 'salon' | 'general';
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalClients: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalMessages: number;
  unreadMessages: number;
  totalPosts: number;
  totalLikes: number;
}
