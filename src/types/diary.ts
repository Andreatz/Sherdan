export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  session_number?: number | null;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export type DiaryCategory =
  | 'generale'
  | 'trama'
  | 'personaggi'
  | 'luoghi'
  | 'sessione'
  | 'segreti'
  | 'idee';

export const DIARY_CATEGORIES: { value: DiaryCategory; label: string }[] = [
  { value: 'generale',    label: 'Generale' },
  { value: 'trama',       label: 'Trama' },
  { value: 'personaggi',  label: 'Personaggi' },
  { value: 'luoghi',      label: 'Luoghi' },
  { value: 'sessione',    label: 'Sessione' },
  { value: 'segreti',     label: 'Segreti' },
  { value: 'idee',        label: 'Idee' },
];
