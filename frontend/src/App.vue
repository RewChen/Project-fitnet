<script setup>
import { ref, computed } from 'vue';
import { 
  Dumbbell, 
  ChevronRight, 
  User, 
  Trophy, 
  Layers, 
  Info,
  Armchair as Arm,
  Accessibility,
  Wind,
  Layout,
  ChevronLeft
} from 'lucide-vue-next';

// --- Data Definition ---
const muscleGroups = [
  { id: 'all', name: 'ทั้งหมด', icon: Layout },
  { id: 'chest', name: 'หน้าอก', icon: Layers },
  { id: 'back', name: 'หลัง', icon: Accessibility },
  { id: 'arms', name: 'แขน', icon: Arm },
  { id: 'legs', name: 'ขา', icon: User },
  { id: 'abs', name: 'หน้าท้อง', icon: Wind },
];

const exercises = [
  {
    id: 1,
    name: 'Push-Ups (วิดพื้น)',
    muscle: 'chest',
    difficulty: 'เริ่มต้น',
    description: 'ท่าพื้นฐานที่ช่วยสร้างกล้ามเนื้อหน้าอก หัวไหล่ และหลังแขน โดยใช้เพียงน้ำหนักตัว',
    instructions: [
      'วางมือบนพื้นให้กว้างกว่าช่วงไหล่เล็กน้อย',
      'เกร็งหน้าท้องและรักษาลำตัวให้ตรงเป็นเส้นขนาน',
      'ลดตัวลงจนหน้าอกเกือบแตะพื้นแล้วดันตัวกลับขึ้นมา',
    ],
    color: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Dumbbell Press',
    muscle: 'chest',
    difficulty: 'ปานกลาง',
    description: 'การบริหารหน้าอกโดยใช้ดัมเบลล์ ช่วยให้กล้ามเนื้อทำงานได้อย่างอิสระและลึกกว่าท่าบาร์เบลล์',
    instructions: [
      'นอนบนม้านั่งราบ ถือดัมเบลล์ไว้เหนือหน้าอก',
      'ค่อยๆ ลดดัมเบลล์ลงจนศอกทำมุม 90 องศา',
      'ดันดัมเบลล์กลับขึ้นไปด้านบนโดยไม่ให้ชนกัน'
    ],
    color: 'bg-indigo-500'
  },
  {
    id: 3,
    name: 'Pull-Ups',
    muscle: 'back',
    difficulty: 'ปานกลาง',
    description: 'ท่าสร้างกล้ามเนื้อหลังที่ทรงพลังที่สุด ช่วยสร้างแผ่นหลังที่กว้างและแข็งแรง',
    instructions: [
      'จับบาร์โหนให้กว้างกว่าไหล่',
      'ดึงตัวขึ้นจนคางพ้นขอบบาร์',
      'ค่อยๆ ลดตัวลงจนแขนตึง'
    ],
    color: 'bg-emerald-500'
  },
  {
    id: 4,
    name: 'Squats',
    muscle: 'legs',
    difficulty: 'เริ่มต้น',
    description: 'ราชาแห่งท่าออกกำลังกายช่วงล่าง เน้นกล้ามเนื้อขาและสะโพก',
    instructions: [
      'ยืนกางขาเท่าช่วงไหล่',
      'ย่อสะโพกลงเหมือนจะนั่งเก้าอี้ รักษาหลังให้ตรง',
      'ดันตัวกลับขึ้นสู่ท่าเริ่มต้น'
    ],
    color: 'bg-orange-500'
  },
  {
    id: 5,
    name: 'Plank',
    muscle: 'abs',
    difficulty: 'เริ่มต้น',
    description: 'ท่าที่ดูเหมือนนิ่งแต่สร้างความแข็งแรงให้แกนกลางลำตัวได้อย่างยอดเยี่ยม',
    instructions: [
      'วางศอกลงบนพื้นให้ตรงกับหัวไหล่',
      'เหยียดขาตรง เกร็งหน้าท้องและก้น',
      'ค้างไว้ให้นานที่สุดเท่าที่ทำได้'
    ],
    color: 'bg-rose-500'
  },
  {
    id: 6,
    name: 'Bicep Curls',
    muscle: 'arms',
    difficulty: 'เริ่มต้น',
    description: 'ท่ามาตรฐานสำหรับสร้างกล้ามเนื้อต้นแขนด้านหน้า',
    instructions: [
      'ยืนตัวตรงถือดัมเบลล์ไว้ข้างลำตัว',
      'งอแขนดึงดัมเบลล์ขึ้นหาไหล่โดยไม่เหวี่ยงตัว',
      'ค่อยๆ ผ่อนลงช้าๆ'
    ],
    color: 'bg-purple-500'
  },
];

