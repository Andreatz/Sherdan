import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, BookOpen, Users, MapPin, Skull, Shield, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  href: string;
  icon: React.ElementType;
  color: string;
  label: string;
}

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  character: { label: 'Personaggio',  icon: User,     color: 'text-blue-400'   },
  npc:       { label: 'NPC',          icon: Users,    color: 'text-orange-400' },
  location:  { label: 'Luogo',        icon: MapPin,   color: 'text-purple-400' },
  creature:  { label: 'Creatura',     icon: Skull,    color: 'text-red-400'    },
  faction:   { label: 'Fazione',      icon: Shield,   color: 'text-amber-400'  },
  session:   { label: 'Sessione',     icon: BookOpen, color: 'text-green-400'  },
  timeline:  { label: 'Cronistoria',  icon: Clock,    color: 'text-cyan-400'   },
};

async function runSearch(q: string): Promise<SearchResult[]> {
  const term = `%${q}%`;
  const results: SearchResult[] = [];

  const [charRes, npcRes, locRes, creRes, facRes, sesRes, tlRes] = await Promise.all([
    supabase.from('characters').select('id,name,class').ilike('name', term).eq('revealed', true).limit(4),
    supabase.from('npcs').select('id,name,role,faction').or(`name.ilike.${term},role.ilike.${term},faction.ilike.${term}`).eq('revealed', true).limit(4),
    supabase.from('world_locations').select('id,name,region').ilike('name', term).limit(4),
    supabase.from('creatures').select('id,name,type').ilike('name', term).eq('revealed', true).limit(4),
    supabase.from('factions').select('id,name,subtitle').ilike('name', term).eq('revealed', true).limit(4),
    supabase.from('session_logs').select('id,title,session_number').ilike('title', term).limit(4),
    supabase.from('campaign_events').select('id,title,kind').ilike('title', term).limit(4),
  ]);

  (charRes.data || []).forEach(r => results.push({
    id: r.id, title: r.name, subtitle: r.class,
    type: 'character', href: '/personaggi', ...TYPE_META.character,
  }));
  (npcRes.data || []).forEach(r => results.push({
    id: r.id, title: r.name, subtitle: [r.role, r.faction].filter(Boolean).join(' · '),
    type: 'npc', href: '/npc', ...TYPE_META.npc,
  }));
  (locRes.data || []).forEach(r => results.push({
    id: r.id, title: r.name, subtitle: r.region,
    type: 'location', href: '/luoghi', ...TYPE_META.location,
  }));
  (creRes.data || []).forEach(r => results.push({
    id: r.id, title: r.name, subtitle: r.type,
    type: 'creature', href: '/bestiario', ...TYPE_META.creature,
  }));
  (facRes.data || []).forEach(r => results.push({
    id: r.id, title: r.name, subtitle: r.subtitle,
    type: 'faction', href: '/fazioni', ...TYPE_META.faction,
  }));
  (sesRes.data || []).forEach(r => results.push({
    id: r.id, title: r.title, subtitle: r.session_number ? `Sessione ${r.session_number}` : undefined,
    type: 'session', href: '/sessioni', ...TYPE_META.session,
  }));
  (tlRes.data || []).forEach(r => results.push({
    id: r.id, title: r.title, subtitle: r.kind,
    type: 'timeline', href: '/cronistoria', ...TYPE_META.timeline,
  }));

  return results;
}

export const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(v => !v); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(''); setResults([]); setSelected(0); }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await runSearch(q.trim());
      setResults(r);
      setSelected(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 300);
    return () => clearTimeout(t);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) handleSelect(results[selected]);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-slate-200 rounded-lg px-3 py-1.5 text-sm transition-all"
        title="Cerca (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden lg:inline text-slate-500">Cerca...</span>
        <kbd className="hidden lg:inline text-[10px] bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              {loading
                ? <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                : <Search className="w-5 h-5 text-slate-400 shrink-0" />
              }
              <input
                ref={inputRef}
                type="text"
                placeholder="Cerca personaggi, NPC, luoghi, creature, sessioni..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length >= 2 && results.length === 0 && !loading && (
                <div className="py-12 text-center text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Nessun risultato per <span className="text-amber-400">"{query}"</span></p>
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {Object.entries(
                    results.reduce<Record<string, SearchResult[]>>((acc, r) => {
                      (acc[r.type] = acc[r.type] || []).push(r);
                      return acc;
                    }, {})
                  ).map(([type, items]) => {
                    const meta = TYPE_META[type];
                    return (
                      <div key={type}>
                        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          {meta?.label || type}
                        </div>
                        {items.map((item) => {
                          const Icon = item.icon;
                          const idx = results.indexOf(item);
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                                idx === selected ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                              }`}
                              onMouseEnter={() => setSelected(idx)}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.title}</p>
                                {item.subtitle && (
                                  <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                                )}
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 ${item.color}`}>
                                {meta?.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {query.length < 2 && (
                <div className="py-8 px-4 text-center text-slate-600 text-sm">
                  Digita almeno 2 caratteri per cercare nel mondo di Sherdan
                </div>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600">
                <span>{results.length} risultati trovati</span>
                <div className="flex items-center gap-3">
                  <span>↑↓ naviga</span>
                  <span>↵ apri</span>
                  <span>Esc chiudi</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
