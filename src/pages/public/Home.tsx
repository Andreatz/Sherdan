import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  campaign_title: string;
  campaign_tagline: string;
}

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('campaign_settings')
        .select('campaign_title, campaign_tagline')
        .limit(1)
        .maybeSingle();

      if (data) setSettings(data);
    };

    void fetchSettings();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-6"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.25),transparent_35%)]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent,rgba(15,27,46,0.95))]" />

      <div className="relative z-10 max-w-5xl text-center">
        <p className="uppercase tracking-[0.35em] text-amber-300/80 text-sm mb-6">
          Sherdan
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-amber-300 drop-shadow-lg mb-6">
          {settings?.campaign_title || it.home.defaultTitle}
        </h1>

        <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
          {settings?.campaign_tagline || it.home.defaultTagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#campaign"
            className="px-8 py-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg transition"
          >
            {it.home.beginAdventure}
          </a>

          <a
            href="#characters"
            className="px-8 py-4 rounded-lg border border-amber-400 text-amber-200 hover:bg-amber-400/10 transition"
          >
            {it.home.meetCrew}
          </a>
        </div>

        <div className="mt-16 animate-bounce text-slate-300">
          <a href="#campaign" className="inline-flex flex-col items-center gap-2">
            <span className="text-sm uppercase tracking-[0.2em]">{it.home.scroll}</span>
            <span className="text-2xl">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
