import React from 'react';

const ATLANTE_PDF_URL = '/L-Atlante-di-Sherdan.pdf';

export const CampaignPage: React.FC = () => {
  return (
    <section id="campaign" className="relative py-24 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-slate-950/90" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-slate-900/70 backdrop-blur-sm border border-amber-700/20 rounded-2xl p-8 md:p-12 shadow-2xl">

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-3">
              Lore del mondo
            </h2>
            <div className="h-0.5 w-16 bg-amber-600/60 rounded" />
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Per esplorare ogni angolo del mondo in dettaglio, consulta l’Atlante completo:
          </p>

          <a
            href={ATLANTE_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-amber-700/20 hover:bg-amber-700/40 border border-amber-600/40 hover:border-amber-500/60 text-amber-300 font-semibold rounded-xl transition group"
          >
            <span className="text-xl">📜</span>
            <span>Leggi l’Atlante di Sherdan</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
