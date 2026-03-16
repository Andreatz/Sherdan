import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ZoomableImage } from '../../components/shared/ImageLightbox';

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
  zone: string | null;
}

const PortraitImg: React.FC<{ src: string; alt: string; position?: string | null }> = ({ src, alt, position }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: position ?? 'center' }} />
);

export const CharactersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('characters')
        .select('id, name, class, race, level, backstory, portrait_url, portrait_position, is_player_character, is_revealed, zone')
        .eq('is_player_character', true)   // ← solo PG
        .order('level', { ascending: false })
        .order('name',  { ascending: true  });
      setCharacters(data ?? []);
      setLoading(false);
    };
    void fetchCharacters();
  }, [user]);

  return (
    <section id="characters" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">{it.charactersPublic.title}</h2>
          <p className="text-slate-300 text-lg">{it.charactersPublic.subtitle}</p>
          {user && (
            <button onClick={() => navigate('/personaggio')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition">
              🧙 Il mio personaggio
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg">{it.charactersPublic.loading}</p>
        ) : characters.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">{it.charactersPublic.empty}</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {characters.map((character) => (
              <button key={character.id}
                onClick={() => user && navigate('/personaggio')}
                className="text-left rounded-2xl overflow-hidden border border-amber-600/30 bg-slate-900/80 backdrop-blur-sm hover:-translate-y-1 hover:shadow-2xl transition cursor-default">
                <div className="h-72 bg-slate-800 overflow-hidden">
                  {character.portrait_url
                    ? <PortraitImg src={character.portrait_url} alt={character.name} position={character.portrait_position} />
                    : <div className="w-full h-full flex items-center justify-center text-slate-400">{it.charactersPublic.noPortrait}</div>}
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-2xl font-bold text-amber-300">{character.name}</h3>
                  <p className="text-slate-200">{it.charactersPublic.class}: {character.class}</p>
                  <p className="text-slate-200">{it.charactersPublic.race}: {character.race}</p>
                  <p className="text-slate-200">{it.charactersPublic.level}: {character.level}</p>
                  <span className="inline-block text-xs text-amber-500 border border-amber-700/40 rounded px-2 py-0.5 mt-1">⚔️ Personaggio Giocante</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Link agli NPC */}
        <div className="text-center mt-12">
          <button onClick={() => navigate('/npc')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-amber-600 text-slate-300 hover:text-amber-300 rounded-xl transition">
            👥 Vedi i personaggi incontrati →
          </button>
        </div>
      </div>
    </section>
  );
};
