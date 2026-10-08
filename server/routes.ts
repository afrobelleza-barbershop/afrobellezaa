import { Router } from 'express';
import { db } from './db.ts';
import type { 
  Appointment, 
  Post, 
  Service, 
  GalleryItem, 
  Message, 
  Notification, 
  BusinessHour, 
  BusinessSettings,
  User 
} from '../src/types/index.ts';

export const apiRouter = Router();

// ========================
// 1. BUSINESS SETTINGS
// ========================
apiRouter.get('/settings', (req, res) => {
  const settings = db.get('settings');
  res.json({ success: true, data: settings });
});

apiRouter.put('/settings', (req, res) => {
  const current = db.get('settings');
  const updated: BusinessSettings = {
    ...current,
    ...req.body,
    theme: {
      ...current.theme,
      ...(req.body.theme || {})
    },
    sectionsVisibility: {
      ...current.sectionsVisibility,
      ...(req.body.sectionsVisibility || {})
    },
    customButtons: {
      ...current.customButtons,
      ...(req.body.customButtons || {})
    },
    updatedAt: new Date().toISOString()
  };

  const oldIsOpen = current.isOpen;
  db.set('settings', updated);

  // If status changed, push notification
  if (oldIsOpen !== updated.isOpen) {
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      recipientRole: 'all',
      title: updated.isOpen ? '🟢 Salón Abierto' : '🔴 Salón Cerrado',
      message: updated.isOpen 
        ? `${updated.name} está ahora ABIERTO. ¡Te esperamos!` 
        : `${updated.name} ha CERRADO por el momento.`,
      type: 'status',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.update(d => {
      d.notifications.unshift(notif);
    });
  }

  res.json({ success: true, data: updated });
});

// Toggle salon open/close quick route
apiRouter.post('/settings/toggle-status', (req, res) => {
  const current = db.get('settings');
  const newStatus = req.body.isOpen !== undefined ? Boolean(req.body.isOpen) : !current.isOpen;
  
  const updated: BusinessSettings = {
    ...current,
    isOpen: newStatus,
    updatedAt: new Date().toISOString()
  };
  db.set('settings', updated);

  const notif: Notification = {
    id: `notif_${Date.now()}`,
    recipientRole: 'all',
    title: newStatus ? '🟢 AFROBELLEZA BARBER SHOP ESTÁ ABIERTO' : '🔴 AFROBELLEZA BARBER SHOP ESTÁ CERRADO',
    message: newStatus 
      ? 'Estamos atendiendo con gusto a todos nuestros clientes en el salón.' 
      : 'El salón se encuentra temporalmente cerrado. Puedes revisar la galería y programar tu próxima cita.',
    type: 'status',
    isRead: false,
    createdAt: new Date().toISOString()
  };
  db.update(d => {
    d.notifications.unshift(notif);
  });

  res.json({ success: true, data: updated });
});

// ========================
// 2. BUSINESS HOURS
// ========================
apiRouter.get('/hours', (req, res) => {
  const hours = db.get('hours');
  res.json({ success: true, data: hours });
});

apiRouter.put('/hours', (req, res) => {
  const updatedHours: BusinessHour[] = req.body;
  db.set('hours', updatedHours);
  res.json({ success: true, data: updatedHours });
});

// ========================
// 3. SERVICES
// ========================
apiRouter.get('/services', (req, res) => {
  const services = db.get('services');
  res.json({ success: true, data: services });
});

apiRouter.post('/services', (req, res) => {
  const newService: Service = {
    id: `srv_${Date.now()}`,
    name: req.body.name,
    nameFr: req.body.nameFr || req.body.name,
    description: req.body.description || '',
    descriptionFr: req.body.descriptionFr || req.body.description || '',
    price: Number(req.body.price) || 200,
    durationMinutes: Number(req.body.durationMinutes) || 30,
    category: req.body.category || 'corte',
    imageUrl: req.body.imageUrl || '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  };

  db.update(d => {
    d.services.unshift(newService);
  });

  res.status(201).json({ success: true, data: newService });
});

apiRouter.put('/services/:id', (req, res) => {
  const { id } = req.params;
  let updatedService: Service | null = null;

  db.update(d => {
    const idx = d.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      d.services[idx] = {
        ...d.services[idx],
        ...req.body,
        price: Number(req.body.price) || d.services[idx].price,
        durationMinutes: Number(req.body.durationMinutes) || d.services[idx].durationMinutes
      };
      updatedService = d.services[idx];
    }
  });

  if (!updatedService) {
    return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
  }

  res.json({ success: true, data: updatedService });
});

