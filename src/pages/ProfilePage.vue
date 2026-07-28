<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { friendlyAuthError, uploadAvatar } from '@/services/authApi'

const { user, logout, loading, setUser } = useAuth()
const router = useRouter()
const uploading = ref(false)
const error = ref('')
const input = ref<HTMLInputElement>()

const selectAvatar = () => input.value?.click()
const changeAvatar = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 3 * 1024 * 1024) { error.value = 'Choose an image smaller than 3 MB.'; return }
  uploading.value = true; error.value = ''
  try { setUser(await uploadAvatar(file)) }
  catch (e) { error.value = friendlyAuthError(e) }
  finally { uploading.value = false }
}
const signOut = async () => { await logout(); await router.push('/') }
</script>
<template>
  <main class="profile-page">
    <div class="profile-top"><RouterLink class="auth-brand" to="/"><span>◌</span> atmos</RouterLink><RouterLink to="/" class="back-weather">← Back to weather</RouterLink></div>
    <section v-if="user" class="profile-card glass">
      <p class="eyebrow">Your Atmos</p><h1>Profile</h1>
      <div class="profile-main">
        <button class="avatar-upload" @click="selectAvatar" :disabled="uploading" aria-label="Upload profile picture">
          <img v-if="user.avatarUrl" :src="user.avatarUrl" alt="Profile picture" />
          <span v-else>{{ user.name.slice(0, 1).toUpperCase() }}</span>
          <i>{{ uploading ? '…' : '＋' }}</i>
        </button>
        <input ref="input" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="changeAvatar" />
        <div><h2>{{ user.name }}</h2><p>{{ user.email }}</p><small>Member since {{ new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }}</small></div>
      </div>
      <div v-if="error" class="form-error" role="alert">{{ error }}</div>
      <div class="profile-storage"><span>☁</span><div><strong>Cloud profile</strong><p>Your account data is stored in Cloudflare D1 and your image in R2.</p></div><b>Protected</b></div>
      <button class="secondary-btn" :disabled="loading" @click="signOut">Sign out</button>
    </section>
  </main>
</template>
