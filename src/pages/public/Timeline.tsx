import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { CampaignEvent, KIND_CONFIG } from '../../types/campaignEvent'
import { ScrollText } from 'lucide-react'

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'past' | 'present' | 'future'>('all')

  useEffect(() => {
    supabase
      .from('campaign_events')
      .select('*')
      .eq('revealed', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.kind === filter)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-pirata text-5xl text-amber-400 mb-4">Cronistoria</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Gli eventi che hanno segnato il destino della compagnia, nell'ordine in cui il mondo li ricorda.
          </p>
        </div>

        {/* Filtri */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {(['all', 'past', 'present', 'future'] as const).map(k => {
            const cfg = k === 'all' ? null : KIND_CONFIG[k]
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                  filter === k
                    ? 'bg-amber-500 border-amber-500 text-gray-900 font-semibold'
                    : 'border-gray-600 text-gray-400 hover:border-amber-500 hover:text-amber-400'
                }`}
              >
                {k === 'all' ? 'Tutti' : `${cfg!.icon} ${cfg!.label}`}
              </button>
            )
          })}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Caricamento...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <ScrollText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nessun evento ancora registrato nella cronistoria.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Linea verticale */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />

            <div className="space-y-0">
              {filtered.map((event, i) => {
                const cfg = KIND_CONFIG[event.kind]
                return (
                  <div key={event.id} className="relative flex gap-6 pb-10">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg ${
                        event.is_current
                          ? 'bg-amber-500 border-amber-300 shadow-lg shadow-amber-500/40'
                          : `bg-gray-900 ${cfg.border}`
                      }`}>
                        {cfg.icon}
                      </div>
                      {event.is_current && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-20" />
                      )}
                    </div>

                    {/* Contenuto */}
                    <div className={`flex-1 bg-gray-900 border rounded-xl p-5 ${
                      event.is_current ? 'border-amber-500' : cfg.border
                    }`}>
                      {/* Data narrativa */}
                      <p className={`text-xs font-mono mb-1 ${cfg.color}`}>
                        {cfg.icon} {event.fiction_date}
                        {event.is_current && (
                          <span className="ml-2 bg-amber-500 text-gray-900 text-xs px-2 py-0.5 rounded-full font-semibold">
                            ORA
                          </span>
                        )}
                      </p>

                      <h2 className="text-white font-semibold text-lg mb-2">{event.title}</h2>

                      {event.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
                      )}

                      {/* Badge tipo */}
                      <div className="mt-3">
                        <span className={`text-xs border px-2 py-0.5 rounded-full ${cfg.color} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
