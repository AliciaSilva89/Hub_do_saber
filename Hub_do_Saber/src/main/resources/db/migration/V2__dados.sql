WITH ufu AS (
INSERT INTO university (id, name, acronym)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid, 'Universidade Federal de Uberlândia', 'UFU')
    RETURNING id
    ),

-- Inserir cursos vinculados à UFU
    cursos AS (
INSERT INTO course (id, name, university_id) VALUES
    ('c1d2e3f4-a5b6-7890-1234-567890abcdef'::uuid, 'Sistemas de Informação', (SELECT id FROM ufu)),
    ('f4e3d2c1-b6a5-0987-4321-fedcba098765'::uuid, 'Ciência da Computação', (SELECT id FROM ufu))
    RETURNING id, name
    )

-- Inserir disciplinas para cada curso
INSERT INTO discipline (id, name, description, code, semester, course_id)
SELECT 'd1e2f3a4-b5c6-7890-1234-567890abcdef'::uuid, 'Programação para Internet', 'Desenvolvimento web e aplicações para internet', 'SI-PI', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'e2f3a4b5-c6d7-8901-2345-67890abcdef1'::uuid, 'Estrutura de Dados 1', 'Introdução a estruturas de dados', 'SI-ED1', 2, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'f3a4b5c6-d7e8-9012-3456-7890abcdef12'::uuid, 'Estrutura de Dados 2', 'Estruturas de dados avançadas', 'SI-ED2', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'a4b5c6d7-e8f9-0123-4567-890abcdef123'::uuid, 'Cálculo 1', 'Cálculo diferencial e integral', 'SI-C1', 1, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'b5c6d7e8-f9a0-1234-5678-90abcdef1234'::uuid, 'Cálculo 2', 'Continuação de cálculo', 'SI-C2', 2, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'c6d7e8f9-a0b1-2345-6789-0abcdef12345'::uuid, 'Projetos de Desenvolvimento de Software 1', 'Metodologias de desenvolvimento de software', 'SI-PDS1', 4, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'd7e8f9a0-b1c2-3456-7890-abcdef123456'::uuid, 'Projetos de Desenvolvimento de Software 2', 'Projetos avançados de software', 'SI-PDS2', 5, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'e8f9a0b1-c2d3-4567-8901-bcdef1234567'::uuid, 'Banco de Dados 1', 'Modelagem e implementação de bancos de dados', 'SI-BD1', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT 'f9a0b1c2-d3e4-5678-9012-cdef12345678'::uuid, 'Banco de Dados 2', 'Tópicos avançados em bancos de dados', 'SI-BD2', 4, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT '0a1b2c3d-4e5f-6789-0123-456789abcdef'::uuid, 'Programação para Internet', 'Desenvolvimento web e aplicações para internet', 'CC-PI', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '1b2c3d4e-5f6a-7890-1234-56789abcdef0'::uuid, 'Estrutura de Dados 1', 'Introdução a estruturas de dados', 'CC-ED1', 2, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '2c3d4e5f-6a7b-8901-2345-6789abcdef01'::uuid, 'Estrutura de Dados 2', 'Estruturas de dados avançadas', 'CC-ED2', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '3d4e5f6a-7b8c-9012-3456-789abcdef012'::uuid, 'Cálculo 1', 'Cálculo diferencial e integral', 'CC-C1', 1, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '4e5f6a7b-8c9d-0123-4567-89abcdef0123'::uuid, 'Cálculo 2', 'Continuação de cálculo', 'CC-C2', 2, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '5f6a7b8c-9d0e-1234-5678-9abcdef01234'::uuid, 'Projetos de Desenvolvimento de Software 1', 'Metodologias de desenvolvimento de software', 'CC-PDS1', 4, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '6a7b8c9d-0e1f-2345-6789-abcdef012345'::uuid, 'Projetos de Desenvolvimento de Software 2', 'Projetos avançados de software', 'CC-PDS2', 5, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '7b8c9d0e-1f2a-3456-7890-bcdef0123456'::uuid, 'Banco de Dados 1', 'Modelagem e implementação de bancos de dados', 'CC-BD1', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT '8c9d0e1f-2a3b-4567-8901-cdef01234567'::uuid, 'Banco de Dados 2', 'Tópicos avançados em bancos de dados', 'CC-BD2', 4, id FROM cursos WHERE name = 'Ciência da Computação';