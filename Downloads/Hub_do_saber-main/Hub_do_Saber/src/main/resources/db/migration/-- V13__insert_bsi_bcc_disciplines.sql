-- V13__fix_all_disciplines.sql
-- Limpa TUDO e insere as grades corretas de BSI e BCC

DELETE FROM discipline
WHERE course_id IN (
  SELECT id FROM course
  WHERE name IN ('Sistemas de Informação', 'Ciência da Computação')
);

DO $$
DECLARE
  bsi_id UUID;
  bcc_id UUID;
BEGIN
  SELECT id INTO bsi_id FROM course WHERE name = 'Sistemas de Informação' LIMIT 1;
  SELECT id INTO bcc_id FROM course WHERE name = 'Ciência da Computação' LIMIT 1;

  -- ================================================================
  -- BSI — Sistemas de Informação (Currículo 2022/2)
  -- Códigos FACOM32xxx — grade DIFERENTE do BCC
  -- ================================================================

  INSERT INTO discipline (id, name, code, course_id) VALUES
    -- 1º PERÍODO
    (gen_random_uuid(), 'FACIC39102 - Contabilidade e Análise de Demonstrativos Financeiros', 'FACIC39102', bsi_id),
    (gen_random_uuid(), 'FACOM32101 - Informática e Sociedade', 'FACOM32101', bsi_id),
    (gen_random_uuid(), 'FACOM32104 - Introdução aos Sistemas de Informação', 'FACOM32104', bsi_id),
    (gen_random_uuid(), 'FACOM32105 - Lógica para Computação', 'FACOM32105', bsi_id),
    (gen_random_uuid(), 'FACOM32102 - Algoritmos e Programação I', 'FACOM32102', bsi_id),
    -- 2º PERÍODO
    (gen_random_uuid(), 'FACOM32201 - Algoritmos e Programação II', 'FACOM32201', bsi_id),
    (gen_random_uuid(), 'FAGEN31102 - Fundamentos de Marketing', 'FAGEN31102', bsi_id),
    (gen_random_uuid(), 'FAGEN39531 - Gestão Empresarial', 'FAGEN39531', bsi_id),
    (gen_random_uuid(), 'FAMAT39214 - Cálculo I', 'FAMAT39214', bsi_id),
    -- 3º PERÍODO
    (gen_random_uuid(), 'FACOM32302 - Estrutura de Dados I', 'FACOM32302', bsi_id),
    (gen_random_uuid(), 'FACOM32303 - Arquitetura e Organização de Computadores', 'FACOM32303', bsi_id),
    (gen_random_uuid(), 'FACOM32305 - Programação Orientada a Objetos', 'FACOM32305', bsi_id),
    (gen_random_uuid(), 'FAGEN39050 - Empreendedorismo', 'FAGEN39050', bsi_id),
    (gen_random_uuid(), 'FAMAT31022 - Álgebra Linear', 'FAMAT31022', bsi_id),
    -- 4º PERÍODO
    (gen_random_uuid(), 'FACOM32401 - Banco de Dados I', 'FACOM32401', bsi_id),
    (gen_random_uuid(), 'FACOM32402 - Estrutura de Dados II', 'FACOM32402', bsi_id),
    (gen_random_uuid(), 'FACOM32403 - Processo de Desenvolvimento de Software', 'FACOM32403', bsi_id),
    (gen_random_uuid(), 'FACOM32404 - Sistemas Operacionais', 'FACOM32404', bsi_id),
    (gen_random_uuid(), 'FAMAT32401 - Matemática para Ciência da Computação', 'FAMAT32401', bsi_id),
    -- 5º PERÍODO
    (gen_random_uuid(), 'FACOM32304 - Banco de Dados II', 'FACOM32304', bsi_id),
    (gen_random_uuid(), 'FACOM32502 - Gestão da Qualidade de Software', 'FACOM32502', bsi_id),
    (gen_random_uuid(), 'FACOM32503 - Programação para Dispositivos Móveis', 'FACOM32503', bsi_id),
    (gen_random_uuid(), 'FACOM32504 - Redes de Computadores', 'FACOM32504', bsi_id),
    (gen_random_uuid(), 'FAMAT39505 - Estatística', 'FAMAT39505', bsi_id),
    -- 6º PERÍODO
    (gen_random_uuid(), 'FACOM32602 - Ciência de Dados I', 'FACOM32602', bsi_id),
    (gen_random_uuid(), 'FACOM32603 - Desenvolvimento Web I', 'FACOM32603', bsi_id),
    (gen_random_uuid(), 'FACOM32604 - Gerência de Projetos em TI', 'FACOM32604', bsi_id),
    (gen_random_uuid(), 'FACOM32605 - Organização e Recuperação da Informação', 'FACOM32605', bsi_id),
    (gen_random_uuid(), 'FACOM32606 - Sistemas Distribuídos', 'FACOM32606', bsi_id),
    -- 7º PERÍODO
    (gen_random_uuid(), 'FACOM32701 - Ciência de Dados II', 'FACOM32701', bsi_id),
    (gen_random_uuid(), 'FACOM32702 - Desenvolvimento Web II', 'FACOM32702', bsi_id),
    (gen_random_uuid(), 'FACOM32704 - Interação Humano-Computador', 'FACOM32704', bsi_id),
    (gen_random_uuid(), 'FACOM32705 - Pesquisa Operacional', 'FACOM32705', bsi_id),
    (gen_random_uuid(), 'GSI031 - Economia', 'GSI031', bsi_id),
    (gen_random_uuid(), 'FACOM32703 - Projeto de Graduação I', 'FACOM32703', bsi_id),
    -- 8º PERÍODO
    (gen_random_uuid(), 'FACOM32804 - Segurança da Informação', 'FACOM32804', bsi_id),
    (gen_random_uuid(), 'FADIR39802 - Direito', 'FADIR39802', bsi_id),
    (gen_random_uuid(), 'FAGEN32802 - Inovação e Gestão do Conhecimento', 'FAGEN32802', bsi_id),
    (gen_random_uuid(), 'FACOM32803 - Projeto de Graduação II', 'FACOM32803', bsi_id),
    -- ESTÁGIO E EXTENSÃO
    (gen_random_uuid(), 'FACOM32801 - Estágio Curricular', 'FACOM32801', bsi_id),
    (gen_random_uuid(), 'FACOM32301 - Atividades Curriculares de Extensão: Informática e Sociedade', 'FACOM32301', bsi_id),
    (gen_random_uuid(), 'FACOM32501 - Atividades Curriculares de Extensão: Popularização de Ciência e Tecnologia', 'FACOM32501', bsi_id),
    (gen_random_uuid(), 'FACOM32601 - Atividades Curriculares de Extensão: Transformação Digital na Sociedade', 'FACOM32601', bsi_id),
    -- OPTATIVAS
    (gen_random_uuid(), 'FACED39020 - Língua Brasileira de Sinais - LIBRAS II', 'FACED39020', bsi_id),
    (gen_random_uuid(), 'FACOM39042 - Bioinformática', 'FACOM39042', bsi_id),
    (gen_random_uuid(), 'FACOM39043 - Compiladores', 'FACOM39043', bsi_id),
    (gen_random_uuid(), 'FACOM39044 - Criptografia', 'FACOM39044', bsi_id),
    (gen_random_uuid(), 'FACOM39045 - Análise de Algoritmos', 'FACOM39045', bsi_id),
    (gen_random_uuid(), 'FACOM39046 - Comércio Eletrônico e Portais Corporativos', 'FACOM39046', bsi_id),
    (gen_random_uuid(), 'FACOM39047 - Computação Gráfica', 'FACOM39047', bsi_id),
    (gen_random_uuid(), 'FACOM39048 - Computação Móvel', 'FACOM39048', bsi_id),
    (gen_random_uuid(), 'FACOM39049 - Data Warehouse', 'FACOM39049', bsi_id),
    (gen_random_uuid(), 'FACOM39050 - Inteligência Artificial', 'FACOM39050', bsi_id),
    (gen_random_uuid(), 'FACOM39051 - Modelagem de Processos de Negócios', 'FACOM39051', bsi_id),
    (gen_random_uuid(), 'FACOM39052 - Multimídia', 'FACOM39052', bsi_id),
    (gen_random_uuid(), 'FACOM39053 - Processamento Digital de Imagens', 'FACOM39053', bsi_id),
    (gen_random_uuid(), 'FACOM39054 - Linguagens Formais e Autômatos', 'FACOM39054', bsi_id);

  -- ================================================================
  -- BCC — Ciência da Computação (Currículo 2023-1)
  -- Códigos FACOM31xxx / GBCxxx — grade DIFERENTE do BSI
  -- ================================================================

  INSERT INTO discipline (id, name, code, course_id) VALUES
    -- 1º PERÍODO
    (gen_random_uuid(), 'FACOM31103 - Programação Procedimental', 'FACOM31103', bcc_id),
    (gen_random_uuid(), 'GBC013 - Geometria Analítica e Álgebra Linear', 'GBC013', bcc_id),
    (gen_random_uuid(), 'FAMAT39121 - Cálculo Diferencial e Integral I', 'FAMAT39121', bcc_id),
    (gen_random_uuid(), 'FACOM31102 - Introdução à Ciência da Computação', 'FACOM31102', bcc_id),
    (gen_random_uuid(), 'GBC016 - Lógica Para Computação', 'GBC016', bcc_id),
    -- 2º PERÍODO
    (gen_random_uuid(), 'FACOM31201 - Algoritmos e Estrutura de Dados I', 'FACOM31201', bcc_id),
    (gen_random_uuid(), 'GBC033 - Programação Funcional', 'GBC033', bcc_id),
    (gen_random_uuid(), 'FAMAT39215 - Cálculo Diferencial e Integral II', 'FAMAT39215', bcc_id),
    (gen_random_uuid(), 'FAMAT32401 - Matemática para Ciência da Computação', 'FAMAT32401', bcc_id),
    (gen_random_uuid(), 'FACOM31202 - Sistemas Digitais', 'FACOM31202', bcc_id),
    (gen_random_uuid(), 'GBC011 - Empreendedorismo em Informática', 'GBC011', bcc_id),
    -- 3º PERÍODO
    (gen_random_uuid(), 'FACOM31303 - Algoritmos e Estruturas de Dados II', 'FACOM31303', bcc_id),
    (gen_random_uuid(), 'FACOM31306 - Programação Orientada a Objetos', 'FACOM31306', bcc_id),
    (gen_random_uuid(), 'FAMAT39311 - Cálculo Diferencial e Integral III', 'FAMAT39311', bcc_id),
    (gen_random_uuid(), 'FAMAT31032 - Cálculo Numérico', 'FAMAT31032', bcc_id),
    (gen_random_uuid(), 'FACOM31305 - Arquitetura e Organização de Computadores', 'FACOM31305', bcc_id),
    (gen_random_uuid(), 'FACOM31304 - Atividades Curriculares de Extensão - Popularização Ciência e Tecnologia', 'FACOM31304', bcc_id),
    -- 4º PERÍODO
    (gen_random_uuid(), 'GBC025 - Programação Lógica', 'GBC025', bcc_id),
    (gen_random_uuid(), 'FACOM31401 - Princípios e Padrões de Projetos', 'FACOM31401', bcc_id),
    (gen_random_uuid(), 'GBC041 - Estatística', 'GBC041', bcc_id),
    (gen_random_uuid(), 'GBC042 - Teoria dos Grafos', 'GBC042', bcc_id),
    (gen_random_uuid(), 'GBC043 - Sistemas de Banco de Dados', 'GBC043', bcc_id),
    (gen_random_uuid(), 'GBC045 - Sistemas Operacionais', 'GBC045', bcc_id),
    -- 5º PERÍODO
    (gen_random_uuid(), 'FACOM31501 - Engenharia de Software', 'FACOM31501', bcc_id),
    (gen_random_uuid(), 'GBC044 - Linguagens Formais e Autômatos', 'GBC044', bcc_id),
    (gen_random_uuid(), 'GBC052 - Análise de Algoritmos', 'GBC052', bcc_id),
    (gen_random_uuid(), 'GBC063 - Inteligência Artificial', 'GBC063', bcc_id),
    (gen_random_uuid(), 'GBC053 - Gerenciamento de Banco de Dados', 'GBC053', bcc_id),
    (gen_random_uuid(), 'GBC056 - Arquitetura de Redes de Computadores', 'GBC056', bcc_id),
    (gen_random_uuid(), 'FACOM31502 - Atividades Curriculares de Extensão - Informática e Sociedade', 'FACOM31502', bcc_id),
    -- 6º PERÍODO
    (gen_random_uuid(), 'FACOM31601 - Otimização', 'FACOM31601', bcc_id),
    (gen_random_uuid(), 'GBC062 - Teoria da Computação', 'GBC062', bcc_id),
    (gen_random_uuid(), 'GBC065 - Modelagem e Simulação', 'GBC065', bcc_id),
    (gen_random_uuid(), 'GBC073 - Inteligência Computacional', 'GBC073', bcc_id),
    (gen_random_uuid(), 'GBC216 - Processamento Digital de Imagens', 'GBC216', bcc_id),
    (gen_random_uuid(), 'GBC066 - Arquitetura de Redes TCP/IP', 'GBC066', bcc_id),
    -- 7º PERÍODO
    (gen_random_uuid(), 'FACOM31706 - Programação para Internet', 'FACOM31706', bcc_id),
    (gen_random_uuid(), 'GBC071 - Construção de Compiladores', 'GBC071', bcc_id),
    (gen_random_uuid(), 'GBC074 - Sistemas Distribuídos', 'GBC074', bcc_id),
    (gen_random_uuid(), 'GBC204 - Computação Gráfica', 'GBC204', bcc_id),
    (gen_random_uuid(), 'FACOM31704 - Metodologia Científica em Computação e Informática', 'FACOM31704', bcc_id),
    (gen_random_uuid(), 'FACOM31705 - Atividades Curriculares de Extensão - Transformação Digital na Sociedade', 'FACOM31705', bcc_id),
    -- 8º PERÍODO
    (gen_random_uuid(), 'GBC061 - Gestão Empresarial', 'GBC061', bcc_id),
    (gen_random_uuid(), 'GBC081 - Direito e Legislação', 'GBC081', bcc_id),
    (gen_random_uuid(), 'GBC083 - Segurança da Informação', 'GBC083', bcc_id),
    (gen_random_uuid(), 'GBC212 - Mineração de Dados', 'GBC212', bcc_id),
    (gen_random_uuid(), 'FACOM31806 - Projeto de Graduação', 'FACOM31806', bcc_id),
    (gen_random_uuid(), 'FACOM31805 - Estágio Supervisionado', 'FACOM31805', bcc_id),
    -- OPTATIVAS
    (gen_random_uuid(), 'GBC202 - Bioinformática', 'GBC202', bcc_id),
    (gen_random_uuid(), 'GBC210 - Computação Evolutiva', 'GBC210', bcc_id),
    (gen_random_uuid(), 'GBC205 - Computação Móvel', 'GBC205', bcc_id),
    (gen_random_uuid(), 'GBC208 - Gerência de Projetos de Tecnologia da Informação', 'GBC208', bcc_id),
    (gen_random_uuid(), 'GBC209 - Inteligência Artificial Aplicada aos Negócios', 'GBC209', bcc_id),
    (gen_random_uuid(), 'LIBRAS01 - Língua Brasileira de Sinais - LIBRAS I', 'LIBRAS01', bcc_id),
    (gen_random_uuid(), 'LIBRAS02 - Língua Brasileira de Sinais - LIBRAS II', 'LIBRAS02', bcc_id),
    (gen_random_uuid(), 'GBC213 - Multimídia', 'GBC213', bcc_id),
    (gen_random_uuid(), 'GBC218 - Programação Paralela e Distribuída', 'GBC218', bcc_id),
    (gen_random_uuid(), 'GBC219 - Projeto de Redes de Computadores', 'GBC219', bcc_id),
    (gen_random_uuid(), 'GBC214 - Recuperação da Informação', 'GBC214', bcc_id),
    (gen_random_uuid(), 'GBC223 - Resolução de Problemas', 'GBC223', bcc_id),
    (gen_random_uuid(), 'GBC224 - Sistemas de Tempo Real', 'GBC224', bcc_id),
    (gen_random_uuid(), 'GBC225 - Tópicos de Informática na Educação', 'GBC225', bcc_id),
    (gen_random_uuid(), 'GBC226 - Tópicos em Tecnologias da Internet', 'GBC226', bcc_id),
    (gen_random_uuid(), 'GBC227 - Tópicos Especiais de Banco de Dados', 'GBC227', bcc_id),
    (gen_random_uuid(), 'GBC228 - Tópicos Especiais de Comércio Eletrônico', 'GBC228', bcc_id),
    (gen_random_uuid(), 'GBC229 - Tópicos Especiais de Engenharia de Software', 'GBC229', bcc_id),
    (gen_random_uuid(), 'GBC230 - Tópicos Especiais de Inteligência Artificial', 'GBC230', bcc_id),
    (gen_random_uuid(), 'GBC231 - Tópicos Especiais de Programação Orientada a Objetos', 'GBC231', bcc_id),
    (gen_random_uuid(), 'GBC232 - Tópicos Especiais de Programação para Internet', 'GBC232', bcc_id),
    (gen_random_uuid(), 'GBC233 - Tópicos Especiais de Projeto de Software', 'GBC233', bcc_id),
    (gen_random_uuid(), 'GBC234 - Tópicos Especiais em Redes de Computadores', 'GBC234', bcc_id),
    (gen_random_uuid(), 'GBC235 - Tópicos Especiais de Segurança da Informação', 'GBC235', bcc_id);

END $$;
