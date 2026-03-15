import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface SessionLog {
  id: string;
  session_number: number;
  title: string;
  date: string;
  summary: string;
  detailed_narrative: string;
  featured_image_url?: string | null;
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

  useEffect(() => { void fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_logs')
        .select('*')
        .order('session_number', { ascending: false });
      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Errore caricamento sessioni:', error);
    } finally {
      setIsLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('session_logs').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('session_logs').insert([formData]);
        if (error) throw error;
      }
      resetForm();
      await fetchSessions();
    } catch (error) {
      console.error('Errore salvataggio sessione:', error);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(it.adminSessions.confirmDelete)) return;
    try {
      const { error } = await supabase.from('session_logs').delete().eq('id', id);
      if (error) throw error;
      await fetchSessions();
    } catch (error) {
      console.error('Errore eliminazione sessione:', error);
    }
  };

  return (
    <AdminLayout currentPage="sessions">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">{it.adminSessions.title}</h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition">
              <Plus size={18} />{it.adminSessions.add}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-5">
              {editingId ? it.adminSessions.edit : it.adminSessions.addNew}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input type="number" placeholder={it.adminSessions.fields.sessionNumber}
                  value={formData.session_number}
                  onChange={(e) => setFormData({ ...formData, session_number: parseInt(e.target.value, 10) || 1 })}
                  min={1} required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
                <input type="date" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                />
              </div>
              <input type="text" placeholder={it.adminSessions.fields.title}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />
              <textarea placeholder={it.adminSessions.fields.summary}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required rows={3}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />
              <textarea placeholder={it.adminSessions.fields.detailedNarrative}
                value={formData.detailed_narrative}
                onChange={(e) => setFormData({ ...formData, detailed_narrative: e.target.value })}
                required rows={7}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />
              <input type="text" placeholder={it.adminSessions.fields.featuredImageUrl}
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition">
                  {editingId ? it.adminSessions.actions.update : it.adminSessions.actions.create}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition">
                  {it.adminSessions.actions.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-300 py-8">{it.adminSessions.loading}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">{it.adminSessions.empty}</div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-slate-800 border border-amber-700/20 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-300">
                    {it.adminSessions.sessionLabel} {session.session_number}: {session.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">{session.date}</p>
                  <p className="text-slate-300 text-sm mt-3 line-clamp-3">{session.summary}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(session)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(session.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
