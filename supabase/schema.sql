-- Run this in the Supabase SQL editor (or via the CLI) to set up the
-- tables this app needs.

create extension if not exists "pgcrypto";

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity numeric,
  unit text,
  created_at timestamptz not null default now()
);

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  time_minutes integer not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  ingredients_used jsonb not null default '[]',
  missing_ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Row Level Security is enabled with no policies: the app never talks to
-- Supabase from the browser, only from server functions using the service
-- role key (which bypasses RLS). This keeps the data safe even if the
-- anon/public key is ever exposed.
alter table ingredients enable row level security;
alter table suggestions enable row level security;
