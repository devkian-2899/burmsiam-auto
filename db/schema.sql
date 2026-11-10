-- BurmSiamAuto catalog.
-- Run this once in the Neon SQL editor for project burmsiamauto.
-- Photo columns store the address of a file in the Cloudflare bucket
-- burmsiamauto-cfstorage. They do not store the image itself.

create table if not exists programs (
  id bigint generated always as identity primary key,
  name text not null default '',
  abbr text not null default '',
  description text not null default '',
  cover text not null default '',
  icon text not null default '',
  sortingno integer not null default 0,
  unique (abbr)
);

alter table programs add column if not exists sortingno integer not null default 0;

create table if not exists seasons (
  id bigint generated always as identity primary key,
  season text not null default '',
  volume text not null default '',
  unique (season, volume)
);

create table if not exists episodes (
  id bigint generated always as identity primary key,
  episode text not null default '',
  title text not null default '',
  description text not null default '',
  photo text not null default '',
  program_id bigint not null references programs (id),
  season_id bigint not null references seasons (id)
);

create index if not exists episodes_program_id_idx on episodes (program_id);
create index if not exists episodes_season_id_idx on episodes (season_id);

alter table episodes add column if not exists facebook_url text;
alter table episodes add column if not exists instagram_url text;
alter table episodes add column if not exists youtube_url text;
alter table episodes add column if not exists tiktok_url text;
alter table episodes add column if not exists post_type text;

alter table episodes drop column if exists link;

create table if not exists latest (
  id bigint generated always as identity primary key,
  photo text not null default '',
  link text not null default ''
);

create table if not exists visual (
  id bigint generated always as identity primary key,
  cover1 text not null default '',
  cover2 text not null default '',
  cover3 text not null default '',
  cover4 text not null default '',
  cover5 text not null default '',
  youtube text not null default '',
  t1 text not null default '',
  p1 text not null default '',
  t2 text not null default '',
  p2 text not null default '',
  t3 text not null default '',
  p3 text not null default '',
  t4 text not null default '',
  p4 text not null default '',
  fb text not null default '',
  ig text not null default '',
  tt text not null default '',
  yt text not null default '',
  mail text not null default '',
  copyright text not null default ''
);

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

create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  identity text not null,
  created_at timestamptz not null default now()
);

create index if not exists login_attempts_identity_idx on login_attempts (lower(identity), created_at);

create table if not exists password_resets (
  id bigint generated always as identity primary key,
  staff_id bigint not null references staff (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);
