import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAP_LOCATIONS, MapLocation } from '../../data/mapData';

const REGION_COLOR = 'bg-amber-400';
const CITY_COLOR = 'bg-sky-300';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (loc: MapLocation) => setSelected(loc);
  const handleShowMore = () => {
    if (selected?.regionSlug) navigate(`/mappa/${selected.regionSlug}`);
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
            Clicca su una regione o città per scoprire di più
          </p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-400/30 inline-block" />
              Regione
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-300 ring-2 ring-sky-300/30 inline-block" />
              Città
            </span>
          </div>
        </div>

        {/* Mappa */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border border-amber-700/30 shadow-2xl"
          style={{ aspectRatio: '5734 / 4312' }}
        >
          <img
            src="/Mappa-Sherdan.png"
            alt="Mappa di Sherdan"
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Overlay SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {MAP_LOCATIONS.map((loc) => (
              <circle
                key={loc.id}
                cx={loc.x}
                cy={loc.y}
                r={loc.type === 'region' ? 1.4 : 0.8}
                fill={loc.type === 'region' ? 'rgba(251,191,36,0.85)' : 'rgba(147,210,255,0.85)'}
                stroke={loc.type === 'region' ? '#78350f' : '#0369a1'}
                strokeWidth="0.2"
                className="cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => handleClick(loc)}
              />
            ))}
          </svg>

          {/* Label tooltip SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {MAP_LOCATIONS.map((loc) => (
              <text
                key={loc.id + '-label'}
                x={loc.x}
                y={loc.y - (loc.type === 'region' ? 1.8 : 1.2)}
                textAnchor="middle"
                fontSize={loc.type === 'region' ? '1.3' : '0.9'}
                fill={loc.type === 'region' ? '#fde68a' : '#bae6fd'}
                fontFamily="serif"
                fontWeight={loc.type === 'region' ? 'bold' : 'normal'}
                style={{ textShadow: '0 0 3px #000' }}
              >
                {loc.name}
              </text>
            ))}
          </svg>
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
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    selected.type === 'region' ? REGION_COLOR : CITY_COLOR
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
