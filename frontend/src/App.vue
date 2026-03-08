<script setup>
import { ref, computed } from 'vue';
import { 
    Dumbbell, 
    Layout, 
    Search, 
    Calculator, 
    Info, 
    PlusCircle, 
    User, 
    LogOut, 
    CheckCircle2, 
    RotateCcw, 
    X, 
    Lightbulb, 
    ChevronRight, 
    SearchX, 
    Target, 
    Star, 
    BookOpen, 
    Image as ImageIcon, 
    Smartphone, 
    AlertTriangle, 
    Activity, 
    Save,
    Layers,
    Accessibility,
    Armchair,
    Wind
} from 'lucide-vue-next';

// --- State Management ---
const currentPage = ref('guide');
const toast = ref({ show: false, message: '', type: 'success' });
const viewingExercise = ref(null);
const showHelpBanner = ref(true);
const searchQuery = ref('');

// BMI State
const bmiWeight = ref('');
const bmiHeight = ref('');
const bmiResult = ref(null);
const bmiCategory = ref('');
const bmiColor = ref('');

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
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800',
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
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
        color: 'bg-indigo-500'
    }
]);

const newExercise = ref({
    nameTh: '',
    nameEn: '',
    difficulty: 'Beginner (เริ่มต้น)',
    category: 'หน้าอก (Chest)',
    muscles: [],
    equipment: 'Bodyweight',
    imageUrl: ''
});

const selectedMuscle = ref('all');
const selectedDifficulty = ref('ทั้งหมด');

// --- Computed ---
const filteredExercises = computed(() => {
    return exercises.value.filter(ex => {
        const muscleMatch = selectedMuscle.value === 'all' || ex.muscle === selectedMuscle.value;
        const diffMatch = selectedDifficulty.value === 'ทั้งหมด' || ex.difficulty === selectedDifficulty.value;
        
        const searchLower = searchQuery.value.toLowerCase().trim();
        const textMatch = searchLower === '' || 
                          ex.name.toLowerCase().includes(searchLower) || 
                          ex.description.toLowerCase().includes(searchLower);

        return muscleMatch && diffMatch && textMatch;
    });
});

// --- Methods ---
const handleSave = () => {
    if (!newExercise.value.nameTh) return;

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
        imageUrl: newExercise.value.imageUrl,
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
        equipment: 'Bodyweight',
        imageUrl: ''
    };
};

const handleReset = () => {
    resetForm();
    toast.value = { show: true, message: 'ล้างข้อมูลในฟอร์มเรียบร้อยแล้ว', type: 'reset' };
    
    setTimeout(() => {
        toast.value.show = false;
    }, 1500);
};

// BMI Logic
const calculateBMI = () => {
    if (!bmiWeight.value || !bmiHeight.value) {
        toast.value = { show: true, message: 'กรุณากรอกน้ำหนักและส่วนสูงให้ครบถ้วน', type: 'error' };
        setTimeout(() => toast.value.show = false, 2000);
        return;
    }
    
    const w = parseFloat(bmiWeight.value);
    const h = parseFloat(bmiHeight.value) / 100;
    
    if (h > 0 && w > 0) {
        const bmi = w / (h * h);
        bmiResult.value = bmi.toFixed(1);

        if (bmi < 18.5) {
            bmiCategory.value = 'น้ำหนักน้อย / ผอม';
            bmiColor.value = 'text-blue-500';
        } else if (bmi >= 18.5 && bmi <= 22.9) {
            bmiCategory.value = 'ปกติ (สุขภาพดี)';
            bmiColor.value = 'text-emerald-500';
        } else if (bmi >= 23 && bmi <= 24.9) {
            bmiCategory.value = 'ท้วม / โรคอ้วนระดับ 1';
            bmiColor.value = 'text-amber-500';
        } else if (bmi >= 25 && bmi <= 29.9) {
            bmiCategory.value = 'อ้วน / โรคอ้วนระดับ 2';
            bmiColor.value = 'text-orange-500';
        } else {
            bmiCategory.value = 'อ้วนมาก / โรคอ้วนระดับ 3';
            bmiColor.value = 'text-rose-500';
        }
    }
};

const resetBMI = () => {
    bmiWeight.value = '';
    bmiHeight.value = '';
    bmiResult.value = null;
    bmiCategory.value = '';
};

