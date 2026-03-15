import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, ChevronDown } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];

interface Roll {
  die: DieType;
  result: number;
  ts: number;
}

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}

function dieEmoji(sides: DieType): string {
  const map: Record<DieType, string> = {
    4: '\u25B3', 6: '\u25A1', 8: '\u25C7', 10: '\u25BD',
    12: '\u2B50', 20: '\u2606', 100: '%',
  };
  return map[sides];
}

function resultColor(result: number, sides: DieType): string {
  if (result === sides) return 'text-yellow-300 font-black';
  if (result === 1) return 'text-red-400 font-black';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<DieType>(20);
  const [rolling, setRolling] = useState(false);
  const [displayNum, setDisplayNum] = useState<number | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);
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

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const isCrit = displayNum === selected;
  const isFail = displayNum === 1;

  return (
    <div className="fixed bottom-20 right-4 z-[200] w-80 bg-slate-900 border border-amber-700/40 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-amber-700/20">
        <span className="text-amber-300 font-bold tracking-wide text-sm">🎲 Tiro Dadi</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={16} /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Selettore dado */}
        <div className="flex flex-wrap gap-2 justify-center">
          {DICE.map(d => (
            <button
              key={d}
              onClick={() => { setSelected(d); setDisplayNum(null); }}
              className={`w-12 h-12 rounded-xl text-xs font-bold border transition ${
                selected === d
                  ? 'bg-amber-600 border-amber-500 text-white scale-110 shadow-lg shadow-amber-900/50'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-amber-700'
              }`}
            >
              <div className="text-lg leading-none">{dieEmoji(d)}</div>
              <div>d{d}</div>
            </button>
          ))}
        </div>

        {/* Area risultato */}
        <div
          className={`flex flex-col items-center justify-center h-32 rounded-xl border-2 transition-all ${
            isCrit ? 'border-yellow-400 bg-yellow-950/30' :
            isFail ? 'border-red-500 bg-red-950/30' :
            'border-amber-700/30 bg-slate-800/60'
          }`}
        >
          {displayNum === null ? (
            <p className="text-slate-500 text-sm">Premi Tira!</p>
          ) : (
            <>
              <span className={`text-7xl font-black tabular-nums transition-all ${
                rolling ? 'opacity-60 scale-95' : 'scale-100'
              } ${resultColor(displayNum, selected)}`}>
                {displayNum}
              </span>
              {!rolling && isCrit && <span className="text-yellow-300 text-xs font-bold mt-1 animate-pulse">✨ CRITICO!</span>}
              {!rolling && isFail && <span className="text-red-400 text-xs font-bold mt-1">💀 Fallimento critico</span>}
            </>
          )}
        </div>

        {/* Bottone */}
        <button
          onClick={handleRoll}
          disabled={rolling}
          className={`w-full py-3 rounded-xl font-bold text-white text-base transition ${
            rolling
              ? 'bg-amber-700 opacity-60 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 active:scale-95 shadow-lg shadow-amber-900/40'
          }`}
        >
          {rolling ? 'Tirando...' : `🎲 Tira d${selected}`}
        </button>

        {/* Storico */}
        {history.length > 0 && (
          <div>
            <button
              onClick={() => setShowHistory(v => !v)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition px-1"
            >
              <span>Ultimi tiri ({history.length})</span>
              <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>

            {showHistory && (
              <div className="mt-2 max-h-36 overflow-y-auto space-y-1 pr-1">
                {history.map((r) => (
                  <div key={r.ts} className="flex items-center justify-between text-xs bg-slate-800 rounded-lg px-3 py-1.5">
                    <span className="text-slate-400">d{r.die}</span>
                    <span className={resultColor(r.result, r.die)}>{r.result}</span>
                    {r.result === r.die && <span className="text-yellow-400">✨</span>}
                    {r.result === 1 && <span className="text-red-400">💀</span>}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setHistory([]); setDisplayNum(null); }}
              className="mt-1 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition px-1"
            >
              <RotateCcw size={11} /> Azzera storico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
