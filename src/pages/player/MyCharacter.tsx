import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  backstory: string;
  portrait_url: string | null;
  private_notes: string | null;
  sigillo: string | null;
  stats_json: Record<string, unknown>;
}

export const MyCharacterPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState(false);

  // Step 1: call link_character_owner() to bind uid to owner_email if not yet done
  useEffect(() => {
    if (!user) return;
    const linkOwner = async () => {
      await supabase.rpc('link_character_owner');
      setLinked(true);
    };
    void linkOwner();
  }, [user]);

  // Step 2: after linking, fetch the character
  useEffect(() => {
    if (!user || !linked) return;
    const fetchCharacter = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, class, race, level, backstory, portrait_url, private_notes, sigillo, stats_json')
        .eq('is_player_character', true)
        .eq('owner_user_id', user.id)
        .maybeSingle();

      if (error) console.error('Errore caricamento personaggio:', error);
      setCharacter(data ?? null);
      setLoading(false);
    };
    void fetchCharacter();
  }, [user, linked]);

  // Not logged in
  if (!isLoading && !user) return <Navigate to="/auth/login" replace />;

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-amber-300 text-xl animate-pulse">Caricamento...</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-slate-300 text-xl text-center">
          Nessun personaggio associato a questo account.
        </p>
        <p className="text-slate-500 text-sm">
          Chiedi al DM di assegnare il tuo PG all&apos;email: <span className="text-amber-400">{user?.email}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-500 uppercase tracking-widest text-sm mb-2">Il tuo personaggio</p>
          <h1 className="text-5xl font-bold text-amber-300">{character.name}</h1>
          {character.sigillo && (
            <p className="text-slate-400 mt-3 text-lg italic">Sigillo: {character.sigillo}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Portrait */}
          <div className="rounded-2xl overflow-hidden border border-amber-700/30 bg-slate-900">
            {character.portrait_url ? (
              <img
                src={character.portrait_url}
                alt={character.name}
                className="w-full h-full object-cover max-h-[520px]"
              />
            ) : (
              <div className="w-full h-[320px] flex items-center justify-center text-slate-500">
                Nessun ritratto disponibile
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">

            {/* Stats base */}
            <div className="bg-slate-900 border border-amber-700/20 rounded-2xl p-6 space-y-3">
              <h2 className="text-amber-300 font-semibold text-lg mb-4">Scheda</h2>
              <p className="text-slate-200"><span className="text-slate-400">Classe: </span>{character.class}</p>
              <p className="text-slate-200"><span className="text-slate-400">Razza: </span>{character.race}</p>
              <p className="text-slate-200"><span className="text-slate-400">Livello: </span>{character.level}</p>
            </div>

            {/* Backstory */}
            <div className="bg-slate-900 border border-amber-700/20 rounded-2xl p-6">
              <h2 className="text-amber-300 font-semibold text-lg mb-3">Storia</h2>
              <p className="text-slate-300 leading-7 whitespace-pre-line">{character.backstory}</p>
            </div>

            {/* Note private: visibili solo al proprietario */}
            {character.private_notes && (
              <div className="bg-slate-800 border border-red-900/40 rounded-2xl p-6">
                <h2 className="text-red-400 font-semibold text-lg mb-3">🔒 Note segrete (solo per te)</h2>
                <p className="text-slate-300 leading-7 whitespace-pre-line">{character.private_notes}</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
