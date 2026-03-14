import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  campaign_title: string;
  campaign_tagline: string;
}

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    fetchSettings();

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_settings')
        .select('campaign_title, campaign_tagline')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data || {
        campaign_title: 'Pirate Campaign',
        campaign_tagline: 'High seas adventure awaits',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Image - Base layer */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url(/02BW002-full.png)',
            backgroundAttachment: 'fixed',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900 z-10" />

        {/* Animated clouds/fog effect */}
        <div className="absolute inset-0 z-15">
          <div
            className="absolute inset-0 opacity-30 bg-gradient-to-t from-slate-900/60 to-transparent"
            style={{
              animation: 'drift 20s linear infinite',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="text-6xl sm:text-7xl font-bold text-amber-400 drop-shadow-lg" style={{
              animation: 'fadeInDown 1s ease-out',
              textShadow: '0 0 20px rgba(217, 119, 6, 0.5)',
            }}>
              ⚓
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-xl" style={{
            animation: 'fadeInUp 1s ease-out 0.2s both',
          }}>
            {settings?.campaign_title || 'Pirate Campaign'}
          </h1>

          <p className="text-xl sm:text-2xl text-amber-200 mb-8 drop-shadow-lg" style={{
            animation: 'fadeInUp 1s ease-out 0.4s both',
          }}>
            {settings?.campaign_tagline || 'High seas adventure awaits'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{
            animation: 'fadeInUp 1s ease-out 0.6s both',
          }}>
            <a
              href="#campaign"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded transition transform hover:scale-105"
            >
              Begin Your Adventure
            </a>
            <a
              href="#characters"
              className="px-8 py-3 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 font-bold rounded transition"
            >
              Meet the Crew
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="text-amber-400 text-2xl">⬇</div>
        </div>
      </section>

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};
