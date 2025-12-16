-- V3__add_user_active_column_and_user_group_fk.sql

ALTER TABLE users 
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE user_group
    ADD CONSTRAINT FK_USER_GROUP_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);