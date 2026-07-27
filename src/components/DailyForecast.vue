<script setup lang="ts">
import type { DayWeather, Unit } from '@/types/weather'
import WeatherIcon from './WeatherIcon.vue'
defineProps<{ days: DayWeather[]; unit: Unit }>()
</script>
<template>
  <section class="daily-panel glass">
    <div class="section-heading"><div><p class="eyebrow">The week ahead</p><h2>7-day forecast</h2></div></div>
    <div class="days-list">
      <article v-for="(day, i) in days" :key="day.date" class="day-row">
        <div class="day-name"><strong>{{ i === 0 ? 'Today' : new Date(day.date + 'T12:00').toLocaleDateString(undefined, { weekday: 'long' }) }}</strong><span>{{ new Date(day.date + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}</span></div>
        <div class="day-condition"><WeatherIcon :condition="day.condition" size="sm" /><span>{{ day.condition }}</span></div>
        <span class="rain">⌁ {{ day.rain }}%</span>
        <div class="temps"><strong>{{ Math.round(unit === 'c' ? day.maxC : day.maxF) }}°</strong><span>{{ Math.round(unit === 'c' ? day.minC : day.minF) }}°</span></div>
      </article>
    </div>
  </section>
</template>
