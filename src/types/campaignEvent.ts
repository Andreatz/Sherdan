export type EventKind = 'past' | 'present' | 'future'

export interface CampaignEvent {
  id: string
  title: string
  description: string | null
  fiction_date: string
  sort_order: number
  kind: EventKind
  is_current: boolean
  revealed: boolean
  created_at: string
}

export const KIND_CONFIG: Record<EventKind, { label: string; color: string; border: string; dot: string; icon: string }> = {
  past:    { label: 'Passato',  color: 'text-gray-400',   border: 'border-gray-600',  dot: 'bg-gray-500',   icon: '📜' },
  present: { label: 'Presente', color: 'text-amber-300',  border: 'border-amber-500', dot: 'bg-amber-400',  icon: '⚔️' },
  future:  { label: 'Futuro',   color: 'text-blue-300',   border: 'border-blue-500',  dot: 'bg-blue-400',   icon: '🔮' },
}
