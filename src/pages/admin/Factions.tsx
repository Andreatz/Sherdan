import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Faction, FactionCategory, CATEGORY_CONFIG, reputationLabel } from '../../types/faction';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Eye, EyeOff, Shield } from 'lucide-react';

const EMPTY: Omit<Faction, 'id' | 'created_at'> = {
  name: '', subtitle: null, description: null,
  category: 'altro', color: '#6b7280',
  motto: null, base: null,
  reputation: 0, revealed: false, dm_notes: null,
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
    if (!editing?.name) return;
    setError(''); setSaving(true);
    const payload = {
      name:        editing.name,
      subtitle:    editing.subtitle    || null,
      description: editing.description || null,
      category:    editing.category    ?? 'altro',
      color:       editing.color       || '#6b7280',
      motto:       editing.motto       || null,
      base:        editing.base        || null,
      reputation:  editing.reputation  ?? 0,
      revealed:    editing.revealed    ?? false,
      dm_notes:    editing.dm_notes    || null,
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
  const CATS: (FactionCategory | 'tutti')[] = ['tutti', 'signori_del_mare', 'istituzioni', 'societa_segrete', 'altro'];

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
              {/* Sottotitolo */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Sottotitolo</label>
                <input value={editing.subtitle || ''} onChange={e => setEditing(p => ({ ...p!, subtitle: e.target.value }))}
                  placeholder="es. La ciurma femminile"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Categoria */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Categoria</label>
                <select value={editing.category || 'altro'}
                  onChange={e => setEditing(p => ({ ...p!, category: e.target.value as FactionCategory }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  <option value="signori_del_mare">⚓ Signori del Mare</option>
                  <option value="istituzioni">🏛️ Giganti del Continente</option>
                  <option value="societa_segrete">🕯️ Mani nell'Ombra</option>
                  <option value="altro">🔰 Altra Fazione</option>
                </select>
              </div>
              {/* Colore */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Colore identificativo</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={editing.color || '#6b7280'}
                    onChange={e => setEditing(p => ({ ...p!, color: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border border-slate-600 bg-transparent p-0.5" />
                  <input value={editing.color || ''} onChange={e => setEditing(p => ({ ...p!, color: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none font-mono text-sm" />
                </div>
              </div>
              {/* Motto */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Motto</label>
                <input value={editing.motto || ''} onChange={e => setEditing(p => ({ ...p!, motto: e.target.value }))}
                  placeholder="es. Nessun padrone, nessun marito, solo il mare"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Sede */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Sede / Base</label>
                <input value={editing.base || ''} onChange={e => setEditing(p => ({ ...p!, base: e.target.value }))}
                  placeholder="es. L'Isola della Vedova"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Reputazione */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Reputazione: <span className={`font-semibold ${reputationLabel(editing.reputation ?? 0).color}`}>
                    {editing.reputation ?? 0} — {reputationLabel(editing.reputation ?? 0).label}
                  </span>
                </label>
                <input type="range" min={-100} max={100} step={5}
                  value={editing.reputation ?? 0}
                  onChange={e => setEditing(p => ({ ...p!, reputation: Number(e.target.value) }))}
                  className="w-full accent-amber-500" />
              </div>
              {/* Descrizione pubblica */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Descrizione pubblica</label>
                <textarea value={editing.description || ''}
                  onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                  rows={5} placeholder="Storia, caratteristiche, modus operandi..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none resize-none" />
              </div>
              {/* Note DM */}
              <div className="sm:col-span-2">
                <label className="text-xs text-red-400 mb-1 block">🔒 Note segrete DM</label>
                <textarea value={editing.dm_notes || ''}
                  onChange={e => setEditing(p => ({ ...p!, dm_notes: e.target.value }))}
                  rows={3} placeholder="Obiettivi segreti, legami con altre fazioni, trame future..."
                  className="w-full px-3 py-2 bg-slate-900/60 border border-red-900/40 rounded-lg text-white focus:border-red-600 outline-none resize-none" />
              </div>
              {/* Revealed */}
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
              const rep = reputationLabel(f.reputation);
              return (
                <div key={f.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                  {/* Dot colore */}
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-300 font-semibold truncate">{f.name}</p>
                    <p className="text-xs text-slate-500 truncate">{cfg.emoji} {cfg.label}{f.base ? ` · ${f.base}` : ''}</p>
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${rep.color}`}>{rep.label}</span>
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
