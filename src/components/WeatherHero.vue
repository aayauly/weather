<script setup lang="ts">
import type { Unit, WeatherData } from '@/types/weather'
import WeatherIcon from './WeatherIcon.vue'
defineProps<{ weather: WeatherData; unit: Unit; favorite: boolean }>()
defineEmits<{ favorite: [] }>()
</script>
<template>
  <section class="hero-card glass">
    <div class="hero-copy">
      <div class="location-line"><span>⌖</span><h1>{{ weather.city }}</h1><span class="country">{{ weather.country }}</span></div>
      <p class="hero-date">{{ new Date(weather.localtime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) }} · {{ new Date(weather.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
      <div class="temperature">{{ Math.round(unit === 'c' ? weather.tempC : weather.tempF) }}<sup>°</sup></div>
      <div class="condition"><WeatherIcon :condition="weather.condition" size="sm" /><strong>{{ weather.condition }}</strong><span>Feels like {{ Math.round(unit === 'c' ? weather.feelsC : weather.feelsF) }}°</span></div>
    </div>
    <div class="hero-visual">
      <button class="favorite" :class="{ saved: favorite }" :aria-label="favorite ? 'Remove from favorites' : 'Save to favorites'" @click="$emit('favorite')">{{ favorite ? '★' : '☆' }}</button>
      <div class="orb"><WeatherIcon :condition="weather.condition" size="lg" /></div>
      <div class="high-low"><span>H: {{ Math.round(unit === 'c' ? weather.daily[0].maxC : weather.daily[0].maxF) }}°</span><span>L: {{ Math.round(unit === 'c' ? weather.daily[0].minC : weather.daily[0].minF) }}°</span></div>
    </div>
  </section>
</template>
