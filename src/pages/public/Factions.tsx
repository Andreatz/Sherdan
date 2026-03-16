import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { Faction, FactionCategory, CATEGORY_CONFIG } from '../../types/faction';
import { Search, Shield, X } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */
const FactionCard: React.FC<{ faction: Faction; onClick: () => void }> = ({ faction, onClick }) => {
  const cfg = CATEGORY_CONFIG[faction.category];
  return (
    <button onClick={onClick}
      className={`group text-left rounded-2xl overflow-hidden border ${cfg.border} bg-slate-900/80 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer w-full`}>
      {/* Immagine */}
      <div className="relative h-52 bg-slate-800 overflow-hidden">
        {faction.image_url ? (
          <img src={faction.image_url} alt={faction.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-b ${cfg.color} to-slate-900`}>
            <span className="text-6xl opacity-60">{faction.symbol_emoji ?? '🏴'}</span>
          </div>
        )}
        {/* Badge categoria */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge} backdrop-blur-sm`}>
          {cfg.emoji} {cfg.label}
        </span>
      </div>
      {/* Contenuto */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-amber-300 mb-1 leading-tight">{faction.name}</h3>
        {faction.tagline && (
          <p className="text-xs italic text-slate-500 mb-2">"{faction.tagline}"</p>
        )}
        {faction.base && (
          <p className="text-xs text-slate-500 mb-2">📍 {faction.base}</p>
        )}
        {faction.description && (
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{faction.description}</p>
        )}
        <p className="text-xs text-amber-600 mt-3 font-semibold">Leggi tutto →</p>
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Modal dettaglio                                                     */
/* ------------------------------------------------------------------ */
const FactionModal: React.FC<{ faction: Faction; onClose: () => void }> = ({ faction, onClose }) => {
  const cfg = CATEGORY_CONFIG[faction.category];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className={`relative bg-slate-900 border ${cfg.border} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>

        {/* Header immagine */}
        {faction.image_url ? (
          <div className="h-64 overflow-hidden rounded-t-2xl">
            <img src={faction.image_url} alt={faction.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`h-40 flex items-center justify-center bg-gradient-to-b ${cfg.color} to-slate-900 rounded-t-2xl`}>
            <span className="text-8xl opacity-50">{faction.symbol_emoji ?? '🏴'}</span>
          </div>
        )}

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-full p-2 transition">
          <X size={18} />
        </button>

        {/* Corpo */}
        <div className="p-6 space-y-4">
          <div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>{cfg.emoji} {cfg.label}</span>
          </div>
          <h2 className="text-3xl font-bold text-amber-300">{faction.name}</h2>

          {faction.tagline && (
            <p className="text-base italic text-slate-400 border-l-2 border-amber-700/50 pl-3">"{faction.tagline}"</p>
          )}

          {faction.base && (
            <p className="text-sm text-slate-400"><span className="text-slate-500">Base:</span> {faction.base}</p>
          )}

          {faction.description && (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-7 whitespace-pre-line">{faction.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Pagina principale                                                   */
/* ------------------------------------------------------------------ */
export const FactionsPage: React.FC = () => {
  const [factions, setFactions]       = useState<Faction[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState<FactionCategory | 'tutti'>('tutti');
  const [selected, setSelected]       = useState<Faction | null>(null);

  useEffect(() => {
    supabase.from('factions').select('*').eq('revealed', true)
      .order('category').order('name')
      .then(({ data }) => { setFactions((data as Faction[]) ?? []); setLoading(false); });
  }, []);

  const filtered = factions.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.name.toLowerCase().includes(q) ||
      (f.description ?? '').toLowerCase().includes(q) ||
      (f.tagline ?? '').toLowerCase().includes(q);
    const matchCat = filterCat === 'tutti' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const CAT_FILTERS: (FactionCategory | 'tutti')[] = ['tutti', 'mare', 'continente', 'ombra'];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-16">
      {/* Hero */}
      <div className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <Shield size={40} className="text-amber-500" />
          </div>
          <h1 className="text-5xl font-bold text-amber-300 mb-4">Le Fazioni di Sherdan</h1>
          <p className="text-slate-400 text-lg">
            Il potere su Sherdan non è mai monolitico. È frammentato, conteso e sporco di grasso o sangue.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filtri */}
        <div className="space-y-3 mb-10">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Cerca fazione..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-600 transition" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CAT_FILTERS.map(f => {
              const cfg = f !== 'tutti' ? CATEGORY_CONFIG[f] : null;
              return (
                <button key={f} onClick={() => setFilterCat(f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                    filterCat === f
                      ? 'bg-amber-600 border-amber-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                  }`}>
                  {f === 'tutti' ? 'Tutte le fazioni' : `${cfg!.emoji} ${cfg!.label}`}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-slate-600 self-center">{filtered.length} fazioni</span>
          </div>
        </div>

        {/* Griglia */}
        {loading ? (
          <p className="text-center py-24 text-slate-500">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Shield size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">{factions.length === 0 ? 'Nessuna fazione rivelata ancora.' : 'Nessun risultato.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(f => (
              <FactionCard key={f.id} faction={f} onClick={() => setSelected(f)} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && <FactionModal faction={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
