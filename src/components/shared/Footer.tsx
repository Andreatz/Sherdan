import React from 'react';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-amber-700/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-amber-100 text-sm">
            <p>High Seas Campaign 2026</p>
            <p className="text-xs text-amber-900 mt-1">Where legends are forged in fire and fury</p>
          </div>

          <div className="flex gap-4">
            <a href="mailto:contact@campaign.local" className="text-amber-400 hover:text-amber-300 transition">
              <Mail size={20} />
            </a>
          </div>

          <div className="text-amber-900 text-xs">
            <p>D&D Campaign Chronicle</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
