import React, { useState } from 'react';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { it } from '../../content/texts';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  title?: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  title,
  subtitle,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const activePage = currentPage ?? location.pathname.split('/').pop() ?? 'dashboard';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  const menuItems = [
    { id: 'admin',      label: it.admin.dashboard,  path: '/admin' },
    { id: 'characters', label: it.admin.characters, path: '/admin/characters' },
    { id: 'sessions',   label: it.admin.sessions,   path: '/admin/sessions' },
    { id: 'missions',   label: 'Missioni',           path: '/admin/missions' },
    { id: 'locations',  label: it.admin.locations,  path: '/admin/locations' },
    { id: 'gallery',    label: it.admin.gallery,    path: '/admin/gallery' },
    { id: 'bestiary',   label: 'Bestiario',         path: '/admin/bestiary' },
    { id: 'npc',        label: 'NPC',               path: '/admin/npc' },
    { id: 'factions',   label: 'Fazioni',           path: '/admin/factions' },
    { id: 'timeline',   label: 'Cronistoria',       path: '/admin/timeline' },
    { id: 'lore',       label: 'Lore',              path: '/admin/lore' },
    { id: 'map',        label: 'Mappa (Pin)',        path: '/admin/map' },
    { id: 'diary',      label: 'Diario del DM',     path: '/admin/diary' },
    { id: 'settings',   label: it.admin.settings,   path: '/admin/settings' },
  ];

  const isActive = (item: typeof menuItems[0]) =>
    location.pathname === item.path ||
    (item.id !== 'admin' && location.pathname.startsWith(item.path));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-56' : 'w-14'
        } hidden md:flex flex-col bg-slate-900 border-r border-amber-700/20 transition-all duration-300`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-amber-700/20">
          {sidebarOpen && (
            <span className="font-bold text-amber-400 text-sm tracking-wide">{it.admin.panel}</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-amber-400 hover:text-amber-300 transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded transition text-amber-100 hover:bg-slate-800 text-sm"
          >
            <Home className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>{it.admin.backToSite}</span>}
          </button>

          <div className="border-t border-slate-700/50 my-2" />

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-3 py-2.5 rounded transition text-sm flex items-center gap-2 ${
                isActive(item)
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-100 hover:bg-slate-800'
              }`}
            >
              <span className="w-5 h-5 shrink-0 flex items-center justify-center font-bold text-xs opacity-70">
                {item.label.charAt(0)}
              </span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-2 py-3 border-t border-amber-700/20">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-400 hover:bg-red-900/20 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>{it.admin.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-amber-700/20">
          <span className="font-bold text-amber-400">{it.admin.panel}</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-amber-300">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="md:hidden bg-slate-900 border-b border-amber-700/20 px-4 pb-4">
            <button
              onClick={() => navigate('/')}
              className="w-full text-left px-4 py-2 rounded text-amber-100 hover:bg-slate-800 transition text-sm"
            >
              {it.admin.backToSite}
            </button>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded transition text-sm ${
                  isActive(item)
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-100 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { void handleSignOut(); setSidebarOpen(false); }}
              className="bg-red-700/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 mt-2"
            >
              <LogOut className="w-4 h-4" /> {it.admin.logout}
            </button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
              {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
