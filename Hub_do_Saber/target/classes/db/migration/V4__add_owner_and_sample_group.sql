-- ================================================
-- MIGRATION V4: Adicionar owner_id e grupo de exemplo
-- ================================================

-- 1. Adicionar coluna owner_id na tabela study_group
ALTER TABLE study_group ADD COLUMN IF NOT EXISTS owner_id UUID;

-- 2. Adicionar constraint de foreign key
ALTER TABLE study_group 
ADD CONSTRAINT fk_study_group_owner 
FOREIGN KEY (owner_id) REFERENCES users(id);

-- 3. Inserir um grupo de estudo de exemplo (se necessário)
-- Certifique-se de que os IDs de discipline_id e owner_id existam
INSERT INTO study_group (id, name, description, discipline_id, owner_id, max_members, monitoring, active)
VALUES (
    '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid,
    'Grupo de Cálculo 1',
    'Grupo para estudar Cálculo Diferencial e Integral',
    '3d4e5f6a-7b8c-9012-3456-789abcdef012'::uuid,  -- ID da disciplina Cálculo 1
    '24c8b310-1e8c-4877-89e6-0ee473da7bfe'::uuid,  -- ID do usuário Joaquim
    10,
    false,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 4. Adicionar membros ao grupo (tabela user_group)
INSERT INTO user_group (id, user_id, group_id, type)
VALUES 
    (
        gen_random_uuid(),
        '24c8b310-1e8c-4877-89e6-0ee473da7bfe'::uuid,  -- Joaquim (owner)
        '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid,  -- Grupo de Cálculo 1
        'OWNER'
    ),
    (
        gen_random_uuid(),
        '130e00b9-67ac-4011-938b-aa773771b61c'::uuid,  -- Dionisio
        '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid,  -- Grupo de Cálculo 1
        'MEMBER'
    )
ON CONFLICT DO NOTHING;