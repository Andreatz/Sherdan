import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAP_LOCATIONS, MapLocation } from '../../data/mapData';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleShowMore = () => {
    if (selected?.regionSlug) {
      navigate(`/mappa/${selected.regionSlug}`);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setSelected(null);
  };

  return (
    <section id="map" className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-3">
            Mappa del Mondo
          </h2>
          <p className="text-slate-300 text-lg">
            Esplora le terre di Sherdan
          </p>
        </div>

        {/* Mappa */}
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-amber-700/30 shadow-2xl select-none"
          style={{ aspectRatio: '5734 / 4312' }}
        >
          <img
            src="/Mappa-Sherdan.png"
            alt="Mappa di Sherdan"
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* SVG overlay — solo aree invisibili cliccabili con glow al hover */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Glow ambrato per regioni */}
              <filter id="glow-region" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Glow azzurro per città */}
              <filter id="glow-city" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {MAP_LOCATIONS.map((loc) => {
              const r = loc.r ?? (loc.type === 'region' ? 4 : 2.5);
              const isHovered = hovered === loc.id;
              const isRegion = loc.type === 'region';

              return (
                <circle
                  key={loc.id}
                  cx={loc.x}
                  cy={loc.y}
                  r={r}
                  fill={
                    isHovered
                      ? isRegion
                        ? 'rgba(251,191,36,0.18)'
                        : 'rgba(147,210,255,0.15)'
                      : 'transparent'
                  }
                  stroke="none"
                  style={{
                    cursor: 'pointer',
                    filter: isHovered
                      ? isRegion
                        ? 'url(#glow-region)'
                        : 'url(#glow-city)'
                      : 'none',
                    transition: 'fill 0.25s ease',
                  }}
                  onMouseEnter={() => setHovered(loc.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(loc)}
                />
              );
            })}
          </svg>

          {/* Tooltip nome al hover */}
          {hovered && (() => {
            const loc = MAP_LOCATIONS.find((l) => l.id === hovered);
            if (!loc) return null;
            return (
              <div
                className="absolute pointer-events-none z-10 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg"
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y - (loc.r ?? 3) - 2}%`,
                  transform: 'translateX(-50%) translateY(-100%)',
                  background: 'rgba(15,23,42,0.85)',
                  color: loc.type === 'region' ? '#fde68a' : '#bae6fd',
                  border: `1px solid ${
                    loc.type === 'region' ? 'rgba(251,191,36,0.4)' : 'rgba(147,210,255,0.3)'
                  }`,
                  backdropFilter: 'blur(4px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {loc.name}
              </div>
            );
          })()}
        </div>

        {/* Popup */}
        {selected && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="max-w-lg w-full bg-slate-900 border border-amber-700/30 rounded-2xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    selected.type === 'region' ? 'bg-amber-400' : 'bg-sky-300'
                  }`}
                />
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  {selected.type === 'region' ? 'Regione' : 'Città'}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-amber-300 mb-4">
                {selected.name}
              </h3>

              <p className="text-slate-300 leading-7">
                {selected.shortDescription}
              </p>

              <div className="flex gap-3 mt-8">
                {selected.type === 'region' && (
                  <button
                    onClick={handleShowMore}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition"
                  >
                    Mostra altro →
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
