import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url: string | null;
  portrait_position: string | null;
  is_player_character: boolean;
  is_revealed: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const PortraitImg: React.FC<{ src: string; alt: string; position?: string | null }> = ({
  src,
  alt,
  position,
}) => (
  <img
    src={src}
    alt={alt}
    className="w-full h-full object-cover"
    style={{ objectPosition: position ?? 'center' }}
  />
);

// ─────────────────────────────────────────────────────────────────
const NpcNotes: React.FC<{ characterId: string }> = ({ characterId }) => {
  const { user } = useAuth();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('character_notes')
        .select('note')
        .eq('user_id', user.id)
        .eq('character_id', characterId)
        .maybeSingle();
      setNote(data?.note ?? '');
      initialLoadDone.current = true;
    };
    void load();
  }, [user, characterId]);

  useEffect(() => {
    if (!user || !initialLoadDone.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus('saving');
    debounceRef.current = setTimeout(async () => {
      const { error } = await supabase.from('character_notes').upsert(
        { user_id: user.id, character_id: characterId, note, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,character_id' }
      );
      setStatus(error ? 'error' : 'saved');
      setTimeout(() => setStatus('idle'), 2000);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [note, user, characterId]);

  if (!user) return null;

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-amber-400">📝 Le mie note</h4>
        <span
          className={`text-xs transition ${
            status === 'saving'
              ? 'text-slate-400 animate-pulse'
              : status === 'saved'
              ? 'text-emerald-400'
              : status === 'error'
              ? 'text-red-400'
              : 'text-transparent'
          }`}
        >
          {status === 'saving' && 'Salvataggio...'}
          {status === 'saved' && 'Salvato ✓'}
          {status === 'error' && 'Errore nel salvataggio'}
          {status === 'idle' && '·'}
        </span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Scrivi qui le tue impressioni su questo personaggio... Solo tu puoi vederle."
        className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-600/50 resize-none leading-6 transition"
      />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
export const CharactersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('characters')
        .select(
          'id, name, class, race, level, backstory, portrait_url, portrait_position, is_player_character, is_revealed'
        )
        .or('is_player_character.eq.true,is_revealed.eq.true')
        .order('is_player_character', { ascending: false })
        .order('level', { ascending: false })
        .order('name', { ascending: true });
      setCharacters(data ?? []);
      setLoading(false);
    };
    void fetchCharacters();
  }, [user]);

  const handleCardClick = (character: Character) => {
    if (character.is_player_character && user) {
      navigate('/personaggio');
      return;
    }
    setSelectedCharacter(character);
  };

  const pgs = characters.filter((c) => c.is_player_character);
  const npcs = characters.filter((c) => !c.is_player_character);

  return (
    <section id="characters" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/backgrounds/02BW022-full.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">
            {it.charactersPublic.title}
          </h2>
          <p className="text-slate-300 text-lg">{it.charactersPublic.subtitle}</p>
          {user && (
            <button
              onClick={() => navigate('/personaggio')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition"
            >
              🧙 Il mio personaggio
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg">{it.charactersPublic.loading}</p>
        ) : characters.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">{it.charactersPublic.empty}</p>
        ) : (
          <div className="space-y-14">
            {pgs.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-amber-400 mb-6 border-b border-amber-700/30 pb-2">
                  ⚔️ Personaggi Giocanti
                </h3>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pgs.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => handleCardClick(character)}
                      className="text-left rounded-2xl overflow-hidden border border-amber-600/30 bg-slate-900/80 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl transition"
                    >
                      <div className="h-72 bg-slate-800 overflow-hidden">
                        {character.portrait_url ? (
                          <PortraitImg
                            src={character.portrait_url}
                            alt={character.name}
                            position={character.portrait_position}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            {it.charactersPublic.noPortrait}
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-2xl font-bold text-amber-300">{character.name}</h3>
                        <p className="text-slate-200">{it.charactersPublic.class}: {character.class}</p>
                        <p className="text-slate-200">{it.charactersPublic.race}: {character.race}</p>
                        <p className="text-slate-200">{it.charactersPublic.level}: {character.level}</p>
                        <span className="inline-block text-xs text-amber-500 border border-amber-700/40 rounded px-2 py-0.5 mt-1">
                          Personaggio Giocante
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {npcs.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-300 mb-6 border-b border-slate-700/50 pb-2">
                  👥 Personaggi Incontrati
                </h3>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {npcs.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => handleCardClick(character)}
                      className="text-left rounded-2xl overflow-hidden border border-amber-700/20 bg-slate-900/80 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl transition"
                    >
                      <div className="h-72 bg-slate-800 overflow-hidden">
                        {character.portrait_url ? (
                          <PortraitImg
                            src={character.portrait_url}
                            alt={character.name}
                            position={character.portrait_position}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            {it.charactersPublic.noPortrait}
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-2xl font-bold text-amber-300">{character.name}</h3>
                        <p className="text-slate-200">{it.charactersPublic.class}: {character.class}</p>
                        <p className="text-slate-200">{it.charactersPublic.race}: {character.race}</p>
                        {user && (
                          <span className="inline-block text-xs text-slate-500 border border-slate-700/40 rounded px-2 py-0.5 mt-1">
                            📝 Note personali
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modale NPC */}
        {selectedCharacter && !selectedCharacter.is_player_character && (
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
                    <PortraitImg
                      src={selectedCharacter.portrait_url}
                      alt={selectedCharacter.name}
                      position={selectedCharacter.portrait_position}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      {it.charactersPublic.noPortrait}
                    </div>
                  )}
                </div>
                <div className="p-8 overflow-y-auto max-h-[80vh]">
                  <h3 className="text-3xl font-bold text-amber-300 mb-4">{selectedCharacter.name}</h3>
                  <div className="space-y-2 text-slate-200 mb-4">
                    <p>{it.charactersPublic.class}: {selectedCharacter.class}</p>
                    <p>{it.charactersPublic.race}: {selectedCharacter.race}</p>
                  </div>
                  {selectedCharacter.backstory && (
                    <>
                      <h4 className="text-base font-semibold text-amber-200 mb-2">
                        {it.charactersPublic.backstory}
                      </h4>
                      <p className="text-slate-300 leading-7 whitespace-pre-line text-sm">
                        {selectedCharacter.backstory}
                      </p>
                    </>
                  )}
                  <NpcNotes characterId={selectedCharacter.id} />
                  {!user && (
                    <p className="mt-6 text-slate-500 text-xs italic border-t border-slate-700/40 pt-4">
                      🔒 Accedi per aggiungere note personali su questo personaggio.
                    </p>
                  )}
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    className="mt-6 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition text-sm"
                  >
                    {it.charactersPublic.close}
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
