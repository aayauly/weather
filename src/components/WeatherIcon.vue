<script setup lang="ts">
defineProps<{ condition: string; size?: 'sm' | 'md' | 'lg' }>()
const symbol = (c: string) => {
  const x = c.toLowerCase()
  if (x.includes('thunder')) return '⛈️'
  if (x.includes('snow') || x.includes('sleet')) return '🌨️'
  if (x.includes('rain') || x.includes('drizzle')) return '🌦️'
  if (x.includes('cloud') || x.includes('overcast')) return '⛅'
  if (x.includes('mist') || x.includes('fog')) return '🌫️'
  return '☀️'
}
</script>
<template><span class="weather-icon" :class="size || 'md'" role="img" :aria-label="condition">{{ symbol(condition) }}</span></template>
