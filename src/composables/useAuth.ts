import { ref } from 'vue'
import * as authApi from '@/services/authApi'
import type { AuthUser } from '@/services/authApi'

const user = ref<AuthUser | null>(null)
const loading = ref(false)
let restored = false
let restoring: Promise<void> | null = null

export function useAuth() {
  const restore = async () => {
    if (restored) return
    if (restoring) return restoring
    restoring = (async () => {
      try { user.value = await authApi.getSession() }
      catch { user.value = null }
      finally { restored = true; restoring = null }
    })()
    return restoring
  }
  const login = async (email: string, password: string) => {
    loading.value = true
    try { user.value = await authApi.login(email, password); return user.value }
    finally { loading.value = false }
  }
  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    try { user.value = await authApi.register(name, email, password); return user.value }
    finally { loading.value = false }
  }
  const logout = async () => {
    loading.value = true
    try { await authApi.logout(); user.value = null; restored = true }
    finally { loading.value = false }
  }
  const setUser = (next: AuthUser) => { user.value = next }
  return { user, loading, restore, login, register, logout, setUser }
}
