import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';
import { it } from '../../content/texts';

interface CampaignSettings {
  id: string;
  campaign_title: string;
  campaign_tagline: string;
  world_lore: string;
  main_story_arc: string;
  house_rules: string;
}
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Page for managing campaign settings.
 *
 * @returns {React.FC} The SettingsPage component.
 */
/*******  f3c9b0df-36a3-44e2-a9be-7b97db83a226  *******/
export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    void fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('campaign_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        const { data: newSettings, error: insertError } = await supabase
          .from('campaign_settings')
          .insert([
            {
              campaign_title: it.adminSettings.defaults.title,
              campaign_tagline: it.adminSettings.defaults.tagline,
              world_lore: '',
              main_story_arc: '',
              house_rules: '',
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle impostazioni:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CampaignSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('campaign_settings')
        .update({
          campaign_title: settings.campaign_title,
          campaign_tagline: settings.campaign_tagline,
          world_lore: settings.world_lore,
          main_story_arc: settings.main_story_arc,
          house_rules: settings.house_rules,
        })
        .eq('id', settings.id);

      if (error) throw error;

      setMessage(it.adminSettings.saveSuccess);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Errore nel salvataggio delle impostazioni:', error);
      setMessage(it.adminSettings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center text-amber-300 py-10">
          {it.adminSettings.loading}
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="text-center text-red-300 py-10">
          {it.adminSettings.loadError}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-amber-300">
          {it.adminSettings.title}
        </h1>

        {message && (
          <div className="bg-slate-800 border border-amber-700/20 rounded-lg px-4 py-3 text-amber-200">
            {message}
          </div>
        )}

        <div className="bg-slate-800 border border-amber-700/20 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">
              {it.adminSettings.fields.campaignTitle}
            </label>
            <input
              type="text"
              value={settings.campaign_title}
              onChange={(e) => handleChange('campaign_title', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">
              {it.adminSettings.fields.campaignTagline}
            </label>
            <input
              type="text"
              value={settings.campaign_tagline}
              onChange={(e) => handleChange('campaign_tagline', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">
              {it.adminSettings.fields.worldLore}
            </label>
            <textarea
              value={settings.world_lore}
              onChange={(e) => handleChange('world_lore', e.target.value)}
              rows={7}
              placeholder={it.adminSettings.placeholders.worldLore}
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">
              {it.adminSettings.fields.mainStoryArc}
            </label>
            <textarea
              value={settings.main_story_arc}
              onChange={(e) => handleChange('main_story_arc', e.target.value)}
              rows={7}
              placeholder={it.adminSettings.placeholders.mainStoryArc}
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">
              {it.adminSettings.fields.houseRules}
            </label>
            <textarea
              value={settings.house_rules}
              onChange={(e) => handleChange('house_rules', e.target.value)}
              rows={7}
              placeholder={it.adminSettings.placeholders.houseRules}
              className="w-full px-4 py-2 bg-slate-700 border border-amber-700/30 rounded text-white placeholder-slate-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-semibold py-3 rounded transition"
          >
            {isSaving ? it.adminSettings.saving : it.adminSettings.save}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
