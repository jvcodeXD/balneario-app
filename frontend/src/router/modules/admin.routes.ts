import AdminDashboard from '@/views/dashboard/AdminDashboard.vue'
import Users from '@/views/admin/users/Users.vue'
import { UserRole } from '@/dtos'
import { Ambientes } from '@/views/admin/ambiente'
import { Precios } from '@/views/admin/precio'
import { Eventos } from '@/views/admin/evento'
import { Reporte } from '@/views/admin/reporte'

export default [
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
  {
    path: '/admin/usuarios',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
  {
    path: '/admin/ambientes',
    name: 'Ambientes',
    component: Ambientes,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
  {
    path: '/admin/precios',
    name: 'Precios',
    component: Precios,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
  {
    path: '/admin/eventos',
    name: 'Eventos',
    component: Eventos,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
  {
    path: '/admin/reportes',
    name: 'Reportes',
    component: Reporte,
    meta: { requiresAuth: true, role: UserRole.ADMIN },
  },
]
