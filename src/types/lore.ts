export interface LoreEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const LORE_CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'storia',   label: 'Storia',    icon: '📜' },
  { value: 'luogo',    label: 'Luoghi',    icon: '🏛️' },
  { value: 'cultura',  label: 'Cultura',   icon: '🎭' },
  { value: 'fazione',  label: 'Fazioni',   icon: '⚔️' },
  { value: 'divinita', label: 'Divinità',  icon: '✨' },
  { value: 'altro',    label: 'Altro',     icon: '📖' },
];
