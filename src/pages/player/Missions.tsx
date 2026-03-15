import React, { useEffect, useState } from 'react';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { supabase } from '../../utils/supabase';

interface Mission {
  id: string;
  title: string;
  description: string | null;
  status: 'disponibile' | 'in corso' | 'completata';
  npc_name: string | null;
}

const STATUS_STYLE: Record<Mission['status'], { label: string; classes: string }> = {
  disponibile: { label: 'Disponibile', classes: 'bg-emerald-700/30 text-emerald-300 border border-emerald-600/40' },
  'in corso':  { label: 'In corso',    classes: 'bg-amber-700/30 text-amber-300 border border-amber-600/40' },
  completata:  { label: 'Completata',  classes: 'bg-slate-700/50 text-slate-400 border border-slate-600/40' },
};

const STATUS_ORDER: Mission['status'][] = ['disponibile', 'in corso', 'completata'];

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Mission['status'] | 'tutte'>('tutte');

  useEffect(() => {
    const fetchMissions = async () => {
      const { data } = await supabase
        .from('missions')
        .select('id, title, description, status, npcs(name)')
        .order('created_at', { ascending: false });

      if (data) {
        setMissions(
          data.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            status: m.status,
            npc_name: m.npcs?.name ?? null,
          }))
        );
      }
      setLoading(false);
    };
    void fetchMissions();
  }, []);

  const filtered = filter === 'tutte' ? missions : missions.filter((m) => m.status === filter);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-900 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-2">Missioni</h1>
            <div className="h-0.5 w-16 bg-amber-600/60 rounded" />
          </div>

          {/* Filtri */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(['tutte', ...STATUS_ORDER] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition capitalize ${
                  filter === s
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                }`}
              >
                {s === 'tutte' ? 'Tutte' : STATUS_STYLE[s].label}
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <p className="text-slate-300 text-lg">Caricamento missioni...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400 text-center py-16">Nessuna missione trovata.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((mission) => (
                <div
                  key={mission.id}
                  className={`bg-slate-800/70 border border-amber-700/20 rounded-xl p-6 ${
                    mission.status === 'completata' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <h2 className="text-xl font-bold text-amber-200">{mission.title}</h2>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[mission.status].classes}`}>
                      {STATUS_STYLE[mission.status].label}
                    </span>
                  </div>

                  {mission.npc_name && (
                    <p className="text-amber-500/80 text-sm mb-3 italic">Commissionata da: {mission.npc_name}</p>
                  )}

                  {mission.description && (
                    <p className="text-slate-300 leading-7 whitespace-pre-line">{mission.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
