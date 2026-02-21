<script setup>
import { ref, reactive } from 'vue'

// --- แอปพลิเคชันสเตตหลัก (Main Application State) ---
const isSubmitting = ref(false)
const showSuccess = ref(false)
const lastAddedName = ref('')
const recentList = ref([])

// --- ข้อมูลจำลองสำหรับตัวเลือก (Mock Options) ---
const musclesOptions = ['อกส่วนบน', 'อกส่วนกลาง', 'หลังแขน', 'หัวไหล่', 'ปีกหลัง', 'หน้าท้อง']
const equipmentOptions = ['Bodyweight', 'Dumbbell', 'Barbell', 'Kettlebell']

// --- ข้อมูลในฟอร์ม (Form Data State) ---
// ตรวจสอบโครงสร้าง Object ให้ถูกต้องตามมาตรฐาน JavaScript/Vue
const form = reactive({
  nameTh: '',
  nameEn: '',
  difficulty: 'Beginner',
  category: 'Chest',
  selectedMuscles: [],
  equipment: 'Bodyweight'
})

// --- ฟังก์ชันจัดการการส่งข้อมูล (Form Submission Logic) ---
const handleSubmit = () => {
  if (!form.nameTh) return
  
  isSubmitting.value = true
  
  // จำลองกระบวนการเชื่อมต่อ API (Simulate API Call)
  setTimeout(() => {
    const newItem = {
      nameTh: form.nameTh,
      nameEn: form.nameEn,
      difficulty: form.difficulty,
      category: form.category,
      selectedMuscles: [...form.selectedMuscles],
      equipment: form.equipment,
      timestamp: new Date().toLocaleTimeString('th-TH')
    }
    
    recentList.value.unshift(newItem)
    lastAddedName.value = form.nameTh
    
    isSubmitting.value = false
    showSuccess.value = true
    
    resetForm()
  }, 800)
}

// --- ฟังก์ชันล้างค่าในฟอร์ม (Reset Form Logic) ---
const resetForm = () => {
  form.nameTh = ''
  form.nameEn = ''
  form.difficulty = 'Beginner'
  form.category = 'Chest'
  form.selectedMuscles = []
  form.equipment = 'Bodyweight'
}

