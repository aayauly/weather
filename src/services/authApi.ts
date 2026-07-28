import axios from 'axios'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

const api = axios.create({ baseURL: '/api', timeout: 15000, withCredentials: true })

export async function getSession(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get('/auth/me')
    return data.user
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null
    throw error
  }
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/login', { email, password })
  return data.user
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data.user
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function uploadAvatar(file: File): Promise<AuthUser> {
  const form = new FormData()
  form.append('avatar', file)
  const { data } = await api.post('/profile/avatar', form)
  return data.user
}

export function friendlyAuthError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to reach the server. Please check your connection.'
    return error.response.data?.error || 'Something went wrong. Please try again.'
  }
  return 'Something went wrong. Please try again.'
}
