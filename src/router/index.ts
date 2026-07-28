import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: () => import('@/pages/RegisterPage.vue'), meta: { guestOnly: true } },
    { path: '/profile', name: 'profile', component: () => import('@/pages/ProfilePage.vue'), meta: { requiresAuth: true } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
