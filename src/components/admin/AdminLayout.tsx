import React, { useState } from 'react';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { it } from '../../content/texts';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage = 'dashboard',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard',  label: it.admin.dashboard,   path: '/admin' },
    { id: 'characters', label: it.admin.characters,   path: '/admin/characters' },
    { id: 'sessions',   label: it.admin.sessions,     path: '/admin/sessions' },
    { id: 'missions',   label: 'Missioni',            path: '/admin/missions' },
    { id: 'locations',  label: it.admin.locations,    path: '/admin/locations' },
    { id: 'gallery',    label: it.admin.gallery,      path: '/admin/gallery' },
    { id: 'settings',   label: it.admin.settings,     path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } hidden md:flex flex-col bg-slate-900 border-r border-amber-700/20 transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-amber-700/20">
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-amber-300">{it.admin.panel}</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-amber-400 hover:text-amber-300 transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 text-left px-4 py-3 rounded transition text-amber-100 hover:bg-slate-800"
          >
            <Home size={18} />
            {sidebarOpen ? it.admin.backToSite : '←'}
          </button>

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded transition ${
                currentPage === item.id
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-100 hover:bg-slate-800'
              }`}
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </button>
          ))}
        </div>

        <div className="mt-auto p-4 border-t border-amber-700/20">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            {sidebarOpen ? it.admin.logout : '↩'}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-4 border-b border-amber-700/20 bg-slate-900">
          <h1 className="text-lg font-bold text-amber-300">{it.admin.panel}</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-amber-300">
            <Menu size={22} />
          </button>
        </header>

        {sidebarOpen && (
          <div className="md:hidden bg-slate-900 border-b border-amber-700/20 px-4 py-4 space-y-2">
            <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 rounded text-amber-100 hover:bg-slate-800 transition">
              {it.admin.backToSite}
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded transition ${
                  currentPage === item.id ? 'bg-amber-600 text-white' : 'text-amber-100 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={handleSignOut} className="w-full text-left px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition">
              {it.admin.logout}
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
