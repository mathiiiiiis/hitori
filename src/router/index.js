import { createRouter, createWebHistory } from 'vue-router'
import AuthCallback from '@/views/auth/AuthCallback.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import TestPage from '@/views/TestPage.vue'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/auth/callback', component: AuthCallback },
    { path: '/login', component: LoginPage},
    { path: '/test', component: TestPage},
    { path: '/', component: HomePage },
  ],
})

export default router
