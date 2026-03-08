const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); 

const db = new sqlite3.Database('./databese.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

// 1. ดึงข้อมูลทั้งหมด (Public API)
app.get('/api/exercises', (req, res) => {
    const sql = 'SELECT * FROM exercises ORDER BY muscle_group ASC, name_th ASC';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. ค้นหาและกรองข้อมูล (Public API)
app.get('/api/exercises/filter', (req, res) => {
    const { equipment, muscle } = req.query; 
    let sql = 'SELECT * FROM exercises WHERE 1=1';
    let params = [];

    if (equipment && equipment !== 'ทั้งหมด') {
        sql += ' AND equipment = ?';
        params.push(equipment);
    }
    if (muscle && muscle !== 'ทั้งหมด') {
        sql += ' AND muscle_group = ?';
        params.push(muscle);
    }
    sql += ' ORDER BY name_th ASC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. ดึงข้อมูลท่าเดียว (Public API)
app.get('/api/exercises/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM exercises WHERE exercise_id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        res.json(row);
    });
});

//  4. เพิ่มท่าฝึกใหม่ (Protected API - ต้องมีรหัสผ่าน) 
// นี่คือส่วนที่จะใช้ Postman ยิงเข้ามาครับ และตอบโจทย์ของอาจารย์ด้วย
app.post('/api/exercises', (req, res) => {
    // เช็ครหัสผ่านจาก Header
    const authHeader = req.headers['authorization'];
    
    // ตั้งรหัสผ่านแอดมินไว้ที่ 'admin1234' (เปลี่ยนได้ตามใจชอบ)
    if (authHeader !== 'Bearer admin1234') {
        return res.status(401).json({ error: 'Unauthorized: รหัสผ่านแอดมินไม่ถูกต้อง' });
    }

    const { name_th, name_en, difficulty, muscle_group, equipment, duration, description, instructions, benefits, media_url } = req.body;

    const sql = `INSERT INTO exercises (name_th, name_en, difficulty, muscle_group, equipment, duration, description, instructions, benefits, media_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [name_th, name_en, difficulty, muscle_group, equipment, duration, description, instructions, benefits, media_url];

    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'เพิ่มข้อมูลท่าออกกำลังกายสำเร็จ!',
            exercise_id: this.lastID 
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});