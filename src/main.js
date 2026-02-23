import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Exercises from './views/Exercises.vue'
import Dashboard from './views/Admin/Dashboard.vue'
import './style.css' // ไฟล์ Tailwind CSS

// การตั้งค่า Router เพื่อสลับหน้า
const routes = [
  { path: '/', component: Home },
  { path: '/exercises', component: Exercises },
  { path: '/admin', component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')