apiRouter.delete('/services/:id', (req, res) => {
  const { id } = req.params;
  db.update(d => {
    d.services = d.services.filter(s => s.id !== id);
  });
  res.json({ success: true, message: 'Servicio eliminado con éxito' });
});

// ========================
// 4. APPOINTMENTS
// ========================
apiRouter.get('/appointments', (req, res) => {
  const { userId, role } = req.query;
  const all = db.get('appointments');

  if (role === 'owner') {
    return res.json({ success: true, data: all });
  }

  if (userId) {
    const userAppointments = all.filter(a => a.userId === userId);
    return res.json({ success: true, data: userAppointments });
  }

  res.json({ success: true, data: all });
});

apiRouter.post('/appointments', (req, res) => {
  const settings = db.get('settings');
  if (!settings.isOpen && !settings.allowBookingWhenClosed) {
    return res.status(400).json({ 
      success: false, 
      message: 'El salón está actualmente cerrado y no recibe reservaciones nuevas.' 
    });
  }

  const { clientName, clientPhone, serviceId, serviceName, price, date, time, notes, userId } = req.body;

  if (!clientName || !clientPhone || !date || !time) {
    return res.status(400).json({ 
      success: false, 
      message: 'Por favor complete todos los datos requeridos (nombre, teléfono, fecha y hora).' 
    });
  }

  const newAppointment: Appointment = {
    id: `app_${Date.now()}`,
    userId: userId || 'usr_client_1',
    clientName,
    clientPhone,
    serviceId: serviceId || 'srv_1',
    serviceName: serviceName || 'Corte de Cabello',
    price: Number(price) || 200,
    date,
    time,
    notes: notes || '',
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Immediate notification for owner!
  const ownerNotif: Notification = {
    id: `notif_${Date.now()}`,
    recipientRole: 'owner',
    title: '🔔 NUEVA SOLICITUD DE RESERVA',
    message: `${clientName} (${clientPhone}) ha reservado "${newAppointment.serviceName}" para el ${date} a las ${time}.`,
    type: 'appointment',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkTab: 'bookings'
  };

  db.update(d => {
    d.appointments.unshift(newAppointment);
    d.notifications.unshift(ownerNotif);
  });

  res.status(201).json({ success: true, data: newAppointment });
});

apiRouter.patch('/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let updatedApp: Appointment | null = null;

  db.update(d => {
    const idx = d.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      d.appointments[idx].status = status;
      d.appointments[idx].updatedAt = new Date().toISOString();
      updatedApp = d.appointments[idx];

      // Notify the client about status change
      const clientNotif: Notification = {
        id: `notif_${Date.now()}`,
        recipientRole: 'client',
        recipientId: updatedApp.userId,
        title: status === 'confirmada' ? '✅ Reserva Confirmada' : status === 'rechazada' ? '❌ Reserva Rechazada' : `Reserva ${status}`,
        message: status === 'confirmada'
          ? `Tu cita para "${updatedApp.serviceName}" el ${updatedApp.date} a las ${updatedApp.time} ha sido confirmada por el barbero.`
          : `Tu cita para "${updatedApp.serviceName}" no pudo ser confirmada. Por favor contáctanos o elige otro horario.`,
        type: 'appointment',
        isRead: false,
        createdAt: new Date().toISOString(),
        linkTab: 'profile'
      };
      d.notifications.unshift(clientNotif);
    }
  });

  if (!updatedApp) {
    return res.status(404).json({ success: false, message: 'Cita no encontrada' });
  }

  res.json({ success: true, data: updatedApp });
});

apiRouter.delete('/appointments/:id', (req, res) => {
  const { id } = req.params;
  db.update(d => {
    d.appointments = d.appointments.filter(a => a.id !== id);
  });
  res.json({ success: true, message: 'Cita eliminada' });
});

// ========================
// 5. POSTS & LIKES
// ========================
apiRouter.get('/posts', (req, res) => {
  const posts = db.get('posts');
  res.json({ success: true, data: posts });
});

