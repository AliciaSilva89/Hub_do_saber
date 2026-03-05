-- V4__add_is_active_to_users.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Atualizar todos os usuários existentes para ativos
UPDATE users SET is_active = true WHERE is_active IS NULL;
