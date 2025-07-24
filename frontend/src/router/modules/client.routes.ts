import { UserRole } from '@/dtos'
import ClientDashboard from '@/views/dashboard/ClientDashboard.vue'

export default [
  {
    path: '/client-dashboard',
    name: 'ClientDashboard',
    component: ClientDashboard,
    meta: { requiresAuth: true, role: UserRole.CLIENT },
  },
]
