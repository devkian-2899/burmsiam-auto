-- Run this in Neon if the program tables already exist.
-- Safe to run more than once.

create table if not exists staff (
  id bigint generated always as identity primary key,
  name text not null default '',
  username text not null,
  email text not null,
  phone text not null default '',
  role text not null check (role in ('Admin', 'Moderator', 'Content Manager')),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists staff_username_lower_idx on staff (lower(username));
create unique index if not exists staff_email_lower_idx on staff (lower(email));

create table if not exists sessions (
  id text primary key,
  staff_id bigint not null references staff (id) on delete cascade,
  expires_at timestamptz not null,
  remember boolean not null default false
);

create index if not exists sessions_staff_id_idx on sessions (staff_id);

create table if not exists password_resets (
  id bigint generated always as identity primary key,
  staff_id bigint not null references staff (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);
