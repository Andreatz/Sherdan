import React, { useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Mappa Alfabeto Primordiale                                          */
/* ------------------------------------------------------------------ */
const ALPHABET: Record<string, string> = {
  A: 'η', B: 'ε', C: 'ς', D: 'φ', E: 'υ',
  F: '?', G: '⊥', H: 'ϛ', I: 'ϑ', J: 'β',
  K: 'Q', L: 'の', M: '又', N: 'ν', O: 'Ψ',
  P: 'σ', Q: 'л', R: 'M', S: 'I', T: 'Ω',
  U: 'B', V: '2', W: 'h', X: 'U', Y: 'g', Z: '3',
};

function translate(text: string): string {
  return text
    .split('')
    .map(ch => {
      const upper = ch.toUpperCase();
      if (ALPHABET[upper]) return ALPHABET[upper];
      return ch; // spazi, numeri, punteggiatura invariati
    })
    .join('');
}

/* ------------------------------------------------------------------ */
/*  Componente principale                                               */
/* ------------------------------------------------------------------ */
export const AlphabetPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const translated = translate(input);

  const handleCopy = useCallback(() => {
    if (!translated) return;
    navigator.clipboard.writeText(translated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [translated]);

  const letters = Object.entries(ALPHABET);

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-16">
      {/* Hero */}
      <div className="relative py-14 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }} />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-4xl mb-3 tracking-widest font-mono text-amber-400">
            {translate('SHERDAN')}
          </p>
          <h1 className="text-4xl font-bold text-amber-300 mb-3">Alfabeto Primordiale</h1>
          <p className="text-slate-400">
            La scrittura antica di Sherdan, sopravvissuta all'Era dei Canti.
            Usata da maghi, esploratori e chiunque voglia nascondere un segreto.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">

        {/* Traduttore */}
        <div className="bg-slate-800/60 border border-amber-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-amber-300 mb-4">✍️ Traduttore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Testo in italiano / inglese</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={5}
                placeholder="Scrivi qui..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-600 transition resize-none font-sans"
              />
            </div>
            {/* Output */}
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Scrittura Primordiale</label>
              <div
                className="relative w-full h-full min-h-[120px] px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 text-xl leading-relaxed tracking-widest font-mono break-words"
              >
                {translated || <span className="text-slate-700 text-sm font-sans tracking-normal">La traduzione apparirà qui...</span>}
                {translated && (
                  <button
                    onClick={handleCopy}
                    className="absolute bottom-3 right-3 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? '✓ Copiato' : 'Copia'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tavola completa */}
        <div>
          <h2 className="text-xl font-bold text-amber-300 mb-5">📜 Tavola dei Simboli</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2">
            {letters.map(([latin, primordial]) => (
              <div key={latin}
                className="flex flex-col items-center justify-center bg-slate-800/60 border border-slate-700/50 rounded-xl py-3 px-2 hover:border-amber-700/60 hover:bg-slate-800 transition group cursor-default"
              >
                <span className="text-2xl text-amber-300 font-mono leading-none group-hover:scale-125 transition-transform">
                  {primordial}
                </span>
                <span className="text-xs text-slate-500 mt-1.5 font-mono">{latin}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Esempi */}
        <div>
          <h2 className="text-xl font-bold text-amber-300 mb-4">💡 Esempi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Sherdan',
              'Era dei Canti',
              'Il Mare non Perdona',
              'Obsidium',
            ].map(phrase => (
              <div key={phrase} className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">{phrase}</p>
                <p className="text-lg text-amber-300 font-mono tracking-widest">{translate(phrase)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
