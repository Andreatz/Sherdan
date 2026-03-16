export type NpcStatus       = 'vivo' | 'morto' | 'sconosciuto';
export type NpcRelationship = 'alleato' | 'neutrale' | 'ostile' | 'sconosciuto';

export interface NPC {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  role: string | null;           // es. "Capitano della guardia"
  faction: string | null;        // es. "Marina Imperiale"
  zone: string | null;           // es. "Arborea"
  status: NpcStatus;
  relationship: NpcRelationship;
  revealed: boolean;
  dm_notes: string | null;       // note private DM
  created_at: string;
}

export const STATUS_LABELS: Record<NpcStatus, { label: string; color: string }> = {
  vivo:        { label: 'Vivo',        color: 'text-green-400 border-green-700/50 bg-green-950/20'  },
  morto:       { label: 'Morto',       color: 'text-red-400 border-red-700/50 bg-red-950/20'        },
  sconosciuto: { label: 'Sconosciuto', color: 'text-slate-400 border-slate-600 bg-slate-800/40'     },
};

export const REL_LABELS: Record<NpcRelationship, { label: string; color: string; emoji: string }> = {
  alleato:     { label: 'Alleato',     color: 'text-sky-400 border-sky-700/50',    emoji: '🤝' },
  neutrale:    { label: 'Neutrale',    color: 'text-slate-300 border-slate-600',   emoji: '😐' },
  ostile:      { label: 'Ostile',      color: 'text-red-400 border-red-700/50',    emoji: '⚔️' },
  sconosciuto: { label: 'Sconosciuto', color: 'text-slate-500 border-slate-700',   emoji: '❓' },
};
