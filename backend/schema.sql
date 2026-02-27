
DROP TABLE IF EXISTS exercises;

CREATE TABLE exercises (
    exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT,
    difficulty TEXT, -- Beginner, Intermediate, Advanced
    muscle_group TEXT, -- หน้าอก, หลัง, ขา, แขน, หน้าท้อง
    equipment TEXT, -- Bodyweight, Gym
    duration TEXT, -- เช่น '5-10 นาที'
    description TEXT, -- คำอธิบายสั้นๆ
    instructions TEXT, -- วิธีฝึก (อาจเก็บเป็นข้อความยาวๆ หรือ JSON)
    benefits TEXT, -- ประโยชน์หลัก
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);