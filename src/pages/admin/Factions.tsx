import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { Faction } from '../../types/faction'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

const EMPTY: Omit<Faction, 'id' | 'created_at'> = {
  name: '', subtitle: null, description: null, category: 'altro',
  color: '#f59e0b', motto: null, base: null, reputation: 0,
  revealed: false, dm_notes: null,
}

export const FactionAdminPage: React.FC = () => {
  const [factions, setFactions] = useState<Faction[]>([])
  const [form, setForm] = useState<Omit<Faction, 'id' | 'created_at'>>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('factions').select('*').order('name')
    setFactions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const handleSave = async () => {
    if (!form.name.trim()) return
    if (editing) {
      await supabase.from('factions').update(form).eq('id', editing)
    } else {
      await supabase.from('factions').insert(form)
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa fazione?')) return
    await supabase.from('factions').delete().eq('id', id)
    void load()
  }

  const toggleReveal = async (f: Faction) => {
    await supabase.from('factions').update({ revealed: !f.revealed }).eq('id', f.id)
    void load()
  }

  const startEdit = (f: Faction) => {
    const { id, created_at, ...rest } = f
    setForm(rest); setEditing(id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const set = (k: keyof typeof form, v: string | number | boolean | null) =>
    setForm(prev => ({ ...prev, [k]: v }))

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-pirata text-3xl text-amber-400">Gestione Fazioni</h1>
          <button
            onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Nuova Fazione
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 mb-8">
            <h2 className="text-amber-300 font-semibold mb-4">{editing ? 'Modifica Fazione' : 'Nuova Fazione'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                { k: 'name', label: 'Nome *', type: 'text' },
                { k: 'subtitle', label: 'Sottotitolo', type: 'text' },
                { k: 'category', label: 'Categoria', type: 'text' },
                { k: 'base', label: 'Sede', type: 'text' },
                { k: 'motto', label: 'Motto', type: 'text' },
                { k: 'reputation', label: 'Reputazione (-100 / +100)', type: 'number' },
              ] as { k: keyof typeof form; label: string; type: string }[]).map(({ k, label, type }) => (
                <div key={k}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input
                    type={type}
                    value={String(form[k] ?? '')}
                    onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value || null)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Colore badge</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color ?? '#f59e0b'} onChange={e => set('color', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-gray-400 text-sm">{form.color}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="revealed" checked={form.revealed} onChange={e => set('revealed', e.target.checked)}
                  className="w-4 h-4 accent-amber-500" />
                <label htmlFor="revealed" className="text-gray-300 text-sm">Visibile ai giocatori</label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-gray-400 mb-1">Descrizione</label>
              <textarea
                rows={4}
                value={form.description ?? ''}
                onChange={e => set('description', e.target.value || null)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none resize-none"
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs text-gray-400 mb-1">Note DM (private)</label>
              <textarea
                rows={3}
                value={form.dm_notes ?? ''}
                onChange={e => set('dm_notes', e.target.value || null)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-amber-500 outline-none resize-none"
              />
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
        ) : factions.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Nessuna fazione creata.</p>
        ) : (
          <div className="space-y-3">
            {factions.map(f => (
              <div key={f.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: f.color ?? '#6b7280' }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-pirata text-lg text-amber-300 truncate">{f.name}</p>
                      {!f.revealed && <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Nascosta</span>}
                    </div>
                    <p className="text-xs text-gray-500">{f.category ?? ''} {f.base ? `· ${f.base}` : ''} · Rep: {f.reputation ?? 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleReveal(f)} title={f.revealed ? 'Nascondi' : 'Rivela'}
                    className={`p-2 rounded-lg transition-colors ${ f.revealed ? 'text-green-400 hover:bg-green-900/30' : 'text-gray-500 hover:bg-gray-700' }`}>
                    {f.revealed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(f)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(f.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
