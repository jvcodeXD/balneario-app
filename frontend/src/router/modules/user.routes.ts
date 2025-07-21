import { UserRole } from '@/dtos'
import UserDashboard from '@/views/dashboard/UserDashboard.vue'
import { Reportes } from '@/views/users/Reporte'
import { VentaHome } from '@/views/users/Venta'

export default [
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: UserRole.USER },
  },
  {
    path: '/user/venta',
    name: 'Venta',
    component: VentaHome,
    meta: { requiresAuth: true, role: UserRole.USER },
  },
  {
    path: '/user/reportes',
    name: 'ReporteUsuario',
    component: Reportes,
    meta: { requiresAuth: true, role: UserRole.USER },
  },
]
