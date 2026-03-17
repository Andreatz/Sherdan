export type LoreCategory =
  | 'storia'
  | 'luogo'
  | 'cultura'
  | 'fazione'
  | 'divinità'
  | 'personaggio'
  | 'altro';

export interface LoreEntry {
  id: string;
  title: string;
  category: LoreCategory;
  content: string;
  tags: string[];
  location_id?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const LORE_CATEGORIES: { value: LoreCategory; label: string; emoji: string }[] = [
  { value: 'storia',      label: 'Storia',      emoji: '📜' },
  { value: 'luogo',       label: 'Luogo',       emoji: '🏛️' },
  { value: 'cultura',     label: 'Cultura',     emoji: '🎭' },
  { value: 'fazione',     label: 'Fazione',     emoji: '⚔️' },
  { value: 'divinità',    label: 'Divinità',    emoji: '✨' },
  { value: 'personaggio', label: 'Personaggio', emoji: '🧙' },
  { value: 'altro',       label: 'Altro',       emoji: '📖' },
];
