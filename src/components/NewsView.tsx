import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Sparkles, 
  Tag, 
  Calendar, 
  Plus, 
  Scissors
} from 'lucide-react';
import type { Post } from '../types/index.ts';

export const NewsView: React.FC = () => {
  const { 
    posts, 
    toggleLikePost, 
    currentUser, 
    currentRole, 
    openWhatsApp, 
    t, 
    lang, 
    setActiveTab 
  } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            {t('sectionNews')}
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {lang === 'fr' ? 'Nouveautés, Styles & Promotions' : 'Novedades, Estilos & Promociones'}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {lang === 'fr' 
              ? 'Suivez les dernières créations de notre équipe et nos offres du moment.' 
              : 'Sigue los últimos trabajos del maestro barbero, promociones de la semana y nuevos diseños.'}
          </p>
        </div>

        {currentRole === 'owner' && (
          <button
            onClick={() => setActiveTab('admin')}
            className="min-h-[44px] px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md uppercase self-start"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('newPostButton')}</span>
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-400">
          No hay publicaciones aún.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post: Post) => {
            const isLiked = post.likedBy?.includes(currentUser.id);
            const isNew = (Date.now() - new Date(post.createdAt).getTime()) < (1000 * 3600 * 36);

            return (
              <article
                key={post.id}
                className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden shadow-xl space-y-4 hover:border-neutral-700/80 transition-all"
              >
                {/* Media header */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="relative w-full max-h-[460px] overflow-hidden bg-neutral-950">
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[460px] object-cover"
                    />
                    {isNew && (
                      <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black tracking-widest px-3 py-1.5 rounded-lg uppercase shadow-lg flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>🔴 {t('newBadge')}</span>
                      </div>
                    )}
                    {post.isImportant && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-neutral-950 text-xs font-extrabold tracking-wider px-3 py-1.5 rounded-lg uppercase shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{t('importantBadge')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content body */}
                <div className="px-6 pb-6 pt-2 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="capitalize text-amber-400 font-semibold">{post.type}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Actions & Likes */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLikePost(post.id)}
                        className={`min-h-[42px] px-4 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-rose-950/60 border border-rose-800 text-rose-400 shadow-sm'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span className="font-mono tabular-nums text-sm">{post.likesCount}</span>
                        <span>{isLiked ? t('liked') : t('like')}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openWhatsApp(`Hola, vi su publicación "${post.title}" y quiero agendar.`)}
                        className="min-h-[42px] px-4 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('book')}
                        className="min-h-[42px] px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                      >
                        <Scissors className="w-4 h-4" />
                        <span>{t('bookAppointment')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
