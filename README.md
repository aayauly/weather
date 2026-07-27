# Atmos Weather

A polished, responsive weather forecast application built with Vue 3, Vite, Tailwind CSS, the Composition API, Vue Router, and Axios.

## Features

- Live current conditions, 24-hour forecast, and 7-day forecast
- Search, geolocation, saved cities, recent searches, and °C/°F switching
- Weather-aware animated backgrounds, glass UI, dark/light themes, and loading skeletons
- Accessible keyboard navigation, semantic content, reduced-motion support, and friendly error states
- Local demo data when no API key is configured

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Get a free API key from [WeatherAPI.com](https://www.weatherapi.com/) and set `VITE_WEATHER_API_KEY`
4. Start development: `npm run dev`

Run `npm run typecheck` to verify TypeScript and `npm run build` to create the production build in `dist/`.

## Cloudflare Pages

Create a Pages project connected to this repository, then configure:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variable: `VITE_WEATHER_API_KEY`
- Recommended Node version: `22`

The included `public/_redirects` file enables Vue Router fallback routing on Cloudflare Pages. Because Vite embeds `VITE_*` values into the client bundle, the weather API key is visible to browsers. For a higher-security production setup, proxy requests through a Cloudflare Pages Function and keep the provider key server-side.
