<script setup>
import { ref, computed, onMounted } from 'vue';
import html2canvas from 'html2canvas'; 
import { 
    Dumbbell, Layout, Search, Calculator, Info, PlusCircle, User, 
    LogOut, CheckCircle2, RotateCcw, X, Lightbulb, ChevronRight, 
    SearchX, Target, Star, BookOpen, Image as ImageIcon, Smartphone, 
    AlertTriangle, Activity, Save, Layers, Accessibility, Armchair, Wind,
    Heart, Loader2, Zap, Calendar, Trash2, Download, Lock, FileText
} from 'lucide-vue-next';

// --- 1. State Management ---
const currentPage = ref('guide');
const toast = ref({ show: false, message: '', type: 'success' });
const viewingExercise = ref(null);
const showHelpBanner = ref(true); 
const isLoading = ref(true);
const showDaySelector = ref(false); 

const favorites = ref([]);
const showFavoritesOnly = ref(false);

const searchQuery = ref('');
const selectedMuscle = ref('all');
const selectedDifficulty = ref('ทั้งหมด');
const selectedEquipment = ref('ทั้งหมด'); 

// --- 2. Workout Plan State ---
const daysOfWeek = [
    { id: 'mon', name: 'จันทร์', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    { id: 'tue', name: 'อังคาร', color: 'bg-pink-100 text-pink-700 border-pink-200', dot: 'bg-pink-500' },
    { id: 'wed', name: 'พุธ', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { id: 'thu', name: 'พฤหัสฯ', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    { id: 'fri', name: 'ศุกร์', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    { id: 'sat', name: 'เสาร์', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
    { id: 'sun', name: 'อาทิตย์', color: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' }
];
const selectedDay = ref('mon');
const weeklyPlan = ref({ mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] });

const weeklyPlanRef = ref(null); 
const isExporting = ref(false);
const showClearConfirmModal = ref(false);

// --- 3. Health Calculator State ---
const calcWeight = ref('');
const calcHeight = ref('');
const calcAge = ref('');
const calcGender = ref('male');
const calcActivity = ref('1.2');

const bmiResult = ref(null);
const bmiCategory = ref('');
const bmiColor = ref('');
const bmrResult = ref(null);
const tdeeResult = ref(null);

// --- 4. Admin Create Form State (ระบบล็อกอินแอดมิน) ---
const isAdminLoggedIn = ref(false);
const adminPasswordInput = ref('');
const isSubmitting = ref(false);

const newExercise = ref({
    name_th: '',
    name_en: '',
    difficulty: 'เริ่มต้น',
    muscle_group: 'หน้าอก',
    secondary_muscle: '',
    equipment: 'น้ำหนักตัว',
    duration: '5-10 นาที',
    description: '',
    instructions: '',
    media_url: '',
    video_url: ''
});

const muscleGroups = [
    { id: 'all', name: 'ทั้งหมด', icon: Layout },
    { id: 'chest', name: 'หน้าอก', icon: Layers },
    { id: 'back', name: 'หลัง', icon: Accessibility },
    { id: 'shoulders', name: 'หัวไหล่', icon: Target }, 
    { id: 'arms', name: 'แขน', icon: Armchair },
    { id: 'legs', name: 'ขา', icon: User },
    { id: 'abs', name: 'หน้าท้อง', icon: Wind },
    { id: 'fullbody', name: 'ทั่วร่าง', icon: Activity },
];

const exercises = ref([]);

const fetchExercises = async () => {
    isLoading.value = true;
    try {
        const response = await fetch('https://faithful-caring-production.up.railway.app/api/exercises', { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        exercises.value = data.map(ex => {
            let mappedMuscle = 'all';
            if (ex.muscle_group === 'หน้าอก') mappedMuscle = 'chest';
            else if (ex.muscle_group === 'หลัง') mappedMuscle = 'back';
            else if (ex.muscle_group === 'หัวไหล่') mappedMuscle = 'shoulders';
            else if (ex.muscle_group === 'แขน') mappedMuscle = 'arms';
            else if (ex.muscle_group === 'ขา') mappedMuscle = 'legs';
            else if (ex.muscle_group === 'หน้าท้อง') mappedMuscle = 'abs';
            else if (ex.muscle_group === 'ทั่วร่าง') mappedMuscle = 'fullbody';

            let mappedDiff = ex.difficulty;
            if (ex.difficulty === 'Beginner') mappedDiff = 'เริ่มต้น';
            else if (ex.difficulty === 'Intermediate') mappedDiff = 'ปานกลาง';
            else if (ex.difficulty === 'Advanced') mappedDiff = 'ขั้นสูง';

            let parsedInstructions = [];
            if (ex.instructions) {
                parsedInstructions = ex.instructions.split('|').map(step => step.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
            }

            return {
                id: ex.exercise_id,
                name: `${ex.name_th} ${ex.name_en ? `(${ex.name_en})` : ''}`,
                muscle: mappedMuscle,
                difficulty: mappedDiff,
                description: ex.description,
                instructions: parsedInstructions,
                equipment: ex.equipment || 'ไม่ระบุ',
                imageUrl: ex.media_url,
                videoUrl: ex.video_url,
                secondaryMuscle: ex.secondary_muscle,
                color: 'bg-blue-500'
            };
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        showToast('ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้ โปรดตรวจสอบ Backend', 'error');
    } finally {
        setTimeout(() => isLoading.value = false, 500);
    }
};

onMounted(() => {
    const savedFavs = localStorage.getItem('musclefit_favs');
    if (savedFavs) favorites.value = JSON.parse(savedFavs);

    const savedPlan = localStorage.getItem('musclefit_plan');
    if (savedPlan) weeklyPlan.value = JSON.parse(savedPlan);

    fetchExercises().then(() => {
        let planChanged = false;
        for (const day in weeklyPlan.value) {
            const validIds = weeklyPlan.value[day].filter(id => exercises.value.some(ex => ex.id === id));
            if (validIds.length !== weeklyPlan.value[day].length) {
                weeklyPlan.value[day] = validIds; 
                planChanged = true;
            }
        }
        if (planChanged) {
            localStorage.setItem('musclefit_plan', JSON.stringify(weeklyPlan.value));
        }

        const validFavs = favorites.value.filter(id => exercises.value.some(ex => ex.id === id));
        if (validFavs.length !== favorites.value.length) {
            favorites.value = validFavs;
            localStorage.setItem('musclefit_favs', JSON.stringify(favorites.value));
        }
    });
});

// --- Computed Properties ---
const filteredExercises = computed(() => {
    return exercises.value.filter(ex => {
        const muscleMatch = selectedMuscle.value === 'all' || ex.muscle === selectedMuscle.value;
        const diffMatch = selectedDifficulty.value === 'ทั้งหมด' || ex.difficulty === selectedDifficulty.value;
        const equipMatch = selectedEquipment.value === 'ทั้งหมด' || ex.equipment.includes(selectedEquipment.value);
        const favMatch = !showFavoritesOnly.value || favorites.value.includes(ex.id);
        
        const searchLower = searchQuery.value.toLowerCase().trim();
        const textMatch = searchLower === '' || 
                          ex.name.toLowerCase().includes(searchLower) || 
                          ex.description.toLowerCase().includes(searchLower);

        return muscleMatch && diffMatch && equipMatch && favMatch && textMatch;
    });
});

const plannedExercisesForSelectedDay = computed(() => {
    const ids = weeklyPlan.value[selectedDay.value] || [];
    return ids.map(id => exercises.value.find(ex => ex.id === id)).filter(Boolean);
});

const isWeeklyPlanEmpty = computed(() => {
    return Object.values(weeklyPlan.value).every(dayPlan => dayPlan.length === 0);
});

const getExerciseById = (id) => {
    return exercises.value.find(ex => ex.id === id);
};

// --- Methods & Logic ---
const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => toast.value.show = false, 2000);
};

const showFeatureNotReady = (customMessage) => {
    toast.value = { 
        show: true, 
        message: typeof customMessage === 'string' ? customMessage : 'กำลังพัฒนาระบบส่วนนี้ครับ...', 
        type: 'reset' 
    };
    setTimeout(() => { toast.value.show = false; }, 1500);
};

const toggleFavorite = (id, event) => {
    if(event) event.stopPropagation();
    const index = favorites.value.indexOf(id);
    if (index > -1) {
        favorites.value.splice(index, 1);
        showToast('ลบออกจากท่าโปรดแล้ว', 'reset');
    } else {
        favorites.value.push(id);
        showToast('บันทึกในท่าโปรดแล้ว', 'success');
    }
    localStorage.setItem('musclefit_favs', JSON.stringify(favorites.value));
};

const togglePlan = (dayId, exId) => {
    const dayPlan = weeklyPlan.value[dayId];
    const index = dayPlan.indexOf(exId);
    
    if (index > -1) {
        dayPlan.splice(index, 1);
        showToast(`นำออกจากวัน${daysOfWeek.find(d=>d.id===dayId).name}แล้ว`, 'reset');
    } else {
        dayPlan.push(exId);
        showToast(`เพิ่มลงวัน${daysOfWeek.find(d=>d.id===dayId).name}แล้ว`, 'success');
    }
    localStorage.setItem('musclefit_plan', JSON.stringify(weeklyPlan.value));
};

const confirmClearWeeklyPlan = () => {
    weeklyPlan.value = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
    localStorage.setItem('musclefit_plan', JSON.stringify(weeklyPlan.value));
    showClearConfirmModal.value = false;
    showToast('ล้างตารางฝึกทั้งหมดเรียบร้อยแล้ว', 'reset');
};

const exportWeeklyPlanToImage = async () => {
    if (!weeklyPlanRef.value) return;
    
    isExporting.value = true;
    showToast('กำลังประมวลผลรูปภาพ กรุณารอสักครู่...', 'success');

    try {
        const targetEl = weeklyPlanRef.value;
        targetEl.classList.remove('left-[-9999px]');
        targetEl.classList.add('left-0', 'z-50');

        await new Promise(resolve => setTimeout(resolve, 500)); 

        const canvas = await html2canvas(targetEl, {
            scale: 2, 
            backgroundColor: '#ffffff',
            useCORS: true, 
            logging: false,
            windowWidth: 800
        });

        targetEl.classList.add('left-[-9999px]');
        targetEl.classList.remove('left-0', 'z-50');

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `MuscleFit_WeeklyPlan.png`;
        link.click();

        showToast('ดาวน์โหลดตารางเรียบร้อยแล้ว!', 'success');
    } catch (error) {
        console.error("Export error:", error);
        showToast('เกิดข้อผิดพลาดในการสร้างรูปภาพ', 'error');
        weeklyPlanRef.value.classList.add('left-[-9999px]');
        weeklyPlanRef.value.classList.remove('left-0', 'z-50');
    } finally {
        isExporting.value = false;
    }
};

const calculateHealth = () => {
    if (!calcWeight.value || !calcHeight.value || !calcAge.value) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    const w = parseFloat(calcWeight.value);
    const h = parseFloat(calcHeight.value);
    const hMeter = h / 100;
    const a = parseInt(calcAge.value);
    
    if (h > 0 && w > 0 && a > 0) {
        const bmi = w / (hMeter * hMeter);
        bmiResult.value = bmi.toFixed(1);
        if (bmi < 18.5) { bmiCategory.value = 'น้ำหนักน้อย / ผอม'; bmiColor.value = 'text-blue-500 border-blue-200 bg-blue-50'; } 
        else if (bmi <= 22.9) { bmiCategory.value = 'ปกติ (สุขภาพดี)'; bmiColor.value = 'text-emerald-600 border-emerald-200 bg-emerald-50'; } 
        else if (bmi <= 24.9) { bmiCategory.value = 'ท้วม / โรคอ้วนระดับ 1'; bmiColor.value = 'text-amber-500 border-amber-200 bg-amber-50'; } 
        else if (bmi <= 29.9) { bmiCategory.value = 'อ้วน / โรคอ้วนระดับ 2'; bmiColor.value = 'text-orange-500 border-orange-200 bg-orange-50'; } 
        else { bmiCategory.value = 'อ้วนมาก / โรคอ้วนระดับ 3'; bmiColor.value = 'text-rose-600 border-rose-200 bg-rose-50'; }

        let bmr = calcGender.value === 'male' ? (10 * w) + (6.25 * h) - (5 * a) + 5 : (10 * w) + (6.25 * h) - (5 * a) - 161;
        bmrResult.value = Math.round(bmr);
        tdeeResult.value = Math.round(bmr * parseFloat(calcActivity.value));
    }
};

const resetCalculator = () => {
    calcWeight.value = ''; calcHeight.value = ''; calcAge.value = '';
    calcGender.value = 'male'; calcActivity.value = '1.2';
    bmiResult.value = null; bmrResult.value = null; tdeeResult.value = null;
    showToast('รีเซ็ตข้อมูลแล้ว', 'reset');
};

// --- ฟังก์ชันการจัดการ Admin ---
const handleAdminLogin = () => {
    if (adminPasswordInput.value === 'admin1234') {
        isAdminLoggedIn.value = true;
        adminPasswordInput.value = ''; 
        showToast('เข้าสู่ระบบผู้ดูแลสำเร็จ!', 'success');
    } else {
        showToast('รหัสผ่านไม่ถูกต้อง!', 'error');
    }
};

const handleAdminLogout = () => {
    isAdminLoggedIn.value = false;
    showToast('ออกจากระบบผู้ดูแลแล้ว', 'reset');
};

const handleSave = async () => {
    if (!newExercise.value.name_th || !newExercise.value.video_url) {
        return showToast('กรุณากรอกชื่อท่า (ภาษาไทย) และ URL วิดีโอ', 'error');
    }

    isSubmitting.value = true;
    showToast('กำลังบันทึกข้อมูลลงฐานข้อมูล...', 'success');

    try {
        const response = await fetch('https://faithful-caring-production.up.railway.app/api/exercises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin1234' 
            },
            body: JSON.stringify(newExercise.value)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('เพิ่มท่าออกกำลังกายสำเร็จ! (ID: ' + data.exercise_id + ')', 'success');
            handleResetForm();
            fetchExercises(); // ดึงข้อมูลใหม่มาโชว์ทันที
        } else {
            showToast('ข้อผิดพลาดจากเซิร์ฟเวอร์: ' + (data.error || 'ไม่ทราบสาเหตุ'), 'error');
        }
    } catch (error) {
        showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error');
    } finally {
        isSubmitting.value = false;
    }
};

const handleResetForm = () => {
    newExercise.value = {
        name_th: '', name_en: '', difficulty: 'เริ่มต้น', muscle_group: 'หน้าอก',
        secondary_muscle: '', equipment: 'น้ำหนักตัว', duration: '5-10 นาที',
        description: '', instructions: '', media_url: '', video_url: ''
    };
};

// --- 🟢 ฟังก์ชันลบท่าฝึก (ทำงานเมื่อ Admin ล็อกอินเท่านั้น) ---
const handleDeleteExercise = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบท่าฝึกนี้? (ลบถาวรจากฐานข้อมูล)')) return;

    isSubmitting.value = true;
    try {
        const response = await fetch(`https://faithful-caring-production.up.railway.app/api/exercises/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer admin1234'
            }
        });

        if (response.ok) {
            showToast('ลบท่าออกกำลังกายสำเร็จ!', 'success');
            
            // ลบออกจากตารางและท่าโปรดด้วยถ้ามี
            favorites.value = favorites.value.filter(favId => favId !== id);
            for (const day in weeklyPlan.value) {
                weeklyPlan.value[day] = weeklyPlan.value[day].filter(planId => planId !== id);
            }
            localStorage.setItem('musclefit_favs', JSON.stringify(favorites.value));
            localStorage.setItem('musclefit_plan', JSON.stringify(weeklyPlan.value));
            
            fetchExercises(); // รีเฟรชหน้าเว็บให้ท่าหายไป
        } else {
            const data = await response.json();
            showToast('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่สามารถลบได้'), 'error');
        }
    } catch (error) {
        showToast('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col md:flex-row h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
        
        <aside class="w-full md:w-64 bg-[#0F172A] text-white flex flex-col shrink-0 z-40 shadow-xl border-r border-slate-800">
            <div class="p-6 flex items-center gap-3">
                <div class="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                    <Dumbbell class="w-6 h-6 text-white" />
                </div>
                <span class="text-2xl font-black tracking-tight">MuscleFit</span>
            </div>
            
            <nav class="flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar md:mt-4 flex flex-row md:flex-col gap-2 md:gap-0">
                <button @click="currentPage = 'guide'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'guide' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <Layout class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">รายการท่าฝึก</span>
                </button>
                <button @click="currentPage = 'plan'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'plan' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <Calendar class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">ตารางของฉัน</span>
                </button>
                <button @click="currentPage = 'admin'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <Search class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">ค้นหาท่าฝึก</span>
                </button>
                <button @click="currentPage = 'bmi'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'bmi' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <Calculator class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">คำนวณสุขภาพ</span>
                </button>
                <button @click="currentPage = 'create'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'create' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <PlusCircle class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">จัดการข้อมูล (Admin)</span>
                </button>
                <button @click="currentPage = 'about'" :class="['w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-medium outline-none whitespace-nowrap', currentPage === 'about' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white']">
                    <Info class="w-5 h-5 shrink-0" /> <span class="hidden md:inline">เกี่ยวกับเว็บ</span>
                </button>
            </nav>
        </aside>

        <main class="flex-1 overflow-y-auto min-h-0 relative w-full bg-slate-50">
            
            <transition name="fade">
                <div v-if="toast.show" class="fixed top-6 left-1/2 -translate-x-1/2 z-[100]">
                    <div :class="[
                        toast.type === 'success' ? 'bg-emerald-500' : 
                        toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-800', 
                        'text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 font-medium tracking-wide'
                    ]">
                        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 shrink-0" />
                        <AlertTriangle v-else-if="toast.type === 'error'" class="w-5 h-5 shrink-0" />
                        <RotateCcw v-else class="w-5 h-5 shrink-0" />
                        <span>{{ toast.message }}</span>
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <div v-if="showClearConfirmModal" class="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showClearConfirmModal = false">
                    <transition name="modal" appear>
                        <div class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center relative border border-slate-100">
                            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                                <AlertTriangle class="w-10 h-10" />
                            </div>
                            <h2 class="text-2xl font-black text-slate-800 mb-3 tracking-tight">ยืนยันการล้างตาราง?</h2>
                            <p class="text-slate-500 mb-8 leading-relaxed">คุณแน่ใจหรือไม่ว่าต้องการล้างตารางฝึกทั้งหมดของทุกวัน? <br><span class="text-rose-500 font-bold">ข้อมูลที่จัดไว้จะหายไปทั้งหมด</span></p>
                            <div class="flex flex-col sm:flex-row gap-3 w-full">
                                <button @click="showClearConfirmModal = false" class="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">ยกเลิก</button>
                                <button @click="confirmClearWeeklyPlan" class="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg">ยืนยันการลบ</button>
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>

            <transition name="fade">
                <div v-if="viewingExercise" class="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="viewingExercise = null; showDaySelector = false">
                    <transition name="modal" appear>
                        <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative">
                            <button @click="viewingExercise = null; showDaySelector = false" class="absolute top-6 right-6 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md p-2 rounded-full transition-colors shadow-lg">
                                <X class="w-6 h-6 text-white" />
                            </button>

                            <div class="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
                                <div :class="[!viewingExercise.imageUrl ? viewingExercise.color : 'bg-slate-900', 'md:w-2/5 p-8 flex flex-col justify-end text-white relative min-h-[250px] md:min-h-full overflow-hidden shrink-0']">
                                    <template v-if="viewingExercise.imageUrl">
                                        <img :src="viewingExercise.imageUrl" alt="Exercise Image" @error="viewingExercise.imageUrl = null" class="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 hover:scale-105" />
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                                    </template>
                                    <Dumbbell v-else class="w-16 h-16 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                                    <div class="absolute top-8 left-8 z-10 flex gap-2">
                                        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-sm">{{ viewingExercise.difficulty }}</div>
                                    </div>
                                    
                                    <div class="relative z-10">
                                        <h2 class="text-3xl md:text-4xl font-black mb-4 leading-tight drop-shadow-md">{{ viewingExercise.name }}</h2>
                                        <div class="flex flex-col gap-2">
                                            <p class="text-white font-bold drop-shadow-sm flex items-center gap-2"><Target class="w-5 h-5 shrink-0 text-blue-400" /> กล้ามเนื้อหลัก : {{ muscleGroups.find(m => m.id === viewingExercise.muscle)?.name || viewingExercise.muscle }}</p>
                                            <p v-if="viewingExercise.secondaryMuscle" class="text-slate-200 text-sm font-medium drop-shadow-sm flex items-center gap-2"><Layers class="w-4 h-4 shrink-0 opacity-70" /> กล้ามเนื้อส่วนร่วม : {{ viewingExercise.secondaryMuscle }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex-1 p-8 md:p-10 overflow-y-auto bg-white flex flex-col relative">
                                    <div class="mb-8">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">คำอธิบาย</h4>
                                        <p class="text-slate-600 leading-relaxed text-lg">{{ viewingExercise.description || 'ไม่มีคำอธิบายเพิ่มเติม' }}</p>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mb-8">
                                        <div class="bg-slate-50 p-4 md:p-5 rounded-3xl border border-slate-100 flex flex-col justify-center">
                                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Target class="w-3 h-3 shrink-0"/> อุปกรณ์</p>
                                            <p class="text-slate-800 font-bold text-base">{{ viewingExercise.equipment }}</p>
                                        </div>
                                        <div class="bg-slate-50 p-4 md:p-5 rounded-3xl border border-slate-100 flex flex-col justify-center">
                                            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Zap class="w-3 h-3 shrink-0"/> เซต/ครั้งที่แนะนำ</p>
                                            <p class="text-slate-800 font-bold text-base">3-4 เซต | 10-15 ครั้ง</p>
                                        </div>
                                    </div>

                                    <div class="mb-8">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">วิธีการฝึก</h4>
                                        <div v-if="viewingExercise.instructions.length" class="space-y-4">
                                            <div v-for="(step, idx) in viewingExercise.instructions" :key="idx" class="flex gap-4 items-start">
                                                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm border border-blue-100">{{ idx + 1 }}</div>
                                                <p class="text-slate-600 pt-1 leading-relaxed">{{ step }}</p>
                                            </div>
                                        </div>
                                        <p v-else class="text-slate-400 italic">ไม่มีข้อมูลวิธีการฝึก</p>
                                    </div>

                                    <div v-if="viewingExercise.videoUrl" class="mb-8">
                                        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">วิดีโอสาธิตการฝึก</h4>
                                        <div class="rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                                            <iframe class="w-full aspect-video" :src="viewingExercise.videoUrl" title="Workout Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                        </div>
                                    </div>

                                    <div class="mt-auto"></div>

                                    <div class="pt-6 border-t border-slate-100 mt-4 relative">
                                        <transition name="fade">
                                            <div v-if="showDaySelector" class="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 mb-4 shadow-inner">
                                                <div class="flex items-center justify-between mb-4">
                                                    <h5 class="text-sm font-black text-slate-800 flex items-center gap-2"><Calendar class="w-4 h-4 text-blue-600 shrink-0" /> เลือกวันที่ต้องการฝึก</h5>
                                                    <button @click="showDaySelector = false" class="text-slate-400 hover:text-rose-500 bg-white rounded-full p-1 border border-slate-200 shadow-sm transition-colors"><X class="w-4 h-4"/></button>
                                                </div>
                                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    <button v-for="day in daysOfWeek" :key="day.id" @click="togglePlan(day.id, viewingExercise.id)"
                                                        :class="['px-2 py-3 rounded-xl text-xs font-bold transition-all border outline-none flex flex-col items-center justify-center gap-1 hover:-translate-y-0.5', weeklyPlan[day.id].includes(viewingExercise.id) ? day.color + ' shadow-sm border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-sm']">
                                                        <span>{{ day.name }}</span>
                                                        <span v-if="weeklyPlan[day.id].includes(viewingExercise.id)" class="bg-white/50 px-2 py-0.5 rounded-md text-[9px] mt-0.5 flex items-center"><CheckCircle2 class="w-3 h-3 mr-0.5 shrink-0" /> มีแล้ว</span>
                                                        <span v-else class="text-[9px] text-slate-400 mt-0.5 flex items-center">+ เพิ่มลงวัน</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </transition>

                                        <button @click="showDaySelector = !showDaySelector" :class="['w-full font-bold py-4 rounded-[1.25rem] transition-colors flex items-center justify-center gap-2 shadow-lg outline-none border', showDaySelector ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 shadow-none' : 'bg-slate-900 hover:bg-blue-600 text-white border-transparent']">
                                            <Calendar class="w-5 h-5 shrink-0" /> {{ showDaySelector ? 'ซ่อนหน้าต่างจัดตาราง' : 'เพิ่มในตารางฝึก' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </transition>

            <div v-if="currentPage === 'guide'" class="p-6 md:p-8 max-w-6xl mx-auto pb-20">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-slate-800 tracking-tight">คู่มือการออกกำลังกาย</h1>
                        <p class="text-slate-500 font-medium mt-1">MuscleFit - เลือกส่วนและอุปกรณ์ที่ต้องการฝึก</p>
                    </div>
                    <div class="flex gap-2 flex-wrap items-center">
                        <button @click="showFavoritesOnly = !showFavoritesOnly" :class="['px-5 py-2.5 rounded-xl text-xs font-bold transition-all outline-none flex items-center gap-2 border h-[42px]', showFavoritesOnly ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50']">
                            <Heart :class="['w-4 h-4 shrink-0', showFavoritesOnly ? 'fill-rose-500' : '']" /> ท่าโปรด
                        </button>
                        <div class="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 h-[42px]">
                            <button v-for="level in ['ทั้งหมด', 'เริ่มต้น', 'ปานกลาง', 'ขั้นสูง']" :key="level" @click="selectedDifficulty = level" :class="['px-4 py-1.5 rounded-lg text-xs font-bold transition-all outline-none whitespace-nowrap', selectedDifficulty === level ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50']">
                                {{ level }}
                            </button>
                        </div>
                    </div>
                </div>

                <transition name="fade">
                    <div v-if="showHelpBanner" class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <button @click="showHelpBanner = false" class="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors"><X class="w-5 h-5 text-white" /></button>
                        <div class="flex items-start gap-4 relative z-10">
                            <div class="bg-white/20 p-3 rounded-2xl backdrop-blur-sm shrink-0"><Lightbulb class="w-8 h-8 text-white" /></div>
                            <div>
                                <h3 class="text-xl font-black mb-2">เริ่มต้นใช้งาน MuscleFit</h3>
                                <p class="text-blue-100 font-medium leading-relaxed">เลือกส่วนกล้ามเนื้อและอุปกรณ์ที่คุณต้องการฝึกจากเมนูด้านล่าง กดที่การ์ดเพื่อดูวิดีโอสาธิตและวิธีการฝึกอย่างละเอียด หรือกดที่ไอคอน <Heart class="w-4 h-4 inline-block mx-1 fill-rose-500 text-rose-500" /> เพื่อบันทึกท่าโปรดของคุณ!</p>
                            </div>
                        </div>
                    </div>
                </transition>

                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">1. เลือกส่วนกล้ามเนื้อ</h3>
                <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
                    <button v-for="group in muscleGroups" :key="group.id" @click="selectedMuscle = group.id" :class="['flex items-center gap-3 px-6 py-4 rounded-[1.25rem] transition-all text-sm font-bold shrink-0 snap-start border outline-none', selectedMuscle === group.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 -translate-y-1' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50']">
                        <component :is="group.icon" class="w-5 h-5 shrink-0" /> {{ group.name }}
                    </button>
                </div>

                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2 mt-4">2. เลือกอุปกรณ์</h3>
                <div class="flex gap-3 overflow-x-auto pb-8 no-scrollbar snap-x border-b border-slate-100 mb-6">
                    <button v-for="eq in ['ทั้งหมด', 'น้ำหนักตัว', 'ดัมเบล', 'บาร์เบล', 'เครื่องเล่น']" :key="eq" @click="selectedEquipment = eq" :class="['px-6 py-3 rounded-[1.25rem] transition-all text-sm font-bold shrink-0 snap-start border outline-none', selectedEquipment === eq ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200 -translate-y-1' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50']">
                        {{ eq === 'ทั้งหมด' ? 'อุปกรณ์ทั้งหมด' : eq }}
                    </button>
                </div>

                <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center">
                    <Loader2 class="w-12 h-12 text-blue-500 animate-spin mb-4 shrink-0" />
                    <p class="text-slate-500 font-bold">กำลังดึงข้อมูลจากระบบ...</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <div v-for="ex in filteredExercises" :key="ex.id" @click="viewingExercise = ex" class="group bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
                        <div :class="[!ex.imageUrl ? ex.color : 'bg-slate-800', 'w-full h-48 rounded-[1.25rem] flex items-center justify-center text-white mb-6 shadow-inner relative overflow-hidden shrink-0']">
                            <template v-if="ex.imageUrl"><img :src="ex.imageUrl" alt="thumbnail" @error="ex.imageUrl = null" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"></template>
                            <Dumbbell v-else class="w-12 h-12 opacity-50 group-hover:scale-110 transition-transform duration-500 shrink-0" />
                            <button @click="(e) => toggleFavorite(ex.id, e)" class="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:scale-110 transition-transform"><Heart :class="['w-5 h-5 transition-colors shrink-0', favorites.includes(ex.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400']" /></button>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.1em]">{{ ex.difficulty }}</span>
                            <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide">{{ ex.equipment }}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{{ ex.name }}</h3>
                        <p class="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">{{ ex.description || 'ดูรายละเอียดท่าทางการฝึกเพิ่มเติม' }}</p>
                        <div class="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest pt-4 border-t border-slate-100 mt-auto">วิธีการฝึก <ChevronRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform shrink-0" /></div>
                    </div>
                </div>

                <div v-if="!isLoading && filteredExercises.length === 0" class="py-20 text-center bg-white rounded-[2rem] border border-slate-200 mt-6">
                    <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><SearchX class="w-10 h-10 text-slate-400 shrink-0" /></div>
                    <p class="text-slate-500 font-bold text-lg">ไม่พบท่าออกกำลังกายในหมวดหมู่นี้</p>
                    <button @click="selectedMuscle = 'all'; selectedDifficulty = 'ทั้งหมด'; selectedEquipment = 'ทั้งหมด'; showFavoritesOnly = false" class="mt-4 text-blue-600 font-bold hover:underline">ล้างตัวกรองทั้งหมด</button>
                </div>
            </div>

            <div v-if="currentPage === 'plan'" class="p-6 md:p-8 max-w-5xl mx-auto pb-20">
                <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div class="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner"><Calendar class="w-8 h-8 text-blue-600 shrink-0" /></div>
                        <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-2 tracking-tight">ตารางฝึกของฉัน</h1>
                        <p class="text-slate-500 font-medium">จัดการตารางออกกำลังกายของคุณในแต่ละวัน</p>
                    </div>
                    <div class="flex gap-3">
                        <button @click="showClearConfirmModal = true" :disabled="isWeeklyPlanEmpty" :class="['px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm shrink-0 border', isWeeklyPlanEmpty ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed' : 'bg-white text-rose-500 border-rose-200 hover:bg-rose-50 hover:border-rose-300']"><Trash2 class="w-5 h-5 shrink-0" /><span class="hidden sm:inline">ล้างตาราง</span></button>
                        <button @click="exportWeeklyPlanToImage" :disabled="isExporting || isWeeklyPlanEmpty" :class="['px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm shrink-0', (isExporting || isWeeklyPlanEmpty) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900 hover:shadow-md']"><Loader2 v-if="isExporting" class="w-5 h-5 animate-spin shrink-0" /><Download v-else class="w-5 h-5 shrink-0" /><span class="hidden sm:inline">{{ isExporting ? 'กำลังสร้างรูปภาพ...' : 'บันทึกตารางออกกำลังกาย' }}</span></button>
                    </div>
                </div>

                <div class="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
                    <button v-for="day in daysOfWeek" :key="day.id" @click="selectedDay = day.id" :class="['px-6 py-4 rounded-2xl font-bold text-sm transition-all outline-none whitespace-nowrap shrink-0 snap-start border-2', selectedDay === day.id ? day.color + ' shadow-md scale-105' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50']">วัน{{ day.name }} <span v-if="weeklyPlan[day.id].length" class="ml-2 bg-white/50 text-slate-800 px-2 py-0.5 rounded-full text-xs">{{ weeklyPlan[day.id].length }}</span></button>
                </div>

                <div class="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-200 min-h-[400px]">
                    <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <h3 class="text-xl font-black text-slate-800 flex items-center gap-2"><Dumbbell class="w-6 h-6 text-blue-600 shrink-0" /> ตารางฝึก <span :class="daysOfWeek.find(d=>d.id === selectedDay).color.split(' ')[1]">วัน{{ daysOfWeek.find(d=>d.id === selectedDay).name }}</span></h3>
                        <p class="text-sm font-bold text-slate-400">{{ plannedExercisesForSelectedDay.length }} ท่าฝึก</p>
                    </div>

                    <div v-if="plannedExercisesForSelectedDay.length === 0" class="py-20 text-center flex flex-col items-center">
                        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4"><Dumbbell class="w-10 h-10 text-slate-300 shrink-0" /></div>
                        <h4 class="text-lg font-bold text-slate-600 mb-2">วันนี้ยังไม่มีโปรแกรมฝึก</h4>
                        <p class="text-slate-400 text-sm mb-6 max-w-sm">ไปที่ "รายการท่าฝึก" แล้วกดคลิกที่ท่าที่ต้องการ เพื่อเพิ่มลงในตารางวันนี้สิ!</p>
                        <button @click="currentPage = 'guide'" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all">ค้นหาท่าฝึก</button>
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="(ex, index) in plannedExercisesForSelectedDay" :key="ex.id" class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all cursor-pointer" @click="viewingExercise = ex">
                            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-sm shrink-0">{{ index + 1 }}</div>
                            <div :class="[!ex.imageUrl ? ex.color : 'bg-slate-800', 'w-16 h-16 rounded-xl flex items-center justify-center text-white shrink-0 overflow-hidden relative']">
                                <img v-if="ex.imageUrl" :src="ex.imageUrl" alt="img" @error="ex.imageUrl = null" class="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <Dumbbell v-else class="w-6 h-6 opacity-50 shrink-0" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-lg font-bold text-slate-800 truncate">{{ ex.name }}</h4>
                                <p class="text-xs font-bold text-slate-400 mt-1 truncate">{{ muscleGroups.find(m => m.id === ex.muscle)?.name || ex.muscle }} • {{ ex.equipment }}</p>
                            </div>
                            <button @click.stop="togglePlan(selectedDay, ex.id)" class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors shrink-0"><Trash2 class="w-5 h-5 shrink-0" /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="currentPage === 'admin'" class="p-6 md:p-8 max-w-4xl mx-auto pb-20">
                <div class="mb-8">
                    <h1 class="text-3xl font-black text-slate-800">ค้นหาท่าออกกำลังกาย</h1>
                    <p class="text-slate-500 mt-2 font-medium">ค้นหาตามระดับความยาก อุปกรณ์ และกล้ามเนื้อพร้อมกัน</p>
                </div>
                <div class="space-y-6">
                    <div class="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-200">
                        <div class="relative mb-6">
                            <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 shrink-0" />
                            <input v-model="searchQuery" type="text" placeholder="ค้นหาชื่อท่าฝึก (เช่น สควอท, อก)..." class="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-lg font-medium text-slate-700 placeholder-slate-400" />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="space-y-2"><label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">ระดับความยาก</label><select v-model="selectedDifficulty" class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-medium text-slate-600 cursor-pointer"><option value="ทั้งหมด">ทั้งหมด (All Levels)</option><option value="เริ่มต้น">เริ่มต้น (Beginner)</option><option value="ปานกลาง">ปานกลาง (Intermediate)</option><option value="ขั้นสูง">ขั้นสูง (Advanced)</option></select></div>
                            <div class="space-y-2"><label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">อุปกรณ์</label><select v-model="selectedEquipment" class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-medium text-slate-600 cursor-pointer"><option v-for="eq in ['ทั้งหมด', 'น้ำหนักตัว', 'ดัมเบล', 'บาร์เบล', 'เครื่องเล่น']" :key="eq" :value="eq">{{ eq === 'ทั้งหมด' ? 'อุปกรณ์ทั้งหมด' : eq }}</option></select></div>
                            <div class="space-y-2"><label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">กล้ามเนื้อ</label><select v-model="selectedMuscle" class="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-medium text-slate-600 cursor-pointer"><option value="all">ทั้งหมด (All Muscles)</option><option v-for="m in muscleGroups.filter(g => g.id !== 'all')" :key="m.id" :value="m.id">{{ m.name }}</option></select></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between mb-4 px-2">
                            <h3 class="text-lg font-bold text-slate-700">ผลการค้นหา ({{ filteredExercises.length }})</h3>
                            <button v-if="searchQuery || selectedDifficulty !== 'ทั้งหมด' || selectedMuscle !== 'all' || selectedEquipment !== 'ทั้งหมด'" @click="searchQuery = ''; selectedMuscle = 'all'; selectedDifficulty = 'ทั้งหมด'; selectedEquipment = 'ทั้งหมด'" class="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors">ล้างตัวกรอง</button>
                        </div>
                        <div v-if="isLoading" class="py-10 text-center"><Loader2 class="w-8 h-8 text-blue-500 animate-spin mx-auto shrink-0" /></div>
                        <div v-else class="space-y-4">
                            
                            <div v-for="ex in filteredExercises" :key="ex.id" @click="viewingExercise = ex" class="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-5 group">
                                <div :class="[!ex.imageUrl ? ex.color : 'bg-slate-800', 'w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner overflow-hidden relative']"><img v-if="ex.imageUrl" :src="ex.imageUrl" alt="img" @error="ex.imageUrl = null" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" /><Dumbbell v-else class="w-8 h-8 group-hover:scale-110 transition-transform shrink-0" /></div>
                                
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-1"><span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{{ ex.difficulty }}</span><span class="text-[10px] font-bold text-slate-400">• {{ muscleGroups.find(m => m.id === ex.muscle)?.name || ex.muscle }}</span><span class="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded">{{ ex.equipment }}</span></div>
                                    <h4 class="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{{ ex.name }}</h4>
                                    <p class="text-sm text-slate-500 line-clamp-1 mt-1">{{ ex.description }}</p>
                                </div>
                                
                                <div class="flex items-center shrink-0">
                                    <button v-if="isAdminLoggedIn" @click.stop="handleDeleteExercise(ex.id)" class="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="ลบท่าฝึกนี้">
                                        <Trash2 class="w-5 h-5 shrink-0" />
                                    </button>
                                    <div v-else class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors hidden md:flex">
                                        <ChevronRight class="w-5 h-5 shrink-0" />
                                    </div>
                                </div>
                            </div>

                            <div v-if="filteredExercises.length === 0" class="text-center py-16 bg-white rounded-[2.5rem] border-2 border-slate-200 border-dashed"><div class="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><SearchX class="w-8 h-8 text-slate-400 shrink-0" /></div><p class="text-slate-600 font-bold text-lg">ไม่พบข้อมูลที่ตรงกับการค้นหา</p><p class="text-slate-400 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือปรับตัวกรองใหม่</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="currentPage === 'create'" class="p-8 max-w-4xl mx-auto pb-20">
                <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-slate-800">หน้าจัดการท่าฝึกสำหรับแอดมิน</h1>
                    </div>
                    <button v-if="isAdminLoggedIn" @click="handleAdminLogout" class="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 transition-colors flex items-center gap-2">
                        <LogOut class="w-4 h-4" /> ออกจากระบบ
                    </button>
                </div>

                <div v-if="!isAdminLoggedIn" class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 max-w-md mx-auto text-center mt-10">
                    <div class="w-24 h-24 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                        <Lock class="w-10 h-10" />
                    </div>
                    
                    <input 
                        v-model="adminPasswordInput" 
                        @keyup.enter="handleAdminLogin"
                        type="password" 
                        placeholder="รหัสผ่าน Admin..." 
                        class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4 text-center text-lg tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                    />
                    <button @click="handleAdminLogin" class="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-slate-900 transition-all">
                        ปลดล็อกระบบ
                    </button>
                </div>

                <div v-else class="space-y-6 pb-20">
                    <div class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
                        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
                            <BookOpen class="w-6 h-6 text-blue-600"/> ข้อมูลพื้นฐานของท่าฝึก
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ชื่อท่า (ภาษาไทย) <span class="text-rose-500">*</span></label>
                                <input v-model="newExercise.name_th" type="text" placeholder="เช่น วิดพื้น" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ชื่อท่า (ภาษาอังกฤษ)</label>
                                <input v-model="newExercise.name_en" type="text" placeholder="เช่น Push-up" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">กล้ามเนื้อหลัก</label>
                                <select v-model="newExercise.muscle_group" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none">
                                    <option>หน้าอก</option><option>หลัง</option><option>ขา</option><option>หัวไหล่</option><option>แขน</option><option>หน้าท้อง</option><option>ทั่วร่าง</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">กล้ามเนื้อรอง (พิมพ์เองได้)</label>
                                <input v-model="newExercise.secondary_muscle" type="text" placeholder="เช่น หลังแขน, ไหล่" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ระดับความยาก</label>
                                <select v-model="newExercise.difficulty" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none">
                                    <option>เริ่มต้น</option><option>ปานกลาง</option><option>ขั้นสูง</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">อุปกรณ์ที่ใช้</label>
                                <select v-model="newExercise.equipment" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none">
                                    <option>น้ำหนักตัว</option><option>ดัมเบล</option><option>บาร์เบล</option><option>เครื่องเล่น</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200">
                        <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-100">
                            <FileText class="w-6 h-6 text-emerald-600"/> รายละเอียด และ สื่อ
                        </h2>
                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">คำอธิบาย</label>
                                <textarea v-model="newExercise.description" rows="2" placeholder="ท่านี้ช่วยเรื่องอะไร มีจุดเด่นอย่างไร..." class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors"></textarea>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">ขั้นตอนการฝึก (ใช้ | คั่นระหว่างข้อ เช่น ยกขึ้น | ยกลง)</label>
                                <textarea v-model="newExercise.instructions" rows="2" placeholder="สเต็ป 1 | สเต็ป 2 | สเต็ป 3" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors"></textarea>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">URL รูปภาพ</label>
                                    <input v-model="newExercise.media_url" type="text" placeholder="https://.../image.jpg" class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">URL วิดีโอ YouTube <span class="text-rose-500">*</span></label>
                                    <input v-model="newExercise.video_url" type="text" placeholder="https://www.youtube.com/embed/..." class="w-full px-5 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <button @click="handleSave" :disabled="isSubmitting" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                            <Save v-else class="w-5 h-5" /> 
                            {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลเข้าสู่ฐานข้อมูล' }}
                        </button>
                        <button @click="handleResetForm" class="px-8 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold transition-all">
                            ล้างฟอร์ม
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="currentPage === 'bmi'" class="p-6 md:p-8 max-w-4xl mx-auto pb-20">
                <div class="mb-10 text-center pt-4">
                    <div class="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 rotate-3"><Activity class="w-10 h-10 text-white -rotate-3 shrink-0" /></div>
                    <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">เครื่องคำนวณสุขภาพองค์รวม</h1>
                    <p class="text-slate-500 text-lg">ประเมินค่า BMI, BMR และ TDEE เพื่อวางแผนโภชนาการของคุณ</p>
                </div>
                <div class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 max-w-3xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div class="space-y-2 md:col-span-2">
                            <label class="text-sm font-bold text-slate-500 ml-1">เพศ</label>
                            <div class="flex gap-4">
                                <label class="flex-1 flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-2xl cursor-pointer transition-all hover:bg-slate-50" :class="{'border-blue-500 bg-blue-50/50 text-blue-700': calcGender === 'male'}"><input type="radio" v-model="calcGender" value="male" class="hidden"><span class="font-bold">ชาย</span></label>
                                <label class="flex-1 flex items-center justify-center gap-2 p-4 border border-slate-200 rounded-2xl cursor-pointer transition-all hover:bg-slate-50" :class="{'border-blue-500 bg-blue-50/50 text-blue-700': calcGender === 'female'}"><input type="radio" v-model="calcGender" value="female" class="hidden"><span class="font-bold">หญิง</span></label>
                            </div>
                        </div>
                        <div class="space-y-2"><label class="text-sm font-bold text-slate-500 ml-1">อายุ (ปี)</label><input v-model="calcAge" type="number" placeholder="เช่น 25" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-lg font-medium text-slate-700" /></div>
                        <div class="space-y-2"><label class="text-sm font-bold text-slate-500 ml-1">ระดับกิจกรรม</label><select v-model="calcActivity" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none text-sm font-medium text-slate-700 cursor-pointer"><option value="1.2">ไม่ออกกำลังกายเลย</option><option value="1.375">ออกกำลังกายเบาๆ (1-3 วัน/สัปดาห์)</option><option value="1.55">ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)</option><option value="1.725">ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)</option><option value="1.9">นักกีฬา / ทำงานใช้แรงงานมาก</option></select></div>
                        <div class="space-y-2"><label class="text-sm font-bold text-slate-500 ml-1">น้ำหนัก (กก.)</label><input v-model="calcWeight" type="number" placeholder="เช่น 65" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-lg font-medium text-slate-700" /></div>
                        <div class="space-y-2"><label class="text-sm font-bold text-slate-500 ml-1">ส่วนสูง (ซม.)</label><input v-model="calcHeight" type="number" placeholder="เช่น 170" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-lg font-medium text-slate-700" /></div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 pt-4 border-b border-slate-100 pb-8">
                        <button @click="calculateHealth" class="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-[1.25rem] font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3"><Calculator class="w-5 h-5 shrink-0"/> คำนวณผลลัพธ์</button>
                        <button @click="resetCalculator" class="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.25rem] font-bold transition-all flex items-center justify-center"><RotateCcw class="w-5 h-5 shrink-0" /></button>
                    </div>
                    <transition name="fade">
                        <div v-if="bmiResult" class="mt-8">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div class="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden"><div :class="['absolute top-0 left-0 w-full h-1', bmiColor.split(' ')[2]]"></div><p class="text-sm font-bold text-slate-400 mb-1">BMI (ดัชนีมวลกาย)</p><p class="text-4xl font-black text-slate-800 mb-2">{{ bmiResult }}</p><div class="px-3 py-1 rounded text-xs font-bold" :class="bmiColor">{{ bmiCategory }}</div></div>
                                <div class="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 flex flex-col items-center justify-center"><p class="text-sm font-bold text-slate-400 mb-1">BMR (เผาผลาญพื้นฐาน)</p><p class="text-4xl font-black text-blue-600 mb-1">{{ bmrResult }}</p><p class="text-xs font-bold text-slate-500">kcal / วัน</p></div>
                                <div class="bg-slate-800 text-white rounded-3xl p-6 text-center shadow-lg flex flex-col items-center justify-center relative overflow-hidden"><div class="absolute -right-4 -top-4 opacity-10"><Zap class="w-24 h-24 shrink-0" /></div><p class="text-sm font-bold text-slate-300 mb-1 relative z-10">TDEE (เผาผลาญรวม)</p><p class="text-4xl font-black text-emerald-400 mb-1 relative z-10">{{ tdeeResult }}</p><p class="text-xs font-bold text-slate-400 relative z-10">kcal / วัน</p></div>
                            </div>
                            <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 text-left flex items-start gap-4"><Info class="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /><div class="text-slate-600 text-sm leading-relaxed space-y-2"><p><strong>คำแนะนำ:</strong> หากต้องการ <strong>ลดน้ำหนัก</strong> ควรทานให้น้อยกว่าค่า TDEE ประมาณ 300-500 kcal/วัน</p><p>หากต้องการ <strong>เพิ่มกล้ามเนื้อ</strong> ควรทานให้มากกว่าค่า TDEE ประมาณ 300-500 kcal/วัน ควบคู่กับการเวทเทรนนิ่ง</p></div></div>
                        </div>
                    </transition>
                </div>
            </div>

            <div v-if="currentPage === 'about'" class="p-6 md:p-8 max-w-4xl mx-auto pb-20">
                <div class="mb-10 text-center pt-4">
                    <div class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><Dumbbell class="w-10 h-10 text-blue-600 shrink-0" /></div>
                    <h1 class="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">เกี่ยวกับ MuscleFit</h1>
                    <p class="text-slate-500 text-lg">แพลตฟอร์มคู่มือการออกกำลังกายที่สร้างมาเพื่อทุกคน</p>
                </div>
                <div class="space-y-8">
                    <div class="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
                        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 relative z-10"><Target class="w-6 h-6 text-blue-600 shrink-0" /> จุดประสงค์ของเว็บไซต์</h2>
                        <p class="text-slate-600 leading-relaxed text-lg mb-10 relative z-10">เว็บไซต์ <strong class="text-blue-600 font-black">MuscleFit</strong> ถูกออกแบบมาเพื่อเป็นฐานข้อมูลที่ใช้งานง่าย รวบรวมท่าออกกำลังกายที่ปลอดภัยและมีประสิทธิภาพ ไม่ว่าคุณจะเป็นมือใหม่ที่เพิ่งเข้ายิมวันแรก หรือมือโปรที่ต้องการทบทวนท่าทาง เราพร้อมที่จะเป็นผู้ช่วยให้คุณบรรลุเป้าหมายทางสุขภาพ</p>
                        <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 mt-12 relative z-10"><Star class="w-6 h-6 text-amber-500 shrink-0" /> ฟีเจอร์หลัก</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><div class="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Calendar class="w-6 h-6 shrink-0" /></div><h3 class="font-bold text-slate-800 mb-2">จัดตารางฝึก</h3><p class="text-sm text-slate-500">เลือกท่าต่างๆ ลงในวันจันทร์-อาทิตย์ เพื่อวางแผนออกกำลังกาย</p></div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><div class="bg-rose-100 w-12 h-12 rounded-2xl flex items-center justify-center text-rose-500 mb-4"><Heart class="w-6 h-6 shrink-0" /></div><h3 class="font-bold text-slate-800 mb-2">บันทึกท่าโปรด</h3><p class="text-sm text-slate-500">เลือกเก็บท่าออกกำลังกายที่ชอบไว้ดูส่วนตัวได้</p></div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><div class="bg-purple-100 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-4"><Calculator class="w-6 h-6 shrink-0" /></div><h3 class="font-bold text-slate-800 mb-2">คำนวณสุขภาพ</h3><p class="text-sm text-slate-500">มีเครื่องมือเช็คดัชนีมวลกาย BMI, BMR และ TDEE</p></div>
                            <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:bg-white hover:shadow-lg transition-all"><div class="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><Smartphone class="w-6 h-6 shrink-0" /></div><h3 class="font-bold text-slate-800 mb-2">รองรับทุกอุปกรณ์</h3><p class="text-sm text-slate-500">UI ถูกออกแบบมาให้ใช้งานได้ดีทั้งบนมือถือและคอมพิวเตอร์</p></div>
                        </div>
                        <div class="mt-12 bg-rose-50 border border-rose-200 rounded-3xl p-6 flex gap-4 items-start relative z-10"><AlertTriangle class="w-6 h-6 text-rose-600 shrink-0 mt-1" /><div><h4 class="font-bold text-rose-800 mb-1">ข้อควรระวัง (Disclaimer)</h4><p class="text-sm text-rose-700 leading-relaxed">ข้อมูลทั้งหมดบนแพลตฟอร์มเป็นเพียงแนวทางทั่วไปเท่านั้น หากคุณมีโรคประจำตัวหรือเคยได้รับบาดเจ็บ โปรดปรึกษาแพทย์หรือนักกายภาพบำบัดก่อนเริ่มต้นโปรแกรมการออกกำลังกายทุกครั้ง</p></div></div>
                        <div class="mt-8 border-t border-slate-200 pt-8 relative z-10"><div class="bg-slate-800 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-xl"><div class="absolute -right-10 -top-10 opacity-10"><BookOpen class="w-40 h-40" /></div><h4 class="text-blue-400 font-bold uppercase tracking-widest text-xs mb-3 relative z-10">Academic Project</h4><p class="text-lg md:text-xl font-bold leading-relaxed mb-4 relative z-10">โปรเจกต์นี้เป็นส่วนหนึ่งของการศึกษาในรายวิชา<br><span class="text-blue-300">การดำเนินงานการพัฒนาซอฟต์แวร์ (DevOps)</span><br>และ <span class="text-emerald-300">การพัฒนาซอฟต์แวร์ส่วนหลัง (Back-end Development)</span></p><div class="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mt-2 relative z-10"><p class="text-sm text-slate-300 font-medium">พัฒนาโดยกลุ่ม <strong class="text-white">เทอมที่ฮาเอาแต้</strong><br>สาขาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยพะเยา (ปีการศึกษา 2568)</p></div></div></div>
                    </div>
                </div>
            </div>

            <div style="position: absolute; top: -9999px; left: -9999px; width: 800px; z-index: -10;">
                <div id="weekly-export-container" class="bg-white p-10 font-sans" ref="weeklyPlanRef">
                    <div class="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100"><div class="bg-blue-600 p-3 rounded-2xl"><Dumbbell class="w-8 h-8 text-white shrink-0" /></div><div><h1 class="text-3xl font-black text-slate-800 tracking-tight leading-normal" style="margin:0;">ตารางฝึกประจำสัปดาห์</h1><p class="text-blue-600 font-bold uppercase tracking-[0.2em] mt-1 text-sm leading-normal" style="margin:0;">MuscleFit Workout Plan</p></div></div>
                    <div class="space-y-6">
                        <template v-for="day in daysOfWeek" :key="'export-' + day.id">
                            <div v-if="weeklyPlan[day.id].length > 0" class="bg-slate-50 rounded-3xl p-6 border border-slate-100" style="page-break-inside: avoid;">
                                <div class="flex items-center gap-3 mb-5 border-b border-slate-200 pb-3"><div :class="['w-3 h-3 rounded-full', day.dot]"></div><h3 class="text-xl font-black text-slate-800 leading-normal" style="margin:0;">วัน{{ day.name }}</h3><span class="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md ml-auto">{{ weeklyPlan[day.id].length }} ท่าฝึก</span></div>
                                <div class="space-y-3">
                                    <div v-for="(exId, idx) in weeklyPlan[day.id]" :key="'export-ex-'+exId" class="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100">
                                        <div class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-black text-sm shrink-0 border border-slate-200">{{ idx + 1 }}</div>
                                        <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800 flex items-center justify-center relative"><img v-if="getExerciseById(exId)?.imageUrl" :src="getExerciseById(exId).imageUrl" @error="getExerciseById(exId).imageUrl = null" class="absolute inset-0 w-full h-full object-cover" /><Dumbbell v-else class="w-5 h-5 text-white opacity-50 shrink-0" /></div>
                                        <div class="flex-1"><h4 class="font-bold text-slate-800 text-lg leading-normal pb-1" style="margin:0;">{{ getExerciseById(exId)?.name }}</h4><p class="text-xs font-bold text-slate-400 mt-0.5 leading-normal" style="margin:0;">{{ muscleGroups.find(m => m.id === getExerciseById(exId)?.muscle)?.name || 'ทั่วไป' }} • {{ getExerciseById(exId)?.equipment }}</p></div>
                                        <div class="text-right"><p class="text-sm font-black text-blue-600 leading-normal" style="margin:0;">3-4 เซต</p><p class="text-[10px] font-bold text-slate-400 uppercase leading-normal" style="margin:0;">10-15 ครั้ง</p></div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="mt-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest leading-normal">Generated by MuscleFit App</div>
                </div>
            </div>

        </main>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;900&display=swap');

.font-sans { font-family: 'Prompt', sans-serif; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); }
.modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>