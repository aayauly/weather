import { computed, ref } from 'vue'
import axios from 'axios'
import { getForecast } from '@/services/weatherApi'
import { demoWeather } from '@/services/demoWeather'
import type { WeatherData } from '@/types/weather'

export function useWeather() {
  const data = ref<WeatherData | null>(null)
  const loading = ref(true)
  const error = ref('')
  const isDemo = ref(!import.meta.env.VITE_WEATHER_API_KEY)
  const weatherType = computed(() => {
    const c = data.value?.condition.toLowerCase() || ''
    if (c.includes('thunder')) return 'storm'
    if (c.includes('snow') || c.includes('sleet')) return 'snow'
    if (c.includes('rain') || c.includes('drizzle')) return 'rain'
    if (c.includes('cloud') || c.includes('overcast') || c.includes('mist')) return 'cloudy'
    return 'sunny'
  })
  const load = async (query = 'Almaty') => {
    loading.value = true; error.value = ''
    try {
      data.value = isDemo.value ? demoWeather(query) : await getForecast(query)
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) error.value = `We couldn't find “${query}”. Check the spelling and try again.`
      else if (axios.isAxiosError(e) && !e.response) error.value = 'The weather service is unreachable. Please check your connection.'
      else error.value = 'Weather data is temporarily unavailable. Please try again.'
    } finally { loading.value = false }
  }
  return { data, loading, error, isDemo, weatherType, load }
}
