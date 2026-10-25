-- webCircuitUK waitlist
-- Run this once: Supabase dashboard > SQL Editor > New query > paste > Run.

create table if not exists public.waitlist (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null default '' check (char_length(name) <= 80),
  email         text not null check (char_length(email) <= 160),
  trade         text not null default '' check (char_length(trade) <= 80),
  plan          text not null check (plan in ('Simple', 'Expert', 'Parallax', 'Custom coded', 'Not sure yet')),
  timing        text not null check (timing in ('As soon as possible', 'Within a month', 'Just exploring')),
  contact_early text not null check (contact_early in ('Yes', 'No'))
);

-- One signup per email, whatever the capitalisation.
create unique index if not exists waitlist_email_key on public.waitlist (lower(email));

-- Lock the table down. Row Level Security with no policies means the public
-- (anon) and signed-in keys can neither read nor write it. Only the server,
-- using the secret key, can touch the data.
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
