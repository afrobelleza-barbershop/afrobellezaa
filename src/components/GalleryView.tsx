import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Plus, Trash2, X, Eye, Sparkles } from 'lucide-react';
import type { GalleryItem } from '../types/index.ts';

export const GalleryView: React.FC = () => {
  const { gallery, currentRole, deleteGalleryPhoto, addGalleryPhoto, t, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);

  // New photo modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('cortes');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const categories = [
    { id: 'all', label: lang === 'fr' ? 'Tous' : 'Todos' },
    { id: 'cortes', label: lang === 'fr' ? 'Coupes' : 'Cortes' },
    { id: 'barbas', label: lang === 'fr' ? 'Barbes' : 'Barbas' },
    { id: 'diseños', label: lang === 'fr' ? 'Designs' : 'Diseños' },
    { id: 'salon', label: lang === 'fr' ? 'Salon' : 'Salón' },
  ];

  const filteredGallery = selectedCategory === 'all'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const ok = await addGalleryPhoto({
      title: newTitle.trim(),
      category: newCategory,
      imageUrl: newImageUrl.trim(),
      description: newDesc.trim()
    });

    if (ok) {
      setShowAddModal(false);
      setNewTitle('');
      setNewImageUrl('');
      setNewDesc('');
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            {t('sectionGallery')}
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {t('galleryTitle')}
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            {t('gallerySubtitle')}
          </p>
        </div>

        {currentRole === 'owner' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="min-h-[44px] px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-md uppercase self-start"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('newPhotoButton')}</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 font-extrabold shadow-md'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredGallery.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 rounded-3xl border border-neutral-800 text-neutral-400">
          No hay fotos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col shadow-lg"
            >
              <div 
                className="relative aspect-4/3 overflow-hidden bg-neutral-950 cursor-pointer"
                onClick={() => setPreviewImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-900/80 text-white flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">{item.title}</h3>
                  <span className="text-[11px] text-amber-400 capitalize font-medium">{item.category}</span>
                </div>

                {currentRole === 'owner' && (
                  <button
                    onClick={() => deleteGalleryPhoto(item.id)}
                    className="p-2 min-h-[40px] min-w-[40px] text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-neutral-950/80 hover:bg-neutral-800 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-xs text-amber-400 capitalize font-bold">{previewImage.category}</span>
              <h2 className="font-display font-bold text-xl text-white">{previewImage.title}</h2>
              {previewImage.description && (
                <p className="text-sm text-neutral-300 mt-2">{previewImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 rounded-3xl border border-neutral-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-lg text-white">
                {t('newPhotoButton')}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Título de la foto *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Taper Fade con barba"
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="cortes">Cortes</option>
                  <option value="barbas">Barbas</option>
                  <option value="diseños">Diseños</option>
                  <option value="salon">Salón</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">URL de la imagen *</label>
                <input
                  type="text"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="/src/assets/images/... o URL externa"
                  className="w-full h-11 bg-neutral-950 border border-neutral-800 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-2 pt-1 text-[11px] text-neutral-400">
                  <span>Plantillas:</span>
                  <button 
                    type="button" 
                    onClick={() => setNewImageUrl('/src/assets/images/barber_fade_cut_1791472965182.jpg')}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    Fade
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewImageUrl('/src/assets/images/barber_beard_sculpt_1791472974300.jpg')}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    Barba
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setNewImageUrl('/src/assets/images/barber_artistic_design_1791472991635.jpg')}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    Diseño
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-300">Descripción (opcional)</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl uppercase"
                >
                  {t('add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
