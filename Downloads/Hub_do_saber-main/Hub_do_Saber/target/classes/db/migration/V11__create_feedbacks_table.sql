CREATE TABLE feedbacks (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     VARCHAR(500) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id)
);
