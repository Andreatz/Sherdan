import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface SessionLog {
  id: string;
  session_number: number;
  title: string;
  date: string;
  summary: string;
  detailed_narrative: string;
  featured_image_url?: string;
}

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    session_number: 1,
    title: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    detailed_narrative: '',
    featured_image_url: '',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_logs')
        .select('*')
        .order('session_number', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('session_logs')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('session_logs')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleEdit = (session: SessionLog) => {
    setFormData({
      session_number: session.session_number,
      title: session.title,
      date: session.date,
      summary: session.summary,
      detailed_narrative: session.detailed_narrative,
      featured_image_url: session.featured_image_url || '',
    });
    setEditingId(session.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const { error } = await supabase
        .from('session_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      session_number: sessions.length + 1,
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      detailed_narrative: '',
      featured_image_url: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <AdminLayout currentPage="sessions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-400">Session Logs</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
            >
              <Plus size={20} />
              Add Session
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">{editingId ? 'Edit' : 'Add New'} Session</h2>
              <button onClick={resetForm} className="text-amber-400 hover:text-amber-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Session Number"
                  value={formData.session_number}
                  onChange={(e) => setFormData({ ...formData, session_number: parseInt(e.target.value) })}
                  min="1"
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <textarea
                placeholder="Summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <textarea
                placeholder="Detailed Narrative"
                value={formData.detailed_narrative}
                onChange={(e) => setFormData({ ...formData, detailed_narrative: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <input
                type="text"
                placeholder="Featured Image URL"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded transition"
                >
                  {editingId ? 'Update' : 'Create'} Session
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
          <div className="text-center text-amber-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-amber-100 py-8">
            <p>No sessions yet. Create your first session log!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-slate-700 border border-amber-700/30 rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-400">Session {session.session_number}: {session.title}</h3>
                  <p className="text-amber-900 text-sm mb-2">{session.date}</p>
                  <p className="text-amber-100 text-sm line-clamp-2">{session.summary}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
