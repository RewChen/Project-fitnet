
DELETE FROM exercises;


INSERT INTO exercises (name_th, name_en, difficulty, muscle_group, equipment, duration, description, instructions, media_url, video_url) 
VALUES 

('วิดพื้น', 'Push-ups', 'Beginner', 'หน้าอก', 'น้ำหนักตัว', '5-10 นาที', '...', '...', 'url_รูป', 'url_คลิป'),
('สควอท', 'Squat', 'Beginner', 'ขา', 'น้ำหนักตัว', '8-12 นาที', '...', '...', 'url_รูป', 'url_คลิป'),

('ดัมเบล โรส', 'Dumbbell Row', 'Intermediate', 'หลัง', 'ดัมเบล', '10-15 นาที', '...', '...', 'url_รูป', 'url_คลิป'),
('ดัมเบล เคิร์ล', 'Dumbbell Curl', 'Beginner', 'แขน', 'ดัมเบล', '5-10 นาที', '...', '...', 'url_รูป', 'url_คลิป'),

('เลกเพรส', 'Leg Press', 'Beginner', 'ขา', 'เครื่องเล่น', '10-15 นาที', '...', '...', 'url_รูป', 'url_คลิป');