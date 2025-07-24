import { createRouter, createWebHistory } from 'vue-router'
import {
  AdminRoutes,
  AuthRoutes,
  ClientRoutes,
  NotFoundRoutes,
  PublicRoutes,
  UserRoutes,
} from './modules'
import { useAuthStore } from '@/store/auth'
import { UserRole } from '@/dtos'

const routes = [
  ...PublicRoutes,
  ...AuthRoutes,
  ...AdminRoutes,
  ...UserRoutes,
  ...NotFoundRoutes,
  ...ClientRoutes,
]

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
    return next({
      name:
        authStore.role === UserRole.ADMIN
          ? 'AdminDashboard'
          : authStore.role === UserRole.USER
            ? 'UserDashboard'
            : 'ClientDashboard',
    })
  }

  if (authStore.isAuthenticated && to.name === 'Login') {
    return next({
      name:
        authStore.role === UserRole.ADMIN
          ? 'AdminDashboard'
          : authStore.role === UserRole.USER
            ? 'UserDashboard'
            : 'ClientDashboard',
    })
  }

  next()
})

export default router
