import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'
import './assets/main.css'

const { restore, user } = useAuth()
router.beforeEach(async to => {
  await restore()
  if (to.meta.requiresAuth && !user.value) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.guestOnly && user.value) return { name: 'profile' }
})

createApp(App).use(router).mount('#app')
