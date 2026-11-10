-- Run once in Neon after availability columns exist. Safe to run more than once.

alter table episodes drop column if exists link;
