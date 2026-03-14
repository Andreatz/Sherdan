import React, { useEffect, useState } from 'react';
import { it } from '../../content/texts';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  world_lore: string;
  main_story_arc: string;
  house_rules: string;
}

type TabKey = 'lore' | 'story' | 'rules';

export const CampaignPage: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('lore');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('campaign_settings')
        .select('world_lore, main_story_arc, house_rules')
        .limit(1)
        .maybeSingle();

      setSettings(data ?? null);
      setLoading(false);
    };

    void fetchSettings();
  }, []);

  const tabs = [
    { key: 'lore' as TabKey, label: it.campaign.worldLoreTab },
    { key: 'story' as TabKey, label: it.campaign.storyArcTab },
    { key: 'rules' as TabKey, label: it.campaign.houseRulesTab },
  ];

  const renderContent = () => {
    if (!settings) {
      return (
        <p className="text-slate-300 text-lg text-center">
          {it.campaign.empty}
        </p>
      );
    }

    if (activeTab === 'lore') {
      return (
        <>
          <h3 className="text-2xl font-bold text-amber-300 mb-4">
            {it.campaign.worldLoreTitle}
          </h3>
          <p className="text-slate-200 leading-8 whitespace-pre-line">
            {settings.world_lore || it.campaign.worldLoreEmpty}
          </p>
        </>
      );
    }

    if (activeTab === 'story') {
      return (
        <>
          <h3 className="text-2xl font-bold text-amber-300 mb-4">
            {it.campaign.storyTitle}
          </h3>
          <p className="text-slate-200 leading-8 whitespace-pre-line">
            {settings.main_story_arc || it.campaign.storyEmpty}
          </p>
        </>
      );
    }

    return (
      <>
        <h3 className="text-2xl font-bold text-amber-300 mb-4">
          {it.campaign.rulesTitle}
        </h3>
        <p className="text-slate-200 leading-8 whitespace-pre-line">
          {settings.house_rules || it.campaign.rulesEmpty}
        </p>
      </>
    );
  };

  return (
    <section id="campaign" className="py-24 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02))] border border-amber-700/20 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-amber-200 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-slate-300 text-lg">{it.campaign.loading}</p>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </section>
  );
};
