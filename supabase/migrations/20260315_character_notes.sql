-- Tabella note private per giocatori sugli NPC
create table if not exists character_notes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  character_id  uuid references characters(id) on delete cascade not null,
  note          text not null default '',
  updated_at    timestamptz default now(),
  unique(user_id, character_id)
);

-- RLS: ogni utente vede e modifica solo le proprie note
alter table character_notes enable row level security;

create policy "Utente gestisce le proprie note"
  on character_notes
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
