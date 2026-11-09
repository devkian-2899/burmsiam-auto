-- BurmSiamAuto catalog.
-- Run this once in the Neon SQL editor for project burmsiamauto.
-- Photo columns store the address of a file in the Cloudflare bucket
-- burmsiamauto-cfstorage. They do not store the image itself.

create table programs (
  id bigint generated always as identity primary key,
  name text not null default '',
  abbr text not null default '',
  description text not null default '',
  cover text not null default '',
  icon text not null default '',
  unique (abbr)
);

create table seasons (
  id bigint generated always as identity primary key,
  season text not null default '',
  volume text not null default '',
  unique (season, volume)
);

create table episodes (
  id bigint generated always as identity primary key,
  episode text not null default '',
  title text not null default '',
  description text not null default '',
  link text not null default '',
  photo text not null default '',
  program_id bigint not null references programs (id),
  season_id bigint not null references seasons (id)
);

create index episodes_program_id_idx on episodes (program_id);
create index episodes_season_id_idx on episodes (season_id);

create table latest (
  id bigint generated always as identity primary key,
  photo text not null default '',
  link text not null default ''
);

create table visual (
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
