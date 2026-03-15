import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  campaign_tagline: string;
}

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('campaign_settings')
        .select('campaign_tagline')
        .limit(1)
        .maybeSingle();
      if (data) setSettings(data);
    };
    void fetchSettings();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background parallax */}
      <div
        className="absolute inset-x-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`,
          backgroundAttachment: 'fixed',
          top: 0,
          bottom: '-8rem',
        }}
      />

      {/* Overlay sfumato verso il basso */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-black/65 via-black/40 to-transparent" />

      {/* Glow ambrato */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.3),transparent_40%)]" />

      <div className="relative z-10 max-w-5xl text-center">

        {/* Logo al posto del titolo testuale */}
        <img
          src="/Logo Sherdan.png"
          alt="Atlante di Sherdan"
          className="mx-auto mb-8 w-64 md:w-80 lg:w-96 h-auto object-contain drop-shadow-2xl"
        />

        <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
          {settings?.campaign_tagline || it.home.defaultTagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#campaign" className="px-8 py-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg transition">
            {it.home.beginAdventure}
          </a>
          <a href="#characters" className="px-8 py-4 rounded-lg border border-amber-400 text-amber-200 hover:bg-amber-400/10 transition">
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
