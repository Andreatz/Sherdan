-- =============================================
-- MIGRATION: Timeline updates + Character columns
-- (notifiche rimosse)
-- =============================================

-- 1. TIMELINE EVENTS — aggiunge colonne mancanti se presenti
alter table public.timeline_events
  add column if not exists era           text,
  add column if not exists image_url     text,
  add column if not exists is_public     boolean not null default true,
  add column if not exists lore_entry_id uuid references public.lore_entries(id) on delete set null;

alter table public.timeline_events enable row level security;

drop policy if exists "Public read timeline" on public.timeline_events;
create policy "Public read timeline" on public.timeline_events
  for select using (is_public = true);

create policy "Admin all timeline" on public.timeline_events
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 2. CHARACTER — aggiunge colonne per profilo pubblico
alter table public.characters
  add column if not exists slug        text unique,
  add column if not exists player_name text,
  add column if not exists stats       jsonb,
  add column if not exists traits      text[],
  add column if not exists backstory   text;

-- Genera slug da name se mancante
update public.characters
  set slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
  where slug is null;
