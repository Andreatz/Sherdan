import React from 'react';
import { CharacterSheet } from '../../types/sheet';
import { mod } from './StatBlock';

interface SkillDef {
  label: string;
  key: keyof CharacterSheet;
  stat: keyof CharacterSheet;
}

const SKILLS: SkillDef[] = [
  { label: 'Tiro Salvezza FOR', key: 'ts_forza', stat: 'forza' },
  { label: 'Atletica', key: 'comp_atletica', stat: 'forza' },
  { label: 'Tiro Salvezza DES', key: 'ts_destrezza', stat: 'destrezza' },
  { label: 'Acrobazia', key: 'comp_acrobazia', stat: 'destrezza' },
  { label: 'Furtività', key: 'comp_furtivita', stat: 'destrezza' },
  { label: 'Rapidità di mano', key: 'comp_rapidita_mano', stat: 'destrezza' },
  { label: 'Tiro Salvezza COS', key: 'ts_costituzione', stat: 'costituzione' },
  { label: 'Tiro Salvezza INT', key: 'ts_intelligenza', stat: 'intelligenza' },
  { label: 'Arcano', key: 'comp_arcano', stat: 'intelligenza' },
  { label: 'Indagare', key: 'comp_indagare', stat: 'intelligenza' },
  { label: 'Natura', key: 'comp_natura', stat: 'intelligenza' },
  { label: 'Religione', key: 'comp_religione', stat: 'intelligenza' },
  { label: 'Storia', key: 'comp_storia', stat: 'intelligenza' },
  { label: 'Tiro Salvezza SAG', key: 'ts_saggezza', stat: 'saggezza' },
  { label: 'Addestrare animali', key: 'comp_addestrare_animali', stat: 'saggezza' },
  { label: 'Intuizione', key: 'comp_intuizione', stat: 'saggezza' },
  { label: 'Medicina', key: 'comp_medicina', stat: 'saggezza' },
  { label: 'Percepire', key: 'comp_percepire', stat: 'saggezza' },
  { label: 'Sopravvivenza', key: 'comp_sopravvivenza', stat: 'saggezza' },
  { label: 'Tiro Salvezza CAR', key: 'ts_carisma', stat: 'carisma' },
  { label: 'Intimidire', key: 'comp_intimidire', stat: 'carisma' },
  { label: 'Inganno', key: 'comp_inganno', stat: 'carisma' },
  { label: 'Intrattenere', key: 'comp_intrattenere', stat: 'carisma' },
  { label: 'Persuasione', key: 'comp_persuasione', stat: 'carisma' },
];

interface SkillListProps {
  sheet: CharacterSheet;
  isAdmin: boolean;
  onChange: (patch: Partial<CharacterSheet>) => void;
}

export const SkillList: React.FC<SkillListProps> = ({ sheet, isAdmin, onChange }) => {
  const bonus = (key: keyof CharacterSheet, stat: keyof CharacterSheet) => {
    const base = mod(sheet[stat] as number);
    const comp = sheet[key] ? sheet.bonus_competenza : 0;
    const total = base + comp;
    return total >= 0 ? `+${total}` : `${total}`;
  };

  return (
    <div className="space-y-1">
      {SKILLS.map((s) => (
        <div key={s.key as string} className="flex items-center gap-2 py-0.5">
          <input
            type="checkbox"
            checked={sheet[s.key] as boolean}
            disabled={!isAdmin}
            onChange={(e) => onChange({ [s.key]: e.target.checked } as Partial<CharacterSheet>)}
            className="accent-amber-500 w-3.5 h-3.5 flex-shrink-0"
          />
          <span className="text-amber-300 text-xs font-mono w-10 text-right flex-shrink-0">
            {bonus(s.key, s.stat)}
          </span>
          <span className="text-slate-300 text-sm">{s.label}</span>
        </div>
      ))}
    </div>
  );
};