const selectedMuscle = ref('all');
const selectedDifficulty = ref('ทั้งหมด');
const activeExercise = ref(null);

const filteredExercises = computed(() => {
  return exercises.filter(ex => {
    const muscleMatch = selectedMuscle.value === 'all' || ex.muscle === selectedMuscle.value;
    const diffMatch = selectedDifficulty.value === 'ทั้งหมด' || ex.difficulty === selectedDifficulty.value;
    return muscleMatch && diffMatch;
  });
});

const selectMuscle = (id) => {
  selectedMuscle.value = id;
  activeExercise.value = null;
};

const selectDifficulty = (level) => {
  selectedDifficulty.value = level;
  activeExercise.value = null;
};

const openExercise = (exercise) => {
  activeExercise.value = exercise;
};

const closeExercise = () => {
  activeExercise.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
    <header class="bg-white border-b sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-indigo-600 p-2 rounded-lg">
            <Dumbbell class="text-white w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-slate-800">FitFlex</h1>
        </div>
        <button class="md:hidden p-2 text-slate-500">
          <Info class="w-6 h-6" />
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 mb-10 text-white shadow-xl">
        <h2 class="text-3xl font-bold mb-2">ออกแบบร่างกายของคุณ</h2>
        <p class="opacity-90 max-w-md">ค้นหาท่าออกกำลังกายที่เหมาะสมกับเป้าหมายและระดับความสามารถของคุณ</p>
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
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full lg:w-auto',
                  selectedMuscle === group.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-transparent'
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
                :key="exercise.id"
                @click="openExercise(exercise)"
                class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="flex justify-between items-start mb-4">
                    <div :class="[exercise.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner']">
                      <Dumbbell class="w-6 h-6" />
                    </div>
                    <span :class="[
                      'text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter',
                      exercise.difficulty === 'เริ่มต้น' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    ]">
                      {{ exercise.difficulty }}
                    </span>
                  </div>
                  <h4 class="font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{{ exercise.name }}</h4>
                  <p class="text-slate-500 text-sm line-clamp-2">{{ exercise.description }}</p>
                </div>
                <div class="mt-4 flex items-center text-indigo-600 text-xs font-bold uppercase tracking-widest gap-1">
                  ดูรายละเอียด <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>
            <div v-else class="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
              <p class="text-slate-400">ไม่พบท่าออกกำลังกายที่คุณต้องการ ลองเลือกกลุ่มอื่นดูนะ</p>
            </div>
          </div>

          <div v-else class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-fade-in">
            <div :class="[activeExercise.color, 'h-48 flex flex-col justify-end p-8 text-white relative']">
              <button @click="closeExercise" class="absolute top-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full transition-colors">
                <ChevronLeft class="w-5 h-5" />
              </button>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-white/20 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md uppercase">{{ activeExercise.difficulty }}</span>
                <span class="bg-white/20 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  {{ muscleGroups.find(m => m.id === activeExercise.muscle)?.name }}
                </span>
              </div>
              <h3 class="text-3xl font-black">{{ activeExercise.name }}</h3>
            </div>
            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">คำอธิบาย</h4>
                  <p class="text-slate-700 leading-relaxed mb-6">{{ activeExercise.description }}</p>
                  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 class="font-bold mb-4 flex items-center gap-2"><Info class="w-4 h-4 text-indigo-600" /> วิธีการฝึก</h4>
                    <ul class="space-y-4">
                      <li v-for="(step, idx) in activeExercise.instructions" :key="idx" class="flex gap-4">
                        <span class="flex-shrink-0 w-6 h-6 bg-white rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">{{ idx + 1 }}</span>
                        <span class="text-sm text-slate-600">{{ step }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="space-y-6">
                  <div class="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
                    <div class="text-center">
                       <div class="bg-white p-4 rounded-full shadow-lg mb-2 mx-auto inline-block"><Dumbbell class="w-8 h-8 text-indigo-500" /></div>
                       <p class="text-xs font-bold text-slate-400 uppercase tracking-tighter">[พื้นที่แสดงรูปภาพ]</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-indigo-50 p-4 rounded-2xl">
                      <p class="text-[10px] font-bold text-indigo-400 uppercase mb-1">เซตที่แนะนำ</p>
                      <p class="text-lg font-bold text-indigo-700">3 - 4 เซต</p>
                    </div>
                    <div class="bg-violet-50 p-4 rounded-2xl">
                      <p class="text-[10px] font-bold text-violet-400 uppercase mb-1">จำนวนครั้ง</p>
                      <p class="text-lg font-bold text-violet-700">12 - 15 ครั้ง</p>
                    </div>
                  </div>
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

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>