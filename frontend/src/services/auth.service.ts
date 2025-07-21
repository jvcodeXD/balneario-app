import api from '@/plugins/axios'

export const loginService = async (username: string, pass: string) => {
  try {
    const response = await api.post('/auth/login', { username, pass })
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al iniciar sesión')
  }
}

export const logoutService = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al cerrar sesión')
  }
}

export const refreshService = async () => {
  try {
    const response = await api.post('/auth/refresh')
    return response.data
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || 'Error al renovar sesión')
  }
}
