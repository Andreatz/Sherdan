import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Map, Image, Settings } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface Stats {
  characters: number;
  sessions: number;
  locations: number;
  galleryItems: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    sessions: 0,
    locations: 0,
    galleryItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [charRes, sessRes, locRes, galRes] = await Promise.all([
          supabase.from('characters').select('id', { count: 'exact', head: true }),
          supabase.from('session_logs').select('id', { count: 'exact', head: true }),
          supabase.from('world_locations').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          characters: charRes.count || 0,
          sessions: sessRes.count || 0,
          locations: locRes.count || 0,
          galleryItems: galRes.count || 0,
        });
      } catch (error) {
        console.error('Errore nel caricamento delle statistiche:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStats();
  }, []);

  const statCards = [
    { label: it.dashboard.stats.characters, value: stats.characters, icon: Users, color: 'text-blue-400' },
    { label: it.dashboard.stats.sessions, value: stats.sessions, icon: BookOpen, color: 'text-green-400' },
    { label: it.dashboard.stats.locations, value: stats.locations, icon: Map, color: 'text-purple-400' },
    { label: it.dashboard.stats.galleryItems, value: stats.galleryItems, icon: Image, color: 'text-pink-400' },
  ];

  const quickLinks = [
    {
      title: it.dashboard.cards.charactersTitle,
      text: it.dashboard.cards.charactersText,
      path: '/admin/characters',
      icon: Users,
    },
    {
      title: it.dashboard.cards.sessionsTitle,
      text: it.dashboard.cards.sessionsText,
      path: '/admin/sessions',
      icon: BookOpen,
    },
    {
      title: it.dashboard.cards.locationsTitle,
      text: it.dashboard.cards.locationsText,
      path: '/admin/locations',
      icon: Map,
    },
    {
      title: it.dashboard.cards.galleryTitle,
      text: it.dashboard.cards.galleryText,
      path: '/admin/gallery',
      icon: Image,
    },
    {
      title: it.dashboard.cards.settingsTitle,
      text: it.dashboard.cards.settingsText,
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">
            {it.dashboard.title}
          </h1>
          <p className="text-slate-300">
            {it.dashboard.welcomeText}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-300 py-10">
            {it.dashboard.loading}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="bg-slate-800 border border-amber-700/20 rounded-xl p-5 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm">{card.label}</p>
                    <Icon className={card.color} size={22} />
                  </div>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-amber-300 mb-5">
            {it.dashboard.quickLinks}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.path}
                  href={link.path}
                  className="block bg-slate-900 border border-amber-700/20 rounded-xl p-5 hover:border-amber-500/40 hover:-translate-y-1 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="text-amber-300" size={20} />
                    <h3 className="text-lg font-semibold text-white">
                      {link.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-6">
                    {link.text}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-amber-300 mb-3">
            {it.dashboard.welcomeTitle}
          </h2>
          <p className="text-slate-300 leading-7">
            {it.dashboard.welcomeText}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
