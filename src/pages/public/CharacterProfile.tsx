import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { ArrowLeft, Shield, Sword, Star, User } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  class: string | null;
  race: string | null;
  level: number | null;
  background: string | null;
  description: string | null;
  backstory: string | null;
  avatar_url: string | null;
  is_active: boolean;
  slug: string;
  player_name: string | null;
  stats: Record<string, number> | null;
  traits: string[] | null;
}

const STAT_LABELS: Record<string, string> = {
  forza: 'FOR', destrezza: 'DES', costituzione: 'COS',
  intelligenza: 'INT', saggezza: 'SAG', carisma: 'CAR',
  strength: 'FOR', dexterity: 'DES', constitution: 'COS',
  intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR',
};

const modifier = (v: number) => {
  const m = Math.floor((v - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
};

export const CharacterProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [char, setChar] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!data) { setNotFound(true); }
      else { setChar(data as Character); }
      setLoading(false);
    };
    if (slug) void load();
  }, [slug]);

  if (loading) return (
    <><Navigation />
    <div className="min-h-screen bg-slate-950 pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div></>
  );

  if (notFound || !char) return (
    <><Navigation />
    <div className="min-h-screen bg-slate-950 pt-24 flex flex-col items-center justify-center">
      <User className="w-16 h-16 text-slate-700 mb-4" />
      <p className="text-slate-400 text-lg">Personaggio non trovato.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-amber-400 hover:text-amber-300 flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Torna indietro</button>
    </div></>
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-950 pt-20 pb-16">

        {/* Hero banner */}
        <div className="relative h-56 md:h-72 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 overflow-hidden">
          {char.avatar_url && (
            <img src={char.avatar_url} alt={char.name}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {char.avatar_url ? (
              <img src={char.avatar_url} alt={char.name}
                className="w-24 h-24 rounded-full border-4 border-amber-500 object-cover shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-slate-800 flex items-center justify-center shadow-2xl">
                <User className="w-10 h-10 text-slate-600" />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4">

          {/* Nome e info base */}
          <div className="text-center mt-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{char.name}</h1>
            <p className="text-amber-400 font-semibold mt-1">
              {[char.race, char.class, char.level ? `Liv. ${char.level}` : null].filter(Boolean).join(' • ')}
            </p>
            {char.player_name && (
              <p className="text-slate-500 text-sm mt-1">Giocato da <span className="text-slate-300">{char.player_name}</span></p>
            )}
            {char.background && (
              <span className="mt-2 inline-block text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1 rounded-full">
                {char.background}
              </span>
            )}
          </div>

          {/* Stats */}
          {char.stats && Object.keys(char.stats).length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-400" /> Statistiche</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Object.entries(char.stats).map(([key, val]) => (
                  <div key={key} className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{STAT_LABELS[key] ?? key}</p>
                    <p className="text-2xl font-bold text-white">{val}</p>
                    <p className="text-xs text-amber-400 font-mono">{modifier(val)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Descrizione */}
          {char.description && (
            <section className="mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Descrizione</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{char.description}</p>
            </section>
          )}

          {/* Backstory */}
          {char.backstory && (
            <section className="mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Sword className="w-4 h-4 text-amber-400" /> Background</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{char.backstory}</p>
            </section>
          )}

          {/* Tratti */}
          {char.traits && char.traits.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">Tratti</h2>
              <div className="flex flex-wrap gap-2">
                {char.traits.map((t, i) => (
                  <span key={i} className="bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            </section>
          )}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Torna indietro
          </button>

        </div>
      </div>
      <Footer />
    </>
  );
};
