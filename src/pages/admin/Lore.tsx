import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { LoreEntry, LORE_CATEGORIES, LoreCategory } from '../../types/lore';
import { Plus, Search, Trash2, Edit2, Save, X, Eye, EyeOff, BookOpen } from 'lucide-react';

const empty = (): Partial<LoreEntry> => ({
  title: '',
  category: 'storia',
  content: '',
  tags: [],
  is_public: true,
});

export const LoreAdminPage: React.FC = () => {
  const [entries, setEntries]     = useState<LoreEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState<LoreCategory | 'all'>('all');
  const [editing, setEditing]     = useState(false);
  const [current, setCurrent]     = useState<Partial<LoreEntry>>(empty());
  const [tagsInput, setTagsInput] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lore_entries')
      .select('*')
      .order('category')
      .order('title');
    setEntries((data as LoreEntry[]) || []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const openNew = () => {
    const e = empty();
    setCurrent(e);
    setTagsInput('');
    setEditing(true);
  };

  const openEdit = (e: LoreEntry) => {
    setCurrent(e);
    setTagsInput((e.tags || []).join(', '));
    setEditing(true);
  };

  const handleSave = async () => {
    if (!current.title || !current.content) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...current, tags, updated_at: new Date().toISOString() };
    let error;
    if (current.id) {
      ({ error } = await supabase.from('lore_entries').update(payload).eq('id', current.id));
    } else {
      ({ error } = await supabase.from('lore_entries').insert([payload]));
    }
    if (error) { alert('Errore: ' + error.message); return; }
    setEditing(false);
    void load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa voce del lore?')) return;
    await supabase.from('lore_entries').delete().eq('id', id);
    void load();
  };

  const togglePublic = async (e: LoreEntry) => {
    await supabase.from('lore_entries').update({ is_public: !e.is_public }).eq('id', e.id);
    void load();
  };

  const filtered = entries.filter((e) => {
    const matchCat = filterCat === 'all' || e.category === filterCat;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AdminLayout title="Lore di Sherdan" subtitle="Gestisci le voci dell'enciclopedia del mondo">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cerca nel lore..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as LoreCategory | 'all')}
            >
              <option value="all">Tutte le categorie</option>
              {LORE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
            <button
              onClick={openNew}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition"
            >
              <Plus className="w-4 h-4" /> Nuova voce
            </button>
          </div>
        </div>

        {/* Editor Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-amber-400" />
                  {current.id ? 'Modifica voce Lore' : 'Nuova voce Lore'}
                </h3>
                <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Titolo *</label>
                    <input
                      type="text"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      value={current.title || ''}
                      onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Categoria *</label>
                    <select
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                      value={current.category || 'storia'}
                      onChange={(e) => setCurrent({ ...current, category: e.target.value as LoreCategory })}
                    >
                      {LORE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contenuto *</label>
                  <textarea
                    rows={10}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm font-mono"
                    value={current.content || ''}
                    onChange={(e) => setCurrent({ ...current, content: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tag (separati da virgola)</label>
                  <input
                    type="text"
                    placeholder="es: Tharros, storia antica, Obsidium"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-amber-500 w-4 h-4"
                    checked={current.is_public ?? true}
                    onChange={(e) => setCurrent({ ...current, is_public: e.target.checked })}
                  />
                  <span className="text-slate-300 text-sm">Visibile ai giocatori</span>
                </label>
              </div>

              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/30">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
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

        {/* Entries list */}
        {loading ? (
          <p className="text-center text-slate-500 py-20">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 italic">Nessuna voce trovata.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((entry) => {
              const cat = LORE_CATEGORIES.find((c) => c.value === entry.category);
              return (
                <div
                  key={entry.id}
                  className="group bg-slate-800/40 border border-slate-700 hover:border-amber-500/30 rounded-xl p-5 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-500/80">
                          {cat?.emoji} {cat?.label}
                        </span>
                        {!entry.is_public && (
                          <span className="text-[10px] bg-red-900/40 text-red-400 border border-red-800/40 px-1.5 py-0.5 rounded">
                            Privata
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white truncate">{entry.title}</h4>
                      <p className="text-slate-400 text-sm line-clamp-2 mt-1">{entry.content}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => togglePublic(entry)}
                        className={`p-2 rounded-lg transition ${
                          entry.is_public ? 'text-green-400 hover:bg-green-400/10' : 'text-slate-500 hover:text-white'
                        }`}
                        title={entry.is_public ? 'Rendi privata' : 'Rendi pubblica'}
                      >
                        {entry.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(entry)}
                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {entry.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
