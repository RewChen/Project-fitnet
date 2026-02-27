DROP TABLE IF EXISTS exercises;

CREATE TABLE exercises (
    exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    difficulty TEXT CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);