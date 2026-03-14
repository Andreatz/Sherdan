import React, { useState } from 'react';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-b border-amber-700/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚓</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-amber-600">Pirate Campaign</span>
          </div>

          <div className="hidden md:flex gap-8">
            <a href="#campaign" className="text-amber-100 hover:text-amber-300 transition">Campaign</a>
            <a href="#characters" className="text-amber-100 hover:text-amber-300 transition">Characters</a>
            <a href="#sessions" className="text-amber-100 hover:text-amber-300 transition">Sessions</a>
            <a href="#map" className="text-amber-100 hover:text-amber-300 transition">Map</a>
            <a href="#gallery" className="text-amber-100 hover:text-amber-300 transition">Gallery</a>
          </div>

          <div className="flex items-center gap-4">
            {!user && (
              <button
                onClick={() => navigate('/auth/login')}
                className="hidden sm:flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-amber-100 px-3 py-2 rounded transition"
              >
                Login
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded transition"
              >
                <Settings size={16} />
                <span className="text-sm">Admin</span>
              </button>
            )}

            {user && (
              <button
                onClick={handleSignOut}
                className="hidden sm:flex items-center gap-2 text-amber-100 hover:text-amber-300 transition"
              >
                <LogOut size={16} />
                <span className="text-sm">Sign Out</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-slate-700 rounded transition"
            >
              {isOpen ? <X size={24} className="text-amber-400" /> : <Menu size={24} className="text-amber-400" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-amber-700/30">
            <div className="space-y-2 py-2">
              <a href="#campaign" className="block px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition">Campaign</a>
              <a href="#characters" className="block px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition">Characters</a>
              <a href="#sessions" className="block px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition">Sessions</a>
              <a href="#map" className="block px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition">Map</a>
              <a href="#gallery" className="block px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition">Gallery</a>

              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth/login');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition"
                >
                  Login
                </button>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => { navigate('/admin'); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition"
                >
                  Admin Dashboard
                </button>
              )}

              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-amber-100 hover:bg-slate-700 rounded transition"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
