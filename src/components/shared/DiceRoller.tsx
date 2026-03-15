import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];
type RollState = 'idle' | 'rolling' | 'landed';

interface Roll  { die: DieType; result: number; ts: number; }
interface Spark { id: number; x: number; y: number; tx: string; ty: string; }

// Stile visivo condiviso (come il d6 di prima)
const FILL   = 'rgba(15,25,60,0.97)';
const STROKE = 'rgba(212,175,55,0.85)';
const STROKE_W = 3;
const TEXT_COLOR  = '#ffd700';
const TEXT_SHADOW = '0 0 14px rgba(255,215,0,0.9)';
const INNER_GLOW  = 'rgba(255,215,0,0.07)';

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}
function resultColor(result: number, sides: DieType): string {
  if (result === sides) return 'text-yellow-300';
  if (result === 1)     return 'text-red-400';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

// Componente SVG per ogni dado — stesso stile d6
const DieSVG: React.FC<{ die: DieType; size?: number }> = ({ die, size = 180 }) => {
  const id = `die${die}`;

  // Punti polygon / path per ogni dado (viewBox 0 0 100 100)
  const shapeByDie: Record<DieType, React.ReactNode> = {
    // d4 — triangolo equilatero con angoli leggermente arrotondati
    4: <polygon points="50,6 96,90 4,90"
          fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
          strokeLinejoin="round" paintOrder="stroke" />,

    // d6 — rettangolo arrotondato (identico a prima)
    6: <rect x="8" y="8" width="84" height="84" rx="12"
          fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W} />,

    // d8 — rombo
    8: <polygon points="50,4 96,50 50,96 4,50"
          fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
          strokeLinejoin="round" />,

    // d10 — forma a goccia / pentagono appuntito in basso
    10: <polygon points="50,4 94,34 76,90 24,90 6,34"
           fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
           strokeLinejoin="round" />,

    // d12 — esagono
    12: <polygon points="50,4 91,27 91,73 50,96 9,73 9,27"
           fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
           strokeLinejoin="round" />,

    // d20 — triangolo più stretto e appuntito
    20: <polygon points="50,3 97,84 3,84"
           fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
           strokeLinejoin="round" />,

    // d100 — decagono
    100: <polygon
           points="50,4 79,13 95,38 95,62 79,87 50,96 21,87 5,62 5,38 21,13"
           fill={`url(#grad-${id})`} stroke={STROKE} strokeWidth={STROKE_W}
           strokeLinejoin="round" />,
  };

  // Centro testo Y aggiustato per triangoli
  const textY = (die === 4 || die === 20) ? 68 : 58;
  const fontSize = die === 100 ? 20 : 24;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg"
         style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        {/* Gradiente radiale scuro come il d6 di prima */}
        <radialGradient id={`grad-${id}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%"   stopColor="#1e3a6e" />
          <stop offset="50%"  stopColor="#0f1e3d" />
          <stop offset="100%" stopColor="#060d1f" />
        </radialGradient>
        {/* Glow interno dorato */}
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={INNER_GLOW} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Forma principale */}
      {shapeByDie[die]}

      {/* Strato glow interno */}
      {React.cloneElement(shapeByDie[die] as React.ReactElement, {
        fill: `url(#glow-${id})`,
        stroke: 'none',
      })}

      {/* Numero/tipo al centro */}
      <text
        x="50" y={textY}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={fontSize} fontWeight="900"
        fill={TEXT_COLOR}
        style={{ fontFamily: 'monospace', textShadow: TEXT_SHADOW }}
      >
        d{die}
      </text>
    </svg>
  );
};

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected]       = useState<DieType>(20);
  const [state, setState]             = useState<RollState>('idle');
  const [result, setResult]           = useState<number | null>(null);
  const [history, setHistory]         = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sparks, setSparks]           = useState<Spark[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRoll = useCallback(() => {
    if (state === 'rolling') return;
    const value = rollDie(selected);
    setResult(null);
    setState('rolling');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setState('landed');
      setResult(value);
      setHistory(prev => [{ die: selected, result: value, ts: Date.now() }, ...prev].slice(0, 20));
      // Scintille
      setSparks(Array.from({ length: 14 }, (_, i) => ({
        id: Date.now() + i,
        x: 90 + (Math.random() - 0.5) * 100,
        y: 90 + (Math.random() - 0.5) * 100,
        tx: `${(Math.random() - 0.5) * 120}px`,
        ty: `${-(Math.random() * 80 + 30)}px`,
      })));
      setTimeout(() => setSparks([]), 900);
      setTimeout(() => setState('idle'), 1200);
    }, 1870);
  }, [state, selected]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const isCrit = result === selected;
  const isFail = result === 1;

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      style={{ background: 'rgba(4,7,20,0.93)', backdropFilter: 'blur(8px)' }}
    >
      {/* Chiudi */}
      <button onClick={onClose}
        className="absolute top-5 right-5 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition">
        <X size={20} />
      </button>

      <p className="text-amber-700 text-xs font-bold tracking-[0.3em] uppercase mb-6">Atlante di Sherdan</p>

      {/* Selettore dado */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {DICE.map(d => (
          <button key={d}
            onClick={() => { setSelected(d); setResult(null); setState('idle'); }}
            className={`w-14 h-14 rounded-xl text-sm font-bold border-2 transition-all ${
              selected === d
                ? 'border-amber-500 bg-slate-700 text-amber-300 scale-110 shadow-lg shadow-amber-900/50'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-amber-700 hover:text-slate-200'
            }`}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* SVG dado animato */}
      <div className="relative mb-8" style={{ width: 200, height: 200 }}>
        {sparks.map(s => (
          <span key={s.id} className="spark"
            style={{
              left: s.x, top: s.y,
              background: 'radial-gradient(circle, #fff 0%, #ffd700 55%, transparent 100%)',
              '--tx': s.tx, '--ty': s.ty,
            } as React.CSSProperties}
          />
        ))}
        <div
          className={`
            ${ state === 'rolling' ? 'die-rolling'
             : state === 'landed'  ? 'die-landed'
             : 'die-idle' }
          `}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 200 }}
        >
          <DieSVG die={selected} size={180} />
        </div>
      </div>

      {/* Risultato */}
      <div className="h-28 flex flex-col items-center justify-center mb-6">
        {result !== null && state !== 'rolling' ? (
          <>
            <span
              className={`font-black tabular-nums leading-none ${
                isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white'
              }`}
              style={{
                fontSize: result >= 100 ? '5rem' : '7rem',
                textShadow: isCrit ? '0 0 50px #ffd700cc, 0 0 20px #ffd70088'
                           : isFail ? '0 0 40px #ef4444aa'
                           : '0 0 20px rgba(255,255,255,0.15)',
              }}
            >
              {result}
            </span>
            {isCrit && <span className="text-yellow-300 font-bold animate-pulse mt-2">✨ CRITICO! ✨</span>}
            {isFail && <span className="text-red-400 font-bold mt-2">💀 Fallimento critico</span>}
          </>
        ) : state === 'rolling' ? (
          <span className="text-slate-600 text-sm tracking-widest animate-pulse">rotolando...</span>
        ) : (
          <span className="text-slate-700 text-sm tracking-widest">premi tira</span>
        )}
      </div>

      {/* Bottone */}
      <button
        onClick={handleRoll}
        disabled={state === 'rolling'}
        className={`px-14 py-4 rounded-2xl font-bold text-lg tracking-wide border-2 transition-all ${
          state === 'rolling'
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-slate-800 border-amber-600 text-amber-300 hover:bg-amber-600 hover:text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/40'
        }`}
      >
        {state === 'rolling' ? 'Rotolando...' : `🎲 Tira d${selected}`}
      </button>

      {/* Storico */}
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-xs px-4">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-300 transition py-1"
          >
            <span>Ultimi tiri ({history.length})</span>
            <ChevronDown size={13} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
          {showHistory && (
            <div className="mt-1 max-h-36 overflow-y-auto space-y-1">
              {history.map(r => (
                <div key={r.ts}
                  className="flex items-center justify-between text-sm bg-slate-800/70 rounded-xl px-4 py-2 border-l-2 border-amber-700/40">
                  <span className="text-amber-700/80">d{r.die}</span>
                  <span className={`font-bold ${resultColor(r.result, r.die)}`}>{r.result}</span>
                  {r.result === r.die && <span className="text-yellow-400 text-xs">✨</span>}
                  {r.result === 1    && <span className="text-red-400 text-xs">💀</span>}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => { setHistory([]); setResult(null); setState('idle'); }}
            className="mt-1 flex items-center gap-1 text-xs text-slate-700 hover:text-slate-400 transition"
          >
            <RotateCcw size={10} /> Azzera storico
          </button>
        </div>
      )}
    </div>
  );
};
