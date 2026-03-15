import React from 'react';
import { CharacterSheet } from '../../types/sheet';

interface CombatStatsProps {
  sheet: CharacterSheet;
  isAdmin: boolean;
  onChange: (patch: Partial<CharacterSheet>) => void;
}

const NumInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  highlight?: string;
}> = ({ label, value, onChange, min = 0, max = 999, highlight }) => (
  <div className={`flex flex-col items-center bg-slate-800 border rounded-xl p-3 gap-1 ${
    highlight ?? 'border-amber-700/20'
  }`}>
    <span className="text-slate-400 text-xs uppercase tracking-wider text-center">{label}</span>
    <input
      type="number" min={min} max={max} value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      className="w-16 text-center bg-slate-700 border border-slate-600 rounded text-white text-xl font-bold py-1"
    />
  </div>
);

const DeathSaves: React.FC<{
  label: string;
  count: number;
  max: number;
  color: string;
  onChange: (v: number) => void;
}> = ({ label, count, max, color, onChange }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-slate-400">{label}</span>
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(count === i + 1 ? i : i + 1)}
          className={`w-5 h-5 rounded-full border-2 transition ${
            i < count ? `bg-${color}-500 border-${color}-400` : `bg-slate-700 border-slate-500`
          }`}
        />
      ))}
    </div>
  </div>
);

export const CombatStats: React.FC<CombatStatsProps> = ({ sheet, isAdmin, onChange }) => (
  <div className="space-y-6">
    {/* Riga principale */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {isAdmin ? (
        <NumInput label="CA" value={sheet.ca} onChange={(v) => onChange({ ca: v })} highlight="border-sky-700/30" />
      ) : (
        <div className="flex flex-col items-center bg-slate-800 border border-sky-700/30 rounded-xl p-3 gap-1">
          <span className="text-slate-400 text-xs uppercase tracking-wider">CA</span>
          <span className="text-white text-2xl font-bold">{sheet.ca}</span>
        </div>
      )}
      {isAdmin ? (
        <NumInput label="Iniziativa" value={sheet.iniziativa} onChange={(v) => onChange({ iniziativa: v })} min={-5} max={30} />
      ) : (
        <div className="flex flex-col items-center bg-slate-800 border border-amber-700/20 rounded-xl p-3 gap-1">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Iniziativa</span>
          <span className="text-white text-2xl font-bold">{sheet.iniziativa >= 0 ? `+${sheet.iniziativa}` : sheet.iniziativa}</span>
        </div>
      )}
      {isAdmin ? (
        <NumInput label="Movimento (mt)" value={sheet.movimento} onChange={(v) => onChange({ movimento: v })} />
      ) : (
        <div className="flex flex-col items-center bg-slate-800 border border-amber-700/20 rounded-xl p-3 gap-1">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Movimento</span>
          <span className="text-white text-2xl font-bold">{sheet.movimento}mt</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-slate-800 border border-amber-700/20 rounded-xl p-3 gap-1">
        <span className="text-slate-400 text-xs uppercase tracking-wider">Bonus Comp.</span>
        {isAdmin ? (
          <input type="number" min={2} max={6} value={sheet.bonus_competenza}
            onChange={(e) => onChange({ bonus_competenza: parseInt(e.target.value, 10) || 2 })}
            className="w-14 text-center bg-slate-700 border border-slate-600 rounded text-amber-200 text-xl font-bold py-1" />
        ) : (
          <span className="text-white text-2xl font-bold">+{sheet.bonus_competenza}</span>
        )}
      </div>
    </div>

    {/* Punti Ferita */}
    <div className="bg-slate-800/60 border border-red-900/30 rounded-xl p-4">
      <h4 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-3">❤️ Punti Ferita</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {isAdmin ? (
          <NumInput label="PF Massimi" value={sheet.pf_massimi} onChange={(v) => onChange({ pf_massimi: v })} highlight="border-red-700/30" />
        ) : (
          <div className="flex flex-col items-center bg-slate-800 border border-red-700/30 rounded-xl p-3 gap-1">
            <span className="text-slate-400 text-xs uppercase tracking-wider">PF Massimi</span>
            <span className="text-white text-2xl font-bold">{sheet.pf_massimi}</span>
          </div>
        )}
        <NumInput label="PF Attuali" value={sheet.pf_attuali} onChange={(v) => onChange({ pf_attuali: v })} max={sheet.pf_massimi + 99} highlight="border-green-700/30" />
        <NumInput label="PF Temporanei" value={sheet.pf_temporanei} onChange={(v) => onChange({ pf_temporanei: v })} highlight="border-sky-700/20" />
        <div className="flex flex-col items-center bg-slate-800 border border-amber-700/20 rounded-xl p-3 gap-1">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Dadi Vita</span>
          {isAdmin ? (
            <input type="text" value={sheet.dadi_vita_totali} placeholder="es. 5d8"
              onChange={(e) => onChange({ dadi_vita_totali: e.target.value })}
              className="w-16 text-center bg-slate-700 border border-slate-600 rounded text-amber-200 text-sm py-1" />
          ) : (
            <span className="text-white text-xl font-bold">{sheet.dadi_vita_totali || '—'}</span>
          )}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-slate-500 text-xs">Usati:</span>
            <input type="number" min={0} value={sheet.dadi_vita_usati}
              onChange={(e) => onChange({ dadi_vita_usati: parseInt(e.target.value, 10) || 0 })}
              className="w-10 text-center bg-slate-700 border border-slate-600 rounded text-slate-300 text-xs py-0.5" />
          </div>
        </div>
      </div>
    </div>

    {/* Ispirazione + Tiri vs Morte */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-slate-800/60 border border-amber-700/20 rounded-xl p-4 flex items-center gap-4">
        <button
          onClick={() => onChange({ ispirazione: !sheet.ispirazione })}
          className={`w-10 h-10 rounded-full border-2 font-bold text-lg transition ${
            sheet.ispirazione
              ? 'bg-amber-500 border-amber-400 text-white'
              : 'bg-slate-700 border-slate-500 text-slate-400'
          }`}>
          ★
        </button>
        <div>
          <p className="text-amber-300 font-semibold">Ispirazione</p>
          <p className="text-slate-500 text-xs">{sheet.ispirazione ? 'Attiva' : 'Non attiva'}</p>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-red-900/30 rounded-xl p-4">
        <p className="text-red-400 font-semibold text-sm mb-3">💀 Tiri vs Morte</p>
        <div className="flex gap-6">
          <DeathSaves label="Successi" count={sheet.ts_morte_successi} max={3} color="green"
            onChange={(v) => onChange({ ts_morte_successi: v })} />
          <DeathSaves label="Fallimenti" count={sheet.ts_morte_fallimenti} max={3} color="red"
            onChange={(v) => onChange({ ts_morte_fallimenti: v })} />
        </div>
      </div>
    </div>
  </div>
);
