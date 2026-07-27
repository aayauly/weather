<script setup lang="ts">
import { computed } from 'vue'
import type { Unit, WeatherData } from '@/types/weather'
const props = defineProps<{ weather: WeatherData; unit: Unit }>()
const details = computed(() => [
  { icon: '◒', label: 'Humidity', value: `${props.weather.humidity}%`, note: props.weather.humidity > 65 ? 'Quite humid' : 'Comfortable' },
  { icon: '↗', label: 'Wind', value: `${Math.round(props.unit === 'c' ? props.weather.windKph : props.weather.windMph)} ${props.unit === 'c' ? 'km/h' : 'mph'}`, note: `From ${props.weather.windDir}` },
  { icon: '◉', label: 'Pressure', value: `${props.weather.pressureMb}`, unit: 'hPa', note: 'Atmospheric pressure' },
  { icon: '⊙', label: 'Visibility', value: `${props.unit === 'c' ? props.weather.visibilityKm : props.weather.visibilityMi}`, unit: props.unit === 'c' ? 'km' : 'mi', note: 'Clear distance' },
  { icon: '☁', label: 'Cloud cover', value: `${props.weather.cloud}%`, note: props.weather.cloud > 50 ? 'Mostly cloudy' : 'Mostly clear' },
  { icon: '≈', label: 'Feels like', value: `${Math.round(props.unit === 'c' ? props.weather.feelsC : props.weather.feelsF)}°`, note: 'Apparent temperature' },
  { icon: '☼', label: 'UV index', value: `${props.weather.uv}`, note: props.weather.uv >= 6 ? 'High — use protection' : props.weather.uv >= 3 ? 'Moderate' : 'Low' },
  { icon: '↕', label: 'Sunrise & sunset', value: props.weather.sunrise, note: `Sunset ${props.weather.sunset}` },
])
</script>
<template>
  <section>
    <div class="section-heading"><div><p class="eyebrow">Right now</p><h2>Weather details</h2></div></div>
    <div class="detail-grid">
      <article v-for="item in details" :key="item.label" class="detail-card glass">
        <div class="detail-top"><span class="detail-icon">{{ item.icon }}</span><span>{{ item.label }}</span></div>
        <p class="detail-value">{{ item.value }} <small v-if="item.unit">{{ item.unit }}</small></p>
        <p class="detail-note">{{ item.note }}</p>
      </article>
    </div>
  </section>
</template>
