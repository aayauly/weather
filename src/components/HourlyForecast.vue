<script setup lang="ts">
import type { HourWeather, Unit } from '@/types/weather'
import WeatherIcon from './WeatherIcon.vue'
defineProps<{ hours: HourWeather[]; unit: Unit }>()
</script>
<template>
  <section class="forecast-section">
    <div class="section-heading"><div><p class="eyebrow">Today</p><h2>Hourly forecast</h2></div><span>Next 24 hours</span></div>
    <div class="hourly-scroll glass">
      <article v-for="(hour, i) in hours" :key="hour.time" class="hour-card" :class="{ now: i === 0 }">
        <time>{{ i === 0 ? 'Now' : new Date(hour.time).toLocaleTimeString([], { hour: 'numeric' }) }}</time>
        <WeatherIcon :condition="hour.condition" size="sm" />
        <strong>{{ Math.round(unit === 'c' ? hour.tempC : hour.tempF) }}°</strong>
        <span class="rain">⌁ {{ hour.rain }}%</span>
      </article>
    </div>
  </section>
</template>
