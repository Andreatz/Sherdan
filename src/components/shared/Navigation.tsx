import React, { useState } from 'react';
import { Menu, X, LogOut, Settings, Scroll, Sword, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { it } from '../../content/texts';
import { DiceRoller } from './DiceRoller';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur border-b border-amber-700/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition"
              aria-label="Torna alla home"
            >
              <img
                src="/Logo Sherdan.png"
                alt="Logo Sherdan"
                className="h-24 w-auto object-contain"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6 text-slate-200">
              <a href="/#campaign" className="hover:text-amber-300 transition">{it.nav.campaign}</a>
              <a href="/#characters" className="hover:text-amber-300 transition">{it.nav.characters}</a>
              <a href="/#sessions" className="hover:text-amber-300 transition">{it.nav.sessions}</a>
              <a href="/#map" className="hover:text-amber-300 transition">{it.nav.map}</a>
              <button
                onClick={() => navigate('/luoghi')}
                className="flex items-center gap-1 hover:text-amber-300 transition"
              >
                <MapPin size={14} />
                Luoghi
              </button>
              <a href="/#gallery" className="hover:text-amber-300 transition">{it.nav.gallery}</a>

              {user && !isAdmin && (
                <>
                  <button
                    onClick={() => navigate('/personaggio')}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
                  >
                    <Scroll size={15} />
                    {it.nav.myCharacter}
                  </button>
                  <button
                    onClick={() => navigate('/missioni')}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
                  >
                    <Sword size={15} />
                    Missioni
                  </button>
                </>
              )}
            </div>

            {/* Desktop auth + dado */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Bottone dado */}
              <button
                onClick={() => setShowDice(v => !v)}
                title="Tiro dadi"
                className={`text-xl px-3 py-2 rounded transition ${
                  showDice
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                }`}
              >
                🎲
              </button>

              {!user && (
                <button
                  onClick={() => navigate('/auth/login')}
                  className="bg-slate-700 hover:bg-slate-600 text-amber-100 px-3 py-2 rounded transition"
                >
                  {it.nav.login}
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded transition"
                >
                  <Settings size={18} />
                  {it.nav.admin}
                </button>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  {it.nav.logout}
                </button>
              )}
            </div>

            {/* Mobile: dado + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setShowDice(v => !v)}
                className={`text-xl px-2 py-1.5 rounded transition ${
                  showDice ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-300'
                }`}
              >
                🎲
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-amber-200 hover:bg-slate-800 rounded transition"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-amber-700/20 pt-4">
              <a href="/#campaign" onClick={closeMobileMenu} className="block px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition">{it.nav.campaign}</a>
              <a href="/#characters" onClick={closeMobileMenu} className="block px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition">{it.nav.characters}</a>
              <a href="/#sessions" onClick={closeMobileMenu} className="block px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition">{it.nav.sessions}</a>
              <a href="/#map" onClick={closeMobileMenu} className="block px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition">{it.nav.map}</a>
              <button
                onClick={() => { navigate('/luoghi'); closeMobileMenu(); }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition"
              >
                <MapPin size={14} />
                Luoghi
              </button>
              <a href="/#gallery" onClick={closeMobileMenu} className="block px-4 py-2 text-slate-200 hover:bg-slate-800 rounded transition">{it.nav.gallery}</a>

              {user && !isAdmin && (
                <>
                  <button
                    onClick={() => { navigate('/personaggio'); closeMobileMenu(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 font-semibold hover:bg-slate-800 rounded transition"
                  >
                    <Scroll size={15} />
                    {it.nav.myCharacter}
                  </button>
                  <button
                    onClick={() => { navigate('/missioni'); closeMobileMenu(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-amber-400 font-semibold hover:bg-slate-800 rounded transition"
                  >
                    <Sword size={15} />
                    Missioni
                  </button>
                </>
              )}

              {!user && (
                <button
                  onClick={() => { navigate('/auth/login'); closeMobileMenu(); }}
                  className="w-full text-left px-4 py-2 text-amber-100 hover:bg-slate-800 rounded transition"
                >
                  {it.nav.login}
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => { navigate('/admin'); closeMobileMenu(); }}
                  className="w-full text-left px-4 py-2 text-amber-100 hover:bg-slate-800 rounded transition"
                >
                  {it.nav.adminDashboard}
                </button>
              )}
              {user && (
                <button
                  onClick={async () => { await handleSignOut(); closeMobileMenu(); }}
                  className="w-full text-left px-4 py-2 text-red-300 hover:bg-slate-800 rounded transition"
                >
                  {it.nav.logout}
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Overlay dado virtuale */}
      {showDice && <DiceRoller onClose={() => setShowDice(false)} />}
    </>
  );
};
