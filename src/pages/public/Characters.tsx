import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url?: string;
}

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

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

  const classEmojis: Record<string, string> = {
    'Fighter': '⚔️',
    'Rogue': '🗡️',
    'Wizard': '🔮',
    'Cleric': '✨',
    'Ranger': '🏹',
    'Paladin': '⚡',
    'Bard': '🎵',
    'Druid': '🌿',
    'Barbarian': '💪',
    'Monk': '🥋',
  };

  return (
    <section id="characters" className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">The Crew</h2>
          <p className="text-amber-100">Meet the adventurers of legend</p>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-400">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="text-center text-amber-100 py-12">
            <p>No characters yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className="group bg-slate-700 border border-amber-700/30 rounded-lg overflow-hidden hover:border-amber-600 transition transform hover:scale-105 cursor-pointer text-left"
              >
                <div className="relative h-48 bg-slate-600 overflow-hidden">
                  {character.portrait_url ? (
                    <img
                      src={character.portrait_url}
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-50">
                      {classEmojis[character.class] || '⚓'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-amber-400 mb-1">{character.name}</h3>
                  <p className="text-amber-100 text-sm mb-2">
                    <span className="text-xl mr-1">{classEmojis[character.class] || '⚔️'}</span>
                    {character.class} • {character.race}
                  </p>
                  <p className="text-amber-900 text-xs font-medium">Level {character.level}</p>
                  <p className="text-amber-100 text-xs mt-3 line-clamp-3">{character.backstory}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Character Detail Modal */}
      {selectedCharacter && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-amber-700/30 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-amber-700/30 sticky top-0 bg-slate-800">
              <h2 className="text-2xl font-bold text-amber-400">{selectedCharacter.name}</h2>
              <button
                onClick={() => setSelectedCharacter(null)}
                className="text-amber-400 hover:text-amber-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedCharacter.portrait_url && (
                <img
                  src={selectedCharacter.portrait_url}
                  alt={selectedCharacter.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-amber-900 text-sm font-medium">Class</p>
                  <p className="text-amber-400 font-bold">{selectedCharacter.class}</p>
                </div>
                <div>
                  <p className="text-amber-900 text-sm font-medium">Race</p>
                  <p className="text-amber-400 font-bold">{selectedCharacter.race}</p>
                </div>
                <div>
                  <p className="text-amber-900 text-sm font-medium">Level</p>
                  <p className="text-amber-400 font-bold">{selectedCharacter.level}</p>
                </div>
              </div>

              <div>
                <p className="text-amber-900 text-sm font-medium mb-2">Backstory</p>
                <p className="text-amber-100 whitespace-pre-wrap">{selectedCharacter.backstory}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
