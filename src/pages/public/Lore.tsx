import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { supabase } from '../../utils/supabase';
import { LoreEntry, LORE_CATEGORIES, LoreCategory } from '../../types/lore';
import { Search, BookOpen } from 'lucide-react';

const categoryColor: Record<LoreCategory, string> = {
  storia:      'text-amber-400 border-amber-500/30 bg-amber-500/10',
  luogo:       'text-sky-400 border-sky-500/30 bg-sky-500/10',
  cultura:     'text-purple-400 border-purple-500/30 bg-purple-500/10',
  fazione:     'text-red-400 border-red-500/30 bg-red-500/10',
  divinità:    'text-yellow-300 border-yellow-500/30 bg-yellow-500/10',
  personaggio: 'text-green-400 border-green-500/30 bg-green-500/10',
  altro:       'text-slate-400 border-slate-500/30 bg-slate-500/10',
};

export const LorePage: React.FC = () => {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<LoreCategory | 'all'>('all');
  const [selected, setSelected] = useState<LoreEntry | null>(null);

  useEffect(() => {
    const fetchLore = async () => {
      const { data } = await supabase
        .from('lore_entries')
        .select('*')
        .eq('is_public', true)
        .order('category')
        .order('title');
      setEntries((data as LoreEntry[]) || []);
      setLoading(false);
    };
    void fetchLore();
  }, []);

  const filtered = entries.filter((e) => {
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase()) ||
      (e.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navigation />
      <section className="relative min-h-screen py-24 px-6 overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="fixed inset-0 bg-slate-950/88 -z-10" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-4">📚 Lore di Sherdan</h1>
            <p className="text-slate-300 text-lg">Storia, culture, luoghi e misteri del mondo.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cerca nel lore..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-amber-700/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-600/50 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                activeCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-600/40'
              }`}
            >
              📖 Tutto
            </button>
            {LORE_CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  activeCategory === c.value
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-600/40'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-slate-500 py-20">Caricamento...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 italic">Nessuna voce trovata.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((entry) => {
                const cat = LORE_CATEGORIES.find((c) => c.value === entry.category);
                const colorClass = categoryColor[entry.category];
                return (
                  <button
                    key={entry.id}
                    onClick={() => setSelected(entry)}
                    className="text-left p-5 rounded-2xl bg-slate-900/80 border border-slate-700/40 hover:border-amber-500/30 hover:bg-slate-800/80 transition group"
                  >
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-3 ${colorClass}`}>
                      {cat?.emoji} {cat?.label}
                    </div>
                    <h3 className="text-lg font-bold text-amber-200 group-hover:text-amber-300 transition mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>
                    {entry.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-2xl w-full bg-slate-900 border border-amber-700/30 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const cat = LORE_CATEGORIES.find((c) => c.value === selected.category);
              const colorClass = categoryColor[selected.category];
              return (
                <>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-4 ${colorClass}`}>
                    {cat?.emoji} {cat?.label}
                  </div>
                  <h3 className="text-3xl font-bold text-amber-300 mb-4">{selected.title}</h3>
                  <p className="text-slate-300 leading-8 whitespace-pre-line">{selected.content}</p>
                  {selected.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="mt-6 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  >
                    Chiudi
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};