const showFeatureNotReady = (customMessage) => {
    toast.value = { 
        show: true, 
        message: typeof customMessage === 'string' ? customMessage : 'กำลังพัฒนาระบบส่วนนี้ครับ...', 
        type: 'reset' 
    };
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
                <span class="text-xl font-bold tracking-tight">FITNET</span>
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
                    <Search class="w-5 h-5" /> ค้นหาท่าฝึก
                </button>
                <button 
                    @click="currentPage = 'bmi'"
                    :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium outline-none', currentPage === 'bmi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800']"
                >
                    <Calculator class="w-5 h-5" /> คำนวณ BMI
                </button>
                <button 
                    @click="currentPage = 'create'"
                    :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium outline-none', currentPage === 'create' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800']"
                >
                    <PlusCircle class="w-5 h-5" /> เพิ่มท่าฝึกใหม่
                </button>
                <button 
                    @click="currentPage = 'about'"
                    :class="['w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium outline-none', currentPage === 'about' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800']"
                >
                    <Info class="w-5 h-5" /> เกี่ยวกับเว็บไซต์
                </button>
            </nav>
            
            <div class="p-4 border-t border-slate-800">
                <button 
                    @click="showFeatureNotReady('ออกจากระบบสำเร็จ')"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-all outline-none">
                    <LogOut class="w-5 h-5" /> ออกจากระบบ
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto relative">
            
            <!-- Notification Toast -->
            <transition name="fade">
                <div v-if="toast.show" class="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <div :class="[toast.type === 'success' ? 'bg-emerald-500' : 'bg-slate-800', 'text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 border border-white/20']">
                        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
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
                            <button @click="viewingExercise = null" class="absolute top-6 right-6 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full transition-colors">
                                <X class="w-6 h-6 text-white" />
                            </button>

                            <div class="flex flex-col md:flex-row h-full overflow-hidden">
                                <!-- Image/Header Section (Modified for Database Images) -->
                                <div :class="[!viewingExercise.imageUrl ? viewingExercise.color : 'bg-slate-900', 'md:w-2/5 p-8 flex flex-col justify-end text-white relative min-h-[300px] overflow-hidden']">
                                    
                                    <!-- ภาพจาก Database (ถ้ามี) -->
                                    <template v-if="viewingExercise.imageUrl">
                                        <img :src="viewingExercise.imageUrl" alt="Exercise Image" class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 hover:scale-105" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                                    </template>
                                    
                                    <!-- ไอคอนสำรอง (ถ้าไม่มีภาพ) -->
                                    <Dumbbell v-else class="w-16 h-16 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                                    <div class="absolute top-8 left-8 z-10">
                                        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                            {{ viewingExercise.difficulty }}
                                        </div>
                                    </div>
                                    
                                    <div class="relative z-10">
                                        <h2 class="text-4xl font-black mb-2 leading-tight drop-shadow-md">{{ viewingExercise.name }}</h2>
                                        <p class="text-white/80 font-medium drop-shadow-sm flex items-center gap-2">
                                            <component :is="muscleGroups.find(m => m.id === viewingExercise.muscle)?.icon" class="w-4 h-4" />
                                            {{ muscleGroups.find(m => m.id === viewingExercise.muscle)?.name }}
                                        </p>
                                    </div>
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

                <!-- Help / Guide Banner -->
                <transition name="fade">
                    <div v-if="showHelpBanner" class="bg-blue-50/80 border border-blue-100 rounded-[2rem] p-6 mb-8 relative flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm backdrop-blur-sm">
                        <button @click="showHelpBanner = false" class="absolute top-6 right-6 text-blue-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-sm">
                            <X class="w-4 h-4" />
                        </button>
                        <div class="bg-blue-600 p-4 rounded-[1.25rem] text-white shrink-0 shadow-lg shadow-blue-200">
                            <Lightbulb class="w-8 h-8" />
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-slate-800 mb-3 tracking-tight">เริ่มต้นใช้งานระบบอย่างไร?</h3>
                            <ul class="text-sm text-slate-600 space-y-2.5 font-medium">
                                <li class="flex items-center gap-3"><CheckCircle2 class="w-4 h-4 text-blue-500" /> เลือก <strong>ระดับความยาก</strong> และ <strong>ส่วนกล้ามเนื้อ</strong> ที่แถบเมนูด้านล่างเพื่อกรองข้อมูล</li>
                                <li class="flex items-center gap-3"><CheckCircle2 class="w-4 h-4 text-blue-500" /> คลิกที่การ์ดท่าออกกำลังกายเพื่อดู <strong>วิธีการฝึกอย่างละเอียด</strong> อุปกรณ์ และรูปภาพประกอบ</li>
                                <li class="flex items-center gap-3"><CheckCircle2 class="w-4 h-4 text-blue-500" /> ไปที่เมนู <strong>ค้นหาท่าฝึก</strong> ด้านซ้ายมือ หากต้องการค้นหาอย่างรวดเร็ว</li>
                            </ul>
                        </div>
                    </div>
                </transition>

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
                        
                        <!-- Thumbnail ภาพหน้าปก หรือ สีพื้นฐาน -->
                        <div :class="[!ex.imageUrl ? ex.color : 'bg-slate-800', 'w-full h-40 rounded-[1.25rem] flex items-center justify-center text-white mb-6 shadow-inner relative overflow-hidden']">
                            <template v-if="ex.imageUrl">
                                <img :src="ex.imageUrl" alt="thumbnail" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500">
                            </template>
                            <Dumbbell v-else class="w-12 h-12 opacity-50 group-hover:scale-110 transition-transform duration-500" />
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
                    <button @click="selectedMuscle = 'all'; selectedDifficulty = 'ทั้งหมด'; searchQuery = ''" class="mt-4 text-blue-600 font-bold underline">ล้างการค้นหา</button>
                </div>
            </div>

            <!-- 2. PAGE: Search Exercises -->
            <div v-if="currentPage === 'admin'" class="p-8 max-w-4xl mx-auto">
                <div class="mb-10">
                    <h1 class="text-3xl font-black text-slate-800">ค้นหาท่าออกกำลังกาย</h1>
                    <p class="text-slate-500 mt-2 font-medium">ค้นหาท่าฝึกที่คุณต้องการจากฐานข้อมูลทั้งหมดอย่างรวดเร็ว</p>
                </div>

                <div class="space-y-8 pb-20">
                    <!-- Search & Filter Box -->
                    <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div class="relative mb-6">
                            <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            <input 
                                v-model="searchQuery" 
                                type="text" 
                                placeholder="พิมพ์ชื่อท่าฝึก หรือคำค้นหา (เช่น Push, ดัมเบล, อก)..." 
                                class="w-full pl-16 pr-6 py-5 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg font-medium text-slate-700" 
                            />
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex-1 space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">ระดับความยาก</label>
                                <select v-model="selectedDifficulty" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-medium text-slate-600">
                                    <option value="ทั้งหมด">ทั้งหมด (All Levels)</option>
                                    <option value="เริ่มต้น">เริ่มต้น (Beginner)</option>
                                    <option value="ปานกลาง">ปานกลาง (Intermediate)</option>
                                </select>
                            </div>
                            <div class="flex-1 space-y-2">
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">กล้ามเนื้อ</label>
                                <select v-model="selectedMuscle" class="w-full px-6 py-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-medium text-slate-600">
                                    <option value="all">ทั้งหมด (All Muscles)</option>
                                    <option v-for="m in muscleGroups.filter(g => g.id !== 'all')" :key="m.id" :value="m.id">
                                        {{ m.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Results List -->
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-bold text-slate-800">ผลการค้นหา ({{ filteredExercises.length }})</h3>
                            <button v-if="searchQuery || selectedDifficulty !== 'ทั้งหมด' || selectedMuscle !== 'all'" @click="searchQuery = ''; selectedMuscle = 'all'; selectedDifficulty = 'ทั้งหมด'" class="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors">
                                ล้างตัวกรอง
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div v-for="ex in filteredExercises" :key="ex.id" 
                                @click="viewingExercise = ex"
                                class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6 group">
                                
                                <div :class="[!ex.imageUrl ? ex.color : 'bg-slate-800', 'w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner overflow-hidden relative']">
                                    <img v-if="ex.imageUrl" :src="ex.imageUrl" alt="img" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
                                    <Dumbbell v-else class="w-8 h-8 group-hover:scale-110 transition-transform" />
                                </div>
                                
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-1">
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{{ ex.difficulty }}</span>
                                        <span class="text-[10px] font-bold text-slate-400">• {{ muscleGroups.find(m => m.id === ex.muscle)?.name }}</span>
                                    </div>
                                    <h4 class="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ ex.name }}</h4>
                                    <p class="text-sm text-slate-500 line-clamp-1 mt-1">{{ ex.description }}</p>
                                </div>

                                <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
                                    <ChevronRight class="w-5 h-5" />
                                </div>
                            </div>

                            <div v-if="filteredExercises.length === 0" class="text-center py-16 bg-white rounded-[2.5rem] border-2 border-slate-100 border-dashed">
                                <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <SearchX class="w-10 h-10 text-slate-400" />
                                </div>
                                <p class="text-slate-500 font-bold text-lg">ไม่พบท่าออกกำลังกายที่ตรงกับการค้นหา</p>
                                <p class="text-slate-400 text-sm mt-2">ลองใช้คำค้นหาอื่น หรือปรับตัวกรองดูนะครับ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. PAGE: Create Form (Admin) -->
            <div v-if="currentPage === 'create'" class="p-8 max-w-4xl mx-auto">
                <div class="mb-10">
                    <h1 class="text-3xl font-black text-slate-800">ระบบจัดการท่าออกกำลังกาย</h1>
                    <p class="text-slate-500 mt-2 font-medium">เพิ่มและแก้ไขฐานข้อมูลท่าฝึกทั้งหมดในระบบ</p>
                </div>

                <div class="space-y-8 pb-20">
                    <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-5 mb-8">
                            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <h2 class="text-xl font-bold text-slate-800">ข้อมูลพื้นฐานและรูปภาพ</h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
                        
                        <div class="space-y-2 border-t border-slate-100 pt-8">
                            <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">URL รูปภาพอ้างอิง (Optional)</label>
                            <div class="flex items-center relative">
                                <ImageIcon class="absolute left-4 text-slate-400 w-5 h-5" />
                                <input v-model="newExercise.imageUrl" type="url" placeholder="https://example.com/image.jpg" class="w-full pl-12 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none" />
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <div class="flex items-center gap-5 mb-8">
                            <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                            <h2 class="text-xl font-bold text-slate-800">กล้ามเนื้อและอุปกรณ์</h2>
                        </div>

                        <div class="space-y-8">
                            <div>
                                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">กล้ามเนื้อที่เกี่ยวข้อง</label>
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

                    <div class="flex flex-col md:flex-row gap-4 pt-4">
                        <button @click="handleSave" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                            <Save class="w-6 h-6" /> บันทึกและเผยแพร่
                        </button>
                        <button @click="handleReset" class="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-3">
                            <RotateCcw class="w-5 h-5" /> ล้างข้อมูล
                        </button>
                    </div>
                </div>
            </div>

            <!-- 4. PAGE: BMI Calculator -->
            <div v-if="currentPage === 'bmi'" class="p-8 max-w-4xl mx-auto">
                <div class="mb-10 text-center">
                    <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Calculator class="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 class="text-4xl font-black text-slate-800 mb-4 tracking-tight">เครื่องคำนวณ BMI</h1>
                    <p class="text-slate-500 text-lg">ตรวจสอบค่าดัชนีมวลกาย (Body Mass Index) ของคุณ</p>
                </div>

                <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-8 max-w-2xl mx-auto">
                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">น้ำหนัก (กิโลกรัม)</label>
                            <div class="relative">
                                <Activity class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input v-model="bmiWeight" type="number" placeholder="เช่น 65" class="w-full pl-16 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg font-medium text-slate-700" />
                            </div>
                        </div>
                        
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">ส่วนสูง (เซนติเมตร)</label>
                            <div class="relative">
                                <User class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                                <input v-model="bmiHeight" type="number" placeholder="เช่น 170" class="w-full pl-16 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg font-medium text-slate-700" />
                            </div>
                        </div>

                        <div class="flex gap-4 pt-6">
                            <button @click="calculateBMI" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                                คำนวณผลลัพธ์
                            </button>
                            <button @click="resetBMI" class="px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] font-bold transition-all flex items-center justify-center">
                                <RotateCcw class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- BMI Result Display -->
                    <transition name="fade">
                        <div v-if="bmiResult" class="mt-10 pt-10 border-t border-slate-100 text-center">
                            <h3 class="text-slate-500 font-bold mb-2">ค่า BMI ของคุณคือ</h3>
                            <div class="text-6xl font-black mb-4" :class="bmiColor">{{ bmiResult }}</div>
                            <div class="inline-block px-6 py-2 rounded-full font-bold text-lg bg-slate-50 border border-slate-100" :class="bmiColor">
                                {{ bmiCategory }}
                            </div>
                            
                            <p class="text-slate-500 text-sm mt-6 leading-relaxed max-w-md mx-auto">
                                *เกณฑ์ดัชนีมวลกายนี้อ้างอิงสำหรับชาวเอเชีย หากคุณเป็นนักกีฬาที่มีมวลกล้ามเนื้อมาก ค่า BMI อาจไม่สะท้อนถึงปริมาณไขมันที่แท้จริง
                            </p>
                        </div>
                    </transition>
                </div>
            </div>

            <!-- 5. PAGE: About Us -->
            <div v-if="currentPage === 'about'" class="p-8 max-w-4xl mx-auto">
                <div class="mb-10 text-center">
                    <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Dumbbell class="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 class="text-4xl font-black text-slate-800 mb-4 tracking-tight">เกี่ยวกับ FitFlex</h1>
                    <p class="text-slate-500 text-lg">แพลตฟอร์มคู่มือการออกกำลังกายที่ออกแบบมาเพื่อทุกคน</p>
                </div>

                <div class="space-y-8 pb-20">
                    <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                        <!-- Background decoration -->
                        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>

                        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10">
                            <Target class="w-6 h-6 text-blue-600" /> จุดประสงค์ของเว็บไซต์
                        </h2>
                        <p class="text-slate-600 leading-relaxed text-lg mb-10 relative z-10">
                            เว็บไซต์ <strong class="text-blue-600">FitFlex</strong> ถูกสร้างขึ้นมาเพื่อเป็นแหล่งรวบรวมข้อมูลท่าออกกำลังกายที่ถูกต้อง เข้าใจง่าย และสามารถเข้าถึงได้ฟรีสำหรับทุกคน ไม่ว่าคุณจะเป็นผู้เริ่มต้นที่เพิ่งเริ่มเข้ายิม หรือผู้ที่มีประสบการณ์แล้ว เราตั้งใจให้แพลตฟอร์มนี้ช่วยให้คุณสามารถจัดตารางและค้นหาท่าออกกำลังกายที่เหมาะสมกับเป้าหมายของคุณได้อย่างมีประสิทธิภาพและปลอดภัย
                        </p>

                        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 mt-12 relative z-10">
                            <Star class="w-6 h-6 text-amber-500" /> สิ่งที่คุณจะได้รับจากแพลตฟอร์มนี้
                        </h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                <div class="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                    <Search class="w-6 h-6" />
                                </div>
                                <h3 class="font-bold text-slate-800 mb-2">ค้นหาท่าฝึกได้ง่ายดาย</h3>
                                <p class="text-sm text-slate-500">ระบบกรองท่าออกกำลังกายตามส่วนกล้ามเนื้อและระดับความยาก</p>
                            </div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                <div class="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                                    <BookOpen class="w-6 h-6" />
                                </div>
                                <h3 class="font-bold text-slate-800 mb-2">คำอธิบายอย่างละเอียด</h3>
                                <p class="text-sm text-slate-500">ขั้นตอนการฝึกที่ชัดเจน พร้อมคำแนะนำเรื่องอุปกรณ์และจำนวนเซต</p>
                            </div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                <div class="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                                    <ImageIcon class="w-6 h-6" />
                                </div>
                                <h3 class="font-bold text-slate-800 mb-2">ภาพประกอบชัดเจน</h3>
                                <p class="text-sm text-slate-500">มีรูปภาพประกอบเพื่อช่วยให้เข้าใจท่าทางการเคลื่อนไหวได้ถูกต้อง</p>
                            </div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                                <div class="bg-rose-100 w-12 h-12 rounded-2xl flex items-center justify-center text-rose-600 mb-4">
                                    <Smartphone class="w-6 h-6" />
                                </div>
                                <h3 class="font-bold text-slate-800 mb-2">รองรับทุกอุปกรณ์</h3>
                                <p class="text-sm text-slate-500">ใช้งานได้สะดวกทั้งบนคอมพิวเตอร์ แท็บเล็ต และโทรศัพท์มือถือ</p>
                            </div>
                        </div>

                        <div class="mt-12 bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 items-start relative z-10">
                            <AlertTriangle class="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h4 class="font-bold text-amber-800 mb-1">ข้อจำกัดความรับผิดชอบ (Disclaimer)</h4>
                                <p class="text-sm text-amber-700 leading-relaxed">ข้อมูลบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อเป็นแนวทางเบื้องต้นเท่านั้น หากคุณมีปัญหาสุขภาพ มีโรคประจำตัว มีอาการบาดเจ็บ หรือเพิ่งเริ่มต้นออกกำลังกาย ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญก่อนเริ่มต้นโปรแกรมการออกกำลังกายใดๆ เพื่อความปลอดภัยสูงสุดของคุณ</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
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