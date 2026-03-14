import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url?: string;
  stats_json?: any;
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
    fetchCharacters();
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
      console.error('Error fetching characters:', error);
    } finally {
      setIsLoading(false);
    }
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
      fetchCharacters();
    } catch (error) {
      console.error('Error saving character:', error);
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
    if (!confirm('Are you sure you want to delete this character?')) return;

    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
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

  return (
    <AdminLayout currentPage="characters">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-400">Characters</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
            >
              <Plus size={20} />
              Add Character
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400">{editingId ? 'Edit' : 'Add New'} Character</h2>
              <button onClick={resetForm} className="text-amber-400 hover:text-amber-300">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />

                <input
                  type="text"
                  placeholder="Class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />

                <input
                  type="text"
                  placeholder="Race"
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />

                <input
                  type="number"
                  placeholder="Level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  required
                  className="px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <textarea
                placeholder="Backstory"
                value={formData.backstory}
                onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <input
                type="text"
                placeholder="Portrait URL"
                value={formData.portrait_url}
                onChange={(e) => setFormData({ ...formData, portrait_url: e.target.value })}
                className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded transition"
                >
                  {editingId ? 'Update' : 'Create'} Character
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-amber-400">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="text-center text-amber-100 py-8">
            <p>No characters yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {characters.map((character) => (
              <div key={character.id} className="bg-slate-700 border border-amber-700/30 rounded-lg p-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-400">{character.name}</h3>
                  <p className="text-amber-100 text-sm">
                    {character.class} • {character.race} • Level {character.level}
                  </p>
                  <p className="text-amber-900 text-sm mt-2 line-clamp-2">{character.backstory}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(character)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
                  >
                    <Edit2 size={18} />
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
