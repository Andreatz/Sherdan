import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../utils/supabase';

interface SessionLog {
  id: string;
  session_number: number;
  title: string;
  date: string;
  summary: string;
  detailed_narrative: string;
  featured_image_url?: string;
}

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_logs')
        .select('*')
        .order('session_number', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="sessions" className="py-16 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">Session Chronicles</h2>
          <p className="text-amber-100">Tales from the high seas</p>
        </div>

        {isLoading ? (
          <div className="text-center text-amber-400">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-amber-100 py-12">
            <p>No session logs yet. The story begins soon...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="relative">
                {/* Timeline connector */}
                {index < sessions.length - 1 && (
                  <div className="absolute left-5 top-16 w-0.5 h-8 bg-amber-700/30" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-4 w-12 h-12 flex items-center justify-center">
                  <div className="w-3 h-3 bg-amber-600 rounded-full ring-4 ring-slate-900" />
                </div>

                {/* Session card */}
                <button
                  onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                  className="w-full ml-16 text-left bg-slate-800 border border-amber-700/30 hover:border-amber-600 rounded-lg p-4 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-400">
                        Session {session.session_number}: {session.title}
                      </h3>
                      <p className="text-amber-900 text-sm mt-1">{new Date(session.date).toLocaleDateString()}</p>
                      <p className="text-amber-100 text-sm mt-2 line-clamp-2">{session.summary}</p>
                    </div>
                    <div className="ml-4 text-amber-400">
                      {expandedId === session.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {expandedId === session.id && (
                  <div className="ml-16 mt-2 bg-slate-700 border border-amber-700/30 rounded-lg p-6 space-y-4">
                    {session.featured_image_url && (
                      <img
                        src={session.featured_image_url}
                        alt={session.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}

                    <div>
                      <h4 className="text-amber-400 font-bold mb-2">Summary</h4>
                      <p className="text-amber-100">{session.summary}</p>
                    </div>

                    <div>
                      <h4 className="text-amber-400 font-bold mb-2">Full Account</h4>
                      <p className="text-amber-100 whitespace-pre-wrap">{session.detailed_narrative}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
