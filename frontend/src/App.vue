<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Dumbbell, ChevronRight, User, Trophy, Layers, Info, 
  Armchair as Arm, Accessibility, Wind, Layout, ChevronLeft 
} from 'lucide-vue-next';

// --- 1. ข้อมูลปุ่มเมนู ---
const muscleGroups = [
  { id: 'all', name: 'ทั้งหมด', icon: Layout },
  { id: 'หน้าอก', name: 'หน้าอก', icon: Layers },
  { id: 'หลัง', name: 'หลัง', icon: Accessibility },
  { id: 'แขน', name: 'แขน', icon: Arm },
  { id: 'ขา', name: 'ขา', icon: User },
  { id: 'หน้าท้อง', name: 'หน้าท้อง', icon: Wind },
];

// --- 2. ตัวแปร Reactive ---
const exercises = ref([]); 
const selectedMuscle = ref('all');
const selectedDifficulty = ref('ทั้งหมด');
const activeExercise = ref(null);

// --- 3. ฟังก์ชันจัดการสี ---
const getMuscleColor = (muscle) => {
  const colors = {
    'หน้าอก': 'bg-blue-500',
    'หลัง': 'bg-emerald-500',
    'ขา': 'bg-orange-500',
    'แขน': 'bg-purple-500',
    'หน้าท้อง': 'bg-rose-500'
  };
  return colors[muscle] || 'bg-slate-500';
};

