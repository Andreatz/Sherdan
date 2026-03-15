import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Creature, DangerLevel } from '../../types/bestiary';
import { Skull, Shield, AlertTriangle, Flame, Search, ChevronDown, ChevronUp } from 'lucide-react';

const DANGER_CONFIG: Record<DangerLevel, { label: string; color: string; icon: React.ReactNode }> = {
  basso:   { label: 'Basso',   color: 'text-green-400 border-green-700/50 bg-green-950/30',  icon: <Shield size={13} /> },
  medio:   { label: 'Medio',   color: 'text-yellow-400 border-yellow-700/50 bg-yellow-950/30', icon: <AlertTriangle size={13} /> },
  alto:    { label: 'Alto',    color: 'text-orange-400 border-orange-700/50 bg-orange-950/30', icon: <Flame size={13} /> },
  letale:  { label: 'Letale',  color: 'text-red-400 border-red-700/50 bg-red-950/30',          icon: <Skull size={13} /> },
};

const CreatureCard: React.FC<{ creature: Creature }> = ({ creature }) => {
  const [expanded, setExpanded] = useState(false);
  const danger = DANGER_CONFIG[creature.danger_level];

  return (
    <div className="bg-slate-800/70 border border-amber-700/20 rounded-2xl overflow-hidden hover:border-amber-600/40 transition-all group">
      {/* Immagine */}
      <div className="relative h-52 bg-slate-900 overflow-hidden">
        {creature.image_url ? (
          <img
            src={creature.image_url}
            alt={creature.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Skull size={48} className="text-slate-700" />
          </div>
        )}
        {/* Badge pericolosità */}
        <span className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${danger.color}`}>
          {danger.icon} {danger.label}
        </span>
        {/* Badge sessione */}
        {creature.session_encountered && (
          <span className="absolute top-3 left-3 text-xs text-amber-300/80 bg-slate-900/70 px-2 py-1 rounded-full border border-amber-700/30">
            {creature.session_encountered}
          </span>
        )}
      </div>

      {/* Contenuto */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-amber-300">{creature.name}</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          {creature.creature_type}{creature.habitat ? ` · ${creature.habitat}` : ''}
        </p>

        <p className={`text-sm text-slate-300 leading-relaxed ${
          expanded ? '' : 'line-clamp-3'
        }`}>
          {creature.description}
        </p>

        {creature.description.length > 140 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-400 transition"
          >
            {expanded ? <><ChevronUp size={12} /> Mostra meno</> : <><ChevronDown size={12} /> Leggi tutto</>}
          </button>
        )}
      </div>
    </div>
  );
};

export const BestiaryPage: React.FC = () => {
  const [creatures, setCreatures]   = useState<Creature[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState<DangerLevel | 'tutti'>('tutti');

  useEffect(() => {
    supabase
      .from('creatures')
      .select('*')
      .eq('revealed', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCreatures((data as Creature[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = creatures.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'tutti' || c.danger_level === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-3">Bestiario</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Le creature incontrate dalla compagnia nel corso della campagna. Rivelate dal DM dopo ogni incontro.
          </p>
        </div>

        {/* Filtri */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cerca creatura..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-600 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['tutti', 'basso', 'medio', 'alto', 'letale'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                  filter === f
                    ? 'bg-amber-600 border-amber-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia */}
        {loading ? (
          <div className="text-center py-24 text-slate-500">Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Skull size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">
              {creatures.length === 0
                ? 'Nessuna creatura rivelata ancora. Continuate a esplorare...'
                : 'Nessuna creatura trovata.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => <CreatureCard key={c.id} creature={c} />)}
          </div>
        )}
      </div>
    </div>
  );
};
