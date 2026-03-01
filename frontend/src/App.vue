<script setup>
import { ref, computed } from 'vue';
import { 
    Layout, 
    Layers, 
    Accessibility, 
    Armchair, 
    User, 
    Wind, 
    Dumbbell, 
    PlusCircle, 
    LogOut, 
    CheckCircle2, 
    RotateCcw, 
    X, 
    ChevronRight, 
    SearchX, 
    Save 
} from 'lucide-vue-next';

// --- State Management ---
const currentPage = ref('guide');
const toast = ref({ show: false, message: '', type: 'success' });
const viewingExercise = ref(null);

// --- Data ---
const muscleGroups = [
    { id: 'all', name: 'ทั้งหมด', icon: Layout },
    { id: 'chest', name: 'หน้าอก', icon: Layers },
    { id: 'back', name: 'หลัง', icon: Accessibility },
    { id: 'arms', name: 'แขน', icon: Armchair },
    { id: 'legs', name: 'ขา', icon: User },
    { id: 'abs', name: 'หน้าท้อง', icon: Wind },
];

const exercises = ref([
    {
        id: 1,
        name: 'Push-Ups (วิดพื้น)',
        muscle: 'chest',
        difficulty: 'เริ่มต้น',
        description: 'ท่าพื้นฐานที่ช่วยสร้างกล้ามเนื้อหน้าอก หัวไหล่ และหลังแขน โดยใช้เพียงน้ำหนักตัว',
        instructions: [
            'วางมือบนพื้นให้กว้างกว่าช่วงไหล่เล็กน้อย',
            'เกร็งหน้าท้องและรักษาลำตัวให้ตรงเป็นเส้นขนาน',
            'ลดตัวลงจนหน้าอกเกือบแตะพื้นแล้วดันตัวกลับขึ้นมาอย่างรวดเร็ว'
        ],
        equipment: 'Bodyweight',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        name: 'Dumbbell Press',
        muscle: 'chest',
        difficulty: 'ปานกลาง',
        description: 'การบริหารหน้าอกโดยใช้ดัมเบลล์ ช่วยให้กล้ามเนื้อทำงานได้อย่างอิสระและลึกกว่าท่าบาร์เบลล์',
        instructions: [
            'นอนบนม้านั่งราบ ถือดัมเบลล์ไว้เหนือหน้าอกให้แขนตึง',
            'ค่อยๆ ลดดัมเบลล์ลงจนศอกทำมุม 90 องศา สัมผัสถึงการยืดของกล้ามเนื้ออก',
            'ดันดัมเบลล์กลับขึ้นไปด้านบนอย่างช้าๆ โดยพยายามเกร็งหน้าอก'
        ],
        equipment: 'Dumbbell',
        color: 'bg-indigo-500'
    }
]);

const newExercise = ref({
    nameTh: '',
    nameEn: '',
    difficulty: 'Beginner (เริ่มต้น)',
    category: 'หน้าอก (Chest)',
    muscles: [],
    equipment: 'Bodyweight'
});

const selectedMuscle = ref('all');
const selectedDifficulty = ref('ทั้งหมด');

// --- Computed ---
const filteredExercises = computed(() => {
    return exercises.value.filter(ex => {
        const muscleMatch = selectedMuscle.value === 'all' || ex.muscle === selectedMuscle.value;
        const diffMatch = selectedDifficulty.value === 'ทั้งหมด' || ex.difficulty === selectedDifficulty.value;
        return muscleMatch && diffMatch;
    });
});

// --- Methods ---
const handleSave = () => {
    if (!newExercise.value.nameTh) {
        toast.value = { show: true, message: 'กรุณากรอกชื่อท่าออกกำลังกาย', type: 'error' };
        setTimeout(() => toast.value.show = false, 2000);
        return;
    }

    const mockNewEntry = {
        id: Date.now(),
        name: `${newExercise.value.nameTh} (${newExercise.value.nameEn})`,
        muscle: newExercise.value.category.toLowerCase().includes('หน้าอก') ? 'chest' : 
                newExercise.value.category.toLowerCase().includes('หลัง') ? 'back' :
                newExercise.value.category.toLowerCase().includes('แขน') ? 'arms' :
                newExercise.value.category.toLowerCase().includes('ท้อง') ? 'abs' : 'legs',
        difficulty: newExercise.value.difficulty.includes('เริ่มต้น') ? 'เริ่มต้น' : 'ปานกลาง',
        description: 'ท่าออกกำลังกายใหม่ที่เพิ่มจากระบบจัดการข้อมูลของ FitFlex',
        instructions: [
            'เริ่มต้นในท่าเตรียมพร้อมที่ถูกต้อง',
            'เคลื่อนไหวอย่างช้าๆ และโฟกัสไปที่กล้ามเนื้อเป้าหมาย',
            'หายใจเข้าเมื่อลดลง และหายใจออกเมื่อออกแรงดัน'
        ],
        equipment: newExercise.value.equipment,
        color: 'bg-indigo-600'
    };
    
    exercises.value.push(mockNewEntry);
    toast.value = { show: true, message: 'บันทึกข้อมูลสำเร็จ! กำลังกลับหน้าหลัก...', type: 'success' };
    
    setTimeout(() => {
        toast.value.show = false;
        currentPage.value = 'guide';
        resetForm();
    }, 1500);
};

