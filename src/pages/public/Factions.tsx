import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Faction, FactionCategory, CATEGORY_CONFIG } from '../../types/faction';
import { Search, Shield, X } from 'lucide-react';

/* ── Card ──────────────────────────────────────────────────────── */
const FactionCard: React.FC<{ faction: Faction; onClick: () => void }> = ({ faction, onClick }) => {
  const cfg = CATEGORY_CONFIG[faction.category];

  return (
    <button onClick={onClick}
      className={`group text-left rounded-2xl overflow-hidden border ${cfg.border} bg-slate-900/80 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 w-full`}>

      {/* Fascia colore */}
      <div className="h-2 w-full" style={{ backgroundColor: faction.color }} />
      <div className="px-5 pt-5 pb-4">
        {/* Badge categoria */}
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge} mb-3 inline-block`}>
          {cfg.emoji} {cfg.label}
        </span>

        {/* Nome */}
        <h3 className="text-xl font-bold text-amber-300 leading-tight">{faction.name}</h3>
        {faction.subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{faction.subtitle}</p>
        )}

        {/* Motto */}
        {faction.motto && (
          <p className="text-xs italic text-slate-500 mt-2 border-l-2 pl-2" style={{ borderColor: faction.color }}>
            "{faction.motto}"
          </p>
        )}

        {/* Base */}
        {faction.base && (
          <p className="text-xs text-slate-500 mt-2">📍 {faction.base}</p>
        )}

        {/* Descrizione breve */}
        {faction.description && (
          <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">{faction.description}</p>
        )}

        <p className="mt-4 text-xs text-amber-600 font-semibold">Leggi tutto →</p>
      </div>
    </button>
  );
};

/* ── Modal dettaglio ───────────────────────────────────────────── */
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

        {/* Fascia colore */}
        <div className="h-3 w-full rounded-t-2xl" style={{ backgroundColor: faction.color }} />

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-4 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-full p-2 transition">
          <X size={18} />
        </button>

        <div className="p-6 space-y-4">
          {/* Badge + nome */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>{cfg.emoji} {cfg.label}</span>
          <h2 className="text-3xl font-bold text-amber-300">{faction.name}</h2>
          {faction.subtitle && <p className="text-slate-400 text-sm -mt-2">{faction.subtitle}</p>}

          {/* Motto */}
          {faction.motto && (
            <p className="text-base italic text-slate-400 border-l-2 pl-3" style={{ borderColor: faction.color }}>
              "{faction.motto}"
            </p>
          )}

          {/* Base */}
          {faction.base && (
            <p className="text-sm text-slate-400"><span className="text-slate-500">Sede:</span> {faction.base}</p>
          )}

          {/* Descrizione */}
          {faction.description && (
            <p className="text-slate-300 leading-7 whitespace-pre-line text-sm">{faction.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Pagina principale ─────────────────────────────────────────── */
export const FactionsPage: React.FC = () => {
  const [factions, setFactions]   = useState<Faction[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState<FactionCategory | 'tutti'>('tutti');
  const [selected, setSelected]   = useState<Faction | null>(null);

  useEffect(() => {
    supabase.from('factions').select('*').eq('revealed', true)
      .order('category').order('name')
      .then(({ data }) => { setFactions((data as Faction[]) ?? []); setLoading(false); });
  }, []);

  const filtered = factions.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      f.name.toLowerCase().includes(q) ||
      (f.description ?? '').toLowerCase().includes(q) ||
      (f.motto ?? '').toLowerCase().includes(q) ||
      (f.subtitle ?? '').toLowerCase().includes(q);
    const matchCat = filterCat === 'tutti' || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const CAT_FILTERS: (FactionCategory | 'tutti')[] = ['tutti', 'signori_del_mare', 'istituzioni', 'societa_segrete', 'altro'];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-16">
      {/* Hero */}
      <div className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <Shield size={40} className="mx-auto mb-4 text-amber-500" />
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

      {selected && <FactionModal faction={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
