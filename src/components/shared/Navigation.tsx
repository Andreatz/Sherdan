import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, Settings, Scroll, Sword, MapPin, Skull, ChevronDown, BookOpen, Map, Home, Image, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { DiceRoller } from './DiceRoller';

const EXPLORE_LINKS = [
  { label: 'Campagna',    href: '/#campaign',   icon: BookOpen },
  { label: 'Personaggi', href: '/#characters',  icon: Scroll   },
  { label: 'Sessioni',   href: '/#sessions',    icon: BookOpen },
  { label: 'Galleria',   href: '/#gallery',     icon: Image    },
];

const WORLD_LINKS = [
  { label: 'Mappa',      href: '/#map',         icon: Map      },
  { label: 'Luoghi',     href: '/luoghi',       icon: MapPin   },
  { label: 'NPC',        href: '/npc',          icon: Users    },
  { label: 'Bestiario',  href: '/bestiario',    icon: Skull    },
];

const Dropdown: React.FC<{
  label: string;
  links: { label: string; href: string; icon: React.ElementType }[];
}> = ({ label, links }) => {
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

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith('/#')) {
      if (window.location.pathname !== '/') { navigate('/', { state: { scrollTo: href.slice(2) } }); }
      else { document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth' }); }
    } else { navigate(href); }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1 text-sm font-medium transition ${
          open ? 'text-amber-300' : 'text-slate-200 hover:text-amber-300'
        }`}>
        {label} <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-slate-900 border border-amber-700/30 rounded-xl shadow-xl overflow-hidden z-50">
          {links.map(l => {
            const Icon = l.icon;
            return (
              <button key={l.href} onClick={() => handleNav(l.href)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition text-left">
                <Icon size={14} className="text-amber-600" /> {l.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [showDice, setShowDice] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { await signOut(); navigate('/'); } catch (e) { console.error(e); }
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur border-b border-amber-700/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            <button onClick={() => navigate('/')} className="flex items-center hover:opacity-80 transition" aria-label="Home">
              <img src="/Logo Sherdan.png" alt="Logo Sherdan" className="h-24 w-auto object-contain" />
            </button>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-5">
              <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-slate-200 hover:text-amber-300 transition">
                <Home size={14} /> Home
              </button>
              <Dropdown label="Campagna" links={EXPLORE_LINKS} />
              <Dropdown label="Mondo"    links={WORLD_LINKS}   />
              {user && !isAdmin && (
                <>
                  <button onClick={() => navigate('/personaggio')}
                    className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition">
                    <Scroll size={14} /> Il mio PG
                  </button>
                  <button onClick={() => navigate('/missioni')}
                    className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition">
                    <Sword size={14} /> Missioni
                  </button>
                  <button onClick={() => navigate('/note')}
                    className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition">
                    <BookOpen size={14} /> Note
                  </button>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setShowDice(v => !v)}
                className={`text-lg px-3 py-1.5 rounded-lg transition ${
                  showDice ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}>🎲</button>
              {!user && (
                <button onClick={() => navigate('/auth/login')}
                  className="bg-slate-700 hover:bg-slate-600 text-amber-100 px-3 py-1.5 rounded-lg text-sm transition">
                  {it.nav.login}
                </button>
              )}
              {isAdmin && (
                <button onClick={() => navigate('/admin')}
                  className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm transition">
                  <Settings size={15} /> Admin
                </button>
              )}
              {user && (
                <button onClick={handleSignOut}
                  className="flex items-center gap-1.5 bg-red-700/80 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition">
                  <LogOut size={15} />
                </button>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => setShowDice(v => !v)}
                className={`text-lg px-2 py-1.5 rounded transition ${
                  showDice ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-300'
                }`}>🎲</button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-amber-200 hover:bg-slate-800 rounded transition">
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden pb-4 pt-3 space-y-1 border-t border-amber-700/20">
              <p className="px-4 pt-1 pb-0.5 text-xs text-slate-600 uppercase tracking-widest">Campagna</p>
              {EXPLORE_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={close}
                  className="flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition text-sm">
                  <l.icon size={14} className="text-amber-600" /> {l.label}
                </a>
              ))}
              <p className="px-4 pt-2 pb-0.5 text-xs text-slate-600 uppercase tracking-widest">Mondo</p>
              {WORLD_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={close}
                  className="flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition text-sm">
                  <l.icon size={14} className="text-amber-600" /> {l.label}
                </a>
              ))}
              {user && !isAdmin && (
                <>
                  <p className="px-4 pt-2 pb-0.5 text-xs text-slate-600 uppercase tracking-widest">Il mio personaggio</p>
                  <button onClick={() => { navigate('/personaggio'); close(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">
                    <Scroll size={14} /> Il mio PG
                  </button>
                  <button onClick={() => { navigate('/missioni'); close(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">
                    <Sword size={14} /> Missioni
                  </button>
                  <button onClick={() => { navigate('/note'); close(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">
                    <BookOpen size={14} /> Note
                  </button>
                </>
              )}
              <div className="pt-2 px-4 flex flex-col gap-2">
                {!user && (
                  <button onClick={() => { navigate('/auth/login'); close(); }}
                    className="bg-slate-700 text-amber-100 px-4 py-2 rounded-lg text-sm">{it.nav.login}</button>
                )}
                {isAdmin && (
                  <button onClick={() => { navigate('/admin'); close(); }}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <Settings size={14} /> Admin
                  </button>
                )}
                {user && (
                  <button onClick={() => { void handleSignOut(); close(); }}
                    className="bg-red-700/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <LogOut size={14} /> Esci
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {showDice && <DiceRoller onClose={() => setShowDice(false)} />}
    </>
  );
};
