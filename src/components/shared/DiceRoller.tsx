import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronDown, RotateCcw } from 'lucide-react';

const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
type DieType = typeof DICE[number];
type RollState = 'idle' | 'rolling' | 'landed';

interface Roll { die: DieType; result: number; ts: number; }
interface Spark { id: number; x: number; y: number; tx: string; ty: string; color: string; }

const DIE_COLOR: Record<DieType, { fill: string; stroke: string; text: string }> = {
  4:   { fill: '#5c0a0a', stroke: '#ff6b6b', text: '#ffcccc' },
  6:   { fill: '#0a2a5c', stroke: '#6b9fff', text: '#cce0ff' },
  8:   { fill: '#0a3d1a', stroke: '#5dde7a', text: '#c0ffd0' },
  10:  { fill: '#3d0a5c', stroke: '#c46bff', text: '#eeccff' },
  12:  { fill: '#5c2e0a', stroke: '#ffaa44', text: '#ffe8cc' },
  20:  { fill: '#07073d', stroke: '#ffd700', text: '#fff5cc' },
  100: { fill: '#1a1a0a', stroke: '#cccc44', text: '#f5f5cc' },
};

function rollDie(sides: DieType): number {
  const v = Math.floor(Math.random() * sides) + 1;
  if (sides === 10 && v === 10) return 0; // d10 mostra 0 per il 10
  return v;
}

function displayResult(result: number, die: DieType): number {
  if (die === 10 && result === 0) return 10;
  if (die === 100 && result === 0) return 100;
  return result;
}

function resultColorClass(result: number, sides: DieType): string {
  const r = displayResult(result, sides);
  if (r === sides) return 'text-yellow-300';
  if (r === 1)     return 'text-red-400';
  if (r >= Math.ceil(sides * 0.75)) return 'text-green-400';
  return 'text-white';
}

