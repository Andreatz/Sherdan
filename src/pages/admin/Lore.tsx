import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { LoreEntry, LORE_CATEGORIES } from '../../types/lore';
import { Plus, Search, Save, X, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

export const LoreAdminPage: React.FC = () => {
  const [entries, setEntries]       = useState<LoreEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [editing, setEditing]       = useState(false);
  const [current, setCurrent]       = useState<Partial<LoreEntry> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lore_entries')
      .select('*')
      .order('category')
      .order('title');
    setEntries((data as LoreEntry[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    if (!current?.title || !current?.content || !current?.category) return;
    const payload = { ...current, updated_at: new Date().toISOString() };
    if (current.id) {
      await supabase.from('lore_entries').update(payload).eq('id', current.id);
    } else {
      await supabase.from('lore_entries').insert([payload]);
    }
    setEditing(false);
    setCurrent(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa voce del lore?')) return;
    await supabase.from('lore_entries').delete().eq('id', id);
    await load();
  };

  const togglePublic = async (entry: LoreEntry) => {
    await supabase.from('lore_entries').update({ is_public: !entry.is_public }).eq('id', entry.id);
    await load();
  };

  const filtered = entries.filter(e => {
    const matchCat    = category === 'all' || e.category === category;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminLayout title="Lore di Sherdan" subtitle="Gestisci la storia, i luoghi e la cultura del mondo">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cerca nel lore..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="all">Tutte le categorie</option>
              {LORE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setCurrent({ category: 'storia', tags: [], is_public: true });
                setEditing(true);
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Nuova voce
            </button>
          </div>
        </div>

        {/* Modal editor */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {current?.id ? 'Modifica voce Lore' : 'Nuova voce Lore'}
                </h3>
                <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Titolo</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      value={current?.title || ''}
                      onChange={e => setCurrent({ ...current, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Categoria</label>
                    <select
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      value={current?.category || 'storia'}
                      onChange={e => setCurrent({ ...current, category: e.target.value })}
                    >
                      {LORE_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contenuto</label>
                  <textarea
                    rows={12}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    value={current?.content || ''}
                    onChange={e => setCurrent({ ...current, content: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Tags (separati da virgola)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      value={(current?.tags || []).join(', ')}
                      onChange={e => setCurrent({ ...current, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      placeholder="es. antica, guerra, magia"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-slate-700 text-amber-600 bg-slate-800"
                        checked={current?.is_public ?? true}
                        onChange={e => setCurrent({ ...current, is_public: e.target.checked })}
                      />
                      <span className="text-slate-300">Visibile ai giocatori</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/30">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Salva
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista voci */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-20 text-slate-500">Caricamento...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
              <p className="text-slate-500 italic">Nessuna voce trovata. Aggiungi la prima voce del lore!</p>
            </div>
          ) : (
            filtered.map(entry => (
              <div
                key={entry.id}
                className="group bg-slate-800/40 border border-slate-700 hover:border-amber-700/40 transition rounded-xl p-5"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-500/80">
                        {LORE_CATEGORIES.find(c => c.value === entry.category)?.icon}{' '}
                        {LORE_CATEGORIES.find(c => c.value === entry.category)?.label ?? entry.category}
                      </span>
                      {!entry.is_public && (
                        <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <EyeOff className="w-2.5 h-2.5" /> Privato
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white truncate">{entry.title}</h4>
                    <p className="text-slate-400 text-sm line-clamp-2 mt-1">{entry.content}</p>
                    {entry.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePublic(entry)}
                      className={`p-2 rounded-lg transition-colors ${
                        entry.is_public ? 'text-green-400 hover:text-green-300' : 'text-slate-500 hover:text-white'
                      }`}
                      title={entry.is_public ? 'Rendi privato' : 'Rendi pubblico'}
                    >
                      {entry.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setCurrent(entry); setEditing(true); }}
                      className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
