import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, User, Shield, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';
import { MAP_LOCATIONS } from '../../data/mapData';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url?: string | null;
  is_player_character: boolean;
  is_revealed: boolean;
  owner_email?: string | null;
  owner_user_id?: string | null;
  sigillo?: string | null;
  private_notes?: string | null;
  zone?: string | null;
}

const emptyForm = {
  name: '',
  class: '',
  race: '',
  level: 1,
  backstory: '',
  portrait_url: '',
  is_player_character: false,
  is_revealed: false,
  owner_email: '',
  sigillo: '',
  private_notes: '',
  zone: '',
};

// Luoghi dalla mappa, ordinati: prima regioni poi città
const ZONE_OPTIONS = [
  ...MAP_LOCATIONS.filter((l) => l.type === 'region').map((l) => ({ value: l.name, label: `🏛️ ${l.name} (Regione)` })),
  ...MAP_LOCATIONS.filter((l) => l.type === 'city').map((l) => ({ value: l.name, label: `🏙️ ${l.name}` })),
];

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'pg' | 'npc'>('all');
  const [formData, setFormData] = useState(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => { void fetchCharacters(); }, []);

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('is_player_character', { ascending: false })
        .order('name', { ascending: true });
      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Errore caricamento personaggi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
        owner_email: formData.is_player_character ? formData.owner_email.trim().toLowerCase() || null : null,
        sigillo: formData.is_player_character ? formData.sigillo.trim() || null : null,
        private_notes: formData.is_player_character ? formData.private_notes.trim() || null : null,
        portrait_url: formData.portrait_url.trim() || null,
        zone: formData.zone.trim() || null,
      };
      if (editingId) {
        const { error } = await supabase.from('characters').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('characters').insert([payload]);
        if (error) throw error;
      }
      resetForm();
      await fetchCharacters();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : JSON.stringify(error);
      setSubmitError(msg);
    }
  };

  const handleEdit = (character: Character) => {
    setFormData({
      name: character.name,
      class: character.class,
      race: character.race,
      level: character.level,
      backstory: character.backstory,
      portrait_url: character.portrait_url || '',
      is_player_character: character.is_player_character,
      is_revealed: character.is_revealed,
      owner_email: character.owner_email || '',
      sigillo: character.sigillo || '',
      private_notes: character.private_notes || '',
      zone: character.zone || '',
    });
    setEditingId(character.id);
    setShowForm(true);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(it.adminCharacters.confirmDelete)) return;
    try {
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (error) throw error;
      await fetchCharacters();
    } catch (error) {
      console.error('Errore eliminazione:', error);
    }
  };

  const handleToggleReveal = async (character: Character) => {
    try {
      const { error } = await supabase.from('characters').update({ is_revealed: !character.is_revealed }).eq('id', character.id);
      if (error) throw error;
      await fetchCharacters();
    } catch (error) {
      console.error('Errore toggle visibilità:', error);
    }
  };

  const filtered = characters.filter((c) => {
    if (filterType === 'pg') return c.is_player_character;
    if (filterType === 'npc') return !c.is_player_character;
    return true;
  });

  return (
    <AdminLayout currentPage="characters">
      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">{it.adminCharacters.title}</h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition">
              <Plus size={18} />{it.adminCharacters.add}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-6">
              {editingId ? it.adminCharacters.edit : it.adminCharacters.addNew}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Tipo */}
              <div className="flex items-center gap-6 p-4 bg-slate-700/50 rounded-xl border border-amber-700/20">
                <span className="text-slate-300 font-medium">Tipo:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="char_type" checked={!formData.is_player_character}
                    onChange={() => setFormData({ ...formData, is_player_character: false })} className="accent-amber-500" />
                  <span className="text-slate-200">NPC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="char_type" checked={formData.is_player_character}
                    onChange={() => setFormData({ ...formData, is_player_character: true })} className="accent-amber-500" />
                  <span className="text-slate-200 flex items-center gap-1"><User size={14} /> Personaggio Giocante (PG)</span>
                </label>
              </div>

              {/* Visibilità NPC */}
              {!formData.is_player_character && (
                <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl border border-amber-700/20">
                  <span className="text-slate-300 font-medium">Visibilità giocatori:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_revealed}
                      onChange={(e) => setFormData({ ...formData, is_revealed: e.target.checked })} className="accent-amber-500 w-4 h-4" />
                    <span className="text-slate-200 flex items-center gap-1">
                      {formData.is_revealed ? <><Eye size={14} className="text-green-400" /> Visibile ai giocatori</> : <><EyeOff size={14} className="text-slate-400" /> Nascosto ai giocatori</>}
                    </span>
                  </label>
                </div>
              )}

              {/* Info base */}
              <div>
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Informazioni base</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome *" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                    className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />
                  <input type="text" placeholder="Classe *" value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })} required
                    className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />
                  <input type="text" placeholder="Razza *" value={formData.race}
                    onChange={(e) => setFormData({ ...formData, race: e.target.value })} required
                    className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />
                  <input type="number" placeholder="Livello *" value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) || 1 })} min={1} max={20} required
                    className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />

                  {/* Zona — dropdown con luoghi dalla mappa */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 text-sm mb-1">Zona di provenienza</label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white focus:outline-none focus:border-amber-500/60"
                    >
                      <option value="">— Nessuna zona —</option>
                      <optgroup label="🏛️ Regioni">
                        {ZONE_OPTIONS.filter((o) => o.label.startsWith('🏛️')).map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏙️ Città">
                        {ZONE_OPTIONS.filter((o) => o.label.startsWith('🏙️')).map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Portrait */}
              <div>
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Immagine</h3>
                <input type="text" placeholder="URL ritratto" value={formData.portrait_url}
                  onChange={(e) => setFormData({ ...formData, portrait_url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />
                {formData.portrait_url && (
                  <img src={formData.portrait_url} alt="Anteprima"
                    className="mt-3 h-32 w-32 object-cover rounded-xl border border-amber-700/30"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
              </div>

              {/* Backstory */}
              <div>
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Storia pubblica *</h3>
                <textarea placeholder="Versione pubblica della storia (visibile a tutti)"
                  value={formData.backstory} onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                  required rows={5}
                  className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400" />
              </div>

              {/* Solo PG */}
              {formData.is_player_character && (
                <div className="space-y-4 border border-amber-600/30 bg-slate-700/30 rounded-xl p-5">
                  <h3 className="text-amber-400 font-semibold flex items-center gap-2"><Shield size={16} /> Campi Personaggio Giocante</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Email giocatore</label>
                      <input type="email" placeholder="giocatore@email.com" value={formData.owner_email}
                        onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-amber-600/40 rounded text-white placeholder-slate-400" />
                      <p className="text-slate-500 text-xs mt-1">Il giocatore deve fare login con questa email</p>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Sigillo</label>
                      <input type="text" placeholder="es. Sigillo di Mitra – L'Ombra" value={formData.sigillo}
                        onChange={(e) => setFormData({ ...formData, sigillo: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-amber-600/40 rounded text-white placeholder-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">🔒 Note segrete (visibili solo al giocatore)</label>
                    <textarea placeholder="Backstory privata, segreti sul sigillo, trame personali..."
                      value={formData.private_notes} onChange={(e) => setFormData({ ...formData, private_notes: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-700 border border-red-900/40 rounded text-white placeholder-slate-500" />
                    <p className="text-slate-500 text-xs mt-1">Non visibile agli altri giocatori né agli ospiti</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-300 rounded-lg px-4 py-3 text-sm">⚠️ Errore: {submitError}</div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded transition">
                  {editingId ? it.adminCharacters.actions.update : it.adminCharacters.actions.create}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-6 rounded transition">
                  {it.adminCharacters.actions.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        {!isLoading && characters.length > 0 && (
          <div className="flex gap-2">
            {(['all', 'pg', 'npc'] as const).map((f) => (
              <button key={f} onClick={() => setFilterType(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  filterType === f ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}>
                {f === 'all' ? 'Tutti' : f === 'pg' ? 'PG' : 'NPC'}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-300 py-8">{it.adminCharacters.loading}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">{it.adminCharacters.empty}</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((character) => (
              <div key={character.id}
                className={`bg-slate-800 border rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4 ${
                  !character.is_player_character && !character.is_revealed ? 'border-slate-600/40 opacity-70' : 'border-amber-700/20'
                }`}>
                <div className="flex gap-4 flex-1 min-w-0">
                  {character.portrait_url
                    ? <img src={character.portrait_url} alt={character.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-amber-700/30" />
                    : <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-500"><User size={24} /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-amber-300">{character.name}</h3>
                      {character.is_player_character
                        ? <span className="inline-flex items-center gap-1 text-xs bg-amber-900/40 text-amber-400 border border-amber-700/40 rounded px-2 py-0.5"><User size={10} /> PG</span>
                        : <span className="text-xs bg-slate-700 text-slate-400 border border-slate-600 rounded px-2 py-0.5">NPC</span>}
                      {!character.is_player_character && (
                        character.is_revealed
                          ? <span className="inline-flex items-center gap-1 text-xs bg-green-900/30 text-green-400 border border-green-700/40 rounded px-2 py-0.5"><Eye size={10} /> Visibile</span>
                          : <span className="inline-flex items-center gap-1 text-xs bg-slate-700/60 text-slate-500 border border-slate-600/40 rounded px-2 py-0.5"><EyeOff size={10} /> Nascosto</span>
                      )}
                      {character.zone && (
                        <span className="text-xs bg-sky-900/40 text-sky-300 border border-sky-700/40 rounded px-2 py-0.5">🗺️ {character.zone}</span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{character.class} &bull; {character.race} &bull; Livello {character.level}</p>
                    {character.is_player_character && character.owner_email && <p className="text-slate-500 text-xs mt-1">📧 {character.owner_email}</p>}
                    {character.is_player_character && character.owner_user_id && <p className="text-green-500 text-xs mt-0.5">✅ Account collegato</p>}
                    {character.is_player_character && !character.owner_user_id && character.owner_email && <p className="text-yellow-500 text-xs mt-0.5">⏳ In attesa del primo login</p>}
                    {character.sigillo && <p className="text-amber-600 text-xs mt-1 italic">{character.sigillo}</p>}
                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">{character.backstory}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!character.is_player_character && (
                    <button onClick={() => handleToggleReveal(character)}
                      className={`p-2 rounded transition text-white ${character.is_revealed ? 'bg-green-700 hover:bg-green-800' : 'bg-slate-600 hover:bg-slate-500'}`}
                      title={character.is_revealed ? 'Nascondi ai giocatori' : 'Rivela ai giocatori'}>
                      {character.is_revealed ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  )}
                  <button onClick={() => handleEdit(character)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition" title="Modifica"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(character.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition" title="Elimina"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
