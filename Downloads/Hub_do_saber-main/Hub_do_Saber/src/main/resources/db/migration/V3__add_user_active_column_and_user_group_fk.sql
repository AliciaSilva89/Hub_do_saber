-- V3__add_owner_and_sample_group.sql

-- 1. Adicionar coluna owner_id na tabela study_group
ALTER TABLE study_group ADD COLUMN owner_id UUID;

-- 2. Adicionar FK para users na tabela user_group
ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

-- 3. Adicionar FK para owner na tabela study_group
ALTER TABLE study_group
    ADD CONSTRAINT FK_STUDY_GROUP_ON_OWNER FOREIGN KEY (owner_id) REFERENCES users (id);

-- 4. Inserir um usuário de exemplo
INSERT INTO users (id, matriculation, password, name, email, course_id)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'BSI2023001',
    '$2a$10$rKsHvELzOqSNVlWHPxDXU.3LJJBLBc3M9DGXGPRjGjK.HJKqjHGxS',
    'João Silva',
    'joao.silva@ufu.br',
    'c1d2e3f4-a5b6-7890-1234-567890abcdef'::uuid
);

-- ✅ Grupos SEM discipline_id fixo — evita FK inválida após V13
INSERT INTO study_group (id, name, description, max_members, monitoring, active, owner_id)
VALUES (
    '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid,
    'Grupo de Estudos - Programação para Internet',
    'Grupo focado em desenvolvimento web com Spring Boot e React',
    10, false, true,
    '11111111-1111-1111-1111-111111111111'::uuid
),
(
    '8a1b2c3d-4e5f-6789-0abc-def123456790'::uuid,
    'Grupo de Estrutura de Dados',
    'Estudos sobre algoritmos e estruturas de dados',
    8, false, true,
    '11111111-1111-1111-1111-111111111111'::uuid
),
(
    '8a1b2c3d-4e5f-6789-0abc-def123456791'::uuid,
    'Monitoria de Cálculo 1',
    'Grupo de monitoria para Cálculo Diferencial e Integral',
    15, true, true,
    '11111111-1111-1111-1111-111111111111'::uuid
),
(
    '8a1b2c3d-4e5f-6789-0abc-def123456792'::uuid,
    'Projeto de Software - TCC',
    'Grupo para desenvolvimento de projetos de conclusão',
    6, false, true,
    '11111111-1111-1111-1111-111111111111'::uuid
);

-- Adicionar owner como membro dos grupos
INSERT INTO user_group (id, user_id, group_id, type) VALUES
    ('99999999-9999-9999-9999-999999999999'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid, 'OWNER'),
    ('99999999-9999-9999-9999-999999999998'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '8a1b2c3d-4e5f-6789-0abc-def123456790'::uuid, 'OWNER'),
    ('99999999-9999-9999-9999-999999999997'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '8a1b2c3d-4e5f-6789-0abc-def123456791'::uuid, 'OWNER'),
    ('99999999-9999-9999-9999-999999999996'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '8a1b2c3d-4e5f-6789-0abc-def123456792'::uuid, 'OWNER');
