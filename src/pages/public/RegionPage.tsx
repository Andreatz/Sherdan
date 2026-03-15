import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MAP_LOCATIONS } from '../../data/mapData';
import { REGION_DATA } from '../../data/regionData';

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-slate-900 border border-amber-700/20 rounded-2xl p-7 mb-6">
    <h2 className="text-xl font-bold text-amber-200 mb-5">{title}</h2>
    {children}
  </div>
);

export const RegionPage: React.FC = () => {
  const { regionSlug } = useParams<{ regionSlug: string }>();
  const navigate = useNavigate();
  const [openNpc, setOpenNpc] = useState<number | null>(null);

  const region = MAP_LOCATIONS.find(
    (l) => l.type === 'region' && l.regionSlug === regionSlug
  );
  const data = REGION_DATA.find((r) => r.slug === regionSlug);

  if (!region) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-4">Regione non trovata.</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition"
          >
            Torna alla mappa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition text-sm"
        >
          ← Torna alla mappa
        </button>

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Regione</span>
          <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-6">{region.name}</h1>
          <p className="text-slate-300 text-xl leading-8">{region.shortDescription}</p>
        </div>

        {/* Atmosfera */}
        {data && (
          <SectionCard title="🌫️ Atmosfera">
            <p className="text-slate-300 leading-8">{data.atmosphere}</p>
          </SectionCard>
        )}

        {/* Lore */}
        <SectionCard title="📖 Storia e Lore">
          <p className="text-slate-300 leading-8 whitespace-pre-line">{region.fullDescription}</p>
        </SectionCard>

        {/* Governo */}
        {data && (
          <SectionCard title="⚖️ Governo">
            <p className="text-slate-300 leading-8">{data.government}</p>
          </SectionCard>
        )}

        {/* Fazioni */}
        {data && data.factions.length > 0 && (
          <SectionCard title="⚔️ Fazioni">
            <div className="space-y-4">
              {data.factions.map((f, i) => (
                <div key={i} className="border-l-2 border-amber-600/50 pl-4">
                  <p className="font-semibold text-amber-300 mb-1">{f.name}</p>
                  <p className="text-slate-400 text-sm leading-6">{f.description}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Luoghi di interesse */}
        {data && data.locations.length > 0 && (
          <SectionCard title="🏛️ Luoghi di Interesse">
            <div className="grid sm:grid-cols-2 gap-4">
              {data.locations.map((loc, i) => (
                <div
                  key={i}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-4"
                >
                  <p className="font-semibold text-amber-200 mb-1 text-sm">{loc.name}</p>
                  <p className="text-slate-400 text-sm leading-6">{loc.description}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* NPC */}
        {data && data.npcs.length > 0 && (
          <SectionCard title="🎭 Personaggi Notevoli">
            <div className="space-y-3">
              {data.npcs.map((npc, i) => (
                <div
                  key={i}
                  className="border border-slate-700 rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition"
                    onClick={() => setOpenNpc(openNpc === i ? null : i)}
                  >
                    <div>
                      <span className="font-semibold text-amber-300 text-sm">{npc.name}</span>
                      <span className="text-slate-500 text-xs ml-3">{npc.role}</span>
                    </div>
                    <span className="text-slate-500 text-xs">{openNpc === i ? '▲' : '▼'}</span>
                  </button>
                  {openNpc === i && (
                    <div className="px-5 pb-4">
                      <p className="text-slate-400 text-sm leading-7">{npc.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Curiosità */}
        {data && (
          <div className="bg-amber-900/10 border border-amber-600/20 rounded-2xl p-6 mb-6">
            <p className="text-amber-200 text-sm font-semibold mb-2">🔮 Lo sapevi?</p>
            <p className="text-slate-300 text-sm leading-7">{data.curiosity}</p>
          </div>
        )}

        {/* Placeholder mappa locale */}
        <SectionCard title={`🗺️ Mappa di ${region.name}`}>
          <div className="w-full h-48 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 border border-slate-700 border-dashed text-sm">
            Mappa locale in arrivo...
          </div>
        </SectionCard>

      </div>
    </div>
  );
};
