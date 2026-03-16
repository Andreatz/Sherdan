export type FactionCategory = 'mare' | 'continente' | 'ombra';

export interface Faction {
  id: string;
  name: string;
  category: FactionCategory;
  tagline: string | null;        // motto o slogan breve
  description: string | null;    // testo pubblico lungo
  base: string | null;           // es. "L'Isola della Vedova"
  image_url: string | null;
  symbol_emoji: string | null;   // emoji rapida se non c'è immagine
  revealed: boolean;
  dm_notes: string | null;
  created_at: string;
}

export const CATEGORY_CONFIG: Record<FactionCategory, { label: string; color: string; border: string; badge: string; emoji: string }> = {
  mare:       { label: 'Signori del Mare',            color: 'from-sky-950/60',    border: 'border-sky-700/40',    badge: 'bg-sky-900/60 text-sky-300 border-sky-700/50',    emoji: '⚓' },
  continente: { label: 'Giganti del Continente',      color: 'from-amber-950/60',  border: 'border-amber-700/40',  badge: 'bg-amber-900/60 text-amber-300 border-amber-700/50', emoji: '🏛️' },
  ombra:      { label: 'Mani nell\'Ombra',            color: 'from-purple-950/60', border: 'border-purple-700/40', badge: 'bg-purple-900/60 text-purple-300 border-purple-700/50', emoji: '🕯️' },
};
