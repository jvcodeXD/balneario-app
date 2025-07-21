import { createRouter, createWebHistory } from 'vue-router'
import { AdminRoutes, AuthRoutes, NotFoundRoutes, PublicRoutes, UserRoutes } from './modules'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/dtos'

const routes = [...PublicRoutes, ...AuthRoutes, ...AdminRoutes, ...UserRoutes, ...NotFoundRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAuth && to.meta.role !== authStore.role) {
    return next({ name: authStore.role === UserRole.ADMIN ? 'AdminDashboard' : 'UserDashboard' })
  }

  if (authStore.isAuthenticated && to.name === 'Login') {
    return next({ name: authStore.role === UserRole.ADMIN ? 'AdminDashboard' : 'UserDashboard' })
  }

  next()
})

export default router
