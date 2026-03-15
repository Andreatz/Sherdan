import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAP_LOCATIONS, MapLocation } from '../../data/mapData';

type Filter = 'all' | 'region' | 'city';

export const LocationsPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const navigate = useNavigate();

  const filtered = MAP_LOCATIONS.filter((l) => {
    const matchType = filter === 'all' || l.type === filter;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const regions = filtered.filter((l) => l.type === 'region');
  const cities = filtered.filter((l) => l.type === 'city');

  return (
    <section className="relative min-h-screen py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }}
      />
      <div className="fixed inset-0 bg-slate-950/85 -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-4">🗺️ Luoghi di Sherdan</h1>
          <p className="text-slate-300 text-lg">Regioni, città e avamposti del mondo conosciuto.</p>
        </div>

        {/* Barra filtri + ricerca */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex gap-2">
            {(['all', 'region', 'city'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === f
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f === 'all' ? 'Tutti' : f === 'region' ? '🏛️ Regioni' : '🏙️ Città'}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Cerca un luogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-amber-700/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-600/50 text-sm"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 italic py-16">Nessun luogo trovato.</p>
        )}

        {/* Regioni */}
        {regions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-amber-400 mb-5 flex items-center gap-2">
              🏛️ Regioni <span className="text-slate-500 text-sm font-normal">({regions.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regions.map((loc) => (
                <LocationCard
                  key={loc.id}
                  loc={loc}
                  onClick={() => setSelected(loc)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Città */}
        {cities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-sky-400 mb-5 flex items-center gap-2">
              🏙️ Città <span className="text-slate-500 text-sm font-normal">({cities.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((loc) => (
                <LocationCard
                  key={loc.id}
                  loc={loc}
                  onClick={() => setSelected(loc)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal dettaglio */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-2xl w-full bg-slate-900 border border-amber-700/30 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                selected.type === 'region' ? 'bg-amber-400' : 'bg-sky-300'
              }`} />
              <span className="text-xs uppercase tracking-widest text-slate-400">
                {selected.type === 'region' ? 'Regione' : 'Città'}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-amber-300 mb-3">{selected.name}</h3>
            <p className="text-slate-400 italic mb-6 leading-6">{selected.shortDescription}</p>
            <p className="text-slate-300 leading-8 whitespace-pre-line">{selected.fullDescription}</p>
            <div className="flex gap-3 mt-8">
              {selected.type === 'region' && selected.regionSlug && (
                <button
                  onClick={() => { navigate(`/mappa/${selected.regionSlug}`); window.scrollTo({ top: 0 }); setSelected(null); }}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition"
                >
                  Esplora sulla mappa →
                </button>
              )}
              <button
                onClick={() => { navigate('/#map'); setSelected(null); }}
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
              >
                🗺️ Vedi sulla mappa
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const LocationCard: React.FC<{ loc: MapLocation; onClick: () => void }> = ({ loc, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left p-5 rounded-2xl border transition group hover:scale-[1.01] ${
      loc.type === 'region'
        ? 'bg-slate-900/80 border-amber-700/20 hover:border-amber-500/40 hover:bg-slate-800/80'
        : 'bg-slate-900/80 border-sky-900/30 hover:border-sky-500/40 hover:bg-slate-800/80'
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
        loc.type === 'region' ? 'bg-amber-400' : 'bg-sky-300'
      }`} />
      <span className={`text-xs uppercase tracking-wider font-semibold ${
        loc.type === 'region' ? 'text-amber-500' : 'text-sky-400'
      }`}>
        {loc.type === 'region' ? 'Regione' : 'Città'}
      </span>
    </div>
    <h3 className={`text-xl font-bold mb-2 transition ${
      loc.type === 'region'
        ? 'text-amber-200 group-hover:text-amber-300'
        : 'text-sky-200 group-hover:text-sky-300'
    }`}>
      {loc.name}
    </h3>
    <p className="text-slate-400 text-sm leading-6 line-clamp-3">{loc.shortDescription}</p>
    <p className={`text-xs mt-3 font-semibold ${
      loc.type === 'region' ? 'text-amber-600' : 'text-sky-600'
    }`}>
      Scopri di più →
    </p>
  </button>
);
