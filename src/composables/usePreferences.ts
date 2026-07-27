import { ref, watch } from 'vue'
import type { Unit } from '@/types/weather'

const storedTheme = localStorage.getItem('atmos-theme')
const theme = ref<'light' | 'dark'>(storedTheme === 'light' ? 'light' : 'dark')
const unit = ref<Unit>(localStorage.getItem('atmos-unit') === 'f' ? 'f' : 'c')
const favorites = ref<string[]>(JSON.parse(localStorage.getItem('atmos-favorites') || '["Almaty","Tokyo","London"]'))
const recent = ref<string[]>(JSON.parse(localStorage.getItem('atmos-recent') || '[]'))

watch(theme, value => { localStorage.setItem('atmos-theme', value); document.documentElement.dataset.theme = value }, { immediate: true })
watch(unit, value => localStorage.setItem('atmos-unit', value))
watch(favorites, value => localStorage.setItem('atmos-favorites', JSON.stringify(value)), { deep: true })
watch(recent, value => localStorage.setItem('atmos-recent', JSON.stringify(value)), { deep: true })

export function usePreferences() {
  const toggleFavorite = (city: string) => {
    favorites.value = favorites.value.includes(city) ? favorites.value.filter(x => x !== city) : [city, ...favorites.value].slice(0, 6)
  }
  const addRecent = (city: string) => { recent.value = [city, ...recent.value.filter(x => x !== city)].slice(0, 5) }
  return { theme, unit, favorites, recent, toggleFavorite, addRecent }
}
