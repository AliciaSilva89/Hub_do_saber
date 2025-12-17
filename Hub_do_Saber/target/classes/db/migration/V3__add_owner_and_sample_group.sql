-- ================================================
-- QUERIES PARA TESTAR E VERIFICAR OS DADOS
-- ================================================

-- 1. Verificar se a universidade foi criada
SELECT * FROM university;

-- 2. Verificar se os cursos foram criados
SELECT c.*, u.name as university_name, u.acronym
FROM course c
JOIN university u ON c.university_id = u.id;

-- 3. Verificar todas as disciplinas
SELECT d.*, c.name as course_name
FROM discipline d
JOIN course c ON d.course_id = c.id
ORDER BY c.name, d.semester;

-- 4. Verificar o usuário de exemplo
SELECT * FROM users;

-- 5. Verificar os grupos de estudo
SELECT 
    sg.id,
    sg.name,
    sg.description,
    sg.max_members,
    sg.monitoring,
    sg.active,
    d.name as discipline_name,
    u.name as owner_name
FROM study_group sg
LEFT JOIN discipline d ON sg.discipline_id = d.id
LEFT JOIN users u ON sg.owner_id = u.id;

-- 6. Verificar membros dos grupos
SELECT 
    ug.id,
    u.name as user_name,
    sg.name as group_name,
    ug.type as member_type
FROM user_group ug
JOIN users u ON ug.user_id = u.id
JOIN study_group sg ON ug.group_id = sg.id;

-- 7. QUERY ESPECÍFICA: Buscar o grupo que está dando erro
SELECT 
    sg.id,
    sg.name,
    sg.description,
    sg.max_members,
    sg.monitoring,
    sg.active,
    d.name as discipline_name,
    d.code as discipline_code,
    c.name as course_name,
    u.name as owner_name,
    u.email as owner_email,
    uni.name as university_name
FROM study_group sg
LEFT JOIN discipline d ON sg.discipline_id = d.id
LEFT JOIN course c ON d.course_id = c.id
LEFT JOIN university uni ON c.university_id = uni.id
LEFT JOIN users u ON sg.owner_id = u.id
WHERE sg.id = '8a1b2c3d-4e5f-6789-0abc-def123456789'::uuid;

-- 8. Contar membros por grupo
SELECT 
    sg.name as group_name,
    COUNT(ug.id) as total_members,
    sg.max_members,
    (sg.max_members - COUNT(ug.id)) as available_spots
FROM study_group sg
LEFT JOIN user_group ug ON sg.group_id = ug.group_id
GROUP BY sg.id, sg.name, sg.max_members;

-- ================================================
-- QUERIES PARA LIMPAR/RESETAR (SE NECESSÁRIO)
-- ================================================

-- CUIDADO: Isso vai apagar TODOS os dados!
-- Descomente apenas se quiser resetar tudo

-- DELETE FROM user_group;
-- DELETE FROM user_discipline_interest;
-- DELETE FROM study_group;
-- DELETE FROM users;
-- DELETE FROM discipline;
-- DELETE FROM course;
-- DELETE FROM university;