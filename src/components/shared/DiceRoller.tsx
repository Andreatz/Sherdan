import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];
type RollState = 'idle' | 'rolling' | 'landed';

interface Roll  { die: DieType; result: number; ts: number; }
interface Spark { id: number; x: number; y: number; tx: string; ty: string; }

function rollDie(sides: DieType): number {
  return Math.floor(Math.random() * sides) + 1;
}
function resultColor(result: number, sides: DieType): string {
  if (result === sides) return 'text-yellow-300';
  if (result === 1)     return 'text-red-400';
  if (result >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

// Colore accent per ogni dado
const DIE_ACCENT: Record<DieType, string> = {
  4:   '#c0392b',
  6:   '#2471a3',
  8:   '#1e8449',
  10:  '#7d3c98',
  12:  '#d35400',
  20:  '#1a237e',
  100: '#4a5000',
};

// SVG distinto per ogni dado, viewBox 0 0 100 100
const DieSVG: React.FC<{ die: DieType; size?: number }> = ({ die, size = 180 }) => {
  const accent = DIE_ACCENT[die];
  const gid = `g${die}`;

  const defs = (
    <defs>
      <radialGradient id={gid} cx="38%" cy="30%" r="70%">
        <stop offset="0%"  stopColor={accent} stopOpacity="0.9" />
        <stop offset="60%" stopColor={accent} stopOpacity="0.6" />
        <stop offset="100%" stopColor="#060d1f" stopOpacity="1" />
      </radialGradient>
    </defs>
  );

  const gold   = 'rgba(212,175,55,0.85)';
  const dimmed = 'rgba(212,175,55,0.30)';
  const sw = 2.5;

  const shapes: Record<DieType, React.ReactNode> = {

    // d4 — Tetraedro: triangolo grande con 3 sotto-triangoli interni
    4: (
      <g>
        {defs}
        {/* Forma esterna */}
        <polygon points="50,5 97,91 3,91" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round" />
        {/* Facce interne */}
        <line x1="50" y1="5"  x2="50" y2="91" stroke={dimmed} strokeWidth={1.5} />
        <line x1="50" y1="5"  x2="3"  y2="91" stroke={dimmed} strokeWidth={1.5} />
        <line x1="50" y1="5"  x2="97" y2="91" stroke={dimmed} strokeWidth={1.5} />
        <line x1="3"  y1="91" x2="97" y2="91" stroke={dimmed} strokeWidth={1.5} />
        {/* Numero */}
        <text x="50" y="75" textAnchor="middle" fontSize="22" fontWeight="900" fill="#ffd700" fontFamily="monospace">d4</text>
      </g>
    ),

    // d6 — Cubo con faccia frontale + due laterali visibili
    6: (
      <g>
        {defs}
        <rect x="10" y="10" width="80" height="80" rx="10" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} />
        {/* Griglia punti 3x3 */}
        {[25,50,75].map(cx => [25,50,75].map(cy => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill={gold} opacity="0.25" />
        )))}
        {/* Puntini dado vero */}
        <circle cx="30" cy="30" r="6" fill="#ffd700" opacity="0.9" />
        <circle cx="70" cy="70" r="6" fill="#ffd700" opacity="0.9" />
        <circle cx="70" cy="30" r="6" fill="#ffd700" opacity="0.9" />
        <circle cx="30" cy="70" r="6" fill="#ffd700" opacity="0.9" />
        <circle cx="50" cy="50" r="6" fill="#ffd700" opacity="0.9" />
        <text x="50" y="56" textAnchor="middle" fontSize="0" fill="none">d6</text>
      </g>
    ),

    // d8 — Ottaedro: rombo con diagonali
    8: (
      <g>
        {defs}
        <polygon points="50,4 96,50 50,96 4,50" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round" />
        {/* Diagonali interne */}
        <line x1="4" y1="50" x2="96" y2="50" stroke={dimmed} strokeWidth={1.5} />
        <line x1="50" y1="4" x2="50" y2="96" stroke={dimmed} strokeWidth={1.5} />
        <line x1="4" y1="50" x2="50" y2="4"  stroke={dimmed} strokeWidth={1} />
        <line x1="96" y1="50" x2="50" y2="96" stroke={dimmed} strokeWidth={1} />
        <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="900" fill="#ffd700" fontFamily="monospace">d8</text>
      </g>
    ),

    // d10 — Pentagono a punta (forma tipica d10)
    10: (
      <g>
        {defs}
        {/* Corpo */}
        <polygon points="50,5 93,36 76,90 24,90 7,36" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round" />
        {/* Linee interne a croce */}
        <line x1="50" y1="5"  x2="24" y2="90" stroke={dimmed} strokeWidth={1.2} />
        <line x1="50" y1="5"  x2="76" y2="90" stroke={dimmed} strokeWidth={1.2} />
        <line x1="50" y1="5"  x2="7"  y2="36" stroke={dimmed} strokeWidth={1.2} />
        <line x1="50" y1="5"  x2="93" y2="36" stroke={dimmed} strokeWidth={1.2} />
        <line x1="7"  y1="36" x2="76" y2="90" stroke={dimmed} strokeWidth={1.2} />
        <line x1="93" y1="36" x2="24" y2="90" stroke={dimmed} strokeWidth={1.2} />
        <text x="50" y="62" textAnchor="middle" fontSize="17" fontWeight="900" fill="#ffd700" fontFamily="monospace">d10</text>
      </g>
    ),

    // d12 — Dodecaedro: esagono con pentagono interno
    12: (
      <g>
        {defs}
        <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round" />
        {/* Pentagono interno */}
        <polygon points="50,22 76,40 66,70 34,70 24,40" fill="none" stroke={dimmed} strokeWidth={1.5} />
        {/* Raggi centro */}
        {[[50,22],[76,40],[66,70],[34,70],[24,40]].map(([x,y],i) => (
          <line key={i} x1="50" y1="50" x2={x} y2={y} stroke={dimmed} strokeWidth={1} />
        ))}
        <text x="50" y="56" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffd700" fontFamily="monospace">d12</text>
      </g>
    ),

    // d20 — Icosaedro: triangolo con suddivisione interna tipica
    20: (
      <g>
        {defs}
        {/* Triangolo esterno più grande */}
        <polygon points="50,3 97,88 3,88" fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round" />
        {/* Triangolo interno rovesciato */}
        <polygon points="50,55 26,25 74,25" fill="none" stroke={dimmed} strokeWidth={1.5} />
        {/* Lati medi */}
        <line x1="3"  y1="88" x2="74" y2="25" stroke={dimmed} strokeWidth={1.2} />
        <line x1="97" y1="88" x2="26" y2="25" stroke={dimmed} strokeWidth={1.2} />
        <line x1="26" y1="25" x2="74" y2="25" stroke={dimmed} strokeWidth={1.2} />
        <text x="50" y="78" textAnchor="middle" fontSize="18" fontWeight="900" fill="#ffd700" fontFamily="monospace">d20</text>
      </g>
    ),

    // d100 — Decagono (10 lati) con stella interna
    100: (
      <g>
        {defs}
        <polygon
          points="50,4 79,13 95,38 95,62 79,87 50,96 21,87 5,62 5,38 21,13"
          fill={`url(#${gid})`} stroke={gold} strokeWidth={sw} strokeLinejoin="round"
        />
        {/* Stella a 5 punte interna */}
        <polygon
          points="50,22 56,40 74,40 60,52 65,70 50,60 35,70 40,52 26,40 44,40"
          fill="none" stroke={dimmed} strokeWidth={1.2}
        />
        <text x="50" y="58" textAnchor="middle" fontSize="14" fontWeight="900" fill="#ffd700" fontFamily="monospace">d100</text>
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
         xmlns="http://www.w3.org/2000/svg"
         style={{ overflow: 'visible', display: 'block', filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.4))' }}>
      {shapes[die]}
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
      setSparks(Array.from({ length: 14 }, (_, i) => ({
        id: Date.now() + i,
        x: 80 + (Math.random() - 0.5) * 120,
        y: 80 + (Math.random() - 0.5) * 120,
        tx: `${(Math.random() - 0.5) * 130}px`,
        ty: `${-(Math.random() * 90 + 30)}px`,
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
                ? 'border-amber-500 text-amber-300 scale-110 shadow-lg shadow-amber-900/50'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-amber-700 hover:text-slate-200'
            }`}
            style={selected === d ? { background: DIE_ACCENT[d] } : {}}
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
          className={`${state === 'rolling' ? 'die-rolling' : state === 'landed' ? 'die-landed' : 'die-idle'}`}
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