// SVG paths per ogni dado — viewBox 0 0 100 100
const DieSVG: React.FC<{ die: DieType; size?: number }> = ({ die, size = 160 }) => {
  const c = DIE_COLOR[die];
  const baseProps = {
    fill: c.fill,
    stroke: c.stroke,
    strokeWidth: 2.5,
  };

  const label = die === 100 ? '%' : `d${die}`;

  const shapes: Record<DieType, React.ReactNode> = {
    // d4 — triangolo equilatero
    4: <polygon points="50,8 95,88 5,88" {...baseProps} />,
    // d6 — quadrato con angoli smussati
    6: <rect x="10" y="10" width="80" height="80" rx="10" {...baseProps} />,
    // d8 — rombo (diamante)
    8: <polygon points="50,5 95,50 50,95 5,50" {...baseProps} />,
    // d10 — pentagono
    10: <polygon points="50,5 95,35 78,88 22,88 5,35" {...baseProps} />,
    // d12 — esagono
    12: <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" {...baseProps} />,
    // d20 — triangolo appuntito (simula icosaedro 2D)
    20: <polygon points="50,4 97,82 3,82" {...baseProps} />,
    // d100 — decagono
    100: (
      <polygon
        points="50,5 79,14 95,40 95,65 79,88 50,95 21,88 5,65 5,40 21,14"
        {...baseProps}
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <filter id={`glow-${die}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`grad-${die}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={c.stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.fill} stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* Ombra esterna */}
      {React.cloneElement(shapes[die] as React.ReactElement, {
        fill: 'rgba(0,0,0,0.5)',
        stroke: 'none',
        transform: 'translate(3,5)',
        filter: `url(#glow-${die})`,
      })}

      {/* Forma con gradiente */}
      {React.cloneElement(shapes[die] as React.ReactElement, {
        fill: `url(#grad-${die})`,
        stroke: c.stroke,
        strokeWidth: 2.5,
      })}

      {/* Label tipo dado */}
      <text
        x="50" y="57"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={die === 100 ? '20' : '22'}
        fontWeight="900"
        fill={c.text}
        style={{ fontFamily: 'monospace', letterSpacing: '-1px' }}
      >
        {label}
      </text>
    </svg>
  );
};

export const DiceRoller: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected]     = useState<DieType>(20);
  const [state, setState]           = useState<RollState>('idle');
  const [result, setResult]         = useState<number | null>(null);
  const [history, setHistory]       = useState<Roll[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sparks, setSparks]         = useState<Spark[]>([]);
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
      setHistory(prev => [
        { die: selected, result: displayResult(value, selected), ts: Date.now() },
        ...prev,
      ].slice(0, 20));

      // Scintille
      const colors = ['#ffd700', '#fff', '#ffaa00', '#ff8800', DIE_COLOR[selected].stroke];
      setSparks(Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 80,
        y: 50 + (Math.random() - 0.5) * 80,
        tx: `${(Math.random() - 0.5) * 120}px`,
        ty: `${-(Math.random() * 90 + 30)}px`,
        color: colors[i % colors.length],
      })));
      setTimeout(() => setSparks([]), 900);

      // Torna idle dopo il glow
      setTimeout(() => setState('idle'), 1200);
    }, 1850);
  }, [state, selected]);

  // Chiudi con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') {} };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const displayed = result !== null ? displayResult(result, selected) : null;
  const isCrit = displayed === selected;
  const isFail = displayed === 1;

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      style={{ background: 'rgba(4, 6, 18, 0.94)', backdropFilter: 'blur(8px)' }}
    >
      {/* Chiudi */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition"
      >
        <X size={20} />
      </button>

      <p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-6">Atlante di Sherdan — Dado</p>

      {/* Selettore */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {DICE.map(d => (
          <button
            key={d}
            onClick={() => { setSelected(d); setResult(null); setState('idle'); }}
            style={{
              borderColor: selected === d ? DIE_COLOR[d].stroke : undefined,
              background: selected === d ? DIE_COLOR[d].fill : undefined,
              boxShadow: selected === d ? `0 0 12px ${DIE_COLOR[d].stroke}88` : undefined,
            }}
            className={`w-14 h-14 rounded-xl text-sm font-bold border-2 transition-all ${
              selected === d
                ? 'scale-110 text-white'
                : 'border-slate-700 text-slate-400 hover:border-slate-500 bg-slate-800'
            }`}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* SVG dado con scintille */}
      <div className="relative mb-8" style={{ width: 200, height: 200 }}>
        {sparks.map(s => (
          <span
            key={s.id}
            className="spark"
            style={{
              left: s.x, top: s.y,
              background: `radial-gradient(circle, #fff 0%, ${s.color} 60%, transparent 100%)`,
              '--tx': s.tx, '--ty': s.ty,
            } as React.CSSProperties}
          />
        ))}
        <div
          className={`dice-svg-wrap ${
            state === 'rolling' ? 'rolling' :
            state === 'landed'  ? 'landed'  : 'idle'
          }`}
          style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <DieSVG die={selected} size={180} />
        </div>
      </div>

      {/* Risultato */}
      <div className="h-28 flex flex-col items-center justify-center mb-6">
        {displayed !== null && state !== 'rolling' ? (
          <>
            <span
              className={`font-black tabular-nums ${
                isCrit ? 'text-yellow-300' : isFail ? 'text-red-400' : 'text-white'
              }`}
              style={{
                fontSize: displayed >= 100 ? '5rem' : '7rem',
                lineHeight: 1,
                textShadow: isCrit
                  ? '0 0 50px #ffd700cc, 0 0 20px #ffd70088'
                  : isFail
                  ? '0 0 40px #ef4444aa'
                  : '0 0 20px rgba(255,255,255,0.15)',
              }}
            >
              {displayed}
            </span>
            {isCrit && (
              <span className="text-yellow-300 text-base font-bold animate-pulse mt-2">
                ✨ CRITICO! ✨
              </span>
            )}
            {isFail && (
              <span className="text-red-400 text-base font-bold mt-2">
                💀 Fallimento critico
              </span>
            )}
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
        style={state !== 'rolling' ? {
          background: DIE_COLOR[selected].fill,
          borderColor: DIE_COLOR[selected].stroke,
          boxShadow: `0 4px 24px ${DIE_COLOR[selected].stroke}55`,
        } : undefined}
        className={`px-14 py-4 rounded-2xl font-bold text-lg border-2 tracking-wide transition-all ${
          state === 'rolling'
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'text-white hover:scale-105 active:scale-95'
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
                <div
                  key={r.ts}
                  className="flex items-center justify-between text-sm rounded-xl px-4 py-2"
                  style={{ background: `${DIE_COLOR[r.die].fill}99`, borderLeft: `3px solid ${DIE_COLOR[r.die].stroke}` }}
                >
                  <span style={{ color: DIE_COLOR[r.die].stroke }}>d{r.die}</span>
                  <span className={`font-bold ${resultColorClass(r.result, r.die)}`}>{r.result}</span>
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
