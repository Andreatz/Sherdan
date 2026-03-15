import React from 'react';
import { CharacterSheet } from '../../types/sheet';
import { StatBlock } from './StatBlock';
import { SkillList } from './SkillList';
import { CombatStats } from './CombatStats';
import { SheetTextSection } from './SheetTextSection';

interface CharacterSheetTabProps {
  sheet: CharacterSheet;
  isAdmin: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onChange: (patch: Partial<CharacterSheet>) => void;
  onCreateSheet: () => void;
}

const STATS: { key: keyof CharacterSheet; label: string }[] = [
  { key: 'forza', label: 'FOR' },
  { key: 'destrezza', label: 'DES' },
  { key: 'costituzione', label: 'COS' },
  { key: 'intelligenza', label: 'INT' },
  { key: 'saggezza', label: 'SAG' },
  { key: 'carisma', label: 'CAR' },
];

export const CharacterSheetTab: React.FC<CharacterSheetTabProps> = ({
  sheet, isAdmin, saveStatus, onChange, onCreateSheet
}) => {
  return (
    <div className="space-y-8">

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-300">📋 Scheda D&D 5e</h2>
        <span className={`text-xs px-3 py-1 rounded-full transition ${
          saveStatus === 'saving' ? 'bg-slate-700 text-slate-400 animate-pulse'
          : saveStatus === 'saved' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/30'
          : saveStatus === 'error' ? 'bg-red-900/40 text-red-400'
          : 'bg-transparent text-transparent'
        }`}>
          {saveStatus === 'saving' && '💾 Salvataggio...'}
          {saveStatus === 'saved' && '✓ Salvato'}
          {saveStatus === 'error' && '⚠️ Errore salvataggio'}
          {saveStatus === 'idle' && '·'}
        </span>
      </div>

      {isAdmin && (
        <p className="text-amber-500/70 text-xs italic border border-amber-700/20 rounded-lg px-3 py-2 bg-amber-900/10">
          👑 Vista Admin — i campi in giallo sono modificabili solo dal DM. I giocatori possono modificare PF, dadi vita, ispirazione, tiri vs morte e i campi di testo personali.
        </p>
      )}

      {/* Caratteristiche */}
      <div>
        <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Caratteristiche</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STATS.map((s) => (
            <StatBlock
              key={s.key as string}
              label={s.label}
              value={sheet[s.key] as number}
              isAdmin={isAdmin}
              onChange={(v) => onChange({ [s.key]: v } as Partial<CharacterSheet>)}
            />
          ))}
        </div>
      </div>

      {/* Abilità */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Abilità e Tiri Salvezza
            {isAdmin && <span className="text-slate-500 font-normal ml-2">(solo DM)</span>}
          </h3>
          <SkillList sheet={sheet} isAdmin={isAdmin} onChange={onChange} />
        </div>

        {/* Combattimento */}
        <div>
          <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Combattimento</h3>
          <CombatStats sheet={sheet} isAdmin={isAdmin} onChange={onChange} />
        </div>
      </div>

      {/* Armi */}
      <div>
        <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">⚔️ Armi & Munizioni</h3>
        <SheetTextSection label="" value={sheet.armi_munizioni}
          onChange={(v) => onChange({ armi_munizioni: v })}
          placeholder="Es. Spada corta +4 1d6+2 perforante, Arco corto +4 1d6+2 perforante (gittata 24/96mt)"
          rows={4} />
      </div>

      {/* Equipaggiamento & Monete */}
      <div className="grid md:grid-cols-2 gap-4">
        <SheetTextSection label="🎒 Equipaggiamento" value={sheet.equipaggiamento}
          onChange={(v) => onChange({ equipaggiamento: v })}
          placeholder="Oggetti, armature, strumenti..."
          rows={5} />
        <SheetTextSection label="💰 Contanti" value={sheet.monete}
          onChange={(v) => onChange({ monete: v })}
          placeholder="Mo: 0 | Ma: 0 | Mr: 0 | Mp: 0"
          rows={5} />
      </div>

      {/* Tratti, Ideali, Legami, Difetti */}
      <div className="grid md:grid-cols-2 gap-4">
        <SheetTextSection label="🎭 Tratti caratteriali" value={sheet.tratti_caratteriali}
          onChange={(v) => onChange({ tratti_caratteriali: v })}
          placeholder="Come ti comporti, i tuoi manierismi..." />
        <SheetTextSection label="💡 Ideali" value={sheet.ideali}
          onChange={(v) => onChange({ ideali: v })}
          placeholder="Cosa credi, la tua bussola morale..." />
        <SheetTextSection label="🔗 Legami" value={sheet.legami}
          onChange={(v) => onChange({ legami: v })}
          placeholder="Persone, luoghi, oggetti che ti stanno a cuore..." />
        <SheetTextSection label="⚡ Difetti" value={sheet.difetti}
          onChange={(v) => onChange({ difetti: v })}
          placeholder="I tuoi vizi, paure, debolezze..." />
      </div>

      {/* Campi DM (read-only per player) */}
      <div className="border-t border-slate-700/50 pt-6 space-y-4">
        <h3 className="text-slate-400 font-semibold text-sm uppercase tracking-wider">
          Caratteristiche di classe e razza
          {!isAdmin && <span className="text-slate-600 font-normal ml-2">(compilati dal DM)</span>}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <SheetTextSection label="🏅 Privilegi di classe" value={sheet.privilegi_classe}
            onChange={(v) => onChange({ privilegi_classe: v })}
            readOnly={!isAdmin} rows={5} color="sky" />
          <SheetTextSection label="🧬 Tratti razziali" value={sheet.tratti_razziali}
            onChange={(v) => onChange({ tratti_razziali: v })}
            readOnly={!isAdmin} rows={5} color="sky" />
          <SheetTextSection label="⭐ Talenti" value={sheet.talenti}
            onChange={(v) => onChange({ talenti: v })}
            readOnly={!isAdmin} rows={4} color="sky" />
          <SheetTextSection label="📚 Competenze & Lingue" value={sheet.competenze_lingue}
            onChange={(v) => onChange({ competenze_lingue: v })}
            readOnly={!isAdmin} rows={4} color="sky" />
        </div>
      </div>

      {/* Incantesimi */}
      <div>
        <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">✨ Note Incantesimi & Slot</h3>
        <SheetTextSection label="" value={sheet.note_incantesimi}
          onChange={(v) => onChange({ note_incantesimi: v })}
          placeholder="Trucchetti: ...&#10;1° livello (slot: ): ...&#10;2° livello (slot: ): ..."
          rows={8} />
      </div>

    </div>
  );
};
