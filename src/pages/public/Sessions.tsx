import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface SessionLog {
  id: string;
  session_number: number;
  title: string;
  date: string;
  summary: string;
  detailed_narrative: string;
  featured_image_url: string | null;
}

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [openSession, setOpenSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('session_logs')
        .select('id, session_number, title, date, summary, detailed_narrative, featured_image_url')
        .order('session_number', { ascending: true });
      setSessions(data ?? []);
      setLoading(false);
    };
    void fetchSessions();
  }, []);

  useEffect(() => {
    if (loading) return;
    const hash = location.hash;
    if (!hash) return;
    const sessionNumber = parseInt(hash.replace('#session-', ''), 10);
    if (!isNaN(sessionNumber)) {
      const target = sessions.find(s => s.session_number === sessionNumber);
      if (target) setOpenSession(target.id);
    }
    setTimeout(() => {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [loading, location.hash, sessions]);

  return (
    <section id="sessions" className="relative py-24 px-6 overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4">
            {it.sessionsPublic.title}
          </h2>
          <p className="text-slate-300 text-lg">{it.sessionsPublic.subtitle}</p>
        </div>

        {loading ? (
          <p className="text-center text-slate-300 text-lg animate-pulse">{it.sessionsPublic.loading}</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-slate-400 text-lg">{it.sessionsPublic.empty}</p>
        ) : (
          <div className="space-y-6">
            {sessions.map((session) => {
              const isOpen = openSession === session.id;
              return (
                <div
                  key={session.id}
                  id={`session-${session.session_number}`}
                  className="border border-amber-700/20 rounded-2xl bg-slate-950/80 backdrop-blur-sm overflow-hidden shadow-lg scroll-mt-24"
                >
                  <button
                    onClick={() => setOpenSession(isOpen ? null : session.id)}
                    className="w-full text-left p-6 hover:bg-slate-800/40 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-amber-300 font-semibold mb-1">
                          {it.sessionsPublic.session} {session.session_number}
                        </p>
                        <h3 className="text-2xl font-bold text-white">{session.title}</h3>
                      </div>
                      <p className="text-slate-400">{session.date}</p>
                    </div>
                  </button>

                  <div className="px-6 pb-6">
                    <p className="text-slate-300 leading-7 mb-4">
                      <span className="text-amber-200 font-semibold">{it.sessionsPublic.summary}:</span>{' '}
                      {session.summary}
                    </p>
                    {isOpen && (
                      <div className="border-t border-amber-700/20 pt-6">
                        {session.featured_image_url && (
                          <img src={session.featured_image_url} alt={session.title} className="w-full h-72 object-cover rounded-xl mb-6" />
                        )}
                        <h4 className="text-xl font-semibold text-amber-200 mb-3">{it.sessionsPublic.fullAccount}</h4>
                        <p className="text-slate-300 leading-8 whitespace-pre-line">{session.detailed_narrative}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
