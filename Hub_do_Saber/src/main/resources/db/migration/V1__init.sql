CREATE TABLE course
(
    id            UUID         NOT NULL,
    name          VARCHAR(255) NOT NULL,
    university_id UUID,
    CONSTRAINT pk_course PRIMARY KEY (id)
);

CREATE TABLE discipline
(
    id          UUID         NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    code        VARCHAR(255) NOT NULL,
    semester    INTEGER      NOT NULL,
    course_id   UUID,
    CONSTRAINT pk_discipline PRIMARY KEY (id)
);

CREATE TABLE study_group
(
    id          UUID    NOT NULL,
    name        VARCHAR(255),
    description VARCHAR(255),
    max_members INTEGER NOT NULL,
    monitoring  BOOLEAN NOT NULL,
    active      BOOLEAN NOT NULL,
    CONSTRAINT pk_study_group PRIMARY KEY (id)
);

CREATE TABLE university
(
    id      UUID NOT NULL,
    name    VARCHAR(255),
    acronym VARCHAR(255),
    CONSTRAINT pk_university PRIMARY KEY (id)
);

CREATE TABLE user_discipline_interest
(
    id            UUID NOT NULL,
    user_id       UUID,
    discipline_id UUID,
    CONSTRAINT pk_user_discipline_interest PRIMARY KEY (id)
);

CREATE TABLE user_group
(
    id       UUID         NOT NULL,
    user_id  UUID         NOT NULL,
    group_id UUID         NOT NULL,
    type     VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user_group PRIMARY KEY (id)
);

CREATE TABLE users
(
    id            UUID         NOT NULL,
    matriculation VARCHAR(255) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    course_id     UUID,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE discipline
    ADD CONSTRAINT uc_discipline_code UNIQUE (code);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_matriculation UNIQUE (matriculation);

ALTER TABLE course
    ADD CONSTRAINT FK_COURSE_ON_UNIVERSITY FOREIGN KEY (university_id) REFERENCES university (id);

ALTER TABLE discipline
    ADD CONSTRAINT FK_DISCIPLINE_ON_COURSE FOREIGN KEY (course_id) REFERENCES course (id);

ALTER TABLE users
    ADD CONSTRAINT FK_USERS_ON_COURSE FOREIGN KEY (course_id) REFERENCES course (id);

ALTER TABLE user_discipline_interest
    ADD CONSTRAINT FK_USER_DISCIPLINE_INTEREST_ON_DISCIPLINE FOREIGN KEY (discipline_id) REFERENCES discipline (id);

ALTER TABLE user_discipline_interest
    ADD CONSTRAINT FK_USER_DISCIPLINE_INTEREST_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_GROUP FOREIGN KEY (group_id) REFERENCES study_group (id);

ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);