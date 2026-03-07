-- V1__create_initial_structure.sql

-- Garante que vamos usar o schema public
SET search_path TO public;

-- Tabelas DDL
CREATE TABLE public.course
(
    id              UUID         NOT NULL,
    name            VARCHAR(255) NOT NULL,
    university_id   UUID         NOT NULL,
    CONSTRAINT pk_course PRIMARY KEY (id)
);

CREATE TABLE public.discipline
(
    id            UUID         NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   VARCHAR(255),
    code          VARCHAR(255) NOT NULL,
    semester      INTEGER,
    course_id     UUID         NOT NULL,
    CONSTRAINT pk_discipline PRIMARY KEY (id)
);

CREATE TABLE public.study_group
(
    id            UUID    NOT NULL,
    name          VARCHAR(255),
    description   VARCHAR(255),
    max_members   INTEGER NOT NULL,
    monitoring    BOOLEAN NOT NULL,
    active        BOOLEAN NOT NULL,
    discipline_id UUID,
    CONSTRAINT pk_study_group PRIMARY KEY (id)
);

CREATE TABLE public.university
(
    id      UUID         NOT NULL,
    name    VARCHAR(255) NOT NULL,
    acronym VARCHAR(255) NOT NULL,
    CONSTRAINT pk_university PRIMARY KEY (id)
);

CREATE TABLE public.user_discipline_interest
(
    id            UUID NOT NULL,
    user_id       UUID,
    discipline_id UUID,
    CONSTRAINT pk_user_discipline_interest PRIMARY KEY (id)
);

CREATE TABLE public.user_group
(
    id       UUID         NOT NULL,
    user_id  UUID         NOT NULL,
    group_id UUID         NOT NULL,
    type     VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_group PRIMARY KEY (id)
);

CREATE TABLE public.users
(
    id            UUID         NOT NULL,
    matriculation VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    course_id     UUID,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

-- Índices e Restrições de Unicidade
ALTER TABLE public.users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE public.users
    ADD CONSTRAINT uc_users_matriculation UNIQUE (matriculation);

-- Chaves Estrangeiras (Foreign Keys)
ALTER TABLE public.course
    ADD CONSTRAINT FK_COURSE_ON_UNIVERSITY FOREIGN KEY (university_id) REFERENCES public.university (id);

ALTER TABLE public.discipline
    ADD CONSTRAINT FK_DISCIPLINE_ON_COURSE FOREIGN KEY (course_id) REFERENCES public.course (id);

ALTER TABLE public.study_group
    ADD CONSTRAINT FK_STUDY_GROUP_ON_DISCIPLINE FOREIGN KEY (discipline_id) REFERENCES public.discipline (id);

ALTER TABLE public.users
    ADD CONSTRAINT FK_USERS_ON_COURSE FOREIGN KEY (course_id) REFERENCES public.course (id);

ALTER TABLE public.user_discipline_interest
    ADD CONSTRAINT FK_USER_DISCIPLINE_INTEREST_ON_DISCIPLINE FOREIGN KEY (discipline_id) REFERENCES public.discipline (id);

ALTER TABLE public.user_discipline_interest
    ADD CONSTRAINT FK_USER_DISCIPLINE_INTEREST_ON_USER FOREIGN KEY (user_id) REFERENCES public.users (id);

ALTER TABLE public.user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_GROUP FOREIGN KEY (group_id) REFERENCES public.study_group (id);

-- A FK para users está faltando e será adicionada na V3!
