import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState(false);
  const [activeTab, setActiveTab] = useState<'scheda' | 'storia' | 'segreti'>('scheda');

  useEffect(() => {
    if (!user) return;
    const linkOwner = async () => {
      await supabase.rpc('link_character_owner');
      setLinked(true);
    };
    void linkOwner();
  }, [user]);

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-slate-300 text-xl text-center">Nessun personaggio associato a questo account.</p>
        <p className="text-slate-500 text-sm">
          Chiedi al DM di assegnare il tuo PG all&apos;email:{' '}
          <span className="text-amber-400">{user?.email}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="fixed inset-0 bg-slate-950/85 -z-10" />

      <div className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Hero header */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-700/20 bg-slate-900/80 backdrop-blur-sm">
            {character.portrait_url && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
                style={{ backgroundImage: `url(${character.portrait_url})` }}
              />
            )}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-amber-600/50 flex-shrink-0 shadow-2xl">
                {character.portrait_url ? (
                  <img src={character.portrait_url} alt={character.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 text-4xl">🧙</div>
                )}
              </div>
              <div className="text-center md:text-left">
                <p className="text-amber-500 uppercase tracking-widest text-xs mb-1">Il tuo personaggio</p>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-2">{character.name}</h1>
                <p className="text-slate-300 text-lg">
                  {character.class} &bull; {character.race} &bull; Livello {character.level}
                </p>
                {character.sigillo && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 rounded-xl px-4 py-2">
                    <span className="text-amber-400 text-lg">🔮</span>
                    <span className="text-amber-300 font-medium italic">{character.sigillo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700/50">
            {(['scheda', 'storia', 'segreti'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition capitalize ${
                  activeTab === tab
                    ? 'bg-slate-800 text-amber-300 border border-b-0 border-amber-700/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'scheda' && '📜 Scheda'}
                {tab === 'storia' && '📖 Storia'}
                {tab === 'segreti' && '🔒 Segreti'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-amber-700/20 rounded-2xl p-8">
            {activeTab === 'scheda' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-amber-300 mb-4">Informazioni</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-amber-700/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Classe</p>
                    <p className="text-amber-200 font-bold text-lg">{character.class}</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-amber-700/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Razza</p>
                    <p className="text-amber-200 font-bold text-lg">{character.race}</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-4 text-center border border-amber-700/20">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Livello</p>
                    <p className="text-amber-200 font-bold text-lg">{character.level}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'storia' && (
              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">Storia pubblica</h2>
                <p className="text-slate-300 leading-8 whitespace-pre-line text-lg">{character.backstory}</p>
              </div>
            )}
            {activeTab === 'segreti' && (
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">🔒 Note segrete</h2>
                <p className="text-slate-500 text-sm mb-6">Queste informazioni sono visibili solo a te.</p>
                {character.private_notes ? (
                  <p className="text-slate-300 leading-8 whitespace-pre-line text-lg">{character.private_notes}</p>
                ) : (
                  <p className="text-slate-500 italic">Nessuna nota segreta ancora assegnata dal DM.</p>
                )}
              </div>
            )}
          </div>

          {/* Link rapidi */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/#characters')}
              className="bg-slate-800/80 hover:bg-slate-700 border border-amber-700/20 rounded-2xl p-5 text-left transition group"
            >
              <p className="text-2xl mb-2">⚔️</p>
              <p className="text-amber-300 font-semibold text-lg group-hover:text-amber-200">Il gruppo</p>
              <p className="text-slate-400 text-sm">Vedi i tuoi compagni di avventura</p>
            </button>
            <button
              onClick={() => navigate('/missioni')}
              className="bg-slate-800/80 hover:bg-slate-700 border border-amber-700/20 rounded-2xl p-5 text-left transition group"
            >
              <p className="text-2xl mb-2">⚔️</p>
              <p className="text-amber-300 font-semibold text-lg group-hover:text-amber-200">Missioni</p>
              <p className="text-slate-400 text-sm">Consulta le missioni attive</p>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
