-- ================================================
-- MIGRATION V4: Adicionar owner_id no study_group
-- ================================================

-- 1. Adicionar coluna owner_id na tabela study_group
ALTER TABLE public.study_group ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 2. Adicionar constraint de foreign key
ALTER TABLE public.study_group
ADD CONSTRAINT fk_study_group_owner
FOREIGN KEY (owner_id) REFERENCES public.users(id);
