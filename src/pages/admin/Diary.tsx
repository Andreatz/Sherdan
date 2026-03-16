import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { DiaryEntry, DIARY_CATEGORIES } from '../../types/diary';
import { Plus, Search, Tag, Book, Pin, Trash2, Edit2, Save, X, Calendar } from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<DiaryEntry> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dm_diary')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching diary:', error);
    else setEntries(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!currentEntry?.title || !currentEntry?.content) return;

    const entryData = {
      ...currentEntry,
      updated_at: new Date().toISOString()
    };

    let error;
    if (currentEntry.id) {
      ({ error } = await supabase
        .from('dm_diary')
        .update(entryData)
        .eq('id', currentEntry.id));
    } else {
      ({ error } = await supabase
        .from('dm_diary')
        .insert([entryData]));
    }

    if (error) {
      alert('Errore durante il salvataggio');
    } else {
      setIsEditing(false);
      setCurrentEntry(null);
      fetchEntries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa nota?')) return;
    const { error } = await supabase.from('dm_diary').delete().eq('id', id);
    if (error) alert('Errore eliminazione');
    else fetchEntries();
  };

  const togglePin = async (entry: DiaryEntry) => {
    const { error } = await supabase
      .from('dm_diary')
      .update({ is_pinned: !entry.is_pinned })
      .eq('id', entry.id);
    if (error) console.error(error);
    else fetchEntries();
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Diario del DM" subtitle="Note private e segreti della campagna">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cerca nelle note..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tutte le categorie</option>
              {DIARY_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setCurrentEntry({ category: 'generale', tags: [], is_pinned: false });
                setIsEditing(true);
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Nuova Nota
            </button>
          </div>
        </div>

        {/* Editor Modal/Overlay */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Book className="text-amber-400" />
                  {currentEntry?.id ? 'Modifica Nota' : 'Nuova Nota Privata'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
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
                      value={currentEntry?.title || ''}
                      onChange={e => setCurrentEntry({...currentEntry, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Categoria</label>
                      <select
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        value={currentEntry?.category || 'generale'}
                        onChange={e => setCurrentEntry({...currentEntry, category: e.target.value})}
                      >
                        {DIARY_CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Sessione #</label>
                      <input
                        type="number"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        value={currentEntry?.session_number || ''}
                        onChange={e => setCurrentEntry({...currentEntry, session_number: e.target.value ? parseInt(e.target.value) : null})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contenuto (Segreti, idee, appunti...)</label>
                  <textarea
                    rows={12}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-sm"
                    value={currentEntry?.content || ''}
                    onChange={e => setCurrentEntry({...currentEntry, content: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-700 text-amber-600 focus:ring-amber-500 bg-slate-800"
                      checked={currentEntry?.is_pinned || false}
                      onChange={e => setCurrentEntry({...currentEntry, is_pinned: e.target.checked})}
                    />
                    <span className="text-slate-300">Metti in evidenza</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-800/30">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-amber-900/20"
                >
                  <Save className="w-4 h-4" /> Salva Nota
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries Grid */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-20 text-slate-500">Caricamento note...</div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
              <Book className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 italic">Nessuna nota trovata. Inizia a scrivere i tuoi segreti!</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div 
                key={entry.id}
                className={`group bg-slate-800/40 border transition-all rounded-xl p-5 hover:bg-slate-800/60 ${
                  entry.is_pinned ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.is_pinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-500/80">
                        {DIARY_CATEGORIES.find(c => c.value === entry.category)?.label || entry.category}
                      </span>
                      {entry.session_number && (
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> Sess. {entry.session_number}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                      {entry.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(entry)}
                      className={`p-2 rounded-lg transition-colors ${entry.is_pinned ? 'text-amber-400' : 'text-slate-500 hover:text-white'}`}
                      title="Metti in evidenza"
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentEntry(entry);
                        setIsEditing(true);
                      }}
                      className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 whitespace-pre-wrap font-mono">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-700/50 pt-3">
                  <span>Creato il {new Date(entry.created_at).toLocaleDateString()}</span>
                  <span>Ultima modifica: {new Date(entry.updated_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
