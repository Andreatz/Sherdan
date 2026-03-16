import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Map, Image, Settings, Skull, Shield, UserCircle , Book, Clock} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';
interface Stats {
  characters: number;
  sessions: number;
  locations: number;
  galleryItems: number;
  creatures: number;
  npcs: number;
  factions: number;
}
export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    characters: 0, sessions: 0, locations: 0, galleryItems: 0, creatures: 0, npcs: 0, factions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [charRes, sessRes, locRes, galRes, creRes, npcRes, facRes] = await Promise.all([
          supabase.from('characters').select('id', { count: 'exact', head: true }),
          supabase.from('session_logs').select('id', { count: 'exact', head: true }),
          supabase.from('world_locations').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
          supabase.from('creatures').select('id', { count: 'exact', head: true }),
          supabase.from('npcs').select('id', { count: 'exact', head: true }),
          supabase.from('factions').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          characters: charRes.count || 0,
          sessions: sessRes.count || 0,
          locations: locRes.count || 0,
          galleryItems: galRes.count || 0,
          creatures: creRes.count || 0,
          npcs: npcRes.count || 0,
          factions: facRes.count || 0,
        });
      } catch (error) { console.error('Errore statistiche:', error); }
      finally { setIsLoading(false); }
    };
    void fetchStats();
  }, []);
  const statCards = [
    { label: it.dashboard.stats.characters, value: stats.characters, icon: Users,       color: 'text-blue-400'   },
    { label: it.dashboard.stats.sessions,   value: stats.sessions,   icon: BookOpen,    color: 'text-green-400'  },
    { label: it.dashboard.stats.locations,  value: stats.locations,  icon: Map,         color: 'text-purple-400' },
    { label: it.dashboard.stats.galleryItems,value:stats.galleryItems,icon: Image,       color: 'text-pink-400'   },
    { label: 'Creature',                    value: stats.creatures,  icon: Skull,       color: 'text-red-400'    },
    { label: 'NPC',                         value: stats.npcs,       icon: UserCircle,  color: 'text-orange-400' },
    { label: 'Fazioni',                     value: stats.factions,   icon: Shield,      color: 'text-amber-400'  },
  ];
  const quickLinks = [
    { title: it.dashboard.cards.charactersTitle, text: it.dashboard.cards.charactersText, path: '/admin/characters', icon: Users     },
    { title: it.dashboard.cards.sessionsTitle,   text: it.dashboard.cards.sessionsText,   path: '/admin/sessions',   icon: BookOpen  },
    { title: it.dashboard.cards.locationsTitle,  text: it.dashboard.cards.locationsText,  path: '/admin/locations',  icon: Map       },
    { title: it.dashboard.cards.galleryTitle,    text: it.dashboard.cards.galleryText,    path: '/admin/gallery',    icon: Image     },
    { title: 'Bestiario',  text: 'Gestisci le creature incontrate dalla compagnia.', path: '/admin/bestiary',  icon: Skull      },
    { title: 'NPC',        text: 'Gestisci i personaggi non giocanti della campagna.', path: '/admin/npc',      icon: UserCircle },
    { title: 'Fazioni',    text: 'Gestisci le fazioni e la reputazione del party.',   path: '/admin/factions', icon: Shield     },
    { title: it.dashboard.cards.settingsTitle,   text: it.dashboard.cards.settingsText,   path: '/admin/settings',   icon: Settings  },
        { title: 'Cronistoria',  text: 'Gestisci gli eventi della timeline della campagna.', path: '/admin/timeline', icon: Clock },
    { title: 'Diario del DM', text: 'Note private, segreti e appunti del Dungeon Master.', path: '/admin/diary',    icon: Book  },
  ];
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-2">{it.dashboard.title}</h1>
      <p className="text-gray-400 mb-8">{it.dashboard.welcomeText}</p>
      {isLoading ? (
        <p className="text-gray-500">{it.dashboard.loading}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => { const Icon = card.icon; return (
            <div key={card.label} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <Icon className={`w-6 h-6 mb-2 ${card.color}`} />
              <p className="text-gray-400 text-xs">{card.label}</p>
              <p className="text-white text-2xl font-bold">{card.value}</p>
            </div>
          );})}
        </div>
      )}
      <h2 className="text-lg font-semibold text-white mb-4">{it.dashboard.quickLinks}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => { const Icon = link.icon; return (
          <a key={link.path} href={link.path} className="bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-xl p-5 transition-colors group">
            <Icon className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-white font-semibold mb-1 group-hover:text-amber-300">{link.title}</h3>
            <p className="text-gray-400 text-sm">{link.text}</p>
          </a>
        );})}
      </div>
    </AdminLayout>
  );
};
