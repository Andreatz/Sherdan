import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];

interface Roll { die: DieType; result: number; ts: number; }
interface Spark { id: number; x: number; y: number; tx: string; ty: string; }

// Facce mostrate sul cubo CSS (sempre cubo visivo, il numero e' il risultato reale)
const CUBE_FACES = [1, 2, 3, 4, 5, 6];

function roll(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}

function resultColor(result: number, sides: DieType) {
  if (result === sides) return 'text-yellow-300';
  if (result === 1)     return 'text-red-400';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

const DIE_COLORS: Record<DieType, string> = {
  4:   '#8b0000',
  6:   '#1a3a6b',
  8:   '#1a5c1a',
  10:  '#6b1a6b',
  12:  '#7a3a00',
  20:  '#0a0a6b',
  100: '#3a3a00',
};

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected]       = useState<DieType>(20);
  const [rolling, setRolling]         = useState(false);
  const [landed, setLanded]           = useState(false);
  const [result, setResult]           = useState<number | null>(null);
  const [history, setHistory]         = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sparks, setSparks]           = useState<Spark[]>([]);
  const cubeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoll = useCallback(() => {
    if (rolling) return;
    const value = roll(selected);
    setResult(null);
    setLanded(false);
    setRolling(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRolling(false);
      setLanded(true);
      setResult(value);
      setHistory(prev => [{ die: selected, result: value, ts: Date.now() }, ...prev].slice(0, 20));
      // Scintille
      const newSparks: Spark[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 60,
        y: 50 + (Math.random() - 0.5) * 60,
        tx: `${(Math.random() - 0.5) * 80}px`,
        ty: `${-(Math.random() * 60 + 20)}px`,
      }));
      setSparks(newSparks);
      setTimeout(() => setSparks([]), 800);
    }, 1850);
  }, [rolling, selected]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const isCrit = result === selected;
  const isFail = result === 1;

  // Colore dinamico per le facce in base al dado selezionato
  const faceStyle = {
    background: `linear-gradient(135deg, ${DIE_COLORS[selected]}cc 0%, ${DIE_COLORS[selected]}88 100%)`,
  };

  return (
    // Overlay fullscreen
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
         style={{ background: 'rgba(5, 8, 20, 0.92)', backdropFilter: 'blur(6px)' }}
    >
      {/* Bottone chiudi */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700 rounded-full p-2"
      >
        <X size={22} />
      </button>

      {/* Titolo */}
      <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-8 opacity-70">
        Tiro Dadi &mdash; Atlante di Sherdan
      </p>

      {/* Selettore dado */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {DICE.map(d => (
          <button
            key={d}
            onClick={() => { setSelected(d); setResult(null); setLanded(false); }}
            className={`w-14 h-14 rounded-2xl text-sm font-bold border-2 transition-all ${
              selected === d
                ? 'border-amber-400 text-amber-300 scale-110 shadow-lg shadow-amber-900/60'
                : 'border-slate-700 text-slate-400 hover:border-amber-700 hover:text-slate-200'
            }`}
            style={selected === d ? { background: DIE_COLORS[d] } : { background: '#1e293b' }}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* Scena dado 3D */}
      <div className="relative flex items-center justify-center mb-10" style={{ width: 180, height: 180 }}>
        {/* Scintille */}
        {sparks.map(s => (
          <span
            key={s.id}
            className="spark"
            style={{
              left: s.x, top: s.y,
              '--tx': s.tx, '--ty': s.ty,
            } as React.CSSProperties}
          />
        ))}

        <div className="dice-scene" style={{ width: 120, height: 120 }}>
          <div
            ref={cubeRef}
            className={`dice-cube ${
              rolling ? 'dice-rolling' : landed ? 'dice-landed' : ''
            }`}
          >
            {CUBE_FACES.map((face, i) => (
              <div
                key={i}
                className={`dice-face face-${
                  ['front','back','right','left','top','bottom'][i]
                }`}
                style={faceStyle}
              >
                {/* Punti come un dado vero per d6, numero per gli altri */}
                {selected === 6 ? <DicePips value={face} /> : face}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risultato */}
      <div className="h-24 flex flex-col items-center justify-center mb-8">
        {result !== null && !rolling ? (
          <>
            <span className={`text-8xl font-black tabular-nums drop-shadow-2xl ${
              isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white'
            }`} style={{ textShadow: isCrit ? '0 0 40px #ffd70099' : isFail ? '0 0 30px #ef444466' : '0 0 20px rgba(255,255,255,0.2)' }}>
              {result}
            </span>
            {isCrit && <span className="text-yellow-300 text-sm font-bold animate-pulse mt-1">✨ CRITICO! ✨</span>}
            {isFail && <span className="text-red-400 text-sm font-bold mt-1">💀 Fallimento critico</span>}
          </>
        ) : rolling ? (
          <span className="text-slate-500 text-sm animate-pulse tracking-widest">rotolando...</span>
        ) : (
          <span className="text-slate-600 text-sm tracking-widest">premi tira</span>
        )}
      </div>

      {/* Bottone Tira */}
      <button
        onClick={handleRoll}
        disabled={rolling}
        className={`px-16 py-4 rounded-2xl font-bold text-lg tracking-wide transition-all ${
          rolling
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-900/50 active:scale-95 hover:scale-105'
        }`}
      >
        {rolling ? 'Rotolando...' : `🎲 Tira d${selected}`}
      </button>

      {/* Storico */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-sm px-4">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition px-2 py-1"
          >
            <span>Ultimi tiri ({history.length})</span>
            <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
          {showHistory && (
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {history.map(r => (
                <div key={r.ts} className="flex items-center justify-between text-sm bg-slate-800/60 rounded-xl px-4 py-2">
                  <span className="text-slate-500">d{r.die}</span>
                  <span className={`font-bold ${resultColor(r.result, r.die)}`}>{r.result}</span>
                  {r.result === r.die && <span className="text-yellow-400 text-xs">✨ crit</span>}
                  {r.result === 1 && <span className="text-red-400 text-xs">💀 fail</span>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => { setHistory([]); setResult(null); setLanded(false); }}
            className="mt-2 flex items-center gap-1 text-xs text-slate-700 hover:text-slate-400 transition px-2"
          >
            <RotateCcw size={10} /> Azzera storico
          </button>
        </div>
      )}
    </div>
  );
};

// Puntini dado d6 come dado vero
const PIP: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <span style={{
    width: 14, height: 14, borderRadius: '50%',
    background: '#ffd700',
    boxShadow: '0 0 6px #ffd70099',
    display: 'block',
    position: 'absolute',
    ...style,
  }} />
);

const DicePips: React.FC<{ value: number }> = ({ value }) => {
  const configs: Record<number, React.CSSProperties[]> = {
    1: [{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }],
    2: [{ top: '25%', left: '25%' }, { bottom: '25%', right: '25%' }],
    3: [{ top: '22%', left: '22%' }, { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }, { bottom: '22%', right: '22%' }],
    4: [{ top: '25%', left: '25%' }, { top: '25%', right: '25%' }, { bottom: '25%', left: '25%' }, { bottom: '25%', right: '25%' }],
    5: [{ top: '25%', left: '25%' }, { top: '25%', right: '25%' }, { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }, { bottom: '25%', left: '25%' }, { bottom: '25%', right: '25%' }],
    6: [{ top: '22%', left: '25%' }, { top: '22%', right: '25%' }, { top: '50%', left: '25%', transform: 'translateY(-50%)' }, { top: '50%', right: '25%', transform: 'translateY(-50%)' }, { bottom: '22%', left: '25%' }, { bottom: '22%', right: '25%' }],
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {(configs[value] || []).map((s, i) => <PIP key={i} style={s} />)}
    </div>
  );
};
