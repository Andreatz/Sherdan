import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { it } from '../../content/texts';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: it.admin.dashboard, path: '/admin' },
    { id: 'characters', label: it.admin.characters, path: '/admin/characters' },
    { id: 'sessions', label: it.admin.sessions, path: '/admin/sessions' },
    { id: 'locations', label: it.admin.locations, path: '/admin/locations' },
    { id: 'gallery', label: it.admin.gallery, path: '/admin/gallery' },
    { id: 'settings', label: it.admin.settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-900">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-amber-700/30 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-amber-700/30 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-amber-400 font-bold">{it.admin.panel}</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-amber-400 hover:text-amber-300">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-3 rounded transition text-amber-100 hover:bg-slate-700"
          >
            {sidebarOpen ? it.admin.backToSite : '←'}
          </button>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded transition ${
                currentPage === item.id
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-100 hover:bg-slate-700'
              }`}
            >
              {sidebarOpen ? item.label : item.label.charAt(0)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-700/30">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900 hover:bg-red-800 text-red-100 rounded transition"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>{it.admin.logout}</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
