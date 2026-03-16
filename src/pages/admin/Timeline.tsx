import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { CampaignEvent, EventKind, KIND_CONFIG } from '../../types/campaignEvent'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'

const EMPTY: Omit<CampaignEvent, 'id' | 'created_at'> = {
  title: '', description: null, fiction_date: '',
  sort_order: 0, kind: 'past', is_current: false, revealed: false,
}

export const TimelineAdminPage: React.FC = () => {
  const [events, setEvents] = useState<CampaignEvent[]>([])
  const [form, setForm] = useState<Omit<CampaignEvent, 'id' | 'created_at'>>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from('campaign_events')
      .select('*')
      .order('sort_order', { ascending: true })
    setEvents(data ?? [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const handleSave = async () => {
    if (!form.title.trim() || !form.fiction_date.trim()) return
    if (editing) {
      await supabase.from('campaign_events').update(form).eq('id', editing)
    } else {
      await supabase.from('campaign_events').insert(form)
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo evento?')) return
    await supabase.from('campaign_events').delete().eq('id', id)
    void load()
  }

  const toggleReveal = async (e: CampaignEvent) => {
    await supabase.from('campaign_events').update({ revealed: !e.revealed }).eq('id', e.id)
    void load()
  }

  const toggleCurrent = async (e: CampaignEvent) => {
    // Rimuove is_current da tutti, poi imposta solo questo
    await supabase.from('campaign_events').update({ is_current: false }).neq('id', e.id)
    await supabase.from('campaign_events').update({ is_current: !e.is_current }).eq('id', e.id)
    void load()
  }

  const startEdit = (e: CampaignEvent) => {
    const { id, created_at, ...rest } = e
    setForm(rest); setEditing(id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const set = (k: keyof typeof form, v: string | number | boolean | null) =>
    setForm(prev => ({ ...prev, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-pirata text-3xl text-amber-400">Cronistoria della Campagna</h1>
          <button
            onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuovo Evento
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 mb-8">
            <h2 className="text-amber-300 font-semibold mb-4">{editing ? 'Modifica Evento' : 'Nuovo Evento'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1">Titolo *</label>
                <input type="text" value={form.title}
                  onChange={e => set('title', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Data narrativa * (es. &quot;12 Bruma, Anno 847&quot;)</label>
                <input type="text" value={form.fiction_date}
                  onChange={e => set('fiction_date', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ordine di visualizzazione</label>
                <input type="number" value={form.sort_order}
                  onChange={e => set('sort_order', Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                <select value={form.kind} onChange={e => set('kind', e.target.value as EventKind)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none">
                  <option value="past">📜 Passato</option>
                  <option value="present">⚔️ Presente</option>
                  <option value="future">🔮 Futuro</option>
                </select>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.revealed} onChange={e => set('revealed', e.target.checked)}
                    className="w-4 h-4 accent-amber-500" />
                  Visibile ai giocatori
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_current} onChange={e => set('is_current', e.target.checked)}
                    className="w-4 h-4 accent-amber-500" />
                  Evento attuale (ORA)
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-gray-400 mb-1">Descrizione</label>
              <textarea rows={4} value={form.description ?? ''}
                onChange={e => set('description', e.target.value || null)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg transition-colors">Salva</button>
              <button onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY) }}
                className="border border-gray-600 text-gray-400 hover:text-white px-6 py-2 rounded-lg transition-colors">Annulla</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-12">Caricamento...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nessun evento creato.</p>
        ) : (
          <div className="space-y-2">
            {events.map(ev => {
              const cfg = KIND_CONFIG[ev.kind]
              return (
                <div key={ev.id} className={`bg-gray-800 border rounded-xl p-4 flex items-center justify-between gap-4 ${
                  ev.is_current ? 'border-amber-500' : 'border-gray-700'
                }`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-2xl">{cfg.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white truncate">{ev.title}</p>
                        {ev.is_current && <span className="text-xs bg-amber-500 text-gray-900 px-2 py-0.5 rounded-full font-bold">ORA</span>}
                        {!ev.revealed && <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Nascosto</span>}
                      </div>
                      <p className={`text-xs mt-0.5 ${cfg.color}`}>{cfg.label} · {ev.fiction_date} · Ordine: {ev.sort_order}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleCurrent(ev)} title="Segna come ORA"
                      className={`p-2 rounded-lg transition-colors ${ ev.is_current ? 'text-amber-400 bg-amber-900/30' : 'text-gray-500 hover:bg-gray-700' }`}>
                      <Star className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleReveal(ev)}
                      className={`p-2 rounded-lg transition-colors ${ ev.revealed ? 'text-green-400 hover:bg-green-900/30' : 'text-gray-500 hover:bg-gray-700' }`}>
                      {ev.revealed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => startEdit(ev)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
