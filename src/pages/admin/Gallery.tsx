import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description?: string;
  session_id?: string;
  category: string;
  upload_date: string;
}

interface Session {
  id: string;
  session_number: number;
}

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
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
    fetchGallery();
    fetchSessions();
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
      console.error('Error fetching gallery:', error);
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
      console.error('Error fetching sessions:', error);
    }
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
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
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

  return (
    <AdminLayout currentPage="gallery">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-400">Gallery</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
            >
              <Plus size={20} />
              Add Image
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">Add Image</h2>
              <button onClick={resetForm} className="text-amber-400 hover:text-amber-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-full h-48 object-cover rounded" />
              )}

              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={formData.session_id}
                  onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="">No Session</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      Session {session.session_number}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded transition"
                >
                  Add to Gallery
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-400">Loading gallery...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-amber-100 py-8">
            <p>No images yet. Add some campaign memories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-700 border border-amber-700/30 rounded-lg overflow-hidden group">
                <div className="relative overflow-hidden h-40 bg-slate-600">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-amber-400 truncate">{item.title}</h3>
                  <p className="text-xs text-amber-900">{item.category}</p>
                  <p className="text-xs text-amber-100 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
