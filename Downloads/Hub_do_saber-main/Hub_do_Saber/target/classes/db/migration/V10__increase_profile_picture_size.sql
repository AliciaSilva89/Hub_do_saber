-- V10__fix_image_columns.sql
ALTER TABLE public.users ALTER COLUMN profile_picture TYPE TEXT;
ALTER TABLE study_group ADD COLUMN IF NOT EXISTS image TEXT;
