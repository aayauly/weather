<script setup lang="ts">
import { ref } from 'vue'
import type { Unit } from '@/types/weather'
defineProps<{ theme: string; unit: Unit }>()
const emit = defineEmits<{ search: [city: string]; locate: []; toggleTheme: []; setUnit: [unit: Unit] }>()
const query = ref('')
let timer: ReturnType<typeof setTimeout>
const submit = () => { if (query.value.trim()) emit('search', query.value.trim()) }
const suggest = () => { clearTimeout(timer); timer = setTimeout(() => undefined, 350) }
</script>
<template>
  <header class="topbar">
    <a class="brand" href="/" aria-label="Atmos home"><span class="brand-mark">◌</span> atmos</a>
    <form class="search" role="search" @submit.prevent="submit">
      <span aria-hidden="true">⌕</span>
      <input v-model="query" @input="suggest" type="search" placeholder="Search city..." aria-label="Search for a city" />
      <kbd>↵</kbd>
    </form>
    <div class="header-actions">
      <button class="icon-btn location" aria-label="Use my location" title="Use my location" @click="$emit('locate')">⌖</button>
      <div class="unit-toggle" aria-label="Temperature unit">
        <button :class="{ active: unit === 'c' }" @click="$emit('setUnit', 'c')">°C</button>
        <button :class="{ active: unit === 'f' }" @click="$emit('setUnit', 'f')">°F</button>
      </div>
      <button class="icon-btn" :aria-label="theme === 'dark' ? 'Use light mode' : 'Use dark mode'" @click="$emit('toggleTheme')">{{ theme === 'dark' ? '☼' : '☾' }}</button>
    </div>
  </header>
</template>
