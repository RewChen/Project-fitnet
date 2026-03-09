# 🏋️‍♂️ MuscleFit

โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา **การดำเนินงานการพัฒนาซอฟต์แวร์ (DevOps)** และ **การพัฒนาซอฟต์แวร์ส่วนหลัง (Back-end Development)** พัฒนาโดยกลุ่ม "เทอมที่ฮาเอาแต้" จากสาขาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยพะเยา (University of Phayao) สำหรับปีการศึกษา 2568

This project is part of the DevOps and Back-end Development courses. It is a comprehensive fitness web application developed by the "Term Tee Ha Ao Tae" group from the Software Engineering Department, University of Phayao, for the 2025 academic year.

## ✨ Completed Features (ฟีเจอร์ที่ใช้งานได้จริง)
- **Exercise Database:** ค้นหาและแสดงรายการท่าออกกำลังกาย โดยกรองตาม "ส่วนกล้ามเนื้อ" และ "ระดับความยาก"
- **Step-by-step & Video:** แสดงรายละเอียดท่าทาง วิธีการฝึกอย่างละเอียด พร้อมวิดีโอสาธิต (YouTube Embed)
- **Workout Plan:** ระบบจัดตารางฝึกประจำวัน (จันทร์-อาทิตย์) 
- **Export to Image:** ฟีเจอร์บันทึกตารางการฝึกของทั้งสัปดาห์ออกมาเป็นรูปภาพ
- **Favorites:** ระบบบันทึกท่าออกกำลังกายที่ชื่นชอบ (ใช้งานผ่าน)
- **Health Calculator:** เครื่องมือคำนวณสุขภาพองค์รวม (BMI, BMR และ TDEE)
- **Responsive Design:** รองรับการใช้งานทุกอุปกรณ์ (Mobile, Tablet, Desktop)

## 🛠 Tech Stack
**Frontend:**
- Vue.js 3 (Vite)
- Tailwind CSS
- HTML5 / CSS3 / JavaScript
- Lucide Icons (for UI icons)
- html2canvas (for image exporting)

**Backend & Database:**
- Node.js / Express.js (API Server)
- SQLite (Relational Database)

## 👨‍💻 Team Members (ตำแหน่งงานของทีม)

| Student ID | Name | Position |
| :--- | :--- | :--- |
| 67024986 | Thanakorn Chaipian | Project Owner / Backend |
| 67025033 | Pontakon Unmueabg | Business Analysis / UX UI |
| 67022614 | NATTHAPHONG AINKHAM | Project Owner / Developer |

## 📞 Contact
หากมีคำถาม สามารถติดต่อได้ทางนี้:
- **E-mail:** 67024986@up.ac.th
- **Phone:** 098-732-9980

---

## 🚀 Project Setup (การติดตั้งเพื่อรันโปรเจกต์)

**Recommended IDE:** VS Code + Vue (Official) extension.

```bash
# 1. Install dependencies
npm install

# 2. Compile and Hot-Reload for Development
npm run dev

# 3. Compile and Minify for Production
npm run build
