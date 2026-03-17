import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { Scroll, Sword, BookOpen, Bell, Clock, Map, ChevronRight, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mission { id: string; title: string; status: string; description: string | null; }
interface Session { id: string; title: string; session_number: number; date: string | null; }
interface LoreEntry { id: string; title: string; category: string; }

const QuickCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  onClick?: () => void;
}> = ({ icon, label, value, sub, color = 'text-amber-400', onClick }) => (
  <button
    onClick={onClick}
    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 text-left hover:border-amber-600/50 hover:bg-slate-800 transition w-full"
  >
    <div className={`mb-2 ${color}`}>{icon}</div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm font-semibold text-slate-300 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </button>
);

export const PlayerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();
  const navigate = useNavigate();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lore, setLore]         = useState<LoreEntry[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, s, l] = await Promise.all([
      supabase.from('missions').select('id,title,status,description').eq('status', 'attiva').limit(3),
      supabase.from('sessions').select('id,title,session_number,date').order('date', { ascending: false }).limit(3),
      supabase.from('lore_entries').select('id,title,category').eq('is_public', true).order('created_at', { ascending: false }).limit(4),
    ]);
    setMissions((m.data as Mission[]) || []);
    setSessions((s.data as Session[]) || []);
    setLore((l.data as LoreEntry[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const recentNotifs = notifications.slice(0, 5);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-950 pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Hero saluto */}
          <div className="py-8 border-b border-slate-800 mb-8">
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-1">Benvenuto di nuovo</p>
            <h1 className="text-3xl font-bold text-white">
              🗡️ {user?.email?.split('@')[0] ?? 'Avventuriero'}
            </h1>
            <p className="text-slate-400 mt-1">Cosa succede nel mondo di Sherdan oggi?</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <QuickCard icon={<Sword className="w-6 h-6" />} label="Missioni attive" value={missions.length} onClick={() => navigate('/missioni')} />
            <QuickCard icon={<BookOpen className="w-6 h-6" />} label="Sessioni totali" value={sessions.length > 0 ? sessions[0]?.session_number ?? 0 : 0} sub="ultima sessione" onClick={() => navigate('/sessioni')} color="text-sky-400" />
            <QuickCard icon={<Bell className="w-6 h-6" />} label="Notifiche" value={unreadCount} sub={unreadCount > 0 ? 'non lette' : 'tutto letto'} color={unreadCount > 0 ? 'text-red-400' : 'text-green-400'} />
            <QuickCard icon={<Book className="w-6 h-6" />} label="Voci Lore" value={lore.length} sub="recenti" onClick={() => navigate('/lore')} color="text-purple-400" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Missioni attive */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2"><Sword className="w-4 h-4 text-amber-400" /> Missioni Attive</h2>
                <button onClick={() => navigate('/missioni')} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">Tutte <ChevronRight className="w-3 h-3" /></button>
              </div>
              {loading ? <p className="text-slate-600 text-sm">Caricamento...</p> :
                missions.length === 0 ? <p className="text-slate-600 text-sm italic">Nessuna missione attiva.</p> :
                <ul className="space-y-2">
                  {missions.map(m => (
                    <li key={m.id} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-slate-300 truncate">{m.title}</span>
                    </li>
                  ))}
                </ul>
              }
            </section>

            {/* Ultime sessioni */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-sky-400" /> Ultime Sessioni</h2>
                <button onClick={() => navigate('/sessioni')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">Tutte <ChevronRight className="w-3 h-3" /></button>
              </div>
              {loading ? <p className="text-slate-600 text-sm">Caricamento...</p> :
                sessions.length === 0 ? <p className="text-slate-600 text-sm italic">Nessuna sessione ancora.</p> :
                <ul className="space-y-2">
                  {sessions.map(s => (
                    <li key={s.id} className="flex items-center gap-2 text-sm">
                      <span className="text-xs font-mono text-slate-600 w-8 shrink-0">#{s.session_number}</span>
                      <span className="text-slate-300 truncate flex-1">{s.title}</span>
                      {s.date && <span className="text-xs text-slate-600 shrink-0">{new Date(s.date).toLocaleDateString('it-IT', { day:'2-digit', month:'short' })}</span>}
                    </li>
                  ))}
                </ul>
              }
            </section>

            {/* Lore recente */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2"><Scroll className="w-4 h-4 text-purple-400" /> Lore Recente</h2>
                <button onClick={() => navigate('/lore')} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">Tutto <ChevronRight className="w-3 h-3" /></button>
              </div>
              {loading ? <p className="text-slate-600 text-sm">Caricamento...</p> :
                lore.length === 0 ? <p className="text-slate-600 text-sm italic">Nessuna voce disponibile.</p> :
                <ul className="space-y-2">
                  {lore.map(l => (
                    <li key={l.id} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      <span className="text-slate-300 truncate flex-1">{l.title}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded capitalize shrink-0">{l.category}</span>
                    </li>
                  ))}
                </ul>
              }
            </section>

            {/* Notifiche recenti */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" /> Notifiche
                  {unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </h2>
              </div>
              {recentNotifs.length === 0 ? <p className="text-slate-600 text-sm italic">Nessuna notifica.</p> :
                <ul className="space-y-2">
                  {recentNotifs.map(n => (
                    <li key={n.id}>
                      <button
                        onClick={() => { void markRead(n.id); if (n.link) navigate(n.link); }}
                        className={`w-full text-left flex items-center gap-2 text-sm p-2 rounded-lg transition hover:bg-slate-800 ${
                          !n.read ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: n.read ? '#475569' : '#f59e0b' }} />
                        <span className="truncate">{n.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              }
            </section>

          </div>

          {/* Link rapidi */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Mappa Mondo',  icon: '🗺️', path: '/mappa-mondo' },
              { label: 'Il mio PG',   icon: '🧝', path: '/personaggio' },
              { label: 'Diario',      icon: '📔', path: '/diario'       },
              { label: 'Note',        icon: '📋', path: '/note'         },
            ].map(l => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-2 transition"
              >
                <span className="text-2xl">{l.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{l.label}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};
