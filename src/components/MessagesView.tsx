import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Send, 
  User, 
  ShieldCheck, 
  Check, 
  CheckCheck, 
  Clock, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import type { Message } from '../types/index.ts';

export const MessagesView: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    markMessagesRead, 
    currentUser, 
    currentRole, 
    t, 
    lang, 
    settings 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string>('usr_client_1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by conversation
  const conversations = Array.from(new Set(messages.map(m => m.conversationId)));

  useEffect(() => {
    markMessagesRead(currentRole === 'owner' ? selectedConversation : currentUser.id);
  }, [selectedConversation, currentRole, currentUser.id, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeMessages = currentRole === 'owner'
    ? messages.filter(m => m.conversationId === selectedConversation)
    : messages.filter(m => m.conversationId === currentUser.id || m.senderId === currentUser.id || m.recipientId === currentUser.id);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');

    if (currentRole === 'owner') {
      await sendMessage(text, selectedConversation, 'Cliente');
    } else {
      await sendMessage(text, 'usr_owner_1', settings?.name || 'Afrobelleza Barber');
    }
  };

  const quickMessages = [
    'Hola, quiero agendar una cita para mañana.',
    '¿Tienen servicio de corte + barba disponible?',
    '¿Cuál es el precio del diseño con navaja?',
    'Ya voy en camino al salón.'
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] min-h-[520px] flex flex-col md:flex-row bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
      {/* Sidebar for Owner to see conversation list */}
      {currentRole === 'owner' && (
        <aside className="w-full md:w-72 bg-neutral-950 border-r border-neutral-800 flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Conversaciones ({conversations.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {conversations.map((convId) => {
              const convMsgs = messages.filter(m => m.conversationId === convId);
              const lastMsg = convMsgs[convMsgs.length - 1];
              const unreadCount = convMsgs.filter(m => !m.isRead && m.senderRole === 'client').length;
              const isSelected = selectedConversation === convId;

              return (
                <button
                  key={convId}
                  onClick={() => setSelectedConversation(convId)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-900/50 text-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 font-bold text-amber-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white truncate">
                        {convMsgs[0]?.senderRole === 'client' ? convMsgs[0]?.senderName : 'Cliente'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {lastMsg?.text || 'Nueva conversación'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-900/70">
        {/* Chat header */}
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              {currentRole === 'owner' ? <User className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                {currentRole === 'owner' 
                  ? 'Cliente en línea' 
                  : (settings?.name || 'Afrobelleza Barber Shop')}
              </h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Atención inmediata</span>
              </p>
            </div>
          </div>

          <span className="text-[11px] text-neutral-500 font-mono">
            {currentRole === 'owner' ? 'Vista Propietario' : 'Chat Cliente'}
          </span>
        </div>

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-neutral-600" />
              <p className="text-sm font-semibold text-white">{t('noMessagesYet')}</p>
              <p className="text-xs text-neutral-500 max-w-xs">
                {lang === 'fr' 
                  ? 'Posez vos questions ou demandez un créneau spécial directement.' 
                  : 'Escribe tu consulta o pide un horario personalizado directamente al barbero.'}
              </p>
            </div>
          ) : (
            activeMessages.map((msg) => {
              const isMine = msg.senderRole === currentRole;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${
                      isMine
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-none'
                        : 'bg-neutral-800 text-white rounded-tl-none border border-neutral-700/60'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 mb-1 flex items-center gap-1.5">
                      <span>{msg.senderName}</span>
                      <span>·</span>
                      <span className="capitalize">{msg.senderRole === 'owner' ? 'Barbero' : 'Cliente'}</span>
                    </div>

                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </p>

                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-75 font-mono">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-neutral-950" /> : <Check className="w-3.5 h-3.5 text-neutral-950" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions for client */}
        {currentRole === 'client' && (
          <div className="px-4 py-2 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickMessages.map((q) => (
              <button
                key={q}
                onClick={() => setInputText(q)}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-[11px] rounded-lg whitespace-nowrap border border-neutral-800 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 h-12 bg-neutral-900 border border-neutral-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="min-h-[48px] px-5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('sendMessage')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