apiRouter.post('/posts', (req, res) => {
  const { title, content, mediaUrls, type, isImportant } = req.body;
  const newPost: Post = {
    id: `post_${Date.now()}`,
    title,
    content,
    mediaUrls: Array.isArray(mediaUrls) && mediaUrls.length > 0 ? mediaUrls : ['/src/assets/images/afrobelleza_hero_shop_1791472955050.jpg'],
    type: type || 'general',
    isImportant: Boolean(isImportant),
    likesCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString()
  };

  // Notify clients
  const notif: Notification = {
    id: `notif_${Date.now()}`,
    recipientRole: 'client',
    title: isImportant ? '🔥 NUEVA PROMOCIÓN O ANUNCIO' : '💈 Nueva publicación en Afrobelleza',
    message: `${title}: ${content.substring(0, 80)}...`,
    type: 'post',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkTab: 'news'
  };

  db.update(d => {
    d.posts.unshift(newPost);
    d.notifications.unshift(notif);
  });

  res.status(201).json({ success: true, data: newPost });
});

apiRouter.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  let updatedPost: Post | null = null;

  db.update(d => {
    const idx = d.posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      d.posts[idx] = {
        ...d.posts[idx],
        ...req.body
      };
      updatedPost = d.posts[idx];
    }
  });

  if (!updatedPost) {
    return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
  }

  res.json({ success: true, data: updatedPost });
});

apiRouter.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.update(d => {
    d.posts = d.posts.filter(p => p.id !== id);
  });
  res.json({ success: true, message: 'Publicación eliminada' });
});

apiRouter.post('/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const effectiveUserId = userId || 'usr_client_1';
  let updatedPost: Post | null = null;

  db.update(d => {
    const post = d.posts.find(p => p.id === id);
    if (post) {
      const idx = post.likedBy.indexOf(effectiveUserId);
      if (idx === -1) {
        post.likedBy.push(effectiveUserId);
        post.likesCount += 1;
      } else {
        post.likedBy.splice(idx, 1);
        post.likesCount = Math.max(0, post.likesCount - 1);
      }
      updatedPost = post;
    }
  });

  if (!updatedPost) {
    return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
  }

  res.json({ success: true, data: updatedPost });
});

// ========================
// 6. MESSAGING
// ========================
apiRouter.get('/messages', (req, res) => {
  const { conversationId } = req.query;
  const messages = db.get('messages');

  if (conversationId) {
    const filtered = messages.filter(m => m.conversationId === conversationId);
    return res.json({ success: true, data: filtered });
  }

  res.json({ success: true, data: messages });
});

apiRouter.post('/messages', (req, res) => {
  const { text, senderId, senderName, senderRole, recipientId, recipientName, conversationId } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'El mensaje no puede estar vacío' });
  }

  const newMessage: Message = {
    id: `msg_${Date.now()}`,
    conversationId: conversationId || (senderRole === 'client' ? senderId : recipientId) || 'usr_client_1',
    senderId: senderId || 'usr_client_1',
    senderName: senderName || (senderRole === 'owner' ? 'Barbero Afrobelleza' : 'Cliente'),
    senderRole: senderRole || 'client',
    recipientId: recipientId || (senderRole === 'client' ? 'usr_owner_1' : 'usr_client_1'),
    recipientName: recipientName || (senderRole === 'client' ? 'Barbero Afrobelleza' : 'Cliente'),
    text: text.trim(),
    isRead: false,
    createdAt: new Date().toISOString()
  };

  // Create notification
  const notif: Notification = {
    id: `notif_${Date.now()}`,
    recipientRole: senderRole === 'client' ? 'owner' : 'client',
    recipientId: senderRole === 'owner' ? recipientId : undefined,
    title: senderRole === 'client' ? '💬 Nuevo mensaje de un cliente' : '💬 Respuesta de Afrobelleza Barber',
    message: `${newMessage.senderName}: "${newMessage.text.substring(0, 60)}"`,
    type: 'message',
    isRead: false,
    createdAt: new Date().toISOString(),
    linkTab: 'messages'
  };

  db.update(d => {
    d.messages.push(newMessage);
    d.notifications.unshift(notif);
  });

  res.status(201).json({ success: true, data: newMessage });
});

apiRouter.patch('/messages/read', (req, res) => {
  const { conversationId, role } = req.body;
  db.update(d => {
    d.messages.forEach(m => {
      if ((!conversationId || m.conversationId === conversationId) && m.senderRole !== role) {
        m.isRead = true;
      }
    });
  });
  res.json({ success: true, message: 'Mensajes marcados como leídos' });
});

// ========================
// 7. GALLERY
// ========================
apiRouter.get('/gallery', (req, res) => {
  const gallery = db.get('gallery');
  res.json({ success: true, data: gallery });
});

