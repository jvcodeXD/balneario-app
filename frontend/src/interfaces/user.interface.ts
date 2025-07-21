import { UserRole } from '@/dtos'

export interface UsuarioInterface {
  id: string
  username: string
  fullname: string
  role: UserRole
  picture: string
  password?: string
}
