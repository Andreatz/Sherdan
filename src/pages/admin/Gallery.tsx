import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description?: string | null;
  session_id?: string | null;
  category: string;
  upload_date: string;
}

interface SessionItem {
  id: string;
  session_number: number;
}

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: '',
    session_id: '',
    category: 'general',
  });

  useEffect(() => {
    void fetchGallery();
    void fetchSessions();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Errore nel caricamento della galleria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_logs')
        .select('id, session_number')
        .order('session_number', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Errore nel caricamento delle sessioni:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      title: '',
      description: '',
      session_id: '',
      category: 'general',
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        image_url: formData.image_url,
        title: formData.title,
        description: formData.description,
        session_id: formData.session_id || null,
        category: formData.category,
      };

      const { error } = await supabase
        .from('gallery_items')
        .insert([submitData]);

      if (error) throw error;

      resetForm();
      await fetchGallery();
    } catch (error) {
      console.error('Errore nel salvataggio dell’immagine:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(it.adminGallery.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchGallery();
    } catch (error) {
      console.error('Errore nell’eliminazione dell’immagine:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">
            {it.adminGallery.title}
          </h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} />
              {it.adminGallery.add}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-5">
              {it.adminGallery.formTitle}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder={it.adminGallery.fields.imageUrl}
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              {formData.image_url && (
                <div>
                  <p className="text-amber-200 text-sm mb-2">{it.adminGallery.preview}</p>
                  <img
                    src={formData.image_url}
                    alt={it.adminGallery.preview}
                    className="w-full max-h-72 object-cover rounded-lg border border-amber-700/20"
                  />
                </div>
              )}

              <input
                type="text"
                placeholder={it.adminGallery.fields.title}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <textarea
                placeholder={it.adminGallery.fields.description}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.session_id}
                  onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                >
                  <option value="">{it.adminGallery.noSession}</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {it.adminGallery.session} {session.session_number}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder={it.adminGallery.fields.category}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {it.adminGallery.actions.addToGallery}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {it.adminGallery.actions.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-300 py-8">
            {it.adminGallery.loading}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">
            {it.adminGallery.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 border border-amber-700/20 rounded-xl overflow-hidden group"
              >
                <div className="relative h-44 bg-slate-700 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-amber-300 truncate">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{item.category}</p>
                  {item.description && (
                    <p className="text-slate-300 text-sm mt-3 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