// --- ฟังก์ชันลบรายการ (Delete Item Logic) ---
const removeItem = (index) => {
  recentList.value.splice(index, 1)
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 font-['Kanit'] text-slate-800">
    <!-- แถบด้านข้าง (Sidebar) -->
    <aside class="w-64 bg-slate-900 text-white p-6 hidden md:block sticky top-0 h-screen shadow-2xl">
      <div class="flex items-center gap-3 mb-10">
        <div class="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="text-xl font-bold uppercase tracking-widest">Admin</span>
      </div>
      <nav class="space-y-4">
        <a href="#" class="flex items-center gap-3 p-4 bg-blue-600 rounded-2xl font-medium shadow-lg shadow-blue-600/20 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" stroke-width="2"></path></svg>
          จัดการท่าฝึก
        </a>
        <a href="#" class="flex items-center gap-3 p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"></path></svg>
          ผู้ดูแลระบบ
        </a>
      </nav>
    </aside>

    <!-- เนื้อหาหลัก (Main Content Area) -->
    <main class="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 class="text-4xl font-bold text-slate-800 tracking-tight">ระบบจัดการท่าออกกำลังกาย</h1>
          <p class="text-slate-400 mt-2">เพิ่มและแก้ไขฐานข้อมูลด้วย Vue.js</p>
        </div>
        <button class="bg-white text-slate-600 px-8 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
          Export CSV
        </button>
      </header>

      <div class="grid lg:grid-cols-3 gap-10">
        <!-- ส่วนของฟอร์มกรอกข้อมูล (Form Section) -->
        <div class="lg:col-span-2 space-y-8">
          <form @submit.prevent="handleSubmit" class="bg-white/70 backdrop-blur-sm p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-12">
            
            <!-- ขั้นตอนที่ 1: ข้อมูลพื้นฐาน -->
            <div class="space-y-8">
              <div class="flex items-center gap-4">
                <span class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">1</span>
                <h2 class="text-2xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
              </div>

              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อท่า (ภาษาไทย)</label>
                  <input v-model="form.nameTh" type="text" required class="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="เช่น วิดพื้น">
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อท่า (English)</label>
                  <input v-model="form.nameEn" type="text" class="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="เช่น Push-up">
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ระดับความยาก</label>
                  <select v-model="form.difficulty" class="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                    <option value="Beginner">Beginner (เริ่มต้น)</option>
                    <option value="Intermediate">Intermediate (ปานกลาง)</option>
                    <option value="Advanced">Advanced (ขั้นสูง)</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่หลัก</label>
                  <select v-model="form.category" class="w-full p-5 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                    <option value="Chest">หน้าอก (Chest)</option>
                    <option value="Back">แผ่นหลัง (Back)</option>
                    <option value="Legs">ขา (Legs)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ขั้นตอนที่ 2: กล้ามเนื้อและอุปกรณ์ -->
            <div class="space-y-8">
              <div class="flex items-center gap-4">
                <span class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">2</span>
                <h2 class="text-2xl font-bold text-slate-800">กล้ามเนื้อและอุปกรณ์</h2>
              </div>

              <div class="space-y-4">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">กล้ามเนื้อที่เกี่ยวข้อง ({{ form.selectedMuscles.length }})</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="muscle in musclesOptions" :key="muscle" 
                    class="px-5 py-3 rounded-xl cursor-pointer transition-all border text-sm font-semibold shadow-sm"
                    :class="form.selectedMuscles.includes(muscle) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'">
                    <input type="checkbox" :value="muscle" v-model="form.selectedMuscles" class="hidden"> 
                    {{ muscle }}
                  </label>
                </div>
              </div>

              <div class="space-y-4">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">อุปกรณ์ที่จำเป็น</label>
                <div class="flex flex-wrap gap-2">
                  <label v-for="eq in equipmentOptions" :key="eq" 
                    class="px-5 py-3 rounded-xl cursor-pointer border transition-all text-sm font-semibold shadow-sm"
                    :class="form.equipment === eq ? 'bg-slate-800 border-slate-800 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'">
                    <input type="radio" :value="eq" v-model="form.equipment" class="hidden"> 
                    {{ eq }}
                  </label>
                </div>
              </div>
            </div>

            <!-- ปุ่มดำเนินการ (Action Buttons) -->
            <div class="pt-6 flex flex-col md:flex-row gap-4">
              <button type="submit" :disabled="isSubmitting" 
                class="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all">
                {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
              </button>
              <button type="button" @click="resetForm" class="px-10 bg-slate-100 text-slate-500 py-5 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                ล้างฟอร์ม
              </button>
            </div>
          </form>
        </div>

        <!-- แถบด้านข้าง (Sidebar Statistics & History) -->
        <div class="space-y-8">
          <!-- การ์ดสรุปภาพรวม -->
          <div class="bg-slate-800 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 class="text-lg font-bold mb-6 text-slate-300">ภาพรวมข้อมูล</h3>
            <div class="space-y-6">
              <div>
                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ท่าฝึกทั้งหมด</p>
                <div class="flex items-end gap-3">
                  <span class="text-5xl font-bold">120</span>
                  <span class="text-emerald-400 text-xs font-bold mb-2">+{{ recentList.length }} ใหม่</span>
                </div>
              </div>
              <div class="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-full rounded-full w-[65%] shadow-lg shadow-blue-500/50"></div>
              </div>
            </div>
          </div>

          <!-- รายการที่เพิ่งเพิ่ม -->
          <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
            <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
              รายการที่เพิ่งเพิ่ม
              <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </h3>
            
            <div class="space-y-4">
              <div v-if="recentList.length === 0" class="py-20 text-center text-slate-300 space-y-3">
                <svg class="w-12 h-12 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"></path></svg>
                <p class="text-sm font-medium italic">ไม่มีรายการใหม่ในรอบนี้</p>
              </div>

              <TransitionGroup name="list">
                <div v-for="(item, index) in recentList" :key="item.timestamp" 
                  class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-md transition-all">
                  <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-blue-600 shadow-sm border border-slate-100">
                    {{ item.nameEn ? item.nameEn.charAt(0) : 'E' }}
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <p class="font-bold text-slate-800 truncate">{{ item.nameTh }}</p>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ item.timestamp }}</p>
                  </div>
                  <button @click="removeItem(index)" class="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"></path></svg>
                  </button>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- แจ้งเตือนความสำเร็จ (Success Overlay) -->
    <Transition name="overlay">
      <div v-if="showSuccess" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div class="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl animate-pop">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-slate-800 mb-2">บันทึกสำเร็จ</h3>
          <p class="text-slate-500 mb-8">ข้อมูล <b>{{ lastAddedName }}</b> ถูกเก็บลงฐานข้อมูลเรียบร้อยแล้ว</p>
          <button @click="showSuccess = false" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">
            ตกลง
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* แอนิเมชันสำหรับ TransitionGroup */
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* แอนิเมชันสำหรับ Overlay */
.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from, .overlay-leave-to {
  opacity: 0;
}

@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop {
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ซ่อน Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>แ