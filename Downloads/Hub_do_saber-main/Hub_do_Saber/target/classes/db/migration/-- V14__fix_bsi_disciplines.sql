-- V14__fix_bsi_disciplines.sql
-- Remove todas as disciplinas antigas do BSI e insere as corretas

DO $$
DECLARE
  bsi_id UUID;
BEGIN
  SELECT id INTO bsi_id FROM course WHERE name = 'Sistemas de Informação' LIMIT 1;

  -- Limpa disciplinas antigas do BSI
  DELETE FROM discipline WHERE course_id = bsi_id;

  -- ==================== 1º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACIC39102 - Contabilidade e Análise de Demonstrativos Financeiros', bsi_id),
    (gen_random_uuid(), 'FACOM32101 - Informática e Sociedade', bsi_id),
    (gen_random_uuid(), 'FACOM32104 - Introdução aos Sistemas de Informação', bsi_id),
    (gen_random_uuid(), 'FACOM32105 - Lógica para Computação', bsi_id),
    (gen_random_uuid(), 'FACOM32102 - Algoritmos e Programação I', bsi_id);

  -- ==================== 2º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32201 - Algoritmos e Programação II', bsi_id),
    (gen_random_uuid(), 'FAGEN31102 - Fundamentos de Marketing', bsi_id),
    (gen_random_uuid(), 'FAGEN39531 - Gestão Empresarial', bsi_id),
    (gen_random_uuid(), 'FAMAT39214 - Cálculo I', bsi_id);

  -- ==================== 3º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32302 - Estrutura de Dados I', bsi_id),
    (gen_random_uuid(), 'FACOM32303 - Arquitetura e Organização de Computadores', bsi_id),
    (gen_random_uuid(), 'FACOM32305 - Programação Orientada a Objetos', bsi_id),
    (gen_random_uuid(), 'FAGEN39050 - Empreendedorismo', bsi_id),
    (gen_random_uuid(), 'FAMAT31022 - Álgebra Linear', bsi_id);

  -- ==================== 4º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32401 - Banco de Dados I', bsi_id),
    (gen_random_uuid(), 'FACOM32402 - Estrutura de Dados II', bsi_id),
    (gen_random_uuid(), 'FACOM32403 - Processo de Desenvolvimento de Software', bsi_id),
    (gen_random_uuid(), 'FACOM32404 - Sistemas Operacionais', bsi_id),
    (gen_random_uuid(), 'FAMAT32401 - Matemática para Ciência da Computação', bsi_id);

  -- ==================== 5º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32304 - Banco de Dados II', bsi_id),
    (gen_random_uuid(), 'FACOM32502 - Gestão da Qualidade de Software', bsi_id),
    (gen_random_uuid(), 'FACOM32503 - Programação para Dispositivos Móveis', bsi_id),
    (gen_random_uuid(), 'FACOM32504 - Redes de Computadores', bsi_id),
    (gen_random_uuid(), 'FAMAT39505 - Estatística', bsi_id);

  -- ==================== 6º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32602 - Ciência de Dados I', bsi_id),
    (gen_random_uuid(), 'FACOM32603 - Desenvolvimento Web I', bsi_id),
    (gen_random_uuid(), 'FACOM32604 - Gerência de Projetos em TI', bsi_id),
    (gen_random_uuid(), 'FACOM32605 - Organização e Recuperação da Informação', bsi_id),
    (gen_random_uuid(), 'FACOM32606 - Sistemas Distribuídos', bsi_id);

  -- ==================== 7º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32701 - Ciência de Dados II', bsi_id),
    (gen_random_uuid(), 'FACOM32702 - Desenvolvimento Web II', bsi_id),
    (gen_random_uuid(), 'FACOM32704 - Interação Humano-Computador', bsi_id),
    (gen_random_uuid(), 'FACOM32705 - Pesquisa Operacional', bsi_id),
    (gen_random_uuid(), 'GSI031 - Economia', bsi_id),
    (gen_random_uuid(), 'FACOM32703 - Projeto de Graduação I', bsi_id);

  -- ==================== 8º PERÍODO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32804 - Segurança da Informação', bsi_id),
    (gen_random_uuid(), 'FADIR39802 - Direito', bsi_id),
    (gen_random_uuid(), 'FAGEN32802 - Inovação e Gestão do Conhecimento', bsi_id),
    (gen_random_uuid(), 'FACOM32803 - Projeto de Graduação II', bsi_id);

  -- ==================== ESTÁGIO E EXTENSÃO ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACOM32801 - Estágio Curricular', bsi_id),
    (gen_random_uuid(), 'FACOM32301 - Atividades Curriculares de Extensão: Informática e Sociedade', bsi_id),
    (gen_random_uuid(), 'FACOM32501 - Atividades Curriculares de Extensão: Popularização de Ciência e Tecnologia', bsi_id),
    (gen_random_uuid(), 'FACOM32601 - Atividades Curriculares de Extensão: Transformação Digital na Sociedade', bsi_id);

  -- ==================== OPTATIVAS ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'FACED39020 - Língua Brasileira de Sinais - LIBRAS II', bsi_id),
    (gen_random_uuid(), 'FACOM39042 - Bioinformática', bsi_id),
    (gen_random_uuid(), 'FACOM39043 - Compiladores', bsi_id),
    (gen_random_uuid(), 'FACOM39044 - Criptografia', bsi_id),
    (gen_random_uuid(), 'FACOM39045 - Análise de Algoritmos', bsi_id),
    (gen_random_uuid(), 'FACOM39046 - Comércio Eletrônico e Portais Corporativos', bsi_id),
    (gen_random_uuid(), 'FACOM39047 - Computação Gráfica', bsi_id),
    (gen_random_uuid(), 'FACOM39048 - Computação Móvel', bsi_id),
    (gen_random_uuid(), 'FACOM39049 - Data Warehouse', bsi_id),
    (gen_random_uuid(), 'FACOM39050 - Inteligência Artificial', bsi_id),
    (gen_random_uuid(), 'FACOM39051 - Modelagem de Processos de Negócios', bsi_id),
    (gen_random_uuid(), 'FACOM39052 - Multimídia', bsi_id),
    (gen_random_uuid(), 'FACOM39053 - Processamento Digital de Imagens', bsi_id),
    (gen_random_uuid(), 'FACOM39054 - Linguagens Formais e Autômatos', bsi_id);

END $$;
