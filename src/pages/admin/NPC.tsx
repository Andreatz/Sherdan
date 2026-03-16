import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { NPC, NpcRelationship, NpcStatus, REL_LABELS, STATUS_LABELS } from '../../types/npc';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Eye, EyeOff, Users } from 'lucide-react';
import { MAP_LOCATIONS } from '../../data/mapData';

const ZONE_OPTIONS = [
  ...MAP_LOCATIONS.filter(l => l.type === 'region').map(l => l.name),
  ...MAP_LOCATIONS.filter(l => l.type === 'city').map(l => l.name),
];

const EMPTY: Omit<NPC, 'id' | 'created_at'> = {
  name: '', image_url: null, description: null, role: null,
  faction: null, zone: null,
  status: 'sconosciuto', relationship: 'sconosciuto',
  revealed: false, dm_notes: null,
};

export const NpcAdminPage: React.FC = () => {
  const [npcs, setNpcs]       = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NPC> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState<'tutti' | NpcRelationship>('tutti');

  const load = async () => {
    const { data } = await supabase.from('npcs').select('*').order('name');
    setNpcs((data as NPC[]) || []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setError(''); setSaving(true);
    const payload = {
      name:         editing.name,
      image_url:    editing.image_url    || null,
      description:  editing.description  || null,
      role:         editing.role         || null,
      faction:      editing.faction      || null,
      zone:         editing.zone         || null,
      status:       editing.status       ?? 'sconosciuto',
      relationship: editing.relationship ?? 'sconosciuto',
      revealed:     editing.revealed     ?? false,
      dm_notes:     editing.dm_notes     || null,
    };
    const { error: err } = editing.id
      ? await supabase.from('npcs').update(payload).eq('id', editing.id)
      : await supabase.from('npcs').insert(payload);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditing(null); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo NPC?')) return;
    await supabase.from('npcs').delete().eq('id', id); load();
  };

  const toggleReveal = async (n: NPC) => {
    await supabase.from('npcs').update({ revealed: !n.revealed }).eq('id', n.id); load();
  };

  const filtered = npcs.filter(n => filter === 'tutti' || n.relationship === filter);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-amber-300">Database NPC</h1>
          <button onClick={() => setEditing({ ...EMPTY })}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition">
            <Plus size={16} /> Aggiungi NPC
          </button>
        </div>

        {/* Form inline */}
        {editing && (
          <div className="mb-8 bg-slate-800 border border-amber-700/30 rounded-2xl p-6">
            <h2 className="text-xl text-amber-300 mb-4">{editing.id ? 'Modifica' : 'Nuovo'} NPC</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
                <input value={editing.name || ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Ruolo */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Ruolo</label>
                <input value={editing.role || ''} onChange={e => setEditing(p => ({ ...p!, role: e.target.value }))}
                  placeholder="es. Capitano della guardia"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Fazione */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Fazione</label>
                <input value={editing.faction || ''} onChange={e => setEditing(p => ({ ...p!, faction: e.target.value }))}
                  placeholder="es. Marina Imperiale"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Zona */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Zona</label>
                <select value={editing.zone || ''} onChange={e => setEditing(p => ({ ...p!, zone: e.target.value || null }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  <option value="">— Nessuna —</option>
                  {ZONE_OPTIONS.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              {/* Stato */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Stato</label>
                <select value={editing.status || 'sconosciuto'} onChange={e => setEditing(p => ({ ...p!, status: e.target.value as NpcStatus }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  {(['vivo','morto','sconosciuto'] as NpcStatus[]).map(s =>
                    <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
                </select>
              </div>
              {/* Relazione */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Relazione col party</label>
                <select value={editing.relationship || 'sconosciuto'} onChange={e => setEditing(p => ({ ...p!, relationship: e.target.value as NpcRelationship }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none">
                  {(['alleato','neutrale','ostile','sconosciuto'] as NpcRelationship[]).map(r =>
                    <option key={r} value={r}>{REL_LABELS[r].emoji} {REL_LABELS[r].label}</option>)}
                </select>
              </div>
              {/* URL immagine */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">URL Immagine</label>
                <input value={editing.image_url || ''} onChange={e => setEditing(p => ({ ...p!, image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none" />
              </div>
              {/* Descrizione pubblica */}
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Descrizione pubblica</label>
                <textarea value={editing.description || ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-amber-600 outline-none resize-none" />
              </div>
              {/* Note DM */}
              <div className="sm:col-span-2">
                <label className="text-xs text-red-400 mb-1 block">🔒 Note segrete DM (non visibili ai giocatori)</label>
                <textarea value={editing.dm_notes || ''} onChange={e => setEditing(p => ({ ...p!, dm_notes: e.target.value }))}
                  rows={3} placeholder="Motivazioni, segreti, trame future..."
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
          {(['tutti','alleato','neutrale','ostile','sconosciuto'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                filter === f ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
              }`}>
              {f === 'tutti' ? 'Tutti' : REL_LABELS[f].emoji + ' ' + REL_LABELS[f].label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-600 self-center">{filtered.length} NPC</span>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-slate-500 text-center py-12">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="mx-auto text-slate-700 mb-3" />
            <p className="text-slate-500">Nessun NPC. Aggiungine uno!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => (
              <div key={n.id} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                {n.image_url
                  ? <img src={n.image_url} alt={n.name} className="w-11 h-11 rounded-lg object-cover border border-slate-600 flex-shrink-0" />
                  : <div className="w-11 h-11 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0"><Users size={18} className="text-slate-500" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="text-amber-300 font-semibold truncate">{n.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {[n.role, n.faction, n.zone].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:block ${STATUS_LABELS[n.status].color}`}>
                  {STATUS_LABELS[n.status].label}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:block ${REL_LABELS[n.relationship].color} bg-slate-900/60`}>
                  {REL_LABELS[n.relationship].emoji} {REL_LABELS[n.relationship].label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  n.revealed ? 'text-green-400 border-green-700/40' : 'text-slate-500 border-slate-700'
                }`}>{n.revealed ? 'Vis.' : 'Nasc.'}</span>
                <div className="flex gap-1">
                  <button onClick={() => toggleReveal(n)} title={n.revealed ? 'Nascondi' : 'Rivela'}
                    className="p-2 text-slate-400 hover:text-amber-300 transition">
                    {n.revealed ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => setEditing({ ...n })} className="p-2 text-slate-400 hover:text-amber-300 transition">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(n.id)} className="p-2 text-slate-400 hover:text-red-400 transition">
                    <Trash2 size={15} />
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
