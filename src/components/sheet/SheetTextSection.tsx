import React from 'react';

interface SheetTextSectionProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  color?: string;
}

export const SheetTextSection: React.FC<SheetTextSectionProps> = ({
  label, value, onChange, placeholder, rows = 3, readOnly = false, color = 'amber'
}) => (
  <div>
    <h4 className={`text-${color}-400 font-semibold text-sm mb-1`}>{label}</h4>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      rows={rows}
      placeholder={readOnly ? '(compilato dal DM)' : placeholder ?? ''}
      className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600
        focus:outline-none focus:border-amber-600/50 resize-none leading-6 transition
        ${ readOnly ? 'border-slate-700/30 cursor-default text-slate-400' : 'border-slate-600/50' }`}
    />
  </div>
);
