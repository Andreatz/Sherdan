import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { Faction, reputationLevel, REPUTATION_LABELS } from '../../types/faction'
import { Shield, MapPin, Sword, Users, X } from 'lucide-react'

export const FactionsPage: React.FC = () => {
  const [factions, setFactions] = useState<Faction[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Faction | null>(null)
  const [filter, setFilter] = useState('tutti')

  useEffect(() => {
    supabase
      .from('factions')
      .select('*')
      .eq('revealed', true)
      .order('name')
      .then(({ data }) => {
        setFactions(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = ['tutti', ...Array.from(new Set(factions.map(f => f.category).filter(Boolean) as string[]))]
  const filtered = filter === 'tutti' ? factions : factions.filter(f => f.category === filter)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-pirata text-5xl text-amber-400 mb-4">Fazioni &amp; Alleanze</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Le grandi potenze che muovono le fila del mondo. Ogni scelta ha un prezzo, ogni alleanza un costo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full border text-sm capitalize transition-all ${
                filter === cat
                  ? 'bg-amber-500 border-amber-500 text-gray-900 font-semibold'
                  : 'border-gray-600 text-gray-400 hover:border-amber-500 hover:text-amber-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Nessuna fazione ancora rivelata.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(faction => {
              const repLevel = reputationLevel(faction.reputation ?? 0)
              const repInfo = REPUTATION_LABELS[repLevel]
              const rep = faction.reputation ?? 0
              const repPercent = ((rep + 100) / 200) * 100
              return (
                <div
                  key={faction.id}
                  onClick={() => setSelected(faction)}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-amber-500 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: faction.color ?? '#6b7280' }} />
                      <span className="text-xs text-gray-500 uppercase tracking-widest">{faction.category ?? 'Fazione'}</span>
                    </div>
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${repInfo.color}`}>{repInfo.label}</span>
                  </div>
                  <h2 className="font-pirata text-2xl text-amber-300 group-hover:text-amber-200 mb-1">{faction.name}</h2>
                  {faction.subtitle && <p className="text-gray-500 text-sm italic mb-3">{faction.subtitle}</p>}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Reputazione</span>
                      <span>{rep > 0 ? `+${rep}` : rep}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${repPercent}%`, backgroundColor: faction.color ?? '#f59e0b' }} />
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    {faction.base && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-600" /><span>{faction.base}</span></div>}
                    {faction.motto && <div className="flex items-center gap-2"><Sword className="w-3.5 h-3.5 text-amber-600" /><span className="italic">"{faction.motto}"</span></div>}
                  </div>
                  {faction.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2">{faction.description}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: selected.color ?? '#6b7280' }} />
                <span className="text-xs text-gray-500 uppercase tracking-widest">{selected.category}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <h2 className="font-pirata text-4xl text-amber-300 mb-1">{selected.name}</h2>
            {selected.subtitle && <p className="text-gray-400 italic mb-6">{selected.subtitle}</p>}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Reputazione del party</span>
                <span className={REPUTATION_LABELS[reputationLevel(selected.reputation ?? 0)].color}>
                  {REPUTATION_LABELS[reputationLevel(selected.reputation ?? 0)].label} ({selected.reputation ?? 0 > 0 ? '+' : ''}{selected.reputation ?? 0})
                </span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(((selected.reputation ?? 0) + 100) / 200) * 100}%`, backgroundColor: selected.color ?? '#f59e0b' }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {selected.base && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Sede</p>
                  <p className="text-gray-200 flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" />{selected.base}</p>
                </div>
              )}
              {selected.motto && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Motto</p>
                  <p className="text-gray-200 italic">"{selected.motto}"</p>
                </div>
              )}
            </div>
            {selected.description && (
              <div className="mb-6">
                <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Descrizione</h3>
                <p className="text-gray-300 leading-relaxed">{selected.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
