-- =============================================
-- MIGRATION: Notifications + Timeline updates
-- =============================================

-- 1. NOTIFICATIONS
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  message     text not null default '',
  category    text not null default 'generale' check (category in ('sessione','missione','lore','generale')),
  read        boolean not null default false,
  link        text,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users see own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

create policy "Admin insert notifications" on public.notifications
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 2. TIMELINE EVENTS (aggiorna tabella esistente se mancano colonne)
alter table public.timeline_events
  add column if not exists era        text,
  add column if not exists image_url  text,
  add column if not exists is_public  boolean not null default true,
  add column if not exists lore_entry_id uuid references public.lore_entries(id) on delete set null;

alter table public.timeline_events enable row level security;

drop policy if exists "Public read timeline" on public.timeline_events;
create policy "Public read timeline" on public.timeline_events
  for select using (is_public = true);

create policy "Admin all timeline" on public.timeline_events
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 3. CHARACTER SLUG (necessario per /personaggi/:slug)
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

-- 4. REALTIME: abilita per notifications
alter publication supabase_realtime add table public.notifications;
