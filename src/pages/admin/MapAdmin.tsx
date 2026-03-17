import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Edit2, Save, X, Eye, EyeOff, MapPin } from 'lucide-react';

interface Pin {
  id: string;
  name: string;
  description: string | null;
  map_x: number;
  map_y: number;
  category: string;
  is_visible: boolean;
}

const CATEGORIES = [
  { value: 'città',           label: 'Città',           color: 'bg-sky-400',    ring: 'ring-sky-400'    },
  { value: 'regione',         label: 'Regione',         color: 'bg-amber-400',  ring: 'ring-amber-400'  },
  { value: 'dungeon',         label: 'Dungeon',         color: 'bg-red-500',    ring: 'ring-red-500'    },
  { value: 'punto_interesse', label: 'Punto interesse', color: 'bg-green-400',  ring: 'ring-green-400'  },
  { value: 'segreto',         label: 'Segreto',         color: 'bg-purple-400', ring: 'ring-purple-400' },
];

const EMPTY: Omit<Pin, 'id'> = {
  name: '', description: '', map_x: 50, map_y: 50, category: 'città', is_visible: true,
};

export const MapAdminPage: React.FC = () => {
  const [pins, setPins]         = useState<Pin[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [current, setCurrent]   = useState<Partial<Pin>>(EMPTY);
  const [placing, setPlacing]   = useState(false);
  const imgRef                  = useRef<HTMLImageElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('map_pins').select('*').order('name');
    setPins((data as Pin[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    if (!current.name || current.map_x === undefined || current.map_y === undefined) return;
    const payload = { ...current };
    if (current.id) {
      await supabase.from('map_pins').update(payload).eq('id', current.id);
    } else {
      await supabase.from('map_pins').insert([payload]);
    }
    setEditing(false);
    setCurrent(EMPTY);
    setPlacing(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo pin?')) return;
    await supabase.from('map_pins').delete().eq('id', id);
    await load();
  };

  const toggleVisible = async (pin: Pin) => {
    await supabase.from('map_pins').update({ is_visible: !pin.is_visible }).eq('id', pin.id);
    await load();
  };

  // Click sulla mappa per posizionare il pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCurrent(prev => ({ ...prev, map_x: +x.toFixed(2), map_y: +y.toFixed(2) }));
    setPlacing(false);
    setEditing(true);
  };

  const catColor = (cat: string) =>
    CATEGORIES.find(c => c.value === cat)?.color ?? 'bg-amber-400';

  return (
    <AdminLayout title="Gestione Mappa" subtitle="Aggiungi e posiziona i pin sulla Mappa di Sherdan">
      <div className="space-y-6">

        {/* Istruzioni + pulsante */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">
            {placing
              ? '📍 <strong>Clicca sulla mappa</strong> per posizionare il nuovo pin.'
              : 'Clicca su “Nuovo Pin”, poi clicca sulla mappa per posizionarlo.'
            }
          </p>
          <button
            onClick={() => { setCurrent(EMPTY); setPlacing(true); setEditing(false); }}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Nuovo Pin
          </button>
        </div>

        {/* Mappa cliccabile */}
        <div
          className={`relative w-full overflow-hidden rounded-2xl border ${
            placing ? 'border-amber-500 cursor-crosshair ring-2 ring-amber-500/40' : 'border-slate-700'
          } bg-slate-900`}
          style={{ maxHeight: '60vh' }}
          onClick={handleMapClick}
        >
          <img
            ref={imgRef}
            src="/Mappa-Sherdan.png"
            alt="Mappa di Sherdan"
            className="w-full block"
            draggable={false}
          />
          {pins.map(pin => (
            <button
              key={pin.id}
              onClick={e => { e.stopPropagation(); setCurrent(pin); setEditing(true); setPlacing(false); }}
              className="absolute -translate-x-1/2 -translate-y-full group"
              style={{ left: `${pin.map_x}%`, top: `${pin.map_y}%` }}
              title={pin.name}
            >
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg group-hover:scale-150 transition-transform ${
                  catColor(pin.category)
                } ${!pin.is_visible ? 'opacity-40' : ''}`} />
                <span className="mt-1 text-[10px] font-bold text-white drop-shadow bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {pin.name}
                </span>
              </div>
            </button>
          ))}
          {placing && (
            <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center pointer-events-none">
              <span className="bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-lg">
                📍 Clicca per posizionare il pin
              </span>
            </div>
          )}
        </div>

        {/* Modal editor */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="text-amber-400 w-5 h-5" />
                  {current.id ? 'Modifica Pin' : 'Nuovo Pin'}
                </h3>
                <button onClick={() => { setEditing(false); setCurrent(EMPTY); }} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                    value={current.name || ''}
                    onChange={e => setCurrent(p => ({ ...p, name: e.target.value }))}
                    placeholder="Es. Domus Nova"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Categoria</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCurrent(p => ({ ...p, category: c.value }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          current.category === c.value
                            ? 'border-amber-500 bg-amber-600/20 text-white'
                            : 'border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${c.color}`} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Descrizione (opzionale)</label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm resize-none focus:outline-none focus:border-amber-500"
                    value={current.description || ''}
                    onChange={e => setCurrent(p => ({ ...p, description: e.target.value }))}
                    placeholder="Breve descrizione del luogo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">X% sulla mappa</label>
                    <input
                      type="number" min="0" max="100" step="0.1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                      value={current.map_x ?? 50}
                      onChange={e => setCurrent(p => ({ ...p, map_x: +e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Y% sulla mappa</label>
                    <input
                      type="number" min="0" max="100" step="0.1"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                      value={current.map_y ?? 50}
                      onChange={e => setCurrent(p => ({ ...p, map_y: +e.target.value }))}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-amber-500 w-4 h-4"
                    checked={current.is_visible ?? true}
                    onChange={e => setCurrent(p => ({ ...p, is_visible: e.target.checked }))}
                  />
                  <span className="text-slate-300 text-sm">Visibile ai giocatori</span>
                </label>
              </div>

              <div className="p-5 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => { setEditing(false); setCurrent(EMPTY); }}
                  className="px-5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Salva Pin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista pin */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Pin esistenti ({pins.length})</h2>
          {loading ? (
            <p className="text-slate-500 py-8 text-center">Caricamento...</p>
          ) : pins.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
              <MapPin className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 italic">Nessun pin ancora. Clicca “Nuovo Pin” e poi sulla mappa!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pins.map(pin => (
                <div
                  key={pin.id}
                  className={`group flex items-start gap-3 p-4 rounded-xl border transition ${
                    pin.is_visible ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${catColor(pin.category)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{pin.name}</p>
                    <p className="text-xs text-slate-500">
                      {CATEGORIES.find(c => c.value === pin.category)?.label} • X:{pin.map_x.toFixed(1)}% Y:{pin.map_y.toFixed(1)}%
                    </p>
                    {pin.description && (
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{pin.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => toggleVisible(pin)}
                      className={`p-1.5 rounded transition ${
                        pin.is_visible ? 'text-green-400 hover:text-green-300' : 'text-slate-500 hover:text-white'
                      }`}
                      title={pin.is_visible ? 'Nascondi' : 'Mostra'}
                    >
                      {pin.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setCurrent(pin); setEditing(true); }}
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pin.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
