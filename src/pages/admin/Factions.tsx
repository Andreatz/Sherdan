import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Faction, FactionCategory, CATEGORY_CONFIG } from '../../types/faction';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Eye, EyeOff, Shield } from 'lucide-react';

const EMPTY: Omit<Faction, 'id' | 'created_at'> = {
  name: '', category: 'mare', tagline: null, description: null,
  base: null, image_url: null, symbol_emoji: null,
  revealed: false, dm_notes: null,
};

export const FactionAdminPage: React.FC = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState<Partial<Faction> | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [filter, setFilter]     = useState<FactionCategory | 'tutti'>('tutti');

  const load = async () => {
    const { data } = await supabase.from('factions').select('*').order('category').order('name');
    setFactions((data as Faction[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.name) return;
    setError(''); setSaving(true);
    const payload = {
      name:         editing.name,
      category:     editing.category     ?? 'mare',
      tagline:      editing.tagline      || null,
      description:  editing.description  || null,
      base:         editing.base         || null,
      image_url:    editing.image_url    || null,
      symbol_emoji: editing.symbol_emoji || null,
      revealed:     editing.revealed     ?? false,
      dm_notes:     editing.dm_notes     || null,
    };
    const { error: err } = editing.id
      ? await supabase.from('factions').update(payload).eq('id', editing.id)
      : await supabase.from('factions').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa fazione?')) return;
    await supabase.from('factions').delete().eq('id', id); load();
  };

  const toggleReveal = async (f: Faction) => {
    await supabase.from('factions').update({ revealed: !f.revealed }).eq('id', f.id); load();
  };

  const filtered = factions.filter(f => filter === 'tutti' || f.category === filter);

  const CATS: (FactionCategory | 'tutti')[] = ['tutti', 'mare', 'continente', 'ombra'];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-amber-300 flex items-center gap-2"><Shield size={24} /> Fazioni</h1>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition">
            <Plus size={16} /> Aggiungi
          </button>
        </div>

        {/* Form inline */}
        {editing && (
          <div className="mb-8 bg-slate-800 border border-amber-700/30 rounded-2xl p-6">
            <h2 className="text-xl text-amber-300 mb-4">{editing.id ? 'Modifica' : 'Nuova'} Fazione</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
                <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Categoria */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Categoria</label>
                <select value={editing.category || 'mare'} onChange={e => setEditing(p => ({ ...p!, category: e.target.value as FactionCategory }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  <option value="mare">⚓ Signori del Mare</option>
                  <option value="continente">🏛️ Giganti del Continente</option>
                  <option value="ombra">🕯️ Mani nell'Ombra</option>
                </select>
              </div>
              {/* Symbol emoji */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Emoji simbolo (se senza immagine)</label>
                <input value={editing.symbol_emoji || ''} onChange={e => setEditing(p => ({ ...p!, symbol_emoji: e.target.value }))}
                  placeholder="es. ⚓ 🔥 💀"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Motto */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Motto / Tagline</label>
                <input value={editing.tagline || ''} onChange={e => setEditing(p => ({ ...p!, tagline: e.target.value }))}
                  placeholder="es. Nessun padrone, nessun marito, solo il mare"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Base */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Sede / Base</label>
                <input value={editing.base || ''} onChange={e => setEditing(p => ({ ...p!, base: e.target.value }))}
                  placeholder="es. L'Isola della Vedova"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* URL immagine */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">URL Immagine</label>
                <input value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Descrizione pubblica */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Descrizione pubblica</label>
                <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                  rows={5} placeholder="Storia, caratteristiche, modus operandi..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none resize-none" />
              </div>
              {/* Note DM */}
              <div className="sm:col-span-2">
                <label className="text-xs text-red-400 mb-1 block">🔒 Note segrete DM</label>
                <textarea value={editing.dm_notes || ''} onChange={e => setEditing(p => ({ ...p!, dm_notes: e.target.value }))}
                  rows={3} placeholder="Obiettivi segreti, legami con altre fazioni, trame future..."
                  className="w-full px-3 py-2 bg-slate-900/60 border border-red-900/40 rounded-lg text-white focus:border-red-600 outline-none resize-none" />
              </div>
              {/* Reveal */}
              <div className="sm:col-span-2">
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
                className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold transition">
                {saving ? 'Salvo...' : 'Salva'}
              </button>
              <button onClick={() => setEditing(null)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-xl transition">Annulla</button>
            </div>
          </div>
        )}

        {/* Filtri */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATS.map(c => {
            const cfg = c !== 'tutti' ? CATEGORY_CONFIG[c] : null;
            return (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  filter === c ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                }`}>
                {c === 'tutti' ? 'Tutte' : `${cfg!.emoji} ${cfg!.label}`}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-slate-600 self-center">{filtered.length} fazioni</span>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-slate-500 text-center py-12">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Shield size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">Nessuna fazione. Aggiungine una!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(f => {
              const cfg = CATEGORY_CONFIG[f.category];
              return (
                <div key={f.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                  {f.image_url
                    ? <img src={f.image_url} alt={f.name} className="w-11 h-11 rounded-lg object-cover border border-slate-600 flex-shrink-0" />
                    : <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl bg-slate-700`}>{f.symbol_emoji ?? '🏴'}</div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-300 font-semibold truncate">{f.name}</p>
                    <p className="text-xs text-slate-500 truncate">{cfg.emoji} {cfg.label}{f.base ? ` · ${f.base}` : ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:block ${
                    f.revealed ? 'text-green-400 border-green-700/40' : 'text-slate-500 border-slate-700'
                  }`}>{f.revealed ? 'Visibile' : 'Nascosta'}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleReveal(f)} title={f.revealed ? 'Nascondi' : 'Rivela'}
                      className="p-2 text-slate-400 hover:text-amber-300 transition">
                      {f.revealed ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => setEditing({ ...f })} className="p-2 text-slate-400 hover:text-amber-300 transition"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-400 transition"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
