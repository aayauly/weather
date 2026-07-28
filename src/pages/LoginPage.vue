<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/AuthShell.vue'
import { useAuth } from '@/composables/useAuth'
import { friendlyAuthError } from '@/services/authApi'

const email = ref('')
const password = ref('')
const error = ref('')
const { login, loading } = useAuth()
const router = useRouter()
const route = useRoute()

const submit = async () => {
  error.value = ''
  try {
    await login(email.value, password.value)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/profile')
  } catch (e) { error.value = friendlyAuthError(e) }
}
</script>
<template>
  <AuthShell eyebrow="Welcome back" title="Your weather, waiting for you." subtitle="Sign in to keep your places and profile close, wherever the forecast takes you.">
    <div class="auth-card-head"><p class="eyebrow">Member access</p><h2>Sign in to Atmos</h2><p>Enter your details to continue.</p></div>
    <form class="auth-form" @submit.prevent="submit">
      <div v-if="error" class="form-error" role="alert">{{ error }}</div>
      <label>Email address<input v-model.trim="email" type="email" autocomplete="email" placeholder="you@example.com" required /></label>
      <label>Password<input v-model="password" type="password" autocomplete="current-password" placeholder="Your password" minlength="8" required /></label>
      <button class="primary-btn" :disabled="loading">{{ loading ? 'Signing in…' : 'Sign in' }}</button>
    </form>
    <p class="auth-switch">New to Atmos? <RouterLink to="/register">Create an account</RouterLink></p>
  </AuthShell>
</template>
