CREATE TABLE city
(
    id    UUID NOT NULL,
    name  VARCHAR(255),
    state VARCHAR(255),
    CONSTRAINT pk_city PRIMARY KEY (id)
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
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_matriculation UNIQUE (matriculation);

ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_GROUP FOREIGN KEY (group_id) REFERENCES study_group (id);

ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);