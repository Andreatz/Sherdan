import React from 'react';
import { Mail } from 'lucide-react';
import { it } from '../../content/texts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-amber-700/20 mt-0">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-2xl font-bold text-amber-300 mb-3">
              {it.footer.title}
            </h3>
            <p className="text-slate-300 leading-7">
              {it.footer.subtitle}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-amber-200 font-semibold mb-2">
              {it.footer.contactLabel}
            </p>
            <a
              href="mailto:contact@campaign.local"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-300 transition"
            >
              <Mail size={16} />
              contact@campaign.local
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-amber-700/10 text-sm text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span>{it.footer.chronicle}</span>
          <span>© 2026 Sherdan</span>
        </div>
      </div>
    </footer>
  );
};
