export interface Faction {
  id: string
  name: string
  subtitle: string | null
  description: string | null
  category: string | null
  color: string | null
  motto: string | null
  base: string | null
  reputation: number | null
  revealed: boolean
  dm_notes: string | null
  created_at: string
}

export const REPUTATION_LABELS: Record<string, { label: string; color: string }> = {
  alleata:  { label: 'Alleata',  color: 'text-green-400 border-green-400' },
  amica:    { label: 'Amica',    color: 'text-blue-400 border-blue-400' },
  neutrale: { label: 'Neutrale', color: 'text-gray-400 border-gray-400' },
  ostile:   { label: 'Ostile',   color: 'text-orange-400 border-orange-400' },
  nemica:   { label: 'Nemica',   color: 'text-red-400 border-red-400' },
}

export function reputationLevel(rep: number): string {
  if (rep >= 75)  return 'alleata'
  if (rep >= 25)  return 'amica'
  if (rep >= -24) return 'neutrale'
  if (rep >= -74) return 'ostile'
  return 'nemica'
}
