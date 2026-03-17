import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const CAT_COLORS: Record<string, string> = {
  sessione: 'bg-sky-500',
  missione: 'bg-amber-500',
  lore:     'bg-purple-500',
  generale: 'bg-slate-500',
};

const CAT_ICONS: Record<string, string> = {
  sessione: '📜',
  missione: '⚔️',
  lore:     '📖',
  generale: '🔔',
};

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (n: typeof notifications[0]) => {
    await markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const ago = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return 'Adesso';
    if (diff < 3600) return `${Math.floor(diff / 60)}m fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`;
    return new Date(date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition"
        aria-label="Notifiche"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="font-bold text-white text-sm">Notifiche</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Leggi tutte
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Nessuna notifica</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 transition hover:bg-slate-800/70 ${
                    !n.read ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <span className="text-lg shrink-0 mt-0.5">{CAT_ICONS[n.category] ?? '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-sm font-semibold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-600 shrink-0 mt-0.5">{ago(n.created_at)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className={`mt-1.5 inline-block text-[9px] font-bold uppercase tracking-wide text-white px-1.5 py-0.5 rounded ${CAT_COLORS[n.category] ?? 'bg-slate-600'}`}>
                      {n.category}
                    </span>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
