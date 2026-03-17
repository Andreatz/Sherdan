import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, LogOut, Settings, Scroll, MapPin, Skull, ChevronDown, BookOpen, Map, Home, Image, Users, Shield, BookMarked, Book, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { DiceRoller } from './DiceRoller';
import { GlobalSearch } from './GlobalSearch';

const EXPLORE_LINKS = [
  { label: 'Campagna',   href: '/#campaign',  icon: BookOpen },
  { label: 'Personaggi', href: '/personaggi', icon: Scroll   },
  { label: 'Sessioni',   href: '/sessioni',   icon: BookOpen },
  { label: 'Galleria',   href: '/galleria',   icon: Image    },
];
const WORLD_LINKS = [
  { label: 'Mappa Interattiva', href: '/mappa-mondo', icon: Map        },
  { label: 'Luoghi',            href: '/luoghi',      icon: MapPin     },
  { label: 'Lore',              href: '/lore',        icon: BookMarked },
  { label: 'Cronistoria',       href: '/cronistoria', icon: BookOpen   },
  { label: 'NPC',               href: '/npc',         icon: Users      },
  { label: 'Bestiario',         href: '/bestiario',   icon: Skull      },
  { label: 'Fazioni',           href: '/fazioni',     icon: Shield     },
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
      if (window.location.pathname !== '/') {
        navigate('/', { state: { scrollTo: href.slice(2) } });
      } else {
        document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(href);
    }
  };
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className={`flex items-center gap-1 text-sm font-medium transition ${ open ? 'text-amber-300' : 'text-slate-200 hover:text-amber-300' }`}>
        {label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
          {links.map(l => { const Icon = l.icon; return (
            <button key={l.href} onClick={() => handleNav(l.href)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition text-left">
              <Icon className="w-4 h-4" /> {l.label}
            </button>
          );})}
        </div>
      )}
    </div>
  );
};

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const { user, isAdmin, signOut, viewAsUser, toggleViewMode } = useAuth();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(path);
  };

  const handleSignOut = async () => { try { await signOut(); navigate('/'); } catch (e) { console.error(e); } };
  const close = () => setIsOpen(false);

  // Mostra contenuti player se: utente non admin, oppure admin in modalità vista utente
  const showPlayerLinks = user && (!isAdmin || viewAsUser);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/'); }} className="flex items-center hover:opacity-80 transition" aria-label="Home">
            <img src="/logo.png" alt="Sherdan" className="h-8 w-auto" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
            <span className="font-pirata text-xl text-amber-400 ml-2">Sherdan</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/'); }} className="flex items-center gap-1 text-sm text-slate-200 hover:text-amber-300 transition"><Home className="w-4 h-4" /> Home</button>
            <Dropdown label="Campagna" links={EXPLORE_LINKS} />
            <Dropdown label="Mondo" links={WORLD_LINKS} />
            {showPlayerLinks && (
              <>
                <button onClick={() => goTo('/dashboard')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
                <button onClick={() => goTo('/personaggio')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><Scroll className="w-4 h-4" /> Il mio PG</button>
                <button onClick={() => goTo('/missioni')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><BookOpen className="w-4 h-4" /> Missioni</button>
                <button onClick={() => goTo('/note')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><BookOpen className="w-4 h-4" /> Note</button>
                <button onClick={() => goTo('/diario')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><Book className="w-4 h-4" /> Diario</button>
              </>
            )}
            {isAdmin && !viewAsUser && (
              <button onClick={() => goTo('/diario')} className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition"><Book className="w-4 h-4" /> Diario</button>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <GlobalSearch />
            <button onClick={() => setShowDice(v => !v)} className={`text-lg px-3 py-1.5 rounded-lg transition ${ showDice ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-amber-300' }`}>🎲</button>
            {!user && (<button onClick={() => navigate('/auth/login')} className="bg-slate-700 hover:bg-slate-600 text-amber-100 px-3 py-1.5 rounded-lg text-sm transition">{it.nav.login}</button>)}
            {isAdmin && (
              <button
                onClick={toggleViewMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition border ${
                  viewAsUser
                    ? 'border-green-500 bg-green-900/30 text-green-400 hover:bg-green-900/50'
                    : 'border-amber-700/40 bg-slate-800 text-amber-400 hover:bg-slate-700'
                }`}
                title={viewAsUser ? 'Stai vedendo come utente — clicca per tornare alla vista admin' : 'Clicca per vedere come utente'}
              >
                {viewAsUser ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                {viewAsUser ? 'Vista Utente' : 'Vista Admin'}
              </button>
            )}
            {isAdmin && !viewAsUser && (<button onClick={() => goTo('/admin')} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm transition"><Settings className="w-4 h-4" /> Admin</button>)}
            {user && (<button onClick={handleSignOut} className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"><LogOut className="w-4 h-4" /></button>)}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <GlobalSearch />
            <button onClick={() => setShowDice(v => !v)} className={`text-lg px-2 py-1.5 rounded transition ${ showDice ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-300' }`}>🎲</button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-amber-200 hover:bg-slate-800 rounded transition">{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-slate-950/98 pt-14 overflow-y-auto">
          <div className="px-4 py-6 space-y-2">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate('/'); close(); }} className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-amber-300 rounded text-sm"><Home className="w-4 h-4" /> Home</button>
            <p className="text-xs text-slate-500 uppercase tracking-widest px-4 mb-2">Campagna</p>
            {EXPLORE_LINKS.map(l => {
              const isAnchor = l.href.startsWith('/#');
              return (
                <button
                  key={l.href}
                  onClick={() => {
                    close();
                    if (isAnchor) {
                      if (window.location.pathname !== '/') { navigate('/', { state: { scrollTo: l.href.slice(2) } }); }
                      else { document.getElementById(l.href.slice(2))?.scrollIntoView({ behavior: 'smooth' }); }
                    } else {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      navigate(l.href);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-amber-300 rounded text-sm"
                >{l.label}</button>
              );
            })}
            <p className="text-xs text-slate-500 uppercase tracking-widest px-4 mt-4 mb-2">Mondo</p>
            {WORLD_LINKS.map(l => (
              <button key={l.href} onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); navigate(l.href); close(); }} className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-amber-300 rounded text-sm">{l.label}</button>
            ))}
            {showPlayerLinks && (
              <>
                <p className="text-xs text-slate-500 uppercase tracking-widest px-4 mt-4 mb-2">Il mio personaggio</p>
                <button onClick={() => { goTo('/dashboard'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">Dashboard</button>
                <button onClick={() => { goTo('/personaggio'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">Il mio PG</button>
                <button onClick={() => { goTo('/missioni'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">Missioni</button>
                <button onClick={() => { goTo('/note'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">Note</button>
                <button onClick={() => { goTo('/diario'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm">Diario</button>
              </>
            )}
            {isAdmin && (
              <>
                <p className="text-xs text-slate-500 uppercase tracking-widest px-4 mt-4 mb-2">Admin</p>
                <button
                  onClick={() => { toggleViewMode(); close(); }}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 rounded text-sm ${
                    viewAsUser ? 'text-green-400 hover:bg-green-900/20' : 'text-amber-400 hover:bg-slate-800'
                  }`}
                >
                  {viewAsUser ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {viewAsUser ? 'Vista Utente (attiva)' : 'Passa a Vista Utente'}
                </button>
                {!viewAsUser && (
                  <button onClick={() => { goTo('/diario'); close(); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-slate-800 rounded text-sm"><Book className="w-4 h-4" /> Diario</button>
                )}
              </>
            )}
            {!user && (<button onClick={() => { navigate('/auth/login'); close(); }} className="bg-slate-700 text-amber-100 px-4 py-2 rounded-lg text-sm">{it.nav.login}</button>)}
            {isAdmin && !viewAsUser && (<button onClick={() => { goTo('/admin'); close(); }} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Admin</button>)}
            {user && (<button onClick={() => { void handleSignOut(); close(); }} className="bg-red-700/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><LogOut className="w-4 h-4" /> Esci</button>)}
          </div>
        </div>
      )}
      {showDice && <DiceRoller onClose={() => setShowDice(false)} />}
    </>
  );
};
