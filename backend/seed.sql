-- 1. เคลียร์ตารางเก่าและสร้างใหม่ก่อน
.read schema.sql

-- 2. นำเข้าข้อมูลจากไฟล์ต่าง ๆ ตามลำดับ
.read data_bodyweight.sql
.read data_dumbbells.sql
.read data_machines.sql
