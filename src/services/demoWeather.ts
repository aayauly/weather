import type { WeatherData } from '@/types/weather'

const conditions: Record<string, { temp: number; condition: string }> = {
  london: { temp: 15, condition: 'Partly cloudy' }, tokyo: { temp: 28, condition: 'Sunny' },
  almaty: { temp: 24, condition: 'Clear' }, 'new york': { temp: 22, condition: 'Light rain' },
  paris: { temp: 20, condition: 'Partly cloudy' },
}
export function demoWeather(city = 'Almaty'): WeatherData {
  const pick = conditions[city.toLowerCase()] || { temp: 21, condition: 'Partly cloudy' }
  const now = new Date()
  const hours = Array.from({ length: 24 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3600000)
    const tempC = Math.round(pick.temp + Math.sin((i + 3) / 4) * 4)
    return { time: t.toISOString().slice(0, 13).replace('T', ' ') + ':00', tempC, tempF: Math.round(tempC * 1.8 + 32), icon: '', condition: i > 5 && i < 9 ? 'Cloudy' : pick.condition, rain: pick.condition.includes('rain') ? 65 : i === 8 ? 18 : 4 }
  })
  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() + i)
    const maxC = pick.temp + (i % 3) - 1
    return { date: d.toISOString().slice(0, 10), maxC, minC: maxC - 8, maxF: Math.round(maxC * 1.8 + 32), minF: Math.round((maxC - 8) * 1.8 + 32), icon: '', condition: i === 2 ? 'Light rain' : i === 4 ? 'Cloudy' : pick.condition, rain: i === 2 ? 62 : 8 + i * 3 }
  })
  return { city: city.replace(/\b\w/g, c => c.toUpperCase()), country: city.toLowerCase() === 'almaty' ? 'Kazakhstan' : 'Demo forecast', localtime: now.toISOString(), updated: now.toISOString(), tempC: pick.temp, tempF: Math.round(pick.temp * 1.8 + 32), feelsC: pick.temp + 1, feelsF: Math.round((pick.temp + 1) * 1.8 + 32), condition: pick.condition, icon: '', humidity: 48, windKph: 12.4, windMph: 7.7, windDir: 'NE', pressureMb: 1018, visibilityKm: 10, visibilityMi: 6.2, uv: 5, cloud: pick.condition.includes('cloud') ? 62 : 18, sunrise: '05:32 AM', sunset: '08:21 PM', hourly: hours, daily }
}
