import React from 'react';

interface StatBlockProps {
  label: string;
  value: number;
  isAdmin: boolean;
  onChange: (v: number) => void;
}

export const mod = (score: number) => Math.floor((score - 10) / 2);
export const modStr = (score: number) => { const m = mod(score); return m >= 0 ? `+${m}` : `${m}`; };

export const StatBlock: React.FC<StatBlockProps> = ({ label, value, isAdmin, onChange }) => (
  <div className="flex flex-col items-center bg-slate-800 border border-amber-700/20 rounded-xl p-3 gap-1">
    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">{label}</span>
    <span className="text-white text-2xl font-bold">{modStr(value)}</span>
    {isAdmin ? (
      <input
        type="number" min={1} max={30} value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 10)}
        className="w-14 text-center bg-slate-700 border border-amber-700/30 rounded text-amber-200 text-sm py-1"
      />
    ) : (
      <span className="text-slate-400 text-sm">{value}</span>
    )}
  </div>
);
