const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// เชื่อมต่อฐานข้อมูล
const db = new sqlite3.Database('./databese.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

app.get('/api/exercises', (req, res) => {

    const sql = 'SELECT * FROM exercises ORDER BY muscle_group ASC, name_th ASC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
});

// API สำหรับกรองข้อมูลตาม อุปกรณ์ และ กล้ามเนื้อ
app.get('/api/exercises/filter', (req, res) => {
    // รับค่าจากปุ่มที่ Frontend กดส่งมา
    const { equipment, muscle } = req.query; 
    
    let sql = 'SELECT * FROM exercises WHERE 1=1';
    let params = [];

    // ลำดับที่ 1: กรองตามอุปกรณ์ (ถ้าไม่ใช่ปุ่ม "ทั้งหมด")
    if (equipment && equipment !== 'ทั้งหมด') {
        sql += ' AND equipment = ?';
        params.push(equipment);
    }

    // ลำดับที่ 2: กรองตามกล้ามเนื้อ (ถ้าไม่ใช่ปุ่ม "ทั้งหมด")
    if (muscle && muscle !== 'ทั้งหมด') {
        sql += ' AND muscle_group = ?';
        params.push(muscle);
    }

    // จัดระเบียบให้เรียงตามชื่อไทยเสมอ
    sql += ' ORDER BY name_th ASC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API สำหรับดึงข้อมูลท่าเดียวมาโชว์ในหน้ารายละเอียด/Popup
app.get('/api/exercises/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM exercises WHERE exercise_id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        res.json(row);
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});