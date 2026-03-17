import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { NPC, NpcRelationship, NpcStatus, REL_LABELS, STATUS_LABELS } from '../../types/npc';
import { Search, Users, X } from 'lucide-react';

/* ── Modal NPC ─────────────────────────────────────────────────── */
const NpcModal: React.FC<{ npc: NPC; onClose: () => void }> = ({ npc, onClose }) => {
  const status = STATUS_LABELS[npc.status];
  const rel    = REL_LABELS[npc.relationship];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className="relative bg-slate-900 border border-amber-700/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {npc.image_url ? (
          <div className="relative h-72 overflow-hidden rounded-t-2xl">
            <img src={npc.image_url} alt={npc.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full border ${rel.color} bg-slate-900/80`}>
              {rel.emoji} {rel.label}
            </span>
            {npc.zone && (
              <span className="absolute top-4 left-4 text-xs text-sky-300/90 bg-slate-900/70 px-2 py-1 rounded-full border border-sky-700/30">
                🗺️ {npc.zone}
              </span>
            )}
          </div>
        ) : (
          <div className="h-24 bg-slate-800 rounded-t-2xl flex items-center justify-center">
            <Users size={36} className="text-slate-700" />
          </div>
        )}
        <button onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-full p-1.5 transition z-10">
          <X size={16} />
        </button>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold text-amber-300">{npc.name}</h2>
              {(npc.role || npc.faction) && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {npc.role}{npc.role && npc.faction ? ' · ' : ''}{npc.faction}
                </p>
              )}
            </div>
            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${status.color}`}>
              {status.label}
            </span>
          </div>
          {!npc.image_url && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${rel.color}`}>
              {rel.emoji} {rel.label}
            </span>
          )}
          {npc.description && (
            <p className="text-slate-300 leading-7 text-sm whitespace-pre-line">{npc.description}</p>
          )}
          {npc.physical_traits && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Aspetto</h4>
              <p className="text-sm text-slate-400">{npc.physical_traits}</p>
            </div>
          )}
          {npc.personality && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Personalità</h4>
              <p className="text-sm text-slate-400">{npc.personality}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Card NPC ─────────────────────────────────────────────────── */
const NpcCard: React.FC<{ npc: NPC; onClick: () => void }> = ({ npc, onClick }) => {
  const status = STATUS_LABELS[npc.status];
  const rel    = REL_LABELS[npc.relationship];

  return (
    <button onClick={onClick}
      className="group text-left bg-slate-800/70 border border-amber-700/20 rounded-2xl overflow-hidden hover:border-amber-600/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 w-full">
      <div className="relative h-56 bg-slate-900 overflow-hidden">
        {npc.image_url ? (
          <img src={npc.image_url} alt={npc.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users size={44} className="text-slate-700" />
          </div>
        )}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${rel.color} bg-slate-900/80`}>
          {rel.emoji} {rel.label}
        </span>
        {npc.zone && (
          <span className="absolute top-3 left-3 text-xs text-sky-300/90 bg-slate-900/70 px-2 py-1 rounded-full border border-sky-700/30">
            🗺️ {npc.zone}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-amber-300 leading-tight">{npc.name}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${status.color}`}>
            {status.label}
          </span>
        </div>
        {(npc.role || npc.faction) && (
          <p className="text-xs text-slate-500 mb-2">
            {npc.role}{npc.role && npc.faction ? ' · ' : ''}{npc.faction}
          </p>
        )}
        {npc.description && (
          <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{npc.description}</p>
        )}
        <p className="mt-2 text-xs text-amber-600 font-semibold">Leggi tutto →</p>
      </div>
    </button>
  );
};

/* ── Pagina principale ─────────────────────────────────────────── */
export const NpcPage: React.FC = () => {
  const [npcs, setNpcs]       = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterRel,    setFilterRel]    = useState<NpcRelationship | 'tutti'>('tutti');
  const [filterStatus, setFilterStatus] = useState<NpcStatus | 'tutti'>('tutti');
  const [filterZone,   setFilterZone]   = useState<string>('tutti');
  const [selected,     setSelected]     = useState<NPC | null>(null);

  useEffect(() => {
    supabase.from('npcs').select('*').eq('revealed', true)
      .order('name', { ascending: true })
      .then(({ data }) => { setNpcs((data as NPC[]) || []); setLoading(false); });
  }, []);

  const zones = Array.from(new Set(npcs.filter(n => n.zone).map(n => n.zone as string))).sort();

  const filtered = npcs.filter(n => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.name.toLowerCase().includes(q) ||
      (n.description ?? '').toLowerCase().includes(q) ||
      (n.faction ?? '').toLowerCase().includes(q);
    const matchRel    = filterRel    === 'tutti' || n.relationship === filterRel;
    const matchStatus = filterStatus === 'tutti' || n.status       === filterStatus;
    const matchZone   = filterZone   === 'tutti' || n.zone         === filterZone;
    return matchSearch && matchRel && matchStatus && matchZone;
  });

  const REL_FILTERS: (NpcRelationship | 'tutti')[] = ['tutti','alleato','neutrale','ostile','sconosciuto'];
  const STATUS_FILTERS: (NpcStatus | 'tutti')[]    = ['tutti','vivo','morto','sconosciuto'];

  return (
    <div className="min-h-screen bg-slate-900 pb-16">
      {/* Hero con parallax */}
      <div className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }}
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <Users size={40} className="mx-auto mb-4 text-amber-500" />
          <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">Personaggi Incontrati</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Gli NPC che la compagnia ha conosciuto durante il viaggio. Aggiornato dal DM dopo ogni sessione.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Filtri */}
        <div className="space-y-3 mb-10">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Cerca per nome, fazione, descrizione..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-600 transition" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-600 mr-1">Relazione:</span>
            {REL_FILTERS.map(f => (
              <button key={f} onClick={() => setFilterRel(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  filterRel === f ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                }`}>
                {f === 'tutti' ? 'Tutti' : REL_LABELS[f].emoji + ' ' + REL_LABELS[f].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-600 mr-1">Stato:</span>
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  filterStatus === f ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                }`}>
                {f === 'tutti' ? 'Tutti' : STATUS_LABELS[f].label}
              </button>
            ))}
          </div>
          {zones.length > 1 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-600 mr-1">Zona:</span>
              <button onClick={() => setFilterZone('tutti')}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  filterZone === 'tutti' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-amber-700'
                }`}>Tutte</button>
              {zones.map(z => (
                <button key={z} onClick={() => setFilterZone(z === filterZone ? 'tutti' : z)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    filterZone === z ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-800 border-slate-700 text-sky-300 hover:border-sky-600'
                  }`}>🗺️ {z}</button>
              ))}
            </div>
          )}
        </div>

        {/* Griglia */}
        {loading ? (
          <p className="text-center py-24 text-slate-500">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">
              {npcs.length === 0 ? 'Nessun NPC rivelato ancora.' : 'Nessun risultato trovato.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(n => <NpcCard key={n.id} npc={n} onClick={() => setSelected(n)} />)}
          </div>
        )}
      </div>

      {selected && <NpcModal npc={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
