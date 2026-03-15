import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MAP_LOCATIONS } from '../../data/mapData';

export const RegionPage: React.FC = () => {
  const { regionSlug } = useParams<{ regionSlug: string }>();
  const navigate = useNavigate();

  const region = MAP_LOCATIONS.find(
    (l) => l.type === 'region' && l.regionSlug === regionSlug
  );

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

        {/* Header regione */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-slate-400 mb-2 block">Regione</span>
          <h1 className="text-5xl md:text-6xl font-bold text-amber-300 mb-6">{region.name}</h1>
          <p className="text-slate-300 text-xl leading-8">{region.shortDescription}</p>
        </div>

        {/* Descrizione completa */}
        <div className="bg-slate-900 border border-amber-700/20 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">📖 Storia e Ambientazione</h2>
          <p className="text-slate-300 leading-8 whitespace-pre-line">{region.fullDescription}</p>
        </div>

        {/* Placeholder mappa locale */}
        <div className="bg-slate-900 border border-amber-700/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-amber-200 mb-4">🗺️ Mappa di {region.name}</h2>
          <div className="w-full h-64 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 border border-slate-700 border-dashed">
            Mappa locale in arrivo...
          </div>
        </div>

      </div>
    </div>
  );
};
