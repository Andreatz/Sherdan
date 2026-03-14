import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Map, Image, Settings } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

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
    fetchStats();
  }, []);

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
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Characters', value: stats.characters, icon: Users, color: 'text-blue-400' },
    { label: 'Sessions', value: stats.sessions, icon: BookOpen, color: 'text-green-400' },
    { label: 'Locations', value: stats.locations, icon: Map, color: 'text-purple-400' },
    { label: 'Gallery Items', value: stats.galleryItems, icon: Image, color: 'text-pink-400' },
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-amber-400">Campaign Dashboard</h1>

        {isLoading ? (
          <div className="text-center text-amber-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-900 text-sm font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-amber-400 mt-2">{card.value}</p>
                    </div>
                    <Icon size={32} className={card.color} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/admin/characters" className="block p-3 bg-slate-600 hover:bg-slate-500 rounded transition">
              <p className="text-amber-400 font-medium">Manage Characters</p>
              <p className="text-amber-900 text-sm">Add, edit, or remove player characters</p>
            </a>
            <a href="/admin/sessions" className="block p-3 bg-slate-600 hover:bg-slate-500 rounded transition">
              <p className="text-amber-400 font-medium">Manage Sessions</p>
              <p className="text-amber-900 text-sm">Create and update session logs</p>
            </a>
            <a href="/admin/locations" className="block p-3 bg-slate-600 hover:bg-slate-500 rounded transition">
              <p className="text-amber-400 font-medium">Manage Locations</p>
              <p className="text-amber-900 text-sm">Add map markers and territories</p>
            </a>
            <a href="/admin/gallery" className="block p-3 bg-slate-600 hover:bg-slate-500 rounded transition">
              <p className="text-amber-400 font-medium">Manage Gallery</p>
              <p className="text-amber-900 text-sm">Upload and organize images</p>
            </a>
            <a href="/admin/settings" className="block p-3 bg-slate-600 hover:bg-slate-500 rounded transition">
              <p className="text-amber-400 font-medium">Campaign Settings</p>
              <p className="text-amber-900 text-sm">Edit world lore and rules</p>
            </a>
          </div>
        </div>

        <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-2">Welcome, Captain!</h2>
          <p className="text-amber-100">
            Use the admin panel to manage all aspects of your campaign. Add characters, log sessions, place locations on the map, and upload gallery images. All changes are saved to the database and appear on the public website in real-time.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
