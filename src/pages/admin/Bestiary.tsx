import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Creature, DangerLevel } from '../../types/bestiary';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Eye, EyeOff, Skull } from 'lucide-react';

const EMPTY: Omit<Creature, 'id' | 'created_at'> = {
  name: '',
  image_url: '',
  description: '',
  danger_level: 'medio',
  creature_type: '',
  habitat: '',
  revealed: false,
  session_encountered: '',
};

export const BestiaryAdminPage: React.FC = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<Partial<Creature> | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const load = async () => {
    const { data } = await supabase.from('creatures').select('*').order('created_at', { ascending: false });
    setCreatures((data as Creature[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setError('');
    setSaving(true);
    const payload = {
      name:                editing.name,
      image_url:           editing.image_url || null,
      description:         editing.description,
      danger_level:        editing.danger_level,
      creature_type:       editing.creature_type,
      habitat:             editing.habitat || null,
      revealed:            editing.revealed ?? false,
      session_encountered: editing.session_encountered || null,
    };
    const { error: err } = editing.id
      ? await supabase.from('creatures').update(payload).eq('id', editing.id)
      : await supabase.from('creatures').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa creatura?')) return;
    await supabase.from('creatures').delete().eq('id', id);
    load();
  };

  const toggleReveal = async (c: Creature) => {
    await supabase.from('creatures').update({ revealed: !c.revealed }).eq('id', c.id);
    load();
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-amber-300">Bestiario</h1>
          <button
            onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition"
          >
            <Plus size={16} /> Aggiungi creatura
          </button>
        </div>

        {/* Form modale inline */}
        {editing && (
          <div className="mb-8 bg-slate-800 border border-amber-700/30 rounded-2xl p-6">
            <h2 className="text-xl text-amber-300 mb-4">{editing.id ? 'Modifica' : 'Nuova'} creatura</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
                <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tipo (es. Non morto, Bestia)</label>
                <input value={editing.creature_type || ''} onChange={e => setEditing(p => ({ ...p!, creature_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Pericolosità</label>
                <select value={editing.danger_level || 'medio'} onChange={e => setEditing(p => ({ ...p!, danger_level: e.target.value as DangerLevel }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  {(['basso','medio','alto','letale'] as DangerLevel[]).map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Habitat</label>
                <input value={editing.habitat || ''} onChange={e => setEditing(p => ({ ...p!, habitat: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Sessione incontro</label>
                <input value={editing.session_encountered || ''} onChange={e => setEditing(p => ({ ...p!, session_encountered: e.target.value }))}
                  placeholder="es. Sessione 3"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">URL Immagine</label>
                <input value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Descrizione *</label>
                <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none resize-none" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={editing.revealed ?? false}
                    onChange={e => setEditing(p => ({ ...p!, revealed: e.target.checked }))}
                    className="accent-amber-500 w-4 h-4" />
                  <span className="text-slate-300 text-sm">Visibile ai giocatori</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSave} disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl transition font-semibold">
                {saving ? 'Salvo...' : 'Salva'}
              </button>
              <button onClick={() => setEditing(null)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-xl transition">
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Lista creature */}
        {loading ? (
          <p className="text-slate-500 text-center py-12">Caricamento...</p>
        ) : creatures.length === 0 ? (
          <div className="text-center py-16">
            <Skull size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">Nessuna creatura ancora. Aggiungine una!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {creatures.map(c => (
              <div key={c.id} className="flex items-center gap-4 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                {c.image_url && <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-lg object-cover border border-slate-600" />}
                {!c.image_url && <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center"><Skull size={20} className="text-slate-500" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-amber-300 font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.creature_type} · {c.danger_level}{c.session_encountered ? ` · ${c.session_encountered}` : ''}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  c.revealed ? 'text-green-400 border-green-700/40 bg-green-950/20' : 'text-slate-500 border-slate-700 bg-slate-800'
                }`}>
                  {c.revealed ? 'Visibile' : 'Nascosta'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => toggleReveal(c)} title={c.revealed ? 'Nascondi' : 'Rivela'}
                    className="p-2 text-slate-400 hover:text-amber-300 transition">
                    {c.revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => setEditing({ ...c })} className="p-2 text-slate-400 hover:text-amber-300 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-400 transition">
                    <Trash2 size={16} />
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
