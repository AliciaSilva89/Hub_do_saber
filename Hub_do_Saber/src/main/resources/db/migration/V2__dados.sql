WITH ufu AS (
    INSERT INTO university (id, name, acronym)
    VALUES (gen_random_uuid(), 'Universidade Federal de Uberlândia', 'UFU')
    RETURNING id
),

-- Inserir cursos vinculados à UFU
cursos AS (
    INSERT INTO course (id, name, university_id) VALUES
        (gen_random_uuid(), 'Sistemas de Informação', (SELECT id FROM ufu)),
        (gen_random_uuid(), 'Ciência da Computação', (SELECT id FROM ufu))
    RETURNING id, name
)

-- Inserir disciplinas para cada curso
INSERT INTO discipline (id, name, description, code, semester, course_id)
SELECT gen_random_uuid(), 'Programação para Internet', 'Desenvolvimento web e aplicações para internet', 'SI-PI', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Estrutura de Dados 1', 'Introdução a estruturas de dados', 'SI-ED1', 2, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Estrutura de Dados 2', 'Estruturas de dados avançadas', 'SI-ED2', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Cálculo 1', 'Cálculo diferencial e integral', 'SI-C1', 1, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Cálculo 2', 'Continuação de cálculo', 'SI-C2', 2, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Projetos de Desenvolvimento de Software 1', 'Metodologias de desenvolvimento de software', 'SI-PDS1', 4, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Projetos de Desenvolvimento de Software 2', 'Projetos avançados de software', 'SI-PDS2', 5, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Banco de Dados 1', 'Modelagem e implementação de bancos de dados', 'SI-BD1', 3, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Banco de Dados 2', 'Tópicos avançados em bancos de dados', 'SI-BD2', 4, id FROM cursos WHERE name = 'Sistemas de Informação'
UNION ALL
SELECT gen_random_uuid(), 'Programação para Internet', 'Desenvolvimento web e aplicações para internet', 'CC-PI', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Estrutura de Dados 1', 'Introdução a estruturas de dados', 'CC-ED1', 2, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Estrutura de Dados 2', 'Estruturas de dados avançadas', 'CC-ED2', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Cálculo 1', 'Cálculo diferencial e integral', 'CC-C1', 1, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Cálculo 2', 'Continuação de cálculo', 'CC-C2', 2, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Projetos de Desenvolvimento de Software 1', 'Metodologias de desenvolvimento de software', 'CC-PDS1', 4, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Projetos de Desenvolvimento de Software 2', 'Projetos avançados de software', 'CC-PDS2', 5, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Banco de Dados 1', 'Modelagem e implementação de bancos de dados', 'CC-BD1', 3, id FROM cursos WHERE name = 'Ciência da Computação'
UNION ALL
SELECT gen_random_uuid(), 'Banco de Dados 2', 'Tópicos avançados em bancos de dados', 'CC-BD2', 4, id FROM cursos WHERE name = 'Ciência da Computação';
