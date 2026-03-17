import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../utils/supabase';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { MapPin, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PinData {
  id: string;
  name: string;
  description: string | null;
  map_x: number;
  map_y: number;
  category: string;
  is_visible: boolean;
  lore_entry_id: string | null;
}

const CATEGORY_COLORS: Record<string, { dot: string; label: string; icon: string }> = {
  città:           { dot: 'bg-sky-400',    label: 'Città',           icon: '🏙️' },
  regione:         { dot: 'bg-amber-400',  label: 'Regione',         icon: '🏛️' },
  dungeon:         { dot: 'bg-red-500',    label: 'Dungeon',         icon: '⚔️' },
  punto_interesse: { dot: 'bg-green-400',  label: 'Punto interesse', icon: '📍' },
  segreto:         { dot: 'bg-purple-400', label: 'Segreto',         icon: '🔮' },
};

export const InteractiveMapPage: React.FC = () => {
  const [pins, setPins]         = useState<PinData[]>([]);
  const [selected, setSelected] = useState<PinData | null>(null);
  const [scale, setScale]       = useState(1);
  const [filter, setFilter]     = useState('all');
  const containerRef            = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('map_pins')
      .select('*')
      .eq('is_visible', true)
      .order('name');
    setPins((data as PinData[]) || []);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = filter === 'all' ? pins : pins.filter(p => p.category === filter);

  const zoom = (delta: number) =>
    setScale(s => Math.min(3, Math.max(0.5, +(s + delta).toFixed(1))));

  const categories = [...new Set(pins.map(p => p.category))];

  return (
    <>
      <Navigation />
      <section className="relative min-h-screen py-24 px-4 overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }}
        />
        <div className="fixed inset-0 bg-slate-950/90 -z-10" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-amber-300 mb-3">🗺️ Mappa di Sherdan</h1>
            <p className="text-slate-400">Esplora il mondo. Clicca sui pin per scoprire ogni luogo.</p>
          </div>

          {/* Controlli */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
              <button onClick={() => zoom(-0.2)} className="p-2 text-slate-300 hover:text-white transition" title="Zoom out">
                <ZoomOut size={16} />
              </button>
              <span className="text-slate-400 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => zoom(0.2)} className="p-2 text-slate-300 hover:text-white transition" title="Zoom in">
                <ZoomIn size={16} />
              </button>
              <button onClick={() => setScale(1)} className="p-2 text-slate-400 hover:text-white transition" title="Reset">
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Filtro categoria */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Tutti
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    filter === cat ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {CATEGORY_COLORS[cat]?.icon ?? '📍'} {CATEGORY_COLORS[cat]?.label ?? cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mappa */}
          <div
            ref={containerRef}
            className="relative w-full overflow-auto rounded-2xl border border-amber-700/20 bg-slate-900/60 shadow-2xl"
            style={{ maxHeight: '75vh' }}
          >
            <div
              className="relative inline-block"
              style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}
            >
              <img
                src="/Mappa-Sherdan.png"
                alt="Mappa di Sherdan"
                className="block max-w-none"
                style={{ width: '100%', minWidth: '800px' }}
                draggable={false}
              />

              {filtered.map(pin => {
                const col = CATEGORY_COLORS[pin.category] ?? CATEGORY_COLORS['punto_interesse'];
                return (
                  <button
                    key={pin.id}
                    onClick={() => setSelected(pin)}
                    className="absolute -translate-x-1/2 -translate-y-full group"
                    style={{ left: `${pin.map_x}%`, top: `${pin.map_y}%` }}
                    title={pin.name}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform ${col.dot}`} />
                      <span className="mt-1 text-[10px] font-bold text-white drop-shadow bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {pin.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {pins.length === 0 && (
            <p className="text-center text-slate-600 italic text-sm mt-4">
              Nessun pin ancora. Il DM può aggiungerne dal pannello admin.
            </p>
          )}
        </div>
      </section>
      <Footer />

      {/* Popup dettaglio pin */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-amber-700/30 rounded-2xl p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[selected.category]?.dot ?? 'bg-amber-400'}`} />
                <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
                  {CATEGORY_COLORS[selected.category]?.label ?? selected.category}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-2xl font-bold text-amber-300 mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-amber-500" /> {selected.name}
            </h3>
            {selected.description ? (
              <p className="text-slate-300 text-sm leading-7 whitespace-pre-line">{selected.description}</p>
            ) : (
              <p className="text-slate-600 italic text-sm">Nessuna descrizione disponibile.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
