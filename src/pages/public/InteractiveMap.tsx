import React, { useState, useRef } from 'react';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { MAP_LOCATIONS, MapLocation } from '../../data/mapData';
import { useNavigate } from 'react-router-dom';
import { X, MapPin } from 'lucide-react';

const typeColor: Record<MapLocation['type'], string> = {
  region: 'bg-amber-500 ring-amber-300',
  city:   'bg-sky-500 ring-sky-300',
};

const typeLabelColor: Record<MapLocation['type'], string> = {
  region: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  city:   'text-sky-400 bg-sky-500/10 border-sky-500/30',
};

export const InteractiveMapPage: React.FC = () => {
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [hovered, setHovered]   = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-2">🗺️ Mappa di Sherdan</h1>
            <p className="text-slate-400">Clicca su un luogo per scoprire la sua storia.</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Regione
            </span>
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-3 h-3 rounded-full bg-sky-500" /> Città
            </span>
          </div>

          {/* Map container */}
          <div
            ref={mapRef}
            className="relative w-full rounded-2xl overflow-hidden border border-amber-700/20 shadow-2xl"
            style={{ aspectRatio: '1 / 1' }}
          >
            <img
              src="/Mappa-Sherdan.png"
              alt="Mappa di Sherdan"
              className="w-full h-full object-cover"
              draggable={false}
            />

            {MAP_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                title={loc.name}
              >
                {/* Pin dot */}
                <span
                  className={`block rounded-full ring-2 transition-all duration-200 ${
                    typeColor[loc.type]
                  } ${
                    loc.type === 'region'
                      ? 'w-4 h-4 group-hover:w-5 group-hover:h-5'
                      : 'w-2.5 h-2.5 group-hover:w-3.5 group-hover:h-3.5'
                  } ${
                    selected?.id === loc.id ? 'scale-125 ring-white' : ''
                  }`}
                />

                {/* Tooltip on hover */}
                {hovered === loc.id && (
                  <span
                    className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap
                               bg-slate-900/95 border border-amber-700/30 text-amber-200 text-xs
                               font-semibold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none"
                  >
                    {loc.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center px-4 py-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-xl bg-slate-900 border border-amber-700/30 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-2 ${typeLabelColor[selected.type]}`}>
                  <MapPin className="w-3 h-3" />
                  {selected.type === 'region' ? 'Regione' : 'Città'}
                </span>
                <h2 className="text-2xl font-bold text-amber-300">{selected.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 italic text-sm mb-4 leading-relaxed">{selected.shortDescription}</p>
            <p className="text-slate-300 leading-7 whitespace-pre-line">{selected.fullDescription}</p>

            <div className="flex flex-wrap gap-3 mt-6">
              {selected.type === 'region' && selected.regionSlug && (
                <button
                  onClick={() => { navigate(`/mappa/${selected.regionSlug}`); setSelected(null); }}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition text-sm"
                >
                  Ulteriori informazioni →
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-sm"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};
