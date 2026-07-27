import axios from 'axios'
import type { WeatherData } from '@/types/weather'

const client = axios.create({ baseURL: 'https://api.weatherapi.com/v1', timeout: 12000 })

function mapWeather(data: any): WeatherData {
  const today = data.forecast.forecastday[0]
  const nowEpoch = data.location.localtime_epoch
  const allHours = data.forecast.forecastday.flatMap((day: any) => day.hour)
  const hourly = allHours.filter((h: any) => h.time_epoch >= nowEpoch - 1800).slice(0, 24).map((h: any) => ({
    time: h.time, tempC: h.temp_c, tempF: h.temp_f, icon: `https:${h.condition.icon}`,
    condition: h.condition.text, rain: h.chance_of_rain,
  }))
  return {
    city: data.location.name, country: data.location.country, localtime: data.location.localtime,
    updated: data.current.last_updated, tempC: data.current.temp_c, tempF: data.current.temp_f,
    feelsC: data.current.feelslike_c, feelsF: data.current.feelslike_f,
    condition: data.current.condition.text, icon: `https:${data.current.condition.icon}`,
    humidity: data.current.humidity, windKph: data.current.wind_kph, windMph: data.current.wind_mph,
    windDir: data.current.wind_dir, pressureMb: data.current.pressure_mb,
    visibilityKm: data.current.vis_km, visibilityMi: data.current.vis_miles,
    uv: data.current.uv, cloud: data.current.cloud, sunrise: today.astro.sunrise, sunset: today.astro.sunset,
    hourly,
    daily: data.forecast.forecastday.map((d: any) => ({
      date: d.date, maxC: d.day.maxtemp_c, minC: d.day.mintemp_c,
      maxF: d.day.maxtemp_f, minF: d.day.mintemp_f, icon: `https:${d.day.condition.icon}`,
      condition: d.day.condition.text, rain: d.day.daily_chance_of_rain,
    })),
  }
}

export async function getForecast(query: string): Promise<WeatherData> {
  const key = import.meta.env.VITE_WEATHER_API_KEY
  if (!key) throw new Error('API_KEY_MISSING')
  const { data } = await client.get('/forecast.json', { params: { key, q: query, days: 7, aqi: 'no', alerts: 'no' } })
  return mapWeather(data)
}
