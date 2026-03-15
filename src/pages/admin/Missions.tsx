import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  status: 'disponibile' | 'in corso' | 'completata';
  npc_id: string | null;
}

interface NPC {
  id: string;
  name: string;
}

const STATUSES: Mission['status'][] = ['disponibile', 'in corso', 'completata'];

export const MissionsAdminPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Mission, 'id'>>({
    title: '',
    description: '',
    status: 'disponibile',
    npc_id: null,
  });

  useEffect(() => {
    void fetchAll();
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    const [{ data: mData }, { data: nData }] = await Promise.all([
      supabase.from('missions').select('*').order('created_at', { ascending: false }),
      supabase.from('npcs').select('id, name').order('name'),
    ]);
    setMissions(mData ?? []);
    setNpcs(nData ?? []);
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'disponibile', npc_id: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, npc_id: formData.npc_id || null };
    if (editingId) {
      await supabase.from('missions').update(payload).eq('id', editingId);
    } else {
      await supabase.from('missions').insert([payload]);
    }
    resetForm();
    await fetchAll();
  };

  const handleEdit = (m: Mission) => {
    setFormData({ title: m.title, description: m.description ?? '', status: m.status, npc_id: m.npc_id });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa missione?')) return;
    await supabase.from('missions').delete().eq('id', id);
    await fetchAll();
  };

  const npcName = (id: string | null) => npcs.find((n) => n.id === id)?.name ?? null;

  return (
    <AdminLayout currentPage="missions">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">Missioni</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} /> Aggiungi missione
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-5">
              {editingId ? 'Modifica missione' : 'Nuova missione'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Titolo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <textarea
                placeholder="Descrizione (opzionale)"
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Mission['status'] })}
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>

                <select
                  value={formData.npc_id ?? ''}
                  onChange={(e) => setFormData({ ...formData, npc_id: e.target.value || null })}
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
                >
                  <option value="">— Nessun NPC —</option>
                  {npcs.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition">
                  {editingId ? 'Aggiorna' : 'Crea missione'}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition">
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-amber-300 py-8">Caricamento...</p>
        ) : missions.length === 0 ? (
          <p className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">Nessuna missione ancora.</p>
        ) : (
          <div className="grid gap-4">
            {missions.map((m) => (
              <div key={m.id} className="bg-slate-800 border border-amber-700/20 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-amber-300">{m.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 capitalize">{m.status}</span>
                  </div>
                  {npcName(m.npc_id) && (
                    <p className="text-amber-500/70 text-sm italic mb-2">NPC: {npcName(m.npc_id)}</p>
                  )}
                  {m.description && (
                    <p className="text-slate-300 text-sm line-clamp-2">{m.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(m)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(m.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
