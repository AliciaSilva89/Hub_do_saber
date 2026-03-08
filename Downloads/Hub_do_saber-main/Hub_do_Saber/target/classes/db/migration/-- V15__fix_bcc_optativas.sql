-- V15__fix_bcc_optativas.sql
DO $$
DECLARE
  bcc_id UUID;
BEGIN
  SELECT id INTO bcc_id FROM course WHERE name = 'Ciência da Computação' LIMIT 1;

  -- Remove optativas antigas do BCC para reinserir corretamente
  DELETE FROM discipline
  WHERE course_id = bcc_id
    AND name LIKE '%GBC2%' OR (
      course_id = bcc_id AND name LIKE '%LIBRAS%'
    );

  -- ==================== OPTATIVAS COMPLETAS ====================
  INSERT INTO discipline (id, name, course_id) VALUES
    (gen_random_uuid(), 'GBC202 - Bioinformática', bcc_id),
    (gen_random_uuid(), 'GBC210 - Computação Evolutiva', bcc_id),
    (gen_random_uuid(), 'GBC205 - Computação Móvel', bcc_id),
    (gen_random_uuid(), 'GBC208 - Gerência de Projetos de Tecnologia da Informação', bcc_id),
    (gen_random_uuid(), 'GBC209 - Inteligência Artificial Aplicada aos Negócios', bcc_id),
    (gen_random_uuid(), 'LIBRAS01 - Língua Brasileira de Sinais - LIBRAS I', bcc_id),
    (gen_random_uuid(), 'LIBRAS02 - Língua Brasileira de Sinais - LIBRAS II', bcc_id),
    (gen_random_uuid(), 'GBC213 - Multimídia', bcc_id),
    (gen_random_uuid(), 'GBC218 - Programação Paralela e Distribuída', bcc_id),
    (gen_random_uuid(), 'GBC219 - Projeto de Redes de Computadores', bcc_id),
    (gen_random_uuid(), 'GBC214 - Recuperação da Informação', bcc_id),
    (gen_random_uuid(), 'GBC223 - Resolução de Problemas', bcc_id),
    (gen_random_uuid(), 'GBC224 - Sistemas de Tempo Real', bcc_id),
    (gen_random_uuid(), 'GBC225 - Tópicos de Informática na Educação', bcc_id),
    (gen_random_uuid(), 'GBC226 - Tópicos em Tecnologias da Internet', bcc_id),
    (gen_random_uuid(), 'GBC227 - Tópicos Especiais de Banco de Dados', bcc_id),
    (gen_random_uuid(), 'GBC228 - Tópicos Especiais de Comércio Eletrônico', bcc_id),
    (gen_random_uuid(), 'GBC229 - Tópicos Especiais de Engenharia de Software', bcc_id),
    (gen_random_uuid(), 'GBC230 - Tópicos Especiais de Inteligência Artificial', bcc_id),
    (gen_random_uuid(), 'GBC231 - Tópicos Especiais de Programação Orientada a Objetos', bcc_id),
    (gen_random_uuid(), 'GBC232 - Tópicos Especiais de Programação para Internet', bcc_id),
    (gen_random_uuid(), 'GBC233 - Tópicos Especiais de Projeto de Software', bcc_id),
    (gen_random_uuid(), 'GBC234 - Tópicos Especiais em Redes de Computadores', bcc_id),
    (gen_random_uuid(), 'GBC235 - Tópicos Especiais de Segurança da Informação', bcc_id);

END $$;
