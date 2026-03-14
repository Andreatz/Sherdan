import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url?: string | null;
}

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    race: '',
    level: 1,
    backstory: '',
    portrait_url: '',
  });

  useEffect(() => {
    void fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Errore nel caricamento dei personaggi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      race: '',
      level: 1,
      backstory: '',
      portrait_url: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('characters')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('characters')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      await fetchCharacters();
    } catch (error) {
      console.error('Errore nel salvataggio del personaggio:', error);
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
    });
    setEditingId(character.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(it.adminCharacters.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCharacters();
    } catch (error) {
      console.error('Errore nell’eliminazione del personaggio:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-300">
            {it.adminCharacters.title}
          </h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={18} />
              {it.adminCharacters.add}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-5">
              {editingId ? it.adminCharacters.edit : it.adminCharacters.addNew}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={it.adminCharacters.fields.name}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder={it.adminCharacters.fields.class}
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder={it.adminCharacters.fields.race}
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder={it.adminCharacters.fields.level}
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) || 1 })}
                  min={1}
                  max={20}
                  required
                  className="px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
                />
              </div>

              <textarea
                placeholder={it.adminCharacters.fields.backstory}
                value={formData.backstory}
                onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <input
                type="text"
                placeholder={it.adminCharacters.fields.portraitUrl}
                value={formData.portrait_url}
                onChange={(e) => setFormData({ ...formData, portrait_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {editingId ? it.adminCharacters.actions.update : it.adminCharacters.actions.create}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded transition"
                >
                  {it.adminCharacters.actions.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-300 py-8">
            {it.adminCharacters.loading}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center text-slate-300 py-10 bg-slate-800 rounded-xl border border-amber-700/20">
            {it.adminCharacters.empty}
          </div>
        ) : (
          <div className="grid gap-4">
            {characters.map((character) => (
              <div
                key={character.id}
                className="bg-slate-800 border border-amber-700/20 rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-300">
                    {character.name}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    {character.class} • {character.race} • {it.charactersPublic.level} {character.level}
                  </p>
                  <p className="text-slate-400 text-sm mt-3 line-clamp-3">
                    {character.backstory}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(character)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
