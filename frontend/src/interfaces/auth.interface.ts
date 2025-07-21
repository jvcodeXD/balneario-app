import { UserRole } from '@/dtos'

export interface AuthUser {
  id: string
  username: string
  fullname: string
  role: UserRole
  picture: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}
