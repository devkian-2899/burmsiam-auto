-- Run once in Neon if episodes already exists. Safe to run more than once.

alter table episodes add column if not exists facebook_url text;
alter table episodes add column if not exists instagram_url text;
alter table episodes add column if not exists youtube_url text;
alter table episodes add column if not exists tiktok_url text;
alter table episodes add column if not exists post_type text;
