import React, { useState, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';
import { DiceCanvas } from '../dice/DiceCanvas';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];

interface Roll { die: DieType; result: number; ts: number; }

function resultColor(result: number, sides: DieType) {
  if (result === sides) return 'text-yellow-300 font-black';
  if (result === 1)     return 'text-red-400 font-black';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected]     = useState<DieType>(20);
  const [rolling, setRolling]       = useState(false);
  const [result, setResult]         = useState<{ die: DieType; value: number } | null>(null);
  const [history, setHistory]       = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleResult = useCallback((value: number) => {
    setRolling(false);
    setResult({ die: selected, value });
    setHistory(prev => [{ die: selected, result: value, ts: Date.now() }, ...prev].slice(0, 20));
  }, [selected]);

  const handleRoll = () => {
    if (rolling) return;
    setResult(null);
    setRolling(true);
  };

  const isCrit = result?.value === result?.die;
  const isFail = result?.value === 1;

  return (
    /* Overlay fullscreen */
    <div className="fixed inset-0 z-[300] flex flex-col">

      {/* Canvas 3D — occupa tutto lo schermo */}
      <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm">
        <DiceCanvas dieType={selected} onResult={handleResult} rolling={rolling} />
      </div>

      {/* Risultato centrale — appare dopo il tiro */}
      {!rolling && result && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`text-[10rem] leading-none font-black drop-shadow-2xl animate-bounce-once ${
            isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white'
          }`} style={{ textShadow: '0 0 60px rgba(255,215,0,0.5)' }}>
            {result.value}
          </div>
          <div className="text-slate-400 text-xl mt-2">d{result.die}</div>
          {isCrit && <div className="text-yellow-300 text-2xl font-bold mt-3 animate-pulse">✨ CRITICO!</div>}
          {isFail && <div className="text-red-400 text-2xl font-bold mt-3">💀 Fallimento critico</div>}
        </div>
      )}

      {/* Prompt iniziale */}
      {!rolling && !result && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-slate-600 text-xl">Seleziona un dado e tira!</p>
        </div>
      )}

      {/* HUD in basso */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-950/80 backdrop-blur border-t border-amber-700/20 px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Selettore dadi */}
          <div className="flex flex-wrap gap-2 justify-center">
            {DICE.map(d => (
              <button
                key={d}
                onClick={() => { setSelected(d); setResult(null); }}
                className={`w-14 h-14 rounded-xl text-sm font-bold border transition ${
                  selected === d
                    ? 'bg-amber-600 border-amber-400 text-white scale-110 shadow-lg shadow-amber-900/60'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-600 hover:text-amber-300'
                }`}
              >
                d{d}
              </button>
            ))}
          </div>

          {/* Azioni */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRoll}
              disabled={rolling}
              className={`flex-1 py-3 rounded-xl font-bold text-white text-lg transition ${
                rolling
                  ? 'bg-amber-700/60 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 active:scale-95 shadow-xl shadow-amber-900/40'
              }`}
            >
              {rolling ? '🎲 Rotolando...' : `🎲 Tira d${selected}`}
            </button>

            {/* Storico */}
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistory(v => !v)}
                  className="flex items-center gap-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-sm transition"
                >
                  Storico <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>
                {showHistory && (
                  <div className="absolute bottom-14 right-0 w-52 bg-slate-900 border border-amber-700/20 rounded-xl shadow-xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto">
                      {history.map(r => (
                        <div key={r.ts} className="flex items-center justify-between text-xs px-3 py-2 border-b border-slate-800 last:border-0">
                          <span className="text-slate-400">d{r.die}</span>
                          <span className={resultColor(r.result, r.die)}>{r.result}</span>
                          {r.result === r.die && <span className="text-yellow-400">✨</span>}
                          {r.result === 1     && <span className="text-red-400">💀</span>}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setHistory([])}
                      className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-300 py-2 transition"
                    >
                      <RotateCcw size={11} /> Azzera
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-3 bg-slate-800 hover:bg-red-900/60 border border-slate-700 hover:border-red-700 text-slate-300 hover:text-red-300 rounded-xl transition"
              title="Chiudi"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
