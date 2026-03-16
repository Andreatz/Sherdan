export type FactionCategory =
  | 'signori_del_mare'
  | 'istituzioni'
  | 'societa_segrete'
  | 'altro';

export interface Faction {
  id: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  category: FactionCategory;
  color: string;              // hex, es. '#6b7280'
  motto: string | null;
  base: string | null;
  reputation: number;         // -100 → +100
  revealed: boolean;
  dm_notes: string | null;
  created_at: string;
}

export const CATEGORY_CONFIG: Record<FactionCategory, { label: string; emoji: string; border: string; badge: string }> = {
  signori_del_mare: { label: 'Signori del Mare',       emoji: '⚓', border: 'border-sky-700/40',    badge: 'bg-sky-900/60 text-sky-300 border-sky-700/50'    },
  istituzioni:      { label: 'Giganti del Continente', emoji: '🏛️', border: 'border-amber-700/40',  badge: 'bg-amber-900/60 text-amber-300 border-amber-700/50' },
  societa_segrete:  { label: 'Mani nell\'Ombra',       emoji: '🕯️', border: 'border-purple-700/40', badge: 'bg-purple-900/60 text-purple-300 border-purple-700/50' },
  altro:            { label: 'Altra Fazione',           emoji: '🔰', border: 'border-slate-700/40',  badge: 'bg-slate-800/60 text-slate-300 border-slate-700/50'  },
};

/** Barra reputazione: da -100 (ostile) a +100 (alleato) */
export function reputationLabel(rep: number): { label: string; color: string } {
  if (rep >=  60) return { label: 'Alleata',   color: 'text-green-400'  };
  if (rep >=  20) return { label: 'Amichevole', color: 'text-lime-400'   };
  if (rep >=  -20) return { label: 'Neutrale',  color: 'text-slate-400'  };
  if (rep >= -60) return { label: 'Ostile',     color: 'text-orange-400' };
  return                   { label: 'Nemica',   color: 'text-red-400'    };
}
