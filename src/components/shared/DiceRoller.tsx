import React, { useState, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';
import { DiceCanvas } from '../dice/DiceCanvas';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];

interface Roll {
  die: DieType;
  result: number;
  ts: number;
}

function dieLabel(d: DieType) {
  return `d${d}`;
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
  const [lastResult, setLastResult] = useState<{ die: DieType; value: number } | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleResult = useCallback((value: number) => {
    setRolling(false);
    setLastResult({ die: selected, value });
    setHistory(prev => [{ die: selected, result: value, ts: Date.now() }, ...prev].slice(0, 20));
  }, [selected]);

  const handleRoll = () => {
    if (rolling) return;
    setLastResult(null);
    setRolling(true);
  };

  const isCrit = lastResult?.value === lastResult?.die;
  const isFail = lastResult?.value === 1;

  return (
    <div className="fixed bottom-20 right-4 z-[200] w-96 bg-slate-900 border border-amber-700/40 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-amber-700/20">
        <span className="text-amber-300 font-bold tracking-wide text-sm">🎲 Tiro Dadi 3D</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={16} /></button>
      </div>

      {/* Selettore dado */}
      <div className="flex flex-wrap gap-2 justify-center px-4 pt-4">
        {DICE.map(d => (
          <button
            key={d}
            onClick={() => { setSelected(d); setLastResult(null); }}
            className={`w-12 h-12 rounded-xl text-xs font-bold border transition ${
              selected === d
                ? 'bg-amber-600 border-amber-500 text-white scale-110 shadow-lg shadow-amber-900/50'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-amber-700'
            }`}
          >
            {dieLabel(d)}
          </button>
        ))}
      </div>

      {/* Canvas 3D */}
      <div className="relative mx-4 mt-3 rounded-xl overflow-hidden bg-slate-950 border border-amber-900/30" style={{ height: 220 }}>
        <DiceCanvas dieType={selected} onResult={handleResult} rolling={rolling} />

        {/* Overlay risultato */}
        {!rolling && lastResult && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className={`text-7xl font-black drop-shadow-lg ${
              isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white'
            }`}>
              {lastResult.value}
            </div>
            {isCrit && <span className="text-yellow-300 text-sm font-bold animate-pulse mt-1">✨ CRITICO!</span>}
            {isFail && <span className="text-red-400 text-sm font-bold mt-1">💀 Fallimento critico</span>}
          </div>
        )}

        {!rolling && !lastResult && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-600 text-sm">Premi Tira!</p>
          </div>
        )}

        {rolling && (
          <div className="absolute bottom-2 right-2 text-xs text-amber-500 animate-pulse">Rotolando...</div>
        )}
      </div>

      {/* Bottone tira */}
      <div className="px-4 pt-3">
        <button
          onClick={handleRoll}
          disabled={rolling}
          className={`w-full py-3 rounded-xl font-bold text-white text-base transition ${
            rolling
              ? 'bg-amber-700 opacity-60 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 active:scale-95 shadow-lg shadow-amber-900/40'
          }`}
        >
          {rolling ? '🎲 Rotolando...' : `🎲 Tira ${dieLabel(selected)}`}
        </button>
      </div>

      {/* Storico */}
      {history.length > 0 && (
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition px-1"
          >
            <span>Ultimi tiri ({history.length})</span>
            <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
          {showHistory && (
            <div className="mt-2 max-h-32 overflow-y-auto space-y-1 pr-1">
              {history.map((r) => (
                <div key={r.ts} className="flex items-center justify-between text-xs bg-slate-800 rounded-lg px-3 py-1.5">
                  <span className="text-slate-400">{dieLabel(r.die)}</span>
                  <span className={resultColor(r.result, r.die)}>{r.result}</span>
                  {r.result === r.die && <span className="text-yellow-400">✨</span>}
                  {r.result === 1 && <span className="text-red-400">💀</span>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => { setHistory([]); setLastResult(null); }}
            className="mt-1 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-400 transition px-1"
          >
            <RotateCcw size={11} /> Azzera storico
          </button>
        </div>
      )}
    </div>
  );
};
