import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url: string | null;
}

export const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('characters')
        .select('id, name, class, race, level, backstory, portrait_url')
        .order('level', { ascending: false })
        .order('name', { ascending: true });

      setCharacters(data ?? []);
      setLoading(false);
    };

    void fetchCharacters();
  }, []);

  return (
    <section id="characters" className="py-24 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">
            {it.charactersPublic.title}
          </h2>
          <p className="text-slate-300 text-lg">
            {it.charactersPublic.subtitle}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg">
            {it.charactersPublic.loading}
          </p>
        ) : characters.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">
            {it.charactersPublic.empty}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className="text-left rounded-2xl overflow-hidden border border-amber-700/20 bg-slate-900 hover:-translate-y-1 hover:shadow-2xl transition"
              >
                <div className="h-72 bg-slate-800 overflow-hidden">
                  {character.portrait_url ? (
                    <img
                      src={character.portrait_url}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Nessun ritratto
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-2xl font-bold text-amber-300">
                    {character.name}
                  </h3>
                  <p className="text-slate-200">
                    {it.charactersPublic.class}: {character.class}
                  </p>
                  <p className="text-slate-200">
                    {it.charactersPublic.race}: {character.race}
                  </p>
                  <p className="text-slate-200">
                    {it.charactersPublic.level}: {character.level}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedCharacter && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            onClick={() => setSelectedCharacter(null)}
          >
            <div
              className="max-w-3xl w-full bg-slate-900 border border-amber-700/30 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="bg-slate-800 min-h-[320px]">
                  {selectedCharacter.portrait_url ? (
                    <img
                      src={selectedCharacter.portrait_url}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      Nessun ritratto
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <h3 className="text-3xl font-bold text-amber-300 mb-4">
                    {selectedCharacter.name}
                  </h3>

                  <div className="space-y-2 text-slate-200 mb-6">
                    <p>{it.charactersPublic.class}: {selectedCharacter.class}</p>
                    <p>{it.charactersPublic.race}: {selectedCharacter.race}</p>
                    <p>{it.charactersPublic.level}: {selectedCharacter.level}</p>
                  </div>

                  <h4 className="text-xl font-semibold text-amber-200 mb-3">
                    {it.charactersPublic.backstory}
                  </h4>
                  <p className="text-slate-300 leading-7 whitespace-pre-line">
                    {selectedCharacter.backstory}
                  </p>

                  <button
                    onClick={() => setSelectedCharacter(null)}
                    className="mt-8 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition"
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
