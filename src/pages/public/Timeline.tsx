import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  era: string | null;
  category: string;
  image_url: string | null;
  is_public: boolean;
  lore_entry_id: string | null;
  created_at: string;
}

const CAT_COLORS: Record<string, string> = {
  politico:    'bg-amber-500 text-amber-900',
  guerra:      'bg-red-600 text-white',
  magico:      'bg-purple-500 text-white',
  religioso:   'bg-yellow-500 text-yellow-900',
  geografico:  'bg-teal-500 text-white',
  altro:       'bg-slate-500 text-white',
};

const CAT_DOT: Record<string, string> = {
  politico:   'bg-amber-500',
  guerra:     'bg-red-600',
  magico:     'bg-purple-500',
  religioso:  'bg-yellow-400',
  geografico: 'bg-teal-500',
  altro:      'bg-slate-500',
};

const CATEGORIES = ['tutti', 'politico', 'guerra', 'magico', 'religioso', 'geografico', 'altro'];

const EventCard: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
  const [open, setOpen] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative flex w-full ${ isLeft ? 'justify-start' : 'justify-end' } mb-8`}>
      <div className="absolute left-1/2 -translate-x-1/2 top-5 z-10">
        <div className={`w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg ${
          CAT_DOT[event.category] ?? 'bg-slate-500'
        }`} />
      </div>
      <div className={`w-[45%] ${ isLeft ? 'mr-auto pr-6' : 'ml-auto pl-6' }`}>
        <div
          className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-600/50 transition-all shadow-lg"
          onClick={() => setOpen(v => !v)}
        >
          {event.image_url && open && (
            <img src={event.image_url} alt={event.title} className="w-full h-36 object-cover" />
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {(event.year !== null || event.era) && (
                  <p className="text-xs text-amber-500 font-mono mb-1">
                    {event.era ? `${event.era} ` : ''}{event.year !== null ? `Anno ${event.year}` : ''}
                  </p>
                )}
                <h3 className="font-bold text-white text-sm leading-snug">{event.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
                  CAT_COLORS[event.category] ?? 'bg-slate-500 text-white'
                }`}>
                  {event.category}
                </span>
                {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </div>
            {open && event.description && (
              <p className="mt-3 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-3">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tutti');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('is_public', true)
      .order('year', { ascending: true, nullsFirst: false });
    setEvents((data as TimelineEvent[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = filter === 'tutti' ? events : events.filter(e => e.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Hero con parallax */}
      <div className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('/backgrounds/Landing Page Sherdan.png')`, backgroundAttachment: 'fixed' }}
        />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-amber-500 mb-3">
            <Clock className="w-6 h-6" />
            <span className="text-sm font-semibold uppercase tracking-widest">Cronistoria di Sherdan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Le Ere del Mondo</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Gli eventi che hanno plasmato il destino di Sherdan, dalle origini ai giorni nostri.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Filtri categoria */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${
                filter === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Nessun evento trovato per questa categoria.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-600/60 via-slate-700 to-transparent" />
            <div className="relative">
              {filtered.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
