import { createRouter, createWebHistory } from 'vue-router'
import AuthCallback from '@/views/AuthCallback.vue'
import LoginPage from '@/views/LoginPage.vue'
import TestPage from '@/views/TestPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/auth/callback', component: AuthCallback },
    { path: '/login', component: LoginPage},
    { path: '/test', component: TestPage}
  ],
})

export default router
