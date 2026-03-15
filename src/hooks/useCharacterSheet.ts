import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { CharacterSheet, defaultSheet } from '../types/sheet';

export const useCharacterSheet = (characterId: string | undefined, isAdmin: boolean) => {
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!characterId) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('character_sheets')
        .select('*')
        .eq('character_id', characterId)
        .maybeSingle();
      setSheet(data ?? null);
      setLoading(false);
      isFirstLoad.current = true;
    };
    void fetch();
  }, [characterId]);

  const updateSheet = useCallback((patch: Partial<CharacterSheet>) => {
    setSheet((prev) => prev ? { ...prev, ...patch } : prev);
  }, []);

  // Autosave con debounce 800ms
  useEffect(() => {
    if (!sheet || !characterId) return;
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus('saving');
    debounceRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from('character_sheets')
        .upsert(
          { ...sheet, character_id: characterId, updated_at: new Date().toISOString() },
          { onConflict: 'character_id' }
        );
      setSaveStatus(error ? 'error' : 'saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [sheet, characterId]);

  // Admin: crea scheda vuota se non esiste
  const createSheet = useCallback(async () => {
    if (!characterId || !isAdmin) return;
    const payload = defaultSheet(characterId);
    const { data, error } = await supabase
      .from('character_sheets')
      .insert([payload])
      .select()
      .single();
    if (!error && data) setSheet(data as CharacterSheet);
  }, [characterId, isAdmin]);

  return { sheet, loading, saveStatus, updateSheet, createSheet };
};
