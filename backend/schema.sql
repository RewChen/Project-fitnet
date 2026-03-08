
DROP TABLE IF EXISTS exercises;


CREATE TABLE exercises (
    exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT,
    difficulty TEXT, 
    muscle_group TEXT, 
    equipment TEXT, 
    duration TEXT, 
    description TEXT, 
    instructions TEXT, 
    benefits TEXT, 
    media_url TEXT,
    video_url TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);