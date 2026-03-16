import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen } from 'lucide-react';

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const observerRef = useRef<IntersectionObserver | null>(null);

  if (!isLoading && !user) return <Navigate to="/auth/login" replace />;

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

  // Scroll da hash URL
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

  // IntersectionObserver per evidenziare la sessione corrente nella sidebar
  useEffect(() => {
    if (loading || sessions.length === 0) return;
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Prendi quello con il top più vicino a 0
          const closest = visible.reduce((a, b) =>
            Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
          );
          setActiveId(closest.target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sessions.forEach(s => {
      const el = document.getElementById(`session-${s.session_number}`);
      if (el) observer.observe(el);
    });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [loading, sessions]);

  const scrollTo = (session: SessionLog) => {
    setSidebarOpen(false);
    const el = document.getElementById(`session-${session.session_number}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Apri l'accordion se chiuso
      setOpenSession(prev => prev === session.id ? prev : session.id);
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Sidebar content (riusato sia desktop che mobile)                 */
  /* ---------------------------------------------------------------- */
  const SidebarContent = () => (
    <div className="space-y-1">
      <p className="text-xs text-slate-500 uppercase tracking-widest px-2 mb-3">Indice</p>
      {sessions.map(s => {
        const isActive = activeId === `session-${s.session_number}`;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s)}
            className={`w-full text-left px-3 py-2 rounded-lg transition group ${
              isActive
                ? 'bg-amber-600/20 border border-amber-600/40 text-amber-300'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <span className={`text-xs font-mono block mb-0.5 ${ isActive ? 'text-amber-500' : 'text-slate-600 group-hover:text-slate-400' }`}>
              Sessione {s.session_number}
            </span>
            <span className="text-sm font-medium leading-tight line-clamp-2">{s.title}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section id="sessions" className="relative min-h-screen pt-14 overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
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
          <div className="flex gap-8 items-start">

            {/* ── Sessioni (main) ── */}
            <div className="flex-1 min-w-0 space-y-6">
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
                            <img
                              src={session.featured_image_url}
                              alt={session.title}
                              className="w-full h-72 object-cover rounded-xl mb-6"
                            />
                          )}
                          <h4 className="text-xl font-semibold text-amber-200 mb-3">
                            {it.sessionsPublic.fullAccount}
                          </h4>
                          <p className="text-slate-300 leading-8 whitespace-pre-line">
                            {session.detailed_narrative}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Sidebar desktop (lg+) ── */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-300">Sessioni</span>
                  <span className="ml-auto text-xs text-slate-600">{sessions.length}</span>
                </div>
                <SidebarContent />
              </div>
            </aside>

          </div>
        )}
      </div>

      {/* ── FAB sidebar mobile ── */}
      {!loading && sessions.length > 0 && (
        <>
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-full shadow-xl transition"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium">Indice</span>
          </button>

          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-950 border-t border-slate-800 rounded-t-2xl max-h-[70vh] overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-300">Indice sessioni</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-300 text-xl leading-none">&times;</button>
                </div>
                <SidebarContent />
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};
