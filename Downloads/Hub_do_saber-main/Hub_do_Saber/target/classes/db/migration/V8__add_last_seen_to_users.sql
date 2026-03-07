-- V8__add_last_seen_to_users.sql
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP;
