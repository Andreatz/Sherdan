import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  campaign_title: string;
  campaign_tagline: string;
  world_lore: string;
  main_story_arc: string;
  house_rules: string;
}

export const CampaignPage: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lore' | 'story' | 'rules'>('lore');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data || null);
    } catch (error) {
      console.error('Error fetching campaign settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="campaign" className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-amber-400">
          Loading campaign...
        </div>
      </section>
    );
  }

  if (!settings) {
    return (
      <section id="campaign" className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-amber-100">
          Campaign information coming soon!
        </div>
      </section>
    );
  }

  return (
    <section id="campaign" className="py-16 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{settings.campaign_title}</h2>
          <p className="text-amber-200 text-lg">{settings.campaign_tagline}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-amber-700/30">
          <button
            onClick={() => setActiveTab('lore')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'lore'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-amber-100 hover:text-amber-300'
            }`}
          >
            World Lore
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'story'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-amber-100 hover:text-amber-300'
            }`}
          >
            Story Arc
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 font-bold transition ${
              activeTab === 'rules'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-amber-100 hover:text-amber-300'
            }`}
          >
            House Rules
          </button>
        </div>

        {/* Content Panels */}
        <div className="bg-slate-800 border border-amber-700/30 rounded-lg p-8">
          {/* World Lore */}
          {activeTab === 'lore' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">World Lore</h3>
              {settings.world_lore ? (
                <div className="text-amber-100 whitespace-pre-wrap leading-relaxed">
                  {settings.world_lore}
                </div>
              ) : (
                <p className="text-amber-900">No lore has been recorded yet...</p>
              )}
            </div>
          )}

          {/* Story Arc */}
          {activeTab === 'story' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">Main Story Arc</h3>
              {settings.main_story_arc ? (
                <div className="text-amber-100 whitespace-pre-wrap leading-relaxed">
                  {settings.main_story_arc}
                </div>
              ) : (
                <p className="text-amber-900">The story is yet to be written...</p>
              )}
            </div>
          )}

          {/* House Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">House Rules</h3>
              {settings.house_rules ? (
                <div className="text-amber-100 whitespace-pre-wrap leading-relaxed">
                  {settings.house_rules}
                </div>
              ) : (
                <p className="text-amber-900">No special rules have been established...</p>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};
