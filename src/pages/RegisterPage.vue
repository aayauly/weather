<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthShell from '@/components/AuthShell.vue'
import { useAuth } from '@/composables/useAuth'
import { friendlyAuthError } from '@/services/authApi'

const name = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const { register, loading } = useAuth()
const router = useRouter()
const strength = computed(() => Math.min(4, [password.value.length >= 8, /[A-Z]/.test(password.value), /\d/.test(password.value), /[^A-Za-z0-9]/.test(password.value)].filter(Boolean).length))

const submit = async () => {
  error.value = ''
  if (password.value !== confirm.value) { error.value = 'Passwords do not match.'; return }
  try { await register(name.value, email.value, password.value); await router.push('/profile') }
  catch (e) { error.value = friendlyAuthError(e) }
}
</script>
<template>
  <AuthShell eyebrow="Join Atmos" title="Make every forecast feel personal." subtitle="Create your private weather space and carry your favorite places across every device.">
    <div class="auth-card-head"><p class="eyebrow">Create account</p><h2>Start your weather journal</h2><p>It only takes a moment.</p></div>
    <form class="auth-form" @submit.prevent="submit">
      <div v-if="error" class="form-error" role="alert">{{ error }}</div>
      <label>Full name<input v-model.trim="name" autocomplete="name" placeholder="Your name" minlength="2" maxlength="60" required /></label>
      <label>Email address<input v-model.trim="email" type="email" autocomplete="email" placeholder="you@example.com" required /></label>
      <label>Password<input v-model="password" type="password" autocomplete="new-password" placeholder="At least 8 characters" minlength="8" required /></label>
      <div class="strength" :aria-label="`Password strength ${strength} of 4`"><i v-for="n in 4" :key="n" :class="{ active: n <= strength }"></i></div>
      <label>Confirm password<input v-model="confirm" type="password" autocomplete="new-password" placeholder="Repeat password" minlength="8" required /></label>
      <label class="terms"><input type="checkbox" required /><span>I agree to the Terms and Privacy Policy.</span></label>
      <button class="primary-btn" :disabled="loading">{{ loading ? 'Creating account…' : 'Create account' }}</button>
    </form>
    <p class="auth-switch">Already have an account? <RouterLink to="/login">Sign in</RouterLink></p>
  </AuthShell>
</template>
