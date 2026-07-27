export type Unit = 'c' | 'f'
export interface HourWeather { time: string; tempC: number; tempF: number; icon: string; condition: string; rain: number }
export interface DayWeather { date: string; maxC: number; minC: number; maxF: number; minF: number; icon: string; condition: string; rain: number }
export interface WeatherData {
  city: string; country: string; localtime: string; updated: string
  tempC: number; tempF: number; feelsC: number; feelsF: number
  condition: string; icon: string; humidity: number; windKph: number; windMph: number
  windDir: string; pressureMb: number; visibilityKm: number; visibilityMi: number
  uv: number; cloud: number; sunrise: string; sunset: string
  hourly: HourWeather[]; daily: DayWeather[]
}