// --- 4. ฟังก์ชันดึงข้อมูล (จุดที่แก้ไข) ---
const fetchExercises = async () => {
  try {
    // แก้ไข: ถ้าเป็น 'all' ให้ส่งค่าว่าง เพื่อไม่ให้ Backend กรองผิดพลาด
    const muscleParam = selectedMuscle.value === 'all' ? '' : selectedMuscle.value;
    
    // แก้ไข: ส่ง equipment เป็นค่าว่างเพื่อให้ Backend ดึงทุกอุปกรณ์มาแสดง
    let url = `http://localhost:3000/api/exercises/filter?equipment=&muscle=${muscleParam}`;
    
    console.log("Fetching from:", url);

    const response = await fetch(url);
    const data = await response.json();
    
    // แปลงระดับความยากจากไทยเป็นอังกฤษให้ตรงกับ DB
    const diffMap = {
      'เริ่มต้น': 'Beginner',
      'ปานกลาง': 'Intermediate',
      'ขั้นสูง': 'Advanced'
    };

    if (selectedDifficulty.value !== 'ทั้งหมด') {
      const targetDiff = diffMap[selectedDifficulty.value];
      exercises.value = data.filter(ex => ex.difficulty === targetDiff);
    } else {
      exercises.value = data;
    }

    console.log("ข้อมูลที่พร้อมแสดงผล:", exercises.value);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

// --- 5. Lifecycle & Watchers ---
onMounted(() => {
  fetchExercises();
});

watch([selectedMuscle, selectedDifficulty], () => {
  fetchExercises();
});

// --- 6. UI Functions ---
const selectMuscle = (id) => {
  selectedMuscle.value = id;
  activeExercise.value = null;
};

const selectDifficulty = (level) => {
  selectedDifficulty.value = level;
  activeExercise.value = null;
};

const openExercise = (exercise) => { activeExercise.value = exercise; };
const closeExercise = () => { activeExercise.value = null; };

const filteredExercises = computed(() => exercises.value);
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
    <header class="bg-white border-b sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-indigo-600 p-2 rounded-lg">
            <Dumbbell class="text-white w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800">MuscleFit</h1>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 mb-10 text-white shadow-xl">
        <h2 class="text-3xl font-bold mb-2">ออกแบบร่างกายของคุณ</h2>
        <p class="opacity-90 max-w-md">พบท่าออกกำลังกายทั้งหมดจากฐานข้อมูลของคุณ</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="lg:col-span-1 space-y-8">
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Layout class="w-4 h-4" /> เลือกส่วนกล้ามเนื้อ
            </h3>
            <div class="flex flex-wrap lg:flex-col gap-2">
              <button
                v-for="group in muscleGroups"
                :key="group.id"
                @click="selectMuscle(group.id)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full',
                  selectedMuscle === group.id 
                    ? 'bg-indigo-600 text-white shadow-lg translate-x-1' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-50'
                ]"
              >
                <component :is="group.icon" class="w-5 h-5" />
                {{ group.name }}
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Trophy class="w-4 h-4" /> ระดับความยาก
            </h3>
            <div class="flex gap-2">
              <button
                v-for="level in ['ทั้งหมด', 'เริ่มต้น', 'ปานกลาง']"
                :key="level"
                @click="selectDifficulty(level)"
                :class="[
                  'flex-1 px-3 py-2 rounded-lg text-xs font-bold border transition-all',
                  selectedDifficulty === level
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                ]"
              >
                {{ level }}
              </button>
            </div>
          </div>
        </aside>

        <section class="lg:col-span-3">
          <div v-if="!activeExercise">
            <h3 class="text-xl font-bold mb-6">ท่าออกกำลังกาย ({{ filteredExercises.length }})</h3>
            
            <div v-if="filteredExercises.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="exercise in filteredExercises"
                :key="exercise.exercise_id"
                @click="openExercise(exercise)"
                class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="flex justify-between items-start mb-4">
                    <div :class="[getMuscleColor(exercise.muscle_group), 'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner']">
                      <Dumbbell class="w-6 h-6" />
                    </div>
                    <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {{ exercise.difficulty }}
                    </span>
                  </div>
                  <div class="mb-3 overflow-hidden rounded-xl aspect-video bg-slate-50 border border-slate-100">
                    <img v-if="exercise.media_url" :src="exercise.media_url" class="w-full h-full object-cover" />
                    <div v-else class="h-full flex items-center justify-center text-slate-300"><Dumbbell /></div>
                  </div>
                  <h4 class="font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{{ exercise.name_th }}</h4>
                  <p class="text-slate-500 text-sm line-clamp-2">{{ exercise.description }}</p>
                </div>
                <div class="mt-4 flex items-center text-indigo-600 text-xs font-bold uppercase gap-1">
                  ดูรายละเอียด <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div v-else class="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <p class="text-slate-400 font-medium">ไม่พบท่าออกกำลังกายที่คุณต้องการ ลองเลือกกลุ่มอื่นดูนะ</p>
            </div>
          </div>

          <div v-else class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fade-in">
            <div :class="[getMuscleColor(activeExercise.muscle_group), 'h-48 flex flex-col justify-end p-8 text-white relative']">
              <button @click="closeExercise" class="absolute top-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-colors">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <h3 class="text-3xl font-black">{{ activeExercise.name_th }}</h3>
              <p class="opacity-80 text-sm font-bold uppercase">{{ activeExercise.muscle_group }} • {{ activeExercise.difficulty }}</p>
            </div>
            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">คำอธิบาย</h4>
                  <p class="text-slate-700 leading-relaxed mb-6">{{ activeExercise.description }}</p>
                  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 class="font-bold mb-2 flex items-center gap-2"><Info class="w-4 h-4 text-indigo-600" /> ข้อมูลเพิ่มเติม</h4>
                    <p class="text-sm text-slate-600">อุปกรณ์: {{ activeExercise.equipment }}</p>
                    <p class="text-sm text-slate-600">เวลาที่แนะนำ: {{ activeExercise.duration }}</p>
                  </div>
                </div>
                <div class="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                   <img v-if="activeExercise.media_url" :src="activeExercise.media_url" class="w-full h-full object-cover" />
                   <div v-else class="h-full flex items-center justify-center text-slate-400 italic">ไม่มีรูปภาพประกอบ</div>
                </div>
              </div>
              <div class="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                <button @click="closeExercise" class="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">กลับไปหน้ารวม</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>