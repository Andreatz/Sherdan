export type DangerLevel = 'basso' | 'medio' | 'alto' | 'letale';

export interface Creature {
  id: string;
  name: string;
  image_url: string | null;
  description: string;
  danger_level: DangerLevel;
  creature_type: string;       // es. "Non morto", "Bestia", "Umanoide"
  habitat: string | null;      // es. "Foreste di Arborea"
  revealed: boolean;           // false = visibile solo all'admin
  session_encountered: string | null; // es. "Sessione 3"
  created_at: string;
}
