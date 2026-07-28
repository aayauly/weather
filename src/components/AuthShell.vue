<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{ eyebrow: string; title: string; subtitle: string }>()
</script>
<template>
  <main class="auth-page">
    <div class="auth-ambient"><i></i><i></i></div>
    <RouterLink class="auth-brand" to="/" aria-label="Back to Atmos weather"><span>◌</span> atmos</RouterLink>
    <section class="auth-layout">
      <div class="auth-story">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
        <div class="auth-weather-art"><span>☀️</span><i></i><i></i></div>
        <div class="auth-benefits">
          <span>✦ Sync your favorite cities</span>
          <span>✦ Keep your profile across devices</span>
          <span>✦ Secure, private cloud storage</span>
        </div>
      </div>
      <div class="auth-card glass"><slot /></div>
    </section>
  </main>
</template>
