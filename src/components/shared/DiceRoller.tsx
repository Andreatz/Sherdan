import React, { useState, useRef } from 'react';
import { X, RotateCcw, ChevronDown } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];

interface Roll { die: DieType; result: number; ts: number; }

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}

function resultColor(result: number, sides: DieType): string {
  if (result === sides) return 'text-yellow-300 font-black';
  if (result === 1)     return 'text-red-400 font-black';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<DieType>(20);
  const [rolling, setRolling]   = useState(false);
  const [displayNum, setDisplayNum] = useState<number | null>(null);
  const [history, setHistory]   = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setShowHistory(false);
    let ticks = 0;
    const total = 18;
    intervalRef.current = setInterval(() => {
      setDisplayNum(rollDie(selected));
      ticks++;
      if (ticks >= total) {
        clearInterval(intervalRef.current!);
        const final = rollDie(selected);
        setDisplayNum(final);
        setHistory(prev => [{ die: selected, result: final, ts: Date.now() }, ...prev].slice(0, 20));
        setRolling(false);
      }
    }, 60);
  };

  const isCrit = displayNum === selected;
  const isFail = displayNum === 1;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
         style={{ background: 'rgba(4,7,20,0.93)', backdropFilter: 'blur(8px)' }}
    >
      <button onClick={onClose}
        className="absolute top-5 right-5 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition">
        <X size={20} />
      </button>

      <p className="text-amber-700 text-xs font-bold tracking-[0.3em] uppercase mb-6">Atlante di Sherdan</p>

      {/* Selettore dado */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {DICE.map(d => (
          <button key={d}
            onClick={() => { setSelected(d); setDisplayNum(null); }}
            className={`w-14 h-14 rounded-2xl text-sm font-bold border-2 transition-all ${
              selected === d
                ? 'border-amber-500 bg-amber-700 text-white scale-110 shadow-lg shadow-amber-900/50'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-amber-700 hover:text-slate-200'
            }`}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* Area risultato */}
      <div className={`flex flex-col items-center justify-center w-48 h-48 rounded-3xl border-2 mb-8 transition-all ${
        isCrit ? 'border-yellow-400 bg-yellow-950/30' :
        isFail ? 'border-red-500 bg-red-950/30' :
        'border-amber-700/30 bg-slate-800/60'
      }`}>
        {displayNum === null ? (
          <p className="text-slate-500 text-sm tracking-widest">premi tira</p>
        ) : (
          <>
            <span className={`font-black tabular-nums leading-none transition-all ${
              rolling ? 'opacity-50 scale-90' : 'scale-100'
            } ${ isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white' }`}
              style={{
                fontSize: displayNum >= 100 ? '4.5rem' : '6rem',
                textShadow: isCrit ? '0 0 40px #ffd700aa' : isFail ? '0 0 30px #ef444477' : 'none',
              }}
            >
              {displayNum}
            </span>
            {!rolling && isCrit && <span className="text-yellow-300 text-xs font-bold mt-2 animate-pulse">✨ CRITICO!</span>}
            {!rolling && isFail && <span className="text-red-400 text-xs font-bold mt-2">💀 Fallimento critico</span>}
          </>
        )}
      </div>

      {/* Bottone */}
      <button
        onClick={handleRoll}
        disabled={rolling}
        className={`px-14 py-4 rounded-2xl font-bold text-lg tracking-wide border-2 transition-all ${
          rolling
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-slate-800 border-amber-600 text-amber-300 hover:bg-amber-600 hover:text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/40'
        }`}
      >
        {rolling ? 'Tirando...' : `🎲 Tira d${selected}`}
      </button>

      {/* Storico */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-xs px-4">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-300 transition py-1"
          >
            <span>Ultimi tiri ({history.length})</span>
            <ChevronDown size={13} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
          {showHistory && (
            <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
              {history.map(r => (
                <div key={r.ts} className="flex items-center justify-between text-sm bg-slate-800/70 rounded-xl px-4 py-2 border-l-2 border-amber-700/40">
                  <span className="text-amber-700/80">d{r.die}</span>
                  <span className={`font-bold ${resultColor(r.result, r.die)}`}>{r.result}</span>
                  {r.result === r.die && <span className="text-yellow-400 text-xs">✨</span>}
                  {r.result === 1    && <span className="text-red-400 text-xs">💀</span>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => { setHistory([]); setDisplayNum(null); }}
            className="mt-2 flex items-center gap-1 text-xs text-slate-700 hover:text-slate-400 transition"
          >
            <RotateCcw size={10} /> Azzera storico
          </button>
        </div>
      )}
    </div>
  );
};
