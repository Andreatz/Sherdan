import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { LoreEntry, LORE_CATEGORIES } from '../../types/lore';
import { BookOpen, Search, X } from 'lucide-react';

export const LorePage: React.FC = () => {
  const [entries, setEntries]       = useState<LoreEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('all');
  const [selected, setSelected]     = useState<LoreEntry | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('lore_entries')
      .select('*')
      .eq('is_public', true)
      .order('category')
      .order('title');
    setEntries((data as LoreEntry[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = entries.filter(e => {
    const matchCat    = category === 'all' || e.category === category;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navigation />
      <section className="relative min-h-screen py-24 px-6 overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }}
        />
        <div className="fixed inset-0 bg-slate-950/85 -z-10" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-4">📚 Lore di Sherdan</h1>
            <p className="text-slate-300 text-lg">Storia, culture, divinità e segreti del mondo conosciuto.</p>
          </div>

          {/* Filtri */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Cerca nel lore..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-amber-700/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-600/50 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  category === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tutti
              </button>
              {LORE_CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    category === c.value ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Griglia */}
          {loading ? (
            <p className="text-center text-slate-500 py-20">Caricamento...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 italic">Nessuna voce trovata.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  className="text-left p-5 rounded-2xl bg-slate-900/80 border border-amber-700/20 hover:border-amber-500/40 hover:bg-slate-800/80 transition group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {LORE_CATEGORIES.find(c => c.value === entry.category)?.icon ?? '📖'}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">
                      {LORE_CATEGORIES.find(c => c.value === entry.category)?.label ?? entry.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-200 group-hover:text-amber-300 transition mb-2">
                    {entry.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-6 line-clamp-3">{entry.content}</p>
                  {entry.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-amber-600 font-semibold mt-3">Leggi di più →</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />

      {/* Modal dettaglio */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-2xl w-full bg-slate-900 border border-amber-700/30 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
                  {LORE_CATEGORIES.find(c => c.value === selected.category)?.icon}{' '}
                  {LORE_CATEGORIES.find(c => c.value === selected.category)?.label ?? selected.category}
                </span>
                <h3 className="text-3xl font-bold text-amber-300 mt-1">{selected.title}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition ml-4">
                <X size={22} />
              </button>
            </div>
            <p className="text-slate-300 leading-8 whitespace-pre-line">{selected.content}</p>
            {selected.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700">
                {selected.tags.map(tag => (
                  <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
