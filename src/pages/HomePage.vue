<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import WeatherHero from '@/components/WeatherHero.vue'
import HourlyForecast from '@/components/HourlyForecast.vue'
import DailyForecast from '@/components/DailyForecast.vue'
import DetailGrid from '@/components/DetailGrid.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useWeather } from '@/composables/useWeather'
import { usePreferences } from '@/composables/usePreferences'

const { data, loading, error, isDemo, weatherType, load } = useWeather()
const { theme, unit, favorites, recent, toggleFavorite, addRecent } = usePreferences()

const search = async (city: string) => { await load(city); if (!error.value && data.value) addRecent(data.value.city) }
const locate = () => {
  if (!navigator.geolocation) { error.value = 'Location is not supported by this browser.'; return }
  loading.value = true
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => search(`${coords.latitude},${coords.longitude}`),
    () => { loading.value = false; error.value = 'We couldn’t access your location. You can still search by city.' },
    { timeout: 10000 },
  )
}
onMounted(() => load(localStorage.getItem('atmos-last-city') || 'Almaty'))
</script>
<template>
  <div class="weather-app" :class="`weather-${weatherType}`">
    <div class="ambient"><i></i><i></i><i></i></div>
    <AppHeader :theme="theme" :unit="unit" @search="search" @locate="locate" @toggle-theme="theme = theme === 'dark' ? 'light' : 'dark'" @set-unit="unit = $event" />
    <main class="shell">
      <div v-if="isDemo" class="demo-banner"><span>Preview mode</span> Add <code>VITE_WEATHER_API_KEY</code> for live forecasts.</div>
      <div v-if="error" class="error-banner" role="alert"><span>!</span><p>{{ error }}</p><button @click="error = ''" aria-label="Dismiss error">×</button></div>
      <LoadingState v-if="loading" />
      <Transition name="weather-swap" mode="out-in">
        <div v-if="data && !loading" :key="data.city" class="weather-content">
          <WeatherHero :weather="data" :unit="unit" :favorite="favorites.includes(data.city)" @favorite="toggleFavorite(data.city)" />
          <div v-if="favorites.length || recent.length" class="quick-cities" aria-label="Saved and recent cities">
            <span>Your places</span>
            <button v-for="city in [...new Set([...favorites, ...recent])].slice(0, 6)" :key="city" :class="{ current: city === data.city }" @click="search(city)">{{ city }}</button>
          </div>
          <HourlyForecast :hours="data.hourly" :unit="unit" />
          <div class="lower-grid">
            <DailyForecast :days="data.daily" :unit="unit" />
            <DetailGrid :weather="data" :unit="unit" />
          </div>
          <footer><span>Updated {{ new Date(data.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span><span>Weather data by WeatherAPI.com</span></footer>
        </div>
      </Transition>
    </main>
  </div>
</template>
