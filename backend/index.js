const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // สำคัญสำหรับ Railway

app.use(cors());
app.use(express.json());

// เชื่อมต่อฐานข้อมูล
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});


// 1. ดึงข้อมูลทั้งหมด
app.get('/api/exercises', (req, res) => {
    const sql = 'SELECT * FROM exercises ORDER BY muscle_group ASC, name_th ASC';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// 2. ค้นหาและกรอง
app.get('/api/exercises/filter', (req, res) => {
    const { equipment, muscle } = req.query;

    let sql = 'SELECT * FROM exercises WHERE 1=1';
    let params = [];

    if (equipment && equipment !== 'ทั้งหมด') {
        sql += ' AND equipment LIKE ?';
        params.push('%' + equipment + '%');
    }

    if (muscle && muscle !== 'ทั้งหมด') {
        sql += ' AND muscle_group = ?';
        params.push(muscle);
    }

    sql += ' ORDER BY name_th ASC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// 3. ดึงข้อมูลตาม ID
app.get('/api/exercises/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM exercises WHERE exercise_id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }

        res.json(row);
    });
});


// 4. เพิ่มข้อมูล (Admin)
app.post('/api/exercises', (req, res) => {

    const authHeader = req.headers['authorization'];

    if (authHeader !== 'Bearer admin1234') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
        name_th,
        name_en,
        difficulty,
        muscle_group,
        secondary_muscle,
        equipment,
        duration,
        description,
        instructions,
        media_url,
        video_url
    } = req.body;

    const sql = `
        INSERT INTO exercises 
        (name_th, name_en, difficulty, muscle_group, secondary_muscle, equipment, duration, description, instructions, media_url, video_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        name_th,
        name_en,
        difficulty,
        muscle_group,
        secondary_muscle,
        equipment,
        duration,
        description,
        instructions,
        media_url,
        video_url
    ];

    db.run(sql, params, function (err) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: 'เพิ่มข้อมูลสำเร็จ!',
            exercise_id: this.lastID
        });
    });
});


// 5. ลบข้อมูล
app.delete('/api/exercises/:id', (req, res) => {

    const authHeader = req.headers['authorization'];

    if (authHeader !== 'Bearer admin1234') {
        return res.status(401).json({ error: 'Unauthorized: รหัสผ่านไม่ถูกต้อง' });
    }

    const id = req.params.id;

    const sql = 'DELETE FROM exercises WHERE exercise_id = ?';

    db.run(sql, [id], function (err) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }

        res.json({
            message: `ลบข้อมูลท่าฝึกไอดี ${id} สำเร็จเรียบร้อยแล้ว!`,
            changes: this.changes
        });
    });
});


// start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});