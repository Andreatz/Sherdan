import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { ZoomableImage } from '../../components/shared/ImageLightbox';

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
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [linked, setLinked] = useState(false);
  const [activeTab, setActiveTab] = useState<'scheda' | 'storia' | 'segreti'>('scheda');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!user || isAdmin) { setLinked(true); return; }
    const linkOwner = async () => {
      await supabase.rpc('link_character_owner');
      setLinked(true);
    };
    void linkOwner();
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user || !linked) return;
    const fetchCharacters = async () => {
      setLoading(true);
      if (isAdmin) {
        const { data } = await supabase
          .from('characters')
          .select('id, name, class, race, level, backstory, portrait_url, private_notes, sigillo, stats_json')
          .eq('is_player_character', true)
          .order('name');
        const list = data ?? [];
        setAllCharacters(list);
        setCharacter(list[0] ?? null);
      } else {
        const { data } = await supabase
          .from('characters')
          .select('id, name, class, race, level, backstory, portrait_url, private_notes, sigillo, stats_json')
          .eq('is_player_character', true)
          .eq('owner_user_id', user.id)
          .maybeSingle();
        setCharacter(data ?? null);
      }
      setLoading(false);
    };
    void fetchCharacters();
  }, [user, linked, isAdmin]);

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
        {!isAdmin && (
          <p className="text-slate-500 text-sm">
            Chiedi al DM di assegnare il tuo PG all&apos;email:{' '}
            <span className="text-amber-400">{user?.email}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }} />
      <div className="fixed inset-0 bg-slate-950/85 -z-10" />

      <div className="relative py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Selettore admin */}
          {isAdmin && allCharacters.length > 1 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-slate-400 text-sm mr-2">Stai visualizzando:</span>
              {allCharacters.map((c) => (
                <button key={c.id}
                  onClick={() => { setCharacter(c); setActiveTab('scheda'); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    character.id === c.id ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                  }`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {/* Card hero verticale */}
          <div className="rounded-3xl overflow-hidden border border-amber-700/20 bg-slate-900/80 backdrop-blur-sm">

            {/* Ritratto proporzionale — niente crop */}
            {character.portrait_url ? (
              <ZoomableImage
                src={character.portrait_url}
                alt={character.name}
                className="w-full block"
                imgClassName="w-full h-auto block"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-slate-800 flex items-center justify-center text-slate-500 text-6xl">
                🧙
              </div>
            )}

            {/* Info sotto l'immagine */}
            <div className="p-8 text-center">
              <p className="text-amber-500 uppercase tracking-widest text-xs mb-1">
                {isAdmin ? 'Scheda Personaggio' : 'Il tuo personaggio'}
              </p>
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

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700/50">
            {(['scheda', 'storia', 'segreti'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition capitalize ${
                  activeTab === tab
                    ? 'bg-slate-800 text-amber-300 border border-b-0 border-amber-700/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}>
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
                {isAdmin && (
                  <p className="text-amber-500/70 text-xs mb-4 italic">
                    👁️ Vista Admin — stai leggendo le note private di {character.name}.
                  </p>
                )}
                <p className="text-slate-500 text-sm mb-6">
                  Queste informazioni sono visibili solo a te{isAdmin ? ' e al DM' : ''}.
                </p>
                {character.private_notes
                  ? <p className="text-slate-300 leading-8 whitespace-pre-line text-lg">{character.private_notes}</p>
                  : <p className="text-slate-500 italic">Nessuna nota segreta ancora assegnata dal DM.</p>}
              </div>
            )}
          </div>

          {!isAdmin && (
            <div className="grid sm:grid-cols-2 gap-4">
              <button onClick={() => navigate('/#characters')}
                className="bg-slate-800/80 hover:bg-slate-700 border border-amber-700/20 rounded-2xl p-5 text-left transition group">
                <p className="text-2xl mb-2">⚔️</p>
                <p className="text-amber-300 font-semibold text-lg group-hover:text-amber-200">Il gruppo</p>
                <p className="text-slate-400 text-sm">Vedi i tuoi compagni di avventura</p>
              </button>
              <button onClick={() => navigate('/missioni')}
                className="bg-slate-800/80 hover:bg-slate-700 border border-amber-700/20 rounded-2xl p-5 text-left transition group">
                <p className="text-2xl mb-2">📜</p>
                <p className="text-amber-300 font-semibold text-lg group-hover:text-amber-200">Missioni</p>
                <p className="text-slate-400 text-sm">Consulta le missioni attive</p>
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="text-center">
              <button onClick={() => navigate('/admin/characters')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700/20 hover:bg-amber-700/40 border border-amber-600/30 text-amber-300 font-semibold rounded-xl transition">
                ← Torna alla gestione personaggi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
