import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabase';

interface CampaignSettings {
  id: string;
  campaign_title: string;
  campaign_tagline: string;
  world_lore: string;
  main_story_arc: string;
  house_rules: string;
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

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

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const { data: newSettings, error: insertError } = await supabase
          .from('campaign_settings')
          .insert([{
            campaign_title: 'Pirate Campaign',
            campaign_tagline: 'High seas adventure awaits',
            world_lore: '',
            main_story_arc: '',
            house_rules: '',
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CampaignSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
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

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="settings">
        <div className="text-center text-amber-400">Loading settings...</div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout currentPage="settings">
        <div className="text-center text-amber-100">Failed to load settings</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-amber-400">Campaign Settings</h1>

        {message && (
          <div className={`p-3 rounded ${message.includes('success') ? 'bg-green-900/30 border border-green-600 text-green-200' : 'bg-red-900/30 border border-red-600 text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="bg-slate-700 border border-amber-700/30 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">Campaign Title</label>
            <input
              type="text"
              value={settings.campaign_title}
              onChange={(e) => handleChange('campaign_title', e.target.value)}
              className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">Campaign Tagline</label>
            <input
              type="text"
              value={settings.campaign_tagline}
              onChange={(e) => handleChange('campaign_tagline', e.target.value)}
              className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">World Lore</label>
            <textarea
              value={settings.world_lore}
              onChange={(e) => handleChange('world_lore', e.target.value)}
              rows={6}
              placeholder="Describe the world and its history..."
              className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">Main Story Arc</label>
            <textarea
              value={settings.main_story_arc}
              onChange={(e) => handleChange('main_story_arc', e.target.value)}
              rows={6}
              placeholder="Describe the main narrative..."
              className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-amber-100 text-sm font-medium mb-2">House Rules</label>
            <textarea
              value={settings.house_rules}
              onChange={(e) => handleChange('house_rules', e.target.value)}
              rows={6}
              placeholder="List any special rules for this campaign..."
              className="w-full px-4 py-2 bg-slate-600 border border-amber-700/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold py-3 rounded transition"
          >
            {isSaving ? 'Saving...' : 'Save Campaign Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};