const resetForm = () => {
    newExercise.value = { 
        nameTh: '', 
        nameEn: '', 
        difficulty: 'Beginner (เริ่มต้น)', 
        category: 'หน้าอก (Chest)', 
        muscles: [], 
        equipment: 'Bodyweight' 
    };
};

const handleReset = () => {
    resetForm();
    toast.value = { show: true, message: 'ล้างข้อมูลในฟอร์มเรียบร้อยแล้ว', type: 'reset' };
    
    setTimeout(() => {
        toast.value.show = false;
    }, 1500);
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
        
        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-64 bg-[#0F172A] text-white flex flex-col shrink-0 md:sticky md:top-0 md:h-screen">
            <div class="p-6 flex items-center gap-3">
                <div class="bg-blue-600 p-2 rounded-lg">
                    <Dumbbell class="w-6 h-6 text-white" />
                </div>
                <span class="text-xl font-bold tracking-tight">MuscleFit</span>
            </div>
            
            <nav class="flex-1 px-4 space-y-2">
                <button 
                    @click="currentPage = 'guide'"
                    :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium outline-none', currentPage === 'guide' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800']"
                >
                    <Layout class="w-5 h-5" /> รายการท่าฝึก
                </button>
                <button 
                    @click="currentPage = 'admin'"
                    :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium outline-none', currentPage === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800']"
                >
                    <PlusCircle class="w-5 h-5" /> จัดการท่าฝึก
                </button>
                <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 text-sm font-medium transition-all outline-none">
                    <User class="w-5 h-5" /> ผู้ดูแลระบบ
                </button>
            </nav>
            
            <div class="p-4 border-t border-slate-800">
                <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-all outline-none">
                    <LogOut class="w-5 h-5" /> ออกจากระบบ
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto relative">
            
            <!-- Notification Toast -->
            <transition name="fade">
                <div v-if="toast.show" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <div :class="[toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-800', 'text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 border border-white/20']">
                        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
                        <X v-else-if="toast.type === 'error'" class="w-5 h-5" />
                        <RotateCcw v-else class="w-5 h-5" />
                        <span class="font-bold">{{ toast.message }}</span>
                    </div>
                </div>
            </transition>

            <!-- Exercise Detail Modal -->
            <transition name="fade">
                <div v-if="viewingExercise" class="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="viewingExercise = null">
                    <transition name="modal" appear>
                        <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative">
                            <!-- Close Button -->
                            <button @click="viewingExercise = null" class="absolute top-6 right-6 z-10 bg-white/10 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <X class="w-6 h-6 text-slate-400 hover:text-slate-600" />
                            </button>

                            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                                <!-- Image/Header Section -->
                                <div :class="[viewingExercise.color, 'md:w-2/5 p-8 flex flex-col justify-end text-white relative min-h-[300px]']">
                                    <div class="absolute top-8 left-8">
                                        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                            {{ viewingExercise.difficulty }}
                                        </div>
                                    </div>
                                    <Dumbbell class="w-16 h-16 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    <h2 class="text-4xl font-black mb-2 leading-tight">{{ viewingExercise.name }}</h2>
                                    <p class="text-white/80 font-medium">{{ muscleGroups.find(m => m.id === viewingExercise.muscle)?.name }}</p>
                                </div>

                                <!-- Content Section -->
                                <div class="flex-1 p-10 overflow-y-auto bg-white">
                                    <div class="mb-8">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">คำอธิบาย</h4>
                                        <p class="text-slate-600 leading-relaxed text-lg">{{ viewingExercise.description }}</p>
                                    </div>

                                    <div class="mb-8">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">วิธีการฝึกอย่างละเอียด</h4>
                                        <div class="space-y-4">
                                            <div v-for="(step, idx) in viewingExercise.instructions" :key="idx" class="flex gap-4 items-start">
                                                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm border border-blue-100">
                                                    {{ idx + 1 }}
                                                </div>
                                                <p class="text-slate-600 pt-1">{{ step }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mt-10">
                                        <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">อุปกรณ์</p>
                                            <p class="text-slate-800 font-bold">{{ viewingExercise.equipment || 'ไม่ระบุ' }}</p>
                                        </div>
                                        <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">เซต/ครั้งที่แนะนำ</p>
                                            <p class="text-slate-800 font-bold">3-4 เซต | 12-15 ครั้ง</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>

            <!-- 1. PAGE: Workout Guide (User View) -->
            <div v-if="currentPage === 'guide'" class="p-8 max-w-6xl mx-auto">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-slate-800 tracking-tight">คู่มือการออกกำลังกาย</h1>
                        <p class="text-slate-500 font-medium">เลือกส่วนที่ต้องการฝึกเพื่อดูรายละเอียด</p>
                    </div>
                    <div class="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                        <button v-for="level in ['ทั้งหมด', 'เริ่มต้น', 'ปานกลาง']" :key="level" @click="selectedDifficulty = level"
                            :class="['px-6 py-2.5 rounded-xl text-xs font-bold transition-all outline-none', selectedDifficulty === level ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600']">
                            {{ level }}
                        </button>
                    </div>
                </div>

                <div class="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                    <button v-for="group in muscleGroups" :key="group.id" @click="selectedMuscle = group.id"
                        :class="['flex items-center gap-3 px-6 py-4 rounded-[1.25rem] transition-all text-sm font-bold shrink-0 shadow-sm border outline-none', selectedMuscle === group.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 -translate-y-1' : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300']">
                        <component :is="group.icon" class="w-5 h-5" /> {{ group.name }}
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                    <div v-for="ex in filteredExercises" :key="ex.id" 
                        @click="viewingExercise = ex"
                        class="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden">
                        
                        <div :class="[ex.color, 'w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-inner group-hover:scale-110 transition-transform']">
                            <Dumbbell class="w-8 h-8" />
                        </div>
                        
                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3 block">{{ ex.difficulty }}</span>
                        <h3 class="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{{ ex.name }}</h3>
                        <p class="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">{{ ex.description }}</p>
                        
                        <div class="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest pt-4 border-t border-slate-50">
                            ดูรายละเอียด <ChevronRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                <div v-if="filteredExercises.length === 0" class="py-20 text-center">
                    <div class="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchX class="w-10 h-10 text-slate-400" />
                    </div>
                    <p class="text-slate-400 font-bold text-lg">ไม่พบท่าออกกำลังกายที่คุณต้องการ</p>
                    <button @click="selectedMuscle = 'all'; selectedDifficulty = 'ทั้งหมด'" class="mt-4 text-blue-600 font-bold underline">ล้างการค้นหา</button>
                </div>
            </div>

            <!-- 2. PAGE: Admin Form (Add Data) -->
            <div v-if="currentPage === 'admin'" class="p-8 max-w-4xl mx-auto">
                <div class="mb-10">
                    <h1 class="text-3xl font-black text-slate-800">ระบบจัดการท่าออกกำลังกาย</h1>
                    <p class="text-slate-500 mt-2 font-medium">เพิ่มและแก้ไขฐานข้อมูลท่าฝึกทั้งหมดในระบบ</p>
                </div>

                <div class="space-y-8 pb-20">
                    <!-- Section 1: Basic Info -->
                    <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-5 mb-8">
                            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <h2 class="text-xl font-bold text-slate-800">ข้อมูลพื้นฐาน</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">ชื่อท่า (ภาษาไทย)</label>
                                <input v-model="newExercise.nameTh" type="text" placeholder="เช่น วิดพื้น" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">ชื่อท่า (ENGLISH)</label>
                                <input v-model="newExercise.nameEn" type="text" placeholder="เช่น Push-up" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">ระดับความยาก</label>
                                <select v-model="newExercise.difficulty" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none">
                                    <option>Beginner (เริ่มต้น)</option>
                                    <option>Intermediate (ปานกลาง)</option>
                                    <option>Advanced (ขั้นสูง)</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">หมวดหมู่หลัก</label>
                                <select v-model="newExercise.category" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none">
                                    <option>หน้าอก (Chest)</option>
                                    <option>แผ่นหลัง (Back)</option>
                                    <option>แขน (Arms)</option>
                                    <option>ขา (Legs)</option>
                                    <option>หน้าท้อง (Abs)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Muscles & Equipment -->
                    <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-5 mb-8">
                            <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                            <h2 class="text-xl font-bold text-slate-800">กล้ามเนื้อและอุปกรณ์</h2>
                        </div>

                        <div class="space-y-8">
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">กล้ามเนื้อที่เกี่ยวข้อง (MAPPING TABLE)</label>
                                <div class="flex flex-wrap gap-3">
                                    <label v-for="m in ['อกส่วนบน', 'อกส่วนกลาง', 'หลังแขน', 'หัวไหล่', 'หน้าท้อง']" :key="m" class="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input type="checkbox" :value="m" v-model="newExercise.muscles" class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="text-sm font-bold text-slate-600">{{ m }}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">อุปกรณ์ที่จำเป็น</label>
                                <div class="flex flex-wrap gap-6">
                                    <label v-for="e in ['Bodyweight', 'Dumbbell', 'Barbell']" :key="e" class="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" :value="e" v-model="newExercise.equipment" class="w-5 h-5 border-slate-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">{{ e }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col md:flex-row gap-4 pt-4">
                        <button 
                            @click="handleSave"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                        >
                            <Save class="w-6 h-6" /> บันทึกและเผยแพร่
                        </button>
                        <button 
                            @click="handleReset"
                            class="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3"
                        >
                            <RotateCcw class="w-5 h-5" /> ล้างข้อมูล
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&display=swap');

.font-sans {
    font-family: 'Prompt', sans-serif;
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-enter-active, .modal-leave-active { transition: all 0.3s ease-out; }
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>