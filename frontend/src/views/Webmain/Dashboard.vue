<script setup>
import { ref, reactive } from 'vue'

const isSubmitting = ref(false)
const showSuccess = ref(false)
const lastAddedName = ref('')
const recentList = ref([])

const musclesOptions = ['อกส่วนบน', 'อกส่วนกลาง', 'หลังแขน', 'หัวไหล่', 'ปีกหลัง', 'หน้าท้อง']
const equipmentOptions = ['Bodyweight', 'Dumbbell', 'Barbell', 'Kettlebell']

const form = reactive({
  nameTh: '',
  nameEn: '',
  difficulty: 'Beginner',
  category: 'Chest',
  selectedMuscles: [],
  equipment: 'Bodyweight'
})

const handleSubmit = () => {
  if (!form.nameTh) return
  isSubmitting.value = true

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

const resetForm = () => {
  form.nameTh = ''
  form.nameEn = ''
  form.difficulty = 'Beginner'
  form.category = 'Chest'
  form.selectedMuscles = []
  form.equipment = 'Bodyweight'
}

const removeItem = (index) => {
  recentList.value.splice(index, 1)
}
</script>

<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold mb-6">Dashboard Admin</h1>

    <form @submit.prevent="handleSubmit" class="space-y-4 max-w-lg">
      <input v-model="form.nameTh" type="text" placeholder="ชื่อท่า (ไทย)" class="border p-2 w-full" />
      <input v-model="form.nameEn" type="text" placeholder="ชื่อท่า (English)" class="border p-2 w-full" />

      <select v-model="form.difficulty" class="border p-2 w-full">
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
      </button>
    </form>

    <div class="mt-8">
      <h2 class="font-bold mb-2">รายการล่าสุด</h2>
      <div v-if="recentList.length === 0">ยังไม่มีข้อมูล</div>

      <div v-for="(item, index) in recentList" :key="index" class="border p-2 mb-2 flex justify-between">
        <span>{{ item.nameTh }}</span>
        <button @click="removeItem(index)" class="text-red-500">ลบ</button>
      </div>
    </div>

    <div v-if="showSuccess" class="mt-6 text-green-600 font-bold">
      บันทึก {{ lastAddedName }} สำเร็จ
      <button @click="showSuccess = false" class="ml-4 text-blue-600">ปิด</button>
    </div>
  </div>
</template>

<style scoped>
</style>