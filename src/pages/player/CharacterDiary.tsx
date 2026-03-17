import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Navigation } from '../../components/shared/Navigation';
import { Footer } from '../../components/shared/Footer';
import { CharacterNote } from '../../types/characterNote';
import { BookOpen, Save, Plus, Trash2, ChevronDown, ChevronUp, Lock, Pin } from 'lucide-react';

const NoteCard: React.FC<{
  note: CharacterNote;
  onSave: (id: string, title: string, content: string, pinned: boolean) => Promise<void>;
  onDelete: (id: string) => void;
}> = ({ note, onSave, onDelete }) => {
  const [title, setTitle]     = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [pinned, setPinned]   = useState(note.pinned);
  const [open, setOpen]       = useState(false);
  const [dirty, setDirty]     = useState(false);
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(note.id, title, content, pinned);
    setDirty(false);
    setSaving(false);
  };

  const change = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (val: T) => { setter(val); setDirty(true); };

  const ago = new Date(note.updated_at).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className={`bg-slate-800 border rounded-2xl overflow-hidden transition-all ${
      pinned ? 'border-amber-500/50' : 'border-slate-700/60'
    }`}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <BookOpen size={16} className={pinned ? 'text-amber-400' : 'text-slate-500'} />
        <span className="flex-1 font-semibold text-slate-100 truncate">{title || 'Voce senza titolo'}</span>
        <span className="text-xs text-slate-600">{ago}</span>
        {open ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/40">
          <input
            value={title}
            onChange={(e) => change(setTitle)(e.target.value)}
            placeholder="Titolo voce del diario..."
            className="w-full mt-3 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:border-amber-600 outline-none text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => change(setContent)(e.target.value)}
            rows={8}
            placeholder="Scrivi qui i pensieri del tuo personaggio, segreti scoperti, alleanze strette..."
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:border-amber-600 outline-none text-sm resize-y leading-relaxed font-serif"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-400 hover:text-amber-300 transition">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => change(setPinned)(e.target.checked)}
                className="accent-amber-500 w-4 h-4"
              />
              <Pin size={13} /> In evidenza
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(note.id)}
                className="p-2 text-slate-600 hover:text-red-400 transition"
                title="Elimina"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={handleSave}
                disabled={!dirty || saving}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                  dirty && !saving
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Save size={13} /> {saving ? 'Salvo...' : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CharacterDiaryPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes]       = useState<CharacterNote[]>([]);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('character_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });
    setNotes((data as CharacterNote[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    await supabase.from('character_notes').insert({
      user_id:        user.id,
      character_name: '',
      title:          'Nuova voce',
      content:        '',
      pinned:         false,
    });
    await load();
    setCreating(false);
  };

  const handleSave = async (id: string, title: string, content: string, pinned: boolean) => {
    await supabase
      .from('character_notes')
      .update({ title, content, pinned, updated_at: new Date().toISOString() })
      .eq('id', id);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questa voce del diario?')) return;
    await supabase.from('character_notes').delete().eq('id', id);
    await load();
  };

  if (!user) return null;

  const pinned   = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl mb-1">📖 Diario del Personaggio</h1>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <Lock size={12} /> Visibile solo a te
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-semibold transition"
            >
              <Plus size={16} /> {creating ? '...' : 'Nuova voce'}
            </button>
          </div>

          {loading ? (
            <p className="text-slate-500 text-center py-16">Caricamento...</p>
          ) : notes.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 mb-2">Il diario è ancora vuoto.</p>
              <p className="text-slate-600 text-sm">Inizia a scrivere i pensieri del tuo personaggio, i segreti che custodisce e le avventure vissute.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pinned.length > 0 && (
                <>
                  <p className="text-xs text-amber-700 uppercase tracking-widest px-1 pb-1">📌 In evidenza</p>
                  {pinned.map((n) => (
                    <NoteCard key={n.id} note={n} onSave={handleSave} onDelete={handleDelete} />
                  ))}
                  {unpinned.length > 0 && <div className="border-t border-slate-800 my-2" />}
                </>
              )}
              {unpinned.map((n) => (
                <NoteCard key={n.id} note={n} onSave={handleSave} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
