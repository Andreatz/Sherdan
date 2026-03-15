import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

interface SessionLog {
  id: string;
  session_number: number;
  title: string;
  date: string;
}

export const SessionsPreview: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('session_logs')
        .select('id, session_number, title, date')
        .order('session_number', { ascending: true });
      setSessions(data ?? []);
      setLoading(false);
    };
    void fetchSessions();
  }, []);

  return (
    <section id="sessions" className="relative py-24 px-6 overflow-hidden">
      {/* Background parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">Diario delle Sessioni</h2>
          <p className="text-slate-300 text-lg">Le cronache della campagna, sessione dopo sessione.</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 animate-pulse">Caricamento...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-slate-500 italic">Nessuna sessione ancora registrata.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/sessioni#session-${session.session_number}`)}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-950/70 backdrop-blur-sm border border-amber-700/20 rounded-xl hover:bg-slate-800/60 hover:border-amber-500/40 transition group"
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-amber-500 font-bold text-sm w-10 shrink-0">#{session.session_number}</span>
                  <span className="text-white font-semibold text-lg group-hover:text-amber-200 transition">{session.title}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-400 text-sm hidden sm:block">{session.date}</span>
                  <span className="text-amber-400 text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/sessioni')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-700/20 hover:bg-amber-700/40 border border-amber-600/30 text-amber-300 font-semibold rounded-xl transition"
          >
            📖 Leggi tutte le sessioni
          </button>
        </div>
      </div>
    </section>
  );
};