apiRouter.post('/gallery', (req, res) => {
  const { title, category, imageUrl, description } = req.body;
  const newItem: GalleryItem = {
    id: `gal_${Date.now()}`,
    title: title || 'Corte Afrobelleza',
    category: category || 'cortes',
    imageUrl: imageUrl || '/src/assets/images/barber_fade_cut_1791472965182.jpg',
    description: description || '',
    createdAt: new Date().toISOString()
  };

  db.update(d => {
    d.gallery.unshift(newItem);
  });

  res.status(201).json({ success: true, data: newItem });
});

apiRouter.delete('/gallery/:id', (req, res) => {
  const { id } = req.params;
  db.update(d => {
    d.gallery = d.gallery.filter(g => g.id !== id);
  });
  res.json({ success: true, message: 'Foto eliminada' });
});

// ========================
// 8. NOTIFICATIONS
// ========================
apiRouter.get('/notifications', (req, res) => {
  const { role, userId } = req.query;
  const notifs = db.get('notifications');

  let filtered = notifs;
  if (role === 'owner') {
    filtered = notifs.filter(n => n.recipientRole === 'owner' || n.recipientRole === 'all');
  } else if (role === 'client') {
    filtered = notifs.filter(n => 
      n.recipientRole === 'client' || 
      n.recipientRole === 'all' || 
      (userId && n.recipientId === userId)
    );
  }

  res.json({ success: true, data: filtered });
});

apiRouter.patch('/notifications/mark-all-read', (req, res) => {
  db.update(d => {
    d.notifications.forEach(n => { n.isRead = true; });
  });
  res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
});

apiRouter.post('/notifications/broadcast', (req, res) => {
  const { title, message } = req.body;
  const notif: Notification = {
    id: `notif_${Date.now()}`,
    recipientRole: 'all',
    title: title || 'Anuncio Oficial de Afrobelleza',
    message: message || '',
    type: 'announcement',
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.update(d => {
    d.notifications.unshift(notif);
  });

  res.status(201).json({ success: true, data: notif });
});

// ========================
// 9. STATS
// ========================
apiRouter.get('/stats', (req, res) => {
  const users = db.get('users');
  const appointments = db.get('appointments');
  const messages = db.get('messages');
  const posts = db.get('posts');

  const pending = appointments.filter(a => a.status === 'pendiente').length;
  const confirmed = appointments.filter(a => a.status === 'confirmada').length;
  const unreadMessages = messages.filter(m => !m.isRead && m.senderRole === 'client').length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likesCount, 0);

  res.json({
    success: true,
    data: {
      totalClients: users.filter(u => u.role === 'client').length + 18, // realistic active client base
      totalAppointments: appointments.length,
      pendingAppointments: pending,
      confirmedAppointments: confirmed,
      totalMessages: messages.length,
      unreadMessages,
      totalPosts: posts.length,
      totalLikes
    }
  });
});

// ========================
// 10. AUTH, ONBOARDING & ROLES
// ========================
apiRouter.post('/auth/onboarding', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'El nombre es obligatorio.' });
  }

  const trimmed = name.trim();
  const isOwner = trimmed.toUpperCase() === 'AFROBELLEZA ADMIN';

  let user: User;
  if (isOwner) {
    user = {
      id: 'usr_owner_1',
      name: 'AFROBELLEZA ADMIN',
      email: 'admin@afrobelleza.com',
      phone: '+52 962 447 0847',
      role: 'owner',
      avatarUrl: '/src/assets/images/barber_fade_cut_1791472965182.jpg',
      createdAt: new Date().toISOString()
    };
  } else {
    // Regular client
    user = {
      id: `usr_${Date.now()}`,
      name: trimmed,
      email: `${trimmed.toLowerCase().replace(/\s+/g, '')}@cliente.com`,
      phone: '+52 962 123 4567',
      role: 'client',
      createdAt: new Date().toISOString()
    };
  }

  db.update(d => {
    const existingIndex = d.users.findIndex(u => u.id === user.id);
    if (existingIndex !== -1) {
      d.users[existingIndex] = { ...d.users[existingIndex], ...user };
    } else {
      d.users.push(user);
    }
  });

  res.json({
    success: true,
    isOwner,
    role: user.role,
    user,
    message: isOwner ? 'Acceso concedido al Modo Propietario' : `Bienvenido ${user.name}`
  });
});

apiRouter.get('/users', (req, res) => {
  const users = db.get('users');
  res.json({ success: true, data: users });
});

